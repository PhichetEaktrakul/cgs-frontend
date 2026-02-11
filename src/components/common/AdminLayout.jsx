import { Outlet } from "react-router";
import { PriceProvider } from "../../context/PriceContext";
import Navbar from "../admin/Navbar";

export default function AdminLayout() {
  return (
    <PriceProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-y-auto px-4 py-8 bg-slate-100">
          <div className="flex justify-center">
            <Outlet />
          </div>
        </main>
      </div>
    </PriceProvider>
  );
}
