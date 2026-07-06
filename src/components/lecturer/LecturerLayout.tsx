import React from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom"; // 1. Thêm Outlet

const LecturerLayout: React.FC = () => {
  // 2. Bỏ { children: ... }
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRoles");
    navigate("/login");
  };

  const navItems = [
    { path: "/lecturer", icon: "space_dashboard", label: "Tổng quan" },
    { path: "/lecturer/groups", icon: "groups", label: "Quản lý Nhóm Đồ án" },
    { path: "/lecturer/library", icon: "local_library", label: "Kho Học liệu" },
    {
      path: "/lecturer/trends",
      icon: "troubleshoot",
      label: "Định hướng Đề tài",
    },
  ];

  return (
    <div className="flex h-screen bg-[#f4f7f6] font-sans text-slate-800">
      {/* Sidebar */}
      <aside className="w-64 bg-[#064e3b] text-white flex flex-col shadow-xl z-10">
        <div className="p-6 flex items-center gap-3 border-b border-emerald-800/50 shrink-0">
          <span className="material-symbols-outlined text-3xl text-emerald-400">
            school
          </span>
          <div>
            <h1 className="text-xl font-bold tracking-wider">SciTrend</h1>
            <p className="text-[10px] text-emerald-300 uppercase tracking-widest">
              Lecturer
            </p>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-md"
                    : "text-emerald-100 hover:bg-emerald-800/50 hover:text-white"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-emerald-800/50 shrink-0 bg-[#022c22]">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold border border-emerald-400 shrink-0 shadow-sm">
              {localStorage.getItem("userName")?.charAt(0).toUpperCase() || "L"}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">
                {localStorage.getItem("userName") || "Tên Giảng viên"}
              </p>
              <p className="text-xs text-emerald-300 font-medium truncate">
                Giảng viên / Hướng dẫn
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-red-300 hover:bg-red-500/10 hover:text-red-200 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">
              logout
            </span>
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm shrink-0">
          <h2 className="text-lg font-semibold text-slate-700">
            {navItems.find((i) => i.path === location.pathname)?.label ||
              "Bảng điều khiển"}
          </h2>

          <div className="flex items-center gap-4">
            <button
              className="relative p-2 text-slate-400 hover:text-emerald-600 transition-colors rounded-full hover:bg-slate-50"
              title="Thông báo từ sinh viên"
            >
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* 3. Dùng Outlet thay cho {children} */}
        <div className="flex-1 overflow-y-auto p-8 bg-[#f4f7f6]">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default LecturerLayout;
