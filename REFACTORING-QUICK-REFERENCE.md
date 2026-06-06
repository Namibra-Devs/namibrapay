# Refactoring Quick Reference Guide

Quick guide for using the new organized structure.

---

## 📦 Import Mock Data

```typescript
// Documents
import { MOCK_DOCUMENTS } from "@/lib/compliance-hub-mock-data";

// Audit
import { MOCK_AUDIT_EVENTS } from "@/lib/compliance-hub-mock-data";

// Monitoring
import { MOCK_TRANSACTION_ALERTS } from "@/lib/compliance-hub-mock-data";

// Approvals
import { MOCK_PENDING_APPROVALS } from "@/lib/compliance-hub-mock-data";

// Profile
import {
  MOCK_USER_PROFILE,
  MOCK_NOTIFICATION_PREFERENCES,
  MOCK_ACTIVE_SESSIONS
} from "@/lib/compliance-hub-mock-data";

// Or import everything:
import * as MockData from "@/lib/compliance-hub-mock-data";
```

---

## 🎨 Use Reusable Modals

```typescript
import { SuccessToast, AlertModal, ConfirmModal } from "@/components/compliance/modals";
```

### **Success Toast**

```tsx
// State
const [showToast, setShowToast] = useState(false);
const [toastMessage, setToastMessage] = useState("");

// Helper function
const showSuccess = (message: string) => {
  setToastMessage(message);
  setShowToast(true);
};

// Component
<SuccessToast
  message={toastMessage}
  isVisible={showToast}
  onClose={() => setShowToast(false)}
/>

// Trigger
showSuccess("Document verified successfully!");
```

### **Alert Modal**

```tsx
// State
const [showAlert, setShowAlert] = useState(false);
const [alertMessage, setAlertMessage] = useState("");

// Helper function
const showAlertMessage = (message: string) => {
  setAlertMessage(message);
  setShowAlert(true);
};

// Component
<AlertModal
  title="Error"
  message={alertMessage}
  variant="error"  // or "warning" or "info"
  isVisible={showAlert}
  onClose={() => setShowAlert(false)}
/>

// Trigger
showAlertMessage("Please provide a reason");
```

### **Confirm Modal**

```tsx
// State
const [showConfirm, setShowConfirm] = useState(false);
const [isProcessing, setIsProcessing] = useState(false);

// Handler
const handleConfirm = async () => {
  setShowConfirm(false);
  setIsProcessing(true);
  try {
    await someAsyncOperation();
    showSuccess("Operation completed!");
  } catch (error) {
    showAlertMessage("Operation failed");
  } finally {
    setIsProcessing(false);
  }
};

// Component
<ConfirmModal
  title="Verify Document"
  message="Are you sure you want to verify this document?"
  confirmText="Verify"
  confirmVariant="success"  // "success" | "danger" | "warning" | "primary"
  isVisible={showConfirm}
  isProcessing={isProcessing}
  onConfirm={handleConfirm}
  onCancel={() => setShowConfirm(false)}
/>

// Trigger
setShowConfirm(true);
```

---

## 🔄 Before & After Examples

### **Before (Old Way)**

```tsx
// In page component (Documents):
const initialDocuments: Document[] = [
  {
    id: "DOC-001",
    type: "NATIONAL_ID",
    // ... 100+ lines of mock data
  },
  // ... more documents
];

const [documents, setDocuments] = useState<Document[]>(initialDocuments);

// Custom success toast (30-40 lines)
<AnimatePresence>
  {showSuccessToast && (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="fixed top-4 right-4 z-60 bg-green-600 text-white..."
    >
      {/* ... */}
    </motion.div>
  )}
</AnimatePresence>

// Custom alert modal (40-50 lines)
<AnimatePresence>
  {showAlertModal && (
    <motion.div className="fixed inset-0 bg-black/50...">
      {/* ... */}
    </motion.div>
  )}
</AnimatePresence>
```

**Total**: ~170-190 lines of repetitive code

---

### **After (New Way)**

```tsx
// Clean imports
import { MOCK_DOCUMENTS } from "@/lib/compliance-hub-mock-data";
import { SuccessToast, AlertModal } from "@/components/compliance/modals";

const [documents, setDocuments] = useState(MOCK_DOCUMENTS);

// Reusable components (1-2 lines each)
<SuccessToast
  message={successMessage}
  isVisible={showToast}
  onClose={() => setShowToast(false)}
/>

<AlertModal
  message={alertMessage}
  isVisible={showAlert}
  onClose={() => setShowAlert(false)}
/>
```

**Total**: ~10-15 lines

