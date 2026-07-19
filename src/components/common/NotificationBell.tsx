import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api, type NotificationItem } from "../../services/api";

interface NotificationBellProps {
  basePath?: string;
}

const NotificationBell: React.FC<NotificationBellProps> = ({
  basePath = "/researcher",
}) => {
  // 1. Lấy token để biết người dùng đã đăng nhập hay chưa
  const token = localStorage.getItem("token");

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 2. CHỈ gọi API nếu thực sự có token
    if (token) {
      fetchNotifications();
    }
  }, [token]);

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

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const res: any = await api.getNotifications(1, 10);
      const items = res?.data?.items || res?.items || res?.data || res || [];
      setNotifications(Array.isArray(items) ? items : []);
    } catch (error) {
      console.error("Lỗi tải thông báo ở NotificationBell:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen && token) {
      fetchNotifications();
    }
  };

  const handleMarkAsReadAndNavigate = async (
    id: string | number,
    paperId?: string,
    isRead?: boolean,
  ) => {
    try {
      if (!isRead) {
        await api.markNotificationAsRead(id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
        );
      }

      setIsOpen(false);

      if (paperId) {
        navigate(`${basePath}/paper/${paperId}`);
      }
    } catch (error) {
      console.error("Lỗi khi đánh dấu đã đọc:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Lỗi khi đánh dấu đọc tất cả:", error);
    }
  };

  // 3. NẾU LÀ GUEST (Không có token) -> KHÔNG RENDER QUẢ CHUÔNG
  if (!token) {
    return null;
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* ... (Toàn bộ phần code giao diện render quả chuông và dropdown giữ nguyên như cũ) ... */}

      {/* Nút Quả chuông */}
      <button
        onClick={handleToggleDropdown}
        className="relative p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors focus:outline-none"
      >
        <span className="material-symbols-outlined text-2xl">
          notifications
        </span>
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 animate-scaleIn origin-top-right overflow-hidden flex flex-col max-h-[85vh]">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              Thông báo
              {unreadCount > 0 && (
                <span className="bg-rose-100 text-rose-600 text-xs px-2 py-0.5 rounded-full">
                  {unreadCount} mới
                </span>
              )}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Đánh dấu đã đọc
              </button>
            )}
          </div>

          {/* Danh sách thông báo */}
          <div className="overflow-y-auto flex-1">
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <span className="material-symbols-outlined animate-spin text-indigo-500 text-3xl">
                  sync
                </span>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">
                  notifications_paused
                </span>
                <p className="text-sm">Bạn không có thông báo nào.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {notifications.map((alert) => (
                  <div
                    key={alert.id}
                    onClick={() =>
                      handleMarkAsReadAndNavigate(
                        alert.id,
                        alert.paperId,
                        alert.isRead,
                      )
                    }
                    className={`p-4 cursor-pointer transition-colors flex gap-3 ${
                      !alert.isRead
                        ? "bg-blue-50/40 hover:bg-blue-50"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="shrink-0 mt-0.5">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          !alert.isRead
                            ? "bg-blue-100 text-blue-600"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {alert.paperId ? "article" : "campaign"}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm truncate mb-0.5 ${!alert.isRead ? "font-bold text-[#002045]" : "font-medium text-slate-700"}`}
                      >
                        {alert.title}
                      </p>
                      <p
                        className={`text-xs line-clamp-2 mb-2 ${!alert.isRead ? "text-slate-600" : "text-slate-500"}`}
                      >
                        {alert.message}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {new Date(alert.createdAt).toLocaleString("vi-VN")}
                      </p>
                    </div>

                    {!alert.isRead && (
                      <div className="shrink-0 flex items-center">
                        <span className="w-2 h-2 rounded-full bg-blue-600 shadow-sm"></span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-3 border-t border-slate-100 text-center bg-white shrink-0">
            <Link
              to={`${basePath}/notifications`}
              onClick={() => setIsOpen(false)}
              className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors block py-1"
            >
              Xem tất cả thông báo
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
