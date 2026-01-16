import { useState, useEffect } from "react";
import { apiAdmin } from "../../../api/axiosInstance";
import toast from "react-hot-toast";

export default function CustomerSearch({ setCustomers }) {
  const [search, setSearch] = useState("");
  const [isError, setIsError] = useState(false);

  //----------------------------------------------------------------------------------------
  // Find Customer By Customer ID
  const findCustomer = () => {
    setIsError(false);
    if (!search) {
      setIsError(true);
      return toast.error("กรุณากรอกรหัสลูกค้า");
    }
    apiAdmin
      .get(`/api/dashboard/getcustomer/${search}`)
      .then((res) => setCustomers(res.data))
      .catch((err) => {
        console.error(err);
        setIsError(true);
        toast.error("ไม่พบลูกค้า");
      });
  };
  //----------------------------------------------------------------------------------------

  //----------------------------------------------------------------------------------------
  // Fetch All Customers
  const fetchAllCustomers = () => {
    apiAdmin
      .get("/api/dashboard/getcustomer")
      .then((res) => setCustomers(res.data))
      .catch((err) => {
        console.error(err);
        toast.error("โหลดรายชื่อลูกค้าไม่สำเร็จ");
      });
  };
  //----------------------------------------------------------------------------------------

  useEffect(() => {
    fetchAllCustomers();
  }, []);

  return (
    <>
      {/*------------ 🔍 Search Fieldset ------------*/}
      <fieldset className="fieldset border border-sky-900 shadow-md p-3 rounded-md h-[300px] overflow-auto">
        <legend className="fieldset-legend text-2xl text-sky-900">ค้นหาลูกค้า</legend>
        
        <div>
          <label
            className={`input h-[38px] bg-amber-50 ${
              isError ? "text-red-600 border-red-600" : "border-sky-700"
            }`}>
            <span className="label">รหัส</span>
            <input
              type="text"
              placeholder="ลูกค้า"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          <button
            type="button"
            onClick={findCustomer}
            className="bg-sky-700 text-white text-[14px] ml-2 py-2 px-6 rounded hover:bg-sky-800 cursor-pointer">
            ค้นหา
          </button>
          <button
            type="button"
            onClick={fetchAllCustomers}
            className="bg-sky-700 text-white text-[14px] ml-2 py-2 px-4 rounded hover:bg-sky-800 cursor-pointer">
            แสดงทั้งหมด
          </button>
        </div>
      </fieldset>
    </>
  );
}
