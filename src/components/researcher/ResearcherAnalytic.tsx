import React from "react";

const ResearcherAnalytics: React.FC = () => {
  // Mock data tương ứng với Model ActivityScoreResponse
  const trendingTopics = [
    {
      rank: 1,
      name: "Large Language Models",
      momentum: 8.5,
      citationVelocity: 1450,
    },
    {
      rank: 2,
      name: "Cloud Native Architecture",
      momentum: 6.2,
      citationVelocity: 890,
    },
    {
      rank: 3,
      name: "Zero Trust Security",
      momentum: 5.8,
      citationVelocity: 620,
    },
  ];

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Phân tích Xu hướng Chuyên sâu
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Dữ liệu được tính toán dựa trên Activity Score (Momentum & Citation
            Velocity).
          </p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <span className="material-symbols-outlined text-[18px]">
            download
          </span>
          Xuất báo cáo PDF
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Top Chủ đề Nóng nhất
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider">
                <th className="p-4 font-semibold">Xếp hạng</th>
                <th className="p-4 font-semibold">Chủ đề (Topic)</th>
                <th className="p-4 font-semibold text-right">
                  Đà tăng trưởng (Momentum)
                </th>
                <th className="p-4 font-semibold text-right">
                  Tốc độ Trích dẫn / Năm
                </th>
                <th className="p-4 font-semibold text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {trendingTopics.map((topic) => (
                <tr
                  key={topic.rank}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="p-4">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                        topic.rank === 1
                          ? "bg-amber-100 text-amber-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      #{topic.rank}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-indigo-900">
                    {topic.name}
                  </td>
                  <td className="p-4 text-right">
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold bg-emerald-50 px-2 py-1 rounded">
                      <span className="material-symbols-outlined text-[14px]">
                        trending_up
                      </span>
                      {topic.momentum}
                    </span>
                  </td>
                  <td className="p-4 text-right font-mono text-sm text-slate-600">
                    {topic.citationVelocity}
                  </td>
                  <td className="p-4 text-center">
                    <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                      Xem biểu đồ
                    </button>
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

export default ResearcherAnalytics;
