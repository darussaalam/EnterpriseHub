/**
 * EA FC 27 x FM 27 - Football Manager UI Controller
 * Complete Individual Player Role & Duty Setup, Interactive 2D Pitch Lineup, Substitutions & Live Match
 */

import { fmEngine } from './fm_manager.js';
import { GLOBAL_CLUBS, GLOBAL_LEAGUES } from './database.js';
import { FORMATIONS } from './config.js';
import { soundEngine } from './audio.js';

export class FMUIManager {
    constructor(gameApp) {
        this.app = gameApp;
        this.selectedPitchPlayer = null; // Currently clicked player on 2D pitch
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
        this.renderTacticsPitchBoard();
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

    // Render 2D Tactical Pitch Formation Board with Individual Player Role & Duty Setup
    renderTacticsPitchBoard() {
        const pitchEl = document.getElementById('fm-tactics-pitch');
        const benchEl = document.getElementById('fm-tactics-bench-list');
        const playerDetailEl = document.getElementById('fm-player-tactics-detail');
        if (!pitchEl || !benchEl || !fmEngine.userClub) return;

        const formationKey = fmEngine.tactics.formation || '4-3-3';
        const formConfig = FORMATIONS[formationKey] || FORMATIONS['4-3-3'];
        const startingXI = fmEngine.getStartingXI();
        const benchPlayers = fmEngine.getBenchPlayers();

        // Default selected player to first striker or first player if null
        if (!this.selectedPitchPlayer || !startingXI.some(p => p.id === this.selectedPitchPlayer.id)) {
            this.selectedPitchPlayer = startingXI[10] || startingXI[0];
        }

        // 1. Draw 11 Pitch Nodes
        pitchEl.innerHTML = '';
        startingXI.slice(0, 11).forEach((player, idx) => {
            const pos = formConfig.positions[idx] || { x: 0, z: 0 };
            // Map X (-48 to 28) -> Left % (10% to 88%), Z (-24 to 24) -> Top % (12% to 88%)
            const leftPct = 12 + ((pos.x + 48) / 80) * 76;
            const topPct = 12 + ((pos.z + 24) / 48) * 76;

            const isSelected = this.selectedPitchPlayer?.id === player.id;

            const node = document.createElement('div');
            node.className = `pitch-player-node ${isSelected ? 'selected' : ''}`;
            node.style.left = `${leftPct}%`;
            node.style.top = `${topPct}%`;
            node.innerHTML = `
                <div class="node-badge" style="background: ${fmEngine.userClub.colorPrimary}; color: ${fmEngine.userClub.colorSecondary}">
                    <span class="node-ovr">${player.ovr}</span>
                </div>
                <div class="node-name">${player.name}</div>
                <div class="node-role">${player.role} • ${player.duty || 'Atk'}</div>
            `;

            node.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectedPitchPlayer = player;
                this.renderTacticsPitchBoard();
                soundEngine.playUIClick();
            });

            pitchEl.appendChild(node);
        });

