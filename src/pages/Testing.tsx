import React, { useState, useRef } from "react";
import { Header } from "../components/Header";

export default function DocumentUploadPage() {
	const [file, setFile] = useState<File | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Handle file selection via click
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setFile(e.target.files[0]);
		}
	};

	// Handle file selection via drag and drop
	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = () => {
		setIsDragging(false);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			setFile(e.dataTransfer.files[0]);
		}
	};

	const triggerFileInput = () => {
		fileInputRef.current?.click();
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (file) {
			alert(`Submitting file: ${file.name}`);
			// Handle actual upload logic here
		} else {
			alert("Please upload a document first.");
		}
	};

	return (
		<div className="min-h-screen bg-background font-Jakarta text-foreground pb-12">
			{/* --- HEADER --- */}
			<Header />
			{/* --- STEPPER PROGRESS BAR --- */}
			<div className="max-w-3xl mx-auto mt-8 px-4">
				<div className="flex items-center justify-center space-x-4 text-xs font-medium">
					{/* Step 1: Completed */}
					<div className="flex items-center space-x-2 text-status-success">
						<div className="w-5 h-5 rounded-full bg-status-success flex items-center justify-center text-white">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-3 w-3"
								viewBox="0 0 20 20"
								fill="currentColor">
								<path
									fillRule="evenodd"
									d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
									clipRule="evenodd"
								/>
							</svg>
						</div>
						<span>Personal Details</span>
					</div>

					<span className="text-muted-foreground/40">&gt;</span>

					{/* Step 2: Completed */}
					<div className="flex items-center space-x-2 text-status-success">
						<div className="w-5 h-5 rounded-full bg-status-success flex items-center justify-center text-white">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-3 w-3"
								viewBox="0 0 20 20"
								fill="currentColor">
								<path
									fillRule="evenodd"
									d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
									clipRule="evenodd"
								/>
							</svg>
						</div>
						<span>Disability Profile</span>
					</div>

					<span className="text-muted-foreground/40">&gt;</span>

					{/* Step 3: Active */}
					<div className="flex items-center space-x-2 text-primary font-bold">
						<div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white text-[10px]">
							3
						</div>
						<span>Document Upload</span>
					</div>
				</div>
			</div>

			{/* --- MAIN CONTENT CARD --- */}
			<main className="max-w-2xl mx-auto mt-10 px-4">
				<form
					onSubmit={handleSubmit}
					className="bg-card rounded-2xl shadow-sm border border-border-hairline p-10">
					{/* Card Title Setup */}
					<div className="mb-6">
						<h2 className="font-Libre text-3xl font-bold text-foreground mb-2">
							Document Upload
						</h2>
						<p className="text-muted-foreground text-sm">
							Upload your Medical Certificate or existing physical PWD ID for
							MSWDO verification.
						</p>
					</div>

					{/* File Drag & Drop Target Area */}
					<div
						onDragOver={handleDragOver}
						onDragLeave={handleDragLeave}
						onDrop={handleDrop}
						onClick={triggerFileInput}
						className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${
							isDragging
								? "border-primary bg-primary/5"
								: "border-muted-foreground/30 bg-input-background hover:bg-secondary/40"
						}`}>
						<input
							type="file"
							ref={fileInputRef}
							onChange={handleFileChange}
							accept=".png,.jpg,.jpeg,.pdf"
							className="hidden"
						/>

						{/* Upload Circle Icon */}
						<div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth={2}>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
								/>
							</svg>
						</div>

						{/* Upload Directions */}
						<p className="text-sm font-semibold text-foreground mb-1">
							Drop file here or{" "}
							<span className="text-primary underline decoration-2">
								browse
							</span>
						</p>
						<p className="text-xs text-muted-foreground/80">
							PNG, JPG, or PDF · max 5MB
						</p>

						{/* Selected File Feedback Banner */}
						{file && (
							<div className="mt-4 px-3 py-1.5 bg-status-success-muted text-status-success text-xs font-medium rounded-md flex items-center space-x-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-4 w-4"
									viewBox="0 0 20 20"
									fill="currentColor">
									<path
										fillRule="evenodd"
										d="M4 4a2 2 0 012-2h4.586A1 1 0 0113 2.414l4.586 4.586a1 1 0 01.293.707V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
										clipRule="evenodd"
									/>
								</svg>
								<span className="truncate max-w-62.5">{file.name}</span>
							</div>
						)}
					</div>

					{/* Legal Compliance Disclaimer */}
					<p className="mt-4 text-[11px] text-muted-foreground/80 leading-relaxed text-left">
						Reviewed only by authorized MSWDO staff. Handled in compliance with{" "}
						<span className="font-semibold text-muted-foreground">
							RA 10173 (Data Privacy Act of 2012)
						</span>
						.
					</p>

					{/* Form Control Row Buttons */}
					<div className="mt-8 flex items-center space-x-4">
						<button
							type="button"
							className="w-1/3 py-3 border border-muted-foreground/30 text-foreground font-semibold rounded-xl text-sm bg-white hover:bg-input-background transition-colors active:scale-[0.98]">
							Back
						</button>
						<button
							type="submit"
							className="w-2/3 py-3 bg-primary hover:bg-primary/95 text-white font-semibold rounded-xl text-sm shadow-sm transition-colors active:scale-[0.98]">
							Submit Application
						</button>
					</div>
				</form>
			</main>

			{/* --- FLOATING HELP BUTTON --- */}
			<button
				type="button"
				aria-label="Help support"
				className="fixed bottom-6 right-6 w-10 h-10 bg-[#212121] hover:bg-black text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md transition-transform active:scale-95">
				?
			</button>
		</div>
	);
}
