import { useState } from "react";
import { Mail, ArrowRight, ArrowLeft } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

interface Props {
	onBack: () => void;
}

export function ForgotPassword({ onBack }: Props) {
	const [pwdNumber, setPwdNumber] = useState("");
	const [submitted, setSubmitted] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		const { error: fnError } = await supabase.functions.invoke(
			"forgot-password",
			{ body: { userName: pwdNumber } },
		);

		setLoading(false);

		if (fnError) {
			setError("Something went wrong. Please try again.");
			return;
		}

		setSubmitted(true);
	};

	return (
		<div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center p-4 font-Jakarta">
			<div className="w-full max-w-md bg-white border border-slate-200/80 rounded-3xl shadow-xl p-8 space-y-6">
				<div className="text-center space-y-2">
					<div className="w-14 h-14 bg-blue-50 text-[#0038a8] rounded-2xl flex items-center justify-center mx-auto border border-blue-100">
						<Mail className="w-7 h-7" />
					</div>
					<h2 className="text-2xl font-bold font-Libre text-slate-900">
						Reset Your Password
					</h2>
					<p className="text-xs font-medium text-slate-500 max-w-xs mx-auto">
						Enter your PWD ID number and we'll email a temporary password to the
						address on file.
					</p>
				</div>

				{submitted ? (
					<div className="text-center space-y-4">
						<p className="text-sm font-medium text-slate-700">
							If that PWD ID number exists in our system, a temporary password
							has been sent to the registered email address.
						</p>
						<button
							onClick={onBack}
							className="w-full bg-[#0038a8] hover:bg-[#002d86] text-white font-bold text-xs py-3.5 rounded-xl shadow-md flex items-center justify-center space-x-2 cursor-pointer">
							<ArrowLeft className="w-4 h-4" />
							<span>Back to Login</span>
						</button>
					</div>
				) : (
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label className="block text-xs font-bold text-slate-700 mb-1.5">
								PWD ID Number
							</label>
							<input
								type="text"
								required
								value={pwdNumber}
								onChange={(e) => setPwdNumber(e.target.value)}
								placeholder="e.g. PWD-2024-001"
								className="w-full text-xs font-semibold px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0038a8]/20 focus:border-[#0038a8] font-mono"
							/>
						</div>

						{error && (
							<p className="text-xs font-semibold text-rose-600">{error}</p>
						)}

						<button
							type="submit"
							disabled={loading}
							className="w-full bg-[#0038a8] hover:bg-[#002d86] text-white font-bold text-xs py-3.5 rounded-xl shadow-md flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60">
							<span>{loading ? "Sending..." : "Send Temporary Password"}</span>
							<ArrowRight className="w-4 h-4" />
						</button>

						<button
							type="button"
							onClick={onBack}
							className="w-full text-xs font-bold text-slate-500 hover:text-slate-700 flex items-center justify-center gap-1.5 cursor-pointer pt-1">
							<ArrowLeft className="w-3.5 h-3.5" />
							Back to Login
						</button>
					</form>
				)}
			</div>
		</div>
	);
}
