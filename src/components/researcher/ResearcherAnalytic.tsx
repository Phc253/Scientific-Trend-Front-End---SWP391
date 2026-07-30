import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link để điều hướng đọc bài
import { api, type TrendingItem, type Paper } from "../../services/api";

export const ResearcherAnalytic = () => {
  // State cho bảng xu hướng
  const [trendingTopics, setTrendingTopics] = useState<TrendingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State cho danh sách bài báo khi click vào 1 chủ đề
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [topicPapers, setTopicPapers] = useState<Paper[]>([]);
  const [isLoadingPapers, setIsLoadingPapers] = useState(false);

  useEffect(() => {
    fetchTrendingData();
  }, []);

  const fetchTrendingData = async () => {
    try {
      setIsLoading(true);
      const res: any = await api.getTrendingTopics(10);
      const items = res?.data || res || [];
      setTrendingTopics(Array.isArray(items) ? [...items] : []);
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error("Lỗi tải dữ liệu xu hướng:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm xử lý khi click vào 1 chủ đề trên bảng
  const handleTopicClick = async (keyword: string) => {
    if (!keyword) return;

    // Đặt state để chuyển màn hình sang danh sách bài báo
    setSelectedTopic(keyword);
    setIsLoadingPapers(true);

    try {
      // Gọi API tìm bài báo với từ khóa tương ứng
      const res: any = await api.searchPapers({
        q: keyword,
        page: 1,
        pageSize: 20, // Lấy 20 bài báo đầu tiên
      });
      const actualData = res?.data || res;
      setTopicPapers(actualData?.items || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách bài báo:", error);
      setTopicPapers([]);
    } finally {
      setIsLoadingPapers(false);
    }
  };

  // Hàm quay lại bảng thống kê
  const handleBackToTrending = () => {
    setSelectedTopic(null);
    setTopicPapers([]);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto animate-fadeIn">
      {/* Header dùng chung */}
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

        {/* Nếu không ở chế độ xem bài báo thì mới hiện nút Làm mới bảng */}
        {!selectedTopic && (
          <button
            onClick={fetchTrendingData}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">refresh</span>
            Làm mới
          </button>
        )}
      </div>

      {/* RẼ NHÁNH GIAO DIỆN: Nếu đã chọn 1 chủ đề -> Hiện danh sách bài báo */}
      {selectedTopic ? (
        <div className="space-y-6 animate-fadeIn">
          {/* Nút quay lại và Tiêu đề */}
          <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
            <button
              onClick={handleBackToTrending}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">
                arrow_back
              </span>
              Quay lại
            </button>
            <h2 className="text-lg font-bold text-slate-800">
              Các bài báo thuộc chủ đề:{" "}
              <span className="text-indigo-600">"{selectedTopic}"</span>
            </h2>
          </div>

          {/* Nội dung danh sách bài báo */}
          {isLoadingPapers ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <span className="material-symbols-outlined text-4xl animate-spin text-slate-300 mb-4">
                sync
              </span>
              <p className="text-sm text-slate-500 font-medium">
                Đang tìm kiếm bài báo...
              </p>
            </div>
          ) : topicPapers.length === 0 ? (
            <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl shadow-sm text-slate-500 font-medium">
              Chưa có bài báo nào được hệ thống thu thập cho chủ đề này.
            </div>
          ) : (
            <div className="space-y-4">
              {topicPapers.map((paper) => (
                <div
                  key={paper.paperId}
                  className="p-5 border border-slate-200 rounded-2xl hover:shadow-md transition-shadow bg-white flex flex-col sm:flex-row justify-between gap-4 group"
                >
                  <div className="flex-1">
                    <Link
                      to={`/researcher/paper/${paper.paperId}`}
                      className="text-lg font-bold text-slate-800 hover:text-indigo-600 transition-colors block mb-2 leading-snug"
                    >
                      {paper.title}
                    </Link>
                    <p className="text-sm text-slate-600 mb-3 font-medium">
                      {paper.authors?.join(", ") || "Không rõ tác giả"}
                    </p>
                    <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-500">
                      {paper.journal && (
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">
                            menu_book
                          </span>{" "}
                          {paper.journal}
                        </span>
                      )}
                      {paper.publicationYear && (
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">
                            calendar_today
                          </span>{" "}
                          {paper.publicationYear}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">
                          format_quote
                        </span>{" "}
                        Trích dẫn: {paper.citationCount || 0}
                      </span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col gap-2 justify-start sm:justify-center shrink-0 border-t sm:border-t-0 sm:border-l border-slate-100 pt-3 sm:pt-0 sm:pl-4">
                    <Link
                      to={`/researcher/paper/${paper.paperId}`}
                      className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-sm transition-colors w-full sm:w-auto"
                    >
                      Đọc bài
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* RẼ NHÁNH GIAO DIỆN: Nếu chưa chọn gì -> Hiện bảng thống kê gốc */
        <>
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
                Hệ thống đang thu thập và phân tích dữ liệu bài báo. Vui lòng
                quay lại sau.
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
                          onClick={() => handleTopicClick(topic.name)}
                          className="hover:bg-indigo-50/50 transition-colors group cursor-pointer"
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
                                      : "bg-slate-50 text-slate-500 border border-slate-200 group-hover:bg-white"
                              }`}
                            >
                              {index + 1}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors text-base flex items-center gap-2">
                              {topic.name || "Chưa xác định"}
                              <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                visibility
                              </span>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${
                                isTopic
                                  ? "bg-indigo-50 text-indigo-700 border-indigo-200 group-hover:bg-white"
                                  : "bg-emerald-50 text-emerald-700 border-emerald-200 group-hover:bg-white"
                              }`}
                            >
                              {isTopic ? "Chủ đề" : "Từ khóa"}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="inline-flex items-center gap-1.5 font-bold text-slate-700 bg-slate-100 group-hover:bg-white px-3 py-1.5 rounded-lg border border-slate-200 transition-colors">
                              <span className="material-symbols-outlined text-sm text-slate-500 group-hover:text-indigo-500 transition-colors">
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
        </>
      )}
    </div>
  );
};

export default ResearcherAnalytic;
