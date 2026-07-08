import React, { useState, useEffect } from "react";
import { api, type BookmarkItem } from "../../services/api";
import { useNavigate } from "react-router-dom";

const StudentLibrary: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const res = await api.getMyBookmarks();
      if (res.success) {
        setBookmarks(res.data);
      }
    } catch (err) {
      console.error("Lỗi tải bookmark", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async (targetId: number, targetType: string) => {
    try {
      // Ép kiểu targetType cho khớp với API ("Paper" | "Keyword")
      const res = await api.toggleBookmark(
        targetId,
        targetType as "Paper" | "Keyword",
      );
      if (res.success && !res.isBookmarked) {
        // Lọc bỏ item vừa xóa khỏi danh sách hiện tại để UI cập nhật ngay lập tức
        setBookmarks(bookmarks.filter((b) => b.targetId !== targetId));
      }
    } catch (err) {
      console.error("Lỗi khi xóa bookmark", err);
      alert("Không thể xóa bookmark. Vui lòng thử lại!");
    }
  };

  if (loading)
    return (
      <div className="p-8 text-center text-blue-600">Đang tải thư viện...</div>
    );

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#002045]">Thư viện của tôi</h2>
        <p className="text-sm text-slate-500">
          Bạn đang có {bookmarks.length} tài liệu được lưu.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {bookmarks.length === 0 ? (
          <p className="text-slate-500 italic">Thư viện của bạn đang trống.</p>
        ) : (
          bookmarks.map((item) => (
            <div
              key={item.bookmarkId}
              className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    {item.targetType}
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    {item.publicationYear}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 leading-snug mb-2">
                  {item.title || item.keywordText}
                </h3>
                {item.authors && item.authors.length > 0 && (
                  <p className="text-sm text-slate-600 mb-2">
                    Tác giả: {item.authors.join(", ")}
                  </p>
                )}
                {item.journalName && (
                  <p className="text-xs text-slate-500">
                    Tạp chí: {item.journalName}
                  </p>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
                <button
                  onClick={() => navigate(`/student/paper/${item.targetId}`)}
                  className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-medium py-2 rounded-lg transition-colors border border-slate-200"
                >
                  Đọc tài liệu
                </button>
                <button
                  onClick={() =>
                    handleRemoveBookmark(item.targetId, item.targetType)
                  }
                  className="px-3 py-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                  title="Bỏ lưu"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    bookmark_remove
                  </span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentLibrary;
