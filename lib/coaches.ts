export const COACH_TOPICS = ['Discussion', 'Players', 'Camps'] as const;
export type CoachTopic = typeof COACH_TOPICS[number];
export function isCoach(profile: {role?: string; coachesCorner?: boolean} | null | undefined) {
  return profile?.role === 'coach' || profile?.coachesCorner === true;
}
export function validateCoachPost(title: string, content: string, topic: string, files: Array<{size: number; type: string}>) {
  if (!title.trim() || title.trim().length > 140) throw new Error('Add a title with 1–140 characters.');
  if (!content.trim() || content.trim().length > 2000) throw new Error('Write a post with 1–2,000 characters.');
  if (!COACH_TOPICS.includes(topic as CoachTopic)) throw new Error('Choose a post topic.');
  if (files.length > 4) throw new Error('Add up to four photos or videos.');
  for (const file of files) {
    if (!/^(image|video)\//.test(file.type)) throw new Error('Choose photos or videos.');
    if (file.size >= 50 * 1024 * 1024) throw new Error('Each photo or video must be smaller than 50 MB.');
  }
}
