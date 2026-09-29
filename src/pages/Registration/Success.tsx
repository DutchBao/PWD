import { useNavigate } from "react-router-dom";

export function Success() {
	const navigate = useNavigate();
	return (
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
				<h4 className="text-sm font-bold text-[#0046b4]">What happens next?</h4>
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
							Your unique encrypted QR code ID will be generated upon approval.
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
	);
}
