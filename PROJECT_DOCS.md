# NamibraPay — Project Documentation

> Last updated: September 1, 2026  
> Stack: Vite · React 19 · TypeScript (strict) · Tailwind CSS 4 · shadcn UI · Convex backend · Hercules Auth

---

## 1. What This Project Is

NamibraPay is a **three-tier payment operations platform** for a Ghanaian mobile-money / payment infrastructure company. It has three completely separate dashboards representing three different user contexts:

| Tier | Route | Who uses it | Accent colour |
|------|-------|-------------|---------------|
| **Tier 1** — Platform Dashboard | `/platform` | Internal NamibraPay staff | Teal `#64c6c3` |
| **Tier 2** — Merchant Dashboard | `/merchant` | Merchant businesses | Navy `#263b8e` |
| **Tier 3** — Sub-Merchant Dashboard | `/sub-merchant` | Sub-merchants under a parent merchant | Mint `#a3ffe2` |

All three dashboards share the same dark navy sidebar shell and brand. **Tier 2 and Tier 3 are completely provider-blind** — they never show NSP (Network Service Provider) names, routing data, or any platform-internal information.

---

## 2. Brand & Design System

### Fonts
- **Body:** Manrope Variable — `var(--font-body)`
- **Headings:** Space Grotesk Variable — `var(--font-heading)`

### Colour Palette
| Name | Hex | Usage |
|------|-----|-------|
| Teal | `#64c6c3` | Tier 1 accent, success, healthy NSP |
| Navy | `#263b8e` | Primary buttons, Tier 2 accent |
| Pink | `#ffb4b0` | Error highlights, Super Admin badge |
| Peach | `#fedfb8` | Finance role, warning states |
| Lavender | `#bcbbee` | Compliance role, developer badge |
| Mint | `#a3ffe2` | Tier 3 accent, support role |

### Themes
Both light and dark mode are fully implemented. CSS vars defined in `src/index.css` on `:root` (light) and `.dark` (dark). ThemeProvider defaults to user OS preference (`system`).

---

## 3. File Structure

```
src/
├── App.tsx                          — All routes. RoleProvider wraps /platform.
├── index.css                        — Brand theme, fonts, CSS vars, scrollbar
│
├── components/
│   ├── providers/default.tsx        — DefaultProviders (theme, Convex, auth)
│   └── ui/                          — shadcn UI components
│
├── hooks/
│   ├── use-role.tsx                 — Tier 1: RoleProvider, useRole, usePermission, ROLE_PERMISSIONS
│   ├── use-merchant-role.tsx        — Tier 2: MerchantRoleProvider, useMerchantRole
│   ├── use-sub-merchant-role.tsx    — Tier 3: SubMerchantRoleProvider, useSubMerchantRole
│   └── use-auth.ts                  — Hercules Auth hook
│
├── lib/
│   ├── constants.ts                 — Tier 1 Role type, ROLE_LABELS, formatGHS(), formatDate()
│   ├── mock-data.ts                 — Tier 1: Merchant, Transaction, Alert, Provider types + data
│   ├── treasury-mock-data.ts        — PrefundRequest, ReconciliationEntry, PayoutBatch, FeeLedgerEntry, FinancialReport
│   ├── merchant-constants.ts        — Tier 2 MerchantRole type, MERCHANT_PERMISSIONS
│   ├── merchant-mock-data.ts        — Tier 2 mock data (transactions, settlements, team, API keys, etc.)
│   ├── sub-merchant-constants.ts    — Tier 3 SubMerchantRole, subMerchantCan()
│   ├── sub-merchant-mock-data.ts    — Tier 3 mock data (50 transactions, payouts, team)
│   └── utils.ts                     — cn() utility
│
├── pages/
│   ├── auth/Callback.tsx            — Hercules Auth callback — DO NOT EDIT
│   ├── NotFound.tsx
│   │
│   ├── platform/                    TIER 1
│   │   ├── layout.tsx               — Shell: sidebar, topbar, role switcher
│   │   ├── overview.tsx             ✅ BUILT
│   │   ├── merchants.tsx            ✅ BUILT
│   │   ├── treasury.tsx             ✅ BUILT
│   │   ├── compliance.tsx           🚧 STUB — next milestone
│   │   ├── support.tsx              🚧 STUB
│   │   ├── providers.tsx            🚧 STUB
│   │   ├── audit.tsx                🚧 STUB
│   │   └── settings.tsx             🚧 STUB
│   │   └── _components/
│   │       ├── sidebar.tsx
│   │       ├── role-switcher.tsx
│   │       ├── kpi-card.tsx
│   │       ├── nsp-card.tsx
│   │       ├── alerts-feed.tsx
│   │       ├── transaction-chart.tsx
│   │       └── coming-soon.tsx
│   │
│   ├── merchant/                    TIER 2 — all 7 pages built
│   │   ├── layout.tsx, overview.tsx, transactions.tsx, settlements.tsx
│   │   ├── sub-merchants.tsx, api.tsx, team.tsx, merchant-settings.tsx
│   │   └── _components/merchant-sidebar.tsx, merchant-role-switcher.tsx, transaction-detail.tsx
│   │
│   └── sub-merchant/               TIER 3 — all 5 pages built
│       ├── layout.tsx, overview.tsx, transactions.tsx
│       ├── settlements.tsx, team.tsx, settings.tsx
```

