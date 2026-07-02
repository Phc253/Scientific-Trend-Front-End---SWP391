import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Dashboard from "./pages/Dashboard";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import Admin from "./pages/Admin";
import AdminLayout from "./components/admin/AdminLayout";
import StudentLayout from "./components/student/StudentLayout";
import StudentDashboard from "./components/student/StudentDashboard";
import StudentExplore from "./components/student/StudentExplore";
import StudentLibrary from "./components/student/StudentLibrary";
import StudentTrending from "./components/student/StudentTrending";
import ResearcherLayout from "./components/researcher/ResearcherLayout";
import ResearcherDashboard from "./components/researcher/ResearcherDashboard";
import ResearcherAnalytics from "./components/researcher/ResearcherAnalytic";
import LecturerLayout from "./components/lecturer/LecturerLayout";
import LecturerDashboard from "./components/lecturer/LecturerDashboard";
import LecturerGroups from "./components/lecturer/LecturerGroups";
import LecturerLibrary from "./components/lecturer/LecturerLibrary";
import LecturerTrends from "./components/lecturer/LecturerTrends";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* ==========================================
            KHU VỰC DÀNH CHO SINH VIÊN
            (Sử dụng StudentLayout)
        ========================================== */}
        <Route
          path="/student/*"
          element={
            <StudentLayout>
              <Routes>
                {/* Đường dẫn mặc định khi vào /student sẽ load StudentDashboard */}
                <Route path="/" element={<StudentDashboard />} />
                <Route path="/explore" element={<StudentExplore />} />
                <Route path="/library" element={<StudentLibrary />} />
                <Route path="/trending" element={<StudentTrending />} />
                {/* Mẹo: Sau này bạn tạo thêm trang Khám phá, hãy bỏ comment dòng dưới */}
                {/* <Route path="/explore" element={<StudentExplore />} /> */}
              </Routes>
            </StudentLayout>
          }
        />

        {/* ==========================================
            KHU VỰC CHUNG
            (Sử dụng Layout gốc)
        ========================================== */}
        <Route
          path="*"
          element={
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </Layout>
          }
        />

        {/* ==========================================
            KHU VỰC DÀNH CHO ADMIN
        ========================================== */}
        <Route
          path="/admin/*"
          element={
            <AdminLayout>
              <Admin />
            </AdminLayout>
          }
        />

        {/* ==========================================
            KHU VỰC DÀNH CHO NHÀ NGHIÊN CỨU
        ========================================== */}
        <Route
          path="/researcher/*"
          element={
            <ResearcherLayout>
              <Routes>
                <Route path="/" element={<ResearcherDashboard />} />
                <Route path="/analytics" element={<ResearcherAnalytics />} />
                {/* Bạn có thể tạo thêm các trang Network, Alerts sau này */}
              </Routes>
            </ResearcherLayout>
          }
        />

        {/* ==========================================
            KHU VỰC DÀNH CHO GIẢNG VIÊN
        ========================================== */}
        <Route
          path="/lecturer/*"
          element={
            <LecturerLayout>
              <Routes>
                <Route path="/" element={<LecturerDashboard />} />
                <Route path="/groups" element={<LecturerGroups />} />
                <Route path="/library" element={<LecturerLibrary />} />
                <Route path="/trends" element={<LecturerTrends />} />
              </Routes>
            </LecturerLayout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
