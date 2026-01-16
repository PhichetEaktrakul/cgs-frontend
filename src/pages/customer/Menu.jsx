import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { apiCust } from "../../api/axiosInstance";
import { FormatDate, FormatNumber, GoldTypeText } from "../../utility/function";
import Header from "../../components/customer/Header";
import ModalTOS from "../../components/customer/menu/ModalTOS";
import ModalExtendPledge from "../../components/customer/menu/ModalExtendPledge";
import { HiOutlineDocumentMinus } from "react-icons/hi2";
import { AiOutlineGold } from "react-icons/ai";
import { CiWarning } from "react-icons/ci";
import toast from "react-hot-toast";

export default function Menu() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = new URLSearchParams(location.search).get("token");
  const [customer, setCustomer] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [pledgeList, setPledgeList] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  //----------------------------------------------------------------------------------------
  // Decode token & fetch customer
  useEffect(() => {
    if (!token) {
      setError("No token found in the URL.");
      return;
    }

    const fetchCustomer = async () => {
      try {
        setLoading(true);
        const { data } = await apiCust.get("/api/token/decode", {
          params: { token },
        });
        setCustomer(data);
        fetchPledgeList(data.customerId);
        localStorage.setItem("customerId", data.customerId);
      } catch (err) {
        setError(err.response?.data || "Failed to fetch customer data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [token]);
  //----------------------------------------------------------------------------------------

  //----------------------------------------------------------------------------------------
  // Check if customer accepted TOS
  useEffect(() => {
    if (!customer?.customerId || loading) return;

    const checkTos = async () => {
      try {
        const { data } = await apiCust.get(`/api/tos/check/${customer.customerId}`);
        if (!data) {
          setError("กรุณากดยอมรับข้อกำหนดการใช้บริการ");
          document.getElementById("tos_modal")?.showModal();
        }
      } catch (err) {
        console.error("Error check if customer accepted TOS:", err);
      }
    };

    checkTos();
  }, [customer?.customerId, loading]);
  //----------------------------------------------------------------------------------------

  //----------------------------------------------------------------------------------------
  // Handle TOS agreement
  const handleAgreement = async () => {
    try {
      await apiCust.post("/api/tos/accept", {
        customerId: customer.customerId,
        firstname: customer.firstname,
        lastname: customer.lastname,
        phonenumber: customer.phone,
        idcard: customer.idcard,
        address: customer.address,
      });
      setError("");
      fetchPledgeList(customer.customerId);
      document.getElementById("tos_modal")?.close();
    } catch (err) {
      console.error("Error adding TOS:", err);
    }
  };
  //----------------------------------------------------------------------------------------

  //----------------------------------------------------------------------------------------
  // Fetch pledge list
  const fetchPledgeList = async (customerId) => {
    try {
      const { data } = await apiCust.get(`/api/pledge/history/${customerId}`);
      setPledgeList(data);
    } catch (err) {
      console.error("Error fetching pledge list:", err);
    }
  };
  //----------------------------------------------------------------------------------------

  //----------------------------------------------------------------------------------------
  // Handle pledge extend confirmation
  const handleConfirmExtend = async (payload) => {
    try {
      await apiCust.post("/api/pledge/extend", payload);
      toast.success("ทำรายการต่อสัญญาเรียบร้อย");
      document.getElementById("extend_modal")?.close();
      fetchPledgeList(customer?.customerId);
    } catch (err) {
      console.error("Error pledge extend:", err);
    }
  };
  //----------------------------------------------------------------------------------------

  //----------------------------------------------------------------------------------------
  // Select pledge that want to extend
  const handleSelectPledge = (data) => {
    setSelectedData(data);
    document.getElementById("extend_modal")?.showModal();
  };
  //----------------------------------------------------------------------------------------

  //----------------------------------------------------------------------------------------
  // Menu card component
  const MenuCard = ({ onClick, text }) => (
    <div
      className="border-3 border-slate-400 rounded-full flex p-3 bg-slate-50 cursor-pointer"
      onClick={onClick}>
      <AiOutlineGold className="mr-3 text-2xl text-gray-600" />
      <span>{text}</span>
    </div>
  );
  //----------------------------------------------------------------------------------------

  const activePledgeList = pledgeList?.filter((item) =>
    ["active", "redeempay"].includes(item.status)
  );

  return (
    <>
      <Header
        bottom={
          <>
            {loading && ( <p className="text-slate-400 text-center text-lg">Loading...</p> )}
            {error && ( <div className="text-slate-400 text-center text-lg h-[60vh] content-center"><CiWarning className="m-auto text-8xl"/><p>{error}</p></div> )}
            {!error && customer && (
              <div>
                {/* ---------- Active List ---------- */}
                {activePledgeList.length > 0 ? (
                  <>
                    <p className="text-xl mt-4">รายการขายฝากของฉัน : {activePledgeList.length} รายการ</p>
                    <div className="h-[56vh] overflow-auto">
                      {activePledgeList.map((item) => (
                        <div
                          key={item.pledge_id}
                          className="grid grid-cols-[30%_20%_25%_25%] gap-y-1 border border-[#17b686fc] rounded-2xl my-3 p-3 text-[12px]">
                          <p className="col-span-4 font-bold">เลขที่สัญญา : {item.pledge_id}</p>

                          <span className="contents">
                            <span className="text-center pr-1">ประเภททอง</span>
                            <span>: {GoldTypeText(item.gold_type)}</span>
                          </span>

                          <span className="contents">
                            <span className="text-center pr-1">น้ำหนัก</span>
                            <span>
                              :{" "}
                              {`${item.weight} ${
                                item.gold_type === 1 ? "กิโล" : "บาท"
                              }`}
                            </span>
                          </span>

                          <span className="contents">
                            <span className="text-center pr-1">วงเงิน (%)</span>
                            <span>: {item.loan_percent.toFixed(2)}%</span>
                          </span>

                          <span className="contents">
                            <span className="text-center pr-1">อัตราดอกเบี้ย</span>
                            <span>: {item.interest_rate}%</span>
                          </span>

                          <span className="contents">
                            <span className="text-center pr-1">ราคาอ้างอิง</span>
                            <span>: {item.ref_price.toLocaleString()}</span>
                          </span>

                          <span className="contents">
                            <span className="text-center pr-1">วงเงินที่ได้</span>
                            <span>: {FormatNumber(item.loan_amount)}</span>
                          </span>

                          <span className="contents">
                            <span className="text-center pr-1">วันเริ่มต้นสัญญา</span>
                            <span>: {FormatDate(item.start_date)}</span>
                          </span>

                          <span className="contents">
                            <span className="text-center pr-1">วันสิ้นสุดสัญญา</span>
                            <span>: {FormatDate(item.end_date)}</span>
                          </span>

                          {item.is_extendable ? (
                            <div className="col-span-4 items-center content-end justify-end flex mr-6">
                              <button
                                type="button"
                                className="cursor-pointer border border-transparent bg-[#17b686fc] text-white hover:border hover:border-[#17b686fc] hover:bg-white hover:text-[#1bd19afc] py-0.5 px-2 rounded-full text-[12px]"
                                onClick={() => handleSelectPledge(item)}>
                                ต่อสัญญา
                              </button>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="h-[59vh]">
                      <p className="text-xl mt-4">
                        รายการขายฝากของฉัน : {activePledgeList.length} รายการ
                      </p>
                      <div className="flex flex-col text-slate-300 text-6xl my-10 items-center justify-center h-[35vh]">
                        <HiOutlineDocumentMinus className="mb-2 text-8xl" />
                        <p className="text-2xl">ไม่มีรายการ</p>
                      </div>
                    </div>               
                  </>
                )}

                {/* ---------- Menu Buttons ---------- */}
                <div className="h-[200px]">
                  <p className="text-xl mt-3">ทำรายการ</p>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <MenuCard
                      onClick={() => navigate("/pledge")}
                      text="ทำรายการขายฝาก"
                    />
                    <MenuCard
                      onClick={() => navigate("/history")}
                      text="ตรวจสอบประวัติ"
                    />
                    <MenuCard
                      onClick={() => navigate("/interest")}
                      text="ทำรายการต่อดอก"
                    />
                    <MenuCard
                      onClick={() => navigate("/redeem")}
                      text="ทำรายการไถ่ถอน"
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        }
      />
      {/* ---------- TOS Modal ---------- */}
      <ModalTOS handleAgreement={handleAgreement} />

      {/* ---------- Extend Modal ---------- */}
      <ModalExtendPledge
        selectedData={selectedData}
        handleConfirmExtend={handleConfirmExtend}
      />
    </>
  );
}
