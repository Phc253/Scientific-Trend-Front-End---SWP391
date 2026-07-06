import React from "react";

const ResearcherNetwork: React.FC = () => {
  return (
    <div className="animate-fadeIn space-y-6 h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-slate-800">Mạng lưới hợp tác</h2>
        <p className="text-sm text-slate-500">
          Khám phá, phân tích và kết nối với các nhà nghiên cứu hàng đầu trong
          lĩnh vực của bạn.
        </p>
      </div>

      <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-[40px]">hub</span>
        </div>
        <h3 className="text-xl font-bold text-slate-700 mb-2">
          Biểu đồ Mạng lưới (Sắp ra mắt)
        </h3>
        <p className="text-slate-500 max-w-md mb-8">
          Tính năng vẽ biểu đồ quan hệ đồng tác giả và gợi ý hợp tác
          (Collaboration Suggestions) dựa trên dữ liệu trích dẫn đang được hệ
          thống xây dựng.
        </p>

        <div className="flex gap-4">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">
              person_search
            </span>
            Tìm kiếm Tác giả
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResearcherNetwork;
