"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
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
  const caseId = params.id as string;
  const [activeTab, setActiveTab] = useState<"overview" | "evidence" | "notes" | "tasks" | "str">("overview");
  const [newNote, setNewNote] = useState("");
  const [newTask, setNewTask] = useState("");

  const caseData = getCaseData(caseId);

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
          <button className="px-3 md:px-4 py-2 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm">
            Reassign
          </button>
          <button className="px-3 md:px-4 py-2 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm">
            Export Report
          </button>
          <button className="px-3 md:px-4 py-2 bg-brand-teal text-white rounded-lg font-medium hover:bg-brand-teal/90 transition-colors text-sm">
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
                <button className="px-4 py-2 bg-brand-teal text-white rounded-lg font-medium hover:bg-brand-teal/90 transition-colors flex items-center gap-2 text-sm">
                  <Upload className="w-4 h-4" />
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors mb-3"
                />
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input type="checkbox" className="rounded border-gray-300" />
                    Internal note (not shared with applicant)
                  </label>
                  <button className="px-4 py-2 bg-brand-teal text-white rounded-lg font-medium hover:bg-brand-teal/90 transition-colors flex items-center gap-2 text-sm">
                    <Send className="w-4 h-4" />
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
                        <div className="flex items-center justify-between mb-2">
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
                        <p className="text-gray-700">{note.content}</p>
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
                    placeholder="Add a new task..."
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors"
                  />
                  <button className="px-4 py-2.5 bg-brand-teal text-white rounded-lg font-medium hover:bg-brand-teal/90 transition-colors flex items-center gap-2 text-sm">
                    <Plus className="w-4 h-4" />
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
                        className="mt-1 w-5 h-5 rounded border-gray-300 text-brand-teal focus:ring-brand-teal"
                        readOnly
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
                <button className="px-4 py-2 bg-brand-teal text-white rounded-lg font-medium hover:bg-brand-teal/90 transition-colors text-sm">
                  Generate STR Template
                </button>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-900">Regulatory Requirement</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    STR must be filed with the Financial Intelligence Unit (FIU) within 3 business
                    days of suspicion identification.
                  </p>
                </div>
              </div>

              <textarea
                placeholder="Draft your Suspicious Transaction Report here..."
                rows={15}
                defaultValue={caseData.strDraft}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors font-mono text-sm"
              />

              <div className="flex gap-3">
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm">
                  Save Draft
                </button>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center gap-2 text-sm">
                  <Send className="w-4 h-4" />
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
