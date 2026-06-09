import { Match, TEAMS } from './data';

export interface PlayerStats {
  goals: number;
  assists: number;
  shots: number;
  shotsOnTarget: number;
  passes: number;
  passesCompleted: number;
  tackles: number;
  saves?: number;
  yellowCards: number;
  redCards: number;
}

export interface Player {
  id: string;
  name: string;
  number: number;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  rating: number;
  stats: PlayerStats;
  isSubbedOut?: boolean;
  isSubbedIn?: boolean;
  subMin?: number;
}

export interface MatchEvent {
  id: string;
  type: 'goal' | 'yellow_card' | 'red_card' | 'substitution';
  minute: number;
  teamId: string; // 'home' or 'away'
  playerName: string;
  detail?: string; // e.g. "Assist: Messi" or "Subbed in: Alvarez"
  playerNameOut?: string; // only for substitution
}

export interface MatchStats {
  possession: [number, number]; // [home, away]
  shots: [number, number];
  shotsOnTarget: [number, number];
  corners: [number, number];
  fouls: [number, number];
  offsides: [number, number];
  saves: [number, number];
  yellowCards: [number, number];
  redCards: [number, number];
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  time: string;
}

export interface H2HRecord {
  date: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  competition: string;
}

export interface LiveMatchData {
  matchId: string;
  status: 'scheduled' | 'live' | 'finished';
  minute: number;
  homeScore: number;
  awayScore: number;
  events: MatchEvent[];
  stats: MatchStats;
  lineups: {
    home: {
      startingXI: Player[];
      bench: Player[];
    };
    away: {
      startingXI: Player[];
      bench: Player[];
    };
  };
  news: NewsArticle[];
  h2h: H2HRecord[];
}

