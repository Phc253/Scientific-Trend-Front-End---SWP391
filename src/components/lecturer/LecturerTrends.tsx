import React from "react";

const LecturerTrends: React.FC = () => {
  const trendingTopics = [
    {
      rank: 1,
      topic: "Generative AI Integration",
      momentum: "+85%",
      papers: 1250,
      suitableFor: "Capstone",
    },
    {
      rank: 2,
      topic: "Serverless Computing",
      momentum: "+42%",
      papers: 840,
      suitableFor: "SWP391 / Capstone",
    },
    {
      rank: 3,
      topic: "Blockchain in Supply Chain",
      momentum: "+28%",
      papers: 620,
      suitableFor: "Capstone",
    },
    {
      rank: 4,
      topic: "React Server Components",
      momentum: "+65%",
      papers: 310,
      suitableFor: "SWP391",
    },
  ];

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#064e3b]">
          Định hướng Đề tài Nghiên cứu
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Phân tích xu hướng công nghệ để gợi ý đề tài phù hợp cho từng học
          phần.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-emerald-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800">
            Top Chủ đề có Đà tăng trưởng (Momentum) Cao nhất
          </h3>
          <select className="border border-slate-200 rounded-lg text-sm px-3 py-1.5 text-slate-600 focus:outline-none focus:border-emerald-500">
            <option>Khoa Công nghệ Thông tin</option>
            <option>Khoa Kinh tế</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="p-4 font-semibold w-16 text-center">Top</th>
                <th className="p-4 font-semibold">Tên Chủ đề (Topic)</th>
                <th className="p-4 font-semibold text-center">
                  Đà tăng trưởng
                </th>
                <th className="p-4 font-semibold text-center">
                  Số lượng bài báo
                </th>
                <th className="p-4 font-semibold">Phù hợp cho đồ án</th>
                <th className="p-4 font-semibold text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {trendingTopics.map((item) => (
                <tr
                  key={item.rank}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="p-4 text-center">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                        item.rank <= 3
                          ? "bg-amber-100 text-amber-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {item.rank}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-[#064e3b]">{item.topic}</td>
                  <td className="p-4 text-center">
                    <span className="text-emerald-600 font-semibold bg-emerald-50 px-2 py-1 rounded text-xs">
                      {item.momentum}
                    </span>
                  </td>
                  <td className="p-4 text-center text-sm font-medium text-slate-600">
                    {item.papers}
                  </td>
                  <td className="p-4">
                    <span className="text-xs font-medium border border-slate-200 text-slate-600 px-2 py-1 rounded shadow-sm bg-white">
                      {item.suitableFor}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button className="text-emerald-600 hover:text-white hover:bg-emerald-600 border border-emerald-600 text-xs font-semibold px-3 py-1.5 rounded transition-colors">
                      Gợi ý cho Nhóm
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LecturerTrends;
