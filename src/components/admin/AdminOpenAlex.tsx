import React, { useState } from "react";
import { api } from "../../services/api";
import type { SystemLog, SyncJobResult } from "../../types/admin";

interface AdminOpenAlexProps {
  addLog: (type: SystemLog["type"], message: string) => void;
}

export const AdminOpenAlex: React.FC<AdminOpenAlexProps> = ({ addLog }) => {
  const [keyword, setKeyword] = useState("Computer Science");
  const [maxResults, setMaxResults] = useState(20);
  const [useCheckpoint, setUseCheckpoint] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [syncResult, setSyncResult] = useState<SyncJobResult | null>(null);
  const [showRawJson, setShowRawJson] = useState(false);

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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeIn">
      {/* Cột trái: Cấu hình và Kích hoạt Đồng bộ */}
      <div className="bg-white p-6 rounded-lg border border-[#ebeef0] shadow-sm space-y-6 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-base text-[#002045] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#13696a]">cloud_download</span>
            Đồng bộ hóa dữ liệu từ OpenAlex
          </h3>
          <p className="text-xs text-[#74777f] mt-0.5">
            Gửi yêu cầu đồng bộ dữ liệu nghiên cứu khoa học từ cổng OpenAlex API về cơ sở dữ liệu nội bộ.
          </p>
        </div>

        <form onSubmit={handleSync} className="space-y-4 flex-1 mt-4">
          <div>
            <label className="block text-xs font-bold text-[#43474e] mb-1.5 uppercase">
              Từ khóa (Keyword)
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
              Số lượng kết quả tối đa (maxResults)
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
              {isLoading ? "Đang thực hiện đồng bộ..." : "Bắt đầu đồng bộ dữ liệu"}
            </button>
          </div>
        </form>
      </div>

      {/* Cột phải: Trạng thái và Kết quả trả về */}
      <div className="bg-white p-6 rounded-lg border border-[#ebeef0] shadow-sm flex flex-col justify-between min-h-[350px]">
        <div>
          <h3 className="font-bold text-base text-[#002045] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#13696a]">assignment</span>
            Trạng thái công việc đồng bộ
          </h3>
          <p className="text-xs text-[#74777f] mt-0.5">
            Kết quả của tiến trình đồng bộ dữ liệu gần nhất trong phiên làm việc.
          </p>
        </div>

        <div className="flex-1 mt-4 flex flex-col justify-center">
          {isLoading && (
            <div className="text-center py-8 space-y-3">
              <div className="inline-block animate-spin text-3xl text-[#13696a] font-light">⏳</div>
              <p className="text-xs text-[#43474e] font-semibold">
                Đang gửi yêu cầu đồng bộ và chờ OpenAlex phản hồi...
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
                  <p className="text-[10px] text-[#74777f] uppercase font-bold">Bản ghi thu được</p>
                  <p className="font-semibold text-green-700 mt-0.5">{syncResult.recordsFetched} bản ghi</p>
                </div>
                <div className="bg-[#f8fafc] p-2.5 rounded border border-[#ebeef0] col-span-2">
                  <p className="text-[10px] text-[#74777f] uppercase font-bold">Thời gian chạy</p>
                  <div className="text-[11px] text-[#43474e] mt-1 space-y-0.5 font-mono">
                    <p>Bắt đầu: {formatDate(syncResult.startTime)}</p>
                    <p>Kết thúc: {formatDate(syncResult.endTime)}</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowRawJson(!showRawJson)}
                  className="text-xs text-[#13696a] font-bold hover:underline flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">code</span>
                  {showRawJson ? "Ẩn phản hồi JSON" : "Hiển thị phản hồi JSON chi tiết"}
                </button>
              </div>

              {showRawJson && (
                <div className="relative mt-2 p-3 bg-[#0f172a] text-[#38bdf8] rounded font-mono text-[10px] overflow-x-auto max-h-[150px] custom-scrollbar">
                  <pre>{JSON.stringify(syncResult, null, 2)}</pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
