import React, { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";

export const ForgotPassword = () => {
  const [step, setStep] = useState<"request" | "verify" | "success">("request");
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSendPin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    setMessage(null);

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setError("Vui lòng nhập địa chỉ email.");
      return;
    }

    setEmail(normalizedEmail);
    setIsLoading(true);
    try {
      const result = await api.forgotPassword(normalizedEmail);
      const successMessage = result.message || "Nếu email của bạn hợp lệ, hệ thống sẽ gửi mã PIN về hộp thư của bạn.";
      setMessage(successMessage);
      setStep("verify");
    } catch (err: unknown) {
      const messageText = err instanceof Error ? err.message : "Không thể gửi mã PIN lúc này.";
      setError(messageText);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!pin.trim()) {
      setError("Vui lòng nhập mã PIN 6 chữ số.");
      return;
    }

    if (!/^\d{6}$/.test(pin.trim())) {
      setError("Mã PIN phải gồm đúng 6 chữ số.");
      return;
    }

    if (!newPassword.trim()) {
      setError("Vui lòng nhập mật khẩu mới.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await api.resetPassword(email.trim(), pin.trim(), newPassword);
      setMessage(result.message || "Đổi mật khẩu thành công.");
      setStep("success");
    } catch (err: unknown) {
      const messageText = err instanceof Error ? err.message : "Không thể đổi mật khẩu lúc này.";
      setError(messageText);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4 py-8">
      <Link
        to="/login"
        className="absolute top-6 left-6 flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium text-sm transition-colors"
      >
        <span className="material-symbols-outlined text-xl">arrow_back</span>
        Quay lại đăng nhập
      </Link>

      <div className="w-full max-w-md rounded-2xl border border-[#ebeef0] bg-white p-8 shadow-sm">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-[#002045]">
            {step === "request" && "Quên mật khẩu"}
            {step === "verify" && "Nhập mã PIN và mật khẩu mới"}
            {step === "success" && "Đổi mật khẩu thành công"}
          </h2>
          <p className="text-sm text-[#64748b]">
            {step === "request" && "Nhập email để nhận mã PIN xác thực qua Gmail."}
            {step === "verify" && "Mã PIN đã được gửi tới email của bạn. Vui lòng nhập mã và đặt mật khẩu mới."}
            {step === "success" && "Bạn có thể đăng nhập bằng mật khẩu mới ngay bây giờ."}
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {message && (
          <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 whitespace-pre-line">
            {message}
          </div>
        )}

        {step === "request" && (
          <form onSubmit={handleSendPin} className="mt-6 space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#334155]">Địa chỉ email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                placeholder="name@example.com"
                required
                className="w-full rounded-lg border border-[#cbd5e1] px-3 py-2.5 text-sm outline-none focus:border-[#002855]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-[#002855] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? "Đang gửi..." : "Gửi mã PIN"}
            </button>
          </form>
        )}

        {step === "verify" && (
          <form onSubmit={handleResetPassword} className="mt-6 space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#334155]">Email</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full rounded-lg border border-[#e2e8f0] bg-slate-50 px-3 py-2.5 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#334155]">Mã PIN 6 chữ số</label>
              <input
                type="text"
                inputMode="numeric"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                disabled={isLoading}
                placeholder="123456"
                maxLength={6}
                className="w-full rounded-lg border border-[#cbd5e1] px-3 py-2.5 text-sm outline-none focus:border-[#002855]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#334155]">Mật khẩu mới</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isLoading}
                placeholder="Ít nhất 6 ký tự"
                className="w-full rounded-lg border border-[#cbd5e1] px-3 py-2.5 text-sm outline-none focus:border-[#002855]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#334155]">Xác nhận mật khẩu mới</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                placeholder="Nhập lại mật khẩu mới"
                className="w-full rounded-lg border border-[#cbd5e1] px-3 py-2.5 text-sm outline-none focus:border-[#002855]"
              />
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-[#002855] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? "Đang xử lý..." : "Đổi mật khẩu"}
              </button>
              <button
                type="button"
                onClick={() => handleSendPin()}
                disabled={isLoading}
                className="w-full rounded-lg border border-[#cbd5e1] px-4 py-2.5 text-sm font-semibold text-[#334155] transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? "Đang gửi..." : "Gửi lại mã PIN"}
              </button>
            </div>
          </form>
        )}

        {step === "success" && (
          <div className="mt-6 space-y-4 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <span className="material-symbols-outlined text-3xl">check_circle</span>
            </div>
            <p className="text-sm text-[#334155]">{message}</p>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-lg bg-[#002855] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-95"
            >
              Đi đến trang đăng nhập
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
