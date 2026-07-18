import React, { useEffect, useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import axios from "axios";
import NotificationBell from "./common/NotificationBell";

const Layout: React.FC = () => {
  const location = useLocation();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    setUserName(storedName || null);
  }, [location]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/Account/logout",
        {},
        { headers: token ? { Authorization: `Bearer ${token}` } : {} },
      );
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      localStorage.removeItem("userRoles");
      window.location.href = "/"; // Đã đổi từ "/login" thành "/"
    }
  };

  const role = localStorage.getItem("userRoles") || "";
  const isAdmin = role.includes("Administrator");

  const menuItems = [
    { path: "/", label: "Trang chủ", icon: "home" },
    { path: "/search", label: "Khám phá", icon: "explore" },
    { path: "/dashboard", label: "Xu hướng", icon: "trending_up" },
    { path: "/library", label: "Thư viện", icon: "bookmark" },
    ...(isAdmin
      ? [
          {
            path: "/admin",
            label: "Quản trị hệ thống",
            icon: "admin_panel_settings",
          },
        ]
      : []),
  ];

  return (
    <div className="flex min-h-screen bg-[#f7fafc]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#ebeef0] flex flex-col fixed h-full z-30">
        <div className="p-6 border-b border-[#ebeef0] flex items-center gap-3">
          <span className="material-symbols-outlined text-[#002045] text-3xl font-bold">
            analytics
          </span>
          <span className="text-xl font-bold text-[#002045] tracking-tight">
            SciTrend
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#a2eded] text-[#1a6d6e] shadow-sm"
                    : "text-[#43474e] hover:bg-[#f1f4f6]"
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-[#ebeef0] space-y-3">
          <div className="flex items-center gap-3 px-2 py-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border ${userName ? "bg-[#a2eded] text-[#1a6d6e] border-[#1a6d6e]" : "bg-[#f1f4f6] text-[#43474e] border-[#c4c6cf]"}`}
            >
              <span className="material-symbols-outlined text-xl">
                {userName ? "face" : "account_circle"}
              </span>
            </div>
            <div>
              <p className="text-sm font-bold text-[#181c1e] truncate max-w-[140px]">
                {userName || "Guest"}
              </p>
              <p className="text-xs text-[#74777f]">
                {userName
                  ? role.includes("Student")
                    ? "Sinh viên"
                    : role.includes("Lecturer")
                      ? "Giảng viên"
                      : "Thành viên"
                  : "Chưa đăng nhập"}
              </p>
            </div>
          </div>

          {userName ? (
            <button
              onClick={handleLogout}
              className="w-full bg-[#ef4444] hover:bg-[#dc2626] text-white text-xs font-semibold py-2.5 px-4 rounded flex items-center justify-center gap-2 transition-all"
            >
              <span className="material-symbols-outlined text-sm">logout</span>{" "}
              Đăng xuất
            </button>
          ) : (
            <div className="flex flex-col gap-2 pt-1">
              <Link
                to="/login"
                className="w-full bg-[#002045] hover:opacity-90 text-white text-xs font-semibold py-2.5 px-4 rounded flex items-center justify-center gap-2 transition-all"
              >
                <span className="material-symbols-outlined text-sm">login</span>{" "}
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="w-full border border-[#002045] text-[#002045] hover:bg-[#f1f4f6] text-xs font-semibold py-2.5 px-4 rounded flex items-center justify-center gap-2 transition-all"
              >
                <span className="material-symbols-outlined text-sm">
                  person_add
                </span>{" "}
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 pl-64 flex flex-col min-h-screen">
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
          {/* === GÓC BÊN TRÁI === (Thường chứa Logo, Tiêu đề hoặc Nút ẩn/hiện Sidebar) */}
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-black text-slate-800">
              Scientific Trend
            </h2>
          </div>

          {/* === GÓC BÊN PHẢI === (Nơi chúng ta sẽ đặt Quả chuông) */}
          <div className="flex items-center gap-5">
            {/* 1. GẮN QUẢ CHUÔNG VÀO ĐÂY */}
            <NotificationBell />

            {/* Đường kẻ dọc phân cách cho đẹp (Tùy chọn) */}
            <div className="h-6 w-px bg-slate-200 mx-1"></div>
          </div>
        </header>

        <main className="flex-1 p-8">
          <Outlet /> {/* Render nội dung tại đây */}
        </main>
      </div>
    </div>
  );
};

export default Layout;