// ── ROSTERS DICTIONARY ──
const FIRST_NAMES: Record<string, string[]> = {
  default: ['John', 'David', 'James', 'Michael', 'Robert', 'William', 'Thomas', 'Daniel', 'Richard', 'Alex', 'Chris'],
  mex: ['Guillermo', 'Jorge', 'Cesar', 'Johan', 'Jesus', 'Edson', 'Luis', 'Erick', 'Orbelin', 'Henry', 'Hirving', 'Santiago', 'Alexis', 'Uriel', 'Roberto', 'Carlos', 'Gerardo'],
  rsa: ['Ronwen', 'Khuliso', 'Mothobi', 'Aubrey', 'Grant', 'Teboho', 'Sphephelo', 'Themba', 'Percy', 'Evidence', 'Thapelo', 'Nkosinathi', 'Zakhele', 'Terrence', 'Iqraam'],
  kor: ['Seung-gyu', 'Young-woo', 'Min-jae', 'Kyung-won', 'Jin-su', 'In-beom', 'Woo-young', 'Hee-chan', 'Jae-sung', 'Heung-min', 'Gue-sung', 'Kang-in', 'Hyun-woo', 'Tae-hwan'],
  cze: ['Jindrich', 'Tomas', 'Robin', 'Ladislav', 'David', 'Michal', 'Antonin', 'Tomas', 'Lukas', 'Patrik', 'Jan', 'Vaclav', 'Adam', 'Mojmir', 'Pavel', 'Ondrej'],
  can: ['Maxime', 'Alistair', 'Joel', 'Derek', 'Alphonso', 'Tajon', 'Stephen', 'Ismael', 'Jonathan', 'Cyle', 'Liam', 'Kamal', 'Samuel', 'Dayne', 'Richie', 'Junior'],
  bih: ['Kenan', 'Anel', 'Dennis', 'Sead', 'Jusuf', 'Miralem', 'Amir', 'Benjamin', 'Edin', 'Ermedin', 'Haris', 'Amar', 'Eldar', 'Smail', 'Nail', 'Rade'],
  qat: ['Meshaal', 'Rassim', 'Boualem', 'Lucas', 'Homam', 'Mostafa', 'Jassem', 'Ahmed', 'Hassan', 'Akram', 'Almoez', 'Yusuf', 'Mohammed', 'Saad', 'Karim', 'Bassam'],
  sui: ['Yann', 'Silvan', 'Manuel', 'Manuel', 'Ricardo', 'Granit', 'Remo', 'Denis', 'Xherdan', 'Breel', 'Ruben', 'Gregor', 'Fabian', 'Michel', 'Dan', 'Noah', 'Zeki'],
  bra: ['Alisson', 'Danilo', 'Marquinhos', 'Gabriel', 'Renan', 'Casemiro', 'Bruno', 'Lucas', 'Rodrygo', 'Richarlison', 'Vinicius', 'Ederson', 'Eder', 'Bremer', 'Douglas', 'Raphinha', 'Endrick'],
  mar: ['Yassine', 'Achraf', 'Nayef', 'Romain', 'Yahia', 'Sofyan', 'Azzedine', 'Selim', 'Hakim', 'Youssef', 'Abde', 'Munir', 'Jawad', 'Amine', 'Bilal', 'Tarik'],
  hai: ['Johny', 'Carlens', 'Ricardo', 'Garven', 'Alex', 'Danley', 'Bryan', 'Wilde-Donald', 'Duckens', 'Frantzdy', 'Carnejy', 'Derrick', 'Leverton', 'Mondy', 'Louicius'],
  sco: ['Angus', 'Nathan', 'Ryan', 'Jack', 'Andrew', 'Billy', 'Callum', 'John', 'Scott', 'Lyndon', 'Che', 'Liam', 'Grant', 'Kenny', 'Stuart', 'Ryan', 'Lawrence'],
  usa: ['Matt', 'Sergino', 'Cameron', 'Tim', 'Antonee', 'Weston', 'Tyler', 'Yunus', 'Timothy', 'Josh', 'Christian', 'Ethan', 'Chris', 'Joe', 'Luca', 'Folarin', 'Brenden'],
  par: ['Carlos', 'Robert', 'Gustavo', 'Junior', 'Santiago', 'Andres', 'Mathias', 'Richard', 'Miguel', 'Julio', 'Adam', 'Antony', 'Fabian', 'Omar', 'Gaston', 'Derlis'],
  aus: ['Mathew', 'Lewis', 'Harry', 'Kye', 'Jordan', 'Keanu', 'Jackson', 'Connor', 'Riley', 'Mitchell', 'Craig', 'Thomas', 'Cameron', 'Martin', 'Awer', 'Bruno'],
  tur: ['Mert', 'Zeki', 'Samet', 'Abdulkerim', 'Ferdi', 'Salih', 'Hakan', 'Orkun', 'Irfan', 'Kenan', 'Baris', 'Ugurcan', 'Merih', 'Kaan', 'Arda', 'Kerem', 'Semih'],
  ger: ['Marc-Andre', 'Benjamin', 'Jonathan', 'Antonio', 'David', 'Joshua', 'Ilkay', 'Jamal', 'Florian', 'Leroy', 'Niclas', 'Oliver', 'Mats', 'Nico', 'Leon', 'Thomas', 'Kai'],
  ned: ['Bart', 'Denzel', 'Virgil', 'Nathan', 'Daley', 'Tijjani', 'Jerdy', 'Joey', 'Xavi', 'Memphis', 'Cody', 'Mark', 'Stefan', 'Matthijs', 'Micky', 'Ryan', 'Wout'],
  jpn: ['Zion', 'Yukinari', 'Ko', 'Shogo', 'Hiroki', 'Wataru', 'Hidemasa', 'Ritsu', 'Takumi', 'Keito', 'Ayase', 'Keisuke', 'Koki', 'Ao', 'Daichi', 'Takefusa', 'Daizen'],
  bel: ['Koen', 'Timothy', 'Wout', 'Jan', 'Arthur', 'Orel', 'Amadou', 'Kevin', 'Jeremy', 'Romelu', 'Leandro', 'Thomas', 'Zeno', 'Youri', 'Charles', 'Dodi', 'Johan'],
  egy: ['Mohamed', 'Mohamed', 'Ahmed', 'Mohamed', 'Hamdi', 'Marwan', 'Mohamed', 'Emam', 'Mostafa', 'Omar', 'Mahmoud', 'Ahmed', 'Yasser', 'Mohamed', 'Trezeguet', 'Kahraba'],
  esp: ['Unai', 'Dani', 'Robin', 'Aymeric', 'Alejandro', 'Rodrigo', 'Pablo', 'Pedro', 'Ferran', 'Alvaro', 'Dani', 'David', 'Pau', 'Martin', 'Alex', 'Mikel', 'Nico'],
  uru: ['Sergio', 'Nahitan', 'Ronald', 'Jose', 'Mathias', 'Federico', 'Manuel', 'Nicolas', 'Facundo', 'Darwin', 'Maximilian', 'Franco', 'Sebastian', 'Rodrigo', 'Giorgian', 'Luis'],
  fra: ['Mike', 'Jules', 'Ibrahima', 'Dayot', 'Theo', 'Aurelien', 'Adrien', 'Ousmane', 'Antoine', 'Kylian', 'Olivier', 'Brice', 'William', 'Benjamin', 'Eduardo', 'Kingsley', 'Randal'],
  nor: ['Orjan', 'Marcus', 'Kristoffer', 'Leo', 'Birger', 'Martin', 'Sander', 'Patrick', 'Alexander', 'Erling', 'Jorgen', 'Egils', 'Andreas', 'Hugo', 'Antonio', 'Mohamed'],
  arg: ['Emiliano', 'Nahuel', 'Cristian', 'Nicolas', 'Nicolas', 'Rodrigo', 'Enzo', 'Alexis', 'Lionel', 'Julian', 'Angel', 'Geronimo', 'Gonzalo', 'Leandro', 'Giovani', 'Lautaro'],
  por: ['Diogo', 'Diogo', 'Ruben', 'Antonio', 'Joao', 'Joao', 'Bruno', 'Otavio', 'Bernardo', 'Goncalo', 'Cristiano', 'Jose', 'Nelson', 'Danilo', 'Vitinha', 'Rafael', 'Joao'],
  eng: ['Jordan', 'Kyle', 'John', 'Harry', 'Luke', 'Declan', 'Jude', 'Jordan', 'Bukayo', 'Harry', 'Marcus', 'Aaron', 'Kieran', 'Marc', 'Trent', 'Phil', 'Jack'],
  cro: ['Dominik', 'Josip', 'Josip', 'Domagoj', 'Borna', 'Marcelo', 'Mateo', 'Luka', 'Mario', 'Andrej', 'Ivan', 'Nediljko', 'Josip', 'Martin', 'Lovro', 'Bruno']
};

