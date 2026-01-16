import { AiOutlineGold } from "react-icons/ai";

export default function PledgeBalance({ tempValue }) {
  return (
    <>
      <div className="grid grid-cols-2 grid-rows-1">
        <div className="p-3">
          <div className="text-white mb-1">
            <p>ยอดทองคงเหลือ</p>
            <p>(99.99%)</p>
          </div>
          <div className="flex text-2xl items-center">
            <AiOutlineGold className="text-white mr-2" />
            <span className="text-white">
              {tempValue.goldBalance99}{" "}
              <span className="text-lg ml-1">กิโล</span>
            </span>
          </div>
        </div>
        <div className="p-3">
          <div className="text-white mb-1">
            <p>ยอดทองคงเหลือ</p>
            <p>(96.50%)</p>
          </div>
          <div className="flex text-2xl items-center">
            <AiOutlineGold className="text-white mr-2" />
            <span className="text-white">
              {tempValue.goldBalance96}{" "}
              <span className="text-lg ml-1">บาท</span>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
