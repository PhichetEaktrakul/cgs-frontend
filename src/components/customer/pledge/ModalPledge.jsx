import { FormatNumber, FormatDateHyphen } from "../../../utility/function";

export default function ModalPledge({
  tempValue,
  postPledgeData,
  isLoading,
  selected,
}) {
  return (
    <>
      <dialog id="submit_modal" className="modal">
        <div className="modal-box">
          <p className="font-bold text-lg mb-2">ยืนยันการทำรายการ</p>

          <div>
            <div className="flex items-center gap-3 py-2">
              <span className="w-32 text-gray-700">จำนวนทองขายฝาก</span>
              <span className="bg-sky-100 px-2 py-1 rounded font-medium">
                {tempValue.weight}
              </span>
              <span>{selected == 1 ? "กิโล" : "บาท"}</span>
            </div>

            <div className="flex items-center gap-3 py-2">
              <span className="w-32 text-gray-700">ประเภททองคำ</span>
              <span className="bg-sky-100 px-2 py-1 rounded font-medium">
                {selected == 1 ? "99.99" : "96.50"}
              </span>
              <span>%</span>
            </div>

            <div className="flex items-center gap-3 py-2">
              <span className="w-32 text-gray-700">อัตราดอกเบี้ย</span>
              <span className="bg-sky-100 px-2 py-1 rounded font-medium">
                {FormatNumber(tempValue.interestRate)}
              </span>
              <span>%</span>
            </div>

            <div className="flex items-center gap-3 py-2">
              <span className="w-32 text-gray-700">วงเงิน</span>
              <span className="bg-sky-100 px-2 py-1 rounded font-medium">
                {FormatNumber(tempValue.loanPercent)}
              </span>
              <span>%</span>
            </div>

            <div className="flex items-center gap-3 py-2">
              <span className="w-32 text-gray-700">ยอดเงินที่ได้รับ</span>
              <span className="bg-sky-100 px-2 py-1 rounded font-medium">
                {FormatNumber(tempValue.loanAmount)}
              </span>
              <span>THB</span>
            </div>

            <div className="flex items-center gap-3 py-2">
              <span className="w-32 text-gray-700">ดอกเบี้ยต่องวด</span>
              <span className="bg-sky-100 px-2 py-1 rounded font-medium">
                {FormatNumber(tempValue.interestPay)}
              </span>
              <span>THB</span>
            </div>

            <div className="flex items-center gap-3 py-2">
              <span className="w-32 text-gray-700">ระยะเวลาสัญญา</span>
              <span className="bg-sky-100 px-2 py-1 rounded font-medium">
                {tempValue.numPay}
              </span>
              <span>เดือน</span>
            </div>

            <div className="flex items-center gap-3 py-2">
              <span className="w-32 text-gray-700">วันสิ้นสุดสัญญา</span>
              <span className="bg-sky-100 px-2 py-1 rounded font-medium">
                {FormatDateHyphen(tempValue.endDate)}
              </span>
            </div>
          </div>

          <hr className="my-2.5 text-gray-400" />

          <div>
            <p className="font-bold">ช่องทางการรับเงิน :</p>
            <div className="flex ">
              <input type="radio" className="mx-2" name="payment" id="" />
              <label htmlFor="payment" className="text-gray-700">
                บัญชีเงินสด ME GOLD
              </label>
            </div>
          </div>

          <div className="modal-action">
            <div>
              <button
                className="btn mr-2 bg-transparent border-[#2a53b3fc] text-[#2a53b3fc] rounded-full"
                onClick={() => document.getElementById("submit_modal").close()}>
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={postPledgeData}
                className="btn ml-2 px-5 bg-[#2a53b3fc] text-white rounded-full"
                disabled={isLoading === 1}>
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
