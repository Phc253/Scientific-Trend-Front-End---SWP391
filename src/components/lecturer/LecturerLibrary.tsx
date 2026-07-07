import React, { useState, useEffect } from "react";
import { api, type BookmarkItem } from "../../services/api";
import { useNavigate } from "react-router-dom";

const LecturerLibrary: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchBookmarks = async () => {
    try {
      const res = await api.getMyBookmarks();
      if (res.success) {
        setBookmarks(res.data);
      }
    } catch (err) {
      console.error("Lỗi tải thư viện:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleRemove = async (id: number) => {
    if (window.confirm("Bỏ lưu tài liệu này khỏi Kho học liệu?")) {
      try {
        await api.toggleBookmark(id, "Paper");
        fetchBookmarks(); // Tải lại danh sách sau khi xóa
      } catch (error) {
        alert("Có lỗi xảy ra khi xóa tài liệu.");
      }
    }
  };

  return (
    <div className="animate-fadeIn space-y-6 h-full flex flex-col">
      <div className="mb-4 shrink-0">
        <h2 className="text-2xl font-bold text-slate-800">Kho Học liệu</h2>
        <p className="text-sm text-slate-500">
          Tài liệu và bài báo tham khảo đã lưu.
        </p>
      </div>

      <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-20 text-emerald-600 font-medium">
            Đang tải danh sách tài liệu...
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center justify-center">
            <span className="material-symbols-outlined text-[60px] text-slate-200 mb-3">
              menu_book
            </span>
            <p className="text-slate-500 font-medium">
              Chưa có tài liệu nào được lưu.
            </p>
            <button
              onClick={() => navigate("/lecturer/search")}
              className="mt-4 text-emerald-600 hover:underline text-sm font-bold"
            >
              Đi tìm kiếm bài báo
            </button>
          </div>
        ) : (
          <div className="overflow-auto h-full">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 z-10">
                <tr className="text-sm font-semibold text-slate-600">
                  <th className="p-4">Tên tài liệu</th>
                  <th className="p-4">Ngày lưu</th>
                  <th className="p-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {bookmarks.map((b) => (
                  <tr
                    key={b.bookmarkId}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <td className="p-4 font-medium text-slate-800 w-2/3">
                      {b.title || "Tài liệu #" + b.targetId}
                    </td>
                    <td className="p-4 text-sm text-slate-500">
                      {b.createdAt
                        ? new Date(b.createdAt).toLocaleDateString("vi-VN")
                        : "Gần đây"}
                    </td>
                    <td className="p-4 text-right space-x-4">
                      <button
                        onClick={() =>
                          navigate(`/lecturer/paper/${b.targetId}`)
                        }
                        className="text-blue-600 hover:text-blue-800 text-sm font-bold"
                      >
                        Chi tiết
                      </button>
                      <button
                        onClick={() => handleRemove(b.targetId)}
                        className="text-red-500 hover:text-red-700 text-sm font-bold"
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

export default LecturerLibrary;
