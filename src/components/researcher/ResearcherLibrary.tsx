import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { api, type BookmarkItem, type WatchlistItem, type PaperFacetItem } from "../../services/api";

type LibTab = "bookmarks" | "watchlist";

const TYPE_LABEL: Record<string, string> = {
  Keyword: "Từ khóa",
  Journal: "Tạp chí",
  ResearchTopic: "Chủ đề",
};

const TYPE_COLOR: Record<string, string> = {
  Keyword: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Journal: "bg-purple-50 text-purple-700 border-purple-200",
  ResearchTopic: "bg-indigo-50 text-indigo-700 border-indigo-200",
};

const TYPE_ICON: Record<string, string> = {
  Keyword: "sell",
  Journal: "menu_book",
  ResearchTopic: "hub",
};

export const ResearcherLibrary = () => {
  const [activeTab, setActiveTab] = useState<LibTab>("bookmarks");
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Add-to-watchlist panel state
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [addType, setAddType] = useState<"Keyword" | "Journal" | "ResearchTopic">("Keyword");
  const [addQuery, setAddQuery] = useState("");
  const [addResults, setAddResults] = useState<PaperFacetItem[]>([]);
  const [addLoading, setAddLoading] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setIsLoading(true);
      const [bmRes, wlRes] = await Promise.all([
        api.getBookmarks(),
        api.getWatchlist(),
      ]);
      const bmItems: any = bmRes?.data || bmRes;
      const wlItems: any = wlRes?.data || wlRes;
      setBookmarks(Array.isArray(bmItems) ? bmItems : bmItems?.items || []);
      setWatchlist(Array.isArray(wlItems) ? wlItems : wlItems?.items || []);
    } catch (error) {
      console.error("Lỗi tải dữ liệu thư viện:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveBookmark = async (targetId: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài báo này khỏi thư viện?")) return;
    try {
      await api.toggleBookmark(targetId, "Paper");
      setBookmarks((prev) => prev.filter((item) => item.targetId !== targetId));
    } catch {
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  const handleRemoveWatchlist = async (item: WatchlistItem) => {
    if (!window.confirm(`Bỏ theo dõi "${item.name}"?`)) return;
    try {
      await api.removeFromWatchlist(item.targetType, item.targetId);
      setWatchlist((prev) =>
        prev.filter((w) => !(w.targetId === item.targetId && w.targetType === item.targetType)),
      );
    } catch {
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  // Build a set of already-watched keys for quick lookup
  const watchedKeys = new Set(watchlist.map((w) => `${w.targetType}-${w.targetId}`));

  const searchFacets = useCallback(
    async (q: string, type: "Keyword" | "Journal" | "ResearchTopic") => {
      setAddLoading(true);
      try {
        const queryVal = q.trim() || undefined;
        let res: any;
        if (type === "Keyword") res = await api.getKeywordFacets(queryVal, 1, 15);
        else if (type === "Journal") res = await api.getJournalFacets(queryVal, 1, 15);
        else res = await api.getTopicFacets(queryVal, 1, 15);
        const items = res?.data?.items || res?.items || [];
        setAddResults(items);
      } catch {
        setAddResults([]);
      } finally {
        setAddLoading(false);
      }
    },
    [],
  );

  const handleAddQueryChange = (value: string) => {
    setAddQuery(value);
    setShowDropdown(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      searchFacets(value, addType);
    }, 350);
  };

  const handleTypeChange = (type: "Keyword" | "Journal" | "ResearchTopic") => {
    setAddType(type);
    setAddResults([]);
    setAddQuery("");
    setShowDropdown(true);
    searchFacets("", type);
  };

  const handleFocus = () => {
    setShowDropdown(true);
    searchFacets(addQuery, addType);
  };

  const handleAddToWatchlist = async (item: PaperFacetItem) => {
    setAddingId(item.id);
    try {
      await api.addToWatchlist(Number(item.id), addType);
      // Optimistically add to local watchlist
      setWatchlist((prev) => [
        ...prev,
        {
          id: Date.now(),
          targetId: Number(item.id),
          targetType: addType,
          name: item.name,
          paperCount: item.paperCount,
          createdAt: new Date().toISOString(),
        },
      ]);
    } catch {
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setAddingId(null);
    }
  };

  const tabs: { key: LibTab; label: string; count: number; icon: string }[] = [
    { key: "bookmarks", label: "Bài báo đã lưu", count: bookmarks.length, icon: "library_books" },
    { key: "watchlist", label: "Danh sách theo dõi", count: watchlist.length, icon: "visibility" },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#002045] flex items-center gap-2">
          <span className="material-symbols-outlined text-blue-600">library_books</span>
          Thư viện Nghiên cứu
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold border-b-2 transition-all ${
              activeTab === tab.key
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
            {tab.label}
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
              activeTab === tab.key ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-500"
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40 text-slate-400">
          <span className="material-symbols-outlined animate-spin text-3xl">sync</span>
        </div>
      ) : activeTab === "bookmarks" ? (
        bookmarks.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-16 flex flex-col items-center text-center shadow-sm">
            <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">search_off</span>
            <h3 className="text-xl font-bold text-slate-700 mb-2">Thư viện trống</h3>
            <p className="text-slate-500 max-w-md mb-6">
              Không gian nghiên cứu của bạn chưa có tài liệu nào. Hãy sử dụng
              thanh tìm kiếm để thu thập các bài báo khoa học.
            </p>
            <Link to="/researcher/explore" className="px-6 py-2 bg-[#002045] text-white rounded-lg font-medium hover:bg-blue-900 transition-colors">
              Khám phá bài báo mới
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {bookmarks.map((paper) => (
              <div key={paper.bookmarkId} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all relative group">
                <h3 className="text-lg font-bold text-[#002045] pr-10 mb-2 leading-tight">
                  {paper.title || "Tài liệu chưa có tiêu đề"}
                </h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600 mb-3">
                  {paper.journalName && (
                    <span className="flex items-center gap-1 font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      <span className="material-symbols-outlined text-sm">article</span>
                      {paper.journalName}
                    </span>
                  )}
                  {paper.publicationYear && (
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">calendar_today</span>
                      {paper.publicationYear}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">format_quote</span>
                    {paper.citationCount || 0} trích dẫn
                  </span>
                </div>
                {paper.authors && paper.authors.length > 0 && (
                  <p className="text-sm text-slate-500 mb-4 line-clamp-1">
                    <span className="font-medium text-slate-700">Tác giả:</span> {paper.authors.join(", ")}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-2 pt-4 border-t border-slate-50">
                  <Link to={`/researcher/paper/${paper.targetId}`} className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                    Đọc chi tiết
                  </Link>
                  <button
                    onClick={() => handleRemoveBookmark(paper.targetId)}
                    className="px-4 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors ml-auto flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                    Bỏ lưu
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div>
          {/* Add to Watchlist Button */}
          <button
            onClick={() => setShowAddPanel((v) => !v)}
            className={`mb-5 flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              showAddPanel
                ? "bg-slate-100 text-slate-600 border border-slate-300"
                : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {showAddPanel ? "close" : "add"}
            </span>
            {showAddPanel ? "Đóng" : "Thêm vào danh sách theo dõi"}
          </button>

          {/* Add Panel */}
          {showAddPanel && (
            <div className="bg-white rounded-xl border border-indigo-100 shadow-sm p-5 mb-6">
              {/* Type selector */}
              <div className="flex gap-2 mb-4">
                {(["Keyword", "Journal", "ResearchTopic"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => handleTypeChange(t)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold border transition-all ${
                      addType === t
                        ? TYPE_COLOR[t] + " border-current"
                        : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">{TYPE_ICON[t]}</span>
                    {TYPE_LABEL[t]}
                  </button>
                ))}
              </div>

              {/* Search input with absolute dropdown suggestions */}
              <div className="relative mb-4">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
                <input
                  type="text"
                  value={addQuery}
                  onChange={(e) => handleAddQueryChange(e.target.value)}
                  onFocus={handleFocus}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                  placeholder={`Tìm ${TYPE_LABEL[addType].toLowerCase()}...`}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                />

                {/* Dropdown Suggestions */}
                {showDropdown && (addResults.length > 0 || addLoading) && (
                  <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-72 overflow-y-auto p-2 space-y-1">
                    {addLoading ? (
                      <div className="flex justify-center py-4 text-slate-400">
                        <span className="material-symbols-outlined animate-spin">sync</span>
                      </div>
                    ) : (
                      addResults.map((item) => {
                        const alreadyAdded = watchedKeys.has(`${addType}-${item.id}`);
                        return (
                          <div
                            key={item.id}
                            className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${TYPE_COLOR[addType]}`}>
                                <span className="material-symbols-outlined text-[16px]">{TYPE_ICON[addType]}</span>
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-slate-800 text-sm truncate">{item.name}</p>
                                <span className="text-xs text-slate-400">{item.paperCount.toLocaleString()} bài báo</span>
                              </div>
                            </div>
                            {alreadyAdded ? (
                              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">check</span>
                                Đã thêm
                              </span>
                            ) : (
                              <button
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => handleAddToWatchlist(item)}
                                disabled={addingId === item.id}
                                className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-200 hover:bg-indigo-100 transition-colors flex items-center gap-1 disabled:opacity-50"
                              >
                                <span className="material-symbols-outlined text-[14px]">
                                  {addingId === item.id ? "sync" : "add"}
                                </span>
                                Thêm
                              </button>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Watchlist items */}
          {watchlist.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-16 flex flex-col items-center text-center shadow-sm">
              <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">visibility_off</span>
              <h3 className="text-xl font-bold text-slate-700 mb-2">Chưa theo dõi mục nào</h3>
              <p className="text-slate-500 max-w-md">
                Sử dụng nút &quot;Thêm vào danh sách theo dõi&quot; bên trên để tìm và thêm từ khóa, tạp chí hoặc chủ đề.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {watchlist.map((item) => (
                <div key={`${item.targetType}-${item.targetId}`} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${TYPE_COLOR[item.targetType] || "bg-slate-50 text-slate-600 border-slate-200"}`}>
                      <span className="material-symbols-outlined text-[20px]">{TYPE_ICON[item.targetType] || "label"}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 truncate">{item.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wide ${TYPE_COLOR[item.targetType] || ""}`}>
                          {TYPE_LABEL[item.targetType] || item.targetType}
                        </span>
                        {item.paperCount !== undefined && (
                          <span className="text-xs text-slate-400">{item.paperCount.toLocaleString()} bài báo</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveWatchlist(item)}
                    className="shrink-0 w-8 h-8 rounded-full bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 flex items-center justify-center transition-colors border border-slate-200 hover:border-red-200"
                    title="Bỏ theo dõi"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResearcherLibrary;