**Savings**: ~160-175 lines per page! 🎉

---

## 📝 Common Patterns

### **Pattern 1: Simple Success Notification**

```tsx
const handleAction = async () => {
  setIsProcessing(true);
  try {
    await performAction();
    showSuccess("Action completed successfully!");
  } catch (error) {
    showAlertMessage("Action failed");
  } finally {
    setIsProcessing(false);
  }
};
```

### **Pattern 2: Confirm Before Action**

```tsx
// Step 1: Show confirm modal
const handleDeleteClick = (item: Item) => {
  setDeletingItem(item);
  setShowDeleteConfirm(true);
};

// Step 2: Handle confirmation
const handleDeleteConfirm = async () => {
  setShowDeleteConfirm(false);
  setIsProcessing(true);
  try {
    await deleteItem(deletingItem.id);
    showSuccess("Item deleted successfully!");
    // Update state
  } catch (error) {
    showAlertMessage("Failed to delete item");
  } finally {
    setIsProcessing(false);
    setDeletingItem(null);
  }
};

// Components
<ConfirmModal
  title="Delete Item"
  message={`Are you sure you want to delete ${deletingItem?.name}?`}
  confirmText="Delete"
  confirmVariant="danger"
  isVisible={showDeleteConfirm}
  isProcessing={isProcessing}
  onConfirm={handleDeleteConfirm}
  onCancel={() => setShowDeleteConfirm(false)}
/>
```

### **Pattern 3: Validation Before Confirm**

```tsx
const handleSubmit = () => {
  // Validate first
  if (!formData.reason.trim()) {
    showAlertMessage("Please provide a reason");
    return;
  }
  
  // Then confirm
  setShowConfirm(true);
};
```

---

## 🎯 Modal Variant Guide

### **SuccessToast**
- ✅ Green color
- ✅ Use for: successful operations, confirmations, completions

### **AlertModal Variants**

| Variant | Color | Use For |
|---------|-------|---------|
| `warning` | Yellow | Warnings, cautions, non-critical issues |
| `error` | Red | Errors, failures, validation issues |
| `info` | Blue | Information, notices, tips |

### **ConfirmModal Variants**

| Variant | Color | Use For |
|---------|-------|---------|
| `success` | Green | Approvals, verifications, positive actions |
| `danger` | Red | Deletions, rejections, destructive actions |
| `warning` | Orange | Re-uploads, escalations, caution actions |
| `primary` | Teal | General confirmations, neutral actions |

---

## 📂 File Locations

```
src/
├── lib/compliance-hub-mock-data/
│   ├── index.ts              (import from here)
│   ├── documents.ts
│   ├── audit.ts
│   ├── monitoring.ts
│   ├── approvals.ts
│   └── profile.ts
│
└── components/compliance/modals/
    ├── index.ts              (import from here)
    ├── SuccessToast.tsx
    ├── AlertModal.tsx
    └── ConfirmModal.tsx
```

---

## ✅ Checklist for Refactoring a Page

1. [ ] Replace inline mock data with import from `compliance-hub-mock-data`
2. [ ] Replace custom success toast with `<SuccessToast />`
3. [ ] Replace custom alert modal with `<AlertModal />`
4. [ ] Replace custom confirm modals with `<ConfirmModal />`
5. [ ] Update state management (remove unnecessary modal state)
6. [ ] Test all functionality works
7. [ ] Run diagnostics (check for TypeScript errors)
8. [ ] Measure line reduction

---

## 🚀 Quick Start for New Pages

```tsx
"use client";

import { useState } from "react";
import { SuccessToast, AlertModal, ConfirmModal } from "@/components/compliance/modals";

export default function MyPage() {
  // Toast state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  
  // Alert state
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  
  // Confirm state
  const [showConfirm, setShowConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Helper functions
  const showSuccess = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
  };
  
  const showAlertMessage = (msg: string) => {
    setAlertMessage(msg);
    setShowAlert(true);
  };
  
  return (
    <>
      {/* Your page content */}
      
      {/* Modals */}
      <SuccessToast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
      
      <AlertModal
        message={alertMessage}
        isVisible={showAlert}
        onClose={() => setShowAlert(false)}
      />
      
      <ConfirmModal
        title="Confirm Action"
        message="Are you sure?"
        isVisible={showConfirm}
        isProcessing={isProcessing}
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
```

---

**Quick Reference Complete!** 🎉

For full documentation, see:
- `REFACTORING-PLAN.md` - Complete strategy
- `REFACTORING-SUMMARY.md` - Detailed summary
- `REFACTORING-PROGRESS.md` - Progress tracking

