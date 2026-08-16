/**
 * EA FC 27 x FM 27 - Football Manager UI Controller
 */

import { fmEngine } from './fm_manager.js';
import { GLOBAL_CLUBS, GLOBAL_LEAGUES } from './database.js';
import { soundEngine } from './audio.js';

export class FMUIManager {
    constructor(gameApp) {
        this.app = gameApp;
        this.selectedMarketPlayer = null;
        this.init();
    }

    init() {
        this.bindEvents();
    }

    showFMScreen(screenId) {
        document.querySelectorAll('.ui-screen').forEach(s => s.classList.add('hidden'));
        const el = document.getElementById(screenId);
        if (el) el.classList.remove('hidden');
        soundEngine.playUIClick();
    }

    openCareerDashboard() {
        if (!fmEngine.userClub) return;

        this.renderDashboardSummary();
        this.renderLeagueStandings();
        this.renderSquadList();
        this.renderTransferMarket();
        this.renderInbox();
        this.renderTacticsScreen();

        this.showFMScreen('screen-fm-dashboard');
    }

    renderDashboardSummary() {
        const club = fmEngine.userClub;
        if (!club) return;

        const nameEl = document.getElementById('fm-club-name');
        const badgeEl = document.getElementById('fm-club-badge');
        const budgetEl = document.getElementById('fm-budget-display');
        const matchdayEl = document.getElementById('fm-matchday-display');
        const boardEl = document.getElementById('fm-board-conf');
        const fanEl = document.getElementById('fm-fan-conf');

        if (nameEl) nameEl.textContent = club.name;
        if (badgeEl) badgeEl.textContent = club.logo;
        if (budgetEl) budgetEl.textContent = `€${(club.transferBudget / 1000000).toFixed(1)}M`;
        if (matchdayEl) matchdayEl.textContent = `Pekan ke-${fmEngine.currentMatchday}`;
        if (boardEl) boardEl.textContent = `${fmEngine.boardConfidence}%`;
        if (fanEl) fanEl.textContent = `${fmEngine.fanConfidence}%`;

        // Next Match Preview
        const nextMatchInfo = fmEngine.getCurrentUserMatch();
        const nextMatchEl = document.getElementById('fm-next-match-card');
        if (nextMatchInfo && nextMatchEl) {
            const opp = nextMatchInfo.isUserHome ? nextMatchInfo.awayClub : nextMatchInfo.homeClub;
            const venue = nextMatchInfo.isUserHome ? 'KANDANG (HOME)' : 'TANDANG (AWAY)';
            nextMatchEl.innerHTML = `
                <div class="next-match-badge">${opp?.logo || '⚽'}</div>
                <div class="next-match-details">
                    <div class="venue-tag">${venue}</div>
                    <h4>vs ${opp?.name || 'Opponent'}</h4>
                    <p>Rating Skuad: <strong>${opp?.rating || 80}</strong> • Taktik: ${opp?.tacticalStyle || 'Standard'}</p>
                </div>
            `;
        }
    }

