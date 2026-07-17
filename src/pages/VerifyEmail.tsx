import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { api } from "../services/api";

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const hasAttemptedVerification = useRef(false);

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const performVerification = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Mã xác thực không hợp lệ hoặc đã bị thiếu.");
        return;
      }

      if (hasAttemptedVerification.current) {
        return;
      }

      hasAttemptedVerification.current = true;

      try {
        const result = await api.verifyEmail(token);
        setStatus("success");
        setMessage(result.message || "Tài khoản của bạn đã được kích hoạt thành công!");
      } catch (err: any) {
        setStatus("error");
        setMessage(err.message || "Xác thực email thất bại. Liên kết có thể đã hết hạn hoặc không hợp lệ.");
      }
    };

    performVerification();
  }, [token]);

  useEffect(() => {
    if (status !== "success") return;

    return undefined;
  }, [status]);

  return (
    <div className="min-h-[85vh] flex items-center justify-center animate-fadeIn py-12 bg-[#f8fafc]">
      <div className="bg-white p-8 rounded-lg border border-[#ebeef0] shadow-md w-full max-w-md text-center space-y-6">
        
        {status === "loading" && (
          <div className="space-y-4">
            <div className="w-16 h-16 border-4 border-[#13696a] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <h2 className="text-xl font-bold text-[#002045]">Đang xác thực tài khoản</h2>
            <p className="text-sm text-[#74777f]">
              Vui lòng chờ trong giây lát khi hệ thống xác thực email của bạn...
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-6">
            <div className="w-16 h-16 bg-[#e8f5e9] text-[#2e7d32] rounded-full flex items-center justify-center mx-auto border border-[#c8e6c9]">
              <span className="material-symbols-outlined text-4xl">check_circle</span>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-[#002045]">Xác thực thành công!</h2>
              <p className="text-sm text-[#43474e] leading-relaxed">
                {message}
              </p>
            </div>
            <div className="pt-4 border-t border-[#ebeef0] space-y-3">
              <p className="text-sm text-[#43474e]">
                Tài khoản của bạn đã được kích hoạt. Bạn có thể đăng nhập ngay bây giờ.
              </p>
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="w-full bg-[#002045] hover:opacity-95 text-white font-semibold py-2.5 px-6 rounded transition-opacity inline-flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">login</span>
                Đăng nhập ngay
              </button>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="w-full border border-[#cbd5e1] hover:bg-slate-50 text-[#43474e] font-semibold py-2.5 px-6 rounded transition-colors inline-flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">home</span>
                Về trang chủ
              </button>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-6">
            <div className="w-16 h-16 bg-[#ffebee] text-[#c62828] rounded-full flex items-center justify-center mx-auto border border-[#ffcdd2]">
              <span className="material-symbols-outlined text-4xl">error</span>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-[#002045]">Xác thực thất bại</h2>
              <p className="text-sm text-red-600 leading-relaxed">
                {message}
              </p>
            </div>
            <div className="pt-4 border-t border-[#ebeef0] flex flex-col gap-2">
              <Link
                to="/register"
                className="w-full bg-[#13696a] hover:opacity-95 text-white font-semibold py-2.5 px-6 rounded transition-opacity inline-flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">person_add</span>
                Đăng ký tài khoản mới
              </Link>
              <Link
                to="/"
                className="w-full border border-[#cbd5e1] hover:bg-slate-50 text-[#43474e] font-semibold py-2.5 px-6 rounded transition-colors inline-flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">home</span>
                Quay lại Trang chủ
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default VerifyEmail;
