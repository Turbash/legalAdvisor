import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage } from "../slices/chatSlice";

export default function MessageInput() {
  const [value, setValue] = useState("");
  const dispatch = useDispatch();
  const { token } = useSelector((s) => s.auth);
  const { currentSessionId, loading } = useSelector((s) => s.chat);

  const onSubmit = async (e) => {
    e.preventDefault();
    const msg = value.trim();
    if (!msg || !currentSessionId) return;

    // Optimistically you can also push user's message in your slice if you modeled it that way
    await dispatch(sendMessage({ message: msg, sessionId: currentSessionId, token }));
    setValue("");
  };

  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <input
        className="flex-1 border rounded px-3 py-2"
        placeholder="Ask about an Indian law…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={loading}
      />
      <button
        className="px-4 py-2 rounded bg-gray-900 text-white disabled:opacity-60"
        disabled={loading || !value.trim()}
      >
        {loading ? "Sending…" : "Send"}
      </button>
    </form>
  );
}