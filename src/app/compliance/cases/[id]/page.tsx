"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Briefcase,
  FileText,
  MessageSquare,
  CheckSquare,
  Upload,
  Plus,
  Clock,
  AlertTriangle,
  Send,
  Paperclip,
  Download,
  User,
  X,
  CheckCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/compliance/DashboardLayout";
import Card from "@/components/compliance/shared/Card";
import Badge from "@/components/compliance/shared/Badge";
import { Case, CaseStatus, CaseEvidence, CaseTask, Note } from "@/types/compliance";
import { formatDate } from "@/lib/compliance-utils";

// Mock case data
const getCaseData = (id: string): Case => ({
  id,
  type: "SANCTIONS_HIT",
  priority: "CRITICAL",
  status: "INVESTIGATING",
  linkedEntities: ["APP-2024-003", "MERCH-002"],
  assignedInvestigator: "Jane Mensah",
  openedAt: "2024-02-20T09:00:00Z",
  openedBy: "System",
  evidence: [
    {
      id: "EV-001",
      type: "DOCUMENT",
      description: "Sanctions screening report showing 85% match",
      fileUrl: "#",
      addedBy: "Jane Mensah",
      addedAt: "2024-02-20T10:30:00Z",
    },
    {
      id: "EV-002",
      type: "SCREENSHOT",
      description: "Screenshot of OFAC list entry",
      fileUrl: "#",
      addedBy: "Jane Mensah",
      addedAt: "2024-02-20T11:15:00Z",
    },
    {
      id: "EV-003",
      type: "NOTE",
      description: "Initial assessment notes from screening review",
      addedBy: "Jane Mensah",
      addedAt: "2024-02-20T09:30:00Z",
    },
  ],
  notes: [
    {
      id: "NOTE-001",
      content: "Initial screening triggered on name match. Subject name matches OFAC list entry with 85% confidence. Proceeding with detailed investigation.",
      author: "jane.mensah@namibrapay.com",
      authorName: "Jane Mensah",
      createdAt: "2024-02-20T09:30:00Z",
      isInternal: true,
    },
    {
      id: "NOTE-002",
      content: "Reviewed additional identifiers. Date of birth differs by 2 years. Nationality matches. Need to verify with government database.",
      author: "jane.mensah@namibrapay.com",
      authorName: "Jane Mensah",
      createdAt: "2024-02-20T14:20:00Z",
      isInternal: true,
    },
    {
      id: "NOTE-003",
      content: "Contacted applicant for additional documentation. Awaiting response.",
      author: "jane.mensah@namibrapay.com",
      authorName: "Jane Mensah",
      createdAt: "2024-02-21T10:00:00Z",
      isInternal: false,
    },
  ],
  tasks: [
    {
      id: "TASK-001",
      description: "Review sanctions match details and compare all identifiers",
      assignedTo: "Jane Mensah",
      dueDate: "2024-02-21T17:00:00Z",
      completed: true,
      completedAt: "2024-02-20T14:30:00Z",
    },
    {
      id: "TASK-002",
      description: "Request additional identity documents from applicant",
      assignedTo: "Jane Mensah",
      dueDate: "2024-02-22T17:00:00Z",
      completed: true,
      completedAt: "2024-02-21T10:05:00Z",
    },
    {
      id: "TASK-003",
      description: "Verify identity with government database",
      assignedTo: "Jane Mensah",
      dueDate: "2024-02-23T17:00:00Z",
      completed: false,
    },
    {
      id: "TASK-004",
      description: "Prepare case summary for senior review",
      assignedTo: "Jane Mensah",
      dueDate: "2024-02-24T17:00:00Z",
      completed: false,
    },
  ],
  strDraft: "",
});

