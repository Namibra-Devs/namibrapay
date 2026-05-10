"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Upload, Trash2, UserPlus, ChevronUp } from "lucide-react";
import type { DocumentsData, Person } from "../types";
import PersonPanel from "../panels/PersonPanel";

const INPUT =
  "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 transition-colors bg-white";

interface FileUploadCardProps {
  label: string;
  description: string;
  required?: boolean;
  fileName: string;
  onFileChange: (name: string) => void;
}

function FileUploadCard({
  label,
  description,
  required,
  fileName,
  onFileChange,
}: FileUploadCardProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 border-b border-gray-100 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-semibold text-gray-900">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </span>
        <ChevronUp
          className={`w-4 h-4 text-gray-400 transition-transform ${expanded ? "" : "rotate-180"}`}
        />
      </button>

      {expanded && (
        <div className="p-4 space-y-2">
          {fileName && (
            <div className="flex items-center gap-3 text-sm bg-amber-50 rounded-xl px-3 py-2">
              <span className="text-amber-500 text-base">↑</span>
              <span className="flex-1 text-gray-700 truncate text-xs">{fileName}</span>
              <button className="text-brand-teal hover:underline text-xs font-medium">
                View
              </button>
              <button
                onClick={() => onFileChange("")}
                className="text-red-500 hover:underline text-xs font-medium"
              >
                Delete
              </button>
            </div>
          )}
          <label className="flex items-center justify-center gap-2 w-full border border-dashed border-gray-200 rounded-xl py-3 px-4 cursor-pointer hover:border-brand-teal hover:bg-brand-teal/5 transition-colors">
            <Upload className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">+ Choose files</span>
            <input
              type="file"
              className="hidden"
              onChange={(e) => onFileChange(e.target.files?.[0]?.name ?? "")}
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </label>
          <p className="text-xs text-gray-400">{description}</p>
        </div>
      )}
    </div>
  );
}

interface DocumentsStepProps {
  data: DocumentsData;
  isComplete: boolean;
  onSave: (data: DocumentsData) => void;
}

export default function DocumentsStep({
  data,
  isComplete,
  onSave,
}: DocumentsStepProps) {
  const [form, setForm] = useState<DocumentsData>(data);
  const [panelType, setPanelType] = useState<"director" | "owner" | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!form.certificateName) e.certificate = "Certificate of Incorporation is required";
    if (!form.tin.trim()) e.tin = "Required";
    if (form.directors.length < 2) e.directors = "At least 2 directors are required";
    return e;
  }

  function handleSave() {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    onSave(form);
  }

  function addPerson(person: Person) {
    if (panelType === "director") {
      setForm((f) => ({ ...f, directors: [...f.directors, person] }));
      setErrors((e) => ({ ...e, directors: "" }));
    } else {
      setForm((f) => ({ ...f, beneficialOwners: [...f.beneficialOwners, person] }));
    }
    setPanelType(null);
  }

  function removePerson(type: "director" | "owner", id: string) {
    if (type === "director") {
      setForm((f) => ({ ...f, directors: f.directors.filter((d) => d.id !== id) }));
    } else {
      setForm((f) => ({
        ...f,
        beneficialOwners: f.beneficialOwners.filter((o) => o.id !== id),
      }));
    }
  }

  return (
    <>
      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-1">Documents</h2>
        <p className="text-sm text-gray-500 mb-6">Please upload all documents</p>

        <div className="space-y-4">
          <FileUploadCard
            label="Form 3"
            required
            description="Registration form for private company limited by shares"
            fileName={form.form3Name}
            onFileChange={(name) => setForm((f) => ({ ...f, form3Name: name }))}
          />

          <FileUploadCard
            label="Certificate of Incorporation"
            required
            description="Certificate of incorporation"
            fileName={form.certificateName}
            onFileChange={(name) => {
              setForm((f) => ({ ...f, certificateName: name }));
              setErrors((e) => ({ ...e, certificate: "" }));
            }}
          />
          {errors.certificate && (
            <p className="text-xs text-red-500 -mt-2">{errors.certificate}</p>
          )}

          {/* TIN */}
          <div className="border border-gray-200 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <span className="text-sm font-semibold text-gray-900">
                Tax Identification Number (TIN){" "}
                <span className="text-red-500">*</span>
              </span>
              <ChevronUp className="w-4 h-4 text-gray-400" />
            </div>
            <div className="p-4">
              <input
                value={form.tin}
                onChange={(e) => {
                  setForm((f) => ({ ...f, tin: e.target.value }));
                  setErrors((er) => ({ ...er, tin: "" }));
                }}
                className={INPUT}
                placeholder="e.g. C0001234567"
              />
              <p className="mt-1.5 text-xs text-gray-400">
                Tax identification number — unique identification numbers issued to taxpayers
              </p>
              {errors.tin && (
                <p className="mt-1 text-xs text-red-500">{errors.tin}</p>
              )}
            </div>
          </div>

          {/* Directors */}
          <div className="border border-gray-200 rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">Directors</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Please identify at least 2 directors of your business
              </p>
            </div>
            <div className="p-4 space-y-2">
              {form.directors.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-xl"
                >
                  <span className="text-sm text-gray-900">
                    {d.firstName} {d.lastName}
                  </span>
                  <button
                    title="delete"
                    onClick={() => removePerson("director", d.id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {errors.directors && (
                <p className="text-xs text-red-500">{errors.directors}</p>
              )}
              <button
                onClick={() => setPanelType("director")}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                Add someone
              </button>
            </div>
          </div>

          {/* Beneficial owners */}
          <div className="border border-gray-200 rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">
                Beneficial owners
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Please identify people who, together, own at least 51% of this
                business.{" "}
                <button className="text-brand-teal hover:underline">
                  Learn more
                </button>
              </p>
            </div>
            <div className="p-4 space-y-2">
              {form.beneficialOwners.map((o) => (
                <div
                  key={o.id}
                  className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-900">
                      {o.firstName} {o.lastName}
                    </span>
                    {o.percentageOwned && (
                      <span className="text-xs text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded-full">
                        {o.percentageOwned}%
                      </span>
                    )}
                  </div>
                  <button
                    title="delete"
                    onClick={() => removePerson("owner", o.id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => setPanelType("owner")}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                Add someone
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="mt-6 w-full py-3 bg-brand-teal text-white rounded-xl text-sm font-semibold hover:bg-brand-teal/90 transition-colors"
        >
          Save
        </button>
      </div>

      <AnimatePresence>
        {panelType && (
          <PersonPanel
            key={panelType}
            type={panelType}
            onSave={addPerson}
            onClose={() => setPanelType(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
