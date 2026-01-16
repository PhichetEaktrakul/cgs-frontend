export default function GoldTypeToggle({ selected, setSelected }) {
  const options = [
    { id: "99", label: "ทอง 99.99%", value: "1" },
    { id: "96", label: "ทอง 96.50%", value: "2" },
  ];
  return (
    <>
      <div className="flex items-center px-3 py-2">
        <p>ประเภททองที่ขายฝาก</p>

        <div
          role="radiogroup"
          aria-label="ประเภททอง"
          className="inline-grid grid-cols-2 gap-2 bg-gray-200 rounded-full p-1 ml-4">
          {options.map((opt) => {
            const isActive = selected === opt.value;
            return (
              <label
                key={opt.id}
                role="radio"
                aria-checked={isActive}
                tabIndex={0}
                onClick={() => setSelected(opt.value)}
                className={
                  "flex items-center justify-center cursor-pointer select-none px-4 py-1.5 rounded-full transition-all text-sm font-medium " +
                  (isActive
                    ? "bg-[#2a53b3fc] text-white shadow-sm"
                    : "text-gray-700 hover:bg-gray-300")
                }>
                <input
                  className="sr-only"
                  type="radio"
                  name="gold_percent"
                  value={opt.value}
                  checked={isActive}
                  onChange={() => setSelected(opt.value)}
                />
                <span>{opt.label}</span>
              </label>
            );
          })}
        </div>
      </div>
    </>
  );
}
