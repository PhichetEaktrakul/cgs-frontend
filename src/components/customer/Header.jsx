import headLogo from "../../assets/logo.png";

export default function NavCust({ top, bottom }) {
  return (
    <div className="max-w-md m-auto pt-4 bg-gradient-to-br from-[#1c3c86fc] from-20% via-[#1c6a8ffc] via-45% to-[#28fa5dfc] to-80%">
      {/* ---------- Logo Section ---------- */}
      <div className="flex justify-center mb-4">
        <img className="max-w-[90px]" src={headLogo} alt="Company logo" />
      </div>

      {/* ---------- Top Content ---------- */}
      {top}

      {/* ---------- Bottom Content ---------- */}
      <div className="bg-white rounded-t-xl p-3 text-black">{bottom}</div>
    </div>
  );
}
