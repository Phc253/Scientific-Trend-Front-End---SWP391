import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Dashboard from "./pages/Dashboard";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import Admin from "./pages/Admin";
import StudentLayout from "./components/student/StudentLayout";
import StudentDashboard from "./components/student/StudentDashboard";
import StudentExplore from "./components/student/StudentExplore";
import StudentLibrary from "./components/student/StudentLibrary";
import StudentTrending from "./components/student/StudentTrending";

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
            KHU VỰC CHUNG & ADMIN
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
                <Route path="/admin" element={<Admin />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
