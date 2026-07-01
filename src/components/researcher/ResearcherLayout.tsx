import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const ResearcherLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRoles");
    navigate("/login");
  };

  const navItems = [
    { path: "/researcher", icon: "dashboard", label: "Tổng quan" },
    {
      path: "/researcher/analytics",
      icon: "insights",
      label: "Phân tích xu hướng",
    },
    { path: "/researcher/network", icon: "hub", label: "Mạng lưới hợp tác" },
    {
      path: "/researcher/alerts",
      icon: "notifications_active",
      label: "Cảnh báo bài báo",
    },
  ];

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans text-slate-800">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1e1b4b] text-white flex flex-col shadow-xl z-10">
        <div className="p-6 flex items-center gap-3 border-b border-indigo-900/50 shrink-0">
          <span className="material-symbols-outlined text-3xl text-indigo-400">
            biotech
          </span>
          <div>
            <h1 className="text-xl font-bold tracking-wider">SciTrend</h1>
            <p className="text-[10px] text-indigo-300 uppercase tracking-widest">
              Researcher
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
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-indigo-200 hover:bg-indigo-900/50 hover:text-white"
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

        {/* Thông tin người dùng & Đăng xuất (Góc dưới bên trái) */}
        <div className="p-4 border-t border-indigo-900/50 shrink-0 bg-[#16143a]">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold border border-indigo-400 shrink-0 shadow-sm">
              {localStorage.getItem("userName")?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">
                {localStorage.getItem("userName") || "Người dùng"}
              </p>
              <p className="text-xs text-indigo-300 font-medium truncate">
                Nhà nghiên cứu
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
              "Trang cá nhân"}
          </h2>

          {/* Góc phải Header bây giờ để các công cụ bổ trợ (Ví dụ: Nút thông báo) */}
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors rounded-full hover:bg-slate-50">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50">{children}</div>
      </main>
    </div>
  );
};

export default ResearcherLayout;
