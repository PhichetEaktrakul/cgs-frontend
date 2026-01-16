import {
  FormatDate,
  FormatDateFull,
  FormatNumber,
  GoldTypeText,
} from "../../../utility/function";
import { HiOutlineDocumentMinus } from "react-icons/hi2";

export default function PledgeHistory({ filteredData }) {
  const status_badge = {
    pending: {
      label: "รออนุมัติ",
      className: "badge text-white text-[12px] bg-yellow-500",
    },
    active: {
      label: "สำเร็จ",
      className: "badge text-white text-[12px] bg-[#17b686fc]",
    },
    reject: {
      label: "ไม่อนุมัติ",
      className: "badge text-white text-[12px] bg-red-400",
    },
    redeem: {
      label: "ไถ่ถอน",
      className: "badge text-white text-[12px] bg-gray-500",
    },
    redeempay: {
      label: "สำเร็จ",
      className: "badge text-white text-[12px] bg-[#17b686fc]",
    },
    expire: {
      label: "เกินกำหนด",
      className: "badge text-white text-[12px] bg-gray-500",
    },
    extend: {
      label: "ขยายสัญญา",
      className: "badge text-white text-[12px] bg-cyan-500",
    },
  };

  return (
    <>
      <div className="h-[70vh] overflow-x-auto my-4">
        {filteredData.length ? (
          filteredData.map((item) => {
            const {
              pledge_id,
              gold_type,
              weight,
              loan_percent,
              loan_amount,
              ref_price,
              interest_rate,
              start_date,
              end_date,
              transaction_id,
              transaction_date,
              status,
            } = item;            
            const goldUnit = gold_type === 1 ? "กิโล" : "บาท";
            const badge = status_badge[status];

            return (
              <div
                key={transaction_id}
                className="grid grid-cols-[30%_20%_25%_25%] gap-y-1 border border-[#17b686fc] rounded-2xl my-3 p-3 text-[12px]">
                <p className="col-span-2 font-bold">เลขที่สัญญา : {pledge_id}</p>

                <div className="col-span-2 flex justify-end">
                  {badge && (
                    <div className={badge.className}>{badge.label}</div>
                  )}
                </div>

                <span className="text-center pr-1">ประเภททอง</span>
                <span>: {GoldTypeText(gold_type)}</span>

                <span className="text-center pr-1">น้ำหนัก</span>
                <span>: {weight} {goldUnit}</span>

                <span className="text-center pr-1">วงเงิน (%)</span>
                <span>
                  :{" "}
                  {loan_percent != null
                    ? `${Number(loan_percent).toFixed(2)}%`
                    : "-"}
                </span>

                <span className="text-center pr-1">วงเงินสัญญา</span>
                <span>: {FormatNumber(loan_amount)}</span>

                <span className="text-center pr-1">ราคาอ้างอิง</span>
                <span>: {ref_price?.toLocaleString()}</span>

                <span className="text-center pr-1">อัตราดอกเบี้ย</span>
                <span>: {interest_rate}%</span>

                <span className="text-center pr-1">วันเริ่มต้นสัญญา</span>
                <span>: {FormatDate(start_date)}</span>

                <span className="text-center pr-1">วันสิ้นสุดสัญญา</span>
                <span>: {FormatDate(end_date)}</span>

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
