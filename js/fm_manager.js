/**
 * EA FC 27 x FM 27 - Football Manager Career Mode Core Engine
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
        this.boardConfidence = 85; // 0 to 100
        this.fanConfidence = 88;

        // Active Tactical Preset
        this.tactics = {
            formation: '4-3-3',
            style: 'Gegenpress',
            mentality: 'Attacking', // Very Defensive, Balanced, Attacking, Overload
            tempo: 'High',
            passing: 'Direct',
            defensiveLine: 'High'
        };

        // Transfer Market State
        this.transferHistory = [];
    }

    startNewCareer(clubId) {
        const foundClub = GLOBAL_CLUBS.find(c => c.id === clubId);
        if (!foundClub) return false;

        // Deep clone club data
        this.userClub = JSON.parse(JSON.stringify(foundClub));
        this.userLeagueId = foundClub.leagueId;
        this.currentMatchday = 1;
        this.boardConfidence = 85;
        this.fanConfidence = 85;

        // Initialize League Table for all clubs in this league
        this.initLeagueSeason();

        // Welcome News item
        this.inbox = [
            {
                id: 1,
                date: '17 August 2026',
                sender: 'Board of Directors',
                title: `Welcome to ${this.userClub.name}!`,
                body: `The board and fans are delighted to appoint you as the new Manager of ${this.userClub.name}. Our objective this season is to fight for silverware and manage our €${(this.userClub.transferBudget / 1000000).toFixed(1)}M transfer budget wisely.`
            },
            {
                id: 2,
                date: '17 August 2026',
                sender: 'Head of Scouting',
                title: 'Transfer Window is OPEN!',
                body: 'The summer transfer window is currently active. Scout global talents in the Transfer Market hub to bolster our squad before Matchday 1.'
            }
        ];

        this.saveCareer();
        return true;
    }

    initLeagueSeason() {
        const leagueClubs = GLOBAL_CLUBS.filter(c => c.leagueId === this.userLeagueId);

        // Build Standings table
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

        // Generate Season Fixture Schedule
        this.fixtures = [];
        const n = leagueClubs.length;
        for (let round = 1; round <= (n - 1) * 2; round++) {
            const matchdayMatches = [];
            // Round robin pairing
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

    simulateMatchday(userScoreHome = null, userScoreAway = null) {
        const mdObj = this.fixtures.find(f => f.matchday === this.currentMatchday);
        if (!mdObj) return;

        mdObj.matches.forEach(match => {
            if (match.played) return;

            const homeClub = (match.homeId === this.userClub.id) ? this.userClub : GLOBAL_CLUBS.find(c => c.id === match.homeId) || { rating: 80 };
            const awayClub = (match.awayId === this.userClub.id) ? this.userClub : GLOBAL_CLUBS.find(c => c.id === match.awayId) || { rating: 80 };

            if ((match.homeId === this.userClub.id || match.awayId === this.userClub.id) && userScoreHome !== null && userScoreAway !== null) {
                // User played or custom result
                match.homeScore = userScoreHome;
                match.awayScore = userScoreAway;
            } else {
                // AI Simulation based on team rating + home advantage
                const ratingDiff = (homeClub.rating + 3) - awayClub.rating;
                const homeBaseGoals = Math.max(0, Math.round(Math.random() * 2 + (ratingDiff > 0 ? 1 : 0) + Math.random() * 1.5));
                const awayBaseGoals = Math.max(0, Math.round(Math.random() * 2 - (ratingDiff > 5 ? 1 : 0) + Math.random() * 1.2));

                match.homeScore = homeBaseGoals;
                match.awayScore = awayBaseGoals;
            }

            match.played = true;

            // Update Standings table
            this.updateStandingsRecord(match.homeId, match.homeScore, match.awayScore);
            this.updateStandingsRecord(match.awayId, match.awayScore, match.homeScore);
        });

        // Weekly Finances: Ticket revenue on Home games & Weekly Wage deduction
        const userMatch = mdObj.matches.find(m => m.homeId === this.userClub.id || m.awayId === this.userClub.id);
        if (userMatch) {
            let weeklyNet = 0;
            if (userMatch.homeId === this.userClub.id) {
                // Ticket Gate Receipt
                const ticketRevenue = 1500000 + Math.floor(Math.random() * 800000);
                this.userClub.transferBudget += ticketRevenue;
                weeklyNet += ticketRevenue;
            }
            // Deduct weekly squad wages
            const totalWages = this.userClub.players.reduce((sum, p) => sum + (p.wage || 50000), 0);
            this.userClub.transferBudget -= totalWages;
            weeklyNet -= totalWages;

            // Board confidence adjustments
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

        // Advance Matchday
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

    // Transfer Market: Buy Player
    buyPlayer(player, offerFee, offerWage) {
        if (!this.userClub || this.userClub.transferBudget < offerFee) {
            return { success: false, message: 'Anggaran transfer tidak mencukupi!' };
        }

        // Transfer negotiation acceptance algorithm
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

        // Deal Accepted!
        this.userClub.transferBudget -= offerFee;
        const newPlayer = { ...player, wage: offerWage };
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
            date: `Matchday ${this.currentMatchday}`,
            sender: 'Transfer Headquarters',
            title: `OFFICIAL: ${player.name} signs for ${this.userClub.name}!`,
            body: `Congratulations! ${player.name} has completed his medical and signed a contract with ${this.userClub.name} for €${(offerFee/1000000).toFixed(1)}M.`
        });

        this.saveCareer();
        return { success: true, message: `Sukses merekrut ${player.name}!` };
    }

    // Transfer Market: Sell Player
    sellPlayer(playerId) {
        const pIndex = this.userClub.players.findIndex(p => p.id === playerId);
        if (pIndex === -1) return { success: false, message: 'Pemain tidak ditemukan di skuad!' };

        const player = this.userClub.players[pIndex];
        const soldFee = Math.round(player.val * (0.9 + Math.random() * 0.25));

        this.userClub.players.splice(pIndex, 1);
        this.userClub.transferBudget += soldFee;

        this.transferHistory.unshift({
            date: `Matchday ${this.currentMatchday}`,
            type: 'OUT',
            player: player.name,
            fee: soldFee
        });

        this.inbox.unshift({
            id: Date.now(),
            date: `Matchday ${this.currentMatchday}`,
            sender: 'Transfer Headquarters',
            title: `TRANSFER: ${player.name} sold!`,
            body: `${player.name} has departed ${this.userClub.name} for an agreed transfer fee of €${(soldFee/1000000).toFixed(1)}M.`
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
