import React, { useState, useEffect } from "react";
import { api, type BookmarkItem } from "../../services/api";
import { useNavigate } from "react-router-dom";

const SharedLibrary: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [loading, setLoading] = useState(true);

  const role =
    localStorage.getItem("userRoles") ||
    localStorage.getItem("actorType") ||
    "";
  const isLecturer = role.includes("Lecturer");
  const basePath = isLecturer ? "/lecturer" : "/student";

  const theme = {
    primaryText: isLecturer ? "text-emerald-600" : "text-blue-600",
    primaryHover: isLecturer ? "hover:text-emerald-800" : "hover:text-blue-800",
  };
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      // Gọi API lấy Bookmark từ db
      const res = await api.getMyBookmarks();
      if (res && res.success) {
        setBookmarks(res.data);
      }
    } catch (err) {
      console.error("Lỗi lấy danh sách tài liệu:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id: number) => {
    if (window.confirm("Bạn có chắc muốn bỏ lưu tài liệu này?")) {
      try {
        // Gọi API xóa bookmark
        const res = await api.removeBookmark(id);
        if (res && res.success) {
          // Xóa ngay trên giao diện mà không cần reload trang
          setBookmarks((prev) => prev.filter((item) => item.targetId !== id));
        }
      } catch (err) {
        alert("Có lỗi xảy ra khi xóa tài liệu khỏi hệ thống!");
      }
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">
          Kho Học liệu của tôi
        </h2>
        <span className="text-sm bg-white px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 font-bold shadow-sm">
          Tổng: {bookmarks.length} tài liệu
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-slate-500 font-medium flex flex-col items-center">
            <span className="material-symbols-outlined text-4xl animate-spin mb-2">
              sync
            </span>
            Đang đồng bộ dữ liệu...
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="p-16 text-center">
            <span className="material-symbols-outlined text-6xl text-slate-200 mb-4 block">
              bookmark_add
            </span>
            <p className="text-slate-500 font-medium">
              Bạn chưa lưu tài liệu nào trong thư viện.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-bold">
                <tr>
                  <th className="p-4">Tiêu đề tài liệu</th>
                  <th className="p-4 w-32">Năm XB</th>
                  <th className="p-4 text-right w-48">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookmarks.map((b) => (
                  <tr
                    key={b.bookmarkId}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="p-4">
                      <p className="font-bold text-slate-800 text-sm mb-1 line-clamp-2">
                        {b.title}
                      </p>
                      <p className="text-xs text-slate-500 line-clamp-1">
                        {b.authors?.join(", ") || "Không rõ tác giả"}
                      </p>
                    </td>
                    <td className="p-4 text-sm font-medium text-slate-600">
                      {b.publicationYear || "N/A"}
                    </td>
                    <td className="p-4 text-right space-x-3">
                      <button
                        onClick={() =>
                          navigate(`${basePath}/paper/${b.targetId}`)
                        }
                        className={`${theme.primaryText} ${theme.primaryHover} font-bold text-sm transition-colors`}
                      >
                        Chi tiết
                      </button>
                      <button
                        onClick={() => handleRemove(b.targetId)}
                        className="text-red-500 hover:text-red-700 font-bold text-sm transition-colors"
                      >
                        Bỏ lưu
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SharedLibrary;
