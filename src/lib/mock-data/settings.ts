export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  twoFaEnabled: boolean;
  lastLogin: string;
  isCurrentUser: boolean;
}

export interface Permission {
  key: string;
  label: string;
  category: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isCustom: boolean;
  members: string[];
}

export const ALL_PERMISSIONS: Permission[] = [
  { key: "view_metrics",          label: "View Business Performance Metrics",   category: "Metrics"                },
  { key: "view_transactions",     label: "View Transactions",                   category: "Transactions"           },
  { key: "export_transactions",   label: "Export Transactions",                 category: "Transactions"           },
  { key: "manage_refunds",        label: "Manage Refunds & Disputes",           category: "Transactions"           },
  { key: "manage_customers",      label: "Manage & Update Customers",           category: "Customers"              },
  { key: "view_customers",        label: "View Customers",                      category: "Customers"              },
  { key: "create_customers",      label: "Create New Customers",                category: "Customers"              },
  { key: "view_customer_insights",label: "View Customer Insights",              category: "Customers"              },
  { key: "view_payouts",          label: "View Payouts",                        category: "Payouts"                },
  { key: "export_payouts",        label: "Export Payouts",                      category: "Payouts"                },
  { key: "create_transfers",      label: "Create and Manage Transfers",         category: "Transfers"              },
  { key: "view_transfers",        label: "View Transfers",                      category: "Transfers"              },
  { key: "export_transfers",      label: "Export Transfers",                    category: "Transfers"              },
  { key: "view_balance",          label: "View Balance History",                category: "Balance History"        },
  { key: "export_balance",        label: "Export Balance History",              category: "Balance History"        },
  { key: "create_payment_pages",  label: "Create and Manage Payment Pages",     category: "Payment Pages"          },
  { key: "view_payment_pages",    label: "View Payment Pages",                  category: "Payment Pages"          },
  { key: "create_products",       label: "Create and Manage Product Pages",     category: "Products"               },
  { key: "view_products",         label: "View Product Pages",                  category: "Products"               },
  { key: "create_invoices",       label: "Create and Manage Invoices",          category: "Invoices"               },
  { key: "view_invoices",         label: "View Invoices",                       category: "Invoices"               },
  { key: "create_subaccounts",    label: "Create and Manage Subaccounts & Splits", category: "Sub-accounts & Splits" },
  { key: "view_subaccounts",      label: "View Subaccounts & Splits",           category: "Sub-accounts & Splits"  },
  { key: "create_plans",          label: "Create and Manage Plans & Subscriptions", category: "Plans & Subscriptions" },
  { key: "view_plans",            label: "View Plans & Subscriptions",          category: "Plans & Subscriptions"  },
  { key: "edit_settings",         label: "Edit Business Settings & Preferences",category: "Settings"               },
  { key: "view_settings",         label: "View Business Settings & Preferences",category: "Settings"               },
  { key: "manage_api_keys",       label: "Manage API Keys & Webhooks",          category: "Settings"               },
  { key: "view_api_keys",         label: "View API Keys & Webhooks",            category: "Settings"               },
  { key: "manage_users",          label: "Manage and Invite Users",             category: "Settings"               },
  { key: "view_users",            label: "View Users",                          category: "Settings"               },
  { key: "invite_users",          label: "Invite Users",                        category: "Settings"               },
  { key: "manage_bank_accounts",  label: "Manage Bank Accounts Settings",       category: "Settings"               },
  { key: "view_bank_accounts",    label: "View Bank Accounts Settings",         category: "Settings"               },
  { key: "create_charges",        label: "Create and Manage Charges",           category: "Charges"                },
  { key: "refund_transfer",       label: "Pay with Transfer for Failed Refund", category: "Refunds"                },
  { key: "manage_terminals",      label: "Manage Terminals",                    category: "Terminals"              },
  { key: "manage_onboarding",     label: "Manage Onboarding",                   category: "Onboarding"             },
  { key: "manage_direct_debit",   label: "Manage Direct Debit",                 category: "Direct Debit"           },
  { key: "view_direct_debit",     label: "View Direct Debit",                   category: "Direct Debit"           },
  { key: "request_payout",        label: "Request Payout",                      category: "Request Payout"         },
];

const ALL_KEYS = ALL_PERMISSIONS.map((p) => p.key);

export const DEFAULT_ROLES: Role[] = [
  {
    id: "admin",
    name: "Admin",
    description: "This role grants users the permissions to manage everything on the dashboard",
    permissions: ALL_KEYS.filter((k) => k !== "manage_onboarding"),
    isCustom: false,
    members: ["Tyler Bright"],
  },
  {
    id: "operations",
    name: "Operations",
    description: "This role grants users the permissions to manage everything on the dashboard except to move money out",
    permissions: [
      "view_metrics","view_transactions","export_transactions","manage_refunds",
      "manage_customers","view_customers","create_customers","view_customer_insights",
      "view_payouts","export_payouts","view_transfers","view_balance","export_balance",
      "create_payment_pages","view_payment_pages","view_products","create_invoices",
      "view_invoices","create_subaccounts","view_subaccounts","create_plans","view_plans",
      "view_settings","view_api_keys","view_users","view_bank_accounts","refund_transfer",
      "manage_terminals","manage_direct_debit","view_direct_debit","request_payout",
    ],
    isCustom: false,
    members: [],
  },
  {
    id: "developer_support",
    name: "Developer Support",
    description: "This role grants users the permissions necessary for providing developer support",
    permissions: [
      "view_transactions","export_transactions","manage_customers","view_customers",
      "create_customers","create_payment_pages","view_payment_pages","view_products",
      "create_invoices","view_invoices","create_subaccounts","view_subaccounts",
      "view_plans","view_settings","manage_api_keys","view_api_keys",
    ],
    isCustom: false,
    members: [],
  },
  {
    id: "customer_support",
    name: "Customer Support",
    description: "This role grants users the permissions necessary for providing customer support",
    permissions: ["view_transactions","manage_refunds","view_customers","manage_terminals"],
    isCustom: false,
    members: [],
  },
  {
    id: "directdebit_admin",
    name: "Directdebit Admin",
    description: "This role grants users the permissions to manage everything related to direct debit",
    permissions: ["manage_api_keys","view_api_keys","manage_direct_debit","view_direct_debit"],
    isCustom: false,
    members: [],
  },
  {
    id: "signatory",
    name: "Signatory",
    description: "This role grants users the permissions necessary to sign legal documents",
    permissions: ["view_payouts","view_settings","view_users","view_bank_accounts"],
    isCustom: false,
    members: [],
  },
];

export const mockTeamMembers: TeamMember[] = [
  {
    id: "TM001",
    name: "Tyler Bright",
    email: "bright@namibra.io",
    role: "Business Owner",
    twoFaEnabled: false,
    lastLogin: "2026-05-17T13:57:00Z",
    isCurrentUser: true,
  },
];

export const MOCK_API_CONFIG = {
  testSecretKey: "sk_test_d76f2565cb9aab6293309d2c948d6087ee3fd2d0abcdef1234567890",
  testPublicKey: "pk_test_d76f2565cb9aab6293309d2c948d6087ee3fd2d0",
  testCallbackUrl: "",
  testWebhookUrl: "",
  ipWhitelist: [] as string[],
};
