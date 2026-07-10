import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { AdminOverview } from "../components/admin/AdminOverview";
import { AdminUsers } from "../components/admin/AdminUsers";
import { AdminOpenAlex } from "../components/admin/AdminOpenAlex";
import { AdminOpenAlexConfig } from "../components/admin/AdminOpenAlexConfig";
import { AdminPaperReports } from "../components/admin/AdminPaperReports";
import { AdminKeywordStats } from "../components/admin/AdminKeywordStats";
import type { SystemLog } from "../types/admin";
import { api } from "../services/api";

const Admin: React.FC = () => {
  const location = useLocation();

  // Determine active tab based on route path
  let activeTab: "overview" | "users" | "api" | "templates" | "scheduler" | "paper-reports" | "keyword-stats" = "overview";
  if (location.pathname.includes("/users")) {
    activeTab = "users";
  } else if (location.pathname.includes("/api")) {
    activeTab = "api";
  } else if (location.pathname.includes("/scheduler")) {
    activeTab = "scheduler";
  } else if (location.pathname.includes("/paper-reports")) {
    activeTab = "paper-reports";
  } else if (location.pathname.includes("/keyword-stats")) {
    activeTab = "keyword-stats";
  }

  // States for banner sync
  const [maxResults, setMaxResults] = useState<number>(20);
  const [tempMaxResults, setTempMaxResults] = useState<number>(20);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // 2. Hệ thống logs giả lập
  const [logs, setLogs] = useState<SystemLog[]>([
    { time: "21:05:12", type: "INFO", message: "Hệ thống khởi tạo cổng kết nối OpenAlex API." },
    { time: "21:06:45", type: "SUCCESS", message: "Đồng bộ hóa xu hướng từ khóa AI hoàn tất (1,240 từ khóa)." },
    { time: "21:08:02", type: "INFO", message: "Tài khoản USR-003 đăng nhập thành công từ địa chỉ IP 192.168.1.15." },
    { time: "21:10:00", type: "WARNING", message: "OpenAlex API phản hồi với độ trễ cao (850ms) trong cụm tìm kiếm 'quantum computing'." },
  ]);

  // Hàm tạo log mới
  const addLog = (type: SystemLog["type"], message: string) => {
    const now = new Date();
    const timeStr = now.toTimeString().split(" ")[0];
    setLogs((prev) => [{ time: timeStr, type, message }, ...prev.slice(0, 7)]);
  };

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 5000);
  };

  const handleBannerSync = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSyncing) return;
    setIsSyncing(true);
    addLog("INFO", `Yêu cầu đồng bộ OpenAlex toàn cục bắt đầu (maxResults: ${maxResults})`);
    try {
      await api.syncOpenAlexData(maxResults);
      addLog("SUCCESS", `Đồng bộ OpenAlex toàn cục hoàn tất thành công!`);
      showToast("success", `Đồng bộ dữ liệu OpenAlex hoàn tất thành công!`);
    } catch (err: any) {
      console.error(err);
      const msg = err.message || "Lỗi không xác định khi kết nối với máy chủ.";
      addLog("ERROR", `Đồng bộ OpenAlex toàn cục thất bại: ${msg}`);
      showToast("error", `Đồng bộ thất bại: ${msg}`);
    } finally {
      setIsSyncing(false);
    }
  };



  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Khối Banner Tiêu Đề */}
      <div className="bg-gradient-to-r from-[#002045] to-[#122e54] text-white p-6 rounded-xl shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#a2eded] text-3xl">admin_panel_settings</span>
            <h1 className="text-2xl font-bold tracking-tight">Bảng Điều Khiển Hệ Thống</h1>
          </div>
          <p className="text-[#86a0cd] text-sm mt-1 max-w-xl">
            Quản lý quyền hạn người dùng (Sinh viên, Giảng viên, Nghiên cứu viên), kiểm thử trực tiếp API OpenAlex và xem trước các thành phần thiết kế.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <form onSubmit={handleBannerSync} className="flex flex-wrap items-center gap-2 bg-white/5 p-2 rounded-lg border border-white/10 shadow-inner">
            <button
              type="button"
              onClick={() => {
                setTempMaxResults(maxResults);
                setIsModalOpen(true);
              }}
              disabled={isSyncing}
              className="flex items-center justify-center p-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-[#a2eded] hover:text-white transition-colors cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
              title="Cấu hình đồng bộ"
            >
              <span className="material-symbols-outlined text-sm">settings</span>
            </button>
            <button
              type="submit"
              disabled={isSyncing}
              className="bg-gradient-to-r from-[#13696a] to-[#188e8f] hover:from-[#0f5455] hover:to-[#13696a] text-white px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all shadow border border-[#1b8081]/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              <span className={`material-symbols-outlined text-xs ${isSyncing ? "animate-spin" : ""}`}>
                sync
              </span>
              {isSyncing ? "Đang đồng bộ..." : "Đồng bộ OpenAlex"}
            </button>
          </form>
        </div>
      </div>
      {/* Left bar layout handles navigation */}

      {/* NỘI DUNG TỪNG TABS */}
      {activeTab === "overview" && <AdminOverview logs={logs} />}
      {activeTab === "users" && <AdminUsers addLog={addLog} />}
      {activeTab === "api" && <AdminOpenAlex addLog={addLog} />}
      {activeTab === "scheduler" && <AdminOpenAlexConfig addLog={addLog} />}
      {activeTab === "paper-reports" && <AdminPaperReports addLog={addLog} />}
      {activeTab === "keyword-stats" && <AdminKeywordStats addLog={addLog} />}

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-2xl border text-xs md:text-sm font-semibold transition-all duration-300 ${
          toast.type === "success" 
            ? "bg-[#e6f4ea] text-[#137333] border-[#a3e2ab]" 
            : "bg-[#fce8e6] text-[#c5221f] border-[#fad2cf]"
        }`}>
          <span className="material-symbols-outlined text-lg">
            {toast.type === "success" ? "check_circle" : "error"}
          </span>
          <span>{toast.message}</span>
          <button type="button" onClick={() => setToast(null)} className="ml-2 hover:opacity-70 cursor-pointer">
            <span className="material-symbols-outlined text-sm font-bold">close</span>
          </button>
        </div>
      )}

      {/* Modal Cấu Hình Đồng Bộ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden transform transition-all animate-scaleUp">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#002045] to-[#122e54] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#a2eded] text-base">settings</span>
                <h3 className="font-bold text-xs">Cấu Hình Đồng Bộ Dữ Liệu</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setTempMaxResults(maxResults);
                  setIsModalOpen(false);
                }}
                className="text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm font-bold">close</span>
              </button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-3.5">
              <div className="space-y-1">
                <label htmlFor="modalMaxResults" className="block text-[11px] font-bold text-slate-700 uppercase">
                  Số lượng kết quả tối đa (maxResults)
                </label>
                <p className="text-[10px] text-slate-500">
                  Số lượng bản ghi tối đa muốn lấy từ cổng OpenAlex API về cơ sở dữ liệu hệ thống.
                </p>
                <input
                  id="modalMaxResults"
                  type="number"
                  min={1}
                  required
                  value={tempMaxResults}
                  onChange={(e) => setTempMaxResults(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full mt-1 p-2 bg-[#f1f4f6] border border-[#c4c6cf] rounded focus:outline-none focus:border-[#13696a] text-xs font-semibold text-[#181c1e]"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 p-3.5 border-t border-slate-100 flex items-center justify-end gap-2 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setTempMaxResults(maxResults);
                  setIsModalOpen(false);
                }}
                className="px-3 py-1.5 border border-slate-300 rounded text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => {
                  setMaxResults(tempMaxResults);
                  setIsModalOpen(false);
                  showToast("success", `Cấu hình đã lưu (maxResults: ${tempMaxResults})`);
                }}
                className="bg-[#13696a] hover:bg-[#0f5455] text-white px-3 py-1.5 rounded font-bold transition-colors cursor-pointer"
              >
                Lưu cấu hình
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
