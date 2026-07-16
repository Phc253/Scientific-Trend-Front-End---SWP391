import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import type { Paper, PaperFacetItem } from "../../services/api";

type SearchTab = "papers" | "authors" | "journals" | "topics" | "keywords";

const SharedExplore: React.FC = () => {
  // Nhận diện Role và cấu hình Theme
  const role =
    localStorage.getItem("userRoles") ||
    localStorage.getItem("actorType") ||
    "";
  const isLecturer = role.includes("Lecturer");
  const theme = {
    primaryBg: isLecturer ? "bg-emerald-600" : "bg-blue-600",
    primaryHover: isLecturer ? "hover:bg-emerald-700" : "hover:bg-blue-700",
    primaryText: isLecturer ? "text-emerald-600" : "text-blue-600",
    primaryBorder: isLecturer ? "border-emerald-600" : "border-blue-600",
    lightBg: isLecturer ? "bg-emerald-50" : "bg-blue-50",
    ring: isLecturer ? "ring-emerald-200" : "ring-blue-200",
    basePath: isLecturer ? "/lecturer" : "/student",
  };

  // State: Tab & Search Query
  const [activeTab, setActiveTab] = useState<SearchTab>("papers");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // State: Bộ lọc nâng cao (cho Papers)
  const [paperAuthor, setPaperAuthor] = useState("");
  const [paperJournal, setPaperJournal] = useState("");
  const [paperYear, setPaperYear] = useState<number | "">("");

  // State: Phân trang & Kết quả
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [facetItems, setFacetItems] = useState<PaperFacetItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State: Quản lý tương tác (Bookmarks & Follows)
  const [bookmarkedPaperIds, setBookmarkedPaperIds] = useState<Set<number>>(
    new Set(),
  );
  const [bookmarkedKeywordIds, setBookmarkedKeywordIds] = useState<Set<number>>(
    new Set(),
  );
  const [followedAuthorIds, setFollowedAuthorIds] = useState<Set<number>>(
    new Set(),
  );
  const [followedJournalIds, setFollowedJournalIds] = useState<Set<number>>(
    new Set(),
  );
  const [followedTopicIds, setFollowedTopicIds] = useState<Set<number>>(
    new Set(),
  );

  // 1. KHÔI PHỤC TRẠNG THÁI VÀ FETCH DỮ LIỆU ĐỒNG BỘ
  useEffect(() => {
    const savedState = sessionStorage.getItem("memberExploreState");
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setActiveTab(parsed.activeTab || "papers");
        setSearchQuery(parsed.searchQuery || "");
        setPage(parsed.page || 1);
        setPaperAuthor(parsed.paperAuthor || "");
        setPaperJournal(parsed.paperJournal || "");
        setPaperYear(parsed.paperYear || "");
      } catch (err) {
        console.error("Lỗi đọc session storage", err);
      }
    }

    fetchBookmarksAndFollows();
  }, []);

  // 2. FETCH BOOKMARKS & FOLLOWS MỚI NHẤT
  const fetchBookmarksAndFollows = async () => {
    try {
      const [bookmarksRes, followsRes] = await Promise.all([
        api.getMyBookmarks(),
        api.getMyFollows(),
      ]);

      if (bookmarksRes.success && bookmarksRes.data) {
        const pIds = bookmarksRes.data
          .filter((b) => b.targetType.toLowerCase() === "paper")
          .map((b) => b.targetId);
        const kIds = bookmarksRes.data
          .filter((b) => b.targetType.toLowerCase() === "keyword")
          .map((b) => b.targetId);
        setBookmarkedPaperIds(new Set(pIds));
        setBookmarkedKeywordIds(new Set(kIds));
      }

      if (followsRes.success && followsRes.data) {
        const aIds = followsRes.data
          .filter((f) => f.targetType.toLowerCase() === "author")
          .map((f) => f.targetId);
        const jIds = followsRes.data
          .filter((f) => f.targetType.toLowerCase() === "journal")
          .map((f) => f.targetId);
        const tIds = followsRes.data
          .filter((f) => f.targetType.toLowerCase() === "researchtopic")
          .map((f) => f.targetId);
        setFollowedAuthorIds(new Set(aIds));
        setFollowedJournalIds(new Set(jIds));
        setFollowedTopicIds(new Set(tIds));
      }
    } catch (err) {
      console.error("Lỗi đồng bộ Bookmarks/Follows:", err);
    }
  };

  // 3. FETCH DỮ LIỆU TÌM KIẾM
  useEffect(() => {
    fetchData(page, activeTab);

    // Tự động lưu trạng thái
    sessionStorage.setItem(
      "memberExploreState",
      JSON.stringify({
        activeTab,
        searchQuery,
        page,
        paperAuthor,
        paperJournal,
        paperYear,
      }),
    );
  }, [page, activeTab]);

  const fetchData = async (currentPage: number, currentTab: SearchTab) => {
    setIsLoading(true);
    setError(null);
    const query = searchQuery.trim() || undefined;

    try {
      if (currentTab === "papers") {
        const response = await api.searchPapers({
          q: query,
          author: paperAuthor.trim() || undefined,
          journal: paperJournal.trim() || undefined,
          publicationYear: paperYear ? Number(paperYear) : undefined,
          page: currentPage,
          pageSize,
        });

        if (response.success && response.data) {
          setPapers(response.data.items || []);
          setTotalCount(response.data.totalCount || 0);
        } else {
          setPapers([]);
          setTotalCount(0);
        }
      } else {
        let response: any;
        if (currentTab === "authors")
          response = await api.getAuthorFacets(query, currentPage, pageSize);
        else if (currentTab === "journals")
          response = await api.getJournalFacets(query, currentPage, pageSize);
        else if (currentTab === "topics")
          response = await api.getTopicFacets(query, currentPage, pageSize);
        else
          response = await api.getKeywordFacets(query, currentPage, pageSize);

        // --- SỬA TẠI ĐÂY ---
        // Backend bọc dữ liệu trong thuộc tính 'data' (ServiceResult)
        const actualData = response?.data ? response.data : response;

        setFacetItems(actualData?.items || []);
        setTotalCount(actualData?.totalCount || 0);
      }
    } catch (err: any) {
      setError(err.message || "Không thể tải dữ liệu tìm kiếm.");
      setPapers([]);
      setFacetItems([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  // 4. XỬ LÝ SỰ KIỆN FORM & PHÂN TRANG
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (page === 1) {
      fetchData(1, activeTab);
    } else {
      setPage(1);
    }
  };

  const handleTabChange = (tab: SearchTab) => {
    setActiveTab(tab);
    setPage(1);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setPaperAuthor("");
    setPaperJournal("");
    setPaperYear("");
    setPage(1);
    fetchData(1, activeTab);
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  // Hàm chuyển trang an toàn, tránh lỗi ký tự lạ
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // 5. CÁC HÀM TOGGLE BOOKMARK & FOLLOW
  const togglePaperBookmark = async (id: number) => {
    try {
      const res = await api.toggleBookmark(id, "Paper");
      if (res.success) {
        setBookmarkedPaperIds((prev) => {
          const next = new Set(prev);
          res.isBookmarked ? next.add(id) : next.delete(id);
          return next;
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleKeywordBookmark = async (id: number) => {
    try {
      const res = await api.toggleBookmark(id, "Keyword");
      if (res.success) {
        setBookmarkedKeywordIds((prev) => {
          const next = new Set(prev);
          res.isBookmarked ? next.add(id) : next.delete(id);
          return next;
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleFollow = async (
    id: number,
    type: "Author" | "Journal" | "ResearchTopic",
    setIds: React.Dispatch<React.SetStateAction<Set<number>>>,
  ) => {
    try {
      const res = await api.toggleFollow(id, type);
      if (res.success) {
        setIds((prev) => {
          const next = new Set(prev);
          res.isFollowed ? next.add(id) : next.delete(id);
          return next;
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getSearchPlaceholder = () => {
    switch (activeTab) {
      case "papers":
        return "Tìm kiếm bài báo theo tiêu đề, tóm tắt...";
      case "authors":
        return "Tìm kiếm tác giả nghiên cứu...";
      case "journals":
        return "Tìm kiếm tạp chí khoa học học thuật...";
      case "topics":
        return "Tìm kiếm chủ đề nghiên cứu...";
      case "keywords":
        return "Tìm kiếm từ khóa khoa học phổ biến...";
      default:
        return "Tìm kiếm...";
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">
          Khám phá Dữ liệu Khoa học
        </h2>
        <button
          onClick={clearSearch}
          className="text-xs font-bold text-slate-500 hover:text-slate-700 flex items-center gap-1 bg-white border border-slate-200 py-1.5 px-3 rounded-lg shadow-sm transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">refresh</span>{" "}
          Làm mới
        </button>
      </div>

      {/* 5 Tab điều hướng danh mục khám phá */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 text-sm font-semibold">
        {[
          { key: "papers", label: "Bài báo", icon: "description" },
          { key: "authors", label: "Tác giả", icon: "person" },
          { key: "journals", label: "Tạp chí", icon: "menu_book" },
          { key: "topics", label: "Chủ đề", icon: "hub" },
          { key: "keywords", label: "Từ khóa", icon: "sell" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key as SearchTab)}
            className={`pb-3 px-4 border-b-2 transition-all duration-200 cursor-pointer flex items-center gap-2 ${
              activeTab === tab.key
                ? `${theme.primaryBorder} ${theme.primaryText} font-bold`
                : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
            }`}
          >
            <span className="material-symbols-outlined text-base">
              {tab.icon}
            </span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Form tìm kiếm */}
      <form
        onSubmit={handleSearchSubmit}
        className={`bg-white p-6 rounded-2xl border transition-all duration-200 ${isFocused ? `ring-2 ${theme.ring} ${theme.primaryBorder}` : "border-slate-200 shadow-sm"}`}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-4 top-3.5 text-slate-400">
              search
            </span>
            <input
              type="text"
              placeholder={getSearchPlaceholder()}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white transition-all text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`${theme.primaryBg} ${theme.primaryHover} text-white px-8 py-3 rounded-xl font-bold transition-all text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-70`}
          >
            {isLoading ? "Đang tìm..." : "Tìm kiếm"}
          </button>
        </div>
      </form>

      {/* Grid nội dung (Filter + Kết quả) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* CỘT TRÁI: Bộ lọc hoặc Hướng dẫn */}
        {activeTab === "papers" ? (
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm h-fit space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="material-symbols-outlined text-slate-700 text-sm">
                filter_list
              </span>
              <h3 className="font-bold text-xs text-slate-700 uppercase tracking-wider">
                Bộ lọc nâng cao
              </h3>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                Tác giả
              </label>
              <input
                type="text"
                placeholder="Nhập tên tác giả..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-400"
                value={paperAuthor}
                onChange={(e) => setPaperAuthor(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                Tạp chí
              </label>
              <input
                type="text"
                placeholder="Nhập tên tạp chí..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-400"
                value={paperJournal}
                onChange={(e) => setPaperJournal(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                Năm xuất bản
              </label>
              <input
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                placeholder="Ví dụ: 2024"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-400"
                value={paperYear}
                onChange={(e) =>
                  setPaperYear(e.target.value ? Number(e.target.value) : "")
                }
              />
            </div>
            <button
              onClick={() => {
                setPage(1);
                fetchData(1, activeTab);
              }}
              disabled={isLoading}
              className={`w-full bg-slate-800 text-white hover:bg-slate-900 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50`}
            >
              Áp dụng bộ lọc
            </button>
          </div>
        ) : (
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm h-fit space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="material-symbols-outlined text-slate-700 text-sm">
                info
              </span>
              <h3 className="font-bold text-xs text-slate-700 uppercase tracking-wider">
                Hướng dẫn
              </h3>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Khám phá các khía cạnh khác của nghiên cứu khoa học. Nhấn "Theo
              dõi" hoặc "Lưu lại" để thuật toán của hệ thống cá nhân hóa bảng
              tin xu hướng dành riêng cho bạn!
            </p>
          </div>
        )}

        {/* CỘT PHẢI: Danh sách kết quả chính */}
        <div className="lg:col-span-3 space-y-4">
          <div className="text-sm text-slate-500 px-1 flex justify-between items-center font-medium">
            <span>
              Đã tìm thấy{" "}
              <strong className="text-slate-800">{totalCount}</strong> kết quả
              phù hợp
            </span>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <span className="material-symbols-outlined text-4xl animate-spin text-slate-300 mb-4">
                sync
              </span>
              <p className="text-sm text-slate-500 font-medium">
                Đang tải kết quả từ hệ thống...
              </p>
            </div>
          ) : activeTab === "papers" ? (
            // HIỂN THỊ BÀI BÁO (PAPERS)
            papers.length === 0 ? (
              <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl shadow-sm text-slate-500">
                Không tìm thấy bài báo nào.
              </div>
            ) : (
              <div className="space-y-4">
                {papers.map((paper) => {
                  const isBookmarked = bookmarkedPaperIds.has(paper.paperId);
                  return (
                    <div
                      key={paper.paperId}
                      className="p-5 border border-slate-200 rounded-2xl hover:shadow-md transition-shadow bg-white flex flex-col sm:flex-row justify-between gap-4 group"
                    >
                      <div className="flex-1">
                        <Link
                          to={`${theme.basePath}/paper/${paper.paperId}`}
                          className={`text-lg font-bold text-slate-800 ${theme.primaryHover.replace("bg-", "text-")} transition-colors block mb-2 leading-snug`}
                        >
                          {paper.title}
                        </Link>
                        <p className="text-sm text-slate-600 mb-3 font-medium">
                          {paper.authors?.join(", ") || "Không rõ tác giả"}
                        </p>
                        <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-500">
                          {paper.journal && (
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">
                                menu_book
                              </span>{" "}
                              {paper.journal}
                            </span>
                          )}
                          {paper.publicationYear && (
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">
                                calendar_today
                              </span>{" "}
                              {paper.publicationYear}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">
                              format_quote
                            </span>{" "}
                            Trích dẫn: {paper.citationCount || 0}
                          </span>
                        </div>
                      </div>

                      <div className="flex sm:flex-col gap-2 justify-start sm:justify-center shrink-0 border-t sm:border-t-0 sm:border-l border-slate-100 pt-3 sm:pt-0 sm:pl-4">
                        <Link
                          to={`${theme.basePath}/paper/${paper.paperId}`}
                          className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors w-full sm:w-auto"
                        >
                          Đọc bài
                        </Link>
                        <button
                          onClick={() => togglePaperBookmark(paper.paperId)}
                          className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg border font-bold text-sm transition-colors w-full sm:w-auto ${
                            isBookmarked
                              ? "bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100"
                              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {isBookmarked ? "bookmark_added" : "bookmark_add"}
                          </span>
                          {isBookmarked ? "Đã lưu" : "Lưu lại"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : // HIỂN THỊ CÁC TAB KHÁC
          facetItems.length === 0 ? (
            <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl shadow-sm text-slate-500">
              Không tìm thấy dữ liệu.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {facetItems.map((item) => {
                const targetId = Number(item.id);
                let isSubscribed = false;
                let actionText = "Theo dõi";
                let handleAction = () => {};

                if (activeTab === "authors") {
                  isSubscribed = followedAuthorIds.has(targetId);
                  handleAction = () =>
                    toggleFollow(targetId, "Author", setFollowedAuthorIds);
                } else if (activeTab === "journals") {
                  isSubscribed = followedJournalIds.has(targetId);
                  handleAction = () =>
                    toggleFollow(targetId, "Journal", setFollowedJournalIds);
                } else if (activeTab === "topics") {
                  isSubscribed = followedTopicIds.has(targetId);
                  handleAction = () =>
                    toggleFollow(
                      targetId,
                      "ResearchTopic",
                      setFollowedTopicIds,
                    );
                } else if (activeTab === "keywords") {
                  isSubscribed = bookmarkedKeywordIds.has(targetId);
                  actionText = isSubscribed ? "Đã lưu từ khóa" : "Lưu từ khóa";
                  handleAction = () => toggleKeywordBookmark(targetId);
                }

                if (activeTab !== "keywords") {
                  actionText = isSubscribed ? "Đang theo dõi" : "Theo dõi";
                }

                return (
                  <div
                    key={item.id}
                    className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all flex justify-between items-center gap-4"
                  >
                    <div className="min-w-0 flex-1">
                      {activeTab === "journals" ? (
                        <Link
                          to={`/journal/${encodeURIComponent(item.name)}`}
                          className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors line-clamp-2 leading-snug"
                        >
                          {item.name}
                        </Link>
                      ) : (
                        <p className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug">
                          {activeTab === "keywords"
                            ? `#${item.name}`
                            : item.name}
                        </p>
                      )}
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-medium">
                        <span className="material-symbols-outlined text-[14px]">
                          article
                        </span>{" "}
                        {item.paperCount} bài báo liên quan
                      </p>
                    </div>
                    <button
                      onClick={handleAction}
                      className={`text-xs font-bold py-2 px-3.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer border ${
                        isSubscribed
                          ? `${theme.lightBg} ${theme.primaryText} ${theme.primaryBorder}`
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {isSubscribed
                          ? "check"
                          : activeTab === "keywords"
                            ? "bookmark_add"
                            : "person_add"}
                      </span>
                      {actionText}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Phân trang (Pagination) */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 disabled:opacity-50 flex items-center cursor-pointer disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-sm">
                  chevron_left
                </span>
              </button>

              {Array.from({ length: totalPages }, (_, idx) => {
                const pageNum = idx + 1;
                if (
                  Math.abs(page - pageNum) > 2 &&
                  pageNum !== 1 &&
                  pageNum !== totalPages
                )
                  return null;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3.5 py-2 rounded-lg text-sm font-bold transition-all min-w-[36px] cursor-pointer ${
                      page === pageNum
                        ? `${theme.primaryBg} text-white shadow-sm`
                        : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 disabled:opacity-50 flex items-center cursor-pointer disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-sm">
                  chevron_right
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SharedExplore;
