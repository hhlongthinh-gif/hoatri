export type ChemicalType = 'element' | 'radical';

export interface ChemicalItem {
  id: string;
  name: string;        // e.g., "Natri", "Sunfat"
  symbol: string;      // e.g., "Na", "SO₄"
  valences: number[];  // e.g., [1] or [2] (or multiple, e.g., [2, 3] for Sắt)
  type: ChemicalType;  
  valenceText: string; // e.g., "I" or "II" or "II, III"
  description: string; // Fun fact / explanation
  chemistryTip?: string; // Mnemonic tip
  category?: string;   // e.g., "Kim loại", "Phi kim", "Gốc muối hóa trị I"
}

export type ScreenType = 'home' | 'quiz' | 'match' | 'sort' | 'handbook' | 'achievements';

export interface QuizQuestion {
  id: string;
  item: ChemicalItem;
  questionText: string;
  options: string[];
  correctAnswer: string; // e.g., "I", "II"
  explanation: string;
}

export interface MatchCard {
  id: string;
  content: string; // Symbol/Name or Valence
  type: 'name' | 'valence';
  itemId: string; // Refers to ChemicalItem id
  isMatched: boolean;
  isFlipped: boolean;
  colorClass: string;
}

export interface ScoreHistory {
  date: string;
  score: number;
  mode: 'quiz' | 'match' | 'sort';
  accuracy: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  unlockedAt?: string;
  requirementText: string;
}
