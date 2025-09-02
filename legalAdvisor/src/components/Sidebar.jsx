import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSessions, fetchMessages, createSession, deleteSession, setCurrentSession } from "../slices/chatSlice";
import { useNavigate, useParams } from "react-router-dom";

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const { token } = useSelector((s) => s.auth);
  const { sessions, currentSessionId, loading } = useSelector((s) => s.chat);

  useEffect(() => {
    if (token) dispatch(fetchSessions(token));
  }, [dispatch, token]);

  useEffect(() => {
    if (sessionId && token) {
      dispatch(setCurrentSession(Number(sessionId)));
      dispatch(fetchMessages({ sessionId: Number(sessionId), token }));
    }
  }, [dispatch, token, sessionId]);

  const newSession = async () => {
    const firstMessage = "New legal consultation";
    const id = await dispatch(createSession({ message: firstMessage, token })).unwrap();
    navigate(`/app/chat/${id}`);
  };

  const openSession = (id) => navigate(`/app/chat/${id}`);

  const removeSession = async (id, e) => {
    e.stopPropagation();
    await dispatch(deleteSession({ sessionId: id, token }));
    if (Number(sessionId) === id) navigate("/app/chat");
  };

  return (
    <aside className="w-72 border-r bg-white p-3 overflow-y-auto">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold">Sessions</h2>
        <button onClick={newSession} className="text-sm px-2 py-1 rounded bg-gray-900 text-white">
          + New
        </button>
      </div>

      {loading && <p className="text-sm text-gray-500">Loading…</p>}

      <div className="space-y-1">
        {sessions?.length ? sessions.map((s) => (
          <div
            key={s.id}
            onClick={() => openSession(s.id)}
            className={`group flex items-center justify-between px-2 py-2 rounded cursor-pointer border 
              ${Number(currentSessionId) === s.id ? "bg-gray-100 border-gray-300" : "hover:bg-gray-50"}`}
          >
            <div className="truncate mr-2 text-sm">{s.title || `Session ${s.id}`}</div>
            <button
              onClick={(e) => removeSession(s.id, e)}
              className="opacity-0 group-hover:opacity-100 text-xs text-red-600"
              title="Delete session"
            >
              ✕
            </button>
          </div>
        )) : <p className="text-sm text-gray-500">No sessions yet.</p>}
      </div>
    </aside>
  );
}