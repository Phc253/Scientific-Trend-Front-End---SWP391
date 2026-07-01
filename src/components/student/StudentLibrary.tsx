import React, { useState } from "react";

const StudentLibrary: React.FC = () => {
  const [savedPapers, setSavedPapers] = useState([
    {
      id: 1,
      title: "Phát triển ứng dụng Web an toàn với mẫu thiết kế MVC",
      author: "Nguyen, P.",
      year: 2024,
      journal: "IEEE Software",
    },
    {
      id: 2,
      title: "Tối ưu hóa kiến trúc ứng dụng Java doanh nghiệp",
      author: "Lee, S.",
      year: 2023,
      journal: "ACM Transactions",
    },
  ]);

  const handleCitation = (paper: any, type: "APA" | "IEEE") => {
    let text = "";
    if (type === "APA") {
      text = `${paper.author} (${paper.year}). ${paper.title}. ${paper.journal}.`;
    } else {
      text = `[1] ${paper.author}, "${paper.title}," ${paper.journal}, ${paper.year}.`;
    }
    navigator.clipboard.writeText(text);
    alert(`Đã copy cấu trúc trích dẫn dạng ${type} vào bộ nhớ tạm!`);
  };

  const removePaper = (id: number) => {
    setSavedPapers(savedPapers.filter((p) => p.id !== id));
  };

  return (
    <div className="animate-fadeIn space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#002045] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#13696a]">
            bookmarks
          </span>
          Tủ sách nghiên cứu của tôi
        </h2>
        <p className="text-xs text-[#74777f]">
          Quản lý kho tài liệu tham khảo và trích xuất định dạng phục vụ viết
          báo cáo luận văn.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {savedPapers.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed text-[#74777f] text-xs">
            Chưa có bài báo nào được lưu. Hãy qua tab Khám phá để tìm kiếm!
          </div>
        ) : (
          savedPapers.map((paper) => (
            <div
              key={paper.id}
              className="bg-white p-5 rounded-xl border border-[#ebeef0] shadow-sm space-y-4"
            >
              <div>
                <h3 className="text-sm font-bold text-[#002045]">
                  {paper.title}
                </h3>
                <p className="text-xs text-[#74777f] mt-1">
                  {paper.author} • {paper.year} • {paper.journal}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 justify-between items-center pt-2 border-t border-[#f1f4f6]">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCitation(paper, "APA")}
                    className="bg-[#f1f4f6] hover:bg-[#e0f2f1] text-[#13696a] text-[11px] font-bold px-3 py-1.5 rounded transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-xs">
                      format_quote
                    </span>{" "}
                    Trích dẫn APA
                  </button>
                  <button
                    onClick={() => handleCitation(paper, "IEEE")}
                    className="bg-[#f1f4f6] hover:bg-[#e0f2f1] text-[#13696a] text-[11px] font-bold px-3 py-1.5 rounded transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-xs">
                      format_quote
                    </span>{" "}
                    Trích dẫn IEEE
                  </button>
                </div>

                <button
                  onClick={() => removePaper(paper.id)}
                  className="text-xs text-red-600 hover:underline font-medium flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">
                    delete
                  </span>{" "}
                  Xóa khỏi tủ sách
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentLibrary;
