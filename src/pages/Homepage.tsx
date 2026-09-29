import { Header } from "../components/Header";
import { useNavigate } from "react-router-dom";

export function HomePage() {
	const navigate = useNavigate();
	return (
		<>
			{/* Top Header */}
			<Header />
			{/* --- HERO BANNER --- */}
			<div
				className="bg-primary text-white relative overflow-hidden px-6 pt-4 pb-24 md:pb-32"
				style={{
					backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
          `,
					backgroundSize: "44px 44px",
				}}>
				{/* Hero Grid Section */}
				<div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
					{/* Left Column Text Content */}
					<div className="lg:col-span-7 space-y-6">
						{/* Metadata Tag */}
						<div className="inline-block px-3 py-1 border border-white/20 rounded-full bg-white/5">
							<p className="font-DM text-[11px] tracking-widest text-white/80 uppercase">
								Digital Government Services · Guagua, Pampanga
							</p>
						</div>

						{/* Giant Dynamic Heading */}
						<h2 className="font-Libre text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
							PWD Digital ID <br />
							<span className="text-status-warning">Verification</span>
							<br />
							System
						</h2>

						{/* Descriptive Body Text */}
						<p className="text-white/80 text-base max-w-xl leading-relaxed font-light">
							A secure, encrypted QR-based platform for Persons with
							Disabilities to register, verify, and claim mandated benefits
							under RA No. 10754.
						</p>
						{/* Interactive Portal Quick Access Action Row */}
						{/* Core Yellow Application Button */}
						<button
							onClick={() => navigate("/Register")}
							className="px-5 py-3 bg-status-warning hover:bg-status-warning/90 text-foreground font-bold rounded-xl text-sm flex items-center space-x-2.5 transition-all shadow-md transform active:scale-98">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-4 w-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth={2.5}>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
								/>
							</svg>
							<span>Apply for Digital PWD ID</span>
						</button>

						<div className="pt-4 flex flex-wrap gap-4 items-center">
							{/* User Portal */}
							<button
								onClick={() => navigate("/User")}
								className="px-5 py-3 border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl text-sm flex items-center space-x-2.5 transition-all active:scale-98">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-4 w-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={2}>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M15 19a6 6 0 00-12 0m9-10a3 3 0 11-6 0 3 3 0 016 0zm3-3v6m3-3h-6"
									/>
								</svg>
								<span>User Portal</span>
							</button>

							{/* Secondary Merchant Portal Route */}
							<button
								onClick={() => navigate("/Merchant")}
								className="px-5 py-3 border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl text-sm flex items-center space-x-2.5 transition-all active:scale-98">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-4 w-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={2}>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
									/>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
									/>
								</svg>
								<span>Merchant / Verifier Portal</span>
							</button>

							{/* Secondary Admin Portal Route */}
							<button
								onClick={() => navigate("/Admin")}
								className="px-5 py-3 border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl text-sm flex items-center space-x-2.5 transition-all active:scale-98">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-4 w-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={2}>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
									/>
								</svg>
								<span>MSWDO Admin Portal</span>
							</button>
						</div>
					</div>

					{/* Right Column ID Mockup Card Display */}
					<div className="lg:col-span-5 flex justify-center lg:justify-end pt-8 lg:pt-0">
						<div className="w-72 rounded-2xl shadow-2xl overflow-hidden border border-white/10 transform rotate-3 hover:rotate-0 transition-transform duration-300">
							<img
								src="PWD-ID.jpeg"
								alt="PWD Digital ID Mockup"
								className="w-full h-auto block object-cover"
							/>
						</div>
					</div>
				</div>
			</div>

			{/* --- PORTALS GRID HUB SECTION --- */}
			<section className="max-w-6xl mx-auto px-6 mt-12 relative z-10 w-full">
				{/* Core Block Title Section */}
				<div className="text-center mb-10">
					<h3 className="font-Libre text-2xl md:text-3xl font-bold text-foreground mb-2">
						Three Portals, One System
					</h3>
					<p className="text-muted-foreground text-sm max-w-md mx-auto">
						Designed for every stakeholder in the verification process.
					</p>
				</div>

				{/* Portal Cards Mapping Layout */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{/* Card 1: PWD Beneficiary */}
					<div className="bg-card p-6 rounded-2xl shadow-sm border border-border-hairline flex flex-col justify-between group hover:shadow-md transition-shadow">
						<div>
							<div className="w-10 h-10 bg-[#eef3ff] text-primary rounded-xl flex items-center justify-center mb-5">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={2}>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
									/>
								</svg>
							</div>
							<h4 className="text-base font-bold text-foreground mb-2">
								PWD Beneficiary
							</h4>
							<p className="text-muted-foreground text-xs leading-relaxed mb-6">
								Register online, submit documents, and access your encrypted QR
								Digital ID once approved by MSWDO.
							</p>
						</div>
						<a
							href="#apply"
							className="text-primary text-xs font-bold flex items-center space-x-1.5 group-hover:underline">
							<span>Apply Now</span>
							<span>→</span>
						</a>
					</div>

					{/* Card 2: Merchant / Verifier */}
					<div className="bg-card p-6 rounded-2xl shadow-sm border border-border-hairline flex flex-col justify-between group hover:shadow-md transition-shadow">
						<div>
							<div
								className="w-10 h-10 bg-status-fraud-muted text-color-accent rounded-xl flex items-center justify-center mb-5"
								style={{ color: "var(--color-accent)" }}>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={2}>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
									/>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
									/>
								</svg>
							</div>
							<h4 className="text-base font-bold text-foreground mb-2">
								Merchant / Verifier
							</h4>
							<p className="text-muted-foreground text-xs leading-relaxed mb-6">
								Scan a beneficiary's QR code to instantly confirm legitimacy.
								Compliant with the Data Privacy Act — no sensitive data
								disclosed.
							</p>
						</div>
						<a
							href="#scanner"
							className="text-primary text-xs font-bold flex items-center space-x-1.5 group-hover:underline">
							<span>Open Scanner</span>
							<span>→</span>
						</a>
					</div>

					{/* Card 3: MSWDO Administrator */}
					<div className="bg-card p-6 rounded-2xl shadow-sm border border-border-hairline flex flex-col justify-between group hover:shadow-md transition-shadow">
						<div>
							<div className="w-10 h-10 bg-[#eef3ff] text-status-admin rounded-xl flex items-center justify-center mb-5">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={2}>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
									/>
								</svg>
							</div>
							<h4 className="text-base font-bold text-foreground mb-2">
								MSWDO Administrator
							</h4>
							<p className="text-muted-foreground text-xs leading-relaxed mb-6">
								Approve applications, manage the PWD registry, review audit
								logs, and monitor fraud reports from a secure dashboard.
							</p>
						</div>
						<a
							href="#admin"
							className="text-primary text-xs font-bold flex items-center space-x-1.5 group-hover:underline">
							<span>Admin Portal</span>
							<span>→</span>
						</a>
					</div>
				</div>
			</section>

			{/* Quantitative Stats */}
			<section className="max-w-4xl mx-auto px-6 w-full mt-14">
				<div className="bg-primary text-white rounded-2xl px-6 py-6 md:py-8 grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4 text-center shadow-md">
					{/* Registered PWDs */}
					<div className="border-r border-white/10 last:border-none md:odd:border-r">
						<p className="text-2xl md:text-3xl font-bold tracking-tight">
							3,196
						</p>
						<p className="text-[9px] uppercase tracking-wider text-white/70 font-medium mt-0.5">
							Registered PWDs
						</p>
					</div>
					{/* Active Digital IDs */}
					<div className="md:border-r border-white/10">
						<p className="text-2xl md:text-3xl font-bold tracking-tight">
							2,841
						</p>
						<p className="text-[9px] uppercase tracking-wider text-white/70 font-medium mt-0.5">
							Active Digital IDs
						</p>
					</div>
					{/* Verifications */}
					<div className="border-r border-white/10">
						<p className="text-2xl md:text-3xl font-bold tracking-tight">
							18,432
						</p>
						<p className="text-[9px] uppercase tracking-wider text-white/70 font-medium mt-0.5">
							Verifications (2025)
						</p>
					</div>
					{/* Fraud Flags Stopped */}
					<div>
						<p className="text-2xl md:text-3xl font-bold tracking-tight">174</p>
						<p className="text-[9px] uppercase tracking-wider text-white/70 font-medium mt-0.5">
							Fraud Flags Stopped
						</p>
					</div>
				</div>
			</section>

			{/* --- FOOTER REGULATORY & INFORMATION LOGS --- */}
			<footer className="mt-20 bg-foreground text-white/60 py-6 text-center text-[11px] border-t border-white/5 w-full">
				<div className="max-w-4xl mx-auto px-4 space-y-1">
					<p className="font-semibold text-white/80">
						Office for Persons with Disabilities Affairs — Guagua, Pampanga
					</p>
					<p className="leading-relaxed">
						For assistance, contact the PDAO at (045) 900-0000 · Compliant with
						RA No. 10173 (Data Privacy Act of 2012)
					</p>
				</div>
			</footer>

			{/* --- FLOATING HELP SUPPORT TRIGGER --- */}
			<button
				type="button"
				aria-label="Help support center"
				className="fixed bottom-6 right-6 w-10 h-10 bg-[#212121] hover:bg-black text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md transition-transform active:scale-95 z-50">
				?
			</button>
		</>
	);
}
