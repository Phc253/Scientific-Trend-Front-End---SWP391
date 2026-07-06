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
import ResearcherLayout from "./components/researcher/ResearcherLayout";
import ResearcherDashboard from "./components/researcher/ResearcherDashboard";
import ResearcherAnalytics from "./components/researcher/ResearcherAnalytic";
import ResearcherNetwork from "./components/researcher/ResearcherNetwork";
import ResearcherAlerts from "./components/researcher/ResearcherAlerts";
import LecturerLayout from "./components/lecturer/LecturerLayout";
import LecturerDashboard from "./components/lecturer/LecturerDashboard";
import LecturerGroups from "./components/lecturer/LecturerGroups";
import LecturerLibrary from "./components/lecturer/LecturerLibrary";
import LecturerTrends from "./components/lecturer/LecturerTrends";
import PaperDetails from "./components/common/PaperDetails";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Khu vực chung */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="search" element={<Search />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="admin" element={<Admin />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* Khu vực Sinh viên */}
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<StudentDashboard />} />
          <Route path="explore" element={<StudentExplore />} />
          <Route path="library" element={<StudentLibrary />} />
          <Route path="trending" element={<StudentTrending />} />
          <Route path="paper/:id" element={<PaperDetails />} />
        </Route>

        {/* Khu vực Researcher */}
        <Route path="/researcher" element={<ResearcherLayout />}>
          <Route index element={<ResearcherDashboard />} />
          <Route path="analytics" element={<ResearcherAnalytics />} />
          <Route path="network" element={<ResearcherNetwork />} />
          <Route path="alerts" element={<ResearcherAlerts />} />
        </Route>

        {/* Khu vực Giảng viên */}
        <Route path="/lecturer" element={<LecturerLayout />}>
          <Route index element={<LecturerDashboard />} />
          <Route path="groups" element={<LecturerGroups />} />
          <Route path="library" element={<LecturerLibrary />} />
          <Route path="trends" element={<LecturerTrends />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
