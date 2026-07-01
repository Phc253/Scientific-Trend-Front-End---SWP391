import React from "react";

const LecturerDashboard: React.FC = () => {
  // Mock data mô phỏng dữ liệu từ Backend
  const dashboardData = {
    activeGroups: 4,
    totalStudents: 20,
    newRelevantPapers: 12,
    researchGroups: [
      {
        id: 1,
        name: "SWP391 - Nhóm 1",
        topic: "Hệ thống quản lý tài liệu học thuật",
        status: "On Track",
        progress: 75,
        members: 5,
      },
      {
        id: 2,
        name: "SWP391 - Nhóm 3",
        topic: "Ứng dụng AI trong phân tích tài chính",
        status: "Needs Review",
        progress: 40,
        members: 4,
      },
      {
        id: 3,
        name: "Capstone - Nhóm 8",
        topic: "Kiến trúc Microservices E-commerce",
        status: "On Track",
        progress: 90,
        members: 6,
      },
    ],
    trendSuggestions: [
      {
        id: 1,
        keyword: "Retrieval-Augmented Generation (RAG)",
        growth: "+45%",
        category: "AI/ML",
      },
      {
        id: 2,
        keyword: "Event-Driven Architecture",
        growth: "+28%",
        category: "Software Eng.",
      },
      {
        id: 3,
        keyword: "Spring Boot 3 & Virtual Threads",
        growth: "+15%",
        category: "Backend",
      },
    ],
  };

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#064e3b]">
          Bảng điều khiển Giảng viên
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Quản lý nhóm đồ án và theo dõi xu hướng nghiên cứu mới nhất.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-emerald-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
            <span className="material-symbols-outlined">groups</span>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase">
              Nhóm đang hướng dẫn
            </p>
            <h3 className="text-2xl font-bold text-slate-800">
              {dashboardData.activeGroups}
            </h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-emerald-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
            <span className="material-symbols-outlined">school</span>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase">
              Tổng số Sinh viên
            </p>
            <h3 className="text-2xl font-bold text-slate-800">
              {dashboardData.totalStudents}
            </h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-emerald-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <span className="material-symbols-outlined">library_books</span>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase">
              Tài liệu mới (Chuyên ngành)
            </p>
            <h3 className="text-2xl font-bold text-slate-800">
              {dashboardData.newRelevantPapers}
            </h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cột trái: Quản lý nhóm đồ án (Chiếm 2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-emerald-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-emerald-50 flex justify-between items-center bg-white">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600">
                  workspaces
                </span>
                Tiến độ Nhóm Đồ án
              </h3>
              <button className="text-sm text-emerald-600 font-medium hover:text-emerald-800">
                Xem tất cả
              </button>
            </div>

            <div className="divide-y divide-slate-50">
              {dashboardData.researchGroups.map((group) => (
                <div
                  key={group.id}
                  className="p-5 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-[#064e3b]">{group.name}</h4>
                      <p className="text-sm text-slate-600 mt-0.5">
                        Đề tài:{" "}
                        <span className="font-medium text-slate-800">
                          {group.topic}
                        </span>
                      </p>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        group.status === "On Track"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      {group.status}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs text-slate-500 mb-1">
                        <span>Tiến độ hoàn thành</span>
                        <span className="font-bold">{group.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${group.progress >= 70 ? "bg-emerald-500" : "bg-amber-500"}`}
                          style={{ width: `${group.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-1 font-medium bg-white px-2 py-1 border border-slate-200 rounded-md">
                      <span className="material-symbols-outlined text-[14px]">
                        person
                      </span>
                      {group.members} SV
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cột phải: Gợi ý hướng nghiên cứu (Chiếm 1/3) */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#064e3b] to-[#047857] rounded-xl shadow-md p-6 text-white relative overflow-hidden">
            {/* Background pattern */}
            <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[120px] text-white/10 rotate-12 pointer-events-none">
              trending_up
            </span>

            <h3 className="text-base font-bold mb-1 relative z-10">
              Gợi ý Đề tài Học kỳ này
            </h3>
            <p className="text-xs text-emerald-100 mb-5 relative z-10">
              Dựa trên phân tích Activity Score toàn cầu
            </p>

            <div className="space-y-3 relative z-10">
              {dashboardData.trendSuggestions.map((trend) => (
                <div
                  key={trend.id}
                  className="bg-white/10 backdrop-blur-sm p-3 rounded-lg border border-white/20 hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] uppercase font-bold text-emerald-200 tracking-wider">
                      {trend.category}
                    </span>
                    <span className="text-xs font-bold text-emerald-300 flex items-center">
                      <span className="material-symbols-outlined text-[14px] mr-0.5">
                        arrow_upward
                      </span>
                      {trend.growth}
                    </span>
                  </div>
                  <h4 className="font-semibold text-sm mt-1">
                    {trend.keyword}
                  </h4>
                </div>
              ))}
            </div>

            <button className="w-full mt-5 bg-white text-[#064e3b] hover:bg-emerald-50 font-bold text-sm py-2 rounded-lg transition-colors shadow-sm">
              Gửi gợi ý cho nhóm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LecturerDashboard;
