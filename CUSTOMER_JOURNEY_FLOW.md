# NamibraPay Customer Journey Flow

## Complete User Journey (SRS-Compliant)

```
┌─────────────────────────────────────────────────────────────────────┐
│                    CUSTOMER ONBOARDING JOURNEY                       │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────┐
│   Landing Page  │
│   (Marketing)   │
└────────┬────────┘
         │
         │ Click "Get Started" / "Sign Up"
         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        SIGN UP (6 Steps)                             │
│  /signup                                                             │
├─────────────────────────────────────────────────────────────────────┤
│  Step 1: Business Details                                           │
│  • Business name, registration number                               │
│  • Country, address, industry                                       │
│  • Business type (starter/registered)                               │
│                                                                      │
│  Step 2: Owner Information                                          │
│  • First name, last name                                            │
│  • Email, phone number                                              │
│  • Developer status                                                 │
│                                                                      │
│  Step 3: KYC Documents                                              │
│  • Business registration certificate (PDF/JPG/PNG, max 5MB)        │
│  • Director/Owner ID                                                │
│  • Proof of address                                                 │
│                                                                      │
│  Step 4: Payout Account                                             │
│  • Bank name                                                        │
│  • Account number, account name                                     │
│                                                                      │
│  Step 5: Security                                                   │
│  • Password (10+ chars, upper, lower, number, special)             │
│  • Password confirmation                                            │
│                                                                      │
│  Step 6: Terms & Conditions                                         │
│  • Accept Terms of Service                                          │
│  • Accept Privacy Policy                                            │
│  • Review application summary                                       │
│  • [Submit Application]                                             │
└────────┬────────────────────────────────────────────────────────────┘
         │
         │ Application Submitted
         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   ONBOARDING STATUS PAGE                             │
│  /onboarding-status?email=customer@example.com                      │
├─────────────────────────────────────────────────────────────────────┤
│  Status: "Application Submitted - Under Review"                     │
│                                                                      │
│  📋 Application Details:                                            │
│  • Business name, email, submitted date                             │
│  • Current status                                                   │
│                                                                      │
│  📝 Review Progress:                                                │
│  • Compliance notes                                                 │
│  • Estimated completion: 2 business days                            │
│                                                                      │
│  📧 Email Notification:                                             │
│  "Your application has been submitted and is under review..."       │
│                                                                      │
│  [Refresh Status]                                                   │
└────────┬────────────────────────────────────────────────────────────┘
         │
         │ BACKEND: Compliance Team Reviews Application
         │
         ├─── ❌ REJECTED ──────────────────────────────────────────┐
         │                                                           │
         ├─── ⚠️  NEEDS INFO ────────────────────────────────────┐  │
         │                                                        │  │
         └─── ✅ APPROVED ──────────────────────────────────────┐ │  │
                                                                 │ │  │
         ┌───────────────────────────────────────────────────────┘ │  │
         │                                                           │  │
         ▼                                                           │  │
┌─────────────────────────────────────────────────────────────┐      │  │
│          STATUS: APPROVED ✅                                 │      │  │
│  /onboarding-status                                         │      │  │
├─────────────────────────────────────────────────────────────┤      │  │
│  Status: "Application Approved!"                            │      │  │
│  🎉 Congratulations! Your account is now active.           │      │  │
│                                                             │      │  │
│  📧 Email: "Your NamibraPay account has been approved!"    │      │  │
│                                                             │      │  │
│  [Sign In to Dashboard] ────────────┐                      │      │  │
└─────────────────────────────────────┘                      │      │  │
                                                              │      │  │
         ┌────────────────────────────────────────────────────┘      │  │
         │                                                           │  │
         ▼                                                           │  │
┌─────────────────────────────────────────────────────────────┐      │  │
│                    SIGN IN PAGE                              │      │  │
│  /signin                                                     │      │  │
├─────────────────────────────────────────────────────────────┤      │  │
│  • Email                                                     │      │  │
│  • Password                                                  │      │  │
│  • Remember me (optional)                                    │      │  │
│  • [Sign In] ──────────────────┐                            │      │  │
│                                 │                            │      │  │
│  New customer? [Create Account] │                            │      │  │
└─────────────────────────────────┘                            │      │  │
                                  │                            │      │  │
         ┌────────────────────────┘                            │      │  │
         │                                                     │      │  │
         │ BACKEND: Validates credentials & returns user info │      │  │
         │         (role, tier, account status)               │      │  │
         │                                                     │      │  │
         ├─── 🔐 MFA Required? → /verify-mfa                  │      │  │
         │                                                     │      │  │
         └─── ✅ Success → Route by Role                      │      │  │
                  │                                            │      │  │
                  ├─── Tier 1 (Platform) → /platform          │      │  │
                  │     • super_admin                          │      │  │
                  │     • finance                              │      │  │
                  │     • compliance                           │      │  │
                  │     • support                              │      │  │
                  │     • engineer                             │      │  │
                  │                                            │      │  │
                  ├─── Tier 2 (Merchant) → /merchant ◄────────┘      │  │
                  │     • owner (DEFAULT for new signups)             │  │
                  │     • admin                                       │  │
                  │     • developer                                   │  │
                  │     • finance                                     │  │
                  │     • support                                     │  │
                  │                                                   │  │
                  └─── Tier 3 (Sub-Merchant) → /sub-merchant         │  │
                        • sub_merchant_admin                          │  │
                        • sub_merchant_viewer                         │  │
                                                                      │  │
         ┌────────────────────────────────────────────────────────────┘  │
         │                                                                │
         ▼                                                                │
┌─────────────────────────────────────────────────────────────┐           │
│          STATUS: INFO REQUESTED ⚠️                          │           │
│  /onboarding-status                                         │           │
├─────────────────────────────────────────────────────────────┤           │
│  Status: "Additional Information Needed"                    │           │
│                                                             │           │
│  📝 Requested Information:                                  │           │
│  • Field: Proof of Address                                  │           │
│    Reason: Document is not clear, please reupload          │           │
│                                                             │           │
│  [Upload Information] → Re-submit docs                      │           │
└─────────────────────────────────────────────────────────────┘           │
                                                                          │
         ┌────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│          STATUS: REJECTED ❌                                │
│  /onboarding-status                                         │
├─────────────────────────────────────────────────────────────┤
│  Status: "Application Declined"                             │
│                                                             │
│  Unfortunately, we are unable to approve your application   │
│  at this time.                                              │
│                                                             │
│  Reason: [Compliance reason displayed here]                 │
│                                                             │
│  📧 Contact: support@namibrapay.com for more information    │
└─────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────┐
│              MERCHANT DASHBOARD (After Approval)                     │
│  /merchant                                                           │
├─────────────────────────────────────────────────────────────────────┤
│  🏠 Overview                                                         │
│  • Transaction stats, balance, recent activity                      │
│                                                                      │
│  💳 Transactions                                                    │
│  • View all transactions, filter, export                            │
│                                                                      │
│  💰 Settlements                                                     │
│  • Payout history, reconciliation                                   │
│                                                                      │
│  👥 Sub-Merchants (if applicable)                                   │
│  • Manage sub-merchant accounts                                     │
│                                                                      │
│  🔧 API Management                                                  │
│  • API keys, webhooks, sandbox                                      │
│                                                                      │
│  👨‍💼 Team Management                                               │
│  • Invite members, assign roles                                     │
│                                                                      │
│  ⚙️  Settings                                                       │
│  • Business profile, bank account, preferences                      │
└─────────────────────────────────────────────────────────────────────┘
```

