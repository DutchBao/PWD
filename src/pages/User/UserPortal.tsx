import { useState } from "react";
import { Header } from "../../components/Header";
import { UserLogin } from "./UserLogin";
import { ForgotPassword } from "./ForgotPassword";
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
	const [showForgotPassword, setShowForgotPassword] = useState(false);

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
					showForgotPassword ? (
						<ForgotPassword onBack={() => setShowForgotPassword(false)} />
					) : (
						<UserLogin
							onLoginSuccess={(userData) => setUser(userData)}
							onForgotPassword={() => setShowForgotPassword(true)}
						/>
					)
				) : user.mustChangePassword ? (
					<ChangePassword
						pwdNumber={user.pwdNumber}
						oldPassword={user.currentPassword}
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
