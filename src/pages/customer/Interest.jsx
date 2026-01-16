import { useEffect, useState } from "react";
import { apiCust } from "../../api/axiosInstance";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import Header from "../../components/customer/Header";
import InterestCard from "../../components/customer/interest/InterestCard";
import ModalInterest from "../../components/customer/interest/ModalInterest";

export default function Interest() {
  const customerId = localStorage.getItem("customerId");
  const navigate = useNavigate();
  const [intList, setIntList] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [isReduce, setIsReduce] = useState(false);
  const [tempValue, setTempValue] = useState({ pay_interest: 0, pay_loan: 0 });
  const [error, setError] = useState(false);

  //----------------------------------------------------------------------------------------
  // Select Target Interest
  const handleSelectInt = (data) => {
    setSelectedData(data);
    setTempValue({
      pay_interest: (data.old_loan_amount * data.old_interest_rate) / 100,
      pay_loan: 0,
    });
    setIsReduce(false);
    document.getElementById("interest_modal").showModal();
  };
  //----------------------------------------------------------------------------------------

  //----------------------------------------------------------------------------------------
  // Submit Interest Transaction
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);

    if (
      tempValue.pay_loan < 0 ||
      selectedData.old_loan_amount - tempValue.pay_loan < 0
    )
      return setError("errNumber");
    if (selectedData.old_loan_amount - tempValue.pay_loan === 0)
      return setError("errRedeem");

    try {
      await apiCust.post("/api/interest/create", {
        interestId: selectedData.interest_id,
        pledgeId: selectedData.pledge_id,
        payInterest: tempValue.pay_interest,
        payLoan: tempValue.pay_loan,
      });
      toast.success("ทำรายการต่อดอกสำเร็จ!");
      document.getElementById("interest_modal").close();
      navigate("/history", {
        state: {
          type: "ต่อดอก",
        },
      });
    } catch (err) {
      console.error(err);
    }
  };
  //----------------------------------------------------------------------------------------

  //----------------------------------------------------------------------------------------
  // Fetch Customer Gold and History
  const fetchData = async () => {
    try {
      const intRes = await apiCust.get(`/api/interest/payable/${customerId}`);

      setIntList(intRes.data);
    } catch (err) {
      console.error(err);
    }
  };
  //----------------------------------------------------------------------------------------

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Header
        bottom={
          <>
            <p className="text-center text-2xl">รายการต่อดอก</p>
            {/*------------Render Payable Interest List------------*/}
            <InterestCard intList={intList} handleSelectInt={handleSelectInt} />

            {/*------------Open Transaction Interest Modal------------*/}
            <ModalInterest
              selectedData={selectedData}
              isReduce={isReduce}
              setIsReduce={setIsReduce}
              tempValue={tempValue}
              setTempValue={setTempValue}
              handleSubmit={handleSubmit}
              error={error}
            />
          </>
        }
      />
    </>
  );
}
