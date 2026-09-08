# SRS Compliance Audit - Platform Dashboard Pages

## Status: In Progress
**Date:** September 1, 2026

---

## Merchants Page (PD-010 to PD-015)

### ✅ Implemented
- [x] PD-010: Searchable, filterable, paginated merchant list ✓
- [x] PD-011: Create merchant modal (Super Admin) ✓
- [x] PD-012: Suspend/Reactivate/Deactivate with reason field ✓
- [x] PD-013: Merchant detail view with profile, team, fee schedule ✓
- [x] PD-015: Impersonate merchant with banner, time-limited session ✓

### ❌ Missing/Incomplete
- [ ] **PD-014: Edit fee schedule** - Currently read-only, needs modal to edit collection rate, floor, cap, payout rate, fee bearer
- [ ] **Better validation** - Form inputs need real-time validation
- [ ] **Success/error toasts** - Actions need feedback using new Toast system

### Recommendation
**Add:** Fee configuration modal with form inputs and save/cancel actions

---

## Treasury Page (PD-020 to PD-027)

### Need to Check:
- PD-021: NSP alert threshold configuration - is this editable?
- PD-023: Flag discrepancy feature - can users flag and track?
- PD-025: Approve/reject payout batches - are these interactive?
- PD-027: Export CSV/PDF - is this functional?

---

## Compliance Page (PD-030 to PD-037)

### Need to Check:
- PD-032: Approve/reject with mandatory reason - is reason required?
- PD-031: Document preview (PDF/image viewer) - inline viewer working?
- PD-035: Place compliance hold - is this implemented?
- PD-037: Export KYC documentation package - is this functional?

---

## Support Page (PD-040 to PD-045)

### Need to Check:
- PD-041: Transaction search across all merchants - comprehensive search?
- PD-043: Initiate dispute case - full form with routing?
- PD-044: SLA tracker per provider - breach highlighting?
- PD-045: Incident log for security - complete implementation?

---

## Providers Page (PD-050 to PD-055)

### Need to Check:
- PD-051: Add new provider configuration - full form?
- PD-052: Configure routing rules with Super Admin approval - workflow complete?
- PD-054: Schedule maintenance windows - scheduler implemented?
- PD-055: Rotate credentials - interactive rotation?

---

## Audit Log Page (PD-060 to PD-063)

### Need to Check:
- PD-061: Complete audit entries with before/after state - is this sufficient?
- PD-062: Search by all criteria - all filters working?
- PD-063: Immutable log (UI indication) - how to show this?

---

## Settings Page

### Need to Check:
- Team management: Invite modal with role selection?
- Save confirmation modal before applying changes?
- Actual form submission (not just local state)?

---

## Next Actions

1. **Immediate Priority:**
   - Add Fee Configuration modal to Merchants page (PD-014)
   - Integrate Toast notifications for all actions
   - Add proper form validation

2. **Review Each Page:**
   - Treasury: Check if modals exist for thresholds, discrepancies, approvals
   - Compliance: Verify document viewer and approval workflows
   - Support: Check dispute and incident forms
   - Providers: Verify all CRUD operations
   - Settings: Add team invite modal

3. **Enhancement:**
   - Replace custom modals with new Modal/Drawer components
   - Add loading states during async operations
   - Implement optimistic UI updates
