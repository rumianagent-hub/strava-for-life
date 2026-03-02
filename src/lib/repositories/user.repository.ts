import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  getDocs,
  query,
  collection,
  where,
  documentId,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserDocSchema, type UserDoc } from "@/lib/schemas";
import { DEFAULT_TIMEZONE } from "@/lib/constants";
import { type Result, ok, err, ErrorCode } from "@/lib/errors";
import { parseDoc } from "./base.repository";

async function get(uid: string): Promise<Result<UserDoc | null>> {
  try {
    const snap = await getDoc(doc(db, "users", uid));
    if (!snap.exists()) return ok(null);
    return parseDoc(UserDocSchema, snap.id, snap.data());
  } catch (e) {
    return err(ErrorCode.FIRESTORE_ERROR, "Failed to get user", e);
  }
}

/** Batch-fetch users using Firestore `in` queries (max 30 per batch). */
async function getMany(uids: string[]): Promise<Result<Record<string, UserDoc>>> {
  if (uids.length === 0) return ok({});
  try {
    const result: Record<string, UserDoc> = {};
    const batches: string[][] = [];
    for (let i = 0; i < uids.length; i += 30) {
      batches.push(uids.slice(i, i + 30));
    }
    await Promise.all(
      batches.map(async (batch) => {
        const q = query(collection(db, "users"), where(documentId(), "in", batch));
        const snap = await getDocs(q);
        for (const d of snap.docs) {
          const parsed = parseDoc(UserDocSchema, d.id, d.data());
          if (parsed.ok) result[d.id] = parsed.data;
        }
      }),
    );
    return ok(result);
  } catch (e) {
    return err(ErrorCode.FIRESTORE_ERROR, "Failed to batch-get users", e);
  }
}

async function upsert(
  uid: string,
  data: Partial<Omit<UserDoc, "uid">>,
): Promise<Result<void>> {
  try {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        ...data,
        uid,
        timezone: DEFAULT_TIMEZONE,
        settings: { weeklyEmailEnabled: false },
      });
    } else {
      await updateDoc(ref, data as Record<string, unknown>);
    }
    return ok(undefined);
  } catch (e) {
    return err(ErrorCode.FIRESTORE_ERROR, "Failed to upsert user", e);
  }
}

export const userRepository = { get, getMany, upsert } as const;
