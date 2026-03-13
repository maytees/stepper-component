"use client";
import { useState } from "react";
import {
	Step,
	StepActions,
	StepBody,
	StepCategory,
	StepContinue,
	StepDescription,
	StepHeader,
	Stepper,
	StepTitle,
	useStepper,
} from "@/components/Stepper";
import { Input } from "@/components/ui/input";

const OnboardingPage = () => {
	const [onboardingCompleted, setOnboardingCompleted] = useState(false);

	return (
		<div className="w-full min-h-screen flex justify-center items-center">
			{!onboardingCompleted ? (
				<Stepper onCompleted={() => setOnboardingCompleted(true)}>
					<Step>
						<NameStep />
					</Step>

					<Step>
						<StepCategory>Icebreaker 2</StepCategory>
						<StepHeader>
							<StepTitle>How old are you?</StepTitle>
							<StepDescription>
								No need to tell us the exact date...
							</StepDescription>
						</StepHeader>
						<StepBody>
							<form>
								<Input placeholder="18" />
							</form>
						</StepBody>
						<StepActions>
							<StepContinue />
						</StepActions>
					</Step>

					<Step>
						<StepCategory>Thanks</StepCategory>
						<StepHeader>
							<StepTitle>Thank you!</StepTitle>
							<StepDescription>
								We appreciate you taking acme for a spin
							</StepDescription>
						</StepHeader>
						<StepBody>
							<form></form>
						</StepBody>
						<StepActions>
							<StepContinue>Thank You</StepContinue>
						</StepActions>
					</Step>
				</Stepper>
			) : (
				<div>You have completed onboarding!</div>
			)}
			{/* <Stepper>
				<Step index={0}>
					<StepCategory></StepCategory>
					<StepHeader>
						<StepTitle>whats your name</StepTitle>
						<StepDescription></StepDescription>
					</StepHeader>
					<StepBody>
						<form></form>
					</StepBody>
					<StepActions>
						<StepContinue />
						<StepSkip />
					</StepActions>
				</Step>

				<Step index={1}>
					<StepCategory></StepCategory>
					<StepHeader>
						<StepTitle> whats your age</StepTitle>
						<StepDescription></StepDescription>
					</StepHeader>
					<StepBody>
						<form></form>
					</StepBody>
					<StepActions>
						<StepContinue />
						<StepSkip />
					</StepActions>
				</Step>
			</Stepper> */}
		</div>
	);
};

const NameStep = () => {
	const { next } = useStepper();

	return (
		<form className="contents" onSubmit={next}>
			<StepCategory>Icebreaker</StepCategory>
			<StepHeader>
				<StepTitle>What&apos;s your name?</StepTitle>
				<StepDescription>
					You know, the name you were born with.
				</StepDescription>
			</StepHeader>
			<StepBody>
				<Input required placeholder="Jane Doe" />
			</StepBody>
			<StepActions>
				<StepContinue disableContinue />
			</StepActions>
		</form>
	);
};
export default OnboardingPage;
