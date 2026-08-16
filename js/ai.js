/**
 * EA FC 27 Web Edition - Artificial Intelligence (AI) System
 * Teammate Supporting Runs, Opponent Defense & Attack, Goalkeeper Positioning & Saves
 */

import { GAME_CONFIG } from './config.js';

export class AIEngine {
    constructor(difficulty = 'MEDIUM') {
        this.config = GAME_CONFIG.DIFFICULTY[difficulty] || GAME_CONFIG.DIFFICULTY.MEDIUM;
        this.decisionTimer = 0;
        this.gkState = {
            home: { state: 'idle', diveDelay: 0 },
            away: { state: 'idle', diveDelay: 0 }
        };
    }

    setDifficulty(diffKey) {
        if (GAME_CONFIG.DIFFICULTY[diffKey]) {
            this.config = GAME_CONFIG.DIFFICULTY[diffKey];
        }
    }

    update(teamHome, teamAway, ball, humanPlayer, dt) {
        this.decisionTimer += dt;

        // 1. Teammates of the active player (Support Runs & Formation shape)
        this.updateTeammateAI(teamHome, ball, humanPlayer, dt);

        // 2. Opponent AI (Full Team Strategy: Attack, Passing, Defending, Tackling)
        this.updateOpponentAI(teamAway, teamHome, ball, dt);

        // 3. Goalkeeper AI for both sides
        this.updateGoalkeeperAI(teamHome[0], ball, 'home', dt);
        this.updateGoalkeeperAI(teamAway[0], ball, 'away', dt);
    }

    updateTeammateAI(team, ball, activePlayer, dt) {
        const teamHasBall = ball.owner && ball.owner.isHome;
        const ballPos = ball.position;

        team.forEach((player, idx) => {
            if (idx === 0 || player === activePlayer) return; // Skip GK and active user player

            const homeBase = player.homePosition;
            let targetX = homeBase.x;
            let targetZ = homeBase.z;

            if (teamHasBall) {
                // Attacking support: push forward, create passing angles
                const shiftX = Math.min(25, (ballPos.x + 20) * 0.4);
                targetX = homeBase.x + shiftX;

                // Spread wide or cut in based on role
                if (player.role.includes('W') || player.role.includes('M')) {
                    targetZ = homeBase.z * 1.1;
                } else if (player.role.includes('ST')) {
                    targetX = Math.max(15, ballPos.x + 10);
                    targetZ = homeBase.z * 0.6;
                }
            } else {
                // Defensive recovery: pull back and compact formation
                const shiftX = Math.max(-20, (ballPos.x - 10) * 0.4);
                targetX = homeBase.x + shiftX;
                targetZ = homeBase.z * 0.85;

                // If opponent ball carrier is very close, press him
                const distToBall = player.position.distanceTo(ballPos);
                if (distToBall < 6.0 && (!ball.owner || !ball.owner.isHome)) {
                    targetX = ballPos.x;
                    targetZ = ballPos.z;
                }
            }

            // Move teammate towards target position
            const dirX = targetX - player.position.x;
            const dirZ = targetZ - player.position.z;
            const dist = Math.hypot(dirX, dirZ);

            if (dist > 1.2) {
                player.move(dirX / dist, dirZ / dist, dist > 8, dt);
            } else {
                player.move(0, 0, false, dt);
            }
        });
    }

    updateOpponentAI(aiTeam, userTeam, ball, dt) {
        const aiHasBall = ball.owner && !ball.owner.isHome;
        const ballPos = ball.position;

        // Find AI player closest to ball
        let closestAI = null;
        let minDist = 999;

        aiTeam.forEach((player, idx) => {
            if (idx === 0) return; // Skip GK
            const d = player.position.distanceTo(ballPos);
            if (d < minDist) {
                minDist = d;
                closestAI = player;
            }
        });

        aiTeam.forEach((player, idx) => {
            if (idx === 0) return; // GK handled separately

            if (player === ball.owner) {
                // Ball carrier AI logic: Attack, Dribble, Pass, or Shoot
                this.handleAIBallCarrier(player, aiTeam, userTeam, ball, dt);
            } else if (aiHasBall) {
                // Supporting AI runs forward
                const homeBase = player.homePosition;
                let targetX = -homeBase.x - (ballPos.x - 10) * 0.4;
                let targetZ = homeBase.z;

                if (player.role.includes('ST') || player.role.includes('W')) {
                    targetX = Math.min(-15, ballPos.x - 12);
                }

                const dirX = targetX - player.position.x;
                const dirZ = targetZ - player.position.z;
                const dist = Math.hypot(dirX, dirZ);
                if (dist > 1.5) {
                    player.move(dirX / dist, dirZ / dist, dist > 10, dt);
                } else {
                    player.move(0, 0, false, dt);
                }
            } else {
                // Defending logic: Closest presses the ball, others hold shape
                if (player === closestAI && minDist < 28) {
                    // Direct Pressing
                    const dirX = ballPos.x - player.position.x;
                    const dirZ = ballPos.z - player.position.z;
                    const dist = Math.hypot(dirX, dirZ);

                    player.move(dirX / dist, dirZ / dist, true, dt);

                    // Attempt tackle if close to user dribbler
                    if (dist < 1.4 && ball.owner && ball.owner.isHome) {
                        if (Math.random() < 0.08) {
                            player.triggerSlideTackle();
                            // Successful tackle chance
                            if (Math.random() < this.config.aiAccuracy) {
                                ball.kick(new THREE.Vector3(dirX, 0, dirZ), 8, 0.1, 0, player);
                            }
                        }
                    }
                } else {
                    // Return towards defensive zone
                    const homeBase = player.homePosition;
                    const targetX = -homeBase.x + (ballPos.x + 10) * 0.35;
                    const targetZ = homeBase.z * 0.85;

                    const dirX = targetX - player.position.x;
                    const dirZ = targetZ - player.position.z;
                    const dist = Math.hypot(dirX, dirZ);
                    if (dist > 1.5) {
                        player.move(dirX / dist, dirZ / dist, dist > 12, dt);
                    } else {
                        player.move(0, 0, false, dt);
                    }
                }
            }
        });
    }

