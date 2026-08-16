/**
 * EA FC 27 Web Edition - Database & Configuration
 * Clubs, National Teams, Players, Kits, Formations, and Match Constants
 */

export const GAME_CONFIG = {
    PITCH_LENGTH: 105,
    PITCH_WIDTH: 68,
    GOAL_WIDTH: 7.32,
    GOAL_HEIGHT: 2.44,
    GOAL_DEPTH: 2.0,
    BALL_RADIUS: 0.24,
    BALL_MASS: 0.43,
    GRAVITY: 9.81,
    DEFAULT_HALF_DURATION: 180, // 3 minutes real time per half
    RADAR_SCALE: 1.8,
    DIFFICULTY: {
        EASY: { name: 'Amateur', aiReaction: 0.35, aiAccuracy: 0.65, aiSpeedMod: 0.85 },
        MEDIUM: { name: 'Professional', aiReaction: 0.55, aiAccuracy: 0.80, aiSpeedMod: 0.95 },
        LEGENDARY: { name: 'World Class', aiReaction: 0.85, aiAccuracy: 0.95, aiSpeedMod: 1.05 }
    }
};

export const FORMATIONS = {
    '4-3-3': {
        name: '4-3-3 Attack',
        positions: [
            { role: 'GK', x: -48, z: 0 },
            { role: 'LB', x: -32, z: -22 },
            { role: 'CB1', x: -36, z: -8 },
            { role: 'CB2', x: -36, z: 8 },
            { role: 'RB', x: -32, z: 22 },
            { role: 'CM1', x: -14, z: -15 },
            { role: 'CAM', x: -5, z: 0 },
            { role: 'CM2', x: -14, z: 15 },
            { role: 'LW', x: 22, z: -24 },
            { role: 'ST', x: 28, z: 0 },
            { role: 'RW', x: 22, z: 24 }
        ]
    },
    '4-2-3-1': {
        name: '4-2-3-1 Balanced',
        positions: [
            { role: 'GK', x: -48, z: 0 },
            { role: 'LB', x: -32, z: -22 },
            { role: 'CB1', x: -36, z: -8 },
            { role: 'CB2', x: -36, z: 8 },
            { role: 'RB', x: -32, z: 22 },
            { role: 'CDM1', x: -20, z: -10 },
            { role: 'CDM2', x: -20, z: 10 },
            { role: 'LAM', x: 5, z: -20 },
            { role: 'CAM', x: 8, z: 0 },
            { role: 'RAM', x: 5, z: 20 },
            { role: 'ST', x: 28, z: 0 }
        ]
    },
    '4-4-2': {
        name: '4-4-2 Classic',
        positions: [
            { role: 'GK', x: -48, z: 0 },
            { role: 'LB', x: -32, z: -22 },
            { role: 'CB1', x: -36, z: -8 },
            { role: 'CB2', x: -36, z: 8 },
            { role: 'RB', x: -32, z: 22 },
            { role: 'LM', x: 0, z: -24 },
            { role: 'CM1', x: -10, z: -8 },
            { role: 'CM2', x: -10, z: 8 },
            { role: 'RM', x: 0, z: 24 },
            { role: 'ST1', x: 26, z: -7 },
            { role: 'ST2', x: 26, z: 7 }
        ]
    },
    '3-5-2': {
        name: '3-5-2 Wing Play',
        positions: [
            { role: 'GK', x: -48, z: 0 },
            { role: 'CB1', x: -36, z: -16 },
            { role: 'CB2', x: -38, z: 0 },
            { role: 'CB3', x: -36, z: 16 },
            { role: 'LWB', x: -8, z: -26 },
            { role: 'CDM', x: -18, z: 0 },
            { role: 'CM1', x: -5, z: -10 },
            { role: 'CM2', x: -5, z: 10 },
            { role: 'RWB', x: -8, z: 26 },
            { role: 'ST1', x: 26, z: -7 },
            { role: 'ST2', x: 26, z: 7 }
        ]
    }
};

