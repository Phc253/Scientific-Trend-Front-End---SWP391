import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api, type DashboardSummaryResponse } from "../../services/api";

export const ResearcherDashboard = () => {
  const [summary, setSummary] = useState<DashboardSummaryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setIsLoading(true);
        const res: any = await api.getDashboardSummary();
        // Xử lý an toàn phòng trường hợp Backend bọc dữ liệu trong thuộc tính 'data'
        const data = res?.data || res;
        setSummary(data);
      } catch (error) {
        console.error("Lỗi tải thông tin tổng quan:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSummary();
  }, []);

  const stats = [
    {
      label: "Tổng bài báo",
      value: summary?.totalPapers || 0,
      icon: "article",
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Tác giả",
      value: summary?.totalAuthors || 0,
      icon: "groups",
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      label: "Chủ đề",
      value: summary?.totalTopics || 0,
      icon: "category",
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      label: "Từ khóa",
      value: summary?.totalKeywords || 0,
      icon: "tag",
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fadeIn">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#002045] mb-2">
            Xin chào, Nhà nghiên cứu!
          </h1>
          <p className="text-slate-500">
            {summary?.lastSyncTime
              ? `Dữ liệu được cập nhật lần cuối vào: ${new Date(summary.lastSyncTime).toLocaleString("vi-VN")}`
              : "Chào mừng bạn quay lại hệ thống phân tích dữ liệu học thuật."}
          </p>
        </div>
        <Link
          to="/researcher/explore"
          className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined">search</span>
          Khám phá ngay
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <span className="material-symbols-outlined animate-spin text-4xl text-indigo-500">
            sync
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {/* 1. Khu vực Thẻ Thống Kê */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color} shrink-0`}
                >
                  <span className="material-symbols-outlined text-2xl">
                    {stat.icon}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-0.5">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-black text-slate-800 leading-none">
                    {stat.value.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* 2. Khu vực Lối tắt & Xu hướng (Chia 2 cột) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cột trái: Các khối chức năng nổi bật */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-900 to-[#1e1b4b] p-8 rounded-2xl text-white shadow-lg relative overflow-hidden group">
                <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[120px] text-white/5 opacity-20 group-hover:scale-110 transition-transform duration-500">
                  travel_explore
                </span>
                <h3 className="text-xl font-bold mb-2 relative z-10 flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-300">
                    travel_explore
                  </span>
                  Tìm kiếm bài báo
                </h3>
                <p className="text-blue-100 mb-6 relative z-10 text-sm leading-relaxed">
                  Tiếp cận kho dữ liệu học thuật khổng lồ, lưu trữ tài liệu vào
                  thư viện cá nhân chỉ với một cú click.
                </p>
                <Link
                  to="/researcher/explore"
                  className="relative z-10 inline-flex items-center gap-2 bg-white text-blue-900 font-bold px-5 py-2 rounded-xl hover:bg-blue-50 transition-colors text-sm"
                >
                  Đi tới Tìm kiếm
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_forward
                  </span>
                </Link>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between group hover:border-indigo-300 transition-colors">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-indigo-500 bg-indigo-50 p-1.5 rounded-lg">
                      library_books
                    </span>
                    Thư viện của bạn
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">
                    Quản lý danh sách các bài báo bạn đã lưu. Đọc lại, trích
                    xuất thông tin hoặc gỡ bỏ tài liệu không còn cần thiết.
                  </p>
                </div>
                <Link
                  to="/researcher/library"
                  className="text-indigo-600 font-bold hover:text-indigo-800 flex items-center gap-1 group-hover:gap-2 transition-all"
                >
                  Mở thư viện{" "}
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>

            {/* Cột phải: Bảng xếp hạng xu hướng thu gọn */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-rose-500">
                    local_fire_department
                  </span>
                  Đang thịnh hành
                </h3>
                <Link
                  to="/researcher/analytics"
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                >
                  Xem tất cả
                </Link>
              </div>

              <div className="flex-1 p-0 overflow-y-auto max-h-[250px]">
                {!summary?.trendingKeywords ||
                summary.trendingKeywords.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full p-6 text-slate-400">
                    <span className="material-symbols-outlined text-3xl mb-2">
                      trending_flat
                    </span>
                    <p className="text-sm text-center">
                      Chưa có dữ liệu xu hướng
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {summary.trendingKeywords.slice(0, 5).map((item, idx) => (
                      <div
                        key={idx}
                        className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full 
                            ${
                              idx === 0
                                ? "bg-amber-100 text-amber-600"
                                : idx === 1
                                  ? "bg-slate-200 text-slate-600"
                                  : idx === 2
                                    ? "bg-orange-100 text-orange-600"
                                    : "text-slate-400"
                            }`}
                          >
                            {idx + 1}
                          </span>
                          <div>
                            <p className="text-sm font-bold text-slate-700">
                              {item.name}
                            </p>
                            <p className="text-[10px] text-slate-500 uppercase">
                              {item.type === "Keyword" ? "Từ khóa" : "Chủ đề"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-indigo-600 flex items-center justify-end gap-1">
                            <span className="material-symbols-outlined text-[14px]">article</span>
                            {(item.paperCount || 0).toLocaleString()}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium">bài báo</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResearcherDashboard;
