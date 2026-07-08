import React, { useState, useEffect } from "react";
import { api, type DashboardSummaryResponse } from "../../services/api";

const LecturerDashboard: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await api.getDashboardSummary();
        setSummary(data);
      } catch (err) {
        console.error("Lỗi tải tổng quan:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-slate-800">
          Tổng quan Hệ thống
        </h2>
        <p className="text-sm text-slate-500">
          Chào mừng trở lại! Dưới đây là số liệu tóm tắt từ hệ thống SciTrend.
        </p>
      </div>

      {loading || !summary ? (
        <div className="text-emerald-600 font-medium animate-pulse">
          Đang tải dữ liệu...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-b-4 border-b-emerald-500">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Tổng Bài báo
            </h3>
            <p className="text-3xl font-black text-slate-800">
              {summary.totalPapers.toLocaleString()}
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-b-4 border-b-blue-500">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Tổng Tác giả
            </h3>
            <p className="text-3xl font-black text-slate-800">
              {summary.totalAuthors.toLocaleString()}
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-b-4 border-b-indigo-500">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Chủ đề & Từ khóa
            </h3>
            <p className="text-3xl font-black text-slate-800">
              {(summary.totalTopics + summary.totalKeywords).toLocaleString()}
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-b-4 border-b-amber-500">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Người dùng
            </h3>
            <p className="text-3xl font-black text-slate-800">
              {summary.totalUsers.toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LecturerDashboard;
