import React, { useState, useEffect } from "react";
import { api, type DashboardSummaryResponse } from "../../services/api"; // Trỏ đúng đường dẫn tới api.ts của bạn

const StudentDashboard: React.FC = () => {
  const [data, setData] = useState<DashboardSummaryResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await api.getDashboardSummary();
        setData(response);
      } catch (err: any) {
        setError(err.message || "Lỗi khi tải dữ liệu tổng quan.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading)
    return (
      <div className="p-8 text-center text-blue-600 font-medium">
        Đang tải dữ liệu...
      </div>
    );
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!data) return null;

  return (
    <div className="animate-fadeIn space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <span className="material-symbols-outlined">library_books</span>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase">
              Tổng Bài Báo (Hệ thống)
            </p>
            <h3 className="text-2xl font-bold text-slate-800">
              {data.totalPapers.toLocaleString()}
            </h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
            <span className="material-symbols-outlined">key</span>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase">
              Từ khóa / Chủ đề
            </p>
            <h3 className="text-2xl font-bold text-slate-800">
              {data.totalKeywords + data.totalTopics}
            </h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
            <span className="material-symbols-outlined">group</span>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase">
              Tác giả
            </p>
            <h3 className="text-2xl font-bold text-slate-800">
              {data.totalAuthors.toLocaleString()}
            </h3>
          </div>
        </div>
      </div>

      {/* Hiển thị danh sách Trending Keywords */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-blue-600 text-lg">
            trending_up
          </span>
          Từ khóa đang Hot
        </h3>
        <div className="space-y-4">
          {data.trendingKeywords?.map((trend, idx) => (
            <div
              key={idx}
              className="pb-3 border-b border-slate-100 flex justify-between items-center last:border-0 last:pb-0"
            >
              <div>
                <p className="text-sm font-bold text-slate-700">{trend.name}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {trend.recentPaperCount} bài báo gần đây
                </p>
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                Điểm Trend: {trend.trendScore.toFixed(1)}
              </span>
            </div>
          ))}
          {(!data.trendingKeywords || data.trendingKeywords.length === 0) && (
            <p className="text-sm text-slate-500 italic">
              Chưa có dữ liệu xu hướng.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