const LAST_NAMES: Record<string, string[]> = {
  default: ['Smith', 'Jones', 'Miller', 'Davis', 'Wilson', 'Anderson', 'Taylor', 'Thomas', 'Moore', 'Martin'],
  mex: ['Ochoa', 'Sanchez', 'Montes', 'Vasquez', 'Gallardo', 'Alvarez', 'Chavez', 'Romo', 'Pineda', 'Martin', 'Lozano', 'Gimenez', 'Vega', 'Antuna', 'Rodriguez', 'Araujo'],
  rsa: ['Williams', 'Mudau', 'Mvala', 'Modiba', 'Mokoena', 'Sithole', 'Zwane', 'Tau', 'Makgopa', 'Morena', 'Maseko', 'Kekana', 'Sibisi', 'Xulu', 'Lepasa', 'Mayambela'],
  kor: ['Kim', 'Lee', 'Park', 'Jung', 'Hwang', 'Cho', 'Son', 'Seol', 'Hong', 'Ki', 'Seo', 'Moon', 'Kwon', 'Yang'],
  cze: ['Stanek', 'Coufal', 'Hranac', 'Krejci', 'Jurasek', 'Barak', 'Soucek', 'Provod', 'Schick', 'Chytil', 'Hlozek', 'Kuchta', 'Lingr', 'Vlcek', 'Doudera', 'Chory'],
  can: ['Crepeau', 'Johnston', 'Bombito', 'Cornelius', 'Davies', 'Buchanan', 'Eustaquio', 'Kone', 'David', 'Larin', 'Millar', 'St. Clair', 'Waterman', 'Miller', 'Osorio'],
  bih: ['Piric', 'Ahmedhodzic', 'Hadzikadunic', 'Kolasinac', 'Dedic', 'Pjanic', 'Hadziahmetovic', 'Tahirovic', 'Dzeko', 'Demirovic', 'Stevanovic', 'Civic', 'Kovacevic'],
  qat: ['Barsham', 'Al-Rawi', 'Khoukhi', 'Mendes', 'Waad', 'Meshaal', 'Gaber', 'Alaaeldin', 'Al-Haydos', 'Afif', 'Ali', 'Shehab', 'Salman', 'Boudiaf', 'Madibo'],
  sui: ['Sommer', 'Widmer', 'Akanji', 'Elvedi', 'Rodriguez', 'Xhaka', 'Freuler', 'Zakaria', 'Shaqiri', 'Embolo', 'Vargas', 'Kobel', 'Schar', 'Zesiger', 'Aebischer', 'Amdouni'],
  bra: ['Silva', 'Marquinhos', 'Magalhaes', 'Lodi', 'Casemiro', 'Guimaraes', 'Paqueta', 'Goes', 'Andrade', 'Junior', 'Ederson', 'Bremer', 'Luiz', 'Raphinha', 'Nascimento'],
  mar: ['Bounou', 'Hakimi', 'Aguerd', 'Saiss', 'Attiat-Allah', 'Amrabat', 'Ounahi', 'Amallah', 'Ziyech', 'En-Nesyri', 'Ezzalzouli', 'Mohamedi', 'Dari', 'El Khannouss'],
  hai: ['Duverger', 'Arcus', 'Ade', 'Metusala', 'Christian', 'Jean', 'Alceus', 'Guerrier', 'Nazor', 'Pierrot', 'Antoine', 'Placide', 'Alexis', 'Saba', 'Prunier'],
  sco: ['Gunn', 'Patterson', 'Porteous', 'Hendry', 'Robertson', 'Gilmour', 'McGregor', 'McGinn', 'McTominay', 'Dykes', 'Adams', 'Kelly', 'Hanley', 'McLean', 'Armstrong'],
  usa: ['Turner', 'Dest', 'Carter-Vickers', 'Ream', 'Robinson', 'McKennie', 'Adams', 'Musah', 'Weah', 'Sargent', 'Pulisic', 'Horvath', 'Richards', 'De la Torre', 'Balogun'],
  par: ['Coronel', 'Rojas', 'Gomez', 'Alonso', 'Arzamendia', 'Cubas', 'Villasanti', 'Sanchez', 'Almiron', 'Enciso', 'Bareiro', 'Fernandez', 'Balbuena', 'Alderete', 'Romero'],
  aus: ['Ryan', 'Miller', 'Souttar', 'Rowles', 'Bos', 'Baccus', 'Metcalfe', 'Irvine', 'McGree', 'Duke', 'Goodwin', 'Gauci', 'Burgess', 'Atkinson', 'Yengi', 'Fornaroli'],
  tur: ['Gunok', 'Celik', 'Akaydin', 'Bardakci', 'Kadioglu', 'Ozcan', 'Calhanoglu', 'Kokcu', 'Kahveci', 'Yildiz', 'Yilmaz', 'Cakir', 'Demiral', 'Ayhan', 'Guler', 'Akturkoglu'],
  ger: ['ter Stegen', 'Henrichs', 'Tah', 'Rudiger', 'Raum', 'Kimmich', 'Gundogan', 'Musiala', 'Wirtz', 'Sane', 'Fullkrug', 'Trapp', 'Hummels', 'Schlotterbeck', 'Goretzka'],
  ned: ['Verbruggen', 'Dumfries', 'van Dijk', 'Ake', 'Blind', 'Reijnders', 'Schouten', 'Veerman', 'Simons', 'Depay', 'Gakpo', 'Flekken', 'de Vrij', 'de Ligt', 'Gravenberch'],
  jpn: ['Suzuki', 'Sugawara', 'Itakura', 'Taniguchi', 'Ito', 'Endo', 'Morita', 'Doan', 'Minamino', 'Nakamura', 'Ueda', 'Maekawa', 'Machida', 'Tanaka', 'Kubo', 'Maeda'],
  bel: ['Casteels', 'Castagne', 'Faes', 'Vertonghen', 'Theate', 'Mangala', 'Onana', 'De Bruyne', 'Doku', 'Lukaku', 'Trossard', 'Kaminski', 'Debast', 'Tielemans', 'Vermeeren'],
  egy: ['El Shenawy', 'Hany', 'Monem', 'Gabr', 'Sharaf', 'Attia', 'Fathi', 'Ashour', 'Mohamed', 'Marmoush', 'Trezeguet', 'Sobhy', 'Ibrahim', 'Kamal', 'Hamada', 'Zizo'],
  esp: ['Simon', 'Carvajal', 'Le Normand', 'Laporte', 'Balde', 'Hernandez', 'Gavira', 'Gonzalez', 'Torres', 'Morata', 'Olmo', 'Raya', 'Pau', 'Zubimendi', 'Baena', 'Williams'],
  uru: ['Rochet', 'Nandez', 'Araujo', 'Gimenez', 'Olivera', 'Valverde', 'Ugarte', 'De la Cruz', 'Pellistri', 'Nunez', 'Araujo', 'Mele', 'Caceres', 'Bentancur', 'Suarez'],
  fra: ['Maignan', 'Kounde', 'Konate', 'Upamecano', 'Hernandez', 'Tchouameni', 'Rabiot', 'Dembele', 'Griezmann', 'Mbappe', 'Giroud', 'Samba', 'Saliba', 'Pavard', 'Camavinga'],
  nor: ['Nyland', 'Ryerson', 'Ajer', 'Ostigard', 'Meling', 'Odegaard', 'Berge', 'Berg', 'Sorloth', 'Haaland', 'Elyounoussi', 'Dyngeland', 'Strandberg', 'Solbakken'],
  arg: ['Martinez', 'Molina', 'Romero', 'Otamendi', 'Tagliafico', 'De Paul', 'Fernandez', 'Mac Allister', 'Messi', 'Alvarez', 'Di Maria', 'Rulli', 'Montiel', 'Paredes', 'Lo Celso'],
  por: ['Costa', 'Dalot', 'Dias', 'Silva', 'Cancelo', 'Neves', 'Fernandes', 'Otavio', 'Silva', 'Ramos', 'Ronaldo', 'Patricio', 'Semedo', 'Pereira', 'Palhinha', 'Leao'],
  eng: ['Pickford', 'Walker', 'Stones', 'Maguire', 'Shaw', 'Rice', 'Bellingham', 'Henderson', 'Saka', 'Kane', 'Rashford', 'Ramsdale', 'Trippier', 'Guehi', 'Alexander-Arnold'],
  cro: ['Livakovic', 'Stanisic', 'Sutalo', 'Vida', 'Barisic', 'Brozovic', 'Kovacic', 'Modric', 'Pasalic', 'Kramaric', 'Perisic', 'Labrovic', 'Gvardiol', 'Majer', 'Petkovic']
};

