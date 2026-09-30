import { useEffect, useState } from "react";
import { supabase } from "./createAdminClient";

interface MonthBucket {
	month: string;
	verified: number;
	flagged: number;
	total: number;
}

interface DisabilitySlice {
	label: string;
	count: number;
	pct: number;
}

const SLICE_COLORS = [
	"#0c1b3a",
	"#14254b",
	"#1e325d",
	"#283e6e",
	"#344c80",
	"#425c93",
	"#5c74a8",
	"#7d92c0",
];

export function ReportsAnalytics() {
	const [monthly, setMonthly] = useState<MonthBucket[]>([]);
	const [disability, setDisability] = useState<DisabilitySlice[]>([]);
	const [metrics, setMetrics] = useState<{
		totalScansMonth: number | null;
		verifiedMonth: number | null;
		flaggedMonth: number | null;
		applicationsProcessedMonth: number | null;
		activeIds: number | null;
		expiredIds: number | null;
		avgScansPerDay: number | null;
		establishments: number | null;
	}>({
		totalScansMonth: null,
		verifiedMonth: null,
		flaggedMonth: null,
		applicationsProcessedMonth: null,
		activeIds: null,
		expiredIds: null,
		avgScansPerDay: null,
		establishments: null,
	});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const startOfMonth = new Date();
		startOfMonth.setDate(1);
		startOfMonth.setHours(0, 0, 0, 0);

		const sixMonthsAgo = new Date(startOfMonth);
		sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);

		const today = new Date().toISOString().slice(0, 10);

		const fetchAll = async () => {
			// 1. Verification logs for the last 6 months, for the bar chart + monthly metrics
			const { data: logs, error: logsError } = await supabase
				.from("VerificationLogs")
				.select("TimeStamp, Result")
				.gte("TimeStamp", sixMonthsAgo.toISOString());

			if (logsError) {
				console.error("Error fetching verification logs:", logsError);
			} else if (logs) {
				const buckets = new Map<string, MonthBucket>();
				for (let i = 0; i < 6; i++) {
					const d = new Date(sixMonthsAgo);
					d.setMonth(d.getMonth() + i);
					const key = `${d.getFullYear()}-${d.getMonth()}`;
					buckets.set(key, {
						month: d.toLocaleString("en-US", { month: "short" }),
						verified: 0,
						flagged: 0,
						total: 0,
					});
				}

				for (const log of logs) {
					const d = new Date(log.TimeStamp);
					const key = `${d.getFullYear()}-${d.getMonth()}`;
					const bucket = buckets.get(key);
					if (!bucket) continue;
					bucket.total += 1;
					if (log.Result === "VERIFIED") bucket.verified += 1;
					else bucket.flagged += 1;
				}

				setMonthly(Array.from(buckets.values()));

				const thisMonthLogs = logs.filter(
					(l) => new Date(l.TimeStamp) >= startOfMonth,
				);
				const totalScansMonth = thisMonthLogs.length;
				const verifiedMonth = thisMonthLogs.filter(
					(l) => l.Result === "VERIFIED",
				).length;
				const flaggedMonth = totalScansMonth - verifiedMonth;
				const daysElapsed = Math.max(
					1,
					Math.ceil(
						(Date.now() - startOfMonth.getTime()) / (1000 * 60 * 60 * 24),
					),
				);

				setMetrics((prev) => ({
					...prev,
					totalScansMonth,
					verifiedMonth,
					flaggedMonth,
					avgScansPerDay: Math.round((totalScansMonth / daysElapsed) * 10) / 10,
				}));
			}

			// 2. Disability type distribution
			const { data: pwds, error: pwdError } = await supabase
				.from("PWDinformation")
				.select("disabilityProfile, Status, expiration_date, created_at");

			if (pwdError) {
				console.error("Error fetching PWD records:", pwdError);
			} else if (pwds) {
				const counts = new Map<string, number>();
				for (const row of pwds) {
					const label = row.disabilityProfile ?? "Unspecified";
					counts.set(label, (counts.get(label) ?? 0) + 1);
				}
				const total = pwds.length || 1;
				const slices = Array.from(counts.entries())
					.map(([label, count]) => ({
						label,
						count,
						pct: Math.round((count / total) * 100),
					}))
					.sort((a, b) => b.count - a.count);
				setDisability(slices);

				const activeIds = pwds.filter((p) => p.Status === "ACTIVE").length;
				const expiredIds = pwds.filter(
					(p) => !!p.expiration_date && p.expiration_date < today,
				).length;
				const applicationsProcessedMonth = pwds.filter(
					(p) => new Date(p.created_at) >= startOfMonth,
				).length;

				setMetrics((prev) => ({
					...prev,
					activeIds,
					expiredIds,
					applicationsProcessedMonth,
				}));
			}

			// 3. Participating establishments
			const { count: establishments, error: merchError } = await supabase
				.from("merchants")
				.select("*", { count: "exact", head: true });

			if (merchError) {
				console.error("Error fetching merchant count:", merchError);
			} else {
				setMetrics((prev) => ({ ...prev, establishments }));
			}

			setLoading(false);
		};

		fetchAll();
	}, []);

	const maxMonthlyTotal = Math.max(1, ...monthly.map((m) => m.total));

	const conicGradient = (() => {
		if (disability.length === 0) return "conic-gradient(#e2e8f0 0% 100%)";
		let acc = 0;
		const stops = disability.map((slice, i) => {
			const start = acc;
			acc += slice.pct;
			const color = SLICE_COLORS[i % SLICE_COLORS.length];
			return `${color} ${start}% ${acc}%`;
		});
		return `conic-gradient(${stops.join(", ")})`;
	})();

	const monthLabel = new Date().toLocaleString("en-US", { month: "long" });

	const systemMetrics = [
		{
			label: `Total Scans (${monthLabel.slice(0, 3)})`,
			value: metrics.totalScansMonth,
		},
		{ label: "Successful Verifications", value: metrics.verifiedMonth },
		{ label: "Fraud Flags Generated", value: metrics.flaggedMonth },
		{
			label: "Applications Processed",
			value: metrics.applicationsProcessedMonth,
		},
		{ label: "Active Digital IDs", value: metrics.activeIds },
		{ label: "Expired IDs", value: metrics.expiredIds },
		{ label: "Avg. Scans / Day", value: metrics.avgScansPerDay },
		{ label: "Participating Establishments", value: metrics.establishments },
	];

	return (
		<div className="space-y-6 font-Jakarta animate-fadeIn">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
					<div>
						<h4 className="text-sm font-bold text-foreground">
							Monthly Verification Activity
						</h4>
						<p className="text-[11px] text-muted-foreground font-medium">
							Verified vs. flagged QR scan attempts (last 6 months)
						</p>
					</div>
					{loading ? (
						<div className="h-64 flex items-center justify-center text-xs text-slate-400">
							Loading...
						</div>
					) : monthly.every((m) => m.total === 0) ? (
						<div className="h-64 flex items-center justify-center text-xs text-slate-400">
							No verification activity yet.
						</div>
					) : (
						<div className="h-64 pt-6 flex items-end justify-between px-4 relative border-b border-slate-200">
							{monthly.map((b, i) => (
								<div
									key={i}
									className="flex flex-col items-center gap-2 z-10 w-full">
									<div
										className="w-full flex flex-col items-center justify-end"
										style={{ height: "190px" }}>
										<div
											style={{
												height: `${(b.verified / maxMonthlyTotal) * 190}px`,
											}}
											className="w-4 bg-primary rounded-t-xs transition-all hover:opacity-90"
										/>
										<div
											style={{
												height: `${(b.flagged / maxMonthlyTotal) * 190}px`,
											}}
											className="w-4 bg-accent transition-all hover:opacity-90"
										/>
									</div>
									<span className="text-[10px] font-medium text-slate-400 font-DM">
										{b.month}
									</span>
								</div>
							))}
						</div>
					)}
					<div className="flex items-center space-x-4 text-[10px] font-bold text-slate-600 px-2 pt-1">
						<div className="flex items-center gap-1.5">
							<span className="w-3 h-1.5 bg-primary rounded-xs" /> Verified
						</div>
						<div className="flex items-center gap-1.5">
							<span className="w-3 h-1.5 bg-accent rounded-xs" /> Flagged
						</div>
					</div>
				</div>

				<div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
					<div>
						<h4 className="text-sm font-bold text-foreground">
							Disability Type Distribution
						</h4>
						<p className="text-[11px] text-muted-foreground font-medium">
							Registered PWDs by disability category (Guagua)
						</p>
					</div>
					{loading ? (
						<div className="h-64 flex items-center justify-center text-xs text-slate-400">
							Loading...
						</div>
					) : disability.length === 0 ? (
						<div className="h-64 flex items-center justify-center text-xs text-slate-400">
							No registered PWDs yet.
						</div>
					) : (
						<div className="h-64 flex items-center justify-center gap-6">
							<div
								className="w-40 h-40 rounded-full shadow-inner shrink-0 border-4 border-white"
								style={{ background: conicGradient }}
							/>
							<div className="space-y-1.5 text-[10px] font-bold text-slate-600 max-h-56 overflow-y-auto pr-1">
								{disability.map((slice, i) => (
									<div key={slice.label} className="flex items-center gap-1.5">
										<span
											className="w-2.5 h-2.5 rounded-sm shrink-0"
											style={{
												backgroundColor: SLICE_COLORS[i % SLICE_COLORS.length],
											}}
										/>
										<span className="truncate max-w-32">{slice.label}</span>
										<span className="text-slate-400 font-normal">
											{slice.pct}%
										</span>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			</div>

			<div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-md space-y-5">
				<div>
					<h4 className="text-sm font-bold text-foreground">
						System Usage Summary —{" "}
						{new Date().toLocaleString("en-US", {
							month: "long",
							year: "numeric",
						})}
					</h4>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
					{systemMetrics.map((m, idx) => (
						<div
							key={idx}
							className="bg-white p-4 rounded-xl border border-slate-100 hover:shadow-xs transition space-y-1">
							<h5 className="text-2xl font-bold text-foreground tracking-tight">
								{loading || m.value === null ? "..." : m.value.toLocaleString()}
							</h5>
							<p className="text-[11px] font-medium text-muted-foreground/90">
								{m.label}
							</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
