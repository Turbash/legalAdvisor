import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, signupUser } from "../slices/authSlice";

function AuthPage() {
  const dispatch = useDispatch();
  const { loading, error, user } = useSelector((state) => state.auth);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignup) dispatch(signupUser({ username, password }));
    else dispatch(loginUser({ username, password }));
  };

  if (user) return <h1>Welcome, {user.username} 🎉</h1>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6">{isSignup ? "Signup" : "Login"}</h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />

        <button type="submit" disabled={loading} className="w-full bg-blue-500 text-white py-2 rounded">
          {loading ? "Processing..." : isSignup ? "Signup" : "Login"}
        </button>

        {error && <p className="text-red-500 mt-3">{error}</p>}

        <p className="mt-4 text-sm">
          {isSignup ? "Already have an account?" : "No account?"}{" "}
          <span className="text-blue-500 cursor-pointer" onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? "Login" : "Signup"}
          </span>
        </p>
      </form>
    </div>
  );
}

export default AuthPage;