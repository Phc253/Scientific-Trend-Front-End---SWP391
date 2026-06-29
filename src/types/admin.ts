export interface User {
  id: string;
  name: string;
  email: string;
  role: "Sinh viên" | "Giảng viên" | "Nghiên cứu viên" | "Quản trị viên";
  status: "Hoạt động" | "Đã khóa";
  joinedDate: string;
}

export interface SystemLog {
  time: string;
  type: "INFO" | "SUCCESS" | "WARNING" | "ERROR";
  message: string;
}

export interface SchedulerConfig {
  enabled: boolean;
  keyword: string;
  maxResults: number;
  intervalHours: number;
}

