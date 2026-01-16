import { useEffect, useState } from "react";
import { apiCust } from "../../api/axiosInstance";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import Header from "../../components/customer/Header";
import RedeemCard from "../../components/customer/redeem/RedeemCard";
import ModalRedeem from "../../components/customer/redeem/ModalRedeem";

export default function Redeem() {
  const customerId = localStorage.getItem("customerId");
  const navigate = useNavigate();
  const [redeemList, setRedeemList] = useState([]);
  const [selectedData, setSelectedData] = useState();

  //----------------------------------------------------------------------------------------
  // Select Target Redeem
  const handleSelectRed = (data) => {
    setSelectedData(data);
    document.getElementById("redeem_modal").showModal();
  };
  //----------------------------------------------------------------------------------------

  //----------------------------------------------------------------------------------------
  // Calculate Interest Pay
  const calculateInterestPay = (data) => {
    if (data.remain_num_pay === 0) return 0;
    return (data.remain_loan_amount * data.interest_rate) / 100;
  };
  //----------------------------------------------------------------------------------------

  //----------------------------------------------------------------------------------------
  // Submit Redeem Transaction
  const postRedeem = async () => {
    if (!selectedData) return;

    try {
      await apiCust.post("/api/redeem/create", {
        transactionId: selectedData.transaction_id,
        pledgeId: selectedData.pledge_id,
        principalPay: selectedData.remain_loan_amount,
        interestPay: calculateInterestPay(selectedData),
      });

      toast.success("ทำรายการไถ่ถอนสำเร็จ!");
      document.getElementById("redeem_modal").close();
      navigate("/history", {
        state: {
          type: "ไถ่ถอน",
        },
      });
    } catch (err) {
      console.error("Redeem error:", err);
    }
  };
  //----------------------------------------------------------------------------------------

  //----------------------------------------------------------------------------------------
  // Fetch Redeemable List and History
  const fetchData = async () => {
    try {
      const redeemRes = await apiCust.get(`/api/redeem/list/${customerId}`);
      setRedeemList(redeemRes.data);
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
            <p className="text-center text-2xl">ไถ่ถอน</p>
            {/*------------Render Redeemable Consignment List------------*/}
            <RedeemCard redeemList={redeemList} handleSelectRed={handleSelectRed} />

            {/*------------Open Transaction Redeem Modal------------*/}
            <ModalRedeem selectedData={selectedData} postRedeem={postRedeem} />
          </>
        }
      />
    </>
  );
}
