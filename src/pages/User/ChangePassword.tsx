import { useState } from "react";
import { Lock, ArrowRight } from "lucide-react";
import { supabase } from "../../createClient";

interface Props {
	pwdNumber: string;
	oldPassword: string;
	onChanged: () => void;
}

export function ChangePassword({ pwdNumber, oldPassword, onChanged }: Props) {
	const [newPassword, setNewPassword] = useState("");
	const [confirm, setConfirm] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (newPassword !== confirm) {
			setError("Passwords do not match.");
			return;
		}

		setLoading(true);
		const { data, error: fnError } = await supabase.functions.invoke(
			"change-password",
			{ body: { userName: pwdNumber, oldPassword, newPassword } },
		);
		setLoading(false);

		if (fnError || !data?.ok) {
			setError(data?.error ?? "Could not change your password.");
			return;
		}

		onChanged();
	};

	return (
		<div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center p-4 font-Jakarta">
			<div className="w-full max-w-md bg-white border border-slate-200/80 rounded-3xl shadow-xl p-8 space-y-6">
				<div className="text-center space-y-2">
					<div className="w-14 h-14 bg-blue-50 text-[#0038a8] rounded-2xl flex items-center justify-center mx-auto border border-blue-100">
						<Lock className="w-7 h-7" />
					</div>
					<h2 className="text-2xl font-bold font-Libre text-slate-900">
						Set a New Password
					</h2>
					<p className="text-xs font-medium text-slate-500 max-w-xs mx-auto">
						For your security, you must set a new password before continuing.
					</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-xs font-bold text-slate-700 mb-1.5">
							New Password
						</label>
						<input
							type="password"
							required
							minLength={6}
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							className="w-full text-xs font-semibold px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0038a8]/20 focus:border-[#0038a8]"
						/>
					</div>
					<div>
						<label className="block text-xs font-bold text-slate-700 mb-1.5">
							Confirm Password
						</label>
						<input
							type="password"
							required
							minLength={6}
							value={confirm}
							onChange={(e) => setConfirm(e.target.value)}
							className="w-full text-xs font-semibold px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0038a8]/20 focus:border-[#0038a8]"
						/>
					</div>

					{error && (
						<p className="text-xs font-semibold text-rose-600">{error}</p>
					)}

					<button
						type="submit"
						disabled={loading}
						className="w-full bg-[#0038a8] hover:bg-[#002d86] text-white font-bold text-xs py-3.5 rounded-xl shadow-md flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60">
						<span>{loading ? "Saving..." : "Save New Password"}</span>
						<ArrowRight className="w-4 h-4" />
					</button>
				</form>
			</div>
		</div>
	);
}
