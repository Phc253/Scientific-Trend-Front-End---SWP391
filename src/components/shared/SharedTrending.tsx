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
    lightBg: isLecturer ? "bg-emerald-50" : "bg-blue-50",
    primaryText: isLecturer ? "text-emerald-700" : "text-blue-700",
    border: isLecturer ? "border-emerald-200" : "border-blue-200",
  };

  useEffect(() => {
    // Gọi API lấy top 12 chủ đề xu hướng
    api
      .getTrendingTopics(12)
      .then((res: any) => {
        // Tùy thuộc vào cấu trúc trả về của BE, ta lấy mảng dữ liệu an toàn
        const data = Array.isArray(res) ? res : res?.data || [];
        setTrends(data);
      })
      .catch((err) => console.error("Lỗi tải xu hướng:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-black text-slate-800 tracking-tight">
        Xu hướng Nghiên cứu
      </h2>
      <p className="text-slate-500 text-sm">
        Các chủ đề khoa học đang được quan tâm nhiều nhất trong thời gian gần
        đây.
      </p>

      {loading ? (
        <div className="flex flex-col justify-center items-center p-20 text-slate-500">
          <span className="material-symbols-outlined text-4xl animate-spin mb-3 text-slate-300">
            data_usage
          </span>
          <p className="font-medium">
            Đang phân tích dữ liệu xu hướng từ hệ thống...
          </p>
        </div>
      ) : trends.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-sm">
          <span className="material-symbols-outlined text-5xl text-slate-300 mb-3 block">
            trending_down
          </span>
          <p className="text-slate-500 font-medium">
            Chưa có đủ dữ liệu để tính toán xu hướng tại thời điểm này.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {trends.map((item, index) => (
            <div
              key={index}
              className={`${theme.lightBg} border ${theme.border} p-5 rounded-2xl flex flex-col justify-between hover:shadow-md transition-shadow`}
            >
              <h4
                className={`font-black ${theme.primaryText} text-lg mb-3 line-clamp-2 leading-tight`}
                title={item.name}
              >
                {item.name}
              </h4>
              <div className="flex items-center justify-between text-xs font-bold text-slate-600 mt-auto pt-2 border-t border-black/5">
                <span
                  className="flex items-center gap-1"
                  title="Số lượng bài báo"
                >
                  <span className="material-symbols-outlined text-[14px]">
                    article
                  </span>
                  {item.recentPaperCount || 0}
                </span>
                <span
                  className="text-green-600 flex items-center gap-0.5 bg-green-100 px-2 py-1 rounded-md"
                  title="Tỷ lệ tăng trưởng"
                >
                  <span className="material-symbols-outlined text-[14px]">
                    trending_up
                  </span>
                  +{item.growthRate || 0}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SharedTrending;
