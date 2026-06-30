import React, { useState } from "react";
import { Camera } from "lucide-react";

interface MerchantLoginProps {
	onLoginSuccess: () => void;
}

export function MerchantLogin({ onLoginSuccess }: MerchantLoginProps) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onLoginSuccess();
	};

	return (
		<div className="w-full flex flex-col items-center justify-center pt-24 pb-12 px-4 animate-fadeIn">
			{/* Centered Decorative Floating App Emblem Icon */}
			<div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-md mb-5 transform transition hover:scale-105">
				<Camera className="w-6 h-6" />
			</div>

			{/* Main Typography Header Section */}
			<div className="text-center space-y-2 mb-8">
				<h2 className="text-3xl font-Libre font-bold tracking-tight text-foreground">
					Merchant / Verifier Portal
				</h2>
				<p className="text-sm font-Jakarta text-muted-foreground">
					Sign in with your store-issued MSWDO credentials
				</p>
			</div>

			{/* Form Interaction Card Block Container */}
			<div className="w-full max-w-md bg-card border border-border-hairline rounded-3xl shadow-xl p-8 md:p-10 space-y-6">
				<form onSubmit={handleSubmit} className="space-y-5">
					{/* Username Data Field Input */}
					<div className="space-y-2">
						<label className="text-sm font-bold text-foreground tracking-wide block">
							Username
						</label>
						<input
							type="text"
							required
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							placeholder="e.g. pharmacy_guagua_01"
							className="w-full text-sm font-DM px-4 py-3 bg-input-background border border-border-hairline rounded-xl placeholder:text-muted-foreground/60 focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
						/>
					</div>

					{/* Password Data Field Input */}
					<div className="space-y-2">
						<label className="text-sm font-bold text-foreground tracking-wide block">
							Password
						</label>
						<input
							type="password"
							required
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="••••••••"
							className="w-full text-sm font-DM px-4 py-3 bg-input-background border border-border-hairline rounded-xl placeholder:text-muted-foreground/60 focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary tracking-widest transition"
						/>
					</div>

					{/* Submit Action Button Container */}
					<button
						type="submit"
						className="w-full bg-primary hover:bg-[#002d87] text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-md tracking-wide mt-2 active:scale-[0.99] cursor-pointer">
						Sign In to Scanning Portal
					</button>
				</form>

				{/* Dynamic Help Metadata Footer Link */}
				<p className="text-[11px] text-muted-foreground text-center pt-2">
					Contact your MSWDO liaison officer for login assistance.
				</p>
			</div>

			{/* Bottom Secondary Citizen Redirection Target Link */}
			<div className="text-center mt-8">
				<p className="text-sm text-muted-foreground">
					Are you a PWD beneficiary?{" "}
					<a
						href="/view-id"
						className="text-primary font-bold hover:underline inline-flex items-center gap-1 transition">
						View your ID →
					</a>
				</p>
			</div>
		</div>
	);
}
