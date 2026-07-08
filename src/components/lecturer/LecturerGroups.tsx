import React from "react";

const LecturerGroups: React.FC = () => {
  return (
    <div className="animate-fadeIn space-y-6 h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-slate-800">
          Quản lý Nhóm Đồ án
        </h2>
        <p className="text-sm text-slate-500">
          Theo dõi tiến độ các nhóm sinh viên đang hướng dẫn.
        </p>
      </div>

      <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center p-10 text-center">
        <span className="material-symbols-outlined text-[80px] text-emerald-100 mb-4">
          construction
        </span>
        <h3 className="text-xl font-bold text-slate-700 mb-2">
          Tính năng đang phát triển
        </h3>
        <p className="text-slate-500 max-w-md">
          Chức năng Quản lý Nhóm (Tạo nhóm, Thêm sinh viên, Giao việc) đang
          trong quá trình xây dựng API và sẽ sớm được cập nhật.
        </p>
      </div>
    </div>
  );
};

export default LecturerGroups;
