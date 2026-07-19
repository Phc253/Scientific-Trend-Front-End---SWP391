import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api, type NotificationItem } from "../../services/api";

export const ResearcherAlerts = () => {
  const [alerts, setAlerts] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setIsLoading(true);
      // Lấy 50 thông báo gần nhất
      const res: any = await api.getNotifications(1, 50);

      // Xử lý tương thích cấu trúc trả về (có thể nằm trong res.data, res.items, hoặc trả thẳng res)
      const items = res?.data?.items || res?.items || res?.data || res || [];
      setAlerts(Array.isArray(items) ? items : []);
    } catch (error) {
      console.error("Lỗi tải danh sách cảnh báo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string | number) => {
    try {
      await api.markNotificationAsRead(id);
      // Cập nhật state ngay lập tức để giao diện phản hồi nhanh
      setAlerts((prev) =>
        prev.map((alert) =>
          alert.id === id ? { ...alert, isRead: true } : alert,
        ),
      );
    } catch (error) {
      console.error("Lỗi khi đánh dấu đã đọc:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.markAllAsRead();
      setAlerts((prev) => prev.map((alert) => ({ ...alert, isRead: true })));
    } catch (error) {
      console.error("Lỗi khi đánh dấu đọc tất cả:", error);
    }
  };

  // Tính số lượng thông báo chưa đọc
  const unreadCount = alerts.filter((a) => !a.isRead).length;

  return (
    <div className="p-6 max-w-4xl mx-auto animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#002045] flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-rose-500">
              notifications_active
            </span>
            Cảnh báo bài báo mới
          </h1>
          <p className="text-slate-500 text-sm">
            Cập nhật những nghiên cứu mới nhất từ mạng lưới bạn theo dõi.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-medium hover:bg-slate-200 transition-colors shrink-0"
          >
            <span className="material-symbols-outlined text-sm">done_all</span>
            Đánh dấu đọc tất cả
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40 text-slate-400">
          <span className="material-symbols-outlined animate-spin text-3xl">
            sync
          </span>
        </div>
      ) : alerts.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-16 flex flex-col items-center text-center shadow-sm">
          <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">
            notifications_off
          </span>
          <h3 className="text-xl font-bold text-slate-700 mb-2">
            Chưa có cảnh báo nào
          </h3>
          <p className="text-slate-500 max-w-md">
            Bạn sẽ nhận được thông báo khi có bài báo mới thuộc chủ đề hoặc tác
            giả bạn đang theo dõi.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-100">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-5 flex gap-4 transition-colors ${
                  !alert.isRead ? "bg-blue-50/50" : "hover:bg-slate-50"
                }`}
              >
                {/* Icon biểu cảm dựa trên trạng thái */}
                <div className="shrink-0 mt-1">
                  <span
                    className={`material-symbols-outlined text-2xl ${
                      !alert.isRead ? "text-blue-600" : "text-slate-400"
                    }`}
                  >
                    {alert.paperId ? "article" : "campaign"}
                  </span>
                </div>

                {/* Nội dung chính */}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <h4
                      className={`text-base ${
                        !alert.isRead
                          ? "font-bold text-[#002045]"
                          : "font-medium text-slate-700"
                      }`}
                    >
                      {alert.title}
                    </h4>

                    {/* Dấu chấm xanh báo chưa đọc */}
                    {!alert.isRead && (
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0 mt-1.5 shadow-sm"></span>
                    )}
                  </div>

                  <p
                    className={`text-sm mb-3 ${
                      !alert.isRead ? "text-slate-700" : "text-slate-500"
                    }`}
                  >
                    {alert.message}
                  </p>

                  <div className="flex items-center gap-4 text-xs font-medium">
                    <span className="text-slate-400 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">
                        schedule
                      </span>
                      {new Date(alert.createdAt).toLocaleString("vi-VN")}
                    </span>

                    {/* Các nút hành động */}
                    <div className="flex items-center gap-3 ml-auto">
                      {alert.paperId && (
                        <Link
                          to={`/researcher/paper/${alert.paperId}`}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          Xem bài báo
                        </Link>
                      )}
                      {!alert.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(alert.id)}
                          className="text-slate-500 hover:text-slate-800 transition-colors"
                        >
                          Đánh dấu đã đọc
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResearcherAlerts;
