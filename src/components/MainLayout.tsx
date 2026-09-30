import { Outlet } from "react-router-dom";

export function MainLayout() {
	return (
		<div className="min-h-screen bg-background font-Jakarta text-foreground flex flex-col justify-between">
			<main className="w-full flex-1">
				<Outlet /> {/* This renders whatever page matches the current URL */}
			</main>
		</div>
	);
}
