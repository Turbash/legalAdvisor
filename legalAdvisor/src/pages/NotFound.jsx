import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="text-center">
        <div className="text-5xl mb-2">404</div>
        <p className="text-gray-500 mb-4">Page not found</p>
        <Link className="underline" to="/">Go home</Link>
      </div>
    </div>
  );
}