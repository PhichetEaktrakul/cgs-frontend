import { FormatNumber } from "../../../utility/function";

export default function ModalInterest({
  selectedData,
  isReduce,
  setIsReduce,
  tempValue,
  setTempValue,
  handleSubmit,
  error,
}) {
  //----------------------------------------------------------------------------------------
  // Close Modal
  const handleClose = () => {
    document.getElementById("interest_modal").close();
  };
  //----------------------------------------------------------------------------------------

  //----------------------------------------------------------------------------------------
  // Handle Loan Change
  const handleLoanChange = (e) => {
    setTempValue((prev) => ({
      ...prev,
      pay_loan: Number(e.target.value),
    }));
  };
  //----------------------------------------------------------------------------------------

  //----------------------------------------------------------------------------------------
  // Calculate Total Pay Amount
  const intPay =
    ((selectedData?.old_loan_amount || 0) *
      (selectedData?.old_interest_rate || 0)) /
    100;
  const totalPay = intPay + (tempValue?.pay_loan || 0);
  //----------------------------------------------------------------------------------------

  return (
    <>
      <dialog id="interest_modal" className="modal">
        <div className="modal-box">
          <form onSubmit={handleSubmit}>
            <p className="font-bold text-lg mb-2">
              เลขที่สัญญา : {selectedData?.pledge_id}
            </p>
            <div>
              <div className="flex justify-between">
                <p>รายการต่อดอกเลขที่ : {selectedData?.interest_id}</p>
                <p>
                  ต่อจาก :{" "}
                  {selectedData?.prev_interest_id
                    ? selectedData?.prev_interest_id
                    : "-"}
                </p>
              </div>

              <hr className="my-2.5 text-gray-400" />

              <p>
                น้ำหนัก : {selectedData?.weight}{" "}
                {selectedData?.gold_type == "1" ? "กิโล" : "บาท"}
              </p>

              <div className="my-2">
                <input
                  type="checkbox"
                  className="mx-2"
                  checked={isReduce}
                  onChange={(e) => setIsReduce(e.target.checked)}
                />
                <span>ตัดต้น</span>
              </div>

              {isReduce ? (
                <div className="bg-amber-50 px-2 rounded-xl grid grid-cols-[40%_30%_30%] leading-9">
                  <p>เงินต้นสัญญา : </p>
                  <p className="text-center">
                    {FormatNumber(selectedData?.old_loan_amount)}
                  </p>
                  <p className="text-center">THB</p>

                  <p>ตัดต้นจำนวน : </p>
                  <input
                    type="number"
                    placeholder="0"
                    className={`bg-white rounded w-[90%] text-end ${
                      error ? "border-red-600 border" : ""
                    }`}
                    onChange={handleLoanChange}
                  />
                  <p className="text-center">THB</p>

                  {error === "errNumber" && (
                    <p className="text-red-600 col-span-3 text-center">
                      กรุณากรอกจำนวนให้ถูกต้อง
                    </p>
                  )}
                  {error === "errRedeem" && (
                    <p className="text-red-600 col-span-3 text-center">
                      ไม่สามารถตัดต้นจนหมดได้
                    </p>
                  )}

                  <p>เงินต้นคงเหลือ : </p>
                  <p className="text-center">
                    {FormatNumber(
                      selectedData?.old_loan_amount - tempValue?.pay_loan
                    )}
                  </p>
                  <p className="text-center">THB</p>
                </div>
              ) : (
                <></>
              )}

              <div className="grid grid-cols-[30%_50%_20%] gap-2 p-2 mt-4">
                <p>ชำระดอกเบี้ย :</p>
                <p className="bg-sky-100 mx-3 px-2 py-1 rounded">
                  {FormatNumber(intPay)}
                </p>
                <p>THB</p>

                <p>ตัดต้น :</p>
                <p className="bg-sky-100 mx-3 px-2 py-1 rounded">
                  {FormatNumber(tempValue?.pay_loan || 0)}
                </p>
                <p>THB</p>

                <p>ยอดรวม :</p>
                <p className="bg-sky-100 mx-3 px-2 py-1 rounded">
                  {FormatNumber(totalPay)}
                </p>
                <p>THB</p>
              </div>
            </div>

            <hr className="my-2.5 text-gray-400" />

            <div>
              <p className="font-bold">ช่องทางการชำระเงิน :</p>
              <div className="flex">
                <input type="radio" className="mx-2" name="payment" id="" />
                <label htmlFor="payment">บัญชีเงินสด ME GOLD</label>
              </div>
            </div>

            <div className="modal-action">
              <div>
                <button
                  type="button"
                  className="btn mr-2 bg-transparent border-[#2a53b3fc] text-[#2a53b3fc] rounded-full"
                  onClick={handleClose}>
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="btn ml-2 bg-[#2a53b3fc] text-white rounded-full">
                  ยืนยัน
                </button>
              </div>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}
