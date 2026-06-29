import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  // 1. Tạo state để lưu trữ tên người dùng đọc từ máy
  const [userName, setUserName] = useState<string | null>(null);

  // 2. Chạy useEffect quét thông tin ngay khi Layout được tải lên màn hình
  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    }
  }, [location]); // Theo dõi sự thay đổi của URL để cập nhật lại trạng thái nếu cần

  // 3. Hàm xử lý sự kiện Đăng xuất tài khoản
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/Account/logout",
        {},
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        },
      );
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      localStorage.removeItem("userRoles");
      setUserName(null);
      // Chuyển hướng hoặc tải lại trang nhẹ để làm sạch trạng thái
      window.location.href = "/login";
    }
  };

  // Định nghĩa danh sách các mục trên thanh Menu điều hướng trái
  const role = localStorage.getItem("userRoles") || "";
  const isAdmin = role.includes("Administrator");

  const menuItems = [
    ...(!isAdmin
      ? [
          { path: "/", label: "Trang chủ", icon: "home" },
          { path: "/search", label: "Khám phá", icon: "explore" },
          { path: "/dashboard", label: "Xu hướng", icon: "trending_up" },
        ]
      : []),

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
      {/* Sidebar - Thanh điều hướng cố định bên trái */}
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

        {/* Thông tin tài khoản người dùng đăng nhập ở góc dưới cùng Sidebar */}
        <div className="p-4 border-t border-[#ebeef0] space-y-3">
          <div className="flex items-center gap-3 px-2 py-1">
            {/* Avatar thay đổi màu nền dựa trên trạng thái đăng nhập */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                userName
                  ? "bg-[#a2eded] text-[#1a6d6e] border-[#1a6d6e]"
                  : "bg-[#f1f4f6] text-[#43474e] border-[#c4c6cf]"
              }`}
            >
              <span className="material-symbols-outlined text-xl">
                {userName ? "face" : "account_circle"}
              </span>
            </div>
            <div>
              {/* Hiển thị Tên người dùng động từ DB hoặc hiển thị chữ Guest mặc định */}
              <p className="text-sm font-bold text-[#181c1e] truncate max-w-[140px]">
                {userName ? userName : "Guest"}
              </p>
              <p className="text-xs text-[#74777f]">
                {userName ? "Thành viên" : "Chưa đăng nhập"}
              </p>
            </div>
          </div>

          {/* Logic ẩn hiện nút Đăng nhập / Đăng xuất */}
          {userName ? (
            <div className="flex flex-col gap-2 pt-1">
              <button
                onClick={handleLogout}
                className="w-full bg-[#ef4444] hover:bg-[#dc2626] text-white text-xs font-semibold py-2.5 px-4 rounded flex items-center justify-center gap-2 transition-all duration-200"
              >
                <span className="material-symbols-outlined text-sm">
                  logout
                </span>
                Đăng xuất
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 pt-1">
              <Link
                to="/login"
                className="w-full bg-[#002045] hover:opacity-90 text-white text-xs font-semibold py-2.5 px-4 rounded flex items-center justify-center gap-2 transition-all duration-200"
              >
                <span className="material-symbols-outlined text-sm">login</span>
                Đăng nhập
              </Link>

              <Link
                to="/register"
                className="w-full border border-[#002045] text-[#002045] hover:bg-[#f1f4f6] text-xs font-semibold py-2.5 px-4 rounded flex items-center justify-center gap-2 transition-all duration-200"
              >
                <span className="material-symbols-outlined text-sm">
                  person_add
                </span>
                Đăng ký tài khoản
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* Vùng nội dung hiển thị ở bên phải Sidebar */}
      <div className="flex-1 pl-64 flex flex-col min-h-screen">
        {/* Top Navbar - Thanh tiêu đề phía trên */}
        <header className="h-16 bg-white border-b border-[#ebeef0] flex items-center justify-between px-8 sticky top-0 z-20">
          <div className="text-sm font-medium text-[#43474e]">
            Hệ thống theo dõi xu hướng công bố khoa học
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-[#43474e] hover:bg-[#f1f4f6] rounded-full flex items-center">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="p-2 text-[#43474e] hover:bg-[#f1f4f6] rounded-full flex items-center">
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>
        </header>

        {/* Dynamic Page Content - Nơi chứa ruột nội dung thay đổi của từng trang */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
