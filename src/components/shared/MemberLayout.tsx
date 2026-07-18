import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import NotificationBell from "./NotificationBell";

const MemberLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState<string>("Người dùng");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // 1. Tự động nhận diện Role từ localStorage
  const role =
    localStorage.getItem("userRoles") ||
    localStorage.getItem("actorType") ||
    "";
  const isLecturer = role.includes("Lecturer");

  // 2. Cấu hình Theme động theo Role
  const theme = {
    sidebarBg: isLecturer ? "bg-[#064e3b]" : "bg-[#0f172a]", // Xanh ngọc vs Xanh đen
    activeBg: isLecturer ? "bg-emerald-600" : "bg-blue-600",
    hoverBg: isLecturer ? "hover:bg-emerald-800/50" : "hover:bg-blue-800/50",
    textHighlight: isLecturer ? "text-emerald-400" : "text-blue-400",
    iconColor: isLecturer ? "text-emerald-300" : "text-blue-300",
    portalName: isLecturer ? "Lecturer Portal" : "Student Portal",
    roleName: isLecturer ? "Giảng viên" : "Sinh viên",
    basePath: isLecturer ? "/lecturer" : "/student",
  };

  useEffect(() => {
    const storedName =
      localStorage.getItem("fullName") || localStorage.getItem("userName");
    if (storedName) setFullName(storedName);
  }, []);

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    // Thực hiện logic xóa token/dữ liệu ở đây
    localStorage.removeItem("token");
    localStorage.removeItem("userRoles");
    localStorage.removeItem("actorType");
    // logout(); // Gọi hàm logout context nếu có

    // Điều hướng về trang Login
    navigate("/login");
  };

  // 3. Menu dùng chung, tự động đổi đường dẫn (basePath) theo Role
  const menuItems = [
    { path: `${theme.basePath}`, icon: "dashboard", label: "Tổng quan" },
    { path: `${theme.basePath}/explore`, icon: "explore", label: "Khám phá" },
    {
      path: `${theme.basePath}/library`,
      icon: "local_library",
      label: "Kho học liệu",
    },
    {
      path: `${theme.basePath}/trending`,
      icon: "trending_up",
      label: "Xu hướng",
    },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Sidebar Động */}
      <aside
        className={`w-64 ${theme.sidebarBg} text-white flex flex-col shadow-xl z-20 transition-colors duration-300`}
      >
        {/* Logo Area */}
        <div className="p-6 flex items-center gap-3 border-b border-white/10">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
            <span
              className={`material-symbols-outlined font-black text-2xl ${isLecturer ? "text-emerald-800" : "text-blue-900"}`}
            >
              science
            </span>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white leading-tight">
              Sci<span className={theme.textHighlight}>Trend</span>
            </h1>
            <p className="text-[10px] text-slate-300 uppercase tracking-widest font-bold">
              {theme.portalName}
            </p>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (location.pathname === `${theme.basePath}/` &&
                item.path === theme.basePath);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                  isActive
                    ? `${theme.activeBg} text-white shadow-md`
                    : `text-slate-300 ${theme.hoverBg} hover:text-white`
                }`}
              >
                <span
                  className={`material-symbols-outlined ${isActive ? "text-white" : theme.iconColor}`}
                >
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-white/10 shrink-0 bg-black/20">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div
              className={`w-10 h-10 rounded-full ${theme.activeBg} text-white flex items-center justify-center font-bold border border-white/20 shrink-0 shadow-sm`}
            >
              {fullName.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">
                {fullName}
              </p>
              <p
                className={`text-xs ${theme.textHighlight} font-medium truncate`}
              >
                {theme.roleName}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowLogoutConfirm(true)} // MỞ MODAL XÁC NHẬN
            className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all font-bold w-full cursor-pointer group"
          >
            <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">
              logout
            </span>
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Khu vực nội dung chính */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 shadow-sm z-10">
          <div className="text-slate-500 font-medium text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">
              calendar_today
            </span>
            {new Date().toLocaleDateString("vi-VN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          {/* === GÓC BÊN PHẢI === (Nơi chúng ta sẽ đặt Quả chuông) */}
          <div className="flex items-center gap-5">
            {/* 1. GẮN QUẢ CHUÔNG VÀO ĐÂY */}
            <NotificationBell />

            {/* Đường kẻ dọc phân cách cho đẹp (Tùy chọn) */}
            <div className="h-6 w-px bg-slate-200 mx-1"></div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8 bg-slate-50/50">
          <Outlet /> {/* Các component con sẽ được render ở đây */}
        </div>
      </main>
      {/* ========================================================= */}
      {/* MODAL XÁC NHẬN ĐĂNG XUẤT                                  */}
      {/* ========================================================= */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          {/* Vùng hộp thoại */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-[90%] max-w-[400px] shadow-2xl animate-scaleIn">
            {/* Tiêu đề & Icon */}
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-rose-600 text-3xl font-bold">
                logout
              </span>
              <h3 className="text-xl font-black text-slate-800">
                Xác nhận đăng xuất
              </h3>
            </div>

            {/* Nội dung tin nhắn */}
            <p className="text-slate-500 font-medium mb-8">
              Bạn có chắc chắn muốn đăng xuất không?
            </p>

            {/* Các nút hành động */}
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
    </div> // Thẻ đóng </div> cuối cùng của Component Layout
  );
};

export default MemberLayout;
