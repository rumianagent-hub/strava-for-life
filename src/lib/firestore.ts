import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Goal, Checkin, Squad, UserDoc, GoalCategory, GoalPrivacy } from "./types";
import { todayStr, yesterdayStr } from "./dates";
import { nanoid } from "nanoid";

// ─── Users ────────────────────────────────────────────────────────────────────

export async function upsertUser(
  uid: string,
  data: Partial<Omit<UserDoc, "uid">>
): Promise<void> {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      ...data,
      uid,
      timezone: "America/Montreal",
      settings: { weeklyEmailEnabled: false },
    });
  } else {
    await updateDoc(ref, data as Record<string, unknown>);
  }
}

export async function getUser(uid: string): Promise<UserDoc | null> {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? (snap.data() as UserDoc) : null;
}

export async function getUsers(uids: string[]): Promise<Record<string, UserDoc>> {
  const snaps = await Promise.all(uids.map((uid) => getDoc(doc(db, "users", uid))));
  const result: Record<string, UserDoc> = {};
  snaps.forEach((snap) => {
    if (snap.exists()) result[snap.id] = snap.data() as UserDoc;
  });
  return result;
}

// ─── Goals ────────────────────────────────────────────────────────────────────

export async function createGoal(
  ownerUid: string,
  data: {
    title: string;
    description: string;
    category: GoalCategory;
    privacy: GoalPrivacy;
    squadId?: string;
  }
): Promise<string> {
  const today = todayStr();
  const ref = await addDoc(collection(db, "goals"), {
    ownerUid,
    title: data.title,
    description: data.description,
    category: data.category,
    privacy: data.privacy,
    status: "active",
    startDate: today,
    squadId: data.squadId || null,
    currentStreak: 0,
    bestStreak: 0,
    lastCheckinDate: null,
  });
  return ref.id;
}

export async function getGoal(goalId: string): Promise<Goal | null> {
  const snap = await getDoc(doc(db, "goals", goalId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Goal;
}

export async function getUserGoals(uid: string): Promise<Goal[]> {
  const q = query(
    collection(db, "goals"),
    where("ownerUid", "==", uid),
    where("status", "==", "active"),
    orderBy("startDate", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Goal));
}

export async function getSquadGoals(squadId: string): Promise<Goal[]> {
  const q = query(
    collection(db, "goals"),
    where("squadId", "==", squadId),
    where("privacy", "==", "squad"),
    where("status", "==", "active")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Goal));
}

// ─── Checkins ────────────────────────────────────────────────────────────────

export async function doCheckin(
  goalId: string,
  ownerUid: string,
  done: boolean,
  note: string
): Promise<void> {
  const today = todayStr();
  const yesterday = yesterdayStr();

  // Write the checkin doc
  const checkinRef = doc(db, "goals", goalId, "checkins", today);
  await setDoc(checkinRef, { date: today, done, note }, { merge: true });

  // Update streak on the goal
  const goalRef = doc(db, "goals", goalId);
  const goalSnap = await getDoc(goalRef);
  if (!goalSnap.exists()) return;

  const goal = goalSnap.data() as Goal;
  const lastDate = goal.lastCheckinDate;

  if (!done) {
    // Just update the note/done state, don't touch streak for undone
    await updateDoc(goalRef, { lastCheckinDate: today });
    return;
  }

  let currentStreak = goal.currentStreak || 0;
  const bestStreak = goal.bestStreak || 0;

  if (lastDate === today) {
    // Already checked in today — no streak change
  } else if (lastDate === yesterday) {
    currentStreak += 1;
  } else {
    currentStreak = 1;
  }

  const newBest = Math.max(bestStreak, currentStreak);

  await updateDoc(goalRef, {
    currentStreak,
    bestStreak: newBest,
    lastCheckinDate: today,
  });
}

export async function getCheckin(
  goalId: string,
  date: string
): Promise<Checkin | null> {
  const snap = await getDoc(doc(db, "goals", goalId, "checkins", date));
  if (!snap.exists()) return null;
  return snap.data() as Checkin;
}

export async function getCheckins(
  goalId: string,
  dates: string[]
): Promise<Record<string, Checkin>> {
  const results: Record<string, Checkin> = {};
  await Promise.all(
    dates.map(async (date) => {
      const snap = await getDoc(doc(db, "goals", goalId, "checkins", date));
      if (snap.exists()) results[date] = snap.data() as Checkin;
    })
  );
  return results;
}

// ─── Squads ───────────────────────────────────────────────────────────────────

export async function createSquad(
  ownerUid: string,
  name: string
): Promise<Squad> {
  const inviteCode = nanoid(8);
  const ref = await addDoc(collection(db, "squads"), {
    name,
    ownerUid,
    memberUids: [ownerUid],
    maxMembers: 5,
    inviteCode,
    privacy: "private",
  });
  return {
    id: ref.id,
    name,
    ownerUid,
    memberUids: [ownerUid],
    maxMembers: 5,
    inviteCode,
    privacy: "private",
  };
}

export async function getSquad(squadId: string): Promise<Squad | null> {
  const snap = await getDoc(doc(db, "squads", squadId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Squad;
}

export async function getUserSquads(uid: string): Promise<Squad[]> {
  const q = query(
    collection(db, "squads"),
    where("memberUids", "array-contains", uid)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Squad));
}

export async function getSquadByInviteCode(
  code: string
): Promise<Squad | null> {
  const q = query(
    collection(db, "squads"),
    where("inviteCode", "==", code)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as Squad;
}

export async function joinSquad(
  squadId: string,
  uid: string
): Promise<{ success: boolean; error?: string }> {
  const squadRef = doc(db, "squads", squadId);
  const snap = await getDoc(squadRef);
  if (!snap.exists()) return { success: false, error: "Squad not found" };

  const squad = snap.data() as Squad;
  if (squad.memberUids.includes(uid)) {
    return { success: true }; // already a member
  }
  if (squad.memberUids.length >= squad.maxMembers) {
    return { success: false, error: "Squad is full (max 5 members)" };
  }

  await updateDoc(squadRef, {
    memberUids: [...squad.memberUids, uid],
  });
  return { success: true };
}

export async function archiveGoal(goalId: string): Promise<void> {
  await updateDoc(doc(db, "goals", goalId), { status: "archived" });
}
