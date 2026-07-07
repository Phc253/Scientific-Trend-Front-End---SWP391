import React, { useState } from "react";
import { api, type Paper } from "../../services/api";
import { useNavigate } from "react-router-dom";

const LecturerSearch: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      setLoading(true);
      setSearched(true);
      const res = await api.searchPapers({
        q: searchTerm,
        page: 1,
        pageSize: 10,
      });
      if (res.success) {
        setSearchResults(res.data.items);
      }
    } catch (err) {
      console.error("Lỗi tìm kiếm:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePaper = async (paperId: number) => {
    try {
      const res = await api.toggleBookmark(paperId, "Paper");
      if (res.success) {
        alert(res.isBookmarked ? "Đã lưu vào Kho học liệu!" : "Đã bỏ lưu!");
      }
    } catch (err) {
      alert("Lỗi khi lưu tài liệu");
    }
  };

  return (
    <div className="animate-fadeIn space-y-6 h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-slate-800">Tìm kiếm Bài báo</h2>
        <p className="text-sm text-slate-500">
          Tra cứu hàng triệu công bố khoa học để bổ sung vào Kho học liệu.
        </p>
      </div>

      {/* Thanh tìm kiếm */}
      <form
        onSubmit={handleSearch}
        className="relative shadow-sm rounded-xl overflow-hidden shrink-0"
      >
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Nhập từ khóa, tên bài báo hoặc tác giả..."
          className="w-full pl-12 pr-32 py-4 bg-white border border-slate-200 text-slate-700 focus:outline-none focus:border-emerald-500 text-base"
        />
        <span className="material-symbols-outlined absolute left-4 top-4 text-slate-400 text-2xl">
          search
        </span>
        <button
          type="submit"
          className="absolute right-2 top-2 bottom-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 rounded-lg transition-colors flex items-center gap-2"
        >
          {loading ? "Đang tìm..." : "Tìm kiếm"}
        </button>
      </form>

      {/* Kết quả tìm kiếm */}
      <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm p-6 overflow-y-auto">
        {!searched ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
            <span className="material-symbols-outlined text-[60px] mb-4 opacity-50">
              travel_explore
            </span>
            <p>Nhập từ khóa để bắt đầu tìm kiếm</p>
          </div>
        ) : searchResults.length === 0 && !loading ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
            <p>Không tìm thấy kết quả nào cho "{searchTerm}".</p>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider border-b pb-2">
              Kết quả tìm kiếm
            </h3>
            {searchResults.map((paper) => (
              <div
                key={paper.paperId}
                className="p-4 border border-slate-100 rounded-xl hover:border-emerald-300 hover:bg-emerald-50/30 transition-colors flex gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-1">
                  <span className="material-symbols-outlined">article</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800 text-base mb-1">
                    {paper.title}
                  </h4>
                  <p className="text-sm text-slate-600 mb-2">
                    {paper.authors?.join(", ")} • {paper.publicationYear}
                  </p>

                  {paper.keywords && paper.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {paper.keywords.slice(0, 4).map((kw, i) => (
                        <span
                          key={i}
                          className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() =>
                        navigate(`/lecturer/paper/${paper.paperId}`)
                      }
                      className="text-sm font-bold text-blue-600 hover:text-blue-800"
                    >
                      Xem chi tiết
                    </button>
                    <button
                      onClick={() => handleSavePaper(paper.paperId)}
                      className="text-sm font-bold text-slate-500 hover:text-emerald-600 flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        bookmark_add
                      </span>
                      Lưu tài liệu
                    </button>
                  </div>
                </div>
                <div className="text-center">
                  <span className="block text-xl font-black text-emerald-600">
                    {paper.citationCount || 0}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    Trích dẫn
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LecturerSearch;
