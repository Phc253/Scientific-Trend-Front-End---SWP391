import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// 🌟 Import axiosClient trung tâm thay vì thư viện axios gốc
import axiosClient from "../api/axiosClient";

export const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // 1. Kiểm tra mật khẩu nhập lại có khớp không (Xử lý nhanh ở Front-end)
    if (password !== confirmPassword) {
      setError("Mật khẩu nhập lại không trùng khớp!");
      return;
    }

    setIsLoading(true);

    try {
      // 2. Gọi API Register qua lõi trung tâm (URL ngắn gọn, tự động khớp cấu hình)
      await axiosClient.post("/Account/register", {
        name: name,
        email: email,
        password: password,
      });

      // 3. Xử lý khi đăng ký thành công
      setSuccess(
        "Đăng ký tài khoản thành công! Đang chuyển hướng sang trang đăng nhập...",
      );

      // Chờ 2 giây để user kịp đọc thông báo thành công rồi chuyển sang trang Login
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      // Nhận diện lỗi trả về tập trung từ Backend qua Axios Interceptor
      if (err.response && err.response.data) {
        setError(
          err.response.data.message ||
            "Đăng ký thất bại. Email có thể đã tồn tại!",
        );
      } else {
        setError(
          "Không thể kết nối đến máy chủ Back-end. Hãy chắc chắn .NET đang chạy!",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "75vh",
        backgroundColor: "#f8fafc",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "2.5rem",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "1.75rem",
            fontWeight: "700",
            color: "#0f172a",
            marginBottom: "0.5rem",
          }}
        >
          Đăng ký tài khoản
        </h2>
        <p
          style={{
            color: "#64748b",
            marginBottom: "2rem",
            fontSize: "0.875rem",
          }}
        >
          Tham gia hệ thống nghiên cứu khoa học SciTrend
        </p>

        <form
          onSubmit={handleRegister}
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          {/* Thông báo lỗi */}
          {error && (
            <div
              style={{
                padding: "0.75rem",
                backgroundColor: "#fef2f2",
                color: "#ef4444",
                borderRadius: "6px",
                fontSize: "0.875rem",
                textAlign: "left",
                border: "1px solid #fee2e2",
              }}
            >
              ⚠️ {error}
            </div>
          )}

          {/* Thông báo thành công */}
          {success && (
            <div
              style={{
                padding: "0.75rem",
                backgroundColor: "#f0fdf4",
                color: "#16a34a",
                borderRadius: "6px",
                fontSize: "0.875rem",
                textAlign: "left",
                border: "1px solid #dcfce7",
              }}
            >
              ✅ {success}
            </div>
          )}

          <div style={{ textAlign: "left" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#334155",
              }}
            >
              Họ và tên
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nguyễn Văn A"
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                fontSize: "0.95rem",
                boxSizing: "border-box",
                outline: "none",
              }}
            />
          </div>

          <div style={{ textAlign: "left" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#334155",
              }}
            >
              Địa chỉ Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@university.edu.vn"
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                fontSize: "0.95rem",
                boxSizing: "border-box",
                outline: "none",
              }}
            />
          </div>

          <div style={{ textAlign: "left" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#334155",
              }}
            >
              Mật khẩu
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                fontSize: "0.95rem",
                boxSizing: "border-box",
                outline: "none",
              }}
            />
          </div>

          <div style={{ textAlign: "left" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#334155",
              }}
            >
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                fontSize: "0.95rem",
                boxSizing: "border-box",
                outline: "none",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "0.75rem",
              backgroundColor: "#002855",
              color: "#ffffff",
              border: "none",
              borderRadius: "6px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "background-color 0.2s",
              marginTop: "0.5rem",
            }}
          >
            {isLoading ? "Đang đăng ký..." : "Xác nhận Đăng ký"}
          </button>
        </form>
      </div>
    </div>
  );
};
