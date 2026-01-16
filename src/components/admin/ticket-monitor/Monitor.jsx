import { useState, useEffect } from "react";
import { apiAdmin } from "../../../api/axiosInstance";
import MonitorFocus from "./MonitorFocus";
import MonitorSummary from "./MonitorSummary";
import toast from "react-hot-toast";

export default function Monitor({ refetchKey, prices }) {
  const [data, setData] = useState([]);
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [headTotal, setHeadTotal] = useState({
    vol96: 0,
    vol99: 0,
    mean96: 0,
    mean99: 0,
  });
  const [headLong, setHeadLong] = useState({
    vol96: 0,
    vol99: 0,
    mean96: 0,
    mean99: 0,
  });
  const [headShot, setHeadShot] = useState({
    vol96: 0,
    vol99: 0,
    mean96: 0,
    mean99: 0,
  });

  //----------------------------------------------------------------------------------------
  // Switch Order Status Of Ticket [Long, Shot]
  const switchOrderStatus = (status) => {
    if (!selectedTickets.length) return;
    apiAdmin
      .post("/apiadmin/order-switch", { pledgeIds: selectedTickets, status })
      .then(() => {
        fetchTicket();
        toast.success(`เปลี่ยนสถานะเป็น ${status} เเล้ว!`);
      })
      .catch(() => toast.error("เปลี่ยนสถานะล้มเหลว!"));
  };
  //----------------------------------------------------------------------------------------

  //----------------------------------------------------------------------------------------
  // Fetch All Customer Pledge Ticket
  const fetchTicket = async () => {
    try {
      const response = await apiAdmin.get("/api/admin/monitor/ticket/all");
      setData(response.data);
    } catch (error) {
      console.error("Fetch tickets failed:", error);
    }
  };
  //----------------------------------------------------------------------------------------

  //----------------------------------------------------------------------------------------
  // Calculate Total, Long, Shot
  useEffect(() => {
    let totals = {
      vol96: 0,
      vol99: 0,
      sum96: 0,
      sum99: 0,
      count96: 0,
      count99: 0,
    };
    let long = {
      vol96: 0,
      vol99: 0,
      sum96: 0,
      sum99: 0,
      count96: 0,
      count99: 0,
    };
    let shot = {
      vol96: 0,
      vol99: 0,
      sum96: 0,
      sum99: 0,
      count96: 0,
      count99: 0,
    };

    data.forEach((item) => {
      const ratio = item.weight > 0 ? item.loan_amount / item.weight : 0;
      const target =
        item.pledge_order === "Long"
          ? long
          : item.pledge_order === "Shot"
          ? shot
          : null;

      if (item.gold_type === 2) {
        totals.vol96 += item.weight;
        if (ratio > 0) {
          totals.sum96 += ratio;
          totals.count96++;
        }
        if (target) {
          target.vol96 += item.weight;
          if (ratio > 0) {
            target.sum96 += ratio;
            target.count96++;
          }
        }
      } else if (item.gold_type === 1) {
        totals.vol99 += item.weight;
        if (ratio > 0) {
          totals.sum99 += ratio;
          totals.count99++;
        }
        if (target) {
          target.vol99 += item.weight;
          if (ratio > 0) {
            target.sum99 += ratio;
            target.count99++;
          }
        }
      }
    });

    setHeadTotal({
      vol96: totals.vol96,
      vol99: totals.vol99,
      mean96: totals.count96 ? Math.round(totals.sum96 / totals.count96) : 0,
      mean99: totals.count99 ? Math.round(totals.sum99 / totals.count99) : 0,
    });
    setHeadLong({
      vol96: long.vol96,
      vol99: long.vol99,
      mean96: long.count96 ? Math.round(long.sum96 / long.count96) : 0,
      mean99: long.count99 ? Math.round(long.sum99 / long.count99) : 0,
    });
    setHeadShot({
      vol96: shot.vol96,
      vol99: shot.vol99,
      mean96: shot.count96 ? Math.round(shot.sum96 / shot.count96) : 0,
      mean99: shot.count99 ? Math.round(shot.sum99 / shot.count99) : 0,
    });
  }, [data]);
  //----------------------------------------------------------------------------------------

  useEffect(() => {
    if (refetchKey) fetchTicket();
  }, [refetchKey]);

  return (
    <>
      {/*------------Ticket Summary Card------------*/}
      <div className="grid grid-cols-3 gap-4 max-w-7xl">
        <MonitorSummary title="Total" data={headTotal} />
        <MonitorSummary title="Long" data={headLong} />
        <MonitorSummary title="Shot" data={headShot} />
      </div>

      {/*------------Ticket Monitor Card------------*/}
      <MonitorFocus
        data={data}
        prices={prices}
        switchOrderStatus={switchOrderStatus}
        selectedTickets={selectedTickets}
        setSelectedTickets={setSelectedTickets}
      />
    </>
  );
}
