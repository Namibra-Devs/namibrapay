'use client';

import { useState } from "react";
import { motion } from "motion/react";
import { Plus, Mail, Shield, ShieldCheck, MoreHorizontal, UserCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/constants";
import { mockTeamMembers } from "@/lib/merchant-mock-data";
import type { TeamMember } from "@/lib/merchant-mock-data";
import { MERCHANT_ROLE_LABELS, MERCHANT_ROLE_COLORS, MERCHANT_ROLES } from "@/lib/merchant-constants";
import type { MerchantRole } from "@/lib/merchant-constants";
import { useMerchantRole } from "@/hooks/use-merchant-role";

export default function TeamPage() {
  const { can, role } = useMerchantRole();
  const [showInvite, setShowInvite] = useState(false);
  const [actionTarget, setActionTarget] = useState<TeamMember | null>(null);
  const [inviteRole, setInviteRole] = useState<MerchantRole>(MERCHANT_ROLES.ADMIN);

  const assignableRoles = [MERCHANT_ROLES.ADMIN, MERCHANT_ROLES.DEVELOPER, MERCHANT_ROLES.FINANCE, MERCHANT_ROLES.SUPPORT] as MerchantRole[];

  return (
    <div className="px-6 py-6 space-y-6 pb-24 md:pb-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>Team</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage who has access to your NamibraPay account and what they can do.</p>
        </div>
        {can("team.manage") && (
          <button onClick={() => setShowInvite(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#263b8e] hover:bg-[#1e2f72] text-white rounded-xl text-sm font-medium transition-all shrink-0">
            <Plus className="size-4" />
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
                        <div className="size-8 rounded-full bg-[#64c6c3]/10 border border-[#64c6c3]/20 flex items-center justify-center shrink-0">
                          <UserCircle className="size-4 text-[#64c6c3]" />
                        </div>
                        <div>
                          <p className="font-medium text-sm flex items-center gap-2">
                            {member.name}
                            {isCurrentUser && <span className="text-[9px] bg-[#64c6c3]/10 text-[#1a6e6c] border border-[#64c6c3]/20 px-1.5 py-0.5 rounded-full font-medium">You</span>}
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
      {showInvite && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setShowInvite(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}>
            <div className="size-10 rounded-xl bg-[#263b8e]/10 border border-[#263b8e]/20 flex items-center justify-center mb-4">
              <Mail className="size-5 text-[#263b8e]" />
            </div>
            <h2 className="font-bold text-lg mb-1" style={{ fontFamily: "var(--font-heading)" }}>Invite Team Member</h2>
            <p className="text-sm text-muted-foreground mb-5">They'll receive an email with a secure invitation link.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Email Address</label>
                <input placeholder="colleague@yourbusiness.com" type="email"
                  className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-xl outline-none focus:border-[#64c6c3]/60 focus:ring-2 focus:ring-[#64c6c3]/10 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Role</label>
                <div className="grid grid-cols-2 gap-2">
                  {assignableRoles.map((r) => (
                    <button key={r} onClick={() => setInviteRole(r)}
                      className={cn("px-3 py-2.5 rounded-xl border text-xs font-medium text-left transition-all",
                        inviteRole === r ? cn(MERCHANT_ROLE_COLORS[r], "border-current") : "bg-card border-border hover:bg-muted/50")}>
                      <p className="font-semibold">{MERCHANT_ROLE_LABELS[r]}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowInvite(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted/50 transition-all">Cancel</button>
              <button onClick={() => setShowInvite(false)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#263b8e] hover:bg-[#1e2f72] text-white text-sm font-medium transition-all">Send Invite</button>
            </div>
          </motion.div>
        </div>
      )}

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
