export interface User {
  uid: string;
  email: string;
  displayName: string | null;
  createdAt: Date;
}

export interface UserProfile extends User {
  totalSessions: number;
  reviewedProblems: string[];
}
