import { storage } from "@/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export async function uploadCoverImage(params: {
  file: File;
  slug: string;
}): Promise<string> {
  const safeSlug = params.slug.trim() || "unsaved";
  const ext = params.file.name.split(".").pop()?.toLowerCase() || "png";
  const name = `cover-${Date.now()}.${ext}`;
  const path = `covers/${safeSlug}/${name}`;

  const r = ref(storage, path);
  await uploadBytes(r, params.file, {
    contentType: params.file.type || "application/octet-stream",
    cacheControl: "public, max-age=31536000, immutable",
  });
  return await getDownloadURL(r);
}

