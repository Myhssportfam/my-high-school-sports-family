import { useRouter } from "next/router";

export default function ConversationPage() {
  const router = useRouter();
  const { conversationId } = router.query;

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-bold">Conversation</h1>

      <p className="mt-3 text-gray-600">
        Conversation ID: {String(conversationId ?? "")}
      </p>
    </main>
  );
}