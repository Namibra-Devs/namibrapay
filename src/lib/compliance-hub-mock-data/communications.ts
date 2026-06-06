/**
 * Communications Page Mock Data
 * 
 * This file contains mock data for the communications center.
 */

export interface MessageType {
  id: string;
  entityId: string;
  entityName: string;
  channel: "EMAIL" | "SMS";
  subject: string | null;
  template: string;
  status: "DELIVERED" | "SENT" | "FAILED";
  sentAt: string;
  deliveredAt: string | null;
}

export interface Template {
  id: string;
  name: string;
  channel: "EMAIL" | "SMS" | "BOTH";
  category: string;
  body: string;
}

export const MOCK_MESSAGES: MessageType[] = [
  {
    id: "MSG-001",
    entityId: "APP-2024-001",
    entityName: "Kwame Tech Solutions Ltd",
    channel: "EMAIL",
    subject: "Additional Information Required",
    template: "Request for Information",
    status: "DELIVERED",
    sentAt: "2026-06-03T10:30:00Z",
    deliveredAt: "2026-06-03T10:31:00Z",
  },
  {
    id: "MSG-002",
    entityId: "APP-2024-002",
    entityName: "Sarah Osei",
    channel: "SMS",
    subject: null,
    template: "Application Received",
    status: "DELIVERED",
    sentAt: "2026-06-01T09:16:00Z",
    deliveredAt: "2026-06-01T09:16:30Z",
  },
  {
    id: "MSG-003",
    entityId: "APP-2024-045",
    entityName: "Global Traders Ltd",
    channel: "EMAIL",
    subject: "Application Approved",
    template: "Approval Notification",
    status: "DELIVERED",
    sentAt: "2026-06-02T16:45:00Z",
    deliveredAt: "2026-06-02T16:45:12Z",
  },
  {
    id: "MSG-004",
    entityId: "APP-2024-038",
    entityName: "Bright Future Schools",
    channel: "EMAIL",
    subject: "Application Status Update",
    template: "Rejection Notification",
    status: "FAILED",
    sentAt: "2026-06-02T14:20:00Z",
    deliveredAt: null,
  },
];

export const MOCK_TEMPLATES: Template[] = [
  { 
    id: "TPL-001", 
    name: "Application Received", 
    channel: "BOTH", 
    category: "Onboarding",
    body: "Dear {{applicant_name}},\n\nYour application ({{application_id}}) has been received and is under review. We will notify you of any updates.\n\nThank you for your patience.\n\nNamibraPay Compliance Team"
  },
  { 
    id: "TPL-002", 
    name: "Request for Information", 
    channel: "EMAIL", 
    category: "Review",
    body: "Dear {{applicant_name}},\n\nWe require additional information for application {{application_id}}:\n\n{{missing_documents}}\n\nPlease submit these documents within 5 business days.\n\nBest regards,\nNamibraPay Compliance Team"
  },
  { 
    id: "TPL-003", 
    name: "Approval Notification", 
    channel: "BOTH", 
    category: "Decision",
    body: "Dear {{applicant_name}},\n\nCongratulations! Your application ({{application_id}}) has been approved.\n\nYou can now proceed with onboarding.\n\nWelcome to NamibraPay!"
  },
  { 
    id: "TPL-004", 
    name: "Rejection Notification", 
    channel: "EMAIL", 
    category: "Decision",
    body: "Dear {{applicant_name}},\n\nAfter careful review, we regret to inform you that application {{application_id}} has been declined.\n\nReason: {{decision_reason}}\n\nYou may reapply after 90 days.\n\nNamibraPay Compliance Team"
  },
  { 
    id: "TPL-005", 
    name: "Document Expiry Reminder", 
    channel: "SMS", 
    category: "Maintenance",
    body: "Hi {{applicant_name}}, your documents for account {{application_id}} are expiring soon. Please update them to avoid service interruption. - NamibraPay"
  },
  { 
    id: "TPL-006", 
    name: "Periodic Review Request", 
    channel: "EMAIL", 
    category: "Maintenance",
    body: "Dear {{applicant_name}},\n\nAs part of our periodic KYC review for account {{application_id}}, please submit updated documentation.\n\nRequired documents:\n{{missing_documents}}\n\nThank you for your cooperation.\n\nNamibraPay Compliance Team"
  },
];
