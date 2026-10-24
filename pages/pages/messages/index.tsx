import { useEffect, useState } from "react";
import { auth, db } from "../../../lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";


export default function MessagesPage() {
  const [conversations, setConversations] = useState<any[]>([]);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "conversations"),
      where("members", "array-contains", auth.currentUser.uid)
    );

    return onSnapshot(q, (snapshot) => {
      setConversations(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">
        Messages
      </h1>

      {conversations.length === 0 ? (
        <p>No conversations yet.</p>
      ) : (
        conversations.map((conversation: any) => (
          <div
            key={conversation.id}
            className="border rounded-lg p-4 mb-3"
          >
            {conversation.lastMessage}
          </div>
        ))
      )}
    </div>
  );
}