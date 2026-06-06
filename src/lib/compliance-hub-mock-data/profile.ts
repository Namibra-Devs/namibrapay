/**
 * User Profile Page Mock Data
 */

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  department: string;
}

export interface NotificationPreferences {
  emailApplicationUpdates: boolean;
  emailHighRiskAlerts: boolean;
  emailSystemAlerts: boolean;
  smsUrgentAlerts: boolean;
  smsSecurityAlerts: boolean;
  inAppNotifications: boolean;
}

export interface ActiveSession {
  id: string;
  device: string;
  location: string;
  ipAddress: string;
  lastActive: string;
  current: boolean;
}

export const MOCK_USER_PROFILE: UserProfile = {
  firstName: "Jane",
  lastName: "Mensah",
  email: "jane.mensah@namibrapay.com",
  phone: "+233 24 123 4567",
  role: "Compliance Officer",
  department: "Risk & Compliance",
};

export const MOCK_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  emailApplicationUpdates: true,
  emailHighRiskAlerts: true,
  emailSystemAlerts: false,
  smsUrgentAlerts: true,
  smsSecurityAlerts: true,
  inAppNotifications: true,
};

export const MOCK_ACTIVE_SESSIONS: ActiveSession[] = [
  {
    id: "SESSION-001",
    device: "Chrome on Windows",
    location: "Accra, Ghana",
    ipAddress: "197.234.56.78",
    lastActive: "2024-02-21T15:30:00Z",
    current: true,
  },
  {
    id: "SESSION-002",
    device: "Safari on iPhone",
    location: "Accra, Ghana",
    ipAddress: "197.234.56.92",
    lastActive: "2024-02-21T08:15:00Z",
    current: false,
  },
];