---

## 4. Role & Permission System

### Tier 1 Roles (`src/hooks/use-role.tsx`)

| Role | Key | Access |
|------|-----|--------|
| Super Admin | `super_admin` | Full platform access |
| Finance | `finance` | Treasury view/approve, merchants view, audit |
| Compliance | `compliance` | Compliance view/approve, merchant suspend/manage, audit |
| Support Lead | `support` | Support view, merchants view, audit |
| Platform Engineer | `platform_engineer` | Providers view/edit, audit, settings |

```tsx
const canApprove = usePermission("treasury.approve");
const canManage  = usePermission("merchants.manage");
```

All 5 roles are testable via the **Role Switcher** in the Tier 1 topbar.

### Tier 2 Roles (`src/lib/merchant-constants.ts`)

| Role | Key | Notable |
|------|-----|---------|
| Owner | `owner` | All incl. account delete, bank change |
| Admin | `admin` | All except account delete/transfer |
| Developer | `developer` | Dashboard, transactions, API manage |
| Finance | `finance` | Transactions, settlements, reconcile, disputes |
| Support Agent | `support` | Transactions view, refund request |

Gated features:
- Reconciliation tab → `settlements.reconcile` (Finance, Owner, Admin)
- Sandbox Console tab → `api.manage` (Owner, Developer)

### Tier 3 Roles (`src/lib/sub-merchant-constants.ts`)

| Role | Key | Access |
|------|-----|--------|
| Sub Admin | `sub_admin` | Read + raise disputes + manage team + settings |
| Sub Viewer | `sub_viewer` | Read-only; Team and Settings hidden from nav |

```tsx
import { subMerchantCan } from "@/lib/sub-merchant-constants.ts";
if (subMerchantCan(role, "team.manage")) { /* ... */ }
```

---

## 5. Built Pages Summary

### Tier 1 — Platform Overview (`/platform`)
6 KPI cards, 4 NSP balance cards, 7-day area chart, alerts feed

### Tier 1 — Merchant Management (`/platform/merchants`)
Searchable/filterable merchant list → split-panel detail with tabs:
- Overview (profile, KYC status, quick actions)
- Fee Schedule (per-channel rates/caps)
- Team (read-only)
- Notes (internal notes feed)

Actions: Suspend, Reactivate, Deactivate, Impersonate (amber fixed banner). Role-gated.

### Tier 1 — Treasury & Finance (`/platform/treasury`)
6 tabs: Overview · NSP Prefunding · Reconciliation · Payout Batches · Fee Ledger · Reports

- NSP balance bars with threshold markers and Request Prefund shortcuts
- Approve/reject workflows for prefund requests and payout batches
- 7-day reconciliation table with expandable discrepancy rows
- Fee ledger with NSP / platform split per transaction
- Downloadable reports (Reconciliation, Fee Ledger, Payouts, Volume, NSP Balance)
- Finance + Super Admin only

### Tier 2 — Merchant Dashboard (`/merchant`)
7 pages: Overview · Transactions (paginated, slide-in detail) · Settlements (Summary/Payout History/Reconciliation) · Sub-Merchants (cards + create) · API & Webhooks (keys/webhooks/sandbox) · Team (invite/manage/remove) · Settings (profile, payout bank, fee bearer, notifications, security)

### Tier 3 — Sub-Merchant Dashboard (`/sub-merchant`)
5 pages: Overview (KPIs, dispute alert, chart) · Transactions (paginated, dispute flow, fee breakdown) · Settlements (Summary/Payout History/Fee Breakdown) · Team (invite/remove viewers) · Settings (profile, notifications, security)

---

## 6. Where to Continue

The next three milestones are all coming-soon stubs. Build them in order:

### milestone-4 — Compliance & KYC (`/platform/compliance`)

Suggested scope:
- **KYC queue** — merchants awaiting review, with document viewer
- **KYC actions** — Approve / Request More Info / Reject (note required)
- **AML / flags tab** — flagged merchants, severity, escalation workflow
- **Risk scoring** — per-merchant risk indicators
- **Compliance reports** — export KYC status

Role gating: `compliance.view` to see, `compliance.approve` to act.

Mock data to add to a new `src/lib/compliance-mock-data.ts`:
- KYC queue items with document types (National ID, Business Certificate, Proof of Address)
- AML flag entries linked to `mockMerchants`
- Risk score per merchant (low / medium / high)