// Simple pseudo-random generator seeded by a string
function seedRandom(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return () => {
    const x = Math.sin(hash++) * 10000;
    return x - Math.floor(x);
  };
}

export function generateRoster(teamId: string, isHome: boolean, overall: number): { startingXI: Player[]; bench: Player[] } {
  const rand = seedRandom(teamId + (isHome ? '_home' : '_away'));
  
  const fNames = FIRST_NAMES[teamId] || FIRST_NAMES.default;
  const lNames = LAST_NAMES[teamId] || LAST_NAMES.default;

  const usedNumbers = new Set<number>();
  
  const getUniqueNumber = () => {
    let num = Math.floor(rand() * 98) + 1;
    while (usedNumbers.has(num)) {
      num = Math.floor(rand() * 98) + 1;
    }
    usedNumbers.add(num);
    return num;
  };

  const createPlayer = (pos: 'GK' | 'DEF' | 'MID' | 'FWD', index: number): Player => {
    const fName = fNames[Math.floor(rand() * fNames.length)];
    const lName = lNames[Math.floor(rand() * lNames.length)];
    const name = `${fName} ${lName}`;
    const number = pos === 'GK' && index === 0 ? 1 : getUniqueNumber();
    const rating = Math.round(overall - 5 + rand() * 10);
    
    return {
      id: `${teamId}_${pos}_${index}`,
      name,
      number,
      position: pos,
      rating: parseFloat((6.0 + rand() * 3.5).toFixed(1)),
      stats: {
        goals: 0,
        assists: 0,
        shots: 0,
        shotsOnTarget: 0,
        passes: Math.round(15 + rand() * 40),
        passesCompleted: 0,
        tackles: Math.round(rand() * 5),
        saves: pos === 'GK' ? Math.round(rand() * 6) : undefined,
        yellowCards: 0,
        redCards: 0,
      }
    };
  };

  const startingXI: Player[] = [];
  const bench: Player[] = [];

  // Starting XI: 1 GK, 4 DEF, 4 MID, 2 FWD
  startingXI.push(createPlayer('GK', 0));
  for (let i = 0; i < 4; i++) startingXI.push(createPlayer('DEF', i));
  for (let i = 0; i < 4; i++) startingXI.push(createPlayer('MID', i));
  for (let i = 0; i < 2; i++) startingXI.push(createPlayer('FWD', i));

  // Bench: 1 GK, 2 DEF, 2 MID, 2 FWD
  bench.push(createPlayer('GK', 1));
  for (let i = 4; i < 6; i++) bench.push(createPlayer('DEF', i));
  for (let i = 4; i < 6; i++) bench.push(createPlayer('MID', i));
  for (let i = 2; i < 4; i++) bench.push(createPlayer('FWD', i));

  // Fix passes completed
  [...startingXI, ...bench].forEach(p => {
    p.stats.passesCompleted = Math.round(p.stats.passes * (0.65 + rand() * 0.25));
  });

  return { startingXI, bench };
}

