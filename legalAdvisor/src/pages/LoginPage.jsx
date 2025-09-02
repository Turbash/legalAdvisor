import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../slices/authSlice";
import { useNavigate, useLocation, Link } from "react-router-dom";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, error } = useSelector((s) => s.auth);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const from = location.state?.from?.pathname || "/app/chat";

  useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user, navigate, from]);

  const onSubmit = async (e) => {
    e.preventDefault();
    await dispatch(loginUser({ username, password }));
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
      <button
        className="w-full rounded bg-gray-900 text-white py-2 disabled:opacity-60"
        disabled={loading}
      >
        {loading ? "Signing in…" : "Login"}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <p className="text-sm text-center text-gray-500">
        No account? <Link to="/signup" className="underline">Sign up</Link>
      </p>
    </form>
  );
}