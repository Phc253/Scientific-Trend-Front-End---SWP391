import React, { useState, useEffect, useRef } from "react";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

type CompareType = "keywords" | "topics";

interface SuggestionItem {
  id: string | number;
  name: string;
  paperCount: number;
}

const ResearcherCompare: React.FC = () => {
  const navigate = useNavigate();
  const [compareType, setCompareType] = useState<CompareType>("keywords");
  const [years, setYears] = useState<number>(5);

  // Left field states
  const [leftInput, setLeftInput] = useState("");
  const [leftSelected, setLeftSelected] = useState<SuggestionItem | null>(null);
  const [leftSuggestions, setLeftSuggestions] = useState<SuggestionItem[]>([]);
  const [leftShowSuggestions, setLeftShowSuggestions] = useState(false);

  // Right field states
  const [rightInput, setRightInput] = useState("");
  const [rightSelected, setRightSelected] = useState<SuggestionItem | null>(null);
  const [rightSuggestions, setRightSuggestions] = useState<SuggestionItem[]>([]);
  const [rightShowSuggestions, setRightShowSuggestions] = useState(false);

  // Comparison Results States
  const [result, setResult] = useState<any | null>(null);
  const [loadingCompare, setLoadingCompare] = useState(false);
  const [errorCompare, setErrorCompare] = useState<string | null>(null);

  // Refs for closing suggestion boxes
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  // Close suggestion boxes when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (leftRef.current && !leftRef.current.contains(event.target as Node)) {
        setLeftShowSuggestions(false);
      }
      if (rightRef.current && !rightRef.current.contains(event.target as Node)) {
        setRightShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Clear states when toggling Compare Type
  const handleTypeChange = (type: CompareType) => {
    setCompareType(type);
    setLeftInput("");
    setLeftSelected(null);
    setLeftSuggestions([]);
    setRightInput("");
    setRightSelected(null);
    setRightSuggestions([]);
    setResult(null);
    setErrorCompare(null);
  };

  // Search suggestions on input change (Left)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (leftInput && (!leftSelected || leftSelected.name !== leftInput)) {
        fetchSuggestions(leftInput, "left");
      } else if (!leftInput) {
        fetchSuggestions("", "left");
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [leftInput]);

  // Search suggestions on input change (Right)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (rightInput && (!rightSelected || rightSelected.name !== rightInput)) {
        fetchSuggestions(rightInput, "right");
      } else if (!rightInput) {
        fetchSuggestions("", "right");
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [rightInput]);

  const fetchSuggestions = async (query: string, side: "left" | "right") => {
    try {
      let res: any;
      if (compareType === "keywords") {
        res = await api.getKeywordFacets(query, 1, 10);
      } else {
        res = await api.getTopicFacets(query, 1, 10);
      }

      const items = res?.data?.items || res?.items || [];
      const formattedItems = items.map((item: any) => ({
        id: item.id,
        name: item.name,
        paperCount: item.paperCount || 0,
      }));

      if (side === "left") {
        setLeftSuggestions(formattedItems);
        setLeftShowSuggestions(true);
      } else {
        setRightSuggestions(formattedItems);
        setRightShowSuggestions(true);
      }
    } catch (err) {
      console.error("Lỗi lấy gợi ý tìm kiếm:", err);
    }
  };

  const handleCompareSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const leftVal = leftSelected ? leftSelected.name : leftInput.trim();
    const rightVal = rightSelected ? rightSelected.name : rightInput.trim();

    if (!leftVal || !rightVal) {
      setErrorCompare("Vui lòng điền và chọn đầy đủ hai mục so sánh.");
      return;
    }

    if (leftVal.toLowerCase() === rightVal.toLowerCase()) {
      setErrorCompare("Hai mục so sánh phải hoàn toàn khác nhau.");
      return;
    }

    setLoadingCompare(true);
    setErrorCompare(null);
    setResult(null);

    try {
      let res: any;
      if (compareType === "keywords") {
        res = await api.compareKeywords(leftVal, rightVal, years);
      } else {
        res = await api.compareTopics(leftVal, rightVal, years);
      }
      setResult(res);
    } catch (err: any) {
      console.error("Lỗi khi so sánh xu hướng:", err);
      setErrorCompare(
        err?.message || "Không thể thực hiện so sánh. Vui lòng kiểm tra lại kết nối."
      );
    } finally {
      setLoadingCompare(false);
    }
  };

  // Robustly parse comparative trend data from backend response
  let yearsLabels: string[] = [];
  let leftDataPoints: number[] = [];
  let rightDataPoints: number[] = [];

  const leftLabel = leftSelected ? leftSelected.name : leftInput;
  const rightLabel = rightSelected ? rightSelected.name : rightInput;

  let leftItemName = leftLabel;
  let rightItemName = rightLabel;
  let leftTotalPapers = 0;
  let rightTotalPapers = 0;
  let leftTotalCitations = 0;
  let rightTotalCitations = 0;
  let leftGrowthRate = 0;
  let rightGrowthRate = 0;

  if (result && result.items && Array.isArray(result.items)) {
    const leftItem = result.items[0];
    const rightItem = result.items[1];

    if (leftItem) {
      leftItemName = leftItem.name;
      leftTotalPapers = leftItem.totalPaperCount ?? 0;
      leftTotalCitations = leftItem.totalCitationCount ?? 0;
      leftGrowthRate = leftItem.growthRate ?? 0;
    }
    if (rightItem) {
      rightItemName = rightItem.name;
      rightTotalPapers = rightItem.totalPaperCount ?? 0;
      rightTotalCitations = rightItem.totalCitationCount ?? 0;
      rightGrowthRate = rightItem.growthRate ?? 0;
    }

    const leftMetrics = leftItem?.yearlyMetrics || [];
    const rightMetrics = rightItem?.yearlyMetrics || [];

    const allYears = Array.from(
      new Set([
        ...leftMetrics.map((m: any) => m.year),
        ...rightMetrics.map((m: any) => m.year),
      ])
    ).filter(Boolean).sort((a: any, b: any) => a - b) as number[];

    yearsLabels = allYears.map((y) => y.toString());

    leftDataPoints = allYears.map((y) => {
      const match = leftMetrics.find((m: any) => m.year === y);
      return match ? match.paperCount ?? 0 : 0;
    });

    rightDataPoints = allYears.map((y) => {
      const match = rightMetrics.find((m: any) => m.year === y);
      return match ? match.paperCount ?? 0 : 0;
    });
  } else if (result) {
    if (Array.isArray(result)) {
      yearsLabels = result.map((item: any) => (item.year || item.publicationYear || "").toString());
      leftDataPoints = result.map((item: any) => item.leftPaperCount ?? item.leftCount ?? item.paperCount ?? 0);
      rightDataPoints = result.map((item: any) => item.rightPaperCount ?? item.rightCount ?? item.paperCount ?? 0);
    } else if (typeof result === "object") {
      const leftArr = result.left || result.leftTrend || result.leftKeyword || result.leftTopic || [];
      const rightArr = result.right || result.rightTrend || result.rightKeyword || result.rightTopic || [];

      const allYears = Array.from(
        new Set([
          ...leftArr.map((item: any) => item.year || item.publicationYear),
          ...rightArr.map((item: any) => item.year || item.publicationYear),
        ])
      ).filter(Boolean).sort() as number[];

      yearsLabels = allYears.map((y) => y.toString());

      leftDataPoints = allYears.map((y) => {
        const match = leftArr.find((item: any) => (item.year || item.publicationYear) === y);
        return match ? match.paperCount ?? match.count ?? 0 : 0;
      });

      rightDataPoints = allYears.map((y) => {
        const match = rightArr.find((item: any) => (item.year || item.publicationYear) === y);
        return match ? match.paperCount ?? match.count ?? 0 : 0;
      });
    }
  }

  // Calculate comparative analytics summaries
  const calculatedLeftPapers = leftDataPoints.reduce((acc, curr) => acc + curr, 0);
  const calculatedRightPapers = rightDataPoints.reduce((acc, curr) => acc + curr, 0);

  const finalLeftPapers = leftTotalPapers || calculatedLeftPapers;
  const finalRightPapers = rightTotalPapers || calculatedRightPapers;

  const avgLeft = leftDataPoints.length > 0 ? finalLeftPapers / leftDataPoints.length : 0;
  const avgRight = rightDataPoints.length > 0 ? finalRightPapers / rightDataPoints.length : 0;

  // Chart configuration
  const chartData = {
    labels: yearsLabels,
    datasets: [
      {
        label: leftItemName,
        data: leftDataPoints,
        borderColor: "rgb(79, 70, 229)", // Indigo
        backgroundColor: "rgba(79, 70, 229, 0.05)",
        borderWidth: 3,
        tension: 0.3,
        pointBackgroundColor: "rgb(79, 70, 229)",
        pointRadius: 4,
        fill: true,
      },
      {
        label: rightItemName,
        data: rightDataPoints,
        borderColor: "rgb(16, 185, 129)", // Emerald
        backgroundColor: "rgba(16, 185, 129, 0.05)",
        borderWidth: 3,
        tension: 0.3,
        pointBackgroundColor: "rgb(16, 185, 129)",
        pointRadius: 4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          font: { family: "Inter, sans-serif", size: 12, weight: "bold" as const },
          color: "#334155",
        },
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        padding: 12,
        titleFont: { family: "Inter, sans-serif", size: 13, weight: "bold" as const },
        bodyFont: { family: "Inter, sans-serif", size: 12 },
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: "#64748b",
          font: { family: "Inter, sans-serif", size: 11 },
        },
      },
      y: {
        grid: { color: "rgba(226, 232, 240, 0.6)" },
        ticks: {
          color: "#64748b",
          font: { family: "Inter, sans-serif", size: 11 },
          precision: 0,
        },
      },
    },
  };

  // Generate Automated Insights
  const moreProductive = finalLeftPapers > finalRightPapers ? leftItemName : rightItemName;
  const lessProductive = finalLeftPapers > finalRightPapers ? rightItemName : leftItemName;
  const ratioProductivity = finalLeftPapers > finalRightPapers
    ? (finalRightPapers > 0 ? (finalLeftPapers / finalRightPapers).toFixed(1) : finalLeftPapers)
    : (finalLeftPapers > 0 ? (finalRightPapers / finalLeftPapers).toFixed(1) : finalRightPapers);

  // Dynamic advice
  void moreProductive;
  void lessProductive;
  void ratioProductivity;

  return (
    <div className="animate-fadeIn space-y-6">
      {/* Title Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">So sánh xu hướng khoa học</h2>
        <p className="text-sm text-slate-500 mt-1">
          So sánh xu hướng số bài báo khoa học được công bố theo năm giữa hai từ khóa hoặc hai chủ đề khác nhau, hỗ trợ định hướng đề tài tiềm năng.
        </p>
      </div>

      {/* Selector Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => handleTypeChange("keywords")}
          className={`pb-3 px-6 text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            compareType === "keywords"
              ? "border-indigo-600 text-indigo-600 font-extrabold"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">sell</span>
          So sánh Từ khóa
        </button>
        <button
          onClick={() => handleTypeChange("topics")}
          className={`pb-3 px-6 text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            compareType === "topics"
              ? "border-indigo-600 text-indigo-600 font-extrabold"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">hub</span>
          So sánh Chủ đề
        </button>
      </div>

      {/* Compare Form Block */}
      <form
        onSubmit={handleCompareSubmit}
        className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left search */}
          <div ref={leftRef} className="relative">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
              Đối tượng so sánh 1 (Trái)
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-3.5 text-slate-400 text-[18px]">
                search
              </span>
              <input
                type="text"
                placeholder={compareType === "keywords" ? "Nhập từ khóa 1..." : "Nhập chủ đề 1..."}
                value={leftInput}
                onChange={(e) => setLeftInput(e.target.value)}
                onFocus={() => {
                  fetchSuggestions(leftInput, "left");
                  setLeftShowSuggestions(true);
                }}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-indigo-500 transition-all text-sm font-semibold"
              />
            </div>
            {/* Left Autocomplete Dropdown */}
            {leftShowSuggestions && leftSuggestions.length > 0 && (
              <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-56 overflow-y-auto">
                {leftSuggestions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setLeftSelected(item);
                      setLeftInput(item.name);
                      setLeftShowSuggestions(false);
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-slate-700 text-sm font-medium border-b border-slate-100 last:border-b-0 flex justify-between items-center"
                  >
                    <span className="truncate">{item.name}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-mono">
                      {item.paperCount} bài báo
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right search */}
          <div ref={rightRef} className="relative">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
              Đối tượng so sánh 2 (Phải)
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-3.5 text-slate-400 text-[18px]">
                search
              </span>
              <input
                type="text"
                placeholder={compareType === "keywords" ? "Nhập từ khóa 2..." : "Nhập chủ đề 2..."}
                value={rightInput}
                onChange={(e) => setRightInput(e.target.value)}
                onFocus={() => {
                  fetchSuggestions(rightInput, "right");
                  setRightShowSuggestions(true);
                }}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-indigo-500 transition-all text-sm font-semibold"
              />
            </div>
            {/* Right Autocomplete Dropdown */}
            {rightShowSuggestions && rightSuggestions.length > 0 && (
              <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-56 overflow-y-auto">
                {rightSuggestions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setRightSelected(item);
                      setRightInput(item.name);
                      setRightShowSuggestions(false);
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-slate-700 text-sm font-medium border-b border-slate-100 last:border-b-0 flex justify-between items-center"
                  >
                    <span className="truncate">{item.name}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-mono">
                      {item.paperCount} bài báo
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Years select & Action button */}
          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1 w-full">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                Thời gian (Số năm)
              </label>
              <input
                type="number"
                min={1}
                max={50}
                value={years}
                onChange={(e) => setYears(Math.max(1, Number(e.target.value)))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-indigo-500 transition-all text-sm font-semibold"
                placeholder="Nhập số năm..."
              />
            </div>

            <button
              type="submit"
              disabled={loadingCompare}
              className="w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all text-sm flex items-center justify-center gap-2 cursor-pointer shadow disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">compare_arrows</span>
              {loadingCompare ? "Đang so sánh..." : "So sánh"}
            </button>
          </div>
        </div>

        {errorCompare && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm font-medium flex items-center gap-2 animate-fadeIn">
            <span className="material-symbols-outlined text-red-500">error</span>
            {errorCompare}
          </div>
        )}
      </form>

      {/* Comparisons Visualization Grid */}
      {result && (
        <div className="space-y-6 animate-fadeIn">
          {/* Comparative Metrics belt */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left highlight */}
            <div className="bg-white p-5 rounded-2xl border-l-4 border-l-indigo-600 border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Thống kê (
                  <span
                    onClick={() => {
                      if (compareType === "topics") {
                        navigate(`/topic/${encodeURIComponent(leftItemName)}`);
                      } else {
                        navigate(`/search?q=${encodeURIComponent(leftItemName)}`);
                      }
                    }}
                    className="cursor-pointer hover:underline text-indigo-600 font-bold"
                  >
                    {leftItemName}
                  </span>
                  )
                </span>
                <h3 className="text-2xl font-black text-slate-800 mt-1">
                  {finalLeftPapers.toLocaleString()} bài báo
                </h3>
                <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5 text-xs text-slate-500 font-semibold">
                  <span>Trích dẫn: <strong className="text-indigo-600">{leftTotalCitations.toLocaleString()}</strong></span>
                  <span>|</span>
                  <span>Tăng trưởng: <strong className={leftGrowthRate >= 0 ? "text-emerald-600" : "text-rose-600"}>{leftGrowthRate}%</strong></span>
                </div>
                <p className="text-xs text-slate-400 mt-1.5">
                  Trung bình: {avgLeft.toFixed(1)} bài báo / năm
                </p>
              </div>
              <span className="material-symbols-outlined text-indigo-500 text-4xl bg-indigo-50 p-3 rounded-full">
                description
              </span>
            </div>

            {/* Right highlight */}
            <div className="bg-white p-5 rounded-2xl border-l-4 border-l-emerald-500 border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Thống kê (
                  <span
                    onClick={() => {
                      if (compareType === "topics") {
                        navigate(`/topic/${encodeURIComponent(rightItemName)}`);
                      } else {
                        navigate(`/search?q=${encodeURIComponent(rightItemName)}`);
                      }
                    }}
                    className="cursor-pointer hover:underline text-emerald-600 font-bold"
                  >
                    {rightItemName}
                  </span>
                  )
                </span>
                <h3 className="text-2xl font-black text-slate-800 mt-1">
                  {finalRightPapers.toLocaleString()} bài báo
                </h3>
                <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5 text-xs text-slate-500 font-semibold">
                  <span>Trích dẫn: <strong className="text-emerald-600">{rightTotalCitations.toLocaleString()}</strong></span>
                  <span>|</span>
                  <span>Tăng trưởng: <strong className={rightGrowthRate >= 0 ? "text-emerald-600" : "text-rose-600"}>{rightGrowthRate}%</strong></span>
                </div>
                <p className="text-xs text-slate-400 mt-1.5">
                  Trung bình: {avgRight.toFixed(1)} bài báo / năm
                </p>
              </div>
              <span className="material-symbols-outlined text-emerald-500 text-4xl bg-emerald-50 p-3 rounded-full">
                description
              </span>
            </div>
          </div>

          {/* Line Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">
              Biểu đồ so sánh số lượng bài báo theo năm
            </h3>
            <div className="h-80 relative">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>

          {/* Dynamic Insights / Recommendations */}
        
        </div>
      )}
    </div>
  );
};

export default ResearcherCompare;
