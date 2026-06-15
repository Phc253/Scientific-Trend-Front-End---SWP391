import axios from "axios";

// 1. Tạo một thực thể Axios dùng chung cho toàn bộ hệ thống
const axiosClient = axios.create({
  // Quản lý ĐỊA CHỈ BACK-END tập trung tại đây. Sau này đổi cổng chỉ cần sửa đúng 1 dòng này!
  baseURL: "http://localhost:5225/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Tự động đính kèm Token vào mọi API gửi đi ngầm bên dưới (Request Interceptor)
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      // Tự động thêm Bearer token bảo mật mà các bạn cấu hình trong Swagger lúc nãy
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 3. Quản lý bắt lỗi tập trung (Response Interceptor)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Nếu Back-end trả về 401 (Hết hạn Token / Chưa đăng nhập) -> Tự động sút user ra ngoài
    if (error.response && error.response.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
