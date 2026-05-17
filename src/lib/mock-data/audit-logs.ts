export type AuditCategory =
  | "auth"
  | "financial"
  | "customer"
  | "team"
  | "settings"
  | "content"
  | "dispute";

export interface AuditLog {
  id: string;
  user: string;
  email: string;
  role: string;
  ipAddress: string;
  action: string;
  category: AuditCategory;
  createdAt: string;
}

export const AUDIT_ACTIONS = [
  "Added A Customer",
  "Created A New Invoice",
  "Updated An Invoice",
  "Sent Notification For An Invoice",
  "Generated Pdf For An Invoice",
  "Archived An Invoice",
  "Marked An Invoice As Paid",
  "Created A New Plan",
  "Deleted A Plan",
  "Updated A Plan",
  "Refunded A Customer",
  "Created A New Role",
  "Updated A Role",
  "Deleted A Role",
  "Created A New Subaccount",
  "Updated A Subaccount",
  "Deleted A Subaccount",
  "Exported A Transfers Csv",
  "Initiated A Transfer",
  "Added A New Transfer Recipient",
  "Deleted A New Transfer Recipient",
  "Updated A New Transfer Recipient",
  "Added A New Payment Page",
  "Updated A Payment Page",
  "Generated A Dedicated Nuban",
  "Deactivated A Dedicated Nuban",
  "Exported A Transactions Csv",
  "Resolved A Dispute",
  "Commented On A Dispute",
  "Deleted A Dispute",
  "Uploaded Evidence For A Dispute",
  "Exported A Disputes Csv",
  "Added A New Settlement Account",
  "Updated Webhook Url",
  "Enabled Currency",
  "Disabled Currency",
  "Removed Team Member",
  "Invited Team Member",
  "Enabled International Payments",
  "Requested International Payments",
  "Changed Settlement Schedule",
  "Exported A Payout Csv",
  "Upgraded This Business",
  "Logged In",
  "Reset Password",
  "Updated Profile Information",
  "Switched Display State",
  "Enabled Apple Pay",
  "Disabled Apple Pay",
  "Enabled Paypal",
  "Disabled Paypal",
  "Created A Split Group",
  "Updated A Split Group",
  "Exported Balances To Email",
  "Uploaded Media To A Product",
  "Added Products To A Payment Page",
  "Migrated A Payment Page",
  "Created A Product",
  "Captured A Preauthorization",
  "Released A Preauthorization",
  "Charged Customer By Authorization Code",
  "Updated Business Profile",
  "Updated Integration Contacts",
] as const;

const CATEGORY_MAP: Record<string, AuditCategory> = {
  "Logged In": "auth",
  "Reset Password": "auth",
  "Updated Profile Information": "auth",
  "Switched Display State": "auth",
  "Initiated A Transfer": "financial",
  "Exported A Transfers Csv": "financial",
  "Exported A Payout Csv": "financial",
  "Exported A Transactions Csv": "financial",
  "Captured A Preauthorization": "financial",
  "Released A Preauthorization": "financial",
  "Charged Customer By Authorization Code": "financial",
  "Changed Settlement Schedule": "financial",
  "Added A New Settlement Account": "financial",
  "Exported Balances To Email": "financial",
  "Added A Customer": "customer",
  "Refunded A Customer": "customer",
  "Invited Team Member": "team",
  "Removed Team Member": "team",
  "Created A New Role": "team",
  "Updated A Role": "team",
  "Deleted A Role": "team",
  "Updated Business Profile": "settings",
  "Updated Integration Contacts": "settings",
  "Updated Webhook Url": "settings",
  "Enabled Currency": "settings",
  "Disabled Currency": "settings",
  "Enabled International Payments": "settings",
  "Requested International Payments": "settings",
  "Upgraded This Business": "settings",
  "Enabled Apple Pay": "settings",
  "Disabled Apple Pay": "settings",
  "Enabled Paypal": "settings",
  "Disabled Paypal": "settings",
  "Generated A Dedicated Nuban": "settings",
  "Deactivated A Dedicated Nuban": "settings",
  "Resolved A Dispute": "dispute",
  "Commented On A Dispute": "dispute",
  "Deleted A Dispute": "dispute",
  "Uploaded Evidence For A Dispute": "dispute",
  "Exported A Disputes Csv": "dispute",
};

function getCategory(action: string): AuditCategory {
  return CATEGORY_MAP[action] ?? "content";
}

const MOCK_USERS = [
  { user: "Tyler Bright",  email: "bright@namibra.io",    role: "Super Admin", ipAddress: "74.244.119.155"  },
  { user: "Kwame Asante",  email: "k.asante@namibra.io",  role: "Manager",     ipAddress: "197.234.88.42"   },
  { user: "Abena Mensah",  email: "a.mensah@namibra.io",  role: "Developer",   ipAddress: "105.112.45.201"  },
];

export const MOCK_AUDIT_USERS = MOCK_USERS.map((u) => u.user);

function makeLog(
  id: string,
  userIdx: number,
  action: string,
  daysAgo: number,
  hoursOffset = 0,
  minutesOffset = 0,
): AuditLog {
  const date = new Date("2026-05-17T12:00:00Z");
  date.setDate(date.getDate() - daysAgo);
  date.setHours(date.getHours() - hoursOffset);
  date.setMinutes(date.getMinutes() - minutesOffset);
  return {
    id,
    ...MOCK_USERS[userIdx],
    action,
    category: getCategory(action),
    createdAt: date.toISOString(),
  };
}

export const mockAuditLogs: AuditLog[] = [
  makeLog("AL001", 0, "Updated Business Profile",              0,  0, 27),
  makeLog("AL002", 0, "Logged In",                             0,  1, 15),
  makeLog("AL003", 1, "Invited Team Member",                   0,  2,  0),
  makeLog("AL004", 0, "Initiated A Transfer",                  1,  3,  0),
  makeLog("AL005", 2, "Updated Webhook Url",                   1,  5,  0),
  makeLog("AL006", 0, "Updated Integration Contacts",          3,  0,  0),
  makeLog("AL007", 1, "Added A Customer",                      3,  2, 30),
  makeLog("AL008", 0, "Exported A Transactions Csv",           4,  0,  0),
  makeLog("AL009", 2, "Created A New Plan",                    5,  1,  0),
  makeLog("AL010", 0, "Captured A Preauthorization",           6,  4, 10),
  makeLog("AL011", 1, "Resolved A Dispute",                    7,  0,  0),
  makeLog("AL012", 0, "Updated Business Profile",              8,  2,  0),
  makeLog("AL013", 2, "Logged In",                             8,  3, 45),
  makeLog("AL014", 0, "Changed Settlement Schedule",           9,  1,  0),
  makeLog("AL015", 1, "Refunded A Customer",                  10,  0,  0),
];