export const TEAMS_DATABASE = [
    {
        id: 'real_madrid',
        name: 'Real Madrid',
        shortName: 'RMA',
        league: 'La Liga',
        rating: 92,
        colorPrimary: '#ffffff',
        colorSecondary: '#111827',
        colorAccent: '#eab308',
        formation: '4-3-3',
        logo: '👑',
        players: [
            { number: 1, name: 'Courtois', role: 'GK', ovr: 90, pace: 50, shoot: 25, pass: 75, dribble: 45, def: 90, phy: 88, skin: '#f1c27d', hair: '#2b1d0c' },
            { number: 23, name: 'Mendy', role: 'LB', ovr: 83, pace: 91, shoot: 64, pass: 77, dribble: 80, def: 84, phy: 86, skin: '#4a3000', hair: '#111111' },
            { number: 22, name: 'Rüdiger', role: 'CB1', ovr: 88, pace: 82, shoot: 55, pass: 72, dribble: 70, def: 89, phy: 90, skin: '#3a2000', hair: '#111111' },
            { number: 3, name: 'Militao', role: 'CB2', ovr: 86, pace: 84, shoot: 52, pass: 71, dribble: 74, def: 86, phy: 84, skin: '#8d5524', hair: '#111111' },
            { number: 2, name: 'Carvajal', role: 'RB', ovr: 86, pace: 81, shoot: 60, pass: 81, dribble: 82, def: 85, phy: 83, skin: '#f1c27d', hair: '#2b1d0c' },
            { number: 8, name: 'Valverde', role: 'CM1', ovr: 89, pace: 89, shoot: 84, pass: 86, dribble: 84, def: 82, phy: 89, skin: '#f1c27d', hair: '#553311' },
            { number: 5, name: 'Bellingham', role: 'CAM', ovr: 91, pace: 83, shoot: 87, pass: 88, dribble: 90, def: 80, phy: 88, skin: '#8d5524', hair: '#111111' },
            { number: 6, name: 'Camavinga', role: 'CM2', ovr: 84, pace: 82, shoot: 70, pass: 84, dribble: 85, def: 82, phy: 82, skin: '#3a2000', hair: '#111111' },
            { number: 7, name: 'Vinícius Jr', role: 'LW', ovr: 92, pace: 96, shoot: 85, pass: 83, dribble: 93, def: 35, phy: 70, skin: '#4a3000', hair: '#111111' },
            { number: 9, name: 'Mbappé', role: 'ST', ovr: 93, pace: 97, shoot: 92, pass: 82, dribble: 94, def: 38, phy: 80, skin: '#8d5524', hair: '#111111' },
            { number: 11, name: 'Rodrygo', role: 'RW', ovr: 87, pace: 90, shoot: 83, pass: 82, dribble: 89, def: 35, phy: 66, skin: '#8d5524', hair: '#111111' }
        ]
    },
    {
        id: 'man_city',
        name: 'Manchester City',
        shortName: 'MCI',
        league: 'Premier League',
        rating: 91,
        colorPrimary: '#6CABDD',
        colorSecondary: '#1C2C5B',
        colorAccent: '#ffffff',
        formation: '4-2-3-1',
        logo: '⛵',
        players: [
            { number: 31, name: 'Ederson', role: 'GK', ovr: 88, pace: 62, shoot: 30, pass: 93, dribble: 60, def: 88, phy: 80, skin: '#f1c27d', hair: '#111111' },
            { number: 24, name: 'Gvardiol', role: 'LB', ovr: 85, pace: 80, shoot: 65, pass: 80, dribble: 80, def: 86, phy: 85, skin: '#f1c27d', hair: '#3a2000' },
            { number: 3, name: 'Ruben Dias', role: 'CB1', ovr: 89, pace: 68, shoot: 40, pass: 74, dribble: 70, def: 90, phy: 88, skin: '#f1c27d', hair: '#2b1d0c' },
            { number: 25, name: 'Akanji', role: 'CB2', ovr: 84, pace: 82, shoot: 50, pass: 76, dribble: 75, def: 85, phy: 82, skin: '#8d5524', hair: '#111111' },
            { number: 2, name: 'Kyle Walker', role: 'RB', ovr: 84, pace: 92, shoot: 63, pass: 78, dribble: 78, def: 82, phy: 83, skin: '#8d5524', hair: '#111111' },
            { number: 16, name: 'Rodri', role: 'CDM1', ovr: 91, pace: 66, shoot: 81, pass: 87, dribble: 84, def: 88, phy: 87, skin: '#f1c27d', hair: '#2b1d0c' },
            { number: 8, name: 'Kovačić', role: 'CDM2', ovr: 83, pace: 76, shoot: 71, pass: 84, dribble: 86, def: 78, phy: 76, skin: '#f1c27d', hair: '#2b1d0c' },
            { number: 10, name: 'Grealish', role: 'LAM', ovr: 84, pace: 78, shoot: 76, pass: 84, dribble: 88, def: 52, phy: 73, skin: '#f1c27d', hair: '#553311' },
            { number: 17, name: 'De Bruyne', role: 'CAM', ovr: 91, pace: 72, shoot: 88, pass: 94, dribble: 87, def: 65, phy: 75, skin: '#ffdbac', hair: '#d48b38' },
            { number: 47, name: 'Foden', role: 'RAM', ovr: 88, pace: 86, shoot: 85, pass: 86, dribble: 90, def: 56, phy: 64, skin: '#ffdbac', hair: '#2b1d0c' },
            { number: 9, name: 'Haaland', role: 'ST', ovr: 92, pace: 89, shoot: 94, pass: 68, dribble: 81, def: 45, phy: 90, skin: '#ffdbac', hair: '#e6c280' }
        ]
    },
    {
        id: 'barcelona',
        name: 'FC Barcelona',
        shortName: 'BAR',
        league: 'La Liga',
        rating: 89,
        colorPrimary: '#A50044',
        colorSecondary: '#004D98',
        colorAccent: '#EDBB00',
        formation: '4-3-3',
        logo: '🔵🔴',
        players: [
            { number: 1, name: 'Ter Stegen', role: 'GK', ovr: 88, pace: 50, shoot: 20, pass: 88, dribble: 45, def: 88, phy: 82, skin: '#f1c27d', hair: '#d48b38' },
            { number: 3, name: 'Balde', role: 'LB', ovr: 82, pace: 92, shoot: 55, pass: 75, dribble: 81, def: 79, phy: 75, skin: '#4a3000', hair: '#111111' },
            { number: 4, name: 'Araújo', role: 'CB1', ovr: 87, pace: 81, shoot: 52, pass: 68, dribble: 65, def: 88, phy: 88, skin: '#8d5524', hair: '#111111' },
            { number: 2, name: 'Cubarsí', role: 'CB2', ovr: 82, pace: 74, shoot: 45, pass: 83, dribble: 75, def: 84, phy: 76, skin: '#f1c27d', hair: '#3a2000' },
            { number: 23, name: 'Koundé', role: 'RB', ovr: 86, pace: 84, shoot: 50, pass: 78, dribble: 78, def: 86, phy: 81, skin: '#4a3000', hair: '#111111' },
            { number: 21, name: 'F. de Jong', role: 'CM1', ovr: 87, pace: 81, shoot: 72, pass: 88, dribble: 88, def: 80, phy: 80, skin: '#ffdbac', hair: '#e6c280' },
            { number: 8, name: 'Pedri', role: 'CAM', ovr: 87, pace: 80, shoot: 74, pass: 89, dribble: 90, def: 74, phy: 73, skin: '#f1c27d', hair: '#2b1d0c' },
            { number: 6, name: 'Gavi', role: 'CM2', ovr: 84, pace: 78, shoot: 70, pass: 82, dribble: 84, def: 79, phy: 82, skin: '#f1c27d', hair: '#2b1d0c' },
            { number: 11, name: 'Raphinha', role: 'LW', ovr: 86, pace: 89, shoot: 83, pass: 82, dribble: 86, def: 55, phy: 74, skin: '#8d5524', hair: '#111111' },
            { number: 9, name: 'Lewandowski', role: 'ST', ovr: 89, pace: 76, shoot: 90, pass: 80, dribble: 84, def: 42, phy: 82, skin: '#ffdbac', hair: '#2b1d0c' },
            { number: 19, name: 'Lamine Yamal', role: 'RW', ovr: 87, pace: 91, shoot: 81, pass: 85, dribble: 91, def: 35, phy: 58, skin: '#8d5524', hair: '#111111' }
        ]
    },
    {
        id: 'arsenal',
        name: 'Arsenal FC',
        shortName: 'ARS',
        league: 'Premier League',
        rating: 88,
        colorPrimary: '#EF0107',
        colorSecondary: '#063672',
        colorAccent: '#FFFFFF',
        formation: '4-3-3',
        logo: '🔴⚪',
        players: [
            { number: 22, name: 'Raya', role: 'GK', ovr: 85, pace: 50, shoot: 20, pass: 84, dribble: 50, def: 85, phy: 78, skin: '#f1c27d', hair: '#111111' },
            { number: 17, name: 'Zinchenko', role: 'LB', ovr: 82, pace: 78, shoot: 70, pass: 84, dribble: 83, def: 77, phy: 72, skin: '#ffdbac', hair: '#e6c280' },
            { number: 6, name: 'Gabriel', role: 'CB1', ovr: 87, pace: 72, shoot: 45, pass: 70, dribble: 68, def: 88, phy: 87, skin: '#4a3000', hair: '#111111' },
            { number: 2, name: 'Saliba', role: 'CB2', ovr: 88, pace: 83, shoot: 40, pass: 75, dribble: 75, def: 89, phy: 84, skin: '#4a3000', hair: '#111111' },
            { number: 4, name: 'White', role: 'RB', ovr: 83, pace: 80, shoot: 55, pass: 78, dribble: 78, def: 84, phy: 80, skin: '#ffdbac', hair: '#553311' },
            { number: 41, name: 'Rice', role: 'CM1', ovr: 88, pace: 76, shoot: 72, pass: 84, dribble: 81, def: 88, phy: 86, skin: '#ffdbac', hair: '#2b1d0c' },
            { number: 8, name: 'Ødegaard', role: 'CAM', ovr: 89, pace: 78, shoot: 82, pass: 90, dribble: 89, def: 62, phy: 68, skin: '#ffdbac', hair: '#e6c280' },
            { number: 29, name: 'Havertz', role: 'CM2', ovr: 84, pace: 81, shoot: 81, pass: 80, dribble: 82, def: 55, phy: 78, skin: '#ffdbac', hair: '#2b1d0c' },
            { number: 11, name: 'Martinelli', role: 'LW', ovr: 85, pace: 90, shoot: 78, pass: 77, dribble: 87, def: 45, phy: 73, skin: '#8d5524', hair: '#111111' },
            { number: 9, name: 'Jesus', role: 'ST', ovr: 83, pace: 83, shoot: 81, pass: 77, dribble: 86, def: 42, phy: 74, skin: '#8d5524', hair: '#111111' },
            { number: 7, name: 'Saka', role: 'RW', ovr: 88, pace: 87, shoot: 84, pass: 84, dribble: 88, def: 60, phy: 77, skin: '#4a3000', hair: '#111111' }
        ]
    },
    {
        id: 'bayern',
        name: 'Bayern München',
        shortName: 'BAY',
        league: 'Bundesliga',
        rating: 89,
        colorPrimary: '#DC052D',
        colorSecondary: '#0066B2',
        colorAccent: '#FFFFFF',
        formation: '4-2-3-1',
        logo: '⭐',
        players: [
            { number: 1, name: 'Neuer', role: 'GK', ovr: 87, pace: 55, shoot: 25, pass: 88, dribble: 55, def: 87, phy: 83, skin: '#ffdbac', hair: '#e6c280' },
            { number: 19, name: 'Davies', role: 'LB', ovr: 85, pace: 95, shoot: 68, pass: 78, dribble: 85, def: 78, phy: 80, skin: '#3a2000', hair: '#111111' },
            { number: 3, name: 'Kim Min-jae', role: 'CB1', ovr: 84, pace: 78, shoot: 40, pass: 68, dribble: 65, def: 86, phy: 86, skin: '#f1c27d', hair: '#111111' },
            { number: 2, name: 'Upamecano', role: 'CB2', ovr: 83, pace: 82, shoot: 45, pass: 69, dribble: 70, def: 84, phy: 84, skin: '#3a2000', hair: '#111111' },
            { number: 27, name: 'Laimer', role: 'RB', ovr: 82, pace: 80, shoot: 67, pass: 78, dribble: 79, def: 81, phy: 82, skin: '#ffdbac', hair: '#553311' },
            { number: 6, name: 'Kimmich', role: 'CDM1', ovr: 88, pace: 68, shoot: 74, pass: 89, dribble: 84, def: 83, phy: 78, skin: '#ffdbac', hair: '#553311' },
            { number: 16, name: 'Palhinha', role: 'CDM2', ovr: 84, pace: 65, shoot: 68, pass: 76, dribble: 74, def: 86, phy: 88, skin: '#f1c27d', hair: '#2b1d0c' },
            { number: 7, name: 'Gnabry', role: 'LAM', ovr: 83, pace: 83, shoot: 82, pass: 78, dribble: 83, def: 42, phy: 72, skin: '#8d5524', hair: '#111111' },
            { number: 42, name: 'Musiala', role: 'CAM', ovr: 89, pace: 86, shoot: 82, pass: 85, dribble: 93, def: 55, phy: 65, skin: '#8d5524', hair: '#111111' },
            { number: 10, name: 'Sané', role: 'RAM', ovr: 85, pace: 90, shoot: 81, pass: 80, dribble: 86, def: 38, phy: 70, skin: '#8d5524', hair: '#111111' },
            { number: 9, name: 'Harry Kane', role: 'ST', ovr: 90, pace: 69, shoot: 93, pass: 85, dribble: 83, def: 48, phy: 82, skin: '#ffdbac', hair: '#e6c280' }
        ]
    },
    {
        id: 'indonesia',
        name: 'Indonesia',
        shortName: 'INA',
        league: 'National Team',
        rating: 84,
        colorPrimary: '#FF0000',
        colorSecondary: '#FFFFFF',
        colorAccent: '#D4AF37',
        formation: '3-5-2',
        logo: '🦅',
        players: [
            { number: 1, name: 'Maarten Paes', role: 'GK', ovr: 85, pace: 60, shoot: 20, pass: 75, dribble: 50, def: 86, phy: 84, skin: '#ffdbac', hair: '#553311' },
            { number: 3, name: 'Jay Idzes', role: 'CB1', ovr: 85, pace: 78, shoot: 50, pass: 78, dribble: 75, def: 86, phy: 85, skin: '#f1c27d', hair: '#2b1d0c' },
            { number: 4, name: 'Jordi Amat', role: 'CB2', ovr: 82, pace: 68, shoot: 55, pass: 80, dribble: 72, def: 83, phy: 82, skin: '#f1c27d', hair: '#2b1d0c' },
            { number: 5, name: 'Rizky Ridho', role: 'CB3', ovr: 81, pace: 74, shoot: 42, pass: 73, dribble: 70, def: 82, phy: 80, skin: '#8d5524', hair: '#111111' },
            { number: 14, name: 'Calvin Verdonk', role: 'LWB', ovr: 83, pace: 84, shoot: 68, pass: 81, dribble: 80, def: 82, phy: 80, skin: '#8d5524', hair: '#111111' },
            { number: 19, name: 'Thom Haye', role: 'CDM', ovr: 84, pace: 70, shoot: 78, pass: 87, dribble: 81, def: 79, phy: 78, skin: '#f1c27d', hair: '#2b1d0c' },
            { number: 7, name: 'Marselino', role: 'CM1', ovr: 82, pace: 85, shoot: 77, pass: 80, dribble: 86, def: 60, phy: 68, skin: '#8d5524', hair: '#111111' },
            { number: 18, name: 'Ivar Jenner', role: 'CM2', ovr: 80, pace: 76, shoot: 70, pass: 81, dribble: 79, def: 78, phy: 76, skin: '#f1c27d', hair: '#3a2000' },
            { number: 6, name: 'Sandy Walsh', role: 'RWB', ovr: 82, pace: 80, shoot: 65, pass: 78, dribble: 77, def: 81, phy: 82, skin: '#f1c27d', hair: '#2b1d0c' },
            { number: 11, name: 'Ragnar Oratmangoen', role: 'ST1', ovr: 83, pace: 85, shoot: 81, pass: 78, dribble: 84, def: 55, phy: 78, skin: '#8d5524', hair: '#111111' },
            { number: 9, name: 'Rafael Struick', role: 'ST2', ovr: 81, pace: 84, shoot: 79, pass: 75, dribble: 82, def: 45, phy: 74, skin: '#f1c27d', hair: '#3a2000' }
        ]
    },
    {
        id: 'argentina',
        name: 'Argentina',
        shortName: 'ARG',
        league: 'National Team',
        rating: 91,
        colorPrimary: '#75AADB',
        colorSecondary: '#FFFFFF',
        colorAccent: '#F6B40E',
        formation: '4-3-3',
        logo: '🏆',
        players: [
            { number: 23, name: 'E. Martínez', role: 'GK', ovr: 88, pace: 55, shoot: 20, pass: 78, dribble: 45, def: 88, phy: 85, skin: '#f1c27d', hair: '#2b1d0c' },
            { number: 3, name: 'Tagliafico', role: 'LB', ovr: 81, pace: 80, shoot: 58, pass: 74, dribble: 76, def: 81, phy: 80, skin: '#f1c27d', hair: '#2b1d0c' },
            { number: 25, name: 'Li. Martínez', role: 'CB1', ovr: 86, pace: 78, shoot: 55, pass: 82, dribble: 78, def: 87, phy: 84, skin: '#f1c27d', hair: '#111111' },
            { number: 13, name: 'C. Romero', role: 'CB2', ovr: 87, pace: 80, shoot: 48, pass: 71, dribble: 70, def: 88, phy: 86, skin: '#f1c27d', hair: '#111111' },
            { number: 26, name: 'Molina', role: 'RB', ovr: 82, pace: 86, shoot: 65, pass: 77, dribble: 79, def: 79, phy: 76, skin: '#f1c27d', hair: '#2b1d0c' },
            { number: 24, name: 'Enzo F.', role: 'CM1', ovr: 85, pace: 74, shoot: 78, pass: 86, dribble: 82, def: 80, phy: 80, skin: '#f1c27d', hair: '#2b1d0c' },
            { number: 20, name: 'Mac Allister', role: 'CAM', ovr: 86, pace: 75, shoot: 81, pass: 86, dribble: 84, def: 78, phy: 78, skin: '#ffdbac', hair: '#d48b38' },
            { number: 7, name: 'De Paul', role: 'CM2', ovr: 84, pace: 77, shoot: 76, pass: 83, dribble: 81, def: 80, phy: 84, skin: '#f1c27d', hair: '#2b1d0c' },
            { number: 15, name: 'N. González', role: 'LW', ovr: 82, pace: 88, shoot: 77, pass: 75, dribble: 82, def: 60, phy: 78, skin: '#8d5524', hair: '#111111' },
            { number: 9, name: 'J. Álvarez', role: 'ST', ovr: 86, pace: 85, shoot: 86, pass: 80, dribble: 85, def: 55, phy: 79, skin: '#f1c27d', hair: '#2b1d0c' },
            { number: 10, name: 'Lionel Messi', role: 'RW', ovr: 91, pace: 80, shoot: 90, pass: 92, dribble: 94, def: 35, phy: 64, skin: '#f1c27d', hair: '#553311' }
        ]
    },
    {
        id: 'brazil',
        name: 'Brazil',
        shortName: 'BRA',
        league: 'National Team',
        rating: 90,
        colorPrimary: '#FEE100',
        colorSecondary: '#009C3B',
        colorAccent: '#002776',
        formation: '4-3-3',
        logo: '🌴',
        players: [
            { number: 1, name: 'Alisson', role: 'GK', ovr: 89, pace: 55, shoot: 20, pass: 85, dribble: 50, def: 89, phy: 84, skin: '#f1c27d', hair: '#3a2000' },
            { number: 16, name: 'Arana', role: 'LB', ovr: 80, pace: 84, shoot: 65, pass: 76, dribble: 78, def: 77, phy: 75, skin: '#8d5524', hair: '#111111' },
            { number: 4, name: 'Marquinhos', role: 'CB1', ovr: 87, pace: 78, shoot: 52, pass: 76, dribble: 74, def: 88, phy: 80, skin: '#8d5524', hair: '#111111' },
            { number: 14, name: 'Gabriel M.', role: 'CB2', ovr: 86, pace: 74, shoot: 45, pass: 72, dribble: 69, def: 87, phy: 85, skin: '#4a3000', hair: '#111111' },
            { number: 2, name: 'Danilo', role: 'RB', ovr: 82, pace: 80, shoot: 68, pass: 78, dribble: 77, def: 82, phy: 81, skin: '#4a3000', hair: '#111111' },
            { number: 5, name: 'Casemiro', role: 'CM1', ovr: 86, pace: 62, shoot: 74, pass: 78, dribble: 72, def: 87, phy: 88, skin: '#8d5524', hair: '#111111' },
            { number: 8, name: 'Paquetá', role: 'CAM', ovr: 84, pace: 76, shoot: 78, pass: 83, dribble: 86, def: 72, phy: 78, skin: '#8d5524', hair: '#111111' },
            { number: 15, name: 'Bruno G.', role: 'CM2', ovr: 85, pace: 74, shoot: 76, pass: 84, dribble: 84, def: 82, phy: 83, skin: '#8d5524', hair: '#111111' },
            { number: 7, name: 'Vinícius Jr', role: 'LW', ovr: 92, pace: 96, shoot: 85, pass: 83, dribble: 93, def: 35, phy: 70, skin: '#4a3000', hair: '#111111' },
            { number: 9, name: 'Endrick', role: 'ST', ovr: 84, pace: 89, shoot: 84, pass: 72, dribble: 85, def: 40, phy: 82, skin: '#4a3000', hair: '#111111' },
            { number: 11, name: 'Rodrygo', role: 'RW', ovr: 87, pace: 90, shoot: 83, pass: 82, dribble: 89, def: 35, phy: 66, skin: '#8d5524', hair: '#111111' }
        ]
    }
];
