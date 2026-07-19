import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api, type BookmarkItem } from "../../services/api";

export const ResearcherLibrary = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      setIsLoading(true);
      const res: any = await api.getBookmarks();
      const items = res?.data || res;
      setBookmarks(Array.isArray(items) ? items : items.items || []);
    } catch (error) {
      console.error("Lỗi tải thư viện nghiên cứu:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveBookmark = async (targetId: number) => {
    if (
      !window.confirm(
        "Bạn có chắc chắn muốn xóa bài báo này khỏi thư viện cá nhân?",
      )
    )
      return;

    try {
      await api.toggleBookmark(targetId, "Paper");
      setBookmarks((prev) => prev.filter((item) => item.targetId !== targetId));
    } catch (error) {
      console.error("Lỗi khi xóa bài báo:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-[#002045] flex items-center gap-2">
          <span className="material-symbols-outlined text-blue-600">
            library_books
          </span>
          Thư viện Nghiên cứu
        </h1>
        <div className="text-slate-500 font-medium bg-slate-100 px-4 py-1 rounded-full border border-slate-200">
          Đang lưu: {bookmarks.length} tài liệu
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40 text-slate-400">
          <span className="material-symbols-outlined animate-spin text-3xl">
            sync
          </span>
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-16 flex flex-col items-center text-center shadow-sm">
          <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">
            search_off
          </span>
          <h3 className="text-xl font-bold text-slate-700 mb-2">
            Thư viện trống
          </h3>
          <p className="text-slate-500 max-w-md mb-6">
            Không gian nghiên cứu của bạn chưa có tài liệu nào. Hãy sử dụng
            thanh tìm kiếm để thu thập các bài báo khoa học.
          </p>
          <Link
            to="/search"
            className="px-6 py-2 bg-[#002045] text-white rounded-lg font-medium hover:bg-blue-900 transition-colors"
          >
            Khám phá bài báo mới
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {bookmarks.map((paper) => (
            <div
              key={paper.bookmarkId}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all relative group"
            >
              <h3 className="text-lg font-bold text-[#002045] pr-10 mb-2 leading-tight">
                {paper.title || "Tài liệu chưa có tiêu đề"}
              </h3>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600 mb-3">
                {paper.journalName && (
                  <span className="flex items-center gap-1 font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    <span className="material-symbols-outlined text-sm">
                      article
                    </span>
                    {paper.journalName}
                  </span>
                )}
                {paper.publicationYear && (
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">
                      calendar_today
                    </span>
                    {paper.publicationYear}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">
                    format_quote
                  </span>
                  {paper.citationCount || 0} trích dẫn
                </span>
              </div>

              {paper.authors && paper.authors.length > 0 && (
                <p className="text-sm text-slate-500 mb-4 line-clamp-1">
                  <span className="font-medium text-slate-700">Tác giả:</span>{" "}
                  {paper.authors.join(", ")}
                </p>
              )}

              <div className="flex items-center gap-3 mt-2 pt-4 border-t border-slate-50">
                <Link
                  to={`/researcher/paper/${paper.targetId}`}
                  className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                >
                  Đọc chi tiết
                </Link>
                {/* Khu vực mở rộng tương lai: Thêm nút "Tạo nhóm thảo luận", "Xuất PDF" tại đây */}
                <button
                  onClick={() => handleRemoveBookmark(paper.targetId)}
                  className="px-4 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors ml-auto flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">
                    delete
                  </span>
                  Bỏ lưu
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResearcherLibrary;
