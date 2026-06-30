import { Outlet } from "react-router-dom";

export function MainLayout() {
	return (
		<div className="min-h-screen bg-background font-Jakarta text-foreground pb-12 flex flex-col justify-between">
			{/* Tip: If your Header or Footer should be on *every* page, 
               you can import and place them here safely!
            */}
			<main className="w-full flex-1">
				<Outlet /> {/* This renders whatever page matches the current URL */}
			</main>
		</div>
	);
}
