import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import type { SystemLog } from "../../types/admin";

interface AdminOverviewProps {
  logs: SystemLog[];
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ logs }) => {
  // User Stats States
  const [totalUsers, setTotalUsers] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [lecturerCount, setLecturerCount] = useState(0);
  const [researcherCount, setResearcherCount] = useState(0);

  // Dashboard Summary States
  const [totalPapers, setTotalPapers] = useState(0);
  const [totalKeywords, setTotalKeywords] = useState(0);

  // Scheduler Configuration State
  const [schedulerEnabled, setSchedulerEnabled] = useState<boolean | null>(null);

  // Topic Facets Data State
  const [topicFacets, setTopicFacets] = useState<{ id: string; name: string; paperCount: number }[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const [usersRes, summaryRes, schedulerRes, topicsRes] = await Promise.all([
          api.getAdminUsers(),
          api.getDashboardSummary(),
          api.getSchedulerConfig().catch(() => null),
          api.getTopicFacetsAdmin({ page: 1, pageSize: 5 }).catch(() => null),
        ]);

        // Process User Stats
        if (usersRes && usersRes.items) {
          const items = usersRes.items;
          setTotalUsers(items.length);
          let students = 0;
          let lecturers = 0;
          let researchers = 0;
          items.forEach((item: any) => {
            const type = item.actorType?.toLowerCase();
            if (type === "student" || type === "sinh viên") {
              students++;
            } else if (type === "lecturer" || type === "giảng viên") {
              lecturers++;
            } else if (type === "researcher" || type === "nghiên cứu viên") {
              researchers++;
            }
          });
          setStudentCount(students);
          setLecturerCount(lecturers);
          setResearcherCount(researchers);
        }

        // Process Dashboard Summary
        if (summaryRes) {
          setTotalPapers(summaryRes.totalPapers || 0);
          setTotalKeywords(summaryRes.totalKeywords || 0);
        }

        // Process Scheduler Configuration
        if (schedulerRes) {
          setSchedulerEnabled(schedulerRes.enabled);
        }

        // Process Topic Facets
        if (topicsRes && topicsRes.success && topicsRes.data && topicsRes.data.items) {
          setTopicFacets(topicsRes.data.items);
        }
      } catch (err) {
        console.error("Error fetching overview stats:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const totalRoles = studentCount + lecturerCount + researcherCount;
  const pStudent = totalRoles > 0 ? (studentCount / totalRoles) * 100 : 0;
  const pLecturer = totalRoles > 0 ? (lecturerCount / totalRoles) * 100 : 0;
  const pResearcher = totalRoles > 0 ? (researcherCount / totalRoles) * 100 : 0;

  // Circumference for radius R = 35 is 2 * Math.PI * 35 = 219.91
  const C = 219.91;
  const lenStudent = (C * pStudent) / 100;
  const lenLecturer = (C * pLecturer) / 100;
  const lenResearcher = (C * pResearcher) / 100;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 4 Thẻ KPI Metric ở đầu trang */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Tổng số bài báo */}
        <div className="bg-white p-5 rounded-lg border border-[#ebeef0] shadow-sm flex items-center justify-between relative overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 bg-white/40 backdrop-blur-xs z-10 flex items-center justify-center">
              <span className="text-[10px] text-slate-400">⏳</span>
            </div>
          )}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-[#74777f] uppercase tracking-wider block">
              Tổng số bài báo
            </span>
            <h3 className="text-2xl font-extrabold text-[#002045] font-mono">
              {totalPapers.toLocaleString("vi-VN")}
            </h3>
            <span className="text-[10px] text-[#74777f] font-semibold block">Lưu trữ hệ thống</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined">description</span>
          </div>
        </div>

        {/* KPI 2: Tổng số từ khóa */}
        <div className="bg-white p-5 rounded-lg border border-[#ebeef0] shadow-sm flex items-center justify-between relative overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 bg-white/40 backdrop-blur-xs z-10 flex items-center justify-center">
              <span className="text-[10px] text-slate-400">⏳</span>
            </div>
          )}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-[#74777f] uppercase tracking-wider block">
              Từ khóa theo dõi
            </span>
            <h3 className="text-2xl font-extrabold text-[#002045] font-mono">
              {totalKeywords.toLocaleString("vi-VN")}
            </h3>
            <span className="text-[10px] text-[#74777f] font-semibold block">Chỉ số xu hướng</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined">sell</span>
          </div>
        </div>

        {/* KPI 3: Lượt gọi API OpenAlex */}
        <div className="bg-white p-5 rounded-lg border border-[#ebeef0] shadow-sm flex items-center justify-between relative overflow-hidden">
          <div className="space-y-1 flex-1 mr-2">
            <span className="text-[10px] font-bold text-[#74777f] uppercase tracking-wider block">
              Yêu cầu OpenAlex API
            </span>
            <div className="flex items-baseline gap-1.5">
              <h3 className="text-2xl font-extrabold text-[#002045] font-mono">0</h3>
              <span className="text-[9px] font-bold text-blue-700 bg-blue-50 px-1 py-0.5 rounded">0%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1.5">
              <div className="bg-blue-500 h-full" style={{ width: "1.48%" }}></div>
            </div>
            <span className="text-[9px] text-[#74777f] block pt-0.5">Hạn mức 1k </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined">api</span>
          </div>
        </div>

        {/* KPI 4: Trạng thái Scheduler */}
        <div className="bg-white p-5 rounded-lg border border-[#ebeef0] shadow-sm flex items-center justify-between relative overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 bg-white/40 backdrop-blur-xs z-10 flex items-center justify-center">
              <span className="text-[10px] text-slate-400">⏳</span>
            </div>
          )}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-[#74777f] uppercase tracking-wider block">
              Tự động Scheduler
            </span>
            <h3 className="text-xl font-extrabold text-[#002045] flex items-center gap-1.5 mt-0.5">
              {schedulerEnabled === null ? (
                <span className="text-slate-400">Chưa rõ</span>
              ) : schedulerEnabled ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Đang chạy
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                  Đang tắt
                </>
              )}
            </h3>
            <span className="text-[10px] text-[#74777f] font-semibold block">Quét bài báo định kỳ</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined">schedule</span>
          </div>
        </div>
      </div>

      {/* Hàng 2: Biểu đồ vai trò người dùng (1/3) & Biểu đồ cột Lĩnh vực (2/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Khối Biểu đồ tròn - Phân bố người dùng (Chiếm 1/3) */}
        <div className="bg-white p-6 rounded-lg border border-[#ebeef0] shadow-sm flex flex-col justify-between relative min-h-[350px]">
          {isLoading && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-xs flex items-center justify-center z-10 rounded-lg">
              <span className="animate-spin text-[#13696a] text-sm">⏳</span>
            </div>
          )}

          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-base text-[#002045] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#13696a]">pie_chart</span>
              Phân bố vai trò người dùng
            </h3>
            <span className="material-symbols-outlined text-slate-400 text-lg cursor-pointer hover:text-slate-600 transition-colors">
              more_vert
            </span>
          </div>

          <div className="flex flex-col items-center flex-1 justify-center">
            {/* SVG Donut/Pie Chart */}
            <div className="relative w-[130px] h-[130px] my-3">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  stroke="#f1f4f6"
                  strokeWidth="8"
                  fill="transparent"
                />

                {totalRoles === 0 ? (
                  // Default gray circle when empty
                  <circle
                    cx="50"
                    cy="50"
                    r="35"
                    stroke="#cbd5e1"
                    strokeWidth="8"
                    fill="transparent"
                  />
                ) : (
                  <>
                    {/* Student Slice */}
                    {lenStudent > 0 && (
                      <circle
                        cx="50"
                        cy="50"
                        r="35"
                        stroke="#38bdf8"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={`${lenStudent} ${C}`}
                        strokeDashoffset="0"
                        strokeLinecap={lenStudent === C ? "butt" : "round"}
                        className="transition-all duration-500 ease-out"
                      />
                    )}

                    {/* Lecturer Slice */}
                    {lenLecturer > 0 && (
                      <circle
                        cx="50"
                        cy="50"
                        r="35"
                        stroke="#4ade80"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={`${lenLecturer} ${C}`}
                        strokeDashoffset={-lenStudent}
                        strokeLinecap={lenLecturer === C ? "butt" : "round"}
                        className="transition-all duration-500 ease-out"
                      />
                    )}

                    {/* Researcher Slice */}
                    {lenResearcher > 0 && (
                      <circle
                        cx="50"
                        cy="50"
                        r="35"
                        stroke="#ec4899"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={`${lenResearcher} ${C}`}
                        strokeDashoffset={-(lenStudent + lenLecturer)}
                        strokeLinecap={lenResearcher === C ? "butt" : "round"}
                        className="transition-all duration-500 ease-out"
                      />
                    )}
                  </>
                )}
              </svg>

              {/* Center labels */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-extrabold text-[#002045] leading-none">
                  {totalUsers}
                </span>
                <span className="text-[9px] text-[#74777f] uppercase font-bold tracking-wider mt-1">
                  Thành viên
                </span>
              </div>
            </div>

            {/* Chi tiết thống kê - nằm bên dưới biểu đồ */}
            <div className="w-full mt-4 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-[#f1f4f6] pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full border-2 border-[#38bdf8] bg-transparent"></span>
                  <span className="font-semibold text-slate-600">Sinh viên</span>
                </div>
                <span className="font-bold text-[#002045] font-mono">
                  {studentCount} ({pStudent.toFixed(1)}%)
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-[#f1f4f6] pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full border-2 border-[#4ade80] bg-transparent"></span>
                  <span className="font-semibold text-slate-600">Giảng viên</span>
                </div>
                <span className="font-bold text-[#002045] font-mono">
                  {lecturerCount} ({pLecturer.toFixed(1)}%)
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-[#f1f4f6] pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full border-2 border-[#ec4899] bg-transparent"></span>
                  <span className="font-semibold text-slate-600">Nghiên cứu Viên</span>
                </div>
                <span className="font-bold text-[#002045] font-mono">
                  {researcherCount} ({pResearcher.toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Khối Biểu đồ cột nằm ngang - Top 5 Lĩnh vực nghiên cứu (Chiếm 2/3) */}
        <div className="bg-white p-6 rounded-lg border border-[#ebeef0] shadow-sm lg:col-span-2 flex flex-col justify-between relative min-h-[350px]">
          {isLoading && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-xs flex items-center justify-center z-10 rounded-lg">
              <span className="animate-spin text-[#13696a] text-sm">⏳</span>
            </div>
          )}

          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-base text-[#002045] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#13696a]">bar_chart</span>
              Chủ đề các lĩnh vực nghiên cứu trong hệ thống
            </h3>
            <span className="text-[10px] font-bold text-[#13696a] bg-[#e0f7f7] px-2 py-0.5 rounded">
              Dữ liệu Hệ thống
            </span>
          </div>

          <div className="space-y-4.5 flex-1 flex flex-col justify-center mt-2">
            {topicFacets.length === 0 ? (
              <div className="text-center py-12 text-slate-400 italic text-xs">
                Chưa có dữ liệu phân tích lĩnh vực.
              </div>
            ) : (
              topicFacets.map((topic) => {
                const maxCount = topicFacets[0]?.paperCount || 1;
                const percentage = (topic.paperCount / maxCount) * 100;

                return (
                  <div key={topic.id} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-700">{topic.name}</span>
                      <span className="text-[#002045] font-mono">{topic.paperCount} bài báo</span>
                    </div>
                    <div className="w-full bg-[#f1f4f6] h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#13696a] to-[#1cb5b7] h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Hàng 3: Nhật ký hoạt động (Full width) */}
      <div className="bg-white p-6 rounded-lg border border-[#ebeef0] shadow-sm flex flex-col justify-between min-h-[300px]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-[#002045] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#13696a]">assignment</span>
            Nhật ký hoạt động hệ thống
          </h3>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>

        <div className="flex-1 space-y-3.5 overflow-y-auto max-h-[300px] pr-1 custom-scrollbar text-xs">
          {logs.map((log, i) => {
            let badgeColor = "bg-[#f1f4f6] text-[#43474e]";
            if (log.type === "SUCCESS") badgeColor = "bg-[#dcfce7] text-[#16a34a]";
            if (log.type === "WARNING") badgeColor = "bg-[#fef9c3] text-[#ca8a04]";
            if (log.type === "ERROR") badgeColor = "bg-[#fef2f2] text-[#ef4444]";

            return (
              <div
                key={i}
                className="flex gap-2.5 items-start border-b border-[#f7fafc] pb-2.5 last:border-0 last:pb-0"
              >
                <span className="font-mono text-[#74777f] font-semibold">{log.time}</span>
                <div className="flex-1">
                  <span
                    className={`px-1.5 py-0.5 rounded font-bold text-[9px] mr-1.5 ${badgeColor}`}
                  >
                    {log.type}
                  </span>
                  <span className="text-[#43474e] font-medium">{log.message}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
