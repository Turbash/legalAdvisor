import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../slices/authSlice";
import { useNavigate, Link } from "react-router-dom";

export default function SignupPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((s) => s.auth);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  useEffect(() => {
    if (user) navigate("/app/chat", { replace: true });
  }, [user, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return;
    await dispatch(signupUser({ username, password }));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input
        className="w-full border rounded px-3 py-2"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        className="w-full border rounded px-3 py-2"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="password"
        className="w-full border rounded px-3 py-2"
        placeholder="Confirm password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
      />
      <button
        className="w-full rounded bg-gray-900 text-white py-2 disabled:opacity-60"
        disabled={loading}
      >
        {loading ? "Creating…" : "Sign up"}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <p className="text-sm text-center text-gray-500">
        Already have an account? <Link to="/login" className="underline">Log in</Link>
      </p>
    </form>
  );
}