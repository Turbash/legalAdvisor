import { useSelector } from "react-redux";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import EmptyState from "./EmptyState";

export default function ChatBox() {
  const { currentSessionId, messages } = useSelector((s) => s.chat);

  if (!currentSessionId) return <EmptyState />;

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 min-h-0 overflow-y-auto">
        <MessageList messages={messages} />
      </div>
      <div className="border-t bg-white p-3">
        <MessageInput />
      </div>
    </div>
  );
}