const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:7174/api";
import type {
  SchedulerConfig,
  PaperReportResponse,
  KeywordStatisticItem,
  SyncJobResult,
} from "../types/admin";

export interface NotificationItem {
  id: string | number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  paperId?: string;
}

export interface TrendingItem {
  name: string;
  type: string;
  trendScore: number;
  growthRate: number;
  recentPaperCount: number;
  snapshotDate: string;
}

export interface DashboardSummaryResponse {
  totalPapers: number;
  totalKeywords: number;
  totalAuthors: number;
  totalJournals: number;
  totalUsers: number;
  totalTopics: number;
  trendingKeywords: TrendingItem[];
  lastSyncTime?: string;
}

export interface Paper {
  paperId: number;
  title: string;
  abstract?: string;
  publicationYear?: number;
  citationCount?: number;
  journal?: string;
  authors: string[];
  keywords: string[];
}

export interface SearchResponse {
  totalCount: number;
  page: number;
  pageSize: number;
  items: Paper[];
}

export interface BookmarkItem {
  bookmarkId: number;
  targetId: number;
  targetType: string;
  createdAt?: string;
  title?: string;
  abstract?: string;
  publicationYear?: number;
  citationCount?: number;
  journalName?: string;
  authors: string[];
  keywordText?: string;
}

export interface FollowItem {
  followId: number;
  targetId: number;
  targetType: string;
  createdAt?: string;
  authorName?: string;
  paperCount?: number;
  journalName?: string;
  topicName?: string;
}

export interface WatchlistItem {
  id: number;
  targetId: number;
  targetType: "Keyword" | "Journal" | "ResearchTopic";
  name: string;
  paperCount?: number;
  createdAt?: string;
}

export interface PaperFacetItem {
  id: string;
  name: string;
  paperCount: number;
}

export interface PaperFacetResponse {
  totalCount: number;
  items: PaperFacetItem[];
}

export interface YearlyMetric {
  year: number;
  paperCount: number;
  citationCount: number;
}

export interface PublicationTrendData {
  id: number;
  name: string;
  totalPaperCount: number;
  totalCitationCount: number;
  growthRate: number;
  yearlyMetrics: YearlyMetric[];
}

export interface PublicationTrendReport {
  reportType: string;
  title: string;
  generatedAt: string;
  data: PublicationTrendData;
}

export interface UserProfile {
  userId: string;
  email: string;
  fullName: string;
  actorType: string;
  roles: string[];
}

export interface LoginResponse {
  token: string;
  userId: number;
  email: string;
  fullName?: string;
  actorType: string;
  roles: string[];
}

export interface RegisterRequestData {
  email: string;
  password: string;
  fullName?: string;
  dateOfBirth?: string; // YYYY-MM-DD
  phoneNumber?: string;
  actorType?: string; // Researcher, Lecturer, Student
}

export interface RegisterResponseData {
  userId: number;
  email: string;
  fullName?: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  actorType?: string;
  createdAt?: string;
  isActive: boolean;
  message: string;
  verificationLink?: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

// Generic fetch wrapper
async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const fullUrl = `${API_BASE_URL}${url}`;

  const headers = new Headers();

  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const token = localStorage.getItem("token");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (options.headers) {
    const customHeaders = new Headers(options.headers);
    customHeaders.forEach((value, key) => {
      headers.set(key, value);
    });
  }

  try {
    const response = await fetch(fullUrl, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage = "Có lỗi xảy ra khi gửi yêu cầu.";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const text = await response.text();
    if (!text) {
      return {} as T;
    }

    try {
      return JSON.parse(text) as T;
    } catch {
      return text as unknown as T;
    }
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Không thể kết nối tới backend. Hãy đảm bảo BE đang chạy trên http://localhost:5225 và thử lại.",
      );
    }
    throw error;
  }
}

