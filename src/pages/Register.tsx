import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";

export const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [actorType, setActorType] = useState("Student");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    if (password !== confirmPassword) {
      setError("Mật khẩu nhập lại không trùng khớp!");
      setIsLoading(false);
      return;
    }

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
          "Đăng ký tài khoản thành công! Đang chuyển hướng sang trang đăng nhập..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin đăng ký.");
    } finally {
      setIsLoading(false);
    }
  };

  if (successMessage) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center animate-fadeIn py-6">
        <div className="bg-white p-8 rounded-lg border border-[#ebeef0] shadow-md w-full max-w-md space-y-6 text-center">
          <div className="w-16 h-16 bg-[#e1f5fe] text-[#002855] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#b2ebf2]">
            <span className="material-symbols-outlined text-3xl">mail</span>
          </div>
          <h2 className="text-2xl font-bold text-[#002045]">Đăng ký thành công!</h2>
          <p className="text-sm text-[#43474e] leading-relaxed">{successMessage}</p>
          <div className="pt-4 border-t border-[#ebeef0]">
            <Link
              to="/login"
              className="bg-[#002855] hover:opacity-95 text-white font-semibold py-2.5 px-6 rounded transition-opacity inline-flex items-center gap-2 text-sm"
            >
              <span className="material-symbols-outlined text-sm">login</span>
              Đi đến trang Đăng nhập ngay
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center animate-fadeIn py-6 bg-[#f8fafc]">
      <div className="bg-white p-8 rounded-lg border border-[#ebeef0] shadow-md w-full max-w-2xl space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-[#002045]">Đăng ký tài khoản mới</h2>
          <p className="text-xs text-[#74777f]">
            Tham gia hệ thống nghiên cứu khoa học SciTrend
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-red-600">error</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block font-bold text-[#43474e]">Họ và Tên</label>
              <input
                type="text"
                required
                placeholder="Nguyễn Văn A"
                className="w-full p-3 bg-white border border-[#c4c6cf] rounded focus:outline-none focus:border-[#002855] focus:ring-1 focus:ring-[#002855] transition-all"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-[#43474e]">Địa chỉ Email</label>
              <input
                type="email"
                required
                placeholder="name@fpt.edu.vn"
                className="w-full p-3 bg-white border border-[#c4c6cf] rounded focus:outline-none focus:border-[#002855] focus:ring-1 focus:ring-[#002855] transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block font-bold text-[#43474e]">Số điện thoại</label>
              <input
                type="tel"
                required
                placeholder="0912345678"
                className="w-full p-3 bg-white border border-[#c4c6cf] rounded focus:outline-none focus:border-[#002855] focus:ring-1 focus:ring-[#002855] transition-all"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-[#43474e]">Ngày sinh</label>
              <input
                type="date"
                required
                className="w-full p-3 bg-white border border-[#c4c6cf] rounded focus:outline-none focus:border-[#002855] focus:ring-1 focus:ring-[#002855] transition-all"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block font-bold text-[#43474e]">Mật khẩu</label>
              <input
                type="password"
                required
                placeholder="Tối thiểu 6 ký tự"
                className="w-full p-3 bg-white border border-[#c4c6cf] rounded focus:outline-none focus:border-[#002855] focus:ring-1 focus:ring-[#002855] transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-[#43474e]">Xác nhận mật khẩu</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full p-3 bg-white border border-[#c4c6cf] rounded focus:outline-none focus:border-[#002855] focus:ring-1 focus:ring-[#002855] transition-all"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block font-bold text-[#43474e]">Đối tượng (Actor Type)</label>
            <select
              className="w-full p-3 bg-white border border-[#c4c6cf] rounded focus:outline-none focus:border-[#002855] focus:ring-1 focus:ring-[#002855] transition-all"
              value={actorType}
              onChange={(e) => setActorType(e.target.value)}
              disabled={isLoading}
            >
              <option value="Student">Sinh viên (Student)</option>
              <option value="Lecturer">Giảng viên (Lecturer)</option>
              <option value="Researcher">Nhà nghiên cứu (Researcher)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-[#002855] hover:opacity-95 text-white font-semibold py-3 rounded transition-opacity mt-4 cursor-pointer flex items-center justify-center gap-2 ${
              isLoading ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            <span className="material-symbols-outlined text-sm">
              {isLoading ? "sync" : "person_add"}
            </span>
            {isLoading ? "Đang xử lý..." : "Xác nhận tạo tài khoản"}
          </button>
        </form>

        <div className="text-center text-xs text-[#43474e] pt-2 border-t border-[#ebeef0]">
          Đã có tài khoản hệ thống từ trước?{" "}
          <Link to="/login" className="text-[#002045] font-bold hover:underline">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
};
