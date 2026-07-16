import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api, type DashboardSummaryResponse } from "../../services/api";
import PersonalizedFeed from "./PersonalizedFeed";
import TrendingChart from "./TrendingChart";

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
    // Gọi API lấy dữ liệu tổng quan
    api
      .getDashboardSummary()
      .then((res) => setSummary(res))
      .catch((err) => console.error("Lỗi tải Dashboard:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
      {/* Tiêu đề */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-800">
            Bảng điều khiển
          </h1>
          <p className="text-slate-500 mt-1">
            Tổng hợp dữ liệu và đề xuất dành riêng cho bạn.
          </p>
        </div>
      </div>

      {/* CHIA LAYOUT 2 CỘT CHÍNH: Trái (Summary) - Phải (Personalized) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ========================================================= */}
        {/* CỘT TRÁI (Chiếm 2/3): DỮ LIỆU TỔNG QUAN & BIỂU ĐỒ         */}
        {/* ========================================================= */}
        <div className="lg:col-span-2 space-y-6">
          {/* HÀNG 1: Ba Thẻ Thống Kê (Chiếm 3 cột nhỏ) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Tổng số bài báo */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center transition-transform hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-full ${theme.lightBg} ${theme.primaryText} flex items-center justify-center shrink-0`}
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

            {/* Card 2: Tổng số Chủ đề */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center transition-transform hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-full ${theme.lightBg} ${theme.primaryText} flex items-center justify-center shrink-0`}
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

            {/* Card 3: Nút Explore */}
            <div
              className={`${theme.primaryBg} p-6 rounded-2xl shadow-sm text-white flex flex-col justify-center transition-transform hover:-translate-y-1`}
            >
              <h3 className="font-bold text-lg mb-2">Khám phá nghiên cứu</h3>
              <p className="text-sm text-white/80 mb-4 line-clamp-2">
                Hàng ngàn bài báo khoa học đang chờ bạn.
              </p>
              <Link
                to={`${theme.basePath}/explore`}
                className="bg-white/20 hover:bg-white/30 text-white font-bold py-2 px-4 rounded-lg text-center transition-colors text-sm w-full"
              >
                Bắt đầu ngay
              </Link>
            </div>
          </div>

          {/* HÀNG 2: Khu Vực Biểu Đồ (Nằm độc lập bên dưới, kéo dài hết cỡ) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm min-h-[380px] flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-rose-500">
                    trending_up
                  </span>
                  Từ khóa thịnh hành
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Top các chủ đề đang được quan tâm nhất hệ thống
                </p>
              </div>
            </div>

            {/* Vùng Render Biểu đồ */}
            <div className="flex-1 w-full relative">
              {loading ? (
                <div className="h-full flex items-center justify-center text-slate-400 animate-pulse">
                  Đang tải biểu đồ...
                </div>
              ) : summary?.trendingKeywords &&
                summary.trendingKeywords.length > 0 ? (
                <TrendingChart trendingData={summary.trendingKeywords} />
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                  Chưa đủ dữ liệu để tạo xu hướng.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CỘT PHẢI (Chiếm 1/3): ĐỀ XUẤT CÁ NHÂN HÓA                 */}
        {/* ========================================================= */}
        <div className="space-y-6">
          <PersonalizedFeed />
        </div>
      </div>
    </div>
  );
};

export default SharedDashboard;
