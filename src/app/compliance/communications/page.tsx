"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  X,
  AlertTriangle,
  Eye,
  Save,
  Loader2,
} from "lucide-react";
import DashboardLayout from "@/components/compliance/DashboardLayout";
import Select from "@/components/ui/Select";
import { cn, formatDate } from "@/lib/compliance-utils";

// Define message type
type MessageType = {
  id: string;
  entityId: string;
  entityName: string;
  channel: "EMAIL" | "SMS";
  subject: string | null;
  template: string;
  status: "DELIVERED" | "SENT" | "FAILED";
  sentAt: string;
  deliveredAt: string | null;
};

// Mock data with initial state
const initialMessages: MessageType[] = [
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
  { 
    id: "TPL-001", 
    name: "Application Received", 
    channel: "BOTH" as const, 
    category: "Onboarding",
    body: "Dear {{applicant_name}},\n\nYour application ({{application_id}}) has been received and is under review. We will notify you of any updates.\n\nThank you for your patience.\n\nNamibraPay Compliance Team"
  },
  { 
    id: "TPL-002", 
    name: "Request for Information", 
    channel: "EMAIL" as const, 
    category: "Review",
    body: "Dear {{applicant_name}},\n\nWe require additional information for application {{application_id}}:\n\n{{missing_documents}}\n\nPlease submit these documents within 5 business days.\n\nBest regards,\nNamibraPay Compliance Team"
  },
  { 
    id: "TPL-003", 
    name: "Approval Notification", 
    channel: "BOTH" as const, 
    category: "Decision",
    body: "Dear {{applicant_name}},\n\nCongratulations! Your application ({{application_id}}) has been approved.\n\nYou can now proceed with onboarding.\n\nWelcome to NamibraPay!"
  },
  { 
    id: "TPL-004", 
    name: "Rejection Notification", 
    channel: "EMAIL" as const, 
    category: "Decision",
    body: "Dear {{applicant_name}},\n\nAfter careful review, we regret to inform you that application {{application_id}} has been declined.\n\nReason: {{decision_reason}}\n\nYou may reapply after 90 days.\n\nNamibraPay Compliance Team"
  },
  { 
    id: "TPL-005", 
    name: "Document Expiry Reminder", 
    channel: "SMS" as const, 
    category: "Maintenance",
    body: "Hi {{applicant_name}}, your documents for account {{application_id}} are expiring soon. Please update them to avoid service interruption. - NamibraPay"
  },
  { 
    id: "TPL-006", 
    name: "Periodic Review Request", 
    channel: "EMAIL" as const, 
    category: "Maintenance",
    body: "Dear {{applicant_name}},\n\nAs part of our periodic KYC review for account {{application_id}}, please submit updated documentation.\n\nRequired documents:\n{{missing_documents}}\n\nThank you for your cooperation.\n\nNamibraPay Compliance Team"
  },
];

