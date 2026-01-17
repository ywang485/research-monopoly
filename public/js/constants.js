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
    "Dr. Overthink", "Prof. Procrastinus", "Dr. Coffee McBreak", "Doc. Footnote",
    "Prof. Actually", "Dr. Well-Actually", "Doc. Citation Needed", "Prof. P-Value",
    "Dr. Significant", "Prof. Outlier", "Doc. Standard Deviation", "Dr. Mean",
    // Pompous names
    "Sir Reginald Hypothesis III", "Dame Theorica von Data", "Baron von Experiment",
    "Countess Correlation", "Duke of Peer Review", "Marquis de Methodology",
    // Absurd names
    "Dr. Definitely Maybe", "Prof. Trust Me Bro", "Doc. Source: Vibes",
    "Dr. Probably Fine", "Prof. Close Enough", "Doc. Roughly Speaking",
    "Dr. According to My Calculations", "Prof. In Theory", "Doc. On Paper",
    // Self-aware names
    "Dr. Imposter Syndrome", "Prof. Dunning-Kruger", "Doc. Confirmation Bias",
    "Dr. Hindsight", "Prof. Overthinking It", "Doc. Second Guess",
    // Food-themed
    "Dr. Earl Grey", "Prof. Espresso", "Doc. Sandwich Break",
    "Dr. Leftover Pizza", "Prof. Vending Machine", "Doc. Deadline Snacks"
];

// ============================================
// GAME CONSTANTS
// ============================================
// Student types - names will be translated via t() function
const STUDENT_TYPES = {
    undergraduate: { nameKey: 'student.undergraduate', years: 1, cost: 5 },
    master: { nameKey: 'student.master', years: 3, cost: 15 },
    phd: { nameKey: 'student.phd', years: 7, cost: 35 }
};

// Helper function to get translated student name
function getStudentName(type) {
    const student = STUDENT_TYPES[type];
    return student ? t(student.nameKey) : type;
}

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
    EUREKA: 'eureka'
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
    [SPACE_TYPES.EUREKA]: '#f1c40f'      // Pencil bright yellow
};

// Handwritten formula decorations for notebook margins
const MARGIN_FORMULAS = [
    'E = mc²', '∫dx', 'Σn²', 'λ = h/p', '∇×B', 'ψ(x,t)',
    '∂²u/∂t²', 'lim→∞', '∮F·dr', 'P(A|B)', '∆G = ∆H', 'F = ma',
    'H₂O', 'CO₂', 'π ≈ 3.14', 'e^iπ + 1 = 0', '√2', 'dx/dt'
];

// Space descriptions - use translation keys for i18n
const SPACE_DESCRIPTION_KEYS = {
    [SPACE_TYPES.START]: 'spaceDesc.start',
    [SPACE_TYPES.HYPOTHESIS]: 'spaceDesc.hypothesis',
    [SPACE_TYPES.RECRUIT]: 'spaceDesc.recruit',
    [SPACE_TYPES.CONFERENCE]: 'spaceDesc.conference',
    [SPACE_TYPES.SABBATICAL]: 'spaceDesc.sabbatical',
    [SPACE_TYPES.COMMUNITY_SERVICE]: 'spaceDesc.communityService',
    [SPACE_TYPES.GRANT]: 'spaceDesc.grant',
    [SPACE_TYPES.SCANDAL]: 'spaceDesc.scandal',
    [SPACE_TYPES.COLLABORATION]: 'spaceDesc.collaboration',
    [SPACE_TYPES.EUREKA]: 'spaceDesc.eureka'
};

// Helper function to get translated space description
function getSpaceDescription(spaceType) {
    const key = SPACE_DESCRIPTION_KEYS[spaceType];
    return key ? t(key) : spaceType;
}

const MAX_AGE = 80;
const STARTING_AGE = 70;

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
COMMUNITY_SERVICE|Community Service|0
HYPOTHESIS|Research Question 5|2
SABBATICAL|Research Leave|0
HYPOTHESIS|Research Question 6|5
SCANDAL|Academic Scandal|0
HYPOTHESIS|Research Question 7|3
COLLABORATION|Research Network|0
HYPOTHESIS|Research Question 8|4
EUREKA|Breakthrough Moment|0
HYPOTHESIS|Research Question 9|2
GRANT|Major Funding|0
HYPOTHESIS|Research Question 10|3
RECRUIT|Faculty Hiring|0
HYPOTHESIS|Research Question 11|4
CONFERENCE|Global Conference|0
HYPOTHESIS|Research Question 12|3
`;
