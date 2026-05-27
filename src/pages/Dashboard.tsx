import React, { useState } from "react";

interface TrendItem {
  name: string;
  score: number;
  growth: string;
  status: "up" | "down";
  papersCount: number;
}

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"all" | "computer-science" | "ai">(
    "all",
  );

  // Dữ liệu phân tích xu hướng học thuật mô phỏng theo cấu trúc bảng PublicationTrends
  const trendKeywords: TrendItem[] = [
    {
      name: "Generative AI",
      score: 98,
      growth: "+142%",
      status: "up",
      papersCount: 12450,
    },
    {
      name: "Large Language Models",
      score: 94,
      growth: "+89%",
      status: "up",
      papersCount: 8920,
    },
    {
      name: "Computer Vision",
      score: 85,
      growth: "+24%",
      status: "up",
      papersCount: 15410,
    },
    {
      name: "Quantum Computing",
      score: 71,
      growth: "+12%",
      status: "up",
      papersCount: 3120,
    },
    {
      name: "Reinforcement Learning",
      score: 62,
      growth: "-5%",
      status: "down",
      papersCount: 5430,
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Khối Thẻ Chỉ Số Đầu Trang (Top Metric Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-[#ebeef0] shadow-sm">
          <p className="text-xs font-bold text-[#43474e] uppercase tracking-wider">
            Từ khóa tăng trưởng mạnh nhất
          </p>
          <h2 className="text-2xl font-bold text-[#13696a] mt-2">
            Generative AI
          </h2>
          <div className="text-sm text-[#13696a] font-semibold mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">
              trending_up
            </span>{" "}
            Tăng trưởng 142% năm nay
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-[#ebeef0] shadow-sm">
          <p className="text-xs font-bold text-[#43474e] uppercase tracking-wider">
            Chủ đề được lưu nhiều nhất
          </p>
          <h2 className="text-2xl font-bold text-[#002045] mt-2">
            Transformers
          </h2>
          <div className="text-sm text-[#43474e] font-medium mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">bookmark</span>{" "}
            3,412 lượt lưu trữ tuần này
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-[#ebeef0] shadow-sm">
          <p className="text-xs font-bold text-[#43474e] uppercase tracking-wider">
            Trạng thái dữ liệu hệ thống
          </p>
          <h2 className="text-2xl font-bold text-[#c6955e] mt-2">Đã đồng bộ</h2>
          <div className="text-sm text-[#74777f] mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">
              check_circle
            </span>{" "}
            Chu kỳ tự động cập nhật ổn định
          </div>
        </div>
      </div>

      {/* Bảng Dữ Liệu Phân Tích Lớn (Data Table Section) */}
      <div className="bg-white p-6 rounded-lg border border-[#ebeef0] shadow-sm">
        {/* Header điều khiển trên bảng */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-[#002045]">
              Chỉ số đánh giá điểm xu hướng (Trend Score)
            </h2>
            <p className="text-xs text-[#74777f] mt-0.5">
              Xếp hạng mức độ quan tâm học thuật dựa trên số lượng công bố
            </p>
          </div>

          {/* Nút bấm thứ cấp: Xuất dữ liệu báo cáo dạng Outlined theo DESIGN.md */}
          <button className="border border-[#002045] text-[#002045] hover:bg-[#f1f4f6] px-4 py-2 rounded text-sm font-semibold flex items-center gap-2 transition-colors duration-200 cursor-pointer">
            <span className="material-symbols-outlined text-sm">download</span>
            Xuất dữ liệu báo cáo
          </button>
        </div>

        {/* Bộ tab phân loại danh mục nhanh */}
        <div className="flex gap-2 border-b border-[#ebeef0] mb-4 text-sm font-medium">
          <button
            onClick={() => setActiveTab("all")}
            className={`pb-2.5 px-2 border-b-2 transition-colors cursor-pointer ${activeTab === "all" ? "border-[#13696a] text-[#13696a] font-bold" : "border-transparent text-[#43474e] hover:text-[#181c1e]"}`}
          >
            Tất cả lĩnh vực
          </button>
          <button
            onClick={() => setActiveTab("computer-science")}
            className={`pb-2.5 px-2 border-b-2 transition-colors cursor-pointer ${activeTab === "computer-science" ? "border-[#13696a] text-[#13696a] font-bold" : "border-transparent text-[#43474e] hover:text-[#181c1e]"}`}
          >
            Computer Science
          </button>
        </div>

        {/* Khung cuộn chứa bảng chống vỡ giao diện trên di động */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f1f4f6] border-b border-[#c4c6cf]">
                <th className="p-4 text-sm font-bold text-[#43474e]">
                  Từ khóa nghiên cứu
                </th>
                <th className="p-4 text-sm font-bold text-[#43474e] text-center">
                  Số lượng bài báo
                </th>
                <th className="p-4 text-sm font-bold text-[#43474e] text-center">
                  Điểm xu hướng
                </th>
                <th className="p-4 text-sm font-bold text-[#43474e] text-right">
                  Tỷ lệ tăng trưởng
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ebeef0]">
              {trendKeywords.map((kw, index) => (
                <tr
                  key={index}
                  className="hover:bg-[#f1f4f6] hover:bg-opacity-50 transition-colors duration-150"
                >
                  <td className="p-4 text-sm font-semibold text-[#181c1e]">
                    {kw.name}
                  </td>
                  <td className="p-4 text-sm text-center text-[#43474e] tabular-nums">
                    {kw.papersCount.toLocaleString()}
                  </td>
                  <td className="p-4 text-sm text-center font-mono font-bold text-[#002045]">
                    {kw.score}/100
                  </td>
                  <td
                    className={`p-4 text-sm text-right font-bold tabular-nums ${kw.status === "up" ? "text-[#13696a]" : "text-red-600"}`}
                  >
                    {kw.growth}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
