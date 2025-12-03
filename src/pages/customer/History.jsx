import { useState, useEffect } from "react";
import { apiCust } from "../../api/axiosInstance";
import Header from "../../components/customer/Header";
import ConsignmentHistory from "../../components/customer/consignment/ConsignmentHistory";
import InterestHistory from "../../components/customer/interest/InterestHistory";
import RedeemHistory from "../../components/customer/redeem/RedeemHistory";

export default function History() {
  const customerId = localStorage.getItem("customerId");
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedType, setSelectedType] = useState("ขายฝาก");
  const tabs1 = [
    { key: "pending", label: "รออนุมัติ" },
    { key: "active", label: "สำเร็จ" },
    { key: "reject", label: "ไม่สำเร็จ" },
    { key: "redeem", label: "ไถ่ถอน" },
    { key: "expire", label: "เกินกำหนด" },
  ];
  const tabs2 = [
    { key: "pending", label: "รออนุมัติ" },
    { key: "paid", label: "สำเร็จ" },
    { key: "reject", label: "ไม่สำเร็จ" },
  ];
  const tabs3 = [
    { key: "pending", label: "รออนุมัติ" },
    { key: "approve", label: "สำเร็จ" },
    { key: "reject", label: "ไม่สำเร็จ" },
  ];

  // Load default History data
  useEffect(() => {
    fetchConsign(customerId);
  }, [customerId]);

  //----------------------------------------------------------------------------------------
  // Create new consignment
  const fetchConsign = async (customerId) => {
    try {
      const { data } = await apiCust.get(`/pledge/history/${customerId}`);
      setHistory(data);
    } catch (err) {
      console.log(err.response?.data || "Failed to fetch consignment history.");
    }
  };

  const fetchInterest = async (customerId) => {
    try {
      const { data } = await apiCust.get(`/interest/history/${customerId}`);
      setHistory(data);
    } catch (err) {
      console.log(err.response?.data || "Failed to fetch Interest history.");
    }
  };

  const fetchRedeem = async (customerId) => {
    try {
      const { data } = await apiCust.get(`/redeem/history/${customerId}`);
      setHistory(data);
    } catch (err) {
      console.log(err.response?.data || "Failed to fetch Redeem history.");
    }
  };
  //----------------------------------------------------------------------------------------

  //----------------------------------------------------------------------------------------
  // Handle type change
  const handleTypeChange = (value) => {
    setSelectedType(value);
    setHistory([]);
    setActiveTab("pending");

    if (value === "ขายฝาก") fetchConsign(customerId);
    if (value === "ต่อดอก") fetchInterest(customerId);
    if (value === "ไถ่ถอน") fetchRedeem(customerId);
  };
  //----------------------------------------------------------------------------------------

  const filteredData = history.filter((item) => item.status === activeTab);

  return (
    <Header
      bottom={
        <>
          <p className="text-center text-2xl">ตรวจสอบสถานะ/ประวัติ</p>
          {/* ---------------------- Type Selector ---------------------- */}
          <div className="flex items-center gap-2 mt-5">
            <p>ดูรายการ</p>
            <select
              value={selectedType}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="select select-sm bg-yellow-50">
              <option>ขายฝาก</option>
              <option>ต่อดอก</option>
              <option>ไถ่ถอน</option>
            </select>
          </div>

          <hr className="text-gray-400 my-5" />

          {/* ---------------------- Tabs ---------------------- */}
          <div className="flex justify-center mt-2">
            <ul className="menu menu-horizontal bg-base-200 p-0 rounded-md border border-[#dabe96] text-[12px]">
              {(selectedType === "ขายฝาก" ? tabs1
                : selectedType === "ต่อดอก" ? tabs2
                : tabs3
              ).map((tab) => (
                <li key={tab.key}>
                  <a
                    className={activeTab === tab.key ? "bg-[#dabe96]" : ""}
                    onClick={() => setActiveTab(tab.key)}>
                    {tab.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ---------------------- Consignment ---------------------- */}
          {selectedType === "ขายฝาก" && (
            <ConsignmentHistory filteredData={filteredData} />
          )}

          {/* ---------------------- Interest ---------------------- */}
          {selectedType === "ต่อดอก" && (
            <InterestHistory filteredData={filteredData} />
          )}

          {/* ---------------------- Redeem ---------------------- */}
          {selectedType === "ไถ่ถอน" && (
            <RedeemHistory filteredData={filteredData} />
          )}
        </>
      }
    />
  );
}
