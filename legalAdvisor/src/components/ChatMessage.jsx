export default function ChatMessage({ role, text }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap
          ${isUser ? "bg-gray-900 text-white" : "bg-white border"}`}
      >
        {text}
      </div>
    </div>
  );
}