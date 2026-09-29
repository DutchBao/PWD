import { useState } from "react";
import { RegistrationWrap } from "./RegistrationWrap";
import { Personal } from "./Personal";
import { Disability } from "./DisabilityProfile";
import { DocumentUpload } from "./DocumentUpload";
import { Success } from "./Success";

export type RegistrationData = {
	firstName: string;
	lastName: string;
	middleName: string;
	dateOfBirth: string;
	address: string;
	contactNumber: string;
	email: string;
	disabilityType: string;
	documentFile: File | null;
};

const initialData: RegistrationData = {
	firstName: "",
	lastName: "",
	middleName: "",
	dateOfBirth: "",
	address: "",
	contactNumber: "",
	email: "",
	disabilityType: "Visual Impairment",
	documentFile: null,
};

export function Register() {
	const [step, setStep] = useState(1);
	const [data, setData] = useState<RegistrationData>(initialData);

	const update = (fields: Partial<RegistrationData>) =>
		setData((prev) => ({ ...prev, ...fields }));
	const next = () => setStep((s) => s + 1);
	const back = () => setStep((s) => s - 1);

	return (
		<RegistrationWrap step={step}>
			{step === 1 && <Personal data={data} update={update} onNext={next} />}
			{step === 2 && (
				<Disability data={data} update={update} onNext={next} onBack={back} />
			)}
			{step === 3 && (
				<DocumentUpload
					data={data}
					update={update}
					onNext={next}
					onBack={back}
				/>
			)}
			{step === 4 && <Success />}
		</RegistrationWrap>
	);
}
