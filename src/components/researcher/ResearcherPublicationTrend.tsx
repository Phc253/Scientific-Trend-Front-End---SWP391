import React, { useState, useCallback, useRef } from "react";
import { api, type PaperFacetItem, type PublicationTrendReport } from "../../services/api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

type TargetType = "Keyword" | "ResearchTopic";

const ResearcherPublicationTrend: React.FC = () => {
  const [targetType, setTargetType] = useState<TargetType>("Keyword");
  const [target, setTarget] = useState("");
  const [years, setYears] = useState<number>(5);
  const [report, setReport] = useState<PublicationTrendReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Autocomplete state
  const [suggestions, setSuggestions] = useState<PaperFacetItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [sugLoading, setSugLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadSuggestions = useCallback(
    async (q: string, type: TargetType) => {
      setSugLoading(true);
      try {
        const queryVal = q.trim() || undefined;
        const res: any =
          type === "Keyword"
            ? await api.getKeywordFacets(queryVal, 1, 15)
            : await api.getTopicFacets(queryVal, 1, 15);
        const items = res?.data?.items || res?.items || [];
        setSuggestions(items);
      } catch {
        setSuggestions([]);
      } finally {
        setSugLoading(false);
      }
    },
    [],
  );

  const handleTargetChange = (value: string) => {
    setTarget(value);
    setShowSuggestions(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      loadSuggestions(value, targetType);
    }, 350);
  };

  const handleFocus = () => {
    setShowSuggestions(true);
    // Always trigger loading of suggestions on focus (either full list or filtered by current value)
    loadSuggestions(target, targetType);
  };

  const selectSuggestion = (item: PaperFacetItem) => {
    setTarget(item.name);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleGenerate = async () => {
    if (!target.trim()) return;
    setIsLoading(true);
    setError("");
    setReport(null);
    try {
      const res = await api.getPublicationTrend({
        targetType,
        target: target.trim(),
        years,
      });
      setReport(res);
    } catch (err: any) {
      setError(err?.message || "Không thể tạo báo cáo. Vui lòng kiểm tra lại thông tin.");
    } finally {
      setIsLoading(false);
    }
  };

  const metrics = report?.data?.yearlyMetrics || [];
  const labels = metrics.map((m) => m.year.toString());

  const lineChartData = {
    labels,
    datasets: [
      {
        label: "Số bài báo",
        data: metrics.map((m) => m.paperCount),
        borderColor: "rgb(99, 102, 241)",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: "rgb(99, 102, 241)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointHoverRadius: 7,
      },
    ],
  };

  const barChartData = {
    labels,
    datasets: [
      {
        label: "Trích dẫn",
        data: metrics.map((m) => m.citationCount),
        backgroundColor: "rgba(16, 185, 129, 0.7)",
        borderColor: "rgb(16, 185, 129)",
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const commonScales = {
    x: {
      grid: { display: false },
      ticks: { font: { size: 12, weight: "bold" as const }, color: "#64748b" },
    },
    y: {
      beginAtZero: true,
      grid: { color: "rgba(226, 232, 240, 0.6)" },
      ticks: { font: { size: 11 }, color: "#94a3b8" },
    },
  };

  const commonPlugins = {
    legend: { display: false },
    tooltip: {
      backgroundColor: "rgba(15, 23, 42, 0.9)",
      titleFont: { size: 13, weight: "bold" as const },
      bodyFont: { size: 12 },
      padding: 12,
      cornerRadius: 8,
    },
  };

  const lineOptions: React.ComponentProps<typeof Line>["options"] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: commonPlugins,
    scales: commonScales,
  };

  const barOptions: React.ComponentProps<typeof Bar>["options"] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: commonPlugins,
    scales: commonScales,
  };

  const growthRate = report?.data?.growthRate ?? 0;
  const growthColor =
    growthRate > 0 ? "text-emerald-600" : growthRate < 0 ? "text-red-500" : "text-slate-500";
  const growthIcon =
    growthRate > 0 ? "trending_up" : growthRate < 0 ? "trending_down" : "trending_flat";

  return (
    <div className="p-6 max-w-6xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#002045] flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined text-indigo-600">bar_chart</span>
          Báo cáo Xu hướng Xuất bản
        </h1>
        <p className="text-slate-500">
          Phân tích xu hướng số bài báo theo năm cho từ khóa hoặc chủ đề cụ thể.
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Target Type */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Loại mục tiêu</label>
            <div className="flex gap-2">
              {(["Keyword", "ResearchTopic"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setTargetType(t);
                    setTarget("");
                    setSuggestions([]);
                    loadSuggestions("", t);
                  }}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-bold border transition-all ${targetType === t
                    ? t === "Keyword"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                      : "bg-indigo-50 text-indigo-700 border-indigo-300"
                    : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                    }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {t === "Keyword" ? "sell" : "hub"}
                  </span>
                  {t === "Keyword" ? "Từ khóa" : "Chủ đề"}
                </button>
              ))}
            </div>
          </div>

          {/* Target Search */}
          <div className="md:col-span-2 relative">
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              {targetType === "Keyword" ? "Từ khóa" : "Chủ đề nghiên cứu"}
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                search
              </span>
              <input
                ref={inputRef}
                type="text"
                value={target}
                onChange={(e) => handleTargetChange(e.target.value)}
                onFocus={handleFocus}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder={`Nhập ${targetType === "Keyword" ? "từ khóa" : "chủ đề"}...`}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
              />
            </div>
            {/* Suggestion dropdown */}
            {showSuggestions && (suggestions.length > 0 || sugLoading) && (
              <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-52 overflow-y-auto">
                {sugLoading ? (
                  <div className="flex justify-center py-3 text-slate-400">
                    <span className="material-symbols-outlined animate-spin text-lg">sync</span>
                  </div>
                ) : (
                  suggestions.map((item) => (
                    <button
                      key={item.id}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => selectSuggestion(item)}
                      className="w-full text-left px-4 py-2.5 hover:bg-indigo-50 flex items-center justify-between transition-colors"
                    >
                      <span className="text-sm font-medium text-slate-800 truncate">
                        {item.name}
                      </span>
                      <span className="text-xs text-slate-400 shrink-0 ml-2">
                        {item.paperCount.toLocaleString()} bài
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Years */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Số năm</label>
            <select
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              {[3, 5, 7, 10, 15, 20].map((y) => (
                <option key={y} value={y}>
                  {y} năm
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={!target.trim() || isLoading}
          className="mt-5 flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">
            {isLoading ? "sync" : "analytics"}
          </span>
          {isLoading ? "Đang tạo báo cáo..." : "Tạo báo cáo"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined">error</span>
          {error}
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <span className="material-symbols-outlined animate-spin text-5xl mb-3">sync</span>
          <p className="font-medium">Đang phân tích dữ liệu...</p>
        </div>
      )}

      {/* Report */}
      {report && !isLoading && (
        <div className="space-y-6 animate-fadeIn">
          {/* Title & generated info */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-indigo-200 text-xs font-bold uppercase tracking-wider mb-1">
                  {report.reportType}
                </p>
                <h2 className="text-xl font-bold mb-1">{report.title}</h2>
                <p className="text-indigo-200 text-sm">
                  Tạo lúc: {new Date(report.generatedAt).toLocaleString("vi-VN")}
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl px-4 py-2 text-center">
                <p className="text-3xl font-black">{report.data.name}</p>
                <p className="text-xs text-indigo-200 uppercase tracking-wide font-bold">
                  {targetType === "Keyword" ? "Từ khóa" : "Chủ đề"}
                </p>
              </div>
            </div>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-indigo-600 text-[18px]">
                    article
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase">Tổng bài báo</span>
              </div>
              <p className="text-2xl font-black text-slate-800">
                {report.data.totalPaperCount.toLocaleString()}
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px]">
                    format_quote
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase">Tổng trích dẫn</span>
              </div>
              <p className="text-2xl font-black text-slate-800">
                {report.data.totalCitationCount.toLocaleString()}
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${growthRate > 0 ? "bg-emerald-100" : growthRate < 0 ? "bg-red-100" : "bg-slate-100"
                  }`}>
                  <span className={`material-symbols-outlined text-[18px] ${growthColor}`}>
                    {growthIcon}
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase">Tăng trưởng</span>
              </div>
              <p className={`text-2xl font-black ${growthColor}`}>
                {growthRate > 0 ? "+" : ""}
                {growthRate.toFixed(1)}%
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-purple-600 text-[18px]">
                    date_range
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase">Khoảng thời gian</span>
              </div>
              <p className="text-2xl font-black text-slate-800">
                {metrics.length > 0
                  ? `${metrics[0].year}–${metrics[metrics.length - 1].year}`
                  : "—"}
              </p>
            </div>
          </div>

          {/* Charts */}
          {metrics.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Publication trend line chart */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-indigo-500 text-[20px]">
                    show_chart
                  </span>
                  Xu hướng Số lượng Bài báo
                </h3>
                <div className="h-72">
                  <Line data={lineChartData} options={lineOptions} />
                </div>
              </div>

              {/* Citation bar chart */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-500 text-[20px]">
                    bar_chart
                  </span>
                  Số lượng Trích dẫn theo năm
                </h3>
                <div className="h-72">
                  <Bar data={barChartData} options={barOptions} />
                </div>
              </div>
            </div>
          )}

          {/* Yearly details table */}
          {metrics.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-slate-500 text-[20px]">
                    table_chart
                  </span>
                  Chi tiết theo năm
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="text-left px-6 py-3 font-bold text-slate-600">Năm</th>
                      <th className="text-right px-6 py-3 font-bold text-slate-600">Số bài báo</th>
                      <th className="text-right px-6 py-3 font-bold text-slate-600">Trích dẫn</th>
                      <th className="text-right px-6 py-3 font-bold text-slate-600">
                        Trích dẫn/Bài
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.map((m, idx) => (
                      <tr
                        key={m.year}
                        className={`border-t border-slate-50 ${idx % 2 === 0 ? "" : "bg-slate-50/50"
                          } hover:bg-indigo-50/30 transition-colors`}
                      >
                        <td className="px-6 py-3 font-bold text-slate-800">{m.year}</td>
                        <td className="px-6 py-3 text-right font-semibold text-indigo-600">
                          {m.paperCount.toLocaleString()}
                        </td>
                        <td className="px-6 py-3 text-right font-semibold text-emerald-600">
                          {m.citationCount.toLocaleString()}
                        </td>
                        <td className="px-6 py-3 text-right text-slate-500">
                          {m.paperCount > 0
                            ? (m.citationCount / m.paperCount).toFixed(1)
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-100 border-t-2 border-slate-200 font-bold">
                      <td className="px-6 py-3 text-slate-700">Tổng cộng</td>
                      <td className="px-6 py-3 text-right text-indigo-700">
                        {report.data.totalPaperCount.toLocaleString()}
                      </td>
                      <td className="px-6 py-3 text-right text-emerald-700">
                        {report.data.totalCitationCount.toLocaleString()}
                      </td>
                      <td className="px-6 py-3 text-right text-slate-600">
                        {report.data.totalPaperCount > 0
                          ? (
                            report.data.totalCitationCount / report.data.totalPaperCount
                          ).toFixed(1)
                          : "—"}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty initial state */}
      {!report && !isLoading && !error && (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 flex flex-col items-center text-center shadow-sm">
          <span className="material-symbols-outlined text-7xl text-slate-200 mb-4">
            bar_chart
          </span>
          <h3 className="text-xl font-bold text-slate-700 mb-2">Tạo báo cáo xu hướng</h3>
          <p className="text-slate-500 max-w-md">
            Chọn loại mục tiêu, nhập từ khóa hoặc chủ đề, chọn khoảng thời gian rồi nhấn "Tạo báo
            cáo" để xem phân tích xu hướng xuất bản.
          </p>
        </div>
      )}
    </div>
  );
};

export default ResearcherPublicationTrend;
