/**
 * EA FC 27 Web Edition - Match Rules, States, Stats, Replay & Physics Interaction
 */

import { GAME_CONFIG } from './config.js';
import { soundEngine } from './audio.js';

export class Match {
    constructor(homeTeamData, awayTeamData) {
        this.homeTeamData = homeTeamData;
        this.awayTeamData = awayTeamData;

        this.state = 'KICKOFF'; // KICKOFF, PLAYING, GOAL, REPLAY, HALF_TIME, FULL_TIME
        this.matchTime = 0; // Simulated seconds (0 to 5400 for 90 mins)
        this.currentHalf = 1;
        this.halfDuration = GAME_CONFIG.DEFAULT_HALF_DURATION; // real seconds per half
        this.timerSpeed = (45 * 60) / this.halfDuration; // speed multiplier

        this.score = { home: 0, away: 0 };
        this.stats = {
            home: { shots: 0, shotsOnTarget: 0, passes: 0, tackles: 0, corners: 0, possessionTime: 0 },
            away: { shots: 0, shotsOnTarget: 0, passes: 0, tackles: 0, corners: 0, possessionTime: 0 }
        };

        // Instant Replay Buffer (Stores last 200 frames of ball + players positions)
        this.replayBuffer = [];
        this.isReplayPlaying = false;
        this.replayFrameIndex = 0;
        this.replayAngle = 0;

        this.activePlayerIndex = 9; // Striker initially
        this.goalScorer = null;
        this.goalTimer = 0;
    }

    start() {
        this.state = 'PLAYING';
        soundEngine.playWhistle(false);
    }

    update(teamHome, teamAway, ball, dt) {
        if (this.state === 'PLAYING') {
            // Update simulated match timer
            this.matchTime += dt * this.timerSpeed;
            const currentSimMinutes = this.matchTime / 60;

            // Half-time check (45 mins)
            if (this.currentHalf === 1 && currentSimMinutes >= 45) {
                this.state = 'HALF_TIME';
                soundEngine.playWhistle(true);
                return;
            }

            // Full-time check (90 mins)
            if (this.currentHalf === 2 && currentSimMinutes >= 90) {
                this.state = 'FULL_TIME';
                soundEngine.playWhistle(true);
                return;
            }

            // Record Replay Frame
            this.recordFrame(teamHome, teamAway, ball);

            // Update possession stats
            if (ball.owner) {
                if (ball.owner.isHome) this.stats.home.possessionTime += dt;
                else this.stats.away.possessionTime += dt;
            }

            // Check Ball Tackle & Pickup Collisions
            this.handleBallInteractions(teamHome, teamAway, ball);

            // Check Goal scored
            const goalSide = ball.checkGoal();
            if (goalSide) {
                this.handleGoal(goalSide, teamHome, teamAway, ball);
            }

            // Check Out of bounds
            this.checkPitchBounds(ball);

        } else if (this.state === 'GOAL') {
            this.goalTimer -= dt;
            if (this.goalTimer <= 0) {
                this.startInstantReplay();
            }
        } else if (this.state === 'REPLAY') {
            this.updateInstantReplay(teamHome, teamAway, ball, dt);
        }
    }

    handleBallInteractions(teamHome, teamAway, ball) {
        const allPlayers = [...teamHome, ...teamAway];

        // 1. If ball is free, check if any player can control it
        allPlayers.forEach(player => {
            const dist = player.position.distanceTo(ball.position);

            if (ball.isFree && dist < 1.1 && ball.position.y < 1.5) {
                ball.owner = player;
                ball.isFree = false;
            }

            // 2. Tackling logic against ball carrier
            if (player.isTackling && ball.owner && ball.owner !== player) {
                const carrierDist = player.position.distanceTo(ball.owner.position);
                if (carrierDist < 1.6) {
                    // Tackle dislodges ball
                    if (player.isHome) this.stats.home.tackles++;
                    else this.stats.away.tackles++;

                    const tackleDir = new THREE.Vector3(
                        Math.sin(player.rotation),
                        0.1,
                        Math.cos(player.rotation)
                    ).normalize();
                    ball.kick(tackleDir, 10, 0.15, 0, player);
                }
            }
        });
    }