---

### milestone-5 — Support Tools (`/platform/support`)

Suggested scope:
- **Ticket queue** — inbound tickets from merchants/sub-merchants
- **Ticket detail** — chat-style thread view, status changes (Open → In Progress → Resolved)
- **Transaction lookup** — search any transaction by reference across all merchants
- **Refund management** — initiate/approve refunds
- **Dispute resolution** — view and close raised disputes
- **Announcements** — send platform-wide or targeted notifications

Role gating: `support.view` for all.

---

### milestone-6 — Providers & Audit Log (`/platform/providers` + `/platform/audit`)

Two pages in one milestone:

**Providers page:**
- Live health monitoring (latency, uptime, last successful) for MTN, VOD, AT, GIP
- Routing rules — per-channel routing weights and failover config
- Provider credentials — API key management (Platform Engineer only)
- Incident history — past outages with timeline
- Simulate failover toggle

Role gating: `providers.view` to see, `providers.edit` to modify.

**Audit Log page:**
- Immutable event log: timestamp, actor, IP, action type, affected resource
- Filters: date range, actor, action type
- Export to CSV
- Impersonation events highlighted distinctly

All roles with `audit.view` can see this.

---

## 7. Currency & Date Conventions

All amounts are in **Ghanaian Cedi (GHS)**.

```ts
import { formatGHS, formatDate } from "@/lib/constants.ts";

formatGHS(1_240_000)             // → "GH₵1,240,000.00"
formatDate("2026-09-01T14:30Z")  // → "01 Sep 2026 14:30"
```

Timestamps are stored as **ISO 8601 UTC strings**. Convert to local time only at display with `formatDate()`.

---

## 8. Connecting a Real Backend

All data is currently frontend-only mock data. Convex is set up for auth but no payment data schema exists yet.

Steps to connect real data:
1. Define your Convex schema in `convex/schema.ts`
2. Replace mock imports with `useQuery(api.tableName.fn, args)` — handle `undefined` (loading) state
3. Replace action handlers with `useMutation(api.tableName.fn)` calls
4. Extend the role system: derive role from `ctx.auth.getUserIdentity()` → `users` table (with `tokenIdentifier` field and `by_token` index — already the Hercules standard)
5. Never pass user IDs as function arguments for auth — always use `ctx.auth.getUserIdentity()` server-side

---

## 9. Key Dependencies

| Package | Purpose |
|---------|---------|
| `recharts` | Charts (area, bar) |
| `motion` (v12) | Animations (formerly Framer Motion) |
| `lucide-react` | Icons |
| `sonner` (v2) | Toast notifications |
| `convex` (v1) | Backend & real-time DB |
| `@usehercules/auth` (≥1.0.42) | Auth |
| `@fontsource-variable/manrope` | Body font |
| `@fontsource-variable/space-grotesk` | Heading font |
| `zod` + `react-hook-form` | Form validation |

---

## 10. Important Rules

1. **No Next.js / SSR.** Vite SPA only. All rendering is client-side.
2. **Hercules Auth only.** No custom login forms. Never edit `src/pages/auth/Callback.tsx`.
3. **Provider-blind Tier 2 & 3.** NSP names, routing, and provider fees must never appear in `/merchant` or `/sub-merchant`.
4. **No `any` types.** Use `unknown` with type guards instead.
5. **No `@ts-ignore`.** Fix the actual type error.
6. **`vite.config.ts`, `package.json`, `tsconfig.json` — do not edit manually.** Use the `manage_packages` tool for dependencies.
7. **Semantic colour variables** for light/dark compatibility. Any hardcoded colour needs a `dark:` counterpart.

---

## 11. Quick URL Reference

| URL | Status |
|-----|--------|
| `/platform` | ✅ Overview |
| `/platform/merchants` | ✅ Merchant Management |
| `/platform/treasury` | ✅ Treasury & Finance |
| `/platform/compliance` | 🚧 Stub — milestone-4 |
| `/platform/support` | 🚧 Stub — milestone-5 |
| `/platform/providers` | 🚧 Stub — milestone-6 |
| `/platform/audit` | 🚧 Stub — milestone-6 |
| `/platform/settings` | 🚧 Stub |
| `/merchant` | ✅ Overview |
| `/merchant/transactions` | ✅ |
| `/merchant/settlements` | ✅ |
| `/merchant/sub-merchants` | ✅ |
| `/merchant/api` | ✅ |
| `/merchant/team` | ✅ |
| `/merchant/settings` | ✅ |
| `/sub-merchant` | ✅ Overview |
| `/sub-merchant/transactions` | ✅ |
| `/sub-merchant/settlements` | ✅ |
| `/sub-merchant/team` | ✅ Admin only |
| `/sub-merchant/settings` | ✅ Admin only |
