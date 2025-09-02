import { useDispatch, useSelector } from "react-redux";
import { logout } from "../slices/authSlice";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);

  const onLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="h-14 border-b bg-white flex items-center justify-between px-4">
      <Link to="/app/chat" className="font-serif text-lg">⚖️ LawExplainer</Link>
      <div className="flex items-center gap-4">
        <Link to="/app/profile" className="text-sm text-gray-700 hover:underline">
          {user?.username ?? "Profile"}
        </Link>
        <button onClick={onLogout} className="text-sm px-3 py-1 rounded bg-gray-900 text-white">
          Logout
        </button>
      </div>
    </header>
  );
}