import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import type { Paper } from "../services/api";

const AuthorDetail: React.FC = () => {
  // Lấy tên tác giả từ thanh địa chỉ URL
  const { authorName } = useParams<{ authorName: string }>();
  const navigate = useNavigate();

  const decodedName = authorName ? decodeURIComponent(authorName) : "";

  // Nhận diện Role để đổi màu theme đồng bộ với hệ thống
  const role =
    localStorage.getItem("userRoles") ||
    localStorage.getItem("actorType") ||
    "";
  const isLecturer = role.includes("Lecturer");
  const isStudent = role.includes("Student");
  const isResearcher = role.includes("Researcher");

  let primaryColor =
    "bg-blue-600 hover:bg-blue-700 text-blue-600 border-blue-600";
  let basePath = "/";

  if (isLecturer) {
    primaryColor =
      "bg-emerald-600 hover:bg-emerald-700 text-emerald-600 border-emerald-600";
    basePath = "/lecturer";
  } else if (isStudent) {
    primaryColor =
      "bg-blue-600 hover:bg-blue-700 text-blue-600 border-blue-600";
    basePath = "/student";
  } else if (isResearcher) {
    primaryColor =
      "bg-purple-600 hover:bg-purple-700 text-purple-600 border-purple-600";
    basePath = "/researcher";
  }

  const [papers, setPapers] = useState<Paper[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (decodedName) {
      fetchPapersByAuthor(page);
    }
  }, [page, decodedName]);

  const fetchPapersByAuthor = async (currentPage: number) => {
    setIsLoading(true);
    setError(null);
    try {
      // Gọi API tìm kiếm bài báo với tham số `author`
      const response: any = await api.searchPapers({
        author: decodedName,
        page: currentPage,
        pageSize: pageSize,
      });

      const actualData = response?.data ? response.data : response;

      if (actualData) {
        setPapers(actualData.items || []);
        setTotalCount(actualData.totalCount || 0);
      }
    } catch (err: any) {
      setError(
        err.message || "Không thể tải danh sách bài báo của tác giả này.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div
      className={`space-y-6 animate-fadeIn ${basePath === "/" ? "max-w-7xl mx-auto px-4 py-8" : ""}`}
    >
      {/* Nút quay lại */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
      >
        <span className="material-symbols-outlined text-base">arrow_back</span>{" "}
        Quay lại
      </button>

      {/* Header Thông tin Tác giả */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
        <div
          className={`p-4 rounded-xl ${primaryColor.split(" ")[0]} text-white shrink-0`}
        >
          <span className="material-symbols-outlined text-3xl">person</span>
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Hồ sơ Tác giả
          </span>
          <h2 className="text-2xl font-black text-slate-800 mt-0.5 leading-tight">
            {decodedName}
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Tổng số công bố:{" "}
            <strong className="text-slate-700">{totalCount}</strong> bài báo
          </p>
        </div>
      </div>

      {/* Danh sách bài báo của Tác giả */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-800 px-1">
          Các công trình nghiên cứu
        </h3>

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
              Đang truy vấn dữ liệu...
            </p>
          </div>
        ) : papers.length === 0 ? (
          <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl shadow-sm text-slate-500">
            Tác giả này chưa có bài báo nào trên hệ thống.
          </div>
        ) : (
          <div className="space-y-4">
            {papers.map((paper) => (
              <div
                key={paper.paperId}
                className="p-5 border border-slate-200 rounded-2xl hover:shadow-md transition-shadow bg-white flex flex-col sm:flex-row justify-between gap-4 group"
              >
                <div className="flex-1">
                  <Link
                    to={
                      basePath === "/"
                        ? `/paper/${paper.paperId}`
                        : `${basePath}/paper/${paper.paperId}`
                    }
                    className={`text-lg font-bold text-slate-800 hover:${primaryColor.split(" ")[2]} transition-colors block mb-2 leading-snug`}
                  >
                    {paper.title}
                  </Link>
                  <p className="text-sm text-slate-600 mb-3 font-medium">
                    {paper.authors?.join(", ") || "Không rõ tác giả"}
                  </p>
                  <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-500">
                    {paper.publicationYear && (
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">
                          calendar_today
                        </span>{" "}
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
                    to={
                      basePath === "/"
                        ? `/paper/${paper.paperId}`
                        : `${basePath}/paper/${paper.paperId}`
                    }
                    className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors w-full sm:w-auto"
                  >
                    Đọc bài
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Phân trang */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 disabled:opacity-50 cursor-pointer flex items-center"
            >
              <span className="material-symbols-outlined text-sm">
                chevron_left
              </span>
            </button>
            {Array.from({ length: totalPages }, (_, idx) => (
              <button
                key={idx + 1}
                onClick={() => setPage(idx + 1)}
                className={`px-3.5 py-2 rounded-lg text-sm font-bold transition-all min-w-[36px] cursor-pointer ${
                  page === idx + 1
                    ? `${primaryColor.split(" ")[0]} text-white shadow-sm`
                    : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 disabled:opacity-50 cursor-pointer flex items-center"
            >
              <span className="material-symbols-outlined text-sm">
                chevron_right
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorDetail;
