import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

type RadioProps = {} & ComponentProps<"input">;

export function Radio({ className, children, id, name, ...props }: RadioProps) {
	return (
		<div
			className={twMerge(
				// Base styles & smooth transitions
				"flex items-center gap-2 p-2 h-10 m-2 border border-zinc-300 bg-zinc-100 rounded-lg transition-all duration-200",

				// ⚡ THE MAGIC: Styles applied ONLY when the internal radio is checked
				"has-checked:bg-blue-50 has-checked:border-blue-400",

				// Interactive hover state when NOT checked
				"hover:bg-zinc-200 has-checked:hover:bg-blue-50",

				className,
			)}>
			<input
				type="radio"
				id={id}
				name={name}
				{...props}
				className="accent-blue-600 h-4 w-4 cursor-pointer" // Colors the native dot blue
			/>
			<label
				htmlFor={id}
				className="flex-1 cursor-pointer select-none text-sm font-medium text-zinc-700 has-checked:text-blue-900">
				{children}
			</label>
		</div>
	);
}
