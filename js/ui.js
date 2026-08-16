/**
 * EA FC 27 Web Edition - UI Manager & 2D Mini-Radar Renderer
 */

import { TEAMS_DATABASE, FORMATIONS } from './config.js';
import { soundEngine } from './audio.js';

export class UIManager {
    constructor() {
        this.selectedHomeTeam = TEAMS_DATABASE[0]; // Real Madrid
        this.selectedAwayTeam = TEAMS_DATABASE[1]; // Man City
        this.selectedFormation = '4-3-3';
        this.selectedDifficulty = 'MEDIUM';
        this.gameMode = 'kickoff'; // kickoff, tournament, practice

        // Tournament Data
        this.tournamentBracket = [];

        // Mini Radar Canvas
        this.radarCanvas = document.getElementById('radar-canvas');
        this.radarCtx = this.radarCanvas ? this.radarCanvas.getContext('2d') : null;

        // Callback hooks
        this.onStartMatch = () => {};
        this.onRestartMatch = () => {};
        this.onResumeMatch = () => {};
        this.onQuitToMenu = () => {};

        this.init();
    }

    init() {
        this.renderTeamCards();
        this.bindEvents();
    }

    showScreen(screenId) {
        document.querySelectorAll('.ui-screen').forEach(s => s.classList.add('hidden'));
        const target = document.getElementById(screenId);
        if (target) target.classList.remove('hidden');
        soundEngine.playUIClick();
    }

