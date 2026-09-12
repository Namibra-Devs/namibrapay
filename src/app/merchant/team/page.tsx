'use client';

import { useState } from "react";
import { motion } from "motion/react";
import { Plus, Mail, Shield, ShieldCheck, MoreHorizontal, UserCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/constants";
import { mockTeamMembers } from "@/lib/merchant-mock-data";
import type { TeamMember } from "@/lib/merchant-mock-data";
import { MERCHANT_ROLE_LABELS, MERCHANT_ROLE_COLORS, MERCHANT_ROLES } from "@/lib/merchant-constants";
import type { MerchantRole } from "@/lib/merchant-constants";
import { useMerchantRole } from "@/hooks/use-merchant-role";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/Toast";
import { FormField, Input } from "@/components/ui/form-field";

export default function TeamPage() {
  const { can, role } = useMerchantRole();
  const [showInvite, setShowInvite] = useState(false);
  const [actionTarget, setActionTarget] = useState<TeamMember | null>(null);
  const [inviteRole, setInviteRole] = useState<MerchantRole>(MERCHANT_ROLES.ADMIN);
  
  // Invite modal state
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteMessage, setInviteMessage] = useState("");
  
  const { showToast } = useToast();

  const assignableRoles = [MERCHANT_ROLES.ADMIN, MERCHANT_ROLES.DEVELOPER, MERCHANT_ROLES.FINANCE, MERCHANT_ROLES.SUPPORT] as MerchantRole[];

  return (
    <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 pb-20 md:pb-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>Team</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Manage who has access to your NamibraPay account and what they can do.</p>
        </div>
        {can("team.manage") && (
          <button onClick={() => setShowInvite(true)}
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 bg-brand-navy hover:bg-[#1e2f72] text-white rounded-xl text-xs sm:text-sm font-medium transition-all shrink-0 w-full sm:w-auto">
            <Plus className="size-3.5 sm:size-4" />
            Invite Member
          </button>
        )}
      </motion.div>

      {/* Team Table */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["Member", "Role", "Status", "2FA", "Last Login", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockTeamMembers.map((member) => {
                const isCurrentUser = member.role === role && member.id === "tm1";
                return (
                  <tr key={member.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-brand-teal/10 border border-brand-teal/20 flex items-center justify-center shrink-0">
                          <UserCircle className="size-4 text-brand-teal" />
                        </div>
                        <div>
                          <p className="font-medium text-sm flex items-center gap-2">
                            {member.name}
                            {isCurrentUser && <span className="text-[9px] bg-brand-teal/10 text-[#1a6e6c] border border-brand-teal/20 px-1.5 py-0.5 rounded-full font-medium">You</span>}
                          </p>
                          <p className="text-xs text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("text-[11px] px-2 py-1 rounded-full border font-medium", MERCHANT_ROLE_COLORS[member.role])}>
                        {MERCHANT_ROLE_LABELS[member.role]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("text-[11px] px-2 py-0.5 rounded-full border font-medium",
                        member.inviteStatus === "accepted"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200")}>
                        {member.inviteStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {member.twoFaEnabled
                        ? <ShieldCheck className="size-4 text-emerald-500" />
                        : <Shield className="size-4 text-muted-foreground/40" />}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {member.lastLogin ? formatDate(member.lastLogin) : "Never"}
                    </td>
                    <td className="px-4 py-3">
                      {can("team.manage") && member.role !== "owner" && (
                        <button onClick={() => setActionTarget(member)}
                          className="p-1.5 rounded-lg hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors">
                          <MoreHorizontal className="size-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Invite Modal */}
      <Modal
        isOpen={showInvite}
        onClose={() => {
          setShowInvite(false);
          setInviteEmail("");
          setInviteMessage("");
          setInviteRole(MERCHANT_ROLES.ADMIN);
        }}
        title="Invite Team Member"
        description="They'll receive an email with a secure invitation link"
        size="md"
      >
        <div className="space-y-6">
          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
            <Mail className="size-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900 mb-1">Team Invitation</p>
              <p className="text-sm text-blue-700">
                The invitation link is valid for 7 days. The recipient will be prompted to create an account or sign in.
              </p>
            </div>
          </div>

          <FormField
            label="Email Address"
            required
            description="Enter the email of the person you want to invite"
          >
            <Input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="colleague@yourbusiness.com"
            />
          </FormField>

          <FormField
            label="Role"
            required
            description="Select the role and permissions for this team member"
          >
            <div className="grid grid-cols-2 gap-3">
              {assignableRoles.map((r) => {
                const rolePermissions = {
                  [MERCHANT_ROLES.ADMIN]: "Full access to all features",
                  [MERCHANT_ROLES.DEVELOPER]: "API keys, webhooks, integrations",
                  [MERCHANT_ROLES.FINANCE]: "Settlements, payouts, reporting",
                  [MERCHANT_ROLES.SUPPORT]: "Transactions, disputes, customers",
                };
                
                return (
                  <button
                    key={r}
                    onClick={() => setInviteRole(r)}
                    className={cn(
                      "px-4 py-3 rounded-xl border text-left transition-all",
                      inviteRole === r
                        ? cn(MERCHANT_ROLE_COLORS[r], "border-current shadow-sm")
                        : "bg-card border-border hover:bg-muted/50"
                    )}
                  >
                    <p className="font-semibold text-sm mb-1">{MERCHANT_ROLE_LABELS[r]}</p>
                    <p className="text-xs text-muted-foreground leading-tight">
                      {rolePermissions[r as keyof typeof rolePermissions]}
                    </p>
                  </button>
                );
              })}
            </div>
          </FormField>

          <FormField
            label="Personal Message"
            description="Optional message to include in the invitation email"
          >
            <Input
              value={inviteMessage}
              onChange={(e) => setInviteMessage(e.target.value)}
              placeholder="Welcome to the team!"
            />
          </FormField>

          {/* Permission Summary */}
          <div className="bg-muted/30 border border-border rounded-xl p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              {MERCHANT_ROLE_LABELS[inviteRole]} Permissions
            </p>
            <div className="space-y-1">
              {(() => {
                const permissions: Record<MerchantRole, string[]> = {
                  [MERCHANT_ROLES.OWNER]: [
                    "Full account access",
                    "Delete or transfer account",
                    "Change payout bank account",
                    "Manage all team members",
                    "Configure all settings",
                    "View all financial data",
                  ],
                  [MERCHANT_ROLES.ADMIN]: [
                    "View and manage all transactions",
                    "Manage settlements and payouts",
                    "Invite and remove team members",
                    "Configure API keys and webhooks",
                    "Manage sub-merchants",
                    "Update business settings",
                  ],
                  [MERCHANT_ROLES.DEVELOPER]: [
                    "Generate and manage API keys",
                    "Configure webhook endpoints",
                    "Access API documentation",
                    "View transaction logs",
                    "Test sandbox environment",
                  ],
                  [MERCHANT_ROLES.FINANCE]: [
                    "View all financial reports",
                    "Export transaction data",
                    "Reconcile settlements",
                    "View payout history",
                    "Download invoices",
                  ],
                  [MERCHANT_ROLES.SUPPORT]: [
                    "View transaction details",
                    "Handle customer disputes",
                    "Initiate refunds",
                    "View customer information",
                    "Access support tools",
                  ],
                };
                
                return permissions[inviteRole]?.map((perm: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-2 text-xs">
                    <ShieldCheck className="size-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{perm}</span>
                  </div>
                ));
              })()}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-border">
            <button
              onClick={() => {
                setShowInvite(false);
                setInviteEmail("");
                setInviteMessage("");
                setInviteRole(MERCHANT_ROLES.ADMIN);
              }}
              className="w-full sm:flex-1 px-3 sm:px-4 py-2 sm:py-2.5 border border-border rounded-xl text-xs sm:text-sm font-medium hover:bg-muted/50 transition-all order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              disabled={!inviteEmail.trim() || !inviteEmail.includes("@")}
              onClick={() => {
                showToast(
                  "success",
                  "Invitation Sent",
                  `An invitation has been sent to ${inviteEmail} as ${MERCHANT_ROLE_LABELS[inviteRole]}.`
                );
                setShowInvite(false);
                setInviteEmail("");
                setInviteMessage("");
                setInviteRole(MERCHANT_ROLES.ADMIN);
              }}
              className="flex-1 px-4 py-2.5 bg-brand-navy hover:bg-[#1e2f72] text-white rounded-xl text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Mail className="size-4" />
              Send Invite
            </button>
          </div>
        </div>
      </Modal>

      {/* Action Modal */}
      {actionTarget && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setActionTarget(null)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm shadow-2xl"
            onClick={(e) => e.stopPropagation()}>
            <h2 className="font-bold text-lg mb-1" style={{ fontFamily: "var(--font-heading)" }}>Manage {actionTarget.name}</h2>
            <p className="text-sm text-muted-foreground mb-5">{actionTarget.email}</p>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-muted/50 text-sm font-medium transition-all border border-border">Change role</button>
              <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-amber-50 text-sm font-medium transition-all border border-border text-amber-700">Suspend access</button>
              <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-50 text-sm font-medium transition-all border border-destructive/20 text-destructive flex items-center gap-2">
                <AlertTriangle className="size-3.5" />
                Remove from account
              </button>
            </div>
            <button onClick={() => setActionTarget(null)}
              className="w-full mt-4 px-4 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:bg-muted/50 transition-all">
              Cancel
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
