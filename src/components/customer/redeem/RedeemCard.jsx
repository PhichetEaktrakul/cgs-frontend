import {
  FormatDate,
  FormatNumber,
  GoldTypeText,
} from "../../../utility/function";
import { HiOutlineDocumentMinus } from "react-icons/hi2";

export default function RedeemCard({ redeemList, handleSelectRed }) {
  if (redeemList.length === 0) {
    return (
      <div className="h-[70vh] py-8 text-slate-300 flex flex-col items-center justify-center">
        <HiOutlineDocumentMinus className="mb-2 text-8xl" />
        <p className="text-2xl">ไม่มีรายการที่สามารถไถ่ถอนได้</p>
      </div>
    );
  }

  return (
    <>
      <div className="h-[79vh] overflow-auto mb-8">
        {redeemList.map((item) => (
          <div
            key={item.transaction_id}
            className="grid grid-cols-[40%_60%] gap-x-1 gap-y-1 border border-[#17b686fc] rounded-2xl my-3 p-3 text-md">
            <div className="text-end pr-1 font-bold">เลขที่สัญญา :</div>
            <div className="font-bold">{item.pledge_id}</div>

            <div className="text-end pr-1">ประเภททอง :</div>
            <div>{GoldTypeText(item.gold_type)}</div>

            <div className="text-end pr-1">น้ำหนัก :</div>
            <div>
              {item.weight} {item.gold_type == "1" ? "กิโล" : "บาท"}
            </div>

            <div className="text-end pr-1">ดอกเบี้ยที่ต้องชำระ :</div>
            <div>
              {item.remain_num_pay == 0 ? 0 : FormatNumber((item.remain_loan_amount * item.interest_rate) / 100)} THB
            </div>

            <div className="text-end pr-1">เงินต้นคงเหลือ :</div>
            <div>{FormatNumber(item.remain_loan_amount)} THB</div>

            <div className="text-end pr-1">วันเริ่มต้นสัญญา :</div>
            <div>{FormatDate(item.start_date)}</div>

            <div className="text-end pr-1">วันสิ้นสุดสัญญา :</div>
            <div>{FormatDate(item.end_date)}</div>

            <div className="col-span-2 text-end mt-2">
              <button
                type="button"
                className="cursor-pointer border border-transparent bg-[#17b686fc] text-white hover:border hover:border-[#17b686fc] hover:bg-white hover:text-[#1bd19afc] py-0.5 px-6 rounded-full text-[16px]"
                onClick={() => handleSelectRed(item)}>
                ไถ่ถอน
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
