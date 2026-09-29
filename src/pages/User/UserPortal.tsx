import { useState } from "react";
import { Header } from "../../components/Header";
import { UserLogin } from "./UserLogin";
import { DigitalIdView } from "./DigitalIdView";

type LoggedInUser = {
	pwdNumber: string;
	fullName: string;
};

export function UserPortalController() {
	const [user, setUser] = useState<LoggedInUser | null>(null);

	return (
		<div className="min-h-screen bg-input-background text-foreground flex flex-col justify-between">
			<Header
				showHomeButton={!user}
				Username={user?.pwdNumber}
				establishmentName={user ? `${user.fullName} — Guagua` : undefined}
				onLogout={user ? () => setUser(null) : undefined}
			/>

			<main className="flex-1 w-full flex items-center justify-center">
				{!user ? (
					<UserLogin onLoginSuccess={(userData) => setUser(userData)} />
				) : (
					<DigitalIdView user={user} onLogout={() => setUser(null)} />
				)}
			</main>
		</div>
	);
}