export default function CaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const caseId = params.id as string;
  const [activeTab, setActiveTab] = useState<"overview" | "evidence" | "notes" | "tasks" | "str">("overview");
  const [newNote, setNewNote] = useState("");
  const [isInternalNote, setIsInternalNote] = useState(true);
  const [newTask, setNewTask] = useState("");
  const [strDraft, setStrDraft] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  
  // Modal states
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [reassignInvestigator, setReassignInvestigator] = useState("");
  const [showCloseCaseModal, setShowCloseCaseModal] = useState(false);
  const [closeCaseOutcome, setCloseCaseOutcome] = useState("");
  const [showSubmitSTRModal, setShowSubmitSTRModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  
  // State management for case data
  const [caseData, setCaseData] = useState(() => getCaseData(caseId));

  // Helper function to show success toast
  const showToast = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  // Helper function to show alert modal
  const showAlert = (message: string) => {
    setAlertMessage(message);
    setShowAlertModal(true);
  };

  // Handle Add Note
  const handleAddNote = async () => {
    if (!newNote.trim()) {
      showAlert("Please enter a note");
      return;
    }

    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const note: Note = {
        id: `NOTE-${String(caseData.notes.length + 1).padStart(3, "0")}`,
        content: newNote,
        author: "current.user@namibrapay.com",
        authorName: "Current User",
        createdAt: new Date().toISOString(),
        isInternal: isInternalNote,
      };

      setCaseData({
        ...caseData,
        notes: [...caseData.notes, note],
      });

      setNewNote("");
      showToast("Note added successfully!");
    } catch (error) {
      console.error("Failed to add note:", error);
      showAlert("Failed to add note. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Add Task
  const handleAddTask = async () => {
    if (!newTask.trim()) {
      showAlert("Please enter a task description");
      return;
    }

    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const task: CaseTask = {
        id: `TASK-${String(caseData.tasks.length + 1).padStart(3, "0")}`,
        description: newTask,
        assignedTo: caseData.assignedInvestigator || "Unassigned",
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
        completed: false,
      };

      setCaseData({
        ...caseData,
        tasks: [...caseData.tasks, task],
      });

      setNewTask("");
      showToast("Task added successfully!");
    } catch (error) {
      console.error("Failed to add task:", error);
      showAlert("Failed to add task. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Toggle Task Completion
  const handleToggleTask = async (taskId: string) => {
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const updatedTasks = caseData.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
              completedAt: !task.completed ? new Date().toISOString() : undefined,
            }
          : task
      );

      setCaseData({
        ...caseData,
        tasks: updatedTasks,
      });

      showToast("Task status updated!");
    } catch (error) {
      console.error("Failed to update task:", error);
      alert("Failed to update task. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Add Evidence
  const handleAddEvidence = async () => {
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const evidence: CaseEvidence = {
        id: `EV-${String(caseData.evidence.length + 1).padStart(3, "0")}`,
        type: "DOCUMENT",
        description: "New evidence document uploaded",
        fileUrl: "#",
        addedBy: "Current User",
        addedAt: new Date().toISOString(),
      };

      setCaseData({
        ...caseData,
        evidence: [...caseData.evidence, evidence],
      });

      showToast("Evidence added successfully!");
    } catch (error) {
      console.error("Failed to add evidence:", error);
      showAlert("Failed to add evidence. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Save STR Draft
  const handleSaveSTRDraft = async () => {
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      setCaseData({
        ...caseData,
        strDraft: strDraft,
      });

      showToast("STR draft saved successfully!");
    } catch (error) {
      console.error("Failed to save STR draft:", error);
      showAlert("Failed to save STR draft. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Submit STR - Open confirmation modal
  const handleSubmitSTRClick = () => {
    if (!strDraft.trim()) {
      showAlert("Please complete the STR draft before submitting");
      return;
    }
    setShowSubmitSTRModal(true);
  };

  // Handle Submit STR - Confirmed
  const handleSubmitSTRConfirmed = async () => {
    setShowSubmitSTRModal(false);
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setCaseData({
        ...caseData,
        status: "REPORTED",
        strDraft: strDraft,
        closedAt: new Date().toISOString(),
        outcome: "Suspicious Transaction Report filed with FIU",
      });

      showToast("STR submitted successfully to FIU!");
      
      setTimeout(() => {
        router.push("/compliance/cases");
      }, 2000);
    } catch (error) {
      console.error("Failed to submit STR:", error);
      showAlert("Failed to submit STR. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Reassign Case - Open modal
  const handleReassignClick = () => {
    setReassignInvestigator("");
    setShowReassignModal(true);
  };

  // Handle Reassign Case - Confirmed
  const handleReassignConfirmed = async () => {
    if (!reassignInvestigator.trim()) {
      showAlert("Please enter an investigator name");
      return;
    }

    setShowReassignModal(false);
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      setCaseData({
        ...caseData,
        assignedInvestigator: reassignInvestigator,
      });

      showToast(`Case reassigned to ${reassignInvestigator}!`);
    } catch (error) {
      console.error("Failed to reassign case:", error);
      showAlert("Failed to reassign case. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Export Report
  const handleExportReport = async () => {
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const reportContent = `
CASE REPORT
-----------
Case ID: ${caseData.id}
Type: ${caseData.type.replace(/_/g, " ")}
Priority: ${caseData.priority}
Status: ${caseData.status}

Investigator: ${caseData.assignedInvestigator}
Opened: ${formatDate(caseData.openedAt, true)}
${caseData.closedAt ? `Closed: ${formatDate(caseData.closedAt, true)}` : ""}

Linked Entities: ${caseData.linkedEntities.join(", ")}

NOTES (${caseData.notes.length}):
${caseData.notes.map((n) => `- ${formatDate(n.createdAt, true)} by ${n.authorName}: ${n.content}`).join("\n")}

EVIDENCE (${caseData.evidence.length}):
${caseData.evidence.map((e) => `- ${e.type}: ${e.description}`).join("\n")}

TASKS (${caseData.tasks.length}):
${caseData.tasks.map((t) => `- [${t.completed ? "X" : " "}] ${t.description}`).join("\n")}
      `;

      const blob = new Blob([reportContent], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `case-report-${caseData.id}-${new Date().toISOString().split("T")[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      showToast("Report exported successfully!");
    } catch (error) {
      console.error("Failed to export report:", error);
      showAlert("Failed to export report. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Close Case - Open modal
  const handleCloseCaseClick = () => {
    setCloseCaseOutcome("");
    setShowCloseCaseModal(true);
  };

  // Handle Close Case - Confirmed
  const handleCloseCaseConfirmed = async () => {
    if (!closeCaseOutcome.trim()) {
      showAlert("Please enter the case outcome");
      return;
    }

    setShowCloseCaseModal(false);
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setCaseData({
        ...caseData,
        status: "CLOSED",
        closedAt: new Date().toISOString(),
        outcome: closeCaseOutcome,
      });

      showToast("Case closed successfully!");
      
      setTimeout(() => {
        router.push("/compliance/cases");
      }, 2000);
    } catch (error) {
      console.error("Failed to close case:", error);
      showAlert("Failed to close case. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Briefcase },
    { id: "evidence", label: "Evidence", icon: FileText, badge: caseData.evidence.length },
    { id: "notes", label: "Notes", icon: MessageSquare, badge: caseData.notes.length },
    { id: "tasks", label: "Tasks", icon: CheckSquare, badge: caseData.tasks.filter(t => !t.completed).length },
    { id: "str", label: "STR Draft", icon: AlertTriangle },
  ];

  const getStatusColor = (status: CaseStatus) => {
    switch (status) {
      case "OPEN":
        return "info";
      case "INVESTIGATING":
        return "warning";
      case "PENDING_REVIEW":
        return "warning";
      case "CLOSED":
        return "success";
      case "REPORTED":
        return "neutral";
      default:
        return "neutral";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "CRITICAL":
        return "bg-red-100 text-red-700 border-red-200";
      case "HIGH":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "LOW":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

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
            <CheckCircle className="w-4 h-4" />
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

      {/* Reassign Case Modal */}
      <AnimatePresence>
        {showReassignModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4"
            onClick={() => !isProcessing && setShowReassignModal(false)}
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
                <h2 className="text-sm font-semibold tracking-wide uppercase text-gray-400">Reassign Case</h2>
                <button
                  onClick={() => !isProcessing && setShowReassignModal(false)}
                  disabled={isProcessing}
                  className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Investigator Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={reassignInvestigator}
                  onChange={(e) => setReassignInvestigator(e.target.value)}
                  placeholder="Enter investigator name"
                  className="w-full text-sm px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors"
                  autoFocus
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowReassignModal(false)}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReassignConfirmed}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2.5 bg-brand-teal text-white rounded-lg font-medium hover:bg-brand-teal/90 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reassign
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Close Case Modal */}
      <AnimatePresence>
        {showCloseCaseModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4"
            onClick={() => !isProcessing && setShowCloseCaseModal(false)}
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
                <h2 className="text-sm font-semibold tracking-wide uppercase text-gray-400">Close Case</h2>
                <button
                  onClick={() => !isProcessing && setShowCloseCaseModal(false)}
                  disabled={isProcessing}
                  className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Case Outcome/Resolution <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={closeCaseOutcome}
                  onChange={(e) => setCloseCaseOutcome(e.target.value)}
                  placeholder="Enter the case outcome or resolution..."
                  rows={4}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors"
                  autoFocus
                />
              </div>

              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-6 flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-800">
                  Closing this case will mark it as resolved. This action cannot be undone.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCloseCaseModal(false)}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCloseCaseConfirmed}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2.5 bg-brand-teal text-white rounded-lg font-medium hover:bg-brand-teal/90 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Close Case
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit STR Confirmation Modal */}
      <AnimatePresence>
        {showSubmitSTRModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4"
            onClick={() => !isProcessing && setShowSubmitSTRModal(false)}
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
                <h2 className="text-sm font-semibold tracking-wide uppercase text-gray-400">Confirm STR Submission</h2>
                <button
                  onClick={() => !isProcessing && setShowSubmitSTRModal(false)}
                  disabled={isProcessing}
                  className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6 flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-red-900 mb-1">Warning</p>
                  <p className="text-xs text-red-700">
                    Are you sure you want to submit this Suspicious Transaction Report to the FIU? This action cannot be undone and will automatically close the case.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowSubmitSTRModal(false)}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitSTRConfirmed}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Submit to FIU
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back Button */}
      <Link
        href="/compliance/cases"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Cases
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">{caseData.id}</h1>
            <Badge variant={getStatusColor(caseData.status)} size="sm">
              {caseData.status.replace(/_/g, " ")}
            </Badge>
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                caseData.priority
              )}`}
            >
              {caseData.priority} PRIORITY
            </span>
          </div>
          <p className="text-gray-600 text-sm md:text-base">{caseData.type.replace(/_/g, " ")}</p>
          <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-2 text-xs md:text-sm text-gray-500">
            <span>Opened {formatDate(caseData.openedAt, true)}</span>
            <span className="hidden sm:inline">•</span>
            <span>Assigned to {caseData.assignedInvestigator}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 md:gap-3 shrink-0">
          <button
            onClick={handleReassignClick}
            disabled={isProcessing}
            className="px-3 md:px-4 py-2 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reassign
          </button>
          <button
            onClick={handleExportReport}
            disabled={isProcessing}
            className="px-3 md:px-4 py-2 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Export Report
          </button>
          <button
            onClick={handleCloseCaseClick}
            disabled={isProcessing || caseData.status === "CLOSED" || caseData.status === "REPORTED"}
            className="px-3 md:px-4 py-2 bg-brand-teal text-white rounded-lg font-medium hover:bg-brand-teal/90 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Close Case
          </button>
        </div>
      </div>

      {/* Linked Entities */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <span className="text-sm font-medium text-gray-600 shrink-0">Linked Entities:</span>
          <div className="flex flex-wrap gap-2">
            {caseData.linkedEntities.map((entity) => (
              <Link
                key={entity}
                href={`/compliance/applications/${entity}`}
                className="inline-flex items-center px-3 py-1.5 rounded-lg bg-brand-teal/10 text-brand-teal font-medium text-xs hover:bg-brand-teal/20 transition-colors"
              >
                {entity}
              </Link>
            ))}
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Card padding="none">
        <div className="border-b border-gray-100">
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
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-brand-teal rounded-full">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm font-medium text-gray-600 mb-1">Case Type</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {caseData.type.replace(/_/g, " ")}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm font-medium text-gray-600 mb-1">Priority Level</p>
                  <p className="text-lg font-semibold text-gray-900">{caseData.priority}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm font-medium text-gray-600 mb-1">Time Open</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {Math.ceil(
                      (new Date().getTime() - new Date(caseData.openedAt).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}{" "}
                    days
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Case Summary</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Opened By</label>
                    <p className="text-gray-900 mt-1">{caseData.openedBy}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Opened At</label>
                    <p className="text-gray-900 mt-1">{formatDate(caseData.openedAt, true)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Assigned Investigator</label>
                    <p className="text-gray-900 mt-1">{caseData.assignedInvestigator}</p>
                  </div>
                  {caseData.closedAt && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Closed At</label>
                        <p className="text-gray-900 mt-1">{formatDate(caseData.closedAt, true)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Outcome</label>
                        <p className="text-gray-900 mt-1">{caseData.outcome}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Investigation Progress</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Evidence Collected</span>
                    <span className="font-semibold text-gray-900">{caseData.evidence.length} items</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Notes Added</span>
                    <span className="font-semibold text-gray-900">{caseData.notes.length} entries</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Tasks Completed</span>
                    <span className="font-semibold text-gray-900">
                      {caseData.tasks.filter((t) => t.completed).length} / {caseData.tasks.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "evidence" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Evidence Items</h3>
                <button
                  onClick={handleAddEvidence}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-brand-teal text-white rounded-lg font-medium hover:bg-brand-teal/90 transition-colors flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  Add Evidence
                </button>
              </div>

              {caseData.evidence.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 border border-gray-200/70 rounded-xl hover:border-brand-teal/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-brand-teal/10 rounded-xl flex items-center justify-center shrink-0">
                        <FileText className="w-6 h-6 text-brand-teal" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-gray-900">{item.type}</p>
                          <Badge variant="info" size="sm">
                            {item.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Added by {item.addedBy}</span>
                          <span>•</span>
                          <span>{formatDate(item.addedAt, true)}</span>
                        </div>
                      </div>
                    </div>
                    {item.fileUrl && (
                      <button className="text-brand-teal hover:text-brand-teal/80 font-medium text-sm flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === "notes" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Investigation Notes</h3>
              </div>

              {/* Add Note Form */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note to the investigation..."
                  rows={3}
                  className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors mb-3"
                />
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={isInternalNote}
                      onChange={(e) => setIsInternalNote(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    Internal note (not shared with applicant)
                  </label>

                  <button
                    onClick={handleAddNote}
                    disabled={isProcessing || !newNote.trim()}
                    className="px-4 py-2 bg-brand-teal text-white rounded-lg font-medium hover:bg-brand-teal/90 transition-colors flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    Add Note
                  </button>
                </div>
              </div>

              {/* Notes List */}
              <div className="space-y-3">
                {caseData.notes.map((note, index) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 bg-white border border-gray-200 rounded-xl"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-brand-teal/10 rounded-full flex items-center justify-center shrink-0">
                        <User className="w-5 h-5 text-brand-teal" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900">{note.authorName}</p>
                            {note.isInternal && (
                              <Badge variant="warning" size="sm">
                                Internal
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatDate(note.createdAt, true)}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm">{note.content}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "tasks" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Investigation Tasks</h3>
              </div>

              {/* Add Task Form */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newTask.trim()) {
                        handleAddTask();
                      }
                    }}
                    placeholder="Add a new task..."
                    className="flex-1 px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors"
                  />
                  <button
                    onClick={handleAddTask}
                    disabled={isProcessing || !newTask.trim()}
                    className="px-4 py-2.5 bg-brand-teal text-white rounded-lg font-medium hover:bg-brand-teal/90 transition-colors flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                    Add Task
                  </button>
                </div>
              </div>

              {/* Tasks List */}
              <div className="space-y-3">
                {caseData.tasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 border rounded-xl transition-all ${
                      task.completed
                        ? "bg-green-50 border-green-200"
                        : "bg-white border-gray-200 hover:border-brand-teal/50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => handleToggleTask(task.id)}
                        disabled={isProcessing}
                        className="mt-1 w-5 h-5 rounded border-gray-300 text-brand-teal focus:ring-brand-teal cursor-pointer disabled:cursor-not-allowed"
                      />
                      <div className="flex-1">
                        <p
                          className={`font-medium ${
                            task.completed ? "text-gray-500 line-through" : "text-gray-900"
                          }`}
                        >
                          {task.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <span>Assigned to {task.assignedTo}</span>
                          {task.dueDate && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                Due {formatDate(task.dueDate)}
                              </span>
                            </>
                          )}
                        </div>
                        {task.completed && task.completedAt && (
                          <p className="text-xs text-green-600 mt-1">
                            Completed on {formatDate(task.completedAt, true)}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "str" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Suspicious Transaction Report (STR)
                </h3>
                <button
                  onClick={() => {
                    const template = `SUSPICIOUS TRANSACTION REPORT

                    Case ID: ${caseData.id}
                    Linked Entities: ${caseData.linkedEntities.join(", ")}
                    Date: ${new Date().toLocaleDateString()}

                    SUMMARY:
                    [Provide a brief summary of the suspicious activity]

                    DETAILED DESCRIPTION:
                    [Describe the suspicious activity in detail, including dates, amounts, parties involved, and red flags observed]

                    REASON FOR SUSPICION:
                    [Explain why this activity is considered suspicious and warrants reporting]

                    INVESTIGATION CONDUCTED:
                    [Summarize the investigation steps taken and findings]

                    SUPPORTING EVIDENCE:
                    ${caseData.evidence.map((e, i) => `${i + 1}. ${e.type}: ${e.description}`).join("\n")}

                    CONCLUSION:
                    [Final assessment and recommendation]

                    Prepared by: ${caseData.assignedInvestigator}
                    Date: ${new Date().toLocaleDateString()}
                    `;
                    setStrDraft(template);
                    showToast("STR template generated!");
                  }}
                  className="px-4 py-2 bg-brand-teal text-white rounded-lg font-medium hover:bg-brand-teal/90 transition-colors text-sm"
                >
                  Generate STR Template
                </button>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-900">Regulatory Requirement</p>
                  <p className="text-xs text-yellow-700 mt-1">
                    STR must be filed with the Financial Intelligence Unit (FIU) within 3 business
                    days of suspicion identification.
                  </p>
                </div>
              </div>

              <textarea
                placeholder="Draft your Suspicious Transaction Report here..."
                rows={15}
                value={strDraft}
                onChange={(e) => setStrDraft(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors font-mono text-sm"
              />

              <div className="flex gap-3">
                <button
                  onClick={handleSaveSTRDraft}
                  disabled={isProcessing || !strDraft.trim()}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isProcessing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : null}
                  Save Draft
                </button>
                <button
                  onClick={handleSubmitSTRClick}
                  disabled={isProcessing || !strDraft.trim() || caseData.status === "REPORTED"}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Submit STR to FIU
                </button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
    </DashboardLayout>
  );
}