    handleAIBallCarrier(carrier, aiTeam, userTeam, ball, dt) {
        const goalPos = new THREE.Vector3(-GAME_CONFIG.PITCH_LENGTH / 2, 0, 0);
        const distToGoal = carrier.position.distanceTo(goalPos);

        // 1. Shooting opportunity check (Inside 26m)
        if (distToGoal < 26 && carrier.position.x < -18) {
            // Check clear line of sight to goal
            const aimZ = (Math.random() - 0.5) * (GAME_CONFIG.GOAL_WIDTH * 0.7);
            const shootDir = new THREE.Vector3(-GAME_CONFIG.PITCH_LENGTH / 2 - carrier.position.x, 0, aimZ - carrier.position.z).normalize();
            const power = 18 + Math.random() * 8;
            carrier.triggerKick();
            ball.kick(shootDir, power, 0.28, (Math.random() - 0.5) * 2, carrier);
            return;
        }

        // 2. Passing opportunity check
        if (Math.random() < 0.03 * this.config.aiAccuracy) {
            // Find open forward teammate
            let bestTeammate = null;
            let bestScore = -999;

            aiTeam.forEach((mate, idx) => {
                if (idx === 0 || mate === carrier) return;
                // Prefer players closer to opponent goal (more negative X)
                const forwardDist = carrier.position.x - mate.position.x;
                const distToCarrier = carrier.position.distanceTo(mate.position);

                if (distToCarrier > 5 && distToCarrier < 25 && forwardDist > -2) {
                    const score = forwardDist * 2 - distToCarrier * 0.3;
                    if (score > bestScore) {
                        bestScore = score;
                        bestTeammate = mate;
                    }
                }
            });

            if (bestTeammate) {
                const passDir = new THREE.Vector3().subVectors(bestTeammate.position, carrier.position).normalize();
                const power = 12 + carrier.position.distanceTo(bestTeammate.position) * 0.65;
                carrier.triggerKick();
                ball.kick(passDir, power, 0.05, 0, carrier);
                return;
            }
        }

        // 3. Dribble towards opponent goal / open space
        const targetX = carrier.position.x - 8;
        let targetZ = carrier.position.z;

        // Avoid nearest defender
        userTeam.forEach(defender => {
            const dist = carrier.position.distanceTo(defender.position);
            if (dist < 4.0) {
                targetZ += (carrier.position.z > defender.position.z ? 4 : -4);
            }
        });

        const dirX = targetX - carrier.position.x;
        const dirZ = targetZ - carrier.position.z;
        const dist = Math.hypot(dirX, dirZ);

        carrier.move(dirX / dist, dirZ / dist, distToGoal < 35, dt);
    }

    updateGoalkeeperAI(gk, ball, side, dt) {
        const isHomeGK = side === 'home';
        const goalLineX = isHomeGK ? -GAME_CONFIG.PITCH_LENGTH / 2 + 1.2 : GAME_CONFIG.PITCH_LENGTH / 2 - 1.2;
        const GW = GAME_CONFIG.GOAL_WIDTH;
        const ballPos = ball.position;

        // 1. Follow ball along goal line lateral axis (Z)
        const targetZ = Math.max(-GW / 2 + 0.6, Math.min(GW / 2 - 0.6, ballPos.z * 0.45));
        let targetX = goalLineX;

        // 2. Sweeper keeper rush out if ball is free in 6-yard box
        const distToBall = gk.position.distanceTo(ballPos);
        const insideBox = isHomeGK ? ballPos.x < -36 : ballPos.x > 36;

        if (distToBall < 9.0 && ball.isFree && insideBox) {
            targetX = ballPos.x;
        }

        // 3. Goalkeeper Diving Reaction to incoming fast shots
        const speedTowardsGoal = isHomeGK ? -ball.velocity.x : ball.velocity.x;
        const ballHeadingToGoal = speedTowardsGoal > 6.0 && insideBox;

        if (ballHeadingToGoal && !gk.isDiving) {
            const diveDir = ballPos.z > gk.position.z ? 1 : -1;
            gk.triggerDive(diveDir);

            // Chance of saving shot based on GK def stat & reaction
            if (Math.random() < (gk.stats.def / 100) * 0.9) {
                // Deflect ball or catch
                setTimeout(() => {
                    const deflectDir = new THREE.Vector3(isHomeGK ? 1 : -1, 0.4, (Math.random() - 0.5) * 2).normalize();
                    ball.kick(deflectDir, 7, 0.4, 0, gk);
                }, 180);
            }
        }

        // Move GK
        const dirX = targetX - gk.position.x;
        const dirZ = targetZ - gk.position.z;
        const dist = Math.hypot(dirX, dirZ);

        if (dist > 0.3 && !gk.isDiving) {
            gk.move(dirX / dist, dirZ / dist, dist > 3, dt);
        } else {
            gk.move(0, 0, false, dt);
        }
    }
}
