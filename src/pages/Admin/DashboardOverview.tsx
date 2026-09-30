import { supabase } from "./createAdminClient";
import { useEffect, useState } from "react";
import type { Registration } from "../../database.types";

import { CheckCircle, AlertTriangle, FileText, Users, Zap } from "lucide-react";

interface DashboardOverviewProps {
	setActiveTab: (tabId: string) => void;
	pendingApplications: Registration[];
}

interface RecentLog {
	log_id: string;
	TimeStamp: string;
	pwdName: string | null;
	pwdNum: string | null;
	Establishment: string | null;
	Result: string;
}

export function DashboardOverview({
	setActiveTab,
	pendingApplications,
}: DashboardOverviewProps) {
	// ...rest of the component
	const [PWDCount, setPWDCount] = useState<number | null>(null);

	useEffect(() => {
		const fetchCount = async () => {
			const { count, error } = await supabase
				.from("PWDinformation")
				.select("*", { count: "exact", head: true });

			if (error) {
				console.error("Error fetching count:", error);
			} else {
				setPWDCount(count);
			}
		};

		fetchCount();
	}, []);

	const [verificationsToday, setVerificationsToday] = useState<number | null>(
		null,
	);
	const [verificationsYesterday, setVerificationsYesterday] = useState<
		number | null
	>(null);
	useEffect(() => {
		const fetchTodayCount = async () => {
			const startOfToday = new Date();
			startOfToday.setHours(0, 0, 0, 0);
			const startOfYesterday = new Date(startOfToday);
			startOfYesterday.setDate(startOfYesterday.getDate() - 1);

			const { count: todayCount, error: todayError } = await supabase
				.from("VerificationLogs")
				.select("*", { count: "exact", head: true })
				.gte("TimeStamp", startOfToday.toISOString());

			const { count: yestCount, error: yestError } = await supabase
				.from("VerificationLogs")
				.select("*", { count: "exact", head: true })
				.gte("TimeStamp", startOfYesterday.toISOString())
				.lt("TimeStamp", startOfToday.toISOString());

			if (todayError)
				console.error("Error fetching today's count:", todayError);
			else setVerificationsToday(todayCount);

			if (yestError)
				console.error("Error fetching yesterday's count:", yestError);
			else setVerificationsYesterday(yestCount);
		};

		fetchTodayCount();
	}, []);

	const [fraudFlagsThisMonth, setFraudFlagsThisMonth] = useState<number | null>(
		null,
	);
	useEffect(() => {
		const fetchFraudCount = async () => {
			const startOfMonth = new Date();
			startOfMonth.setDate(1);
			startOfMonth.setHours(0, 0, 0, 0);

			const { count, error } = await supabase
				.from("VerificationLogs")
				.select("*", { count: "exact", head: true })
				.neq("Result", "VERIFIED")
				.gte("TimeStamp", startOfMonth.toISOString());

			if (error) {
				console.error("Error fetching fraud flag count:", error);
			} else {
				setFraudFlagsThisMonth(count);
			}
		};

		fetchFraudCount();
	}, []);

	const [recentActivity, setRecentActivity] = useState<RecentLog[]>([]);
	useEffect(() => {
		const fetchRecent = async () => {
			const { data, error } = await supabase
				.from("VerificationLogs")
				.select("log_id, TimeStamp, pwdName, pwdNum, Establishment, Result")
				.order("TimeStamp", { ascending: false })
				.limit(5)
				.returns<RecentLog[]>();

			if (error) {
				console.error("Error fetching recent activity:", error);
			} else {
				setRecentActivity(data ?? []);
			}
		};

		fetchRecent();
	}, []);

	const verificationsDelta =
		verificationsToday !== null && verificationsYesterday !== null
			? verificationsToday - verificationsYesterday
			: null;

	const monthLabel = new Date().toLocaleString("en-US", { month: "short" });

	return (
		<div className="space-y-6 animate-fadeIn font-Jakarta">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
				<div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-xs flex items-start justify-between">
					<div className="space-y-2">
						<p className="text-xs font-bold text-muted-foreground/90 uppercase tracking-wide">
							Total Registered PWDs
						</p>
						<h3 className="text-3xl font-bold font-Jakarta text-foreground">
							{PWDCount !== null ? PWDCount.toLocaleString() : "Loading..."}
						</h3>
					</div>
					<div className="p-2.5 bg-blue-50 text-primary rounded-xl">
						<Users className="w-5 h-5" />
					</div>
				</div>

				<div className="bg-white p-6 rounded-2xl border-2 border-amber-400 shadow-xs flex items-start justify-between relative overflow-hidden">
					<div className="space-y-2">
						<span className="absolute top-3 right-3 text-[9px] font-extrabold tracking-wider bg-amber-100 text-amber-700 px-2 py-0.5 rounded-sm uppercase">
							Action Needed
						</span>
						<p className="text-xs font-bold text-muted-foreground/90 uppercase tracking-wide">
							Pending Applications
						</p>
						<h3 className="text-3xl font-bold font-Jakarta text-foreground">
							{pendingApplications.length}
						</h3>
						<p className="text-[11px] font-medium text-slate-500">
							Requires review
						</p>
					</div>
					<div className="p-2.5 bg-amber-50 text-amber-500 rounded-xl mt-5">
						<FileText className="w-5 h-5" />
					</div>
				</div>

				<div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-xs flex items-start justify-between">
					<div className="space-y-2">
						<p className="text-xs font-bold text-muted-foreground/90 uppercase tracking-wide">
							Verifications Today
						</p>
						<h3 className="text-3xl font-bold font-Jakarta text-foreground">
							{verificationsToday !== null ? verificationsToday : "Loading..."}
						</h3>
						{verificationsDelta !== null && (
							<p
								className={`text-[11px] font-medium ${
									verificationsDelta >= 0 ? "text-emerald-600" : "text-accent"
								}`}>
								{verificationsDelta >= 0 ? "+" : ""}
								{verificationsDelta} vs yesterday
							</p>
						)}
					</div>
					<div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
						<Zap className="w-5 h-5" />
					</div>
				</div>

				<div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-xs flex items-start justify-between">
					<div className="space-y-2">
						<p className="text-xs font-bold text-muted-foreground/90 uppercase tracking-wide">
							Fraud Flags ({monthLabel})
						</p>
						<h3 className="text-3xl font-bold font-Jakarta text-accent">
							{fraudFlagsThisMonth !== null ? fraudFlagsThisMonth : "..."}
						</h3>
						<p className="text-[11px] font-medium text-muted-foreground">
							Invalid / unverified scans
						</p>
					</div>
					<div className="p-2.5 bg-rose-50 text-accent rounded-xl">
						<AlertTriangle className="w-5 h-5" />
					</div>
				</div>
			</div>

			<div className="space-y-6">
				<div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
					<div className="p-5 border-b border-slate-100 flex items-center justify-between">
						<div className="flex items-center space-x-2">
							<FileText className="w-4 h-4 text-amber-500" />
							<h4 className="text-sm font-bold text-foreground">
								Pending Applications
							</h4>
							<span className="text-[10px] font-extrabold px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">
								{pendingApplications.length} pending
							</span>
						</div>
						<button
							onClick={() => setActiveTab("applications")}
							className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer">
							View all &rarr;
						</button>
					</div>
					<div className="divide-y divide-slate-100">
						{pendingApplications.length === 0 ? (
							<div className="p-6 text-center text-xs text-slate-400">
								No pending applications.
							</div>
						) : (
							pendingApplications.map((app) => (
								<div
									key={app.id}
									className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition">
									<div>
										<h5 className="text-sm font-bold text-foreground">
											{app.firstName} {app.middleName} {app.lastName}
										</h5>
										<p className="text-xs text-muted-foreground mt-0.5">
											{app.dissabilityProfile} · {app.createdAt}
										</p>
									</div>
								</div>
							))
						)}
					</div>
				</div>

				<div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
					<div className="p-5 border-b border-slate-100 flex items-center justify-between">
						<div className="flex items-center space-x-2">
							<Zap className="w-4 h-4 text-primary" />
							<h4 className="text-sm font-bold text-foreground">
								Recent Verification Activity
							</h4>
						</div>
						<button
							onClick={() => setActiveTab("audit")}
							className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer">
							View all logs &rarr;
						</button>
					</div>
					<div className="divide-y divide-slate-100">
						{recentActivity.length === 0 ? (
							<div className="p-6 text-center text-xs text-slate-400">
								No verification activity yet.
							</div>
						) : (
							recentActivity.map((activity) => {
								const isVerified = activity.Result === "VERIFIED";
								return (
									<div
										key={activity.log_id}
										className="p-4 sm:px-6 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition">
										<div className="flex items-start space-x-3">
											<div
												className={`p-2 rounded-full shrink-0 mt-0.5 ${isVerified ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-accent"}`}>
												{isVerified ? (
													<CheckCircle className="w-4 h-4" />
												) : (
													<AlertTriangle className="w-4 h-4" />
												)}
											</div>
											<div>
												<div className="flex flex-wrap items-center gap-x-2">
													<h5 className="text-sm font-bold text-foreground">
														{activity.pwdName ?? "Unknown"}
													</h5>
													<span className="text-[11px] font-DM font-semibold text-slate-500 tracking-wide">
														({activity.pwdNum ?? "???-????-???"})
													</span>
												</div>
												<p className="text-xs text-muted-foreground/80 font-medium mt-0.5">
													{activity.Establishment ?? "—"}
												</p>
											</div>
										</div>
										<div className="text-right shrink-0">
											<p className="text-[11px] font-DM font-medium text-slate-500">
												{new Date(activity.TimeStamp).toLocaleTimeString([], {
													hour: "2-digit",
													minute: "2-digit",
												})}
											</p>
											<span
												className={`text-[9px] font-extrabold tracking-wider block mt-1 ${isVerified ? "text-emerald-600" : "text-accent"}`}>
												{activity.Result}
											</span>
										</div>
									</div>
								);
							})
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