export function generateStaticMatchData(matchId: string, match: Match): LiveMatchData {
  const homeTeam = TEAMS.find(t => t.id === match.team1);
  const awayTeam = TEAMS.find(t => t.id === match.team2);

  const homeName = homeTeam ? homeTeam.name : match.team1;
  const awayName = awayTeam ? awayTeam.name : match.team2;

  const homeCode = homeTeam ? homeTeam.code : 'HM';
  const awayCode = awayTeam ? awayTeam.code : 'AW';

  const homeFlag = homeTeam ? homeTeam.flag : '🏳️';
  const awayFlag = awayTeam ? awayTeam.flag : '🏳️';

  const homeOverall = homeTeam ? homeTeam.overall : 78;
  const awayOverall = awayTeam ? awayTeam.overall : 78;

  const lineups = {
    home: generateRoster(match.team1, true, homeOverall),
    away: generateRoster(match.team2, false, awayOverall)
  };

  // Generate H2H matches deterministically
  const h2hRand = seedRandom(match.team1 + '_' + match.team2 + '_h2h');
  const h2h: H2HRecord[] = [
    {
      date: '2025-11-14',
      homeTeam: homeName,
      awayTeam: awayName,
      homeScore: Math.floor(h2hRand() * 3),
      awayScore: Math.floor(h2hRand() * 3),
      competition: 'International Friendly'
    },
    {
      date: '2024-06-20',
      homeTeam: awayName,
      awayTeam: homeName,
      homeScore: Math.floor(h2hRand() * 3),
      awayScore: Math.floor(h2hRand() * 3),
      competition: 'FIFA Series'
    },
    {
      date: '2022-09-27',
      homeTeam: homeName,
      awayTeam: awayName,
      homeScore: Math.floor(h2hRand() * 4),
      awayScore: Math.floor(h2hRand() * 4),
      competition: 'International Friendly'
    }
  ];

  // NewsArticles
  const newsRand = seedRandom(matchId + '_news');
  const news: NewsArticle[] = [
    {
      id: `${matchId}_n1`,
      title: `${homeName} vs ${awayName} Tactical Preview: Key matchups and predictions`,
      summary: `Both managers head into this crucial encounter knowing that a positive result could define their group stage progression. Tactical adjustments in midfield are expected.`,
      source: 'Goal.com',
      time: '2 hours ago'
    },
    {
      id: `${matchId}_n2`,
      title: `Injury Report: ${homeName} star cleared to play, ${awayName} key defender remains a doubt`,
      summary: `Late fitness tests will determine the final starting lineups, but early reports suggest positive news for the home squad's attacking lineup.`,
      source: 'Sky Sports',
      time: '6 hours ago'
    },
    {
      id: `${matchId}_n3`,
      title: `FIFA World Cup 2026: Fans gather at ${match.venue} ahead of monumental clash`,
      summary: `The atmosphere is electric in the host city of ${match.venue} as supporters from both nations paint the streets in national colors ahead of kickoff.`,
      source: 'FIFA.com',
      time: '12 hours ago'
    }
  ];

  // Default Stats
  const hasResult = match.is_completed || (match.team1_score !== null && match.team2_score !== null);
  const homeScore = match.team1_score ?? 0;
  const awayScore = match.team2_score ?? 0;

  const stats: MatchStats = {
    possession: hasResult ? [48 + Math.round(newsRand() * 8), 0] : [50, 50],
    shots: hasResult ? [10 + Math.round(newsRand() * 8), 8 + Math.round(newsRand() * 6)] : [0, 0],
    shotsOnTarget: [0, 0],
    corners: hasResult ? [3 + Math.round(newsRand() * 5), 2 + Math.round(newsRand() * 4)] : [0, 0],
    fouls: hasResult ? [8 + Math.round(newsRand() * 6), 9 + Math.round(newsRand() * 7)] : [0, 0],
    offsides: hasResult ? [1 + Math.round(newsRand() * 3), 1 + Math.round(newsRand() * 3)] : [0, 0],
    saves: [0, 0],
    yellowCards: [0, 0],
    redCards: [0, 0]
  };

  if (hasResult) {
    stats.possession[1] = 100 - stats.possession[0];
    stats.shotsOnTarget = [
      Math.min(stats.shots[0], Math.round(stats.shots[0] * (0.3 + newsRand() * 0.4)) + homeScore),
      Math.min(stats.shots[1], Math.round(stats.shots[1] * (0.3 + newsRand() * 0.4)) + awayScore)
    ];
    stats.saves = [
      Math.max(0, stats.shotsOnTarget[1] - awayScore),
      Math.max(0, stats.shotsOnTarget[0] - homeScore)
    ];
  }

  // Events
  const events: MatchEvent[] = [];
  if (hasResult) {
    // Deterministically generate events to match final score
    const totalGoals = homeScore + awayScore;
    const goalsList: { teamId: string; min: number }[] = [];
    
    for (let i = 0; i < homeScore; i++) {
      goalsList.push({ teamId: 'home', min: Math.floor(5 + newsRand() * 83) });
    }
    for (let i = 0; i < awayScore; i++) {
      goalsList.push({ teamId: 'away', min: Math.floor(5 + newsRand() * 83) });
    }
    goalsList.sort((a, b) => a.min - b.min);

    // Apply goals to players and events
    goalsList.forEach((g, i) => {
      const teamL = g.teamId === 'home' ? lineups.home : lineups.away;
      const teamIdStr = g.teamId === 'home' ? match.team1 : match.team2;
      const strikers = teamL.startingXI.filter(p => p.position === 'FWD' || p.position === 'MID');
      const scorer = strikers[Math.floor(newsRand() * strikers.length)];
      
      scorer.stats.goals += 1;
      scorer.stats.shots += 1;
      scorer.stats.shotsOnTarget += 1;
      scorer.rating = parseFloat((scorer.rating + 0.8).toFixed(1));

      // Assist
      const helper = strikers.find(p => p.id !== scorer.id);
      let assistDetail = '';
      if (helper && newsRand() > 0.3) {
        helper.stats.assists += 1;
        helper.rating = parseFloat((helper.rating + 0.4).toFixed(1));
        assistDetail = `Assist: ${helper.name}`;
      }

      events.push({
        id: `${matchId}_ev_g_${i}`,
        type: 'goal',
        minute: g.min,
        teamId: g.teamId,
        playerName: scorer.name,
        detail: assistDetail
      });
    });

    // Add yellow cards
    const ycHome = Math.floor(newsRand() * 3);
    const ycAway = Math.floor(newsRand() * 3);
    stats.yellowCards = [ycHome, ycAway];

    let eventIdx = 0;
    for (let i = 0; i < ycHome; i++) {
      const defenders = lineups.home.startingXI.filter(p => p.position === 'DEF' || p.position === 'MID');
      const p = defenders[Math.floor(newsRand() * defenders.length)];
      p.stats.yellowCards = 1;
      p.rating = parseFloat((p.rating - 0.3).toFixed(1));
      events.push({
        id: `${matchId}_ev_yc_h_${eventIdx++}`,
        type: 'yellow_card',
        minute: Math.floor(15 + newsRand() * 70),
        teamId: 'home',
        playerName: p.name
      });
    }
    for (let i = 0; i < ycAway; i++) {
      const defenders = lineups.away.startingXI.filter(p => p.position === 'DEF' || p.position === 'MID');
      const p = defenders[Math.floor(newsRand() * defenders.length)];
      p.stats.yellowCards = 1;
      p.rating = parseFloat((p.rating - 0.3).toFixed(1));
      events.push({
        id: `${matchId}_ev_yc_a_${eventIdx++}`,
        type: 'yellow_card',
        minute: Math.floor(15 + newsRand() * 70),
        teamId: 'away',
        playerName: p.name
      });
    }

    // Add sub events
    for (let i = 0; i < 2; i++) {
      // Home Sub
      const homeInIdx = Math.floor(newsRand() * lineups.home.bench.length);
      const homeOutIdx = Math.floor(newsRand() * lineups.home.startingXI.length);
      const playerIn = lineups.home.bench[homeInIdx];
      const playerOut = lineups.home.startingXI[homeOutIdx];

      if (playerIn && playerOut && !playerIn.isSubbedIn && !playerOut.isSubbedOut) {
        playerIn.isSubbedIn = true;
        playerOut.isSubbedOut = true;
        playerIn.subMin = Math.floor(60 + newsRand() * 25);
        playerOut.subMin = playerIn.subMin;
        events.push({
          id: `${matchId}_ev_sub_h_${i}`,
          type: 'substitution',
          minute: playerIn.subMin,
          teamId: 'home',
          playerName: playerIn.name,
          playerNameOut: playerOut.name
        });
      }

      // Away Sub
      const awayInIdx = Math.floor(newsRand() * lineups.away.bench.length);
      const awayOutIdx = Math.floor(newsRand() * lineups.away.startingXI.length);
      const aPlayerIn = lineups.away.bench[awayInIdx];
      const aPlayerOut = lineups.away.startingXI[awayOutIdx];

      if (aPlayerIn && aPlayerOut && !aPlayerIn.isSubbedIn && !aPlayerOut.isSubbedOut) {
        aPlayerIn.isSubbedIn = true;
        aPlayerOut.isSubbedOut = true;
        aPlayerIn.subMin = Math.floor(60 + newsRand() * 25);
        aPlayerOut.subMin = aPlayerIn.subMin;
        events.push({
          id: `${matchId}_ev_sub_a_${i}`,
          type: 'substitution',
          minute: aPlayerIn.subMin,
          teamId: 'away',
          playerName: aPlayerIn.name,
          playerNameOut: aPlayerOut.name
        });
      }
    }

    events.sort((a, b) => a.minute - b.minute);
  }

  return {
    matchId,
    status: hasResult ? 'finished' : 'scheduled',
    minute: hasResult ? 90 : 0,
    homeScore,
    awayScore,
    events,
    stats,
    lineups,
    news,
    h2h
  };
}

