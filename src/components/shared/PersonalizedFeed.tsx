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
      let targetKeyword = "";

      // 1. Nếu có đăng nhập, tải thư viện Bookmark để xem người dùng lưu từ khóa nào không
      if (token) {
        try {
          const bookmarksRes: any = await api.getBookmarks();
          const bData = bookmarksRes?.data || bookmarksRes;
          const bookmarks = Array.isArray(bData) ? bData : bData?.items || [];

          // Lọc ra các bookmark là "Keyword"
          const keywordBookmarks = bookmarks.filter(
            (b: any) => b.targetType?.toLowerCase() === "keyword",
          );

          if (keywordBookmarks.length > 0) {
            // Lấy text của từ khóa đầu tiên người dùng đã lưu
            const firstKw = keywordBookmarks[0];
            targetKeyword =
              firstKw.keywordText || firstKw.title || firstKw.name || "";
            if (targetKeyword) {
              setReason(`Dựa trên từ khóa #${targetKeyword} bạn đang quan tâm`);
            }
          }
        } catch (err) {
          console.warn("Lỗi tải bookmark để cá nhân hóa:", err);
        }
      }

      // Nếu không có từ khóa nào, hiển thị thông báo chung
      if (!targetKeyword) {
        setReason("Gợi ý các bài báo khoa học nổi bật mới nhất");
      }

      // 2. Gọi API searchPapers để lấy bài báo gợi ý
      const papersRes: any = await api.searchPapers({
        q: targetKeyword || undefined,
        page: 1,
        pageSize: 5,
      });

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
