import React, { useState, useEffect } from "react";
import { api, type BookmarkItem, type FollowItem } from "../../services/api";
import { useNavigate } from "react-router-dom";

type LibraryTab = "bookmarks" | "follows";

const SharedLibrary: React.FC = () => {
  const [activeTab, setActiveTab] = useState<LibraryTab>("bookmarks");

  // States lưu dữ liệu
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [follows, setFollows] = useState<FollowItem[]>([]);
  const [loading, setLoading] = useState(true);

  const role =
    localStorage.getItem("userRoles") ||
    localStorage.getItem("actorType") ||
    "";
  const isLecturer = role.includes("Lecturer");
  const basePath = isLecturer ? "/lecturer" : "/student";

  const theme = {
    primaryBg: isLecturer ? "bg-emerald-600" : "bg-blue-600",
    primaryText: isLecturer ? "text-emerald-600" : "text-blue-600",
    primaryBorder: isLecturer ? "border-emerald-600" : "border-blue-600",
    lightBg: isLecturer ? "bg-emerald-50" : "bg-blue-50",
    primaryHover: isLecturer ? "hover:text-emerald-800" : "hover:text-blue-800",
  };

  const navigate = useNavigate();

  useEffect(() => {
    // Chỉ gọi API nếu đã đăng nhập (có token)
    const token = localStorage.getItem("token");
    if (token) {
      fetchLibraryData();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchLibraryData = async () => {
    setLoading(true);
    try {
      // SỬ DỤNG TÊN HÀM MỚI: getBookmarks() và getFollows()
      const [bookmarksRes, followsRes] = await Promise.all([
        api.getBookmarks(),
        api.getFollows(),
      ]);

      // Trích xuất dữ liệu an toàn (phòng trường hợp BE trả về object có chứa mảng items, hoặc trả về trực tiếp mảng)
      const bData = (bookmarksRes as any)?.data || bookmarksRes;
      const fData = (followsRes as any)?.data || followsRes;

      setBookmarks(Array.isArray(bData) ? bData : bData?.items || []);
      setFollows(Array.isArray(fData) ? fData : fData?.items || []);
    } catch (err) {
      console.error("Lỗi lấy dữ liệu thư viện:", err);
    } finally {
      setLoading(false);
    }
  };

  // Hàm bỏ lưu Bookmark (Paper, Keyword)
  const handleRemoveBookmark = async (
    id: number,
    type: "Paper" | "Keyword",
  ) => {
    if (window.confirm("Bạn có chắc muốn bỏ lưu mục này?")) {
      try {
        await api.toggleBookmark(id, type);
        setBookmarks((prev) =>
          prev.filter(
            (item) => !(item.targetId === id && item.targetType === type),
          ),
        );
      } catch (err) {
        alert("Có lỗi xảy ra khi xóa!");
      }
    }
  };

  // Hàm bỏ theo dõi Follow (Author, Journal, Topic)
  const handleRemoveFollow = async (
    id: number,
    type: "Author" | "Journal" | "ResearchTopic",
  ) => {
    if (window.confirm("Bạn có chắc muốn bỏ theo dõi?")) {
      try {
        await api.toggleFollow(id, type);
        setFollows((prev) =>
          prev.filter(
            (item) => !(item.targetId === id && item.targetType === type),
          ),
        );
      } catch (err) {
        alert("Có lỗi xảy ra khi bỏ theo dõi!");
      }
    }
  };

  // Lọc riêng Bài báo và Từ khóa
  const savedPapers = bookmarks.filter(
    (b) => b.targetType.toLowerCase() === "paper",
  );
  const savedKeywords = bookmarks.filter(
    (b) => b.targetType.toLowerCase() === "keyword",
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            Thư viện Cá nhân
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Quản lý các tài liệu và danh mục bạn đang quan tâm.
          </p>
        </div>
      </div>

      {/* Tabs Điều Hướng */}
      <div className="flex gap-4 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("bookmarks")}
          className={`pb-3 px-2 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "bookmarks"
              ? `${theme.primaryBorder} ${theme.primaryText}`
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            menu_book
          </span>
          Tài liệu đã lưu ({savedPapers.length})
        </button>
        <button
          onClick={() => setActiveTab("follows")}
          className={`pb-3 px-2 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "follows"
              ? `${theme.primaryBorder} ${theme.primaryText}`
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">hub</span>
          Mạng lưới theo dõi ({follows.length + savedKeywords.length})
        </button>
      </div>

      {loading ? (
        <div className="p-16 text-center text-slate-500 font-medium flex flex-col items-center bg-white rounded-2xl border border-slate-200">
          <span className="material-symbols-outlined text-4xl animate-spin mb-2">
            sync
          </span>
          Đang đồng bộ dữ liệu thư viện...
        </div>
      ) : (
        <>
          {/* TAB 1: BÀI BÁO ĐÃ LƯU */}
          {activeTab === "bookmarks" && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {savedPapers.length === 0 ? (
                <div className="p-16 text-center">
                  <span className="material-symbols-outlined text-6xl text-slate-200 mb-4 block">
                    bookmark_add
                  </span>
                  <p className="text-slate-500 font-medium">
                    Bạn chưa lưu bài báo nào.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-bold">
                      <tr>
                        <th className="p-4">Tiêu đề bài báo</th>
                        <th className="p-4 w-32">Năm XB</th>
                        <th className="p-4 text-right w-48">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {savedPapers.map((b) => (
                        <tr
                          key={b.bookmarkId}
                          className="hover:bg-slate-50/80 transition-colors"
                        >
                          <td className="p-4">
                            <p className="font-bold text-slate-800 text-sm mb-1 line-clamp-2">
                              {b.title || "Tài liệu không có tiêu đề"}
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
                              onClick={() =>
                                handleRemoveBookmark(b.targetId, "Paper")
                              }
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
          )}

          {/* TAB 2: MẠNG LƯỚI THEO DÕI (Authors, Journals, Topics, Keywords) */}
          {activeTab === "follows" && (
            <div className="space-y-4">
              {follows.length === 0 && savedKeywords.length === 0 ? (
                <div className="bg-white p-16 text-center rounded-2xl border border-slate-200 shadow-sm">
                  <span className="material-symbols-outlined text-6xl text-slate-200 mb-4 block">
                    person_add
                  </span>
                  <p className="text-slate-500 font-medium">
                    Bạn chưa theo dõi chủ đề hay tác giả nào.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Hiển thị Tác giả, Tạp chí, Chủ đề */}
                  {follows.map((f) => (
                    <div
                      key={f.followId}
                      className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1 text-xs font-bold text-slate-500 uppercase tracking-wide">
                          <span className="material-symbols-outlined text-[14px]">
                            {f.targetType.toLowerCase() === "author"
                              ? "person"
                              : f.targetType.toLowerCase() === "journal"
                                ? "menu_book"
                                : "hub"}
                          </span>
                          {f.targetType === "ResearchTopic"
                            ? "Chủ đề"
                            : f.targetType === "Author"
                              ? "Tác giả"
                              : "Tạp chí"}
                        </div>
                        <p
                          className="font-bold text-slate-800 truncate"
                          title={f.authorName || f.journalName || f.topicName}
                        >
                          {f.authorName || f.journalName || f.topicName}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          handleRemoveFollow(f.targetId, f.targetType as any)
                        }
                        className="w-8 h-8 rounded-full bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 flex items-center justify-center transition-colors shrink-0"
                        title="Bỏ theo dõi"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          close
                        </span>
                      </button>
                    </div>
                  ))}

                  {/* Hiển thị Từ khóa (Được Backend lưu dưới dạng Bookmark) */}
                  {savedKeywords.map((k) => (
                    <div
                      key={k.bookmarkId}
                      className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1 text-xs font-bold text-slate-500 uppercase tracking-wide">
                          <span className="material-symbols-outlined text-[14px]">
                            sell
                          </span>{" "}
                          Từ khóa
                        </div>
                        <p className="font-bold text-slate-800 truncate">
                          #{k.keywordText || k.title || "Từ khóa"}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          handleRemoveBookmark(k.targetId, "Keyword")
                        }
                        className="w-8 h-8 rounded-full bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 flex items-center justify-center transition-colors shrink-0"
                        title="Bỏ lưu từ khóa"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          close
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SharedLibrary;
