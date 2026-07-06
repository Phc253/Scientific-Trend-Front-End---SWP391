import React, { useState, useEffect } from "react";
import axios from "axios";
import type { User, SystemLog } from "../../types/admin";

interface AdminUsersProps {
  addLog: (type: SystemLog["type"], message: string) => void;
}

export const AdminUsers: React.FC<AdminUsersProps> = ({ addLog }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [errorUsers, setErrorUsers] = useState("");

  const [searchUser, setSearchUser] = useState("");
  const [filterRole, setFilterRole] = useState<string>("Tất cả");
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<User["role"]>("Sinh viên");
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // Helper to map actorType
  const mapActorType = (actorType: string): User["role"] => {
    switch (actorType?.toLowerCase()) {
      case "student":
      case "sinh viên":
        return "Sinh viên";
      case "lecturer":
      case "giảng viên":
        return "Giảng viên";
      case "researcher":
      case "nghiên cứu viên":
        return "Nghiên cứu viên";
      case "admin":
      case "systemadministrator":
      case "quản trị viên":
        return "Quản trị viên";
      default:
        return "Sinh viên";
    }
  };

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    setErrorUsers("");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/admin/users", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const fetchedItems = response.data.items || [];
      const mappedUsers: User[] = fetchedItems.map((item: any) => ({
        id: String(item.userId),
        name: item.fullName || "",
        email: item.email || "",
        role: mapActorType(item.actorType),
        status: item.isActive ? "Hoạt động" : "Đã khóa",
        joinedDate: item.createdAt ? item.createdAt.split("T")[0] : "",
      }));
      setUsers(mappedUsers);
    } catch (err: any) {
      console.error(err);
      setErrorUsers(err.response?.data?.message || "Lỗi tải danh sách người dùng từ máy chủ.");
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Tương tác thay đổi trạng thái user bằng API thực tế
  const toggleUserStatus = async (id: string) => {
    const userToUpdate = users.find((u) => u.id === id);
    if (!userToUpdate) return;

    const isActive = userToUpdate.status === "Hoạt động";
    const endpoint = isActive 
      ? `/api/Admin/users/${id}/deactivate` 
      : `/api/Admin/users/${id}/activate`;
    
    const token = localStorage.getItem("token");
    try {
      await axios.patch(endpoint, null, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const nextStatus = isActive ? "Đã khóa" : "Hoạt động";
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === id ? { ...u, status: nextStatus } : u))
      );

      addLog(
        isActive ? "WARNING" : "SUCCESS",
        `Thay đổi trạng thái người dùng ${userToUpdate.name} sang ${nextStatus} thành công.`
      );
    } catch (err: any) {
      console.error(`Lỗi thay đổi trạng thái user ${id}:`, err);
      const errMsg = err.response?.data?.message || err.message || "Lỗi không xác định.";
      addLog("ERROR", `Không thể thay đổi trạng thái user ${userToUpdate.name}: ${errMsg}`);
    }
  };

  // Thêm người dùng mới
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    const newUser: User = {
      id: `USR-0${users.length + 1}`,
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      status: "Hoạt động",
      joinedDate: new Date().toISOString().split("T")[0],
    };

    setUsers([...users, newUser]);
    addLog("SUCCESS", `Tạo mới thành công người dùng: ${newUserName} (${newUserRole}).`);
    setNewUserName("");
    setNewUserEmail("");
    setShowAddUserModal(false);
  };

  // Lọc danh sách người dùng hiển thị
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchUser.toLowerCase()) ||
      user.email.toLowerCase().includes(searchUser.toLowerCase());
    const matchesRole = filterRole === "Tất cả" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Bộ lọc và Nút Thêm Mới */}
      <div className="bg-white p-4 rounded-lg border border-[#ebeef0] shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto flex-1">
          <div className="relative flex-1 md:max-w-xs">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#74777f] text-sm">
              search
            </span>
            <input
              type="text"
              placeholder="Tìm theo tên hoặc email..."
              className="w-full pl-9 pr-3 py-2 bg-[#f1f4f6] border border-[#c4c6cf] rounded-md text-xs focus:outline-none focus:border-[#13696a]"
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
            />
          </div>

          <select
            className="p-2 bg-white border border-[#c4c6cf] rounded-md text-xs text-[#43474e] focus:outline-none focus:border-[#13696a]"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="Tất cả">Tất cả vai trò</option>
            <option value="Sinh viên">Sinh viên</option>
            <option value="Giảng viên">Giảng viên</option>
            <option value="Nghiên cứu viên">Nghiên cứu viên</option>
            <option value="Quản trị viên">Quản trị viên</option>
          </select>
        </div>

      </div>

      {/* Form Thêm Người Dùng (Hiển thị ngay trên màn hình để tiện sử dụng) */}
      {showAddUserModal && (
        <div className="bg-white p-6 rounded-lg border-2 border-[#13696a] shadow-md animate-fadeIn">
          <div className="flex justify-between items-center mb-4 border-b border-[#ebeef0] pb-2">
            <h3 className="font-bold text-[#002045] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">person_add</span>
              Đăng ký người dùng học thuật mới
            </h3>
            <button
              onClick={() => setShowAddUserModal(false)}
              className="text-[#74777f] hover:text-[#002045]"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#43474e] mb-1.5 uppercase">
                Họ và tên
              </label>
              <input
                type="text"
                required
                placeholder="Ví dụ: PGS.TS. Nguyễn Văn B"
                className="w-full p-2.5 bg-[#f1f4f6] border border-[#c4c6cf] rounded focus:outline-none focus:border-[#13696a] text-xs font-semibold text-[#181c1e]"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#43474e] mb-1.5 uppercase">
                Email học thuật
              </label>
              <input
                type="email"
                required
                placeholder="nguyenvanb@university.edu.vn"
                className="w-full p-2.5 bg-[#f1f4f6] border border-[#c4c6cf] rounded focus:outline-none focus:border-[#13696a] text-xs font-semibold text-[#181c1e]"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
              />
            </div>
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <label className="block text-xs font-bold text-[#43474e] mb-1.5 uppercase">
                  Vai trò / Đối tượng
                </label>
                <select
                  className="w-full p-2.5 bg-white border border-[#c4c6cf] rounded focus:outline-none focus:border-[#13696a] text-xs font-semibold text-[#43474e]"
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as any)}
                >
                  <option value="Sinh viên">Sinh viên (Student)</option>
                  <option value="Giảng viên">Giảng viên (Lecturer)</option>
                  <option value="Nghiên cứu viên">Nghiên cứu viên (Researcher)</option>
                  <option value="Quản trị viên">Quản trị viên (Admin)</option>
                </select>
              </div>
              <button
                type="submit"
                className="bg-[#13696a] hover:bg-[#0f5455] text-white text-xs font-bold p-3 rounded transition-colors cursor-pointer"
              >
                Xác nhận
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Bảng danh sách Người dùng */}
      <div className="bg-white rounded-lg border border-[#ebeef0] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f1f4f6] border-b border-[#c4c6cf]">
                <th className="p-4 text-xs font-bold text-[#43474e] uppercase">Mã số</th>
                <th className="p-4 text-xs font-bold text-[#43474e] uppercase">Họ tên</th>
                <th className="p-4 text-xs font-bold text-[#43474e] uppercase">Email</th>
                <th className="p-4 text-xs font-bold text-[#43474e] uppercase">Ngày tham gia</th>
                <th className="p-4 text-xs font-bold text-[#43474e] uppercase">
                  Đối tượng / Vai trò
                </th>
                <th className="p-4 text-xs font-bold text-[#43474e] uppercase text-center">
                  Trạng thái
                </th>
                <th className="p-4 text-xs font-bold text-[#43474e] uppercase text-right">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ebeef0]">
              {isLoadingUsers ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-sm text-[#13696a] font-medium">
                    <span className="inline-block animate-spin mr-2">⏳</span> Đang tải danh sách
                    người dùng...
                  </td>
                </tr>
              ) : errorUsers ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-sm text-[#ef4444] font-medium">
                    ⚠️ {errorUsers}
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-sm text-[#74777f] font-medium">
                    Không tìm thấy người dùng nào phù hợp với bộ lọc!
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  let roleBadgeClass = "bg-[#f1f4f6] text-[#43474e]";
                  if (user.role === "Giảng viên") roleBadgeClass = "bg-[#fef9c3] text-[#854d0e]";
                  if (user.role === "Nghiên cứu viên") roleBadgeClass = "bg-[#dbeafe] text-[#1e40af]";
                  if (user.role === "Quản trị viên") roleBadgeClass = "bg-[#f3e8ff] text-[#6b21a8]";

                  return (
                    <tr key={user.id} className="hover:bg-[#f1f4f6]/50 transition-colors">
                      <td className="p-4 text-xs font-bold text-[#002045] font-mono">{user.id}</td>
                      <td className="p-4 text-xs font-bold text-[#181c1e]">{user.name}</td>
                      <td className="p-4 text-xs font-medium text-[#43474e]">{user.email}</td>
                      <td className="p-4 text-xs text-[#74777f] tabular-nums">{user.joinedDate}</td>
                      <td className="p-4 text-xs">
                        <span
                          className={`inline-block px-2 py-1 rounded font-bold text-[11px] ${roleBadgeClass}`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-center">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            user.status === "Hoạt động"
                              ? "bg-[#dcfce7] text-[#16a34a]"
                              : "bg-[#fef2f2] text-[#ef4444]"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-right">
                        {user.role !== "Quản trị viên" ? (
                          <button
                            onClick={() => toggleUserStatus(user.id)}
                            className={`text-[11px] font-bold px-2.5 py-1 rounded transition-colors cursor-pointer ${
                              user.status === "Hoạt động"
                                ? "border border-[#ef4444] text-[#ef4444] hover:bg-[#fef2f2]"
                                : "bg-[#13696a] text-white hover:opacity-90"
                            }`}
                          >
                            {user.status === "Hoạt động" ? "Khóa" : "Mở khóa"}
                          </button>
                        ) : (
                          <span className="text-slate-400 font-semibold italic text-[11.5px] pr-2">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
