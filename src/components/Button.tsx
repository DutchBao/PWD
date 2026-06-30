import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

type ButtonProps = {} & ComponentProps<"button">;

export function Button({ className, ...props }: ButtonProps) {
	return (
		<button
			{...props}
			className={twMerge(
				"w-full h-10 text-center bg-blue-800 hover:bg-blue-700 transition-colors border border-blue-200 rounded-xl px-3 py-2 mt-1.5 mr-1.5 disabled:opacity-30 disabled:cursor-not-allowed",
				className,
			)}
		/>
	);
}
