import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Dashboard from "./pages/Dashboard";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import Admin from "./pages/Admin";
import PaperDetail from "./pages/PaperDetail";
import MyLibrary from "./pages/MyLibrary";
import VerifyEmail from "./pages/VerifyEmail";
import { AuthProvider } from "./context/AuthContext";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Các trang KHÔNG dùng Layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          {/* Các trang DÙNG Layout */}
          <Route
            path="*"
            element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/paper/:id" element={<PaperDetail />} />
                  <Route path="/library" element={<MyLibrary />} />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};
export default App;
