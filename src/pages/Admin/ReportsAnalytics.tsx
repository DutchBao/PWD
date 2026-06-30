export function ReportsAnalytics() {
	const systemMetrics = [
		{ label: "Total Scans (Jun)", value: "40", sub: "Total Scans (Jun)" },
		{
			label: "Successful Verifications",
			value: "37",
			sub: "Successful Verifications",
		},
		{
			label: "Fraud Flags Generated",
			value: "3",
			sub: "Fraud Flags Generated",
		},
		{
			label: "Applications Processed",
			value: "12",
			sub: "Applications Processed",
		},
		{ label: "Active Digital IDs", value: "2,841", sub: "Active Digital IDs" },
		{ label: "Expired IDs", value: "47", sub: "Expired IDs" },
		{ label: "Avg. Scans / Day", value: "2.7", sub: "Avg. Scans / Day" },
		{
			label: "Participating Establishments",
			value: "18",
			sub: "Participating Establishments",
		},
	];

	return (
		<div className="space-y-6 font-Jakarta animate-fadeIn">
			{/* Charts Visual Analytics Grid Row */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Monthly Verification Bar Chart Panel */}
				<div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
					<div>
						<h4 className="text-sm font-bold text-foreground">
							Monthly Verification Activity
						</h4>
						<p className="text-[11px] text-muted-foreground font-medium">
							Verified vs. unverified QR scan attempts (Jan – Jun 2025)
						</p>
					</div>
					{/* Simulated High Fidelity Bar Graph Rendering Container */}
					<div className="h-64 pt-6 flex items-end justify-between px-4 relative border-b border-slate-200">
						{/* Horizontal Guides */}
						<div className="absolute inset-x-0 top-6 border-t border-dashed border-slate-100 text-[10px] text-slate-300 font-DM pt-1">
							100
						</div>
						<div className="absolute inset-x-0 top-20 border-t border-dashed border-slate-100 text-[10px] text-slate-300 font-DM pt-1">
							75
						</div>
						<div className="absolute inset-x-0 top-34 border-t border-dashed border-slate-100 text-[10px] text-slate-300 font-DM pt-1">
							50
						</div>
						<div className="absolute inset-x-0 top-48 border-t border-dashed border-slate-100 text-[10px] text-slate-300 font-DM pt-1">
							25
						</div>
						<div className="absolute inset-x-0 top-62 text-[10px] text-slate-300 font-DM z-10">
							0
						</div>

						{/* Chart Bars */}
						{[
							{ month: "Jan", val: 48 },
							{ month: "Feb", val: 62 },
							{ month: "Mar", val: 55 },
							{ month: "Apr", val: 72 },
							{ month: "May", val: 84 },
							{ month: "Jun", val: 38 },
						].map((b, i) => (
							<div
								key={i}
								className="flex flex-col items-center gap-2 z-10 w-full">
								<div
									style={{ height: `${(b.val / 100) * 190}px` }}
									className="w-4 bg-accent rounded-t-xs transition-all hover:opacity-90"
								/>
								<span className="text-[10px] font-medium text-slate-400 font-DM">
									{b.month}
								</span>
							</div>
						))}
					</div>
					<div className="flex items-center space-x-4 text-[10px] font-bold text-slate-600 px-2 pt-1">
						<div className="flex items-center gap-1.5">
							<span className="w-3 h-1.5 bg-primary rounded-xs" /> Verified
						</div>
						<div className="flex items-center gap-1.5">
							<span className="w-3 h-1.5 bg-accent rounded-xs" /> Flagged
						</div>
					</div>
				</div>

				{/* Disability Type Distribution Pie Panel */}
				<div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
					<div>
						<h4 className="text-sm font-bold text-foreground">
							Disability Type Distribution
						</h4>
						<p className="text-[11px] text-muted-foreground font-medium">
							Registered PWDs by disability category (Guagua)
						</p>
					</div>
					<div className="h-64 flex items-center justify-center relative">
						{/* CSS Conic Gradient Segment Chart Ring representation */}
						<div
							className="w-44 h-44 rounded-full shadow-inner relative flex items-center justify-center border-4 border-white"
							style={{
								background:
									"conic-gradient(#0c1b3a 0% 28%, #14254b 28% 50%, #1e325d 50% 68%, #283e6e 68% 80%, #344c80 80% 90%, #425c93 90% 100%)",
							}}>
							{/* Overlay Percentage Data Tags */}
							<span className="absolute top-6 right-6 text-[10px] font-extrabold text-white">
								Orthopedic 28%
							</span>
							<span className="absolute top-8 left-4 text-[10px] font-extrabold text-white">
								Visual 22%
							</span>
							<span className="absolute bottom-10 left-6 text-[10px] font-extrabold text-white">
								Hearing 18%
							</span>
							<span className="absolute bottom-4 right-10 text-[10px] font-extrabold text-white">
								Intellectual 12%
							</span>
						</div>
						<div className="absolute bottom-0 right-4 flex flex-col gap-1 text-[9px] font-bold text-slate-500">
							<div>● Chronic Illness 10%</div>
							<div>● Other 10%</div>
						</div>
					</div>
				</div>
			</div>

			{/* Bottom System Usage Metric Data Grid Row */}
			<div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-md space-y-5">
				<div>
					<h4 className="text-sm font-bold text-foreground">
						System Usage Summary — June 2025
					</h4>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
					{systemMetrics.map((m, idx) => (
						<div
							key={idx}
							className="bg-white p-4 rounded-xl border border-slate-100 hover:shadow-xs transition space-y-1">
							<h5 className="text-2xl font-bold text-foreground tracking-tight">
								{m.value}
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
