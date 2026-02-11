import { useState, useEffect } from "react";
import { usePrice } from "../../context/PriceContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, NavLink } from "react-router";
import toast from "react-hot-toast";

export default function Navbar() {
  const navigate = useNavigate();
  const { admin, logout } = useAuth();
  const { prices } = usePrice();
  const [serverTime, setServerTime] = useState(new Date());

  // -------------------- Price Render --------------------
  const renderPrice = (newPrice, oldPrice) => {
    if (newPrice > oldPrice) {
      return (
        <span className="text-green-600 flex items-center">
          {newPrice.toLocaleString()}
        </span>
      );
    }
    if (newPrice < oldPrice) {
      return (
        <span className="text-red-600 flex items-center">
          {newPrice.toLocaleString()}
        </span>
      );
    }
    return <span className="text-black">{newPrice.toLocaleString()}</span>;
  };
  //-------------------------------------------------------

  //-------------------------------------------------------
  const tabClass = ({ isActive }) =>
    `px-2 py-2 text-md font-medium transition ${
      isActive
        ? "text-sky-900 font-bold! border-b-2 border-sky-900"
        : "text-gray-500 hover:text-sky-900"
    }`;
  //-------------------------------------------------------
  
  // -------------------- Logout --------------------------
  const handleLogout = () => {
    logout();
    toast.success("ออกจากระบบเเล้ว!");
    navigate("/admin/auth");
  };
  //-------------------------------------------------------

  // -------------------- Server Time ---------------------
  useEffect(() => {
    const timer = setInterval(() => {
      setServerTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  //-------------------------------------------------------

  return (
    <>
      <div className="w-full sticky top-0 z-50 shadow-[0_1px_3px_rgba(0,0,0,0.2),0_4px_8px_rgba(0,0,0,0.12)]">
        {/* ========== TOP NAVBAR ========== */}
        <div className="bg-sky-900 text-white px-4 pt-1 pb-2">
          <div className="flex items-center justify-between">
            <div className="text-xl font-semibold leading-tight">
              <span className="text-yellow-400">GCAP</span> CONSIGNMENT BACKOFFICE
            </div>

            <div className="flex items-center text-sm gap-4 leading-tight">
              <span>
                <span className="text-sky-200">Server Time:</span>{" "}
                <span className="text-white">
                  {serverTime.toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                  })}
                </span>
              </span>

              <span>
                <span className="text-sky-200">Welcome,</span> {admin}
              </span>

              <button
                onClick={handleLogout}
                className="bg-sky-700 hover:bg-red-500 px-2 py-0.5 rounded-lg">
                Logout
              </button>
            </div>
          </div>

          {/* ========== GOLD PRICE ========== */}
          <div className="flex justify-center mt-0.5 text-lg">
            <div className="flex rounded-lg overflow-hidden">
              <div className="bg-yellow-200 px-3 py-0.5">
                {renderPrice(prices.gold96_buy, prices.old_gold96_buy)}
              </div>
              <div className="bg-yellow-200 px-3 py-0.5">
                {renderPrice(prices.gold96_sell, prices.old_gold96_sell)}
              </div>
              <div className="bg-sky-200 px-3 py-0.5">
                {renderPrice(prices.gold99_buy, prices.old_gold99_buy)}
              </div>
              <div className="bg-sky-200 px-3 py-0.5">
                {renderPrice(prices.gold99_sell, prices.old_gold99_sell)}
              </div>
            </div>
          </div>
        </div>

        {/* ========== SUB NAVBAR ========== */}
        <div className="bg-white px-6">
          <div className="flex gap-6">
            <NavLink to="/admin/dashboard" className={tabClass}>Dashboard</NavLink>
            <NavLink to="/admin/tickets" className={tabClass}>Ticket</NavLink>
            <NavLink to="/admin/users" className={tabClass}>User Manage</NavLink>
            <NavLink to="/admin/settings" className={tabClass}>Settings</NavLink>
          </div>
        </div>
      </div>
    </>
  );
}
