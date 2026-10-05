import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ImageDetection from "./pages/ImageDetection";
import ManualControl from "./pages/ManualControl";
import Simulation from "./pages/Simulation";
import VideoAnalysis from "./pages/VideoAnalysis";
import History from "./pages/History";

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen">Loading control center...</div>;
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Protected><Layout /></Protected>}>
        <Route index element={<Dashboard />} />
        <Route path="image-detection" element={<ImageDetection />} />
        <Route path="manual-control" element={<ManualControl />} />
        <Route path="simulation" element={<Simulation />} />
        <Route path="video-analysis" element={<VideoAnalysis />} />
        <Route path="history" element={<History />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
