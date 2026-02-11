import { useState, useEffect } from "react";
import { apiAdmin } from "../../api/axiosInstance";
import toast from "react-hot-toast";

export default function AdminSetting() {
  const [config, setConfig] = useState({
    id: "",
    loanPercent: "",
    interestRate: "",
    numPay: "",
    extendNum: "",
  });
  const [updating, setUpdating] = useState(false);

  //----------------------------------------------------------------------------------------
  // Handle Input Change [Regex: Only Number and Dot]
  const handleConfigChange = (e) => {
    const { name, value } = e.target;
    if (!/^\d*\.?\d*$/.test(value)) return;
    setConfig((prev) => ({ ...prev, [name]: value }));
  };
  //----------------------------------------------------------------------------------------

  //----------------------------------------------------------------------------------------
  // Handle Confirm Update
  const handleConfirm = async () => {
    setUpdating(true);
    try {
      const res = await apiAdmin.put("/api/admin/config/initial", {
        loanPercent: parseFloat(config.loanPercent),
        interestRate: parseFloat(config.interestRate),
        numPay: parseInt(config.numPay),
        extendNum: parseInt(config.extendNum),
      });
      toast.success("อัปเดตค่าเริ่มต้นสำเร็จ!");
    } catch (err) {
      console.error("Update error:", err);
      toast.error("เกิดข้อผิดพลาดในการอัปเดต");
    } finally {
      setUpdating(false);
    }
  };
  //----------------------------------------------------------------------------------------

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await apiAdmin.get("/api/admin/config/initial");
        if (res.data.length > 0) {
          const cfg = res.data[0];
          setConfig({
            id: cfg.id,
            loanPercent: cfg.loan_percent,
            interestRate: cfg.interest_rate,
            numPay: cfg.num_pay,
            extendNum: cfg.extend_num_pay,
          });
        }
      } catch (err) {
        toast.error("Error fetching config:", err);
      }
    };

    fetchConfig();
  }, []);

  return (
    <>
      <div className="w-full h-full max-w-5xl">
        <div className="px-3 py-5 rounded-md mb-3 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2),0_4px_8px_rgba(0,0,0,0.12)]">
          {/* ========== Card Title ========== */}
          <div className="flex items-center mb-4">
            <div className="w-2 h-6 bg-sky-700 mr-3 rounded-sm" />
            <h2 className="text-2xl font-semibold text-gray-700">
              ตั้งค่าเริ่มต้น
            </h2>
          </div>

          {/* ========== Content ========== */}
          <div className="flex flex-wrap gap-y-4">
            <div className="flex items-center mx-3 relative">
              <p className="mr-2">วงเงินที่ให้</p>
              <div className="relative">
                <input
                  type="text"
                  name="loanPercent"
                  value={config.loanPercent}
                  onChange={handleConfigChange}
                  className="bg-blue-50 border-0 border-b-2 border-gray-400 focus:border-blue-500 focus:outline-none px-1 w-[129px] text-lg rounded-sm text-center"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-700">
                  %
                </span>
              </div>
            </div>

            <div className="flex items-center mx-3 relative">
              <p className="w-[90px] mr-1">อัตราดอกเบี้ย</p>
              <div className="relative">
                <input
                  type="text"
                  name="interestRate"
                  value={config.interestRate}
                  onChange={handleConfigChange}
                  className="bg-blue-50 border-0 border-b-2 border-gray-400 focus:border-blue-500 focus:outline-none px-1 w-[129px] text-lg rounded-sm text-center"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-700">
                  %
                </span>
              </div>
            </div>

            <div className="flex items-center mx-3 relative">
              <p className="w-[90px] mr-1">จำนวนงวด</p>
              <input
                type="text"
                name="numPay"
                value={config.numPay}
                onChange={handleConfigChange}
                className="bg-blue-50 border-0 border-b-2 border-gray-400 focus:border-blue-500 focus:outline-none px-1 w-[129px] text-lg rounded-sm text-center"
              />
            </div>

            <div className="flex items-center mx-3 relative">
              <p className="w-[90px] mr-1">ระยะขยายสัญญา</p>
              <input
                type="text"
                name="extendNum"
                value={config.extendNum}
                onChange={handleConfigChange}
                className="bg-blue-50 border-0 border-b-2 border-gray-400 focus:border-blue-500 focus:outline-none px-1 w-[129px] text-lg rounded-sm text-center"
              />
            </div>
          </div>

          {/* ========== Button ========== */}
          <div className="flex justify-end mt-4 pr-3">
            <button
              onClick={handleConfirm}
              disabled={updating}
              className={`${
                updating ? "bg-gray-400" : "bg-sky-700 hover:bg-sky-800"
              } text-white px-6 py-2 rounded-full text-lg`}>
              {updating ? "กำลังอัปเดต..." : "ยืนยัน"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