// ── LOCAL STORAGE ENGINE ──
const LIVE_SESSION_PREFIX = 'fwc2026_live_match_';

export function getLiveSession(matchId: string): LiveMatchData | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(`${LIVE_SESSION_PREFIX}${matchId}`);
  if (stored) {
    try {
      return JSON.parse(stored) as LiveMatchData;
    } catch (e) {
      console.error(e);
    }
  }
  return null;
}

export function saveLiveSession(matchId: string, data: LiveMatchData): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`${LIVE_SESSION_PREFIX}${matchId}`, JSON.stringify(data));
}

export function deleteLiveSession(matchId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(`${LIVE_SESSION_PREFIX}${matchId}`);
}

export function initializeLiveSimulation(matchId: string, match: Match): LiveMatchData {
  let session = getLiveSession(matchId);
  if (!session) {
    session = generateStaticMatchData(matchId, match);
    session.status = 'live';
    session.minute = 0;
    session.homeScore = 0;
    session.awayScore = 0;
    session.events = [];
    
    // Clear starts
    session.stats = {
      possession: [50, 50],
      shots: [0, 0],
      shotsOnTarget: [0, 0],
      corners: [0, 0],
      fouls: [0, 0],
      offsides: [0, 0],
      saves: [0, 0],
      yellowCards: [0, 0],
      redCards: [0, 0]
    };
    
    // Reset player scores
    session.lineups.home.startingXI.forEach(p => { p.stats.goals = 0; p.stats.assists = 0; p.stats.yellowCards = 0; p.stats.redCards = 0; });
    session.lineups.away.startingXI.forEach(p => { p.stats.goals = 0; p.stats.assists = 0; p.stats.yellowCards = 0; p.stats.redCards = 0; });
    session.lineups.home.bench.forEach(p => { p.stats.goals = 0; p.stats.assists = 0; p.isSubbedIn = false; p.isSubbedOut = false; });
    session.lineups.away.bench.forEach(p => { p.stats.goals = 0; p.stats.assists = 0; p.isSubbedIn = false; p.isSubbedOut = false; });
    
    saveLiveSession(matchId, session);
  }
  return session;
}

