import { useState, useEffect } from "react";
import { api, type TrendingItem } from "../../services/api";

export const ResearcherAnalytic = () => {
  const [trendingTopics, setTrendingTopics] = useState<TrendingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTrendingData();
  }, []);

  const fetchTrendingData = async () => {
    try {
      // 1. Kích hoạt vòng xoay loading
      setIsLoading(true);

      // 2. Gọi API lấy dữ liệu mới
      const res: any = await api.getTrendingTopics(10);
      const items = res?.data || res || [];

      // 3. Sử dụng spread operator [...items] để tạo ra một mảng bộ nhớ mới hoàn toàn.
      // Điều này ép React KHÔNG ĐƯỢC lười biếng mà PHẢI vẽ lại (re-render) bảng dữ liệu
      setTrendingTopics(Array.isArray(items) ? [...items] : []);

      // 4. Mẹo UX: Dù API trả về nhanh cỡ nào, ta cũng ép nó hiện loading ít nhất 0.5s
      // để người dùng thấy rõ ràng là nút "Làm mới" có hoạt động
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error("Lỗi tải dữ liệu xu hướng:", error);
    } finally {
      setIsLoading(false); // Tắt loading
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#002045] flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-indigo-600">
              insights
            </span>
            Phân tích xu hướng nghiên cứu
          </h1>
          <p className="text-slate-500 text-sm">
            Cập nhật những chủ đề và từ khóa đang được quan tâm nhất hiện nay.
          </p>
        </div>
        <button
          onClick={fetchTrendingData}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
        >
          <span className="material-symbols-outlined text-sm">refresh</span>
          Làm mới
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64 text-slate-400">
          <span className="material-symbols-outlined animate-spin text-4xl">
            donut_large
          </span>
        </div>
      ) : trendingTopics.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-16 flex flex-col items-center text-center shadow-sm">
          <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">
            analytics
          </span>
          <h3 className="text-xl font-bold text-slate-700 mb-2">
            Chưa có dữ liệu xu hướng
          </h3>
          <p className="text-slate-500 max-w-md">
            Hệ thống đang thu thập và phân tích dữ liệu bài báo. Vui lòng quay
            lại sau.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-sm">
                  <th className="p-4 w-16 text-center">Top</th>
                  <th className="p-4">Chủ đề / Từ khóa</th>
                  <th className="p-4 text-center">Điểm xu hướng</th>
                  <th className="p-4 text-center">Bài báo mới</th>
                  <th className="p-4 text-right">Tăng trưởng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {trendingTopics.map((topic, index) => {
                  // Đặt giá trị mặc định là 0 nếu dữ liệu từ BE bị null/undefined
                  const score = topic.trendScore || 0;
                  const growth = topic.growthRate || 0;
                  const count = topic.recentPaperCount || 0;

                  const isPositive = growth >= 0;

                  return (
                    <tr
                      key={index}
                      className="hover:bg-slate-50 transition-colors group"
                    >
                      <td className="p-4 text-center">
                        <span
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm
                          ${
                            index === 0
                              ? "bg-amber-100 text-amber-600"
                              : index === 1
                                ? "bg-slate-200 text-slate-600"
                                : index === 2
                                  ? "bg-orange-100 text-orange-600"
                                  : "bg-slate-50 text-slate-400"
                          }`}
                        >
                          {index + 1}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-slate-800 text-base flex items-center gap-2">
                          {topic.name || "Chưa xác định"}
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 uppercase tracking-wider font-semibold border border-slate-200">
                            {topic.type === "Keyword" ? "Từ khóa" : "Chủ đề"}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-center font-mono font-medium text-indigo-600">
                        {/* Đã gọi toLocaleString trên biến score an toàn */}
                        {score.toLocaleString()}
                      </td>
                      <td className="p-4 text-center text-slate-600">
                        {count}
                      </td>
                      <td className="p-4 text-right">
                        <div
                          className={`inline-flex items-center gap-1 font-bold px-2 py-1 rounded
                          ${isPositive ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"}`}
                        >
                          <span className="material-symbols-outlined text-sm">
                            {isPositive ? "trending_up" : "trending_down"}
                          </span>
                          {isPositive ? "+" : ""}
                          {growth}%
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResearcherAnalytic;
