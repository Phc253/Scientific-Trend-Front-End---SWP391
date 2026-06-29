import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api, type DashboardSummaryResponse } from "../services/api";

const Home: React.FC = () => {
  // Quản lý trạng thái dữ liệu và quá trình tải (loading)
  const [summary, setSummary] = useState<DashboardSummaryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Kích hoạt gọi API khi trang vừa render xong
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await api.getDashboardSummary();
        setSummary(data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu trang chủ:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummary();
  }, []);

  // Bố cục số liệu sẽ linh động theo dữ liệu trả về từ Backend
  const stats = [
    {
      label: "Tổng số bài báo",
      count: summary ? `${summary.totalPapers.toLocaleString()}+` : "0",
      icon: "description",
      color: "text-[#002045]",
    },
    {
      label: "Từ khóa hệ thống",
      count: summary ? `${summary.totalKeywords.toLocaleString()}+` : "0",
      icon: "sell",
      color: "text-[#13696a]",
    },
    {
      label: "Tác giả / Tạp chí",
      count: summary
        ? `${(summary.totalAuthors + summary.totalJournals).toLocaleString()}`
        : "0",
      icon: "groups",
      color: "text-[#c6955e]",
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Khối Banner Chào mừng */}
      <div className="bg-gradient-to-r from-[#002045] to-[#1a365d] text-white p-8 rounded-lg shadow-md relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-3">
            Khám phá tri thức khoa học nâng cao
          </h1>
          <p className="text-[#86a0cd] max-w-2xl text-base">
            Phân tích xu hướng nghiên cứu khoa học từ dữ liệu công khai của các
            nền tảng Semantic Scholar, OpenAlex và Crossref theo thời gian thực.
          </p>
          <div className="mt-6">
            <Link
              to="/search"
              className="bg-[#13696a] hover:bg-[#0f5455] text-white px-5 py-2.5 rounded font-medium inline-flex items-center gap-2 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">search</span>
              Bắt đầu khám phá ngay
            </Link>
          </div>
        </div>
      </div>

      {/* Grid hiển thị các Thẻ Số Liệu (Có hiệu ứng Loading mờ) */}
      <div
        className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-opacity duration-300 ${isLoading ? "opacity-50" : "opacity-100"}`}
      >
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-lg border border-[#ebeef0] flex items-center justify-between shadow-sm hover:shadow-md transition-shadow"
          >
            <div>
              <p className="text-sm font-medium text-[#43474e] mb-1">
                {stat.label}
              </p>
              <h3 className={`text-2xl font-bold ${stat.color} tabular-nums`}>
                {isLoading ? "..." : stat.count}
              </h3>
            </div>
            <div className="p-3 bg-[#f1f4f6] rounded-lg">
              <span
                className={`material-symbols-outlined ${stat.color} text-2xl`}
              >
                {stat.icon}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Phân vùng các Từ khóa xu hướng (Trending Keywords) từ Backend */}
      <div className="bg-white p-6 rounded-lg border border-[#ebeef0] shadow-sm">
        <h2 className="text-lg font-bold text-[#002045] mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-base text-red-500">
            local_fire_department
          </span>
          Xu hướng nghiên cứu nổi bật
        </h2>

        <div className="flex flex-wrap gap-3">
          {isLoading ? (
            <span className="text-sm text-[#74777f]">
              Đang tải dữ liệu xu hướng...
            </span>
          ) : summary?.trendingKeywords &&
            summary.trendingKeywords.length > 0 ? (
            summary.trendingKeywords.map((item, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-[#a2eded] text-[#1a6d6e] text-sm font-semibold rounded-full cursor-pointer hover:bg-[#13696a] hover:text-white transition-colors flex items-center gap-1 shadow-sm"
                title={`Điểm xu hướng: ${item.trendScore.toFixed(1)}`}
              >
                #{item.name}
                {item.growthRate > 0 && (
                  <span className="material-symbols-outlined text-[14px]">
                    trending_up
                  </span>
                )}
              </span>
            ))
          ) : (
            <span className="text-sm text-[#74777f]">
              Chưa có dữ liệu xu hướng trong tuần này.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
