import { useState, useEffect } from "react";
import { supabase } from "./createAdminClient";
import type { PWDinformation } from "../../../database.types";

import {
	Search,
	PlusCircle,
	Download,
	Edit2,
	Trash2,
	RefreshCw,
} from "lucide-react";

export function PwdRegistry() {
	const [registryData, setRegistryData] = useState<PWDinformation[]>([]);
	useEffect(() => {
		const fetchData = async () => {
			const { data, error } = await supabase.from("PWDinformation").select("*");

			if (error) {
				console.error("Error fetching registry data:", error);
			} else {
				setRegistryData(data ?? []);
			}
		};

		fetchData();
	}, []);

	const [totalCount, setTotalCount] = useState<number | null>(null);

	useEffect(() => {
		const fetchCount = async () => {
			const { count, error } = await supabase
				.from("PWDinformation")
				.select("*", { count: "exact", head: true });

			if (error) {
				console.error("Error fetching count:", error);
			} else {
				setTotalCount(count);
			}
		};

		fetchCount();
	}, []);

	return (
		<div className="space-y-4 font-Jakarta animate-fadeIn">
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

			<div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
				<div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50">
					<span className="text-xs font-semibold text-slate-500 font-DM">
						{totalCount === null ? "Loading..." : `${totalCount} records found`}
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
								<tr
									key={row.pwdNum}
									className="hover:bg-slate-50/50 transition">
									<td className="p-4 font-DM font-bold text-primary tracking-wide">
										{row.pwdNum}
									</td>
									<td className="p-4 font-bold text-foreground text-sm">
										{row.firstName} {row.lastName}
									</td>
									<td className="p-4 text-slate-500">
										{row.disabilityProfile}
									</td>
									<td className="p-4 text-slate-500">{row.homeAddress}</td>
									<td className="p-4 font-DM text-slate-500">
										{row.expiration_date}
									</td>
									<td className="p-4">
										<span
											className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${row.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
											● {row.Status}
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
