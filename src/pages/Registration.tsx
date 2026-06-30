import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";

function RegistrationPageWrapper({
	step,
	children,
}: {
	step: number;
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen bg-[#edf2f7] font-Jakarta flex flex-col justify-between relative">
			{/* Global Header */}
			<Header showHomeButton />

			{/* Global Progress Steps Bar (Hidden on Success Step 4) */}
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

			{/* Floating Help Button */}
			<button className="absolute bottom-4 right-4 w-10 h-10 bg-zinc-800 text-white rounded-full flex items-center justify-center text-lg font-bold hover:bg-zinc-700 shadow-md">
				?
			</button>
		</div>
	);
}

export function Personal() {
	const navigate = useNavigate();
	return (
		<RegistrationPageWrapper step={1}>
			<div className="bg-white rounded-2xl shadow-sm border border-gray-100 max-w-xl w-full p-6 md:p-8">
				<h2 className="text-2xl font-bold text-[#002868]">
					Personal Information
				</h2>
				<p className="text-gray-500 text-sm mt-1 mb-6">
					Provide your basic personal details for MSWDO registration.
				</p>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						navigate("/Register-Disability-Profile");
					}}
					className="space-y-4">
					<div>
						<label className="block text-sm font-semibold text-[#002868] mb-1.5">
							Full Legal Name
						</label>
						<input
							type="text"
							placeholder="e.g. Maria Cruz Santos"
							className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#f8fafc] text-sm focus:outline-none focus:border-blue-500"
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-semibold text-[#002868] mb-1.5">
							Date of Birth
						</label>
						<input
							type="date"
							className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#f8fafc] text-sm text-gray-500 focus:outline-none focus:border-blue-500"
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-semibold text-[#002868] mb-1.5">
							Home Address
						</label>
						<input
							type="text"
							placeholder="Barangay, Municipality, Province"
							className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#f8fafc] text-sm focus:outline-none focus:border-blue-500"
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-semibold text-[#002868] mb-1.5">
							Contact Number
						</label>
						<input
							type="tel"
							placeholder="09XX-XXX-XXXX"
							className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#f8fafc] text-sm focus:outline-none focus:border-blue-500"
							required
						/>
					</div>
					<button
						type="submit"
						className="w-full mt-4 bg-[#0046b4] hover:bg-blue-800 text-white font-medium py-3 rounded-xl flex items-center justify-center space-x-2 transition shadow-sm">
						<span>Continue to Disability Profile</span> <span>›</span>
					</button>
				</form>
			</div>
		</RegistrationPageWrapper>
	);
}

export function Disability() {
	const navigate = useNavigate();
	const [selected, setSelected] = useState("Visual Impairment");

	const options = [
		"Visual Impairment",
		"Hearing Impairment",
		"Speech and Language Impairment",
		"Orthopedic Disability",
		"Intellectual Disability",
		"Learning Disability",
		"Mental / Psychosocial Disability",
		"Chronic Illness",
	];

	return (
		<RegistrationPageWrapper step={2}>
			<div className="bg-white rounded-2xl shadow-sm border border-gray-100 max-w-xl w-full p-6 md:p-8">
				<h2 className="text-2xl font-bold text-[#002868]">
					Disability Profile
				</h2>
				<p className="text-gray-500 text-sm mt-1 mb-6">
					Select your primary disability type as assessed by a licensed
					physician.
				</p>

				<div className="space-y-2.5">
					{options.map((option) => {
						const isChecked = selected === option;
						return (
							<label
								key={option}
								onClick={() => setSelected(option)}
								className={`flex items-center space-x-3 p-3.5 rounded-xl border transition cursor-pointer ${isChecked ? "border-[#0046b4] bg-blue-50/40 font-medium text-blue-900" : "border-gray-100 bg-white text-gray-700 hover:bg-gray-50"}`}>
								<span
									className={`w-4 h-4 rounded-full border flex items-center justify-center ${isChecked ? "border-[#0046b4]" : "border-gray-300"}`}>
									{isChecked && (
										<span className="w-2 h-2 bg-[#0046b4] rounded-full"></span>
									)}
								</span>
								<span className="text-sm">{option}</span>
							</label>
						);
					})}
				</div>

				<div className="flex items-center space-x-3 mt-6">
					<button
						onClick={() => navigate("/Register-Personal-Inforation")}
						className="w-1/3 border border-gray-200 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-50 transition text-sm">
						Back
					</button>
					<button
						onClick={() => navigate("/Register-Document")}
						className="w-2/3 bg-[#0046b4] hover:bg-blue-800 text-white font-medium py-3 rounded-xl flex items-center justify-center space-x-2 transition shadow-sm text-sm">
						<span>Continue to Documents</span> <span>›</span>
					</button>
				</div>
			</div>
		</RegistrationPageWrapper>
	);
}

export function Document() {
	const navigate = useNavigate();
	return (
		<RegistrationPageWrapper step={3}>
			<div className="bg-white rounded-2xl shadow-sm border border-gray-100 max-w-xl w-full p-6 md:p-8">
				<h2 className="text-2xl font-bold text-[#002868]">Document Upload</h2>
				<p className="text-gray-500 text-sm mt-1 mb-6">
					Upload your Medical Certificate or existing physical PWD ID for MSWDO
					verification.
				</p>

				<div className="border-2 border-dashed border-blue-200 bg-blue-50/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-blue-50/20 transition">
					<div className="w-10 h-10 bg-blue-50 text-[#0046b4] rounded-full flex items-center justify-center mb-3">
						📤
					</div>
					<p className="text-sm text-gray-700">
						<span className="font-semibold">Drop file here or </span>
						<span className="text-[#0046b4] font-semibold underline">
							browse
						</span>
					</p>
					<p className="text-xs text-gray-400 mt-1">
						PNG, JPG, or PDF · max 5MB
					</p>
				</div>

				<p className="text-[10px] text-gray-400 text-center mt-4">
					Reviewed only by authorized MSWDO staff. Handled in compliance with RA
					10173 (Data Privacy Act of 2012).
				</p>

				<div className="flex items-center space-x-3 mt-6">
					<button
						onClick={() => navigate("/Register-Disability-Profile")}
						className="w-1/3 border border-gray-200 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-50 transition text-sm">
						Back
					</button>
					<button
						onClick={() => navigate("/Register-Success")}
						className="w-2/3 bg-[#0046b4] hover:bg-blue-800 text-white font-medium py-3 rounded-xl transition shadow-sm text-sm">
						Submit Application
					</button>
				</div>
			</div>
		</RegistrationPageWrapper>
	);
}

export function Success() {
	const navigate = useNavigate();
	return (
		<RegistrationPageWrapper step={4}>
			<div className="bg-white rounded-2xl shadow-sm border border-gray-100 max-w-xl w-full p-8 text-center flex flex-col items-center">
				<div className="w-14 h-14 bg-emerald-50 text-emerald-500 border border-emerald-200 rounded-full flex items-center justify-center text-2xl font-bold mb-4">
					✓
				</div>
				<h2 className="text-2xl font-bold text-[#002868]">
					Application Submitted!
				</h2>
				<p className="text-gray-500 text-sm mt-2 max-w-md">
					Your documents have been forwarded to the Guagua MSWDO for validation.
					You will be notified once approved.
				</p>

				<div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5 text-left w-full mt-6 space-y-3">
					<h4 className="text-sm font-bold text-[#0046b4]">
						What happens next?
					</h4>
					<ul className="text-xs text-blue-900 space-y-2">
						<li className="flex items-start space-x-2">
							<span>›</span>{" "}
							<span>
								MSWDO staff will review your documents within 3–5 business days.
							</span>
						</li>
						<li className="flex items-start space-x-2">
							<span>›</span>{" "}
							<span>
								Your unique encrypted QR code ID will be generated upon
								approval.
							</span>
						</li>
						<li className="flex items-start space-x-2">
							<span>›</span>{" "}
							<span>
								Log in to access your Digital PWD ID and begin claiming your 20%
								discount.
							</span>
						</li>
					</ul>
				</div>

				<button
					onClick={() => navigate("/")}
					className="w-auto mt-6 bg-[#0046b4] hover:bg-blue-800 text-white font-medium py-2.5 px-8 rounded-xl transition shadow-sm text-sm">
					Return to Home
				</button>
			</div>
		</RegistrationPageWrapper>
	);
}
