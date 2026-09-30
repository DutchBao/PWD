interface HeaderProps {
	showHomeButton?: boolean;
	transparent?: boolean;
	Username?: string;
	establishmentName?: string;
	onLogout?: () => void;
}

export function Header({
	showHomeButton = false,
	transparent = false,
	Username,
	establishmentName,
	onLogout,
}: HeaderProps) {
	return (
		<header
			className={`w-full px-6 py-4 flex items-center shadow-md transition-colors ${
				transparent ? "bg-transparent shadow-none" : "bg-primary text-white"
			}`}>
			<div className="max-w-7xl mx-auto w-full flex items-center justify-between space-x-6">
				<div className="flex items-center space-x-6">
					{showHomeButton && (
						<>
							<button
								type="button"
								onClick={() => (window.location.href = "/")}
								className="flex items-center space-x-2 text-sm text-white opacity-90 hover:opacity-100 transition-opacity focus:outline-hidden cursor-pointer">
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
										d="M10 19l-7-7m0 0l7-7m-7 7h18"
									/>
								</svg>
								<span>Home</span>
							</button>
							<div className="h-8 w-px bg-white/20" />
						</>
					)}

					<div className="flex items-center space-x-3 text-white">
						<div className="p-1.5 bg-white/10 rounded-full shrink-0">
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

						<div>
							<p className="text-[9px] font-medium uppercase tracking-widest text-white/70 leading-none mb-0.5">
								Republic of the Philippines — MSWDO
							</p>
							<h1 className="text-xs font-semibold tracking-wide leading-none">
								Municipality of Guagua, Pampanga — PWD Digital ID System
							</h1>
						</div>
					</div>
				</div>

				{Username && onLogout && (
					<div className="flex items-center space-x-6 animate-fadeIn">
						<div className="text-right hidden sm:block">
							<p className="text-xs font-DM font-bold text-white leading-none">
								{Username}
							</p>
							<p className="text-[10px] text-white/70 mt-1 leading-none">
								{establishmentName || "Authorized Verifier"}
							</p>
						</div>
						<button
							type="button"
							onClick={onLogout}
							className="text-xs font-bold text-white/90 hover:text-white transition-colors underline underline-offset-4 focus:outline-hidden cursor-pointer">
							Logout
						</button>
					</div>
				)}
			</div>
		</header>
	);
}
