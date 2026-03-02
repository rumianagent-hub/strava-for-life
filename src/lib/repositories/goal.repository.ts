import {
  doc,
  getDoc,
  addDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  runTransaction,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { GoalSchema, type Goal } from "@/lib/schemas";
import { type Result, ok, err, ErrorCode } from "@/lib/errors";
import { todayStr, yesterdayStr } from "@/lib/dates";
import { parseDoc } from "./base.repository";

async function get(goalId: string): Promise<Result<Goal | null>> {
  try {
    const snap = await getDoc(doc(db, "goals", goalId));
    if (!snap.exists()) return ok(null);
    return parseDoc(GoalSchema, snap.id, snap.data());
  } catch (e) {
    return err(ErrorCode.FIRESTORE_ERROR, "Failed to get goal", e);
  }
}

async function getUserGoals(uid: string): Promise<Result<Goal[]>> {
  try {
    const q = query(
      collection(db, "goals"),
      where("ownerUid", "==", uid),
      where("status", "==", "active"),
      orderBy("startDate", "desc"),
    );
    const snap = await getDocs(q);
    const goals: Goal[] = [];
    for (const d of snap.docs) {
      const parsed = parseDoc(GoalSchema, d.id, d.data());
      if (parsed.ok) goals.push(parsed.data);
    }
    return ok(goals);
  } catch (e) {
    return err(ErrorCode.FIRESTORE_ERROR, "Failed to get user goals", e);
  }
}

async function getSquadGoals(squadId: string): Promise<Result<Goal[]>> {
  try {
    const q = query(
      collection(db, "goals"),
      where("squadId", "==", squadId),
      where("privacy", "==", "squad"),
      where("status", "==", "active"),
    );
    const snap = await getDocs(q);
    const goals: Goal[] = [];
    for (const d of snap.docs) {
      const parsed = parseDoc(GoalSchema, d.id, d.data());
      if (parsed.ok) goals.push(parsed.data);
    }
    return ok(goals);
  } catch (e) {
    return err(ErrorCode.FIRESTORE_ERROR, "Failed to get squad goals", e);
  }
}

async function create(
  ownerUid: string,
  input: {
    title: string;
    description: string;
    category: string;
    privacy: string;
    squadId?: string;
  },
): Promise<Result<string>> {
  try {
    const today = todayStr();
    const ref = await addDoc(collection(db, "goals"), {
      ownerUid,
      title: input.title,
      description: input.description,
      category: input.category,
      privacy: input.privacy,
      status: "active",
      startDate: today,
      squadId: input.squadId || null,
      currentStreak: 0,
      bestStreak: 0,
      lastCheckinDate: null,
    });
    return ok(ref.id);
  } catch (e) {
    return err(ErrorCode.FIRESTORE_ERROR, "Failed to create goal", e);
  }
}

async function archive(goalId: string): Promise<Result<void>> {
  try {
    await updateDoc(doc(db, "goals", goalId), { status: "archived" });
    return ok(undefined);
  } catch (e) {
    return err(ErrorCode.FIRESTORE_ERROR, "Failed to archive goal", e);
  }
}

/**
 * Atomic checkin using a Firestore transaction.
 * Prevents race conditions where double-taps could double-increment streak.
 */
async function doCheckin(
  goalId: string,
  _ownerUid: string,
  done: boolean,
  note: string,
): Promise<Result<Goal>> {
  try {
    const today = todayStr();
    const yesterday = yesterdayStr();
    const goalRef = doc(db, "goals", goalId);
    const checkinRef = doc(db, "goals", goalId, "checkins", today);

    const updatedGoal = await runTransaction(db, async (tx) => {
      const goalSnap = await tx.get(goalRef);
      if (!goalSnap.exists()) throw new Error("Goal not found");

      const goalData = goalSnap.data();

      // Write checkin
      tx.set(checkinRef, { date: today, done, note }, { merge: true });

      if (!done) {
        tx.update(goalRef, { lastCheckinDate: today });
        return { id: goalId, ...goalData, lastCheckinDate: today };
      }

      // Compute streak
      let currentStreak = goalData.currentStreak || 0;
      const bestStreak = goalData.bestStreak || 0;
      const lastDate = goalData.lastCheckinDate;

      if (lastDate === today) {
        // Already checked in today — no streak change
      } else if (lastDate === yesterday) {
        currentStreak += 1;
      } else {
        currentStreak = 1;
      }

      const newBest = Math.max(bestStreak, currentStreak);

      tx.update(goalRef, {
        currentStreak,
        bestStreak: newBest,
        lastCheckinDate: today,
      });

      return {
        id: goalId,
        ...goalData,
        currentStreak,
        bestStreak: newBest,
        lastCheckinDate: today,
      };
    });

    return parseDoc(GoalSchema, goalId, updatedGoal);
  } catch (e) {
    if (e instanceof Error && e.message === "Goal not found") {
      return err(ErrorCode.NOT_FOUND, "Goal not found");
    }
    return err(ErrorCode.FIRESTORE_ERROR, "Failed to check in", e);
  }
}

export const goalRepository = {
  get,
  getUserGoals,
  getSquadGoals,
  create,
  archive,
  doCheckin,
} as const;
