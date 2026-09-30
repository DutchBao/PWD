import React, { useState } from "react";
import { ArrowRight, Shield, Eye, EyeOff } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

export interface AdminUser {
	authId: string;
	UserName: string;
	fullName: string;
}

interface AdminLoginProps {
	onLoginSuccess: (userData: AdminUser) => void;
}

export function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		// 1. Supabase verifies the password on its servers
		const { data: authData, error: authError } =
			await supabase.auth.signInWithPassword({
				email: email,
				password,
			});

		if (authError || !authData.user) {
			setLoading(false);
			setError("Invalid email or password.");
			return;
		}

		// 2. Look up this account's profile and role
		const { data: profile, error: profileError } = await supabase
			.from("admins")
			.select("user_name, full_name")
			.eq("auth_id", authData.user.id)
			.maybeSingle();

		if (profileError || !profile) {
			await supabase.auth.signOut();
			setLoading(false);
			setError("This account is not authorized for the admin portal.");
			return;
		}

		setLoading(false);
		onLoginSuccess({
			authId: authData.user.id,
			UserName: profile.user_name,
			fullName: profile.full_name ?? "",
		});
	};

	const [showPassword, setShowPassword] = useState(false);

	return (
		<div className="w-full min-h-[calc(100vh-72px)] bg-input-background flex flex-col items-center justify-center pt-16 pb-12 px-4 font-Jakarta text-foreground antialiased animate-fadeIn">
			<div className="w-14 h-14 bg-[#4f46e5] text-white rounded-2xl flex items-center justify-center shadow-md mb-5 transform transition hover:scale-105">
				<Shield className="w-6 h-6" />
			</div>

			<div className="text-center space-y-2 mb-8">
				<h2 className="text-3xl font-Libre font-bold tracking-tight text-foreground">
					MSWDO Admin Portal
				</h2>
				<p className="text-sm text-muted-foreground/90 font-medium">
					Authorized personnel only • Guagua MSWDO
				</p>
			</div>

			<div className="w-full max-w-md bg-white border border-slate-200/60 rounded-3xl shadow-xl p-8 md:p-10 space-y-6">
				<form onSubmit={handleSubmit} className="space-y-5">
					<div className="space-y-2">
						<label
							htmlFor="admin-email"
							className="text-sm font-bold text-foreground tracking-wide block">
							Admin Email
						</label>
						<input
							id="admin-email"
							type="email"
							required
							autoComplete="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="e.g. admin@guagua-mswdo.gov.ph"
							className="w-full text-sm font-DM px-4 py-3 bg-[#f8fafc] border border-slate-200 rounded-xl placeholder:text-slate-400/70 focus:outline-hidden focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] transition"
						/>
					</div>

					<div className="space-y-2">
						<label
							htmlFor="admin-password"
							className="text-sm font-bold text-foreground tracking-wide block">
							Password
						</label>
						<div className="relative">
							<input
								id="admin-password"
								type={showPassword ? "text" : "password"}
								required
								autoComplete="current-password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="••••••••"
								className="w-full text-sm font-DM pl-4 pr-12 py-3 bg-[#f8fafc] border border-slate-200 rounded-xl placeholder:text-slate-400/70 focus:outline-hidden focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] transition"
							/>
							<button
								type="button"
								onClick={() => setShowPassword((prev) => !prev)}
								aria-label={showPassword ? "Hide password" : "Show password"}
								className="absolute inset-y-0 right-0 px-4 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer">
								{showPassword ? (
									<EyeOff className="w-4 h-4" />
								) : (
									<Eye className="w-4 h-4" />
								)}
							</button>
						</div>
					</div>

					{error && (
						<p role="alert" className="text-xs font-semibold text-rose-600">
							{error}
						</p>
					)}

					<button
						type="submit"
						disabled={loading}
						className="w-full bg-[#0038a8] hover:bg-[#002d86] text-white font-bold text-xs py-3.5 rounded-xl shadow-md transition-colors flex items-center justify-center space-x-2 cursor-pointer mt-2 disabled:opacity-60">
						<span>{loading ? "Checking..." : "Access Admin Dashboard"}</span>
						<ArrowRight className="w-4 h-4" />
					</button>
				</form>

				<p className="text-[11px] text-muted-foreground text-center pt-1.5">
					For access issues, contact your IT administrator.
				</p>
			</div>

			<div className="text-center mt-8 flex items-center justify-center gap-1.5 opacity-80">
				<Shield className="w-3.5 h-3.5 text-muted-foreground" />
				<p className="text-xs text-muted-foreground font-medium">
					This portal is for authorized MSWDO staff only.
				</p>
			</div>

			<style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.25s ease-out forwards; }
      `}</style>
		</div>
	);
}
