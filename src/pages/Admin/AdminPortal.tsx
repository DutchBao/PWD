import { useEffect, useState } from "react";
import { Header } from "../../components/Header";
import { AdminLogin, type AdminUser } from "./AdminLogin";
import { DashboardOverview } from "./DashboardOverview";
import { ApplicationsWorkflow } from "./ApplicationsWorkflow";
import { PwdRegistry } from "./PwdRegistry";
import { VerificationAuditLogs } from "./VerificationAuditLogs";
import { StaffAccounts } from "./AdminAccounts";
import { ReportsAnalytics } from "./ReportsAnalytics";
import { supabase } from "../../lib/supabaseClient";
import type { Session } from "@supabase/supabase-js";
import type { Registration } from "../../database.types";

const SESSION_KEY = "mswdo_admin_user";

function loadStoredUser(): AdminUser | null {
	try {
		const raw = sessionStorage.getItem(SESSION_KEY);
		return raw ? (JSON.parse(raw) as AdminUser) : null;
	} catch {
		return null;
	}
}

export function AdminPortalController() {
	const [user, setUser] = useState<AdminUser | null>(loadStoredUser);
	const [activeTab, setActiveTab] = useState("overview");

	const isAuthenticated = user !== null;

	const handleLoginSuccess = (userData: AdminUser) => {
		setUser(userData);
		window.history.pushState({ adminLoggedIn: true }, "");
		try {
			sessionStorage.setItem(SESSION_KEY, JSON.stringify(userData));
		} catch {
			/* storage unavailable; login still works for this page load */
		}
	};

	const handleLogout = async () => {
		await supabase.auth.signOut();
		setUser(null);
		setActiveTab("overview");
		try {
			sessionStorage.removeItem(SESSION_KEY);
		} catch {
			/* ignore */
		}
	};

	/* Pressing Back after login would otherwise show a cached authenticated
	page even though the session may be gone — force logout so Back always
	lands on the login screen instead of a stale admin view. */
	useEffect(() => {
		if (!isAuthenticated) return;
		window.history.pushState({ adminLoggedIn: true }, "");

		const handlePopState = () => {
			handleLogout();
		};

		window.addEventListener("popstate", handlePopState);
		return () => {
			window.removeEventListener("popstate", handlePopState);
		};
	}, [isAuthenticated]);

	useEffect(() => {
		const verify = (session: Session | null) => {
			const stored = loadStoredUser();
			if (stored && (!session || session.user.id !== stored.authId)) {
				try {
					sessionStorage.removeItem(SESSION_KEY);
				} catch {
					/* ignore */
				}
				setUser(null);
			}
		};

		supabase.auth.getSession().then(({ data }) => verify(data.session));

		const { data: sub } = supabase.auth.onAuthStateChange((_event, session) =>
			verify(session),
		);
		return () => sub.subscription.unsubscribe();
	}, []);

	/*Fetched once here (not in each tab) so the "Applications" badge count,
	the dashboard's pending list, and the registry's pending banner all stay
	in sync without three separate queries.*/
	const [PendingApplications, setPendingApplications] = useState<
		Registration[]
	>([]);
	useEffect(() => {
		if (!isAuthenticated) return;

		const fetchData = async () => {
			const { data, error } = await supabase
				.from("Registration")
				.select("*")
				.eq("status", "pending");

			if (error) {
				console.error("Error fetching registry data:", error);
			} else {
				setPendingApplications(data ?? []);
			}
		};

		fetchData();
	}, [isAuthenticated]);

	const TABS = [
		{ id: "overview", label: "Overview", icon: "📊" },
		{
			id: "applications",
			label:
				PendingApplications === null
					? "Applications"
					: `Applications (${PendingApplications.length})`,
			icon: "📄",
		},
		{ id: "registry", label: "PWD Registry", icon: "👥" },
		{ id: "audit", label: "Audit Logs", icon: "⚡" },
		{ id: "staff", label: "Staff Accounts", icon: "🔑" },
		{ id: "reports", label: "Reports", icon: "📈" },
	];

	return (
		<div className="min-h-screen bg-input-background text-slate-800 flex flex-col font-Jakarta antialiased w-full">
			<Header
				showHomeButton={!isAuthenticated}
				Username={
					isAuthenticated
						? `${user.UserName} : ${user.fullName || "Admin"}`
						: undefined
				}
				establishmentName={isAuthenticated ? "MSWDO Administrator" : undefined}
				onLogout={isAuthenticated ? handleLogout : undefined}
			/>

			{!isAuthenticated ? (
				<div className="flex-1 flex items-center justify-center w-full">
					<AdminLogin onLoginSuccess={handleLoginSuccess} />
				</div>
			) : (
				<>
					<nav className="w-full bg-white border-b border-slate-200 shadow-xs overflow-x-auto overflow-y-hidden scrollbar-none">
						<div className="flex items-end space-x-1 px-6 max-w-7xl mx-auto w-max min-w-full">
							{TABS.map((tab) => {
								const isActive = activeTab === tab.id;
								return (
									<button
										key={tab.id}
										type="button"
										onClick={() => setActiveTab(tab.id)}
										className={`shrink-0 px-5 py-3.5 text-xs font-bold tracking-wide border-b-2 transition-all duration-150 cursor-pointer focus:outline-hidden flex items-center ${
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
						<main className="flex-1 p-6 lg:p-8 w-full">
							{activeTab === "overview" && (
								<DashboardOverview
									setActiveTab={setActiveTab}
									pendingApplications={PendingApplications}
								/>
							)}
							{activeTab === "applications" && <ApplicationsWorkflow />}
							{activeTab === "registry" && (
								<PwdRegistry pendingApplications={PendingApplications} />
							)}
							{activeTab === "audit" && <VerificationAuditLogs />}
							{activeTab === "staff" && <StaffAccounts />}
							{activeTab === "reports" && <ReportsAnalytics />}
						</main>
					</div>
				</>
			)}
		</div>
	);
}
