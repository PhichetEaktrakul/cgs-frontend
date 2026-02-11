import { useEffect, useState } from "react";
import { apiCust, apiPrice } from "../../api/axiosInstance";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import Header from "../../components/customer/Header";
import PledgeBalance from "../../components/customer/pledge/PledgeBalance";
import PledgeForm from "../../components/customer/pledge/PledgeForm";
import ModalPledge from "../../components/customer/pledge/ModalPledge";

export default function Pledge() {
  const customerId = localStorage.getItem("customerId");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selected, setSelected] = useState("1");
  const [tempValue, setTempValue] = useState({
    customerId: "",
    weight: 0,
    refPrice1: 0,
    refPrice2: 0,
    loanPercent: 0,
    loanAmount: 0,
    interestRate: 0,
    interestPay: 0,
    startDate: "",
    endDate: "",
    goldBalance99: 0,
    goldBalance96: 0,
    numPay: 0,
  });

  //----------------------------------------------------------------------------------------
  // Set customer initial data
  const fetchPledgeData = async (customerId) => {
    if (!customerId) return;

    try {
      const [initRes, goldRes, goldAssnRes, goldGcapRes] = await Promise.all([
        apiCust.get(`/api/customer/initial/${customerId}`),
        apiCust.get(`/api/customer/outer/${customerId}/gold`),
        apiPrice.get("/api/gold-assn/latest"),
        apiPrice.get("/api/gold-gcap/latest"),
      ]);

      const setting = initRes.data;
      const gold = goldRes.data;
      const goldGcap = goldGcapRes.data.gold99_sell;
      const goldAssn = goldAssnRes.data;
      const goldSell = parseInt(goldAssn.sellPrice.replace(/,/g, ""), 10);

      const dateToday = new Date();
      const dateEnd = new Date(dateToday);
      dateEnd.setMonth(dateToday.getMonth() + setting.num_pay);

      setTempValue((prev) => ({
        ...prev,
        customerId: customerId,
        refPrice1: goldGcap ?? 69445,
        refPrice2: goldSell ?? 67015,
        loanPercent: setting.loan_percent,
        interestRate: setting.interest_rate,
        startDate: dateToday.toLocaleString("sv-SE").replace(" ", "T"),
        endDate: dateEnd.toLocaleString("sv-SE").replace(" ", "T"),        
        goldBalance99: Number(gold.balance99) || 0,
        goldBalance96: Number(gold.balance96) || 0,
        numPay: setting.num_pay,
      }));
    } catch (err) {
      console.error("Failed to fetch consignment data:", err);
    }
  };
  //----------------------------------------------------------------------------------------

  //----------------------------------------------------------------------------------------
  // Create new pledge transaction
  const postPledgeData = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const transaction = {
      customerId: tempValue.customerId,
      weight: tempValue.weight,
      goldType: selected == "1" ? 1 : 2,
      refPrice: selected == "1" ? tempValue.refPrice1 : tempValue.refPrice2,
      loanPercent: tempValue.loanPercent,
      loanAmount: tempValue.loanAmount,
      interestRate: tempValue.interestRate,
      startDate: tempValue.startDate,
      endDate: tempValue.endDate,
      transactionType: "ขายฝาก",
    };
    apiCust
      .post("/api/pledge/create", transaction)
      .then((res) => {
        toast.success(`ทำรายการเลขที่ ${res.data} สำเร็จ!`);
        setIsLoading(false);
        document.getElementById("submit_modal").close();
        navigate("/history");
      })
      .catch((err) => {
        toast.error("ทำรายการล้มเหลว!");
        console.error("Error:", err);
        setIsLoading(false);
      });
  };
  //----------------------------------------------------------------------------------------

  //----------------------------------------------------------------------------------------
  // Calculate loan amount dynamically
  useEffect(() => {
    if (selected == "1") {
      setTempValue((prev) => ({
        ...prev,
        loanAmount: prev.weight * 65.6 * prev.refPrice1 * prev.loanPercent/100,
      }));
    } else {
      setTempValue((prev) => ({
        ...prev,
        loanAmount: prev.weight * prev.refPrice2 * prev.loanPercent/100,
      }));
    }
  }, [tempValue.weight, tempValue.refPrice1, tempValue.loanPercent, selected]);
  //----------------------------------------------------------------------------------------

  //----------------------------------------------------------------------------------------
  // Calculate payable interest
  useEffect(() => {
    setTempValue((prev) => ({
      ...prev,
      interestPay: (prev.interestRate * prev.loanAmount) / 100,
    }));
  }, [tempValue.loanAmount, tempValue.interestRate]);
  //----------------------------------------------------------------------------------------

  useEffect(() => {
    fetchPledgeData(customerId);
  }, [customerId]);

  return (
    <Header
      top={<PledgeBalance tempValue={tempValue} />}
      bottom={
        <>
          <p className="text-center text-2xl">ขายฝาก</p>
          {/*------------Consignment Form For Customer------------*/}
          <PledgeForm
            tempValue={tempValue}
            setTempValue={setTempValue}
            selected={selected}
            setSelected={setSelected}
            error={error}
            setError={setError}
          />

          {/*------------Open Transaction Consignment Modal------------*/}
          <ModalPledge
            tempValue={tempValue}
            postPledgeData={postPledgeData}
            isLoading={isLoading}
            selected={selected}
          />
        </>
      }
    />
  );
}
