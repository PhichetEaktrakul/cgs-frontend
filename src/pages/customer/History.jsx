import { useState, useEffect } from "react";
import { apiCust } from "../../api/axiosInstance";
import { useLocation } from "react-router";
import Header from "../../components/customer/Header";
import PledgeHistory from "../../components/customer/history/PledgeHistory";
import InterestHistory from "../../components/customer/history/InterestHistory";
import RedeemHistory from "../../components/customer/history/RedeemHistory";

export default function History() {
  const location = useLocation();
  const navigateState = location.state?.type;
  const customerId = localStorage.getItem("customerId");
  const [selectedType, setSelectedType] = useState("ขายฝาก");
  const [filteredData, setFilteredData] = useState([]);

  //----------------------------------------------------------------------------------------
  // Fetch history data
  const fetchPledge = async (customerId) => {
    try {
      const { data } = await apiCust.get(`/api/pledge/history/${customerId}`);
      setFilteredData(data);
    } catch (err) {
      console.log(err.response?.data || "Failed to fetch Pledge history.");
    }
  };

  const fetchInterest = async (customerId) => {
    try {
      const { data } = await apiCust.get(`/api/interest/history/${customerId}`);
      setFilteredData(data);
    } catch (err) {
      console.log(err.response?.data || "Failed to fetch Interest history.");
    }
  };

  const fetchRedeem = async (customerId) => {
    try {
      const { data } = await apiCust.get(`/api/redeem/history/${customerId}`);
      setFilteredData(data);
    } catch (err) {
      console.log(err.response?.data || "Failed to fetch Redeem history.");
    }
  };
  //----------------------------------------------------------------------------------------

  //----------------------------------------------------------------------------------------
  // Handle menu change
  const loadByType = (type) => {
    setSelectedType(type);
    setFilteredData([]);

    if (type === "ขายฝาก") fetchPledge(customerId);
    if (type === "ต่อดอก") fetchInterest(customerId);
    if (type === "ไถ่ถอน") fetchRedeem(customerId);
  };
  //----------------------------------------------------------------------------------------
  
  //----------------------------------------------------------------------------------------
  // Load initial history data
  useEffect(() => {
    loadByType(navigateState || "ขายฝาก");
  }, [customerId, navigateState]);
  //----------------------------------------------------------------------------------------

  const menuTabs = [
    { key: "ขายฝาก", label: "ขายฝาก" },
    { key: "ต่อดอก", label: "ต่อดอก" },
    { key: "ไถ่ถอน", label: "ไถ่ถอน" },
  ];

  return (
    <Header
      bottom={
        <>
          <p className="text-center text-2xl">ตรวจสอบประวัติรายการ</p>
          <div className="flex justify-center mt-2">
            <ul className="flex items-center gap-2 bg-gray-200 p-1.5 rounded-full text-[12px]">
              {menuTabs.map((tab) => (
                <li key={tab.key}>
                  <button
                    type="button"
                    className={
                      selectedType === tab.key
                        ? "bg-[#2a53b3fc] text-white px-3 py-1.5 rounded-full"
                        : "text-gray-700 px-3 py-1 rounded-full"
                    }
                    onClick={() => loadByType(tab.key)}
                  >
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* ---------------------- Pledge List ------------------------ */}
          {selectedType === "ขายฝาก" && (
            <PledgeHistory filteredData={filteredData} />
          )} 

          {/* ---------------------- Interest List ---------------------- */}
          {selectedType === "ต่อดอก" && (
            <InterestHistory filteredData={filteredData} />
          )}

          {/* ---------------------- Redeem List ------------------------ */}
          {selectedType === "ไถ่ถอน" && (
            <RedeemHistory filteredData={filteredData} />
          )} 
        </>
      }
    />
  );
}