## Key States & Transitions

### Account Status States
1. **Pending** → Just submitted, in queue
2. **Under Review** → Compliance team actively reviewing
3. **Info Requested** → Need additional documents/clarification
4. **Approved** → Can sign in and access dashboard
5. **Rejected** → Application declined

### Sign In Behavior Based on Status

| Account Status | Can Sign In? | Redirects To |
|---------------|--------------|--------------|
| Pending       | ❌ No        | Shows error: "Account pending approval" |
| Under Review  | ❌ No        | Shows error: "Account under review" |
| Info Requested| ❌ No        | Shows error: "Additional info needed" |
| Approved      | ✅ Yes       | `/merchant` (Tier 2 Dashboard) |
| Rejected      | ❌ No        | Shows error: "Account not approved" |

### Email Notifications

1. **Application Submitted**
   - "We've received your application"
   - Link to `/onboarding-status`

2. **Additional Info Needed**
   - "We need more information"
   - Details of what's needed
   - Link to upload

3. **Application Approved** ✅
   - "Welcome to NamibraPay!"
   - Account credentials
   - Link to sign in

4. **Application Rejected** ❌
   - "Application decision"
   - Reason for rejection
   - Contact information

## Role-Based Routing Logic

```typescript
// In signin handler (src/app/(auth)/signin/page.tsx)

const role = res.user.role;

// Tier 1: Platform Staff
if (["super_admin", "finance", "compliance", "support", "engineer"].includes(role)) {
  router.push("/platform");
}
// Tier 3: Sub-Merchants
else if (["sub_merchant_admin", "sub_merchant_viewer"].includes(role)) {
  router.push("/sub-merchant");
}
// Tier 2: Merchants (DEFAULT)
else {
  router.push("/merchant");
}
```

## First-Time Setup (MD-004)

After first successful sign in to `/merchant`:

1. **Guided Setup Overlay**
   - Generate sandbox API keys
   - Configure test webhook
   - Trigger test transaction
   - View API documentation

2. **Onboarding Checklist**
   - ✅ Account approved
   - 🔄 Generate API keys
   - 🔄 Configure webhooks
   - 🔄 Make first transaction
   - 🔄 Invite team members

---

## Summary

**New Customer Sign Up:**
1. `/signup` → Complete 6-step form
2. `/onboarding-status` → Wait for approval (2 business days)
3. Email notification when approved
4. `/signin` → Enter credentials
5. **`/merchant`** → Merchant Dashboard (Tier 2)

**Returning Customer Sign In:**
1. `/signin` → Enter credentials
2. System checks role → Routes to appropriate dashboard
3. **Merchants** → `/merchant`
4. **Sub-Merchants** → `/sub-merchant`
5. **Platform Staff** → `/platform`

---

This flow is fully SRS-compliant (MD-001, MD-002, MD-004) ✅
