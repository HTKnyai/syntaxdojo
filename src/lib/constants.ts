export const APP_NAME = 'Syntax Dojo';
export const APP_DESCRIPTION =
  'プログラミング言語の文法を復習しながらタイピングスキルを向上';

// Session settings
export const DEFAULT_PROBLEMS_PER_SESSION = 10;
export const MAX_PROBLEMS_PER_SESSION = 50;

// Performance thresholds
export const WPM_THRESHOLDS = {
  BEGINNER: 30,
  INTERMEDIATE: 50,
  ADVANCED: 70,
  EXPERT: 100,
} as const;

export const ACCURACY_THRESHOLDS = {
  POOR: 80,
  GOOD: 90,
  EXCELLENT: 95,
} as const;

// React Query cache times (in milliseconds)
export const CACHE_TIME = {
  PROBLEMS: 1000 * 60 * 60, // 1 hour
  SESSIONS: 1000 * 60 * 5, // 5 minutes
  USER: 1000 * 60 * 10, // 10 minutes
} as const;
