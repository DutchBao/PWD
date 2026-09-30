import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import type { PWDinformation, Registration } from "../../database.types";
import { PwdRecordModal } from "./PwdRecordModal";

import {
	Search,
	PlusCircle,
	Download,
	Edit2,
	Trash2,
	RefreshCw,
} from "lucide-react";

interface PwdRegistryProps {
	pendingApplications: Registration[];
}

export function PwdRegistry({ pendingApplications }: PwdRegistryProps) {
	const [registryData, setRegistryData] = useState<PWDinformation[]>([]);
	const [totalCount, setTotalCount] = useState<number | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [refreshing, setRefreshing] = useState(false);

	// Modal state — null means closed, "new" means Add mode, a row means Edit mode
	const [modalMode, setModalMode] = useState<"closed" | "add" | "edit">(
		"closed",
	);
	const [editingRow, setEditingRow] = useState<PWDinformation | null>(null);

	const reloadRegistry = async () => {
		const { data, error } = await supabase.from("PWDinformation").select("*");
		if (error) {
			console.error("Error fetching registry data:", error);
		} else {
			setRegistryData(data ?? []);
		}
	};

	useEffect(() => {
		let isMounted = true;

		const loadInitialData = async () => {
			const [registryRes, countRes] = await Promise.all([
				supabase.from("PWDinformation").select("*"),
				supabase
					.from("PWDinformation")
					.select("*", { count: "exact", head: true }),
			]);

			if (!isMounted) return;

			if (registryRes.error) {
				console.error("Error fetching registry data:", registryRes.error);
			} else {
				setRegistryData(registryRes.data ?? []);
			}

			if (countRes.error) {
				console.error("Error fetching count:", countRes.error);
			} else {
				setTotalCount(countRes.count);
			}
		};

		loadInitialData();

		return () => {
			isMounted = false;
		};
	}, []);

	const filteredData = registryData.filter((row) => {
		const term = searchTerm.trim().toLowerCase();
		if (!term) return true;
		const fullName =
			`${row.firstName ?? ""} ${row.middleName ?? ""} ${row.lastName ?? ""}`.toLowerCase();
		return (
			fullName.includes(term) ||
			row.pwdNum?.toLowerCase().includes(term) ||
			row.disabilityProfile?.toLowerCase().includes(term)
		);
	});

	const handleDelete = async (pwdNum: string) => {
		const confirmed = window.confirm(
			`Delete record ${pwdNum}? This cannot be undone.`,
		);
		if (!confirmed) return;

		const { error } = await supabase
			.from("PWDinformation")
			.delete()
			.eq("pwdNum", pwdNum);

		if (error) {
			console.error(error);
			alert("Could not delete this record.");
			return;
		}

		setRegistryData((prev) => prev.filter((r) => r.pwdNum !== pwdNum));
		setTotalCount((prev) => (prev !== null ? prev - 1 : prev));
	};

	const handleRefresh = async () => {
		setRefreshing(true);
		await reloadRegistry();
		setRefreshing(false);
	};

	const handleExport = () => {
		const headers = [
			"PWD ID",
			"First Name",
			"Middle Name",
			"Last Name",
			"Disability",
			"Address",
			"Valid Until",
			"Status",
		];
		const rows = filteredData.map((r) => [
			r.pwdNum,
			r.firstName,
			r.middleName,
			r.lastName,
			r.disabilityProfile,
			r.homeAddress,
			r.expiration_date,
			r.Status,
		]);

		const csv = [headers, ...rows]
			.map((row) =>
				row
					.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`)
					.join(","),
			)
			.join("\n");

		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `pwd-registry-${new Date().toISOString().slice(0, 10)}.csv`;
		a.click();
		URL.revokeObjectURL(url);
	};

	const openAddModal = () => {
		setEditingRow(null);
		setModalMode("add");
	};

	const openEditModal = (row: PWDinformation) => {
		setEditingRow(row);
		setModalMode("edit");
	};

	const closeModal = () => {
		setModalMode("closed");
		setEditingRow(null);
	};

	const handleSaved = (row: PWDinformation) => {
		if (modalMode === "edit") {
			setRegistryData((prev) =>
				prev.map((r) => (r.pwdNum === row.pwdNum ? row : r)),
			);
		} else {
			setRegistryData((prev) => [row, ...prev]);
			setTotalCount((prev) => (prev !== null ? prev + 1 : prev));
		}
		closeModal();
	};

	return (
		<div className="space-y-4 font-Jakarta animate-fadeIn">
			<div className="w-full flex flex-col sm:flex-row gap-3 items-center justify-between">
				<div className="relative w-full sm:max-w-xl">
					<Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
					<input
						type="text"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						placeholder="Search by name, ID, or disability type..."
						className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
					/>
				</div>
				<div className="flex items-center space-x-2 w-full sm:w-auto shrink-0">
					<button
						onClick={openAddModal}
						className="flex-1 sm:flex-none px-4 py-2.5 bg-primary hover:bg-blue-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer">
						<PlusCircle className="w-4 h-4" /> Add Record
					</button>
					<button
						onClick={handleExport}
						className="flex-1 sm:flex-none px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer">
						<Download className="w-4 h-4 text-slate-500" /> Export
					</button>
				</div>
			</div>

			{pendingApplications.length > 0 && (
				<div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs font-bold text-amber-800">
					{pendingApplications.length} application
					{pendingApplications.length === 1 ? "" : "s"} still pending approval
				</div>
			)}

			<div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
				<div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50">
					<span className="text-xs font-semibold text-slate-500 font-DM">
						{totalCount === null
							? "Loading..."
							: searchTerm.trim()
								? `${filteredData.length} of ${totalCount} records`
								: `${totalCount} records found`}
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
							{filteredData.map((row) => (
								<tr
									key={row.pwdNum}
									className="hover:bg-slate-50/50 transition">
									<td className="p-4 font-DM font-bold text-primary tracking-wide">
										{row.pwdNum}
									</td>
									<td className="p-4 font-bold text-foreground text-sm">
										{row.firstName} {row.middleName} {row.lastName}
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
											className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${row.Status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
											● {row.Status}
										</span>
									</td>
									<td className="p-4">
										<div className="flex items-center justify-center space-x-1">
											<button
												onClick={() => openEditModal(row)}
												className="p-1.5 bg-slate-50 border border-slate-200 hover:bg-blue-50 hover:border-blue-200 hover:text-primary text-slate-500 rounded-md transition cursor-pointer">
												<Edit2 className="w-3.5 h-3.5" />
											</button>
											<button
												onClick={() => handleDelete(row.pwdNum)}
												className="p-1.5 bg-slate-50 border border-slate-200 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 text-slate-500 rounded-md transition cursor-pointer">
												<Trash2 className="w-3.5 h-3.5" />
											</button>
											<button
												onClick={handleRefresh}
												disabled={refreshing}
												className="p-1.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-500 rounded-md transition cursor-pointer disabled:opacity-50">
												<RefreshCw
													className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`}
												/>
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{modalMode !== "closed" && (
				<PwdRecordModal
					editingRow={editingRow}
					onClose={closeModal}
					onSaved={handleSaved}
				/>
			)}
		</div>
	);
}
