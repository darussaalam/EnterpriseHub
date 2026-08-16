/**
 * EA SPORTS FC 27 x FOOTBALL MANAGER 27 - Master Game Application Engine
 */

import { GAME_CONFIG, FORMATIONS, TEAMS_DATABASE } from './config.js';
import { Engine3D } from './engine3d.js';
import { Ball } from './physics.js';
import { Player } from './player.js';
import { ControlsManager } from './controls.js';
import { AIAssistant } from './ai.js';
import { Match } from './match.js';
import { soundEngine } from './audio.js';
import { UIManager } from './ui.js';
import { FMUIManager } from './ui_fm.js';
import { fmEngine } from './fm_manager.js';

export class GameApp {
    constructor() {
        this.container = document.getElementById('game-container');
        this.engine3D = new Engine3D(this.container);
        this.controls = new ControlsManager();
        this.ai = new AIAssistant();
        this.ui = new UIManager();
        this.fmUI = new FMUIManager(this);

        this.ball = new Ball(this.engine3D.scene);
        this.teamHome = [];
        this.teamAway = [];
        this.humanPlayer = null;
        this.activePlayerIndex = 0;
        this.match = null;

        this.isMatchRunning = false;
        this.lastTime = 0;

        this.init();
    }

    init() {
        this.bindUIActions();
        this.bindControlActions();

        // Start render loop
        requestAnimationFrame((t) => this.gameLoop(t));
    }

    bindUIActions() {
        this.ui.onStartMatch = (homeTeam, awayTeam, formation, difficulty) => {
            this.startNewMatch(homeTeam, awayTeam, formation, difficulty);
        };

        this.ui.onRestartMatch = () => {
            if (this.match) {
                this.startNewMatch(
                    this.match.homeTeamData,
                    this.match.awayTeamData,
                    '4-3-3',
                    this.ai.difficulty
                );
            }
        };

        this.ui.onResumeMatch = () => {
            if (this.match) this.match.isPaused = false;
        };

        this.ui.onQuitToMenu = () => {
            this.isMatchRunning = false;
            this.clearTeamEntities();
            this.engine3D.setBroadcastCamera();
        };
    }

    startNewMatch(homeData, awayData, formationKey = '4-3-3', difficulty = 'MEDIUM') {
        this.clearTeamEntities();

        this.ai.setDifficulty(difficulty);
        this.match = new Match(homeData, awayData);

        const form = FORMATIONS[formationKey] || FORMATIONS['4-3-3'];

        // Build Home Team (11 players)
        this.teamHome = homeData.players.slice(0, 11).map((pData, idx) => {
            const pos = form.positions[idx] || { x: -20, z: 0 };
            return new Player(this.engine3D.scene, homeData, pData, true, pos);
        });

        // Build Away Team (11 players - mirrored positions)
        this.teamAway = awayData.players.slice(0, 11).map((pData, idx) => {
            const pos = form.positions[idx] || { x: -20, z: 0 };
            const mirroredPos = { x: -pos.x, z: -pos.z };
            return new Player(this.engine3D.scene, awayData, pData, false, mirroredPos);
        });

        // Assign User Controller to Center Forward / Striker
        this.activePlayerIndex = Math.min(10, this.teamHome.length - 1);
        this.humanPlayer = this.teamHome[this.activePlayerIndex] || this.teamHome[0];
        this.updateActivePlayer();

        // Position Ball at Center Spot and give possession
        this.ball.reset(0, 0);
        this.ball.owner = this.humanPlayer;

        this.isMatchRunning = true;
        this.match.start();
    }

    clearTeamEntities() {
        this.teamHome.forEach(p => this.engine3D.scene.remove(p.group));
        this.teamAway.forEach(p => this.engine3D.scene.remove(p.group));
        this.teamHome = [];
        this.teamAway = [];
        this.humanPlayer = null;
    }

    updateActivePlayer() {
        this.teamHome.forEach(p => p.setActive(false));
        if (this.humanPlayer) {
            this.humanPlayer.setActive(true);
        }
    }

    switchActivePlayerToClosest() {
        if (!this.teamHome.length) return;
        let closest = null;
        let minDist = 999;

        this.teamHome.forEach((p, idx) => {
            if (idx === 0) return; // don't auto switch to goalkeeper
            const d = p.position.distanceTo(this.ball.position);
            if (d < minDist) {
                minDist = d;
                closest = p;
                this.activePlayerIndex = idx;
            }
        });

        if (closest) {
            this.humanPlayer = closest;
            this.updateActivePlayer();
        }
    }

    canPlayerKick() {
        if (!this.humanPlayer) return false;
        if (this.ball.owner === this.humanPlayer) return true;
        const dist = this.humanPlayer.position.distanceTo(this.ball.position);
        return dist < 2.5 && this.ball.position.y < 2.0;
    }

