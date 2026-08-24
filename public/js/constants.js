// Theory Investment Game - Constants and Configuration

// ============================================
// ANIMATION CONSTANTS
// ============================================
const ANIMATION_STEP_DURATION = 200; // ms per space
const ANIMATION_BOUNCE_HEIGHT = 15; // pixels

// ============================================
// RANDOM SCIENTIST NAMES
// ============================================
const SCIENTIST_NAMES = [
    // Curated names
    'Coffee-Fueled Procrastinator',
    'Imposter Syndrome Incarnate',
    'The Serial Conference Attender',
    'Deadline Extensions McGee',
    'Tenure-Track Anxiety',
    'The Passive-Aggressive Peer Reviewer',
    'Footnote Obsessive',
    'Niche Topic Evangelist',
    'Citation Hoarder',
    'Adjunct Job Juggler',
    'Office Hour Ghost',
    'Publish or Perish Personified',
    'Sabbatical Daydreamer',
    'Panel Monopolizer',
    'Free Wine Reception Hunter',
    'Awkward Q&A Questioner',
    'The Unreturned Email',
    // Funny names
    "Dr. Overthink", "Prof. Procrastinus", "Dr. Coffee McBreak", 
    "Dr. Well-Actually", "Dr. Citation Needed", "Prof. P-Value",
    "Dr. Mean",
    "Duke of Peer Review", "Marquis de Methodology",
    // Absurd names
    "Prof. Trust Me Bro",
    "Prof. Close Enough", "Doc. Roughly Speaking",
    // Self-aware names
    "Dr. Imposter Syndrome", "Prof. Dunning-Kruger", 
    "Dr. Hindsight", "Prof. Overthinking It",
    "Dr. Leftover Pizza", "Prof. Vending Machine", "Doc. Deadline Snacks"
];

// ============================================
// STUDENT NAMES
// ============================================
// Ordinary human names, deliberately - hiring "an Undergraduate" is abstract,
// hiring (and later sacrificing) an actual named person is not.
const STUDENT_FIRST_NAMES = [
    'Alex', 'Jordan', 'Sam', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Jamie',
    'Avery', 'Quinn', 'Priya', 'Wei', 'Fatima', 'Diego', 'Yuki', 'Emma',
    'Liam', 'Noah', 'Olivia', 'Mateo', 'Amara', 'Kenji', 'Zara', 'Lucas',
    'Ingrid', 'Chidi', 'Sofia', 'Hiro', 'Aisha', 'Pavel'
];

const STUDENT_LAST_NAMES = [
    'Chen', 'Patel', 'Garcia', 'Kim', 'Müller', 'Okafor', 'Nguyen', 'Rossi',
    'Johnson', 'Silva', 'Kowalski', 'Tanaka', 'Andersson', 'Hassan', 'Novak',
    'Reyes', 'Dubois', 'Petrov', 'Yamamoto', 'Osei'
];

// ============================================
// GAME CONSTANTS
// ============================================
const STUDENT_TYPES = {
    undergraduate: { name: 'Undergraduate', years: 1, cost: 5 },
    master: { name: 'Master Student', years: 3, cost: 15 },
    phd: { name: 'PhD Student', years: 7, cost: 35 }
};

const SPACE_TYPES = {
    START: 'start',
    HYPOTHESIS: 'hypothesis',
    RECRUIT: 'recruit',
    CONFERENCE: 'conference',
    SABBATICAL: 'sabbatical',
    COMMUNITY_SERVICE: 'community_service',
    GRANT: 'grant',
    SCANDAL: 'scandal',
    COLLABORATION: 'collaboration',
    EUREKA: 'eureka',
    INSTITUTION: 'institution'
};

// ============================================
// ITEMS
// ============================================
const ITEM_TYPES = {
    LOADED_DICE: 'loaded_dice',
    EXTRA_TURN: 'extra_turn',
    INITIATE_SCANDAL: 'initiate_scandal',
    SCANDAL_IMMUNITY: 'scandal_immunity'
};

const ITEMS = {
    [ITEM_TYPES.LOADED_DICE]: {
        name: 'p-Hacked Results',
        icon: '🎲',
        cost: 12,
        description: 'Torture the data until it confesses - next time you roll, pick any value 1-6 instead of leaving it to chance.'
    },
    [ITEM_TYPES.EXTRA_TURN]: {
        name: 'All-Nighter',
        icon: '☕',
        cost: 18,
        description: 'Roll again immediately after your current turn ends.'
    },
    [ITEM_TYPES.INITIATE_SCANDAL]: {
        name: 'Reviewer #2',
        icon: '📰',
        cost: 15,
        description: "Sic the most notoriously harsh reviewer in academia on a rival's work - they immediately lose fame."
    },
    [ITEM_TYPES.SCANDAL_IMMUNITY]: {
        name: 'Tenure',
        icon: '🛡️',
        cost: 10,
        description: 'Passive - automatically blocks the next scandal against you.'
    }
};

