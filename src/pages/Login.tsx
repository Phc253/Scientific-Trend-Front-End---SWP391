import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
// Thay đổi đường dẫn "../context/AuthContext" cho khớp với cấu trúc thư mục thực tế của nhóm bạn
import { useAuth } from "../context/AuthContext";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Sử dụng AuthContext từ nhánh duc đã được import
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5225/api/account/login",
        {
          email: email,
          password: password,
        },
      );

      if (response.data && response.data.token) {
        // 1. Lưu token và tên người dùng vào localStorage
        localStorage.setItem("fullName", response.data.fullName || "Sinh viên");
        localStorage.setItem("userRoles", JSON.stringify(response.data.roles));
        localStorage.setItem("token", response.data.token);
        navigate("/student");

        // 2. XỬ LÝ LẤY QUYỀN (Đồng bộ cả trường roles và trường actorType từ DB)
        const userRoles =
          response.data.user?.roles || response.data.roles || [];
        const actorType =
          response.data.user?.actorType || response.data.actorType || "";

        // Chuẩn hóa chuỗi lưu vào localStorage để hàm .includes() ở các Layout hoạt động chính xác
        const finalRole = actorType
          ? actorType
          : Array.isArray(userRoles)
            ? userRoles.join(",")
            : userRoles;

        localStorage.setItem("userRoles", finalRole);

        // Gọi hàm login từ AuthContext để cập nhật trạng thái toàn cục (Global State)
        if (login) {
          login(response.data.token, response.data.user);
        }

        // 3. LOGIC ĐIỀU HƯỚNG ROUTE THEO TỪNG ROLE CỤ THỂ
        if (finalRole.includes("Administrator")) {
          navigate("/admin");
        } else if (finalRole.includes("Student")) {
          navigate("/student"); // Đẩy thẳng Sinh viên vào khu vực giao diện riêng (/student)
        } else if (finalRole.includes("Researcher")) {
          navigate("/researcher"); // Đẩy Nhà nghiên cứu vào workspace riêng
        } else if (finalRole.includes("Lecturer")) {
          navigate("/lecturer"); // Đẩy Giảng viên vào không gian riêng
        } else {
          navigate("/"); // Khách hoặc các role khác về trang chủ công cộng
        }
      }
    } catch (err: any) {
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
              disabled={isLoading}
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
              disabled={isLoading}
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

        <p
          style={{
            marginTop: "1.5rem",
            fontSize: "0.875rem",
            color: "#64748b",
          }}
        >
          Chưa có tài khoản?{" "}
          <Link
            to="/register"
            style={{
              color: "#002855",
              fontWeight: "600",
              textDecoration: "underline",
            }}
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
};
