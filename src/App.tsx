import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Dashboard from "./pages/Dashboard";

const App: React.FC = () => {
  return (
    <Router>
      {/* Bao bọc toàn bộ các tuyến đường bằng khung sườn Layout chung */}
      <Layout>
        <Routes>
          {/* Định nghĩa đường dẫn cho từng trang cụ thể */}
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
