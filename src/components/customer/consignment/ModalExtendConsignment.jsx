import { useEffect, useState } from "react";
import { apiCust } from "../../../api/axiosInstance";
import { FormatDate } from "../../../utility/function";

export default function ModalExtendConsignment({
  selectedData,
  handleConfirmExtend,
}) {
  const [tempValue, setTempValue] = useState({
    loanAmount: 0,
    loanDiff: 0,
    remainLoan: 0,
    goldPrice: 0,
    loanPercent: 0,
    intRate: 0,
    numPay: 0,
  });

  // ------------------ Helper: Add months in Thai format ------------------
  const addMonthsThai = (thaiDate, months) => {
    if (!thaiDate) return "-";
    const [d, m, y] = thaiDate.split("/");
    const year = 2000 + parseInt(y) - 543; // BE → CE
    const date = new Date(year, m - 1, d);
    date.setMonth(date.getMonth() + months);
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yy = String((date.getFullYear() + 543) % 100).padStart(2, "0");
    return `${dd}/${mm}/${yy}`;
  };

  // ------------------ Fetch Data & Calculate Values ------------------
  useEffect(() => {
    if (!selectedData) return;

    const fetchData = async () => {
      try {
        const [summaryRes, initialRes] = await Promise.all([
          apiCust.get(`interest/summary/${selectedData.pledge_id}`),
          apiCust.get(`customer/initial/${selectedData.customer_id}`),
        ]);

        const remainLoan = summaryRes.data.remain_loan_amount;
        const loanPercent = initialRes.data.loan_percent;

        // Fetch gold price
        const goldApi =
          selectedData.gold_type === 1
            ? "http://localhost:8050/gold-prices/latest"
            : "http://localhost:8050/gold-assn/latest";

        const goldResponse = await apiCust.get(goldApi);
        const goldPrice = Number(
          (selectedData.gold_type === 1
            ? goldResponse.data.gold99_sell
            : goldResponse.data.sellPrice
          ).replace(/,/g, "")
        );

        const newLoanAmount =
          selectedData.gold_type === 1
            ? (selectedData.weight * 65.6 * goldPrice * loanPercent) / 100
            : (selectedData.weight * goldPrice * loanPercent) / 100;

        const loanDiff = newLoanAmount - remainLoan;

        setTempValue({
          loanAmount: Math.round(newLoanAmount),
          loanDiff: Math.round(loanDiff ? loanDiff : 0),
          remainLoan,
          goldPrice,
          loanPercent,
          intRate: initialRes.data.interest_rate,
          numPay: initialRes.data.num_pay,
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [selectedData]);

  // ------------------ Render ------------------
  if (!selectedData) return null;

  const startDateFormatted = FormatDate(selectedData.start_date);
  const endDateFormatted = addMonthsThai(startDateFormatted, tempValue.numPay);

  return (
    <dialog id="extend_modal" className="modal">
      <div className="modal-box">
        <p className="font-bold text-xl mb-2.5">ทำรายการต่อสัญญา</p>

        <div className="px-2 py-3 rounded-xl grid grid-cols-[40%_30%_30%] gap-y-2">
          <p>สัญญาเลขที่ :</p>
          <p>{selectedData.pledge_id}</p>
          <p></p>

          <p>น้ำหนักทอง :</p>
          <p>{selectedData.weight}</p>
          <p>{selectedData.gold_type === 1 ? "กิโล" : "บาท"}</p>

          <p>ประเภททอง :</p>
          <p>{selectedData.gold_type === 1 ? "99.99%" : "96.50%"}</p>
          <p></p>

          <p>เงินต้นสัญญา :</p>
          <p>{selectedData.loan_amount.toLocaleString()}</p>
          <p>บาท</p>

          <p>ตัดเงินต้นไปแล้ว :</p>
          <p>
            {(selectedData.loan_amount - tempValue.remainLoan).toLocaleString()}
          </p>
          <p>บาท</p>

          <p>เงินต้นคงเหลือ :</p>
          <p>
            <span className="bg-emerald-100 px-2 py-1 rounded">
              {tempValue.remainLoan.toLocaleString()}
            </span>
          </p>
          <p>บาท</p>

          <hr className="col-span-3 my-2.5" />

          <p>ราคาทองปัจจุบัน :</p>
          <p>{tempValue.goldPrice.toLocaleString()}</p>
          <p>บาท</p>

          <p>อัตราดอกเบี้ย :</p>
          <p>{tempValue.intRate}</p>
          <p></p>

          <p>วงเงินที่ได้ :</p>
          <p>{tempValue.loanPercent}%</p>
          <p></p>

          <p>ยอดเงินต้น (ใหม่) :</p>
          <p>
            <span className="bg-amber-100 px-2 py-1 rounded">
              {tempValue.loanAmount.toLocaleString()}
            </span>
          </p>
          <p>บาท</p>

          <p>วันเริ่มต้นสัญญา :</p>
          <p className="col-span-2">{startDateFormatted}</p>

          <p>สิ้นสุดสัญญา (ใหม่) :</p>
          <p className="col-span-2">{endDateFormatted}</p>

          <p>
            {tempValue.loanDiff > 0
              ? "ลูกค้าต้องชำระเพิ่ม"
              : "ลูกค้าได้รับเงินเพิ่ม"}
          </p>
          <p>
            <span className="bg-amber-100 px-2 py-1 rounded">
              {Math.abs(tempValue.loanDiff).toLocaleString()}
            </span>
          </p>
          <p>บาท</p>
        </div>

        <div className="modal-action">
          <form method="dialog">
            <button className="btn mr-2 bg-transparent border-[#2a53b3fc] text-[#2a53b3fc]">
              ยกเลิก
            </button>
            <button
              type="button"
              onClick={() => {
                const payload = {
                  pledgeId: selectedData.pledge_id,
                  customerId: selectedData.customer_id,
                  startDate: selectedData.start_date, // format YYYY-MM-DD
                  oldEndDate: selectedData.end_date, // current contract end date
                  extend: tempValue.numPay, // months to extend
                  interestRate: tempValue.intRate,
                  loanPercent: tempValue.loanPercent,
                  paymentIn: tempValue.loanDiff > 0 ? tempValue.loanDiff : 0,
                  paymentOut: tempValue.loanDiff < 0 ? tempValue.loanDiff : 0,
                  goldType: selectedData.gold_type,
                  refPrice: tempValue.goldPrice,
                  weight: selectedData.weight,
                  newLoanAmount: tempValue.loanAmount,
                };

                handleConfirmExtend(payload);
              }}
              className="btn ml-2 bg-[#2a53b3fc] text-white">
              ยืนยัน
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
