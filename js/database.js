/**
 * EA FC 27 x FM 27 Web Edition - Global Football Database
 * Complete squads with Starting XI, Bench Substitutes, Player Morale, Fitness, Market Values & Wages
 */

export const GLOBAL_LEAGUES = [
    { id: 'epl', name: 'Premier League', country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', logo: '🦁' },
    { id: 'laliga', name: 'La Liga', country: 'Spain', flag: '🇪🇸', logo: '🇪🇸' },
    { id: 'seriea', name: 'Serie A', country: 'Italy', flag: '🇮🇹', logo: '🇮🇹' },
    { id: 'bundesliga', name: 'Bundesliga', country: 'Germany', flag: '🇩🇪', logo: '🇩🇪' },
    { id: 'ligue1', name: 'Ligue 1', country: 'France', flag: '🇫🇷', logo: '🇫🇷' },
    { id: 'liga1_ina', name: 'BRI Liga 1', country: 'Indonesia', flag: '🇮🇩', logo: '🇮🇩' },
    { id: 'saudi', name: 'Saudi Pro League & World', country: 'World', flag: '🌍', logo: '⭐' },
    { id: 'international', name: 'Tim Nasional Dunia', country: 'World', flag: '🌍', logo: '🏆' }
];

export const GLOBAL_CLUBS = [
    // ==========================================
    // PREMIER LEAGUE (ENGLAND)
    // ==========================================
    {
        id: 'man_city',
        name: 'Manchester City',
        shortName: 'MCI',
        leagueId: 'epl',
        rating: 91,
        transferBudget: 180000000,
        wageBudget: 4200000,
        stadium: 'Etihad Stadium (53,400)',
        colorPrimary: '#6CABDD',
        colorSecondary: '#1C2C5B',
        formation: '4-2-3-1',
        tacticalStyle: 'Tiki-Taka',
        logo: '⛵',
        players: [
            // Starting XI
            { id: 'mci_1', name: 'Ederson', role: 'GK', isStarting: true, age: 31, ovr: 88, fitness: 100, morale: 'Superb', val: 40000000, wage: 180000, pace: 62, shoot: 30, pass: 93, dribble: 60, def: 88, phy: 80 },
            { id: 'mci_2', name: 'J. Gvardiol', role: 'LB', isStarting: true, age: 22, ovr: 85, fitness: 100, morale: 'Superb', val: 75000000, wage: 140000, pace: 80, shoot: 65, pass: 80, dribble: 80, def: 86, phy: 85 },
            { id: 'mci_3', name: 'Ruben Dias', role: 'CB', isStarting: true, age: 27, ovr: 89, fitness: 100, morale: 'Superb', val: 85000000, wage: 200000, pace: 68, shoot: 40, pass: 74, dribble: 70, def: 90, phy: 88 },
            { id: 'mci_4', name: 'M. Akanji', role: 'CB', isStarting: true, age: 29, ovr: 84, fitness: 100, morale: 'Good', val: 45000000, wage: 130000, pace: 82, shoot: 50, pass: 76, dribble: 75, def: 85, phy: 82 },
            { id: 'mci_5', name: 'Kyle Walker', role: 'RB', isStarting: true, age: 34, ovr: 84, fitness: 100, morale: 'Good', val: 22000000, wage: 160000, pace: 92, shoot: 63, pass: 78, dribble: 78, def: 82, phy: 83 },
            { id: 'mci_6', name: 'Rodri', role: 'CDM', isStarting: true, age: 28, ovr: 91, fitness: 100, morale: 'Superb', val: 120000000, wage: 240000, pace: 66, shoot: 81, pass: 87, dribble: 84, def: 88, phy: 87 },
            { id: 'mci_7', name: 'M. Kovačić', role: 'CM', isStarting: true, age: 30, ovr: 83, fitness: 100, morale: 'Good', val: 32000000, wage: 150000, pace: 76, shoot: 71, pass: 84, dribble: 86, def: 78, phy: 76 },
            { id: 'mci_8', name: 'J. Grealish', role: 'LM', isStarting: true, age: 29, ovr: 84, fitness: 100, morale: 'Good', val: 55000000, wage: 210000, pace: 78, shoot: 76, pass: 84, dribble: 88, def: 52, phy: 73 },
            { id: 'mci_9', name: 'K. De Bruyne', role: 'CAM', isStarting: true, age: 33, ovr: 91, fitness: 100, morale: 'Superb', val: 60000000, wage: 350000, pace: 72, shoot: 88, pass: 94, dribble: 87, def: 65, phy: 75 },
            { id: 'mci_10', name: 'Phil Foden', role: 'RM', isStarting: true, age: 24, ovr: 88, fitness: 100, morale: 'Superb', val: 110000000, wage: 220000, pace: 86, shoot: 85, pass: 86, dribble: 90, def: 56, phy: 64 },
            { id: 'mci_11', name: 'Erling Haaland', role: 'ST', isStarting: true, age: 24, ovr: 92, fitness: 100, morale: 'Superb', val: 180000000, wage: 400000, pace: 89, shoot: 94, pass: 68, dribble: 81, def: 45, phy: 90 },
            // Bench Substitutes
            { id: 'mci_12', name: 'S. Ortega', role: 'GK', isStarting: false, age: 31, ovr: 80, fitness: 100, morale: 'Good', val: 12000000, wage: 75000, pace: 50, shoot: 20, pass: 78, dribble: 50, def: 80, phy: 75 },
            { id: 'mci_13', name: 'John Stones', role: 'CB', isStarting: false, age: 30, ovr: 85, fitness: 100, morale: 'Good', val: 42000000, wage: 160000, pace: 72, shoot: 55, pass: 80, dribble: 77, def: 86, phy: 80 },
            { id: 'mci_14', name: 'Nathan Aké', role: 'LB', isStarting: false, age: 29, ovr: 83, fitness: 100, morale: 'Good', val: 38000000, wage: 130000, pace: 78, shoot: 52, pass: 76, dribble: 74, def: 84, phy: 80 },
            { id: 'mci_15', name: 'Bernardo Silva', role: 'CM', isStarting: false, age: 30, ovr: 88, fitness: 100, morale: 'Superb', val: 75000000, wage: 220000, pace: 76, shoot: 78, pass: 88, dribble: 91, def: 70, phy: 68 },
            { id: 'mci_16', name: 'Jérémy Doku', role: 'LW', isStarting: false, age: 22, ovr: 82, fitness: 100, morale: 'Good', val: 50000000, wage: 100000, pace: 94, shoot: 72, pass: 75, dribble: 89, def: 35, phy: 68 },
            { id: 'mci_17', name: 'Savinho', role: 'RW', isStarting: false, age: 20, ovr: 81, fitness: 100, morale: 'Good', val: 45000000, wage: 80000, pace: 89, shoot: 75, pass: 78, dribble: 86, def: 38, phy: 60 },
            { id: 'mci_18', name: 'Rico Lewis', role: 'RB', isStarting: false, age: 19, ovr: 78, fitness: 100, morale: 'Good', val: 28000000, wage: 50000, pace: 82, shoot: 60, pass: 80, dribble: 80, def: 77, phy: 66 }
        ]
    },
    {
        id: 'arsenal',
        name: 'Arsenal FC',
        shortName: 'ARS',
        leagueId: 'epl',
        rating: 88,
        transferBudget: 120000000,
        wageBudget: 3500000,
        stadium: 'Emirates Stadium (60,700)',
        colorPrimary: '#EF0107',
        colorSecondary: '#063672',
        formation: '4-3-3',
        tacticalStyle: 'Gegenpress',
        logo: '🔴⚪',
        players: [
            // Starting XI
            { id: 'ars_1', name: 'David Raya', role: 'GK', isStarting: true, age: 29, ovr: 85, fitness: 100, morale: 'Superb', val: 38000000, wage: 110000, pace: 50, shoot: 20, pass: 84, dribble: 50, def: 85, phy: 78 },
            { id: 'ars_2', name: 'Zinchenko', role: 'LB', isStarting: true, age: 27, ovr: 82, fitness: 100, morale: 'Good', val: 32000000, wage: 130000, pace: 78, shoot: 70, pass: 84, dribble: 83, def: 77, phy: 72 },
            { id: 'ars_3', name: 'Gabriel M.', role: 'CB', isStarting: true, age: 26, ovr: 87, fitness: 100, morale: 'Superb', val: 75000000, wage: 150000, pace: 72, shoot: 45, pass: 70, dribble: 68, def: 88, phy: 87 },
            { id: 'ars_4', name: 'William Saliba', role: 'CB', isStarting: true, age: 23, ovr: 88, fitness: 100, morale: 'Superb', val: 85000000, wage: 170000, pace: 83, shoot: 40, pass: 75, dribble: 75, def: 89, phy: 84 },
            { id: 'ars_5', name: 'Ben White', role: 'RB', isStarting: true, age: 26, ovr: 83, fitness: 100, morale: 'Good', val: 42000000, wage: 130000, pace: 80, shoot: 55, pass: 78, dribble: 78, def: 84, phy: 80 },
            { id: 'ars_6', name: 'Declan Rice', role: 'CDM', isStarting: true, age: 25, ovr: 88, fitness: 100, morale: 'Superb', val: 95000000, wage: 220000, pace: 76, shoot: 72, pass: 84, dribble: 81, def: 88, phy: 86 },
            { id: 'ars_7', name: 'M. Ødegaard', role: 'CAM', isStarting: true, age: 25, ovr: 89, fitness: 100, morale: 'Superb', val: 105000000, wage: 240000, pace: 78, shoot: 82, pass: 90, dribble: 89, def: 62, phy: 68 },
            { id: 'ars_8', name: 'Kai Havertz', role: 'CM', isStarting: true, age: 25, ovr: 84, fitness: 100, morale: 'Good', val: 55000000, wage: 200000, pace: 81, shoot: 81, pass: 80, dribble: 82, def: 55, phy: 78 },
            { id: 'ars_9', name: 'G. Martinelli', role: 'LW', isStarting: true, age: 23, ovr: 85, fitness: 100, morale: 'Good', val: 70000000, wage: 160000, pace: 90, shoot: 78, pass: 77, dribble: 87, def: 45, phy: 73 },
            { id: 'ars_10', name: 'G. Jesus', role: 'ST', isStarting: true, age: 27, ovr: 83, fitness: 100, morale: 'Good', val: 45000000, wage: 180000, pace: 83, shoot: 81, pass: 77, dribble: 86, def: 42, phy: 74 },
            { id: 'ars_11', name: 'Bukayo Saka', role: 'RW', isStarting: true, age: 23, ovr: 88, fitness: 100, morale: 'Superb', val: 120000000, wage: 230000, pace: 87, shoot: 84, pass: 84, dribble: 88, def: 60, phy: 77 },
            // Bench
            { id: 'ars_12', name: 'Neto', role: 'GK', isStarting: false, age: 35, ovr: 79, fitness: 100, morale: 'Good', val: 8000000, wage: 65000, pace: 45, shoot: 20, pass: 72, dribble: 45, def: 79, phy: 74 },
            { id: 'ars_13', name: 'J. Timber', role: 'CB', isStarting: false, age: 23, ovr: 81, fitness: 100, morale: 'Good', val: 38000000, wage: 90000, pace: 83, shoot: 45, pass: 78, dribble: 79, def: 82, phy: 80 },
            { id: 'ars_14', name: 'Calafiori', role: 'LB', isStarting: false, age: 22, ovr: 82, fitness: 100, morale: 'Good', val: 45000000, wage: 85000, pace: 79, shoot: 60, pass: 79, dribble: 78, def: 83, phy: 82 },
            { id: 'ars_15', name: 'M. Merino', role: 'CM', isStarting: false, age: 28, ovr: 84, fitness: 100, morale: 'Good', val: 45000000, wage: 130000, pace: 70, shoot: 76, pass: 83, dribble: 80, def: 82, phy: 84 },
            { id: 'ars_16', name: 'Trossard', role: 'LW', isStarting: false, age: 29, ovr: 83, fitness: 100, morale: 'Superb', val: 38000000, wage: 110000, pace: 82, shoot: 82, pass: 80, dribble: 84, def: 45, phy: 68 },
            { id: 'ars_17', name: 'Sterling', role: 'RW', isStarting: false, age: 29, ovr: 82, fitness: 100, morale: 'Good', val: 35000000, wage: 180000, pace: 88, shoot: 78, pass: 76, dribble: 85, def: 40, phy: 64 },
            { id: 'ars_18', name: 'Jorginho', role: 'CDM', isStarting: false, age: 32, ovr: 81, fitness: 100, morale: 'Good', val: 18000000, wage: 110000, pace: 55, shoot: 68, pass: 86, dribble: 79, def: 78, phy: 68 }
        ]
    },

    // ==========================================
    // LA LIGA (SPAIN)
    // ==========================================
    {
        id: 'real_madrid',
        name: 'Real Madrid',
        shortName: 'RMA',
        leagueId: 'laliga',
        rating: 92,
        transferBudget: 220000000,
        wageBudget: 4500000,
        stadium: 'Santiago Bernabéu (85,000)',
        colorPrimary: '#FFFFFF',
        colorSecondary: '#111827',
        formation: '4-3-3',
        tacticalStyle: 'Fluid Attacking',
        logo: '👑',
        players: [
            // Starting XI
            { id: 'rma_1', name: 'Courtois', role: 'GK', isStarting: true, age: 32, ovr: 90, fitness: 100, morale: 'Superb', val: 45000000, wage: 250000, pace: 50, shoot: 25, pass: 75, dribble: 45, def: 90, phy: 88 },
            { id: 'rma_2', name: 'F. Mendy', role: 'LB', isStarting: true, age: 29, ovr: 83, fitness: 100, morale: 'Good', val: 30000000, wage: 140000, pace: 91, shoot: 64, pass: 77, dribble: 80, def: 84, phy: 86 },
            { id: 'rma_3', name: 'A. Rüdiger', role: 'CB', isStarting: true, age: 31, ovr: 88, fitness: 100, morale: 'Superb', val: 40000000, wage: 230000, pace: 82, shoot: 55, pass: 72, dribble: 70, def: 89, phy: 90 },
            { id: 'rma_4', name: 'E. Militão', role: 'CB', isStarting: true, age: 26, ovr: 86, fitness: 100, morale: 'Superb', val: 65000000, wage: 190000, pace: 84, shoot: 52, pass: 71, dribble: 74, def: 86, phy: 84 },
            { id: 'rma_5', name: 'D. Carvajal', role: 'RB', isStarting: true, age: 32, ovr: 86, fitness: 100, morale: 'Superb', val: 25000000, wage: 180000, pace: 81, shoot: 60, pass: 81, dribble: 82, def: 85, phy: 83 },
            { id: 'rma_6', name: 'F. Valverde', role: 'CM', isStarting: true, age: 26, ovr: 89, fitness: 100, morale: 'Superb', val: 120000000, wage: 250000, pace: 89, shoot: 84, pass: 86, dribble: 84, def: 82, phy: 89 },
            { id: 'rma_7', name: 'J. Bellingham', role: 'CAM', isStarting: true, age: 21, ovr: 91, fitness: 100, morale: 'Superb', val: 180000000, wage: 300000, pace: 83, shoot: 87, pass: 88, dribble: 90, def: 80, phy: 88 },
            { id: 'rma_8', name: 'E. Camavinga', role: 'CM', isStarting: true, age: 21, ovr: 84, fitness: 100, morale: 'Good', val: 85000000, wage: 160000, pace: 82, shoot: 70, pass: 84, dribble: 85, def: 82, phy: 82 },
            { id: 'rma_9', name: 'Vinícius Jr', role: 'LW', isStarting: true, age: 24, ovr: 92, fitness: 100, morale: 'Superb', val: 180000000, wage: 380000, pace: 96, shoot: 85, pass: 83, dribble: 93, def: 35, phy: 70 },
            { id: 'rma_10', name: 'K. Mbappé', role: 'ST', isStarting: true, age: 25, ovr: 93, fitness: 100, morale: 'Superb', val: 200000000, wage: 500000, pace: 97, shoot: 92, pass: 82, dribble: 94, def: 38, phy: 80 },
            { id: 'rma_11', name: 'Rodrygo', role: 'RW', isStarting: true, age: 23, ovr: 87, fitness: 100, morale: 'Superb', val: 110000000, wage: 220000, pace: 90, shoot: 83, pass: 82, dribble: 89, def: 35, phy: 66 },
            // Bench
            { id: 'rma_12', name: 'A. Lunin', role: 'GK', isStarting: false, age: 25, ovr: 82, fitness: 100, morale: 'Good', val: 25000000, wage: 75000, pace: 52, shoot: 20, pass: 74, dribble: 45, def: 82, phy: 78 },
            { id: 'rma_13', name: 'D. Alaba', role: 'CB', isStarting: false, age: 32, ovr: 85, fitness: 100, morale: 'Good', val: 32000000, wage: 220000, pace: 78, shoot: 68, pass: 83, dribble: 79, def: 85, phy: 78 },
            { id: 'rma_14', name: 'Fran García', role: 'LB', isStarting: false, age: 25, ovr: 79, fitness: 100, morale: 'Good', val: 18000000, wage: 60000, pace: 89, shoot: 58, pass: 74, dribble: 77, def: 77, phy: 76 },
            { id: 'rma_15', name: 'A. Tchouaméni', role: 'CDM', isStarting: false, age: 24, ovr: 86, fitness: 100, morale: 'Superb', val: 90000000, wage: 190000, pace: 76, shoot: 74, pass: 82, dribble: 80, def: 86, phy: 86 },
            { id: 'rma_16', name: 'Luka Modrić', role: 'CM', isStarting: false, age: 39, ovr: 86, fitness: 100, morale: 'Superb', val: 15000000, wage: 200000, pace: 68, shoot: 78, pass: 91, dribble: 87, def: 72, phy: 66 },
            { id: 'rma_17', name: 'Brahim Díaz', role: 'CAM', isStarting: false, age: 25, ovr: 83, fitness: 100, morale: 'Good', val: 45000000, wage: 110000, pace: 84, shoot: 78, pass: 81, dribble: 86, def: 42, phy: 60 },
            { id: 'rma_18', name: 'Endrick', role: 'ST', isStarting: false, age: 18, ovr: 84, fitness: 100, morale: 'Superb', val: 65000000, wage: 90000, pace: 89, shoot: 84, pass: 72, dribble: 85, def: 40, phy: 82 },
            { id: 'rma_19', name: 'Arda Güler', role: 'CAM', isStarting: false, age: 19, ovr: 82, fitness: 100, morale: 'Good', val: 50000000, wage: 75000, pace: 78, shoot: 80, pass: 84, dribble: 86, def: 45, phy: 62 }
        ]
    },
    {
        id: 'barcelona',
        name: 'FC Barcelona',
        shortName: 'BAR',
        leagueId: 'laliga',
        rating: 89,
        transferBudget: 80000000,
        wageBudget: 3800000,
        stadium: 'Spotify Camp Nou (105,000)',
        colorPrimary: '#A50044',
        colorSecondary: '#004D98',
        formation: '4-3-3',
        tacticalStyle: 'Tiki-Taka',
        logo: '🔵🔴',
        players: [
            // Starting XI
            { id: 'bar_1', name: 'Ter Stegen', role: 'GK', isStarting: true, age: 32, ovr: 88, fitness: 100, morale: 'Superb', val: 35000000, wage: 200000, pace: 50, shoot: 20, pass: 88, dribble: 45, def: 88, phy: 82 },
            { id: 'bar_2', name: 'A. Balde', role: 'LB', isStarting: true, age: 20, ovr: 82, fitness: 100, morale: 'Good', val: 50000000, wage: 90000, pace: 92, shoot: 55, pass: 75, dribble: 81, def: 79, phy: 75 },
            { id: 'bar_3', name: 'R. Araújo', role: 'CB', isStarting: true, age: 25, ovr: 87, fitness: 100, morale: 'Superb', val: 75000000, wage: 160000, pace: 81, shoot: 52, pass: 68, dribble: 65, def: 88, phy: 88 },
            { id: 'bar_4', name: 'P. Cubarsí', role: 'CB', isStarting: true, age: 17, ovr: 82, fitness: 100, morale: 'Superb', val: 60000000, wage: 50000, pace: 74, shoot: 45, pass: 83, dribble: 75, def: 84, phy: 76 },
            { id: 'bar_5', name: 'J. Koundé', role: 'RB', isStarting: true, age: 25, ovr: 86, fitness: 100, morale: 'Superb', val: 65000000, wage: 150000, pace: 84, shoot: 50, pass: 78, dribble: 78, def: 86, phy: 81 },
            { id: 'bar_6', name: 'F. de Jong', role: 'CM', isStarting: true, age: 27, ovr: 87, fitness: 100, morale: 'Superb', val: 80000000, wage: 300000, pace: 81, shoot: 72, pass: 88, dribble: 88, def: 80, phy: 80 },
            { id: 'bar_7', name: 'Pedri', role: 'CAM', isStarting: true, age: 21, ovr: 87, fitness: 100, morale: 'Superb', val: 100000000, wage: 180000, pace: 80, shoot: 74, pass: 89, dribble: 90, def: 74, phy: 73 },
            { id: 'bar_8', name: 'Gavi', role: 'CM', isStarting: true, age: 20, ovr: 84, fitness: 100, morale: 'Superb', val: 80000000, wage: 130000, pace: 78, shoot: 70, pass: 82, dribble: 84, def: 79, phy: 82 },
            { id: 'bar_9', name: 'Raphinha', role: 'LW', isStarting: true, age: 27, ovr: 86, fitness: 100, morale: 'Superb', val: 65000000, wage: 170000, pace: 89, shoot: 83, pass: 82, dribble: 86, def: 55, phy: 74 },
            { id: 'bar_10', name: 'Lewandowski', role: 'ST', isStarting: true, age: 36, ovr: 89, fitness: 100, morale: 'Superb', val: 25000000, wage: 320000, pace: 76, shoot: 90, pass: 80, dribble: 84, def: 42, phy: 82 },
            { id: 'bar_11', name: 'Lamine Yamal', role: 'RW', isStarting: true, age: 17, ovr: 87, fitness: 100, morale: 'Superb', val: 150000000, wage: 100000, pace: 91, shoot: 81, pass: 85, dribble: 91, def: 35, phy: 58 },
            // Bench
            { id: 'bar_12', name: 'Iñaki Peña', role: 'GK', isStarting: false, age: 25, ovr: 77, fitness: 100, morale: 'Good', val: 10000000, wage: 45000, pace: 48, shoot: 20, pass: 72, dribble: 45, def: 77, phy: 73 },
            { id: 'bar_13', name: 'A. Christensen', role: 'CB', isStarting: false, age: 28, ovr: 83, fitness: 100, morale: 'Good', val: 35000000, wage: 120000, pace: 70, shoot: 40, pass: 78, dribble: 72, def: 84, phy: 78 },
            { id: 'bar_14', name: 'Iñigo Martínez', role: 'CB', isStarting: false, age: 33, ovr: 81, fitness: 100, morale: 'Good', val: 15000000, wage: 95000, pace: 68, shoot: 48, pass: 75, dribble: 68, def: 82, phy: 80 },
            { id: 'bar_15', name: 'Marc Casadó', role: 'CDM', isStarting: false, age: 21, ovr: 79, fitness: 100, morale: 'Superb', val: 28000000, wage: 40000, pace: 74, shoot: 65, pass: 81, dribble: 78, def: 80, phy: 76 },
            { id: 'bar_16', name: 'Dani Olmo', role: 'CAM', isStarting: false, age: 26, ovr: 86, fitness: 100, morale: 'Superb', val: 70000000, wage: 180000, pace: 80, shoot: 83, pass: 85, dribble: 88, def: 58, phy: 68 },
            { id: 'bar_17', name: 'Ferran Torres', role: 'ST', isStarting: false, age: 24, ovr: 82, fitness: 100, morale: 'Good', val: 35000000, wage: 110000, pace: 84, shoot: 80, pass: 78, dribble: 82, def: 45, phy: 72 },
            { id: 'bar_18', name: 'Fermín López', role: 'CM', isStarting: false, age: 21, ovr: 81, fitness: 100, morale: 'Superb', val: 38000000, wage: 55000, pace: 79, shoot: 81, pass: 78, dribble: 82, def: 65, phy: 73 }
        ]
    },

    // ==========================================
    // BRI LIGA 1 (INDONESIA)
    // ==========================================
    {
        id: 'persib',
        name: 'Persib Bandung',
        shortName: 'PSB',
        leagueId: 'liga1_ina',
        rating: 79,
        transferBudget: 4000000,
        wageBudget: 150000,
        stadium: 'Gelora Bandung Lautan Api (38,000)',
        colorPrimary: '#0055A5',
        colorSecondary: '#FFFFFF',
        formation: '4-3-3',
        tacticalStyle: 'Direct Counter-Attack',
        logo: '🔵🐯',
        players: [
            // Starting XI
            { id: 'psb_1', name: 'Kevin Mendoza', role: 'GK', isStarting: true, age: 29, ovr: 77, fitness: 100, morale: 'Superb', val: 750000, wage: 12000, pace: 55, shoot: 20, pass: 70, dribble: 45, def: 78, phy: 74 },
            { id: 'psb_2', name: 'Edo Febriansah', role: 'LB', isStarting: true, age: 27, ovr: 75, fitness: 100, morale: 'Good', val: 500000, wage: 9000, pace: 86, shoot: 66, pass: 72, dribble: 75, def: 74, phy: 73 },
            { id: 'psb_3', name: 'Nick Kuipers', role: 'CB', isStarting: true, age: 31, ovr: 78, fitness: 100, morale: 'Good', val: 650000, wage: 14000, pace: 68, shoot: 40, pass: 68, dribble: 62, def: 80, phy: 84 },
            { id: 'psb_4', name: 'Gustavo Franca', role: 'CB', isStarting: true, age: 28, ovr: 77, fitness: 100, morale: 'Good', val: 600000, wage: 12000, pace: 72, shoot: 42, pass: 67, dribble: 65, def: 78, phy: 80 },
            { id: 'psb_5', name: 'Henhen Herdiana', role: 'RB', isStarting: true, age: 28, ovr: 75, fitness: 100, morale: 'Good', val: 450000, wage: 8000, pace: 80, shoot: 55, pass: 70, dribble: 72, def: 76, phy: 75 },
            { id: 'psb_6', name: 'Marc Klok', role: 'CDM', isStarting: true, age: 31, ovr: 79, fitness: 100, morale: 'Superb', val: 850000, wage: 16000, pace: 74, shoot: 76, pass: 82, dribble: 78, def: 77, phy: 79 },
            { id: 'psb_7', name: 'Dedi Kusnandar', role: 'CM', isStarting: true, age: 33, ovr: 74, fitness: 100, morale: 'Good', val: 350000, wage: 8000, pace: 65, shoot: 62, pass: 76, dribble: 73, def: 75, phy: 74 },
            { id: 'psb_8', name: 'Tyronne del Pino', role: 'CAM', isStarting: true, age: 33, ovr: 78, fitness: 100, morale: 'Superb', val: 700000, wage: 14000, pace: 75, shoot: 78, pass: 81, dribble: 80, def: 55, phy: 70 },
            { id: 'psb_9', name: 'Ciro Alves', role: 'LW', isStarting: true, age: 35, ovr: 80, fitness: 100, morale: 'Superb', val: 800000, wage: 18000, pace: 88, shoot: 83, pass: 78, dribble: 85, def: 48, phy: 80 },
            { id: 'psb_10', name: 'David da Silva', role: 'ST', isStarting: true, age: 34, ovr: 81, fitness: 100, morale: 'Superb', val: 950000, wage: 20000, pace: 82, shoot: 86, pass: 70, dribble: 80, def: 40, phy: 86 },
            { id: 'psb_11', name: 'Beckham Putra', role: 'RW', isStarting: true, age: 22, ovr: 76, fitness: 100, morale: 'Good', val: 650000, wage: 9000, pace: 84, shoot: 73, pass: 78, dribble: 82, def: 50, phy: 64 },
            // Bench
            { id: 'psb_12', name: 'Teja Paku Alam', role: 'GK', isStarting: false, age: 30, ovr: 75, fitness: 100, morale: 'Good', val: 400000, wage: 8000, pace: 50, shoot: 20, pass: 68, dribble: 45, def: 76, phy: 72 },
            { id: 'psb_13', name: 'Victor Igbonefo', role: 'CB', isStarting: false, age: 38, ovr: 72, fitness: 100, morale: 'Good', val: 150000, wage: 6000, pace: 55, shoot: 35, pass: 65, dribble: 55, def: 75, phy: 80 },
            { id: 'psb_14', name: 'Rezaldi Hehanussa', role: 'LB', isStarting: false, age: 28, ovr: 74, fitness: 100, morale: 'Good', val: 400000, wage: 7500, pace: 78, shoot: 60, pass: 74, dribble: 73, def: 74, phy: 73 },
            { id: 'psb_15', name: 'Rachmat Irianto', role: 'CDM', isStarting: false, age: 25, ovr: 76, fitness: 100, morale: 'Good', val: 550000, wage: 9000, pace: 75, shoot: 55, pass: 74, dribble: 72, def: 78, phy: 79 },
            { id: 'psb_16', name: 'Adam Alis', role: 'CM', isStarting: false, age: 30, ovr: 76, fitness: 100, morale: 'Good', val: 500000, wage: 9000, pace: 76, shoot: 72, pass: 78, dribble: 77, def: 66, phy: 70 },
            { id: 'psb_17', name: 'Ryan Kurnia', role: 'RW', isStarting: false, age: 28, ovr: 73, fitness: 100, morale: 'Good', val: 300000, wage: 6000, pace: 84, shoot: 68, pass: 70, dribble: 74, def: 45, phy: 68 },
            { id: 'psb_18', name: 'Dimas Drajad', role: 'ST', isStarting: false, age: 27, ovr: 76, fitness: 100, morale: 'Good', val: 550000, wage: 10000, pace: 80, shoot: 78, pass: 72, dribble: 75, def: 42, phy: 77 }
        ]
    },
    {
        id: 'persija',
        name: 'Persija Jakarta',
        shortName: 'PSJ',
        leagueId: 'liga1_ina',
        rating: 78,
        transferBudget: 4200000,
        wageBudget: 160000,
        stadium: 'Jakarta International Stadium (82,000)',
        colorPrimary: '#FF4500',
        colorSecondary: '#FFFFFF',
        formation: '3-4-3',
        tacticalStyle: 'Fluid Attacking',
        logo: '🔴🐯',
        players: [
            // Starting XI
            { id: 'psj_1', name: 'Andritany', role: 'GK', isStarting: true, age: 32, ovr: 77, fitness: 100, morale: 'Superb', val: 550000, wage: 11000, pace: 55, shoot: 20, pass: 72, dribble: 48, def: 78, phy: 74 },
            { id: 'psj_2', name: 'Rizky Ridho', role: 'CB', isStarting: true, age: 22, ovr: 81, fitness: 100, morale: 'Superb', val: 1200000, wage: 15000, pace: 74, shoot: 42, pass: 73, dribble: 70, def: 82, phy: 80 },
            { id: 'psj_3', name: 'Ondrej Kudela', role: 'CB', isStarting: true, age: 37, ovr: 78, fitness: 100, morale: 'Good', val: 400000, wage: 15000, pace: 60, shoot: 45, pass: 74, dribble: 65, def: 80, phy: 81 },
            { id: 'psj_4', name: 'Muhammad Ferarri', role: 'CB', isStarting: true, age: 21, ovr: 76, fitness: 100, morale: 'Good', val: 700000, wage: 9000, pace: 76, shoot: 40, pass: 68, dribble: 66, def: 77, phy: 78 },
            { id: 'psj_5', name: 'Firza Andika', role: 'LWB', isStarting: true, age: 25, ovr: 75, fitness: 100, morale: 'Good', val: 500000, wage: 8000, pace: 84, shoot: 68, pass: 73, dribble: 75, def: 74, phy: 74 },
            { id: 'psj_6', name: 'Maciej Gajos', role: 'CM', isStarting: true, age: 33, ovr: 78, fitness: 100, morale: 'Good', val: 650000, wage: 14000, pace: 72, shoot: 78, pass: 82, dribble: 77, def: 70, phy: 74 },
            { id: 'psj_7', name: 'Hanif Sjahbandi', role: 'CM', isStarting: true, age: 27, ovr: 75, fitness: 100, morale: 'Good', val: 450000, wage: 8000, pace: 74, shoot: 68, pass: 75, dribble: 74, def: 76, phy: 77 },
            { id: 'psj_8', name: 'Rio Fahmi', role: 'RWB', isStarting: true, age: 22, ovr: 75, fitness: 100, morale: 'Good', val: 550000, wage: 8000, pace: 85, shoot: 58, pass: 72, dribble: 74, def: 75, phy: 74 },
            { id: 'psj_9', name: 'Ryo Matsumura', role: 'LW', isStarting: true, age: 30, ovr: 79, fitness: 100, morale: 'Superb', val: 850000, wage: 16000, pace: 85, shoot: 79, pass: 79, dribble: 83, def: 52, phy: 70 },
            { id: 'psj_10', name: 'Gustavo Almeida', role: 'ST', isStarting: true, age: 28, ovr: 80, fitness: 100, morale: 'Superb', val: 950000, wage: 18000, pace: 82, shoot: 84, pass: 72, dribble: 80, def: 42, phy: 82 },
            { id: 'psj_11', name: 'Witan Sulaeman', role: 'RW', isStarting: true, age: 22, ovr: 76, fitness: 100, morale: 'Good', val: 650000, wage: 9000, pace: 84, shoot: 74, pass: 77, dribble: 81, def: 48, phy: 66 },
            // Bench
            { id: 'psj_12', name: 'Cahya Supriadi', role: 'GK', isStarting: false, age: 21, ovr: 72, fitness: 100, morale: 'Good', val: 250000, wage: 4000, pace: 52, shoot: 20, pass: 65, dribble: 42, def: 73, phy: 70 },
            { id: 'psj_13', name: 'Hansamu Yama', role: 'CB', isStarting: false, age: 29, ovr: 74, fitness: 100, morale: 'Good', val: 350000, wage: 7000, pace: 68, shoot: 38, pass: 68, dribble: 60, def: 76, phy: 78 },
            { id: 'psj_14', name: 'Ramon Bueno', role: 'CDM', isStarting: false, age: 29, ovr: 76, fitness: 100, morale: 'Good', val: 500000, wage: 11000, pace: 72, shoot: 60, pass: 76, dribble: 73, def: 77, phy: 78 },
            { id: 'psj_15', name: 'Syahrian Abimanyu', role: 'CM', isStarting: false, age: 25, ovr: 74, fitness: 100, morale: 'Good', val: 400000, wage: 7500, pace: 73, shoot: 70, pass: 79, dribble: 75, def: 68, phy: 70 },
            { id: 'psj_16', name: 'Riko Simanjuntak', role: 'RW', isStarting: false, age: 32, ovr: 76, fitness: 100, morale: 'Good', val: 450000, wage: 9000, pace: 89, shoot: 68, pass: 75, dribble: 82, def: 44, phy: 58 },
            { id: 'psj_17', name: 'Marko Simic', role: 'ST', isStarting: false, age: 36, ovr: 76, fitness: 100, morale: 'Good', val: 350000, wage: 12000, pace: 65, shoot: 82, pass: 65, dribble: 70, def: 38, phy: 84 }
        ]
    },

    // ==========================================
    // SAUDI PRO LEAGUE & WORLD STARS
    // ==========================================
    {
        id: 'al_nassr',
        name: 'Al Nassr',
        shortName: 'NAS',
        leagueId: 'saudi',
        rating: 86,
        transferBudget: 150000000,
        wageBudget: 5000000,
        stadium: 'Al-Awwal Park (25,000)',
        colorPrimary: '#FFDD00',
        colorSecondary: '#002B7F',
        formation: '4-2-3-1',
        tacticalStyle: 'Direct Counter-Attack',
        logo: '🟡👑',
        players: [
            { id: 'nas_1', name: 'Bento', role: 'GK', isStarting: true, age: 25, ovr: 83, fitness: 100, morale: 'Superb', val: 25000000, wage: 100000, pace: 55, shoot: 20, pass: 75, dribble: 50, def: 83, phy: 80 },
            { id: 'nas_2', name: 'A. Telles', role: 'LB', isStarting: true, age: 31, ovr: 80, fitness: 100, morale: 'Good', val: 12000000, wage: 110000, pace: 78, shoot: 74, pass: 82, dribble: 79, def: 78, phy: 74 },
            { id: 'nas_3', name: 'Aymeric Laporte', role: 'CB', isStarting: true, age: 30, ovr: 85, fitness: 100, morale: 'Superb', val: 35000000, wage: 250000, pace: 68, shoot: 50, pass: 79, dribble: 70, def: 87, phy: 82 },
            { id: 'nas_4', name: 'Ali Lajami', role: 'CB', isStarting: true, age: 28, ovr: 75, fitness: 100, morale: 'Good', val: 3000000, wage: 40000, pace: 72, shoot: 35, pass: 66, dribble: 62, def: 76, phy: 78 },
            { id: 'nas_5', name: 'Sultan Al-Ghannam', role: 'RB', isStarting: true, age: 30, ovr: 77, fitness: 100, morale: 'Good', val: 4500000, wage: 50000, pace: 82, shoot: 60, pass: 76, dribble: 74, def: 76, phy: 74 },
            { id: 'nas_6', name: 'Marcelo Brozović', role: 'CDM', isStarting: true, age: 31, ovr: 84, fitness: 100, morale: 'Superb', val: 25000000, wage: 300000, pace: 68, shoot: 75, pass: 86, dribble: 82, def: 83, phy: 84 },
            { id: 'nas_7', name: 'Otávio', role: 'CM', isStarting: true, age: 29, ovr: 83, fitness: 100, morale: 'Superb', val: 30000000, wage: 220000, pace: 78, shoot: 76, pass: 84, dribble: 85, def: 74, phy: 78 },
            { id: 'nas_8', name: 'Sadio Mané', role: 'LW', isStarting: true, age: 32, ovr: 85, fitness: 100, morale: 'Superb', val: 30000000, wage: 400000, pace: 89, shoot: 83, pass: 78, dribble: 86, def: 45, phy: 76 },
            { id: 'nas_9', name: 'Anderson Talisca', role: 'CAM', isStarting: true, age: 30, ovr: 83, fitness: 100, morale: 'Superb', val: 22000000, wage: 200000, pace: 81, shoot: 86, pass: 79, dribble: 83, def: 50, phy: 78 },
            { id: 'nas_10', name: 'Cristiano Ronaldo', role: 'ST', isStarting: true, age: 39, ovr: 88, fitness: 100, morale: 'Superb', val: 20000000, wage: 1000000, pace: 80, shoot: 92, pass: 78, dribble: 82, def: 35, phy: 80 },
            { id: 'nas_11', name: 'Abdulrahman Ghareeb', role: 'RW', isStarting: true, age: 27, ovr: 77, fitness: 100, morale: 'Good', val: 5000000, wage: 45000, pace: 86, shoot: 72, pass: 74, dribble: 80, def: 40, phy: 60 },
            // Bench
            { id: 'nas_12', name: 'Nawaf Al-Aqidi', role: 'GK', isStarting: false, age: 24, ovr: 73, fitness: 100, morale: 'Good', val: 1500000, wage: 25000, pace: 50, shoot: 20, pass: 66, dribble: 42, def: 74, phy: 70 },
            { id: 'nas_13', name: 'Ali Al-Hassan', role: 'CM', isStarting: false, age: 27, ovr: 74, fitness: 100, morale: 'Good', val: 2000000, wage: 30000, pace: 70, shoot: 65, pass: 76, dribble: 73, def: 74, phy: 75 },
            { id: 'nas_14', name: 'Mohammed Maran', role: 'ST', isStarting: false, age: 23, ovr: 72, fitness: 100, morale: 'Good', val: 1800000, wage: 20000, pace: 82, shoot: 72, pass: 66, dribble: 74, def: 35, phy: 70 }
        ]
    },

    // ==========================================
    // TIM NASIONAL INDONESIA
    // ==========================================
    {
        id: 'indonesia',
        name: 'Indonesia',
        shortName: 'INA',
        leagueId: 'international',
        rating: 84,
        transferBudget: 0,
        wageBudget: 0,
        stadium: 'Gelora Bung Karno Stadium (78,000)',
        colorPrimary: '#FF0000',
        colorSecondary: '#FFFFFF',
        formation: '3-5-2',
        tacticalStyle: 'Gegenpress',
        logo: '🦅',
        players: [
            // Starting XI
            { id: 'ina_1', name: 'Maarten Paes', role: 'GK', isStarting: true, age: 26, ovr: 85, fitness: 100, morale: 'Superb', val: 6500000, wage: 40000, pace: 60, shoot: 20, pass: 75, dribble: 50, def: 86, phy: 84 },
            { id: 'ina_2', name: 'Jay Idzes', role: 'CB', isStarting: true, age: 24, ovr: 85, fitness: 100, morale: 'Superb', val: 8500000, wage: 45000, pace: 78, shoot: 50, pass: 78, dribble: 75, def: 86, phy: 85 },
            { id: 'ina_3', name: 'Jordi Amat', role: 'CB', isStarting: true, age: 32, ovr: 82, fitness: 100, morale: 'Good', val: 2000000, wage: 30000, pace: 68, shoot: 55, pass: 80, dribble: 72, def: 83, phy: 82 },
            { id: 'ina_4', name: 'Rizky Ridho', role: 'CB', isStarting: true, age: 22, ovr: 81, fitness: 100, morale: 'Superb', val: 2500000, wage: 20000, pace: 74, shoot: 42, pass: 73, dribble: 70, def: 82, phy: 80 },
            { id: 'ina_5', name: 'Calvin Verdonk', role: 'LWB', isStarting: true, age: 27, ovr: 83, fitness: 100, morale: 'Superb', val: 4500000, wage: 35000, pace: 84, shoot: 68, pass: 81, dribble: 80, def: 82, phy: 80 },
            { id: 'ina_6', name: 'Thom Haye', role: 'CDM', isStarting: true, age: 29, ovr: 84, fitness: 100, morale: 'Superb', val: 5000000, wage: 40000, pace: 70, shoot: 78, pass: 87, dribble: 81, def: 79, phy: 78 },
            { id: 'ina_7', name: 'Marselino Ferdinan', role: 'CM', isStarting: true, age: 20, ovr: 82, fitness: 100, morale: 'Superb', val: 4000000, wage: 25000, pace: 85, shoot: 77, pass: 80, dribble: 86, def: 60, phy: 68 },
            { id: 'ina_8', name: 'Ivar Jenner', role: 'CM', isStarting: true, age: 20, ovr: 80, fitness: 100, morale: 'Good', val: 2500000, wage: 20000, pace: 76, shoot: 70, pass: 81, dribble: 79, def: 78, phy: 76 },
            { id: 'ina_9', name: 'Sandy Walsh', role: 'RWB', isStarting: true, age: 29, ovr: 82, fitness: 100, morale: 'Good', val: 3500000, wage: 30000, pace: 80, shoot: 65, pass: 78, dribble: 77, def: 81, phy: 82 },
            { id: 'ina_10', name: 'Ragnar Oratmangoen', role: 'ST', isStarting: true, age: 26, ovr: 83, fitness: 100, morale: 'Superb', val: 4500000, wage: 35000, pace: 85, shoot: 81, pass: 78, dribble: 84, def: 55, phy: 78 },
            { id: 'ina_11', name: 'Rafael Struick', role: 'ST', isStarting: true, age: 21, ovr: 81, fitness: 100, morale: 'Superb', val: 3000000, wage: 22000, pace: 84, shoot: 79, pass: 75, dribble: 82, def: 45, phy: 74 },
            // Bench
            { id: 'ina_12', name: 'Ernando Ari', role: 'GK', isStarting: false, age: 22, ovr: 77, fitness: 100, morale: 'Good', val: 1200000, wage: 15000, pace: 58, shoot: 20, pass: 70, dribble: 48, def: 78, phy: 74 },
            { id: 'ina_13', name: 'Justin Hubner', role: 'CB', isStarting: false, age: 20, ovr: 80, fitness: 100, morale: 'Good', val: 2800000, wage: 22000, pace: 77, shoot: 55, pass: 74, dribble: 72, def: 82, phy: 84 },
            { id: 'ina_14', name: 'Pratama Arhan', role: 'LB', isStarting: false, age: 22, ovr: 78, fitness: 100, morale: 'Good', val: 1500000, wage: 16000, pace: 86, shoot: 65, pass: 75, dribble: 76, def: 75, phy: 78 },
            { id: 'ina_15', name: 'Nathan Tjoe-A-On', role: 'CDM', isStarting: false, age: 22, ovr: 80, fitness: 100, morale: 'Superb', val: 2600000, wage: 22000, pace: 78, shoot: 68, pass: 80, dribble: 78, def: 79, phy: 80 },
            { id: 'ina_16', name: 'Eliano Reijnders', role: 'CAM', isStarting: false, age: 23, ovr: 80, fitness: 100, morale: 'Good', val: 2800000, wage: 25000, pace: 82, shoot: 76, pass: 80, dribble: 81, def: 64, phy: 72 },
            { id: 'ina_17', name: 'Egy Maulana Vikri', role: 'RW', isStarting: false, age: 24, ovr: 78, fitness: 100, morale: 'Good', val: 1800000, wage: 18000, pace: 84, shoot: 76, pass: 76, dribble: 82, def: 48, phy: 66 },
            { id: 'ina_18', name: 'Witan Sulaeman', role: 'LW', isStarting: false, age: 22, ovr: 77, fitness: 100, morale: 'Good', val: 1600000, wage: 16000, pace: 83, shoot: 74, pass: 76, dribble: 80, def: 46, phy: 65 },
            { id: 'ina_19', name: 'Hokky Caraka', role: 'ST', isStarting: false, age: 19, ovr: 75, fitness: 100, morale: 'Good', val: 1200000, wage: 12000, pace: 83, shoot: 75, pass: 68, dribble: 75, def: 40, phy: 76 }
        ]
    }
];
