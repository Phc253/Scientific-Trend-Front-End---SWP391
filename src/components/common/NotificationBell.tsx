import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // Đã xóa Link ở đây
import { api, type NotificationItem } from "../../services/api";

interface NotificationBellProps {
  basePath: string;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ basePath }) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Logic đóng Dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Gọi API lấy thông báo khi component load
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    try {
      const res: any = await api.getNotifications();
      const items = res?.data?.items || res?.items || res || [];
      setNotifications(items);

      const unread = items.filter(
        (item: NotificationItem) => !item.isRead,
      ).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Lỗi khi tải thông báo:", error);
      if (error instanceof Error) {
        if (
          error.message.includes("Unauthorized") ||
          error.message.includes("401")
        ) {
          localStorage.removeItem("token");
        }
      } else if (typeof error === "string") {
        if (error.includes("Unauthorized") || error.includes("401")) {
          localStorage.removeItem("token");
        }
      }
    }
  };

  const handleNotificationClick = async (notification: NotificationItem) => {
    if (!notification.isRead) {
      try {
        await api.markNotificationAsRead(notification.id);
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, isRead: true } : n,
          ),
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (error) {
        console.error("Lỗi khi đánh dấu đã đọc:", error);
      }
    }
    setIsOpen(false);
    if (notification.paperId) {
      navigate(`/paper/${notification.paperId}`);
    }
  };

  const handleMarkAllRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setIsLoading(true);
      await api.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Lỗi:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- HÀM MỚI ĐƯỢC THÊM VÀO Ở ĐÂY ---
  const handleViewAllClick = () => {
    const token = localStorage.getItem("token");

    // Nếu chưa đăng nhập
    if (!token) {
      alert("Bạn cần đăng nhập để có thể sử dụng chức năng này.");
      setIsOpen(false); // Đóng menu
      return; // Chặn không cho sang trang khác
    }

    // Nếu đã đăng nhập thì cho phép chuyển trang
    setIsOpen(false);
    navigate(`${basePath}/notifications`);
  };
  // ------------------------------------

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Nút Bấm Quả Chuông */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
      >
        <span className="material-symbols-outlined text-[26px]">
          notifications
        </span>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white animate-bounce-short">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Menu Dropdown Thả Xuống */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-fadeIn">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="font-black text-slate-800">Thông báo</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                disabled={isLoading}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                Đánh dấu đã đọc tất cả
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-500 flex flex-col items-center">
                <span className="material-symbols-outlined text-4xl mb-2 text-slate-300">
                  notifications_paused
                </span>
                <p className="text-sm">Bạn không có thông báo nào.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 ${!notification.isRead ? "bg-blue-50/30" : ""}`}
                  >
                    <div className="shrink-0 mt-1">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${!notification.isRead ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"}`}
                      >
                        <span className="material-symbols-outlined text-xl">
                          article
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm ${!notification.isRead ? "font-bold text-slate-800" : "font-medium text-slate-600"}`}
                      >
                        {notification.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-[11px] font-bold text-slate-400 mt-2">
                        {new Date(notification.createdAt).toLocaleDateString(
                          "vi-VN",
                          { hour: "2-digit", minute: "2-digit" },
                        )}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="shrink-0 flex items-center">
                        <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-3 border-t border-slate-100 text-center bg-slate-50/50">
            {/* --- NÚT ĐÃ ĐƯỢC THAY ĐỔI Ở ĐÂY --- */}
            <button
              onClick={handleViewAllClick}
              className="w-full text-sm font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              Xem tất cả
            </button>
            {/* ---------------------------------- */}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
