import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  // Định nghĩa danh sách các mục trên thanh Menu điều hướng trái
  const menuItems = [
    { path: "/", label: "Trang chủ", icon: "home" },
    { path: "/search", label: "Khám phá", icon: "explore" },
    { path: "/dashboard", label: "Xu hướng", icon: "trending_up" },
  ];

  // Nếu đã đăng nhập, thêm mục Thư viện của tôi vào Menu
  if (isAuthenticated) {
    menuItems.push({ path: "/library", label: "Thư viện của tôi", icon: "bookmarks" });
  }

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
            // Kiểm tra xem trang hiện tại có trùng với menu không để làm sáng nút lên
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
          {isAuthenticated && user ? (
            <>
              <div className="flex items-center gap-3 px-2 py-1">
                {/* Avatar mặc định chứa chữ cái đầu của tên */}
                <div className="w-10 h-10 rounded-full bg-[#13696a] text-white flex items-center justify-center border border-[#13696a] font-bold text-lg">
                  {(() => {
                    const name = user.fullName || (user as any).FullName || user.email || (user as any).Email || "";
                    return name ? name.charAt(0).toUpperCase() : "?";
                  })()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#181c1e] truncate">
                    {user.fullName || (user as any).FullName || user.email || (user as any).Email || "User"}
                  </p>
                  <p className="text-xs text-[#74777f] capitalize truncate">
                    {user.actorType || (user as any).ActorType || "Member"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-1">
                {/* Nút Đăng xuất */}
                <button
                  onClick={logout}
                  className="w-full bg-[#ebeef0] hover:bg-red-50 hover:text-red-700 text-[#43474e] text-xs font-semibold py-2.5 px-4 rounded flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">logout</span>
                  Đăng xuất
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 px-2 py-1">
                {/* Avatar mặc định cho khách (Guest Icon) */}
                <div className="w-10 h-10 rounded-full bg-[#f1f4f6] text-[#43474e] flex items-center justify-center border border-[#c4c6cf]">
                  <span className="material-symbols-outlined text-xl">
                    account_circle
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#181c1e]">Guest</p>
                  <p className="text-xs text-[#74777f]">Chưa đăng nhập</p>
                </div>
              </div>

              {/* Các nút điều hướng Đăng nhập & Đăng ký sử dụng đúng hệ màu thương hiệu */}
              <div className="flex flex-col gap-2 pt-1">
                {/* Nút Đăng nhập: Đậm màu chủ đạo (Primary Filled Button) */}
                <Link
                  to="/login"
                  className="w-full bg-[#002045] hover:opacity-90 text-white text-xs font-semibold py-2.5 px-4 rounded flex items-center justify-center gap-2 transition-all duration-200"
                >
                  <span className="material-symbols-outlined text-sm">login</span>
                  Đăng nhập
                </Link>

                {/* Nút Đăng ký: Đường viền mảnh (Secondary Outlined Button) */}
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
            </>
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
