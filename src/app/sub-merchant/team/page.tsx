'use client';

import { useState } from "react";
import { motion } from "motion/react";
import {
  UserPlus,
  Users,
  Mail,
  Clock,
  CheckCircle2,
  Trash2,
  Info,
  Shield,
  Eye,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/constants";
import { smTeamMembers, type SmTeamMember } from "@/lib/sub-merchant-mock-data";
import { SUB_MERCHANT_ROLE_LABELS, SUB_MERCHANT_ROLE_COLORS } from "@/lib/sub-merchant-constants";
import { useSubMerchantRole } from "@/hooks/use-sub-merchant-role";
import { Modal } from "@/components/ui/modal";
import { FormField, Input } from "@/components/ui/form-field";
import { useToast } from "@/components/ui/toast";

const inviteStatusBadge = {
  accepted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
};

const inviteStatusIcon = {
  accepted: <CheckCircle2 className="size-3.5 text-emerald-500" />,
  pending: <Clock className="size-3.5 text-amber-500" />,
};

export default function SubMerchantTeamPage() {
  const { can, role } = useSubMerchantRole();
  const { showToast } = useToast();

  // State
  const [teamMembers, setTeamMembers] = useState<SmTeamMember[]>(smTeamMembers);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<SmTeamMember | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState<"sub_admin" | "sub_viewer">("sub_viewer");

  // Email validation
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Handle invite - SM-031
  const handleInvite = () => {
    if (!inviteEmail.trim()) {
      showToast("warning", "Missing Email", "Please enter an email address.");
      return;
    }

    if (!isValidEmail(inviteEmail)) {
      showToast("warning", "Invalid Email", "Please enter a valid email address.");
      return;
    }

    // Check if email already exists
    if (teamMembers.some(m => m.email.toLowerCase() === inviteEmail.toLowerCase())) {
      showToast("warning", "Already Invited", "This user is already part of your team.");
      return;
    }

    showToast("success", "Invitation Sent", `Invitation sent to ${inviteEmail} as ${SUB_MERCHANT_ROLE_LABELS[selectedRole]}. Valid for 7 days.`);

    // Add to team list (mock)
    const newMember: SmTeamMember = {
      id: `smt-${Date.now()}`,
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: selectedRole,
      lastLogin: null,
      inviteStatus: "pending",
    };
    setTeamMembers([...teamMembers, newMember]);

    setShowInviteModal(false);
    setInviteEmail("");
    setSelectedRole("sub_viewer");
  };

  // Handle remove - SM-032
  const handleRemove = (member: SmTeamMember) => {
    if (!can("team.manage")) {
      showToast("error", "Access Denied", "You don't have permission to remove team members.");
      return;
    }

    setMemberToRemove(member);
    setShowRemoveModal(true);
  };

  const confirmRemove = () => {
    if (memberToRemove) {
      setTeamMembers(teamMembers.filter(m => m.id !== memberToRemove.id));
      showToast("success", "Member Removed", `${memberToRemove.name} has been removed from your team.`);
    }
    setShowRemoveModal(false);
    setMemberToRemove(null);
  };

  return (
    <div className="px-6 py-6 space-y-6 pb-24 md:pb-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
            Team
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {teamMembers.length} team member{teamMembers.length !== 1 ? "s" : ""}
          </p>
        </div>
        {can("team.manage") ? (
          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#1a7a5e] text-white rounded-xl text-sm font-medium hover:bg-[#1a7a5e]/90 transition-colors"
          >
            <UserPlus className="size-4" />
            Invite Viewer
          </button>
        ) : (
          <button
            onClick={() => showToast("info", "Action Restricted", "Only Admins can invite team members. Contact your admin for assistance.")}
            className="flex items-center gap-2 px-4 py-2.5 bg-muted text-muted-foreground rounded-xl text-sm font-medium cursor-not-allowed"
            title="Admin permission required"
          >
            <UserPlus className="size-4" />
            Invite Viewer
          </button>
        )}
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
        <Info className="size-4 text-blue-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-blue-800">Team Member Roles</p>
          <p className="text-xs text-blue-600 mt-1">
            <strong>Admin:</strong> Full access to all features and settings. <strong>Viewer:</strong> Read-only access to transactions, settlements, and reports.
          </p>
        </div>
      </div>

      {/* Viewer Mode Notice */}
      {role === "sub_viewer" && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <Eye className="size-4 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-800">Viewer Access Only</p>
            <p className="text-xs text-amber-600 mt-1">
              You can view team members but cannot invite or remove members. Contact your admin for team management.
            </p>
          </div>
        </div>
      )}

      {/* Team Members Table - SM-030 */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["Name", "Email", "Role", "Invite Status", "Last Login", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider first:pl-5 last:pr-5">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {teamMembers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <Users className="size-12 text-muted-foreground/40 mx-auto mb-3" />
                    <p className="text-muted-foreground font-medium">No team members yet</p>
                    <p className="text-xs text-muted-foreground mt-1">Invite viewers to collaborate on your account</p>
                  </td>
                </tr>
              ) : (
                teamMembers.map((member, i) => (
                  <tr
                    key={member.id}
                    className={cn(
                      "border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors",
                      i % 2 === 0 ? "" : "bg-muted/10"
                    )}
                  >
                    <td className="pl-5 pr-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-brand-mint/20 border border-brand-mint/40 flex items-center justify-center">
                          <Users className="size-5 text-[#1a7a5e]" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{member.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{member.email}</td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2 py-1 rounded-full border text-[11px] font-medium",
                        SUB_MERCHANT_ROLE_COLORS[member.role]
                      )}>
                        {member.role === "sub_admin" ? <Shield className="size-3" /> : <Eye className="size-3" />}
                        {SUB_MERCHANT_ROLE_LABELS[member.role]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "flex items-center gap-1.5 w-fit px-2 py-1 rounded-full border text-[11px] font-medium",
                        inviteStatusBadge[member.inviteStatus]
                      )}>
                        {inviteStatusIcon[member.inviteStatus]}
                        {member.inviteStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {member.lastLogin ? formatDate(member.lastLogin) : "Never"}
                    </td>
                    <td className="pl-4 pr-5 py-3">
                      {can("team.manage") && member.role !== "sub_admin" && (
                        <button
                          onClick={() => handleRemove(member)}
                          className="p-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                          title="Remove member"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Viewer Modal - SM-031 */}
      {showInviteModal && (
        <Modal
          isOpen={showInviteModal}
          onClose={() => {
            setShowInviteModal(false);
            setInviteEmail("");
            setSelectedRole("sub_viewer");
          }}
          title="Invite Team Member"
          size="md"
        >
          <div className="space-y-6">
            {/* Info banner */}
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <Info className="size-4 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-800">Invitation expires in 7 days</p>
                <p className="text-xs text-amber-600 mt-1">
                  The invited user must accept within 7 days to join your team.
                </p>
              </div>
            </div>

            {/* Email input */}
            <FormField label="Email Address" required>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="member@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="pl-9"
                />
              </div>
            </FormField>

            {/* Role selection */}
            <FormField label="Select Role" required>
              <div className="space-y-3">
                {[
                  { 
                    value: "sub_viewer" as const, 
                    icon: Eye, 
                    label: "Viewer", 
                    desc: "Read-only access to transactions, settlements, and reports",
                    color: "#64c6c3"
                  },
                  { 
                    value: "sub_admin" as const, 
                    icon: Shield, 
                    label: "Admin", 
                    desc: "Full access to all features and settings",
                    color: "#5c3d9e"
                  },
                ].map((role) => (
                  <button
                    key={role.value}
                    onClick={() => setSelectedRole(role.value)}
                    className={cn(
                      "w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left",
                      selectedRole === role.value
                        ? "border-[#1a7a5e] bg-brand-mint/10"
                        : "border-border hover:border-ring/40"
                    )}
                  >
                    <div 
                      className="size-10 rounded-xl flex items-center justify-center shrink-0" 
                      style={{ background: `${role.color}18` }}
                    >
                      <role.icon className="size-5" style={{ color: role.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold mb-1">{role.label}</p>
                      <p className="text-xs text-muted-foreground">{role.desc}</p>
                    </div>
                    {selectedRole === role.value && (
                      <CheckCircle2 className="size-5 text-[#1a7a5e] shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </FormField>

            {/* Permission summary */}
            <div className="bg-muted/30 rounded-xl p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                {SUB_MERCHANT_ROLE_LABELS[selectedRole]} Permissions
              </p>
              <div className="space-y-1.5 text-xs text-muted-foreground">
                {selectedRole === "sub_viewer" ? (
                  <>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 text-emerald-500" />
                      <span>View transactions and settlements</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 text-emerald-500" />
                      <span>Export transaction reports</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 text-emerald-500" />
                      <span>View team members</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 text-emerald-500" />
                      <span>Full access to all features</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 text-emerald-500" />
                      <span>Manage team members and settings</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 text-emerald-500" />
                      <span>Raise disputes and manage account</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-border">
              <button
                onClick={handleInvite}
                className="flex-1 px-4 py-2.5 bg-[#1a7a5e] text-white rounded-xl text-sm font-medium hover:bg-[#1a7a5e]/90 transition-colors"
              >
                Send Invitation
              </button>
              <button
                onClick={() => {
                  setShowInviteModal(false);
                  setInviteEmail("");
                  setSelectedRole("sub_viewer");
                }}
                className="flex-1 px-4 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-muted/50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Remove Member Confirmation Modal - SM-032 */}
      {showRemoveModal && memberToRemove && (
        <Modal
          isOpen={showRemoveModal}
          onClose={() => {
            setShowRemoveModal(false);
            setMemberToRemove(null);
          }}
          title="Remove Team Member"
          size="sm"
        >
          <div className="space-y-6">
            {/* Warning message */}
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <AlertTriangle className="size-4 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-800">Remove team member?</p>
                <p className="text-xs text-amber-600 mt-1">
                  {memberToRemove.name} will immediately lose access to this sub-merchant account.
                </p>
              </div>
            </div>

            {/* Member info */}
            <div className="bg-muted/30 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-brand-mint/20 border border-brand-mint/40 flex items-center justify-center">
                  <Users className="size-5 text-[#1a7a5e]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{memberToRemove.name}</p>
                  <p className="text-xs text-muted-foreground">{memberToRemove.email}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-border">
              <button
                onClick={confirmRemove}
                className="flex-1 px-4 py-2.5 bg-destructive text-white rounded-xl text-sm font-medium hover:bg-destructive/90 transition-colors"
              >
                Remove Member
              </button>
              <button
                onClick={() => {
                  setShowRemoveModal(false);
                  setMemberToRemove(null);
                }}
                className="flex-1 px-4 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-muted/50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
