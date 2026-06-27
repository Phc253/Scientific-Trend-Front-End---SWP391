import React, { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [actorType, setActorType] = useState("Student");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    // Simple birth date check
    if (!dateOfBirth) {
      setError("Vui lòng chọn ngày sinh.");
      setIsLoading(false);
      return;
    }

    try {
      const result = await api.register({
        email,
        password,
        fullName: fullName.trim() || undefined,
        dateOfBirth,
        phoneNumber,
        actorType,
      });

      setSuccessMessage(
        result.message ||
          "Đăng ký tài khoản thành công! Vui lòng kiểm tra email của bạn để kích hoạt tài khoản."
      );
    } catch (err: any) {
      setError(err.message || "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin đăng ký.");
    } finally {
      setIsLoading(false);
    }
  };

  if (successMessage) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center animate-fadeIn">
        <div className="bg-white p-8 rounded-lg border border-[#ebeef0] shadow-md w-full max-w-md space-y-6 text-center">
          <div className="w-16 h-16 bg-[#e1f5fe] text-[#13696a] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#b2ebf2]">
            <span className="material-symbols-outlined text-3xl">mail</span>
          </div>
          <h2 className="text-2xl font-bold text-[#002045]">Đăng ký thành công!</h2>
          <p className="text-sm text-[#43474e] leading-relaxed">
            {successMessage}
          </p>
          <div className="pt-4 border-t border-[#ebeef0]">
            <Link
              to="/login"
              className="bg-[#002045] hover:opacity-95 text-white font-semibold py-2.5 px-6 rounded transition-opacity inline-flex items-center gap-2 text-sm"
            >
              <span className="material-symbols-outlined text-sm">login</span>
              Đi đến trang Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center animate-fadeIn py-6">
      <div className="bg-white p-8 rounded-lg border border-[#ebeef0] shadow-md w-full max-w-xl space-y-6">
        {/* Tiêu đề trang */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-[#002045]">
            Đăng ký tài khoản mới
          </h2>
          <p className="text-xs text-[#74777f]">
            Tạo tài khoản để theo dõi xu hướng, lưu trữ bài viết khoa học và theo dõi tác giả
          </p>
        </div>

        {/* Thông báo lỗi nếu có */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-red-600">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form nhập liệu */}
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Họ và Tên */}
            <div className="space-y-1.5">
              <label className="block font-bold text-[#43474e]">Họ và Tên</label>
              <input
                type="text"
                required
                placeholder="Nguyễn Văn A"
                className="w-full p-3 bg-[#f1f4f6] border border-[#c4c6cf] rounded focus:outline-none focus:border-[#13696a] focus:ring-1 focus:ring-[#13696a] transition-all"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* Đối tượng nghiên cứu (Actor Type) */}
            <div className="space-y-1.5">
              <label className="block font-bold text-[#43474e]">
                Đối tượng (Actor Type)
              </label>
              <select
                className="w-full p-3 bg-[#f1f4f6] border border-[#c4c6cf] rounded focus:outline-none focus:border-[#13696a] focus:ring-1 focus:ring-[#13696a] transition-all"
                value={actorType}
                onChange={(e) => setActorType(e.target.value)}
                disabled={isLoading}
              >
                <option value="Student">Sinh viên (Student)</option>
                <option value="Lecturer">Giảng viên (Lecturer)</option>
                <option value="Researcher">Nhà nghiên cứu (Researcher)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Địa chỉ Email */}
            <div className="space-y-1.5">
              <label className="block font-bold text-[#43474e]">Địa chỉ Email</label>
              <input
                type="email"
                required
                placeholder="name@fpt.edu.vn"
                className="w-full p-3 bg-[#f1f4f6] border border-[#c4c6cf] rounded focus:outline-none focus:border-[#13696a] focus:ring-1 focus:ring-[#13696a] transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* Số điện thoại */}
            <div className="space-y-1.5">
              <label className="block font-bold text-[#43474e]">Số điện thoại</label>
              <input
                type="tel"
                required
                placeholder="0912345678"
                className="w-full p-3 bg-[#f1f4f6] border border-[#c4c6cf] rounded focus:outline-none focus:border-[#13696a] focus:ring-1 focus:ring-[#13696a] transition-all"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Ngày sinh */}
            <div className="space-y-1.5">
              <label className="block font-bold text-[#43474e]">Ngày sinh</label>
              <input
                type="date"
                required
                className="w-full p-3 bg-[#f1f4f6] border border-[#c4c6cf] rounded focus:outline-none focus:border-[#13696a] focus:ring-1 focus:ring-[#13696a] transition-all"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* Mật khẩu */}
            <div className="space-y-1.5">
              <label className="block font-bold text-[#43474e]">Mật khẩu</label>
              <input
                type="password"
                required
                placeholder="Tối thiểu 6 ký tự"
                className="w-full p-3 bg-[#f1f4f6] border border-[#c4c6cf] rounded focus:outline-none focus:border-[#13696a] focus:ring-1 focus:ring-[#13696a] transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Nút bấm xác nhận Đăng ký */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-[#13696a] hover:opacity-95 text-white font-semibold py-3 rounded transition-opacity mt-4 cursor-pointer flex items-center justify-center gap-2 ${
              isLoading ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            <span className="material-symbols-outlined text-sm">
              {isLoading ? "sync" : "person_add"}
            </span>
            {isLoading ? "Đang xử lý..." : "Xác nhận tạo tài khoản"}
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
