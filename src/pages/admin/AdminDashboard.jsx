import { useState, useEffect } from "react";
import { FaSortUp, FaSortDown } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router";
import { apiAdmin } from "../../api/axiosInstance";
import axios from "axios";
import toast from "react-hot-toast";
import Monitor from "../../components/admin/ticket-monitor/Monitor";
import CustomerManager from "../../components/admin/customer-manager/CustomerManager";
import TicketManager from "../../components/admin/ticket-manager/TicketManager";
import UserManager from "../../components/admin/user-manager/UserManager";

export default function AdminDashboard() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Monitor");
  const [prices, setPrices] = useState({
    gold99_buy: 0,
    gold99_sell: 0,
    old_gold99_buy: 0,
    old_gold99_sell: 0,
    gold96_buy: 0,
    gold96_sell: 0,
    old_gold96_buy: 0,
    old_gold96_sell: 0,
  });

  const handleLogout = () => {
    logout();
    toast.success("ออกจากระบบ!");
    navigate("/auth/login");
  };

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  const renderPrice = (newPrice, oldPrice) => {
    if (newPrice > oldPrice) {
      return (
        <span className="text-green-600 flex items-center">
          {newPrice.toLocaleString()} <FaSortUp className="ml-1" />
        </span>
      );
    } else if (newPrice < oldPrice) {
      return (
        <span className="text-red-600 flex items-center">
          {newPrice.toLocaleString()} <FaSortDown className="ml-1" />
        </span>
      );
    } else {
      return <span className="text-black">{newPrice.toLocaleString()}</span>;
    }
  };

  //----------------------------------------------------------------------------------------
  // Fetch Gold RT Price From SignalR
  useEffect(() => {
    axios
      .get("http://localhost:8050/gold-prices/latest")
      .then((res) => {
        if (res.data) {
          setPrices(res.data);
        }
      })
      .catch((err) => console.error("❌ Failed to fetch latest price:", err));

    const waitForJQuery = setInterval(() => {
      if (window.$ && window.$.connection?.priceHub) {
        clearInterval(waitForJQuery);

        const priceHub = window.$.connection.priceHub;
        const parsePrice = (val) => parseFloat(val?.replace(/,/g, "")) || 0;

        priceHub.client.sendGoldPrice = function (
          gold99_buy,
          gold99_sell,
          old_gold99_buy,
          old_gold99_sell,
          gold96_buy,
          gold96_sell,
          old_gold96_buy,
          old_gold96_sell
        ) {
          const newPrices = {
            gold99_buy: parsePrice(gold99_buy),
            gold99_sell: parsePrice(gold99_sell),
            old_gold99_buy: parsePrice(old_gold99_buy),
            old_gold99_sell: parsePrice(old_gold99_sell),
            gold96_buy: parsePrice(gold96_buy),
            gold96_sell: parsePrice(gold96_sell),
            old_gold96_buy: parsePrice(old_gold96_buy),
            old_gold96_sell: parsePrice(old_gold96_sell),
          };
          setPrices(newPrices);

          if (newPrices.gold99_buy > 0 && newPrices.gold96_buy > 0) {
            axios
              .post("http://localhost:8050/gold-prices", newPrices)
              /* .then(() => console.log("✅ Gold price saved:", newPrices)) */
              .catch((err) => console.error("❌ Failed to save:", err));
          }
        };

        /* window.$.connection.hub.url = "https://uatg266.gcaponline.com/signalr"; */
        window.$.connection.hub.url = "https://g266.gcaponline.com/signalr";
        window.$.connection.hub
          .start()
          .done(() => {
            console.log("Connected to SignalR:", window.$.connection.hub.id);
          })
          .fail(() => {
            console.error("Failed to connect to SignalR");
          });

        window.$.connection.hub.disconnected(() => {
          console.warn("SignalR disconnected. Reconnecting in 2s...");
          setTimeout(() => {
            window.$.connection.hub
              .start()
              .done(() => {
                console.log(
                  "Reconnected to SignalR:",
                  window.$.connection.hub.id
                );
              })
              .fail(() => {
                console.error("Reconnection attempt failed.");
              });
          }, 2000);
        });
      }
    }, 500);

    return () => clearInterval(waitForJQuery);
  }, []);
  //----------------------------------------------------------------------------------------
  
  useEffect(() => {
    apiAdmin.put("/admin/open-market")
      .then(res => console.log(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      {/* ------------------------- Header ------------------------- */}
      <div className="bg-sky-900 h-[45px] text-white text-3xl p-2 justify-between grid grid-rows-2 grid-cols-2">
        <div><span className="text-yellow-400">GCAP</span> CONSIGNMENT BACKOFFICE</div>
        <div>
          <div className="text-sm mb-[6px] text-end">
            <span className="text-sky-200">Welcome,</span> {admin && admin}
            <button className="ml-4 bg-sky-700 px-2 rounded-md cursor-pointer" onClick={handleLogout}>Logout</button>
          </div>
          <div className="flex text-[19px] h-[30px] justify-end">
            <div className="bg-yellow-200 py-1 px-3 rounded-l flex">
              {renderPrice(prices.gold96_buy, prices.old_gold96_buy)}
            </div>
            <div className="bg-yellow-200 py-1 px-3 flex">
              {renderPrice(prices.gold96_sell, prices.old_gold96_sell)}
            </div>
            <div className="bg-sky-200 py-1 px-3 flex">
              {renderPrice(prices.gold99_buy, prices.old_gold99_buy)}
            </div>
            <div className="bg-sky-200 py-1 px-3 rounded-r flex">
              {renderPrice(prices.gold99_sell, prices.old_gold99_sell)}
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------- Tab ------------------------- */}
      <div className="tabs tabs-lift bg-sky-900 h-[96vh] pt-2">

        {/* ------------------------- Monitor ------------------------- */}
        <input
          type="radio"
          name="my_tabs_3"
          className={`tab hover:text-yellow-400 ${activeTab === "Monitor" ? "pointer-events-none" : ""} `}
          aria-label="Tickets Monitor"
          checked={activeTab === "Monitor"}
          onChange={() => handleTabChange("Monitor")}
        />
        <div className="tab-content bg-white border-base-300 p-6">
          <Monitor refetchKey={activeTab === "Monitor"} prices={prices} />
        </div>

        {/* ------------------------- Customer ------------------------- */}
{/*         
        <input
          type="radio"
          name="my_tabs_3"
          className={`tab hover:text-yellow-400 ${activeTab === "Customers" ? "pointer-events-none" : ""} `}
          aria-label="Customers"
          checked={activeTab === "Customers"}
          onChange={() => handleTabChange("Customers")}
        />
        <div className="tab-content bg-white border-base-300 p-6">
          <CustomerManager refetchKey={activeTab === "Customers"} prices={prices} />
        </div>
 */}
        {/* ------------------------- Manage ------------------------- */}
        <input
          type="radio"
          name="my_tabs_3"
          className={`tab hover:text-yellow-400 ${activeTab === "TicketManager" ? "pointer-events-none" : ""} `}
          aria-label="Tickets Manager"
          checked={activeTab === "TicketManager"}
          onChange={() => handleTabChange("TicketManager")}
        />
        <div className="tab-content bg-white border-base-300 p-6">
          <TicketManager refetchKey={activeTab === "TicketManager"} />
        </div>
{/* 
        <input
          type="radio"
          name="my_tabs_3"
          className={`tab hover:text-yellow-400 ${activeTab === "UserManager" ? "pointer-events-none" : ""} `}
          aria-label="Config"
          checked={activeTab === "UserManager"}
          onChange={() => handleTabChange("UserManager")}
        />
        <div className="tab-content bg-white border-base-300 p-6">
          <UserManager refetchKey={activeTab === "UserManager"} />
        </div>
         */}
      </div>
    </>
  );
}
