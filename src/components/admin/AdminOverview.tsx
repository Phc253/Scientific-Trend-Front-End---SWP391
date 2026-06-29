import React from "react";
import type { SystemLog } from "../../types/admin";

interface AdminOverviewProps {
  logs: SystemLog[];
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ logs }) => {
  return (
    <div className="space-y-6">
      {/* Hộp chỉ số đo lường */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg border border-[#ebeef0] shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-[#74777f] uppercase tracking-wider">
            Người dùng trực tuyến
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-3xl font-extrabold text-[#002045]">36</h3>
            <span className="text-xs font-semibold text-[#13696a] bg-[#e0f7f7] px-2 py-0.5 rounded-full flex items-center">
              +12% hôm nay
            </span>
          </div>
          <p className="text-xs text-[#74777f] mt-2">
            Sinh viên: 24 | Giảng viên: 8 | NC Viên: 4
          </p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-[#ebeef0] shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-[#74777f] uppercase tracking-wider">
            Yêu cầu OpenAlex API
          </span>
          <div className="flex flex-col mt-2">
            <div className="flex justify-between text-xs font-semibold text-[#43474e] mb-1">
              <span>1,482 / 100k</span>
              <span>1.48%</span>
            </div>
            <div className="w-full bg-[#f1f4f6] h-2 rounded-full overflow-hidden">
              <div className="bg-[#13696a] h-full" style={{ width: "1.48%" }}></div>
            </div>
          </div>
          <p className="text-xs text-[#74777f] mt-3">An toàn, dưới ngưỡng cảnh báo</p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-[#ebeef0] shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-[#74777f] uppercase tracking-wider">
            Độ trễ phản hồi TB
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-3xl font-extrabold text-[#c6955e]">320ms</h3>
            <span className="text-xs font-semibold text-[#13696a] bg-[#e0f7f7] px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[10px]">arrow_downward</span> Nhanh
            </span>
          </div>
          <p className="text-xs text-[#74777f] mt-2">Thời gian xử lý trung bình 24h</p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-[#ebeef0] shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-[#74777f] uppercase tracking-wider">
            Tỷ lệ cache trúng
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-3xl font-extrabold text-[#1a6d6e]">78.4%</h3>
            <span className="text-xs font-semibold text-[#13696a] bg-[#e0f7f7] px-2 py-0.5 rounded-full">
              Tiết kiệm API
            </span>
          </div>
          <p className="text-xs text-[#74777f] mt-2">Đọc trực tiếp từ DB lưu trữ đệm</p>
        </div>
      </div>

      {/* Grid biểu đồ giả lập và lịch sử logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Biểu đồ hoạt động bằng SVG */}
        <div className="bg-white p-6 rounded-lg border border-[#ebeef0] shadow-sm lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-[#002045]">
                Lưu lượng truy vấn OpenAlex API (24h qua)
              </h3>
              <p className="text-xs text-[#74777f]">Thống kê theo từng khoảng thời gian 4 tiếng</p>
            </div>
            <span className="text-xs font-bold text-[#13696a] bg-[#e0f7f7] px-2.5 py-1 rounded">
              Tổng quan API: Ổn định
            </span>
          </div>

          {/* Biểu đồ SVG */}
          <div className="h-48 w-full mt-6 relative">
            <svg className="w-full h-full" viewBox="0 0 600 180" preserveAspectRatio="none">
              {/* Grid Lines */}
              <line x1="0" y1="40" x2="600" y2="40" stroke="#f1f4f6" strokeWidth="1" />
              <line x1="0" y1="90" x2="600" y2="90" stroke="#f1f4f6" strokeWidth="1" />
              <line x1="0" y1="140" x2="600" y2="140" stroke="#f1f4f6" strokeWidth="1" />

              {/* Gradient fill */}
              <defs>
                <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a2eded" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#a2eded" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Area */}
              <path
                d="M 0 140 L 0 130 Q 100 100, 120 110 T 240 70 T 360 40 T 480 80 T 600 50 L 600 140 Z"
                fill="url(#chart-grad)"
              />

              {/* Line */}
              <path
                d="M 0 130 Q 100 100, 120 110 T 240 70 T 360 40 T 480 80 T 600 50"
                fill="none"
                stroke="#13696a"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Dots */}
              <circle cx="120" cy="110" r="4" fill="#002045" stroke="#fff" strokeWidth="2" />
              <circle cx="240" cy="70" r="4" fill="#002045" stroke="#fff" strokeWidth="2" />
              <circle cx="360" cy="40" r="4" fill="#002045" stroke="#fff" strokeWidth="2" />
              <circle cx="480" cy="80" r="4" fill="#002045" stroke="#fff" strokeWidth="2" />
            </svg>

            {/* X-axis labels */}
            <div className="flex justify-between text-[10px] text-[#74777f] mt-2 font-bold px-1">
              <span>00:00</span>
              <span>04:00</span>
              <span>08:00</span>
              <span>12:00</span>
              <span>16:00</span>
              <span>20:00</span>
            </div>
          </div>
        </div>

        {/* Khối Logs hệ thống */}
        <div className="bg-white p-6 rounded-lg border border-[#ebeef0] shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-[#002045]">Nhật ký hệ thống</h3>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>

          <div className="flex-1 space-y-3.5 overflow-y-auto max-h-[220px] pr-1 custom-scrollbar text-xs">
            {logs.map((log, i) => {
              let badgeColor = "bg-[#f1f4f6] text-[#43474e]";
              if (log.type === "SUCCESS") badgeColor = "bg-[#dcfce7] text-[#16a34a]";
              if (log.type === "WARNING") badgeColor = "bg-[#fef9c3] text-[#ca8a04]";
              if (log.type === "ERROR") badgeColor = "bg-[#fef2f2] text-[#ef4444]";

              return (
                <div
                  key={i}
                  className="flex gap-2.5 items-start border-b border-[#f7fafc] pb-2 last:border-0 last:pb-0"
                >
                  <span className="font-mono text-[#74777f] font-semibold">{log.time}</span>
                  <div className="flex-1">
                    <span
                      className={`px-1.5 py-0.5 rounded font-bold text-[9px] mr-1.5 ${badgeColor}`}
                    >
                      {log.type}
                    </span>
                    <span className="text-[#43474e] font-medium">{log.message}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
