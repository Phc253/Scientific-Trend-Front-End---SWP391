import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import type { SyncJobItem } from "../../types/admin";

interface AdminOverviewProps {
  logs?: any[];
}

export const AdminOverview: React.FC<AdminOverviewProps> = () => {
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

  // Sync Jobs State
  const [syncJobs, setSyncJobs] = useState<SyncJobItem[]>([]);
  const [syncJobsPage, setSyncJobsPage] = useState(1);
  const [syncJobsPageSize] = useState(10);
  const [syncJobsTotalCount, setSyncJobsTotalCount] = useState(0);
  const [isLoadingSyncJobs, setIsLoadingSyncJobs] = useState(false);
  const [syncJobsError, setSyncJobsError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const fetchSyncJobs = async (page = 1) => {
    setIsLoadingSyncJobs(true);
    setSyncJobsError(null);
    try {
      const res = await api.getSyncJobs(page, syncJobsPageSize);
      if (res && Array.isArray(res.items)) {
        setSyncJobs(res.items);
        setSyncJobsPage(res.page || page);
        setSyncJobsTotalCount(res.totalCount || 0);
      } else if (Array.isArray(res)) {
        setSyncJobs(res as any);
        setSyncJobsTotalCount((res as any).length);
      }
    } catch (err: any) {
      console.error("Error fetching sync jobs:", err);
      setSyncJobsError(err.message || "Không thể tải danh sách công việc đồng bộ.");
    } finally {
      setIsLoadingSyncJobs(false);
    }
  };

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
    fetchSyncJobs(1);
  }, []);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

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
      {/* 3 Thẻ KPI Metric ở đầu trang (Cân đối 3 cột) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* KPI 1: Tổng số bài báo */}
        <div className="bg-white p-5 rounded-xl border border-[#ebeef0] shadow-sm flex items-center justify-between relative overflow-hidden hover:shadow-md transition duration-200">
          {isLoading && (
            <div className="absolute inset-0 bg-white/40 backdrop-blur-xs z-10 flex items-center justify-center">
              <span className="text-[10px] text-slate-400">⏳</span>
            </div>
          )}
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-[#74777f] uppercase tracking-wider block">
              Tổng số bài báo
            </span>
            <h3 className="text-2xl font-extrabold text-[#002045] font-mono">
              {totalPapers.toLocaleString("vi-VN")}
            </h3>
            <span className="text-[11px] text-[#74777f] font-semibold block">Lưu trữ hệ thống</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-2xl">description</span>
          </div>
        </div>

        {/* KPI 2: Tổng số từ khóa */}
        <div className="bg-white p-5 rounded-xl border border-[#ebeef0] shadow-sm flex items-center justify-between relative overflow-hidden hover:shadow-md transition duration-200">
          {isLoading && (
            <div className="absolute inset-0 bg-white/40 backdrop-blur-xs z-10 flex items-center justify-center">
              <span className="text-[10px] text-slate-400">⏳</span>
            </div>
          )}
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-[#74777f] uppercase tracking-wider block">
              Từ khóa theo dõi
            </span>
            <h3 className="text-2xl font-extrabold text-[#002045] font-mono">
              {totalKeywords.toLocaleString("vi-VN")}
            </h3>
            <span className="text-[11px] text-[#74777f] font-semibold block">Chỉ số xu hướng</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-2xl">sell</span>
          </div>
        </div>

        {/* KPI 3: Trạng thái Scheduler */}
        <div className="bg-white p-5 rounded-xl border border-[#ebeef0] shadow-sm flex items-center justify-between relative overflow-hidden hover:shadow-md transition duration-200">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-[#74777f] uppercase tracking-wider block">
              Scheduler Tự Động
            </span>
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  schedulerEnabled === true
                    ? "bg-emerald-500 animate-pulse"
                    : schedulerEnabled === false
                    ? "bg-slate-400"
                    : "bg-amber-400"
                }`}
              ></span>
              <h3 className="text-xl font-extrabold text-[#002045]">
                {schedulerEnabled === true
                  ? "Bật (Active)"
                  : schedulerEnabled === false
                  ? "Tắt (Off)"
                  : "Chưa rõ"}
              </h3>
            </div>
            <span className="text-[11px] text-[#74777f] font-semibold block">Đồng bộ định kỳ</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-2xl">schedule</span>
          </div>
        </div>
      </div>

      {/* Hàng 2: Thống kê Người Dùng & Phân Tích Lĩnh Vực */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Khối bên trái: Thống kê người dùng (6 cols) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-lg border border-[#ebeef0] shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-[#002045] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#13696a]">group</span>
                Phân bố người dùng theo vai trò
              </h3>
              <p className="text-xs text-[#74777f] mt-0.5">
                Tổng cộng <span className="font-mono font-bold text-[#002045]">{totalUsers.toLocaleString("vi-VN")}</span> tài khoản hệ thống
              </p>
            </div>
            <span className="text-[10px] font-bold text-[#13696a] bg-[#e0f7f7] px-2 py-0.5 rounded">
              Hệ thống
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 my-auto py-2">
            {/* Biểu đồ Donut Chart */}
            <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  stroke="#f1f4f6"
                  strokeWidth="12"
                  fill="transparent"
                />
                {totalRoles > 0 ? (
                  <>
                    {/* Sinh viên */}
                    <circle
                      cx="50"
                      cy="50"
                      r="35"
                      stroke="#13696a"
                      strokeWidth="12"
                      fill="transparent"
                      strokeDasharray={`${lenStudent} ${C - lenStudent}`}
                      strokeDashoffset="0"
                      className="transition-all duration-1000 ease-out"
                    />
                    {/* Giảng viên */}
                    <circle
                      cx="50"
                      cy="50"
                      r="35"
                      stroke="#1cb5b7"
                      strokeWidth="12"
                      fill="transparent"
                      strokeDasharray={`${lenLecturer} ${C - lenLecturer}`}
                      strokeDashoffset={`-${lenStudent}`}
                      className="transition-all duration-1000 ease-out"
                    />
                    {/* Nghiên cứu viên */}
                    <circle
                      cx="50"
                      cy="50"
                      r="35"
                      stroke="#86a0cd"
                      strokeWidth="12"
                      fill="transparent"
                      strokeDasharray={`${lenResearcher} ${C - lenResearcher}`}
                      strokeDashoffset={`-${lenStudent + lenLecturer}`}
                      className="transition-all duration-1000 ease-out"
                    />
                  </>
                ) : null}
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-xl font-extrabold text-[#002045] font-mono leading-none">{totalUsers}</span>
                <span className="text-[9px] text-[#74777f] font-bold uppercase tracking-wider mt-1">Tài khoản</span>
              </div>
            </div>

            {/* Chi tiết chú thích dạng thẻ mini */}
            <div className="flex-1 space-y-2.5 w-full">
              {/* Sinh viên */}
              <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition">
                <div className="flex justify-between items-center text-xs font-semibold mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#13696a]"></span>
                    <span className="text-slate-700">Sinh viên</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="text-[#002045] font-bold">{studentCount}</span>
                    <span className="text-[10px] text-slate-400 font-normal">({pStudent.toFixed(1)}%)</span>
                  </div>
                </div>
                <div className="w-full bg-slate-200/60 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#13696a] h-full rounded-full transition-all duration-500" style={{ width: `${pStudent}%` }}></div>
                </div>
              </div>

              {/* Giảng viên */}
              <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition">
                <div className="flex justify-between items-center text-xs font-semibold mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1cb5b7]"></span>
                    <span className="text-slate-700">Giảng viên</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="text-[#002045] font-bold">{lecturerCount}</span>
                    <span className="text-[10px] text-slate-400 font-normal">({pLecturer.toFixed(1)}%)</span>
                  </div>
                </div>
                <div className="w-full bg-slate-200/60 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#1cb5b7] h-full rounded-full transition-all duration-500" style={{ width: `${pLecturer}%` }}></div>
                </div>
              </div>

              {/* Nghiên cứu viên */}
              <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition">
                <div className="flex justify-between items-center text-xs font-semibold mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#86a0cd]"></span>
                    <span className="text-slate-700">Nghiên cứu viên</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="text-[#002045] font-bold">{researcherCount}</span>
                    <span className="text-[10px] text-slate-400 font-normal">({pResearcher.toFixed(1)}%)</span>
                  </div>
                </div>
                <div className="w-full bg-slate-200/60 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#86a0cd] h-full rounded-full transition-all duration-500" style={{ width: `${pResearcher}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Khối bên phải: Lĩnh vực nghiên cứu hàng đầu (6 cols) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-lg border border-[#ebeef0] shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-[#002045] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#13696a]">category</span>
              Chủ đề các lĩnh vực nghiên cứu trong hệ thống
            </h3>
            <span className="text-[10px] font-bold text-[#13696a] bg-[#e0f7f7] px-2 py-0.5 rounded">
              Dữ liệu Hệ thống
            </span>
          </div>

          <div className="space-y-4 flex-1 flex flex-col justify-center my-auto py-2">
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

      {/* Hàng 3: Danh sách công việc đồng bộ (Sync Jobs - Full width) */}
      <div className="bg-white p-6 rounded-lg border border-[#ebeef0] shadow-sm flex flex-col justify-between min-h-[350px]">
        <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#13696a]">sync</span>
            <h3 className="font-bold text-[#002045]">
              Lịch sử tải và đồng bộ dữ liệu
            </h3>
            {syncJobsTotalCount > 0 && (
              <span className="text-xs font-semibold text-[#13696a] bg-[#e0f7f7] px-2 py-0.5 rounded-full">
                {syncJobsTotalCount} công việc
              </span>
            )}
          </div>
          <button
            onClick={() => fetchSyncJobs(syncJobsPage)}
            disabled={isLoadingSyncJobs}
            className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-[#13696a] bg-slate-100 hover:bg-cyan-50 px-2.5 py-1.5 rounded transition cursor-pointer disabled:opacity-50"
            title="Làm mới dữ liệu"
          >
            <span className={`material-symbols-outlined text-sm ${isLoadingSyncJobs ? "animate-spin" : ""}`}>
              refresh
            </span>
            Làm mới
          </button>
        </div>

        {isLoadingSyncJobs ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12 text-slate-400">
            <span className="material-symbols-outlined animate-spin text-3xl mb-2 text-[#13696a]">sync</span>
            <p className="text-xs font-medium">Đang tải lịch sử đồng bộ...</p>
          </div>
        ) : syncJobsError ? (
          <div className="flex-1 flex flex-col items-center justify-center py-8 text-rose-500 bg-rose-50/50 rounded-lg border border-rose-100 p-4">
            <span className="material-symbols-outlined text-2xl mb-1">error</span>
            <p className="text-xs font-semibold">{syncJobsError}</p>
            <button
              onClick={() => fetchSyncJobs(syncJobsPage)}
              className="mt-3 text-xs bg-rose-600 text-white px-3 py-1 rounded hover:bg-rose-700 font-medium cursor-pointer"
            >
              Thử lại
            </button>
          </div>
        ) : syncJobs.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12 text-slate-400 italic text-xs">
            <span className="material-symbols-outlined text-3xl mb-2 text-slate-300">inbox</span>
            Chưa có công việc đồng bộ nào được ghi nhận.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-[#74777f]">
                  <th className="py-2.5 px-3 font-bold">ID</th>
                  <th className="py-2.5 px-3 font-bold">Nguồn</th>
                  <th className="py-2.5 px-3 font-bold">Thời gian bắt đầu</th>
                  <th className="py-2.5 px-3 font-bold">Thời gian kết thúc</th>
                  <th className="py-2.5 px-3 font-bold text-center">Bản ghi</th>
                  <th className="py-2.5 px-3 font-bold text-center">Trạng thái</th>
                  <th className="py-2.5 px-3 font-bold">Thông tin thêm</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {syncJobs.map((job) => {
                  let statusBadge = "bg-slate-100 text-slate-600 border-slate-200";
                  if (job.status === "Completed") {
                    statusBadge = "bg-emerald-50 text-emerald-700 border-emerald-200";
                  } else if (job.status === "Failed") {
                    statusBadge = "bg-rose-50 text-rose-700 border-rose-200";
                  } else if (job.status === "In Progress" || job.status === "Running") {
                    statusBadge = "bg-blue-50 text-blue-700 border-blue-200 animate-pulse";
                  }

                  return (
                    <tr key={job.syncJobId} className="hover:bg-slate-50/60 transition">
                      <td className="py-3 px-3 font-mono font-semibold text-[#002045]">
                        #{job.syncJobId}
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-700">
                        {job.sourceName || "OpenAlex"}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-600 text-[11px]">
                        {formatDate(job.startTime)}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-600 text-[11px]">
                        {formatDate(job.endTime)}
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-semibold text-slate-800">
                        {job.recordsFetched ?? 0}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full font-bold text-[10px] border ${statusBadge}`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 max-w-[220px]">
                        {job.errorMessage ? (
                          <span className="text-rose-600 text-[11px] block truncate" title={job.errorMessage}>
                            ⚠️ {job.errorMessage}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px] italic">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Phân trang */}
        {syncJobsTotalCount > syncJobsPageSize && (
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 text-xs">
            <span className="text-slate-500 font-medium">
              Hiển thị {((syncJobsPage - 1) * syncJobsPageSize) + 1} - {Math.min(syncJobsPage * syncJobsPageSize, syncJobsTotalCount)} / {syncJobsTotalCount} công việc
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => fetchSyncJobs(syncJobsPage - 1)}
                disabled={syncJobsPage <= 1 || isLoadingSyncJobs}
                className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Trước
              </button>
              <span className="px-2 py-1 font-mono font-semibold text-slate-600">
                {syncJobsPage} / {Math.ceil(syncJobsTotalCount / syncJobsPageSize)}
              </span>
              <button
                onClick={() => fetchSyncJobs(syncJobsPage + 1)}
                disabled={syncJobsPage >= Math.ceil(syncJobsTotalCount / syncJobsPageSize) || isLoadingSyncJobs}
                className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
