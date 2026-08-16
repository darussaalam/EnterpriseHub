/**
 * EA FC 27 x FM 27 - Football Manager Career Mode Core Engine
 * Complete Lineup, Individual Player Roles & Duties, Substitution Management, Tactical Instructions
 */

import { GLOBAL_CLUBS, GLOBAL_LEAGUES } from './database.js';

export class FootballManagerEngine {
    constructor() {
        this.saveKey = 'EAFC27_FM27_CAREER_SAVE';
        this.userClub = null;
        this.userLeagueId = 'epl';
        this.currentSeasonYear = 2026;
        this.currentMatchday = 1;
        this.totalMatchdays = 38;

        // League Tables & Fixtures
        this.standings = [];
        this.fixtures = [];

        // News & Inbox Messages
        this.inbox = [];

        // Board Confidence & Morale
        this.boardConfidence = 85;
        this.fanConfidence = 88;

        // In-depth FM Tactics Object
        this.tactics = {
            formation: '4-3-3',
            style: 'Gegenpress',
            mentality: 'Attacking',
            tempo: 'High',
            passing: 'Shorter',
            width: 'Fairly Wide',
            defensiveLine: 'High',
            pressingIntensity: 'Much More Often',
            tackleAggression: 'Get Stuck In',
            timeWasting: 'Never',
            counterPress: true,
            counterAttack: true
        };

        // Transfer Market State
        this.transferHistory = [];
        this.liveMatch = null;
    }

    getDefaultRoleForPosition(pos) {
        if (!pos) return 'Standard Role';
        if (pos === 'GK') return 'Sweeper Keeper';
        if (pos.includes('CB')) return 'Ball-Playing Defender';
        if (pos.includes('LB') || pos.includes('LWB')) return 'Inverted Wing-Back';
        if (pos.includes('RB') || pos.includes('RWB')) return 'Complete Wing-Back';
        if (pos.includes('CDM')) return 'Deep-Lying Playmaker';
        if (pos.includes('CM')) return 'Box-to-Box Midfielder';
        if (pos.includes('CAM')) return 'Advanced Playmaker';
        if (pos.includes('LW') || pos.includes('LM')) return 'Inverted Winger';
        if (pos.includes('RW') || pos.includes('RM')) return 'Inside Forward';
        if (pos.includes('ST')) return 'Advanced Forward';
        return 'Standard Role';
    }

    startNewCareer(clubId) {
        const foundClub = GLOBAL_CLUBS.find(c => c.id === clubId);
        if (!foundClub) return false;

        // Deep clone club data
        this.userClub = JSON.parse(JSON.stringify(foundClub));
        this.userLeagueId = foundClub.leagueId;
        this.currentMatchday = 1;
        this.boardConfidence = 85;
        this.fanConfidence = 88;

        // Ensure every player has initial setup
        this.userClub.players.forEach((p, idx) => {
            p.isStarting = idx < 11;
            if (!p.individualRole) p.individualRole = this.getDefaultRoleForPosition(p.role);
            if (!p.duty) p.duty = p.role.includes('ST') || p.role.includes('W') ? 'Attack' : p.role.includes('CB') || p.role === 'GK' ? 'Defend' : 'Support';
            if (!p.instructions) {
                p.instructions = {
                    takeRisks: true,
                    dribbleMore: true,
                    shootMore: p.role.includes('ST'),
                    cutInside: p.role.includes('W'),
                    tightMarking: p.role.includes('CB') || p.role.includes('DM')
                };
            }
        });

        // Initialize League Table for all clubs in this league
        this.initLeagueSeason();

        // Welcome News item
        this.inbox = [
            {
                id: 1,
                date: '17 August 2026',
                sender: 'Board of Directors',
                title: `Selamat Datang di ${this.userClub.name}!`,
                body: `Dewan Direksi dan pendukung menyambut Anda sebagai Manajer baru ${this.userClub.name}. Target musim ini adalah bersaing memperebutkan gelar dan mengelola anggaran transfer €${(this.userClub.transferBudget / 1000000).toFixed(1)}M secara efektif.`
            },
            {
                id: 2,
                date: '17 August 2026',
                sender: 'Kepala Pelatih Fisik & Taktik',
                title: 'Skuad Siap untuk Musim Baru!',
                body: 'Susunan pemain Starting XI dan pemain cadangan (Bench) telah siap. Buka menu Taktik & Skuad untuk mengatur pergantian pemain (Substitution) dan gaya permainan tim.'
            }
        ];

        this.saveCareer();
        return true;
    }

