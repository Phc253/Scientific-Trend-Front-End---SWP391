import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { api, type NotificationItem } from "../../services/api";

interface NotificationBellProps {
  basePath?: string;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ basePath }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  // TỰ ĐỘNG NHẬN DIỆN BASEPATH DỰA VÀO URL (Ví dụ: /student, /researcher, /admin)
  const resolvedBasePath =
    basePath || `/${location.pathname.split("/")[1]}` || "/researcher";

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Đếm trực tiếp số lượng chưa đọc từ mảng dữ liệu
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // 1. Tải danh sách thông báo ngầm khi mới vào trang để lấy số đếm
  useEffect(() => {
    if (token) {
      fetchNotifications(true);
    }
  }, [token]);

  // 2. Click outside để đóng dropdown
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

  // 3. LẮNG NGHE TÍN HIỆU TỪ TRANG CHI TIẾT (Đồng bộ 2 chiều)
  useEffect(() => {
    const handleSyncAll = () => {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    };
    const handleSyncSingle = (e: any) => {
      const readId = e.detail;
      setNotifications((prev) =>
        prev.map((n: any) =>
          (n.id || n.Id || n.notificationId) === readId
            ? { ...n, isRead: true }
            : n,
        ),
      );
    };

    window.addEventListener("syncReadAll", handleSyncAll);
    window.addEventListener("syncReadSingle", handleSyncSingle);
    return () => {
      window.removeEventListener("syncReadAll", handleSyncAll);
      window.removeEventListener("syncReadSingle", handleSyncSingle);
    };
  }, []);

  const fetchNotifications = async (isBackground = false) => {
    try {
      if (!isBackground) setIsLoading(true);
      const res: any = await api.getNotifications(1, 10);
      const items = res?.data?.items || res?.items || res?.data || res || [];
      setNotifications(Array.isArray(items) ? items : []);
    } catch (error) {
      console.error("Lỗi tải thông báo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleDropdown = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState && token) {
      fetchNotifications();
    }
  };

  // ĐÁNH DẤU 1 ITEM ĐÃ ĐỌC (Tối ưu Optimistic UI + Phát tín hiệu)
  const handleItemClick = async (alert: any) => {
    try {
      const targetId = alert.id || alert.Id || alert.notificationId;

      if (!targetId) {
        console.error("Dữ liệu thông báo bị thiếu ID:", alert);
        return;
      }

      if (!alert.isRead) {
        // 1. Cập nhật UI ngay lập tức
        setNotifications((prev) =>
          prev.map((n: any) =>
            (n.id || n.Id || n.notificationId) === targetId
              ? { ...n, isRead: true }
              : n,
          ),
        );

        // 2. Gọi API ngầm
        await api
          .markNotificationAsRead(targetId)
          .catch((err) => console.error(err));

        // 3. PHÁT TÍN HIỆU CHO TRANG CHI TIẾT BIẾT
        window.dispatchEvent(
          new CustomEvent("syncReadSingle", { detail: targetId }),
        );
      }

      // LOGIC CHUYỂN HƯỚNG VÀ ĐÓNG MENU
      if (alert.paperId) {
        setIsOpen(false);
        navigate(`${resolvedBasePath}/paper/${alert.paperId}`);
      }
    } catch (error) {
      console.error("LỖI API ĐÁNH DẤU ĐÃ ĐỌC:", error);
    }
  };

  // ĐÁNH DẤU TẤT CẢ ĐÃ ĐỌC (Tối ưu Optimistic UI + Phát tín hiệu)
  const handleMarkAllAsRead = async () => {
    try {
      // 1. Chuyển toàn bộ danh sách thành màu trắng NGAY LẬP TỨC
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

      // 2. Gọi API ngầm
      await api.markAllAsRead().catch((err) => console.error(err));

      // 3. PHÁT TÍN HIỆU CHO TRANG CHI TIẾT BIẾT
      window.dispatchEvent(new Event("syncReadAll"));
    } catch (error) {
      console.error("Lỗi khi đánh dấu đọc tất cả:", error);
    }
  };

  // XÓA THÔNG BÁO (Tối ưu Optimistic UI)
  const handleDelete = async (e: React.MouseEvent, alertObj: any) => {
    e.stopPropagation();
    try {
      const targetId = alertObj.id || alertObj.Id || alertObj.notificationId;
      if (!targetId) return;

      // 1. Xóa UI ngay lập tức
      setNotifications((prev) =>
        prev.filter(
          (n: any) => (n.id || n.Id || n.notificationId) !== targetId,
        ),
      );
      // 2. Gọi API ngầm
      await api.deleteNotification(targetId).catch((err) => console.error(err));
    } catch (error) {
      console.error("Lỗi khi xóa thông báo:", error);
    }
  };

  if (!token) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Nút Quả chuông */}
      <button
        onClick={handleToggleDropdown}
        className={`relative p-2 rounded-full transition-all duration-200 focus:outline-none flex items-center justify-center ${
          isOpen
            ? "bg-[#13696a]/10 text-[#13696a]"
            : "text-slate-600 hover:bg-slate-100 hover:text-[#002045]"
        }`}
      >
        <span className="material-symbols-outlined text-[26px]">
          {unreadCount > 0 ? "notifications_active" : "notifications"}
        </span>
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-white shadow-sm animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-[360px] sm:w-[400px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200/60 z-50 animate-scaleIn origin-top-right overflow-hidden flex flex-col max-h-[80vh]">
          {/* Header */}
          <div className="px-5 py-4 flex items-center justify-between shrink-0 bg-white border-b border-slate-100">
            <div className="flex items-center gap-2">
              <h3 className="text-[17px] font-black text-[#002045]">
                Thông báo
              </h3>
              {unreadCount > 0 && (
                <span className="bg-rose-100 text-rose-600 text-[11px] font-bold px-2 py-0.5 rounded-full">
                  {unreadCount} mới
                </span>
              )}
            </div>

            {/* Nút Đánh dấu tất cả (Chỉ hiện khi có thông báo chưa đọc) */}
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs font-semibold text-[#13696a] hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">
                  done_all
                </span>
                Đánh dấu đã đọc
              </button>
            )}
          </div>

          {/* Danh sách thông báo */}
          <div className="overflow-y-auto flex-1 custom-scrollbar bg-slate-50/50">
            {isLoading ? (
              <div className="p-4 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4 animate-pulse">
                    <div className="w-10 h-10 bg-slate-200 rounded-full shrink-0"></div>
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                      <div className="h-3 bg-slate-200 rounded w-full"></div>
                      <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-14 px-6 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-3xl text-slate-400">
                    notifications_off
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-700 mb-1">
                  Đã xem hết thông báo
                </h4>
                <p className="text-xs text-slate-500">
                  Bạn không có thông báo mới nào vào lúc này.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {notifications.map((alert, index) => {
                  const targetId =
                    alert.id ||
                    (alert as any).Id ||
                    (alert as any).notificationId ||
                    `bell-key-${index}`;

                  return (
                    <div
                      key={targetId}
                      onClick={() => handleItemClick(alert)}
                      className={`group relative p-4 cursor-pointer transition-all duration-200 flex gap-4 hover:bg-slate-50 ${
                        !alert.isRead ? "bg-blue-50/30" : "bg-white"
                      }`}
                    >
                      {/* Icon đại diện */}
                      <div className="shrink-0 pt-0.5">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm border ${
                            !alert.isRead
                              ? "bg-[#13696a] text-white border-[#13696a]"
                              : "bg-slate-100 text-slate-500 border-slate-200"
                          }`}
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {alert.paperId ? "article" : "campaign"}
                          </span>
                        </div>
                      </div>

                      {/* Nội dung */}
                      <div className="flex-1 min-w-0 pr-6">
                        <p
                          className={`text-sm mb-1 line-clamp-1 ${
                            !alert.isRead
                              ? "font-bold text-[#002045]"
                              : "font-medium text-slate-700"
                          }`}
                        >
                          {alert.title}
                        </p>
                        <p
                          className={`text-[13px] line-clamp-2 leading-relaxed mb-2 ${
                            !alert.isRead ? "text-slate-700" : "text-slate-500"
                          }`}
                        >
                          {alert.message}
                        </p>
                        <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">
                            schedule
                          </span>
                          {alert.createdAt &&
                            new Date(alert.createdAt).toLocaleString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })}
                        </p>
                      </div>

                      {/* Chấm tròn xanh báo chưa đọc */}
                      {!alert.isRead && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center group-hover:opacity-0 transition-opacity">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-sm"></span>
                        </div>
                      )}

                      {/* Nút Xóa (Chỉ hiện khi hover) */}
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => handleDelete(e, alert)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Xóa thông báo"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            delete
                          </span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-slate-100 text-center bg-white shrink-0">
            <Link
              to={`${resolvedBasePath}/notifications`}
              onClick={() => setIsOpen(false)}
              className="text-sm font-bold text-[#13696a] hover:text-[#0a3f40] transition-colors inline-block py-1 px-4 hover:bg-slate-50 rounded-lg"
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
