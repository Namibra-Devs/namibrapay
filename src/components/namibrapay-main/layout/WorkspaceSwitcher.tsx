"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, LogOut, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Workspace } from "@/lib/mock-data/workspaces";

interface WorkspaceSwitcherProps {
  currentWorkspace: Workspace;
  otherWorkspaces: Workspace[];
  onSelectWorkspace: (workspaceId: string) => void;
  onAddWorkspace: () => void;
  onSignOut: () => void;
  onClose: () => void;
}

export default function WorkspaceSwitcher({
  currentWorkspace,
  otherWorkspaces,
  onSelectWorkspace,
  onAddWorkspace,
  onSignOut,
  onClose,
}: WorkspaceSwitcherProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredWorkspaces = otherWorkspaces.filter((workspace) =>
    workspace.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleWorkspaceClick = (workspaceId: string) => {
    onSelectWorkspace(workspaceId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-100 flex items-start justify-start">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Panel */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        className="relative ml-4 mt-20 lg:ml-72 lg:mt-24 w-[90vw] max-w-md bg-[#1a2332] rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Current Workspace Header */}
        <div className="px-6 py-5 border-b border-gray-700/50">
          <button
            onClick={onClose}
            className="w-full flex items-center justify-between gap-3 group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-brand-navy flex items-center justify-center shrink-0">
                <span className="text-white text-sm font-bold">
                  {currentWorkspace.initials}
                </span>
              </div>
              <div className="text-left min-w-0">
                <p className="text-base font-bold text-white truncate">
                  {currentWorkspace.name}
                </p>
                <p className="text-sm text-gray-400 font-mono">
                  {currentWorkspace.businessId}
                </p>
              </div>
            </div>
            <ChevronUp className="w-4 h-4 text-gray-400 shrink-0 group-hover:text-white transition-colors" />
          </button>
        </div>

        {/* Other Businesses Section */}
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              OTHER BUSINESSES
            </h3>
            <span className="text-xs font-semibold text-gray-500">
              {otherWorkspaces.length}
            </span>
          </div>

          {/* Search Input */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#0f1621] border border-gray-700/50 rounded-xl text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-brand-teal/50 focus:ring-2 focus:ring-brand-teal/20 transition-all"
            />
          </div>

          {/* Workspace List */}
          <div className="space-y-1 max-h-64 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#374151 transparent' }}>
            {filteredWorkspaces.length > 0 ? (
              filteredWorkspaces.map((workspace) => (
                <button
                  key={workspace.id}
                  onClick={() => handleWorkspaceClick(workspace.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-700/30 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-linear-to-br from-gray-600 to-gray-800 flex items-center justify-center shrink-0">
                    <span className="text-white text-xs font-bold">
                      {workspace.initials}
                    </span>
                  </div>
                  <div className="text-left min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white truncate group-hover:text-brand-teal transition-colors">
                      {workspace.name}
                    </p>
                    <p className="text-xs text-gray-500 font-mono">
                      {workspace.businessId}
                    </p>
                  </div>
                  {workspace.isTestMode && (
                    <span className="text-[10px] font-semibold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">
                      TEST
                    </span>
                  )}
                </button>
              ))
            ) : (
              <div className="py-8 text-center">
                <p className="text-sm text-gray-500">
                  None of your businesses match this search
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700/50" />

        {/* Actions */}
        <div className="px-6 py-4 space-y-1">
          <button
            onClick={() => {
              onAddWorkspace();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-700/30 transition-colors group"
          >
            <Plus className="w-4 h-4 text-gray-400 group-hover:text-brand-teal transition-colors" />
            <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
              Add a business
            </span>
          </button>

          <button
            onClick={() => {
              onSignOut();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-500/10 transition-colors group"
          >
            <LogOut className="w-4 h-4 text-gray-400 group-hover:text-red-400 transition-colors" />
            <span className="text-sm font-medium text-gray-300 group-hover:text-red-400 transition-colors">
              Sign out
            </span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