    // Get Starting XI (Always guarantees 11 players)
    getStartingXI() {
        if (!this.userClub || !this.userClub.players) return [];
        let starting = this.userClub.players.filter(p => p.isStarting);
        if (starting.length === 0) {
            // Auto-assign first 11 as starting XI
            this.userClub.players.forEach((p, i) => {
                p.isStarting = i < 11;
                if (!p.individualRole) p.individualRole = this.getDefaultRoleForPosition(p.role);
                if (!p.duty) p.duty = p.role.includes('ST') || p.role.includes('W') ? 'Attack' : p.role.includes('CB') || p.role === 'GK' ? 'Defend' : 'Support';
            });
            starting = this.userClub.players.slice(0, 11);
        }
        return starting;
    }

    // Get Bench Substitutes
    getBenchPlayers() {
        if (!this.userClub || !this.userClub.players) return [];
        this.getStartingXI(); // Ensure starting XI is initialized
        return this.userClub.players.filter(p => !p.isStarting);
    }

    // Make Player Substitution (Swap Starting XI with Bench)
    substitutePlayer(startingPlayerId, benchPlayerId) {
        if (!this.userClub) return { success: false, message: 'Klub tidak ditemukan!' };

        const startIdx = this.userClub.players.findIndex(p => p.id === startingPlayerId);
        const benchIdx = this.userClub.players.findIndex(p => p.id === benchPlayerId);

        if (startIdx === -1 || benchIdx === -1) {
            return { success: false, message: 'Pemain tidak ditemukan dalam daftar!' };
        }

        const outPlayer = this.userClub.players[startIdx];
        const inPlayer = this.userClub.players[benchIdx];

        // Swap isStarting status
        outPlayer.isStarting = false;
        inPlayer.isStarting = true;

        if (!inPlayer.individualRole) inPlayer.individualRole = this.getDefaultRoleForPosition(inPlayer.role);
        if (!inPlayer.duty) inPlayer.duty = 'Support';

        this.saveCareer();
        return {
            success: true,
            message: `🔄 Pergantian Pemain Berhasil: ${inPlayer.name} (IN) menggantikan ${outPlayer.name} (OUT)!`,
            outPlayer,
            inPlayer
        };
    }

    updateIndividualPlayerTactics(playerId, role, duty, instructions) {
        if (!this.userClub) return;
        const p = this.userClub.players.find(x => x.id === playerId);
        if (!p) return;

        p.individualRole = role;
        p.duty = duty;
        if (instructions) p.instructions = instructions;
        this.saveCareer();
    }

    initLeagueSeason() {
        const leagueClubs = GLOBAL_CLUBS.filter(c => c.leagueId === this.userLeagueId);

        this.standings = leagueClubs.map(club => ({
            id: club.id,
            name: club.name,
            shortName: club.shortName,
            logo: club.logo,
            played: 0,
            won: 0,
            drawn: 0,
            lost: 0,
            gf: 0,
            ga: 0,
            gd: 0,
            points: 0,
            form: []
        }));

        this.fixtures = [];
        const n = leagueClubs.length;
        for (let round = 1; round <= (n - 1) * 2; round++) {
            const matchdayMatches = [];
            for (let i = 0; i < Math.floor(n / 2); i++) {
                const home = leagueClubs[(round + i) % n];
                const away = leagueClubs[(round + n - 1 - i) % n];
                if (home && away && home.id !== away.id) {
                    matchdayMatches.push({
                        homeId: home.id,
                        awayId: away.id,
                        homeScore: null,
                        awayScore: null,
                        played: false
                    });
                }
            }
            this.fixtures.push({ matchday: round, matches: matchdayMatches });
        }
    }

    getCurrentUserMatch() {
        const mdObj = this.fixtures.find(f => f.matchday === this.currentMatchday);
        if (!mdObj) return null;

        const match = mdObj.matches.find(m => m.homeId === this.userClub.id || m.awayId === this.userClub.id);
        if (!match) return null;

        const homeClub = (match.homeId === this.userClub.id) ? this.userClub : GLOBAL_CLUBS.find(c => c.id === match.homeId);
        const awayClub = (match.awayId === this.userClub.id) ? this.userClub : GLOBAL_CLUBS.find(c => c.id === match.awayId);

        return {
            match,
            homeClub,
            awayClub,
            isUserHome: match.homeId === this.userClub.id
        };
    }

