import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api, type Paper } from "../../services/api";

const PaperDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [paper, setPaper] = useState<Paper | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      // Gọi API chi tiết bài báo
      api.getPaperDetails(id).then((res) => {
        if (res.success) {
          setPaper(res.data);
        }
        setLoading(false);
      });
    }
  }, [id]);

  if (loading)
    return <div className="p-10 text-center">Đang tải chi tiết bài báo...</div>;
  if (!paper)
    return (
      <div className="p-10 text-center text-red-500">
        Không tìm thấy bài báo.
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-slate-200">
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 mb-6 flex items-center hover:underline"
      >
        <span className="material-symbols-outlined">arrow_back</span> Quay lại
      </button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#002045] mb-2">
          {paper.title}
        </h1>
        <div className="flex gap-4 text-sm text-slate-500">
          <span>📅 {paper.publicationYear}</span>
          <span>journal: {paper.journal || "N/A"}</span>
          <span className="text-emerald-600 font-bold">
            📊 {paper.citationCount} Trích dẫn
          </span>
        </div>
      </div>

      {/* Authors */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-slate-400 uppercase mb-2">
          Tác giả
        </h3>
        <p className="text-slate-700 font-medium">
          {paper.authors.length > 0
            ? paper.authors.join(", ")
            : "Không có thông tin tác giả"}
        </p>
      </div>

      {/* Abstract */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-slate-400 uppercase mb-2">
          Tóm tắt
        </h3>
        <p className="text-slate-600 leading-relaxed text-justify">
          {paper.abstract || "Bài báo này chưa có tóm tắt."}
        </p>
      </div>

      {/* Keywords */}
      <div>
        <h3 className="text-sm font-bold text-slate-400 uppercase mb-2">
          Từ khóa
        </h3>
        <div className="flex flex-wrap gap-2">
          {paper.keywords.map((kw, i) => (
            <span
              key={i}
              className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold"
            >
              {kw}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaperDetails;
