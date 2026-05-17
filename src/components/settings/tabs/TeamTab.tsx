"use client";

import { useState, useMemo } from "react";
import {
  ChevronLeft, Plus, UserCog, ShieldCheck, Users,
  X, Check, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mockTeamMembers, DEFAULT_ROLES, ALL_PERMISSIONS } from "@/lib/mock-data/settings";
import type { Role, TeamMember } from "@/lib/mock-data/settings";

// ──────────────────────────────────────────────────────────────────────────────
// Shared Modal wrapper
// ──────────────────────────────────────────────────────────────────────────────
function Modal({
  title,
  onClose,
  children,
  wide,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div
        className={cn(
          "relative bg-white rounded-2xl shadow-2xl flex flex-col",
          wide ? "w-full max-w-xl max-h-[85vh]" : "w-full max-w-md"
        )}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Invite Team Member Modal
// ──────────────────────────────────────────────────────────────────────────────
function InviteModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [isDev, setIsDev] = useState(false);

  const canSubmit = email.trim() && role;

  return (
    <Modal title="Invite Team Member" onClose={onClose}>
      <div className="px-6 py-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Choose Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal bg-white"
          >
            <option value="">-- Select a role --</option>
            {DEFAULT_ROLES.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>
        <label className="flex items-center gap-2.5 cursor-pointer">
          <div
            className={cn("w-4 h-4 rounded border-2 flex items-center justify-center transition-colors", isDev ? "bg-brand-teal border-brand-teal" : "border-gray-300")}
            onClick={() => setIsDev((v) => !v)}
          >
            {isDev && <Check className="w-2.5 h-2.5 text-white" />}
          </div>
          <span className="text-sm text-gray-700">This team member is a developer</span>
        </label>
      </div>
      <div className="flex gap-2 px-6 pb-5">
        <button type="button" onClick={onClose} className="flex-1 py-2.5 text-sm font-medium text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={!canSubmit}
          className="flex-1 py-2.5 text-sm font-semibold text-white bg-brand-teal hover:bg-brand-teal/90 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Invite Team Member
        </button>
      </div>
    </Modal>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Enforce 2FA Modal
// ──────────────────────────────────────────────────────────────────────────────
function Enforce2FaModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal title="Enforce 2FA" onClose={onClose}>
      <div className="px-6 py-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-6 h-6 text-amber-500" />
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          You currently do not have 2FA enabled on your account.
          <br />Enable 2FA now to continue.
        </p>
      </div>
      <div className="flex gap-2 px-6 pb-5">
        <button type="button" onClick={onClose} className="flex-1 py-2.5 text-sm font-medium text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button type="button" onClick={onClose} className="flex-1 py-2.5 text-sm font-semibold text-white bg-brand-teal hover:bg-brand-teal/90 rounded-xl transition-colors">
          Enable 2FA
        </button>
      </div>
    </Modal>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Create Custom Role Modal
// ──────────────────────────────────────────────────────────────────────────────
function CreateRoleModal({ onClose, onCreate }: { onClose: () => void; onCreate: (r: Role) => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const categories = useMemo(() => {
    const map = new Map<string, typeof ALL_PERMISSIONS>();
    ALL_PERMISSIONS.forEach((p) => {
      if (!map.has(p.category)) map.set(p.category, []);
      map.get(p.category)!.push(p);
    });
    return Array.from(map.entries());
  }, []);

  function toggle(key: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  function submit() {
    const newRole: Role = {
      id: `custom_${Date.now()}`,
      name,
      description,
      permissions: Array.from(checked),
      isCustom: true,
      members: [],
    };
    onCreate(newRole);
    onClose();
  }

  return (
    <Modal title="Create Custom Role" onClose={onClose} wide>
      <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Role Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name Your Role"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Role Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe Your Role"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal"
          />
        </div>
        {categories.map(([cat, perms]) => (
          <div key={cat}>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{cat}</p>
            <div className="space-y-2">
              {perms.map((p) => (
                <label key={p.key} className="flex items-center gap-2.5 cursor-pointer group">
                  <div
                    className={cn("w-4 h-4 rounded border-2 flex items-center justify-center transition-colors", checked.has(p.key) ? "bg-brand-teal border-brand-teal" : "border-gray-300 group-hover:border-brand-teal/50")}
                    onClick={() => toggle(p.key)}
                  >
                    {checked.has(p.key) && <Check className="w-2.5 h-2.5 text-white" />}
                  </div>
                  <span className="text-sm text-gray-700">
                    <span className="font-semibold">Can</span> {p.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 px-6 py-4 border-t border-gray-100 shrink-0">
        <button type="button" onClick={onClose} className="flex-1 py-2.5 text-sm font-medium text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button
          type="button"
          onClick={submit}
          disabled={!name.trim()}
          className="flex-1 py-2.5 text-sm font-semibold text-white bg-brand-teal hover:bg-brand-teal/90 rounded-xl transition-colors disabled:opacity-50"
        >
          Create Role
        </button>
      </div>
    </Modal>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Role Detail Panel
// ──────────────────────────────────────────────────────────────────────────────
function RoleDetail({ role }: { role: Role }) {
  const permSet = new Set(role.permissions);
  const canAccess = ALL_PERMISSIONS.filter((p) => permSet.has(p.key));
  const cannotAccess = ALL_PERMISSIONS.filter((p) => !permSet.has(p.key));

  return (
    <div className="flex-1 min-w-0 p-6">
      <h2 className="text-xl font-bold text-gray-900 font-heading mb-1">{role.name}</h2>
      <p className="text-sm text-gray-500 mb-4">{role.description}</p>
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
        <Users className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-500">
          {role.members.length === 0
            ? "No team members with this role"
            : `Team members with this role (${role.members.length}): ${role.members.join(", ")}`}
        </span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Can */}
        <div className="rounded-2xl border border-emerald-100 overflow-hidden">
          <div className="bg-emerald-50 px-4 py-3">
            <p className="text-sm font-semibold text-emerald-700">What this role can access</p>
          </div>
          {canAccess.length === 0 ? (
            <p className="text-sm text-gray-400 px-4 py-4">No permissions granted</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {canAccess.map((p) => (
                <p key={p.key} className="text-sm text-gray-700 px-4 py-2.5">
                  <span className="font-semibold text-emerald-700">Can</span> {p.label}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Cannot */}
        <div className="rounded-2xl border border-red-100 overflow-hidden">
          <div className="bg-red-50 px-4 py-3">
            <p className="text-sm font-semibold text-red-600">What this role can&apos;t access</p>
          </div>
          {cannotAccess.length === 0 ? (
            <p className="text-sm text-gray-400 px-4 py-4">Full access granted</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {cannotAccess.map((p) => (
                <p key={p.key} className="text-sm text-gray-700 px-4 py-2.5">
                  <span className="font-semibold text-red-600">Cannot</span> {p.label}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Team Members Table
// ──────────────────────────────────────────────────────────────────────────────
function MembersView({
  members,
  onManageRoles,
}: {
  members: TeamMember[];
  onManageRoles: () => void;
}) {
  const [showInvite, setShowInvite] = useState(false);
  const [show2FA, setShow2FA] = useState(false);

  function formatDate(str: string) {
    return new Date(str).toLocaleString("en-GB", {
      month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
    });
  }

  return (
    <>
      <div className="bg-white/88 backdrop-blur-lg rounded-2xl border border-gray-200/70 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.45)] overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-gray-100 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-900">
              Team Members — {members.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setShow2FA(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <ShieldCheck className="w-3.5 h-3.5 text-gray-400" />
              Enforce 2FA
            </button>
            <button type="button" onClick={onManageRoles} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <UserCog className="w-3.5 h-3.5 text-gray-400" />
              Manage roles
            </button>
            <button type="button" onClick={() => setShowInvite(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-white bg-brand-teal hover:bg-brand-teal/90 rounded-xl transition-colors">
              <Plus className="w-3.5 h-3.5" />
              Invite someone
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {["Name", "Email Address", "Role", "2FA Status", "Last Login", "Actions"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">{m.name}</span>
                      {m.isCurrentUser && (
                        <span className="px-1.5 py-0.5 text-[10px] font-semibold text-gray-500 bg-gray-100 rounded-md">You</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-500">{m.email}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-700">{m.role}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <span className={cn("w-2 h-2 rounded-full", m.twoFaEnabled ? "bg-emerald-500" : "bg-gray-300")} />
                      <span className="text-sm text-gray-500">{m.twoFaEnabled ? "Enabled" : "Disabled"}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-400 whitespace-nowrap">{formatDate(m.lastLogin)}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-300 italic">
                    {m.isCurrentUser ? "No actions available" : (
                      <button type="button" className="text-red-400 hover:text-red-600 font-medium not-italic transition-colors">Remove</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showInvite && <InviteModal onClose={() => setShowInvite(false)} />}
      {show2FA && <Enforce2FaModal onClose={() => setShow2FA(false)} />}
    </>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Roles Management View
// ──────────────────────────────────────────────────────────────────────────────
function RolesView({ onBack }: { onBack: () => void }) {
  const [allRoles, setAllRoles] = useState<Role[]>(DEFAULT_ROLES);
  const [selectedRoleId, setSelectedRoleId] = useState<string>(DEFAULT_ROLES[0].id);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const selectedRole = allRoles.find((r) => r.id === selectedRoleId) ?? allRoles[0];
  const defaultRoles = allRoles.filter((r) => !r.isCustom);
  const customRoles  = allRoles.filter((r) =>  r.isCustom);

  return (
    <>
      <div className="bg-white/88 backdrop-blur-lg rounded-2xl border border-gray-200/70 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.45)] overflow-hidden">
        {/* Back button */}
        <div className="px-5 py-3 border-b border-gray-100">
          <button type="button" onClick={onBack} className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        <div className="flex min-h-[500px]">
          {/* Sidebar */}
          <div className="w-56 shrink-0 border-r border-gray-100 p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Default Roles</p>
            <div className="space-y-0.5">
              {defaultRoles.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedRoleId(r.id)}
                  className={cn(
                    "w-full text-left px-3 py-2.5 text-sm rounded-xl transition-colors flex items-center justify-between group",
                    r.id === selectedRoleId
                      ? "bg-brand-teal/10 text-brand-teal font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
                  )}
                >
                  {r.name}
                  {r.id === selectedRoleId && <ChevronRight className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>

            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 mt-5">Custom Roles</p>
            <div className="space-y-0.5">
              {customRoles.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedRoleId(r.id)}
                  className={cn(
                    "w-full text-left px-3 py-2.5 text-sm rounded-xl transition-colors",
                    r.id === selectedRoleId
                      ? "bg-brand-teal/10 text-brand-teal font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
                  )}
                >
                  {r.name}
                </button>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 leading-relaxed mb-3">
                You can create your own custom roles, and choose exactly what team members can see and do.
              </p>
              <button
                type="button"
                onClick={() => setShowCreateModal(true)}
                className="text-sm font-medium text-brand-teal hover:text-brand-teal/80 transition-colors"
              >
                Create a custom role
              </button>
            </div>
          </div>

          {/* Role detail */}
          <div className="flex-1 min-w-0 overflow-y-auto">
            {selectedRole && <RoleDetail role={selectedRole} />}
          </div>
        </div>
      </div>

      {showCreateModal && (
        <CreateRoleModal
          onClose={() => setShowCreateModal(false)}
          onCreate={(r) => {
            setAllRoles((prev) => [...prev, r]);
            setSelectedRoleId(r.id);
          }}
        />
      )}
    </>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Main TeamTab
// ──────────────────────────────────────────────────────────────────────────────
export default function TeamTab() {
  const [view, setView] = useState<"members" | "roles">("members");
  const [members] = useState<TeamMember[]>(mockTeamMembers);

  return view === "members" ? (
    <MembersView members={members} onManageRoles={() => setView("roles")} />
  ) : (
    <RolesView onBack={() => setView("members")} />
  );
}
