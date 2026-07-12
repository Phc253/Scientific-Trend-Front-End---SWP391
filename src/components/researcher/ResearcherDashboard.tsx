import React from "react";

const ResearcherDashboard: React.FC = () => {
  const metrics = [
    { label: "Tài liệu đã lưu", value: "142", icon: "bookmarks", color: "bg-blue-50 text-blue-600" },
    { label: "Chủ đề / tạp chí đang theo dõi", value: "18", icon: "loyalty", color: "bg-indigo-50 text-indigo-600" },
    { label: "Công bố mới (30 ngày)", value: "34", icon: "article", color: "bg-emerald-50 text-emerald-600" },
  ];

  const trendBars = [38, 56, 44, 72, 88, 96];

  const watchlist = [
    { name: "Large Language Models", change: "+18%" },
    { name: "Graph Neural Networks", change: "+12%" },
    { name: "AI in Healthcare", change: "+9%" },
  ];

  return (
    <div className="animate-fadeIn space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Bảng điều khiển nghiên cứu</h2>
        <p className="text-sm text-slate-500 mt-1">
          Tập trung vào xu hướng công bố, chủ đề nóng và nguồn theo dõi của bạn.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((item) => (
          <div key={item.label} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${item.color}`}>
              <span className="material-symbols-outlined">{item.icon}</span>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase">{item.label}</p>
              <h3 className="text-2xl font-bold text-slate-800">{item.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.8fr] gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800">Xu hướng công bố trong 6 tháng</h3>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              +24% so với quý trước
            </span>
          </div>
          <div className="h-56 flex items-end gap-3 pt-4">
            {trendBars.map((value, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-slate-100 rounded-t-lg relative" style={{ height: "180px" }}>
                  <div
                    className="absolute bottom-0 left-0 right-0 rounded-t-lg bg-gradient-to-t from-indigo-600 to-cyan-400"
                    style={{ height: `${value}%` }}
                  />
                </div>
                <span className="text-xs text-slate-500">M{index + 1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Watchlist chủ đề</h3>
          <div className="space-y-3">
            {watchlist.map((item) => (
              <div key={item.name} className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-3">
                <div>
                  <p className="font-medium text-slate-800">{item.name}</p>
                  <p className="text-xs text-slate-500">Tăng trưởng nhanh</p>
                </div>
                <span className="text-sm font-semibold text-emerald-600">{item.change}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearcherDashboard;
