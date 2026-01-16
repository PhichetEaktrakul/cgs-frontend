import {
  FormatNumber,
  FormatDate,
  FormatDateFull,
} from "../../../utility/function";
import { HiOutlineDocumentMinus } from "react-icons/hi2";

export default function InterestHistory({ filteredData }) {
  const status_badge = {
    pending: {
      label: "รออนุมัติ",
      className: "badge text-white text-[12px] bg-yellow-500",
    },
    paid: {
      label: "สำเร็จ",
      className: "badge text-white text-[12px] bg-[#17b686fc]",
    },
    reject: {
      label: "ไม่อนุมัติ",
      className: "badge text-white text-[12px] bg-red-400",
    },
  };

  return (
    <>
      <div className="h-[70vh] overflow-x-auto my-4">
        {filteredData.length ? (
          filteredData.map((item) => {
            const {
              transaction_id,
              interest_id,
              prev_interest_id,
              pledge_id,
              weight,
              gold_type,
              old_interest_rate,
              pay_interest,
              pay_loan,
              due_date,
              transaction_date,
              status,
            } = item;
            const totalPay = pay_interest + pay_loan;
            const goldUnit = gold_type === 1 ? "กิโล" : "บาท";
            const badge = status_badge[status];

            return (
              <div
                key={transaction_id}
                className="grid grid-cols-[20%_30%_20%_30%] gap-y-1 border border-[#17b686fc] rounded-2xl my-3 p-3 text-[12px]">
                <p className="col-span-2 font-bold">ต่อดอกเลขที่ : {interest_id}</p>

                <div className="col-span-2 flex justify-end">
                  {badge && (
                    <div className={badge.className}>{badge.label}</div>
                  )}
                </div>

                <span className="text-center pr-1">ต่อจาก</span>
                <span>: {prev_interest_id}</span>

                <span className="text-center pr-1">เลขที่สัญญา</span>
                <span>: {pledge_id}</span>

                <span className="text-center pr-1">น้ำหนัก</span>
                <span>: {weight} {goldUnit}</span>           

                <span className="text-center pr-1">อัตราดอกเบี้ย</span>
                <span>: {old_interest_rate}%</span>

                <span className="text-center pr-1">ดอกเบี้ย</span>
                <span>: {FormatNumber(pay_interest)}</span>

                <span className="text-center pr-1">ตัดต้น</span>
                <span>: {FormatNumber(pay_loan)}</span>

                <span className="text-center pr-1">ยอดชำระ</span>
                <span>: {FormatNumber(totalPay)}</span>

                <span className="text-center pr-1">งวดที่ชำระ</span>
                <span>: {FormatDate(due_date)}</span>

                <span className="text-center pr-1">วันที่ทำรายการ</span>
                <span className="col-span-3">: {FormatDateFull(transaction_date)}</span>
              </div>
            );
          })
        ) : (
          <div className="h-[60vh] py-8 text-slate-300 flex flex-col items-center justify-center">
            <HiOutlineDocumentMinus className="mb-2 text-8xl" />
            <p className="text-2xl">ไม่มีรายการ</p>
          </div>
        )}
      </div>
    </>
  );
}
