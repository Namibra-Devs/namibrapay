# Compliance Dashboard Refactoring Plan

**Date**: June 5, 2026  
**Goal**: Improve code organization, component reusability, and reduce page file sizes

---

## 🎯 Objectives

1. ✅ **Centralize Mock Data** - Move all mock data to dedicated files
2. 🔄 **Extract Reusable Components** - Reduce code duplication
3. 📦 **Organize Code Structure** - Clear separation of concerns
4. 📉 **Reduce File Sizes** - Break down large page files
5. 🧩 **Improve Maintainability** - Easier to update and test

---

## 📁 New Directory Structure

```
src/
├── lib/
│   ├── compliance-hub-mock-data/       ← NEW: Centralized mock data
│   │   ├── index.ts                    ✅ Central export
│   │   ├── applications.ts             🔄 TODO
│   │   ├── approvals.ts                ✅ DONE
│   │   ├── audit.ts                    ✅ DONE
│   │   ├── cases.ts                    🔄 TODO
│   │   ├── communications.ts           🔄 TODO
│   │   ├── dashboard.ts                🔄 TODO
│   │   ├── documents.ts                ✅ DONE
│   │   ├── merchants.ts                🔄 TODO
│   │   ├── monitoring.ts               ✅ DONE
│   │   ├── profile.ts                  ✅ DONE
│   │   ├── reports.ts                  🔄 TODO
│   │   ├── screening.ts                🔄 TODO
│   │   └── settings.ts                 🔄 TODO
│   └── compliance-utils.ts             ← Existing utilities
│
├── components/
│   ├── compliance/
│   │   ├── shared/                     ← Existing shared components
│   │   │   ├── Badge.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Pagination.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   └── StatCard.tsx
│   │   │
│   │   ├── modals/                     ← NEW: Reusable modals
│   │   │   ├── AlertModal.tsx          🔄 TODO
│   │   │   ├── ConfirmModal.tsx        🔄 TODO
│   │   │   ├── SuccessToast.tsx        🔄 TODO
│   │   │   └── index.ts
│   │   │
│   │   ├── tables/                     ← NEW: Reusable table components
│   │   │   ├── DataTable.tsx           🔄 TODO
│   │   │   ├── ActionDropdown.tsx      🔄 TODO
│   │   │   └── index.ts
│   │   │
│   │   └── forms/                      ← NEW: Reusable form components
│   │       ├── FormField.tsx           🔄 TODO
│   │       ├── TextAreaField.tsx       🔄 TODO
│   │       └── index.ts
│   │
│   └── DashboardLayout.tsx             ← Existing layout
│
└── app/
    └── compliance/
        ├── documents/page.tsx          🔄 Refactor in progress
        ├── audit/page.tsx              🔄 Refactor in progress
        ├── monitoring/page.tsx         🔄 Refactor in progress
        └── ...
```

---

## 🔄 Refactoring Phases

### **Phase 1: Mock Data Migration** ✅ IN PROGRESS

**Goal**: Move all mock data out of page components into centralized files

**Status**:
- ✅ Created directory structure: `src/lib/compliance-hub-mock-data/`
- ✅ Created central export: `index.ts`
- ✅ **DONE**: `documents.ts` - Document mock data extracted
- ✅ **DONE**: `audit.ts` - Audit event mock data extracted
- ✅ **DONE**: `monitoring.ts` - Transaction alert mock data extracted
- ✅ **DONE**: `approvals.ts` - Pending approval mock data extracted
- ✅ **DONE**: `profile.ts` - User profile mock data extracted
- 🔄 **TODO**: Extract remaining page mock data

**Benefits**:
- ✅ Single source of truth for test data
- ✅ Easy to update mock data across all pages
- ✅ Cleaner page components (50-200 lines reduction per page)
- ✅ Better for backend integration (just replace imports)

---

### **Phase 2: Extract Reusable Modals** 🔄 NEXT

**Goal**: Create reusable modal components used across multiple pages

#### **Components to Extract**:

1. **SuccessToast** (`components/compliance/modals/SuccessToast.tsx`)
   - Used in: Documents, Audit, Monitoring, Approvals, Profile, Applications, etc.
   - Props: `message`, `isVisible`, `onClose`
   - Current: Copy-pasted in 10+ pages (30-40 lines each)
   - **Savings**: ~300-400 lines total

