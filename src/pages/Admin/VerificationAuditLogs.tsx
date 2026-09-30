import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Download, CheckCircle, AlertTriangle } from "lucide-react";

interface VerificationLog {
	log_id: string;
	TimeStamp: string;
	pwdName: string | null;
	pwdNum: string | null;
	Establishment: string | null;
	Account: string | null;
	Result: string | null;
}

export function VerificationAuditLogs() {
	const [logs, setLogs] = useState<VerificationLog[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchLogs = async () => {
			const { data, error } = await supabase
				.from("VerificationLogs")
				.select("*")
				.order("TimeStamp", { ascending: false })
				.limit(100);

			if (error) {
				console.error("Error fetching verification logs:", error);
			} else {
				setLogs(data ?? []);
			}
			setLoading(false);
		};

		fetchLogs();
	}, []);

	const exportCsv = () => {
		const header = [
			"Timestamp",
			"PWD Name",
			"PWD ID",
			"Establishment",
			"Scanner Account",
			"Result",
		];
		const rows = logs.map((log) => [
			log.TimeStamp,
			log.pwdName ?? "",
			log.pwdNum ?? "",
			log.Establishment ?? "",
			log.Account ?? "",
			log.Result,
		]);
		const csv = [header, ...rows]
			.map((row) =>
				row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
			)
			.join("\n");

		const blob = new Blob([csv], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `verification-logs-${new Date().toISOString().slice(0, 10)}.csv`;
		a.click();
		URL.revokeObjectURL(url);
	};

	return (
		<div className="bg-white rounded-2xl border border-slate-200/60 shadow-xl overflow-hidden font-Jakarta animate-fadeIn">
			<div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white">
				<div className="space-y-0.5">
					<h3 className="text-base font-bold text-foreground">
						Verification Audit Log
					</h3>
					<p className="text-xs text-muted-foreground font-medium">
						Complete record of all QR scan authentication events
					</p>
				</div>
				<button
					onClick={exportCsv}
					disabled={logs.length === 0}
					className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition self-end sm:self-auto cursor-pointer shadow-xs disabled:opacity-40 disabled:cursor-not-allowed">
					<Download className="w-4 h-4 text-slate-500" /> Export CSV
				</button>
			</div>

			<div className="overflow-x-auto">
				<table className="w-full border-collapse text-left text-xs">
					<thead>
						<tr className="bg-slate-100 font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200/60">
							<th className="p-4">Timestamp</th>
							<th className="p-4">PWD Name</th>
							<th className="p-4">PWD ID</th>
							<th className="p-4">Establishment</th>
							<th className="p-4">Scanner Account</th>
							<th className="p-4">Result</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-100 font-medium text-slate-700">
						{loading ? (
							<tr>
								<td colSpan={6} className="p-6 text-center text-slate-400">
									Loading...
								</td>
							</tr>
						) : logs.length === 0 ? (
							<tr>
								<td colSpan={6} className="p-6 text-center text-slate-400">
									No verification events yet.
								</td>
							</tr>
						) : (
							logs.map((log) => {
								const isVerified = log.Result === "VERIFIED";
								return (
									<tr
										key={log.log_id}
										className="hover:bg-slate-50/50 transition">
										<td className="p-4 font-DM text-slate-500 font-medium">
											{new Date(log.TimeStamp).toLocaleString()}
										</td>
										<td className="p-4 font-bold text-foreground">
											{log.pwdName ?? "Unknown"}
										</td>
										<td className="p-4 font-DM font-bold text-slate-600 tracking-wide">
											{log.pwdNum ?? "???-????-???"}
										</td>
										<td className="p-4 text-slate-500">
											{log.Establishment ?? "—"}
										</td>
										<td className="p-4 font-DM text-slate-400 font-medium">
											{log.Account ?? "—"}
										</td>
										<td className="p-4">
											<span
												className={`inline-flex items-center gap-1 font-bold ${isVerified ? "text-emerald-600" : "text-accent"}`}>
												{isVerified ? (
													<CheckCircle className="w-3.5 h-3.5" />
												) : (
													<AlertTriangle className="w-3.5 h-3.5" />
												)}
												{log.Result}
											</span>
										</td>
									</tr>
								);
							})
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
