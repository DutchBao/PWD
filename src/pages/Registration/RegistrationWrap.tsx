import { Header } from "../../components/Header";

export function RegistrationWrap({
	step,
	children,
}: {
	step: number;
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen bg-[#edf2f7] font-Jakarta flex flex-col justify-between relative">
			{/* Header */}
			<Header showHomeButton />

			{/* Progress Steps Bar */}
			{step < 4 && (
				<div className="bg-white border-b border-gray-100 py-4 flex justify-center items-center space-x-2 md:space-x-4 text-xs md:text-sm font-medium text-gray-500">
					<div className="flex items-center space-x-2">
						{step > 1 ? (
							<span className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs">
								✓
							</span>
						) : (
							<span className="w-6 h-6 bg-[#0046b4] text-white rounded-full flex items-center justify-center text-xs">
								1
							</span>
						)}
						<span
							className={
								step === 1 ? "text-gray-900 font-semibold" : "text-gray-400"
							}>
							Personal Details
						</span>
					</div>
					<span className="text-gray-300">›</span>
					<div className="flex items-center space-x-2">
						{step > 2 ? (
							<span className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs">
								✓
							</span>
						) : (
							<span
								className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 2 ? "bg-[#0046b4] text-white" : "bg-gray-200"}`}>
								2
							</span>
						)}
						<span
							className={
								step === 2 ? "text-gray-900 font-semibold" : "text-gray-400"
							}>
							Disability Profile
						</span>
					</div>
					<span className="text-gray-300">›</span>
					<div className="flex items-center space-x-2">
						<span
							className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 3 ? "bg-[#0046b4] text-white" : "bg-gray-200"}`}>
							3
						</span>
						<span
							className={
								step === 3 ? "text-gray-900 font-semibold" : "text-gray-400"
							}>
							Document Upload
						</span>
					</div>
				</div>
			)}

			{/* Dynamic Content Body */}
			<main className="flex-1 flex items-center justify-center p-4 md:p-8">
				{children}
			</main>

			{/*Help Button */}
			<button className="absolute bottom-4 right-4 w-10 h-10 bg-zinc-800 text-white rounded-full flex items-center justify-center text-lg font-bold hover:bg-zinc-700 shadow-md">
				?
			</button>
		</div>
	);
}
