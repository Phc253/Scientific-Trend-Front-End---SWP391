import React, { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";

export const Register = () => {
  // 1. Lấy ngày hôm nay theo định dạng YYYY-MM-DD để làm mốc chặn ngày ở tương lai
  const today = new Date().toISOString().split("T")[0];

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [actorType, setActorType] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [registrationState, setRegistrationState] = useState<
    "idle" | "pending"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setRegistrationState("idle");

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

      setRegistrationState("pending");
      setSuccessMessage(
        result.message ||
          "Đăng ký đã được ghi nhận. Vui lòng mở email và nhấn liên kết xác thực để kích hoạt tài khoản.",
      );
    } catch (err: any) {
      const isMailRelatedError = /mail|smtp|email|verify/i.test(
        err?.message?.toLowerCase() || "",
      );

      setRegistrationState("pending");
      setSuccessMessage(
        isMailRelatedError
          ? "Tài khoản của bạn có thể đã được tạo trong hệ thống, nhưng email xác thực chưa được gửi đi. Vui lòng kiểm tra hộp thư rác hoặc liên hệ quản trị viên để được hỗ trợ."
          : "Đăng ký chưa hoàn tất. Vui lòng kiểm tra lại thông tin hoặc thử lại sau.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (successMessage) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center animate-fadeIn py-6">
        <div className="bg-white p-8 rounded-lg border border-[#ebeef0] shadow-md w-full max-w-md space-y-6 text-center">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border ${registrationState === "pending" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-[#e1f5fe] text-[#002855] border-[#b2ebf2]"}`}
          >
            <span className="material-symbols-outlined text-3xl">
              {registrationState === "pending" ? "hourglass_top" : "mail"}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-[#002045]">
            {registrationState === "pending"
              ? "Đăng ký đang chờ xác thực"
              : "Đăng ký thành công!"}
          </h2>
          <p className="text-sm text-[#43474e] leading-relaxed whitespace-pre-wrap">
            {successMessage}
          </p>
          <div className="pt-4 border-t border-[#ebeef0] flex flex-col gap-3">
            <p className="text-sm text-[#43474e]">
              Vui lòng mở hộp thư email và bấm liên kết xác thực để kích hoạt
              tài khoản.
            </p>
            <Link
              to="/"
              className="bg-[#002855] hover:opacity-95 text-white font-semibold py-2.5 px-6 rounded transition-opacity inline-flex items-center justify-center gap-2 text-sm"
            >
              <span className="material-symbols-outlined text-sm">home</span>
              Quay về trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center animate-fadeIn py-6 bg-[#f8fafc]">
      {/* Nút Quay về trang chủ */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium text-sm transition-colors"
      >
        <span className="material-symbols-outlined text-xl">arrow_back</span>
        Quay về trang chủ
      </Link>
      <div className="bg-white p-8 rounded-lg border border-[#ebeef0] shadow-md w-full max-w-2xl space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-[#002045]">
            Đăng ký tài khoản mới
          </h2>
          <p className="text-xs text-[#74777f]">
            Tham gia hệ thống nghiên cứu khoa học SciTrend
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block font-bold text-[#43474e]">
                Họ và Tên
              </label>
              <input
                type="text"
                required
                className="w-full p-3 border rounded"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-[#43474e]">
                Địa chỉ Email
              </label>
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
            <div className="space-y-1.5">
              <label className="block font-bold text-[#43474e]">
                Số điện thoại
              </label>
              <input
                type="tel"
                required
                className="w-full p-3 border rounded"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-[#43474e]">
                Ngày sinh
              </label>
              <input
                type="date"
                required
                className="w-full p-3 border rounded"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                // 2. Chặn nhập năm quá khứ xa và chặn nhập ngày tương lai
                min="1900-01-01"
                max={today}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block font-bold text-[#43474e]">Mật khẩu</label>
              <input
                type="password"
                required
                className="w-full p-3 border rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-[#43474e]">
                Xác nhận mật khẩu
              </label>
              <input
                type="password"
                required
                className="w-full p-3 border rounded"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block font-bold text-[#43474e]">
              Đối tượng (Actor Type)
            </label>
            <select
              required
              className="w-full p-3 bg-white border border-[#c4c6cf] rounded focus:outline-none focus:border-[#002855] focus:ring-1 focus:ring-[#002855] transition-all"
              value={actorType}
              onChange={(e) => setActorType(e.target.value)}
              disabled={isLoading}
            >
              <option value="">Chọn vai trò</option>
              <option value="Student">Sinh viên (Student)</option>
              <option value="Lecturer">Giảng viên (Lecturer)</option>
              <option value="Researcher">Nhà nghiên cứu (Researcher)</option>
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
