export const queryKeys = {
  users: {
    detail: (uid: string) => ["users", uid] as const,
    batch: (uids: string[]) => ["users", "batch", ...uids] as const,
  },
  goals: {
    userGoals: (uid: string) => ["goals", "user", uid] as const,
    detail: (goalId: string) => ["goals", goalId] as const,
    squadGoals: (squadId: string) => ["goals", "squad", squadId] as const,
  },
  checkins: {
    today: (goalId: string, date: string) => ["checkins", goalId, date] as const,
    todayStatus: (goalIds: string[], date: string) =>
      ["checkins", "status", date, ...goalIds] as const,
    history: (goalId: string) => ["checkins", "history", goalId] as const,
  },
  squads: {
    userSquads: (uid: string) => ["squads", "user", uid] as const,
    detail: (squadId: string) => ["squads", squadId] as const,
    byInviteCode: (code: string) => ["squads", "invite", code] as const,
  },
} as const;
