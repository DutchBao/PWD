import { useState } from "react";
import { Header } from "../../components/Header";
import { AdminLogin } from "./AdminLogin";
import { DashboardOverview } from "./DashboardOverview";
import { ApplicationsWorkflow } from "./ApplicationsWorkflow";
import { PwdRegistry } from "./PwdRegistry";
import { VerificationAuditLogs } from "./VerificationAuditLogs";
import { ReportsAnalytics } from "./ReportsAnalytics";

const TABS = [
	{ id: "overview", label: "Overview", icon: "📊" },
	{ id: "applications", label: "Applications (5)", icon: "📄" },
	{ id: "registry", label: "PWD Registry", icon: "👥" },
	{ id: "audit", label: "Audit Logs", icon: "⚡" },
	{ id: "reports", label: "Reports", icon: "📈" },
];

export function AdminPortalController() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [activeTab, setActiveTab] = useState("overview");

	const handleLogout = () => {
		setIsAuthenticated(false);
		setActiveTab("overview");
	};

	return (
		<div className="min-h-screen bg-input-background text-slate-800 flex flex-col font-Jakarta antialiased w-full">
			{/* Reusing exact un-modified Header component */}
			<Header
				showHomeButton={!isAuthenticated}
				merchantUsername={isAuthenticated ? "admin_mswdo_guagua" : undefined}
				establishmentName={isAuthenticated ? "MSWDO Administrator" : undefined}
				onLogout={isAuthenticated ? handleLogout : undefined}
			/>

			{!isAuthenticated ? (
				<div className="flex-1 flex items-center justify-center w-full">
					<AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />
				</div>
			) : (
				<>
					<nav className="w-full bg-white border-b border-slate-200 px-6 flex items-end shadow-xs">
						<div className="flex space-x-1 max-w-7xl mx-auto w-full">
							{TABS.map((tab) => {
								const isActive = activeTab === tab.id;
								return (
									<button
										key={tab.id}
										type="button"
										onClick={() => setActiveTab(tab.id)}
										className={`px-5 py-3.5 text-xs font-bold tracking-wide border-b-2 transition-all duration-150 cursor-pointer focus:outline-hidden flex items-center ${
											isActive
												? "border-[#0038a8] text-[#0038a8] font-extrabold bg-slate-50/50"
												: "border-transparent text-slate-500 hover:text-[#0038a8] hover:bg-slate-50/30"
										}`}>
										<span className="mr-2 text-sm leading-none opacity-90">
											{tab.icon}
										</span>
										{tab.label}
									</button>
								);
							})}
						</div>
					</nav>

					<div className="flex-1 w-full max-w-7xl mx-auto flex flex-col">
						{/* Sub-Navigation Ribbon Bar (Matches image_8243d3.png) */}

						{/* Core Panel Content Body Sheet Container */}
						<main className="flex-1 p-6 lg:p-8 w-full">
							{activeTab === "overview" && (
								<DashboardOverview setActiveTab={setActiveTab} />
							)}
							{activeTab === "applications" && <ApplicationsWorkflow />}
							{activeTab === "registry" && <PwdRegistry />}
							{activeTab === "audit" && <VerificationAuditLogs />}
							{activeTab === "reports" && <ReportsAnalytics />}
						</main>
					</div>
				</>
			)}
		</div>
	);
}
