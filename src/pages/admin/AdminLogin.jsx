import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router";
import { FaUserAlt, FaLock } from "react-icons/fa";
import toast from "react-hot-toast";
import logo from "../../assets/Gcaplogo_Side.png";

export default function AdminLogin() {
  const { login, token } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(username, password);
    if (success) {
      toast.success("เข้าสู่ระบบสำเร็จ!");
      navigate("/admin/dashboard", { replace: true });
    } else {
      toast.error("เข้าสู่ระบบล้มเหลว!");
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [token, navigate]);

  return (
    <>
      <div className="bg-linear-65 from-[#0e2353fc] to-[#183f9bfc] min-h-screen flex items-center justify-center p-4">
        <div className="rounded-2xl bg-white max-w-[300px] h-[450px] w-full p-4 shadow-lg">
          <div className="flex justify-center my-6">
            <img className="w-[80%]" src={logo} alt="logo" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="flex items-center">
              <label className="w-[10%] flex justify-center">
                <FaUserAlt className="text-xl text-[#c9b089]" />
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
                className="my-2 border border-gray-300 rounded-lg w-[90%] px-2 focus:outline-none focus:ring-1 focus:ring-[#c9b089]"
              />
            </div>

            <div className="flex items-center">
              <label className="w-[10%] flex justify-center">
                <FaLock className="text-xl text-[#c9b089]" />
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="my-2 border border-gray-300 rounded-lg w-[90%] px-2 focus:outline-none focus:ring-1 focus:ring-[#c9b089]"
              />
            </div>

            <button
              type="submit"
              className="mt-2 cursor-pointer w-full bg-[#c9b089] p-2 rounded-xl text-[#0e2e53fc] font-semibold hover:bg-[#b79a73] transition">
              Confirm
            </button>
            
          </form>
        </div>
      </div>
    </>
  );
}
