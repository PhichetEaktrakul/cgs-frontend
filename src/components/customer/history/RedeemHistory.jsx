import { FormatNumber, FormatDateFull } from "../../../utility/function";
import { HiOutlineDocumentMinus } from "react-icons/hi2";

export default function RedeemHistory({ filteredData }) {
  const status_badge = {
    pending: {
      label: "รออนุมัติ",
      className: "badge text-white text-[12px] bg-yellow-500",
    },
    approve: {
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
              redeem_id,
              transaction_id,
              pledge_id,
              principal_paid,
              interest_paid,
              total_paid,
              transaction_date,
              status,
            } = item;
            const badge = status_badge[status];

            return (
              <div
                key={transaction_id}
                className="grid grid-cols-[20%_30%_20%_30%] gap-y-1 border border-[#17b686fc] rounded-2xl my-3 p-3 text-[12px]">
                <p className="col-span-2 font-bold">ไถ่ถอนเลขที่ : {redeem_id}</p>

                <div className="col-span-2 flex justify-end">
                  {badge && (
                    <div className={badge.className}>{badge.label}</div>
                  )}
                </div>

                <span className="text-center pr-1">เลขที่สัญญา</span>
                <span>: {pledge_id}</span>

                <span className="text-center pr-1">จ่ายเงินต้น</span>
                <span>: {FormatNumber(principal_paid)}</span>

                <span className="text-center pr-1">จ่ายดอกเบี้ย</span>
                <span>: {FormatNumber(interest_paid)}</span>

                <span className="text-center pr-1">ยอดรวม</span>
                <span>: {FormatNumber(total_paid)}</span>

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
