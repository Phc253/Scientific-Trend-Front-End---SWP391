import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Dashboard from "./pages/Dashboard";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import PaperDetail from "./pages/PaperDetail";
import MyLibrary from "./pages/MyLibrary";
import { AuthProvider } from "./context/AuthContext";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        {/* Bao bọc toàn bộ các tuyến đường bằng khung sườn Layout chung */}
        <Layout>
          <Routes>
            {/* Định nghĩa đường dẫn cho từng trang cụ thể */}
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/paper/:id" element={<PaperDetail />} />
            <Route path="/library" element={<MyLibrary />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

export default App;