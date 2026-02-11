import { FormatNumber } from "../../../utility/function";

export default function MonitorSummary({ title, data }) {
  return (
    <>
      <div className="shadow-[0_1px_3px_rgba(0,0,0,0.2),0_4px_8px_rgba(0,0,0,0.12)] px-3 py-5 rounded-md overflow-auto row-span-1 mb-3 bg-white">
        <legend className="fieldset-legend text-2xl text-sky-900">
          <div className="flex items-center mb-4">
            <div className="w-2 h-6 bg-sky-700 mr-3 rounded-sm" />
            <h2 className="text-2xl font-semibold text-gray-700">
               {title}
            </h2>
          </div>
         
        </legend>
        <div className="grid grid-cols-7 grid-rows-3 gap-2 text-[16px]">
          <div className="col-span-2" />
          <div className="col-span-2 text-center">99.9%</div>
          <div className="col-span-2 text-center">96.5%</div>
          <div />

          <div className="col-span-2">ปริมาณ</div>
          <div className="col-span-2 text-center bg-sky-100">
            {data.vol99 * 66.67}
          </div>
          <div className="col-span-2 text-center bg-amber-100">
            {data.vol96}
          </div>
          <div>BATH</div>

          <div className="col-span-2">ราคาเฉลี่ย</div>
          <div className="col-span-2 text-center bg-sky-100">
            {FormatNumber(data.mean99)}
          </div>
          <div className="col-span-2 text-center bg-amber-100">
            {FormatNumber(data.mean96)}
          </div>
          <div>บาท</div>
        </div>
      </div>
    </>
  );
}
