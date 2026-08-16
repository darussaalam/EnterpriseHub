/**
 * EA FC 27 x FM 27 Web Edition - Main Game Application Bootstrap & Loop
 */

import { GAME_CONFIG, FORMATIONS } from './config.js';
import { GLOBAL_CLUBS } from './database.js';
import { Engine3D } from './engine3d.js';
import { Ball } from './physics.js';
import { Player } from './player.js';
import { AIEngine } from './ai.js';
import { ControlsManager } from './controls.js';
import { Match } from './match.js';
import { UIManager } from './ui.js';
import { FMUIManager } from './ui_fm.js';
import { fmEngine } from './fm_manager.js';
import { soundEngine } from './audio.js';

class GameApp {
    constructor() {
        this.container = document.getElementById('game-container');
        this.engine3D = null;
        this.ball = null;
        this.teamHome = [];
        this.teamAway = [];
        this.activePlayerIndex = 9; // Default: user controls primary attacker
        this.humanPlayer = null;

        this.controls = null;
        this.ai = null;
        this.match = null;
        this.ui = null;
        this.fmUI = null;

        this.lastTime = 0;
        this.isMatchRunning = false;

        this.init();
    }

    init() {
        // 1. Initialize 3D Scene
        this.engine3D = new Engine3D(this.container);

        // 2. Initialize Ball
        this.ball = new Ball(this.engine3D.scene);

        // 3. Initialize AI & Controls & UI
        this.ai = new AIEngine('MEDIUM');
        this.controls = new ControlsManager();
        this.ui = new UIManager();
        this.fmUI = new FMUIManager(this);

        // 4. Bind Control Callbacks
        this.bindControlActions();

        // 5. Bind UI Lifecycle Events
        this.ui.onStartMatch = (homeTeam, awayTeam, formation, difficulty) => {
            this.startNewMatch(homeTeam, awayTeam, formation, difficulty);
        };

        this.ui.onRestartMatch = () => {
            if (this.match) {
                this.startNewMatch(this.match.homeTeamData, this.match.awayTeamData, this.ui.selectedFormation, this.ui.selectedDifficulty);
            }
        };

        this.ui.onResumeMatch = () => {
            if (this.match && this.match.state !== 'FULL_TIME') {
                this.match.state = 'PLAYING';
            }
        };

        this.ui.onQuitToMenu = () => {
            this.isMatchRunning = false;
            this.clearTeamEntities();
            this.ball.reset(0, 0);
            if (fmEngine.userClub) {
                this.fmUI.openCareerDashboard();
            }
        };

        // 6. Start Master Animation Loop
        requestAnimationFrame((t) => this.gameLoop(t));
    }

