import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore";
import { db } from "@/firebase";

export type WheelRecordPayload = {
  radiusCm: number;
  distanceM: number;
  rotations: number;
  language: "en" | "id";
};

export type StoredRecord = {
  id: string;
  app: string;
  type: string;
  wheel?: WheelRecordPayload;
  createdAt: Timestamp | null;
};

export async function saveWheelRecord(uid: string, payload: WheelRecordPayload): Promise<void> {
  await addDoc(collection(db, "users", uid, "records"), {
    app: "wheel",
    type: "rotation_cycle",
    wheel: payload,
    createdAt: serverTimestamp(),
  });
}

export async function fetchRecentRecords(uid: string, max = 8): Promise<StoredRecord[]> {
  const q = query(
    collection(db, "users", uid, "records"),
    orderBy("createdAt", "desc"),
    limit(max)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      app: String(data.app ?? ""),
      type: String(data.type ?? ""),
      wheel: data.wheel as WheelRecordPayload | undefined,
      createdAt: (data.createdAt as Timestamp | undefined) ?? null,
    };
  });
}
