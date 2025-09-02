import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function AppLayout() {
  return (
    <div className="h-screen w-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <div className="flex-1 min-w-0 bg-gray-50">
          <Outlet />
        </div>
      </div>
    </div>
  );
}