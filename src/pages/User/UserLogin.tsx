import React, { useState } from "react";
import {
	User,
	Lock,
	ArrowRight,
	ShieldCheck,
	HelpCircle,
	Eye,
	EyeOff,
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

interface UserLoginProps {
	onLoginSuccess?: (userData: {
		pwdNumber: string;
		fullName: string;
		mustChangePassword: boolean;
		currentPassword: string;
	}) => void;
	onForgotPassword?: () => void;
}

export function UserLogin({
	onLoginSuccess,
	onForgotPassword,
}: UserLoginProps) {
	const [pwdNumber, setPwdNumber] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		const { data, error: fnError } = await supabase.functions.invoke(
			"login-user",
			{ body: { userName: pwdNumber, password } },
		);

		setLoading(false);

		if (fnError || !data?.ok) {
			setError("Invalid PWD ID number or password.");
			return;
		}

		onLoginSuccess?.({
			pwdNumber: data.userName,
			fullName: data.fullName,
			mustChangePassword: data.mustChangePassword,
			currentPassword: password,
		});
	};

	return (
		<div className="min-h-screen bg-[#f1f5f9] flex flex-col font-Jakarta text-slate-800 antialiased relative">
			<main className="flex-1 flex items-center justify-center p-4 my-6">
				<div className="w-full max-w-md bg-white border border-slate-200/80 rounded-3xl shadow-xl overflow-hidden p-8 space-y-6">
					<div className="text-center space-y-2">
						<div className="w-14 h-14 bg-blue-50 text-[#0038a8] rounded-2xl flex items-center justify-center mx-auto border border-blue-100 shadow-xs">
							<User className="w-7 h-7" />
						</div>
						<h2 className="text-2xl font-bold font-Libre text-slate-900 tracking-tight">
							Beneficiary Portal Login
						</h2>
						<p className="text-xs font-medium text-slate-500 max-w-xs mx-auto">
							Access your official PWD Digital ID card, benefits log, and
							discount verification code.
						</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label className="block text-xs font-bold text-slate-700 tracking-wide mb-1.5">
								PWD ID Number
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
									<User className="w-4 h-4" />
								</div>
								<input
									type="text"
									value={pwdNumber}
									onChange={(e) => setPwdNumber(e.target.value)}
									placeholder="e.g. PWD-2024-001"
									required
									className="w-full text-xs font-semibold pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0038a8]/20 focus:border-[#0038a8] transition-all text-slate-800 placeholder:text-slate-400 font-mono"
								/>
							</div>
						</div>

						<div>
							<div className="flex justify-between items-center mb-1.5">
								<label className="block text-xs font-bold text-slate-700 tracking-wide">
									Password
								</label>
								<button
									type="button"
									onClick={() => onForgotPassword?.()}
									className="text-[11px] font-bold text-[#0038a8] hover:underline cursor-pointer">
									Forgot Password?
								</button>
							</div>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
									<Lock className="w-4 h-4" />
								</div>
								<input
									type={showPassword ? "text" : "password"}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="••••••••"
									required
									className="w-full text-xs font-semibold pl-10 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0038a8]/20 focus:border-[#0038a8] transition-all text-slate-800 placeholder:text-slate-400"
								/>
								<button
									type="button"
									onClick={() => setShowPassword((prev) => !prev)}
									aria-label={showPassword ? "Hide password" : "Show password"}
									className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer">
									{showPassword ? (
										<EyeOff className="w-4 h-4" />
									) : (
										<Eye className="w-4 h-4" />
									)}
								</button>
							</div>
						</div>

						{error && (
							<p className="text-xs font-semibold text-rose-600">{error}</p>
						)}

						<button
							type="submit"
							disabled={loading}
							className="w-full bg-[#0038a8] hover:bg-[#002d86] text-white font-bold text-xs py-3.5 rounded-xl shadow-md transition-colors flex items-center justify-center space-x-2 cursor-pointer mt-2 disabled:opacity-60">
							<span>{loading ? "Checking..." : "View My Digital ID"}</span>
							<ArrowRight className="w-4 h-4" />
						</button>
					</form>

					<div className="p-3.5 bg-blue-50/60 border border-blue-100 rounded-2xl flex items-start space-x-3 text-left">
						<ShieldCheck className="w-4 h-4 text-[#0038a8] shrink-0 mt-0.5" />
						<div className="text-[11px]">
							<p className="font-bold text-slate-800">
								Don't have a Digital ID yet?
							</p>
							<p className="text-slate-500 font-medium mt-0.5">
								Complete your online disability registration or visit the MSWDO
								office to claim your account.
							</p>
							<Link
								to="/Register"
								className="inline-block mt-2 text-xs font-bold text-[#0038a8] hover:underline">
								Apply for Registration →
							</Link>
						</div>
					</div>
				</div>
			</main>

			<footer className="w-full bg-[#071330] text-white/70 text-[10px] py-3 text-center space-y-0.5 mt-auto">
				<p className="font-semibold">
					Office for Persons with Disabilities Affairs — Guagua, Pampanga
				</p>
				<p className="text-white/50">
					For assistance, contact the PDAO at (045) 900–0000
				</p>
			</footer>

			<button
				type="button"
				className="fixed bottom-4 right-4 bg-slate-800 text-white p-2.5 rounded-full shadow-lg hover:bg-slate-700 transition-colors cursor-pointer">
				<HelpCircle className="w-5 h-5" />
			</button>
		</div>
	);
}
