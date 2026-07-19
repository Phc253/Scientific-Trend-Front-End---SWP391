import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../services/api";

// 1. Mở rộng Interface để hứng mọi trường hợp tên ID từ Backend
export interface NotificationItem {
  id?: string | number;
  Id?: string | number;
  notificationId?: string | number;
  title?: string;
  message: string;
  isRead: boolean;
  createdAt?: string;
  paperId?: string | number;
}

export const NotificationPage = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const resolvedBasePath =
    `/${location.pathname.split("/")[1]}` || "/researcher";

  useEffect(() => {
    const fetchAllNotifications = async () => {
      try {
        setIsLoading(true);
        const response: any = await api.getNotifications(1, 50);

        // 2. Bóc tách dữ liệu an toàn giống hệt NotificationBell
        const data =
          response?.data?.items ||
          response?.items ||
          response?.data ||
          response ||
          [];
        setNotifications(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Lỗi khi tải trang thông báo:", err);
        setError(
          "Không thể tải danh sách thông báo lúc này. Vui lòng thử lại sau.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllNotifications();
  }, []);

  // Bổ sung hàm click để đánh dấu đã đọc ngay trong trang danh sách
  const handleItemClick = async (noti: NotificationItem) => {
    const targetId = noti.id || noti.Id || noti.notificationId;

    if (!targetId) return;

    try {
      if (!noti.isRead) {
        // Cập nhật UI ngay lập tức
        setNotifications((prev) =>
          prev.map((n) =>
            (n.id || n.Id || n.notificationId) === targetId
              ? { ...n, isRead: true }
              : n,
          ),
        );
        // Gọi API ngầm
        await api
          .markNotificationAsRead(targetId)
          .catch((err) => console.error(err));
      }

      // Nếu có paperId thì chuyển hướng đến bài báo
      if (noti.paperId) {
        navigate(`${resolvedBasePath}/paper/${noti.paperId}`);
      }
    } catch (error) {
      console.error("Lỗi khi click thông báo:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 px-4 animate-fadeIn">
      <div className="max-w-3xl mx-auto">
        {/* Header của trang */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-slate-200 rounded-full transition-colors flex items-center justify-center text-slate-500 cursor-pointer"
              title="Quay lại"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="text-2xl font-bold text-[#002045]">
              Tất cả thông báo
            </h1>
          </div>
        </div>

        {/* Nội dung chính */}
        <div className="bg-white border border-[#ebeef0] rounded-lg shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <span className="material-symbols-outlined animate-spin text-4xl mb-2">
                progress_activity
              </span>
              <p>Đang tải dữ liệu...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-500 bg-red-50">
              <span className="material-symbols-outlined text-4xl mb-2">
                error
              </span>
              <p>{error}</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-3xl">
                  notifications_off
                </span>
              </div>
              <p className="text-[#43474e]">Bạn chưa có thông báo nào.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#ebeef0]">
              {notifications.map((noti, index) => {
                // 3. Xử lý key an toàn tuyệt đối
                const targetId =
                  noti.id ||
                  noti.Id ||
                  noti.notificationId ||
                  `fallback-key-${index}`;

                return (
                  <div
                    key={targetId}
                    onClick={() => handleItemClick(noti)}
                    className={`p-5 flex gap-4 transition-colors cursor-pointer hover:bg-slate-50 ${
                      !noti.isRead ? "bg-[#f0f7ff]" : ""
                    }`}
                  >
                    <div
                      className={`mt-1 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        !noti.isRead
                          ? "bg-[#002855] text-white"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      <span className="material-symbols-outlined text-xl">
                        {noti.isRead ? "notifications" : "notifications_active"}
                      </span>
                    </div>
                    <div className="flex-1">
                      {noti.title && (
                        <h3
                          className={`mb-1 ${!noti.isRead ? "font-bold text-[#002045]" : "font-semibold text-slate-700"}`}
                        >
                          {noti.title}
                        </h3>
                      )}
                      <p
                        className={`text-sm ${!noti.isRead ? "text-[#43474e]" : "text-slate-500"}`}
                      >
                        {noti.message}
                      </p>
                      {noti.createdAt && (
                        <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">
                            schedule
                          </span>
                          {new Date(noti.createdAt).toLocaleString("vi-VN")}
                        </p>
                      )}
                    </div>
                    {!noti.isRead && (
                      <div
                        className="w-2.5 h-2.5 bg-blue-600 rounded-full flex-shrink-0 mt-2"
                        title="Chưa đọc"
                      ></div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
