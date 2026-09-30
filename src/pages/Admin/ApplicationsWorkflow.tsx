import { useState, useEffect, useMemo } from "react";
import { supabase } from "./createAdminClient";
import type { Registration } from "../../database.types";
import { FunctionsHttpError } from "@supabase/supabase-js";

import {
	CheckCircle,
	XCircle,
	FileText,
	MapPin,
	Calendar,
	Activity,
} from "lucide-react";

export function ApplicationsWorkflow() {
	const [ApplicationData, setApplicationData] = useState<Registration[]>([]);
	useEffect(() => {
		const fetchData = async () => {
			const { data, error } = await supabase.from("Registration").select("*");

			if (error) {
				console.error("Error fetching registry data:", error);
			} else {
				setApplicationData(data ?? []);
			}
		};

		fetchData();
	}, []);

	const sortedApplications = useMemo(() => {
		return [...ApplicationData].sort((a, b) => {
			if (a.status === "approved" && b.status !== "approved") return 1;
			if (a.status !== "approved" && b.status === "approved") return -1;
			return 0;
		});
	}, [ApplicationData]);

	const openDocument = async (path: string) => {
		const newTab = window.open("", "_blank");

		const { data, error } = await supabase.storage
			.from("pwd-documents")
			.createSignedUrl(path, 60);

		if (error || !data) {
			console.error(error);
			newTab?.close();
			alert("Could not open the document.");
			return;
		}

		if (newTab) newTab.location.href = data.signedUrl;
	};

	const [approvingId, setApprovingId] = useState<number | null>(null);
	const [rejectingId, setRejectingId] = useState<number | null>(null);

	const approveApplication = async (id: number) => {
		setApprovingId(id);
		const { data, error } = await supabase.functions.invoke(
			"approve-application",
			{ body: { registrationId: id } },
		);
		setApprovingId(null);

		if (error) {
			if (error instanceof FunctionsHttpError) {
				const res = error.context as Response;
				const body = await res.text();
				console.error("Edge function failed:", res.status, body);
			} else {
				console.error(error);
			}
			alert("Could not approve the application.");
			return;
		}

		if (!data?.ok) {
			console.error(data);
			alert("Could not approve the application.");
			return;
		}

		setApplicationData((prev) =>
			prev.map((a) => (a.id === id ? { ...a, status: "approved" } : a)),
		);

		if (!data.emailSent) {
			alert(
				`Approved as ${data.pwdNumber}, but the confirmation email failed to send.`,
			);
		}
	};

	const rejectApplication = async (id: number) => {
		const confirmed = window.confirm(
			"Reject this application? The applicant will be notified by email.",
		);
		if (!confirmed) return;

		setRejectingId(id);
		const { data, error } = await supabase.functions.invoke(
			"reject-application",
			{
				body: { registrationId: id },
			},
		);
		setRejectingId(null);

		if (error || !data?.ok) {
			console.error(error ?? data);
			alert("Could not reject the application.");
			return;
		}

		setApplicationData((prev) =>
			prev.map((a) => (a.id === id ? { ...a, status: "rejected" } : a)),
		);

		if (!data.emailSent) {
			alert("Rejected, but the notification email failed to send.");
		}
	};

	return (
		<div className="bg-white rounded-3xl border border-slate-200/60 shadow-xl overflow-hidden font-Jakarta animate-fadeIn">
			<div className="p-6 md:p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div className="space-y-1">
					<h3 className="text-xl font-bold font-Jakarta text-foreground">
						Registration Applications
					</h3>
					<p className="text-xs text-muted-foreground font-medium">
						Review and approve PWD registration requests
					</p>
				</div>
				<div className="text-right shrink-0 font-DM text-sm font-bold text-slate-700 bg-slate-50 px-4 py-1.5 rounded-xl border border-slate-100">
					{ApplicationData.filter((app) => app.status === "pending").length}{" "}
					pending
				</div>
			</div>

			<div className="divide-y divide-slate-100">
				{sortedApplications.map((app) => {
					const isApproved = app.status === "approved";
					const isRejected = app.status === "rejected";
					return (
						<div
							key={app.id}
							className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-slate-50/40 transition">
							<div className="flex items-start space-x-4 max-w-3xl">
								<div className="w-10 h-10 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center shrink-0">
									<span className="text-xs font-bold">👤</span>
								</div>
								<div className="space-y-3">
									<div className="flex flex-wrap items-center gap-x-3 gap-y-1">
										<h4 className="text-base font-bold text-foreground leading-none">
											{app.firstName} {app.middleName} {app.lastName}
										</h4>
										<span
											className={`text-[10px] font-extrabold tracking-wide px-2 py-0.5 rounded-sm uppercase ${
												isApproved
													? "bg-emerald-100 text-emerald-800"
													: isRejected
														? "bg-rose-100 text-rose-800"
														: "bg-amber-100 text-amber-800"
											}`}>
											{isApproved
												? "Approved"
												: isRejected
													? "Rejected"
													: "Pending"}
										</span>
									</div>
									<p className="text-xs font-DM text-slate-400 font-bold tracking-wide leading-none">
										{app.id}
									</p>

									<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2 pt-1 text-xs font-medium text-slate-600">
										<div className="flex items-center gap-1.5">
											<Calendar className="w-3.5 h-3.5 text-slate-400" />{" "}
											<span className="text-slate-400">DOB:</span>{" "}
											{app.dateofBirth}
										</div>
										<div className="flex items-center gap-1.5">
											<Activity className="w-3.5 h-3.5 text-slate-400" />{" "}
											<span className="text-slate-400">Disability:</span>{" "}
											{app.dissabilityProfile}
										</div>
										<div className="flex items-center gap-1.5">
											<MapPin className="w-3.5 h-3.5 text-slate-400" />{" "}
											<span className="text-slate-400">Address:</span>{" "}
											{app.homeAddress}
										</div>
										<div className="flex items-center gap-1.5">
											<Calendar className="w-3.5 h-3.5 text-slate-400" />{" "}
											<span className="text-slate-400">Submitted:</span>{" "}
											{app.createdAt}
										</div>
									</div>

									<div className="pt-1">
										<a
											href="#"
											onClick={(e) => {
												e.preventDefault();
												if (app.document_path) openDocument(app.document_path);
											}}
											className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline bg-blue-50/60 px-2.5 py-1.5 rounded-lg border border-blue-100/50">
											<FileText className="w-3.5 h-3.5" /> {app.document_path}
										</a>
									</div>
								</div>
							</div>

							<div className="flex items-center space-x-2 shrink-0 lg:self-center self-end">
								<button
									onClick={() => approveApplication(app.id)}
									disabled={
										app.status !== "pending" ||
										approvingId === app.id ||
										rejectingId === app.id
									}
									className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition shadow-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
									<CheckCircle className="w-4 h-4" />
									{approvingId === app.id ? "Approving..." : "Approve"}
								</button>
								<button
									onClick={() => rejectApplication(app.id)}
									disabled={
										app.status !== "pending" ||
										approvingId === app.id ||
										rejectingId === app.id
									}
									className="px-5 py-2 bg-white border border-rose-200 hover:bg-rose-50 text-accent text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
									<XCircle className="w-4 h-4" />
									{rejectingId === app.id ? "Rejecting..." : "Reject"}
								</button>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
