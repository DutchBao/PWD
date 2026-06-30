import { Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/Homepage";
import { Disability, Personal, Document, Success } from "./pages/Registration";
import { MainLayout } from "./components/MainLayout";
import { MerchantPortalController } from "./pages/Merchant/MerchantPortal";
import { AdminPortalController } from "./pages/Admin/AdminPortal";

export function App() {
	return (
		<Routes>
			<Route element={<MainLayout />}>
				<Route path="/" element={<HomePage />}></Route>
				<Route path="/Register-Personal-Information" element={<Personal />} />
				<Route path="/Register-Disability-Profile" element={<Disability />} />
				<Route path="/Register-Document" element={<Document />} />
				<Route path="/Register-Success" element={<Success />} />
				<Route path="/Merchant" element={<MerchantPortalController />} />
				<Route path="/Admin" element={<AdminPortalController />} />
			</Route>
		</Routes>
	);
}