2. **AlertModal** (`components/compliance/modals/AlertModal.tsx`)
   - Used in: Documents, Applications, Monitoring, etc.
   - Props: `title`, `message`, `isVisible`, `onClose`
   - Current: Copy-pasted in 8+ pages (40-50 lines each)
   - **Savings**: ~320-400 lines total

3. **ConfirmModal** (`components/compliance/modals/ConfirmModal.tsx`)
   - Used in: Documents (verify/reject), Applications (approve/reject), etc.
   - Props: `title`, `message`, `confirmText`, `confirmVariant`, `onConfirm`, `onCancel`, `isProcessing`
   - Current: Multiple variations in 6+ pages (60-80 lines each)
   - **Savings**: ~360-480 lines total

4. **DetailModal** (`components/compliance/modals/DetailModal.tsx`)
   - Used in: Documents, Audit, Monitoring, etc.
   - Props: `title`, `children`, `isVisible`, `onClose`, `actions?`
   - Current: Similar structures in 5+ pages (80-100 lines each)
   - **Savings**: ~400-500 lines total

**Total Expected Savings**: ~1,400-1,800 lines of code

---

### **Phase 3: Extract Reusable Table Components** 🔄 PLANNED

**Goal**: Create reusable table/list components

#### **Components to Extract**:

1. **DataTable** (`components/compliance/tables/DataTable.tsx`)
   - Generic table with sorting, filtering, pagination
   - Props: `columns`, `data`, `onSort`, `onFilter`, `pagination`
   - Current: Custom tables in 10+ pages
   - **Savings**: ~500-800 lines total

2. **ActionDropdown** (`components/compliance/tables/ActionDropdown.tsx`)
   - Three-dot menu with contextual actions (already in Documents page!)
   - Props: `actions[]`, `itemId`, `position`
   - Current: Only in Documents page, should be used in 5+ pages
   - **Potential Adoption**: Applications, Merchants, Cases, Screening, etc.
   - **Savings**: ~200-300 lines total

3. **FilterBar** (`components/compliance/tables/FilterBar.tsx`)
   - Search + multiple filter dropdowns
   - Props: `searchPlaceholder`, `filters[]`, `onSearchChange`, `onFilterChange`
   - Current: Similar patterns in 8+ pages
   - **Savings**: ~400-600 lines total

**Total Expected Savings**: ~1,100-1,700 lines of code

---

### **Phase 4: Extract Reusable Form Components** 🔄 PLANNED

**Goal**: Create consistent form field components

#### **Components to Extract**:

1. **FormField** (`components/compliance/forms/FormField.tsx`)
   - Standard input with label, validation, error states
   - Props: `label`, `type`, `value`, `onChange`, `error`, `required`, `disabled`
   - Current: Repeated input styling in 10+ pages
   - **Savings**: ~300-500 lines total

2. **TextAreaField** (`components/compliance/forms/TextAreaField.tsx`)
   - Standard textarea with label, validation, error states
   - Props: `label`, `value`, `onChange`, `rows`, `placeholder`, `error`, `required`
   - Current: Copy-pasted in 8+ pages (rejection reasons, notes, etc.)
   - **Savings**: ~200-400 lines total

3. **SelectField** (Already exists as `components/ui/Select.tsx`) ✅
   - Keep using existing component

**Total Expected Savings**: ~500-900 lines of code

---

### **Phase 5: Page Refactoring** 🔄 PLANNED

**Goal**: Update all pages to use new components and mock data

#### **Priority Order**:

1. ✅ **Documents Page** (1,196 lines)
   - Replace inline mock data with `MOCK_DOCUMENTS` import
   - Use `SuccessToast`, `AlertModal`, `ConfirmModal` components
   - Keep `ActionDropdown` (already good!)
   - **Target**: Reduce to ~600-700 lines (~50% reduction)

2. 🔄 **Audit Page** (~800 lines)
   - Replace inline mock data with `MOCK_AUDIT_EVENTS` import
   - Use reusable modals
   - **Target**: Reduce to ~400-500 lines (~40% reduction)

3. 🔄 **Monitoring Page** (~900 lines)
   - Replace inline mock data with `MOCK_TRANSACTION_ALERTS` import
   - Use reusable modals
   - Extract alert card into component
   - **Target**: Reduce to ~500-600 lines (~40% reduction)

