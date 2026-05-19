import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NewComplaint from "./pages/NewComplaint";
import ComplaintList from "./pages/ComplaintList";
import ComplaintDetail from "./pages/ComplaintDetail";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/new-complaint" element={<ProtectedRoute><NewComplaint /></ProtectedRoute>} />
              <Route path="/complaints" element={<ProtectedRoute><ComplaintList /></ProtectedRoute>} />
              <Route path="/complaints/:id" element={<ProtectedRoute><ComplaintDetail /></ProtectedRoute>} />
            </Routes>
          </main>
          <ToastContainer position="top-right" autoClose={3000} theme="dark" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