// Fetch wrapper for binary responses (blobs)
async function requestBlob(
  url: string,
  options: RequestInit = {},
): Promise<Blob> {
  const fullUrl = `${API_BASE_URL}${url}`;

  const headers = new Headers();
  const token = localStorage.getItem("token");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (options.headers) {
    const customHeaders = new Headers(options.headers);
    customHeaders.forEach((value, key) => {
      headers.set(key, value);
    });
  }

  const response = await fetch(fullUrl, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = "An error occurred during file download";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return response.blob();
}

export const api = {
  // ==========================================
  // Authentication
  // ==========================================
  async login(email: string, password: string): Promise<LoginResponse> {
    return request<LoginResponse>("/Account/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  async register(data: RegisterRequestData): Promise<RegisterResponseData> {
    return request<RegisterResponseData>("/Account/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async getProfile(): Promise<UserProfile> {
    return request<UserProfile>("/Account/profile");
  },

  async verifyEmail(token: string): Promise<{ message: string }> {
    return request<{ message: string }>(
      `/Account/verify-email?token=${encodeURIComponent(token)}`,
    );
  },

  async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    return request<ForgotPasswordResponse>("/Account/forgot-password", {
      method: "POST",
      body: JSON.stringify({ Email: email.trim() }),
    });
  },

  async resetPassword(
    email: string,
    pin: string,
    newPassword: string,
  ): Promise<ForgotPasswordResponse> {
    return request<ForgotPasswordResponse>("/Account/reset-password", {
      method: "POST",
      body: JSON.stringify({
        Email: email.trim(),
        Pin: pin.trim(),
        NewPassword: newPassword,
      }),
    });
  },

  // ==========================================
  // Papers Search & Detail
  // ==========================================
  async searchPapers(params: {
    q?: string;
    keyword?: string;
    author?: string;
    journal?: string;
    publicationYear?: number;
    page?: number;
    pageSize?: number;
  }): Promise<{ success: boolean; data: SearchResponse }> {
    const searchParams = new URLSearchParams();
    if (params.q) searchParams.append("q", params.q);
    if (params.keyword) searchParams.append("keyword", params.keyword);
    if (params.author) searchParams.append("author", params.author);
    if (params.journal) searchParams.append("journal", params.journal);
    if (params.publicationYear !== undefined)
      searchParams.append("publicationYear", params.publicationYear.toString());
    if (params.page !== undefined)
      searchParams.append("page", params.page.toString());
    if (params.pageSize !== undefined)
      searchParams.append("pageSize", params.pageSize.toString());

    const queryString = searchParams.toString();
    const url = `/papers${queryString ? `?${queryString}` : ""}`;
    return request<{ success: boolean; data: SearchResponse }>(url);
  },

  async getPaperDetails(
    id: number | string,
  ): Promise<{ success: boolean; data: Paper }> {
    return request<{ success: boolean; data: Paper }>(`/papers/${id}`);
  },

  async searchAuthors(name: string): Promise<{
    success: boolean;
    data: { authorId: number; authorName: string }[];
  }> {
    return request<{
      success: boolean;
      data: { authorId: number; authorName: string }[];
    }>(`/Authors/search?name=${encodeURIComponent(name)}`);
  },

  async getAuthorFacets(
    q?: string,
    page = 1,
    pageSize = 10,
  ): Promise<PaperFacetResponse> {
    const searchParams = new URLSearchParams();
    if (q) searchParams.append("q", q);
    searchParams.append("page", page.toString());
    searchParams.append("pageSize", pageSize.toString());
    return request<PaperFacetResponse>(
      `/papers/facets/authors?${searchParams.toString()}`,
    );
  },

  async getKeywordFacets(
    q?: string,
    page = 1,
    pageSize = 10,
  ): Promise<PaperFacetResponse> {
    const searchParams = new URLSearchParams();
    if (q) searchParams.append("q", q);
    searchParams.append("page", page.toString());
    searchParams.append("pageSize", pageSize.toString());
    return request<PaperFacetResponse>(
      `/papers/facets/keywords?${searchParams.toString()}`,
    );
  },

  async getTopicFacets(
    q?: string,
    page = 1,
    pageSize = 10,
  ): Promise<PaperFacetResponse> {
    const searchParams = new URLSearchParams();
    if (q) searchParams.append("q", q);
    searchParams.append("page", page.toString());
    searchParams.append("pageSize", pageSize.toString());
    return request<PaperFacetResponse>(
      `/papers/facets/topics?${searchParams.toString()}`,
    );
  },

  async getJournalFacets(
    q?: string,
    page = 1,
    pageSize = 10,
  ): Promise<PaperFacetResponse> {
    const searchParams = new URLSearchParams();
    if (q) searchParams.append("q", q);
    searchParams.append("page", page.toString());
    searchParams.append("pageSize", pageSize.toString());
    return request<PaperFacetResponse>(
      `/papers/facets/journals?${searchParams.toString()}`,
    );
  },

  // ==========================================
  // Bookmarks (Library)
  // ==========================================
  async toggleBookmark(
    targetId: number | string,
    targetType: "Paper" | "Keyword" | string = "Paper",
  ): Promise<{ success: boolean; isBookmarked: boolean; message: string }> {
    return request<{
      success: boolean;
      isBookmarked: boolean;
      message: string;
    }>("/Bookmarks/toggle", {
      method: "POST",
      body: JSON.stringify({ targetId: Number(targetId), targetType }),
    });
  },

  async getBookmarks(): Promise<{ success: boolean; data: BookmarkItem[] }> {
    return request<{ success: boolean; data: BookmarkItem[] }>(
      "/Bookmarks/my-bookmarks",
    );
  },

  // ==========================================
  // Follows (Network)
  // ==========================================
  async toggleFollow(
    targetId: number | string,
    targetType: "Author" | "Journal" | "ResearchTopic" | "Topic" | string,
  ): Promise<{ success: boolean; isFollowed: boolean; message: string }> {
    // Đảm bảo mapping đúng kiểu enum nếu BE chỉ nhận "ResearchTopic" thay vì "Topic"
    const mappedType = targetType === "Topic" ? "ResearchTopic" : targetType;
    return request<{ success: boolean; isFollowed: boolean; message: string }>(
      "/Follows/toggle",
      {
        method: "POST",
        body: JSON.stringify({
          targetId: Number(targetId),
          targetType: mappedType,
        }),
      },
    );
  },

  async getFollows(): Promise<{ success: boolean; data: FollowItem[] }> {
    return request<{ success: boolean; data: FollowItem[] }>(
      "/Follows/my-follows",
    );
  },

  // ==========================================
  // Researcher Watchlist (Keyword, Journal, ResearchTopic)
  // ==========================================
  async getWatchlist(): Promise<{ success: boolean; data: WatchlistItem[] }> {
    return request<{ success: boolean; data: WatchlistItem[] }>(
      "/researcher/watchlist",
    );
  },

  async addToWatchlist(
    targetId: number,
    targetType: "Keyword" | "Journal" | "ResearchTopic",
  ): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(
      "/researcher/watchlist",
      {
        method: "POST",
        body: JSON.stringify({ targetId, targetType }),
      },
    );
  },

  async removeFromWatchlist(
    targetType: "Keyword" | "Journal" | "ResearchTopic",
    targetId: number,
  ): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(
      `/researcher/watchlist/${targetType}/${targetId}`,
      { method: "DELETE" },
    );
  },

  // ==========================================
  // Researcher Reports
  // ==========================================
  async getPublicationTrend(params: {
    targetType: string;
    target: string;
    years?: number;
  }): Promise<PublicationTrendReport> {
    const searchParams = new URLSearchParams();
    searchParams.append("targetType", params.targetType);
    searchParams.append("target", params.target);
    if (params.years) searchParams.append("years", params.years.toString());
    return request<PublicationTrendReport>(
      `/researcher/reports/publication-trend?${searchParams.toString()}`,
    );
  },

  // ==========================================
  // Dashboard & Trends
  // ==========================================
  async getDashboardSummary(): Promise<DashboardSummaryResponse> {
    return request<DashboardSummaryResponse>("/Dashboard/summary", {
      method: "GET",
    });
  },

  async getTrendingTopics(topN: number = 10): Promise<any[]> {
    return request<any[]>(`/Trends/trending?topN=${topN}`, {
      method: "GET",
    });
  },

  async getActivityScores(topN: number = 10): Promise<any[]> {
    return request<any[]>(`/Trends/activity-score?topN=${topN}`, {
      method: "GET",
    });
  },

  async getLecturerGroups(): Promise<{ success: boolean; data: any[] }> {
    return Promise.resolve({ success: true, data: [] });
  },

  // ==========================================
  // Notifications
  // ==========================================
  async getNotifications(page = 1, pageSize = 10) {
    return request<any>(`/Notification?page=${page}&pageSize=${pageSize}`, {
      method: "GET",
    });
  },

  async markNotificationAsRead(id: string | number) {
    return request<any>(`/Notification/${id}/read`, {
      method: "PUT",
    });
  },

  async markAllAsRead() {
    return request<any>("/Notification/read-all", {
      method: "PUT",
    });
  },

  // ==========================================
  // Admin APIs
  // ==========================================
  async getKeywordStats(): Promise<KeywordStatisticItem[]> {
    return request<KeywordStatisticItem[]>("/Report/keyword-stats");
  },

  async syncOpenAlex(params: {
    keyword: string;
    maxResults: number;
    useCheckpoint: boolean;
  }): Promise<SyncJobResult> {
    const searchParams = new URLSearchParams();
    searchParams.append("keyword", params.keyword);
    searchParams.append("maxResults", params.maxResults.toString());
    searchParams.append("useCheckpoint", params.useCheckpoint.toString());
    return request<SyncJobResult>(
      `/fetchdata/openalex?${searchParams.toString()}`,
      {
        method: "POST",
      },
    );
  },

  async getSchedulerConfig(): Promise<SchedulerConfig> {
    return request<SchedulerConfig>("/admin/scheduler-config");
  },

  async updateSchedulerConfig(payload: SchedulerConfig): Promise<any> {
    return request<any>("/admin/scheduler-config", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  async enableScheduler(): Promise<any> {
    return request<any>("/admin/scheduler-config/enable", {
      method: "PATCH",
    });
  },

  async disableScheduler(): Promise<any> {
    return request<any>("/admin/scheduler-config/disable", {
      method: "PATCH",
    });
  },

  async getAdminUsers(): Promise<{ items: any[] }> {
    return request<{ items: any[] }>("/admin/users");
  },

  async activateUser(userId: string): Promise<any> {
    return request<any>(`/Admin/users/${userId}/activate`, {
      method: "PATCH",
    });
  },

  async deactivateUser(userId: string): Promise<any> {
    return request<any>(`/Admin/users/${userId}/deactivate`, {
      method: "PATCH",
    });
  },

  async getPaperReports(params: {
    page: number;
    pageSize: number;
    search?: string;
    year?: number;
    keywordText?: string;
  }): Promise<PaperReportResponse> {
    const searchParams = new URLSearchParams();
    searchParams.append("page", params.page.toString());
    searchParams.append("pageSize", params.pageSize.toString());

    if (params.search) {
      searchParams.append("search", params.search);
    }
    if (params.year !== undefined) {
      searchParams.append("year", params.year.toString());
    }
    if (params.keywordText) {
      searchParams.append("keywordText", params.keywordText);
    }

    return request<PaperReportResponse>(
      `/Report/papers?${searchParams.toString()}`,
    );
  },

  // ==========================================
  // Export APIs
  // ==========================================
  async exportPapersCsv(params?: {
    year?: number;
    keywordText?: string;
  }): Promise<Blob> {
    const searchParams = new URLSearchParams();
    if (params?.year !== undefined) {
      searchParams.append("year", params.year.toString());
    }
    if (params?.keywordText) {
      searchParams.append("keywordText", params.keywordText);
    }
    const queryString = searchParams.toString();
    return requestBlob(
      `/Report/export/papers${queryString ? `?${queryString}` : ""}`,
    );
  },

  async exportPapersPdf(params?: {
    year?: number;
    keywordText?: string;
  }): Promise<Blob> {
    const searchParams = new URLSearchParams();
    if (params?.year !== undefined) {
      searchParams.append("year", params.year.toString());
    }
    if (params?.keywordText) {
      searchParams.append("keywordText", params.keywordText);
    }
    const queryString = searchParams.toString();
    return requestBlob(
      `/Report/export/papers-pdf${queryString ? `?${queryString}` : ""}`,
    );
  },

  async exportKeywordStatsCsv(): Promise<Blob> {
    return requestBlob("/Report/export/keyword-stats");
  },

  async exportKeywordStatsPdf(): Promise<Blob> {
    return requestBlob("/Report/export/keyword-stats-pdf");
  },

  async syncOpenAlexData(maxResults: number): Promise<any> {
    const searchParams = new URLSearchParams();
    searchParams.append("maxResults", maxResults.toString());
    return request<any>(`/datasync/sync-openalex?${searchParams.toString()}`, {
      method: "POST",
    });
  },

  async getTopicFacetsAdmin(params: {
    q?: string;
    page: number;
    pageSize: number;
  }): Promise<{
    success: boolean;
    data: {
      totalCount: number;
      items: { id: string; name: string; paperCount: number }[];
    };
  }> {
    const searchParams = new URLSearchParams();
    if (params.q) {
      searchParams.append("q", params.q);
    }
    searchParams.append("page", params.page.toString());
    searchParams.append("pageSize", params.pageSize.toString());
    return request<{
      success: boolean;
      data: {
        totalCount: number;
        items: { id: string; name: string; paperCount: number }[];
      };
    }>(`/papers/facets/topics?${searchParams.toString()}`);
  },

   async compareKeywords(left: string | number, right: string | number, years: number = 5): Promise<any> {
    return request<any>(`/researcher/compare/keywords?left=${encodeURIComponent(left)}&right=${encodeURIComponent(right)}&years=${years}`, {
      method: "GET",
    });
  },

  async compareTopics(left: string | number, right: string | number, years: number = 5): Promise<any> {
    return request<any>(`/researcher/compare/topics?left=${encodeURIComponent(left)}&right=${encodeURIComponent(right)}&years=${years}`, {
      method: "GET",
    });
  },
};