4. 🔄 **Profile Page** (~600 lines)
   - Replace inline mock data with imports from `profile.ts`
   - Use reusable form components
   - **Target**: Reduce to ~400-450 lines (~30% reduction)

5. 🔄 **Approvals Page** (~700 lines)
   - Replace inline mock data with `MOCK_PENDING_APPROVALS` import
   - Use reusable modals
   - **Target**: Reduce to ~400-500 lines (~35% reduction)

6. 🔄 **Applications, Merchants, Cases, etc.** (remaining pages)
   - Follow same pattern
   - Extract mock data
   - Use reusable components

---

## 📊 Expected Impact

### **File Size Reductions**:
| Page | Current | Target | Reduction |
|------|---------|--------|-----------|
| Documents | 1,196 lines | ~700 lines | ~40% |
| Audit | ~800 lines | ~500 lines | ~40% |
| Monitoring | ~900 lines | ~600 lines | ~35% |
| Profile | ~600 lines | ~450 lines | ~25% |
| Approvals | ~700 lines | ~500 lines | ~30% |
| **Average** | **~800 lines** | **~550 lines** | **~35%** |

### **Code Reusability**:
- ✅ **4 reusable modals** → used in 30+ places
- ✅ **3 reusable table components** → used in 15+ places
- ✅ **2 reusable form components** → used in 20+ places
- ✅ **Total**: ~3,000-4,000 lines of code eliminated through reuse

### **Maintainability**:
- ✅ Change modal style once → affects all pages
- ✅ Update mock data once → affects all pages
- ✅ Add new table feature once → available everywhere
- ✅ Fix bug once → fixed everywhere

---

## 🚀 Implementation Steps

### **Step 1: Complete Mock Data Migration** (1-2 hours)
- [ ] Extract applications page mock data
- [ ] Extract merchants page mock data
- [ ] Extract communications page mock data
- [ ] Extract cases page mock data
- [ ] Extract screening page mock data
- [ ] Extract reports page mock data
- [ ] Extract settings page mock data
- [ ] Extract dashboard page mock data

### **Step 2: Create Reusable Modal Components** (2-3 hours)
- [ ] Create `SuccessToast.tsx`
- [ ] Create `AlertModal.tsx`
- [ ] Create `ConfirmModal.tsx`
- [ ] Create `DetailModal.tsx`
- [ ] Update Storybook examples (optional)

### **Step 3: Create Reusable Table Components** (2-3 hours)
- [ ] Create `DataTable.tsx`
- [ ] Extract `ActionDropdown.tsx` from Documents page
- [ ] Create `FilterBar.tsx`
- [ ] Update Storybook examples (optional)

### **Step 4: Create Reusable Form Components** (1-2 hours)
- [ ] Create `FormField.tsx`
- [ ] Create `TextAreaField.tsx`
- [ ] Update Storybook examples (optional)

### **Step 5: Refactor Pages** (5-8 hours)
- [ ] Refactor Documents page
- [ ] Refactor Audit page
- [ ] Refactor Monitoring page
- [ ] Refactor Profile page
- [ ] Refactor Approvals page
- [ ] Refactor Applications pages
- [ ] Refactor Merchants pages
- [ ] Refactor remaining pages

### **Step 6: Testing & Validation** (2-3 hours)
- [ ] Test all pages for functionality
- [ ] Verify zero TypeScript errors
- [ ] Check all modals work correctly
- [ ] Verify mock data imports work
- [ ] Test responsive layouts

---

## ✅ Success Criteria

1. ✅ All mock data centralized in `src/lib/compliance-hub-mock-data/`
2. ✅ At least 4 reusable modal components created
3. ✅ At least 3 reusable table components created
4. ✅ Average page size reduced by 30-40%
5. ✅ Zero TypeScript errors after refactoring
6. ✅ All functionality preserved (no regressions)
7. ✅ Improved code maintainability and DRY principles

---

## 📝 Notes

- **Backwards Compatibility**: All refactoring maintains existing functionality
- **Testing**: Manual testing after each phase to ensure no regressions
- **Documentation**: Update component documentation as we create reusable components
- **Backend Integration**: Easier after refactoring (just replace mock data imports with API calls)

---

**Status**: 🔄 Phase 1 In Progress (Mock Data Migration - 40% Complete)  
**Next Step**: Complete remaining mock data files, then start Phase 2 (Extract Modals)

