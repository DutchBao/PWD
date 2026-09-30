import { useCallback, useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { supabase } from "../../lib/supabaseClient";
import {
	Camera,
	CheckCircle,
	AlertTriangle,
	XCircle,
	History,
} from "lucide-react";

interface ScanRecord {
	id: number;
	name: string;
	idNum: string;
	time: string;
	result: "VERIFIED" | "EXPIRED" | "INACTIVE" | "INVALID";
}

interface MerchantPageProps {
	onLogout: () => void;
}

const resultStyles: Record<
	ScanRecord["result"],
	{ bg: string; text: string; label: string }
> = {
	VERIFIED: {
		bg: "bg-status-success-muted border-status-success",
		text: "text-status-success",
		label: "Verified — Active",
	},
	EXPIRED: {
		bg: "bg-amber-50 border-amber-400",
		text: "text-amber-600",
		label: "Expired ID",
	},
	INACTIVE: {
		bg: "bg-amber-50 border-amber-400",
		text: "text-amber-600",
		label: "Inactive ID",
	},
	INVALID: {
		bg: "bg-status-fraud-muted border-status-fraud",
		text: "text-status-fraud",
		label: "Invalid QR Code",
	},
};

const SCANNER_ELEMENT_ID = "qr-scanner-region";

export function MerchantPage({ onLogout }: MerchantPageProps) {
	const [scanning, setScanning] = useState(true);
	const [lastResult, setLastResult] = useState<{
		result: ScanRecord["result"];
		fullName?: string;
		pwdNumber?: string;
		disabilityType?: string;
		expirationDate?: string;
	} | null>(null);
	const [scanHistory, setScanHistory] = useState<ScanRecord[]>([]);
	const [busy, setBusy] = useState(false);
	const scannerRef = useRef<Html5Qrcode | null>(null);
	const handledRef = useRef(false);

	// Moved above the useEffect that references it
	const handleScan = useCallback(async (token: string) => {
		setBusy(true);
		setScanning(false);

		const { data, error } = await supabase.functions.invoke("verify-pwd", {
			body: { token },
		});

		setBusy(false);

		if (error || !data) {
			console.error(error);
			setLastResult({ result: "INVALID" });
			return;
		}

		setLastResult(data);

		setScanHistory((prev) => [
			{
				id: Date.now(),
				name: data.fullName ?? "Unknown",
				idNum: data.pwdNumber ?? "???-????-???",
				time: new Date().toLocaleTimeString("en-US", {
					hour: "2-digit",
					minute: "2-digit",
				}),
				result: data.result,
			},
			...prev,
		]);
	}, []);

	useEffect(() => {
		if (!scanning) return;

		handledRef.current = false;
		const scanner = new Html5Qrcode(SCANNER_ELEMENT_ID);
		scannerRef.current = scanner;
		let isStarted = false;

		scanner
			.start(
				{ facingMode: "environment" },
				{ fps: 10, qrbox: { width: 250, height: 250 } },
				(decodedText) => {
					if (handledRef.current) return;
					handledRef.current = true;
					handleScan(decodedText);
				},
				() => {
					// per-frame scan failure — expected constantly while no QR is in view, ignore
				},
			)
			.then(() => {
				isStarted = true;
			})
			.catch((err) => {
				console.error("Could not start camera:", err);
			});

		return () => {
			if (!isStarted) return;

			try {
				scanner
					.stop()
					.then(() => scanner.clear())
					.catch(() => {
						/* already stopped */
					});
			} catch {
				/* stop() threw synchronously — scanner was already stopped */
			}
		};
	}, [scanning, handleScan]);

	const rescan = () => {
		setLastResult(null);
		setScanning(true);
	};

	return (
		<div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn max-w-7xl mx-auto py-6 px-4">
			<div className="lg:col-span-7 space-y-4">
				<div className="bg-card border border-border-hairline p-6 rounded-2xl shadow-md space-y-5">
					<div className="flex justify-between items-center border-b border-border-hairline pb-3">
						<div className="flex items-center space-x-2">
							<Camera className="w-4 h-4 text-primary" />
							<h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
								Scanning Hardware Interface
							</h3>
						</div>
						<button
							onClick={onLogout}
							className="text-[11px] font-bold text-accent hover:underline focus:outline-hidden">
							Disconnect Station
						</button>
					</div>

					{scanning && !lastResult && (
						<div className="aspect-4/3 bg-foreground rounded-xl overflow-hidden relative">
							<div id={SCANNER_ELEMENT_ID} className="w-full h-full" />
						</div>
					)}

					{busy && (
						<div className="aspect-4/3 bg-foreground rounded-xl flex items-center justify-center">
							<p className="text-white text-xs font-bold">Checking...</p>
						</div>
					)}

					{lastResult && !busy && (
						<div
							className={`aspect-4/3 border-2 rounded-xl p-6 flex flex-col items-center justify-center space-y-4 text-center animate-scaleUp ${resultStyles[lastResult.result].bg}`}>
							<div
								className={`w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xs ${resultStyles[lastResult.result].text}`}>
								{lastResult.result === "VERIFIED" ? (
									<CheckCircle className="w-5 h-5" />
								) : (
									<AlertTriangle className="w-5 h-5" />
								)}
							</div>
							<div className="space-y-1">
								<p
									className={`text-[10px] tracking-wider font-extrabold uppercase ${resultStyles[lastResult.result].text}`}>
									{resultStyles[lastResult.result].label}
								</p>
								{lastResult.fullName && (
									<h4 className="text-2xl font-Libre font-bold text-foreground">
										{lastResult.fullName}
									</h4>
								)}
								{lastResult.pwdNumber && (
									<p className="text-xs font-DM font-bold text-muted-foreground">
										ID: {lastResult.pwdNumber}
									</p>
								)}
								{lastResult.expirationDate && (
									<p className="text-[11px] text-muted-foreground">
										Valid until {lastResult.expirationDate}
									</p>
								)}
							</div>

							{lastResult.result === "VERIFIED" && (
								<div className="bg-white/80 border border-status-success/20 rounded-xl px-5 py-2.5 max-w-sm shadow-xs">
									<p className="text-xs font-medium text-foreground">
										Record verified. Apply legislative{" "}
										<strong className="text-status-success font-bold">
											20% pricing discount
										</strong>{" "}
										fields immediately.
									</p>
								</div>
							)}

							<button
								onClick={rescan}
								className="text-[11px] font-bold text-muted-foreground hover:text-primary underline pt-1 focus:outline-hidden">
								Scan Another
							</button>
						</div>
					)}
				</div>
			</div>

			<div className="lg:col-span-5 bg-card border border-border-hairline rounded-2xl shadow-md p-6 space-y-4">
				<div className="flex justify-between items-center border-b border-border-hairline pb-3">
					<div className="flex items-center space-x-2">
						<History className="w-4 h-4 text-muted-foreground" />
						<h3 className="font-bold text-xs uppercase tracking-wider text-foreground">
							Audit Stream Log
						</h3>
					</div>
					<span className="text-[10px] font-bold text-primary bg-secondary px-2 py-0.5 rounded-md font-DM">
						THIS SESSION
					</span>
				</div>

				<div className="space-y-2 max-h-87.5 overflow-y-auto pr-1">
					{scanHistory.length === 0 && (
						<p className="text-xs text-slate-400 text-center py-6">
							No scans yet this session.
						</p>
					)}
					{scanHistory.map((item) => (
						<div
							key={item.id}
							className="p-3 border border-border-hairline bg-input-background rounded-xl flex items-center justify-between text-xs">
							<div className="space-y-0.5">
								<p className="font-bold text-foreground">{item.name}</p>
								<p className="text-[10px] text-muted-foreground font-DM">
									{item.idNum}
								</p>
							</div>
							<div className="text-right space-y-1.5">
								<p className="text-[10px] font-DM font-medium text-muted-foreground">
									{item.time}
								</p>
								<span
									className={`inline-flex items-center gap-1 text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${
										item.result === "VERIFIED"
											? "bg-status-success-muted text-status-success border-status-success/20"
											: "bg-status-fraud-muted text-status-fraud border-status-fraud/20"
									}`}>
									{item.result === "VERIFIED" ? (
										<CheckCircle className="w-2.5 h-2.5" />
									) : (
										<XCircle className="w-2.5 h-2.5" />
									)}{" "}
									{item.result}
								</span>
							</div>
						</div>
					))}
				</div>

				<div className="border-t border-border-hairline pt-3 flex justify-between items-center text-[10px] font-bold font-DM text-muted-foreground tracking-wide">
					<span>TOTAL RUNS: {scanHistory.length}</span>
					<span>
						ISSUES: {scanHistory.filter((h) => h.result !== "VERIFIED").length}
					</span>
				</div>
			</div>

			<style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleUp { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
        .animate-fadeIn { animation: fadeIn 0.25s ease-out forwards; }
        .animate-scaleUp { animation: scaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
		</div>
	);
}