    bindControlActions() {
        // 1. Ground Pass
        this.controls.callbacks.onPass = () => {
            if (!this.canPlayerKick()) return;

            const forward = new THREE.Vector3(Math.sin(this.humanPlayer.rotation), 0, Math.cos(this.humanPlayer.rotation));
            let bestTarget = null;
            let highestDot = -1;

            this.teamHome.forEach(teammate => {
                if (teammate === this.humanPlayer) return;
                const toMate = new THREE.Vector3().subVectors(teammate.position, this.humanPlayer.position);
                const dist = toMate.length();
                if (dist > 3 && dist < 36) {
                    const dot = forward.dot(toMate.normalize());
                    if (dot > highestDot) {
                        highestDot = dot;
                        bestTarget = teammate;
                    }
                }
            });

            const passDir = bestTarget ? 
                new THREE.Vector3().subVectors(bestTarget.position, this.humanPlayer.position).normalize() :
                forward;

            const power = bestTarget ? 15 + this.humanPlayer.position.distanceTo(bestTarget.position) * 0.45 : 18;

            this.humanPlayer.triggerKick();
            this.ball.kick(passDir, power, 0.05, 0, this.humanPlayer);
            if (this.match) this.match.stats.home.passes++;

            if (bestTarget) {
                setTimeout(() => {
                    this.humanPlayer = bestTarget;
                    this.activePlayerIndex = this.teamHome.indexOf(bestTarget);
                    this.updateActivePlayer();
                }, 200);
            }
        };

        // 2. Through Ball
        this.controls.callbacks.onThroughBall = () => {
            if (!this.canPlayerKick()) return;

            const forward = new THREE.Vector3(Math.sin(this.humanPlayer.rotation), 0, Math.cos(this.humanPlayer.rotation));
            this.humanPlayer.triggerKick();
            this.ball.kick(forward, 24, 0.08, 0, this.humanPlayer);
            if (this.match) this.match.stats.home.passes++;

            setTimeout(() => this.switchActivePlayerToClosest(), 250);
        };

        // 3. Shooting (Ultra-Responsive with Aim and Curve)
        this.controls.callbacks.onShoot = (powerRatio) => {
            if (!this.canPlayerKick()) return;

            const goalPos = new THREE.Vector3(GAME_CONFIG.PITCH_LENGTH / 2, 0, 0);
            const toGoal = new THREE.Vector3().subVectors(goalPos, this.humanPlayer.position).normalize();
            
            // Aim with joystick / movement direction
            if (this.controls.moveVector.z !== 0) {
                toGoal.z += this.controls.moveVector.z * 0.35;
                toGoal.normalize();
            }

            const clampedRatio = Math.max(0.3, Math.min(1.0, powerRatio));
            const shootPower = 20 + clampedRatio * 22; // 20m/s to 42m/s
            const heightRatio = 0.12 + clampedRatio * 0.28;
            const spin = this.controls.moveVector.z * 3.5;

            this.humanPlayer.triggerKick();
            this.ball.kick(toGoal, shootPower, heightRatio, spin, this.humanPlayer);
            if (this.match) this.match.stats.home.shots++;
        };

        // 4. Lob Pass / Cross
        this.controls.callbacks.onLobPass = (powerRatio) => {
            if (!this.canPlayerKick()) return;

            const forward = new THREE.Vector3(Math.sin(this.humanPlayer.rotation), 0, Math.cos(this.humanPlayer.rotation));
            const clampedRatio = Math.max(0.3, Math.min(1.0, powerRatio));
            const lobPower = 18 + clampedRatio * 18;
            const heightRatio = 0.52;

            this.humanPlayer.triggerKick();
            this.ball.kick(forward, lobPower, heightRatio, 0, this.humanPlayer);
            if (this.match) this.match.stats.home.passes++;

            setTimeout(() => this.switchActivePlayerToClosest(), 350);
        };

        // 5. Slide Tackle
        this.controls.callbacks.onTackle = () => {
            if (!this.humanPlayer) return;
            this.humanPlayer.triggerSlideTackle();
        };

        // 6. Switch active user player
        this.controls.callbacks.onSwitchPlayer = () => {
            this.switchActivePlayerToClosest();
        };

        // 7. Skill Moves (Roulette 360, Stepover)
        this.controls.callbacks.onSkillMove = () => {
            if (!this.canPlayerKick()) return;
            this.humanPlayer.triggerSkill('roulette');
        };
    }

    gameLoop(timestamp) {
        requestAnimationFrame((t) => this.gameLoop(t));

        if (!this.lastTime) this.lastTime = timestamp;
        const dt = Math.min((timestamp - this.lastTime) / 1000, 0.05);
        this.lastTime = timestamp;

        this.controls.update(dt);

        if (this.isMatchRunning && this.match) {
            if (!this.match.isPaused) {
                // Update match clock & check goal bounds
                this.match.update(dt, this.teamHome, this.teamAway, this.ball);

                // Update Controlled Human Player
                if (this.humanPlayer) {
                    this.humanPlayer.updateControlled(this.controls, dt, this.ball);
                }

                // Update AI Teammates
                this.ai.updateTeammates(this.teamHome, this.humanPlayer, this.ball, dt);

                // Update Opponent AI
                this.ai.updateOpponents(this.teamAway, this.teamHome, this.ball, dt);

                // Update Ball Physics
                this.ball.update(dt);

                // Check auto-switch when user loses ball
                if (!this.ball.owner || this.ball.owner.isHome === false) {
                    // Periodically keep closest player active
                    if (Math.random() < 0.05) {
                        this.switchActivePlayerToClosest();
                    }
                }
            }

            // Update 3D Camera Focus
            if (this.match.state === 'REPLAY') {
                this.engine3D.updateReplayCamera(this.ball.position, this.match.replayTargetPlayer?.position);
            } else {
                this.engine3D.updateGameplayCamera(this.ball.position, this.humanPlayer?.position);
            }

            // Update UI HUD Overlay & 2D Radar
            this.ui.updateHUD(this.match, this.humanPlayer, this.controls.shootPower);
            this.ui.renderRadar(this.teamHome, this.teamAway, this.ball);
        }

        // Render 3D Scene
        this.engine3D.render();
    }
}

// Instantiate and start app on load
window.addEventListener('DOMContentLoaded', () => {
    window.fcApp = new GameApp();
});
