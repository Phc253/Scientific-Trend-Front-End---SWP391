import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api, type Paper } from "../../services/api";

const SharedExplore: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([]);

  const role =
    localStorage.getItem("userRoles") ||
    localStorage.getItem("actorType") ||
    "";
  const isLecturer = role.includes("Lecturer");

  const theme = {
    primaryBg: isLecturer ? "bg-emerald-600" : "bg-blue-600",
    primaryHover: isLecturer ? "hover:bg-emerald-700" : "hover:bg-blue-700",
    primaryText: isLecturer ? "text-emerald-600" : "text-blue-600",
    basePath: isLecturer ? "/lecturer" : "/student",
  };

  // 1. KHÔI PHỤC TRẠNG THÁI KHI VÀO TRANG
  useEffect(() => {
    // Khôi phục từ khóa và kết quả tìm kiếm từ session (để giữ nguyên giao diện khi ấn Quay lại)
    const savedState = sessionStorage.getItem("exploreSearchState");
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setSearchQuery(parsed.searchQuery || "");
        setResults(parsed.results || []);
        setHasSearched(parsed.hasSearched || false);
      } catch (error) {
        console.error("Lỗi khi đọc bộ nhớ tạm", error);
      }
    }

    // LUÔN LUÔN lấy danh sách Bookmark mới nhất từ API để đảm bảo đồng bộ với Kho Học Liệu
    fetchLatestBookmarks();
  }, []);

  const fetchLatestBookmarks = async () => {
    try {
      const res = await api.getMyBookmarks();
      if (res && res.success) {
        // Lấy ra mảng các ID bài báo đã lưu
        const savedIds = res.data.map((b) => b.targetId);
        setBookmarkedIds(savedIds);
      }
    } catch (err) {
      console.error("Không thể tải danh sách bookmark đồng bộ", err);
    }
  };

  // 2. LƯU TRẠNG THÁI TÌM KIẾM
  useEffect(() => {
    if (hasSearched) {
      sessionStorage.setItem(
        "exploreSearchState",
        JSON.stringify({
          searchQuery,
          results,
          hasSearched,
          // Lưu ý: Không lưu bookmarkedIds vào session nữa để tránh bị cũ (stale data)
        }),
      );
    }
  }, [searchQuery, results, hasSearched]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const res = await api.searchPapers({
        q: searchQuery,
        page: 1,
        pageSize: 10,
      });
      if (res && res.success && res.data?.items) {
        setResults(res.data.items);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error("Lỗi tìm kiếm:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = async (paperId: number) => {
    try {
      const res = await api.toggleBookmark(paperId, "Paper");
      if (res && res.success) {
        if (res.isBookmarked) {
          setBookmarkedIds((prev) => [...prev, paperId]);
        } else {
          setBookmarkedIds((prev) => prev.filter((id) => id !== paperId));
        }
      }
    } catch (err) {
      console.error("Lỗi khi thao tác với bookmark:", err);
      alert("Có lỗi xảy ra khi lưu tài liệu. Vui lòng thử lại!");
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setResults([]);
    setHasSearched(false);
    sessionStorage.removeItem("exploreSearchState");
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-black text-slate-800 tracking-tight">
        Khám phá Tài liệu
      </h2>

      {/* Khu vực Tìm kiếm */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center relative">
        {hasSearched && (
          <button
            onClick={clearSearch}
            className="absolute top-4 right-4 text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1 bg-slate-100 py-1 px-2 rounded-md transition-colors"
          >
            <span className="material-symbols-outlined text-[14px]">
              refresh
            </span>{" "}
            Làm mới
          </button>
        )}

        <h3 className="text-xl font-bold text-slate-800 mb-2 mt-2">
          Tìm kiếm kho dữ liệu khoa học
        </h3>
        <p className="text-slate-500 text-sm mb-6 max-w-lg mx-auto">
          Nhập từ khóa, tên tác giả hoặc tên bài báo để khám phá các công bố
          khoa học mới nhất.
        </p>

        <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-2">
          <input
            type="text"
            placeholder="Nhập từ khóa nghiên cứu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={loading}
            className="flex-1 p-3.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
          <button
            type="submit"
            disabled={loading}
            className={`${theme.primaryBg} ${theme.primaryHover} text-white px-6 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-colors disabled:opacity-70`}
          >
            <span className="material-symbols-outlined text-lg">search</span>
            {loading ? "Đang tìm..." : "Tìm kiếm"}
          </button>
        </form>
      </div>

      {/* Khu vực Hiển thị Kết quả từ API */}
      {hasSearched && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg text-slate-800 mb-4">
            Kết quả tìm kiếm cho: "{searchQuery}"
          </h3>

          {loading ? (
            <div className="text-center py-10 text-slate-500 flex flex-col items-center">
              <span className="material-symbols-outlined text-4xl animate-spin mb-3">
                sync
              </span>
              Đang tải dữ liệu từ máy chủ...
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              Không tìm thấy bài báo nào phù hợp.
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((paper) => (
                <div
                  key={paper.paperId}
                  className="p-5 border border-slate-100 rounded-xl hover:shadow-md transition-shadow bg-white flex flex-col sm:flex-row justify-between gap-4"
                >
                  <div className="flex-1">
                    <Link
                      to={`${theme.basePath}/paper/${paper.paperId}`}
                      className={`text-lg font-bold ${theme.primaryText} hover:underline block mb-2`}
                    >
                      {paper.title}
                    </Link>
                    <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                      <span className="font-medium">Tác giả:</span>{" "}
                      {paper.authors?.join(", ") || "Không rõ tác giả"}
                    </p>
                    <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-500">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">
                          calendar_today
                        </span>
                        Năm XB: {paper.publicationYear || "N/A"}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">
                          format_quote
                        </span>
                        Trích dẫn: {paper.citationCount || 0}
                      </span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col gap-2 justify-start sm:justify-center shrink-0 border-t sm:border-t-0 sm:border-l border-slate-100 pt-3 sm:pt-0 sm:pl-4">
                    <Link
                      to={`${theme.basePath}/paper/${paper.paperId}`}
                      className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors w-full sm:w-auto"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        visibility
                      </span>
                      Đọc bài
                    </Link>

                    <button
                      onClick={() => handleBookmark(paper.paperId)}
                      className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg border font-bold text-sm transition-colors w-full sm:w-auto ${
                        bookmarkedIds.includes(paper.paperId)
                          ? "bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {bookmarkedIds.includes(paper.paperId)
                          ? "bookmark_added"
                          : "bookmark_add"}
                      </span>
                      {bookmarkedIds.includes(paper.paperId)
                        ? "Đã lưu"
                        : "Lưu lại"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SharedExplore;
