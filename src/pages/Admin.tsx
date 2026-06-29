import React, { useState } from "react";
import { AdminOverview } from "../components/admin/AdminOverview";
import { AdminUsers } from "../components/admin/AdminUsers";
import { AdminOpenAlex } from "../components/admin/AdminOpenAlex";
import { AdminOpenAlexConfig } from "../components/admin/AdminOpenAlexConfig";
import type { SystemLog } from "../types/admin";

const Admin: React.FC = () => {
  // 1. Quản lý Tabs
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "api" | "templates" | "scheduler">("overview");

  // 2. Hệ thống logs giả lập
  const [logs, setLogs] = useState<SystemLog[]>([
    { time: "21:05:12", type: "INFO", message: "Hệ thống khởi tạo cổng kết nối OpenAlex API." },
    { time: "21:06:45", type: "SUCCESS", message: "Đồng bộ hóa xu hướng từ khóa AI hoàn tất (1,240 từ khóa)." },
    { time: "21:08:02", type: "INFO", message: "Tài khoản USR-003 đăng nhập thành công từ địa chỉ IP 192.168.1.15." },
    { time: "21:10:00", type: "WARNING", message: "OpenAlex API phản hồi với độ trễ cao (850ms) trong cụm tìm kiếm 'quantum computing'." },
  ]);

  // Hàm tạo log mới
  const addLog = (type: SystemLog["type"], message: string) => {
    const now = new Date();
    const timeStr = now.toTimeString().split(" ")[0];
    setLogs((prev) => [{ time: timeStr, type, message }, ...prev.slice(0, 7)]);
  };



  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Khối Banner Tiêu Đề */}
      <div className="bg-gradient-to-r from-[#002045] to-[#122e54] text-white p-6 rounded-xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#a2eded] text-3xl">admin_panel_settings</span>
            <h1 className="text-2xl font-bold tracking-tight">Bảng Điều Khiển Hệ Thống</h1>
          </div>
          <p className="text-[#86a0cd] text-sm mt-1 max-w-xl">
            Quản lý quyền hạn người dùng (Sinh viên, Giảng viên, Nghiên cứu viên), kiểm thử trực tiếp API OpenAlex và xem trước các thành phần thiết kế.
          </p>
        </div>
        <div className="flex gap-2">
        
        </div>
      </div>

      {/* Bộ Điều Hướng Tabs */}
      <div className="flex border-b border-[#ebeef0] gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 py-3 px-4 text-sm font-semibold transition-all border-b-2 cursor-pointer ${
            activeTab === "overview"
              ? "border-[#13696a] text-[#13696a]"
              : "border-transparent text-[#43474e] hover:text-[#002045] hover:border-[#ebeef0]"
          }`}
        >
          <span className="material-symbols-outlined text-lg">dashboard</span>
          Tổng quan hệ thống
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 py-3 px-4 text-sm font-semibold transition-all border-b-2 cursor-pointer ${
            activeTab === "users"
              ? "border-[#13696a] text-[#13696a]"
              : "border-transparent text-[#43474e] hover:text-[#002045] hover:border-[#ebeef0]"
          }`}
        >
          <span className="material-symbols-outlined text-lg">group</span>
          Quản lý người dùng
        </button>
        <button
          onClick={() => setActiveTab("api")}
          className={`flex items-center gap-2 py-3 px-4 text-sm font-semibold transition-all border-b-2 cursor-pointer ${
            activeTab === "api"
              ? "border-[#13696a] text-[#13696a]"
              : "border-transparent text-[#43474e] hover:text-[#002045] hover:border-[#ebeef0]"
          }`}
        >
          <span className="material-symbols-outlined text-lg">api</span>
          Đồng bộ OpenAlex
        </button>
        <button
          onClick={() => setActiveTab("scheduler")}
          className={`flex items-center gap-2 py-3 px-4 text-sm font-semibold transition-all border-b-2 cursor-pointer ${
            activeTab === "scheduler"
              ? "border-[#13696a] text-[#13696a]"
              : "border-transparent text-[#43474e] hover:text-[#002045] hover:border-[#ebeef0]"
          }`}
        >
          <span className="material-symbols-outlined text-lg">settings</span>
          Cấu hình Scheduler
        </button>
     
      </div>

      {/* NỘI DUNG TỪNG TABS */}
      {activeTab === "overview" && <AdminOverview logs={logs} />}
      {activeTab === "users" && <AdminUsers addLog={addLog} />}
      {activeTab === "api" && <AdminOpenAlex addLog={addLog} />}
      {activeTab === "scheduler" && <AdminOpenAlexConfig addLog={addLog} />}
    </div>
  );
};

export default Admin;
