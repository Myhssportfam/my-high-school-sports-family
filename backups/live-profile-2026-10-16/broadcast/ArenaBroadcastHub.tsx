import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../hooks/useAuth';
import { BroadcastButtons } from './BroadcastProvider';
export default function ArenaBroadcastHub() {
    const { user } = useAuth();
    const [rooms, setRooms] = useState<{
        id: string;
        title: string;
        game: string;
    }[]>([]);
    const [selected, setSelected] = useState('');
    const [error, setError] = useState('');
    useEffect(() => {
        if (!user) {
            setRooms([]);
            setSelected('');
            return;
        }
        return onSnapshot(query(collection(db, 'arenaRooms'), where('joinedUserIds', 'array-contains', user.uid)), snapshot => {
            const next = snapshot.docs.map(item => ({ id: item.id, title: String(item.data().title || 'Arena room'), game: String(item.data().game || 'Gaming') }));
            setRooms(next);
            setSelected(current => next.some(room => room.id === current) ? current : next[0]?.id || '');
            setError('');
        }, () => setError('Arena rooms could not load. Check your Arena permissions.'));
    }, [user]);
    const room = rooms.find(item => item.id === selected);
    return <section className="my-6 rounded-2xl border border-slate-500 bg-[#071b33] p-5 text-white"><h2 className="text-xl font-bold">Stream your Arena room</h2><p className="mt-2 text-sm">Stream your game window or capture card feed. Console gameplay needs to reach this browser through Remote Play or a capture device.</p>
    {error && <p role="status">{error}</p>}{!user ? <p className="mt-3">Sign in, then create or join a room to go live.</p> : !room ? <p className="mt-3">Create or join an Arena room to start a broadcast.</p> : <><label className="mt-4 block">Your room<select className="mt-2 block w-full rounded-lg bg-white p-3 text-black" value={selected} onChange={event => setSelected(event.target.value)}>{rooms.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label><BroadcastButtons context={{ roomId: room.id, title: room.title, sport: room.game }}/></>}
  </section>;
}
