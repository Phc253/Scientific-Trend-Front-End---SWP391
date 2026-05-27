import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  // Thống kê số liệu hệ thống mô phỏng theo đặc tả yêu cầu
  const stats = [
    {
      label: "Tổng số bài báo",
      count: "45,281+",
      icon: "description",
      color: "text-[#002045]",
    },
    {
      label: "Từ khóa thịnh hành",
      count: "1,240+",
      icon: "sell",
      color: "text-[#13696a]",
    },
    {
      label: "Nguồn học thuật API",
      count: "3 Sources",
      icon: "api",
      color: "text-[#c6955e]",
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Khối Banner Chào mừng (Hero Welcome Box) */}
      <div className="bg-gradient-to-r from-[#002045] to-[#1a365d] text-white p-8 rounded-lg shadow-md">
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

      {/* Grid hiển thị các Thẻ Số Liệu (Metric Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-lg border border-[#ebeef0] flex items-center justify-between shadow-sm"
          >
            <div>
              <p className="text-sm font-medium text-[#43474e] mb-1">
                {stat.label}
              </p>
              <h3 className={`text-2xl font-bold ${stat.color} tabular-nums`}>
                {stat.count}
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

      {/* Phân vùng các Chủ đề Nghiên cứu Nổi bật (Featured Topics) */}
      <div className="bg-white p-6 rounded-lg border border-[#ebeef0] shadow-sm">
        <h2 className="text-lg font-bold text-[#002045] mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-base">
            local_fire_department
          </span>
          Chủ đề nghiên cứu hot gần đây
        </h2>
        <div className="flex flex-wrap gap-3">
          {[
            "Deep Learning",
            "Large Language Models",
            "Quantum Computing",
            "Edge AI",
            "Bioinformatics",
          ].map((topic, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-[#a2eded] text-[#1a6d6e] text-sm font-semibold rounded-full cursor-pointer hover:opacity-85 transition-opacity"
            >
              #{topic}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
