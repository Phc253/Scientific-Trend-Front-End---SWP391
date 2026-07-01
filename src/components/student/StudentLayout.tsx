import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const StudentLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string | null>("Phúc"); // Giả lập tên user

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) setUserName(storedName);
  }, [location]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const menuItems = [
    { path: "/student", label: "Trang tổng quan", icon: "dashboard" },
    { path: "/student/explore", label: "Khám phá", icon: "search" },
    { path: "/student/library", label: "Tủ sách cá nhân", icon: "bookmarks" },
    {
      path: "/student/trending",
      label: "Xu hướng",
      icon: "local_fire_department",
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#f7fafc]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#ebeef0] flex flex-col fixed h-full z-30">
        <div className="p-6 border-b border-[#ebeef0] flex items-center gap-3">
          <span className="material-symbols-outlined text-[#13696a] text-3xl font-bold">
            school
          </span>
          <span className="text-xl font-bold text-[#002045] tracking-tight">
            SciTrend
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#e0f2f1] text-[#13696a] shadow-sm"
                    : "text-[#43474e] hover:bg-[#f1f4f6]"
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-[#ebeef0]">
          <div className="flex items-center gap-3 px-2 py-2 mb-3">
            <div className="w-10 h-10 rounded-full bg-[#e0f2f1] text-[#13696a] flex items-center justify-center border border-[#13696a]">
              <span className="material-symbols-outlined text-xl">face</span>
            </div>
            <div>
              <p className="text-sm font-bold text-[#181c1e] truncate">
                {userName}
              </p>
              <p className="text-xs text-[#74777f]">Sinh viên (Student)</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-[#f1f4f6] hover:bg-[#ffebee] hover:text-[#c62828] text-[#43474e] text-xs font-bold py-2.5 px-4 rounded flex items-center justify-center gap-2 transition-all duration-200"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 pl-64 flex flex-col min-h-screen">
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
};

export default StudentLayout;
