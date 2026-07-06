import React, { useState, useEffect } from "react";
import { api } from "../../services/api";

const StudentTrending: React.FC = () => {
  const [trendingTopics, setTrendingTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        setLoading(true);
        // Đổi từ getTrendingTopics sang getActivityScores
        const res = await api.getActivityScores(10);

        // Cập nhật lại list
        if (Array.isArray(res)) {
          setTrendingTopics(res);
        } else {
          setError("Không thể lấy dữ liệu xu hướng (Sai định dạng).");
        }
      } catch (err: any) {
        setError(err.message || "Lỗi kết nối máy chủ.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, []);

  const handleFollowTopic = async (name: string, id: number, type: string) => {
    if (!id) {
      alert("Không tìm thấy ID của chủ đề này!");
      return;
    }

    try {
      // Gửi đúng type mà backend trả về ("Keyword" hoặc "Topic")
      const res = await api.toggleFollow(id, type as any);
      if (res.success) {
        alert(
          res.isFollowed ? `Đã theo dõi: ${name}` : `Đã bỏ theo dõi: ${name}`,
        );
      }
    } catch (err) {
      alert("Lỗi khi thực hiện theo dõi.");
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="p-8 text-center text-blue-600 font-medium">
        Đang phân tích dữ liệu xu hướng...
      </div>
    );
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#002045]">
          Xu hướng Học thuật
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Khám phá các chủ đề công nghệ đang được nghiên cứu nhiều nhất.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600">
              local_fire_department
            </span>
            Bảng xếp hạng Chủ đề (Top 10)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider">
                <th className="p-4 font-semibold text-center w-16">Xếp hạng</th>
                <th className="p-4 font-semibold">Tên Chủ đề / Từ khóa</th>
                <th className="p-4 font-semibold text-center">
                  Đà tăng trưởng
                </th>
                <th className="p-4 font-semibold text-center">Bài báo mới</th>
                <th className="p-4 font-semibold text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {trendingTopics.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    Chưa có dữ liệu xu hướng.
                  </td>
                </tr>
              ) : (
                trendingTopics.map((item, index) => (
                  <tr
                    key={item.id || index}
                    className="hover:bg-blue-50/50 transition-colors"
                  >
                    <td className="p-4 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                          index < 3
                            ? "bg-amber-100 text-amber-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        #{index + 1}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-slate-800">
                      {item.name || item.topicName || item.keyword}
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold bg-emerald-50 px-2 py-1 rounded text-xs">
                        <span className="material-symbols-outlined text-[14px]">
                          trending_up
                        </span>
                        {item.momentum || item.trendScore || "Cao"}
                      </span>
                    </td>
                    <td className="p-4 text-center text-sm font-medium text-slate-600">
                      {item.recentPaperCount || item.paperCount || 0}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        // Truyền đủ 3 tham số: name, id, type (nhớ viết thường chữ cái đầu của item.type nếu JSON parse trả về chữ thường)
                        onClick={() =>
                          handleFollowTopic(
                            item.name,
                            item.id,
                            item.type || item.Type,
                          )
                        }
                        className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 mx-auto"
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          add_alert
                        </span>
                        Theo dõi
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentTrending;
