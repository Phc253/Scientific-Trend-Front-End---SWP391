import React, { useState, useEffect } from "react";
import { api } from "../../services/api";

const LecturerTrends: React.FC = () => {
  const [trends, setTrends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const data = await api.getActivityScores(10);
        setTrends(data || []);
      } catch (err) {
        console.error("Lỗi tải xu hướng:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrends();
  }, []);

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-slate-800">Định hướng Đề tài</h2>
        <p className="text-sm text-slate-500">
          Phân tích các chủ đề khoa học đang thịnh hành (dựa trên thuật toán
          chấm điểm xu hướng).
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        {loading ? (
          <div className="text-center py-10 text-emerald-600 font-medium">
            Đang tải dữ liệu xu hướng...
          </div>
        ) : trends.length === 0 ? (
          <div className="text-center py-10 text-slate-500">
            Chưa có dữ liệu xu hướng.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trends.map((item, index) => (
              <div
                key={item.id || index}
                className="p-4 border border-slate-100 rounded-xl hover:border-emerald-300 hover:bg-emerald-50/30 transition-colors flex items-center justify-between shadow-sm"
              >
                <div>
                  <h4 className="font-bold text-slate-800 text-lg mb-1">
                    {item.name}
                  </h4>
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-wider">
                      {item.type}
                    </span>
                    <span
                      className={
                        item.growthRate >= 0
                          ? "text-emerald-600"
                          : "text-red-500"
                      }
                    >
                      {item.growthRate >= 0 ? "📈" : "📉"} {item.growthRate}%
                      Tăng trưởng
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-4 border-l pl-4 border-slate-100">
                  <span className="block text-2xl font-black text-slate-700">
                    {Math.round(item.score)}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    Điểm (Score)
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LecturerTrends;
