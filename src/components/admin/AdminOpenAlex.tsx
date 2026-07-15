import React, { useState } from "react";
import { api } from "../../services/api";
import type { SystemLog, SyncJobResult, GlobalSyncResponse } from "../../types/admin";

interface AdminOpenAlexProps {
  addLog: (type: SystemLog["type"], message: string) => void;
}

export const AdminOpenAlex: React.FC<AdminOpenAlexProps> = ({ addLog }) => {
  const [activeSubTab, setActiveSubTab] = useState<"fetch" | "sync">("fetch");

  // Keyword Fetch Tab State
  const [keyword, setKeyword] = useState("Computer Science");
  const [maxResults, setMaxResults] = useState(20);
  const [useCheckpoint, setUseCheckpoint] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [syncResult, setSyncResult] = useState<SyncJobResult | null>(null);

  // Global Sync Tab State
  const [maxResultsGlobal, setMaxResultsGlobal] = useState(20);
  const [isLoadingGlobal, setIsLoadingGlobal] = useState(false);
  const [errorMsgGlobal, setErrorMsgGlobal] = useState("");
  const [syncResultGlobal, setSyncResultGlobal] = useState<GlobalSyncResponse | null>(null);

  const handleSync = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    setIsLoading(true);
    setErrorMsg("");
    setSyncResult(null);
    addLog("INFO", `Bắt đầu đồng bộ OpenAlex cho từ khóa "${keyword}" (maxResults: ${maxResults}, useCheckpoint: ${useCheckpoint})`);

    try {
      const data = await api.syncOpenAlex({
        keyword,
        maxResults,
        useCheckpoint,
      });
      setSyncResult(data);

      if (data.status === "Completed") {
        sessionStorage.removeItem("scitrend_admin_paper_stats");
        sessionStorage.removeItem("scitrend_admin_keyword_stats");
        addLog(
          "SUCCESS",
          `Đồng bộ hoàn tất: Đã lấy ${data.recordsFetched} bản ghi cho từ khóa "${data.keyword}".`
        );
      } else {
        const errorDetail = data.errorMessage || "Không rõ nguyên nhân";
        setErrorMsg(errorDetail);
        addLog(
          "ERROR",
          `Đồng bộ hoàn tất với lỗi: ${errorDetail}`
        );
      }
    } catch (err: any) {
      console.error(err);
      const message =
        err.message ||
        "Lỗi không xác định khi kết nối với máy chủ.";
      setErrorMsg(message);
      addLog("ERROR", `Đồng bộ thất bại: ${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGlobalSync = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingGlobal(true);
    setErrorMsgGlobal("");
    setSyncResultGlobal(null);
    addLog("INFO", `Yêu cầu đồng bộ OpenAlex toàn cục bắt đầu (maxResults: ${maxResultsGlobal})`);

    try {
      const data = await api.syncOpenAlexData(maxResultsGlobal);
      setSyncResultGlobal(data);

      sessionStorage.removeItem("scitrend_admin_paper_stats");
      sessionStorage.removeItem("scitrend_admin_keyword_stats");

      if (data.status === "Completed" || (data.updatedPapers && Array.isArray(data.updatedPapers))) {
        const count = data.updatedPapers ? data.updatedPapers.length : (data.recordsFetched || 0);
        addLog(
          "SUCCESS",
          `Đồng bộ OpenAlex hoàn tất: Đã lấy và cập nhật thông tin trích dẫn của ${count} bài báo.`
        );
      } else {
        const errorDetail = data.errorMessage || "Không rõ nguyên nhân";
        setErrorMsgGlobal(errorDetail);
        addLog("ERROR", `Đồng bộ OpenAlex hoàn tất với lỗi: ${errorDetail}`);
      }
    } catch (err: any) {
      console.error(err);
      const message = err.message || "Lỗi không xác định khi kết nối với máy chủ.";
      setErrorMsgGlobal(message);
      addLog("ERROR", `Đồng bộ OpenAlex toàn cục thất bại: ${message}`);
    } finally {
      setIsLoadingGlobal(false);
    }
  };

  // Helper formatting date
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    try {
      const date = new Date(dateStr);
      return date.toLocaleString("vi-VN", {
        timeZone: "UTC",
        hour12: false,
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Sub-Tabs Switcher */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveSubTab("fetch")}
          className={`px-6 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeSubTab === "fetch"
              ? "border-[#13696a] text-[#13696a]"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Tải dữ liệu theo từ khóa (Fetch)
        </button>
        <button
          onClick={() => setActiveSubTab("sync")}
          className={`px-6 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeSubTab === "sync"
              ? "border-[#13696a] text-[#13696a]"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Đồng bộ dữ liệu OpenAlex
        </button>
      </div>

      {activeSubTab === "fetch" ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cột trái: Cấu hình và Kích hoạt Đồng bộ */}
            <div className="bg-white p-6 rounded-lg border border-[#ebeef0] shadow-sm space-y-6 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-base text-[#002045] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#13696a]">cloud_download</span>
                  Tải dữ liệu từ OpenAlex
                </h3>
                <p className="text-xs text-[#74777f] mt-0.5">
                  Gửi yêu cầu tải dữ liệu nghiên cứu khoa học từ cổng OpenAlex API về cơ sở dữ liệu nội bộ.
                </p>
              </div>

              <form onSubmit={handleSync} className="space-y-4 flex-1 mt-4">
                <div>
                  <label className="block text-xs font-bold text-[#43474e] mb-1.5 uppercase">
                    Từ khóa
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isLoading}
                    className="w-full p-2.5 bg-[#f1f4f6] border border-[#c4c6cf] rounded focus:outline-none focus:border-[#13696a] text-xs font-semibold text-[#181c1e] disabled:opacity-60"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Ví dụ: Computer Science, Large Language Models..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#43474e] mb-1.5 uppercase">
                    Số lượng kết quả tối đa
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={100}
                    disabled={isLoading}
                    className="w-full p-2.5 bg-[#f1f4f6] border border-[#c4c6cf] rounded focus:outline-none focus:border-[#13696a] text-xs font-semibold text-[#181c1e] disabled:opacity-60"
                    value={maxResults}
                    onChange={(e) => setMaxResults(Number(e.target.value))}
                  />
                </div>

                {/* Checkpoint checkpoint on/off toggle */}
                <div className="flex items-center space-x-3 p-3 bg-[#f8fafc] rounded-lg border border-[#ebeef0] hover:border-slate-300 transition-colors my-2">
                  <input
                    id="useCheckpoint"
                    type="checkbox"
                    disabled={isLoading}
                    checked={useCheckpoint}
                    onChange={(e) => setUseCheckpoint(e.target.checked)}
                    className="h-4.5 w-4.5 rounded border-gray-300 text-[#13696a] focus:ring-[#13696a] cursor-pointer disabled:opacity-50"
                  />
                  <div className="text-xs">
                    <label htmlFor="useCheckpoint" className="font-bold text-[#002045] block cursor-pointer select-none">
                      Checkpoint
                    </label>
                    <p className="text-[10px] text-[#74777f] mt-0.5">Kích hoạt để lưu trữ và tải tiếp dữ liệu từ điểm quét trước đó.</p>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#13696a] hover:bg-[#0f5455] text-white text-xs font-bold py-3 rounded-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-60"
                  >
                    <span className={`material-symbols-outlined text-sm ${isLoading ? "animate-spin" : ""}`}>
                      sync
                    </span>
                    {isLoading ? "Đang thực hiện đồng bộ..." : "Bắt đầu lấy dữ liệu"}
                  </button>
                </div>
              </form>
            </div>

            {/* Cột phải: Trạng thái và Kết quả trả về */}
            <div className="bg-white p-6 rounded-lg border border-[#ebeef0] shadow-sm flex flex-col justify-between min-h-[350px]">
              <div>
                <h3 className="font-bold text-base text-[#002045] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#13696a]">assignment</span>
                  Trạng thái công việc tải dữ liệu
                </h3>
                <p className="text-xs text-[#74777f] mt-0.5">
                  Kết quả của tiến trình tải dữ liệu gần nhất trong phiên làm việc.
                </p>
              </div>

              <div className="flex-1 mt-4 flex flex-col justify-center">
                {isLoading && (
                  <div className="text-center py-8 space-y-3">
                    <div className="inline-block animate-spin text-3xl text-[#13696a] font-light">⏳</div>
                    <p className="text-xs text-[#43474e] font-semibold">
                      Đang gửi yêu cầu và chờ OpenAlex phản hồi...
                    </p>
                    <p className="text-[10px] text-[#74777f] italic">
                      (Quá trình này có thể mất vài giây tùy thuộc vào số lượng tài liệu yêu cầu)
                    </p>
                  </div>
                )}

                {errorMsg && !isLoading && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <span className="material-symbols-outlined text-sm">error</span>
                      Đồng bộ thất bại
                    </div>
                    <p className="text-xs font-medium">{errorMsg}</p>
                  </div>
                )}

                {!isLoading && !errorMsg && !syncResult && (
                  <div className="text-center py-12 text-[#74777f] space-y-2">
                    <span className="material-symbols-outlined text-4xl text-[#c4c6cf]">cloud_sync</span>
                    <p className="text-xs italic">Chưa thực hiện đồng bộ trong phiên này.</p>
                  </div>
                )}

                {syncResult && !isLoading && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-[#ebeef0] pb-2">
                      <span className="text-xs font-bold text-[#43474e]">Trạng thái</span>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${syncResult.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                          }`}
                      >
                        <span className="material-symbols-outlined text-[10px]">
                          {syncResult.status === "Completed" ? "check_circle" : "cancel"}
                        </span>
                        {syncResult.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-[#f8fafc] p-2.5 rounded border border-[#ebeef0]">
                        <p className="text-[10px] text-[#74777f] uppercase font-bold">Mã công việc</p>
                        <p className="font-semibold text-[#002045] mt-0.5">#{syncResult.syncJobId}</p>
                      </div>
                      <div className="bg-[#f8fafc] p-2.5 rounded border border-[#ebeef0]">
                        <p className="text-[10px] text-[#74777f] uppercase font-bold">Nguồn dữ liệu</p>
                        <p className="font-semibold text-[#002045] mt-0.5">{syncResult.sourceName}</p>
                      </div>
                      <div className="bg-[#f8fafc] p-2.5 rounded border border-[#ebeef0]">
                        <p className="text-[10px] text-[#74777f] uppercase font-bold">Từ khóa</p>
                        <p className="font-semibold text-[#002045] mt-0.5">{syncResult.keyword}</p>
                      </div>
                      <div className="bg-[#f8fafc] p-2.5 rounded border border-[#ebeef0]">
                        <p className="text-[10px] text-[#74777f] uppercase font-bold">Bài báo thu được</p>
                        <p className="font-semibold text-green-700 mt-0.5">{syncResult.recordsFetched} bài viết</p>
                      </div>
                      <div className="bg-[#f8fafc] p-2.5 rounded border border-[#ebeef0] col-span-2">
                        <p className="text-[10px] text-[#74777f] uppercase font-bold">Thời gian chạy</p>
                        <div className="text-[11px] text-[#43474e] mt-1 space-y-0.5 font-mono">
                          <p>Bắt đầu: {formatDate(syncResult.startTime)}</p>
                          <p>Kết thúc: {formatDate(syncResult.endTime)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Danh sách bài báo vừa lấy về */}
          {syncResult && !isLoading && syncResult.newPaperPreviews && syncResult.newPaperPreviews.length > 0 && (
            <div className="bg-white p-6 rounded-lg border border-[#ebeef0] shadow-sm space-y-4">
              <div>
                <h3 className="font-bold text-base text-[#002045] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#13696a]">description</span>
                  Danh sách bài báo vừa lấy về ({syncResult.newPaperPreviews.length} bài)
                </h3>
                <p className="text-xs text-[#74777f] mt-0.5">
                  Các ấn phẩm nghiên cứu khoa học vừa được thu thập và cập nhật vào hệ thống.
                </p>
              </div>

              <div className="overflow-x-auto border border-[#ebeef0] rounded-lg">
                <table className="min-w-full divide-y divide-[#ebeef0] text-left text-xs">
                  <thead className="bg-[#f8fafc] text-[#43474e] uppercase font-bold text-[10px]">
                    <tr>
                      <th className="px-6 py-3.5">Mã số</th>
                      <th className="px-6 py-3.5 w-1/2">Tiêu đề bài báo</th>
                      <th className="px-6 py-3.5">Lượt trích dẫn</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ebeef0] text-[#181c1e] font-medium bg-white">
                    {syncResult.newPaperPreviews.map((paper) => (
                      <tr key={paper.paperId} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-mono text-[#74777f]">#{paper.paperId}</td>
                        <td className="px-6 py-4 font-bold text-slate-800">
                          <div className="line-clamp-2" title={paper.title}>{paper.title}</div>
                          {paper.authors && paper.authors.length > 0 && (
                            <p className="text-[10px] text-[#74777f] font-semibold mt-1">
                              Tác giả: {paper.authors.join(", ")}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-extrabold">
                            {paper.citationCount}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cột trái: Form điều khiển đồng bộ */}
            <div className="bg-white p-6 rounded-lg border border-[#ebeef0] shadow-sm space-y-6 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-base text-[#002045] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#13696a]">sync</span>
                  Đồng bộ dữ liệu
                </h3>
                <p className="text-xs text-[#74777f] mt-0.5">
                  Kích hoạt tác vụ quét và cập nhật lại toàn bộ chỉ số trích dẫn của các bài báo khoa học hiện có trong hệ thống từ OpenAlex.
                </p>
              </div>

              <form onSubmit={handleGlobalSync} className="space-y-4 flex-1 mt-4">
                <div>
                  <label className="block text-xs font-bold text-[#43474e] mb-1.5 uppercase">
                    Số lượng kết quả tối đa
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={100}
                    disabled={isLoadingGlobal}
                    className="w-full p-2.5 bg-[#f1f4f6] border border-[#c4c6cf] rounded focus:outline-none focus:border-[#13696a] text-xs font-semibold text-[#181c1e] disabled:opacity-60"
                    value={maxResultsGlobal}
                    onChange={(e) => setMaxResultsGlobal(Number(e.target.value))}
                  />
                  <p className="text-[10px] text-[#74777f] mt-1.5">
                    Giới hạn số lượng bài báo sẽ được quét và cập nhật chỉ số trích dẫn trong lượt đồng bộ này.
                  </p>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoadingGlobal}
                    className="w-full bg-[#13696a] hover:bg-[#0f5455] text-white text-xs font-bold py-3 rounded-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-60"
                  >
                    <span className={`material-symbols-outlined text-sm ${isLoadingGlobal ? "animate-spin" : ""}`}>
                      sync
                    </span>
                    {isLoadingGlobal ? "Đang tiến hành đồng bộ..." : "Bắt đầu đồng bộ"}
                  </button>
                </div>
              </form>
            </div>

            {/* Cột phải: Trạng thái và Kết quả trả về */}
            <div className="bg-white p-6 rounded-lg border border-[#ebeef0] shadow-sm flex flex-col justify-between min-h-[300px]">
              <div>
                <h3 className="font-bold text-base text-[#002045] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#13696a]">assignment</span>
                  Trạng thái đồng bộ toàn cục
                </h3>
                <p className="text-xs text-[#74777f] mt-0.5">
                  Chi tiết công việc và trạng thái phản hồi từ máy chủ OpenAlex.
                </p>
              </div>

              <div className="flex-1 mt-4 flex flex-col justify-center">
                {isLoadingGlobal && (
                  <div className="text-center py-8 space-y-3">
                    <div className="inline-block animate-spin text-3xl text-[#13696a] font-light">⏳</div>
                    <p className="text-xs text-[#43474e] font-semibold">
                      Đang đồng bộ dữ liệu chỉ số trích dẫn...
                    </p>
                    <p className="text-[10px] text-[#74777f] italic">
                      (Quá trình này có thể tốn thời gian tùy thuộc vào số lượng bài báo yêu cầu)
                    </p>
                  </div>
                )}

                {errorMsgGlobal && !isLoadingGlobal && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <span className="material-symbols-outlined text-sm">error</span>
                      Đồng bộ thất bại
                    </div>
                    <p className="text-xs font-medium">{errorMsgGlobal}</p>
                  </div>
                )}

                {!isLoadingGlobal && !errorMsgGlobal && !syncResultGlobal && (
                  <div className="text-center py-12 text-[#74777f] space-y-2">
                    <span className="material-symbols-outlined text-4xl text-[#c4c6cf]">cloud_sync</span>
                    <p className="text-xs italic">Chưa thực hiện đồng bộ toàn cục trong phiên này.</p>
                  </div>
                )}

                {syncResultGlobal && !isLoadingGlobal && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-[#ebeef0] pb-2">
                      <span className="text-xs font-bold text-[#43474e]">Trạng thái</span>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${syncResultGlobal.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                          }`}
                      >
                        <span className="material-symbols-outlined text-[10px]">
                          {syncResultGlobal.status === "Completed" ? "check_circle" : "cancel"}
                        </span>
                        {syncResultGlobal.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-[#f8fafc] p-2.5 rounded border border-[#ebeef0]">
                        <p className="text-[10px] text-[#74777f] uppercase font-bold">Mã công việc</p>
                        <p className="font-semibold text-[#002045] mt-0.5">#{syncResultGlobal.syncJobId}</p>
                      </div>
                      <div className="bg-[#f8fafc] p-2.5 rounded border border-[#ebeef0]">
                        <p className="text-[10px] text-[#74777f] uppercase font-bold">Nguồn dữ liệu</p>
                        <p className="font-semibold text-[#002045] mt-0.5">{syncResultGlobal.sourceName}</p>
                      </div>
                      <div className="bg-[#f8fafc] p-2.5 rounded border border-[#ebeef0] col-span-2">
                        <p className="text-[10px] text-[#74777f] uppercase font-bold">Bài báo được quét cập nhật</p>
                        <p className="font-semibold text-green-700 mt-0.5">{syncResultGlobal.recordsFetched} bài viết</p>
                      </div>
                      <div className="bg-[#f8fafc] p-2.5 rounded border border-[#ebeef0] col-span-2">
                        <p className="text-[10px] text-[#74777f] uppercase font-bold">Thời gian chạy</p>
                        <div className="text-[11px] text-[#43474e] mt-1 space-y-0.5 font-mono">
                          <p>Bắt đầu: {formatDate(syncResultGlobal.startTime)}</p>
                          <p>Kết thúc: {formatDate(syncResultGlobal.endTime)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bảng hiển thị bài báo đã đồng bộ cập nhật */}
          {syncResultGlobal && !isLoadingGlobal && syncResultGlobal.updatedPapers && syncResultGlobal.updatedPapers.length > 0 && (
            <div className="bg-white p-6 rounded-lg border border-[#ebeef0] shadow-sm space-y-4 animate-fadeIn">
              <div>
                <h3 className="font-bold text-base text-[#002045] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#13696a]">description</span>
                  Danh sách bài báo vừa được cập nhật ({syncResultGlobal.updatedPapers.length} bài)
                </h3>
                <p className="text-xs text-[#74777f] mt-0.5">
                  Chi tiết các bài báo khoa học đã được quét và đồng bộ lại lượt trích dẫn từ hệ thống OpenAlex.
                </p>
              </div>

              <div className="overflow-x-auto border border-[#ebeef0] rounded-lg">
                <table className="min-w-full divide-y divide-[#ebeef0] text-left text-xs">
                  <thead className="bg-[#f8fafc] text-[#43474e] uppercase font-bold text-[10px]">
                    <tr>
                      <th className="px-6 py-3.5">Mã số</th>
                      <th className="px-6 py-3.5 w-1/3">Tiêu đề bài báo</th>
                      <th className="px-6 py-3.5">Lĩnh vực</th>
                      <th className="px-6 py-3.5 text-center">Trích dẫn cũ</th>
                      <th className="px-6 py-3.5 text-center">Trích dẫn mới</th>
                      <th className="px-6 py-3.5 text-center">Biến động</th>
                      <th className="px-6 py-3.5 text-right">Thời gian</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ebeef0] text-[#181c1e] font-medium bg-white">
                    {syncResultGlobal.updatedPapers.map((paper) => (
                      <tr key={paper.paperId} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-mono text-[#74777f]">#{paper.paperId}</td>
                        <td className="px-6 py-4 font-bold text-slate-800">
                          <div className="line-clamp-2" title={paper.title}>{paper.title}</div>
                        </td>
                        <td className="px-6 py-4 text-slate-500 font-semibold">{paper.topicName || "—"}</td>
                        <td className="px-6 py-4 text-center text-slate-400 font-mono">{paper.oldCitationCount}</td>
                        <td className="px-6 py-4 text-center text-[#002045] font-extrabold font-mono">{paper.newCitationCount}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-2 py-0.5 rounded font-extrabold font-mono text-[10px] ${
                            paper.citationDelta > 0 
                              ? "bg-emerald-50 text-emerald-700" 
                              : "bg-slate-100 text-slate-500"
                          }`}>
                            {paper.citationDelta > 0 ? `+${paper.citationDelta}` : paper.citationDelta}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-mono text-[#74777f]">
                          {formatDate(paper.updatedAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
