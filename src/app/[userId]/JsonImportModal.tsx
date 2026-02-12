"use client";
import Modal from "@/components/Modal";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FormDataType } from "./NewApplicationModal";
import { JobType } from "@/types/job";
import { z } from "zod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfo } from "@fortawesome/free-solid-svg-icons";
import { logAnalyticsEvent } from "@/lib/analytics";

type Props = {
  isVisible: boolean;
  setJson: (data: FormDataType) => void;
  onClose: () => void;
};

type InputJson = {
  title?: string;
  link?: string;
  company?: string;
  location?: {
    city?: string;
    state?: string;
    country?: string;
  };
  jobType: JobType;
  compensation?: string;
  responsibilities?: string[];
  requirements?: string[];
  otherImportantData?: Record<string, string | string[]>;
};

export const InputJsonSchema = z.object({
  title: z.string().optional(),
  link: z.string().optional(),
  company: z.string().optional(),
  location: z
    .object({
      city: z.string().optional(),
      state: z.string().optional(),
      country: z.string().optional(),
    })
    .optional(),
  jobType: z.string(),
  compensation: z.string().optional(),
  responsibilities: z.array(z.string()).optional(),
  requirements: z.array(z.string()).optional(),
  otherImportantData: z
    .record(z.string(), z.union([z.string(), z.array(z.string())]))
    .optional(),
});

const TYPE_STRING = `{
  title?: string;
  link?: string;
  company?: string;
  location?: {
    city?: string;
    state?: string;
    country?: string;
  };
  jobType: JobType;
  compensation?: string;
  responsibilities?: string[];
  requirements?: string[];
  otherImportantData?: Record<string, string | string[]>;
}`;

const JsonImportModal = ({ isVisible, setJson, onClose }: Props) => {
  const [importJson, setImportJson] = useState("");
  const [error, setError] = useState("");
  const [showInfo, setShowInfo] = useState(false);

  const handleClose = () => {
    setImportJson("");
    setError("");
    onClose();
  };

  const handleSubmit = () => {
    try {
      const json: InputJson = JSON.parse(importJson);

      const validated = InputJsonSchema.parse(json);
      console.log("JSON validated", validated);

      const data: FormDataType = {
        "job-title": json.title ?? "",
        "job-link": json.link ?? "",
        company: json.company ?? "",
        location: `${json.location?.city}, ${json.location?.state}`,
        "job-type": (String(json.jobType).toLowerCase() as JobType) ?? "onsite",
        "job-responsibilities": json.responsibilities?.join(",\n") ?? "",
        "job-requirements": json.requirements?.join(",\n") ?? "",
        "job-notes":
          Object.entries(json.otherImportantData ?? [])
            .reduce(
              (acc, [key, val]) =>
                (acc =
                  acc +
                  `\n\n${key}:\n${
                    typeof val === "string" ? val : val.join(",\n")
                  }`),
              "",
            )
            .trim() ?? "",
      };

      setJson(data);

      logAnalyticsEvent("application_entry_quick_import_successful");
      toast.success("JSON Imported Successfully");
      handleClose();
    } catch (err) {
      console.error("Error", err);
      if (err instanceof SyntaxError) {
        toast.error("Invalid JSON format");
        logAnalyticsEvent("application_entry_quick_import_failed", {
          reason: "invalid format",
        });
      } else {
        toast.error("Invalid job schema");
        logAnalyticsEvent("application_entry_quick_import_failed", {
          reason: "invalid schema",
        });
      }
    }
  };

  const handleFormat = () => {
    setError("");
    if (!importJson) return;

    try {
      const json = JSON.parse(importJson);

      const validated = InputJsonSchema.parse(json);
      console.log("JSON validated", validated);

      setImportJson(JSON.stringify(json, null, 2));
    } catch (err) {
      console.error("Error", err);
      if (err instanceof SyntaxError) {
        toast.error("Invalid JSON format");
      } else {
        toast.error("Invalid job schema");
      }
    }
  };

  useEffect(() => {
    if (isVisible) {
      logAnalyticsEvent("application_entry_quick_import_show");
    }
  }, [isVisible]);

  return (
    <Modal
      isVisible={isVisible}
      onClose={handleClose}
      theme="dark"
      title="JSON Import"
      modalClasses="md:w-3/4 pb-3 shadow-xl shadow-zinc-900 border-2 border-zinc-700 h-full"
      bodyClasses="px-5 py-2 relative flex flex-col"
      hasBackdropPadding={false}
    >
      <button
        className="absolute top-5 right-8 w-8 aspect-square rounded-full cursor-pointer text-sm border border-slate-200/60 text-slate-200/60 hover:text-slate-200 hover:border-slate-200 transition-colors duration-200 ease-in-out"
        onClick={() => setShowInfo(true)}
      >
        <FontAwesomeIcon icon={faInfo} />
      </button>
      <textarea
        value={importJson}
        onChange={(e) => setImportJson(e.target.value)}
        placeholder={`Paste JSON of type: ${TYPE_STRING}`}
        className={`w-full resize-none grow md:h-120 bg-zinc-700 p-3 rounded-lg border border-transparent focus-visible:outline-none ${
          error ? "border-red-600!" : "focus-visible:border-amber-400"
        }`}
      />
      {error && <p className="text-sm text-red-600">Parse Error: {error}</p>}
      <div className="flex flex-col md:flex-row gap-3 justify-between mt-4">
        <button
          type="button"
          className="cursor-pointer bg-amber-400 text-gray-800 hover:bg-amber-500 px-10 py-5 md:py-2 rounded-md w-full md:w-max"
          onClick={handleFormat}
        >
          Format Text
        </button>
        <button
          type="button"
          className="cursor-pointer bg-amber-400 text-gray-800 hover:bg-amber-500 px-10 py-5 md:py-2 rounded-md w-full md:w-max"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
      <Modal
        isVisible={showInfo}
        onClose={() => setShowInfo(false)}
        modalClasses="md:w-5/6"
        bodyClasses="flex justify-center pb-5"
        hasBackdropPadding={false}
        showCloseButton={false}
      >
        <div className="w-max flex flex-col items-center gap-5 px-2">
          <p className="leading-relaxed text-gray-800 text-lg">
            JSON must be of the following type
          </p>
          <pre className="font-mono text-sm border border-gray-800 text-gray-800 p-4 rounded-lg whitespace-pre-wrap">
            {TYPE_STRING}
          </pre>

          <button
            type="button"
            className="cursor-pointer bg-amber-400 text-gray-900 hover:bg-amber-500 px-10 py-5 md:py-2 rounded-md w-max"
            onClick={() => setShowInfo(false)}
          >
            Got It
          </button>
        </div>
      </Modal>
    </Modal>
  );
};

export default JsonImportModal;
