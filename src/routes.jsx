import { Route, Routes } from "react-router";
import InitialPage from "./pages/common/InitialPage";
import Menu from "./pages/customer/Menu";
import Pledge from "./pages/customer/Pledge";
import History from "./pages/customer/History";
import Interest from "./pages/customer/Interest";
import Redeem from "./pages/customer/Redeem";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProtectedLayout from "./components/common/ProtectedLayout";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<InitialPage />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/pledge" element={<Pledge />} />
      <Route path="/history" element={<History />} />
      <Route path="/interest" element={<Interest />} />
      <Route path="/redeem" element={<Redeem />} />
      <Route path="/admin/auth" element={<AdminLogin />} />
      <Route element={<ProtectedLayout />}>
        <Route path="/admin/dashboard/" element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
