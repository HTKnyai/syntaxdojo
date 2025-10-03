import { LanguageId } from './problem';

export interface ProblemResult {
  problemId: string;
  timeSeconds: number;
  wpm: number;
  accuracy: number;
  incorrectCharIndices: number[];
}

export interface SessionResults {
  totalProblems: number;
  averageWPM: number;
  averageAccuracy: number;
  problemResults: ProblemResult[];
  totalTimeSeconds: number;
}

export interface SessionRecord {
  id: string;
  userId: string;
  languageId: LanguageId;
  createdAt: Date;
  results: SessionResults;
}

export type TypingSessionStatus = 'idle' | 'typing' | 'completed';
