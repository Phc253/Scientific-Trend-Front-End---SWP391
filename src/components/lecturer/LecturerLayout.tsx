import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";

const LecturerLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Khai báo state lưu tên hiển thị
  const [fullName, setFullName] = useState<string>("Giảng viên");

  // 2. Lấy tên từ localStorage khi component được load
  useEffect(() => {
    // Lấy 'fullName' (hoặc 'userName' dự phòng)
    const storedName =
      localStorage.getItem("fullName") || localStorage.getItem("userName");
    if (storedName) {
      setFullName(storedName);
    }
  }, []);

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      localStorage.clear();
      navigate("/login");
    }
  };

  const menuItems = [
    { path: "/lecturer", icon: "dashboard", label: "Tổng quan" },
    { path: "/lecturer/groups", icon: "groups", label: "Quản lý nhóm" },
    { path: "/lecturer/library", icon: "local_library", label: "Kho học liệu" },
    {
      path: "/lecturer/trends",
      icon: "trending_up",
      label: "Định hướng đề tài",
    },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Sidebar Giảng viên (Màu Emerald - Xanh ngọc) */}
      <aside className="w-64 bg-[#064e3b] text-white flex flex-col shadow-xl z-20">
        {/* Logo */}
        <div className="p-6 flex items-center gap-3 border-b border-emerald-800/50">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-emerald-800 font-black text-2xl">
              science
            </span>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white leading-tight">
              Sci<span className="text-emerald-400">Trend</span>
            </h1>
            <p className="text-[10px] text-emerald-200 uppercase tracking-widest font-bold">
              Lecturer Portal
            </p>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-md"
                    : "text-emerald-100 hover:bg-emerald-800/50 hover:text-white"
                }`}
              >
                <span
                  className={`material-symbols-outlined ${isActive ? "text-white" : "text-emerald-300"}`}
                >
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Khu vực hiển thị thông tin User (Đã được sửa lại) */}
        <div className="p-4 border-t border-emerald-800/50 shrink-0 bg-[#022c22]">
          <div className="flex items-center gap-3 mb-4 px-2">
            {/* Avatar chữ cái đầu của tên */}
            <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold border border-emerald-400 shrink-0 shadow-sm">
              {fullName.charAt(0).toUpperCase()}
            </div>

            <div className="overflow-hidden">
              {/* Tên hiển thị đầy đủ */}
              <p className="text-sm font-bold text-white truncate">
                {fullName}
              </p>
              <p className="text-xs text-emerald-300 font-medium truncate">
                Giảng viên
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-800/50 text-emerald-100 hover:bg-red-500 hover:text-white transition-colors text-sm font-bold"
          >
            <span className="material-symbols-outlined text-[18px]">
              logout
            </span>
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content (Khu vực Outlet để render các trang con) */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header ẩn/hiện tùy nhu cầu (Tạm thời là thanh ngang đơn giản) */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="text-slate-500 font-medium">
            {new Date().toLocaleDateString("vi-VN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </header>

        {/* Vùng nội dung cuộn được */}
        <div className="flex-1 overflow-auto p-8 bg-slate-50/50">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default LecturerLayout;
