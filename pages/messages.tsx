import { useState } from "react";
import { useRouter } from "next/router";

export default function MessagesPage() {
  const router = useRouter();

  const userId =
    typeof router.query.user === "string"
      ? router.query.user
      : "";
const [messageText, setMessageText] = useState("");
const [messages, setMessages] = useState<string[]>([]);

const handleSendMessage = () => {
  const trimmedMessage = messageText.trim();

  if (!trimmedMessage) return;

  setMessages((currentMessages) => [
    ...currentMessages,
    trimmedMessage,
  ]);

  setMessageText("");
};

const handleMessageKeyDown = (
  event: React.KeyboardEvent<HTMLInputElement>
) => {
  if (event.key === "Enter") {
    handleSendMessage();
  }
};
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-6 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold shadow-sm"
        >
          ← Back
        </button>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <p className="text-sm font-bold uppercase tracking-wider text-red-600">
              My High School Sports Family
            </p>

            <h1 className="mt-1 text-3xl font-black">
              Messages
            </h1>
          </div>

          <div className="grid min-h-[600px] md:grid-cols-[300px_1fr]">
            <aside className="border-r border-slate-200 p-4">
              <p className="text-sm font-bold text-slate-500">
                Conversations
              </p>

              <div className="mt-4 rounded-2xl bg-slate-100 p-4">
                <p className="font-bold">
                  Athlete Conversation
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  User: {userId || "No athlete selected"}
                </p>
              </div>
            </aside>

            <section className="flex flex-col">
             <div className="flex-1 space-y-3 p-6">
  {messages.length === 0 ? (
    <div className="rounded-2xl bg-slate-100 p-4">
      <p className="text-sm text-slate-600">
        Start a conversation with this athlete.
      </p>
    </div>
  ) : (
    messages.map((message, index) => (
      <div
        key={`${message}-${index}`}
        className="flex justify-end"
      >
        <div className="max-w-[75%] rounded-2xl bg-slate-900 px-4 py-3 text-white shadow-sm">
          <p className="text-sm">{message}</p>

          <p className="mt-1 text-right text-[10px] text-slate-300">
            You
          </p>
        </div>
      </div>
    ))
  )}
</div>

              <div className="border-t border-slate-200 p-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 rounded-full border border-slate-300 px-5 py-3 outline-none focus:border-slate-900"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={handleMessageKeyDown}
                  />
                  <button
                    type="button"
                    onClick={handleSendMessage}
                    className="rounded-full bg-slate-900 px-6 py-3 font-bold text-white"
                  >
                    Send
                  </button>
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}