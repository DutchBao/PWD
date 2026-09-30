import { useState } from "react";
import { X } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import type { PWDinformation } from "../../database.types";

export type PwdFormFields = {
	firstName: string;
	middleName: string;
	lastName: string;
	dateofBirth: string;
	contactNum: string;
	disabilityProfile: string;
	homeAddress: string;
	expiration_date: string;
	Status: string;
};

const DISABILITY_OPTIONS = [
	"Visual Impairment",
	"Hearing Impairment",
	"Speech and Language Impairment",
	"Orthopedic Disability",
	"Intellectual Disability",
	"Learning Disability",
	"Mental / Psychosocial Disability",
	"Chronic Illness",
];

function buildInitialForm(editingRow?: PWDinformation | null): PwdFormFields {
	if (editingRow) {
		return {
			firstName: editingRow.firstName ?? "",
			middleName: editingRow.middleName ?? "",
			lastName: editingRow.lastName ?? "",
			dateofBirth: editingRow.dateofBirth ?? "",
			contactNum: editingRow.contactNum ?? "",
			disabilityProfile: editingRow.disabilityProfile ?? DISABILITY_OPTIONS[0],
			homeAddress: editingRow.homeAddress ?? "",
			expiration_date: editingRow.expiration_date ?? "",
			Status: editingRow.Status ?? "ACTIVE",
		};
	}
	return {
		firstName: "",
		middleName: "",
		lastName: "",
		dateofBirth: "",
		contactNum: "",
		disabilityProfile: DISABILITY_OPTIONS[0],
		homeAddress: "",
		expiration_date: "",
		Status: "ACTIVE",
	};
}

interface PwdRecordModalProps {
	// Pass the row to edit an existing record, or null/undefined to add a new one
	editingRow?: PWDinformation | null;
	onClose: () => void;
	onSaved: (row: PWDinformation) => void;
}