    // Start Live FM Simulation Engine
    startLiveMatchSimulation(onTick, onEvent, onFinished) {
        const userMatchInfo = this.getCurrentUserMatch();
        if (!userMatchInfo) return null;

        const { homeClub, awayClub, isUserHome } = userMatchInfo;

        this.liveMatch = {
            minute: 0,
            homeClub,
            awayClub,
            homeScore: 0,
            awayScore: 0,
            events: [],
            subsRemaining: 5,
            commentary: 'Peluit babak pertama dibunyikan! Pertandingan resmi dimulai.',
            isPaused: false,
            intervalId: null
        };

        const intervalId = setInterval(() => {
            if (!this.liveMatch || this.liveMatch.isPaused) return;

            this.liveMatch.minute += 2;
            const min = this.liveMatch.minute;

            // Rating calculations
            const userBonus = (this.tactics.mentality === 'Attacking' ? 2 : this.tactics.mentality === 'Overload' ? 4 : 0);
            const homePower = homeClub.rating + (isUserHome ? userBonus : 0) + Math.random() * 8;
            const awayPower = awayClub.rating + (!isUserHome ? userBonus : 0) + Math.random() * 8;

            // Goal chance check
            if (Math.random() < 0.08) {
                if (homePower > awayPower + 2) {
                    this.liveMatch.homeScore++;
                    const scorer = homeClub.players[Math.floor(Math.random() * Math.min(11, homeClub.players.length))]?.name || 'Striker';
                    const ev = { min, type: 'GOAL', text: `⚽ GOOOL! (${min}') ${homeClub.name}! Dicetak oleh ${scorer}.` };
                    this.liveMatch.events.unshift(ev);
                    this.liveMatch.commentary = ev.text;
                    if (onEvent) onEvent(ev);
                } else if (awayPower > homePower + 2) {
                    this.liveMatch.awayScore++;
                    const scorer = awayClub.players[Math.floor(Math.random() * Math.min(11, awayClub.players.length))]?.name || 'Striker';
                    const ev = { min, type: 'GOAL', text: `⚽ GOOOL! (${min}') ${awayClub.name}! Dicetak oleh ${scorer}.` };
                    this.liveMatch.events.unshift(ev);
                    this.liveMatch.commentary = ev.text;
                    if (onEvent) onEvent(ev);
                }
            }

            // Key Chance / Yellow card check
            if (Math.random() < 0.05) {
                const team = Math.random() > 0.5 ? homeClub : awayClub;
                const p = team.players[Math.floor(Math.random() * Math.min(11, team.players.length))]?.name || 'Pemain';
                const ev = { min, type: 'CARD', text: `🟨 Kartu Kuning (${min}') untuk ${p} (${team.shortName}) setelah pelanggaran keras.` };
                this.liveMatch.events.unshift(ev);
                this.liveMatch.commentary = ev.text;
                if (onEvent) onEvent(ev);
            }

            if (onTick) onTick(this.liveMatch);

            // Full-time 90 mins
            if (min >= 90) {
                clearInterval(intervalId);
                this.simulateMatchday(this.liveMatch.homeScore, this.liveMatch.awayScore);
                if (onFinished) onFinished(this.liveMatch);
            }
        }, 300);

        this.liveMatch.intervalId = intervalId;
        return this.liveMatch;
    }

    applyTacticalShout(shoutType) {
        if (!this.liveMatch) return 'Tidak ada laga aktif.';
        const min = this.liveMatch.minute;
        let response = '';

        if (shoutType === 'DEMAND_MORE') {
            response = `📢 Manajer berteriak: "Tingkatkan Tekanan & Bekerja Lebih Keras!" (Moral Skuad Meningkat)`;
        } else if (shoutType === 'PRAISE') {
            response = `👏 Manajer memberikan pujian: "Kerja Bagus, Pertahankan Dominasi!"`;
        } else if (shoutType === 'FOCUS') {
            response = `🎯 Manajer menginstruksikan: "Fokus & Jangan Buat Kesalahan!" (Konsentrasi Bertahan Naik)`;
        }

        this.liveMatch.events.unshift({ min, type: 'SHOUT', text: response });
        this.liveMatch.commentary = response;
        return response;
    }

