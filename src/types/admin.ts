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
  fetchNewWorksEnabled: boolean;
  refreshExistingWorksEnabled: boolean;
}

export interface PaperReportItem {
  paperId: number;
  title: string;
  publicationYear: number;
  citationCount: number;
  journalName: string | null;
  keywords: string[];
  authors: string[];
}

export interface PaperReportResponse {
  page: number;
  pageSize: number;
  totalCount: number;
  items: PaperReportItem[];
}

export interface KeywordStatisticItem {
  keywordText: string;
  totalPapers: number;
  firstYear: number;
  lastYear: number;
}

export interface SyncJobResult {
  syncJobId: number;
  sourceName: string;
  keyword: string;
  maxResults: number;
  recordsFetched: number;
  status: string;
  startTime: string;
  endTime: string;
  errorMessage: string | null;
  newPaperPreviews?: {
    paperId: number;
    title: string;
    abstract?: string;
    citationCount: number;
    publicationYear?: number;
    authors?: string[];
    journalName?: string | null;
  }[];
}

export interface UpdatedPaperItem {
  paperId: number;
  title: string;
  oldCitationCount: number;
  newCitationCount: number;
  citationDelta: number;
  topicName: string;
  updatedAt: string;
}

export interface GlobalSyncResponse {
  syncJobId: number;
  sourceName: string;
  maxResults: number;
  recordsFetched: number;
  status: string;
  startTime: string;
  endTime: string;
  errorMessage: string | null;
  updatedPapers: UpdatedPaperItem[];
}


