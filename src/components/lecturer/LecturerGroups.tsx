import React from "react";

const LecturerGroups: React.FC = () => {
  const groups = [
    {
      id: 1,
      course: "SWP391",
      name: "Nhóm 1",
      topic: "Hệ thống quản lý tài liệu học thuật",
      status: "Đang tiến hành",
      progress: 75,
      members: [
        "Nguyễn Minh Phúc",
        "Trí Đạt",
        "Hiếu Phong",
        "Ngọc Long",
        "Quốc Việt",
      ],
      lastUpdate: "Hôm nay, 10:30 AM",
    },
    {
      id: 2,
      course: "SWP391",
      name: "Nhóm 3",
      topic: "Ứng dụng AI trong đánh giá năng lực",
      status: "Chờ duyệt đề tài",
      progress: 10,
      members: ["Minh Thuận", "Lê Văn A", "Trần Thị B", "Phạm Văn C"],
      lastUpdate: "Hôm qua, 14:15 PM",
    },
    {
      id: 3,
      course: "Capstone",
      name: "Nhóm 8",
      topic: "Kiến trúc Microservices cho E-commerce",
      status: "Hoàn thiện báo cáo",
      progress: 90,
      members: ["Hoàng Đăng", "Vũ Huy", "Ngô Quyền", "Lý Thái", "Trần Hưng"],
      lastUpdate: "3 ngày trước",
    },
  ];

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#064e3b]">
            Quản lý Nhóm Đồ án
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Theo dõi tiến độ và hỗ trợ sinh viên trong quá trình nghiên cứu.
          </p>
        </div>
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Tạo nhóm mới
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {groups.map((group) => (
          <div
            key={group.id}
            className="bg-white rounded-xl border border-emerald-100 shadow-sm p-6 hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wider">
                    {group.course}
                  </span>
                  <h3 className="text-lg font-bold text-slate-800">
                    {group.name}
                  </h3>
                </div>
                <p className="text-sm font-medium text-slate-700 mt-1">
                  Đề tài: {group.topic}
                </p>
              </div>
              <button className="text-slate-400 hover:text-emerald-600 transition-colors">
                <span className="material-symbols-outlined">more_vert</span>
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg mb-4 border border-slate-100">
              <p className="text-xs text-slate-500 mb-2 font-medium">
                Thành viên ({group.members.length}):
              </p>
              <div className="flex flex-wrap gap-2">
                {group.members.map((member, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-white border border-slate-200 text-slate-700 px-2 py-1 rounded-md shadow-sm"
                  >
                    {member}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
              <div className="flex-1 mr-6">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500 font-medium">
                    {group.status}
                  </span>
                  <span className="font-bold text-emerald-700">
                    {group.progress}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5">
                  <div
                    className="bg-emerald-500 h-1.5 rounded-full"
                    style={{ width: `${group.progress}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  title="Nhắn tin cho nhóm"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    chat
                  </span>
                </button>
                <button
                  className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                  title="Gợi ý tài liệu"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    share
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LecturerGroups;
