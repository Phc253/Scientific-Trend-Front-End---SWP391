import React from "react";

const ResearcherNetwork: React.FC = () => {
  const collaborators = [
    { name: "Dr. Minh Anh", field: "Computer Vision", match: "92%" },
    { name: "Prof. Hương Linh", field: "NLP", match: "88%" },
    { name: "Dr. Quang Vũ", field: "Systems", match: "84%" },
  ];

  return (
    <div className="animate-fadeIn space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Mạng lưới hợp tác</h2>
        <p className="text-sm text-slate-500 mt-1">
          Khám phá các nhà nghiên cứu có điểm chồng lặp về lĩnh vực và xu hướng công bố.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Gợi ý kết nối</h3>
            <p className="text-sm text-slate-500">Dựa trên từ khóa và journal đang theo dõi</p>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">person_search</span>
            Tìm kiếm tác giả
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          {collaborators.map((person) => (
            <div key={person.name} className="rounded-lg border border-slate-200 p-4">
              <p className="font-semibold text-slate-800">{person.name}</p>
              <p className="text-sm text-slate-500 mt-1">{person.field}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Độ phù hợp {person.match}</span>
                <button className="text-sm text-indigo-600 font-medium">Xem hồ sơ</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResearcherNetwork;
