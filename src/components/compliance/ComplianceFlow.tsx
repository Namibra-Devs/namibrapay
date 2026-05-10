"use client";

import { useState } from "react";
import StepNav from "./StepNav";
import ProgressIndicator from "./ProgressIndicator";
import ProfileStep from "./steps/ProfileStep";
import ContactStep from "./steps/ContactStep";
import AccountStep from "./steps/AccountStep";
import DocumentsStep from "./steps/DocumentsStep";
import ServiceAgreementStep from "./steps/ServiceAgreementStep";
import type {
  ProfileData,
  ContactData,
  AccountData,
  DocumentsData,
  ServiceAgreementData,
  Address,
} from "./types";

const EMPTY_ADDRESS: Address = {
  country: "Ghana",
  state: "",
  city: "",
  street: "",
  complex: "",
  gpsAddress: "",
};

const DEFAULT_PROFILE: ProfileData = {
  tradingName: "",
  description: "",
  staffSize: "",
  annualVolume: "",
  industry: "",
  category: "",
  businessType: "registered",
  legalName: "",
  registrationType: "",
};

const DEFAULT_CONTACT: ContactData = {
  generalEmail: "",
  supportEmail: "",
  useSupportAsGeneral: false,
  disputesEmail: "",
  useDisputeAsGeneral: false,
  phoneCode: "+233",
  phone: "",
  website: "",
  twitter: "",
  facebook: "",
  instagram: "",
  registeredAddress: { ...EMPTY_ADDRESS },
  officeAddress: { ...EMPTY_ADDRESS },
  useRegisteredForOffice: false,
};

const DEFAULT_ACCOUNT: AccountData = {
  accountType: "mobile_money",
  bankName: "",
  accountNumber: "",
  provider: "",
  mobilePhone: "",
  nameOnAccount: "",
};

const DEFAULT_DOCS: DocumentsData = {
  form3Name: "",
  certificateName: "",
  tin: "",
  directors: [],
  beneficialOwners: [],
};

const DEFAULT_AGREEMENT: ServiceAgreementData = {
  fullName: "",
  phoneCode: "+233",
  phone: "",
  email: "",
  jobTitle: "",
  accepted: false,
};

export default function ComplianceFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE);
  const [contact, setContact] = useState<ContactData>(DEFAULT_CONTACT);
  const [account, setAccount] = useState<AccountData>(DEFAULT_ACCOUNT);
  const [documents, setDocuments] = useState<DocumentsData>(DEFAULT_DOCS);
  const [agreement, setAgreement] = useState<ServiceAgreementData>(DEFAULT_AGREEMENT);
  const [submitted, setSubmitted] = useState(false);

  function markComplete(step: number, advanceTo?: number) {
    setCompletedSteps((prev) =>
      prev.includes(step) ? prev : [...prev, step],
    );
    if (advanceTo !== undefined) setCurrentStep(advanceTo);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-emerald-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 font-heading mb-2">
          Compliance submitted!
        </h2>
        <p className="text-sm text-gray-500 max-w-xs">
          Your compliance information has been submitted for review. We&apos;ll
          notify you once it&apos;s verified.
        </p>
      </div>
    );
  }

  return (
    <div className="flex gap-6 min-h-[600px]">
      {/* Step navigation */}
      <div className="w-44 shrink-0 hidden lg:block">
        <StepNav
          currentStep={currentStep}
          completedSteps={completedSteps}
          onStepClick={setCurrentStep}
        />
      </div>

      {/* Mobile step indicator */}
      <div className="lg:hidden flex items-center gap-2 mb-4 shrink-0 self-start pt-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              completedSteps.includes(i)
                ? "w-4 bg-emerald-500"
                : currentStep === i
                ? "w-4 bg-brand-teal"
                : "w-2 bg-gray-200"
            }`}
          />
        ))}
      </div>

      {/* Form content */}
      <div className="flex-1 min-w-0">
        <div className="max-w-lg">
          {currentStep === 0 && (
            <ProfileStep
              data={profile}
              isComplete={completedSteps.includes(0)}
              onSave={(d) => {
                setProfile(d);
                markComplete(0);
              }}
              onNext={() => markComplete(0, 1)}
            />
          )}
          {currentStep === 1 && (
            <ContactStep
              data={contact}
              isComplete={completedSteps.includes(1)}
              onSave={(d) => {
                setContact(d);
                markComplete(1);
              }}
              onNext={() => markComplete(1, 2)}
            />
          )}
          {currentStep === 2 && (
            <AccountStep
              data={account}
              isComplete={completedSteps.includes(2)}
              onSave={(d) => {
                setAccount(d);
                markComplete(2);
              }}
              onNext={() => markComplete(2, 3)}
            />
          )}
          {currentStep === 3 && (
            <DocumentsStep
              data={documents}
              isComplete={completedSteps.includes(3)}
              onSave={(d) => {
                setDocuments(d);
                markComplete(3, 4);
              }}
            />
          )}
          {currentStep === 4 && (
            <ServiceAgreementStep
              data={agreement}
              profile={profile}
              contact={contact}
              onSubmit={(d) => {
                setAgreement(d);
                setSubmitted(true);
              }}
            />
          )}
        </div>
      </div>

      {/* Progress indicator */}
      <div className="w-40 shrink-0 hidden lg:block">
        <ProgressIndicator completed={completedSteps.length} total={5} />
      </div>
    </div>
  );
}
