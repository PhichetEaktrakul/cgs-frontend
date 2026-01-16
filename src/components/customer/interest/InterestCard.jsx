import { FormatDate, FormatNumber, CalRemainDays } from "../../../utility/function";
import { HiOutlineDocumentMinus } from "react-icons/hi2";

export default function InterestCard({ intList, handleSelectInt }) {
  //----------------------------------------------------------------------------------------
  // Render Remaining Badge
  const RemainingDaysBadge = ({ dueDate }) => {
    const days = CalRemainDays(dueDate);

    let text, color;
    if (days < 0) {
      text = "เลยกำหนด";
      color = "bg-gray-500";
    } else if (days <= 7) {
      text = `${days} วัน`;
      color = "bg-red-400";
    } else {
      text = `${days} วัน`;
      color = "bg-cyan-500";
    }
    return <div className={`badge text-white rounded-full ${color}`}>{text}</div>;
  };
  //----------------------------------------------------------------------------------------

  if (intList.length === 0) {
    return (
      <div className="h-[70vh] py-8 text-slate-300 flex flex-col items-center justify-center">
        <HiOutlineDocumentMinus className="mb-2 text-8xl" />
        <p className="text-2xl">ไม่มีรายการที่สามารถต่อดอกได้</p>
      </div>
    );
  }

  return (
    <>
      <div className="h-[79vh] overflow-auto mb-8">
        {intList.map((item) => (
          <div
            key={item.interest_id}
            className="grid grid-cols-3 gap-x-1 gap-y-1 border border-[#17b686fc] rounded-2xl my-3 p-3 text-md">
            <div className="text-end pr-1 font-bold">เลขที่สัญญา :</div>
            <div className="font-bold">{item.pledge_id}</div>
            <div className="text-end">
              <RemainingDaysBadge dueDate={item.due_date} />
            </div>

            <div className="text-end pr-1">เลขที่ต่อดอก :</div>
            <div className="col-span-2">{item.interest_id}</div>

            <div className="text-end pr-1">น้ำหนัก :</div>
            <div className="col-span-2">
              {item.weight} {item.gold_type == "1" ? "กิโล" : "บาท"}
            </div>

            <div className="text-end pr-1">ดอกเบี้ยชำระ :</div>
            <div className="col-span-2">
              {FormatNumber(
                (item.old_loan_amount * item.old_interest_rate) / 100
              )}{" "}THB
            </div>

            <div className="text-end pr-1">ครบกำหนดชำระ :</div>
            <div className="col-span-2">
              {FormatDate(item.due_date)}
            </div>

            <div className="text-end pr-1">วันสิ้นสุดสัญญา :</div>
            <div className="col-span-2">
              {FormatDate(item.end_date)}
            </div>

            <div className="col-span-3 text-end mt-2">
              <button
                type="button"
                className="cursor-pointer border border-transparent bg-[#17b686fc] text-white hover:border hover:border-[#17b686fc] hover:bg-white hover:text-[#1bd19afc] py-0.5 px-6 rounded-full text-[16px]"
                onClick={() => handleSelectInt(item)}>
                ต่อดอก
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
