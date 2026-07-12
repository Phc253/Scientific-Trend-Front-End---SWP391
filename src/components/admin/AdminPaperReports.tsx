import React, { useState } from "react";
import { api } from "../../services/api";
import type { SystemLog, PaperReportItem } from "../../types/admin";

interface AdminPaperReportsProps {
  addLog: (type: SystemLog["type"], message: string) => void;
}

export const AdminPaperReports: React.FC<AdminPaperReportsProps> = ({ addLog }) => {
  const [paperSearch, setPaperSearch] = useState("");
  const [selectedPaper, setSelectedPaper] = useState<PaperReportItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const [papersData, setPapersData] = useState<PaperReportItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [overallStats, setOverallStats] = useState({
    totalPapers: 0,
    totalCitations: 0,
    avgCitations: "0",
    topPaperTitle: "-",
    topPaperCitations: 0,
  });

  const mountLogged = React.useRef(false);

  // 1. Tải số liệu thống kê tổng hợp (tải tối đa 1000 bản ghi trên mount để tính aggregate)
  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.getPaperReports({ page: 1, pageSize: 1000 });
        if (data && data.items) {
          const items = data.items;
          const totalPapers = data.totalCount || items.length;
          const totalCitations = items.reduce((acc, curr) => acc + curr.citationCount, 0);
          const avgCitations = totalPapers > 0 ? (totalCitations / totalPapers).toFixed(1) : "0";
          const topPaper = items.reduce(
            (max, curr) => (curr.citationCount > max.citationCount ? curr : max),
            items[0]
          );

          setOverallStats({
            totalPapers,
            totalCitations,
            avgCitations,
            topPaperTitle: topPaper?.title || "-",
            topPaperCitations: topPaper?.citationCount || 0
          });
        }
      } catch (err) {
        console.error("Error loading overall paper statistics:", err);
      }
    };
    fetchStats();
    if (!mountLogged.current) {
      addLog("INFO", "Quản trị viên đã truy cập Thống kê Báo cáo bài báo khoa học.");
      mountLogged.current = true;
    }
  }, []);

  // 2. Tải dữ liệu phân trang & tìm kiếm theo thời gian thực (có debounce)
  React.useEffect(() => {
    const loadPapers = async () => {
      setIsLoading(true);
      setErrorMsg("");
      try {
        const data = await api.getPaperReports({
          page: currentPage,
          pageSize: pageSize,
          search: paperSearch.trim() || undefined,
        });
        if (data) {
          setPapersData(data.items || []);
          setTotalCount(data.totalCount || 0);
        }
      } catch (err: any) {
        console.error("Error fetching papers:", err);
        setErrorMsg(err.message || "Không thể kết nối API để tải danh sách bài báo.");
      } finally {
        setIsLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      loadPapers();
    }, 350);

    return () => clearTimeout(delayDebounce);
  }, [currentPage, paperSearch]);

  const totalPages = Math.ceil(totalCount / pageSize);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaperSearch(e.target.value);
    setCurrentPage(1);
  };

  const [isExporting, setIsExporting] = useState(false);

  const handleExportCSV = async () => {
    setIsExporting(true);
    addLog("INFO", "Bắt đầu xuất dữ liệu bài báo ra file CSV...");
    try {
      const blob = await api.exportPapersCsv();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `papers_report_${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      addLog("SUCCESS", "Xuất file CSV báo cáo bài báo thành công.");
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
    addLog("INFO", "Bắt đầu xuất báo cáo bài báo ra file PDF...");
    try {
      const blob = await api.exportPapersPdf();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `papers_report_${new Date().toISOString().split("T")[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      addLog("SUCCESS", "Xuất file PDF báo cáo bài báo thành công.");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Lỗi khi xuất file PDF");
      addLog("ERROR", `Xuất file PDF thất bại: ${err.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cards Chỉ số tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-lg border border-[#ebeef0] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-cyan-50 text-cyan-600 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">description</span>
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#74777f] uppercase tracking-wider">Tổng số bài báo</p>
            <h3 className="text-2xl font-extrabold text-[#002045] mt-0.5">{overallStats.totalPapers} bài báo</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-[#ebeef0] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">format_quote</span>
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#74777f] uppercase tracking-wider">Tổng số trích dẫn</p>
            <h3 className="text-2xl font-extrabold text-[#002045] mt-0.5">{overallStats.totalCitations} lượt</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-[#ebeef0] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">functions</span>
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#74777f] uppercase tracking-wider">Trích dẫn trung bình</p>
            <h3 className="text-2xl font-extrabold text-[#002045] mt-0.5">{overallStats.avgCitations} lượt/bài</h3>
          </div>
        </div>
      </div>

      {/* Tác phẩm trích dẫn nhiều nhất */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-5 rounded-lg text-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[9px] font-extrabold text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-2 py-0.5 rounded-full uppercase tracking-wider">
            Ấn phẩm trích dẫn cao nhất
          </span>
          <h4 className="text-sm font-bold text-slate-100 mt-1.5 line-clamp-1 max-w-2xl">{overallStats.topPaperTitle}</h4>
        </div>
        <div className="bg-white/10 px-4 py-2 rounded-lg border border-white/10 text-right shrink-0">
          <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold">Số trích dẫn</span>
          <span className="text-lg font-black text-cyan-400 font-mono">{overallStats.topPaperCitations}</span>
        </div>
      </div>

      {/* Bảng Danh Sách */}
      <div className="bg-white rounded-lg border border-[#ebeef0] shadow-sm p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row flex-1 items-stretch sm:items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-lg">search</span>
              <input
                type="text"
                value={paperSearch}
                onChange={handleSearchChange}
                placeholder="Tìm kiếm theo tiêu đề, tác giả, tạp chí..."
                className="w-full pl-9 pr-4 py-2 bg-[#f1f4f6] border border-[#c4c6cf] rounded-md focus:outline-none focus:border-[#13696a] text-xs text-[#181c1e] font-semibold"
              />
            </div>
            
            {/* Nút Xuất File */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCSV}
                disabled={isExporting}
                className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded text-xs font-bold transition-all shadow-md shadow-emerald-500/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                title="Xuất dữ liệu bài báo ra file CSV"
              >
                <span className="material-symbols-outlined text-sm">table_view</span>
                <span>{isExporting ? "Đang xuất..." : "Xuất CSV"}</span>
              </button>
              <button
                onClick={handleExportPDF}
                disabled={isExporting}
                className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white rounded text-xs font-bold transition-all shadow-md shadow-rose-500/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                title="Xuất báo cáo bài báo ra file PDF"
              >
                <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
                <span>{isExporting ? "Đang xuất..." : "Xuất PDF"}</span>
              </button>
            </div>
          </div>
          <div className="text-xs text-slate-500 font-semibold shrink-0">
            Hiển thị {totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, totalCount)} trong tổng số {totalCount} bài báo
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-xs flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm">error</span>
            <span className="font-medium">{errorMsg}</span>
          </div>
        )}

        <div className="overflow-x-auto border border-[#ebeef0] rounded-lg relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-xs flex items-center justify-center z-10">
              <div className="inline-block animate-spin text-[#13696a] font-light text-xl">⏳</div>
            </div>
          )}

          <table className="min-w-full divide-y divide-[#ebeef0] text-left text-xs">
            <thead className="bg-[#f8fafc] text-[#43474e] uppercase font-bold text-[10px]">
              <tr>
                <th className="px-6 py-3.5">Mã số</th>
                <th className="px-6 py-3.5 w-1/3">Tiêu đề bài báo</th>
                <th className="px-6 py-3.5">Tác giả</th>
                <th className="px-6 py-3.5">Năm</th>
                <th className="px-6 py-3.5">Trích dẫn</th>
                <th className="px-6 py-3.5">Tạp chí / Hội nghị</th>
                <th className="px-6 py-3.5 text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ebeef0] text-[#181c1e] font-medium bg-white">
              {papersData.length === 0 && !isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-slate-400 italic">
                    Không tìm thấy bài báo khoa học nào khớp với từ khóa tìm kiếm.
                  </td>
                </tr>
              ) : (
                papersData.map((paper) => (
                  <tr key={paper.paperId} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-[#74777f]">#{paper.paperId}</td>
                    <td className="px-6 py-4 font-bold text-slate-800 line-clamp-2 mt-2">{paper.title}</td>
                    <td className="px-6 py-4 text-[#43474e]">{paper.authors && paper.authors.join(", ")}</td>
                    <td className="px-6 py-4 font-bold">{paper.publicationYear}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-extrabold">
                        {paper.citationCount}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 italic max-w-[200px] truncate">
                      {paper.journalName || <span className="text-slate-300">Không có</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedPaper(paper)}
                        className="text-[#13696a] hover:text-[#0f5455] hover:underline font-bold cursor-pointer font-sans text-xs border-0 bg-transparent"
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Phân trang */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center pt-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="flex items-center gap-1 px-3 py-1.5 border border-[#c4c6cf] rounded text-xs font-semibold hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-sm">chevron_left</span> Trước
            </button>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-8 h-8 rounded text-xs font-bold transition-all cursor-pointer ${
                    currentPage === p
                      ? "bg-[#13696a] text-white"
                      : "border border-[#c4c6cf] text-[#43474e] hover:bg-slate-50"
                  }`}
                >
                  {p}
                </button>
              ))}
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

      {/* MODAL: CHI TIẾT BÀI BÁO */}
      {selectedPaper && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-scaleUp">
            <div className="p-6 border-b border-[#ebeef0] flex justify-between items-start bg-slate-50 shrink-0">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#13696a] bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                  Chi tiết bài báo #{selectedPaper.paperId}
                </span>
                <h3 className="text-base font-extrabold text-[#002045] mt-1.5 line-clamp-2">
                  {selectedPaper.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPaper(null)}
                className="p-1.5 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-700 transition-colors cursor-pointer border-0 bg-transparent"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
              <div>
                <h4 className="font-bold text-[#43474e] uppercase text-[10px] tracking-wider mb-1">
                  Nhóm tác giả (Authors)
                </h4>
                <p className="font-bold text-[#181c1e] text-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-slate-400 text-sm">person</span>
                  {selectedPaper.authors && selectedPaper.authors.join(", ")}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-50 p-3 rounded-lg border border-[#ebeef0]">
                  <h4 className="font-bold text-slate-500 uppercase text-[9px] tracking-wider">
                    Năm công bố
                  </h4>
                  <p className="font-extrabold text-[#002045] text-sm mt-0.5">
                    {selectedPaper.publicationYear}
                  </p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-[#ebeef0]">
                  <h4 className="font-bold text-slate-500 uppercase text-[9px] tracking-wider">
                    Lượt trích dẫn
                  </h4>
                  <p className="font-extrabold text-blue-700 text-sm mt-0.5">
                    {selectedPaper.citationCount} lượt
                  </p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-[#ebeef0]">
                  <h4 className="font-bold text-slate-500 uppercase text-[9px] tracking-wider">
                    Tạp chí khoa học
                  </h4>
                  <p className="font-bold text-[#181c1e] text-xs mt-0.5 truncate" title={selectedPaper.journalName || "N/A"}>
                    {selectedPaper.journalName || "Không rõ"}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-[#43474e] uppercase text-[10px] tracking-wider mb-2">
                  Từ khóa phân tích (Keywords)
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPaper.keywords && selectedPaper.keywords.map((kw, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-semibold border border-slate-200 transition-colors"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-[#ebeef0] flex justify-end shrink-0">
              <button
                onClick={() => setSelectedPaper(null)}
                className="bg-[#13696a] hover:bg-[#0f5455] text-white text-xs font-bold py-2.5 px-6 rounded-md transition-colors cursor-pointer border-0"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
