import React, { useState } from "react";
import { Camera } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

export interface MerchantUser {
	authId: string;
	username: string;
	establishmentName: string;
}

interface MerchantLoginProps {
	onLoginSuccess: (userData: MerchantUser) => void;
}

export function MerchantLogin({ onLoginSuccess }: MerchantLoginProps) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		const { data: authData, error: authError } =
			await supabase.auth.signInWithPassword({ email, password });

		if (authError || !authData.user) {
			setLoading(false);
			setError("Invalid email or password.");
			return;
		}

		const { data: profile, error: profileError } = await supabase
			.from("merchants")
			.select("username, establishment_name")
			.eq("auth_id", authData.user.id)
			.maybeSingle();

		if (profileError || !profile) {
			await supabase.auth.signOut();
			setLoading(false);
			setError("This account is not authorized for the merchant portal.");
			return;
		}

		setLoading(false);
		onLoginSuccess({
			authId: authData.user.id,
			username: profile.username,
			establishmentName: profile.establishment_name ?? "",
		});
	};

	return (
		<div className="w-full flex flex-col items-center justify-center pt-24 pb-12 px-4 animate-fadeIn">
			<div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-md mb-5 transform transition hover:scale-105">
				<Camera className="w-6 h-6" />
			</div>

			<div className="text-center space-y-2 mb-8">
				<h2 className="text-3xl font-Libre font-bold tracking-tight text-foreground">
					Merchant / Verifier Portal
				</h2>
				<p className="text-sm font-Jakarta text-muted-foreground">
					Sign in with your store-issued MSWDO credentials
				</p>
			</div>

			<div className="w-full max-w-md bg-card border border-border-hairline rounded-3xl shadow-xl p-8 md:p-10 space-y-6">
				<form onSubmit={handleSubmit} className="space-y-5">
					<div className="space-y-2">
						<label className="text-sm font-bold text-foreground tracking-wide block">
							Email
						</label>
						<input
							type="email"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="e.g. pharmacy_guagua_01@store.ph"
							className="w-full text-sm font-DM px-4 py-3 bg-input-background border border-border-hairline rounded-xl placeholder:text-muted-foreground/60 focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
						/>
					</div>

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

					{error && (
						<p className="text-xs font-semibold text-rose-600">{error}</p>
					)}

					<button
						type="submit"
						disabled={loading}
						className="w-full bg-primary hover:bg-[#002d87] text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-md tracking-wide mt-2 active:scale-[0.99] cursor-pointer disabled:opacity-60">
						{loading ? "Checking..." : "Sign In to Scanning Portal"}
					</button>
				</form>

				<p className="text-[11px] text-muted-foreground text-center pt-2">
					Contact your MSWDO liaison officer for login assistance.
				</p>
			</div>
		</div>
	);
}
