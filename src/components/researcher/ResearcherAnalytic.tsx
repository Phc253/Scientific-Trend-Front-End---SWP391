import React from "react";

const ResearcherAnalytics: React.FC = () => {
  const trendingTopics = [
    { rank: 1, name: "Large Language Models", momentum: 8.5, citationVelocity: 1450, growth: "+24%" },
    { rank: 2, name: "Cloud Native Architecture", momentum: 6.2, citationVelocity: 890, growth: "+14%" },
    { rank: 3, name: "Zero Trust Security", momentum: 5.8, citationVelocity: 620, growth: "+11%" },
  ];

  const summaryCards = [
    { title: "Momentum trung bình", value: "6.8", caption: "Theo 30 chủ đề" },
    { title: "Tốc độ trích dẫn", value: "1.2k", caption: "Citations / năm" },
    { title: "Journal nổi bật", value: "Nature", caption: "Tăng 9%" },
  ];

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-end">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Phân tích xu hướng chuyên sâu</h2>
          <p className="text-sm text-slate-500 mt-1">
            Dữ liệu được trình bày theo góc nhìn nghiên cứu: momentum, gia tăng trích dẫn và chủ đề nóng.
          </p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <span className="material-symbols-outlined text-[18px]">download</span>
          Xuất báo cáo PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {summaryCards.map((card) => (
          <div key={card.title} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <p className="text-sm text-slate-500">{card.title}</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-2">{card.value}</h3>
            <p className="text-sm text-emerald-600 mt-1">{card.caption}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Top chủ đề nóng nhất</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider">
                <th className="p-4 font-semibold">Xếp hạng</th>
                <th className="p-4 font-semibold">Chủ đề</th>
                <th className="p-4 font-semibold text-right">Momentum</th>
                <th className="p-4 font-semibold text-right">Tốc độ trích dẫn</th>
                <th className="p-4 font-semibold text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {trendingTopics.map((topic) => (
                <tr key={topic.rank} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${topic.rank === 1 ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"}`}>
                      #{topic.rank}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-indigo-900">{topic.name}</td>
                  <td className="p-4 text-right">
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold bg-emerald-50 px-2 py-1 rounded">
                      <span className="material-symbols-outlined text-[14px]">trending_up</span>
                      {topic.momentum}
                    </span>
                  </td>
                  <td className="p-4 text-right font-mono text-sm text-slate-600">{topic.citationVelocity}</td>
                  <td className="p-4 text-center">
                    <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">Xem biểu đồ</button>
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