    renderLeagueStandings() {
        const tableBody = document.getElementById('fm-standings-body');
        if (!tableBody) return;

        fmEngine.sortStandings();
        tableBody.innerHTML = fmEngine.standings.map((team, idx) => {
            const isUser = team.id === fmEngine.userClub?.id;
            return `
                <tr class="${isUser ? 'user-club-row' : ''}">
                    <td><strong>${idx + 1}</strong></td>
                    <td class="team-cell">
                        <span>${team.logo}</span>
                        <span>${team.name}</span>
                    </td>
                    <td>${team.played}</td>
                    <td>${team.won}</td>
                    <td>${team.drawn}</td>
                    <td>${team.lost}</td>
                    <td>${team.gf}:${team.ga}</td>
                    <td><b>${team.gd > 0 ? '+' + team.gd : team.gd}</b></td>
                    <td class="pts-cell"><strong>${team.points}</strong></td>
                    <td>
                        <div class="form-badges">
                            ${(team.form || []).map(f => `<span class="form-pill ${f}">${f}</span>`).join('')}
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    renderSquadList() {
        const squadGrid = document.getElementById('fm-squad-table-body');
        if (!squadGrid || !fmEngine.userClub) return;

        squadGrid.innerHTML = fmEngine.userClub.players.map(p => `
            <tr>
                <td><b>${p.role}</b></td>
                <td><strong>${p.name}</strong></td>
                <td>${p.age} thn</td>
                <td><span class="ovr-badge">${p.ovr}</span></td>
                <td>€${(p.val / 1000000).toFixed(1)}M</td>
                <td>€${Math.round(p.wage || 50000).toLocaleString()}/w</td>
                <td>
                    <button class="btn-sell-player" data-player-id="${p.id}">Jual Pemain</button>
                </td>
            </tr>
        `).join('');

        // Bind sell buttons
        squadGrid.querySelectorAll('.btn-sell-player').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const pid = e.target.dataset.playerId;
                const res = fmEngine.sellPlayer(pid);
                alert(res.message);
                this.renderSquadList();
                this.renderDashboardSummary();
            });
        });
    }

    renderTransferMarket() {
        const marketList = document.getElementById('fm-market-list');
        if (!marketList || !fmEngine.userClub) return;

        // Collect all global players excluding user club players
        const userPIds = new Set(fmEngine.userClub.players.map(p => p.id));
        const allAvailable = [];

        GLOBAL_CLUBS.forEach(club => {
            if (club.id !== fmEngine.userClub.id) {
                club.players.forEach(p => {
                    if (!userPIds.has(p.id)) {
                        allAvailable.push({ ...p, clubName: club.name, clubLogo: club.logo });
                    }
                });
            }
        });

        marketList.innerHTML = allAvailable.slice(0, 30).map(p => `
            <div class="market-player-card">
                <div class="mp-header">
                    <span class="mp-ovr">${p.ovr}</span>
                    <span class="mp-role">${p.role}</span>
                    <div class="mp-club">${p.clubLogo} ${p.clubName}</div>
                </div>
                <div class="mp-name">${p.name}</div>
                <div class="mp-meta">Usia: ${p.age} thn • Potensi: <b>${p.pot || p.ovr + 3}</b></div>
                <div class="mp-price">Harga: <strong>€${(p.val / 1000000).toFixed(1)}M</strong></div>
                <div class="mp-stats-row">
                    <span>PAC <b>${p.pace}</b></span>
                    <span>SHO <b>${p.shoot}</b></span>
                    <span>PAS <b>${p.pass}</b></span>
                    <span>DRI <b>${p.dribble}</b></span>
                </div>
                <button class="btn-primary-fc btn-open-negotiate" style="width: 100%; padding: 0.6rem; margin-top: 0.8rem; font-size: 0.9rem;" data-player-id="${p.id}">
                    NEGOSIASI TRANSFER
                </button>
            </div>
        `).join('');

        // Bind negotiate buttons
        marketList.querySelectorAll('.btn-open-negotiate').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const pid = e.target.dataset.playerId;
                const p = allAvailable.find(x => x.id === pid);
                if (p) this.openNegotiationModal(p);
            });
        });
    }

    openNegotiationModal(player) {
        this.selectedMarketPlayer = player;
        const modal = document.getElementById('modal-fm-transfer');
        if (!modal) return;

        const nameEl = document.getElementById('nego-player-name');
        const metaEl = document.getElementById('nego-player-meta');
        const valEl = document.getElementById('nego-market-val');
        const feeInput = document.getElementById('nego-fee-input');
        const wageInput = document.getElementById('nego-wage-input');

        if (nameEl) nameEl.textContent = player.name;
        if (metaEl) metaEl.textContent = `${player.role} • ${player.ovr} OVR • Usia ${player.age} • ${player.clubName}`;
        if (valEl) valEl.textContent = `€${(player.val / 1000000).toFixed(1)}M`;
        if (feeInput) feeInput.value = player.val;
        if (wageInput) wageInput.value = player.wage || 100000;

        modal.classList.remove('hidden');
    }

    renderInbox() {
        const inboxList = document.getElementById('fm-inbox-list');
        if (!inboxList) return;

        inboxList.innerHTML = (fmEngine.inbox || []).map(item => `
            <div class="inbox-item-card">
                <div class="inbox-meta">
                    <span class="inbox-sender">${item.sender}</span>
                    <span class="inbox-date">${item.date}</span>
                </div>
                <h4 class="inbox-title">${item.title}</h4>
                <p class="inbox-body">${item.body}</p>
            </div>
        `).join('');
    }

    renderTacticsScreen() {
        const t = fmEngine.tactics || {};
        const styleEl = document.getElementById('tactics-style-select');
        const mentEl = document.getElementById('tactics-mentality-select');
        const tempoEl = document.getElementById('tactics-tempo-select');

        if (styleEl) styleEl.value = t.style || 'Gegenpress';
        if (mentEl) mentEl.value = t.mentality || 'Attacking';
        if (tempoEl) tempoEl.value = t.tempo || 'High';
    }

    bindEvents() {
        // Mode Selector from Main Menu
        document.getElementById('btn-mode-fm-career')?.addEventListener('click', (e) => {
            e.stopPropagation();
            if (fmEngine.hasSavedCareer() && fmEngine.loadCareer()) {
                this.openCareerDashboard();
            } else {
                this.renderClubSelectionForCareer();
                this.showFMScreen('screen-fm-new-career');
            }
        });

        // Tab Navigation within FM Dashboard
        document.querySelectorAll('.fm-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                document.querySelectorAll('.fm-tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.fm-tab-content').forEach(c => c.classList.add('hidden'));

                btn.classList.add('active');
                const targetId = btn.dataset.tab;
                document.getElementById(targetId)?.classList.remove('hidden');
                soundEngine.playUIClick();
            });
        });

        // Transfer Negotiation Modal Actions
        document.getElementById('btn-nego-submit')?.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!this.selectedMarketPlayer) return;
            const fee = parseFloat(document.getElementById('nego-fee-input')?.value || 0);
            const wage = parseFloat(document.getElementById('nego-wage-input')?.value || 0);

            const result = fmEngine.buyPlayer(this.selectedMarketPlayer, fee, wage);
            alert(result.message);

            if (result.success) {
                document.getElementById('modal-fm-transfer')?.classList.add('hidden');
                this.renderDashboardSummary();
                this.renderSquadList();
                this.renderTransferMarket();
                this.renderInbox();
            }
        });

        document.getElementById('btn-nego-cancel')?.addEventListener('click', (e) => {
            e.stopPropagation();
            document.getElementById('modal-fm-transfer')?.classList.add('hidden');
        });

        // Tactics save changes
        document.getElementById('btn-save-tactics')?.addEventListener('click', (e) => {
            e.stopPropagation();
            fmEngine.tactics.style = document.getElementById('tactics-style-select')?.value || 'Gegenpress';
            fmEngine.tactics.mentality = document.getElementById('tactics-mentality-select')?.value || 'Attacking';
            fmEngine.tactics.tempo = document.getElementById('tactics-tempo-select')?.value || 'High';
            fmEngine.saveCareer();
            alert('Taktik berhasil disimpan dan diterapkan ke skuad!');
        });

        // Matchday: Quick Sim
        document.getElementById('btn-fm-quick-sim')?.addEventListener('click', (e) => {
            e.stopPropagation();
            fmEngine.simulateMatchday();
            alert(`Pekan ke-${fmEngine.currentMatchday - 1} selesai disimulasikan!`);
            this.openCareerDashboard();
        });

        // Matchday: Play in 3D EA FC Engine
        document.getElementById('btn-fm-play-3d')?.addEventListener('click', (e) => {
            e.stopPropagation();
            const nextMatch = fmEngine.getCurrentUserMatch();
            if (!nextMatch) {
                alert('Musim telah berakhir!');
                return;
            }

            soundEngine.init();
            this.showFMScreen('screen-hud');

            // Pass career match into 3D Game App
            this.app.startNewMatch(
                nextMatch.homeClub,
                nextMatch.awayClub,
                fmEngine.tactics.formation,
                'MEDIUM'
            );

            // Hook when 3D match finishes to sync back into FM standings
            this.app.match.onMatchFinished = (homeScore, awayScore) => {
                fmEngine.simulateMatchday(homeScore, awayScore);
            };
        });
    }

    renderClubSelectionForCareer() {
        const clubGrid = document.getElementById('fm-new-career-club-list');
        if (!clubGrid) return;

        clubGrid.innerHTML = GLOBAL_CLUBS.map(club => `
            <div class="career-pick-card" data-club-id="${club.id}">
                <div class="team-badge" style="background: ${club.colorPrimary}; color: ${club.colorSecondary}">
                    <span>${club.logo}</span>
                </div>
                <div class="team-info">
                    <div class="team-name">${club.name}</div>
                    <div class="team-meta">OVR: <strong>${club.rating}</strong> • Budget: €${(club.transferBudget/1000000).toFixed(1)}M</div>
                </div>
            </div>
        `).join('');

        clubGrid.querySelectorAll('.career-pick-card').forEach(card => {
            card.addEventListener('click', (e) => {
                e.stopPropagation();
                const cid = card.dataset.clubId;
                fmEngine.startNewCareer(cid);
                this.openCareerDashboard();
            });
        });
    }
}
