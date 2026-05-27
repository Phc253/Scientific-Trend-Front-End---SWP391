import React, { useState } from "react";
import { Link } from "react-router-dom";

interface PaperMock {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  keywords: string[];
}

const Search: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // Dữ liệu giả lập khớp với metadata thu thập (tiêu đề, tác giả, năm, tạp chí, từ khóa)
  const mockPapers: PaperMock[] = [
    {
      id: "paper-01",
      title: "Attention Is All You Need",
      authors: "Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit...",
      journal: "NeurIPS 2017",
      year: 2017,
      keywords: ["Transformer", "Deep Learning", "NLP", "Attention Mechanism"],
    },
    {
      id: "paper-02",
      title:
        "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding",
      authors: "Jacob Devlin, Ming-Wei Chang, Kenton Lee, Kristina Toutanova",
      journal: "NAACL 2019",
      year: 2019,
      keywords: ["BERT", "Transformers", "Language Models", "Pre-training"],
    },
    {
      id: "paper-03",
      title: "ResNet: Deep Residual Learning for Image Recognition",
      authors: "Kaiming He, Xiangyu Zhang, Shaoqing Ren, Jian Sun",
      journal: "CVPR 2016",
      year: 2016,
      keywords: [
        "Computer Vision",
        "Residual Learning",
        "Image Classification",
      ],
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Thanh tìm kiếm lớn phía trên có hiệu ứng Focus theo mẫu thiết kế */}
      <div
        className={`bg-white p-6 rounded-lg border transition-all duration-200 ${
          isFocused
            ? "ring-2 ring-[#a2eded] border-[#13696a]"
            : "border-[#ebeef0] shadow-sm"
        }`}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-4 top-3.5 text-[#43474e]">
              search
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm bài báo theo từ khóa, tác giả hoặc tạp chí nghiên cứu..."
              className="w-full pl-12 pr-4 py-3 bg-[#f1f4f6] border border-[#c4c6cf] rounded focus:outline-none transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </div>
          <button className="bg-[#002045] hover:opacity-95 text-white px-8 py-3 rounded font-medium transition-opacity text-sm flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-sm">search</span>
            Tìm kiếm
          </button>
        </div>
      </div>

      {/* Phân vùng Bộ lọc và Kết quả hiển thị */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Cột trái: Bộ lọc (Filter Sidebar) */}
        <div className="bg-white p-5 rounded-lg border border-[#ebeef0] shadow-sm h-fit space-y-6">
          <div className="flex items-center gap-2 border-b border-[#ebeef0] pb-3">
            <span className="material-symbols-outlined text-[#002045] text-sm">
              filter_list
            </span>
            <h3 className="font-bold text-xs text-[#002045] uppercase tracking-wider">
              Bộ lọc tìm kiếm
            </h3>
          </div>

          {/* Bộ lọc theo Năm */}
          <div>
            <label className="block text-xs font-bold text-[#43474e] uppercase tracking-wide mb-2">
              Năm xuất bản
            </label>
            <select className="w-full p-2.5 bg-white border border-[#c4c6cf] rounded text-sm text-[#181c1e] focus:outline-none focus:border-[#13696a]">
              <option>Tất cả các năm</option>
              <option>2026</option>
              <option>2025</option>
              <option>2024</option>
              <option>Từ 2020 trở về trước</option>
            </select>
          </div>

          {/* Bộ lọc theo Lĩnh vực */}
          <div>
            <label className="block text-xs font-bold text-[#43474e] uppercase tracking-wide mb-2">
              Lĩnh vực chuyên sâu
            </label>
            <div className="space-y-2.5 text-sm text-[#43474e]">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-[#c4c6cf] text-[#13696a] focus:ring-[#13696a]"
                />
                Computer Science
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-[#c4c6cf] text-[#13696a] focus:ring-[#13696a]"
                />
                Artificial Intelligence
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-[#c4c6cf] text-[#13696a] focus:ring-[#13696a]"
                />
                Bioinformatics
              </label>
            </div>
          </div>
        </div>

        {/* Cột phải: Danh sách kết quả bài viết (Paper Cards List) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="text-sm text-[#43474e] px-1 flex justify-between items-center">
            <span>
              Tìm thấy <strong>{mockPapers.length}</strong> kết quả phù hợp cho
              bạn
            </span>
          </div>

          {mockPapers.map((paper) => (
            <div
              key={paper.id}
              className="bg-white p-6 rounded-lg border border-[#ebeef0] shadow-sm hover:border-[#13696a] transition-all duration-200 group"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-2">
                  {/* Tiêu đề bài viết */}
                  <Link
                    to={`/paper/${paper.id}`}
                    className="text-lg font-bold text-[#002045] group-hover:text-[#13696a] transition-colors line-clamp-2 leading-snug"
                  >
                    {paper.title}
                  </Link>
                  {/* Tác giả */}
                  <p className="text-sm text-[#43474e] font-medium">
                    {paper.authors}
                  </p>
                  {/* Thông tin xuất bản */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#74777f]">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">
                        menu_book
                      </span>
                      {paper.journal}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">
                        calendar_today
                      </span>
                      {paper.year}
                    </span>
                  </div>
                </div>

                {/* Nút lưu trữ bài báo (Bookmark Action) */}
                <button className="text-[#43474e] hover:text-[#13696a] p-2 hover:bg-[#f1f4f6] rounded-full transition-colors flex items-center justify-center">
                  <span className="material-symbols-outlined">bookmark</span>
                </button>
              </div>

              {/* Các thẻ Từ khóa (Keywords / Tags) */}
              <div className="mt-4 flex flex-wrap gap-2">
                {paper.keywords.map((kw, idx) => (
                  <span
                    key={idx}
                    className="bg-[#f1f4f6] text-[#43474e] px-3 py-1 rounded text-xs font-semibold tracking-wide"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
