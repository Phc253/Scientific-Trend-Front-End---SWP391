import React from "react";

const StudentTrending: React.FC = () => {
  const topKeywords = [
    {
      rank: 1,
      name: "Large Language Models",
      growth: "+45%",
      papers: 1240,
      status: "hot",
    },
    {
      rank: 2,
      name: "Cloud Native Architecture",
      growth: "+28%",
      papers: 890,
      status: "up",
    },
    {
      rank: 3,
      name: "Microservices Security",
      growth: "+15%",
      papers: 620,
      status: "up",
    },
    {
      rank: 4,
      name: "Predictive Analytics",
      growth: "+8%",
      papers: 430,
      status: "stable",
    },
  ];

  return (
    <div className="animate-fadeIn space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#002045] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#13696a]">
            local_fire_department
          </span>
          Xu hướng nghiên cứu toàn cầu
        </h2>
        <p className="text-xs text-[#74777f]">
          Cập nhật các từ khóa công nghệ hot nhất dựa trên số lượng công bố khoa
          học trong quý này.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bảng xếp hạng từ khóa */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-[#ebeef0] shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-[#43474e] uppercase tracking-wider">
            Top từ khóa tăng trưởng mạnh nhất
          </h3>

          <div className="divide-y divide-[#ebeef0]">
            {topKeywords.map((kw) => (
              <div
                key={kw.rank}
                className="py-3 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
                      kw.rank === 1
                        ? "bg-amber-100 text-amber-800"
                        : "bg-[#f1f4f6] text-[#43474e]"
                    }`}
                  >
                    {kw.rank}
                  </span>
                  <span className="font-bold text-[#002045] hover:text-[#13696a] cursor-pointer">
                    {kw.name}
                  </span>
                </div>

                <div className="flex items-center gap-6">
                  <span className="text-[#74777f] font-mono">
                    {kw.papers} bài viết
                  </span>
                  <span
                    className={`font-bold flex items-center ${
                      kw.status === "hot" || kw.status === "up"
                        ? "text-green-600"
                        : "text-blue-600"
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">
                      {kw.status === "hot"
                        ? "trending_up"
                        : kw.status === "up"
                          ? "arrow_upward"
                          : "remove"}
                    </span>
                    {kw.growth}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cột thông tin hữu ích bên phải */}
        <div className="bg-[#002045] text-white p-5 rounded-xl shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#a2eded]">
              <span className="material-symbols-outlined text-sm">
                lightbulb
              </span>
            </div>
            <h4 className="text-sm font-bold">Gợi ý chọn đề tài đồ án</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Các bài nghiên cứu thuộc từ khóa{" "}
              <strong>Large Language Models</strong> kết hợp với{" "}
              <strong>Software Architecture</strong> hiện đang có tỷ lệ trích
              dẫn tăng vượt bậc trong năm nay. Đây là hướng đi rất tốt để đạt
              điểm cao khi bảo vệ đồ án chuyên ngành.
            </p>
          </div>

          <div className="pt-4 border-t border-white/10 text-[11px] text-slate-400 italic">
            Dữ liệu thống kê real-time từ cổng OpenAlex.
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentTrending;
