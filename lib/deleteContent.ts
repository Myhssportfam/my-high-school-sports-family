import {auth} from './firebase'
export async function deleteContent(input: {kind: 'profile' | 'post' | 'coach' | 'state' | 'story' | 'legacyStory'; id: string; stateId?: string}) {
  const user = auth.currentUser
  if (!user) throw new Error('Please sign in first.')
  const response = await fetch('/api/content/delete', {
    method: 'POST', headers: {'Content-Type': 'application/json', Authorization: `Bearer ${await user.getIdToken()}`},
    body: JSON.stringify(input),
  })
  const result = await response.json()
  if (!response.ok || !result.deleted) throw new Error(result.error || 'Could not delete. Please try again.')
  if (result.cleanupPending) window.alert('Your post or story was removed. Some replies or likes still need cleanup; please contact support.')
}
