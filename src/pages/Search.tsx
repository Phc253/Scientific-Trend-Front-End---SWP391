import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import type { Paper, PaperFacetItem } from "../services/api";
import { useAuth } from "../context/AuthContext";

type SearchTab = "papers" | "authors" | "journals" | "topics" | "keywords";

const Search: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Tab điều hướng khám phá
  const [activeTab, setActiveTab] = useState<SearchTab>("papers");

  // Ô tìm kiếm chung
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // Bộ lọc nâng cao cho bài viết (Papers)
  const [paperAuthor, setPaperAuthor] = useState("");
  const [paperJournal, setPaperJournal] = useState("");
  const [paperYear, setPaperYear] = useState<number | "">("");

  // Phân trang chung
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  // Kết quả truy vấn
  const [papers, setPapers] = useState<Paper[]>([]);
  const [facetItems, setFacetItems] = useState<PaperFacetItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lưu trữ IDs trạng thái tương tác từ User
  const [bookmarkedPaperIds, setBookmarkedPaperIds] = useState<Set<number>>(new Set());
  const [bookmarkedKeywordIds, setBookmarkedKeywordIds] = useState<Set<number>>(new Set());
  const [followedAuthorIds, setFollowedAuthorIds] = useState<Set<number>>(new Set());
  const [followedJournalIds, setFollowedJournalIds] = useState<Set<number>>(new Set());
  const [followedTopicIds, setFollowedTopicIds] = useState<Set<number>>(new Set());

  // Lấy danh sách Bookmarks & Follows của người dùng
  const fetchBookmarksAndFollows = async () => {
    if (!isAuthenticated) {
      setBookmarkedPaperIds(new Set());
      setBookmarkedKeywordIds(new Set());
      setFollowedAuthorIds(new Set());
      setFollowedJournalIds(new Set());
      setFollowedTopicIds(new Set());
      return;
    }

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
      console.error("Lỗi khi đồng bộ danh sách yêu thích:", err);
    }
  };

  // Truy vấn dữ liệu chính
  const fetchData = async (currentPage: number) => {
    setIsLoading(true);
    setError(null);

    const query = searchQuery.trim() || undefined;

    try {
      if (activeTab === "papers") {
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
        let response;
        if (activeTab === "authors") {
          response = await api.getAuthorFacets(query, currentPage, pageSize);
        } else if (activeTab === "journals") {
          response = await api.getJournalFacets(query, currentPage, pageSize);
        } else if (activeTab === "topics") {
          response = await api.getTopicFacets(query, currentPage, pageSize);
        } else {
          response = await api.getKeywordFacets(query, currentPage, pageSize);
        }

        setFacetItems(response.items || []);
        setTotalCount(response.totalCount || 0);
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

  // Kích hoạt tìm kiếm mới khi submit form
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchData(1);
  };

  // Thay đổi trang
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > Math.ceil(totalCount / pageSize)) return;
    setPage(newPage);
    fetchData(newPage);
  };

  // Thay đổi Tab
  const handleTabChange = (tab: SearchTab) => {
    setActiveTab(tab);
    setPage(1);
    setSearchQuery("");
    setPapers([]);
    setFacetItems([]);
    setTotalCount(0);
  };

  // Chạy truy vấn khi đổi Tab hoặc thay đổi auth
  useEffect(() => {
    fetchBookmarksAndFollows();
    fetchData(1);
  }, [activeTab, isAuthenticated]);

  // Hành động Tương tác (Toggle Bookmark & Follows)
  const togglePaperBookmark = async (paperId: number) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      const res = await api.toggleBookmark(paperId, "Paper");
      if (res.success) {
        setBookmarkedPaperIds((prev) => {
          const next = new Set(prev);
          if (res.isBookmarked) next.add(paperId);
          else next.delete(paperId);
          return next;
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleKeywordBookmark = async (keywordId: number) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      const res = await api.toggleBookmark(keywordId, "Keyword");
      if (res.success) {
        setBookmarkedKeywordIds((prev) => {
          const next = new Set(prev);
          if (res.isBookmarked) next.add(keywordId);
          else next.delete(keywordId);
          return next;
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleAuthorFollow = async (authorId: number) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      const res = await api.toggleFollow(authorId, "Author");
      if (res.success) {
        setFollowedAuthorIds((prev) => {
          const next = new Set(prev);
          if (res.isFollowed) next.add(authorId);
          else next.delete(authorId);
          return next;
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleJournalFollow = async (journalId: number) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      const res = await api.toggleFollow(journalId, "Journal");
      if (res.success) {
        setFollowedJournalIds((prev) => {
          const next = new Set(prev);
          if (res.isFollowed) next.add(journalId);
          else next.delete(journalId);
          return next;
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTopicFollow = async (topicId: number) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      const res = await api.toggleFollow(topicId, "ResearchTopic");
      if (res.success) {
        setFollowedTopicIds((prev) => {
          const next = new Set(prev);
          if (res.isFollowed) next.add(topicId);
          else next.delete(topicId);
          return next;
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  // Tiêu đề gợi ý tìm kiếm theo Tab
  const getSearchPlaceholder = () => {
    switch (activeTab) {
      case "papers":
        return "Tìm kiếm bài báo theo tiêu đề, tóm tắt hoặc nội dung nghiên cứu...";
      case "authors":
        return "Tìm kiếm tác giả nghiên cứu trong hệ thống...";
      case "journals":
        return "Tìm kiếm tạp chí khoa học học thuật...";
      case "topics":
        return "Tìm kiếm chủ đề nghiên cứu (ví dụ: Machine Learning)...";
      case "keywords":
        return "Tìm kiếm từ khóa khoa học phổ biến...";
      default:
        return "Tìm kiếm...";
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 5 Tab điều hướng danh mục khám phá */}
      <div className="flex flex-wrap gap-2 border-b border-[#ebeef0] text-sm font-semibold">
        {[
          { key: "papers", label: "Bài báo khoa học", icon: "description" },
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
                ? "border-[#13696a] text-[#13696a] font-bold"
                : "border-transparent text-[#43474e] hover:text-[#181c1e] hover:border-[#c4c6cf]"
            }`}
          >
            <span className="material-symbols-outlined text-base">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Form tìm kiếm từ khóa/tiêu đề */}
      <form
        onSubmit={handleSearchSubmit}
        className={`bg-white p-6 rounded-lg border transition-all duration-200 ${
          isFocused ? "ring-2 ring-[#a2eded] border-[#13696a]" : "border-[#ebeef0] shadow-sm"
        }`}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-4 top-3.5 text-[#43474e]">
              search
            </span>
            <input
              type="text"
              placeholder={getSearchPlaceholder()}
              className="w-full pl-12 pr-4 py-3 bg-[#f1f4f6] border border-[#c4c6cf] rounded focus:outline-none transition-all text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#002045] hover:opacity-95 text-white px-8 py-3 rounded font-medium transition-all text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow"
          >
            <span className="material-symbols-outlined text-sm">search</span>
            {isLoading ? "Đang tìm..." : "Tìm kiếm"}
          </button>
        </div>
      </form>

      {/* Grid nội dung */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Bộ lọc nâng cao (chỉ hiển thị cho Tab Papers) */}
        {activeTab === "papers" ? (
          <div className="bg-white p-5 rounded-lg border border-[#ebeef0] shadow-sm h-fit space-y-5">
            <div className="flex items-center gap-2 border-b border-[#ebeef0] pb-3">
              <span className="material-symbols-outlined text-[#002045] text-sm">
                filter_list
              </span>
              <h3 className="font-bold text-xs text-[#002045] uppercase tracking-wider">
                Bộ lọc tìm kiếm
              </h3>
            </div>

            {/* Lọc theo tác giả */}
            <div>
              <label className="block text-xs font-bold text-[#43474e] uppercase tracking-wide mb-1.5">
                Tác giả (Author)
              </label>
              <input
                type="text"
                placeholder="Nhập tên tác giả..."
                className="w-full p-2.5 bg-white border border-[#c4c6cf] rounded text-sm text-[#181c1e] focus:outline-none focus:border-[#13696a] transition-all"
                value={paperAuthor}
                onChange={(e) => setPaperAuthor(e.target.value)}
              />
            </div>

            {/* Lọc theo tạp chí */}
            <div>
              <label className="block text-xs font-bold text-[#43474e] uppercase tracking-wide mb-1.5">
                Tạp chí (Journal)
              </label>
              <input
                type="text"
                placeholder="Nhập tên tạp chí..."
                className="w-full p-2.5 bg-white border border-[#c4c6cf] rounded text-sm text-[#181c1e] focus:outline-none focus:border-[#13696a] transition-all"
                value={paperJournal}
                onChange={(e) => setPaperJournal(e.target.value)}
              />
            </div>

            {/* Lọc theo năm xuất bản */}
            <div>
              <label className="block text-xs font-bold text-[#43474e] uppercase tracking-wide mb-1.5">
                Năm xuất bản (Year)
              </label>
              <input
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                placeholder="Ví dụ: 2024"
                className="w-full p-2.5 bg-white border border-[#c4c6cf] rounded text-sm text-[#181c1e] focus:outline-none focus:border-[#13696a] transition-all"
                value={paperYear}
                onChange={(e) => setPaperYear(e.target.value ? Number(e.target.value) : "")}
              />
            </div>

            <button
              onClick={() => {
                setPage(1);
                fetchData(1);
              }}
              disabled={isLoading}
              className="w-full bg-[#13696a] text-white hover:bg-[#0f5455] py-2.5 rounded text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">tune</span>
              Áp dụng bộ lọc
            </button>
          </div>
        ) : (
          /* Trình bày thông tin hướng dẫn ở cột trái khi xem các Tab khác */
          <div className="bg-white p-5 rounded-lg border border-[#ebeef0] shadow-sm h-fit space-y-4">
            <div className="flex items-center gap-2 border-b border-[#ebeef0] pb-3">
              <span className="material-symbols-outlined text-[#002045] text-sm">info</span>
              <h3 className="font-bold text-xs text-[#002045] uppercase tracking-wider">
                Hướng dẫn
              </h3>
            </div>
            <p className="text-xs text-[#43474e] leading-relaxed">
              Bạn có thể tìm kiếm dữ liệu khoa học đã chỉ mục trong hệ thống. Hãy nhấp theo dõi hoặc
              lưu lại các đối tượng bạn quan tâm để nhận các bản tin phân tích xu hướng mới nhất trong
              thư viện của bạn.
            </p>
          </div>
        )}

        {/* Danh sách kết quả chính */}
        <div className="lg:col-span-3 space-y-4">
          <div className="text-sm text-[#43474e] px-1 flex justify-between items-center">
            <span>
              Đã tìm thấy <strong>{totalCount}</strong> kết quả phù hợp
            </span>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded text-sm">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white border border-[#ebeef0] rounded-lg">
              <div className="w-10 h-10 border-4 border-[#13696a] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-[#74777f] mt-4">Đang tải kết quả...</p>
            </div>
          ) : activeTab === "papers" ? (
            /* Render danh sách Papers */
            papers.length === 0 ? (
              <div className="text-center py-20 bg-white border border-[#ebeef0] rounded-lg text-[#74777f]">
                <span className="material-symbols-outlined text-5xl mb-3 text-[#c4c6cf]">
                  sentiment_dissatisfied
                </span>
                <p className="text-sm">Không tìm thấy bài báo nào phù hợp.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {papers.map((paper) => {
                  const isBookmarked = bookmarkedPaperIds.has(paper.paperId);
                  return (
                    <div
                      key={paper.paperId}
                      className="bg-white p-6 rounded-lg border border-[#ebeef0] shadow-sm hover:border-[#13696a] hover:shadow-md transition-all duration-200 group"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-2 flex-1">
                          <Link
                            to={`/paper/${paper.paperId}`}
                            className="text-lg font-bold text-[#002045] group-hover:text-[#13696a] transition-colors line-clamp-2 leading-snug"
                          >
                            {paper.title}
                          </Link>

                          <p className="text-sm text-[#43474e] font-medium">
                            {paper.authors && paper.authors.length > 0
                              ? paper.authors.join(", ")
                              : "Tác giả ẩn danh"}
                          </p>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#74777f]">
                            {paper.journal && (
                              <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">
                                  menu_book
                                </span>
                                {paper.journal}
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
                              <span className="material-symbols-outlined text-sm">grade</span>
                              Trích dẫn: {paper.citationCount ?? 0}
                            </span>
                          </div>
                        </div>

                        {/* Nút toggle Bookmark Paper */}
                        <button
                          onClick={() => togglePaperBookmark(paper.paperId)}
                          className={`p-2.5 rounded-full transition-all flex items-center justify-center cursor-pointer ${
                            isBookmarked
                              ? "text-[#13696a] bg-[#e8f5e9]"
                              : "text-[#43474e] hover:text-[#13696a] hover:bg-[#f1f4f6]"
                          }`}
                          title={isBookmarked ? "Bỏ lưu bài báo" : "Lưu bài báo"}
                        >
                          <span
                            className="material-symbols-outlined"
                            style={{ fontVariationSettings: isBookmarked ? "'FILL' 1" : "" }}
                          >
                            bookmark
                          </span>
                        </button>
                      </div>

                      {/* Chips Từ khóa (Keywords) */}
                      {paper.keywords && paper.keywords.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {paper.keywords.map((kw, idx) => (
                            <span
                              key={idx}
                              className="bg-[#f1f4f6] text-[#43474e] px-3 py-1 rounded text-xs font-semibold tracking-wide"
                            >
                              {kw}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            /* Render danh sách Facets (Authors, Journals, Topics, Keywords) */
            facetItems.length === 0 ? (
              <div className="text-center py-20 bg-white border border-[#ebeef0] rounded-lg text-[#74777f]">
                <span className="material-symbols-outlined text-5xl mb-3 text-[#c4c6cf]">
                  sentiment_dissatisfied
                </span>
                <p className="text-sm">Không tìm thấy dữ liệu phù hợp.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {facetItems.map((item) => {
                  const targetId = Number(item.id);
                  let isSubscribed = false;
                  let actionText = "Theo dõi";
                  let handleAction = () => {};
                  let isKeyword = activeTab === "keywords";

                  if (activeTab === "authors") {
                    isSubscribed = followedAuthorIds.has(targetId);
                    actionText = isSubscribed ? "Đang theo dõi" : "Theo dõi";
                    handleAction = () => toggleAuthorFollow(targetId);
                  } else if (activeTab === "journals") {
                    isSubscribed = followedJournalIds.has(targetId);
                    actionText = isSubscribed ? "Đang theo dõi" : "Theo dõi";
                    handleAction = () => toggleJournalFollow(targetId);
                  } else if (activeTab === "topics") {
                    isSubscribed = followedTopicIds.has(targetId);
                    actionText = isSubscribed ? "Đang theo dõi" : "Theo dõi";
                    handleAction = () => toggleTopicFollow(targetId);
                  } else if (activeTab === "keywords") {
                    isSubscribed = bookmarkedKeywordIds.has(targetId);
                    actionText = isSubscribed ? "Đã lưu từ khóa" : "Lưu từ khóa";
                    handleAction = () => toggleKeywordBookmark(targetId);
                  }

                  return (
                    <div
                      key={item.id}
                      className="bg-white p-5 rounded-lg border border-[#ebeef0] shadow-sm hover:border-[#13696a] transition-all flex justify-between items-center gap-4"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-[#181c1e] line-clamp-2 leading-snug">
                          {isKeyword ? `#${item.name}` : item.name}
                        </p>
                        <p className="text-xs text-[#74777f] mt-1 flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">description</span>
                          Công bộ liên quan: <strong>{item.paperCount} bài báo</strong>
                        </p>
                      </div>

                      {/* Nút bấm Action tương ứng với loại Facet */}
                      <button
                        onClick={handleAction}
                        className={`text-xs font-bold py-2 px-3.5 rounded flex items-center gap-1.5 transition-all cursor-pointer ${
                          isSubscribed
                            ? "bg-[#e0f2f1] text-[#13696a] border border-[#a2eded]"
                            : "border border-[#002045] text-[#002045] hover:bg-[#f1f4f6]"
                        }`}
                      >
                        <span className="material-symbols-outlined text-xs">
                          {isSubscribed ? "check" : isKeyword ? "bookmark" : "person_add"}
                        </span>
                        {actionText}
                      </button>
                    </div>
                  );
                })}
              </div>
            )
          )}

          {/* Phân trang (Pagination) */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="p-2 border border-[#c4c6cf] rounded hover:bg-[#f1f4f6] text-[#43474e] disabled:opacity-50 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed flex items-center"
              >
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>

              {Array.from({ length: totalPages }, (_, idx) => {
                const pageNum = idx + 1;
                // Chỉ hiển thị tối đa 5 trang xung quanh trang hiện tại để tránh tràn màn hình
                if (Math.abs(page - pageNum) > 2 && pageNum !== 1 && pageNum !== totalPages) {
                  return null;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1.5 rounded text-sm font-semibold transition-all cursor-pointer min-w-8 ${
                      page === pageNum
                        ? "bg-[#002045] text-white"
                        : "border border-[#c4c6cf] text-[#43474e] hover:bg-[#f1f4f6]"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="p-2 border border-[#c4c6cf] rounded hover:bg-[#f1f4f6] text-[#43474e] disabled:opacity-50 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed flex items-center"
              >
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
