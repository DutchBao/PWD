import { useState } from "react";
import { Header } from "../../components/Header";
import { UserLogin } from "./UserLogin";
import { ChangePassword } from "./ChangePassword";
import { DigitalIdView } from "./DigitalIdView";

type LoggedInUser = {
	pwdNumber: string;
	fullName: string;
	mustChangePassword: boolean;
	currentPassword: string;
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
					<UserLogin
						onLoginSuccess={(userData) =>
							setUser({ ...userData, currentPassword: "" })
						}
					/>
				) : user.mustChangePassword ? (
					<ChangePassword
						pwdNumber={user.pwdNumber}
						oldPassword={user.currentPassword || "123"}
						onChanged={() =>
							setUser((prev) =>
								prev ? { ...prev, mustChangePassword: false } : prev,
							)
						}
					/>
				) : (
					<DigitalIdView user={user} onLogout={() => setUser(null)} />
				)}
			</main>
		</div>
	);
}
