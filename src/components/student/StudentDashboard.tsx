import React, { useState } from "react";

const StudentDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const userName = localStorage.getItem("userName") || "Phúc";

  // Mock data chuyên ngành SE
  const savedPapers = 12;
  const recommendedPapers = [
    {
      id: 1,
      title: "Kiến trúc MVC trong phát triển Web hiện đại",
      author: "Nguyen, A.",
      citations: 45,
      tag: "Software Engineering",
    },
    {
      id: 2,
      title: "Tối ưu hóa hiệu suất truy vấn JDBC với Java",
      author: "Smith, J.",
      citations: 112,
      tag: "Java",
    },
    {
      id: 3,
      title: "Đánh giá các mẫu thiết kế (Design Patterns) phổ biến",
      author: "Tran, B.",
      citations: 89,
      tag: "Architecture",
    },
  ];
  const readingHistory = [
    {
      id: 4,
      title: "Ứng dụng Servlets và JSP trong hệ thống doanh nghiệp",
      time: "2 giờ trước",
    },
    {
      id: 5,
      title: "Tổng quan về quy trình phát triển dự án phần mềm",
      time: "Hôm qua",
    },
  ];

  return (
    <div className="animate-fadeIn space-y-8">
      {/* Header Section */}
      <div className="bg-white p-8 rounded-xl border border-[#ebeef0] shadow-sm flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold text-[#002045] mb-2">
          Chào buổi sáng, {userName}! ☕
        </h1>
        <p className="text-sm text-[#74777f] mb-6">
          Hôm nay bạn muốn tìm tài liệu về chủ đề gì cho đồ án của mình?
        </p>

        <div className="relative w-full max-w-2xl">
          <input
            type="text"
            className="w-full pl-12 pr-4 py-3.5 bg-[#f1f4f6] border border-[#c4c6cf] rounded-full focus:outline-none focus:border-[#13696a] focus:ring-1 focus:ring-[#13696a] text-sm font-medium transition-all"
            placeholder="Nhập từ khóa (Ví dụ: Java Backend, Design Patterns, ...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="material-symbols-outlined absolute left-4 top-3.5 text-[#74777f]">
            search
          </span>
          <button className="absolute right-2 top-2 bg-[#13696a] hover:bg-[#0f5455] text-white px-4 py-1.5 rounded-full text-xs font-bold transition-colors">
            Tìm kiếm
          </button>
        </div>
      </div>

      {/* Thống kê nhanh */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-[#ebeef0] shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <span className="material-symbols-outlined">bookmarks</span>
          </div>
          <div>
            <p className="text-xs text-[#74777f] font-bold uppercase">
              Bài báo đã lưu
            </p>
            <p className="text-2xl font-bold text-[#002045]">{savedPapers}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-[#ebeef0] shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
          <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
            <span className="material-symbols-outlined">auto_stories</span>
          </div>
          <div>
            <p className="text-xs text-[#74777f] font-bold uppercase">
              Chủ đề quan tâm
            </p>
            <p className="text-2xl font-bold text-[#002045]">4</p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-[#13696a] to-[#1a8f90] p-5 rounded-xl shadow-sm flex items-center justify-between text-white hover:opacity-95 transition-opacity cursor-pointer">
          <div>
            <p className="text-sm font-bold mb-1">Công cụ hỗ trợ</p>
            <p className="text-xs opacity-90">
              Tạo danh mục trích dẫn chuẩn APA/IEEE cho báo cáo.
            </p>
          </div>
          <span className="material-symbols-outlined text-3xl opacity-80">
            format_quote
          </span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột trái: Gợi ý (Chiếm 2 phần) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#002045] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#13696a]">
                recommend
              </span>
              Gợi ý cho bạn
            </h2>
            <button className="text-xs text-[#13696a] font-bold hover:underline">
              Xem tất cả
            </button>
          </div>

          <div className="space-y-4">
            {recommendedPapers.map((paper) => (
              <div
                key={paper.id}
                className="bg-white p-4 rounded-xl border border-[#ebeef0] shadow-sm hover:border-[#13696a] transition-colors group cursor-pointer"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] uppercase font-bold bg-[#f1f4f6] text-[#43474e] px-2 py-1 rounded">
                    {paper.tag}
                  </span>
                  <button className="text-[#c4c6cf] hover:text-[#13696a] transition-colors">
                    <span className="material-symbols-outlined text-xl">
                      bookmark_add
                    </span>
                  </button>
                </div>
                <h3 className="text-sm font-bold text-[#002045] group-hover:text-[#13696a] transition-colors line-clamp-2 mb-1">
                  {paper.title}
                </h3>
                <div className="flex items-center gap-4 text-xs text-[#74777f]">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">
                      person
                    </span>{" "}
                    {paper.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">
                      format_quote
                    </span>{" "}
                    {paper.citations} trích dẫn
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cột phải: Lịch sử đọc */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-[#002045] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#13696a]">
              history
            </span>
            Đọc gần đây
          </h2>

          <div className="bg-white p-1 rounded-xl border border-[#ebeef0] shadow-sm">
            {readingHistory.map((item, index) => (
              <div
                key={item.id}
                className={`p-4 flex gap-3 ${index !== readingHistory.length - 1 ? "border-b border-[#ebeef0]" : ""}`}
              >
                <div className="mt-0.5">
                  <span className="material-symbols-outlined text-[#c4c6cf] text-lg">
                    description
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#181c1e] line-clamp-2 hover:text-[#13696a] cursor-pointer mb-1">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-[#74777f] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">
                      schedule
                    </span>{" "}
                    {item.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
