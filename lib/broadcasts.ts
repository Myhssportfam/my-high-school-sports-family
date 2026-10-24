import { stateCommunities } from './stateCommunities';
export type BroadcastMode = 'camera' | 'screen';
export type BroadcastContext = {
    roomId?: string;
    title?: string;
    sport?: string;
};
export type Broadcast = {
    id: string;
    ownerId: string;
    broadcaster: string;
    title: string;
    state: string;
    stateId: string;
    school: string;
    sport: string;
    roomId?: string;
    provider: 'cloudflare';
    broadcastMode: BroadcastMode;
    status: 'scheduled' | 'connecting' | 'live' | 'ended' | 'failed';
    sessionId?: string;
    heartbeatMs?: number;
    startedAtMs?: number;
    scheduledDate?: string;
    viewers?: number;
    peakViewers?: number;
    playbackUrl?: string;
    createdAtMs: number;
    streamUrl: string;
};
export function canonicalState(state?: string, stateId?: string) {
    const normalize = (s: string) => s.toLowerCase().trim().replace(/[-_]/g, ' ');
    const match = stateCommunities.find(([name, id]) => id === normalize(stateId || '') ||
        id === normalize(state || '') || normalize(name) === normalize(state || '') || normalize(name) === normalize(stateId || ''));
    return match ? { state: match[0], stateId: match[1] } : null;
}
export function isBroadcastLive(stream: Pick<Broadcast, 'status' | 'heartbeatMs'>, now = Date.now()) {
    return stream.status === 'live' && now - (stream.heartbeatMs || 0) < 60000;
}
export function rankBroadcasts(streams: Broadcast[], section: 'live' | 'week' | 'trending', now = Date.now()) {
    const live = streams.filter(stream => isBroadcastLive(stream, now));
    if (section === 'week')
        return live.filter(stream => (stream.startedAtMs || 0) >= now - 7 * 86400000)
            .sort((a, b) => (b.peakViewers || 0) - (a.peakViewers || 0) || (b.startedAtMs || 0) - (a.startedAtMs || 0)).slice(0, 1);
    if (section === 'trending') {
        const sorted = live.sort((a, b) => (b.viewers || 0) - (a.viewers || 0) || (b.peakViewers || 0) - (a.peakViewers || 0));
        return sorted.filter((s, i) => sorted.findIndex(other => other.ownerId === s.ownerId) === i).slice(0, 6);
    }
    return [...live, ...streams.filter(s => s.status === 'scheduled').sort((a, b) => Date.parse(a.scheduledDate || '') - Date.parse(b.scheduledDate || ''))];
}
