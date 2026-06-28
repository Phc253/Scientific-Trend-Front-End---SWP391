import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import type { BookmarkItem, FollowItem } from "../services/api";
import { useAuth } from "../context/AuthContext";

const MyLibrary: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<"bookmarks" | "follows">("bookmarks");
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [follows, setFollows] = useState<FollowItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLibraryData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [bookmarksRes, followsRes] = await Promise.all([
        api.getMyBookmarks(),
        api.getMyFollows(),
      ]);

      if (bookmarksRes.success) {
        setBookmarks(bookmarksRes.data || []);
      }
      if (followsRes.success) {
        setFollows(followsRes.data || []);
      }
    } catch (err: any) {
      setError(err.message || "Không thể tải dữ liệu thư viện cá nhân.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
      return;
    }

    if (isAuthenticated) {
      fetchLibraryData();
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleRemoveBookmark = async (targetId: number, targetType: "Paper" | "Keyword") => {
    try {
      const result = await api.toggleBookmark(targetId, targetType);
      if (result.success && !result.isBookmarked) {
        setBookmarks((prev) =>
          prev.filter((b) => !(b.targetId === targetId && b.targetType === targetType))
        );
      }
    } catch (err) {
      console.error("Lỗi khi xóa bookmark:", err);
    }
  };

  const handleUnfollow = async (
    targetId: number,
    targetType: "Author" | "Journal" | "ResearchTopic"
  ) => {
    try {
      const result = await api.toggleFollow(targetId, targetType);
      if (result.success && !result.isFollowed) {
        setFollows((prev) =>
          prev.filter((f) => !(f.targetId === targetId && f.targetType === targetType))
        );
      }
    } catch (err) {
      console.error("Lỗi khi hủy theo dõi:", err);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <div className="w-12 h-12 border-4 border-[#13696a] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-[#74777f] mt-4">Đang tải thư viện cá nhân của bạn...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center space-y-4 bg-white p-8 border border-[#ebeef0] rounded-lg shadow-sm">
        <span className="material-symbols-outlined text-5xl text-red-500">error</span>
        <h3 className="text-xl font-bold text-[#002045]">Đã xảy ra lỗi</h3>
        <p className="text-sm text-[#74777f]">{error}</p>
        <button
          onClick={fetchLibraryData}
          className="bg-[#002045] text-white px-6 py-2.5 rounded font-bold text-sm hover:opacity-95 transition-opacity cursor-pointer"
        >
          Thử lại
        </button>
      </div>
    );
  }

  const paperBookmarks = bookmarks.filter((b) => b.targetType.toLowerCase() === "paper");
  const keywordBookmarks = bookmarks.filter((b) => b.targetType.toLowerCase() === "keyword");
  const authorFollows = follows.filter((f) => f.targetType.toLowerCase() === "author");
  const journalFollows = follows.filter((f) => f.targetType.toLowerCase() === "journal");
  const topicFollows = follows.filter((f) => f.targetType.toLowerCase() === "researchtopic");

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
      {/* Tiêu đề trang */}
      <div>
        <h1 className="text-2xl font-bold text-[#002045]">Thư viện của tôi</h1>
        <p className="text-xs text-[#74777f] mt-1">
          Quản lý toàn bộ tài liệu nghiên cứu đã lưu trữ và các đối tượng đang theo dõi
        </p>
      </div>

      {/* Tabs navigation */}
      <div className="flex gap-2 border-b border-[#ebeef0] text-sm font-medium">
        <button
          onClick={() => setActiveTab("bookmarks")}
          className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === "bookmarks"
              ? "border-[#13696a] text-[#13696a] font-bold"
              : "border-transparent text-[#43474e] hover:text-[#181c1e]"
          }`}
        >
          <span className="material-symbols-outlined text-sm">bookmark</span>
          Tài liệu đã lưu ({bookmarks.length})
        </button>

        <button
          onClick={() => setActiveTab("follows")}
          className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === "follows"
              ? "border-[#13696a] text-[#13696a] font-bold"
              : "border-transparent text-[#43474e] hover:text-[#181c1e]"
          }`}
        >
          <span className="material-symbols-outlined text-sm">notifications</span>
          Đang theo dõi ({follows.length})
        </button>
      </div>

      {/* Nội dung Tab Bookmarks */}
      {activeTab === "bookmarks" && (
        <div className="space-y-4">
          {bookmarks.length === 0 ? (
            <div className="text-center py-20 bg-white border border-[#ebeef0] rounded-lg text-[#74777f]">
              <span className="material-symbols-outlined text-5xl mb-3 text-[#c4c6cf]">
                bookmark_border
              </span>
              <p className="text-sm">Bạn chưa lưu tài liệu nào vào thư viện.</p>
              <Link
                to="/search"
                className="mt-4 inline-flex items-center gap-1 bg-[#13696a] hover:opacity-95 text-white px-5 py-2.5 rounded text-xs font-bold transition-all"
              >
                Khám phá tài liệu ngay
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Renders Bookmarked Papers */}
              {paperBookmarks.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-[#43474e] uppercase tracking-wider px-1">
                    Bài viết khoa học ({paperBookmarks.length})
                  </h3>

                  {paperBookmarks.map((b) => (
                    <div
                      key={b.bookmarkId}
                      className="bg-white p-6 rounded-lg border border-[#ebeef0] shadow-sm hover:border-[#13696a] transition-all duration-200 group flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                    >
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <Link
                          to={`/paper/${b.targetId}`}
                          className="text-base font-bold text-[#002045] group-hover:text-[#13696a] transition-colors line-clamp-2 leading-snug"
                        >
                          {b.title || "Bài viết không xác định"}
                        </Link>

                        <p className="text-xs text-[#43474e] font-medium truncate">
                          {b.authors && b.authors.length > 0
                            ? b.authors.join(", ")
                            : "Tác giả ẩn danh"}
                        </p>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#74777f]">
                          {b.journalName && (
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-xs">menu_book</span>
                              {b.journalName}
                            </span>
                          )}
                          {b.publicationYear && (
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-xs">
                                calendar_today
                              </span>
                              {b.publicationYear}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">grade</span>
                            Trích dẫn: {b.citationCount ?? 0}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemoveBookmark(b.targetId, "Paper")}
                        className="border border-red-200 text-red-600 hover:bg-red-50 py-2 px-4 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1 self-start md:self-auto"
                      >
                        <span className="material-symbols-outlined text-sm">bookmark_remove</span>
                        Gỡ bỏ
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Renders Bookmarked Keywords */}
              {keywordBookmarks.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-bold text-[#43474e] uppercase tracking-wider px-1">
                    Từ khóa nghiên cứu ({keywordBookmarks.length})
                  </h3>
                  <div className="flex flex-wrap gap-3 p-4 bg-white border border-[#ebeef0] rounded-lg shadow-sm">
                    {keywordBookmarks.map((b) => (
                      <div
                        key={b.bookmarkId}
                        className="bg-[#f1f4f6] text-[#43474e] pl-4 pr-2 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 border border-[#c4c6cf] hover:border-[#13696a] transition-all"
                      >
                        <span>#{b.keywordText || "Keyword"}</span>
                        <button
                          onClick={() => handleRemoveBookmark(b.targetId, "Keyword")}
                          className="text-[#74777f] hover:text-red-600 transition-colors cursor-pointer rounded-full p-0.5 hover:bg-[#e0e0e0] flex items-center justify-center"
                        >
                          <span className="material-symbols-outlined text-xs">close</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Nội dung Tab Followed Targets */}
      {activeTab === "follows" && (
        <div className="space-y-6">
          {follows.length === 0 ? (
            <div className="text-center py-20 bg-white border border-[#ebeef0] rounded-lg text-[#74777f]">
              <span className="material-symbols-outlined text-5xl mb-3 text-[#c4c6cf]">
                person_outline
              </span>
              <p className="text-sm">Bạn chưa theo dõi tác giả, tạp chí hoặc chủ đề nào.</p>
              <Link
                to="/search"
                className="mt-4 inline-flex items-center gap-1 bg-[#13696a] hover:opacity-95 text-white px-5 py-2.5 rounded text-xs font-bold transition-all"
              >
                Tìm kiếm đối tượng
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Renders Followed Authors */}
              {authorFollows.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-[#43474e] uppercase tracking-wider px-1">
                    Tác giả nghiên cứu ({authorFollows.length})
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {authorFollows.map((f) => (
                      <div
                        key={f.followId}
                        className="bg-white p-5 rounded-lg border border-[#ebeef0] shadow-sm hover:border-[#13696a] transition-all flex justify-between items-center gap-4"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-[#181c1e] truncate">
                            {f.authorName || "Tác giả ẩn danh"}
                          </p>
                          <p className="text-xs text-[#74777f] mt-1">
                            Tổng số công bố: <strong>{f.paperCount ?? 0} bài báo</strong>
                          </p>
                        </div>

                        <button
                          onClick={() => handleUnfollow(f.targetId, "Author")}
                          className="border border-[#c4c6cf] text-[#43474e] hover:bg-red-50 hover:text-red-700 hover:border-red-200 py-1.5 px-3 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-xs">person_remove</span>
                          Hủy theo dõi
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Renders Followed Journals */}
              {journalFollows.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-[#43474e] uppercase tracking-wider px-1">
                    Tạp chí khoa học ({journalFollows.length})
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {journalFollows.map((f) => (
                      <div
                        key={f.followId}
                        className="bg-white p-5 rounded-lg border border-[#ebeef0] shadow-sm hover:border-[#13696a] transition-all flex justify-between items-center gap-4"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-[#181c1e] line-clamp-2 leading-snug">
                            {f.journalName || "Tạp chí không tên"}
                          </p>
                          <p className="text-xs text-[#74777f] mt-1">Đang hoạt động</p>
                        </div>

                        <button
                          onClick={() => handleUnfollow(f.targetId, "Journal")}
                          className="border border-[#c4c6cf] text-[#43474e] hover:bg-red-50 hover:text-red-700 hover:border-red-200 py-1.5 px-3 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-xs">notifications_off</span>
                          Hủy theo dõi
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Renders Followed Topics */}
              {topicFollows.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-[#43474e] uppercase tracking-wider px-1">
                    Chủ đề nghiên cứu ({topicFollows.length})
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {topicFollows.map((f) => (
                      <div
                        key={f.followId}
                        className="bg-white p-5 rounded-lg border border-[#ebeef0] shadow-sm hover:border-[#13696a] transition-all flex justify-between items-center gap-4"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-[#181c1e] line-clamp-2 leading-snug">
                            {f.topicName || "Chủ đề không tên"}
                          </p>
                          <p className="text-xs text-[#74777f] mt-1">Đang hoạt động</p>
                        </div>

                        <button
                          onClick={() => handleUnfollow(f.targetId, "ResearchTopic")}
                          className="border border-[#c4c6cf] text-[#43474e] hover:bg-red-50 hover:text-red-700 hover:border-red-200 py-1.5 px-3 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-xs">notifications_off</span>
                          Hủy theo dõi
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyLibrary;
