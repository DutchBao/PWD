import React, { useState } from "react";
import { Shield } from "lucide-react";

interface AdminLoginProps {
	onLoginSuccess: () => void;
}

export function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onLoginSuccess();
	};

	return (
		<div className="w-full min-h-[calc(100vh-72px)] bg-input-background flex flex-col items-center justify-center pt-16 pb-12 px-4 font-Jakarta text-foreground antialiased animate-fadeIn">
			{/* Centered Decorative Security Shield Badge */}
			<div className="w-14 h-14 bg-[#4f46e5] text-white rounded-2xl flex items-center justify-center shadow-md mb-5 transform transition hover:scale-105">
				<Shield className="w-6 h-6" />
			</div>

			{/* Institutional Admin Header Section */}
			<div className="text-center space-y-2 mb-8">
				<h2 className="text-3xl font-Libre font-bold tracking-tight text-foreground">
					MSWDO Admin Portal
				</h2>
				<p className="text-sm text-muted-foreground/90 font-medium">
					Authorized personnel only • Guagua MSWDO
				</p>
			</div>

			{/* Login Interaction Card Block Container */}
			<div className="w-full max-w-md bg-white border border-slate-200/60 rounded-3xl shadow-xl p-8 md:p-10 space-y-6">
				<form onSubmit={handleSubmit} className="space-y-5">
					{/* Admin Username Field Input */}
					<div className="space-y-2">
						<label className="text-sm font-bold text-foreground tracking-wide block">
							Admin Username
						</label>
						<input
							type="text"
							required
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							placeholder="e.g. admin_mswdo_guagua"
							className="w-full text-sm font-DM px-4 py-3 bg-[#f8fafc] border border-slate-200 rounded-xl placeholder:text-slate-400/70 focus:outline-hidden focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] transition"
						/>
					</div>

					{/* Password Field Input */}
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
							className="w-full text-sm font-DM px-4 py-3 bg-[#f8fafc] border border-slate-200 rounded-xl placeholder:text-slate-400/70 focus:outline-hidden focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] tracking-widest transition"
						/>
					</div>

					{/* Dashboard Access Action Trigger Button */}
					<button
						type="submit"
						className="w-full bg-[#4f46e5] hover:bg-status-admin text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-md tracking-wide mt-2 active:scale-[0.99] cursor-pointer">
						Access Admin Dashboard
					</button>
				</form>

				{/* Technical Support Metadata Info Text */}
				<p className="text-[11px] text-muted-foreground text-center pt-1.5">
					For access issues, contact your IT administrator.
				</p>
			</div>

			{/* Persistent Bottom Security Notice Badge */}
			<div className="text-center mt-8 flex items-center justify-center gap-1.5 opacity-80">
				<Shield className="w-3.5 h-3.5 text-muted-foreground" />
				<p className="text-xs text-muted-foreground font-medium">
					This portal is for authorized MSWDO staff only.
				</p>
			</div>

			{/* View Injection Styling Animations */}
			<style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.25s ease-out forwards; }
      `}</style>
		</div>
	);
}