// Colored pencil palette for notebook aesthetic
const SPACE_COLORS = {
    [SPACE_TYPES.START]: '#27ae60',      // Pencil green
    [SPACE_TYPES.HYPOTHESIS]: '#f39c12', // Pencil yellow/orange
    [SPACE_TYPES.RECRUIT]: '#3498db',    // Pencil blue
    [SPACE_TYPES.CONFERENCE]: '#9b59b6', // Pencil purple
    [SPACE_TYPES.SABBATICAL]: '#1abc9c', // Pencil teal
    [SPACE_TYPES.COMMUNITY_SERVICE]: '#e74c3c', // Pencil red
    [SPACE_TYPES.GRANT]: '#2ecc71',      // Pencil bright green
    [SPACE_TYPES.SCANDAL]: '#c0392b',    // Pencil dark red
    [SPACE_TYPES.COLLABORATION]: '#e67e22', // Pencil orange
    [SPACE_TYPES.EUREKA]: '#f1c40f',     // Pencil bright yellow
    [SPACE_TYPES.INSTITUTION]: '#8e44ad' // Pencil violet
};

// Handwritten formula decorations for notebook margins
const MARGIN_FORMULAS = [
    'E = mc²', '∫dx', 'Σn²', 'λ = h/p', '∇×B', 'ψ(x,t)',
    '∂²u/∂t²', 'lim→∞', '∮F·dr', 'P(A|B)', '∆G = ∆H', 'F = ma',
    'H₂O', 'CO₂', 'π ≈ 3.14', 'e^iπ + 1 = 0', '√2', 'dx/dt'
];

const SPACE_DESCRIPTIONS = {
    [SPACE_TYPES.START]: 'Begin your academic journey! Passing this space rejuvenates you by 2 years.',
    [SPACE_TYPES.HYPOTHESIS]: 'A research opportunity! Create a new hypothesis or invest in an existing one. If Scientific Underdeterminism lands here, the hypothesis becomes a proven theory.',
    [SPACE_TYPES.RECRUIT]: 'Graduate recruitment center. Spend fame points to hire students who extend your available research years.',
    [SPACE_TYPES.CONFERENCE]: "Present your work and gain recognition! ",
    [SPACE_TYPES.SABBATICAL]: 'Take a well-deserved break. Rejuvenate by 3 years of life.',
    [SPACE_TYPES.COMMUNITY_SERVICE]: 'Forced to do community service! Lose years to service work, but you can sacrifice a student to get away with it.',
    [SPACE_TYPES.GRANT]: 'Research funding! Receive a grant and gain 1-6 fame points from your peers.',
    [SPACE_TYPES.SCANDAL]: 'Academic misconduct allegations! Lose 5 fame points as your reputation suffers.',
    [SPACE_TYPES.COLLABORATION]: 'Team up with a colleague! Gain 2 fame and rejuvenate by 1 year through shared research.',
    [SPACE_TYPES.EUREKA]: 'A flash of brilliance! Claim the nearest uninvested hypothesis space for FREE (no life cost).',
    [SPACE_TYPES.INSTITUTION]: 'Spend fame on items that give you an edge: control your dice roll, take an extra turn, sic Reviewer #2 on a rival, or protect yourself from scandal.'
};

const MAX_AGE = 80;
const STARTING_AGE = 30;

// ============================================
// AI TEMPLATES
// ============================================
const AI_HYPOTHESIS_TEMPLATES = [
    "The {entity} exhibits quantum fluctuations",
    "{entity} behavior follows a cyclical pattern",
    "There exists a hidden variable affecting {entity}",
    "{entity} is influenced by external forces",
    "The structure of {entity} is self-organizing",
    "{entity} demonstrates emergent properties",
    "Observable {entity} is only part of a larger system",
    "{entity} evolution follows predictable rules",
    "The nature of {entity} is fundamentally probabilistic",
    "{entity} can be modeled using network theory"
];

const AI_HYPOTHESIS_ADDITIONS = [
    "Furthermore, this relates to temporal dynamics.",
    "This implies a deeper underlying mechanism.",
    "Additionally, boundary conditions play a key role.",
    "Moreover, symmetry principles may apply.",
    "This connects to information-theoretic constraints.",
    "The effect is measurable under controlled conditions.",
    "This suggests a universal scaling law.",
    "Causality must be carefully considered here.",
    "Environmental factors modulate this effect.",
    "This extends to higher-order interactions."
];

// ============================================
// DEFAULT MAP CONFIGURATION
// ============================================
const DEFAULT_MAP = `
# Theory Investment Game - Default Board
# Format: TYPE|NAME|EXTRA_DATA
# EXTRA_DATA for hypothesis spaces: investment_cost

START|Academic Career Begins|0
HYPOTHESIS|Research Question 1|3
GRANT|Research Grant|0
HYPOTHESIS|Research Question 2|2
RECRUIT|Graduate School|0
HYPOTHESIS|Research Question 3|4
CONFERENCE|Annual Symposium|0
HYPOTHESIS|Research Question 4|3
INSTITUTION|Research Institution|0
HYPOTHESIS|Research Question 5|2
COMMUNITY_SERVICE|Community Service|0
HYPOTHESIS|Research Question 6|5
SABBATICAL|Research Leave|0
HYPOTHESIS|Research Question 7|3
INSTITUTION|Innovation Lab|0
HYPOTHESIS|Research Question 8|4
SCANDAL|Academic Scandal|0
HYPOTHESIS|Research Question 9|3
COLLABORATION|Research Network|0
HYPOTHESIS|Research Question 10|4
EUREKA|Breakthrough Moment|0
HYPOTHESIS|Research Question 11|2
RECRUIT|Research Internship|0
HYPOTHESIS|Research Question 12|3
`;
