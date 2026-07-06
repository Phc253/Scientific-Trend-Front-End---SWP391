import React, { useState, useEffect } from "react";
import axios from "axios";
import type { SystemLog, SchedulerConfig } from "../../types/admin";

interface AdminOpenAlexConfigProps {
  addLog: (type: SystemLog["type"], message: string) => void;
}

export const AdminOpenAlexConfig: React.FC<AdminOpenAlexConfigProps> = ({ addLog }) => {
  const [enabled, setEnabled] = useState<boolean>(false);
  const [keyword, setKeyword] = useState<string>("Computer Science");
  const [maxResults, setMaxResults] = useState<number>(20);
  const [intervalHours, setIntervalHours] = useState<number>(24);
  const [fetchNewWorksEnabled, setFetchNewWorksEnabled] = useState<boolean>(true);
  const [refreshExistingWorksEnabled, setRefreshExistingWorksEnabled] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  const mountLogged = React.useRef(false);

  // Fetch configuration on component mount
  useEffect(() => {
    const fetchConfig = async () => {
      setIsLoading(true);
      setErrorMsg("");
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get<SchedulerConfig>("/api/Admin/scheduler-config", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        
        if (response.data) {
          setEnabled(response.data.enabled);
          setKeyword(response.data.keyword || "Computer Science");
          setMaxResults(response.data.maxResults || 20);
          setIntervalHours(response.data.intervalHours || 24);
          setFetchNewWorksEnabled(response.data.fetchNewWorksEnabled !== false);
          setRefreshExistingWorksEnabled(response.data.refreshExistingWorksEnabled !== false);
          if (!mountLogged.current) {
            addLog("INFO", "Tải cấu hình scheduler OpenAlex thành công.");
            mountLogged.current = true;
          }
        }
      } catch (err: any) {
        console.error("Error fetching scheduler config:", err);
        const errMsg =
          err.response?.data?.message ||
          err.response?.data?.errorMessage ||
          err.message ||
          "Không thể kết nối đến API để lấy cấu hình.";
        
        setErrorMsg(`Không thể tải cấu hình hiện tại: ${errMsg}`);
        if (!mountLogged.current) {
          addLog("WARNING", `Không thể tải cấu hình scheduler OpenAlex: ${errMsg}. Sử dụng các giá trị mặc định.`);
          mountLogged.current = true;
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    const payload: SchedulerConfig = {
      enabled,
      keyword: keyword.trim(),
      maxResults,
      intervalHours,
      fetchNewWorksEnabled,
      refreshExistingWorksEnabled,
    };

    addLog("INFO", `Đang lưu cấu hình scheduler OpenAlex: Chế độ ${enabled ? "Auto" : "Manual"}, Từ khóa: "${payload.keyword}"`);

    try {
      const token = localStorage.getItem("token");
      await axios.put("/api/Admin/scheduler-config", payload, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      setSuccessMsg("Cấu hình scheduler đã được cập nhật thành công!");
      addLog("SUCCESS", `Cập nhật cấu hình scheduler thành công. Chế độ: ${enabled ? "Tự động" : "Thủ công"}`);
      
      // Auto clear success message after 4s
      setTimeout(() => {
        setSuccessMsg("");
      }, 4000);
    } catch (err: any) {
      console.error("Error saving scheduler config:", err);
      const errMsg =
        err.response?.data?.message ||
        err.response?.data?.errorMessage ||
        err.message ||
        "Lỗi không xác định khi lưu cấu hình.";
      
      setErrorMsg(`Lưu cấu hình thất bại: ${errMsg}`);
      addLog("ERROR", `Lưu cấu hình scheduler OpenAlex thất bại: ${errMsg}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-[#ebeef0] shadow-sm animate-fadeIn mt-6">
      <div className="border-b border-[#ebeef0] pb-4 mb-4">
        <h3 className="font-bold text-base text-[#002045] flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[#13696a]">settings</span>
          Cấu hình tự động đồng bộ (OpenAlex Scheduler)
        </h3>
        <p className="text-xs text-[#74777f] mt-0.5">
          Quản lý chế độ đồng bộ dữ liệu: thủ công hoặc tự động quét các bài báo khoa học theo chu kỳ thời gian.
        </p>
      </div>

      {isLoading ? (
        <div className="py-8 text-center space-y-2">
          <div className="inline-block animate-spin text-2xl text-[#13696a] font-light">⏳</div>
          <p className="text-xs text-[#74777f]">Đang tải cấu hình scheduler...</p>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-xs flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">error</span>
              <span className="font-medium">{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-green-50 border border-green-200 rounded text-green-700 text-xs flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              <span className="font-medium">{successMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Chế độ hoạt động (Dropdown) */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#43474e] uppercase">
                Chế độ hoạt động
              </label>
              <select
                value={enabled.toString()}
                onChange={(e) => setEnabled(e.target.value === "true")}
                className="w-full p-2.5 bg-[#f1f4f6] border border-[#c4c6cf] rounded focus:outline-none focus:border-[#13696a] text-xs font-semibold text-[#181c1e]"
              >
                <option value="false">Đồng bộ thủ công (Manual Mode)</option>
                <option value="true">Tự động đồng bộ (Auto Mode)</option>
              </select>
              <p className="text-[10px] text-[#74777f] italic">
                {enabled 
                  ? "Hệ thống sẽ tự động tìm kiếm bài viết mới định kỳ." 
                  : "Chỉ đồng bộ khi quản trị viên thực hiện thủ công."
                }
              </p>
            </div>

            {/* Từ khóa quét tự động */}
            <div className="space-y-1">
              <label className={`block text-xs font-bold uppercase ${!enabled ? "text-[#9fa2a8]" : "text-[#43474e]"}`}>
                Từ khóa tự động (Keyword)
              </label>
              <input
                type="text"
                required
                disabled={!enabled}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Ví dụ: AI, Machine Learning..."
                className={`w-full p-2.5 border rounded focus:outline-none focus:border-[#13696a] text-xs font-semibold text-[#181c1e] ${
                  !enabled 
                    ? "bg-[#e1e4e6] border-[#dbdde0] text-[#74777f] cursor-not-allowed opacity-60" 
                    : "bg-[#f1f4f6] border-[#c4c6cf]"
                }`}
              />
              <p className="text-[10px] text-[#74777f] italic">Từ khóa sẽ được gửi đến OpenAlex API.</p>
            </div>

            {/* Số lượng kết quả tối đa */}
            <div className="space-y-1">
              <label className={`block text-xs font-bold uppercase ${!enabled ? "text-[#9fa2a8]" : "text-[#43474e]"}`}>
                Số kết quả tối đa (maxResults)
              </label>
              <input
                type="number"
                required
                min={1}
                max={100}
                disabled={!enabled}
                value={maxResults}
                onChange={(e) => setMaxResults(Number(e.target.value))}
                className={`w-full p-2.5 border rounded focus:outline-none focus:border-[#13696a] text-xs font-semibold text-[#181c1e] ${
                  !enabled 
                    ? "bg-[#e1e4e6] border-[#dbdde0] text-[#74777f] cursor-not-allowed opacity-60" 
                    : "bg-[#f1f4f6] border-[#c4c6cf]"
                }`}
              />
              <p className="text-[10px] text-[#74777f] italic">Số lượng bài báo tối đa lấy về trong mỗi lượt quét.</p>
            </div>

            {/* Chu kỳ quét tự động */}
            <div className="space-y-1">
              <label className={`block text-xs font-bold uppercase ${!enabled ? "text-[#9fa2a8]" : "text-[#43474e]"}`}>
                Chu kỳ quét tự động (intervalHours)
              </label>
              <input
                type="number"
                required
                min={1}
                disabled={!enabled}
                value={intervalHours}
                onChange={(e) => setIntervalHours(Number(e.target.value))}
                className={`w-full p-2.5 border rounded focus:outline-none focus:border-[#13696a] text-xs font-semibold text-[#181c1e] ${
                  !enabled 
                    ? "bg-[#e1e4e6] border-[#dbdde0] text-[#74777f] cursor-not-allowed opacity-60" 
                    : "bg-[#f1f4f6] border-[#c4c6cf]"
                }`}
              />
              <p className="text-[10px] text-[#74777f] italic">
                {!enabled 
                  ? "Kích hoạt Auto Mode để cấu hình thời gian quét." 
                  : `Hệ thống quét dữ liệu mỗi ${intervalHours} giờ.`
                }
              </p>
            </div>
          </div>

          {/* Tùy chọn đồng bộ bổ sung */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-[#ebeef0] pt-4 mt-2">
            {/* Tải bài viết mới */}
            <div className="flex items-center space-x-3 p-3.5 bg-[#f8fafc] rounded-lg border border-[#ebeef0] hover:border-slate-300 transition-colors">
              <input
                id="fetchNewWorksEnabled"
                type="checkbox"
                checked={fetchNewWorksEnabled}
                onChange={(e) => setFetchNewWorksEnabled(e.target.checked)}
                className="h-4.5 w-4.5 rounded border-gray-300 text-[#13696a] focus:ring-[#13696a] cursor-pointer"
              />
              <div className="text-xs">
                <label htmlFor="fetchNewWorksEnabled" className="font-bold text-[#002045] block cursor-pointer select-none">
                  Tải bài viết mới (Fetch New)
                </label>
                <p className="text-[10px] text-[#74777f] mt-0.5">Tìm kiếm và lưu trữ các ấn phẩm khoa học mới phát hành.</p>
              </div>
            </div>

            {/* Làm mới bài viết cũ */}
            <div className="flex items-center space-x-3 p-3.5 bg-[#f8fafc] rounded-lg border border-[#ebeef0] hover:border-slate-300 transition-colors">
              <input
                id="refreshExistingWorksEnabled"
                type="checkbox"
                checked={refreshExistingWorksEnabled}
                onChange={(e) => setRefreshExistingWorksEnabled(e.target.checked)}
                className="h-4.5 w-4.5 rounded border-gray-300 text-[#13696a] focus:ring-[#13696a] cursor-pointer"
              />
              <div className="text-xs">
                <label htmlFor="refreshExistingWorksEnabled" className="font-bold text-[#002045] block cursor-pointer select-none">
                  Cập nhật bài viết cũ (Refresh Existing)
                </label>
                <p className="text-[10px] text-[#74777f] mt-0.5">Làm mới số trích dẫn và thông tin của các bài viết hiện tại.</p>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-[#13696a] hover:bg-[#0f5455] text-white text-xs font-bold py-2.5 px-6 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-60"
            >
              <span className={`material-symbols-outlined text-sm ${isSaving ? "animate-spin" : ""}`}>
                save
              </span>
              {isSaving ? "Đang lưu..." : "Lưu cấu hình"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
