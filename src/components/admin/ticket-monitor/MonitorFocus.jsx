import {
  FormatNumber,
  FormatDate,
  GoldTypeText,
  CalRemainDays,
  CalFunctions,
} from "../../../utility/function";
import { RiExchangeBoxFill } from "react-icons/ri";

export default function MonitorFocus({
  data,
  prices,
  switchOrderStatus,
  selectedTickets,
  setSelectedTickets,
}) {
  const columns = [
    "#",
    "เลขที่ Ticket",
    "เลขที่สัญญา",
    "วันครบกำหนดสัญญา",
    "วัน",
    "สถานะ",
    "ประเภททอง",
    "Loan+Int",
    "น้ำหนัก (BAHT)",
    "Gain/Loss",
    "หมายเหตุ",
    "Tools",
  ];

  return (
    <>
      <div className="shadow-[0_1px_3px_rgba(0,0,0,0.2),0_4px_8px_rgba(0,0,0,0.12)] px-3 py-5 rounded-md overflow-auto row-span-1 mb-3 bg-white">
        <div className="flex items-center mb-4">
          <div className="w-2 h-6 bg-sky-700 mr-3 rounded-sm" />
          <h2 className="text-2xl font-semibold text-gray-700">Focus Ticket</h2>
        </div>

        {/*------------Switch Ticket Order Status Button------------*/}
        <div className="flex gap-2">
          <button
            className="px-3 py-1 bg-sky-700 text-white text-base rounded-xl disabled:bg-gray-400 disabled:cursor-auto"
            onClick={() => switchOrderStatus("Long")}
            disabled={!selectedTickets.length}>
            Set Long
          </button>
          <button
            className="px-3 py-1 bg-sky-700 text-white text-base rounded-xl disabled:bg-gray-400 disabled:cursor-auto"
            onClick={() => switchOrderStatus("Shot")}
            disabled={!selectedTickets.length}>
            Set Shot
          </button>
        </div>

        {/*------------Focus Ticket Table------------*/}
        <div className="overflow-x-auto my-2">
          <table className="w-full border-separate border-spacing-y-1 text-sm">
            <thead className="sticky top-0 bg-sky-700 text-white">
              <tr>
                {columns.map((col) => (
                  <th
                    className="py-1  font-semibold first:rounded-l-lg last:rounded-r-lg"
                    key={col}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="[&>tr>td]:text-center [&>tr>td]:py-2">
              {data.length ? (
                data.map((item) => {
                  const { avgLoan, gainLoss, adjustedWeight } = CalFunctions(
                    item,
                    prices,
                  );
                  return (
                    <tr
                      key={item.pledge_id}
                      className={`hover:bg-red-50 transition
                      ${item.gold_type === 1 ? "bg-blue-100" : item.gold_type === 2 ? "bg-yellow-100" : ""}
                    `}>
                      <td>
                        <input
                          type="checkbox"
                          className="checkbox checkbox-sm border-gray-500 bg-white"
                          checked={selectedTickets.includes(item.pledge_id)}
                          onChange={(e) =>
                            setSelectedTickets(
                              e.target.checked
                                ? [...selectedTickets, item.pledge_id]
                                : selectedTickets.filter(
                                    (id) => id !== item.pledge_id,
                                  ),
                            )
                          }
                        />
                      </td>
                      <td>{item.transaction_id}</td>
                      <td>{item.pledge_id}</td>
                      <td className="text-center py-1">
                        {FormatDate(item.end_date)}
                      </td>
                      <td>{CalRemainDays(item.end_date)}</td>
                      <td>
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-semibold inline-block
                            ${item.pledge_order === "Shot"? "bg-red-100 text-red-700": item.pledge_order === "Long"? "bg-green-100 text-green-700": ""}
                         `}>
                          {item.pledge_order}
                        </div>
                      </td>
                      <td>{GoldTypeText(item.gold_type)}</td>
                      <td>{FormatNumber(avgLoan)}</td>
                      <td>{adjustedWeight}</td>
                      <td
                        className={
                          gainLoss < 0 ? "text-red-500" : "text-green-600"
                        }>
                        {FormatNumber(gainLoss)}
                      </td>
                      <td>{item.remark}</td>
                      <td className="text-xl text-sky-600 text-center">
                        <RiExchangeBoxFill />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr className="text-[14px]!">
                  <td colSpan={12}>ไม่มีรายการ</td>
                </tr>
              )}
            </tbody>
            <tfoot className="bg-sky-700 text-white"></tfoot>
          </table>
        </div>

        {/*------------Mock Up Paginate------------*/}
        <div className="text-center my-2">
          <div className="join shadow-md">
            <button className="join-item btn btn-sm bg-white">1</button>
            <button className="join-item btn btn-sm bg-white">2</button>
            <button className="join-item btn btn-sm btn-disabled bg-white">
              ...
            </button>
            <button className="join-item btn btn-sm bg-white">99</button>
            <button className="join-item btn btn-sm bg-white">100</button>
          </div>
        </div>
      </div>
    </>
  );
}
