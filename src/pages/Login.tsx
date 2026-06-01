import React, { useState } from "react";
import { Link } from "react-router-dom";

const Login: React.FC = () => {
  // Quản lý trạng thái nhập liệu theo đúng DTO LoginRequest của Back-end
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Dữ liệu đăng nhập gửi lên API:", { email, password });
    // Tuần 4-10: Nhóm sẽ viết hàm fetch() hoặc axios.post() gọi API /api/Account/login tại đây
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center animate-fadeIn">
      <div className="bg-white p-8 rounded-lg border border-[#ebeef0] shadow-md w-full max-w-md space-y-6">
        {/* Tiêu đề trang */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-[#002045]">
            Đăng nhập hệ thống
          </h2>
          <p className="text-xs text-[#74777f]">
            Sử dụng tài khoản học thuật của bạn để tiếp tục
          </p>
        </div>

        {/* Form nhập liệu */}
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
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

          {/* Nút bấm Đăng nhập: Áp dụng đúng mã màu Primary Filled của hệ thống */}
          <button
            type="submit"
            className="w-full bg-[#002045] hover:opacity-95 text-white font-semibold py-3 rounded transition-opacity mt-2 cursor-pointer flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">login</span>
            Xác nhận đăng nhập
          </button>
        </form>

        {/* Liên kết chuyển hướng nhanh */}
        <div className="text-center text-xs text-[#43474e] pt-2 border-t border-[#ebeef0]">
          Chưa có tài khoản nghiên cứu?{" "}
          <Link
            to="/register"
            className="text-[#13696a] font-bold hover:underline"
          >
            Đăng ký ngay tại đây
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
