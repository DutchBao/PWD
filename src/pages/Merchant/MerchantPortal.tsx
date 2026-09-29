import { useState } from "react";
import { Header } from "../../components/Header";
import { MerchantLogin } from "./MerchantLogin";
import { MerchantPage } from "./MerchantPage";

export function MerchantPortalController() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	return (
		<div className="min-h-screen bg-input-background text-foreground flex flex-col justify-between">
			<Header
				showHomeButton={!isAuthenticated}
				Username={isAuthenticated ? "pharmacy_guagua_01" : undefined}
				establishmentName={
					isAuthenticated ? "Mercury Drug — Guagua" : undefined
				}
				onLogout={isAuthenticated ? () => setIsAuthenticated(false) : undefined}
			/>

			<main className="flex-1 w-full flex items-center justify-center">
				{!isAuthenticated ? (
					<MerchantLogin onLoginSuccess={() => setIsAuthenticated(true)} />
				) : (
					<MerchantPage
						onLogout={function (): void {
							throw new Error("Function not implemented.");
						}}
					/>
				)}
			</main>
		</div>
	);
}
