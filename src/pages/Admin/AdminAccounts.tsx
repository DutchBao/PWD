import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { FunctionsHttpError } from "@supabase/supabase-js";
import { PlusCircle, X, Shield, Store } from "lucide-react";

interface AdminRow {
	auth_id: string;
	user_name: string;
	full_name: string | null;
}

interface MerchantRow {
	auth_id: string;
	username: string;
	establishment_name: string | null;
}

function CreateAccountModal({
	role,
	onClose,
	onCreated,
}: {
	role: "admin" | "merchant";
	onClose: () => void;
	onCreated: (row: AdminRow | MerchantRow) => void;
}) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [userName, setUserName] = useState("");
	const [label, setLabel] = useState(""); // full name (admin) or establishment name (merchant)
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		const { data, error: fnError } = await supabase.functions.invoke(
			"create-staff-account",
			{
				body: {
					role,
					email,
					password,
					userName,
					fullNameOrEstablishment: label,
				},
			},
		);

		setLoading(false);

		if (fnError) {
			if (fnError instanceof FunctionsHttpError) {
				const body = await fnError.context.json();
				console.error("Edge function error:", body);
				setError(body.error ?? "Could not create account.");
			} else {
				console.error(fnError);
				setError("Could not create account.");
			}
			return;
		}

		if (!data?.ok) {
			setError(data?.error ?? "Could not create account.");
			return;
		}

		onCreated(
			role === "admin"
				? { auth_id: data.authId, user_name: userName, full_name: label }
				: {
						auth_id: data.authId,
						username: userName,
						establishment_name: label,
					},
		);
	};

	return (
		<div
			className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
			onClick={onClose}>
			<div
				className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
				onClick={(e) => e.stopPropagation()}>
				<div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
					<h3 className="text-sm font-bold text-foreground">
						New {role === "admin" ? "Admin" : "Merchant"} Account
					</h3>
					<button
						onClick={onClose}
						className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer">
						<X className="w-4 h-4" />
					</button>
				</div>

				<form onSubmit={handleSubmit} className="p-6 space-y-3">
					<div>
						<label className="block text-xs font-bold text-slate-700 mb-1.5">
							Login Email
						</label>
						<input
							type="email"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary"
						/>
					</div>
					<div>
						<label className="block text-xs font-bold text-slate-700 mb-1.5">
							Temporary Password
						</label>
						<input
							type="text"
							required
							minLength={6}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary"
						/>
					</div>
					<div>
						<label className="block text-xs font-bold text-slate-700 mb-1.5">
							Username
						</label>
						<input
							type="text"
							required
							value={userName}
							onChange={(e) => setUserName(e.target.value)}
							className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary"
						/>
					</div>
					<div>
						<label className="block text-xs font-bold text-slate-700 mb-1.5">
							{role === "admin" ? "Full Name" : "Establishment Name"}
						</label>
						<input
							type="text"
							required
							value={label}
							onChange={(e) => setLabel(e.target.value)}
							className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary"
						/>
					</div>

					{error && (
						<p className="text-xs font-semibold text-rose-600">{error}</p>
					)}

					<div className="flex items-center justify-end gap-2 pt-2">
						<button
							type="button"
							onClick={onClose}
							disabled={loading}
							className="px-4 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-xl transition cursor-pointer disabled:opacity-50">
							Cancel
						</button>
						<button
							type="submit"
							disabled={loading}
							className="px-4 py-2.5 bg-primary hover:bg-blue-800 text-white text-xs font-bold rounded-xl transition shadow-sm cursor-pointer disabled:opacity-60">
							{loading ? "Creating..." : "Create Account"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export function StaffAccounts() {
	const [admins, setAdmins] = useState<AdminRow[]>([]);
	const [merchants, setMerchants] = useState<MerchantRow[]>([]);
	const [loading, setLoading] = useState(true);
	const [modalRole, setModalRole] = useState<"admin" | "merchant" | null>(null);

	useEffect(() => {
		const fetchAll = async () => {
			const [adminsRes, merchantsRes] = await Promise.all([
				supabase.from("admins").select("auth_id, user_name, full_name"),
				supabase
					.from("merchants")
					.select("auth_id, username, establishment_name"),
			]);

			if (adminsRes.error) console.error(adminsRes.error);
			else setAdmins(adminsRes.data ?? []);

			if (merchantsRes.error) console.error(merchantsRes.error);
			else setMerchants(merchantsRes.data ?? []);

			setLoading(false);
		};

		fetchAll();
	}, []);

	const handleCreated = (row: AdminRow | MerchantRow) => {
		if (modalRole === "admin") {
			setAdmins((prev) => [...prev, row as AdminRow]);
		} else {
			setMerchants((prev) => [...prev, row as MerchantRow]);
		}
		setModalRole(null);
	};

	return (
		<div className="flex justify-center">
			<div className="w-full max-w-3xl space-y-6">
				{/* Admins section */}
				<div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
					<div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Shield className="w-4 h-4 text-primary" />
							<h3 className="text-sm font-bold text-foreground">
								Admin Accounts
							</h3>
							<span className="text-[10px] font-extrabold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
								{admins.length}
							</span>
						</div>
						<button
							onClick={() => setModalRole("admin")}
							className="px-3.5 py-2 bg-primary hover:bg-blue-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer">
							<PlusCircle className="w-3.5 h-3.5" /> Add Admin
						</button>
					</div>
					<div className="divide-y divide-slate-100">
						{loading ? (
							<div className="p-6 text-center text-xs text-slate-400">
								Loading...
							</div>
						) : admins.length === 0 ? (
							<div className="p-6 text-center text-xs text-slate-400">
								No admin accounts yet.
							</div>
						) : (
							admins.map((a) => (
								<div
									key={a.auth_id}
									className="p-4 flex items-center justify-between text-sm">
									<div>
										<p className="font-bold text-foreground">
											{a.full_name || "—"}
										</p>
										<p className="text-xs text-slate-500 font-DM">
											{a.user_name}
										</p>
									</div>
								</div>
							))
						)}
					</div>
				</div>

				{/* Merchants section */}
				<div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
					<div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Store className="w-4 h-4 text-primary" />
							<h3 className="text-sm font-bold text-foreground">
								Merchant Accounts
							</h3>
							<span className="text-[10px] font-extrabold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
								{merchants.length}
							</span>
						</div>
						<button
							onClick={() => setModalRole("merchant")}
							className="px-3.5 py-2 bg-primary hover:bg-blue-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer">
							<PlusCircle className="w-3.5 h-3.5" /> Add Merchant
						</button>
					</div>
					<div className="divide-y divide-slate-100">
						{loading ? (
							<div className="p-6 text-center text-xs text-slate-400">
								Loading...
							</div>
						) : merchants.length === 0 ? (
							<div className="p-6 text-center text-xs text-slate-400">
								No merchant accounts yet.
							</div>
						) : (
							merchants.map((m) => (
								<div
									key={m.auth_id}
									className="p-4 flex items-center justify-between text-sm">
									<div>
										<p className="font-bold text-foreground">
											{m.establishment_name || "—"}
										</p>
										<p className="text-xs text-slate-500 font-DM">
											{m.username}
										</p>
									</div>
								</div>
							))
						)}
					</div>
				</div>
			</div>

			{modalRole && (
				<CreateAccountModal
					role={modalRole}
					onClose={() => setModalRole(null)}
					onCreated={handleCreated}
				/>
			)}
		</div>
	);
}
