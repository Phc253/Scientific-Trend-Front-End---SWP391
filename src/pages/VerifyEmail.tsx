import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../services/api";

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Đang xác thực tài khoản...");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Liên kết xác thực không hợp lệ. Vui lòng kiểm tra lại đường dẫn.");
      return;
    }

    let isMounted = true;

    const verifyAccount = async () => {
      try {
        const response = await api.verifyEmail(token);
        if (!isMounted) {
          return;
        }

        setStatus("success");
        const successMessage = response?.message || "Tài khoản đã được xác thực và kích hoạt thành công.";
        setMessage(successMessage);
      } catch (err: unknown) {
        if (!isMounted) {
          return;
        }

        setStatus("error");
        setMessage(
          err instanceof Error
            ? err.message
            : "Không thể xác thực tài khoản. Liên kết có thể đã hết hạn hoặc không hợp lệ.",
        );
      }
    };

    void verifyAccount();

    return () => {
      isMounted = false;
    };
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-[#ebeef0] bg-white p-8 shadow-sm text-center">
        <div className="mb-4 flex justify-center">
          <span className="material-symbols-outlined text-5xl text-[#13696a]">
            {status === "success" ? "check_circle" : status === "error" ? "error" : "hourglass_top"}
          </span>
        </div>

        <h1 className="text-2xl font-bold text-[#002045]">
          {status === "success"
            ? "Xác thực thành công"
            : status === "error"
              ? "Xác thực thất bại"
              : "Đang xác thực"}
        </h1>

        <p className="mt-3 text-sm leading-6 text-[#74777f]">{message}</p>

        {status === "success" && (
          <div className="mt-6 space-y-3">
            <p className="text-sm text-[#43474e]">
              Bạn có thể đăng nhập ngay để bắt đầu sử dụng tài khoản.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-lg bg-[#13696a] px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-95"
            >
              Đến trang đăng nhập
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="mt-6 space-y-3">
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-lg bg-[#002045] px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-95"
            >
              Quay lại đăng nhập
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
