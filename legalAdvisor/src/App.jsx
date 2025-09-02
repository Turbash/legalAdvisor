import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "./slices/authSlice";

import RequireAuth from "./router/RequireAuth";
import AuthLayout from "./layouts/AuthLayout";
import AppLayout from "./layouts/AppLayout";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ChatPage from "./pages/ChatPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

export default function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={user ? <Navigate to="/app/chat" /> : <LoginPage />} />
          <Route path="/signup" element={user ? <Navigate to="/app/chat" /> : <SignupPage />} />
        </Route>

        <Route element={<RequireAuth><AppLayout /></RequireAuth>}>
          <Route path="/app/chat" element={<ChatPage />} />
          <Route path="/app/chat/:sessionId" element={<ChatPage />} />
          <Route path="/app/profile" element={<ProfilePage />} />
        </Route>

        <Route path="/" element={<Navigate to={user ? "/app/chat" : "/login"} />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
