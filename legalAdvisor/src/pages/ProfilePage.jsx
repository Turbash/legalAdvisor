import { useSelector, useDispatch } from "react-redux";
import { deleteUser, logout } from "../slices/authSlice";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { user, token, loading } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onDelete = async () => {
    if (!confirm("Delete your account? This cannot be undone.")) return;
    try {
      await dispatch(deleteUser(token)).unwrap(); // assumes you wired this thunk
      dispatch(logout());
      navigate("/signup");
    } catch (e) {
      // handled by slice error if you want
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">Profile</h2>
      <div className="bg-white border rounded p-4">
        <div className="mb-3"><span className="text-gray-500">Username:</span> {user?.username}</div>
        <button
          className="px-4 py-2 rounded bg-red-600 text-white disabled:opacity-60"
          onClick={onDelete}
          disabled={loading}
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}