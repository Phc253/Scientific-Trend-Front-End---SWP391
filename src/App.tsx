import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Dashboard from "./pages/Dashboard";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";

// --- Admin ---
import Admin from "./pages/Admin";
import VerifyEmail from "./pages/VerifyEmail"; // Import từ nhánh duc
import AdminLayout from "./components/admin/AdminLayout";

// --- Nhà nghiên cứu ---
import ResearcherLayout from "./components/researcher/ResearcherLayout";
import ResearcherDashboard from "./components/researcher/ResearcherDashboard";
import ResearcherAnalytics from "./components/researcher/ResearcherAnalytic";
import ResearcherNetwork from "./components/researcher/ResearcherNetwork";
import ResearcherAlerts from "./components/researcher/ResearcherAlerts";

// --- Member ---
import MemberLayout from "./components/shared/MemberLayout";
import SharedDashboard from "./components/shared/SharedDashboard"; // (hoặc StudentDashboard nếu bạn chưa đổi tên)
import SharedExplore from "./components/shared/SharedExplore";
import SharedLibrary from "./components/shared/SharedLibrary";
import SharedTrending from "./components/shared/SharedTrending";
// --- Dùng chung ---
import PaperDetails from "./components/common/PaperDetails";

const App: React.FC = () => {
  return (
    <Routes>
      {/* ==========================================
          KHU VỰC KHÔNG CẦN LAYOUT (Auth)
      ========================================== */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* ==========================================
          KHU VỰC CHUNG (Dành cho Khách)
      ========================================== */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="search" element={<Search />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="paper/:id" element={<PaperDetails />} />
        <Route path="library" element={<StudentLibrary />} /> {/* Giả sử MyLibrary dùng chung */}
      </Route>

      {/* ==========================================
          KHU VỰC DÀNH CHO ADMIN
      ========================================== */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Admin />} />
      </Route>

      {/* ==========================================
          KHU VỰC DÀNH CHO SINH VIÊN
      ========================================== */}
      <Route path="/student" element={<MemberLayout />}>
        <Route index element={<SharedDashboard />} />
        <Route path="explore" element={<SharedExplore />} />
        <Route path="library" element={<SharedLibrary />} />
        <Route path="trending" element={<SharedTrending />} />
        <Route path="paper/:id" element={<PaperDetails />} />
      </Route>

      {/* ==========================================
          KHU VỰC DÀNH CHO NHÀ NGHIÊN CỨU
      ========================================== */}
      <Route path="/researcher" element={<ResearcherLayout />}>
        <Route index element={<ResearcherDashboard />} />
        <Route path="analytics" element={<ResearcherAnalytics />} />
        <Route path="network" element={<ResearcherNetwork />} />
        <Route path="alerts" element={<ResearcherAlerts />} />
        <Route path="paper/:id" element={<PaperDetails />} />
      </Route>

      {/* ==========================================
          KHU VỰC DÀNH CHO GIẢNG VIÊN (Dùng chung Layout với Sinh viên)
      ========================================== */}
      <Route path="/lecturer" element={<MemberLayout />}>
        <Route index element={<SharedDashboard />} />
        <Route path="explore" element={<SharedExplore />} />
        <Route path="library" element={<SharedLibrary />} />
        <Route path="trending" element={<SharedTrending />} />
        <Route path="paper/:id" element={<PaperDetails />} />
      </Route>
    </Routes>
  );
};

export default App;