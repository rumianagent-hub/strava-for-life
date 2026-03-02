import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CheckinSchema, type Checkin } from "@/lib/schemas";
import { type Result, ok, err, ErrorCode } from "@/lib/errors";
import { parseSubDoc } from "./base.repository";

async function get(goalId: string, date: string): Promise<Result<Checkin | null>> {
  try {
    const snap = await getDoc(doc(db, "goals", goalId, "checkins", date));
    if (!snap.exists()) return ok(null);
    return parseSubDoc(CheckinSchema, snap.data());
  } catch (e) {
    return err(ErrorCode.FIRESTORE_ERROR, "Failed to get checkin", e);
  }
}

/** Fetch all checkins in the subcollection and filter client-side (1 query vs N reads). */
async function getMany(
  goalId: string,
  dates: string[],
): Promise<Result<Record<string, Checkin>>> {
  try {
    const snap = await getDocs(collection(db, "goals", goalId, "checkins"));
    const dateSet = new Set(dates);
    const result: Record<string, Checkin> = {};
    for (const d of snap.docs) {
      if (!dateSet.has(d.id)) continue;
      const parsed = parseSubDoc(CheckinSchema, d.data());
      if (parsed.ok) result[d.id] = parsed.data;
    }
    return ok(result);
  } catch (e) {
    return err(ErrorCode.FIRESTORE_ERROR, "Failed to get checkins", e);
  }
}

/** Check today's done status for multiple goals concurrently. */
async function getTodayStatusForGoals(
  goalIds: string[],
  today: string,
): Promise<Result<Record<string, boolean>>> {
  if (goalIds.length === 0) return ok({});
  try {
    const statusMap: Record<string, boolean> = {};
    await Promise.all(
      goalIds.map(async (goalId) => {
        const snap = await getDoc(doc(db, "goals", goalId, "checkins", today));
        statusMap[goalId] = snap.exists() ? (snap.data()?.done ?? false) : false;
      }),
    );
    return ok(statusMap);
  } catch (e) {
    return err(ErrorCode.FIRESTORE_ERROR, "Failed to get checkin statuses", e);
  }
}

export const checkinRepository = { get, getMany, getTodayStatusForGoals } as const;
