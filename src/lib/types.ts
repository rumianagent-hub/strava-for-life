export type GoalCategory =
  | "health"
  | "fitness"
  | "learning"
  | "mindfulness"
  | "productivity"
  | "social"
  | "creativity"
  | "other";

export type GoalPrivacy = "private" | "squad";

export type GoalStatus = "active" | "paused" | "archived";

export interface UserDoc {
  uid: string;
  displayName: string;
  photoURL: string;
  email: string;
  timezone: string;
  settings: {
    weeklyEmailEnabled: boolean;
  };
}

export interface Goal {
  id: string;
  ownerUid: string;
  title: string;
  description: string;
  category: GoalCategory;
  privacy: GoalPrivacy;
  status: GoalStatus;
  startDate: string; // yyyy-mm-dd
  squadId?: string;
  currentStreak: number;
  bestStreak: number;
  lastCheckinDate?: string; // yyyy-mm-dd
}

export interface Checkin {
  date: string; // yyyy-mm-dd
  done: boolean;
  note: string;
}

export interface Squad {
  id: string;
  name: string;
  ownerUid: string;
  memberUids: string[];
  maxMembers: number;
  inviteCode: string;
  privacy: "public" | "private";
}
