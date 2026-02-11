import { useEffect, useState } from "react";
import { apiAdmin } from "../../api/axiosInstance";
import TicketPledge from "../../components/admin/ticket-manager/TicketPledge";
import TicketInterest from "../../components/admin/ticket-manager/TicketInterest";
import TicketRedeem from "../../components/admin/ticket-manager/TicketRedeem";
import TicketExtend from "../../components/admin/ticket-manager/TicketExtend";
import toast from "react-hot-toast";

export default function AdminTicket() {
  const [pledgeData, setPledgeData] = useState([]);
  const [interestData, setInterestData] = useState([]);
  const [redeemData, setRedeemData] = useState([]);
  const [extendData, setExtendData] = useState([]);

  //----------------------------------------------------------------------------------------
  // Fetch Helper
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
  // Update Helper
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
  // Update Pledge Status
  const handlePledgeUpdate = (
    transactionId,
    pledgeId,
    customerId,
    goldType,
    weight,
    loanAmount,
    method,
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
    const msg =
      method === "approve"
        ? `อนุมัติรายการขายฝาก ID ${pledgeId} เเล้ว!`
        : `ไม่อนุมัติรายการขายฝาก ID ${pledgeId} เเล้ว!`;
    updateStatus("/api/pledge/approve/status", payload, msg, () =>
      fetchData("/api/pledge/history/all", setPledgeData),
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
    method,
  ) => {
    const newDue = new Date(dueDate).toLocaleString("sv-SE").replace(" ", "T");
    const newEnd = new Date(endDate).toLocaleString("sv-SE").replace(" ", "T");
    const payload = {
      interestId,
      transactionId,
      pledgeId,
      dueDate: newDue,
      endDate: newEnd,
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
      fetchData("/api/interest/history/all", setInterestData),
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
    method,
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

  //----------------------------------------------------------------------------------------
  // Update Extend Status
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
    method, 
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

      const msg = method === "approve" ? "อนุมัติเรียบร้อย" : "ปฏิเสธเรียบร้อย";
      updateStatus("/api/pledge/extend/approve/status", payload, msg, () =>
        fetchData("/api/pledge/extend/all", setExtendData),
      );
    } catch (err) {
      console.error("Extension API failed:", err);
      toast.error("เกิดข้อผิดพลาดในการทำรายการ");
    }
  };

  //----------------------------------------------------------------------------------------
  useEffect(() => {
    fetchData("/api/pledge/history/all", setPledgeData);
    fetchData("/api/interest/history/all", setInterestData);
    fetchData("/api/redeem/history/all", setRedeemData);
    fetchData("/api/pledge/extend/all", setExtendData);
  }, []);
  //----------------------------------------------------------------------------------------

  return (
    <>
      <div className="w-full h-full max-w-[1400px]">
        <div className="px-3 py-5 mb-5 rounded-md bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2),0_4px_8px_rgba(0,0,0,0.12)]">
          <TicketPledge
            pledgeData={pledgeData}
            handlePledgeUpdate={handlePledgeUpdate}
          />

          <TicketInterest
            interestData={interestData}
            handleInterestUpdate={handleInterestUpdate}
          />

          <TicketRedeem
            redeemData={redeemData}
            handleRedeemUpdate={handleRedeemUpdate}
          />

          <TicketExtend
            extendData={extendData}
            handleExtendUpdate={handleExtendUpdate}
          />
        </div>
      </div>
    </>
  );
}
