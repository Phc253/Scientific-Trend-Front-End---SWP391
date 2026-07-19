import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import NotificationBell from "../common/NotificationBell";

const ResearcherLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState<string>("Nhà nghiên cứu");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const storedName =
      localStorage.getItem("fullName") || localStorage.getItem("userName");
    if (storedName) {
      setFullName(storedName);
    }
  }, []);

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    localStorage.removeItem("token");
    localStorage.removeItem("userRoles");
    localStorage.removeItem("actorType");
    navigate("/login");
  };

  // Đã cập nhật: Bổ sung thêm "Thư viện nghiên cứu" vào danh sách điều hướng
  const navItems = [
    { path: "/researcher", icon: "dashboard", label: "Tổng quan" },
    { path: "/researcher/explore", icon: "search", label: "Khám phá" },
    {
      path: "/researcher/analytics",
      icon: "insights",
      label: "Phân tích xu hướng",
    },
    {
      path: "/researcher/network",
      icon: "hub",
      label: "Mạng lưới học thuật",
    },
    {
      path: "/researcher/library",
      icon: "library_books",
      label: "Thư viện nghiên cứu",
    },
    {
      path: "/researcher/alerts",
      icon: "notifications_active",
      label: "Cảnh báo bài báo",
    },
  ];

  const activeLabel =
    navItems.find((item) =>
      item.path === "/researcher"
        ? location.pathname === item.path
        : location.pathname.startsWith(item.path),
    )?.label || "Trang cá nhân";

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

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              item.path === "/researcher"
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path);

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

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-indigo-900/50 shrink-0 bg-[#16143a]">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold border border-indigo-400 shrink-0 shadow-sm">
              {fullName.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">
                {fullName}
              </p>
              <p className="text-xs text-indigo-300 font-medium truncate">
                Nhà nghiên cứu
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all font-bold w-full cursor-pointer group"
          >
            <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">
              logout
            </span>
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm shrink-0">
          <h2 className="text-lg font-semibold text-slate-700">
            {activeLabel}
          </h2>

          <div className="flex items-center gap-5">
            {/* Quả chuông thông báo thông minh nhận diện routing động */}
            <NotificationBell basePath="/researcher" />
            <div className="h-6 w-px bg-slate-200 mx-1"></div>
          </div>
        </header>

        {/* Viewport render nội dung con */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
          <Outlet />
        </div>
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-[90%] max-w-[400px] shadow-2xl animate-scaleIn">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-rose-600 text-3xl font-bold">
                logout
              </span>
              <h3 className="text-xl font-black text-slate-800">
                Xác nhận đăng xuất
              </h3>
            </div>

            <p className="text-slate-500 font-medium mb-8">
              Bạn có chắc chắn muốn đăng xuất không?
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmLogout}
                className="px-6 py-2.5 text-sm font-bold bg-rose-600 text-white hover:bg-rose-700 rounded-xl transition-colors shadow-sm cursor-pointer"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResearcherLayout;
