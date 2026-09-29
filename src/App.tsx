import { Route, Routes } from "react-router-dom";
import { MainLayout } from "./components/MainLayout";

import { HomePage } from "./pages/Homepage";
import { Register } from "./pages/Registration/Register";
import { MerchantPortalController } from "./pages/Merchant/MerchantPortal";
import { AdminPortalController } from "./pages/Admin/AdminPortal";
import { UserPortalController } from "./pages/User/UserPortal";

export function App() {
	return (
		<Routes>
			<Route element={<MainLayout />}>
				<Route path="/" element={<HomePage />}></Route>
				<Route path="/Register" element={<Register />} />
				<Route path="/Merchant" element={<MerchantPortalController />} />
				<Route path="/Admin" element={<AdminPortalController />} />
				<Route path="/User" element={<UserPortalController />} />
			</Route>
		</Routes>
	);
}
