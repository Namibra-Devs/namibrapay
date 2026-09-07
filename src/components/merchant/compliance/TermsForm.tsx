"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, ExternalLink } from "lucide-react";

interface TermsFormProps {
  onBack: () => void;
  onComplete: (accepted: boolean) => void;
}

export default function TermsForm({ onBack, onComplete }: TermsFormProps) {
  const [accepted, setAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accepted) return;
    
    setIsSubmitting(true);
    await onComplete(accepted);
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-1" style={{ fontFamily: "var(--font-heading)" }}>
          Service Agreement
        </h2>
        <p className="text-sm text-muted-foreground">Review and accept the terms of service</p>
      </div>

      <div className="border border-border rounded-xl p-6 bg-muted/30 space-y-4 max-h-96 overflow-y-auto">
        <h3 className="font-semibold text-sm">NamibraPay Merchant Service Agreement</h3>
        
        <div className="space-y-3 text-xs text-muted-foreground">
          <p>
            This Merchant Service Agreement ("Agreement") is entered into between Namibra Software Technologies Ltd ("NamibraPay") 
            and the merchant identified in the onboarding application ("Merchant").
          </p>

          <div>
            <p className="font-semibold text-foreground mb-1">1. Services</p>
            <p>
              NamibraPay will provide payment processing services to enable Merchant to collect payments from customers through 
              bank transfers and mobile money channels. NamibraPay will settle collected funds to Merchant's designated bank account 
              according to the agreed settlement schedule.
            </p>
          </div>

          <div>
            <p className="font-semibold text-foreground mb-1">2. Fees and Charges</p>
            <p>
              Merchant agrees to pay transaction fees as specified in the fee schedule provided during onboarding. The default rate 
              is 1.5% per transaction, with 1% going to the banking partner and 0.5% to NamibraPay. Fees may be borne by either the 
              Merchant or passed to the payer as configured in Merchant's account settings.
            </p>
          </div>

          <div>
            <p className="font-semibold text-foreground mb-1">3. Compliance and KYC</p>
            <p>
              Merchant warrants that all information provided during onboarding is accurate and complete. Merchant agrees to maintain 
              valid business registration and comply with all applicable laws including AML/CFT regulations. NamibraPay reserves the 
              right to suspend services if compliance requirements are not met.
            </p>
          </div>

          <div>
            <p className="font-semibold text-foreground mb-1">4. Data Protection</p>
            <p>
              Both parties agree to handle customer data in accordance with the Data Protection Act, 2012 (Act 843) and maintain 
              appropriate security measures. NamibraPay will retain KYC documents for a minimum of six years as required by regulation.
            </p>
          </div>

          <div>
            <p className="font-semibold text-foreground mb-1">5. Liability and Disputes</p>
            <p>
              Merchant is responsible for all transactions initiated through their account. Disputes must be raised within the timeframes 
              specified in the platform. NamibraPay's liability is limited to direct damages and capped at the fees paid by Merchant in 
              the preceding three months.
            </p>
          </div>

          <div>
            <p className="font-semibold text-foreground mb-1">6. Termination</p>
            <p>
              Either party may terminate this Agreement with 30 days written notice. Upon termination, NamibraPay will settle any 
              outstanding collected funds and Merchant will pay any outstanding fees.
            </p>
          </div>

          <div>
            <p className="font-semibold text-foreground mb-1">7. Governing Law</p>
            <p>
              This Agreement is governed by the laws of Ghana. Any disputes shall be resolved through arbitration in Accra, Ghana.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <a 
            href="#" 
            className="text-xs text-brand-teal hover:underline flex items-center gap-1"
            target="_blank"
            rel="noopener noreferrer"
          >
            View full terms and conditions
            <ExternalLink className="size-3" />
          </a>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="mt-0.5 size-4 rounded border-gray-300 text-brand-teal focus:ring-brand-teal/30"
          />
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900">
              I accept the Terms of Service
            </p>
            <p className="text-xs text-blue-700 mt-0.5">
              By checking this box, you confirm that you have read, understood, and agree to be bound by the NamibraPay 
              Merchant Service Agreement.
            </p>
          </div>
        </label>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <button 
          type="button" 
          onClick={onBack} 
          disabled={isSubmitting}
          className="px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
        >
          Back
        </button>
        <button 
          type="submit" 
          disabled={!accepted || isSubmitting}
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              Submit Application
              <CheckCircle2 className="size-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