        // 2. Render Individual Player Tactics Card (Role, Duty & Individual Instructions)
        if (playerDetailEl && this.selectedPitchPlayer) {
            const p = this.selectedPitchPlayer;
            const pRole = p.individualRole || fmEngine.getDefaultRoleForPosition(p.role);
            const pDuty = p.duty || 'Attack';
            const inst = p.instructions || { takeRisks: true, dribbleMore: true, shootMore: true, cutInside: false, tightMarking: false };

            playerDetailEl.innerHTML = `
                <div class="fm-player-detail-card">
                    <div class="fpd-header">
                        <div class="fpd-avatar">${p.ovr}</div>
                        <div class="fpd-title">
                            <h4>${p.name}</h4>
                            <div class="fpd-sub">${p.role} • Usia ${p.age} thn • Kebugaran: 100% • Moral: ${p.morale || 'Superb'}</div>
                        </div>
                    </div>

                    <div class="fpd-stats-mini">
                        <span>PAC <b>${p.pace}</b></span>
                        <span>SHO <b>${p.shoot}</b></span>
                        <span>PAS <b>${p.pass}</b></span>
                        <span>DRI <b>${p.dribble}</b></span>
                        <span>DEF <b>${p.def}</b></span>
                        <span>PHY <b>${p.phy}</b></span>
                    </div>

                    <div class="fpd-controls-grid">
                        <div class="form-group">
                            <label>Peran Individu (Individual Role):</label>
                            <select id="p-individual-role-select" class="fm-select">
                                <option value="Sweeper Keeper" ${pRole === 'Sweeper Keeper' ? 'selected' : ''}>Sweeper Keeper</option>
                                <option value="Goalkeeper" ${pRole === 'Goalkeeper' ? 'selected' : ''}>Traditional Goalkeeper</option>
                                <option value="Ball-Playing Defender" ${pRole === 'Ball-Playing Defender' ? 'selected' : ''}>Ball-Playing Defender (BPD)</option>
                                <option value="Central Defender" ${pRole === 'Central Defender' ? 'selected' : ''}>Central Defender (CD)</option>
                                <option value="Inverted Wing-Back" ${pRole === 'Inverted Wing-Back' ? 'selected' : ''}>Inverted Wing-Back (IWB)</option>
                                <option value="Complete Wing-Back" ${pRole === 'Complete Wing-Back' ? 'selected' : ''}>Complete Wing-Back (CWB)</option>
                                <option value="Deep-Lying Playmaker" ${pRole === 'Deep-Lying Playmaker' ? 'selected' : ''}>Deep-Lying Playmaker (DLP)</option>
                                <option value="Box-to-Box Midfielder" ${pRole === 'Box-to-Box Midfielder' ? 'selected' : ''}>Box-to-Box Midfielder (BBM)</option>
                                <option value="Advanced Playmaker" ${pRole === 'Advanced Playmaker' ? 'selected' : ''}>Advanced Playmaker (AP)</option>
                                <option value="Inverted Winger" ${pRole === 'Inverted Winger' ? 'selected' : ''}>Inverted Winger (IW)</option>
                                <option value="Inside Forward" ${pRole === 'Inside Forward' ? 'selected' : ''}>Inside Forward (IF)</option>
                                <option value="Advanced Forward" ${pRole === 'Advanced Forward' ? 'selected' : ''}>Advanced Forward (AF)</option>
                                <option value="Poacher" ${pRole === 'Poacher' ? 'selected' : ''}>Poacher</option>
                                <option value="Target Forward" ${pRole === 'Target Forward' ? 'selected' : ''}>Target Forward</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label>Tugas Pemain (Duty):</label>
                            <select id="p-duty-select" class="fm-select">
                                <option value="Attack" ${pDuty === 'Attack' ? 'selected' : ''}>⚔️ Attack (Menyerang Penuh)</option>
                                <option value="Support" ${pDuty === 'Support' ? 'selected' : ''}>⚖️ Support (Mendukung / Menghubungkan)</option>
                                <option value="Defend" ${pDuty === 'Defend' ? 'selected' : ''}>🛡️ Defend (Disiplin Bertahan)</option>
                            </select>
                        </div>
                    </div>

                    <div class="fpd-toggles-row">
                        <label class="toggle-pill">
                            <input type="checkbox" id="chk-take-risks" ${inst.takeRisks ? 'checked' : ''}>
                            <span>🎯 Ambil Risiko Umpan (Take More Risks)</span>
                        </label>
                        <label class="toggle-pill">
                            <input type="checkbox" id="chk-dribble-more" ${inst.dribbleMore ? 'checked' : ''}>
                            <span>⚡ Dribble Melewati Lawan (Dribble More)</span>
                        </label>
                        <label class="toggle-pill">
                            <input type="checkbox" id="chk-shoot-more" ${inst.shootMore ? 'checked' : ''}>
                            <span>🚀 Tembak Bila Ada Ruang (Shoot on Sight)</span>
                        </label>
                        <label class="toggle-pill">
                            <input type="checkbox" id="chk-tight-marking" ${inst.tightMarking ? 'checked' : ''}>
                            <span>🛡️ Tekel & Kawalan Ketat (Tight Marking)</span>
                        </label>
                    </div>

                    <button id="btn-save-player-role" class="btn-primary-fc" style="width: 100%; padding: 0.6rem; margin-top: 0.8rem; font-size: 0.9rem;">
                        SIMPAN PENGATURAN INDIVIDU ${p.name.toUpperCase()}
                    </button>
                </div>
            `;

            // Bind Individual Player Save
            document.getElementById('btn-save-player-role')?.addEventListener('click', (e) => {
                e.stopPropagation();
                const newRole = document.getElementById('p-individual-role-select')?.value;
                const newDuty = document.getElementById('p-duty-select')?.value;
                const instructions = {
                    takeRisks: document.getElementById('chk-take-risks')?.checked,
                    dribbleMore: document.getElementById('chk-dribble-more')?.checked,
                    shootMore: document.getElementById('chk-shoot-more')?.checked,
                    tightMarking: document.getElementById('chk-tight-marking')?.checked
                };

                fmEngine.updateIndividualPlayerTactics(p.id, newRole, newDuty, instructions);
                alert(`Pengaturan taktik individu untuk ${p.name} berhasil disimpan!`);
                this.renderTacticsPitchBoard();
            });
        }

