/**
 * EA FC 27 x FM 27 Web Edition - Global Football Database
 * Complete database containing Premier League, La Liga, Serie A, Bundesliga, Ligue 1, Liga 1 Indonesia & National Teams
 */

export const GLOBAL_LEAGUES = [
    { id: 'epl', name: 'Premier League', country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', logo: '🦁' },
    { id: 'laliga', name: 'La Liga', country: 'Spain', flag: '🇪🇸', logo: '🇪🇸' },
    { id: 'seriea', name: 'Serie A', country: 'Italy', flag: '🇮🇹', logo: '🇮🇹' },
    { id: 'bundesliga', name: 'Bundesliga', country: 'Germany', flag: '🇩🇪', logo: '🇩🇪' },
    { id: 'ligue1', name: 'Ligue 1', country: 'France', flag: '🇫🇷', logo: '🇫🇷' },
    { id: 'liga1_ina', name: 'BRI Liga 1', country: 'Indonesia', flag: '🇮🇩', logo: '🇮🇩' },
    { id: 'international', name: 'International / Timnas', country: 'World', flag: '🌍', logo: '🏆' }
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
            { id: 'mci_1', name: 'Ederson', role: 'GK', age: 31, ovr: 88, pot: 88, val: 40000000, wage: 180000, pace: 62, shoot: 30, pass: 93, dribble: 60, def: 88, phy: 80, skin: '#f1c27d', hair: '#111' },
            { id: 'mci_2', name: 'J. Gvardiol', role: 'LB', age: 22, ovr: 85, pot: 90, val: 75000000, wage: 140000, pace: 80, shoot: 65, pass: 80, dribble: 80, def: 86, phy: 85, skin: '#f1c27d', hair: '#3a2000' },
            { id: 'mci_3', name: 'Ruben Dias', role: 'CB', age: 27, ovr: 89, pot: 90, val: 85000000, wage: 200000, pace: 68, shoot: 40, pass: 74, dribble: 70, def: 90, phy: 88, skin: '#f1c27d', hair: '#2b1d0c' },
            { id: 'mci_4', name: 'M. Akanji', role: 'CB', age: 29, ovr: 84, pot: 84, val: 45000000, wage: 130000, pace: 82, shoot: 50, pass: 76, dribble: 75, def: 85, phy: 82, skin: '#8d5524', hair: '#111' },
            { id: 'mci_5', name: 'Kyle Walker', role: 'RB', age: 34, ovr: 84, pot: 84, val: 22000000, wage: 160000, pace: 92, shoot: 63, pass: 78, dribble: 78, def: 82, phy: 83, skin: '#8d5524', hair: '#111' },
            { id: 'mci_6', name: 'Rodri', role: 'CDM', age: 28, ovr: 91, pot: 92, val: 120000000, wage: 240000, pace: 66, shoot: 81, pass: 87, dribble: 84, def: 88, phy: 87, skin: '#f1c27d', hair: '#2b1d0c' },
            { id: 'mci_7', name: 'M. Kovačić', role: 'CM', age: 30, ovr: 83, pot: 83, val: 32000000, wage: 150000, pace: 76, shoot: 71, pass: 84, dribble: 86, def: 78, phy: 76, skin: '#f1c27d', hair: '#2b1d0c' },
            { id: 'mci_8', name: 'J. Grealish', role: 'LM', age: 29, ovr: 84, pot: 84, val: 55000000, wage: 210000, pace: 78, shoot: 76, pass: 84, dribble: 88, def: 52, phy: 73, skin: '#f1c27d', hair: '#553311' },
            { id: 'mci_9', name: 'K. De Bruyne', role: 'CAM', age: 33, ovr: 91, pot: 91, val: 60000000, wage: 350000, pace: 72, shoot: 88, pass: 94, dribble: 87, def: 65, phy: 75, skin: '#ffdbac', hair: '#d48b38' },
            { id: 'mci_10', name: 'Phil Foden', role: 'RM', age: 24, ovr: 88, pot: 92, val: 110000000, wage: 220000, pace: 86, shoot: 85, pass: 86, dribble: 90, def: 56, phy: 64, skin: '#ffdbac', hair: '#2b1d0c' },
            { id: 'mci_11', name: 'Erling Haaland', role: 'ST', age: 24, ovr: 92, pot: 95, val: 180000000, wage: 400000, pace: 89, shoot: 94, pass: 68, dribble: 81, def: 45, phy: 90, skin: '#ffdbac', hair: '#e6c280' }
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
            { id: 'ars_1', name: 'David Raya', role: 'GK', age: 29, ovr: 85, pot: 86, val: 38000000, wage: 110000, pace: 50, shoot: 20, pass: 84, dribble: 50, def: 85, phy: 78, skin: '#f1c27d', hair: '#111' },
            { id: 'ars_2', name: 'Zinchenko', role: 'LB', age: 27, ovr: 82, pot: 82, val: 32000000, wage: 130000, pace: 78, shoot: 70, pass: 84, dribble: 83, def: 77, phy: 72, skin: '#ffdbac', hair: '#e6c280' },
            { id: 'ars_3', name: 'Gabriel M.', role: 'CB', age: 26, ovr: 87, pot: 89, val: 75000000, wage: 150000, pace: 72, shoot: 45, pass: 70, dribble: 68, def: 88, phy: 87, skin: '#4a3000', hair: '#111' },
            { id: 'ars_4', name: 'William Saliba', role: 'CB', age: 23, ovr: 88, pot: 92, val: 85000000, wage: 170000, pace: 83, shoot: 40, pass: 75, dribble: 75, def: 89, phy: 84, skin: '#4a3000', hair: '#111' },
            { id: 'ars_5', name: 'Ben White', role: 'RB', age: 26, ovr: 83, pot: 84, val: 42000000, wage: 130000, pace: 80, shoot: 55, pass: 78, dribble: 78, def: 84, phy: 80, skin: '#ffdbac', hair: '#553311' },
            { id: 'ars_6', name: 'Declan Rice', role: 'CDM', age: 25, ovr: 88, pot: 91, val: 95000000, wage: 220000, pace: 76, shoot: 72, pass: 84, dribble: 81, def: 88, phy: 86, skin: '#ffdbac', hair: '#2b1d0c' },
            { id: 'ars_7', name: 'M. Ødegaard', role: 'CAM', age: 25, ovr: 89, pot: 91, val: 105000000, wage: 240000, pace: 78, shoot: 82, pass: 90, dribble: 89, def: 62, phy: 68, skin: '#ffdbac', hair: '#e6c280' },
            { id: 'ars_8', name: 'Kai Havertz', role: 'CM', age: 25, ovr: 84, pot: 86, val: 55000000, wage: 200000, pace: 81, shoot: 81, pass: 80, dribble: 82, def: 55, phy: 78, skin: '#ffdbac', hair: '#2b1d0c' },
            { id: 'ars_9', name: 'G. Martinelli', role: 'LW', age: 23, ovr: 85, pot: 89, val: 70000000, wage: 160000, pace: 90, shoot: 78, pass: 77, dribble: 87, def: 45, phy: 73, skin: '#8d5524', hair: '#111' },
            { id: 'ars_10', name: 'G. Jesus', role: 'ST', age: 27, ovr: 83, pot: 84, val: 45000000, wage: 180000, pace: 83, shoot: 81, pass: 77, dribble: 86, def: 42, phy: 74, skin: '#8d5524', hair: '#111' },
            { id: 'ars_11', name: 'Bukayo Saka', role: 'RW', age: 23, ovr: 88, pot: 92, val: 120000000, wage: 230000, pace: 87, shoot: 84, pass: 84, dribble: 88, def: 60, phy: 77, skin: '#4a3000', hair: '#111' }
        ]
    },
    {
        id: 'liverpool',
        name: 'Liverpool FC',
        shortName: 'LIV',
        leagueId: 'epl',
        rating: 89,
        transferBudget: 110000000,
        wageBudget: 3400000,
        stadium: 'Anfield (61,200)',
        colorPrimary: '#C8102E',
        colorSecondary: '#00B2A9',
        formation: '4-3-3',
        tacticalStyle: 'Gegenpress',
        logo: '🔴',
        players: [
            { id: 'liv_1', name: 'Alisson', role: 'GK', age: 31, ovr: 89, pot: 89, val: 45000000, wage: 200000, pace: 55, shoot: 20, pass: 85, dribble: 50, def: 89, phy: 84, skin: '#f1c27d', hair: '#3a2000' },
            { id: 'liv_2', name: 'Robertson', role: 'LB', age: 30, ovr: 85, pot: 85, val: 35000000, wage: 160000, pace: 82, shoot: 62, pass: 81, dribble: 80, def: 83, phy: 79, skin: '#ffdbac', hair: '#2b1d0c' },
            { id: 'liv_3', name: 'Van Dijk', role: 'CB', age: 33, ovr: 89, pot: 89, val: 45000000, wage: 250000, pace: 78, shoot: 60, pass: 72, dribble: 72, def: 91, phy: 89, skin: '#8d5524', hair: '#111' },
            { id: 'liv_4', name: 'Konaté', role: 'CB', age: 25, ovr: 84, pot: 87, val: 50000000, wage: 120000, pace: 80, shoot: 35, pass: 66, dribble: 68, def: 85, phy: 86, skin: '#3a2000', hair: '#111' },
            { id: 'liv_5', name: 'Alexander-Arnold', role: 'RB', age: 25, ovr: 87, pot: 90, val: 80000000, wage: 210000, pace: 76, shoot: 79, pass: 92, dribble: 82, def: 80, phy: 73, skin: '#8d5524', hair: '#111' },
            { id: 'liv_6', name: 'Mac Allister', role: 'CM', age: 25, ovr: 86, pot: 88, val: 75000000, wage: 170000, pace: 75, shoot: 81, pass: 86, dribble: 84, def: 78, phy: 78, skin: '#ffdbac', hair: '#d48b38' },
            { id: 'liv_7', name: 'Szoboszlai', role: 'CM', age: 23, ovr: 84, pot: 88, val: 65000000, wage: 140000, pace: 83, shoot: 84, pass: 83, dribble: 84, def: 65, phy: 77, skin: '#ffdbac', hair: '#2b1d0c' },
            { id: 'liv_8', name: 'Gravenberch', role: 'CDM', age: 22, ovr: 82, pot: 87, val: 45000000, wage: 110000, pace: 78, shoot: 72, pass: 80, dribble: 84, def: 76, phy: 80, skin: '#3a2000', hair: '#111' },
            { id: 'liv_9', name: 'Luis Díaz', role: 'LW', age: 27, ovr: 85, pot: 85, val: 65000000, wage: 160000, pace: 90, shoot: 80, pass: 76, dribble: 88, def: 42, phy: 74, skin: '#8d5524', hair: '#111' },
            { id: 'liv_10', name: 'Darwin Núñez', role: 'ST', age: 25, ovr: 83, pot: 86, val: 60000000, wage: 150000, pace: 90, shoot: 82, pass: 70, dribble: 79, def: 42, phy: 86, skin: '#8d5524', hair: '#111' },
            { id: 'liv_11', name: 'Mohamed Salah', role: 'RW', age: 32, ovr: 89, pot: 89, val: 65000000, wage: 350000, pace: 88, shoot: 88, pass: 82, dribble: 87, def: 45, phy: 76, skin: '#8d5524', hair: '#111' }
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
            { id: 'rma_1', name: 'Courtois', role: 'GK', age: 32, ovr: 90, pot: 90, val: 45000000, wage: 250000, pace: 50, shoot: 25, pass: 75, dribble: 45, def: 90, phy: 88, skin: '#f1c27d', hair: '#2b1d0c' },
            { id: 'rma_2', name: 'F. Mendy', role: 'LB', age: 29, ovr: 83, pot: 83, val: 30000000, wage: 140000, pace: 91, shoot: 64, pass: 77, dribble: 80, def: 84, phy: 86, skin: '#4a3000', hair: '#111' },
            { id: 'rma_3', name: 'A. Rüdiger', role: 'CB', age: 31, ovr: 88, pot: 88, val: 40000000, wage: 230000, pace: 82, shoot: 55, pass: 72, dribble: 70, def: 89, phy: 90, skin: '#3a2000', hair: '#111' },
            { id: 'rma_4', name: 'E. Militão', role: 'CB', age: 26, ovr: 86, pot: 89, val: 65000000, wage: 190000, pace: 84, shoot: 52, pass: 71, dribble: 74, def: 86, phy: 84, skin: '#8d5524', hair: '#111' },
            { id: 'rma_5', name: 'D. Carvajal', role: 'RB', age: 32, ovr: 86, pot: 86, val: 25000000, wage: 180000, pace: 81, shoot: 60, pass: 81, dribble: 82, def: 85, phy: 83, skin: '#f1c27d', hair: '#2b1d0c' },
            { id: 'rma_6', name: 'F. Valverde', role: 'CM', age: 26, ovr: 89, pot: 91, val: 120000000, wage: 250000, pace: 89, shoot: 84, pass: 86, dribble: 84, def: 82, phy: 89, skin: '#f1c27d', hair: '#553311' },
            { id: 'rma_7', name: 'J. Bellingham', role: 'CAM', age: 21, ovr: 91, pot: 95, val: 180000000, wage: 300000, pace: 83, shoot: 87, pass: 88, dribble: 90, def: 80, phy: 88, skin: '#8d5524', hair: '#111' },
            { id: 'rma_8', name: 'E. Camavinga', role: 'CM', age: 21, ovr: 84, pot: 90, val: 85000000, wage: 160000, pace: 82, shoot: 70, pass: 84, dribble: 85, def: 82, phy: 82, skin: '#3a2000', hair: '#111' },
            { id: 'rma_9', name: 'Vinícius Jr', role: 'LW', age: 24, ovr: 92, pot: 95, val: 180000000, wage: 380000, pace: 96, shoot: 85, pass: 83, dribble: 93, def: 35, phy: 70, skin: '#4a3000', hair: '#111' },
            { id: 'rma_10', name: 'K. Mbappé', role: 'ST', age: 25, ovr: 93, pot: 95, val: 200000000, wage: 500000, pace: 97, shoot: 92, pass: 82, dribble: 94, def: 38, phy: 80, skin: '#8d5524', hair: '#111' },
            { id: 'rma_11', name: 'Rodrygo', role: 'RW', age: 23, ovr: 87, pot: 91, val: 110000000, wage: 220000, pace: 90, shoot: 83, pass: 82, dribble: 89, def: 35, phy: 66, skin: '#8d5524', hair: '#111' }
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
            { id: 'bar_1', name: 'Ter Stegen', role: 'GK', age: 32, ovr: 88, pot: 88, val: 35000000, wage: 200000, pace: 50, shoot: 20, pass: 88, dribble: 45, def: 88, phy: 82, skin: '#f1c27d', hair: '#d48b38' },
            { id: 'bar_2', name: 'A. Balde', role: 'LB', age: 20, ovr: 82, pot: 88, val: 50000000, wage: 90000, pace: 92, shoot: 55, pass: 75, dribble: 81, def: 79, phy: 75, skin: '#4a3000', hair: '#111' },
            { id: 'bar_3', name: 'R. Araújo', role: 'CB', age: 25, ovr: 87, pot: 90, val: 75000000, wage: 160000, pace: 81, shoot: 52, pass: 68, dribble: 65, def: 88, phy: 88, skin: '#8d5524', hair: '#111' },
            { id: 'bar_4', name: 'P. Cubarsí', role: 'CB', age: 17, ovr: 82, pot: 92, val: 60000000, wage: 50000, pace: 74, shoot: 45, pass: 83, dribble: 75, def: 84, phy: 76, skin: '#f1c27d', hair: '#3a2000' },
            { id: 'bar_5', name: 'J. Koundé', role: 'RB', age: 25, ovr: 86, pot: 88, val: 65000000, wage: 150000, pace: 84, shoot: 50, pass: 78, dribble: 78, def: 86, phy: 81, skin: '#4a3000', hair: '#111' },
            { id: 'bar_6', name: 'F. de Jong', role: 'CM', age: 27, ovr: 87, pot: 88, val: 80000000, wage: 300000, pace: 81, shoot: 72, pass: 88, dribble: 88, def: 80, phy: 80, skin: '#ffdbac', hair: '#e6c280' },
            { id: 'bar_7', name: 'Pedri', role: 'CAM', age: 21, ovr: 87, pot: 93, val: 100000000, wage: 180000, pace: 80, shoot: 74, pass: 89, dribble: 90, def: 74, phy: 73, skin: '#f1c27d', hair: '#2b1d0c' },
            { id: 'bar_8', name: 'Gavi', role: 'CM', age: 20, ovr: 84, pot: 91, val: 80000000, wage: 130000, pace: 78, shoot: 70, pass: 82, dribble: 84, def: 79, phy: 82, skin: '#f1c27d', hair: '#2b1d0c' },
            { id: 'bar_9', name: 'Raphinha', role: 'LW', age: 27, ovr: 86, pot: 86, val: 65000000, wage: 170000, pace: 89, shoot: 83, pass: 82, dribble: 86, def: 55, phy: 74, skin: '#8d5524', hair: '#111' },
            { id: 'bar_10', name: 'Lewandowski', role: 'ST', age: 36, ovr: 89, pot: 89, val: 25000000, wage: 320000, pace: 76, shoot: 90, pass: 80, dribble: 84, def: 42, phy: 82, skin: '#ffdbac', hair: '#2b1d0c' },
            { id: 'bar_11', name: 'Lamine Yamal', role: 'RW', age: 17, ovr: 87, pot: 95, val: 150000000, wage: 100000, pace: 91, shoot: 81, pass: 85, dribble: 91, def: 35, phy: 58, skin: '#8d5524', hair: '#111' }
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
            { id: 'psb_1', name: 'Kevin Mendoza', role: 'GK', age: 29, ovr: 77, pot: 78, val: 750000, wage: 12000, pace: 55, shoot: 20, pass: 70, dribble: 45, def: 78, phy: 74, skin: '#8d5524', hair: '#111' },
            { id: 'psb_2', name: 'Edo Febriansah', role: 'LB', age: 27, ovr: 75, pot: 76, val: 500000, wage: 9000, pace: 86, shoot: 66, pass: 72, dribble: 75, def: 74, phy: 73, skin: '#8d5524', hair: '#111' },
            { id: 'psb_3', name: 'Nick Kuipers', role: 'CB', age: 31, ovr: 78, pot: 78, val: 650000, wage: 14000, pace: 68, shoot: 40, pass: 68, dribble: 62, def: 80, phy: 84, skin: '#ffdbac', hair: '#e6c280' },
            { id: 'psb_4', name: 'Gustavo Franca', role: 'CB', age: 28, ovr: 77, pot: 78, val: 600000, wage: 12000, pace: 72, shoot: 42, pass: 67, dribble: 65, def: 78, phy: 80, skin: '#8d5524', hair: '#111' },
            { id: 'psb_5', name: 'Henhen Herdiana', role: 'RB', age: 28, ovr: 75, pot: 75, val: 450000, wage: 8000, pace: 80, shoot: 55, pass: 70, dribble: 72, def: 76, phy: 75, skin: '#8d5524', hair: '#111' },
            { id: 'psb_6', name: 'Marc Klok', role: 'CDM', age: 31, ovr: 79, pot: 79, val: 850000, wage: 16000, pace: 74, shoot: 76, pass: 82, dribble: 78, def: 77, phy: 79, skin: '#f1c27d', hair: '#2b1d0c' },
            { id: 'psb_7', name: 'Dedi Kusnandar', role: 'CM', age: 33, ovr: 74, pot: 74, val: 350000, wage: 8000, pace: 65, shoot: 62, pass: 76, dribble: 73, def: 75, phy: 74, skin: '#8d5524', hair: '#111' },
            { id: 'psb_8', name: 'Tyronne del Pino', role: 'CAM', age: 33, ovr: 78, pot: 78, val: 700000, wage: 14000, pace: 75, shoot: 78, pass: 81, dribble: 80, def: 55, phy: 70, skin: '#f1c27d', hair: '#2b1d0c' },
            { id: 'psb_9', name: 'Ciro Alves', role: 'LW', age: 35, ovr: 80, pot: 80, val: 800000, wage: 18000, pace: 88, shoot: 83, pass: 78, dribble: 85, def: 48, phy: 80, skin: '#8d5524', hair: '#111' },
            { id: 'psb_10', name: 'David da Silva', role: 'ST', age: 34, ovr: 81, pot: 81, val: 950000, wage: 20000, pace: 82, shoot: 86, pass: 70, dribble: 80, def: 40, phy: 86, skin: '#3a2000', hair: '#111' },
            { id: 'psb_11', name: 'Beckham Putra', role: 'RW', age: 22, ovr: 76, pot: 82, val: 650000, wage: 9000, pace: 84, shoot: 73, pass: 78, dribble: 82, def: 50, phy: 64, skin: '#8d5524', hair: '#111' }
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
            { id: 'psj_1', name: 'Andritany', role: 'GK', age: 32, ovr: 77, pot: 77, val: 550000, wage: 11000, pace: 55, shoot: 20, pass: 72, dribble: 48, def: 78, phy: 74, skin: '#8d5524', hair: '#111' },
            { id: 'psj_2', name: 'Rizky Ridho', role: 'CB', age: 22, ovr: 81, pot: 87, val: 1200000, wage: 15000, pace: 74, shoot: 42, pass: 73, dribble: 70, def: 82, phy: 80, skin: '#8d5524', hair: '#111' },
            { id: 'psj_3', name: 'Ondrej Kudela', role: 'CB', age: 37, ovr: 78, pot: 78, val: 400000, wage: 15000, pace: 60, shoot: 45, pass: 74, dribble: 65, def: 80, phy: 81, skin: '#ffdbac', hair: '#2b1d0c' },
            { id: 'psj_4', name: 'Muhammad Ferarri', role: 'CB', age: 21, ovr: 76, pot: 83, val: 700000, wage: 9000, pace: 76, shoot: 40, pass: 68, dribble: 66, def: 77, phy: 78, skin: '#8d5524', hair: '#111' },
            { id: 'psj_5', name: 'Firza Andika', role: 'LWB', age: 25, ovr: 75, pot: 77, val: 500000, wage: 8000, pace: 84, shoot: 68, pass: 73, dribble: 75, def: 74, phy: 74, skin: '#8d5524', hair: '#111' },
            { id: 'psj_6', name: 'Maciej Gajos', role: 'CM', age: 33, ovr: 78, pot: 78, val: 650000, wage: 14000, pace: 72, shoot: 78, pass: 82, dribble: 77, def: 70, phy: 74, skin: '#ffdbac', hair: '#2b1d0c' },
            { id: 'psj_7', name: 'Hanif Sjahbandi', role: 'CM', age: 27, ovr: 75, pot: 76, val: 450000, wage: 8000, pace: 74, shoot: 68, pass: 75, dribble: 74, def: 76, phy: 77, skin: '#8d5524', hair: '#111' },
            { id: 'psj_8', name: 'Rio Fahmi', role: 'RWB', age: 22, ovr: 75, pot: 81, val: 550000, wage: 8000, pace: 85, shoot: 58, pass: 72, dribble: 74, def: 75, phy: 74, skin: '#8d5524', hair: '#111' },
            { id: 'psj_9', name: 'Ryo Matsumura', role: 'LW', age: 30, ovr: 79, pot: 79, val: 850000, wage: 16000, pace: 85, shoot: 79, pass: 79, dribble: 83, def: 52, phy: 70, skin: '#f1c27d', hair: '#111' },
            { id: 'psj_10', name: 'Gustavo Almeida', role: 'ST', age: 28, ovr: 80, pot: 81, val: 950000, wage: 18000, pace: 82, shoot: 84, pass: 72, dribble: 80, def: 42, phy: 82, skin: '#8d5524', hair: '#111' },
            { id: 'psj_11', name: 'Witan Sulaeman', role: 'RW', age: 22, ovr: 76, pot: 82, val: 650000, wage: 9000, pace: 84, shoot: 74, pass: 77, dribble: 81, def: 48, phy: 66, skin: '#8d5524', hair: '#111' }
        ]
    },

    // ==========================================
    // TIM NASIONAL (INTERNATIONAL)
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
            { id: 'ina_1', name: 'Maarten Paes', role: 'GK', age: 26, ovr: 85, pot: 88, val: 6500000, wage: 40000, pace: 60, shoot: 20, pass: 75, dribble: 50, def: 86, phy: 84, skin: '#ffdbac', hair: '#553311' },
            { id: 'ina_2', name: 'Jay Idzes', role: 'CB', age: 24, ovr: 85, pot: 89, val: 8500000, wage: 45000, pace: 78, shoot: 50, pass: 78, dribble: 75, def: 86, phy: 85, skin: '#f1c27d', hair: '#2b1d0c' },
            { id: 'ina_3', name: 'Jordi Amat', role: 'CB', age: 32, ovr: 82, pot: 82, val: 2000000, wage: 30000, pace: 68, shoot: 55, pass: 80, dribble: 72, def: 83, phy: 82, skin: '#f1c27d', hair: '#2b1d0c' },
            { id: 'ina_4', name: 'Rizky Ridho', role: 'CB', age: 22, ovr: 81, pot: 87, val: 2500000, wage: 20000, pace: 74, shoot: 42, pass: 73, dribble: 70, def: 82, phy: 80, skin: '#8d5524', hair: '#111' },
            { id: 'ina_5', name: 'Calvin Verdonk', role: 'LWB', age: 27, ovr: 83, pot: 84, val: 4500000, wage: 35000, pace: 84, shoot: 68, pass: 81, dribble: 80, def: 82, phy: 80, skin: '#8d5524', hair: '#111' },
            { id: 'ina_6', name: 'Thom Haye', role: 'CDM', age: 29, ovr: 84, pot: 84, val: 5000000, wage: 40000, pace: 70, shoot: 78, pass: 87, dribble: 81, def: 79, phy: 78, skin: '#f1c27d', hair: '#2b1d0c' },
            { id: 'ina_7', name: 'Marselino Ferdinan', role: 'CM', age: 20, ovr: 82, pot: 89, val: 4000000, wage: 25000, pace: 85, shoot: 77, pass: 80, dribble: 86, def: 60, phy: 68, skin: '#8d5524', hair: '#111' },
            { id: 'ina_8', name: 'Ivar Jenner', role: 'CM', age: 20, ovr: 80, pot: 86, val: 2500000, wage: 20000, pace: 76, shoot: 70, pass: 81, dribble: 79, def: 78, phy: 76, skin: '#f1c27d', hair: '#3a2000' },
            { id: 'ina_9', name: 'Sandy Walsh', role: 'RWB', age: 29, ovr: 82, pot: 82, val: 3500000, wage: 30000, pace: 80, shoot: 65, pass: 78, dribble: 77, def: 81, phy: 82, skin: '#f1c27d', hair: '#2b1d0c' },
            { id: 'ina_10', name: 'Ragnar Oratmangoen', role: 'ST', age: 26, ovr: 83, pot: 85, val: 4500000, wage: 35000, pace: 85, shoot: 81, pass: 78, dribble: 84, def: 55, phy: 78, skin: '#8d5524', hair: '#111' },
            { id: 'ina_11', name: 'Rafael Struick', role: 'ST', age: 21, ovr: 81, pot: 87, val: 3000000, wage: 22000, pace: 84, shoot: 79, pass: 75, dribble: 82, def: 45, phy: 74, skin: '#f1c27d', hair: '#3a2000' }
        ]
    },
    {
        id: 'argentina',
        name: 'Argentina',
        shortName: 'ARG',
        leagueId: 'international',
        rating: 91,
        transferBudget: 0,
        wageBudget: 0,
        stadium: 'Estadio Monumental (84,500)',
        colorPrimary: '#75AADB',
        colorSecondary: '#FFFFFF',
        formation: '4-3-3',
        tacticalStyle: 'Tiki-Taka',
        logo: '🏆',
        players: [
            { id: 'arg_1', name: 'E. Martínez', role: 'GK', age: 31, ovr: 88, pot: 88, val: 35000000, wage: 180000, pace: 55, shoot: 20, pass: 78, dribble: 45, def: 88, phy: 85, skin: '#f1c27d', hair: '#2b1d0c' },
            { id: 'arg_2', name: 'N. Tagliafico', role: 'LB', age: 31, ovr: 81, pot: 81, val: 18000000, wage: 100000, pace: 80, shoot: 58, pass: 74, dribble: 76, def: 81, phy: 80, skin: '#f1c27d', hair: '#2b1d0c' },
            { id: 'arg_3', name: 'Li. Martínez', role: 'CB', age: 26, ovr: 86, pot: 88, val: 65000000, wage: 160000, pace: 78, shoot: 55, pass: 82, dribble: 78, def: 87, phy: 84, skin: '#f1c27d', hair: '#111' },
            { id: 'arg_4', name: 'C. Romero', role: 'CB', age: 26, ovr: 87, pot: 90, val: 75000000, wage: 170000, pace: 80, shoot: 48, pass: 71, dribble: 70, def: 88, phy: 86, skin: '#f1c27d', hair: '#111' },
            { id: 'arg_5', name: 'N. Molina', role: 'RB', age: 26, ovr: 82, pot: 84, val: 35000000, wage: 110000, pace: 86, shoot: 65, pass: 77, dribble: 79, def: 79, phy: 76, skin: '#f1c27d', hair: '#2b1d0c' },
            { id: 'arg_6', name: 'Enzo Fernández', role: 'CM', age: 23, ovr: 85, pot: 89, val: 80000000, wage: 180000, pace: 74, shoot: 78, pass: 86, dribble: 82, def: 80, phy: 80, skin: '#f1c27d', hair: '#2b1d0c' },
            { id: 'arg_7', name: 'A. Mac Allister', role: 'CAM', age: 25, ovr: 86, pot: 88, val: 75000000, wage: 170000, pace: 75, shoot: 81, pass: 86, dribble: 84, def: 78, phy: 78, skin: '#ffdbac', hair: '#d48b38' },
            { id: 'arg_8', name: 'R. De Paul', role: 'CM', age: 30, ovr: 84, pot: 84, val: 40000000, wage: 140000, pace: 77, shoot: 76, pass: 83, dribble: 81, def: 80, phy: 84, skin: '#f1c27d', hair: '#2b1d0c' },
            { id: 'arg_9', name: 'N. González', role: 'LW', age: 26, ovr: 82, pot: 83, val: 38000000, wage: 120000, pace: 88, shoot: 77, pass: 75, dribble: 82, def: 60, phy: 78, skin: '#8d5524', hair: '#111' },
            { id: 'arg_10', name: 'J. Álvarez', role: 'ST', age: 24, ovr: 86, pot: 90, val: 90000000, wage: 200000, pace: 85, shoot: 86, pass: 80, dribble: 85, def: 55, phy: 79, skin: '#f1c27d', hair: '#2b1d0c' },
            { id: 'arg_11', name: 'Lionel Messi', role: 'RW', age: 37, ovr: 91, pot: 91, val: 35000000, wage: 400000, pace: 80, shoot: 90, pass: 92, dribble: 94, def: 35, phy: 64, skin: '#f1c27d', hair: '#553311' }
        ]
    }
];
