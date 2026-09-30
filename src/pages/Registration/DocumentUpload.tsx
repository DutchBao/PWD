import type { RegistrationData } from "./Register";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "../../lib/supabaseClient";

type Props = {
	data: RegistrationData;
	update: (fields: Partial<RegistrationData>) => void;
	onNext: () => void;
	onBack: () => void;
};

// keeps the approval flow working even when a photo wasn't provided.
const PLACEHOLDER_PNG_BASE64 =
	"iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";

function base64ToBlob(base64: string, mime: string) {
	const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
	return new Blob([bytes], { type: mime });
}

export function DocumentUpload({ data, update, onNext, onBack }: Props) {
	const [submitting, setSubmitting] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");

	const photoPreview = useMemo(() => {
		if (!data.photoFile) return null;
		return URL.createObjectURL(data.photoFile);
	}, [data.photoFile]);

	useEffect(() => {
		return () => {
			if (photoPreview) URL.revokeObjectURL(photoPreview);
		};
	}, [photoPreview]);

	const documentPreview = useMemo(() => {
		if (!data.documentFile) return null;
		if (!data.documentFile.type.startsWith("image/")) return null;
		return URL.createObjectURL(data.documentFile);
	}, [data.documentFile]);

	useEffect(() => {
		return () => {
			if (documentPreview) URL.revokeObjectURL(documentPreview);
		};
	}, [documentPreview]);

	const uploadOne = async (
		bucket: string,
		file: File | null,
		fallbackExt: string,
	): Promise<{ path: string } | { error: string }> => {
		const fileToUpload: File | Blob = file
			? file
			: base64ToBlob(PLACEHOLDER_PNG_BASE64, "image/png");
		const ext = file ? file.name.split(".").pop() : fallbackExt;
		const filePath = `${crypto.randomUUID()}.${ext}`;

		const { error } = await supabase.storage
			.from(bucket)
			.upload(filePath, fileToUpload);

		if (error) return { error: error.message };
		return { path: filePath };
	};

	const handleSubmit = async () => {
		if (!data.documentFile) {
			setErrorMsg("Please upload your Medical Certificate or PWD ID.");
			return;
		}
		if (submitting) return;
		setSubmitting(true);
		setErrorMsg("");

		// abort before creating a Registration row if this upload fails.
		const docResult = await uploadOne(
			"pwd-documents",
			data.documentFile,
			"png",
		);
		if ("error" in docResult) {
			console.error(docResult.error);
			setErrorMsg("Could not upload your document. Please try again.");
			setSubmitting(false);
			return;
		}

		const photoResult = await uploadOne("pwd-photos", data.photoFile, "png");
		if ("error" in photoResult) {
			console.error(photoResult.error);
			await supabase.storage.from("pwd-documents").remove([docResult.path]);
			setErrorMsg("Could not upload your photo. Please try again.");
			setSubmitting(false);
			return;
		}

		const emailToUse =
			data.email?.trim() || `test-${crypto.randomUUID()}@example.com`;

		const { error: insertError } = await supabase.from("Registration").insert({
			firstName: data.firstName,
			lastName: data.lastName,
			middleName: data.middleName || null,
			dateofBirth: data.dateOfBirth,
			email: emailToUse,
			homeAddress: data.address,
			contactNum: data.contactNumber,
			dissabilityProfile: data.disabilityType,
			createdAt: new Date().toISOString(),
			document_path: docResult.path,
			photo_path: photoResult.path,
		});

		if (insertError) {
			console.error(insertError);
			await supabase.storage.from("pwd-documents").remove([docResult.path]);
			await supabase.storage.from("pwd-photos").remove([photoResult.path]);
			setErrorMsg("Could not save your application. Please try again.");
			setSubmitting(false);
			return;
		}

		onNext();
	};

	return (
		<div className="bg-white rounded-2xl shadow-sm border border-gray-100 max-w-xl w-full p-6 md:p-8">
			<h2 className="text-2xl font-bold text-[#002868]">Document Upload</h2>
			<p className="text-gray-500 text-sm mt-1 mb-6">
				Upload your Medical Certificate or existing physical PWD ID, and a
				recent photo of yourself, for MSWDO verification.
			</p>

			<div className="space-y-4">
				<div>
					<p className="text-xs font-bold text-[#002868] mb-1.5">
						Medical Certificate or Physical PWD ID
					</p>
					<label className="border-2 border-dashed border-blue-200 bg-blue-50/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-blue-50/20 transition overflow-clip">
						<input
							type="file"
							accept="image/png,image/jpeg,application/pdf"
							className="hidden"
							onChange={(e) =>
								update({ documentFile: e.target.files?.[0] ?? null })
							}
						/>
						{data.documentFile ? (
							<>
								{documentPreview ? (
									<img
										src={documentPreview}
										alt="Preview"
										className="w-20 h-20 object-cover rounded-xl border border-gray-200 mb-2"
									/>
								) : (
									<div className="w-9 h-9 bg-blue-50 text-[#0046b4] rounded-full flex items-center justify-center mb-2 text-lg">
										📄
									</div>
								)}
								<p className="text-sm font-semibold text-gray-700 break-all px-2">
									{data.documentFile.name}
								</p>
								<p className="text-xs text-[#0046b4] font-semibold underline mt-1">
									Change file
								</p>
							</>
						) : (
							<>
								<div className="w-9 h-9 bg-blue-50 text-[#0046b4] rounded-full flex items-center justify-center mb-2">
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
							</>
						)}
					</label>
				</div>

				<div>
					<p className="text-xs font-bold text-[#002868] mb-1.5">
						Photo of Applicant
					</p>
					<label className="border-2 border-dashed border-blue-200 bg-blue-50/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-blue-50/20 transition">
						<input
							type="file"
							accept="image/png,image/jpeg"
							className="hidden"
							onChange={(e) =>
								update({ photoFile: e.target.files?.[0] ?? null })
							}
						/>
						{photoPreview ? (
							<>
								<img
									src={photoPreview}
									alt="Preview"
									className="w-20 h-20 object-cover rounded-full border border-gray-200 mb-2"
								/>
								<p className="text-sm font-semibold text-gray-700">
									{data.photoFile!.name}
								</p>
								<p className="text-xs text-[#0046b4] font-semibold underline mt-1">
									Change photo
								</p>
							</>
						) : (
							<>
								<div className="w-9 h-9 bg-blue-50 text-[#0046b4] rounded-full flex items-center justify-center mb-2">
									🧑
								</div>
								<p className="text-sm text-gray-700">
									<span className="font-semibold">Drop file here or </span>
									<span className="text-[#0046b4] font-semibold underline">
										browse
									</span>
								</p>
								<p className="text-xs text-gray-400 mt-1">
									PNG or JPG · max 5MB
								</p>
							</>
						)}
					</label>
				</div>
			</div>

			{errorMsg && (
				<p className="text-xs font-semibold text-rose-600 mt-4">{errorMsg}</p>
			)}

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
					disabled={submitting}
					className="w-2/3 bg-[#0046b4] hover:bg-blue-800 text-white font-medium py-3 rounded-xl transition shadow-sm text-sm disabled:opacity-60">
					{submitting ? "Submitting..." : "Submit Application"}
				</button>
			</div>
		</div>
	);
}