export function tickSimulation(matchId: string, minutesToAdvance = 1): LiveMatchData {
  const session = getLiveSession(matchId);
  if (!session || session.status !== 'live') return session || ({} as LiveMatchData);

  session.minute += minutesToAdvance;

  if (session.minute >= 90) {
    session.minute = 90;
    session.status = 'finished';
    saveLiveSession(matchId, session);
    return session;
  }

  const rand = Math.random;

  // Let's generate stats shifts
  // Increment possession shifting around 50%
  const posShift = Math.floor(rand() * 7) - 3;
  session.stats.possession[0] = Math.max(30, Math.min(70, session.stats.possession[0] + posShift));
  session.stats.possession[1] = 100 - session.stats.possession[0];

  // Random events based on advanced minutes
  for (let m = 0; m < minutesToAdvance; m++) {
    const currentMin = session.minute - minutesToAdvance + m + 1;
    if (currentMin > 90) break;

    const eventProb = rand();
    
    // 1. Goal (2.5% chance per minute)
    if (eventProb < 0.025) {
      const isHomeGoal = rand() > 0.48; // Home team has slight home advantage
      const teamId = isHomeGoal ? 'home' : 'away';
      const scoringTeamName = isHomeGoal ? session.lineups.home : session.lineups.away;
      
      const strikers = scoringTeamName.startingXI.filter(p => (p.position === 'FWD' || p.position === 'MID') && !p.isSubbedOut);
      if (strikers.length > 0) {
        const scorer = strikers[Math.floor(rand() * strikers.length)];
        scorer.stats.goals += 1;
        scorer.stats.shots += 1;
        scorer.stats.shotsOnTarget += 1;
        scorer.rating = parseFloat((scorer.rating + 0.6).toFixed(1));

        if (isHomeGoal) {
          session.homeScore += 1;
          session.stats.shots[0] += 1;
          session.stats.shotsOnTarget[0] += 1;
        } else {
          session.awayScore += 1;
          session.stats.shots[1] += 1;
          session.stats.shotsOnTarget[1] += 1;
        }

        // Assist
        const helper = strikers.find(p => p.id !== scorer.id);
        let assistDetail = '';
        if (helper && rand() > 0.4) {
          helper.stats.assists += 1;
          helper.rating = parseFloat((helper.rating + 0.3).toFixed(1));
          assistDetail = `Assist: ${helper.name}`;
        }

        session.events.push({
          id: `${matchId}_ev_g_${currentMin}_${rand().toString(36).substr(2, 4)}`,
          type: 'goal',
          minute: currentMin,
          teamId,
          playerName: scorer.name,
          detail: assistDetail
        });
      }
    } 
    // 2. Shot (non-goal) (10% chance)
    else if (eventProb < 0.125) {
      const isHomeShot = rand() > 0.48;
      if (isHomeShot) {
        session.stats.shots[0] += 1;
        if (rand() > 0.6) {
          session.stats.shotsOnTarget[0] += 1;
          session.stats.saves[1] += 1; // Away goalie save
        }
      } else {
        session.stats.shots[1] += 1;
        if (rand() > 0.6) {
          session.stats.shotsOnTarget[1] += 1;
          session.stats.saves[0] += 1; // Home goalie save
        }
      }
    }
    // 3. Corner (8% chance)
    else if (eventProb < 0.205) {
      if (rand() > 0.5) session.stats.corners[0] += 1;
      else session.stats.corners[1] += 1;
    }
    // 4. Foul (12% chance)
    else if (eventProb < 0.325) {
      const isHomeFoul = rand() > 0.5;
      if (isHomeFoul) {
        session.stats.fouls[0] += 1;
        // Chance of yellow card on foul
        if (rand() < 0.15) {
          const players = session.lineups.home.startingXI.filter(p => !p.isSubbedOut);
          const target = players[Math.floor(rand() * players.length)];
          if (target.stats.yellowCards === 0) {
            target.stats.yellowCards = 1;
            target.rating = parseFloat((target.rating - 0.2).toFixed(1));
            session.stats.yellowCards[0] += 1;
            session.events.push({
              id: `${matchId}_ev_yc_${currentMin}`,
              type: 'yellow_card',
              minute: currentMin,
              teamId: 'home',
              playerName: target.name
            });
          } else if (target.stats.yellowCards === 1 && target.stats.redCards === 0) {
            target.stats.yellowCards = 2;
            target.stats.redCards = 1;
            target.rating = parseFloat((target.rating - 1.0).toFixed(1));
            session.stats.yellowCards[0] += 1;
            session.stats.redCards[0] += 1;
            session.events.push({
              id: `${matchId}_ev_rc_${currentMin}`,
              type: 'red_card',
              minute: currentMin,
              teamId: 'home',
              playerName: target.name,
              detail: 'Second Yellow Card'
            });
          }
        }
      } else {
        session.stats.fouls[1] += 1;
        if (rand() < 0.15) {
          const players = session.lineups.away.startingXI.filter(p => !p.isSubbedOut);
          const target = players[Math.floor(rand() * players.length)];
          if (target.stats.yellowCards === 0) {
            target.stats.yellowCards = 1;
            target.rating = parseFloat((target.rating - 0.2).toFixed(1));
            session.stats.yellowCards[1] += 1;
            session.events.push({
              id: `${matchId}_ev_yc_${currentMin}`,
              type: 'yellow_card',
              minute: currentMin,
              teamId: 'away',
              playerName: target.name
            });
          } else if (target.stats.yellowCards === 1 && target.stats.redCards === 0) {
            target.stats.yellowCards = 2;
            target.stats.redCards = 1;
            target.rating = parseFloat((target.rating - 1.0).toFixed(1));
            session.stats.yellowCards[1] += 1;
            session.stats.redCards[1] += 1;
            session.events.push({
              id: `${matchId}_ev_rc_${currentMin}`,
              type: 'red_card',
              minute: currentMin,
              teamId: 'away',
              playerName: target.name,
              detail: 'Second Yellow Card'
            });
          }
        }
      }
    }
    // 5. Offside (5% chance)
    else if (eventProb < 0.375) {
      if (rand() > 0.5) session.stats.offsides[0] += 1;
      else session.stats.offsides[1] += 1;
    }
    // 6. Substitution (triggered mid game, e.g. 50-80 mins)
    else if (currentMin >= 50 && currentMin <= 80 && rand() < 0.08) {
      const isHomeSub = rand() > 0.5;
      const team = isHomeSub ? session.lineups.home : session.lineups.away;
      const teamLabel = isHomeSub ? 'home' : 'away';

      const unplayedBench = team.bench.filter(p => !p.isSubbedIn);
      const starters = team.startingXI.filter(p => !p.isSubbedOut && p.stats.redCards === 0);

      if (unplayedBench.length > 0 && starters.length > 0) {
        const subIn = unplayedBench[Math.floor(rand() * unplayedBench.length)];
        // Try to match position
        const matchingStarters = starters.filter(p => p.position === subIn.position);
        const subOut = matchingStarters.length > 0 
          ? matchingStarters[Math.floor(rand() * matchingStarters.length)]
          : starters[Math.floor(rand() * starters.length)];

        subIn.isSubbedIn = true;
        subOut.isSubbedOut = true;
        subIn.subMin = currentMin;
        subOut.subMin = currentMin;

        session.events.push({
          id: `${matchId}_ev_sub_${currentMin}`,
          type: 'substitution',
          minute: currentMin,
          teamId: teamLabel,
          playerName: subIn.name,
          playerNameOut: subOut.name
        });
      }
    }
  }

  // Sort events chronologically
  session.events.sort((a, b) => a.minute - b.minute);

  saveLiveSession(matchId, session);
  return session;
}

