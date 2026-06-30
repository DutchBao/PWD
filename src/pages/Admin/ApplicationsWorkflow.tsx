import {
	CheckCircle,
	XCircle,
	FileText,
	MapPin,
	Calendar,
	Activity,
} from "lucide-react";

export function ApplicationsWorkflow() {
	const applications = [
		{
			id: "APP-2025-041",
			name: "Eduardo Reyes",
			dob: "1978-03-14",
			disability: "Orthopedic Disability",
			address: "Brgy. Maquiapo, Guagua",
			file: "medical_cert_reyes.pdf",
			date: "Jun 18, 2025",
		},
		{
			id: "APP-2025-042",
			name: "Luzviminda Bautista",
			dob: "1990-07-22",
			disability: "Visual Impairment",
			address: "Brgy. San Nicolas, Guagua",
			file: "medical_cert_bautista.pdf",
			date: "Jun 17, 2025",
		},
		{
			id: "APP-2025-043",
			name: "Ricardo Dela Cruz",
			dob: "1965-11-05",
			disability: "Hearing Impairment",
			address: "Brgy. Ascomo, Guagua",
			file: "medical_cert_delacruz.pdf",
			date: "Jun 16, 2025",
		},
		{
			id: "APP-2025-044",
			name: "Florinda Santos",
			dob: "2001-02-28",
			disability: "Learning Disability",
			address: "Brgy. Betis, Guagua",
			file: "medical_cert_santos.pdf",
			date: "Jun 15, 2025",
		},
		{
			id: "APP-2025-045",
			name: "Nelson Aguilar",
			dob: "1982-09-10",
			disability: "Intellectual Disability",
			address: "Brgy. Pulungmasle, Guagua",
			file: "medical_cert_aguilar.pdf",
			date: "Jun 14, 2025",
		},
	];

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
					5 total
				</div>
			</div>

			<div className="divide-y divide-slate-100">
				{applications.map((app) => (
					<div
						key={app.id}
						className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-slate-50/40 transition">
						{/* Left Info block layout section wrapper */}
						<div className="flex items-start space-x-4 max-w-3xl">
							<div className="w-10 h-10 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center shrink-0">
								<span className="text-xs font-bold">👤</span>
							</div>
							<div className="space-y-3">
								<div className="flex flex-wrap items-center gap-x-3 gap-y-1">
									<h4 className="text-base font-bold text-foreground leading-none">
										{app.name}
									</h4>
									<span className="text-[10px] font-extrabold bg-amber-100 text-amber-800 tracking-wide px-2 py-0.5 rounded-sm uppercase">
										Pending
									</span>
								</div>
								<p className="text-xs font-DM text-slate-400 font-bold tracking-wide leading-none">
									{app.id}
								</p>

								<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2 pt-1 text-xs font-medium text-slate-600">
									<div className="flex items-center gap-1.5">
										<Calendar className="w-3.5 h-3.5 text-slate-400" />{" "}
										<span className="text-slate-400">DOB:</span> {app.dob}
									</div>
									<div className="flex items-center gap-1.5">
										<Activity className="w-3.5 h-3.5 text-slate-400" />{" "}
										<span className="text-slate-400">Disability:</span>{" "}
										{app.disability}
									</div>
									<div className="flex items-center gap-1.5">
										<MapPin className="w-3.5 h-3.5 text-slate-400" />{" "}
										<span className="text-slate-400">Address:</span>{" "}
										{app.address}
									</div>
									<div className="flex items-center gap-1.5">
										<Calendar className="w-3.5 h-3.5 text-slate-400" />{" "}
										<span className="text-slate-400">Submitted:</span>{" "}
										{app.date}
									</div>
								</div>

								<div className="pt-1">
									<a
										href="#"
										onClick={(e) => e.preventDefault()}
										className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline bg-blue-50/60 px-2.5 py-1.5 rounded-lg border border-blue-100/50">
										<FileText className="w-3.5 h-3.5" /> {app.file}
									</a>
								</div>
							</div>
						</div>

						{/* Action Workflow Button Trigger Column */}
						<div className="flex items-center space-x-2 shrink-0 lg:self-center self-end">
							<button className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition shadow-sm cursor-pointer">
								<CheckCircle className="w-4 h-4" /> Approve
							</button>
							<button className="px-5 py-2 bg-white border border-rose-200 hover:bg-rose-50 text-accent text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer">
								<XCircle className="w-4 h-4" /> Reject
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
