import {
  doc,
  getDoc,
  addDoc,
  collection,
  query,
  where,
  getDocs,
  runTransaction,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { SquadSchema, type Squad } from "@/lib/schemas";
import { SQUAD_MAX_MEMBERS, SQUAD_INVITE_CODE_LENGTH } from "@/lib/constants";
import { type Result, ok, err, ErrorCode } from "@/lib/errors";
import { parseDoc } from "./base.repository";
import { nanoid } from "nanoid";

async function get(squadId: string): Promise<Result<Squad | null>> {
  try {
    const snap = await getDoc(doc(db, "squads", squadId));
    if (!snap.exists()) return ok(null);
    return parseDoc(SquadSchema, snap.id, snap.data());
  } catch (e) {
    return err(ErrorCode.FIRESTORE_ERROR, "Failed to get squad", e);
  }
}

async function getUserSquads(uid: string): Promise<Result<Squad[]>> {
  try {
    const q = query(
      collection(db, "squads"),
      where("memberUids", "array-contains", uid),
    );
    const snap = await getDocs(q);
    const squads: Squad[] = [];
    for (const d of snap.docs) {
      const parsed = parseDoc(SquadSchema, d.id, d.data());
      if (parsed.ok) squads.push(parsed.data);
    }
    return ok(squads);
  } catch (e) {
    return err(ErrorCode.FIRESTORE_ERROR, "Failed to get user squads", e);
  }
}

async function getByInviteCode(code: string): Promise<Result<Squad | null>> {
  try {
    const q = query(
      collection(db, "squads"),
      where("inviteCode", "==", code),
    );
    const snap = await getDocs(q);
    if (snap.empty) return ok(null);
    const d = snap.docs[0];
    return parseDoc(SquadSchema, d.id, d.data());
  } catch (e) {
    return err(ErrorCode.FIRESTORE_ERROR, "Failed to find squad by invite code", e);
  }
}

async function create(ownerUid: string, name: string): Promise<Result<Squad>> {
  try {
    const inviteCode = nanoid(SQUAD_INVITE_CODE_LENGTH);
    const data = {
      name,
      ownerUid,
      memberUids: [ownerUid],
      maxMembers: SQUAD_MAX_MEMBERS,
      inviteCode,
      privacy: "private" as const,
    };
    const ref = await addDoc(collection(db, "squads"), data);
    return ok({ id: ref.id, ...data });
  } catch (e) {
    return err(ErrorCode.FIRESTORE_ERROR, "Failed to create squad", e);
  }
}

/**
 * Atomic join using a Firestore transaction.
 * Prevents race conditions where simultaneous joins could exceed maxMembers.
 */
async function join(squadId: string, uid: string): Promise<Result<Squad>> {
  try {
    const squadRef = doc(db, "squads", squadId);

    const updatedData = await runTransaction(db, async (tx) => {
      const snap = await tx.get(squadRef);
      if (!snap.exists()) throw new Error("NOT_FOUND");

      const data = snap.data();
      const memberUids: string[] = data.memberUids || [];

      if (memberUids.includes(uid)) {
        // Already a member, return as-is
        return { id: squadId, ...data };
      }

      if (memberUids.length >= (data.maxMembers || SQUAD_MAX_MEMBERS)) {
        throw new Error("SQUAD_FULL");
      }

      const newMembers = [...memberUids, uid];
      tx.update(squadRef, { memberUids: newMembers });
      return { id: squadId, ...data, memberUids: newMembers };
    });

    return parseDoc(SquadSchema, squadId, updatedData);
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === "NOT_FOUND") {
        return err(ErrorCode.NOT_FOUND, "Squad not found");
      }
      if (e.message === "SQUAD_FULL") {
        return err(ErrorCode.SQUAD_FULL, `Squad is full (max ${SQUAD_MAX_MEMBERS} members)`);
      }
    }
    return err(ErrorCode.FIRESTORE_ERROR, "Failed to join squad", e);
  }
}

export const squadRepository = {
  get,
  getUserSquads,
  getByInviteCode,
  create,
  join,
} as const;