export function manualTriggerEvent(matchId: string, type: 'goal' | 'yellow_card' | 'red_card' | 'substitution', team: 'home' | 'away'): LiveMatchData {
  const session = getLiveSession(matchId);
  if (!session || session.status !== 'live') return session || ({} as LiveMatchData);

  const rand = Math.random;
  const currentMin = session.minute;

  const teamL = team === 'home' ? session.lineups.home : session.lineups.away;
  const starters = teamL.startingXI.filter(p => !p.isSubbedOut && p.stats.redCards === 0);

  if (starters.length === 0) return session;

  if (type === 'goal') {
    const scorer = starters[Math.floor(rand() * starters.length)];
    scorer.stats.goals += 1;
    scorer.stats.shots += 1;
    scorer.stats.shotsOnTarget += 1;
    scorer.rating = parseFloat((scorer.rating + 0.6).toFixed(1));

    if (team === 'home') {
      session.homeScore += 1;
      session.stats.shots[0] += 1;
      session.stats.shotsOnTarget[0] += 1;
    } else {
      session.awayScore += 1;
      session.stats.shots[1] += 1;
      session.stats.shotsOnTarget[1] += 1;
    }

    session.events.push({
      id: `${matchId}_ev_m_g_${currentMin}_${rand().toString(36).substr(2, 4)}`,
      type: 'goal',
      minute: currentMin,
      teamId: team,
      playerName: scorer.name
    });
  } else if (type === 'yellow_card') {
    const target = starters[Math.floor(rand() * starters.length)];
    if (target.stats.yellowCards === 0) {
      target.stats.yellowCards = 1;
      target.rating = parseFloat((target.rating - 0.2).toFixed(1));
      if (team === 'home') {
        session.stats.yellowCards[0] += 1;
      } else {
        session.stats.yellowCards[1] += 1;
      }
      session.events.push({
        id: `${matchId}_ev_m_yc_${currentMin}_${rand().toString(36).substr(2, 4)}`,
        type: 'yellow_card',
        minute: currentMin,
        teamId: team,
        playerName: target.name
      });
    } else if (target.stats.yellowCards === 1) {
      target.stats.yellowCards = 2;
      target.stats.redCards = 1;
      target.rating = parseFloat((target.rating - 1.0).toFixed(1));
      if (team === 'home') {
        session.stats.yellowCards[0] += 1;
        session.stats.redCards[0] += 1;
      } else {
        session.stats.yellowCards[1] += 1;
        session.stats.redCards[1] += 1;
      }
      session.events.push({
        id: `${matchId}_ev_m_rc_${currentMin}_${rand().toString(36).substr(2, 4)}`,
        type: 'red_card',
        minute: currentMin,
        teamId: team,
        playerName: target.name,
        detail: 'Second Yellow Card'
      });
    }
  } else if (type === 'red_card') {
    const target = starters[Math.floor(rand() * starters.length)];
    target.stats.redCards = 1;
    target.rating = parseFloat((target.rating - 1.2).toFixed(1));
    if (team === 'home') {
      session.stats.redCards[0] += 1;
    } else {
      session.stats.redCards[1] += 1;
    }
    session.events.push({
      id: `${matchId}_ev_m_rc_${currentMin}_${rand().toString(36).substr(2, 4)}`,
      type: 'red_card',
      minute: currentMin,
      teamId: team,
      playerName: target.name,
      detail: 'Direct Red Card'
    });
  } else if (type === 'substitution') {
    const unplayedBench = teamL.bench.filter(p => !p.isSubbedIn);
    if (unplayedBench.length > 0) {
      const subIn = unplayedBench[Math.floor(rand() * unplayedBench.length)];
      const subOut = starters[Math.floor(rand() * starters.length)];

      subIn.isSubbedIn = true;
      subOut.isSubbedOut = true;
      subIn.subMin = currentMin;
      subOut.subMin = currentMin;

      session.events.push({
        id: `${matchId}_ev_m_sub_${currentMin}_${rand().toString(36).substr(2, 4)}`,
        type: 'substitution',
        minute: currentMin,
        teamId: team,
        playerName: subIn.name,
        playerNameOut: subOut.name
      });
    }
  }

  session.events.sort((a, b) => a.minute - b.minute);
  saveLiveSession(matchId, session);
  return session;
}

// ── CACHING IMPLEMENTATION ──
interface CacheEntry {
  timestamp: number;
  data: LiveMatchData;
}

const clientCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 30000; // 30 seconds

export async function fetchLiveMatchData(matchId: string, match: Match, forceRefresh = false): Promise<LiveMatchData> {
  const now = Date.now();
  
  if (!forceRefresh) {
    const cached = clientCache.get(matchId);
    if (cached && now - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }
  }

  // Fetch or simulate live data
  // Check if live simulation session exists
  const liveSession = getLiveSession(matchId);
  let data: LiveMatchData;
  if (liveSession) {
    data = liveSession;
  } else {
    data = generateStaticMatchData(matchId, match);
  }

  // Cache response
  clientCache.set(matchId, {
    timestamp: now,
    data
  });

  // Artificial network delay to showcase loading skeletons (300ms)
  await new Promise(resolve => setTimeout(resolve, 300));

  return data;
}
