import { db } from "@/firebase";
import {
  collection,
  deleteDoc,
  doc,
  type FieldValue,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
  type Timestamp,
} from "firebase/firestore";

export type YouTubePost = {
  slug: string;
  title: string;
  excerpt: string;
  youtubeId: string;
  coverImageUrl?: string;
  tags: string[];
  published: boolean;
  publishedAt: Timestamp | null;
  updatedAt?: Timestamp;
  createdAt?: Timestamp;
  contentMd: string;
};

export type YouTubePostInput = Omit<YouTubePost, "createdAt" | "updatedAt">;

type YouTubePostDoc = Omit<YouTubePost, "createdAt" | "updatedAt"> & {
  createdAt?: Timestamp | FieldValue;
  updatedAt?: Timestamp | FieldValue;
};

const COL = "youtubePosts";

export function youtubePostDoc(slug: string) {
  return doc(db, COL, slug);
}

export async function getYouTubePostBySlug(slug: string) {
  const snap = await getDoc(youtubePostDoc(slug));
  if (!snap.exists()) return null;
  return snap.data() as YouTubePost;
}

export async function listYouTubePosts({ includeUnpublished }: { includeUnpublished: boolean }) {
  const base = collection(db, COL);
  // Avoid composite index requirements by sorting client-side.
  const q = includeUnpublished ? query(base) : query(base, where("published", "==", true));
  const snaps = await getDocs(q);
  const items = snaps.docs.map((d) => d.data() as YouTubePost);
  items.sort((a, b) => {
    const at = a.publishedAt?.toMillis?.() ?? 0;
    const bt = b.publishedAt?.toMillis?.() ?? 0;
    return bt - at;
  });
  return items;
}

export async function upsertYouTubePost(input: YouTubePostInput) {
  const ref = youtubePostDoc(input.slug);
  const existing = await getDoc(ref);
  const existingData = existing.exists() ? (existing.data() as YouTubePost) : null;

  const shouldSetPublishedAt = input.published && !input.publishedAt && !existingData?.publishedAt;

  const payload: YouTubePostDoc = {
    ...input,
    publishedAt: shouldSetPublishedAt ? (serverTimestamp() as unknown as any) : input.publishedAt,
    createdAt: existingData?.createdAt ?? serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(ref, payload, { merge: true });
}

export async function deleteYouTubePost(slug: string) {
  await deleteDoc(youtubePostDoc(slug));
}

