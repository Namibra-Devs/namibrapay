"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  MessageSquare,
  Send,
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Plus,
} from "lucide-react";
import DashboardLayout from "@/components/compliance/DashboardLayout";
import Select from "@/components/ui/Select";
import { cn, formatDate } from "@/lib/compliance-utils";

// Mock data
const messages = [
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

const templates = [
  { id: "TPL-001", name: "Application Received", channel: "BOTH", category: "Onboarding" },
  { id: "TPL-002", name: "Request for Information", channel: "EMAIL", category: "Review" },
  { id: "TPL-003", name: "Approval Notification", channel: "BOTH", category: "Decision" },
  { id: "TPL-004", name: "Rejection Notification", channel: "EMAIL", category: "Decision" },
  { id: "TPL-005", name: "Document Expiry Reminder", channel: "SMS", category: "Maintenance" },
  { id: "TPL-006", name: "Periodic Review Request", channel: "EMAIL", category: "Maintenance" },
];

export default function CommunicationsCenter() {
  const [activeView, setActiveView] = useState<"compose" | "history" | "templates">("history");
  const [selectedChannel, setSelectedChannel] = useState<"EMAIL" | "SMS" | "BOTH">("EMAIL");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMessages = messages.filter(
    (msg) =>
      msg.entityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (msg.subject && msg.subject.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-brand-navy">Communications Center</h1>
            <p className="text-gray-500 mt-1">
              Send notices and manage communications with applicants
            </p>
          </div>
          <button
            onClick={() => setActiveView("compose")}
            className="flex items-center gap-2 px-4 py-2 bg-brand-teal text-white text-sm font-medium rounded-lg hover:bg-brand-teal/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Compose Message
          </button>
        </div>

        {/* View Tabs */}
        <div className="flex gap-4 border-b border-gray-100">
          <button
            onClick={() => setActiveView("compose")}
            className={cn(
              "px-4 py-3 border-b-2 font-medium transition-colors text-sm",
              activeView === "compose"
                ? "border-brand-teal text-brand-teal"
                : "border-transparent text-gray-500 hover:text-gray-700"
            )}
          >
            Compose
          </button>
          <button
            onClick={() => setActiveView("history")}
            className={cn(
              "px-4 py-3 border-b-2 font-medium transition-colors text-sm",
              activeView === "history"
                ? "border-brand-teal text-brand-teal"
                : "border-transparent text-gray-500 hover:text-gray-700"
            )}
          >
            Message History
          </button>
          <button
            onClick={() => setActiveView("templates")}
            className={cn(
              "px-4 py-3 border-b-2 font-medium transition-colors text-sm",
              activeView === "templates"
                ? "border-brand-teal text-brand-teal"
                : "border-transparent text-gray-500 hover:text-gray-700"
            )}
          >
            Templates
          </button>
        </div>

        {/* Compose View */}
        {activeView === "compose" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2x border border-gray-200/70 p-6 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.45)] hover:shadow-[0_30px_60px_-40px_rgba(15,23,42,0.55)]"
          >
            <div className="space-y-6">
              {/* Channel Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Channel
                </label>
                <div className="flex gap-4">
                  {(["EMAIL", "SMS", "BOTH"] as const).map((channel) => (
                    <button
                      key={channel}
                      onClick={() => setSelectedChannel(channel)}
                      className={cn(
                        "flex items-center gap-2 text-sm px-4 py-2 rounded-lg border-2 transition-all",
                        selectedChannel === channel
                          ? "border-brand-teal bg-brand-teal/5 text-brand-teal"
                          : "border-gray-200 text-gray-700 hover:border-gray-400"
                      )}
                    >
                      {channel === "EMAIL" && <Mail className="w-4 h-4" />}
                      {channel === "SMS" && <MessageSquare className="w-4 h-4" />}
                      {channel}
                    </button>
                  ))}
                </div>
              </div>

              {/* Template Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template (Optional)
                </label>
                <Select
                  options={[
                    { value: "", label: "Select a template..." },
                    ...templates
                      .filter(
                        (t) =>
                          t.channel === selectedChannel ||
                          t.channel === "BOTH" ||
                          selectedChannel === "BOTH"
                      )
                      .map((template) => ({
                        value: template.id,
                        label: `${template.name} (${template.category})`,
                      })),
                  ]}
                  value={selectedTemplate}
                  onChange={setSelectedTemplate}
                  placeholder="Select a template..."
                />
              </div>

              {/* Recipient */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient
                </label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Enter application ID, name, or email..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                />
              </div>

              {/* Subject (Email only) */}
              {(selectedChannel === "EMAIL" || selectedChannel === "BOTH") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Message subject..."
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                  />
                </div>
              )}

              {/* Message Body */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message Body
                </label>
                <textarea
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                  rows={8}
                  placeholder="Type your message here... Use {{applicant_name}}, {{application_id}}, etc. for merge fields"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent resize-none"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Available merge fields: {"{"}
                  {"{"}applicant_name{"}"}, {"{"}
                  {"{"}application_id{"}"}, {"{"}
                  {"{"}decision_reason{"}"}, {"{"}
                  {"{"}missing_documents{"}"}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm">
                  Save as Draft
                </button>
                <div className="flex gap-3">
                  <button className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                    Preview
                  </button>
                  <button className="flex items-center gap-2 px-6 py-2 bg-brand-teal text-white rounded-lg hover:bg-brand-teal/90 transition-colors text-sm">
                    <Send className="w-4 h-4" />
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Message History View */}
        {activeView === "history" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 "
          >
            {/* Search */}
            <div className="bg-white rounded-2xl border border-gray-200/70 p-4 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.45)] hover:shadow-[0_30px_60px_-40px_rgba(15,23,42,0.55)] transition-shadow duration-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                />
              </div>
            </div>

            {/* Messages List */}
            <div className="bg-white rounded-2xl border border-gray-200/70 divide-y divide-gray-100 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.45)] hover:shadow-[0_30px_60px_-40px_rgba(15,23,42,0.55)] transition-shadow duration-200">
              {filteredMessages.map((message) => (
                <div key={message.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-brand-navy mb-1">
                        {message.entityName}
                      </p>
                      <p className="text-sm text-gray-500">{message.id}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "px-2.5 py-1 rounded-full text-xs font-medium",
                          message.channel === "EMAIL" && "bg-blue-100 text-blue-700",
                          message.channel === "SMS" && "bg-green-100 text-green-700"
                        )}
                      >
                        {message.channel}
                      </span>
                      <span
                        className={cn(
                          "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                          message.status === "DELIVERED" && "bg-green-100 text-green-700",
                          message.status === "SENT" && "bg-blue-100 text-blue-700",
                          message.status === "FAILED" && "bg-red-100 text-red-700"
                        )}
                      >
                        {message.status === "DELIVERED" && <CheckCircle className="w-3 h-3" />}
                        {message.status === "FAILED" && <XCircle className="w-3 h-3" />}
                        {message.status === "SENT" && <Clock className="w-3 h-3" />}
                        {message.status}
                      </span>
                    </div>
                  </div>
                  {message.subject && (
                    <p className="text-sm text-gray-900 mb-2">
                      <span className="font-medium">Subject:</span> {message.subject}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    Template: {message.template} • Sent {formatDate(message.sentAt, true)}
                    {message.deliveredAt && ` • Delivered ${formatDate(message.deliveredAt, true)}`}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Templates View */}
        {activeView === "templates" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-200/70 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.45)] hover:shadow-[0_30px_60px_-40px_rgba(15,23,42,0.55)]"
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-brand-navy">Message Templates</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Pre-approved templates for common communications
                </p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                <Plus className="w-4 h-4" />
                New Template
              </button>
            </div>
            <div className="divide-y divide-gray-200">
              {templates.map((template) => (
                <div key={template.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-brand-navy">{template.name}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Category: {template.category} • Channel: {template.channel}
                      </p>
                    </div>
                    <button className="px-4 py-2 text-sm font-medium text-brand-teal hover:bg-brand-teal/5 rounded-lg transition-colors">
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
