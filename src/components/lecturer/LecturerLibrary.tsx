import React, { useState } from "react";

const LecturerLibrary: React.FC = () => {
  const [activeFolder, setActiveFolder] = useState("all");

  const folders = [
    { id: "all", name: "Tất cả tài liệu", count: 124, icon: "library_books" },
    { id: "swp391", name: "Tham khảo SWP391", count: 45, icon: "folder" },
    { id: "capstone", name: "Tài liệu Capstone", count: 32, icon: "folder" },
    {
      id: "java",
      name: "Fullstack Java & MVC",
      count: 18,
      icon: "folder_special",
    },
  ];

  const papers = [
    {
      id: 1,
      title: "Modern Web Architecture using React and Spring Boot",
      authors: "Nguyen, T. et al.",
      year: 2024,
      type: "Article",
    },
    {
      id: 2,
      title: "Evaluating Microservices Performance in E-commerce",
      authors: "Smith, J.",
      year: 2023,
      type: "Conference Paper",
    },
    {
      id: 3,
      title: "The State of Full-Stack Java Development",
      authors: "Tran, M.",
      year: 2025,
      type: "Review",
    },
  ];

  return (
    <div className="animate-fadeIn h-full flex flex-col">
      <div className="mb-6 flex justify-between items-end shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-[#064e3b]">
            Kho Học liệu Giảng dạy
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Quản lý và chia sẻ tài liệu nghiên cứu cho sinh viên.
          </p>
        </div>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Sidebar Folders */}
        <div className="w-64 bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col shrink-0">
          <button className="w-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-sm py-2 rounded-lg mb-4 flex justify-center items-center gap-2 hover:bg-emerald-100 transition-colors">
            <span className="material-symbols-outlined text-[18px]">
              create_new_folder
            </span>
            Thư mục mới
          </button>
          <div className="space-y-1 flex-1 overflow-y-auto">
            {folders.map((folder) => (
              <button
                key={folder.id}
                onClick={() => setActiveFolder(folder.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  activeFolder === folder.id
                    ? "bg-emerald-600 text-white font-medium"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">
                    {folder.icon}
                  </span>
                  {folder.name}
                </div>
                <span
                  className={`text-xs ${activeFolder === folder.id ? "text-emerald-200" : "text-slate-400"}`}
                >
                  {folder.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Papers List */}
        <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div className="relative w-64">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[18px]">
                search
              </span>
              <input
                type="text"
                placeholder="Tìm tài liệu..."
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <button className="text-slate-500 hover:text-emerald-600 flex items-center gap-1 text-sm font-medium">
              <span className="material-symbols-outlined text-[18px]">
                filter_list
              </span>{" "}
              Lọc
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {papers.map((paper) => (
              <div
                key={paper.id}
                className="p-4 border border-slate-100 rounded-lg hover:border-emerald-200 hover:shadow-sm transition-all group flex items-start justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {paper.type}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      {paper.year}
                    </span>
                  </div>
                  <h4 className="font-bold text-[#064e3b] text-base mb-1 group-hover:text-emerald-600 transition-colors cursor-pointer">
                    {paper.title}
                  </h4>
                  <p className="text-sm text-slate-600">{paper.authors}</p>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                    title="Gửi cho nhóm"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      send
                    </span>
                  </button>
                  <button
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                    title="Xóa khỏi thư mục"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      delete
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LecturerLibrary;