    handleGoal(side, teamHome, teamAway, ball) {
        this.state = 'GOAL';
        this.goalTimer = 3.5;

        soundEngine.playGoalCheer();

        if (side === 'home') {
            this.score.home++;
            this.stats.home.shots++;
            this.stats.home.shotsOnTarget++;
            this.goalScorer = ball.lastKicker ? `${ball.lastKicker.name} (${this.homeTeamData.shortName})` : this.homeTeamData.name;
        } else {
            this.score.away++;
            this.stats.away.shots++;
            this.stats.away.shotsOnTarget++;
            this.goalScorer = ball.lastKicker ? `${ball.lastKicker.name} (${this.awayTeamData.shortName})` : this.awayTeamData.name;
        }

        // Trigger goal celebration for scorer team
        const scoringTeam = side === 'home' ? teamHome : teamAway;
        scoringTeam.forEach(p => p.triggerCelebration());
    }

    startInstantReplay() {
        this.state = 'REPLAY';
        this.isReplayPlaying = true;
        this.replayFrameIndex = 0;
        this.replayAngle = 0;
    }

    updateInstantReplay(teamHome, teamAway, ball, dt) {
        if (!this.replayBuffer.length) {
            this.endReplay(ball);
            return;
        }

        this.replayAngle += dt * 1.5;
        this.replayFrameIndex += 1;

        if (this.replayFrameIndex >= this.replayBuffer.length) {
            // Replay finished, reset for kickoff
            this.endReplay(ball);
            return;
        }

        const frame = this.replayBuffer[this.replayFrameIndex];
        ball.position.copy(frame.ball);

        frame.home.forEach((pos, i) => {
            if (teamHome[i]) teamHome[i].position.copy(pos);
        });

        frame.away.forEach((pos, i) => {
            if (teamAway[i]) teamAway[i].position.copy(pos);
        });
    }

    endReplay(ball) {
        this.state = 'PLAYING';
        this.isReplayPlaying = false;
        this.replayBuffer = [];
        ball.reset(0, 0);
        soundEngine.playWhistle(false);
    }

    recordFrame(teamHome, teamAway, ball) {
        if (this.replayBuffer.length > 200) {
            this.replayBuffer.shift();
        }

        this.replayBuffer.push({
            ball: ball.position.clone(),
            home: teamHome.map(p => p.position.clone()),
            away: teamAway.map(p => p.position.clone())
        });
    }

    checkPitchBounds(ball) {
        const L = GAME_CONFIG.PITCH_LENGTH / 2;
        const W = GAME_CONFIG.PITCH_WIDTH / 2;

        // Sideline touchline out of bounds -> Throw in
        if (Math.abs(ball.position.z) > W + 0.8) {
            const throwZ = ball.position.z > 0 ? W - 0.5 : -(W - 0.5);
            ball.reset(ball.position.x, throwZ);
        }

        // Goal line out of bounds without goal -> Corner or Goal kick
        if (Math.abs(ball.position.x) > L + 0.8 && Math.abs(ball.position.z) >= GAME_CONFIG.GOAL_WIDTH / 2) {
            if (ball.position.x > 0) {
                // Right side goal kick / corner
                ball.reset(L - 6, 0);
            } else {
                // Left side goal kick / corner
                ball.reset(-L + 6, 0);
            }
        }
    }

    getFormattedTime() {
        const totalSimMinutes = Math.floor(this.matchTime / 60);
        const simSeconds = Math.floor(this.matchTime % 60);
        const mm = String(totalSimMinutes).padStart(2, '0');
        const ss = String(simSeconds).padStart(2, '0');
        return `${mm}:${ss}`;
    }

    getPossessionPercentage() {
        const total = this.stats.home.possessionTime + this.stats.away.possessionTime;
        if (total === 0) return { home: 50, away: 50 };
        const homePct = Math.round((this.stats.home.possessionTime / total) * 100);
        return { home: homePct, away: 100 - homePct };
    }
}
