// Browser-side recording: independent of the live WebRTC transport.
export type RecordingResult = { file: File | null; truncated: boolean };
export type RecordingHandle = { finish: () => Promise<RecordingResult> };
export function recordBroadcast(stream: MediaStream, name: string, options: { maxBytes?: number; maxMs?: number } = {}): RecordingHandle {
  if (typeof MediaRecorder === 'undefined') throw new Error('This browser cannot save live recordings.');
  const mimeType = ['video/mp4', 'video/webm;codecs=vp8,opus', 'video/webm'].find(type => MediaRecorder.isTypeSupported(type));
  const recorder = new MediaRecorder(stream, { ...(mimeType ? { mimeType } : {}), videoBitsPerSecond: 1500000, audioBitsPerSecond: 96000 });
  const chunks: Blob[] = [];
  let bytes = 0, truncated = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const result = new Promise<RecordingResult>(resolve => {
    recorder.ondataavailable = event => {
      if (!event.data.size) return;
      chunks.push(event.data); bytes += event.data.size;
      if (bytes >= (options.maxBytes || 200 * 1024 * 1024) && recorder.state !== 'inactive') {
        truncated = true; recorder.stop();
      }
    };
    recorder.onerror = () => { truncated = true; };
    recorder.onstop = () => {
      clearTimeout(timer);
      const type = recorder.mimeType || chunks[0]?.type || 'video/webm';
      const file = bytes ? new File(chunks, `${name}.${type.includes('mp4') ? 'mp4' : 'webm'}`, { type }) : null;
      chunks.length = 0;
      resolve({ file, truncated });
    };
  });
  recorder.start(1000);
  if (options.maxMs) timer = setTimeout(() => { if (recorder.state !== 'inactive') recorder.stop(); }, options.maxMs);
  return { finish: () => { if (recorder.state !== 'inactive') recorder.stop(); return result; } };
}
