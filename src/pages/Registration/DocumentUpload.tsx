import type { RegistrationData } from "./Register";
import { useState } from "react";
import { supabase } from "./RegistrationClient.ts"; // adjust to your client file

type Props = {
	data: RegistrationData;
	update: (fields: Partial<RegistrationData>) => void;
	onNext: () => void;
	onBack: () => void;
};

export function DocumentUpload({ data, update, onNext, onBack }: Props) {
	const [submitting, setSubmitting] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");

	const handleSubmit = async () => {
		if (!data.documentFile || submitting) return;
		setSubmitting(true);
		setErrorMsg("");

		// 1. Upload the file with a random name (not the user's file name)
		const ext = data.documentFile.name.split(".").pop();
		const filePath = `${crypto.randomUUID()}.${ext}`;

		const { error: uploadError } = await supabase.storage
			.from("pwd-documents")
			.upload(filePath, data.documentFile);

		if (uploadError) {
			console.error(uploadError);
			setErrorMsg("Could not upload your document. Please try again.");

			setSubmitting(false);
			return;
		}

		// 2. Insert the row, including the file path
		const { error: insertError } = await supabase.from("Registration").insert({
			firstName: data.firstName,
			lastName: data.lastName,
			middleName: data.middleName || null,
			dateofBirth: data.dateOfBirth,
			email: data.email,
			homeAddress: data.address,
			contactNum: data.contactNumber,
			dissabilityProfile: data.disabilityType,
			createdAt: new Date().toISOString(),
			document_path: filePath,
		});

		if (insertError) {
			console.error(insertError);
			// Clean up the orphaned file
			await supabase.storage.from("pwd-documents").remove([filePath]);
			setErrorMsg("Could not save your application. Please try again.");
			setSubmitting(false);
			console.log("Error inserting row:", errorMsg);
			return;
		}

		// 3. Both succeeded
		onNext();
	};

	return (
		<div className="bg-white rounded-2xl shadow-sm border border-gray-100 max-w-xl w-full p-6 md:p-8">
			<h2 className="text-2xl font-bold text-[#002868]">Document Upload</h2>
			<p className="text-gray-500 text-sm mt-1 mb-6">
				Upload your Medical Certificate or existing physical PWD ID for MSWDO
				verification.
			</p>

			<label className="border-2 border-dashed border-blue-200 bg-blue-50/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-blue-50/20 transition">
				<input
					type="file"
					accept="image/png,image/jpeg,application/pdf"
					onChange={(e) =>
						update({ documentFile: e.target.files?.[0] ?? null })
					}
				/>
				<div className="w-10 h-10 bg-blue-50 text-[#0046b4] rounded-full flex items-center justify-center mb-3">
					📤
				</div>
				{data.documentFile ? (
					<p className="text-sm font-semibold text-gray-700">
						{data.documentFile.name}
					</p>
				) : (
					<p className="text-sm text-gray-700">
						<span className="font-semibold">Drop file here or </span>
						<span className="text-[#0046b4] font-semibold underline">
							browse
						</span>
					</p>
				)}
				<p className="text-xs text-gray-400 mt-1">PNG, JPG, or PDF · max 5MB</p>
			</label>

			<p className="text-[10px] text-gray-400 text-center mt-4">
				Reviewed only by authorized MSWDO staff. Handled in compliance with RA
				10173 (Data Privacy Act of 2012).
			</p>

			<div className="flex items-center space-x-3 mt-6">
				<button
					onClick={onBack}
					className="w-1/3 border border-gray-200 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-50 transition text-sm">
					Back
				</button>
				<button
					onClick={handleSubmit}
					className="w-2/3 bg-[#0046b4] hover:bg-blue-800 text-white font-medium py-3 rounded-xl transition shadow-sm text-sm">
					Submit Application
				</button>
			</div>
		</div>
	);
}