export function PwdRecordModal({
	editingRow,
	onClose,
	onSaved,
}: PwdRecordModalProps) {
	const isEditing = !!editingRow;

	const [form, setForm] = useState<PwdFormFields>(() =>
		buildInitialForm(editingRow),
	);
	const [saving, setSaving] = useState(false);
	const [saveError, setSaveError] = useState("");

	const updateField = (field: keyof PwdFormFields, value: string) => {
		setForm((prev) => ({ ...prev, [field]: value }));
	};

	const handleClose = () => {
		if (saving) return;
		onClose();
	};

	const handleSave = async () => {
		if (!form.firstName.trim() || !form.lastName.trim()) {
			setSaveError("First and last name are required.");
			return;
		}
		if (!isEditing && (!form.dateofBirth || !form.contactNum.trim())) {
			setSaveError("Date of birth and contact number are required.");
			return;
		}

		setSaving(true);
		setSaveError("");

		const result = isEditing
			? await supabase
					.from("PWDinformation")
					.update({
						firstName: form.firstName.trim(),
						middleName: form.middleName.trim() || undefined,
						lastName: form.lastName.trim(),
						dateofBirth: form.dateofBirth || undefined,
						contactNum: form.contactNum.trim() || undefined,
						disabilityProfile: form.disabilityProfile,
						homeAddress: form.homeAddress.trim() || undefined,
						expiration_date: form.expiration_date || undefined,
						Status: form.Status,
					})
					.eq("pwdNum", editingRow!.pwdNum)
					.select()
					.maybeSingle()
			: await supabase
					.from("PWDinformation")
					.insert({
						firstName: form.firstName.trim(),
						middleName: form.middleName.trim() || undefined,
						lastName: form.lastName.trim(),
						dateofBirth: form.dateofBirth,
						contactNum: form.contactNum.trim(),
						disabilityProfile: form.disabilityProfile,
						homeAddress: form.homeAddress.trim(),
						expiration_date: form.expiration_date || undefined,
						Status: form.Status,
					})
					.select()
					.maybeSingle();

		setSaving(false);

		if (result.error) {
			console.error("Error saving record:", result.error);
			setSaveError(result.error.message || "Could not save changes.");
			return;
		}

		if (result.data) {
			onSaved(result.data);
		}
	};

	return (
		<div
			className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
			onClick={handleClose}>
			<div
				className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-fadeIn"
				onClick={(e) => e.stopPropagation()}>
				<div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
					<div>
						<h3 className="text-sm font-bold text-foreground">
							{isEditing ? "Edit PWD Record" : "Add PWD Record"}
						</h3>
						{isEditing && (
							<p className="text-xs font-DM font-bold text-primary tracking-wide">
								{editingRow!.pwdNum}
							</p>
						)}
					</div>
					<button
						onClick={handleClose}
						className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer">
						<X className="w-4 h-4" />
					</button>
				</div>

				<div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
						<div>
							<label className="block text-xs font-bold text-slate-700 mb-1.5">
								First Name
							</label>
							<input
								type="text"
								value={form.firstName}
								onChange={(e) => updateField("firstName", e.target.value)}
								className="w-full text-xs font-medium px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary"
							/>
						</div>
						<div>
							<label className="block text-xs font-bold text-slate-700 mb-1.5">
								Middle Name
							</label>
							<input
								type="text"
								value={form.middleName}
								onChange={(e) => updateField("middleName", e.target.value)}
								className="w-full text-xs font-medium px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary"
							/>
						</div>
						<div>
							<label className="block text-xs font-bold text-slate-700 mb-1.5">
								Last Name
							</label>
							<input
								type="text"
								value={form.lastName}
								onChange={(e) => updateField("lastName", e.target.value)}
								className="w-full text-xs font-medium px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary"
							/>
						</div>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<div>
							<label className="block text-xs font-bold text-slate-700 mb-1.5">
								Date of Birth
							</label>
							<input
								type="date"
								value={form.dateofBirth}
								onChange={(e) => updateField("dateofBirth", e.target.value)}
								className="w-full text-xs font-medium px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary"
							/>
						</div>
						<div>
							<label className="block text-xs font-bold text-slate-700 mb-1.5">
								Contact Number
							</label>
							<input
								type="tel"
								value={form.contactNum}
								onChange={(e) => updateField("contactNum", e.target.value)}
								placeholder="09XX-XXX-XXXX"
								className="w-full text-xs font-medium px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary"
							/>
						</div>
					</div>

					<div>
						<label className="block text-xs font-bold text-slate-700 mb-1.5">
							Disability Type
						</label>
						<select
							value={form.disabilityProfile}
							onChange={(e) => updateField("disabilityProfile", e.target.value)}
							className="w-full text-xs font-medium px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary">
							{DISABILITY_OPTIONS.map((option) => (
								<option key={option} value={option}>
									{option}
								</option>
							))}
						</select>
					</div>

					<div>
						<label className="block text-xs font-bold text-slate-700 mb-1.5">
							Home Address
						</label>
						<input
							type="text"
							value={form.homeAddress}
							onChange={(e) => updateField("homeAddress", e.target.value)}
							className="w-full text-xs font-medium px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary"
						/>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<div>
							<label className="block text-xs font-bold text-slate-700 mb-1.5">
								Valid Until
							</label>
							<input
								type="date"
								value={form.expiration_date}
								onChange={(e) => updateField("expiration_date", e.target.value)}
								className="w-full text-xs font-medium px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary"
							/>
						</div>
						<div>
							<label className="block text-xs font-bold text-slate-700 mb-1.5">
								Status
							</label>
							<select
								value={form.Status}
								onChange={(e) => updateField("Status", e.target.value)}
								className="w-full text-xs font-medium px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary">
								<option value="ACTIVE">ACTIVE</option>
								<option value="INACTIVE">INACTIVE</option>
								<option value="EXPIRED">EXPIRED</option>
							</select>
						</div>
					</div>

					{saveError && (
						<p className="text-xs font-semibold text-rose-600">{saveError}</p>
					)}
				</div>

				<div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-2">
					<button
						onClick={handleClose}
						disabled={saving}
						className="px-4 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-xl transition cursor-pointer disabled:opacity-50">
						Cancel
					</button>
					<button
						onClick={handleSave}
						disabled={saving}
						className="px-4 py-2.5 bg-primary hover:bg-blue-800 text-white text-xs font-bold rounded-xl transition shadow-sm cursor-pointer disabled:opacity-60">
						{saving ? "Saving..." : isEditing ? "Save Changes" : "Add Record"}
					</button>
				</div>
			</div>
		</div>
	);
}
