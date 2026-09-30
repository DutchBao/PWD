import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import {
	User,
	Eye,
	MapPin,
	Calendar,
	Star,
	FileText,
	ChevronDown,
	ChevronUp,
	PhoneCall,
	HelpCircle,
} from "lucide-react";

interface DigitalIdUser {
	pwdNumber: string;
	fullName: string;
}

interface UserPortalProps {
	user: DigitalIdUser;
	onLogout: () => void;
}

interface PwdRecord {
	disabilityProfile: string | null;
	homeAddress: string | null;
	expiration_date: string | null;
	Status: string | null;
	qr_path: string | null;
	photo_path: string | null; // Make sure column name matches your database schema
}

export function DigitalIdView({ user, onLogout }: UserPortalProps) {
	const [isBenefitsOpen, setIsBenefitsOpen] = useState(false);
	const [record, setRecord] = useState<PwdRecord | null>(null);
	const [qrUrl, setQrUrl] = useState<string | null>(null);
	const [photoUrl, setPhotoUrl] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let isMounted = true;

		const fetchRecord = async () => {
			setLoading(true);

			// Fetch record including photo_path column
			const { data, error } = await supabase
				.from("PWDinformation")
				.select(
					"disabilityProfile, homeAddress, expiration_date, Status, qr_path, photo_path",
				)
				.eq("pwdNum", user.pwdNumber)
				.maybeSingle();

			if (!isMounted) return;

			if (error) {
				console.error("Error fetching PWD record:", error);
				setLoading(false);
				return;
			}

			setRecord(data);

			// Fetch signed URL for QR Code
			if (data?.qr_path) {
				const { data: signedQr, error: qrError } = await supabase.storage
					.from("QR-Codes")
					.createSignedUrl(data.qr_path, 3600);

				if (!qrError && signedQr) {
					setQrUrl(signedQr.signedUrl);
				}
			}

			// Fetch signed URL or public URL for 1x1 Photo
			if (data?.photo_path) {
				const { data: signedPhoto, error: photoError } = await supabase.storage
					.from("pwd-photos") // Replace with your exact bucket name
					.createSignedUrl(data.photo_path, 3600);

				if (!photoError && signedPhoto) {
					setPhotoUrl(signedPhoto.signedUrl);
				}
			}

			setLoading(false);
		};

		fetchRecord();

		return () => {
			isMounted = false;
		};
	}, [user.pwdNumber]);

	const isActive = record?.Status === "ACTIVE";

	return (
		<div className="min-h-screen bg-[#f1f5f9] flex flex-col font-Jakarta text-slate-800 antialiased relative">
			<main className="flex-1 flex items-center justify-center p-4 my-6">
				<div className="w-full max-w-md bg-white border border-slate-200/80 rounded-3xl shadow-xl overflow-hidden p-6 space-y-5">
					<div className="flex justify-between items-center pb-2 border-b border-slate-100">
						<div className="flex items-center space-x-2">
							<div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
								<User className="w-4 h-4" />
							</div>
							<div>
								<h3 className="text-[10px] font-extrabold uppercase tracking-wider text-blue-900 leading-tight">
									PERSONS WITH DISABILITIES
								</h3>
								<p className="text-[10px] font-semibold text-slate-400 leading-tight">
									Municipality of Guagua, Pampanga
								</p>
							</div>
						</div>
						<span
							className={`inline-flex items-center space-x-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
								isActive
									? "bg-emerald-100 text-emerald-800 border-emerald-200"
									: "bg-slate-100 text-slate-600 border-slate-200"
							}`}>
							<span
								className={`w-1.5 h-1.5 rounded-full ${
									isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
								}`}
							/>
							<span>{loading ? "..." : (record?.Status ?? "UNKNOWN")}</span>
						</span>
					</div>

					<div className="flex items-start space-x-4 pt-1">
						{/* 1x1 Photo / Fallback Avatar */}
						<div className="w-20 h-20 bg-slate-100 border border-slate-200 rounded-2xl overflow-hidden flex items-center justify-center shrink-0 shadow-xs">
							{loading ? (
								<div className="w-full h-full bg-slate-200 animate-pulse" />
							) : photoUrl ? (
								<img
									src={photoUrl}
									alt={user.fullName}
									className="w-full h-full object-cover"
								/>
							) : (
								<User className="w-8 h-8 text-slate-400" />
							)}
						</div>

						<div className="space-y-1 flex-1 min-w-0">
							<h2 className="text-lg font-bold font-Libre text-slate-900 leading-tight truncate">
								{user.fullName}
							</h2>
							<p className="text-[10px] font-mono font-extrabold text-slate-500 tracking-wider">
								{user.pwdNumber}
							</p>

							<div className="space-y-1 pt-1.5 text-xs text-slate-600 font-medium">
								<div className="flex items-center space-x-2">
									<Eye className="w-3.5 h-3.5 text-slate-400 shrink-0" />
									<span className="truncate">
										{loading
											? "Loading..."
											: (record?.disabilityProfile ?? "Not specified")}
									</span>
								</div>
								<div className="flex items-center space-x-2">
									<MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
									<span className="truncate">
										{loading
											? "Loading..."
											: (record?.homeAddress ?? "Not specified")}
									</span>
								</div>
								<div className="flex items-center space-x-2">
									<Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
									<span>
										Valid until{" "}
										<strong className="text-slate-800 font-bold">
											{loading ? "..." : (record?.expiration_date ?? "N/A")}
										</strong>
									</span>
								</div>
							</div>
						</div>
					</div>

					<div className="bg-[#f8fafc] border border-slate-200/60 rounded-2xl p-4 text-center space-y-3">
						<div className="bg-[#0038a8] text-white py-1.5 px-3 rounded-lg inline-block w-full">
							<p className="text-[10px] font-extrabold tracking-widest uppercase">
								YOUR ENCRYPTED QR CODE
							</p>
							<p className="text-[9px] text-white/80 font-medium mt-0.5">
								Show this to the cashier, pharmacist, or MSWDO staff for
								verification.
							</p>
						</div>

						<div className="bg-white p-4 rounded-xl border border-slate-200 inline-flex items-center justify-center shadow-xs min-h-48 min-w-48">
							{loading ? (
								<p className="text-xs text-slate-400">Loading QR code...</p>
							) : qrUrl ? (
								<img
									src={qrUrl}
									alt="PWD Encrypted QR Code"
									className="w-44 h-44 mx-auto object-contain"
								/>
							) : (
								<p className="text-xs text-slate-400 px-4">
									QR code not available yet. Contact MSWDO if this persists.
								</p>
							)}
						</div>
					</div>

					<div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-3.5 flex items-center space-x-3">
						<div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg shrink-0">
							<Star className="w-4 h-4 fill-emerald-600 text-emerald-600" />
						</div>
						<div>
							<p className="text-xs font-bold text-emerald-900 leading-tight">
								Eligible for a 20% discount
							</p>
							<p className="text-[10px] font-medium text-emerald-700 leading-tight mt-0.5">
								on goods and services under Republic Act No. 10754.
							</p>
						</div>
					</div>

					<div className="border border-slate-200 rounded-2xl overflow-hidden">
						<button
							type="button"
							onClick={() => setIsBenefitsOpen(!isBenefitsOpen)}
							className="w-full bg-slate-50 hover:bg-slate-100/80 p-3.5 flex items-center justify-between text-left transition-colors cursor-pointer">
							<div className="flex items-center space-x-3">
								<div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
									<FileText className="w-4 h-4" />
								</div>
								<div>
									<p className="text-xs font-bold text-slate-800 leading-tight">
										AYUDA / Benefits Log
									</p>
									<p className="text-[10px] font-medium text-slate-500 leading-tight mt-0.5">
										Coming soon
									</p>
								</div>
							</div>
							{isBenefitsOpen ? (
								<ChevronUp className="w-4 h-4 text-slate-400" />
							) : (
								<ChevronDown className="w-4 h-4 text-slate-400" />
							)}
						</button>

						{isBenefitsOpen && (
							<div className="p-4 bg-white border-t border-slate-200 text-xs text-slate-500 text-center">
								Benefits tracking is not yet available.
							</div>
						)}
					</div>

					<button
						type="button"
						onClick={onLogout}
						className="w-full border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs py-3 rounded-xl flex items-center justify-center space-x-2 transition-colors cursor-pointer">
						<PhoneCall className="w-3.5 h-3.5 text-slate-400" />
						<span>Remove this ID from device</span>
					</button>
				</div>
			</main>

			<footer className="w-full bg-[#071330] text-white/70 text-[10px] py-3 text-center space-y-0.5 mt-auto">
				<p className="font-semibold">
					Office for Persons with Disabilities Affairs — Guagua, Pampanga
				</p>
				<p className="text-white/50">
					For assistance, contact the PDAO at (045) 900–0000
				</p>
			</footer>

			<button
				type="button"
				className="fixed bottom-4 right-4 bg-slate-800 text-white p-2.5 rounded-full shadow-lg hover:bg-slate-700 transition-colors cursor-pointer">
				<HelpCircle className="w-5 h-5" />
			</button>
		</div>
	);
}
