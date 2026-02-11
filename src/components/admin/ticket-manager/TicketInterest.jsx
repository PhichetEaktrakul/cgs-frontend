import { useState } from "react";
import {
  FormatDate,
  FormatDateFull,
  FormatNumber,
} from "../../../utility/function";
import { LuBadgeCheck, LuBadgeX  } from "react-icons/lu";

export default function TicketInterest({ interestData, handleInterestUpdate }) {
  const columns = [
    "เลขที่ต่อดอก",
    "รหัสลูกค้า",
    "เลขที่สัญญา",
    "ต่อจาก",
    "อัตราดอกเบี้ย",
    "ดอกเบี้ย",
    "ตัดต้น",
    "ชำระรวม",
    "วันครบกำหนด",
    "วันที่ทำรายการ",
  ];

  const tabs = [
    { key: "pending", label: "รออนุมัติ", statuses: ["pending"] },
    { key: "paid", label: "อนุมัติ", statuses: ["active", "approve"] },
    { key: "reject", label: "ไม่อนุมัติ", statuses: ["reject"] },
  ];
  const [activeTab, setActiveTab] = useState(tabs[0].key);
  const activeTabConfig = tabs.find((t) => t.key === activeTab);
  const filteredData = interestData.filter((item) => activeTabConfig?.statuses.includes(item.status));

  return (
    <>
      {/* ========== Card Title ========== */}
      <div className="flex items-center mb-4 mt-6">
        <div className="w-2 h-6 bg-sky-700 mr-3 rounded-sm" />
        <h2 className="text-2xl font-semibold text-gray-700">รายการต่อดอก</h2>
      </div>

      {/* ========== Tabs ========== */}
      <div className="flex justify-center mt-2">
        <ul className="flex items-center gap-2 bg-gray-200 p-1 rounded-full text-[12px]">
          {tabs.map((tab) => (
            <li key={tab.key}>
              <button
                type="button"
                className=
                {`px-3 py-2 rounded-full transition-all duration-200
                  ${activeTab === tab.key ? "bg-sky-700 text-white shadow" : "text-gray-700 hover:bg-gray-300"}
                `}
                onClick={() => setActiveTab(tab.key)}>
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/*------------Table------------*/}
      <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-white z-10">
            <tr className="border-b border-gray-200">
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-xs uppercase tracking-wide text-center">
                  {col}
                </th>
              ))}
              <th />
              <th />
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr
                  key={item.interest_id}
                  className=
                  {`border-b border-gray-100 hover:bg-red-50 transition
                      ${item.gold_type === 1 ? "bg-blue-50" : item.gold_type === 2 ? "bg-yellow-50" : ""}
                  `}>
                  <td className="px-4 py-3 text-center whitespace-nowrap font-semibold">
                    {item.interest_id}
                  </td>
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    {item.customer_id}
                  </td>
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    {item.pledge_id}
                  </td>
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    {item.prev_interest_id}
                  </td>
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    {item.old_interest_rate}%
                  </td>
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    {FormatNumber(item.pay_interest)}
                  </td>
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    {FormatNumber(item.pay_loan)}
                  </td>
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    {FormatNumber(item.pay_interest + item.pay_loan)}
                  </td>
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    {FormatDate(item.due_date)}
                  </td>
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    {FormatDateFull(item.transaction_date)}
                  </td>

                  {activeTab === "pending" && (
                    <>
                      <td className="px-3 py-3 text-center whitespace-nowrap">
                        <button
                          className="flex text-2xl bg-white text-green-600 rounded-full cursor-pointer"
                          onClick={() =>
                            handleInterestUpdate(
                              item.interest_id,
                              item.transaction_id,
                              item.pledge_id,
                              item.due_date,
                              item.end_date,
                              item.pay_interest,
                              item.old_loan_amount - item.pay_loan,
                              item.old_interest_rate,
                              "approve",
                            )
                          }>
                          <LuBadgeCheck />
                        </button>
                      </td>
                      <td className="px-3 py-3 text-center whitespace-nowrap">
                        <button
                          className="flex text-2xl bg-white text-red-600 rounded-full cursor-pointer"
                          onClick={() =>
                            handleInterestUpdate(
                              item.interest_id,
                              item.transaction_id,
                              item.pledge_id,
                              item.due_date,
                              item.end_date,
                              item.pay_interest,
                              item.old_loan_amount - item.pay_loan,
                              item.old_interest_rate,
                              "reject",
                            )
                          }>
                          <LuBadgeX />
                        </button>
                      </td>
                    </>
                  )}

                  {activeTab !== "pending" && (
                    <>
                      <td></td>
                      <td></td>
                    </>
                  )}
                </tr>
              ))
            ) : (
                <tr>
                  <td colSpan="10" className="text-center text-gray-400 py-2">ไม่มีรายการ</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
      <hr className="text-gray-400 my-4" />    
    </>
  );
}
