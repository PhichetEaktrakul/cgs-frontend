import { useState } from "react";
import {
  FormatDate,
  FormatDateFull,
  FormatNumber,
} from "../../../utility/function";
import { LuBadgeCheck, LuBadgeX } from "react-icons/lu";

export default function TicketExtend({ extendData, handleExtendUpdate }) {
  const columns = [
    "เลขที่คำร้อง",
    "เลขที่สัญญา",
    "รหัสลูกค้า",
    "วันเริ่มต้นสัญญา",
    "วันสิ้นสุดสัญญา(เก่า)",
    "วันสิ้นสุดสัญญา(ใหม่)",
    "ระยะเวลาขยาย(เดือน)",
    "ราคาอ้างอิง",
    "ประเภททอง",
    "อัตราดอกเบี้ย",
    "วงเงิน (%)",
    "เงินต้นใหม่",
    "รับเข้า",
    "จ่ายออก",
    "วันที่ทำรายการ",
  ];
  const tabs = [
    { key: "pending", label: "รออนุมัติ", statuses: ["pending"] },
    { key: "active", label: "อนุมัติ", statuses: ["active", "approve"] },
    { key: "reject", label: "ไม่อนุมัติ", statuses: ["reject"] },
  ];
  const [activeTab, setActiveTab] = useState(tabs[0].key);
  const activeTabConfig = tabs.find((t) => t.key === activeTab);
  const filteredData = extendData.filter((item) => activeTabConfig?.statuses.includes(item.status));
  const toSqlDate = (date) => new Date(date).toISOString().slice(0, 19);

  return (
    <>
      {/* ========== Card Title ========== */}
      <div className="flex items-center mb-4 mt-6">
        <div className="w-2 h-6 bg-sky-700 mr-3 rounded-sm" />
        <h2 className="text-2xl font-semibold text-gray-700">รายการต่ออายุสัญญา</h2>
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

      {/* ========== Table ========== */}
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
                  key={item.request_id}
                  className=
                  {`border-b border-gray-100 hover:bg-red-50 transition
                      ${item.gold_type === 1 ? "bg-blue-50" : item.gold_type === 2 ? "bg-yellow-50" : ""}
                  `}>
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    {item.request_id}
                  </td>
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    {item.pledge_id}
                  </td>
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    {item.customer_id}
                  </td>
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    {FormatDate(item.start_date)}
                  </td>
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    {FormatDate(item.old_end_date)}
                  </td>
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    {FormatDate(item.new_end_date)}
                  </td>
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    {item.extend}
                  </td>
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    {item.ref_price}
                  </td>
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    {item.gold_type}
                  </td>
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    {item.interest_rate}
                  </td>
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    {item.loan_percent}
                  </td>
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    {FormatNumber(item.new_loan_amount)}
                  </td>
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    {FormatNumber(item.payment_in)}
                  </td>
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    {FormatNumber(item.payment_out)}
                  </td>
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    {FormatDateFull(item.create_at)}
                  </td>

                  {activeTab === "pending" && (
                    <>
                      <td className="px-3 py-3 text-center whitespace-nowrap">
                        <button
                          className="flex text-2xl bg-white text-green-600 rounded-full cursor-pointer"
                          onClick={() =>
                            handleExtendUpdate({
                              pledgeId: item.pledge_id,
                              transactionId: item.transaction_id,
                              customerId: item.customer_id,
                              startDate: toSqlDate(item.start_date),
                              newEndDate: toSqlDate(item.new_end_date),
                              interestRate: item.interest_rate,
                              loanPercent: item.loan_percent,
                              newLoanAmount: item.new_loan_amount,
                              goldType: item.gold_type,
                              refPrice: item.ref_price,
                              weight: item.weight,
                              extend: item.extend,
                              method: "approve",
                            })
                          }>
                          <LuBadgeCheck />
                        </button>
                      </td>
                      <td className="px-3 py-3 text-center whitespace-nowrap">
                        <button
                          className="flex text-2xl bg-white text-red-600 rounded-full cursor-pointer"
                          onClick={() =>
                            handleExtendUpdate(
                              item.pledge_id,
                              "reject",
                              item.new_end_date,
                              item.extend,
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
                <td colSpan="15" className="text-center text-gray-400 py-2">ไม่มีรายการ</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
