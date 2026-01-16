import { useEffect, useState } from "react";
import TicketConsignment from "./TicketConsignment";
import TicketInterest from "./TicketInterest";
import TicketRedeem from "./TicketRedeem";
import TicketExtend from "./TicketExtend";
import { apiAdmin } from "../../../api/axiosInstance";
import toast from "react-hot-toast";

export default function TicketManager({ refetchKey }) {
  const [pledgeData, setPledgeData] = useState([]);
  const [interestData, setInterestData] = useState([]);
  const [redeemData, setRedeemData] = useState([]);
  const [extendData, setExtendData] = useState([]);

  //----------------------------------------------------------------------------------------
  // Fetch helper
  const fetchData = async (url, setter, errorMsg = "โหลดข้อมูลล้มเหลว") => {
    try {
      const { data } = await apiAdmin.get(url);
      setter(data);
    } catch (error) {
      console.error(error);
      toast.error(errorMsg);
    }
  };
  //----------------------------------------------------------------------------------------

  //----------------------------------------------------------------------------------------
  // Update helper
  const updateStatus = async (url, payload, successMsg, refetch) => {
    try {
      await apiAdmin.post(url, payload);
      toast.success(successMsg);
      refetch();
    } catch (error) {
      console.error(error);
      toast.error("อัพเดทสถานะล้มเหลว");
    }
  };
  //----------------------------------------------------------------------------------------

  //----------------------------------------------------------------------------------------
  // Update Consignment Status
  const handleConsignmentUpdate = (
    transactionId,
    pledgeId,
    customerId,
    goldType,
    weight,
    loanAmount,
    method
  ) => {
    const payload = {
      transactionId,
      pledgeId,
      customerId,
      goldType,
      weight,
      loanAmount,
      method,
    };
    console.log("reach here");
    console.log(payload);
    const msg =
      method === "approve"
        ? `อนุมัติรายการขายฝาก ID ${pledgeId} เเล้ว!`
        : `ไม่อนุมัติรายการขายฝาก ID ${pledgeId} เเล้ว!`;
    updateStatus("/api/pledge/approve/status", payload, msg, () =>
      fetchData("/api/pledge/history/all", setPledgeData)
    );
  };
  //----------------------------------------------------------------------------------------

  //----------------------------------------------------------------------------------------
  // Update Interest Status
  const handleInterestUpdate = (
    interestId,
    transactionId,
    pledgeId,
    dueDate,
    endDate,
    interestAmount,
    loanAmount,
    intRate,
    method
  ) => {
console.log(dueDate, endDate);
    // const formattedDueDate = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Bangkok", hour12: false }).format(new Date(dueDate));
    // const formattedEndDate = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Bangkok", hour12: false }).format(new Date(endDate));
     const newDue = new Date(dueDate).toLocaleString("sv-SE").replace(" ", "T")
     const newEnd = new Date(endDate).toLocaleString("sv-SE").replace(" ", "T")
    const payload = {
      interestId,
      transactionId,
      pledgeId,
      dueDate:newDue ,
      endDate:newEnd ,
      interestAmount,
      loanAmount,
      intRate,
      method,
    };
    console.log("reach here");
    console.log(payload);
    const msg =
      method === "approve"
        ? `อนุมัติรายการต่อดอก ID ${interestId} เเล้ว!`
        : `ไม่อนุมัติรายการต่อดอก ID ${interestId} เเล้ว!`;
    updateStatus("/api/interest/approve/status", payload, msg, () =>
      fetchData("/api/interest/history/all", setInterestData)
    );
  };
  //----------------------------------------------------------------------------------------

  //----------------------------------------------------------------------------------------
  // Update Redeem Status
  const handleRedeemUpdate = (
    transactionId,
    pledgeId,
    goldType,
    intPaid,
    prinPaid,
    weight,
    custId,
    method
  ) => {
    const payload = {
      transactionId,
      pledgeId,
      goldType,
      intPaid,
      prinPaid,
      weight,
      custId,
      method,
    };
    const msg = method === "approve" ? "อนุมัติเรียบร้อย" : "ปฏิเสธเรียบร้อย";
    updateStatus("/api/redeem/approve/status", payload, msg, () => {
      fetchData("/api/redeem/history/all", setRedeemData);
      fetchData("/api/pledge/history/all", setPledgeData);
    });
  };
  //----------------------------------------------------------------------------------------

  const handleExtendUpdate = async ({
    pledgeId,
    transactionId,
    customerId,
    startDate,
    newEndDate,
    interestRate,
    loanPercent,
    newLoanAmount,
    goldType,
    refPrice,
    weight,
    extend,
    method, // "approve" or "reject"
  }) => {
    try {
      const payload = {
        pledgeId,
        transactionId,
        customerId,
        startDate, // must be "yyyy-MM-ddTHH:mm:ss"
        newEndDate, // must be "yyyy-MM-ddTHH:mm:ss"
        interestRate,
        loanPercent,
        newLoanAmount,
        goldType,
        refPrice,
        weight,
        extend,
        method,
      };

      console.log("Sending extension request:", payload);

      const msg = method === "approve" ? "อนุมัติเรียบร้อย" : "ปฏิเสธเรียบร้อย";
      updateStatus("/api/pledge/extend/approve/status", payload, msg, () =>
        fetchData("/api/pledge/extend/all", setExtendData)
      );

    } catch (err) {
      console.error("Extension API failed:", err);
      toast.error("เกิดข้อผิดพลาดในการทำรายการ");
    }
  };

  //----------------------------------------------------------------------------------------
  // Refetch
  useEffect(() => {
    if (refetchKey) {
      fetchData("/api/pledge/history/all", setPledgeData);
      fetchData("/api/interest/history/all", setInterestData);
      fetchData("/api/redeem/history/all", setRedeemData);
      fetchData("/api/pledge/extend/all", setExtendData);
    }
  }, [refetchKey]);
  //----------------------------------------------------------------------------------------

  return (
    <>
      <div>
        {/* ------------------------- Consignment Ticket Section ------------------------- */}
        <TicketConsignment
          pledgeData={pledgeData}
          handleConsignmentUpdate={handleConsignmentUpdate}
        />

        {/* ------------------------- Interest Ticket Section ------------------------- */}
        <TicketInterest
          interestData={interestData}
          handleInterestUpdate={handleInterestUpdate}
        />

        {/* ------------------------- Redeem Ticket Section ------------------------- */}
        <TicketRedeem
          redeemData={redeemData}
          handleRedeemUpdate={handleRedeemUpdate}
        />

        <TicketExtend
          extendData={extendData}
          handleExtendUpdate={handleExtendUpdate}
        />
      </div>
    </>
  );
}
