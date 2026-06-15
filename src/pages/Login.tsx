import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// 🌟 Import axiosClient từ file cấu hình trung tâm thay vì thư viện axios gốc
import axiosClient from "../api/axiosClient";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // 🌟 URL NGẮN GỌN: Hệ thống tự động ghép với baseURL 'http://localhost:5225/api' ở file trung tâm
      const response = await axiosClient.post("/Account/login", {
        email: email,
        password: password,
      });

      // Nếu đăng nhập thành công và nhận được token từ .NET Backend
      if (response.data && response.data.token) {
        // Lưu thông tin đăng nhập vào localStorage
        localStorage.setItem("token", response.data.token);

        // Lưu tên user hoặc email dựa theo cấu hình FullName từ database của nhóm bạn
        localStorage.setItem(
          "userName",
          response.data.user?.fullName ||
            response.data.user?.fullName ||
            email.split("@")[0],
        );

        // Chuyển hướng về trang chủ và làm mới nhẹ để Layout lắng nghe trạng thái mới ngay lập tức
        navigate("/");
        window.location.reload();
      }
    } catch (err: any) {
      // Nhận diện lỗi trả về tập trung từ Axios Interceptor
      if (err.response && err.response.data) {
        setError(
          err.response.data.message ||
            "Tài khoản hoặc mật khẩu không chính xác!",
        );
      } else {
        setError(
          "Không thể kết nối đến máy chủ Back-end. Bạn đã chạy lệnh dotnet run chưa?",
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
        minHeight: "60vh",
        backgroundColor: "#f8fafc",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
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
          Đăng nhập
        </h2>
        <p
          style={{
            color: "#64748b",
            marginBottom: "2rem",
            fontSize: "0.875rem",
          }}
        >
          Chào mừng quay trở lại với SciTrend
        </p>

        <form
          onSubmit={handleLogin}
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
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
            {isLoading ? "Đang xử lý..." : "Xác nhận Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
};
