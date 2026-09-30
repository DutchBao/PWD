import { useState } from "react";
import { Header } from "../../components/Header";
import { MerchantLogin, type MerchantUser } from "./MerchantLogin";
import { MerchantPage } from "./MerchantPage";
import { supabase } from "../../lib/supabaseClient";

export function MerchantPortalController() {
	const [merchant, setMerchant] = useState<MerchantUser | null>(null);
	const isAuthenticated = merchant !== null;

	const handleLogout = async () => {
		await supabase.auth.signOut();
		setMerchant(null);
	};

	return (
		<div className="min-h-screen bg-input-background text-foreground flex flex-col justify-between">
			<Header
				showHomeButton={!isAuthenticated}
				Username={isAuthenticated ? merchant.username : undefined}
				establishmentName={
					isAuthenticated ? merchant.establishmentName : undefined
				}
				onLogout={isAuthenticated ? handleLogout : undefined}
			/>

			<main className="flex-1 w-full flex items-center justify-center">
				{!isAuthenticated ? (
					<MerchantLogin onLoginSuccess={(userData) => setMerchant(userData)} />
				) : (
					<MerchantPage onLogout={handleLogout} />
				)}
			</main>
		</div>
	);
}
