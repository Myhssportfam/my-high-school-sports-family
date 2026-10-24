1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
63
64
65
66
67
68
69
70
71
72
73
74
75
76
77
78
79
80
81
82
83
84
85
86
87
88
89
90
91
92
93
94
95
96
97
98
99
100
101
102
103
104
105
106
107
108
109
110
111
112
113
114
115
116
117
118
119
120
121
import { auth } from './firebase';
export async function broadcastAction(body: Record<string, unknown>) {
    const user = auth.currentUser;
    if (!user)
        throw new Error('Please sign in first.');
    const token = await user.getIdToken();
    const response = await fetch('/api/broadcasts', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(body), keepalive: body.action === 'end' || body.action === 'leave' });
    const text = await response.text();
    let data;
    try {
        data = JSON.parse(text);
    } catch {
        if (response.status === 401 || response.status === 403)
            throw new Error(`Broadcast API access was denied (HTTP ${response.status}). Sign in again. If this continues, check Vercel deployment protection and server logs.`);
        throw new Error(`Broadcast API returned an unexpected response (HTTP ${response.status}). Check the Vercel runtime logs for /api/broadcasts.`);
    }
    if (!response.ok)
        throw new Error(typeof data?.error === 'string' ? data.error : `Could not update the broadcast (HTTP ${response.status}).`);
    if (!data || typeof data !== 'object' || Array.isArray(data))
        throw new Error('Broadcast API returned invalid data. Check the Vercel runtime logs for /api/broadcasts.');
    return data;
}
export type VideoSession = {
    pc: RTCPeerConnection;
    sessionUrl: string;
    stop: () => Promise<void>;
};
export async function connectVideo(endpoint: string, media: MediaStream | null, received: MediaStream | null, signal: AbortSignal): Promise<VideoSession> {
    let url: URL;
    try {
        if (typeof endpoint !== 'string' || !endpoint.trim())
            throw new Error('Missing endpoint');
        url = new URL(endpoint);
    } catch {
        throw new Error('The broadcast server returned a missing or invalid video URL. Check the Cloudflare Stream configuration.');
    }
    if (url.protocol !== 'https:' || !url.hostname.endsWith('.cloudflarestream.com'))
        throw new Error('Invalid live video endpoint.');
    const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
    let sessionUrl = '';
    let closed = false;
    const stop = async () => {
        if (closed)
            return;
        closed = true;
        pc.close();
        if (sessionUrl)
            await fetch(sessionUrl, { method: 'DELETE', keepalive: true }).catch(() => { });
    };
    const aborted = () => { void stop(); };
    signal.addEventListener('abort', aborted, { once: true });
    try {
        if (signal.aborted)
            throw new Error('Broadcast cancelled.');
        if (media)
            media.getTracks().forEach(track => pc.addTransceiver(track, { direction: 'sendonly' }));
        else {
            pc.addTransceiver('video', { direction: 'recvonly' });
            pc.addTransceiver('audio', { direction: 'recvonly' });
            pc.ontrack = event => received?.addTrack(event.track);
        }
        await pc.setLocalDescription(await pc.createOffer());
        await new Promise<void>((resolve, reject) => {
            const done = () => { clearTimeout(timer); pc.removeEventListener('icegatheringstatechange', changed); signal.removeEventListener('abort', cancel); };
            const changed = () => { if (pc.iceGatheringState === 'complete') {
                done();
                resolve();
            } };
            const cancel = () => { done(); reject(new Error('Broadcast cancelled.')); };
            const timer = setTimeout(() => { done(); resolve(); }, 8000);
            pc.addEventListener('icegatheringstatechange', changed);
            signal.addEventListener('abort', cancel, { once: true });
            changed();
            if (signal.aborted)
                cancel();
        });
        const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/sdp' }, body: pc.localDescription?.sdp, signal });
        if (!response.ok)
            throw new Error('The live video connection failed. Try again when the broadcaster is live.');
        const location = response.headers.get('Location');
        if (location) {
            const session = new URL(location, endpoint);
            if (session.origin !== url.origin)
                throw new Error('Invalid live video session.');
            sessionUrl = session.href;
        }
        const answer = await response.text();
        if (!answer.trimStart().startsWith('v=0'))
            throw new Error('The video service returned an invalid connection answer. Check the Cloudflare Stream endpoint.');
        try {
            await pc.setRemoteDescription({ type: 'answer', sdp: answer });
        } catch {
            throw new Error('The browser could not accept the video connection answer. Try another browser and check the Cloudflare Stream connection.');
        }
        await new Promise<void>((resolve, reject) => {
            const done = () => { clearTimeout(timer); pc.removeEventListener('connectionstatechange', changed); signal.removeEventListener('abort', cancel); };
            const changed = () => { if (pc.connectionState === 'connected') {
                done();
                resolve();
            }
            else if (['failed', 'closed'].includes(pc.connectionState)) {
                done();
                reject(new Error('Live connection failed. Try a different network.'));
            } };
            const cancel = () => { done(); reject(new Error('Broadcast cancelled.')); };
            const timer = setTimeout(() => { done(); reject(new Error('Live connection timed out. Please try again.')); }, 20000);
            pc.addEventListener('connectionstatechange', changed);
            signal.addEventListener('abort', cancel, { once: true });
            changed();
            if (signal.aborted)
                cancel();
        });
        return { pc, sessionUrl, stop: async () => { signal.removeEventListener('abort', aborted); await stop(); } };
    }
    catch (error) {
        signal.removeEventListener('abort', aborted);
        await stop();
        throw error;
    }
}
