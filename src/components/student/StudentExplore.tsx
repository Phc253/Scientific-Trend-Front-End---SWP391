import React, { useState } from "react";

const StudentExplore: React.FC = () => {
  const [search, setSearch] = useState("");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedTag, setSelectedTag] = useState("All");

  // Mock data kết quả tìm kiếm
  const papers = [
    {
      id: 1,
      title:
        "Xây dựng kiến trúc Microservices hiệu năng cao với Java Spring Boot",
      author: "Nguyen Van A",
      year: 2025,
      citations: 142,
      tag: "Software Engineering",
    },
    {
      id: 2,
      title:
        "Ứng dụng Machine Learning trong dự đoán thị trường tài chính ngắn hạn",
      author: "Tran Minh B",
      year: 2024,
      citations: 89,
      tag: "Artificial Intelligence",
    },
    {
      id: 3,
      title:
        "Phân tích và tối ưu hóa truy vấn dữ liệu lớn với JDBC và Hibernate",
      author: "Le Thi C",
      year: 2025,
      citations: 34,
      tag: "Database",
    },
    {
      id: 4,
      title:
        "So sánh hiệu năng giữa kiến trúc MVC truyền thống và kiến trúc Clean Architecture",
      author: "Pham Hoang D",
      year: 2023,
      citations: 210,
      tag: "Software Engineering",
    },
  ];

  const filteredPapers = papers.filter((paper) => {
    const matchSearch = paper.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchYear =
      selectedYear === "All" || paper.year.toString() === selectedYear;
    const matchTag = selectedTag === "All" || paper.tag === selectedTag;
    return matchSearch && matchYear && matchTag;
  });

  return (
    <div className="animate-fadeIn space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#002045] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#13696a]">
            explore
          </span>
          Khám phá tài liệu khoa học
        </h2>
        <p className="text-xs text-[#74777f]">
          Tìm kiếm và lọc hàng ngàn bài báo khoa học chất lượng cao từ cổng dữ
          liệu OpenAlex.
        </p>
      </div>

      {/* Thanh tìm kiếm và bộ lọc */}
      <div className="bg-white p-4 rounded-xl border border-[#ebeef0] shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <div className="md:col-span-2 relative">
          <input
            type="text"
            placeholder="Nhập tên bài báo, tác giả hoặc từ khóa..."
            className="w-full pl-10 pr-4 py-2 bg-[#f1f4f6] border border-[#c4c6cf] rounded-lg text-xs font-medium focus:outline-none focus:border-[#13696a]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#74777f] text-sm">
            search
          </span>
        </div>

        <div>
          <select
            className="w-full p-2 bg-[#f1f4f6] border border-[#c4c6cf] rounded-lg text-xs font-medium focus:outline-none text-[#43474e]"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="All">Tất cả các năm</option>
            <option value="2025">Năm 2025</option>
            <option value="2024">Năm 2024</option>
            <option value="2023">Năm 2023</option>
          </select>
        </div>

        <div>
          <select
            className="w-full p-2 bg-[#f1f4f6] border border-[#c4c6cf] rounded-lg text-xs font-medium focus:outline-none text-[#43474e]"
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
          >
            <option value="All">Tất cả chuyên ngành</option>
            <option value="Software Engineering">Software Engineering</option>
            <option value="Artificial Intelligence">
              Artificial Intelligence
            </option>
            <option value="Database">Database</option>
          </select>
        </div>
      </div>

      {/* Danh sách kết quả */}
      <div className="space-y-4">
        <p className="text-xs text-[#43474e] font-semibold">
          Tìm thấy {filteredPapers.length} tài liệu phù hợp
        </p>

        <div className="grid grid-cols-1 gap-4">
          {filteredPapers.map((paper) => (
            <div
              key={paper.id}
              className="bg-white p-5 rounded-xl border border-[#ebeef0] shadow-sm hover:border-[#13696a] transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div className="space-y-2 flex-1">
                <span className="text-[10px] uppercase font-bold bg-[#e0f2f1] text-[#13696a] px-2 py-0.5 rounded">
                  {paper.tag}
                </span>
                <h3 className="text-sm font-bold text-[#002045] hover:text-[#13696a] cursor-pointer transition-colors">
                  {paper.title}
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-xs text-[#74777f]">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">
                      person
                    </span>{" "}
                    {paper.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">
                      calendar_today
                    </span>{" "}
                    {paper.year}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">
                      format_quote
                    </span>{" "}
                    {paper.citations} trích dẫn
                  </span>
                </div>
              </div>

              <div className="flex gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0">
                <button className="p-2 border border-[#c4c6cf] hover:text-[#13696a] hover:border-[#13696a] rounded-lg flex items-center transition-colors">
                  <span className="material-symbols-outlined text-sm">
                    bookmark
                  </span>
                </button>
                <button className="bg-[#13696a] hover:bg-[#0f5455] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors">
                  Xem chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentExplore;
