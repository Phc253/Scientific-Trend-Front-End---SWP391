import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isReportsPath = location.pathname.startsWith("/admin/paper-reports") || location.pathname.startsWith("/admin/keyword-stats");
  const [isReportsOpen, setIsReportsOpen] = React.useState(isReportsPath);

  // Sync state if route changes externally
  React.useEffect(() => {
    if (isReportsPath) {
      setIsReportsOpen(true);
    }
  }, [location.pathname, isReportsPath]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRoles");
    navigate("/login");
  };

  const navItems = [
    { path: "/admin", icon: "dashboard", label: "Tổng quan hệ thống" },
    { path: "/admin/users", icon: "group", label: "Quản lý người dùng" },
    { path: "/admin/api", icon: "api", label: "Đồng bộ OpenAlex" },
    { path: "/admin/scheduler", icon: "settings", label: "Cấu hình Scheduler" },
    { path: "/admin/paper-reports", icon: "description", label: "Báo cáo bài báo" },
    { path: "/admin/keyword-stats", icon: "bar_chart", label: "Thống kê từ khóa" },
  ];

  // Helper to determine if a path is active
  // Since "/" is "/admin" and others are "/admin/users", etc.
  const isTabActive = (itemPath: string) => {
    if (itemPath === "/admin") {
      return location.pathname === "/admin" || location.pathname === "/admin/";
    }
    return location.pathname.startsWith(itemPath);
  };

  const currentLabel = navItems.find((i) => isTabActive(i.path))?.label || "Bảng Điều Khiển";

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans text-slate-800">
      {/* Sidebar - Tông màu Slate/Navy đậm chất quản trị và bảo mật */}
      <aside className="w-64 bg-[#0f172a] text-white flex flex-col shadow-2xl z-10">
        {/* Header thương hiệu */}
        <div className="p-6 flex items-center gap-3 border-b border-slate-800/80 shrink-0">
          <span className="material-symbols-outlined text-3xl text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
            admin_panel_settings
          </span>
          <div>
            <h1 className="text-xl font-bold tracking-wider text-slate-100">SciTrend</h1>
            <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">
              Administrator
            </p>
          </div>
        </div>

        {/* Danh sách Menu */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.slice(0, 4).map((item) => {
            const isActive = isTabActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/20 translate-x-1"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
                }`}
              >
                <span className={`material-symbols-outlined text-[20px] transition-transform duration-300 ${
                  isActive ? "scale-110 text-cyan-300" : ""
                }`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Group Báo cáo & Thống kê dưới dạng Dropdown */}
          <div className="space-y-1">
            <button
              onClick={() => setIsReportsOpen(!isReportsOpen)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 cursor-pointer ${
                isReportsPath
                  ? "bg-slate-800/60 text-slate-100"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`material-symbols-outlined text-[20px] ${isReportsPath ? "text-cyan-300" : ""}`}>
                  monitoring
                </span>
                <span>Báo cáo & Thống kê</span>
              </div>
              <span className={`material-symbols-outlined text-sm transition-transform duration-300 ${
                isReportsOpen ? "rotate-180" : ""
              }`}>
                keyboard_arrow_down
              </span>
            </button>

            {isReportsOpen && (
              <div className="pl-4 mt-1 space-y-1 border-l-2 border-slate-800 ml-6 animate-fadeIn">
                <Link
                  to="/admin/paper-reports"
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
                    location.pathname.startsWith("/admin/paper-reports")
                      ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-500/10"
                      : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-100"
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">description</span>
                  <span>Báo cáo bài báo</span>
                </Link>
                <Link
                  to="/admin/keyword-stats"
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
                    location.pathname.startsWith("/admin/keyword-stats")
                      ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-500/10"
                      : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-100"
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">bar_chart</span>
                  <span>Thống kê từ khóa</span>
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Thông tin Quản trị viên (Góc dưới bên trái) */}
        <div className="p-4 border-t border-slate-800/80 shrink-0 bg-[#0b0f19]">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center font-bold border border-cyan-400/30 shrink-0 shadow-inner">
              {localStorage.getItem("userName")?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-200 truncate">
                {localStorage.getItem("userName") || "Admin"}
              </p>
              <p className="text-[11px] text-slate-400 font-medium truncate">
                Quản trị viên
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-lg transition-all duration-200 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">
              logout
            </span>
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Vùng Nội Dung Chính */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm shrink-0">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse"></span>
            <h2 className="text-lg font-bold text-slate-800">
              {currentLabel}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
              Hệ thống theo dõi xu hướng khoa học
            </div>
            <button
              className="relative p-2 text-slate-400 hover:text-cyan-600 transition-colors rounded-full hover:bg-slate-50"
              title="Thông báo hệ thống"
            >
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
          <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
