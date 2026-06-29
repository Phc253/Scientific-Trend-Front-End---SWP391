import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";

export const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [actorType, setActorType] = useState(""); // Để trống để bắt buộc chọn
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (password !== confirmPassword) {
      setError("Mật khẩu nhập lại không trùng khớp!");
      return;
    }

    setIsLoading(true);
    try {
      const result = await api.register({
        email,
        password,
        fullName: fullName.trim(),
        dateOfBirth,
        phoneNumber,
        actorType,
      });

      setSuccessMessage(
        result.message || "Đăng ký thành công! Đang chuyển hướng...",
      );
      setTimeout(() => navigate("/login"), 3000);
    } catch (err: any) {
      setError(
        err.message || "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (successMessage) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center animate-fadeIn py-6">
        <div className="bg-white p-8 rounded-lg border border-[#ebeef0] shadow-md w-full max-w-md text-center">
          <h2 className="text-2xl font-bold text-[#002045] mb-4">
            Đăng ký thành công!
          </h2>
          <p className="text-sm text-[#43474e] mb-6">{successMessage}</p>
          <Link
            to="/login"
            className="bg-[#002855] text-white py-2.5 px-6 rounded text-sm font-semibold"
          >
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center animate-fadeIn py-6 bg-[#f8fafc]">
      <div className="bg-white p-8 rounded-lg border border-[#ebeef0] shadow-md w-full max-w-2xl space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#002045]">
            Đăng ký tài khoản
          </h2>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold">Họ và Tên</label>
              <input
                type="text"
                required
                className="w-full p-3 border rounded"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold">Địa chỉ Email</label>
              <input
                type="email"
                required
                className="w-full p-3 border rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold">Số điện thoại</label>
              <input
                type="tel"
                required
                className="w-full p-3 border rounded"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold">Ngày sinh</label>
              <input
                type="date"
                required
                className="w-full p-3 border rounded"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold">Mật khẩu</label>
              <input
                type="password"
                required
                className="w-full p-3 border rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold">Xác nhận mật khẩu</label>
              <input
                type="password"
                required
                className="w-full p-3 border rounded"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold">Vai trò</label>
            <select
              required
              className="w-full p-3 border rounded"
              value={actorType}
              onChange={(e) => setActorType(e.target.value)}
            >
              <option value="">Chọn vai trò</option>
              <option value="Student">Sinh viên</option>
              <option value="Researcher">Nhà nghiên cứu</option>
              <option value="Lecturer">Giảng viên</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#002855] text-white py-3 rounded font-bold mt-4"
          >
            {isLoading ? "Đang xử lý..." : "Xác nhận tạo tài khoản"}
          </button>
        </form>
      </div>
    </div>
  );
};
