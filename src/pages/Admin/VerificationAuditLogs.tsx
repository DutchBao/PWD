import { Download, CheckCircle, AlertTriangle } from "lucide-react";

export function VerificationAuditLogs() {
	const logs = [
		{
			id: "LOG-0001",
			time: "Jun 20, 2025 - 2:47 PM",
			name: "Maria Santos",
			pwdId: "PWD-2024-001",
			establishment: "Mercury Drug, Guagua",
			account: "pharmacy_guagua_01",
			result: "Verified",
		},
		{
			id: "LOG-0002",
			time: "Jun 20, 2025 - 1:12 PM",
			name: "Roberto Dela Cruz",
			pwdId: "PWD-2024-002",
			establishment: "Mercury Drug, Guagua",
			account: "pharmacy_guagua_01",
			result: "Verified",
		},
		{
			id: "LOG-0003",
			time: "Jun 20, 2025 - 11:55 AM",
			name: "Unknown ID",
			pwdId: "???-????-???",
			establishment: "Mercury Drug, Guagua",
			account: "pharmacy_guagua_01",
			result: "Flagged / Unverified",
		},
		{
			id: "LOG-0004",
			time: "Jun 20, 2025 - 10:30 AM",
			name: "Ligaya Reyes",
			pwdId: "PWD-2024-034",
			establishment: "Puregold, Guagua",
			account: "puregold_guagua_03",
			result: "Verified",
		},
		{
			id: "LOG-0005",
			time: "Jun 19, 2025 - 4:01 PM",
			name: "Danilo Ocampo",
			pwdId: "PWD-2023-118",
			establishment: "SM Supermarket, San Fernando",
			account: "sm_sanfernando_02",
			result: "Verified",
		},
		{
			id: "LOG-0006",
			time: "Jun 19, 2025 - 2:15 PM",
			name: "Unknown ID",
			pwdId: "???-????-???",
			establishment: "Jollibee, Guagua",
			account: "jollibee_guagua_01",
			result: "Flagged / Unverified",
		},
		{
			id: "LOG-0007",
			time: "Jun 18, 2025 - 11:23 AM",
			name: "Simeon Lacson",
			pwdId: "PWD-2024-078",
			establishment: "Puregold, Guagua",
			account: "puregold_guagua_03",
			result: "Verified",
		},
		{
			id: "LOG-0008",
			time: "Jun 17, 2025 - 9:05 AM",
			name: "Carmelita Navarro",
			pwdId: "PWD-2024-055",
			establishment: "Mercury Drug, Guagua",
			account: "pharmacy_guagua_01",
			result: "Flagged / Unverified",
		},
	];

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
				<button className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition self-end sm:self-auto cursor-pointer shadow-xs">
					<Download className="w-4 h-4 text-slate-500" /> Export CSV
				</button>
			</div>

			<div className="overflow-x-auto">
				<table className="w-full border-collapse text-left text-xs">
					<thead>
						<tr className="bg-slate-100 font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200/60">
							<th className="p-4">Log ID</th>
							<th className="p-4">Timestamp</th>
							<th className="p-4">PWD Name</th>
							<th className="p-4">PWD ID</th>
							<th className="p-4">Establishment</th>
							<th className="p-4">Scanner Account</th>
							<th className="p-4">Result</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-100 font-medium text-slate-700">
						{logs.map((log) => {
							const isVerified = log.result === "Verified";
							return (
								<tr key={log.id} className="hover:bg-slate-50/50 transition">
									<td className="p-4 font-DM text-slate-400 font-semibold">
										{log.id}
									</td>
									<td className="p-4 font-DM text-slate-500 font-medium">
										{log.time}
									</td>
									<td className="p-4 font-bold text-foreground">{log.name}</td>
									<td className="p-4 font-DM font-bold text-slate-600 tracking-wide">
										{log.pwdId}
									</td>
									<td className="p-4 text-slate-500">{log.establishment}</td>
									<td className="p-4 font-DM text-slate-400 font-medium">
										{log.account}
									</td>
									<td className="p-4">
										<span
											className={`inline-flex items-center gap-1 font-bold ${isVerified ? "text-emerald-600" : "text-accent"}`}>
											{isVerified ? (
												<CheckCircle className="w-3.5 h-3.5" />
											) : (
												<AlertTriangle className="w-3.5 h-3.5" />
											)}
											{log.result}
										</span>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
}
