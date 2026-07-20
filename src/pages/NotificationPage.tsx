import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../services/api";

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

  const hasUnread = notifications.some((n) => !n.isRead);

  // 1. FETCH DATA
  useEffect(() => {
    const fetchAllNotifications = async () => {
      try {
        setIsLoading(true);
        const response: any = await api.getNotifications(1, 50);

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

  // 2. LẮNG NGHE TÍN HIỆU TỪ QUẢ CHUÔNG (ĐỒNG BỘ 2 CHIỀU)
  useEffect(() => {
    const handleSyncAll = () => {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    };

    const handleSyncSingle = (e: any) => {
      const readId = e.detail;
      setNotifications((prev) =>
        prev.map((n) =>
          (n.id || n.Id || n.notificationId) === readId
            ? { ...n, isRead: true }
            : n,
        ),
      );
    };

    // Tần số này đã khớp hoàn toàn với Quả chuông
    window.addEventListener("syncReadAll", handleSyncAll);
    window.addEventListener("syncReadSingle", handleSyncSingle);

    return () => {
      window.removeEventListener("syncReadAll", handleSyncAll);
      window.removeEventListener("syncReadSingle", handleSyncSingle);
    };
  }, []);

  // 3. XỬ LÝ CLICK 1 ITEM & PHÁT TÍN HIỆU CHO QUẢ CHUÔNG
  const handleItemClick = async (noti: NotificationItem) => {
    const targetId = noti.id || noti.Id || noti.notificationId;
    if (!targetId) return;

    try {
      if (!noti.isRead) {
        // Cập nhật UI
        setNotifications((prev) =>
          prev.map((n) =>
            (n.id || n.Id || n.notificationId) === targetId
              ? { ...n, isRead: true }
              : n,
          ),
        );
        // Gọi API
        await api
          .markNotificationAsRead(targetId)
          .catch((err) => console.error(err));

        // Phát tín hiệu giảm số đếm ở quả chuông
        window.dispatchEvent(
          new CustomEvent("syncReadSingle", { detail: targetId }),
        );
      }

      if (noti.paperId) {
        navigate(`${resolvedBasePath}/paper/${noti.paperId}`);
      }
    } catch (error) {
      console.error("Lỗi khi click thông báo:", error);
    }
  };

  // 4. XỬ LÝ ĐÁNH DẤU TẤT CẢ & PHÁT TÍN HIỆU CHO QUẢ CHUÔNG
  const handleMarkAllAsRead = async () => {
    try {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      await api.markAllAsRead().catch((err) => console.error(err));

      // Phát tín hiệu tắt chấm đỏ ở quả chuông
      window.dispatchEvent(new Event("syncReadAll"));
    } catch (error) {
      console.error("Lỗi khi đánh dấu đọc tất cả:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 px-4 animate-fadeIn">
      <div className="max-w-3xl mx-auto">
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

          {hasUnread && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-sm font-semibold text-[#13696a] hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">
                done_all
              </span>
              Đánh dấu đã đọc tất cả
            </button>
          )}
        </div>

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
                          className={`mb-1 ${
                            !noti.isRead
                              ? "font-bold text-[#002045]"
                              : "font-semibold text-slate-700"
                          }`}
                        >
                          {noti.title}
                        </h3>
                      )}
                      <p
                        className={`text-sm ${
                          !noti.isRead ? "text-[#43474e]" : "text-slate-500"
                        }`}
                      >
                        {noti.message}
                      </p>
                      {noti.createdAt && (
                        <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">
                            schedule
                          </span>
                          {new Date(noti.createdAt).toLocaleString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
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
