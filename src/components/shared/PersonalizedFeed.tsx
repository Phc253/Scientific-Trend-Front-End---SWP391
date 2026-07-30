import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import type { Paper } from "../../services/api";

const PersonalizedFeed: React.FC = () => {
  const [recommendedPapers, setRecommendedPapers] = useState<Paper[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reason, setReason] = useState<string>(
    "Đang phân tích dữ liệu hệ thống...",
  );

  // Nhận diện Role tự động để đổi màu Theme
  const role =
    localStorage.getItem("userRoles") ||
    localStorage.getItem("actorType") ||
    "";
  const isLecturer = role.includes("Lecturer");
  const isResearcher = role.includes("Researcher");

  // Xử lý Guest (không có role) thì basePath là trang chủ public hoặc /explore
  const basePath = isLecturer
    ? "/lecturer"
    : isResearcher
      ? "/researcher"
      : role.includes("Student")
        ? "/student"
        : "";

  const primaryColor = isLecturer
    ? "text-emerald-600"
    : isResearcher
      ? "text-purple-600"
      : "text-blue-600";

  const bgBadge = isLecturer
    ? "bg-emerald-100 text-emerald-700"
    : isResearcher
      ? "bg-purple-100 text-purple-700"
      : "bg-blue-100 text-blue-700";

  const hoverColor = isLecturer
    ? "group-hover:text-emerald-600"
    : isResearcher
      ? "group-hover:text-purple-600"
      : "group-hover:text-blue-600";

  useEffect(() => {
    fetchPersonalizedPapers();
  }, []);

  const fetchPersonalizedPapers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");

      // Khởi tạo các tham số tìm kiếm mặc định
      let searchParams: any = { page: 1, pageSize: 5 };
      let displayReason = "Gợi ý các bài báo khoa học nổi bật mới nhất";

      // 1. Nếu có đăng nhập, lấy cả Bookmarks (từ khóa) và Follows (tác giả, tạp chí)
      if (token) {
        try {
          const [bookmarksRes, followsRes] = await Promise.all([
            api.getBookmarks().catch(() => null),
            api.getFollows().catch(() => null),
          ]);

          const bData = (bookmarksRes as any)?.data || bookmarksRes;
          const bookmarks = Array.isArray(bData) ? bData : bData?.items || [];

          const fData = (followsRes as any)?.data || followsRes;
          const follows = Array.isArray(fData) ? fData : fData?.items || [];

          // Phân loại các mục người dùng đã quan tâm
          const savedKeywords = bookmarks.filter(
            (b: any) => b.targetType?.toLowerCase() === "keyword",
          );
          const followedAuthors = follows.filter(
            (f: any) => f.targetType?.toLowerCase() === "author",
          );
          const followedJournals = follows.filter(
            (f: any) => f.targetType?.toLowerCase() === "journal",
          );

          // Xây dựng danh sách các lựa chọn để gợi ý (chỉ thêm vào nếu có dữ liệu)
          const suggestionPool = [];
          if (savedKeywords.length > 0) suggestionPool.push("keyword");
          if (followedAuthors.length > 0) suggestionPool.push("author");
          if (followedJournals.length > 0) suggestionPool.push("journal");

          // NẾU CÓ DỮ LIỆU QUAN TÂM -> Chọn ngẫu nhiên 1 loại để bảng tin luôn mới mẻ
          if (suggestionPool.length > 0) {
            const randomChoice =
              suggestionPool[Math.floor(Math.random() * suggestionPool.length)];

            if (randomChoice === "keyword") {
              const kwItem =
                savedKeywords[Math.floor(Math.random() * savedKeywords.length)];
              const kwName =
                kwItem.keywordText || kwItem.title || kwItem.name || "";
              searchParams.q = kwName; // Tìm theo từ khóa
              displayReason = `Dựa trên từ khóa #${kwName} bạn đang quan tâm`;
            } else if (randomChoice === "author") {
              const authorItem =
                followedAuthors[
                  Math.floor(Math.random() * followedAuthors.length)
                ];
              const authorName =
                authorItem.authorName ||
                authorItem.title ||
                authorItem.name ||
                "";
              searchParams.author = authorName; // Tìm theo tác giả
              displayReason = `Dựa trên tác giả ${authorName} bạn đang theo dõi`;
            } else if (randomChoice === "journal") {
              const journalItem =
                followedJournals[
                  Math.floor(Math.random() * followedJournals.length)
                ];
              const journalName =
                journalItem.journalName ||
                journalItem.title ||
                journalItem.name ||
                "";
              searchParams.journal = journalName; // Tìm theo tạp chí
              displayReason = `Dựa trên tạp chí ${journalName} bạn đang theo dõi`;
            }
          }
        } catch (err) {
          console.warn("Lỗi tải dữ liệu cá nhân hóa:", err);
        }
      }

      setReason(displayReason);

      // 2. Gọi API searchPapers với tham số đã được cá nhân hóa
      const papersRes: any = await api.searchPapers(searchParams);
      const actualPapers =
        papersRes?.data?.items || papersRes?.items || papersRes || [];

      setRecommendedPapers(actualPapers);
    } catch (error) {
      console.error("Lỗi khi tải bảng tin cá nhân hóa:", error);
      setReason("Không thể tải gợi ý lúc này.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-pulse h-full">
        <div className="h-6 bg-slate-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-20 bg-slate-100 rounded-xl w-full"></div>
          <div className="h-20 bg-slate-100 rounded-xl w-full"></div>
          <div className="h-20 bg-slate-100 rounded-xl w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-full">
      <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#FF9900]">
              auto_awesome
            </span>
            Đề xuất cho bạn
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">{reason}</p>
        </div>
        <Link
          to={basePath ? `${basePath}/explore` : "/search"}
          className={`text-sm font-bold ${primaryColor} hover:underline`}
        >
          Xem thêm
        </Link>
      </div>

      {recommendedPapers.length === 0 ? (
        <div className="text-center py-10 text-slate-500 text-sm border-2 border-dashed border-slate-200 rounded-xl">
          Hệ thống đang cập nhật dữ liệu. Hãy quay lại sau nhé!
        </div>
      ) : (
        <div className="space-y-4">
          {recommendedPapers.map((paper: Paper) => (
            <div
              key={paper.paperId}
              className="group flex gap-4 p-4 rounded-xl border border-transparent hover:border-slate-200 hover:bg-slate-50 transition-all"
            >
              <div className="flex-1 min-w-0">
                <Link
                  to={
                    basePath
                      ? `${basePath}/paper/${paper.paperId}`
                      : `/paper/${paper.paperId}`
                  }
                  className={`text-base font-bold text-slate-800 ${hoverColor} transition-colors line-clamp-2`}
                >
                  {paper.title}
                </Link>
                <p className="text-sm text-slate-500 mt-1 truncate">
                  {paper.authors?.join(", ") || "Không rõ tác giả"}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs font-bold text-slate-400">
                  {paper.publicationYear && (
                    <span className={`px-2 py-1 rounded-md ${bgBadge}`}>
                      {paper.publicationYear}
                    </span>
                  )}
                  {paper.journal && (
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">
                        menu_book
                      </span>{" "}
                      {paper.journal}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PersonalizedFeed;