    startNewMatch(homeData, awayData, formationKey, diffKey) {
        this.clearTeamEntities();

        this.ai.setDifficulty(diffKey);
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

        // Assign User Controller to Striker
        this.activePlayerIndex = Math.min(9, this.teamHome.length - 1);
        this.humanPlayer = this.teamHome[this.activePlayerIndex] || this.teamHome[0];
        this.updateActivePlayer();

        // Position Ball at Center Spot
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
            if (idx === 0) return; // don't switch to GK automatically
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

    bindControlActions() {
        // Ground Pass
        this.controls.callbacks.onPass = () => {
            if (!this.humanPlayer || this.ball.owner !== this.humanPlayer) return;

            // Find best teammate in facing direction
            const forward = new THREE.Vector3(Math.sin(this.humanPlayer.rotation), 0, Math.cos(this.humanPlayer.rotation));
            let bestTarget = null;
            let highestDot = -1;

            this.teamHome.forEach(teammate => {
                if (teammate === this.humanPlayer) return;
                const toMate = new THREE.Vector3().subVectors(teammate.position, this.humanPlayer.position);
                const dist = toMate.length();
                if (dist > 3 && dist < 32) {
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

            const power = bestTarget ? 14 + this.humanPlayer.position.distanceTo(bestTarget.position) * 0.45 : 18;

            this.humanPlayer.triggerKick();
            this.ball.kick(passDir, power, 0.05, 0, this.humanPlayer);
            if (this.match) this.match.stats.home.passes++;

            // Auto-switch to pass receiver
            if (bestTarget) {
                setTimeout(() => {
                    this.humanPlayer = bestTarget;
                    this.activePlayerIndex = this.teamHome.indexOf(bestTarget);
                    this.updateActivePlayer();
                }, 220);
            }
        };

        // Through Ball
        this.controls.callbacks.onThroughBall = () => {
            if (!this.humanPlayer || this.ball.owner !== this.humanPlayer) return;

            const forward = new THREE.Vector3(Math.sin(this.humanPlayer.rotation), 0, Math.cos(this.humanPlayer.rotation));
            const throughTarget = new THREE.Vector3(
                this.humanPlayer.position.x + forward.x * 20,
                0,
                this.humanPlayer.position.z + forward.z * 20
            );

            const passDir = forward;
            this.humanPlayer.triggerKick();
            this.ball.kick(passDir, 22, 0.08, 0, this.humanPlayer);
            if (this.match) this.match.stats.home.passes++;

            // Switch to player running onto through ball
            setTimeout(() => this.switchActivePlayerToClosest(), 300);
        };

        // Shooting with Power Meter & Precision Aim
        this.controls.callbacks.onShoot = (powerRatio) => {
            if (!this.humanPlayer || this.ball.owner !== this.humanPlayer) return;

            const goalPos = new THREE.Vector3(GAME_CONFIG.PITCH_LENGTH / 2, 0, 0);
            const toGoal = new THREE.Vector3().subVectors(goalPos, this.humanPlayer.position).normalize();
            
            // Aim slightly towards corner posts based on lateral movement
            toGoal.z += this.controls.moveVector.z * 0.25;
            toGoal.normalize();

            const shootPower = 18 + powerRatio * 22; // 18m/s to 40m/s
            const heightRatio = 0.15 + powerRatio * 0.28;
            const spin = this.controls.moveVector.z * 3.5;

            this.humanPlayer.triggerKick();
            this.ball.kick(toGoal, shootPower, heightRatio, spin, this.humanPlayer);
            if (this.match) this.match.stats.home.shots++;
        };

        // Lob Pass / Cross
        this.controls.callbacks.onLobPass = (powerRatio) => {
            if (!this.humanPlayer || this.ball.owner !== this.humanPlayer) return;

            const forward = new THREE.Vector3(Math.sin(this.humanPlayer.rotation), 0, Math.cos(this.humanPlayer.rotation));
            const lobPower = 16 + powerRatio * 18;
            const heightRatio = 0.55;

            this.humanPlayer.triggerKick();
            this.ball.kick(forward, lobPower, heightRatio, 0, this.humanPlayer);
            if (this.match) this.match.stats.home.passes++;

            setTimeout(() => this.switchActivePlayerToClosest(), 400);
        };

        // Slide Tackle
        this.controls.callbacks.onTackle = () => {
            if (!this.humanPlayer) return;
            this.humanPlayer.triggerSlideTackle();
        };

        // Switch active user player
        this.controls.callbacks.onSwitchPlayer = () => {
            this.switchActivePlayerToClosest();
        };

        // Skill Moves (Roulette, Stepover)
        this.controls.callbacks.onSkillMove = () => {
            if (!this.humanPlayer || this.ball.owner !== this.humanPlayer) return;
            this.humanPlayer.triggerSkill('roulette');
        };
    }

    gameLoop(timestamp) {
        requestAnimationFrame((t) => this.gameLoop(t));

        if (!this.lastTime) this.lastTime = timestamp;
        const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
        this.lastTime = timestamp;

        if (this.isMatchRunning && this.match) {
            // 1. Update Controller Inputs
            this.controls.update(dt);

            // 2. User Active Player Movement
            if (this.humanPlayer && this.match.state === 'PLAYING') {
                this.humanPlayer.move(
                    this.controls.moveVector.x,
                    this.controls.moveVector.z,
                    this.controls.isSprinting,
                    dt
                );
            }

            // 3. Update Ball Physics
            this.ball.update(dt);

            // 4. Update AI for Teammates & Opponents
            this.ai.update(this.teamHome, this.teamAway, this.ball, this.humanPlayer, dt);

            // 5. Update All Player 3D Rigs
            this.teamHome.forEach(p => p.update(dt));
            this.teamAway.forEach(p => p.update(dt));

            // 6. Update Match Rules, Stats & Replay
            this.match.update(this.teamHome, this.teamAway, this.ball, dt);

            // 7. Update HUD UI & 2D Mini-Radar
            this.ui.updateHUD(this.match, this.humanPlayer, this.controls.shootPower || this.controls.lobPower);
            this.ui.renderRadar(this.teamHome, this.teamAway, this.ball);

            // 8. Update Camera Focus
            this.engine3D.updateCamera(
                this.ball.position,
                this.humanPlayer ? this.humanPlayer.position : null,
                this.match.isReplayPlaying,
                this.match.replayAngle
            );
        }

        // Render 3D Scene
        this.engine3D.render();
    }
}

// Bootstrap on window load
window.addEventListener('DOMContentLoaded', () => {
    window.gameApp = new GameApp();
});
