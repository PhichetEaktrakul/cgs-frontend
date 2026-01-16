import { useState, useEffect } from "react";
import { CgNotes } from "react-icons/cg";
import { FaPen, FaCheck, FaTimes } from "react-icons/fa";
import { apiAdmin } from "../../../api/axiosInstance";
import CustomerTable from "./CustomerTable";
import toast from "react-hot-toast";

export default function CustomerProfile({ selected ,prices}) {
  const [rates, setRates] = useState({
    loanPercentOrig: 0,
    interestRateOrig: 0,
    loanPercentEdit: 0,
    interestRateEdit: 0,
  });
  const [editing, setEditing] = useState({
    loanPercent: false,
    interestRate: false,
  });

  //----------------------------------------------------------------------------------------
  //  Load selected customer Meta
  useEffect(() => {
    if (selected) {
      const loanP = selected.loan_percent;
      const intR = selected.interest_rate;

      setRates({
        loanPercentOrig: loanP,
        interestRateOrig: intR,
        loanPercentEdit: loanP,
        interestRateEdit: intR,
      });

      setEditing({ loanPercent: false, interestRate: false });
    }
  }, [selected]);
  //----------------------------------------------------------------------------------------

  //----------------------------------------------------------------------------------------
  //  Handle save customer Meta
  const handleSave = async () => {
    const loan = Number(rates.loanPercentEdit);
    const interest = Number(rates.interestRateEdit);

    if (!loan || !interest || loan <= 0 || interest <= 0) {
      return toast.error("กรุณากรอกตัวเลขให้ถูกต้อง");
    }

    try {
      const body = {
        customerId: selected.customer_id,
        loanPercent: rates.loanPercentEdit,
        interestRate: rates.interestRateEdit,
      };
      await apiAdmin.put("/api/customer/initial", body);
      toast.success("เเก้ไขข้อมูลสำเร็จ");

      // update originals
      setRates((prev) => ({
        ...prev,
        loanPercentOrig: prev.loanPercentEdit,
        interestRateOrig: prev.interestRateEdit,
      }));
      setEditing({ loanPercent: false, interestRate: false });
    } catch (err) {
      console.error(err);
      toast.error("เเก้ไขข้อมูลล้มเหลว");
    }
  };
  //----------------------------------------------------------------------------------------

  //----------------------------------------------------------------------------------------
  //  Cancel loan percent edit
  const handleCancelLoan = () => {
    setRates((prev) => ({
      ...prev,
      loanPercentEdit: prev.loanPercentOrig,
    }));
    setEditing((prev) => ({ ...prev, loanPercent: false }));
  };
  //----------------------------------------------------------------------------------------

  //----------------------------------------------------------------------------------------
  //  Cancel interest rate edit
  const handleCancelInterest = () => {
    setRates((prev) => ({
      ...prev,
      interestRateEdit: prev.interestRateOrig,
    }));
    setEditing((prev) => ({ ...prev, interestRate: false }));
  };
  //----------------------------------------------------------------------------------------

  return (
    <>
      <fieldset className="fieldset border border-sky-900 shadow-md p-3 rounded-md row-span-2">
        <legend className="fieldset-legend text-2xl text-sky-900">ข้อมูลลูกค้า</legend>

        {selected ? (
          <div className="w-full">
            <div className="grid grid-cols-3 gap-x-4 gap-y-2 text-[14px] w-[900px]">
              <p>
                <strong>รหัส : </strong> {selected.customer_id}
              </p>
              <p>
                <strong>ชื่อ : </strong> {selected.first_name}{" "}
                {selected.last_name}
              </p>
              <p>
                <strong>เบอร์ : </strong> {selected.phone_number}
              </p>
              <p>
                <strong>เลขที่บัตรประชาชน : </strong> {selected.id_card_number}
              </p>
              <div className="flex items-center gap-2">
                <strong>วงเงิน : </strong>
                {editing.loanPercent ? (
                  <>
                    <input
                      type="number"
                      step="0.01"
                      className="input input-bordered w-20 h-8 bg-yellow-50 border-sky-700"
                      value={rates.loanPercentEdit}
                      onChange={(e) =>
                        setRates((prev) => ({
                          ...prev,
                          loanPercentEdit: e.target.value,
                        }))
                      }
                    />
                    %
                    <button
                      className="btn bg-green-400 text-green-700 border-green-700 btn-sm"
                      onClick={handleSave}>
                      <FaCheck />
                    </button>
                    <button
                      className="btn bg-red-400 text-red-900 border-red-900 btn-sm"
                      onClick={handleCancelLoan}>
                      <FaTimes />
                    </button>
                  </>
                ) : (
                  <>
                    <span>{rates.loanPercentOrig}%</span>
                    <FaPen
                      className="cursor-pointer text-gray-500 hover:text-sky-700"
                      onClick={() =>
                        setEditing((prev) => ({ ...prev, loanPercent: true }))
                      }
                    />
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <strong>อัตราดอกเบี้ย : </strong>
                {editing.interestRate ? (
                  <>
                    <input
                      type="number"
                      step="0.01"
                      className="input input-bordered w-20 h-8 bg-yellow-50 border-sky-700"
                      value={rates.interestRateEdit}
                      onChange={(e) =>
                        setRates((prev) => ({
                          ...prev,
                          interestRateEdit: e.target.value,
                        }))
                      }
                    />
                    %
                    <button
                      className="btn bg-green-400 text-green-700 border-green-700 btn-sm"
                      onClick={handleSave}>
                      <FaCheck />
                    </button>
                    <button
                      className="btn bg-red-400 text-red-900 border-red-900 btn-sm"
                      onClick={handleCancelInterest}>
                      <FaTimes />
                    </button>
                  </>
                ) : (
                  <>
                    <span>{rates.interestRateOrig}%</span>
                    <FaPen
                      className="cursor-pointer text-gray-500 hover:text-sky-700"
                      onClick={() =>
                        setEditing((prev) => ({ ...prev, interestRate: true }))
                      }
                    />
                  </>
                )}
              </div>
            </div>

            <hr className="text-gray-400 my-3" />

            <CustomerTable selected={selected} prices={prices}/>
          </div>
        ) : (
          <div className="flex h-[230px] text-xl justify-center items-center">
            <CgNotes />
            <span className="ml-2">เลือกลูกค้าเพื่อดูข้อมูล</span>
          </div>
        )}
      </fieldset>
    </>
  );
}
