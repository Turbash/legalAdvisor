import { Outlet, Link } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-serif">⚖️ LawExplainer</h1>
          <p className="text-sm text-gray-500">Sign in to continue</p>
        </div>
        <Outlet />
        <div className="mt-6 text-center text-sm text-gray-500">
          <Link to="/signup" className="underline mr-2">Sign up</Link>
          <span>·</span>
          <Link to="/login" className="underline ml-2">Log in</Link>
        </div>
      </div>
    </div>
  );
}