    simulateMatchday(userScoreHome = null, userScoreAway = null) {
        const mdObj = this.fixtures.find(f => f.matchday === this.currentMatchday);
        if (!mdObj) return;

        mdObj.matches.forEach(match => {
            if (match.played) return;

            const homeClub = (match.homeId === this.userClub.id) ? this.userClub : GLOBAL_CLUBS.find(c => c.id === match.homeId) || { rating: 80 };
            const awayClub = (match.awayId === this.userClub.id) ? this.userClub : GLOBAL_CLUBS.find(c => c.id === match.awayId) || { rating: 80 };

            if ((match.homeId === this.userClub.id || match.awayId === this.userClub.id) && userScoreHome !== null && userScoreAway !== null) {
                match.homeScore = userScoreHome;
                match.awayScore = userScoreAway;
            } else {
                const ratingDiff = (homeClub.rating + 3) - awayClub.rating;
                const homeBaseGoals = Math.max(0, Math.round(Math.random() * 2 + (ratingDiff > 0 ? 1 : 0) + Math.random() * 1.5));
                const awayBaseGoals = Math.max(0, Math.round(Math.random() * 2 - (ratingDiff > 5 ? 1 : 0) + Math.random() * 1.2));

                match.homeScore = homeBaseGoals;
                match.awayScore = awayBaseGoals;
            }

            match.played = true;

            this.updateStandingsRecord(match.homeId, match.homeScore, match.awayScore);
            this.updateStandingsRecord(match.awayId, match.awayScore, match.homeScore);
        });

        // Weekly Finances
        const userMatch = mdObj.matches.find(m => m.homeId === this.userClub.id || m.awayId === this.userClub.id);
        if (userMatch) {
            if (userMatch.homeId === this.userClub.id) {
                const ticketRevenue = 1500000 + Math.floor(Math.random() * 800000);
                this.userClub.transferBudget += ticketRevenue;
            }
            const totalWages = this.userClub.players.reduce((sum, p) => sum + (p.wage || 50000), 0);
            this.userClub.transferBudget -= totalWages;

            const isUserHome = userMatch.homeId === this.userClub.id;
            const userGoals = isUserHome ? userMatch.homeScore : userMatch.awayScore;
            const oppGoals = isUserHome ? userMatch.awayScore : userMatch.homeScore;

            if (userGoals > oppGoals) {
                this.boardConfidence = Math.min(100, this.boardConfidence + 3);
                this.fanConfidence = Math.min(100, this.fanConfidence + 4);
            } else if (userGoals < oppGoals) {
                this.boardConfidence = Math.max(20, this.boardConfidence - 4);
                this.fanConfidence = Math.max(20, this.fanConfidence - 5);
            }
        }

        this.currentMatchday++;
        this.sortStandings();
        this.saveCareer();
    }

    updateStandingsRecord(clubId, goalsFor, goalsAgainst) {
        const row = this.standings.find(r => r.id === clubId);
        if (!row) return;

        row.played++;
        row.gf += goalsFor;
        row.ga += goalsAgainst;
        row.gd = row.gf - row.ga;

        if (goalsFor > goalsAgainst) {
            row.won++;
            row.points += 3;
            row.form.unshift('W');
        } else if (goalsFor === goalsAgainst) {
            row.drawn++;
            row.points += 1;
            row.form.unshift('D');
        } else {
            row.lost++;
            row.form.unshift('L');
        }

        if (row.form.length > 5) row.form.pop();
    }

