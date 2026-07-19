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
                  <th className="p-4 w-20 text-center">Xếp hạng</th>
                  <th className="p-4">Chủ đề / Từ khóa</th>
                  <th className="p-4 text-center w-36">Loại mục tiêu</th>
                  <th className="p-4 text-right w-44">Tổng số bài báo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {trendingTopics.map((topic, index) => {
                  const count = topic.paperCount || 0;
                  const isTopic = topic.type === "Topic";

                  return (
                    <tr
                      key={index}
                      className="hover:bg-slate-50 transition-colors group"
                    >
                      <td className="p-4 text-center">
                        <span
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-extrabold text-sm
                          ${
                            index === 0
                              ? "bg-amber-100 text-amber-700 ring-2 ring-amber-300"
                              : index === 1
                                ? "bg-slate-200 text-slate-700 ring-2 ring-slate-300"
                                : index === 2
                                  ? "bg-orange-100 text-orange-700 ring-2 ring-orange-300"
                                  : "bg-slate-50 text-slate-500 border border-slate-200"
                          }`}
                        >
                          {index + 1}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-slate-800 text-base flex items-center gap-2">
                          {topic.name || "Chưa xác định"}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${
                          isTopic 
                            ? "bg-indigo-50 text-indigo-700 border-indigo-200" 
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        }`}>
                          {isTopic ? "Chủ đề" : "Từ khóa"}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="inline-flex items-center gap-1.5 font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                          <span className="material-symbols-outlined text-sm text-slate-500">
                            article
                          </span>
                          {count.toLocaleString()} bài báo
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
