export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type LanguageId = 'java' | 'javascript' | 'sql';

export interface Problem {
  id: string;
  languageId: LanguageId;
  code: string;
  explanation: string;
  category: string;
  difficulty: Difficulty;
  createdAt: Date;
  updatedAt: Date;
}

export interface Language {
  id: LanguageId;
  name: string;
  displayName: string;
  icon: string;
}

export const LANGUAGES: Language[] = [
  { id: 'java', name: 'Java', displayName: 'Java', icon: '/images/languages/java.svg' },
  { id: 'javascript', name: 'JavaScript', displayName: 'JavaScript', icon: '/images/languages/javascript.svg' },
  { id: 'sql', name: 'SQL', displayName: 'SQL', icon: '/images/languages/sql.svg' },
];
