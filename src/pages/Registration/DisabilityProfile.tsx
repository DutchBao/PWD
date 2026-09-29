import type { RegistrationData } from "./Register";

type Props = {
	data: RegistrationData;
	update: (fields: Partial<RegistrationData>) => void;
	onNext: () => void;
	onBack: () => void;
};

export function Disability({ data, update, onNext, onBack }: Props) {
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
		<div className="bg-white rounded-2xl shadow-sm border border-gray-100 max-w-xl w-full p-6 md:p-8">
			<h2 className="text-2xl font-bold text-[#002868]">Disability Profile</h2>
			<p className="text-gray-500 text-sm mt-1 mb-6">
				Select your primary disability type as assessed by a licensed physician.
			</p>

			<div className="space-y-2.5">
				{options.map((option) => {
					const isChecked = data.disabilityType === option;
					return (
						<label
							key={option}
							onClick={() => update({ disabilityType: option })}
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
					onClick={onBack}
					className="w-1/3 border border-gray-200 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-50 transition text-sm">
					Back
				</button>
				<button
					onClick={onNext}
					className="w-2/3 bg-[#0046b4] hover:bg-blue-800 text-white font-medium py-3 rounded-xl flex items-center justify-center space-x-2 transition shadow-sm text-sm">
					<span>Continue to Documents</span> <span>›</span>
				</button>
			</div>
		</div>
	);
}
