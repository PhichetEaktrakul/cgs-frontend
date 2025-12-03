import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { apiCust } from "../../api/axiosInstance";
import { GiGoldBar } from "react-icons/gi";
import { FormatDate, FormatNumber, GoldTypeText } from "../../utility/function";
import Header from "../../components/customer/Header";
import ModalTOS from "../../components/customer/ModalTOS";
import { HiOutlineDocumentMinus } from "react-icons/hi2";
import ModalExtendConsignment from "../../components/customer/consignment/ModalExtendConsignment";
import toast from "react-hot-toast";

export default function Menu() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = new URLSearchParams(location.search).get("token");
  const [customer, setCustomer] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [consignList, setConsignList] = useState([]);
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
        const { data } = await apiCust.get("/token/decode", {
          params: { token },
        });
        setCustomer(data);
        fetchConsignList(data.customerId);
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
        const { data } = await apiCust.get(`/tos/check/${customer.customerId}`);
        if (!data) {
          setError("กรุณากดยอมรับข้อกำหนดการใช้บริการ");
          document.getElementById("tos_modal")?.showModal();
        }
      } catch (err) {
        console.error("เกิดข้อผิดพลาด:", err);
      }
    };

    checkTos();
  }, [customer?.customerId, loading]);
  //----------------------------------------------------------------------------------------

  //----------------------------------------------------------------------------------------
  // Handle TOS agreement
  const handleAgreement = async () => {
    try {
      await apiCust.post("/tos/accept", {
        customerId: customer.customerId,
        firstname: customer.firstname,
        lastname: customer.lastname,
        phonenumber: customer.phone,
        idcard: customer.idcard,
        address: customer.address,
      });
      setError("");
      fetchConsignList(customer.customerId);
      document.getElementById("tos_modal")?.close();
    } catch (err) {
      console.error("Error adding TOS:", err);
    }
  };
  //----------------------------------------------------------------------------------------

  //----------------------------------------------------------------------------------------
  // Fetch consignment list
  const fetchConsignList = async (customerId) => {
    try {
      const { data } = await apiCust.get(`/pledge/history/${customerId}`);
      setConsignList(data);
    } catch (err) {
      console.error("Error fetching consign list:", err);
    }
  };
  //----------------------------------------------------------------------------------------

  //----------------------------------------------------------------------------------------

const handleConfirmExtend = async (payload) => {
  try {
    console.log("Sending payload:", payload);
    await apiCust.post("/pledge/extend", payload);
    toast.success("ทำรายการต่อสัญญาเรียบร้อย");
    document.getElementById("extend_modal")?.close();
  } catch (error) {
    console.error("Extend failed:", error);
    toast.error(
      error.response?.data?.message || "ไม่สามารถทำรายการได้ กรุณาลองใหม่อีกครั้ง"
    );
  }
};






  //----------------------------------------------------------------------------------------
  const handleSelectPledge = (data) => {
    setSelectedData(data);
    document.getElementById("extend_modal")?.showModal();
  };

  //----------------------------------------------------------------------------------------

  //----------------------------------------------------------------------------------------
  // Menu card component
  const MenuCard = ({ onClick, text }) => (
    <div
      className="border border-[#dabe96] rounded-lg flex p-3 bg-linear-to-r from-[#dabe96] to-[#f8e0be] cursor-pointer"
      onClick={onClick}>
      <GiGoldBar className="mr-2 text-2xl text-[#ac8e65]" />
      <span>{text}</span>
    </div>
  );
  //----------------------------------------------------------------------------------------

  const activeConsignList = consignList?.filter((item) =>
    ["active", "redeempay"].includes(item.status)
  );

  return (
    <>
      <Header
        bottom={
          <>
            {loading && (
              <p className="text-gray-400 text-center text-lg">Loading...</p>
            )}
            {error && (
              <p className="text-gray-400 text-center text-lg">{error}</p>
            )}
            {!error && customer && (
              <div>
                {/* ---------- Active List ---------- */}
                {activeConsignList.length > 0 ? (
                  <>
                    <p className="text-xl mt-4">
                      รายการขายฝาก : {activeConsignList.length} รายการ
                    </p>

                    <div className="h-[500px] overflow-x-auto">
                      {activeConsignList.map((item) => (
                        <div
                          key={item.pledge_id}
                          className="grid grid-cols-[30%_20%_30%_20%] gap-y-1 border border-[#1748b1] rounded-lg my-3 p-3 text-[12px]">
                          <p className="col-span-4 font-bold">
                            เลขที่สัญญา : {item.pledge_id}
                          </p>

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
                            <span className="text-center pr-1">
                              วงเงินที่ได้
                            </span>
                            <span>: {FormatNumber(item.loan_amount)}</span>
                          </span>

                          <span className="contents">
                            <span className="text-center pr-1">
                              ราคาอ้างอิง
                            </span>
                            <span>: {item.ref_price.toLocaleString()}</span>
                          </span>

                          <span className="contents">
                            <span className="text-center pr-1">
                              อัตราดอกเบี้ย
                            </span>
                            <span>: {item.interest_rate}%</span>
                          </span>

                          <span className="contents">
                            <span className="text-center pr-1">
                              วันเริ่มต้นสัญญา
                            </span>
                            <span>: {FormatDate(item.start_date)}</span>
                          </span>

                          <span className="contents">
                            <span className="text-center pr-1">
                              วันสิ้นสุดสัญญา
                            </span>
                            <span>: {FormatDate(item.end_date)}</span>
                          </span>
                          {item.is_extendable ? (
                            <div className="col-span-4 items-center content-end justify-end flex mr-6">
                              <button
                                type="button"
                                className="cursor-pointer border border-transparent bg-[#dabe96] hover:border hover:border-[#dabe96] hover:bg-white hover:text-[#dabe96] py-0.5 px-2 rounded text-[12px]"
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
                    <p className="text-xl mt-4">
                      รายการขายฝาก : {activeConsignList.length} รายการ
                    </p>
                    <div className="items-center justify-center flex text-gray-200 text-6xl my-10">
                      <HiOutlineDocumentMinus />
                    </div>
                  </>
                )}

                {/* ---------- Menu Buttons ---------- */}
                <div className="h-[200px]">
                  <p className="text-xl mt-3">ทำรายการ</p>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <MenuCard
                      onClick={() => navigate("/consignment")}
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
      <ModalTOS handleAgreement={handleAgreement} />

      <ModalExtendConsignment selectedData={selectedData} handleConfirmExtend={handleConfirmExtend} />
    </>
  );
}
