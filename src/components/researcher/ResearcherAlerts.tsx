import React from "react";

const ResearcherAlerts: React.FC = () => {
  return (
    <div className="animate-fadeIn space-y-6 h-full flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Cảnh báo bài báo
          </h2>
          <p className="text-sm text-slate-500">
            Quản lý và thiết lập thông báo khi có công bố khoa học mới phù hợp
            với từ khóa.
          </p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors flex items-center gap-2 shadow-sm">
          <span className="material-symbols-outlined text-sm">add_alert</span>
          Tạo cảnh báo mới
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Bảng danh sách cảnh báo (Mock UI) */}
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-sm font-semibold text-slate-600 uppercase tracking-wider">
              <th className="p-4">Từ khóa theo dõi</th>
              <th className="p-4">Tần suất</th>
              <th className="p-4">Trạng thái</th>
              <th className="p-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
              <td className="p-4 font-medium text-slate-800">
                "Machine Learning in Healthcare"
              </td>
              <td className="p-4 text-slate-600">Hàng tuần</td>
              <td className="p-4">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>{" "}
                  Đang bật
                </span>
              </td>
              <td className="p-4 text-right">
                <button className="text-slate-400 hover:text-indigo-600 p-1">
                  <span className="material-symbols-outlined text-xl">
                    edit
                  </span>
                </button>
                <button className="text-slate-400 hover:text-red-500 p-1 ml-2">
                  <span className="material-symbols-outlined text-xl">
                    delete
                  </span>
                </button>
              </td>
            </tr>
            {/* Nếu trống, bạn có thể render một dòng chữ "Chưa có cảnh báo nào" */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResearcherAlerts;
