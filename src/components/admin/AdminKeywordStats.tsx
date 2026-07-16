import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import type { SystemLog, KeywordStatisticItem } from "../../types/admin";

const getPaginationRange = (current: number, total: number) => {
  const range: (number | string)[] = [];
  const delta = 1;

  for (let i = 1; i <= total; i++) {
    if (
      i === 1 ||
      i === total ||
      (i >= current - delta && i <= current + delta)
    ) {
      range.push(i);
    } else {
      if (i === 2 && current - delta === 3) {
        range.push(2);
      } else if (i === total - 1 && current + delta === total - 2) {
        range.push(total - 1);
      } else if (range[range.length - 1] !== "...") {
        range.push("...");
      }
    }
  }
  return range;
};

interface AdminKeywordStatsProps {
  addLog: (type: SystemLog["type"], message: string) => void;
}

export const AdminKeywordStats: React.FC<AdminKeywordStatsProps> = ({ addLog }) => {
  const navigate = useNavigate();
  const [keywordSearch, setKeywordSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [keywordSort, setKeywordSort] = useState<"papers-desc" | "papers-asc" | "alpha-asc" | "alpha-desc">("papers-desc");

  const [keywords, setKeywords] = useState<KeywordStatisticItem[]>(() => {
    try {
      const cached = sessionStorage.getItem("scitrend_admin_keyword_stats");
      if (cached) return JSON.parse(cached);
    } catch (err) {
      console.error("Error reading keyword stats cache:", err);
    }
    return [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  const mountLogged = React.useRef(false);

  const [isExporting, setIsExporting] = useState(false);

  // Debounce search input
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(keywordSearch);
      setCurrentPage(1); // Reset to page 1 when search term changes
    }, 300);
    return () => clearTimeout(handler);
  }, [keywordSearch]);

  const handleExportCSV = async () => {
    setIsExporting(true);
    addLog("INFO", "Bắt đầu xuất thống kê từ khóa ra file CSV...");
    try {
      const blob = await api.exportKeywordStatsCsv();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `keyword_stats_${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      addLog("SUCCESS", "Xuất file CSV thống kê từ khóa thành công.");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Lỗi khi xuất file CSV");
      addLog("ERROR", `Xuất file CSV thất bại: ${err.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    addLog("INFO", "Bắt đầu xuất thống kê từ khóa ra file PDF...");
    try {
      const blob = await api.exportKeywordStatsPdf();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `keyword_stats_${new Date().toISOString().split("T")[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      addLog("SUCCESS", "Xuất file PDF thống kê từ khóa thành công.");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Lỗi khi xuất file PDF");
      addLog("ERROR", `Xuất file PDF thất bại: ${err.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  // Tải dữ liệu từ khóa từ API
  React.useEffect(() => {
    const fetchKeywords = async () => {
      if (sessionStorage.getItem("scitrend_admin_keyword_stats")) {
        return;
      }
      setIsLoading(true);
      setErrorMsg("");
      try {
        const data = await api.getKeywordStats();
        setKeywords(data);
        sessionStorage.setItem("scitrend_admin_keyword_stats", JSON.stringify(data));
      } catch (err: any) {
        console.error("Error loading keyword stats:", err);
        setErrorMsg(err.message || "Không thể kết nối API để tải thống kê từ khóa.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchKeywords();
    if (!mountLogged.current) {
      addLog("INFO", "Quản trị viên đã truy cập Thống kê từ khóa khoa học.");
      mountLogged.current = true;
    }
  }, []);

  // Tính toán chỉ số tổng quan
  const stats = useMemo(() => {
    const totalKeywords = keywords.length;
    const totalPapersReferenced = keywords.reduce((acc, curr) => acc + curr.totalPapers, 0);
    const avgPapersPerKeyword = totalKeywords > 0 ? (totalPapersReferenced / totalKeywords).toFixed(1) : "0";
    
    const topKeyword = keywords.reduce(
      (max, curr) => (curr.totalPapers > max.totalPapers ? curr : max),
      keywords[0]
    );

    return { 
      totalKeywords, 
      totalPapersReferenced, 
      avgPapersPerKeyword, 
      topKeywordText: topKeyword?.keywordText || "-",
      topKeywordPapers: topKeyword?.totalPapers || 0
    };
  }, [keywords]);

  // Lọc và sắp xếp từ khóa
  const processedKeywords = useMemo(() => {
    const filtered = keywords.filter((k) =>
      k.keywordText.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    return [...filtered].sort((a, b) => {
      switch (keywordSort) {
        case "papers-desc":
          return b.totalPapers - a.totalPapers;
        case "papers-asc":
          return a.totalPapers - b.totalPapers;
        case "alpha-asc":
          return a.keywordText.localeCompare(b.keywordText);
        case "alpha-desc":
          return b.keywordText.localeCompare(a.keywordText);
        default:
          return 0;
      }
    });
  }, [keywords, debouncedSearch, keywordSort]);

  // Phân trang dữ liệu hiển thị ở client-side
  const paginatedKeywords = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return processedKeywords.slice(startIndex, startIndex + pageSize);
  }, [processedKeywords, currentPage, pageSize]);

  const totalPages = Math.ceil(processedKeywords.length / pageSize);

  return (
    <div className="space-y-6">
      {/* Cards Chỉ số tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-lg border border-[#ebeef0] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">sell</span>
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#74777f] uppercase tracking-wider">Tổng số từ khóa</p>
            <h3 className="text-2xl font-extrabold text-[#002045] mt-0.5">{stats.totalKeywords} từ khóa</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-[#ebeef0] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">library_books</span>
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#74777f] uppercase tracking-wider">Lượt gán bài báo</p>
            <h3 className="text-2xl font-extrabold text-[#002045] mt-0.5">{stats.totalPapersReferenced} lượt</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-[#ebeef0] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">analytics</span>
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#74777f] uppercase tracking-wider">Số bài báo TB / Từ khóa</p>
            <h3 className="text-2xl font-extrabold text-[#002045] mt-0.5">{stats.avgPapersPerKeyword} bài/từ khóa</h3>
          </div>
        </div>
      </div>

      {/* Banner Từ khóa phổ biến nhất */}
      <div className="bg-gradient-to-r from-teal-900 to-emerald-950 p-5 rounded-lg text-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[9px] font-extrabold text-teal-300 bg-teal-950/60 border border-teal-800/50 px-2 py-0.5 rounded-full uppercase tracking-wider">
            Từ khóa phổ biến nhất
          </span>
          <h4 className="text-sm font-bold text-slate-100 mt-1.5 line-clamp-1 max-w-2xl">{stats.topKeywordText}</h4>
        </div>
        <div className="bg-white/10 px-4 py-2 rounded-lg border border-white/10 text-right shrink-0">
          <span className="block text-[9px] uppercase tracking-wider text-slate-300 font-bold">Số bài báo liên quan</span>
          <span className="text-lg font-black text-teal-300 font-mono">{stats.topKeywordPapers} bài</span>
        </div>
      </div>

      {/* Bảng Danh Sách */}
      <div className="bg-white rounded-lg border border-[#ebeef0] shadow-sm p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row flex-1 items-stretch sm:items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-lg">search</span>
              <input
                type="text"
                value={keywordSearch}
                onChange={(e) => setKeywordSearch(e.target.value)}
                placeholder="Tìm kiếm từ khóa..."
                className="w-full pl-9 pr-4 py-2 bg-[#f1f4f6] border border-[#c4c6cf] rounded-md focus:outline-none focus:border-[#13696a] text-xs text-[#181c1e] font-semibold"
              />
            </div>
            
            {/* Nút Xuất File */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCSV}
                disabled={isExporting}
                className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded text-xs font-bold transition-all shadow-md shadow-emerald-500/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                title="Xuất thống kê từ khóa ra file CSV"
              >
                <span className="material-symbols-outlined text-sm">table_view</span>
                <span>{isExporting ? "Đang xuất..." : "Xuất CSV"}</span>
              </button>
              <button
                onClick={handleExportPDF}
                disabled={isExporting}
                className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white rounded text-xs font-bold transition-all shadow-md shadow-rose-500/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                title="Xuất thống kê từ khóa ra file PDF"
              >
                <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
                <span>{isExporting ? "Đang xuất..." : "Xuất PDF"}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="text-xs text-slate-500 font-semibold">
              Hiển thị {processedKeywords.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, processedKeywords.length)} trong tổng số {processedKeywords.length}
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase shrink-0">Sắp xếp:</label>
              <select
                value={keywordSort}
                onChange={(e) => setKeywordSort(e.target.value as any)}
                className="p-2 bg-[#f1f4f6] border border-[#c4c6cf] rounded focus:outline-none focus:border-[#13696a] text-xs font-semibold text-[#181c1e]"
              >
              <option value="papers-desc">Số bài báo (Nhiều → Ít)</option>
              <option value="papers-asc">Số bài báo (Ít → Nhiều)</option>
              <option value="alpha-asc">Từ khóa (A → Z)</option>
              <option value="alpha-desc">Từ khóa (Z → A)</option>
            </select>
          </div>
        </div>
      </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-xs flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm">error</span>
            <span className="font-medium">{errorMsg}</span>
          </div>
        )}

        <div className="overflow-x-auto border border-[#ebeef0] rounded-lg relative animate-fadeIn">
          {isLoading && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-xs flex items-center justify-center z-10">
              <div className="inline-block animate-spin text-[#13696a] font-light text-xl">⏳</div>
            </div>
          )}

          <table className="min-w-full divide-y divide-[#ebeef0] text-left text-xs">
            <thead className="bg-[#f8fafc] text-[#43474e] uppercase font-bold text-[10px]">
              <tr>
                <th className="px-6 py-3.5">Từ khóa khoa học (Keyword)</th>
                <th className="px-6 py-3.5">Tổng số bài báo liên quan</th>
                <th className="px-6 py-3.5">Năm xuất hiện lần đầu</th>
                <th className="px-6 py-3.5">Năm xuất hiện gần nhất</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ebeef0] text-[#181c1e] font-medium bg-white">
              {paginatedKeywords.length === 0 && !isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-slate-400 italic">
                    Không tìm thấy từ khóa nào khớp với tiêu chí tìm kiếm.
                  </td>
                </tr>
              ) : (
                paginatedKeywords.map((kw, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <button
                        onClick={() => navigate(`/admin/paper-reports?keywordText=${encodeURIComponent(kw.keywordText)}`)}
                        className="font-bold text-left text-slate-800 hover:text-[#13696a] hover:underline cursor-pointer border-0 bg-transparent p-0 flex items-center gap-1.5"
                        title={`Xem danh sách bài báo của từ khóa "${kw.keywordText}"`}
                      >
                        <span>{kw.keywordText}</span>
                        <span className="material-symbols-outlined text-xs text-[#13696a] opacity-0 hover:opacity-100 transition-opacity">open_in_new</span>
                      </button>
                    </td>
                    <td className="px-6 py-4 font-bold">
                      <span className="px-2.5 py-0.5 rounded bg-teal-50 text-teal-700">
                        {kw.totalPapers} bài báo
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-[#74777f]">{kw.firstYear}</td>
                    <td className="px-6 py-4 font-mono text-[#74777f]">{kw.lastYear}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Phân trang */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center pt-2 animate-fadeIn">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="flex items-center gap-1 px-3 py-1.5 border border-[#c4c6cf] rounded text-xs font-semibold hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-sm">chevron_left</span> Trước
            </button>
            <div className="flex items-center gap-1.5">
              {getPaginationRange(currentPage, totalPages).map((p, idx) => {
                if (p === "...") {
                  return (
                    <span key={`ellipsis-${idx}`} className="px-2 text-slate-400 text-xs font-bold select-none">
                      ...
                    </span>
                  );
                }
                return (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p as number)}
                    className={`w-8 h-8 rounded text-xs font-bold transition-all cursor-pointer ${
                      currentPage === p
                        ? "bg-[#13696a] text-white"
                        : "border border-[#c4c6cf] text-[#43474e] hover:bg-slate-50"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="flex items-center gap-1 px-3 py-1.5 border border-[#c4c6cf] rounded text-xs font-semibold hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              Sau <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
