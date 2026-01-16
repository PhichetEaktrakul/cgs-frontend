import { useState, useEffect } from "react";
import { apiAdmin } from "../../../api/axiosInstance";
import { FormatDateFull } from "../../../utility/function";
import { FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    username: "",
    password: "",
    rePassword: "",
    role: "admin",
  });
  const [config, setConfig] = useState({
    id: "",
    loanPercent: "",
    interestRate: "",
    numPay: "",
    extendNum:""
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
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

  useEffect(() => {
    fetchUsers();
  }, []);
  //----------------------------------------------------------------------------------------

  // submit new user
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.rePassword) {
      toast.error("รหัสผ่านไม่ตรงกัน");
      return;
    }
    try {
      await apiAdmin.post("/api/user/register", {
        username: form.username,
        password: form.password,
        role: form.role,
      });
      toast.success("เพิ่มผู้ใช้สำเร็จ");
      setForm({ username: "", password: "", rePassword: "", role: "admin" });
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("เกิดข้อผิดพลาด");
    }
  };
  // delete user
  const deleteUser = async (id) => {
    if (!window.confirm("คุณแน่ใจหรือไม่ที่จะลบผู้ใช้นี้?")) return;
    try {
      await apiAdmin.delete(`/api/user/${id}`);
      toast.success("ลบผู้ใช้แล้ว");
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("ลบผู้ใช้ไม่สำเร็จ");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Fetch config when mounted
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await apiAdmin.get("/api/admin/config/initial");
        if (res.data.length > 0) {
          const cfg = res.data[0];
          setConfig({
            id: cfg.id,
            loanPercent: cfg.loan_percent,
            interestRate: cfg.interest_rate,
            numPay: cfg.num_pay,
            extendNum: cfg.extend_num_pay
          });
        }
      } catch (err) {
        console.error("Error fetching config:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  // ✅ 2. Handle input changes
  const handleConfigChange = (e) => {
    const { name, value } = e.target;
    setConfig((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle update click
  const handleUpdate = async () => {
    if (!config.id) return alert("No config loaded!");

    setUpdating(true);
    try {
      const res = await apiAdmin.put("/api/admin/config/initial", {
        loanPercent: parseFloat(config.loanPercent),
        interestRate: parseFloat(config.interestRate),
        numPay: parseInt(config.numPay),
        extendNum: parseInt(config.extendNum)
      });
      toast.success(`อัปเดตค่าเริ่มต้นสำเร็จ!`);
    } catch (err) {
      console.error("Update error:", err);
      alert("เกิดข้อผิดพลาดในการอัปเดต");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4 max-w-[1500px]">
        {/* ✨ Add User Form */}
        <fieldset className="fieldset border border-sky-900 shadow-md p-3 rounded-md overflow-auto row-span-1 mb-3">
          <legend className="fieldset-legend text-2xl text-sky-900">
            เพิ่มผู้ใช้
          </legend>
          <form onSubmit={handleSubmit} className="space-y-3 w-[80%] m-auto ">
            <div>
              <p className="text-lg">Username</p>
              <input
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
                className="bg-amber-50 border border-sky-700 rounded mt-2 px-2 w-full text-md text-lg"
                required
              />
            </div>
            <div>
              <p className="text-lg">Password</p>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="bg-amber-50 border border-sky-700 rounded mt-2 px-2 w-full text-md text-lg"
                required
              />
            </div>
            <div>
              <p className="text-lg">Re-enter password</p>
              <input
                name="rePassword"
                type="password"
                value={form.rePassword}
                onChange={handleChange}
                className="bg-amber-50 border border-sky-700 rounded mt-2 px-2 w-full text-md text-lg"
                required
              />
            </div>

            <div>
              <p className="text-lg">Role</p>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="bg-amber-50 border border-sky-700 rounded mt-2 px-2 w-full text-md text-lg h-[30.47px]">
                <option value="stuff">stuff</option>
                <option value="admin">admin</option>
              </select>
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="bg-sky-700 text-white px-5 py-2 rounded hover:bg-sky-700 cursor-pointer text-lg">
                ยืนยัน
              </button>
            </div>
          </form>
        </fieldset>

        {/* ✨ User List Table */}
        <fieldset className="fieldset border border-sky-900 shadow-md p-3 rounded-md overflow-auto row-span-1 mb-3">
          <legend className="fieldset-legend text-2xl text-sky-900">
            รายชื่อผู้ใช้
          </legend>
          <table className="table w-full text-center">
            <thead className="bg-sky-700 text-white">
              <tr>
                <th>Id</th>
                <th>Username</th>
                <th>Created At</th>
                <th>Role</th>
                <th>Tool</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-2">
                    ไม่มีผู้ใช้
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr
                    key={u.user_id}
                    className="hover:bg-gray-50 even:bg-amber-50">
                    <td>{u.user_id}</td>
                    <td>{u.username}</td>
                    <td>{FormatDateFull(u.created_at)}</td>
                    <td>{u.role}</td>
                    <td>
                      <button
                        onClick={() => deleteUser(u.user_id)}
                        className="text-red-600 hover:text-red-800 cursor-pointer"
                        title="ลบผู้ใช้">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </fieldset>
      </div>

      <fieldset className="fieldset border border-sky-900 shadow-md px-3 py-5 rounded-md overflow-auto row-span-1 mb-3 max-w-[1500px]">
        <legend className="fieldset-legend text-2xl text-sky-900">
          ตั้งค่าเริ่มต้น
        </legend>

        <div className="flex flex-wrap">
          {/* วงเงิน */}
          <div className="flex items-center mx-3 relative">
            <p className="mr-2">วงเงิน</p>
            <div className="relative">
              <input
                type="text"
                name="loanPercent"
                value={config.loanPercent}
                onChange={handleConfigChange}
                className="bg-amber-50 border border-sky-700 rounded px-2 w-[120px] text-lg pr-6" // add pr-6 for space
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-700">
                %
              </span>
            </div>
          </div>

          <div className="flex items-center mx-3 relative">
            <p className="w-[90px] mr-1">อัตราดอกเบี้ย</p>
            <div className="relative">
              <input
                type="text"
                name="interestRate"
                value={config.interestRate}
                onChange={handleConfigChange}
                className="bg-amber-50 border border-sky-700 rounded px-2 w-[120px] text-lg pr-6"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-700">
                %
              </span>
            </div>
          </div>

          {/* จำนวนงวด */}
          <div className="flex items-center mx-3 relative">
            <p className="w-[90px] mr-1">จำนวนงวด</p>
            <input
              type="number"
              name="numPay"
              value={config.numPay}
              onChange={handleConfigChange}
              className="bg-amber-50 border border-sky-700 rounded px-2 w-[100px] text-md text-lg"
            />
          </div>

          <div className="flex items-center mx-3 relative">
            <p className="w-[90px] mr-1">เวลาขยายสัญญา</p>
            <div className="relative">
              <input
                type="text"
                name="extendNum"
                value={config.extendNum}
                onChange={handleConfigChange}
                className="bg-amber-50 border border-sky-700 rounded px-2 w-[100px] text-lg pr-6"
              />
            </div>
          </div>

          {/* ปุ่มยืนยัน */}
          <div className="flex items-center mx-3 relative">
            <button
              onClick={handleUpdate}
              disabled={updating}
              className={`${
                updating ? "bg-gray-400" : "bg-sky-700 hover:bg-sky-800"
              } text-white px-4 py-1 rounded cursor-pointer text-lg`}>
              {updating ? "กำลังอัปเดต..." : "ยืนยัน"}
            </button>
          </div>
        </div>
      </fieldset>
    </>
  );
}
