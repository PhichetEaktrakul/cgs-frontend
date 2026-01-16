import {
  FormatDate,
  FormatDateFull,
  FormatNumber,
} from "../../../utility/function";
import { useState } from "react";
export default function TicketExtend({ extendData, handleExtendUpdate }) {
  const [activeTab, setActiveTab] = useState("pending");
  const column = [
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
  const filteredData = extendData.filter((item) => item.status === activeTab);
  const toSqlDate = (date) => new Date(date).toISOString().slice(0, 19);
  return (
    <>
      <fieldset className="fieldset w-[1300px] border border-sky-900 shadow-md p-3 rounded-md row-span-1 mt-3">
        <legend className="fieldset-legend text-2xl text-sky-900">
          รายการต่ออายุสัญญา
        </legend>

        {/*------------Tabs------------*/}
        <div className="flex justify-center mt-2">
          <ul className="menu menu-horizontal bg-base-200 p-0 rounded-md border border-sky-700">
            <li>
              <a
                className={
                  activeTab === "pending" ? "bg-sky-700 text-white" : ""
                }
                onClick={() => setActiveTab("pending")}>
                รออนุมัติ
              </a>
            </li>
            <li>
              <a
                className={
                  activeTab === "approve" ? "bg-sky-700 text-white" : ""
                }
                onClick={() => setActiveTab("approve")}>
                อนุมัติ
              </a>
            </li>
            <li>
              <a
                className={
                  activeTab === "reject" ? "bg-sky-700 text-white" : ""
                }
                onClick={() => setActiveTab("reject")}>
                ไม่อนุมัติ
              </a>
            </li>
          </ul>
        </div>

        {/*------------Table------------*/}
        <div className="mt-4">
          <table className="table w-full text-center">
            <thead>
              <tr className="bg-sky-700 text-white">
                {column.map((col) => (
                  <th key={col}>{col}</th>
                ))}
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.request_id}>
                    <td>{item.request_id}</td>
                    <td>{item.pledge_id}</td>
                    <td>{item.customer_id}</td>
                    <td>{FormatDate(item.start_date)}</td>
                    <td>{FormatDate(item.old_end_date)}</td>
                    <td>{FormatDate(item.new_end_date)}</td>
                    <td>{item.extend}</td>
                    <td>{item.ref_price}</td>
                    <td>{item.gold_type}</td>
                    <td>{item.interest_rate}</td>
                    <td>{item.loan_percent}</td>
                    <td>{FormatNumber(item.new_loan_amount)}</td>
                    <td>{FormatNumber(item.payment_in)}</td>
                    <td>{FormatNumber(item.payment_out)}</td>
                    <td>{FormatDateFull(item.create_at)}</td>

                    {activeTab === "pending" && (
                      <>
                        <td>
                          <button
                            className="bg-green-600 text-white w-[50px] p-1 rounded-lg cursor-pointer"
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
                            อนุมัติ
                          </button>
                        </td>
                        <td>
                          <button
                            className="bg-red-600 text-white w-[60px] p-1  rounded-lg cursor-pointer"
                            onClick={() =>
                              handleExtendUpdate(
                                item.pledge_id,
                                "reject",
                                item.new_end_date,
                                item.extend
                              )
                            }>
                            ไม่อนุมัติ
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
                  <td colSpan="9" className="text-center">
                    ไม่มีรายการ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </fieldset>
    </>
  );
}