    renderTeamCards() {
        const homeList = document.getElementById('home-team-list');
        const awayList = document.getElementById('away-team-list');
        if (!homeList || !awayList) return;

        homeList.innerHTML = '';
        awayList.innerHTML = '';

        TEAMS_DATABASE.forEach(team => {
            const createCard = (isHome) => {
                const card = document.createElement('div');
                card.className = `team-card ${((isHome && this.selectedHomeTeam.id === team.id) || (!isHome && this.selectedAwayTeam.id === team.id)) ? 'active' : ''}`;
                card.innerHTML = `
                    <div class="team-badge" style="background: ${team.colorPrimary}; color: ${team.colorSecondary}">
                        <span>${team.logo}</span>
                    </div>
                    <div class="team-info">
                        <div class="team-name">${team.name}</div>
                        <div class="team-meta">${team.league} • OVR <strong>${team.rating}</strong></div>
                    </div>
                `;
                card.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (isHome) {
                        this.selectedHomeTeam = team;
                    } else {
                        this.selectedAwayTeam = team;
                    }
                    this.renderTeamCards();
                    this.renderTacticsRoster();
                    soundEngine.playUIClick();
                });
                return card;
            };

            homeList.appendChild(createCard(true));
            awayList.appendChild(createCard(false));
        });

        this.renderTacticsRoster();
    }

    renderTacticsRoster() {
        const rosterContainer = document.getElementById('tactics-roster');
        if (!rosterContainer || !this.selectedHomeTeam) return;

        rosterContainer.innerHTML = `
            <div class="tactics-header" style="margin-bottom: 1rem;">
                <h3>${this.selectedHomeTeam.name} - Squad Rating (${this.selectedHomeTeam.rating})</h3>
                <div class="formation-badge" style="color: var(--neon-volt);">${FORMATIONS[this.selectedFormation]?.name || '4-3-3 Attack'}</div>
            </div>
            <div class="player-roster-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 1rem;">
                ${this.selectedHomeTeam.players.map(p => `
                    <div class="player-fut-card">
                        <div class="card-ovr">${p.ovr}</div>
                        <div class="card-pos">${p.role}</div>
                        <div class="card-name">${p.name}</div>
                        <div class="card-stats">
                            <span>PAC <b>${p.pace}</b></span>
                            <span>SHO <b>${p.shoot}</b></span>
                            <span>PAS <b>${p.pass}</b></span>
                            <span>DRI <b>${p.dribble}</b></span>
                            <span>DEF <b>${p.def}</b></span>
                            <span>PHY <b>${p.phy}</b></span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderTournamentBracket() {
        const bracketEl = document.getElementById('tournament-bracket-view');
        if (!bracketEl) return;

        const teams = [...TEAMS_DATABASE];
        this.tournamentBracket = [
            { round: 'Quarter-Finals', matches: [
                { t1: teams[0] || { name: 'Team 1' }, t2: teams[1] || { name: 'Team 2' }, s1: 0, s2: 0, played: false },
                { t1: teams[2] || { name: 'Team 3' }, t2: teams[3] || { name: 'Team 4' }, s1: 0, s2: 0, played: false },
                { t1: teams[4] || { name: 'Team 5' }, t2: teams[5] || { name: 'Team 6' }, s1: 0, s2: 0, played: false },
                { t1: teams[6] || { name: 'Team 7' }, t2: teams[7] || { name: 'Team 8' }, s1: 0, s2: 0, played: false }
            ]},
            { round: 'Semi-Finals', matches: [
                { t1: { name: 'Winner QF 1' }, t2: { name: 'Winner QF 2' } },
                { t1: { name: 'Winner QF 3' }, t2: { name: 'Winner QF 4' } }
            ]},
            { round: 'Grand Final', matches: [
                { t1: { name: 'Finalist 1' }, t2: { name: 'Finalist 2' } }
            ]}
        ];

        bracketEl.innerHTML = this.tournamentBracket.map(r => `
            <div class="bracket-round">
                <h4>${r.round}</h4>
                ${r.matches.map(m => `
                    <div class="bracket-match">
                        <div class="bm-team">${m.t1.name}</div>
                        <div class="bm-vs">VS</div>
                        <div class="bm-team">${m.t2.name}</div>
                    </div>
                `).join('')}
            </div>
        `).join('');
    }

    bindEvents() {
        // Main Menu Buttons
        document.getElementById('btn-mode-kickoff')?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.gameMode = 'kickoff';
            this.showScreen('screen-team-select');
        });

        document.getElementById('btn-mode-tournament')?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.gameMode = 'tournament';
            this.renderTournamentBracket();
            this.showScreen('screen-tournament');
        });

        document.getElementById('btn-mode-tactics')?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showScreen('screen-tactics');
        });

        document.getElementById('btn-mode-settings')?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showScreen('screen-settings');
        });

        // Team Select Next
        document.getElementById('btn-start-match')?.addEventListener('click', (e) => {
            e.stopPropagation();
            soundEngine.init();
            this.showScreen('screen-hud');
            this.onStartMatch(this.selectedHomeTeam, this.selectedAwayTeam, this.selectedFormation, this.selectedDifficulty);
        });

        // Formation Switcher
        document.querySelectorAll('.formation-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                document.querySelectorAll('.formation-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.selectedFormation = btn.dataset.formation;
                this.renderTacticsRoster();
                soundEngine.playUIClick();
            });
        });

        // Difficulty Switcher
        document.querySelectorAll('.diff-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.selectedDifficulty = btn.dataset.diff;
                soundEngine.playUIClick();
            });
        });

        // Pause Menu Listeners
        document.getElementById('btn-hud-pause')?.addEventListener('click', (e) => {
            e.stopPropagation();
            document.getElementById('modal-pause')?.classList.remove('hidden');
        });
        document.getElementById('btn-pause-resume')?.addEventListener('click', (e) => {
            e.stopPropagation();
            document.getElementById('modal-pause')?.classList.add('hidden');
            this.onResumeMatch();
        });
        document.getElementById('btn-pause-restart')?.addEventListener('click', (e) => {
            e.stopPropagation();
            document.getElementById('modal-pause')?.classList.add('hidden');
            this.onRestartMatch();
        });
        document.getElementById('btn-pause-quit')?.addEventListener('click', (e) => {
            e.stopPropagation();
            document.getElementById('modal-pause')?.classList.add('hidden');
            this.showScreen('screen-main-menu');
            this.onQuitToMenu();
        });

        // Fulltime summary back button
        document.getElementById('btn-summary-continue')?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showScreen('screen-main-menu');
            this.onQuitToMenu();
        });

        // Audio mute toggle
        document.getElementById('btn-toggle-audio')?.addEventListener('click', (e) => {
            e.stopPropagation();
            const btn = e.currentTarget;
            const isMuted = btn.classList.toggle('muted');
            soundEngine.setMuted(isMuted);
            btn.textContent = isMuted ? '🔇 Audio: OFF' : '🔊 Audio: ON';
        });

        // Back to Menu buttons
        document.querySelectorAll('.btn-back-menu').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showScreen('screen-main-menu');
            });
        });
    }

    updateHUD(match, activePlayer, shootPower) {
        if (!match) return;

        // Scoreboard
        const timeEl = document.getElementById('hud-match-time');
        const scoreHome = document.getElementById('hud-score-home');
        const scoreAway = document.getElementById('hud-score-away');
        const nameHome = document.getElementById('hud-name-home');
        const nameAway = document.getElementById('hud-name-away');

        if (timeEl) timeEl.textContent = match.getFormattedTime();
        if (scoreHome) scoreHome.textContent = match.score.home;
        if (scoreAway) scoreAway.textContent = match.score.away;
        if (nameHome) nameHome.textContent = match.homeTeamData?.shortName || 'HOM';
        if (nameAway) nameAway.textContent = match.awayTeamData?.shortName || 'AWY';

        // Active Player Card Info
        if (activePlayer) {
            const pName = document.getElementById('hud-player-name');
            const pNum = document.getElementById('hud-player-num');
            const pStam = document.getElementById('hud-stamina-fill');
            if (pName) pName.textContent = activePlayer.name;
            if (pNum) pNum.textContent = `#${activePlayer.number}`;
            if (pStam) pStam.style.width = `${activePlayer.stamina}%`;
        }

        // Power Bar
        const powerFill = document.getElementById('hud-power-fill');
        const powerContainer = document.getElementById('hud-power-bar');
        if (powerFill && powerContainer) {
            if (shootPower > 0) {
                powerContainer.classList.remove('hidden');
                powerFill.style.width = `${shootPower * 100}%`;
            } else {
                powerContainer.classList.add('hidden');
            }
        }

        // Goal Alert / Banner
        const goalBanner = document.getElementById('hud-goal-banner');
        if (goalBanner) {
            if (match.state === 'GOAL') {
                goalBanner.classList.remove('hidden');
                const scorerEl = document.getElementById('hud-goal-scorer');
                if (scorerEl && match.goalScorer) scorerEl.textContent = `Scored by ${match.goalScorer}`;
            } else {
                goalBanner.classList.add('hidden');
            }
        }

        // Replay Watermark
        const replayTag = document.getElementById('hud-replay-tag');
        if (replayTag) {
            if (match.state === 'REPLAY') replayTag.classList.remove('hidden');
            else replayTag.classList.add('hidden');
        }

        // Full Time Screen
        if (match.state === 'FULL_TIME') {
            this.showMatchSummary(match);
        }
    }

    showMatchSummary(match) {
        const summaryScreen = document.getElementById('screen-match-summary');
        if (!summaryScreen) return;

        const poss = match.getPossessionPercentage();

        const scoreEl = document.getElementById('summary-score');
        const possEl = document.getElementById('stat-poss');
        const shotsEl = document.getElementById('stat-shots');
        const targetEl = document.getElementById('stat-shots-target');
        const tacklesEl = document.getElementById('stat-tackles');

        if (scoreEl) scoreEl.textContent = `${match.homeTeamData?.name || 'Home'} ${match.score.home} - ${match.score.away} ${match.awayTeamData?.name || 'Away'}`;
        if (possEl) possEl.textContent = `${poss.home}% - ${poss.away}%`;
        if (shotsEl) shotsEl.textContent = `${match.stats.home.shots} - ${match.stats.away.shots}`;
        if (targetEl) targetEl.textContent = `${match.stats.home.shotsOnTarget} - ${match.stats.away.shotsOnTarget}`;
        if (tacklesEl) tacklesEl.textContent = `${match.stats.home.tackles} - ${match.stats.away.tackles}`;

        this.showScreen('screen-match-summary');
    }

    renderRadar(teamHome, teamAway, ball) {
        if (!this.radarCtx || !this.radarCanvas) return;
        const ctx = this.radarCtx;
        const w = this.radarCanvas.width;
        const h = this.radarCanvas.height;

        // Clear pitch background
        ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
        ctx.fillRect(0, 0, w, h);

        // Pitch lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.lineWidth = 1;
        ctx.strokeRect(4, 4, w - 8, h - 8);
        ctx.beginPath();
        ctx.moveTo(w / 2, 4);
        ctx.lineTo(w / 2, h - 4);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(w / 2, h / 2, 16, 0, Math.PI * 2);
        ctx.stroke();

        // Coordinate mapping function
        const mapX = (x) => 4 + ((x + 52.5) / 105) * (w - 8);
        const mapZ = (z) => 4 + ((z + 34) / 68) * (h - 8);

        // Draw Home Players
        ctx.fillStyle = '#00f59b';
        teamHome.forEach((p) => {
            const rx = mapX(p.position.x);
            const rz = mapZ(p.position.z);
            ctx.beginPath();
            ctx.arc(rx, rz, p.isActive ? 4.5 : 3, 0, Math.PI * 2);
            ctx.fill();
        });

        // Draw Away Players
        ctx.fillStyle = '#ef4444';
        teamAway.forEach(p => {
            const rx = mapX(p.position.x);
            const rz = mapZ(p.position.z);
            ctx.beginPath();
            ctx.arc(rx, rz, 3, 0, Math.PI * 2);
            ctx.fill();
        });

        // Draw Ball
        if (ball) {
            const bx = mapX(ball.position.x);
            const bz = mapZ(ball.position.z);
            ctx.fillStyle = '#facc15';
            ctx.beginPath();
            ctx.arc(bx, bz, 3.5, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}
