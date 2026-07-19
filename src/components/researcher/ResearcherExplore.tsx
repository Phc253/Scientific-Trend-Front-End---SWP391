import { useState } from "react";
import { Link } from "react-router-dom";
import { api, type Paper } from "../../services/api";

export const ResearcherExplore = () => {
  const [query, setQuery] = useState("");
  const [papers, setPapers] = useState<Paper[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setIsLoading(true);
      setHasSearched(true);
      const res = await api.searchPapers({ q: query, page: 1, pageSize: 20 });
      // Xử lý an toàn dữ liệu trả về
      const items = res?.data?.items || [];
      setPapers(items);
    } catch (error) {
      console.error("Lỗi tìm kiếm:", error);
      alert("Có lỗi xảy ra khi tìm kiếm.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookmark = async (paperId: number) => {
    try {
      const res = await api.toggleBookmark(paperId, "Paper");
      alert(res.message || "Đã cập nhật thư viện!");
    } catch (error) {
      alert("Lỗi khi lưu bài báo.");
    }
  };

  const handleFollowAuthor = async (authorName: string) => {
    try {
      // Giả sử Backend có cơ chế map authorName sang targetId, hoặc bạn truyền id nếu có
      // Ở đây dùng id tạm là 0 hoặc id của tác giả nếu API searchPapers trả về authorId
      alert(`Tính năng theo dõi tác giả ${authorName} đang được cập nhật!`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto animate-fadeIn">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-[#002045] mb-3">
          Khám phá Nghiên cứu
        </h1>
        <p className="text-slate-500">
          Tìm kiếm, lưu trữ bài báo và theo dõi các tác giả hàng đầu.
        </p>
      </div>

      {/* Thanh tìm kiếm */}
      <form
        onSubmit={handleSearch}
        className="relative max-w-2xl mx-auto mb-10"
      >
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-2xl">
          search
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Nhập tên bài báo, từ khóa hoặc tác giả..."
          className="w-full pl-12 pr-32 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-700 text-lg"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? "Đang tìm..." : "Tìm kiếm"}
        </button>
      </form>

      {/* Kết quả tìm kiếm */}
      {isLoading ? (
        <div className="flex justify-center text-indigo-500 mt-10">
          <span className="material-symbols-outlined animate-spin text-4xl">
            sync
          </span>
        </div>
      ) : hasSearched && papers.length === 0 ? (
        <div className="text-center text-slate-500 mt-10">
          Không tìm thấy bài báo nào phù hợp với "{query}".
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {papers.map((paper) => (
            <div
              key={paper.paperId}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-bold text-[#002045] mb-2">
                {paper.title}
              </h3>
              <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                {paper.abstract || "Chưa có tóm tắt."}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {paper.authors?.map((author, idx) => (
                  <span
                    key={idx}
                    onClick={() => handleFollowAuthor(author)}
                    className="text-xs font-medium bg-slate-100 text-slate-700 px-2 py-1 rounded cursor-pointer hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    title="Bấm để theo dõi tác giả này"
                  >
                    {author}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-slate-50 pt-3">
                <div className="text-xs font-medium text-slate-500 flex gap-4">
                  <span>Năm: {paper.publicationYear}</span>
                  <span>Trích dẫn: {paper.citationCount || 0}</span>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/papers/${paper.paperId}`}
                    className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-100"
                  >
                    Đọc chi tiết
                  </Link>
                  <button
                    onClick={() => handleBookmark(paper.paperId)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-bold hover:bg-indigo-100"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      bookmark_add
                    </span>
                    Lưu
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResearcherExplore;
