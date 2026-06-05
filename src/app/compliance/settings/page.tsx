"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings as SettingsIcon,
  Shield,
  Users,
  FileText,
  Mail,
  Save,
  Plus,
  Trash2,
  Edit2,
} from "lucide-react";
import DashboardLayout from "@/components/compliance/DashboardLayout";
import Card from "@/components/compliance/shared/Card";
import Badge from "@/components/compliance/shared/Badge";
import { RiskRule, AuthorityMatrix, UserRole, RiskBand } from "@/types/compliance";

// Mock data
const mockRiskRules: RiskRule[] = [
  {
    id: "RULE-001",
    name: "High Transaction Volume",
    factor: "transaction_volume",
    weight: 25,
    conditions: { threshold: 500000, period: "monthly" },
    isActive: true,
    version: 1,
  },
  {
    id: "RULE-002",
    name: "High-Risk Industry",
    factor: "industry_type",
    weight: 30,
    conditions: { industries: ["Money Services", "Crypto", "Gaming"] },
    isActive: true,
    version: 1,
  },
  {
    id: "RULE-003",
    name: "PEP Association",
    factor: "pep_status",
    weight: 40,
    conditions: { directOrIndirect: "both" },
    isActive: true,
    version: 1,
  },
  {
    id: "RULE-004",
    name: "Cross-Border Transactions",
    factor: "geography",
    weight: 20,
    conditions: { highRiskCountries: true },
    isActive: false,
    version: 1,
  },
];

const mockAuthorityMatrix: AuthorityMatrix[] = [
  {
    role: "CO",
    riskBand: "LOW",
    canApprove: true,
    canReject: true,
    requiresSecondAuth: false,
  },
  {
    role: "CO",
    riskBand: "MEDIUM",
    canApprove: true,
    canReject: true,
    requiresSecondAuth: false,
  },
  {
    role: "CO",
    riskBand: "HIGH",
    canApprove: false,
    canReject: false,
    requiresSecondAuth: true,
  },
  {
    role: "SENIOR_CO",
    riskBand: "LOW",
    canApprove: true,
    canReject: true,
    requiresSecondAuth: false,
  },
  {
    role: "SENIOR_CO",
    riskBand: "MEDIUM",
    canApprove: true,
    canReject: true,
    requiresSecondAuth: false,
  },
  {
    role: "SENIOR_CO",
    riskBand: "HIGH",
    canApprove: true,
    canReject: true,
    requiresSecondAuth: false,
  },
];

