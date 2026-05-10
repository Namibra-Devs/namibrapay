import ComplianceFlow from "@/components/compliance/ComplianceFlow";

export default function CompliancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-heading">
          Compliance
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Complete your compliance profile to activate live payments.
        </p>
      </div>
      <div className="bg-white/88 backdrop-blur-lg rounded-2xl border border-gray-200/70 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.45)] p-6">
        <ComplianceFlow />
      </div>
    </div>
  );
}
