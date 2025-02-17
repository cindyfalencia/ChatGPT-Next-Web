type MBTITrait = {
  description: string;
  communicationStyle: string;
  analysisCriteria: {
    [key: string]: {
      expectedScore: number;
      indicators: string[];
      weight: number;
    };
  };
};

export const mbtiDictionary: Record<string, MBTITrait> = {
  ISTJ: {
    description: "Practical and responsible, prefers structure and planning",
    communicationStyle: "Clear and precise, prefers facts over speculation",
    analysisCriteria: {
      "E/I": {
        expectedScore: -0.9,
        indicators: [
          "solitary activities",
          "independent work",
          "quiet reflection",
        ],
        weight: 0.95,
      },
      "S/N": {
        expectedScore: 0.8,
        indicators: [
          "real-world applications",
          "practical methods",
          "tangible results",
        ],
        weight: 0.85,
      },
      "T/F": {
        expectedScore: 0.7,
        indicators: ["logical approach", "procedural analysis", "data-driven"],
        weight: 0.85,
      },
      "J/P": {
        expectedScore: 0.8,
        indicators: ["strict planning", "routines", "organizational methods"],
        weight: 0.85,
      },
    },
  },
  ISFJ: {
    description: "Caring and dependable protector",
    communicationStyle: "Warm and supportive responses",
    analysisCriteria: {
      "E/I": {
        expectedScore: -0.7,
        indicators: ["quiet support", "behind-the-scenes", "modest"],
        weight: 0.85,
      },
      "S/N": {
        expectedScore: 0.8,
        indicators: ["practical help", "present focus", "concrete details"],
        weight: 0.9,
      },
      "T/F": {
        expectedScore: -0.9,
        indicators: ["emotional support", "harmony", "empathy"],
        weight: 0.95,
      },
      "J/P": {
        expectedScore: 0.8,
        indicators: ["responsibility", "duty", "organization"],
        weight: 0.85,
      },
    },
  },
  INFJ: {
    description: "Creative and insightful visionary",
    communicationStyle: "Thoughtful and empathetic responses",
    analysisCriteria: {
      "E/I": {
        expectedScore: -0.6,
        indicators: ["deep reflection", "introspection", "quiet leadership"],
        weight: 0.8,
      },
      "S/N": {
        expectedScore: -0.9,
        indicators: ["future vision", "abstract thinking", "possibilities"],
        weight: 0.95,
      },
      "T/F": {
        expectedScore: -0.85,
        indicators: ["empathy", "values", "human connection"],
        weight: 0.9,
      },
      "J/P": {
        expectedScore: 0.7,
        indicators: [
          "structured vision",
          "organized planning",
          "goal-oriented",
        ],
        weight: 0.8,
      },
    },
  },
  INTJ: {
    description: "Strategic and visionary thinker, prefers long-term planning",
    communicationStyle: "Precise, goal-driven, and analytical",
    analysisCriteria: {
      "E/I": {
        expectedScore: -1.0,
        indicators: ["deep focus", "independent work", "strategic vision"],
        weight: 1.0,
      },
      "S/N": {
        expectedScore: -1.0,
        indicators: [
          "long-term planning",
          "future possibilities",
          "big-picture thinking",
        ],
        weight: 1.0,
      },
      "T/F": {
        expectedScore: 1.0,
        indicators: [
          "logical reasoning",
          "objective analysis",
          "systematic approach",
        ],
        weight: 1.0,
      },
      "J/P": {
        expectedScore: 0.9,
        indicators: ["structured execution", "planning", "task efficiency"],
        weight: 0.9,
      },
    },
  },
  ISTP: {
    description: "Practical and flexible problem-solver",
    communicationStyle: "Direct and action-oriented responses",
    analysisCriteria: {
      "E/I": {
        expectedScore: -0.7,
        indicators: [
          "independent action",
          "solitary focus",
          "practical solutions",
        ],
        weight: 0.85,
      },
      "S/N": {
        expectedScore: 0.85,
        indicators: ["present focus", "concrete details", "hands-on approach"],
        weight: 0.9,
      },
      "T/F": {
        expectedScore: 0.8,
        indicators: [
          "logical analysis",
          "objective reasoning",
          "practical solutions",
        ],
        weight: 0.85,
      },
      "J/P": {
        expectedScore: -0.7,
        indicators: ["flexibility", "spontaneity", "adaptability"],
        weight: 0.8,
      },
    },
  },
  ISFP: {
    description: "Gentle and creative free spirit",
    communicationStyle: "Warm and artistic responses",
    analysisCriteria: {
      "E/I": {
        expectedScore: -0.6,
        indicators: ["quiet creativity", "solitary focus", "introspection"],
        weight: 0.8,
      },
      "S/N": {
        expectedScore: 0.7,
        indicators: [
          "present focus",
          "concrete details",
          "aesthetic appreciation",
        ],
        weight: 0.85,
      },
      "T/F": {
        expectedScore: -0.85,
        indicators: ["emotional expression", "harmony", "empathy"],
        weight: 0.9,
      },
      "J/P": {
        expectedScore: -0.8,
        indicators: ["flexibility", "spontaneity", "open-endedness"],
        weight: 0.85,
      },
    },
  },
  INFP: {
    description: "Idealistic and empathetic dreamer",
    communicationStyle: "Thoughtful and values-driven responses",
    analysisCriteria: {
      "E/I": {
        expectedScore: -0.7,
        indicators: ["introspection", "quiet reflection", "solitary focus"],
        weight: 0.85,
      },
      "S/N": {
        expectedScore: -0.9,
        indicators: ["future vision", "abstract thinking", "possibilities"],
        weight: 0.95,
      },
      "T/F": {
        expectedScore: -0.85,
        indicators: ["empathy", "values", "human connection"],
        weight: 0.9,
      },
      "J/P": {
        expectedScore: -0.7,
        indicators: ["flexibility", "open-endedness", "spontaneity"],
        weight: 0.8,
      },
    },
  },
  INTP: {
    description: "Logical and innovative thinker",
    communicationStyle: "Analytical and abstract responses",
    analysisCriteria: {
      "E/I": {
        expectedScore: -0.9,
        indicators: ["independent thinking", "solitary focus", "introspection"],
        weight: 0.95,
      },
      "S/N": {
        expectedScore: -0.85,
        indicators: [
          "abstract concepts",
          "theoretical exploration",
          "future focus",
        ],
        weight: 0.9,
      },
      "T/F": {
        expectedScore: 0.9,
        indicators: [
          "logical reasoning",
          "objective analysis",
          "systematic approach",
        ],
        weight: 0.95,
      },
      "J/P": {
        expectedScore: -0.8,
        indicators: ["flexibility", "open-endedness", "spontaneity"],
        weight: 0.85,
      },
    },
  },
  ESTP: {
    description: "Energetic and action-oriented adventurer",
    communicationStyle: "Direct and energetic responses",
    analysisCriteria: {
      "E/I": {
        expectedScore: 0.9,
        indicators: ["social interaction", "action-oriented", "outgoing"],
        weight: 0.95,
      },
      "S/N": {
        expectedScore: 0.85,
        indicators: ["present focus", "concrete details", "hands-on approach"],
        weight: 0.9,
      },
      "T/F": {
        expectedScore: 0.8,
        indicators: [
          "logical analysis",
          "objective reasoning",
          "practical solutions",
        ],
        weight: 0.85,
      },
      "J/P": {
        expectedScore: -0.7,
        indicators: ["flexibility", "spontaneity", "adaptability"],
        weight: 0.8,
      },
    },
  },
  ESFP: {
    description: "Spontaneous and enthusiastic entertainer",
    communicationStyle: "Playful, lively, and engaging",
    analysisCriteria: {
      "E/I": {
        expectedScore: 1.0,
        indicators: [
          "social fun",
          "high energy",
          "life of the party",
          "expressive",
        ],
        weight: 1.0,
      },
      "S/N": {
        expectedScore: 0.8,
        indicators: ["enjoying the moment", "thrill-seeking", "hands-on"],
        weight: 0.85,
      },
      "T/F": {
        expectedScore: -0.7,
        indicators: ["emotional connection", "harmony", "caring for others"],
        weight: 0.85,
      },
      "J/P": {
        expectedScore: -1.0,
        indicators: ["improvised fun", "flexibility", "going with the flow"],
        weight: 1.0,
      },
    },
  },
  ENFP: {
    description: "Enthusiastic and creative motivator",
    communicationStyle: "Inspiring and empathetic responses",
    analysisCriteria: {
      "E/I": {
        expectedScore: 0.8,
        indicators: ["social interaction", "outgoing", "energetic"],
        weight: 0.9,
      },
      "S/N": {
        expectedScore: -0.9,
        indicators: ["future vision", "abstract thinking", "possibilities"],
        weight: 0.95,
      },
      "T/F": {
        expectedScore: -0.85,
        indicators: ["empathy", "values", "human connection"],
        weight: 0.9,
      },
      "J/P": {
        expectedScore: -0.7,
        indicators: ["flexibility", "open-endedness", "spontaneity"],
        weight: 0.8,
      },
    },
  },
  ENTP: {
    description: "Innovative and curious debater",
    communicationStyle: "Logical and abstract responses",
    analysisCriteria: {
      "E/I": {
        expectedScore: 1.0,
        indicators: [
          "social interaction",
          "debate",
          "discussion",
          "group brainstorming",
          "persuasion",
          "outspoken",
        ],
        weight: 1.0,
      },
      "S/N": {
        expectedScore: -1.0,
        indicators: [
          "future possibilities",
          "abstract ideas",
          "innovation",
          "theory crafting",
          "new perspectives",
        ],
        weight: 1.0,
      },
      "T/F": {
        expectedScore: 0.9,
        indicators: [
          "logical reasoning",
          "critical thinking",
          "argumentation",
          "objective analysis",
          "challenging assumptions",
        ],
        weight: 0.9,
      },
      "J/P": {
        expectedScore: -1.0,
        indicators: [
          "improvisation",
          "spontaneous thinking",
          "playful exploration",
          "open-ended",
        ],
        weight: 0.9,
      },
    },
  },
  ESTJ: {
    description: "Efficient and organized leader",
    communicationStyle: "Direct and structured responses",
    analysisCriteria: {
      "E/I": {
        expectedScore: 0.9,
        indicators: ["social interaction", "outgoing", "energetic"],
        weight: 0.95,
      },
      "S/N": {
        expectedScore: 0.85,
        indicators: ["present focus", "concrete details", "hands-on approach"],
        weight: 0.9,
      },
      "T/F": {
        expectedScore: 0.8,
        indicators: [
          "logical reasoning",
          "objective analysis",
          "systematic approach",
        ],
        weight: 0.85,
      },
      "J/P": {
        expectedScore: 0.9,
        indicators: ["structured planning", "goal-oriented", "organized"],
        weight: 0.95,
      },
    },
  },
  ESFJ: {
    description: "Warm and responsible helper",
    communicationStyle: "Supportive and structured responses",
    analysisCriteria: {
      "E/I": {
        expectedScore: 0.85,
        indicators: ["social interaction", "outgoing", "energetic"],
        weight: 0.9,
      },
      "S/N": {
        expectedScore: 0.8,
        indicators: ["present focus", "concrete details", "hands-on approach"],
        weight: 0.85,
      },
      "T/F": {
        expectedScore: -0.9,
        indicators: ["emotional support", "harmony", "empathy"],
        weight: 0.95,
      },
      "J/P": {
        expectedScore: 0.85,
        indicators: ["structured planning", "goal-oriented", "organized"],
        weight: 0.9,
      },
    },
  },
  ENFJ: {
    description: "Charismatic and inspiring leader",
    communicationStyle: "Supportive and motivating responses",
    analysisCriteria: {
      "E/I": {
        expectedScore: 0.9,
        indicators: ["social interaction", "outgoing", "energetic"],
        weight: 0.95,
      },
      "S/N": {
        expectedScore: -0.8,
        indicators: ["future vision", "abstract thinking", "possibilities"],
        weight: 0.9,
      },
      "T/F": {
        expectedScore: -0.85,
        indicators: ["empathy", "values", "human connection"],
        weight: 0.9,
      },
      "J/P": {
        expectedScore: 0.8,
        indicators: ["structured planning", "goal-oriented", "organized"],
        weight: 0.85,
      },
    },
  },
  ENTJ: {
    description: "Strategic and decisive commander",
    communicationStyle: "Direct and logical responses",
    analysisCriteria: {
      "E/I": {
        expectedScore: 0.9,
        indicators: ["social interaction", "outgoing", "energetic"],
        weight: 0.95,
      },
      "S/N": {
        expectedScore: -0.85,
        indicators: ["future vision", "abstract thinking", "possibilities"],
        weight: 0.9,
      },
      "T/F": {
        expectedScore: 0.9,
        indicators: [
          "logical reasoning",
          "objective analysis",
          "systematic approach",
        ],
        weight: 0.95,
      },
      "J/P": {
        expectedScore: 0.85,
        indicators: ["structured planning", "goal-oriented", "organized"],
        weight: 0.9,
      },
    },
  },
};

// Helper type for dictionary access
export type MBTIType = keyof typeof mbtiDictionary;
