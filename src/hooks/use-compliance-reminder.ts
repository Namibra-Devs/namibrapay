"use client";

import { useState, useEffect } from "react";

interface ComplianceReminderState {
  dismissCount: number;
  lastDismissed: string | null;
  lastShown: string | null;
}

const STORAGE_KEY = "namibrapay_compliance_reminder";

export function useComplianceReminder(complianceStatus: "incomplete" | "pending" | "complete") {
  const [showModal, setShowModal] = useState(false);
  const [dismissCount, setDismissCount] = useState(0);

  useEffect(() => {
    // Don't show if compliance is complete
    if (complianceStatus === "complete") {
      return;
    }

    // Get stored state
    const stored = localStorage.getItem(STORAGE_KEY);
    const state: ComplianceReminderState = stored
      ? JSON.parse(stored)
      : { dismissCount: 0, lastDismissed: null, lastShown: null };

    setDismissCount(state.dismissCount);

    // Determine if we should show the modal
    const shouldShow = determineIfShouldShow(state);

    if (shouldShow) {
      // Show modal after a short delay
      const timer = setTimeout(() => {
        setShowModal(true);
        // Update last shown
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ ...state, lastShown: new Date().toISOString() })
        );
      }, 1500); // 1.5 second delay after page load

      return () => clearTimeout(timer);
    }
  }, [complianceStatus]);

  const handleDismiss = () => {
    setShowModal(false);

    const stored = localStorage.getItem(STORAGE_KEY);
    const state: ComplianceReminderState = stored
      ? JSON.parse(stored)
      : { dismissCount: 0, lastDismissed: null, lastShown: null };

    const newState: ComplianceReminderState = {
      dismissCount: state.dismissCount + 1,
      lastDismissed: new Date().toISOString(),
      lastShown: state.lastShown,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    setDismissCount(newState.dismissCount);
  };

  return {
    showModal,
    dismissCount,
    handleDismiss,
  };
}

function determineIfShouldShow(state: ComplianceReminderState): boolean {
  const now = new Date();

  // First time - show immediately
  if (state.dismissCount === 0 && !state.lastShown) {
    return true;
  }

  // If never dismissed but was shown, don't show again this session
  if (state.dismissCount === 0 && state.lastShown) {
    return false;
  }

  const lastDismissed = state.lastDismissed ? new Date(state.lastDismissed) : null;

  if (!lastDismissed) {
    return false;
  }

  const hoursSinceLastDismiss = (now.getTime() - lastDismissed.getTime()) / (1000 * 60 * 60);
  const daysSinceLastDismiss = hoursSinceLastDismiss / 24;

  // Progressive reminder frequency based on dismiss count
  if (state.dismissCount === 1) {
    // Show again after 1 day
    return daysSinceLastDismiss >= 1;
  } else if (state.dismissCount === 2) {
    // Show again after 2 days
    return daysSinceLastDismiss >= 2;
  } else if (state.dismissCount <= 4) {
    // Show again after 3 days
    return daysSinceLastDismiss >= 3;
  } else if (state.dismissCount <= 7) {
    // Show every login after 5th dismissal
    return true;
  } else {
    // After 7 dismissals, show every 12 hours (getting persistent)
    return hoursSinceLastDismiss >= 12;
  }
}

// Utility to reset the reminder state (for testing or when compliance is submitted)
export function resetComplianceReminder() {
  localStorage.removeItem(STORAGE_KEY);
}
