import ChatMessage from "./ChatMessage";

export default function MessageList({ messages }) {
  return (
    <div className="p-4 space-y-3">
      {messages?.map((m, idx) => (
        <ChatMessage key={idx} role={m.role} text={m.message} />
      ))}
    </div>
  );
}