import React from "react";

const ResearcherDashboard: React.FC = () => {
  // Mock data tương ứng với Model UserDashboardResponse từ API của bạn
  const dashboardData = {
    totalBookmarks: 142,
    totalFollows: 18,
    papersFromFollowedJournalsCount: 34,
    recentNotifications: [
      {
        id: 1,
        message: "Bài báo mới xuất bản chứa từ khóa 'Microservices'.",
        date: "2 giờ trước",
      },
      {
        id: 2,
        message: "TS. Nguyễn Văn A vừa trích dẫn bài báo của bạn.",
        date: "1 ngày trước",
      },
    ],
    myPapersByYear: [
      { year: 2021, count: 2 },
      { year: 2022, count: 5 },
      { year: 2023, count: 8 },
      { year: 2024, count: 12 },
    ],
  };

  return (
    <div className="animate-fadeIn space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <span className="material-symbols-outlined">bookmarks</span>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase">
              Tài liệu đã lưu
            </p>
            <h3 className="text-2xl font-bold text-slate-800">
              {dashboardData.totalBookmarks}
            </h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
            <span className="material-symbols-outlined">loyalty</span>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase">
              Chủ đề/Tạp chí theo dõi
            </p>
            <h3 className="text-2xl font-bold text-slate-800">
              {dashboardData.totalFollows}
            </h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
            <span className="material-symbols-outlined">article</span>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase">
              Công bố mới (30 ngày)
            </p>
            <h3 className="text-2xl font-bold text-slate-800">
              {dashboardData.papersFromFollowedJournalsCount}
            </h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Placeholder (Dành cho MyPapersByYear) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-[300px] flex flex-col">
          <h3 className="text-sm font-bold text-slate-800 mb-4">
            Lịch sử công bố cá nhân
          </h3>
          <div className="flex-1 border-2 border-dashed border-slate-100 flex items-center justify-center bg-slate-50 rounded-lg">
            <p className="text-slate-400 text-sm flex items-center gap-2">
              <span className="material-symbols-outlined">bar_chart</span>
              Khu vực nhúng biểu đồ (Recharts/Chart.js)
            </p>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-600 text-lg">
              notifications
            </span>
            Hoạt động mới nhất
          </h3>
          <div className="space-y-4">
            {dashboardData.recentNotifications.map((noti) => (
              <div
                key={noti.id}
                className="pb-3 border-b border-slate-100 last:border-0 last:pb-0"
              >
                <p className="text-sm text-slate-700">{noti.message}</p>
                <p className="text-[11px] text-slate-400 mt-1">{noti.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearcherDashboard;
