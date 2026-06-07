"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  X,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Eye,
} from "lucide-react";
import DashboardLayout from "@/components/compliance-officer/DashboardLayout";
import Card from "@/components/compliance-officer/shared/Card";
import Badge from "@/components/compliance-officer/shared/Badge";
import Select from "@/components/ui/Select";
import { RiskRule, AuthorityMatrix, UserRole, RiskBand } from "@/types/compliance";
import { 
  MOCK_RISK_RULES, 
  MOCK_AUTHORITY_MATRIX, 
  MOCK_SETTINGS_TEMPLATES,
  MOCK_SYSTEM_SETTINGS,
  type CommunicationTemplate 
} from "@/lib/compliance-hub-mock-data/settings";
import { toast } from "@/components/ui/Toast";
import { AlertModal } from "@/components/compliance-officer/modals";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"risk" | "authority" | "templates" | "system">("risk");

  // State management
  const [riskRules, setRiskRules] = useState<RiskRule[]>(MOCK_RISK_RULES);
  const [authorityMatrix, setAuthorityMatrix] = useState<AuthorityMatrix[]>(MOCK_AUTHORITY_MATRIX);
  const [templates, setTemplates] = useState<CommunicationTemplate[]>(MOCK_SETTINGS_TEMPLATES);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Risk Rules modals
  const [showAddRuleModal, setShowAddRuleModal] = useState(false);
  const [showEditRuleModal, setShowEditRuleModal] = useState(false);
  const [showDeleteRuleModal, setShowDeleteRuleModal] = useState(false);
  const [editingRule, setEditingRule] = useState<RiskRule | null>(null);
  const [deletingRuleId, setDeletingRuleId] = useState<string | null>(null);
  const [newRule, setNewRule] = useState({
    name: "",
    factor: "",
    weight: 0,
    isActive: true,
  });

  // Template modals
  const [showAddTemplateModal, setShowAddTemplateModal] = useState(false);
  const [showEditTemplateModal, setShowEditTemplateModal] = useState(false);
  const [showDeleteTemplateModal, setShowDeleteTemplateModal] = useState(false);
  const [showPreviewTemplateModal, setShowPreviewTemplateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<CommunicationTemplate | null>(null);
  const [deletingTemplateId, setDeletingTemplateId] = useState<string | null>(null);
  const [previewingTemplate, setPreviewingTemplate] = useState<CommunicationTemplate | null>(null);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    category: "",
    channel: "EMAIL" as "EMAIL" | "SMS" | "BOTH",
    body: "",
    isActive: true,
  });

  // System settings
  const [systemSettings, setSystemSettings] = useState(MOCK_SYSTEM_SETTINGS);

  // Helper functions
  const showAlert = (message: string) => {
    setAlertMessage(message);
    setShowAlertModal(true);
  };

  // Save all changes
  const handleSaveChanges = async () => {
    if (!hasUnsavedChanges) {
      showAlert("No changes to save");
      return;
    }

    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setHasUnsavedChanges(false);
      toast.success("All changes saved successfully!");
    } catch (error) {
      console.error("Failed to save changes:", error);
      showAlert("Failed to save changes. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Risk Rules - Toggle Active
  const handleToggleRuleActive = (ruleId: string) => {
    setRiskRules(
      riskRules.map((rule) =>
        rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
      )
    );
    setHasUnsavedChanges(true);
  };

  // Risk Rules - Add
  const handleAddRuleClick = () => {
    setNewRule({
      name: "",
      factor: "",
      weight: 0,
      isActive: true,
    });
    setShowAddRuleModal(true);
  };

  const handleAddRuleConfirm = async () => {
    if (!newRule.name.trim() || !newRule.factor.trim() || newRule.weight <= 0) {
      showAlert("Please fill in all required fields with valid values");
      return;
    }

    const totalWeight = riskRules.reduce((sum, r) => sum + r.weight, 0) + newRule.weight;
    if (totalWeight > 100) {
      showAlert(`Total weight would exceed 100% (currently ${totalWeight}%)`);
      return;
    }

    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const rule: RiskRule = {
        id: `RULE-${String(riskRules.length + 1).padStart(3, "0")}`,
        name: newRule.name,
        factor: newRule.factor,
        weight: newRule.weight,
        conditions: {},
        isActive: newRule.isActive,
        version: 1,
      };

      setRiskRules([...riskRules, rule]);
      setHasUnsavedChanges(true);
      toast.success("Risk rule added successfully!");
      setShowAddRuleModal(false);
    } catch (error) {
      console.error("Failed to add rule:", error);
      showAlert("Failed to add rule. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Risk Rules - Edit
  const handleEditRuleClick = (rule: RiskRule) => {
    setEditingRule({ ...rule });
    setShowEditRuleModal(true);
  };

  const handleEditRuleConfirm = async () => {
    if (!editingRule) return;

    if (!editingRule.name.trim() || !editingRule.factor.trim() || editingRule.weight <= 0) {
      showAlert("Please fill in all required fields with valid values");
      return;
    }

    const totalWeight = riskRules
      .filter((r) => r.id !== editingRule.id)
      .reduce((sum, r) => sum + r.weight, 0) + editingRule.weight;
    
    if (totalWeight > 100) {
      showAlert(`Total weight would exceed 100% (currently ${totalWeight}%)`);
      return;
    }

    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setRiskRules(
        riskRules.map((rule) =>
          rule.id === editingRule.id ? { ...editingRule, version: rule.version + 1 } : rule
        )
      );

      setHasUnsavedChanges(true);
      toast.success("Risk rule updated successfully!");
      setShowEditRuleModal(false);
      setEditingRule(null);
    } catch (error) {
      console.error("Failed to update rule:", error);
      showAlert("Failed to update rule. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Risk Rules - Delete
  const handleDeleteRuleClick = (ruleId: string) => {
    setDeletingRuleId(ruleId);
    setShowDeleteRuleModal(true);
  };

  const handleDeleteRuleConfirm = async () => {
    if (!deletingRuleId) return;

    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      setRiskRules(riskRules.filter((rule) => rule.id !== deletingRuleId));
      setHasUnsavedChanges(true);
      toast.success("Risk rule deleted successfully!");
      setShowDeleteRuleModal(false);
      setDeletingRuleId(null);
    } catch (error) {
      console.error("Failed to delete rule:", error);
      showAlert("Failed to delete rule. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Templates - Toggle Active
  const handleToggleTemplateActive = (templateId: string) => {
    setTemplates(
      templates.map((template) =>
        template.id === templateId ? { ...template, isActive: !template.isActive } : template
      )
    );
    setHasUnsavedChanges(true);
  };

  // Templates - Add
  const handleAddTemplateClick = () => {
    setNewTemplate({
      name: "",
      category: "",
      channel: "EMAIL",
      body: "",
      isActive: true,
    });
    setShowAddTemplateModal(true);
  };

  const handleAddTemplateConfirm = async () => {
    if (!newTemplate.name.trim() || !newTemplate.category.trim() || !newTemplate.body.trim()) {
      showAlert("Please fill in all required fields");
      return;
    }

    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const template = {
        id: `TPL-${String(templates.length + 1).padStart(3, "0")}`,
        name: newTemplate.name,
        category: newTemplate.category,
        channel: newTemplate.channel,
        body: newTemplate.body,
        isActive: newTemplate.isActive,
      };

      setTemplates([...templates, template]);
      setHasUnsavedChanges(true);
      toast.success("Template created successfully!");
      setShowAddTemplateModal(false);
    } catch (error) {
      console.error("Failed to create template:", error);
      showAlert("Failed to create template. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Templates - Edit
  const handleEditTemplateClick = (template: any) => {
    setEditingTemplate({ ...template });
    setShowEditTemplateModal(true);
  };

  const handleEditTemplateConfirm = async () => {
    if (!editingTemplate) return;

    if (!editingTemplate.name.trim() || !editingTemplate.category.trim()) {
      showAlert("Please fill in all required fields");
      return;
    }

    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setTemplates(
        templates.map((template) =>
          template.id === editingTemplate.id ? editingTemplate : template
        )
      );

      setHasUnsavedChanges(true);
      toast.success("Template updated successfully!");
      setShowEditTemplateModal(false);
      setEditingTemplate(null);
    } catch (error) {
      console.error("Failed to update template:", error);
      showAlert("Failed to update template. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Templates - Delete
  const handleDeleteTemplateClick = (templateId: string) => {
    setDeletingTemplateId(templateId);
    setShowDeleteTemplateModal(true);
  };

  const handleDeleteTemplateConfirm = async () => {
    if (!deletingTemplateId) return;

    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      setTemplates(templates.filter((template) => template.id !== deletingTemplateId));
      setHasUnsavedChanges(true);
      toast.success("Template deleted successfully!");
      setShowDeleteTemplateModal(false);
      setDeletingTemplateId(null);
    } catch (error) {
      console.error("Failed to delete template:", error);
      showAlert("Failed to delete template. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Templates - Preview
  const handlePreviewTemplateClick = (template: any) => {
    setPreviewingTemplate(template);
    setShowPreviewTemplateModal(true);
  };

  // System Settings - Update
  const handleSystemSettingChange = (key: string, value: any) => {
    setSystemSettings({
      ...systemSettings,
      [key]: value,
    });
    setHasUnsavedChanges(true);
  };

  const tabs = [
    { id: "risk", label: "Risk Rules", icon: Shield },
    { id: "authority", label: "Authority Matrix", icon: Users },
    { id: "templates", label: "Templates", icon: Mail },
    { id: "system", label: "System Settings", icon: SettingsIcon },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Alert Modal */}
        <AlertModal
          message={alertMessage}
          isVisible={showAlertModal}
          onClose={() => setShowAlertModal(false)}
          variant="error"
        />

        {/* Add Risk Rule Modal */}
        <AnimatePresence>
          {showAddRuleModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4"
              onClick={() => !isProcessing && setShowAddRuleModal(false)}
              style={{ margin: 0 }}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-sm font-semibold tracking-wide uppercase text-gray-400">Add Risk Rule</h2>
                  <button
                    onClick={() => !isProcessing && setShowAddRuleModal(false)}
                    disabled={isProcessing}
                    className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rule Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newRule.name}
                      onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                      placeholder="e.g., High Transaction Volume"
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Risk Factor <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newRule.factor}
                      onChange={(e) => setNewRule({ ...newRule, factor: e.target.value })}
                      placeholder="e.g., transaction_volume, industry_type"
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weight (%) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={newRule.weight || ""}
                      onChange={(e) => setNewRule({ ...newRule, weight: Number(e.target.value) })}
                      placeholder="0-100"
                      min="1"
                      max="100"
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <label className="text-sm font-medium text-gray-700">Active</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newRule.isActive}
                        onChange={(e) => setNewRule({ ...newRule, isActive: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-teal/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-teal"></div>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowAddRuleModal(false)}
                    disabled={isProcessing}
                    className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddRuleConfirm}
                    disabled={isProcessing}
                    className="flex-1 px-4 py-2.5 bg-brand-teal text-white rounded-lg font-medium hover:bg-brand-teal/90 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      "Add Rule"
                    )}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Risk Rule Modal */}
        <AnimatePresence>
          {showEditRuleModal && editingRule && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4"
              onClick={() => !isProcessing && setShowEditRuleModal(false)}
              style={{ margin: 0 }}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-sm font-semibold tracking-wide uppercase text-gray-400">Edit Risk Rule</h2>
                  <button
                    onClick={() => !isProcessing && setShowEditRuleModal(false)}
                    disabled={isProcessing}
                    className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rule Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editingRule.name}
                      onChange={(e) => setEditingRule({ ...editingRule, name: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Risk Factor <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editingRule.factor}
                      onChange={(e) => setEditingRule({ ...editingRule, factor: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weight (%) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={editingRule.weight}
                      onChange={(e) => setEditingRule({ ...editingRule, weight: Number(e.target.value) })}
                      min="1"
                      max="100"
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowEditRuleModal(false)}
                    disabled={isProcessing}
                    className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEditRuleConfirm}
                    disabled={isProcessing}
                    className="flex-1 px-4 py-2.5 bg-brand-teal text-white rounded-lg font-medium hover:bg-brand-teal/90 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Rule"
                    )}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Risk Rule Modal */}
        <AnimatePresence>
          {showDeleteRuleModal && deletingRuleId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4"
              onClick={() => !isProcessing && setShowDeleteRuleModal(false)}
              style={{ margin: 0 }}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-sm font-semibold tracking-wide uppercase text-gray-400">Delete Risk Rule</h2>
                  <button
                    onClick={() => !isProcessing && setShowDeleteRuleModal(false)}
                    disabled={isProcessing}
                    className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
                  <p className="text-xs text-red-900">
                    Are you sure you want to delete the risk rule{" "}
                    <strong>{riskRules.find((r) => r.id === deletingRuleId)?.name}</strong>? This action
                    cannot be undone.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteRuleModal(false)}
                    disabled={isProcessing}
                    className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteRuleConfirm}
                    disabled={isProcessing}
                    className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Delete Rule"
                    )}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Template Modal */}
        <AnimatePresence>
          {showAddTemplateModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4"
              onClick={() => !isProcessing && setShowAddTemplateModal(false)}
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
                  <h2 className="text-sm font-semibold tracking-wide uppercase text-gray-400">Create New Template</h2>
                  <button
                    onClick={() => !isProcessing && setShowAddTemplateModal(false)}
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
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors"
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
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors"
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
                      Template Body <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={newTemplate.body}
                      onChange={(e) => setNewTemplate({ ...newTemplate, body: e.target.value })}
                      placeholder="Enter template content..."
                      rows={8}
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <label className="text-sm font-medium text-gray-700">Active</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newTemplate.isActive}
                        onChange={(e) => setNewTemplate({ ...newTemplate, isActive: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-teal/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-teal"></div>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowAddTemplateModal(false)}
                    disabled={isProcessing}
                    className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddTemplateConfirm}
                    disabled={isProcessing}
                    className="flex-1 px-4 py-2.5 bg-brand-teal text-white rounded-lg font-medium hover:bg-brand-teal/90 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Template"
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
                  <h2 className="text-sm font-semibold tracking-wide uppercase text-gray-400">Edit Template</h2>
                  <button
                    onClick={() => !isProcessing && setShowEditTemplateModal(false)}
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
                      value={editingTemplate.name}
                      onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors"
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
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Channel <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={editingTemplate.channel}
                      onChange={(value) => setEditingTemplate({ ...editingTemplate, channel: value as "EMAIL" | "SMS" | "BOTH" })}
                      options={[
                        { value: "EMAIL", label: "Email" },
                        { value: "SMS", label: "SMS" },
                        { value: "BOTH", label: "Both" },
                      ]}
                    />
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
                    onClick={handleEditTemplateConfirm}
                    disabled={isProcessing}
                    className="flex-1 px-4 py-2.5 bg-brand-teal text-white rounded-lg font-medium hover:bg-brand-teal/90 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Template"
                    )}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Template Modal */}
        <AnimatePresence>
          {showDeleteTemplateModal && deletingTemplateId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4"
              onClick={() => !isProcessing && setShowDeleteTemplateModal(false)}
              style={{ margin: 0 }}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-sm font-semibold tracking-wide uppercase text-gray-400">Delete Template</h2>
                  <button
                    onClick={() => !isProcessing && setShowDeleteTemplateModal(false)}
                    disabled={isProcessing}
                    className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
                  <p className="text-xs text-red-900">
                    Are you sure you want to delete the template{" "}
                    <strong>{templates.find((t) => t.id === deletingTemplateId)?.name}</strong>? This
                    action cannot be undone.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteTemplateModal(false)}
                    disabled={isProcessing}
                    className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteTemplateConfirm}
                    disabled={isProcessing}
                    className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Delete Template"
                    )}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Preview Template Modal */}
        <AnimatePresence>
          {showPreviewTemplateModal && previewingTemplate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4"
              onClick={() => setShowPreviewTemplateModal(false)}
              style={{ margin: 0 }}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-teal/10 rounded-full flex items-center justify-center">
                      <Eye className="w-5 h-5 text-brand-teal" />
                    </div>
                    <h2 className="text-sm font-semibold tracking-wide uppercase text-gray-400">Template Preview</h2>
                  </div>
                  <button
                    onClick={() => setShowPreviewTemplateModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Template Name</p>
                    <p className="text-sm font-medium text-gray-900">{previewingTemplate.name}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Category</p>
                      <p className="text-sm font-medium text-gray-900">{previewingTemplate.category}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Channel</p>
                      <p className="text-sm font-medium text-gray-900">{previewingTemplate.channel}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Template Body</p>
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">
                      {previewingTemplate.body || "No body content available"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowPreviewTemplateModal(false)}
                  className="mt-6 w-full px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-1">Configure compliance system parameters</p>
          </div>
          <button
            onClick={handleSaveChanges}
            disabled={!hasUnsavedChanges || isProcessing}
            className="px-4 py-2.5 bg-brand-teal text-white rounded-lg font-medium hover:bg-brand-teal/90 transition-colors flex items-center gap-2 shadow-sm text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
                {hasUnsavedChanges && <span className="ml-1 text-xs">(•)</span>}
              </>
            )}
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
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Risk Scoring Rules</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Configure factors and weights for automated risk assessment
                    </p>
                  </div>
                  <button
                    onClick={handleAddRuleClick}
                    className="px-4 py-2 bg-brand-teal text-white rounded-lg font-medium hover:bg-brand-teal/90 transition-colors flex items-center gap-2 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Rule
                  </button>
                </div>

                <div className="space-y-3">
                  {riskRules.map((rule, index) => (
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
                            <button
                              onClick={() => handleEditRuleClick(rule)}
                              className="text-sm text-brand-teal hover:text-brand-teal/80 font-medium flex items-center gap-1"
                            >
                              <Edit2 className="w-3 h-3" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteRuleClick(rule.id)}
                              className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" />
                              Delete
                            </button>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer ml-4">
                          <input
                            type="checkbox"
                            checked={rule.isActive}
                            onChange={() => handleToggleRuleActive(rule.id)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-teal/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-teal"></div>
                        </label>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <p className="text-xs text-blue-900">
                    <strong>Note:</strong> Risk rules are applied cumulatively. Total weight should
                    equal 100%. Changes to risk rules will trigger re-assessment of all pending
                    applications.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "authority" && (
              <div className="space-y-4">
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
                      {MOCK_AUTHORITY_MATRIX.map((item, index) => (
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
                  <p className="text-xs text-yellow-900">
                    <strong>Important:</strong> High-risk applications require Senior CO approval.
                    Dual authorization adds an additional approval layer for enhanced control.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "templates" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Communication Templates
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Manage email and SMS templates for applicant communication
                    </p>
                  </div>
                  <button
                    onClick={handleAddTemplateClick}
                    className="px-4 py-2 bg-brand-teal text-white rounded-lg font-medium hover:bg-brand-teal/90 transition-colors flex items-center gap-2 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    New Template
                  </button>
                </div>

                <div className="space-y-3">
                  {templates.map((template, index) => (
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
                            <button
                              onClick={() => handleEditTemplateClick(template)}
                              className="text-sm text-brand-teal hover:text-brand-teal/80 font-medium flex items-center gap-1"
                            >
                              <Edit2 className="w-3 h-3" />
                              Edit
                            </button>
                            <button
                              onClick={() => handlePreviewTemplateClick(template)}
                              className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                            >
                              Preview
                            </button>
                            <button
                              onClick={() => handleDeleteTemplateClick(template.id)}
                              className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" />
                              Delete
                            </button>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer ml-4">
                          <input
                            type="checkbox"
                            checked={template.isActive}
                            onChange={() => handleToggleTemplateActive(template.id)}
                            className="sr-only peer"
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
              <div className="space-y-4">
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
                      value={systemSettings.defaultSLA}
                      onChange={(e) => handleSystemSettingChange("defaultSLA", Number(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
                      value={systemSettings.autoEscalationThreshold}
                      onChange={(e) => handleSystemSettingChange("autoEscalationThreshold", Number(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
                      value={systemSettings.screeningAPIKey}
                      onChange={(e) => handleSystemSettingChange("screeningAPIKey", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors"
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
                        <input
                          type="checkbox"
                          checked={systemSettings.enableAutoScreening}
                          onChange={(e) => handleSystemSettingChange("enableAutoScreening", e.target.checked)}
                          className="sr-only peer"
                        />
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
                        <input
                          type="checkbox"
                          checked={systemSettings.enableEmailNotifications}
                          onChange={(e) => handleSystemSettingChange("enableEmailNotifications", e.target.checked)}
                          className="sr-only peer"
                        />
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
