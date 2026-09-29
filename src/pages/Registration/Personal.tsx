import type { RegistrationData } from "./Register";

type Props = {
	data: RegistrationData;
	update: (fields: Partial<RegistrationData>) => void;
	onNext: () => void;
};

export function Personal({ data, update, onNext }: Props) {
	return (
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
					onNext();
				}}
				className="space-y-4">
				<div>
					<label className="block text-sm font-semibold text-[#002868] mb-1.5">
						First Name
					</label>
					<input
						className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#f8fafc] text-sm focus:outline-none focus:border-blue-500"
						type="text"
						placeholder="e.g. Maria"
						value={data.firstName}
						onChange={(e) => update({ firstName: e.target.value })}
						required
					/>
				</div>
				<div>
					<label className="block text-sm font-semibold text-[#002868] mb-1.5">
						Last Name
					</label>
					<input
						type="text"
						placeholder="e.g. Santos"
						className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#f8fafc] text-sm focus:outline-none focus:border-blue-500"
						value={data.lastName}
						onChange={(e) => update({ lastName: e.target.value })}
						required
					/>
				</div>
				<div>
					<label className="block text-sm font-semibold text-[#002868] mb-1.5">
						Middle Name (Optional)
					</label>
					<input
						type="text"
						placeholder="e.g. Cruz"
						className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#f8fafc] text-sm focus:outline-none focus:border-blue-500"
						value={data.middleName}
						onChange={(e) => update({ middleName: e.target.value })}
					/>
				</div>

				<div>
					<label className="block text-sm font-semibold text-[#002868] mb-1.5">
						Date of Birth
					</label>
					<input
						type="date"
						className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#f8fafc] text-sm text-gray-500 focus:outline-none focus:border-blue-500"
						value={data.dateOfBirth}
						onChange={(e) => update({ dateOfBirth: e.target.value })}
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
						value={data.address}
						onChange={(e) => update({ address: e.target.value })}
						required
					/>
				</div>

				<div>
					<label className="block text-sm font-semibold text-[#002868] mb-1.5">
						Email Address
					</label>
					<input
						type="email"
						placeholder="example@email.com"
						className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#f8fafc] text-sm focus:outline-none focus:border-blue-500"
						value={data.email}
						onChange={(e) => update({ email: e.target.value })}
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
						value={data.contactNumber}
						onChange={(e) => update({ contactNumber: e.target.value })}
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
	);
}
