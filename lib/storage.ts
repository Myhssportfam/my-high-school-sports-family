import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { storage } from './firebase'

export async function uploadFile(file: File, path: string, onProgress?: (percent: number) => void) {
  const storageRef = ref(storage, path)
  return new Promise<string>((resolve, reject) => {
    const task = uploadBytesResumable(storageRef, file)
    task.on('state_changed', (snapshot) => {
      if (onProgress && snapshot.totalBytes) {
        const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        onProgress(percent)
      }
    }, (err) => reject(err), async () => {
      try {
        const url = await getDownloadURL(task.snapshot.ref)
        resolve(url)
      } catch (e) {
        reject(e)
      }
    })
  })
}
