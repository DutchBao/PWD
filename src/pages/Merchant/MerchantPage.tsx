import { useState } from "react";
import {
	Camera,
	CheckCircle,
	AlertTriangle,
	History,
	Check,
	XCircle,
} from "lucide-react";

interface ScanRecord {
	id: number;
	name: string;
	idNum: string;
	time: string;
	establishment: string;
	status: "OK" | "FLAG";
}

interface MerchantPageProps {
	onLogout: () => void;
}

export function MerchantPage({ onLogout }: MerchantPageProps) {
	const [scannerState, setScannerState] = useState<
		"camera_idle" | "success" | "fraud"
	>("camera_idle");

	const [scanHistory, setScanHistory] = useState<ScanRecord[]>([
		{
			id: 1,
			name: "Maria Santos",
			idNum: "PWD-2024-001",
			time: "02:47 PM",
			establishment: "Mercury Drug, Guagua",
			status: "OK",
		},
		{
			id: 2,
			name: "Roberto Dela Cruz",
			idNum: "PWD-2024-002",
			time: "01:12 PM",
			establishment: "Mercury Drug, Guagua",
			status: "OK",
		},
		{
			id: 3,
			name: "Unknown ID",
			idNum: "???-????-???",
			time: "11:55 AM",
			establishment: "Mercury Drug, Guagua",
			status: "FLAG",
		},
		{
			id: 4,
			name: "Ligaya Reyes",
			idNum: "PWD-2024-034",
			time: "10:30 AM",
			establishment: "Puregold, Guagua",
			status: "OK",
		},
	]);

	const triggerMockScanResult = (type: "success" | "fraud") => {
		const currentTimeStr = new Date().toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
		});

		if (type === "success") {
			setScannerState("success");
			setScanHistory((prev) => [
				{
					id: Date.now(),
					name: "Maria Santos",
					idNum: "PWD-2024-001",
					time: currentTimeStr,
					establishment: "Mercury Drug, Guagua",
					status: "OK",
				},
				...prev,
			]);
		} else {
			setScannerState("fraud");
			setScanHistory((prev) => [
				{
					id: Date.now(),
					name: "Unknown ID",
					idNum: "???-????-???",
					time: currentTimeStr,
					establishment: "Mercury Drug, Guagua",
					status: "FLAG",
				},
				...prev,
			]);
		}
	};

	return (
		<div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn max-w-7xl mx-auto py-6 px-4">
			{/* Left Column: Active Camera Display */}
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

					{scannerState === "camera_idle" && (
						<div className="aspect-4/3 bg-foreground rounded-xl flex flex-col items-center justify-center p-6 relative overflow-hidden group shadow-inner">
							<div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-muted-foreground shadow-xl group-hover:scale-105 transition-all">
								<Camera className="w-6 h-6" />
							</div>
							<div className="text-center mt-4 space-y-1">
								<p className="text-xs font-bold tracking-wide text-white">
									Capture Stream Idle
								</p>
								<p className="text-[11px] text-muted-foreground">
									Select interactive hardware scan signature below
								</p>
							</div>
							<div className="absolute bottom-4 left-4 right-4 flex gap-3 z-10">
								<button
									onClick={() => triggerMockScanResult("success")}
									className="flex-1 bg-status-success text-white font-bold py-2.5 rounded-xl text-[10px] uppercase tracking-wider transition hover:bg-green-700 shadow-md active:scale-[0.98]">
									Simulate Clear Pass
								</button>
								<button
									onClick={() => triggerMockScanResult("fraud")}
									className="flex-1 bg-status-fraud text-white font-bold py-2.5 rounded-xl text-[10px] uppercase tracking-wider transition hover:bg-red-700 shadow-md active:scale-[0.98]">
									Simulate Anomaly
								</button>
							</div>
						</div>
					)}

					{scannerState === "success" && (
						<div className="aspect-4/3 bg-status-success-muted border-2 border-status-success rounded-xl p-6 flex flex-col items-center justify-center space-y-4 text-center animate-scaleUp">
							<div className="w-12 h-12 bg-white text-status-success rounded-full flex items-center justify-center shadow-xs">
								<Check className="w-5 h-5 stroke-3" />
							</div>
							<div className="space-y-1">
								<p className="text-[10px] tracking-wider font-extrabold text-status-success uppercase">
									✓ Cryptographic Audit Passed
								</p>
								<h4 className="text-2xl font-Libre font-bold text-foreground">
									Maria Santos
								</h4>
								<p className="text-xs font-DM font-bold text-muted-foreground">
									ID: PWD-2024-001
								</p>
							</div>
							<div className="bg-white/80 border border-status-success/20 rounded-xl px-5 py-2.5 max-w-sm shadow-xs">
								<p className="text-xs font-medium text-foreground">
									Record verified. Apply legislative{" "}
									<strong className="text-status-success font-bold">
										20% pricing discount
									</strong>{" "}
									fields immediately.
								</p>
							</div>
							<button
								onClick={() => setScannerState("camera_idle")}
								className="text-[11px] font-bold text-muted-foreground hover:text-primary underline pt-1 focus:outline-hidden">
								Re-initialize Capture Stream
							</button>
						</div>
					)}

					{scannerState === "fraud" && (
						<div className="aspect-4/3 bg-status-fraud-muted border-2 border-status-fraud rounded-xl p-6 flex flex-col items-center justify-center space-y-4 text-center animate-scaleUp">
							<div className="w-12 h-12 bg-white text-status-fraud rounded-full flex items-center justify-center shadow-xs">
								<AlertTriangle className="w-5 h-5 stroke-[2.5]" />
							</div>
							<div className="space-y-1">
								<p className="text-[11px] tracking-wider font-extrabold text-status-fraud uppercase">
									✕ Structural Verification Mismatch
								</p>
								<p className="text-xs font-DM bg-white text-status-fraud font-bold px-2 py-0.5 rounded shadow-xs inline-block">
									AUTHENTICITY CHAIN DEVIATION
								</p>
							</div>
							<div className="bg-white/80 border border-status-fraud/20 rounded-xl px-5 py-2.5 max-w-sm shadow-xs">
								<p className="text-xs font-medium text-foreground">
									This digital credential signature is unverified or altered.
									Transaction has been blocked and logged to the central
									database.
								</p>
							</div>
							<button
								onClick={() => setScannerState("camera_idle")}
								className="text-[11px] font-bold text-muted-foreground hover:text-accent underline pt-1 focus:outline-hidden">
								Re-initialize Capture Stream
							</button>
						</div>
					)}
				</div>
			</div>

			{/* Right Column: Audit Logs */}
			<div className="lg:col-span-5 bg-card border border-border-hairline rounded-2xl shadow-md p-6 space-y-4">
				<div className="flex justify-between items-center border-b border-border-hairline pb-3">
					<div className="flex items-center space-x-2">
						<History className="w-4 h-4 text-muted-foreground" />
						<h3 className="font-bold text-xs uppercase tracking-wider text-foreground">
							Audit Stream Log
						</h3>
					</div>
					<span className="text-[10px] font-bold text-primary bg-secondary px-2 py-0.5 rounded-md font-DM">
						REAL-TIME
					</span>
				</div>

				<div className="space-y-2 max-h-87.5 overflow-y-auto pr-1">
					{scanHistory.map((item) => (
						<div
							key={item.id}
							className="p-3 border border-border-hairline bg-input-background rounded-xl flex items-center justify-between text-xs">
							<div className="space-y-0.5">
								<p className="font-bold text-foreground">{item.name}</p>
								<p className="text-[10px] text-muted-foreground font-DM">
									{item.idNum}
								</p>
								<p className="text-[10px] text-muted-foreground font-medium">
									{item.establishment}
								</p>
							</div>
							<div className="text-right space-y-1.5">
								<p className="text-[10px] font-DM font-medium text-muted-foreground">
									{item.time}
								</p>
								<span
									className={`inline-flex items-center gap-1 text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${item.status === "OK" ? "bg-status-success-muted text-status-success border-status-success/20" : "bg-status-fraud-muted text-status-fraud border-status-fraud/20"}`}>
									{item.status === "OK" ? (
										<CheckCircle className="w-2.5 h-2.5" />
									) : (
										<XCircle className="w-2.5 h-2.5" />
									)}{" "}
									{item.status}
								</span>
							</div>
						</div>
					))}
				</div>

				<div className="border-t border-border-hairline pt-3 flex justify-between items-center text-[10px] font-bold font-DM text-muted-foreground tracking-wide">
					<span>TOTAL RUNS: {scanHistory.length}</span>
					<span>
						ANOMALIES: {scanHistory.filter((h) => h.status === "FLAG").length}
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
