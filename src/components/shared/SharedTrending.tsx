import React, { useEffect, useState } from "react";
import { api } from "../../services/api";

const SharedTrending: React.FC = () => {
  const [trends, setTrends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const role =
    localStorage.getItem("userRoles") ||
    localStorage.getItem("actorType") ||
    "";
  const isLecturer = role.includes("Lecturer");

  const theme = {
    shell: isLecturer ? "bg-emerald-50/70" : "bg-slate-50",
    card: isLecturer ? "from-emerald-500/10 via-white to-emerald-50" : "from-blue-500/10 via-white to-slate-50",
    accent: isLecturer ? "text-emerald-700" : "text-blue-700",
    border: isLecturer ? "border-emerald-200" : "border-slate-200",
    badge: isLecturer ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700",
    chip: isLecturer ? "bg-emerald-600" : "bg-blue-600",
  };

  useEffect(() => {
    api
      .getTrendingTopics(12)
      .then((res: any) => {
        const payload = Array.isArray(res)
          ? res
          : res?.data ?? res?.items ?? res?.result ?? res?.results ?? [];

        const normalized = (Array.isArray(payload) ? payload : []).map((item: any, index: number) => {
          const displayName =
            item.name ||
            item.topicName ||
            item.keywordName ||
            item.keyword ||
            item.title ||
            item.label ||
            `Chủ đề ${index + 1}`;

          const type = item.type || item.entityType || item.targetType || "Topic";
          const isTopic = /topic|researchtopic/i.test(type);
          const paperCount = Number(item.paperCount ?? item.paper_count ?? item.count ?? item.totalPapers ?? 0) || 0;
          const growthRate = Number(item.growthRate ?? item.growth_rate ?? item.yearOverYearGrowth ?? item.growth ?? item.change ?? 0) || 0;
          const score = Number(item.trendScore ?? item.score ?? item.activityScore ?? item.activity_score ?? item.momentum ?? item.value ?? 0) || 0;
          const barWidth = Math.min(100, Math.max(16, Math.round((paperCount > 0 ? Math.min(paperCount / 80, 100) : 20) + Math.abs(score) * 0.8)));

          return {
            ...item,
            displayName,
            isTopic,
            paperCount,
            growthRate,
            score,
            barWidth,
          };
        });

        setTrends(normalized);
      })
      .catch((err) => console.error("Lỗi tải xu hướng:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={`space-y-6 rounded-[28px] border ${theme.border} ${theme.shell} p-6 shadow-sm animate-fadeIn`}>
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            Chủ đề đang tăng tốc
          </h2>
          <p className="text-sm text-slate-500">
            Những chủ đề và từ khóa nhận được nhiều sự quan tâm nhất gần đây.
          </p>
        </div>
        <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold ${theme.badge}`}>
          <span className="material-symbols-outlined text-base">insights</span>
          Cập nhật trực tiếp từ API
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/70 p-16 text-slate-500">
          <span className="material-symbols-outlined mb-3 animate-spin text-4xl text-slate-300">
            data_usage
          </span>
          <p className="font-semibold">Đang phân tích dữ liệu xu hướng từ hệ thống...</p>
        </div>
      ) : trends.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <span className="material-symbols-outlined mb-3 block text-5xl text-slate-300">
            trending_down
          </span>
          <p className="font-semibold text-slate-600">
            Chưa có đủ dữ liệu để tính toán xu hướng tại thời điểm này.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {trends.map((item, index) => {
            const isTop = index === 0;
            return (
              <div
                key={`${item.displayName}-${index}`}
                className={`group rounded-[24px] border ${theme.border} bg-gradient-to-br ${theme.card} p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-black ${theme.chip} text-white`}>
                      #{index + 1}
                    </span>
                    <span className={`rounded-full border px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] ${item.isTopic ? "border-indigo-200 bg-indigo-50 text-indigo-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
                      {item.isTopic ? "Chủ đề" : "Từ khóa"}
                    </span>
                  </div>
                  {isTop ? (
                    <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-amber-700">
                      Hot nhất
                    </span>
                  ) : null}
                </div>

                <div className="mt-4">
                  <h3
                    className={`text-lg font-black ${theme.accent} line-clamp-2 leading-snug`}
                    title={item.displayName}
                  >
                    {item.displayName}
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    {item.isTopic
                      ? "Đang thu hút nhiều bài báo và nghiên cứu mới"
                      : "Xu hướng tìm kiếm và đề cập tăng rõ trong thời gian gần đây"}
                  </p>
                </div>

                <div className="mt-5 space-y-3 rounded-2xl border border-white/70 bg-white/80 p-3">
                  <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-base text-slate-400">
                        article
                      </span>
                      Bài báo
                    </span>
                    <span className="text-slate-900">{item.paperCount.toLocaleString()}</span>
                  </div>

                  <div>
                    <div className="mb-1 flex items-center justify-between text-xs font-semibold text-slate-500">
                      <span>Độ nóng</span>
                      <span>{item.score > 0 ? `${item.score.toFixed(1)}` : "Đang theo dõi"}</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className={`h-full rounded-full ${item.isTopic ? "bg-gradient-to-r from-indigo-500 to-violet-500" : "bg-gradient-to-r from-emerald-500 to-cyan-500"}`}
                        style={{ width: `${item.barWidth}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Tăng trưởng</span>
                    <span className={`font-black ${item.growthRate >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                      {item.growthRate >= 0 ? `+${item.growthRate.toFixed(1)}%` : `${item.growthRate.toFixed(1)}%`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SharedTrending;
