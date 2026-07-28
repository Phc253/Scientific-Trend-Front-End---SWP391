import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { AdminOverview } from "../components/admin/AdminOverview";
import { AdminUsers } from "../components/admin/AdminUsers";
import { AdminOpenAlex } from "../components/admin/AdminOpenAlex";
import { AdminOpenAlexConfig } from "../components/admin/AdminOpenAlexConfig";
import { AdminPaperReports } from "../components/admin/AdminPaperReports";
import { AdminKeywordStats } from "../components/admin/AdminKeywordStats";

const Admin: React.FC = () => {
  const location = useLocation();

  // Determine active tab based on route path
  let activeTab: "overview" | "users" | "api" | "templates" | "scheduler" | "paper-reports" | "keyword-stats" = "overview";
  if (location.pathname.includes("/users")) {
    activeTab = "users";
  } else if (location.pathname.includes("/api")) {
    activeTab = "api";
  } else if (location.pathname.includes("/scheduler")) {
    activeTab = "scheduler";
  } else if (location.pathname.includes("/paper-reports")) {
    activeTab = "paper-reports";
  } else if (location.pathname.includes("/keyword-stats")) {
    activeTab = "keyword-stats";
  }

  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Khối Banner Tiêu Đề */}
      <div className="bg-gradient-to-r from-[#002045] to-[#122e54] text-white p-6 rounded-xl shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#a2eded] text-3xl">admin_panel_settings</span>
            <h1 className="text-2xl font-bold tracking-tight">Bảng Điều Khiển Hệ Thống</h1>
          </div>
          <p className="text-[#86a0cd] text-sm mt-1 max-w-xl">
            Quản lý quyền hạn người dùng (Sinh viên, Giảng viên, Nghiên cứu viên), kiểm thử trực tiếp API OpenAlex và xem trước các thành phần thiết kế.
          </p>
        </div>
      </div>

      {/* NỘI DUNG TỪNG TABS */}
      {activeTab === "overview" && <AdminOverview />}
      {activeTab === "users" && <AdminUsers />}
      {activeTab === "api" && <AdminOpenAlex />}
      {activeTab === "scheduler" && <AdminOpenAlexConfig />}
      {activeTab === "paper-reports" && <AdminPaperReports />}
      {activeTab === "keyword-stats" && <AdminKeywordStats />}

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-2xl border text-xs md:text-sm font-semibold transition-all duration-300 ${
          toast.type === "success" 
            ? "bg-[#e6f4ea] text-[#137333] border-[#a3e2ab]" 
            : "bg-[#fce8e6] text-[#c5221f] border-[#fad2cf]"
        }`}>
          <span className="material-symbols-outlined text-lg">
            {toast.type === "success" ? "check_circle" : "error"}
          </span>
          <span>{toast.message}</span>
          <button type="button" onClick={() => setToast(null)} className="ml-2 hover:opacity-70 cursor-pointer">
            <span className="material-symbols-outlined text-sm font-bold">close</span>
          </button>
        </div>
      )}

      {/* Banner config modal removed */}
    </div>
  );
};

export default Admin;