export default function CommunicationsCenter() {
  const [activeView, setActiveView] = useState<"compose" | "history" | "templates">("history");
  const [selectedChannel, setSelectedChannel] = useState<"EMAIL" | "SMS" | "BOTH">("EMAIL");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [channelFilter, setChannelFilter] = useState<string>("ALL");
  
  // State management
  const [messages, setMessages] = useState(initialMessages);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewContent, setPreviewContent] = useState({ subject: "", body: "" });
  const [showNewTemplateModal, setShowNewTemplateModal] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    channel: "EMAIL" as "EMAIL" | "SMS" | "BOTH",
    category: "",
    body: "",
  });
  const [showEditTemplateModal, setShowEditTemplateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<{
    id: string;
    name: string;
    channel: "EMAIL" | "SMS" | "BOTH";
    category: string;
    body: string;
  } | null>(null);

  // Helper functions
  const showToast = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const showAlert = (message: string) => {
    setAlertMessage(message);
    setShowAlertModal(true);
  };

  // Load template content when selected
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setMessageBody(template.body);
      if (template.channel === "EMAIL" || template.channel === "BOTH") {
        setSubject(template.name);
      }
    }
  };

  // Preview message
  const handlePreview = () => {
    if (!messageBody.trim()) {
      showAlert("Please enter a message body");
      return;
    }

    // Simulate merge field replacement
    let previewBody = messageBody
      .replace(/\{\{applicant_name\}\}/g, "John Doe")
      .replace(/\{\{application_id\}\}/g, "APP-2024-XXX")
      .replace(/\{\{decision_reason\}\}/g, "Incomplete documentation")
      .replace(/\{\{missing_documents\}\}/g, "- National ID\n- Proof of Address");

    setPreviewContent({
      subject: subject || "No Subject",
      body: previewBody,
    });
    setShowPreviewModal(true);
  };

  // Send message
  const handleSendMessage = async () => {
    // Validation
    if (!recipient.trim()) {
      showAlert("Please enter a recipient");
      return;
    }

    if ((selectedChannel === "EMAIL" || selectedChannel === "BOTH") && !subject.trim()) {
      showAlert("Please enter a subject for email messages");
      return;
    }

    if (!messageBody.trim()) {
      showAlert("Please enter a message body");
      return;
    }

    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create new message(s)
      const newMessages: MessageType[] = [];
      const timestamp = new Date().toISOString();
      const messageId = `MSG-${String(messages.length + 1).padStart(3, "0")}`;

      if (selectedChannel === "BOTH") {
        // Send both EMAIL and SMS
        newMessages.push({
          id: `${messageId}-EMAIL`,
          entityId: recipient,
          entityName: recipient,
          channel: "EMAIL",
          subject: subject,
          template: selectedTemplate ? templates.find((t) => t.id === selectedTemplate)?.name || "Custom" : "Custom",
          status: "DELIVERED",
          sentAt: timestamp,
          deliveredAt: new Date(Date.now() + 1000).toISOString(),
        });
        newMessages.push({
          id: `${messageId}-SMS`,
          entityId: recipient,
          entityName: recipient,
          channel: "SMS",
          subject: null,
          template: selectedTemplate ? templates.find((t) => t.id === selectedTemplate)?.name || "Custom" : "Custom",
          status: "DELIVERED",
          sentAt: timestamp,
          deliveredAt: new Date(Date.now() + 500).toISOString(),
        });
      } else {
        newMessages.push({
          id: messageId,
          entityId: recipient,
          entityName: recipient,
          channel: selectedChannel,
          subject: selectedChannel === "EMAIL" ? subject : null,
          template: selectedTemplate ? templates.find((t) => t.id === selectedTemplate)?.name || "Custom" : "Custom",
          status: "DELIVERED",
          sentAt: timestamp,
          deliveredAt: new Date(Date.now() + 1000).toISOString(),
        });
      }

      setMessages([...newMessages, ...messages]);

      // Reset form
      setRecipient("");
      setSubject("");
      setMessageBody("");
      setSelectedTemplate("");
      
      showToast(`Message sent successfully via ${selectedChannel}!`);
      
      // Switch to history view after a delay
      setTimeout(() => {
        setActiveView("history");
      }, 1500);
    } catch (error) {
      console.error("Failed to send message:", error);
      showAlert("Failed to send message. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Save as draft
  const handleSaveDraft = () => {
    if (!messageBody.trim()) {
      showAlert("Please enter a message body to save");
      return;
    }

    // In a real app, this would save to backend
    showToast("Draft saved successfully!");
  };

  // Create new template
  const handleCreateTemplate = async () => {
    if (!newTemplate.name.trim() || !newTemplate.category.trim() || !newTemplate.body.trim()) {
      showAlert("Please fill in all required fields");
      return;
    }

    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real app, this would create template via API
      showToast("Template created successfully!");
      
      setShowNewTemplateModal(false);
      setNewTemplate({
        name: "",
        channel: "EMAIL",
        category: "",
        body: "",
      });
    } catch (error) {
      console.error("Failed to create template:", error);
      showAlert("Failed to create template. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Open edit template modal
  const handleEditTemplateClick = (template: typeof templates[0]) => {
    setEditingTemplate({
      id: template.id,
      name: template.name,
      channel: template.channel,
      category: template.category,
      body: template.body,
    });
    setShowEditTemplateModal(true);
  };

  // Update template
  const handleUpdateTemplate = async () => {
    if (!editingTemplate) return;

    if (!editingTemplate.name.trim() || !editingTemplate.category.trim() || !editingTemplate.body.trim()) {
      showAlert("Please fill in all required fields");
      return;
    }

    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real app, this would update template via API
      showToast("Template updated successfully!");
      
      setShowEditTemplateModal(false);
      setEditingTemplate(null);
    } catch (error) {
      console.error("Failed to update template:", error);
      showAlert("Failed to update template. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Filter messages
  const filteredMessages = useMemo(() => {
    return messages.filter((msg) => {
      const matchesSearch =
        msg.entityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (msg.subject && msg.subject.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesStatus = statusFilter === "ALL" || msg.status === statusFilter;
      const matchesChannel = channelFilter === "ALL" || msg.channel === channelFilter;

      return matchesSearch && matchesStatus && matchesChannel;
    });
  }, [messages, searchQuery, statusFilter, channelFilter]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Success Toast */}
        <AnimatePresence>
          {showSuccessToast && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-4 right-4 z-60 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3"
            >
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{successMessage}</span>
              <button
                onClick={() => setShowSuccessToast(false)}
                className="ml-2 hover:bg-green-700 rounded p-1 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Alert Modal */}
        <AnimatePresence>
          {showAlertModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4"
              onClick={() => setShowAlertModal(false)}
              style={{ margin: 0 }}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Alert</h3>
                </div>
                <p className="text-sm text-gray-700 mb-6">{alertMessage}</p>
                <button
                  onClick={() => setShowAlertModal(false)}
                  className="w-full px-4 py-2.5 bg-brand-teal text-white rounded-lg font-medium hover:bg-brand-teal/90 transition-colors text-sm"
                >
                  OK
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Preview Modal */}
        <AnimatePresence>
          {showPreviewModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4"
              onClick={() => setShowPreviewModal(false)}
              style={{ margin: 0 }}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-teal/10 rounded-full flex items-center justify-center">
                      <Eye className="w-5 h-5 text-brand-teal" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-600">Message Preview</h2>
                  </div>
                  <button
                    onClick={() => setShowPreviewModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Channel</p>
                    <p className="text-sm font-medium text-gray-900">{selectedChannel}</p>
                  </div>

                  {(selectedChannel === "EMAIL" || selectedChannel === "BOTH") && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Subject</p>
                      <p className="text-sm font-medium text-gray-900">{previewContent.subject}</p>
                    </div>
                  )}

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Message Body</p>
                    <div className="text-sm text-gray-900 whitespace-pre-wrap">
                      {previewContent.body}
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs text-blue-800">
                      <strong>Note:</strong> Merge fields shown with sample data. Actual values will be inserted when sent.
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => setShowPreviewModal(false)}
                    className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setShowPreviewModal(false);
                      handleSendMessage();
                    }}
                    disabled={isProcessing}
                    className="flex-1 px-4 py-2.5 bg-brand-teal text-white rounded-lg font-medium hover:bg-brand-teal/90 transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Send Now
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* New Template Modal */}
        <AnimatePresence>
          {showNewTemplateModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4"
              onClick={() => !isProcessing && setShowNewTemplateModal(false)}
              style={{ margin: 0 }}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-600">Create New Template</h2>
                  <button
                    onClick={() => !isProcessing && setShowNewTemplateModal(false)}
                    disabled={isProcessing}
                    className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Template Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newTemplate.name}
                      onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                      placeholder="e.g., Welcome Message"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Channel <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={newTemplate.channel}
                      onChange={(value) => setNewTemplate({ ...newTemplate, channel: value as any })}
                      options={[
                        { value: "EMAIL", label: "Email" },
                        { value: "SMS", label: "SMS" },
                        { value: "BOTH", label: "Both" },
                      ]}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newTemplate.category}
                      onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                      placeholder="e.g., Onboarding, Review, Decision"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Template Body <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={newTemplate.body}
                      onChange={(e) => setNewTemplate({ ...newTemplate, body: e.target.value })}
                      placeholder="Enter template content with merge fields..."
                      rows={8}
                      className="text-sm w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      Use merge fields: {"{"}
                      {"{"}applicant_name{"}"}, {"{"}
                      {"{"}application_id{"}"}, {"{"}
                      {"{"}decision_reason{"}"}, {"{"}
                      {"{"}missing_documents{"}"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowNewTemplateModal(false)}
                    disabled={isProcessing}
                    className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateTemplate}
                    disabled={isProcessing}
                    className="flex-1 px-4 py-2.5 bg-brand-teal text-white rounded-lg font-medium hover:bg-brand-teal/90 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Create Template
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Template Modal */}
        <AnimatePresence>
          {showEditTemplateModal && editingTemplate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4"
              onClick={() => !isProcessing && setShowEditTemplateModal(false)}
              style={{ margin: 0 }}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-600">Edit Template</h2>
                  <button
                    onClick={() => !isProcessing && setShowEditTemplateModal(false)}
                    disabled={isProcessing}
                    className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Template Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editingTemplate.name}
                      onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                      placeholder="e.g., Welcome Message"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Channel <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={editingTemplate.channel}
                      onChange={(value) => setEditingTemplate({ ...editingTemplate, channel: value as any })}
                      options={[
                        { value: "EMAIL", label: "Email" },
                        { value: "SMS", label: "SMS" },
                        { value: "BOTH", label: "Both" },
                      ]}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editingTemplate.category}
                      onChange={(e) => setEditingTemplate({ ...editingTemplate, category: e.target.value })}
                      placeholder="e.g., Onboarding, Review, Decision"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Template Body <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={editingTemplate.body}
                      onChange={(e) => setEditingTemplate({ ...editingTemplate, body: e.target.value })}
                      placeholder="Enter template content with merge fields..."
                      rows={8}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      Use merge fields: {"{"}
                      {"{"}applicant_name{"}"}, {"{"}
                      {"{"}application_id{"}"}, {"{"}
                      {"{"}decision_reason{"}"}, {"{"}
                      {"{"}missing_documents{"}"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowEditTemplateModal(false)}
                    disabled={isProcessing}
                    className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateTemplate}
                    disabled={isProcessing}
                    className="flex-1 px-4 py-2.5 bg-brand-teal text-white rounded-lg font-medium hover:bg-brand-teal/90 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Update Template
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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
            className="bg-white rounded-2xl border border-gray-200/70 p-6 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.45)] hover:shadow-[0_30px_60px_-40px_rgba(15,23,42,0.55)]"
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
                  onChange={handleTemplateSelect}
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
                <button
                  onClick={handleSaveDraft}
                  disabled={isProcessing}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save as Draft
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={handlePreview}
                    disabled={isProcessing}
                    className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                  <button
                    onClick={handleSendMessage}
                    disabled={isProcessing}
                    className="flex items-center gap-2 px-6 py-2 bg-brand-teal text-white rounded-lg hover:bg-brand-teal/90 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
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
            {/* Search and Filters */}
            <div className="bg-white rounded-2xl border border-gray-200/70 p-4 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.45)] hover:shadow-[0_30px_60px_-40px_rgba(15,23,42,0.55)] transition-shadow duration-200">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search messages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                  />
                </div>
                <div className="flex gap-3">
                  <Select
                    value={statusFilter}
                    onChange={setStatusFilter}
                    className="w-full md:w-40"
                    options={[
                      { value: "ALL", label: "All Status" },
                      { value: "DELIVERED", label: "Delivered" },
                      { value: "SENT", label: "Sent" },
                      { value: "FAILED", label: "Failed" },
                    ]}
                  />
                  <Select
                    value={channelFilter}
                    onChange={setChannelFilter}
                    className="w-full md:w-40"
                    options={[
                      { value: "ALL", label: "All Channels" },
                      { value: "EMAIL", label: "Email" },
                      { value: "SMS", label: "SMS" },
                    ]}
                  />
                </div>
              </div>
            </div>

            {/* Results Counter */}
            {filteredMessages.length > 0 && (
              <div className="px-4 py-2 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  Showing {filteredMessages.length} message(s)
                  {(searchQuery || statusFilter !== "ALL" || channelFilter !== "ALL") && " matching filters"}
                </p>
              </div>
            )}

            {/* Messages List */}
            {filteredMessages.length > 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200/70 divide-y divide-gray-100 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.45)] hover:shadow-[0_30px_60px_-40px_rgba(15,23,42,0.55)] transition-shadow duration-200">
                {filteredMessages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
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
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl border border-gray-200/70 p-12 text-center shadow-[0_30px_70px_-50px_rgba(15,23,42,0.45)]"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No messages found
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchQuery || statusFilter !== "ALL" || channelFilter !== "ALL"
                    ? "Try adjusting your search or filter criteria"
                    : "No messages have been sent yet"}
                </p>
                {(searchQuery || statusFilter !== "ALL" || channelFilter !== "ALL") && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("ALL");
                      setChannelFilter("ALL");
                    }}
                    className="px-4 py-2 bg-brand-teal text-white rounded-lg hover:bg-brand-teal/90 transition-colors text-sm font-medium"
                  >
                    Clear Filters
                  </button>
                )}
              </motion.div>
            )}
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
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm" onClick={() => setShowNewTemplateModal(true)}>
                <Plus className="w-4 h-4" />
                New Template
              </button>
            </div>
            <div className="divide-y divide-gray-200">
              {templates.map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-brand-navy">{template.name}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Category: {template.category} • Channel: {template.channel}
                      </p>
                      <p className="text-xs text-gray-400 mt-2 line-clamp-2">
                        {template.body}
                      </p>
                    </div>
                    <button
                      onClick={() => handleEditTemplateClick(template)}
                      className="px-4 py-2 text-sm font-medium text-brand-teal hover:bg-brand-teal/5 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Edit
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
