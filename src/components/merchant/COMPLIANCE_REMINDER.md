# Compliance Reminder Modal

## Overview
Smart modal system that reminds merchants to complete their compliance verification when their account is in test mode.

## Features

### 1. **Progressive Reminders**
The modal uses smart timing based on user behavior:
- **First login**: Shows immediately after 1.5 seconds
- **After 1st dismissal**: Shows again after 1 day
- **After 2nd dismissal**: Shows again after 2 days
- **After 3-4 dismissals**: Shows again after 3 days
- **After 5-7 dismissals**: Shows on every login (getting persistent)
- **After 7+ dismissals**: Shows every 12 hours (very persistent)

### 2. **Urgency Levels**
Visual treatment changes based on dismiss count:
- **0-2 dismissals**: Standard teal button, friendly messaging
- **3-4 dismissals**: Urgent tone, amber highlights
- **5+ dismissals**: High priority, red button, warning message

### 3. **Progress Tracking**
- Shows completion percentage if user has started (e.g., "You're 60% done")
- Visual progress bar animates on mount
- Encourages completion rather than starting over

### 4. **Benefits Display**
Always shows what they'll unlock:
- ✓ Accept live payments
- ✓ Higher transaction limits
- ✓ Full API access

### 5. **Smart Persistence**
- Stores dismissal history in localStorage
- Tracks: dismiss count, last dismissed time, last shown time
- Resets when compliance is submitted

## Usage

### In Merchant Layout
```tsx
import ComplianceReminderModal from "@/components/merchant/ComplianceReminderModal";
import { useComplianceReminder } from "@/hooks/use-compliance-reminder";

function YourComponent() {
  const complianceStatus = "incomplete"; // from user data
  const complianceProgress = 60; // 0-100 based on completed steps
  
  const { showModal, dismissCount, handleDismiss } = useComplianceReminder(complianceStatus);
  
  return (
    <>
      {/* Your content */}
      <ComplianceReminderModal
        isOpen={showModal}
        onClose={handleDismiss}
        businessName="Your Business Name"
        completionProgress={complianceProgress}
        dismissCount={dismissCount}
      />
    </>
  );
}
```

### Reset After Submission
```tsx
import { resetComplianceReminder } from "@/hooks/use-compliance-reminder";

// When user completes compliance
await submitComplianceForm();
resetComplianceReminder(); // Clear reminder state
```

## Implementation Details

### Files
- `ComplianceReminderModal.tsx` - Main modal component
- `use-compliance-reminder.ts` - Hook for modal logic and timing
- Integrated in `src/app/merchant/layout.tsx`
- Resets in `src/app/merchant/compliance/page.tsx`

### LocalStorage Key
`namibrapay_compliance_reminder`

Stores:
```json
{
  "dismissCount": 0,
  "lastDismissed": "2026-09-07T10:30:00.000Z",
  "lastShown": "2026-09-07T10:00:00.000Z"
}
```

## Design System Compliance
- Uses NamibraPay brand colors (teal, lavender, mint)
- Follows card/border/rounded design patterns
- Respects dark mode (uses semantic colors)
- Smooth motion/animations with framer-motion
- Responsive and mobile-friendly

## TODO: Connect to Real Data
Replace these placeholders:
1. `complianceStatus` - Get from user authentication/profile
2. `complianceProgress` - Calculate from completed compliance steps
3. `businessName` - Get from user profile
4. Store reminder state in backend (optional, instead of localStorage)

## Testing
To test different urgency levels:
1. Open browser DevTools → Application → LocalStorage
2. Find `namibrapay_compliance_reminder`
3. Edit `dismissCount` to test different states:
   - `0` = first time
   - `3` = urgent
   - `5` = high priority
4. Refresh page to see modal

Or use the reset function:
```tsx
import { resetComplianceReminder } from "@/hooks/use-compliance-reminder";
resetComplianceReminder(); // Start fresh
```
