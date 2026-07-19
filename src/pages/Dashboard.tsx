import React from "react";
import { Link } from "react-router-dom";

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto pb-12">
      {/* Banner Chào Mừng Dành Cho Guest */}
      <div className="relative bg-gradient-to-r from-[#002045] to-[#13696a] rounded-2xl p-8 md:p-12 overflow-hidden shadow-lg border border-[#002045]/20">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-32 -mb-12 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl text-white">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3">
              Khám Phá Xu Hướng Học Thuật
            </h1>
            <p className="text-blue-100 text-sm md:text-base leading-relaxed">
              Cập nhật liên tục những từ khóa, chủ đề nghiên cứu và các bài báo
              khoa học đang nhận được nhiều sự quan tâm nhất từ cộng đồng học
              thuật trong tuần qua.
            </p>
          </div>
        </div>
      </div>

      {/* Khối Nội Dung Yêu Cầu Đăng Nhập (Login Wall) */}
      <div className="bg-white rounded-2xl border border-[#ebeef0] shadow-sm overflow-hidden relative min-h-[450px] flex flex-col items-center justify-center p-8 text-center">
        {/* Lớp nền mờ trang trí tạo cảm giác có dữ liệu bị khóa phía sau */}
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 40px, #002045 40px, #002045 41px)",
          }}
        ></div>

        {/* Biểu tượng Ổ khóa */}
        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner border border-slate-100 relative z-10">
          <div className="w-16 h-16 bg-[#e0f2f1] rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-[#13696a]">
              lock
            </span>
          </div>
        </div>

        {/* Tiêu đề & Thông báo */}
        <h2 className="text-2xl md:text-3xl font-black text-[#002045] mb-4 relative z-10">
          Bạn phải đăng nhập để xem thông tin chi tiết
        </h2>
        <p className="text-[#74777f] max-w-lg mx-auto mb-10 relative z-10 text-sm md:text-base leading-relaxed">
          Bảng xếp hạng xu hướng, chỉ số tăng trưởng đột phá và dữ liệu phân
          tích học thuật chuyên sâu được bảo mật và chỉ dành riêng cho thành
          viên của hệ thống.
        </p>

        {/* Call to Action (Buttons) */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10 w-full sm:w-auto">
          <Link
            to="/login"
            className="bg-[#13696a] text-white px-8 py-3.5 rounded-xl text-sm font-bold hover:bg-[#0e5051] transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">login</span>
            Đăng nhập ngay
          </Link>
          <Link
            to="/register"
            className="bg-white text-[#002045] border border-[#c4c6cf] px-8 py-3.5 rounded-xl text-sm font-bold hover:bg-[#f8fafc] transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">
              person_add
            </span>
            Tạo tài khoản miễn phí
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
