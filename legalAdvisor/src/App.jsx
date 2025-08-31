import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./components/AuthPage";
// import ChatPage from "./pages/ChatPage";
import { useSelector } from "react-redux";

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />

        {/* <Route
          path="/chat"
          element={user ? <ChatPage /> : <Navigate to="/auth" />}
        /> */}

        <Route path="*" element={<Navigate to={user ? "/chat" : "/auth"} />} />
      </Routes>
    </Router>
  );
}

export default App;
