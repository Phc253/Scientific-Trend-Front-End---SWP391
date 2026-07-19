import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api, type FollowItem } from "../../services/api";

export const ResearcherNetwork = () => {
  const [follows, setFollows] = useState<FollowItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFollows();
  }, []);

  const fetchFollows = async () => {
    try {
      setIsLoading(true);
      const res: any = await api.getFollows();
      const items = res?.data || res || [];
      setFollows(Array.isArray(items) ? items : []);
    } catch (error) {
      console.error("Lỗi tải mạng lưới:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnfollow = async (targetId: number, targetType: string) => {
    if (!window.confirm("Bạn muốn ngừng theo dõi đối tượng này?")) return;
    try {
      await api.toggleFollow(targetId, targetType);
      setFollows((prev) => prev.filter((item) => item.targetId !== targetId));
    } catch (error) {
      alert("Lỗi khi hủy theo dõi.");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#002045] flex items-center gap-2">
          <span className="material-symbols-outlined text-indigo-600">hub</span>
          Mạng lưới học thuật
        </h1>
        <p className="text-slate-500 mt-1">
          Quản lý các tác giả và chủ đề bạn đang theo dõi.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center text-slate-400 mt-20">
          <span className="material-symbols-outlined animate-spin text-3xl">
            sync
          </span>
        </div>
      ) : follows.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-16 text-center shadow-sm">
          <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">
            person_add_disabled
          </span>
          <h3 className="text-xl font-bold text-slate-700 mb-2">
            Chưa theo dõi ai
          </h3>
          <p className="text-slate-500 mb-6">
            Hãy sang trang Khám phá để tìm và theo dõi các nhà nghiên cứu khác.
          </p>
          <Link
            to="/researcher/explore"
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium"
          >
            Đi đến Khám phá
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {follows.map((item) => (
            <div
              key={item.followId}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg
                  ${item.targetType === "Author" ? "bg-indigo-500" : "bg-emerald-500"}`}
                >
                  {item.targetType === "Author" ? (
                    <span className="material-symbols-outlined">person</span>
                  ) : (
                    <span className="material-symbols-outlined">tag</span>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">
                    {item.authorName || item.topicName || "Chưa xác định"}
                  </h4>
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    {item.targetType === "Author" ? "Tác giả" : "Chủ đề"}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleUnfollow(item.targetId, item.targetType)}
                className="text-rose-500 hover:bg-rose-50 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                title="Hủy theo dõi"
              >
                <span className="material-symbols-outlined">person_remove</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResearcherNetwork;
