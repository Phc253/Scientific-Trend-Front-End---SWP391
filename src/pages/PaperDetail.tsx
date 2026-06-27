import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import type { Paper } from "../services/api";
import { useAuth } from "../context/AuthContext";

const PaperDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [paper, setPaper] = useState<Paper | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Trạng thái yêu thích & theo dõi
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [followedAuthorIds, setFollowedAuthorIds] = useState<Set<number>>(new Set());
  const [followedJournalIds, setFollowedJournalIds] = useState<Set<number>>(new Set());
  const [bookmarkedKeywordIds, setBookmarkedKeywordIds] = useState<Set<number>>(new Set());

  // Mảng bản đồ phân giải tên sang IDs trong CSDL
  const [authorIdsMap, setAuthorIdsMap] = useState<Record<string, number>>({});
  const [journalId, setJournalId] = useState<number | null>(null);
  const [keywordIdsMap, setKeywordIdsMap] = useState<Record<string, number>>({});

  const [isActionLoading, setIsActionLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchPaperAndUserData = async () => {
      if (!id) return;
      setIsLoading(true);
      setError(null);

      try {
        // 1. Tải thông tin chi tiết bài báo
        const response = await api.getPaperDetails(id);
        if (response.success && response.data) {
          const paperData = response.data;
          setPaper(paperData);

          // 2. Phân giải IDs tác giả trong hệ thống để thực hiện follow
          const nameToIdMap: Record<string, number> = {};
          if (paperData.authors && paperData.authors.length > 0) {
            await Promise.all(
              paperData.authors.map(async (authorName) => {
                try {
                  const authorRes = await api.searchAuthors(authorName);
                  if (authorRes.success && authorRes.data && authorRes.data.length > 0) {
                    const matched =
                      authorRes.data.find(
                        (a) => a.authorName.toLowerCase() === authorName.toLowerCase()
                      ) || authorRes.data[0];
                    nameToIdMap[authorName] = matched.authorId;
                  }
                } catch (err) {
                  console.warn(`Không phân giải được ID cho tác giả: ${authorName}`, err);
                }
              })
            );
            setAuthorIdsMap(nameToIdMap);
          }

          // 3. Phân giải ID của Journal trong hệ thống
          if (paperData.journal) {
            try {
              const journalRes = await api.getJournalFacets(paperData.journal);
              if (journalRes.items && journalRes.items.length > 0) {
                const matchedJournal =
                  journalRes.items.find(
                    (j) => j.name.toLowerCase() === paperData.journal?.toLowerCase()
                  ) || journalRes.items[0];
                setJournalId(Number(matchedJournal.id));
              }
            } catch (err) {
              console.warn(`Không phân giải được ID cho tạp chí: ${paperData.journal}`, err);
            }
          }

          // 4. Phân giải IDs của Keywords trong hệ thống
          const kwToIdMap: Record<string, number> = {};
          if (paperData.keywords && paperData.keywords.length > 0) {
            await Promise.all(
              paperData.keywords.map(async (kwText) => {
                try {
                  const kwRes = await api.getKeywordFacets(kwText);
                  if (kwRes.items && kwRes.items.length > 0) {
                    const matchedKw =
                      kwRes.items.find((k) => k.name.toLowerCase() === kwText.toLowerCase()) ||
                      kwRes.items[0];
                    kwToIdMap[kwText] = Number(matchedKw.id);
                  }
                } catch (err) {
                  console.warn(`Không phân giải được ID cho từ khóa: ${kwText}`, err);
                }
              })
            );
            setKeywordIdsMap(kwToIdMap);
          }

          // 5. Kiểm tra trạng thái tương tác của người dùng hiện tại
          if (isAuthenticated) {
            // Tải danh sách bookmarks
            const bookmarkRes = await api.getMyBookmarks();
            if (bookmarkRes.success && bookmarkRes.data) {
              const bookmarked = bookmarkRes.data.some(
                (b) =>
                  b.targetType.toLowerCase() === "paper" && b.targetId.toString() === id.toString()
              );
              setIsBookmarked(bookmarked);

              const kwIds = bookmarkRes.data
                .filter((b) => b.targetType.toLowerCase() === "keyword")
                .map((b) => b.targetId);
              setBookmarkedKeywordIds(new Set(kwIds));
            }

            // Tải danh sách follows
            const followRes = await api.getMyFollows();
            if (followRes.success && followRes.data) {
              const followedIds = followRes.data
                .filter((f) => f.targetType.toLowerCase() === "author")
                .map((f) => f.targetId);
              setFollowedAuthorIds(new Set(followedIds));

              const followedJournals = followRes.data
                .filter((f) => f.targetType.toLowerCase() === "journal")
                .map((f) => f.targetId);
              setFollowedJournalIds(new Set(followedJournals));
            }
          }
        } else {
          setError("Không tìm thấy thông tin chi tiết bài báo.");
        }
      } catch (err: any) {
        setError(err.message || "Lỗi khi tải thông tin bài báo.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaperAndUserData();
  }, [id, isAuthenticated]);

  const handleToggleBookmark = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!paper) return;

    setIsActionLoading((prev) => ({ ...prev, bookmark: true }));
    try {
      const result = await api.toggleBookmark(paper.paperId, "Paper");
      if (result.success) {
        setIsBookmarked(result.isBookmarked);
      }
    } catch (err) {
      console.error("Lỗi khi toggle bookmark:", err);
    } finally {
      setIsActionLoading((prev) => ({ ...prev, bookmark: false }));
    }
  };

  const handleToggleFollowAuthor = async (authorName: string) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const authorId = authorIdsMap[authorName];
    if (!authorId) {
      alert(`Không thể xác định thông tin tác giả "${authorName}" trên hệ thống DB để theo dõi.`);
      return;
    }

    setIsActionLoading((prev) => ({ ...prev, [authorName]: true }));
    try {
      const result = await api.toggleFollow(authorId, "Author");
      if (result.success) {
        setFollowedAuthorIds((prev) => {
          const next = new Set(prev);
          if (result.isFollowed) {
            next.add(authorId);
          } else {
            next.delete(authorId);
          }
          return next;
        });
      }
    } catch (err) {
      console.error("Lỗi khi toggle follow author:", err);
    } finally {
      setIsActionLoading((prev) => ({ ...prev, [authorName]: false }));
    }
  };

  const handleToggleFollowJournal = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!journalId) {
      alert("Không xác định được ID của tạp chí này trong cơ sở dữ liệu.");
      return;
    }

    setIsActionLoading((prev) => ({ ...prev, journal: true }));
    try {
      const result = await api.toggleFollow(journalId, "Journal");
      if (result.success) {
        setFollowedJournalIds((prev) => {
          const next = new Set(prev);
          if (result.isFollowed) {
            next.add(journalId);
          } else {
            next.delete(journalId);
          }
          return next;
        });
      }
    } catch (err) {
      console.error("Lỗi khi toggle follow journal:", err);
    } finally {
      setIsActionLoading((prev) => ({ ...prev, journal: false }));
    }
  };

  const handleToggleBookmarkKeyword = async (kwText: string) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const kwId = keywordIdsMap[kwText];
    if (!kwId) {
      alert(`Không thể xác định ID của từ khóa "${kwText}" để lưu.`);
      return;
    }

    setIsActionLoading((prev) => ({ ...prev, [kwText]: true }));
    try {
      const result = await api.toggleBookmark(kwId, "Keyword");
      if (result.success) {
        setBookmarkedKeywordIds((prev) => {
          const next = new Set(prev);
          if (result.isBookmarked) {
            next.add(kwId);
          } else {
            next.delete(kwId);
          }
          return next;
        });
      }
    } catch (err) {
      console.error("Lỗi khi toggle bookmark keyword:", err);
    } finally {
      setIsActionLoading((prev) => ({ ...prev, [kwText]: false }));
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <div className="w-12 h-12 border-4 border-[#13696a] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-[#74777f] mt-4">Đang tải thông tin chi tiết bài báo...</p>
      </div>
    );
  }

  if (error || !paper) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center space-y-4">
        <span className="material-symbols-outlined text-5xl text-red-500">error</span>
        <h3 className="text-xl font-bold text-[#002045]">Đã xảy ra lỗi</h3>
        <p className="text-sm text-[#74777f]">{error || "Bài báo không tồn tại."}</p>
        <Link
          to="/search"
          className="inline-flex items-center gap-2 text-[#13696a] font-bold hover:underline"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Quay lại trang khám phá
        </Link>
      </div>
    );
  }

  const isJournalFollowed = journalId ? followedJournalIds.has(journalId) : false;

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl mx-auto">
      {/* Nút quay lại */}
      <Link
        to="/search"
        className="inline-flex items-center gap-2 text-sm text-[#43474e] hover:text-[#13696a] transition-colors font-medium mb-2"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        Quay lại kết quả tìm kiếm
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột chính: Nội dung bài viết */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-lg border border-[#ebeef0] shadow-sm space-y-6">
            {/* Tiêu đề bài viết */}
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#002045] leading-tight">
              {paper.title}
            </h1>

            {/* Thông tin xuất bản nhanh */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[#43474e] border-y border-[#ebeef0] py-3.5">
              {paper.publicationYear && (
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="material-symbols-outlined text-base text-[#13696a]">
                    calendar_today
                  </span>
                  Năm xuất bản: <strong>{paper.publicationYear}</strong>
                </span>
              )}
              <span className="flex items-center gap-1.5 font-medium">
                <span className="material-symbols-outlined text-base text-[#13696a]">grade</span>
                Số lượt trích dẫn: <strong>{paper.citationCount ?? 0}</strong>
              </span>
            </div>

            {/* Tóm tắt (Abstract) */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-[#002045] uppercase tracking-wide">
                Tóm tắt nội dung (Abstract)
              </h3>
              <p className="text-sm text-[#43474e] leading-relaxed text-justify bg-[#f8fafc] p-5 rounded-lg border border-[#ebeef0] italic">
                {paper.abstract || "Bài báo này hiện chưa cập nhật phần tóm tắt nội dung."}
              </p>
            </div>

            {/* Từ khóa nghiên cứu (Keywords) */}
            {paper.keywords && paper.keywords.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-bold text-[#002045] uppercase tracking-wide">
                  Từ khóa nghiên cứu
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {paper.keywords.map((kwText, index) => {
                    const kwId = keywordIdsMap[kwText];
                    const isKwBookmarked = kwId ? bookmarkedKeywordIds.has(kwId) : false;
                    const loading = isActionLoading[kwText] || false;

                    return (
                      <div
                        key={index}
                        className="bg-[#e0f2f1] text-[#13696a] pl-4 pr-2 py-1.5 rounded-full text-xs font-bold tracking-wide flex items-center gap-2 border border-[#a2eded]"
                      >
                        <span>#{kwText}</span>
                        <button
                          onClick={() => handleToggleBookmarkKeyword(kwText)}
                          disabled={loading}
                          className={`p-0.5 rounded-full hover:bg-[#b2dfdb] transition-colors flex items-center justify-center cursor-pointer ${
                            isKwBookmarked ? "text-[#13696a]" : "text-[#74777f]"
                          }`}
                          title={isKwBookmarked ? "Bỏ lưu từ khóa" : "Lưu từ khóa"}
                        >
                          <span
                            className="material-symbols-outlined text-sm"
                            style={{ fontVariationSettings: isKwBookmarked ? "'FILL' 1" : "" }}
                          >
                            bookmark
                          </span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Cột phải: Thông tin tác giả & Thao tác */}
        <div className="space-y-6">
          {/* Box Thao tác (Actions Card) */}
          <div className="bg-white p-6 rounded-lg border border-[#ebeef0] shadow-sm space-y-4">
            <h3 className="font-bold text-xs text-[#002045] uppercase tracking-wider border-b border-[#ebeef0] pb-2">
              Lưu trữ tài liệu
            </h3>

            <button
              onClick={handleToggleBookmark}
              disabled={isActionLoading.bookmark}
              className={`w-full py-3 px-4 rounded font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isBookmarked
                  ? "bg-[#e8f5e9] text-[#1a6d6e] border border-[#13696a]"
                  : "bg-[#002045] hover:opacity-95 text-white"
              }`}
            >
              <span
                className="material-symbols-outlined text-sm"
                style={{ fontVariationSettings: isBookmarked ? "'FILL' 1" : "" }}
              >
                bookmark
              </span>
              {isBookmarked ? "Đã lưu vào Thư viện" : "Lưu vào Thư viện của tôi"}
            </button>
          </div>

          {/* Box Tác giả (Authors Card) */}
          <div className="bg-white p-6 rounded-lg border border-[#ebeef0] shadow-sm space-y-4">
            <h3 className="font-bold text-xs text-[#002045] uppercase tracking-wider border-b border-[#ebeef0] pb-2">
              Tác giả nghiên cứu ({paper.authors?.length || 0})
            </h3>

            <div className="divide-y divide-[#ebeef0] max-h-72 overflow-y-auto pr-1">
              {paper.authors && paper.authors.length > 0 ? (
                paper.authors.map((authorName, index) => {
                  const authorId = authorIdsMap[authorName];
                  const isFollowing = authorId ? followedAuthorIds.has(authorId) : false;
                  const loading = isActionLoading[authorName] || false;

                  return (
                    <div
                      key={index}
                      className="py-3 flex items-center justify-between gap-3 first:pt-0 last:pb-0"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-[#181c1e] truncate">{authorName}</p>
                        <p className="text-xs text-[#74777f]">Co-author</p>
                      </div>

                      {/* Nút Follow Author */}
                      <button
                        onClick={() => handleToggleFollowAuthor(authorName)}
                        disabled={loading}
                        className={`text-xs font-bold py-1.5 px-3 rounded flex items-center gap-1 transition-all cursor-pointer ${
                          isFollowing
                            ? "bg-[#e0f2f1] text-[#13696a]"
                            : "border border-[#002045] text-[#002045] hover:bg-[#f1f4f6]"
                        }`}
                      >
                        <span className="material-symbols-outlined text-xs">
                          {isFollowing ? "done" : "person_add"}
                        </span>
                        {isFollowing ? "Đã theo dõi" : "Theo dõi"}
                      </button>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-[#74777f]">Tác giả ẩn danh</p>
              )}
            </div>
          </div>

          {/* Box Tạp chí & Nhà xuất bản (Journal Card) */}
          {paper.journal && (
            <div className="bg-white p-6 rounded-lg border border-[#ebeef0] shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-[#ebeef0] pb-2">
                <h3 className="font-bold text-xs text-[#002045] uppercase tracking-wider">
                  Tạp chí (Journal)
                </h3>

                {/* Nút Follow Journal */}
                <button
                  onClick={handleToggleFollowJournal}
                  disabled={isActionLoading.journal}
                  className={`text-[10px] font-bold py-1 px-2.5 rounded flex items-center gap-1 transition-all cursor-pointer ${
                    isJournalFollowed
                      ? "bg-[#e0f2f1] text-[#13696a]"
                      : "border border-[#002045] text-[#002045] hover:bg-[#f1f4f6]"
                  }`}
                >
                  <span className="material-symbols-outlined text-[12px]">
                    {isJournalFollowed ? "check" : "notifications"}
                  </span>
                  {isJournalFollowed ? "Đang theo dõi" : "Theo dõi"}
                </button>
              </div>
              <div>
                <p className="text-sm font-bold text-[#181c1e] leading-snug">{paper.journal}</p>
                <p className="text-xs text-[#74777f] mt-1">
                  Đã được chỉ mục hóa trong hệ thống
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaperDetail;
