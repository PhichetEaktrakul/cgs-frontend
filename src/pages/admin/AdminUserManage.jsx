import { useState, useEffect } from "react";
import { apiAdmin } from "../../api/axiosInstance";
import { FormatDateFull } from "../../utility/function";
import { LuTrash2 } from "react-icons/lu";
import toast from "react-hot-toast";

export default function AdminUserManage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    username: "",
    passwordHash: "",
    rePassword: "",
    role: "admin",
  });

  //----------------------------------------------------------------------------------------
  // Fetch Users
  const fetchUsers = async () => {
    try {
      const res = await apiAdmin.get("/api/user/all");
      if (res.status === 200) {
        setUsers(res.data);
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.error(err);
      toast.error("โหลดรายชื่อผู้ใช้ไม่สำเร็จ");
    }
  };
  //----------------------------------------------------------------------------------------

  //----------------------------------------------------------------------------------------
  // Submit New User
  const handleAddUser = async (e) => {
    e.preventDefault();
    if (form.passwordHash !== form.rePassword) {
      toast.error("กรุณากรอกรหัสผ่านให้ตรงกัน");
      return;
    }
    try {
      await apiAdmin.post("/api/user/register", {
        username: form.username,
        passwordHash: form.passwordHash,
        role: form.role,
      });
      toast.success("เพิ่มผู้ใช้งานสำเร็จ");
      setForm({
        username: "",
        passwordHash: "",
        rePassword: "",
        role: "admin",
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("เกิดข้อผิดพลาด");
    }
  };
  //----------------------------------------------------------------------------------------

  //----------------------------------------------------------------------------------------
  // Delete User
  const deleteUser = async (id) => {
    if (!window.confirm("คุณแน่ใจหรือไม่ที่จะลบผู้ใช้งานนี้?")) return;
    try {
      await apiAdmin.delete(`/api/user/${id}`);
      toast.success("ลบผู้ใช้งานแล้ว");
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("ลบผู้ใช้งานไม่สำเร็จ");
    }
  };
  //----------------------------------------------------------------------------------------

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const roleBadgeClass = {
    admin: "badge badge-info",
    staff: "badge badge-warning",
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <div className="w-full h-full max-w-5xl">
        <div className="grid grid-cols-2 gap-4">
          {/* ========== Add New User Form ========== */}
          <div className="shadow-[0_1px_3px_rgba(0,0,0,0.2),0_4px_8px_rgba(0,0,0,0.12)] px-3 py-5 rounded-md overflow-auto row-span-1 mb-3 bg-white">
            <div className="flex items-center mb-4">
              <div className="w-2 h-6 bg-sky-700 mr-3 rounded-sm" />
              <h2 className="text-2xl font-semibold text-gray-700">
                เพิ่มผู้ใช้ใหม่
              </h2>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4 w-[80%] m-auto">
              <div>
                <p className="text-lg">Username</p>
                <input
                  name="username"
                  type="text"
                  autoComplete="username"
                  value={form.username}
                  onChange={handleChange}
                  className="bg-blue-50 border-0 border-b-2 border-gray-400 focus:border-blue-500 focus:outline-none px-1 w-full text-lg rounded-sm"
                  required
                />
              </div>

              <div>
                <p className="text-lg">Password</p>
                <input
                  name="passwordHash"
                  type="password"
                  autoComplete="new-password"
                  value={form.passwordHash}
                  onChange={handleChange}
                  className="bg-blue-50 border-0 border-b-2 border-gray-400 focus:border-blue-500 focus:outline-none px-1 w-full text-lg rounded-sm"
                  required
                />
              </div>

              <div>
                <p className="text-lg">Re-enter password</p>
                <input
                  name="rePassword"
                  type="password"
                  autoComplete="new-password"
                  value={form.rePassword}
                  onChange={handleChange}
                  className="bg-blue-50 border-0 border-b-2 border-gray-400 focus:border-blue-500 focus:outline-none px-1 w-full text-lg rounded-sm"
                  required
                />
              </div>

              <div>
                <p className="text-lg">Role</p>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="bg-blue-50 border-0 border-b-2 border-gray-400 focus:border-blue-500 focus:outline-none px-1 w-full text-lg rounded-sm">
                  <option value="staff">staff</option>
                  <option value="admin">admin</option>
                </select>
              </div>

              <div className="text-center pt-2">
                <button
                  type="submit"
                  className="bg-sky-700 hover:bg-sky-800 text-white px-6 py-2 rounded-full text-lg">
                  ยืนยัน
                </button>
              </div>
            </form>
          </div>

          {/* ========== User List Table ========== */}
          <div className="shadow-[0_1px_3px_rgba(0,0,0,0.2),0_4px_8px_rgba(0,0,0,0.12)] px-3 py-5 rounded-md overflow-auto row-span-1 mb-3 bg-white">
            <div className="flex items-center mb-4">
              <div className="w-2 h-6 bg-green-400 mr-3 rounded-sm" />
              <h2 className="text-2xl font-semibold text-gray-700">
                รายชื่อผู้ใช้งาน
              </h2>
            </div>
            
            <div className="max-h-[280px] rounded-2xl  mt-4 border border-gray-200 overflow-y-auto">
              <table className="w-full text-center border-collapse text-sm ">
                <thead className="bg-green-100 sticky top-0 z-10 ">
                  <tr>
                    <th className="py-2 px-2">id</th>
                    <th className="py-2">Username</th>
                    <th className="py-2">สร้างเมื่อ</th>
                    <th className="py-2">ตำเเหน่ง</th>
                    <th className="py-2 px-2"> </th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-4 text-gray-500">
                        ไม่มีผู้ใช้
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr
                        key={u.user_id}
                        className="hover:bg-green-50 transition border-b border-gray-300 ">
                        <td className="py-2">{u.user_id}</td>
                        <td className="py-2">{u.username}</td>
                        <td className="py-2">{FormatDateFull(u.created_at)}</td>
                        <td className="py-2">
                          <div
                            className={
                              roleBadgeClass[u.role] || "badge badge-ghost"
                            }>
                            {u.role}
                          </div>
                        </td>
                        <td className="py-2">
                          <button
                            onClick={() => deleteUser(u.user_id)}
                            className="text-red-600 hover:text-red-800 cursor-pointer"
                            title="ลบผู้ใช้">
                            <LuTrash2 />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
