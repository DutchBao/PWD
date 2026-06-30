import {
	Search,
	PlusCircle,
	Download,
	Edit2,
	Trash2,
	RefreshCw,
} from "lucide-react";

export function PwdRegistry() {
	const registryData = [
		{
			id: "PWD-2024-001",
			name: "Maria Santos",
			disability: "Visual Impairment",
			barangay: "Brgy. San Nicolas",
			validUntil: "Jan 15, 2026",
			status: "ACTIVE",
		},
		{
			id: "PWD-2024-002",
			name: "Roberto Dela Cruz",
			disability: "Orthopedic Disability",
			barangay: "Brgy. Maquiapo",
			validUntil: "Feb 3, 2026",
			status: "ACTIVE",
		},
		{
			id: "PWD-2024-034",
			name: "Ligaya Reyes",
			disability: "Hearing Impairment",
			barangay: "Brgy. Betis",
			validUntil: "Mar 8, 2026",
			status: "ACTIVE",
		},
		{
			id: "PWD-2023-118",
			name: "Danilo Ocampo",
			disability: "Speech and Language Impairment",
			barangay: "Brgy. Ascomo",
			validUntil: "Nov 20, 2025",
			status: "ACTIVE",
		},
		{
			id: "PWD-2024-055",
			name: "Carmelita Navarro",
			disability: "Chronic Illness",
			barangay: "Brgy. Pulungmasle",
			validUntil: "Apr 1, 2025",
			status: "EXPIRED",
		},
		{
			id: "PWD-2024-078",
			name: "Simeon Lacson",
			disability: "Mental / Psychosocial Disability",
			barangay: "Brgy. San Vicente",
			validUntil: "Jun 10, 2026",
			status: "ACTIVE",
		},
	];

	return (
		<div className="space-y-4 font-Jakarta animate-fadeIn">
			{/* Top Operational Utility Action Toolbar */}
			<div className="w-full flex flex-col sm:flex-row gap-3 items-center justify-between">
				<div className="relative w-full sm:max-w-xl">
					<Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
					<input
						type="text"
						placeholder="Search by name, ID, or disability type..."
						className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
					/>
				</div>
				<div className="flex items-center space-x-2 w-full sm:w-auto shrink-0">
					<button className="flex-1 sm:flex-none px-4 py-2.5 bg-primary hover:bg-blue-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer">
						<PlusCircle className="w-4 h-4" /> Add Record
					</button>
					<button className="flex-1 sm:flex-none px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer">
						<Download className="w-4 h-4 text-slate-500" /> Export
					</button>
				</div>
			</div>

			{/* Core Registry Listing Frame Sheet Container */}
			<div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
				<div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50">
					<span className="text-xs font-semibold text-slate-500 font-DM">
						6 records found
					</span>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full border-collapse text-left text-xs">
						<thead>
							<tr className="bg-slate-100 font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200/60">
								<th className="p-4">PWD ID</th>
								<th className="p-4">Name</th>
								<th className="p-4">Disability</th>
								<th className="p-4">Barangay</th>
								<th className="p-4">Valid Until</th>
								<th className="p-4">Status</th>
								<th className="p-4 text-center">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100 font-medium text-slate-700">
							{registryData.map((row) => (
								<tr key={row.id} className="hover:bg-slate-50/50 transition">
									<td className="p-4 font-DM font-bold text-primary tracking-wide">
										{row.id}
									</td>
									<td className="p-4 font-bold text-foreground text-sm">
										{row.name}
									</td>
									<td className="p-4 text-slate-500">{row.disability}</td>
									<td className="p-4 text-slate-500">{row.barangay}</td>
									<td className="p-4 font-DM text-slate-500">
										{row.validUntil}
									</td>
									<td className="p-4">
										<span
											className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${row.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
											● {row.status}
										</span>
									</td>
									<td className="p-4">
										<div className="flex items-center justify-center space-x-1">
											<button className="p-1.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-500 rounded-md transition cursor-pointer">
												<Edit2 className="w-3.5 h-3.5" />
											</button>
											<button className="p-1.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-500 rounded-md transition cursor-pointer">
												<Trash2 className="w-3.5 h-3.5" />
											</button>
											<button className="p-1.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-500 rounded-md transition cursor-pointer">
												<RefreshCw className="w-3.5 h-3.5" />
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
