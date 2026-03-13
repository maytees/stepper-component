"use client";

import type { Button as ButtonPrimitive } from "@base-ui/react/button";
import type { VariantProps } from "class-variance-authority";
import { AnimatePresence, type HTMLMotionProps, motion } from "motion/react";
import React, {
	Children,
	type ComponentProps,
	cloneElement,
	createContext,
	isValidElement,
	useContext,
	useState,
} from "react";
import { cn } from "@/lib/utils";
import { Badge, type badgeVariants } from "./ui/badge";
import { Button, type buttonVariants } from "./ui/button";

const StepperContext = createContext<
	| {
			current: number;
			count: number;
			next: () => void;
			goto: (i: number) => void;
	  }
	| undefined
>(undefined);

export const useStepper = () => {
	const context = useContext(StepperContext);
	if (context === undefined) {
		throw new Error("Context is not defined!");
	}
	return context;
};

export const Stepper = ({
	children,
	className,
	onCompleted,
	...props
}: {
	onCompleted: () => void;
} & ComponentProps<"div">) => {
	const [current, setCurrent] = useState(0);
	const steps = Children.toArray(children).map((step, i) =>
		cloneElement(step as React.ReactElement<{ index: number }>, { index: i }),
	);

	steps.forEach((e) => {
		if (isValidElement(e) && e.type === Step) return;

		throw new Error("<Stepper> should only have nested <Step> components!");
	});

	return (
		<StepperContext.Provider
			value={{
				current: current,
				count: steps.length,
				next: () => {
					if (current === steps.length - 1) return onCompleted();
					setCurrent((c) => Math.min(c + 1, steps.length - 1));
				},
				goto: (i: number) =>
					setCurrent((c) => (i >= 0 && i <= steps.length - 1 ? i : c)),
			}}
		>
			<div
				{...props}
				className={cn(className, "flex flex-col items-center gap-5")}
			>
				<AnimatePresence>{steps}</AnimatePresence>
				<StepProgress />
			</div>
		</StepperContext.Provider>
	);
};

export const Step = ({
	index,
	className,
	...props
}: { index?: number } & HTMLMotionProps<"div">) => {
	const { current } = useStepper();

	return (
		current === index && (
			<motion.div
				key={current}
				initial={{ opacity: 0, x: 30 }}
				animate={{ opacity: 1, x: 0 }}
				exit={{ opacity: 0, x: -300 }}
				transition={{
					type: "spring",
					ease: "easeOut",
					damping: 20,
				}}
				className={cn(className, "flex w-full flex-col items-center")}
				{...props}
			/>
		)
	);
};

export const StepCategory = ({
	className,
	variant = "default",
	...props
}: ComponentProps<"span"> & VariantProps<typeof badgeVariants>) => {
	return <Badge variant={variant} className={cn("", className)} {...props} />;
};

export const StepHeader = ({ className, ...props }: ComponentProps<"div">) => {
	return (
		<div
			className={cn("text-center w-full space-y-2 mt-6", className)}
			{...props}
		/>
	);
};

export const StepTitle = ({ className, ...props }: ComponentProps<"h1">) => {
	return <h1 className={cn("text-5xl font-semibold", className)} {...props} />;
};

export const StepDescription = ({
	className,
	...props
}: ComponentProps<"p">) => {
	return <p className={cn("text-muted-foreground", className)} {...props} />;
};

export const StepBody = ({ className, ...props }: ComponentProps<"div">) => {
	return <div className={cn(className, "my-8 w-full")} {...props} />;
};

export const StepActions = ({ className, ...props }: ComponentProps<"div">) => {
	return <div className={cn(className, "space-y-2 w-full")} {...props} />;
};

export const StepContinue = ({
	className,
	children,
	disableContinue = false,
	size = "lg",
	...props
}: { disableContinue?: boolean } & ButtonPrimitive.Props &
	VariantProps<typeof buttonVariants>) => {
	const { next } = useStepper();

	return (
		<Button
			onClick={disableContinue ? undefined : next}
			size={size}
			className={cn(className, "w-full")}
			{...props}
		>
			{typeof children === "string" ? children : "Continue"}
		</Button>
	);
};

export const StepProgress = () => {
	const { count, current, goto } = useStepper();

	return (
		<div className="flex flex-row items-center gap-1">
			{[...Array(count)].map((_, i) => (
				<button
					onClick={() => goto(i)}
					type="button"
					// biome-ignore lint/suspicious/noArrayIndexKey: no need
					key={i}
					className={cn("size-2.5 bg-primary/10 rounded-full", {
						"w-8 mx-1 bg-primary": i === current,
						"hover:bg-primary/60 transition-all ease-in-out duration-300 hover:w-4 hover:cursor-pointer":
							i !== current,
					})}
				/>
			))}
		</div>
	);
};