    sortStandings() {
        this.standings.sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            if (b.gd !== a.gd) return b.gd - a.gd;
            return b.gf - a.gf;
        });
    }

    buyPlayer(player, offerFee, offerWage) {
        if (!this.userClub || this.userClub.transferBudget < offerFee) {
            return { success: false, message: 'Anggaran transfer klub tidak mencukupi!' };
        }

        const minAcceptableFee = player.val * 0.95;
        const minAcceptableWage = player.wage * 1.05;

        if (offerFee < minAcceptableFee) {
            return {
                success: false,
                message: `Klub pemilik menolak tawaran €${(offerFee/1000000).toFixed(1)}M. Mereka meminta minimal €${(player.val/1000000).toFixed(1)}M!`
            };
        }

        if (offerWage < minAcceptableWage) {
            return {
                success: false,
                message: `Agen pemain ${player.name} meminta gaji minimal €${Math.round(minAcceptableWage).toLocaleString()}/minggu!`
            };
        }

        this.userClub.transferBudget -= offerFee;
        const newPlayer = {
            ...player,
            isStarting: false,
            wage: offerWage,
            fitness: 100,
            morale: 'Superb',
            individualRole: this.getDefaultRoleForPosition(player.role),
            duty: 'Support'
        };
        this.userClub.players.push(newPlayer);

        this.transferHistory.unshift({
            date: `Matchday ${this.currentMatchday}`,
            type: 'IN',
            player: player.name,
            fee: offerFee,
            wage: offerWage
        });

        this.inbox.unshift({
            id: Date.now(),
            date: `Pekan ${this.currentMatchday}`,
            sender: 'Departemen Transfer',
            title: `RESMI: ${player.name} bergabung dengan ${this.userClub.name}!`,
            body: `${player.name} telah menandatangani kontrak resmi setelah transfer senilai €${(offerFee/1000000).toFixed(1)}M disetujui.`
        });

        this.saveCareer();
        return { success: true, message: `Sukses merekrut ${player.name} ke skuad!` };
    }

    sellPlayer(playerId) {
        const pIndex = this.userClub.players.findIndex(p => p.id === playerId);
        if (pIndex === -1) return { success: false, message: 'Pemain tidak ditemukan di skuad!' };

        const player = this.userClub.players[pIndex];
        const soldFee = Math.round(player.val * (0.9 + Math.random() * 0.25));

        this.userClub.players.splice(pIndex, 1);
        this.userClub.transferBudget += soldFee;

        // If starting player was sold, promote first bench player
        const starting = this.userClub.players.filter(p => p.isStarting);
        if (starting.length < 11 && this.userClub.players.length >= 11) {
            const nextBench = this.userClub.players.find(p => !p.isStarting);
            if (nextBench) nextBench.isStarting = true;
        }

        this.transferHistory.unshift({
            date: `Matchday ${this.currentMatchday}`,
            type: 'OUT',
            player: player.name,
            fee: soldFee
        });

        this.inbox.unshift({
            id: Date.now(),
            date: `Pekan ${this.currentMatchday}`,
            sender: 'Departemen Transfer',
            title: `TRANSFER: ${player.name} dilepas!`,
            body: `${player.name} telah meninggalkan klub dengan nilai penjualan sebesar €${(soldFee/1000000).toFixed(1)}M.`
        });

        this.saveCareer();
        return { success: true, message: `Berhasil menjual ${player.name} seharga €${(soldFee/1000000).toFixed(1)}M!` };
    }

    saveCareer() {
        try {
            const data = {
                userClub: this.userClub,
                userLeagueId: this.userLeagueId,
                currentMatchday: this.currentMatchday,
                standings: this.standings,
                fixtures: this.fixtures,
                inbox: this.inbox,
                boardConfidence: this.boardConfidence,
                fanConfidence: this.fanConfidence,
                tactics: this.tactics,
                transferHistory: this.transferHistory
            };
            localStorage.setItem(this.saveKey, JSON.stringify(data));
        } catch (e) {
            console.warn('LocalStorage save failed:', e);
        }
    }

    loadCareer() {
        try {
            const raw = localStorage.getItem(this.saveKey);
            if (!raw) return false;
            const data = JSON.parse(raw);
            this.userClub = data.userClub;
            this.userLeagueId = data.userLeagueId;
            this.currentMatchday = data.currentMatchday;
            this.standings = data.standings;
            this.fixtures = data.fixtures;
            this.inbox = data.inbox;
            this.boardConfidence = data.boardConfidence;
            this.fanConfidence = data.fanConfidence;
            this.tactics = data.tactics || this.tactics;
            this.transferHistory = data.transferHistory || [];

            // Ensure players have isStarting and individual roles
            if (this.userClub && this.userClub.players) {
                let startCount = 0;
                this.userClub.players.forEach((p, i) => {
                    if (p.isStarting === undefined) p.isStarting = i < 11;
                    if (p.isStarting) startCount++;
                    if (!p.individualRole) p.individualRole = this.getDefaultRoleForPosition(p.role);
                    if (!p.duty) p.duty = 'Support';
                });
                if (startCount === 0) {
                    this.userClub.players.slice(0, 11).forEach(p => p.isStarting = true);
                }
            }

            return true;
        } catch (e) {
            console.warn('Failed loading save:', e);
            return false;
        }
    }

    hasSavedCareer() {
        return !!localStorage.getItem(this.saveKey);
    }
}

export const fmEngine = new FootballManagerEngine();
