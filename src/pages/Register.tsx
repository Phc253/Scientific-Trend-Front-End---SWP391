import React, { useState } from "react";
import { Link } from "react-router-dom";

const Register: React.FC = () => {
  // Quản lý trạng thái dữ liệu nhập vào theo đúng cấu trúc RegisterRequest của Back-end
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Dữ liệu đăng ký gửi lên API:", { username, email, password });
    // Tuần 4-10: Nhóm sẽ viết hàm fetch() hoặc axios.post() gọi API /api/Account/register tại đây
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center animate-fadeIn">
      <div className="bg-white p-8 rounded-lg border border-[#ebeef0] shadow-md w-full max-w-md space-y-6">
        {/* Tiêu đề trang */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-[#002045]">
            Đăng ký tài khoản
          </h2>
          <p className="text-xs text-[#74777f]">
            Tạo tài khoản mới để lưu trữ bài báo và theo dõi xu hướng
          </p>
        </div>

        {/* Form nhập liệu */}
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          {/* Ô nhập Tên tài khoản */}
          <div className="space-y-1.5">
            <label className="block font-bold text-[#43474e]">
              Tên người dùng (Username)
            </label>
            <input
              type="text"
              required
              placeholder="nhap_username_cua_ban"
              className="w-full p-3 bg-[#f1f4f6] border border-[#c4c6cf] rounded focus:outline-none focus:border-[#13696a] focus:ring-1 focus:ring-[#13696a] transition-all"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Ô nhập Email */}
          <div className="space-y-1.5">
            <label className="block font-bold text-[#43474e]">
              Địa chỉ Email
            </label>
            <input
              type="email"
              required
              placeholder="name@fpt.edu.vn"
              className="w-full p-3 bg-[#f1f4f6] border border-[#c4c6cf] rounded focus:outline-none focus:border-[#13696a] focus:ring-1 focus:ring-[#13696a] transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Ô nhập Mật khẩu */}
          <div className="space-y-1.5">
            <label className="block font-bold text-[#43474e]">Mật khẩu</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full p-3 bg-[#f1f4f6] border border-[#c4c6cf] rounded focus:outline-none focus:border-[#13696a] focus:ring-1 focus:ring-[#13696a] transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Nút bấm xác nhận Đăng ký */}
          <button
            type="submit"
            className="w-full bg-[#13696a] hover:opacity-95 text-white font-semibold py-3 rounded transition-opacity mt-2 cursor-pointer flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">
              person_add
            </span>
            Xác nhận tạo tài khoản
          </button>
        </form>

        {/* Liên kết chuyển đổi nhanh sang đăng nhập */}
        <div className="text-center text-xs text-[#43474e] pt-2 border-t border-[#ebeef0]">
          Đã có tài khoản hệ thống từ trước?{" "}
          <Link
            to="/login"
            className="text-[#002045] font-bold hover:underline"
          >
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