        // 3. Draw Bench Substitutes List
        benchEl.innerHTML = benchPlayers.map(bp => `
            <div class="bench-player-card">
                <div class="bench-ovr">${bp.ovr}</div>
                <div class="bench-info">
                    <div class="bench-name"><strong>${bp.name}</strong> (${bp.role})</div>
                    <div class="bench-meta">Usia ${bp.age} • OVR ${bp.ovr} • Kebugaran 100%</div>
                </div>
                <button class="btn-primary-fc btn-bench-sub" style="padding: 0.4rem 0.9rem; font-size: 0.8rem;" data-bench-id="${bp.id}">
                    ${this.selectedPitchPlayer ? `GANTI DGN ${this.selectedPitchPlayer.name.split(' ')[0]}` : 'PILIH SUB'}
                </button>
            </div>
        `).join('');

        // Bind substitution click handlers
        benchEl.querySelectorAll('.btn-bench-sub').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const benchId = btn.dataset.benchId;

                if (!this.selectedPitchPlayer) {
                    alert('Klik pemain di lapangan Starting XI terlebih dahulu!');
                    return;
                }

                const res = fmEngine.substitutePlayer(this.selectedPitchPlayer.id, benchId);
                alert(res.message);
                this.selectedPitchPlayer = res.inPlayer;
                this.renderTacticsPitchBoard();
                this.renderSquadList();
                soundEngine.playUIClick();
            });
        });
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
            <tr class="${p.isStarting ? 'squad-row-starting' : ''}">
                <td><span class="status-pill ${p.isStarting ? 'start' : 'sub'}">${p.isStarting ? 'XI' : 'SUB'}</span></td>
                <td><b>${p.role}</b></td>
                <td><strong>${p.name}</strong></td>
                <td>${p.age} thn</td>
                <td><span class="ovr-badge">${p.ovr}</span></td>
                <td>${p.individualRole || 'Standard'}</td>
                <td>€${(p.val / 1000000).toFixed(1)}M</td>
                <td>€${Math.round(p.wage || 50000).toLocaleString()}/w</td>
                <td>
                    <button class="btn-sell-player" data-player-id="${p.id}">Jual</button>
                </td>
            </tr>
        `).join('');

        squadGrid.querySelectorAll('.btn-sell-player').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const pid = e.target.dataset.playerId;
                const res = fmEngine.sellPlayer(pid);
                alert(res.message);
                this.renderSquadList();
                this.renderTacticsPitchBoard();
                this.renderDashboardSummary();
            });
        });
    }

    renderTransferMarket() {
        const marketList = document.getElementById('fm-market-list');
        if (!marketList || !fmEngine.userClub) return;

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

        marketList.innerHTML = allAvailable.slice(0, 36).map(p => `
            <div class="market-player-card">
                <div class="mp-header">
                    <span class="mp-ovr">${p.ovr}</span>
                    <span class="mp-role">${p.role}</span>
                    <div class="mp-club">${p.clubLogo} ${p.clubName}</div>
                </div>
                <div class="mp-name">${p.name}</div>
                <div class="mp-meta">Usia: ${p.age} thn • Gaji: €${Math.round(p.wage||50000).toLocaleString()}/w</div>
                <div class="mp-price">Harga Pasar: <strong>€${(p.val / 1000000).toFixed(1)}M</strong></div>
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

        marketList.querySelectorAll('.btn-open-negotiate').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
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
        const formEl = document.getElementById('fm-formation-select');

        if (styleEl) styleEl.value = t.style || 'Gegenpress';
        if (mentEl) mentEl.value = t.mentality || 'Attacking';
        if (tempoEl) tempoEl.value = t.tempo || 'High';
        if (formEl) formEl.value = t.formation || '4-3-3';
    }

    openLiveMatchSimulation() {
        const nextMatch = fmEngine.getCurrentUserMatch();
        if (!nextMatch) {
            alert('Musim telah berakhir!');
            return;
        }

        this.showFMScreen('screen-fm-live-match');

        const liveScoreHome = document.getElementById('live-score-home');
        const liveScoreAway = document.getElementById('live-score-away');
        const liveNameHome = document.getElementById('live-name-home');
        const liveNameAway = document.getElementById('live-name-away');
        const liveClock = document.getElementById('live-match-clock');
        const liveFeed = document.getElementById('live-commentary-feed');

        if (liveNameHome) liveNameHome.textContent = nextMatch.homeClub.name;
        if (liveNameAway) liveNameAway.textContent = nextMatch.awayClub.name;
        if (liveScoreHome) liveScoreHome.textContent = '0';
        if (liveScoreAway) liveScoreAway.textContent = '0';
        if (liveClock) liveClock.textContent = '00:00';
        if (liveFeed) liveFeed.innerHTML = '<div class="feed-item">🏁 Peluit babak pertama dibunyikan!</div>';

        fmEngine.startLiveMatchSimulation(
            (state) => {
                if (liveClock) liveClock.textContent = `${String(state.minute).padStart(2, '0')}:00`;
                if (liveScoreHome) liveScoreHome.textContent = state.homeScore;
                if (liveScoreAway) liveScoreAway.textContent = state.awayScore;
            },
            (event) => {
                if (liveFeed) {
                    const item = document.createElement('div');
                    item.className = `feed-item ${event.type}`;
                    item.textContent = event.text;
                    liveFeed.insertBefore(item, liveFeed.firstChild);
                }
                if (event.type === 'GOAL') soundEngine.playGoalCheer();
            },
            (finalState) => {
                alert(`🏁 Pertandingan Selesai! Skor Akhir: ${finalState.homeClub.name} ${finalState.homeScore} - ${finalState.awayScore} ${finalState.awayClub.name}`);
                this.openCareerDashboard();
            }
        );
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

                if (targetId === 'tab-fm-tactics') {
                    this.renderTacticsPitchBoard();
                }
                soundEngine.playUIClick();
            });
        });

        // Formation change in FM Tactics
        document.getElementById('fm-formation-select')?.addEventListener('change', (e) => {
            fmEngine.tactics.formation = e.target.value;
            this.renderTacticsPitchBoard();
            fmEngine.saveCareer();
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
                this.renderTacticsPitchBoard();
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
            fmEngine.tactics.formation = document.getElementById('fm-formation-select')?.value || '4-3-3';
            fmEngine.saveCareer();
            alert('Taktik, formasi, dan instruksi tim berhasil disimpan!');
        });

        // Matchday: Live FM Engine Sim
        document.getElementById('btn-fm-quick-sim')?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.openLiveMatchSimulation();
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
                fmEngine.tactics.formation || '4-3-3',
                'MEDIUM'
            );

            this.app.match.onMatchFinished = (homeScore, awayScore) => {
                fmEngine.simulateMatchday(homeScore, awayScore);
            };
        });

        // Tactical Shouts during Live Match
        document.getElementById('btn-shout-more')?.addEventListener('click', () => {
            const msg = fmEngine.applyTacticalShout('DEMAND_MORE');
            soundEngine.playWhistle(false);
        });
        document.getElementById('btn-shout-praise')?.addEventListener('click', () => {
            const msg = fmEngine.applyTacticalShout('PRAISE');
            soundEngine.playUIClick();
        });
        document.getElementById('btn-shout-focus')?.addEventListener('click', () => {
            const msg = fmEngine.applyTacticalShout('FOCUS');
            soundEngine.playUIClick();
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