const mockTemplates = [
  {
    id: "TPL-001",
    name: "Request Additional Information",
    category: "Information Request",
    channel: "EMAIL",
    isActive: true,
  },
  {
    id: "TPL-002",
    name: "Application Approved",
    category: "Approval",
    channel: "BOTH",
    isActive: true,
  },
  {
    id: "TPL-003",
    name: "Application Rejected",
    category: "Rejection",
    channel: "EMAIL",
    isActive: true,
  },
  {
    id: "TPL-004",
    name: "Document Expiry Reminder",
    category: "Reminder",
    channel: "BOTH",
    isActive: true,
  },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"risk" | "authority" | "templates" | "system">("risk");

  const tabs = [
    { id: "risk", label: "Risk Rules", icon: Shield },
    { id: "authority", label: "Authority Matrix", icon: Users },
    { id: "templates", label: "Templates", icon: Mail },
    { id: "system", label: "System Settings", icon: SettingsIcon },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-1">Configure compliance system parameters</p>
          </div>
          <button className="px-4 py-2.5 bg-brand-teal text-white rounded-lg font-medium hover:bg-brand-teal/90 transition-colors flex items-center gap-2 shadow-sm text-sm">
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>

        {/* Tabs */}
        <Card padding="none">
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? "text-brand-teal border-b-2 border-brand-teal"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-6">
            {activeTab === "risk" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Risk Scoring Rules</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Configure factors and weights for automated risk assessment
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-brand-teal text-white rounded-lg font-medium hover:bg-brand-teal/90 transition-colors flex items-center gap-2 text-sm">
                    <Plus className="w-4 h-4" />
                    Add Rule
                  </button>
                </div>

                <div className="space-y-3">
                  {mockRiskRules.map((rule, index) => (
                    <motion.div
                      key={rule.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 border border-gray-200 rounded-xl hover:border-brand-teal/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium text-gray-900">{rule.name}</h4>
                            <Badge variant={rule.isActive ? "success" : "neutral"} size="sm">
                              {rule.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            Factor: <span className="font-medium">{rule.factor}</span> | Weight:{" "}
                            <span className="font-medium">{rule.weight}%</span>
                          </p>
                          <div className="flex items-center gap-2">
                            <button className="text-sm text-brand-teal hover:text-brand-teal/80 font-medium flex items-center gap-1">
                              <Edit2 className="w-3 h-3" />
                              Edit
                            </button>
                            <button className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1">
                              <Trash2 className="w-3 h-3" />
                              Delete
                            </button>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer ml-4">
                          <input
                            type="checkbox"
                            checked={rule.isActive}
                            className="sr-only peer"
                            readOnly
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-teal/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-teal"></div>
                        </label>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <p className="text-sm text-blue-900">
                    <strong>Note:</strong> Risk rules are applied cumulatively. Total weight should
                    equal 100%. Changes to risk rules will trigger re-assessment of all pending
                    applications.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "authority" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Authority Matrix</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Define approval and rejection authority by role and risk band
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Risk Band
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Can Approve
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Can Reject
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Second Auth
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {mockAuthorityMatrix.map((item, index) => (
                        <motion.tr
                          key={`${item.role}-${item.riskBand}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <span className="font-medium text-sm text-gray-900">
                              {item.role.replace(/_/g, " ")}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <Badge
                              variant={
                                item.riskBand === "LOW"
                                  ? "success"
                                  : item.riskBand === "MEDIUM"
                                  ? "warning"
                                  : "error"
                              }
                              size="sm"
                            >
                              {item.riskBand}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-center">
                            {item.canApprove ? (
                              <span className="text-green-600">✓</span>
                            ) : (
                              <span className="text-red-600">✗</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {item.canReject ? (
                              <span className="text-green-600">✓</span>
                            ) : (
                              <span className="text-red-600">✗</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {item.requiresSecondAuth ? (
                              <Badge variant="warning" size="sm">
                                Required
                              </Badge>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <p className="text-sm text-yellow-900">
                    <strong>Important:</strong> High-risk applications require Senior CO approval.
                    Dual authorization adds an additional approval layer for enhanced control.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "templates" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Communication Templates
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Manage email and SMS templates for applicant communication
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-brand-teal text-white rounded-lg font-medium hover:bg-brand-teal/90 transition-colors flex items-center gap-2 text-sm">
                    <Plus className="w-4 h-4" />
                    New Template
                  </button>
                </div>

                <div className="space-y-3">
                  {mockTemplates.map((template, index) => (
                    <motion.div
                      key={template.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 border border-gray-200 rounded-xl hover:border-brand-teal/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium text-gray-900">{template.name}</h4>
                            <Badge variant={template.isActive ? "success" : "neutral"} size="sm">
                              {template.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            Category: <span className="font-medium">{template.category}</span> |
                            Channel: <span className="font-medium">{template.channel}</span>
                          </p>
                          <div className="flex items-center gap-2">
                            <button className="text-sm text-brand-teal hover:text-brand-teal/80 font-medium flex items-center gap-1">
                              <Edit2 className="w-3 h-3" />
                              Edit
                            </button>
                            <button className="text-sm text-gray-600 hover:text-gray-900 font-medium">
                              Preview
                            </button>
                            <button className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1">
                              <Trash2 className="w-3 h-3" />
                              Delete
                            </button>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer ml-4">
                          <input
                            type="checkbox"
                            checked={template.isActive}
                            className="sr-only peer"
                            readOnly
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-teal/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-teal"></div>
                        </label>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "system" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">System Configuration</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    General system settings and integrations
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-xl">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Default SLA (Business Days)
                    </label>
                    <input
                      type="number"
                      defaultValue={3}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Standard turnaround time for application review
                    </p>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-xl">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Auto-Escalation Threshold (Hours)
                    </label>
                    <input
                      type="number"
                      defaultValue={24}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Automatically escalate applications after this period
                    </p>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-xl">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Screening Provider API Key
                    </label>
                    <input
                      type="password"
                      defaultValue="••••••••••••••••"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      API key for sanctions and PEP screening service
                    </p>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-900">
                        Enable Automatic Screening
                      </label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-teal/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-teal"></div>
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">
                      Automatically screen all new applications on submission
                    </p>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-900">
                        Enable Email Notifications
                      </label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-teal/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-teal"></div>
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">
                      Send email notifications for key events
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
