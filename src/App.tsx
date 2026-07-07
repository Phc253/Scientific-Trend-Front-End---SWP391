import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Dashboard from "./pages/Dashboard";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import Admin from "./pages/Admin";
import AdminLayout from "./components/admin/AdminLayout";

// --- Sinh viên ---
import StudentLayout from "./components/student/StudentLayout";
import StudentDashboard from "./components/student/StudentDashboard";
import StudentExplore from "./components/student/StudentExplore";
import StudentLibrary from "./components/student/StudentLibrary";
import StudentTrending from "./components/student/StudentTrending";

// --- Nhà nghiên cứu ---
import ResearcherLayout from "./components/researcher/ResearcherLayout";
import ResearcherDashboard from "./components/researcher/ResearcherDashboard";
import ResearcherAnalytics from "./components/researcher/ResearcherAnalytic";
import ResearcherNetwork from "./components/researcher/ResearcherNetwork";
import ResearcherAlerts from "./components/researcher/ResearcherAlerts";

// --- Giảng viên ---
import LecturerLayout from "./components/lecturer/LecturerLayout";
import LecturerDashboard from "./components/lecturer/LecturerDashboard";
import LecturerGroups from "./components/lecturer/LecturerGroups";
import LecturerLibrary from "./components/lecturer/LecturerLibrary";
import LecturerTrends from "./components/lecturer/LecturerTrends";
import LecturerSearch from "./components/lecturer/LecturerSearch";

// --- Dùng chung ---
import PaperDetails from "./components/common/PaperDetails";

const App: React.FC = () => {
  return (
    <Routes>
      {/* ==========================================
          KHU VỰC CHUNG (Dành cho Khách)
      ========================================== */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="search" element={<Search />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
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
      <Route path="/student" element={<StudentLayout />}>
        <Route index element={<StudentDashboard />} />
        <Route path="explore" element={<StudentExplore />} />
        <Route path="library" element={<StudentLibrary />} />
        <Route path="trending" element={<StudentTrending />} />
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
          KHU VỰC DÀNH CHO GIẢNG VIÊN
      ========================================== */}
      <Route path="/lecturer" element={<LecturerLayout />}>
        <Route index element={<LecturerDashboard />} />
        <Route path="groups" element={<LecturerGroups />} />
        <Route path="library" element={<LecturerLibrary />} />
        <Route path="trends" element={<LecturerTrends />} />
        <Route path="search" element={<LecturerSearch />} />
        <Route path="paper/:id" element={<PaperDetails />} />
      </Route>
    </Routes>
  );
};

export default App;
