import React from "react";

const ResearcherAlerts: React.FC = () => {
  const alerts = [
    { keyword: "Machine Learning in Healthcare", frequency: "Hàng tuần", status: "Đang bật" },
    { keyword: "Graph Neural Networks", frequency: "Hàng ngày", status: "Đang bật" },
    { keyword: "Federated Learning", frequency: "Hàng tháng", status: "Tạm dừng" },
  ];

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Cảnh báo bài báo</h2>
          <p className="text-sm text-slate-500 mt-1">
            Theo dõi các chủ đề và journal mới phù hợp với nhịp nghiên cứu của bạn.
          </p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors flex items-center gap-2 shadow-sm">
          <span className="material-symbols-outlined text-sm">add_alert</span>
          Tạo cảnh báo mới
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {alerts.map((alert) => (
          <div key={alert.keyword} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-semibold text-slate-800">{alert.keyword}</h3>
              <p className="text-sm text-slate-500 mt-1">Tần suất: {alert.frequency}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${alert.status === "Đang bật" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${alert.status === "Đang bật" ? "bg-emerald-500" : "bg-slate-400"}`}></span>
                {alert.status}
              </span>
              <button className="text-slate-400 hover:text-indigo-600 p-1">
                <span className="material-symbols-outlined text-xl">edit</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResearcherAlerts;
