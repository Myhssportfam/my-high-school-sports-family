import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

import { storage } from "./firebase";

export type UploadMediaResult = {
  downloadURL: string;
  fileName: string;
  fileType: "image" | "video";
};

export async function uploadMedia(
  file: File,
  userId: string,
  onProgress?: (progress: number) => void
): Promise<UploadMediaResult> {
  if (!file) {
    throw new Error("No file was selected.");
  }

  if (!userId) {
    throw new Error("You must be signed in to upload media.");
  }

  const isImage = file.type.startsWith("image/");
  const isVideo = file.type.startsWith("video/");

  if (!isImage && !isVideo) {
    throw new Error("Please select an image or video.");
  }

  const maxFileSize = 100 * 1024 * 1024;

  if (file.size > maxFileSize) {
    throw new Error("The file must be smaller than 100 MB.");
  }

  const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const fileName = `${Date.now()}-${safeFileName}`;

  const storageRef = ref(
    storage,
    `users/${userId}/stories/${fileName}`
  );

  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        onProgress?.(Math.round(progress));
      },
      (error) => {
        reject(error);
      },
      async () => {
        const downloadURL = await getDownloadURL(
          uploadTask.snapshot.ref
        );

        resolve({
          downloadURL,
          fileName,
          fileType: isVideo ? "video" : "image",
        });
      }
    );
  });
}