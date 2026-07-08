import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api, type DashboardSummaryResponse } from "../../services/api";

const SharedDashboard: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Logic nhận diện Role để đổi màu giao diện
  const role =
    localStorage.getItem("userRoles") ||
    localStorage.getItem("actorType") ||
    "";
  const isLecturer = role.includes("Lecturer");

  const theme = {
    primaryBg: isLecturer ? "bg-emerald-600" : "bg-blue-600",
    primaryText: isLecturer ? "text-emerald-600" : "text-blue-600",
    lightBg: isLecturer ? "bg-emerald-50" : "bg-blue-50",
    border: isLecturer ? "border-emerald-200" : "border-blue-200",
    basePath: isLecturer ? "/lecturer" : "/student",
  };

  useEffect(() => {
    // Gọi API lấy dữ liệu tổng quan có sẵn trong api.ts
    api
      .getDashboardSummary()
      .then((res) => setSummary(res))
      .catch((err) => console.error("Lỗi tải Dashboard:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Tiêu đề */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            Tổng quan hoạt động
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Chào mừng bạn quay lại hệ thống SciTrend.
          </p>
        </div>
      </div>

      {/* Các Thẻ Thống Kê */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Tổng số bài báo trên hệ thống */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center transition-transform hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-full ${theme.lightBg} ${theme.primaryText} flex items-center justify-center`}
            >
              <span className="material-symbols-outlined text-2xl">
                menu_book
              </span>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500">
                Tài liệu hệ thống
              </p>
              <h3 className="text-2xl font-black text-slate-800">
                {loading
                  ? "..."
                  : summary?.totalPapers?.toLocaleString() || "0"}
              </h3>
            </div>
          </div>
        </div>

        {/* Card 2: Tổng số Chủ đề / Lĩnh vực */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center transition-transform hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-full ${theme.lightBg} ${theme.primaryText} flex items-center justify-center`}
            >
              <span className="material-symbols-outlined text-2xl">
                category
              </span>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500">
                Chủ đề nghiên cứu
              </p>
              <h3 className="text-2xl font-black text-slate-800">
                {loading
                  ? "..."
                  : summary?.totalTopics?.toLocaleString() || "0"}
              </h3>
            </div>
          </div>
        </div>

        {/* Card 3 (Gợi ý hành động theo Role) */}
        <div
          className={`${theme.primaryBg} p-6 rounded-2xl shadow-sm text-white flex flex-col justify-center transition-transform hover:-translate-y-1`}
        >
          <h3 className="font-bold text-lg mb-2">Khám phá nghiên cứu mới</h3>
          <p className="text-sm text-white/80 mb-4">
            Hàng ngàn bài báo khoa học đang chờ bạn.
          </p>
          <Link
            to={`${theme.basePath}/explore`}
            className="bg-white/20 hover:bg-white/30 text-white font-bold py-2 px-4 rounded-lg text-center transition-colors text-sm"
          >
            Bắt đầu khám phá
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SharedDashboard;
