"use client";
import React, { useEffect, useState } from "react";
import Modal from "@components/Modal";
import { logAnalyticsEvent } from "@lib/analytics";
import SearchableDropdown from "@/components/SearchableDropdown";

const JOB_STATUS_FILTERS = [
  "active",
  "applied",
  "wishlisted",
  "interviewing",
  "offered",
  "rejected",
  "cancelled",
];

const JOB_TYPE_FILTERS = ["onsite", "hybrid", "remote"];

export type ActiveFilters = {
  status: (typeof JOB_STATUS_FILTERS)[number] | "";
  jobType: (typeof JOB_TYPE_FILTERS)[number] | "";
  location: string;
  company: string;
  showArchived: boolean;
};

type OptionsModalProps = {
  isVisible: boolean;
  activeFilters: ActiveFilters;
  companyList: string[];
  locationList: string[];
  archivedCount: number;
  setActiveFilters: (filters: ActiveFilters) => void;
  onClose: () => void;
};

const OptionsModal = ({
  isVisible,
  activeFilters,
  companyList,
  locationList,
  archivedCount,
  setActiveFilters,
  onClose,
}: OptionsModalProps) => {
  const [filterValues, setFilterValues] =
    useState<ActiveFilters>(activeFilters);

  // Sync internal state if activeFilters props change (e.g. valid when reopening modal)
  useEffect(() => {
    if (isVisible) {
      setFilterValues(activeFilters);
    }
  }, [isVisible, activeFilters]);

  const handleDropdownChange = (name: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFilterValues((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setActiveFilters(filterValues);

    // Analytics
    logAnalyticsEvent("filter_applications", {
      filter_keys: Object.keys(filterValues).join(","),
      filter_values: Object.values(filterValues).join(","),
    });

    onClose();
  };

  if (!isVisible) {
    return <></>;
  }

  return (
    <Modal
      isVisible={isVisible}
      title="View Options"
      onClose={onClose}
      theme="dark"
      modalClasses="w-full md:w-1/2 min-h-[400px] h-max pb-4 shadow-xl shadow-zinc-900 border border-zinc-700 mx-2 overflow-visible"
      bodyClasses="px-5 py-4 overflow-visible"
    >
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 z-20 relative">
          {/* Status Filter */}
          <div className="flex flex-col gap-1.5 z-40">
            <label className="text-zinc-400 text-sm font-medium">
              Application Status
            </label>
            <SearchableDropdown
              name="status"
              value={filterValues.status}
              options={JOB_STATUS_FILTERS}
              onChange={handleDropdownChange}
              placeholder="Select status..."
            />
          </div>

          {/* Job Type Filter */}
          <div className="flex flex-col gap-1.5 z-30">
            <label className="text-zinc-400 text-sm font-medium">
              Job Type
            </label>
            <SearchableDropdown
              name="jobType"
              value={filterValues.jobType}
              options={JOB_TYPE_FILTERS}
              onChange={handleDropdownChange}
              placeholder="Select job type..."
            />
          </div>

          {/* Location Filter */}
          {locationList && locationList.length > 0 && (
            <div className="flex flex-col gap-1.5 z-20">
              <label className="text-zinc-400 text-sm font-medium">
                Location
              </label>
              <SearchableDropdown
                name="location"
                value={filterValues.location}
                options={locationList}
                onChange={handleDropdownChange}
                placeholder="Select location..."
              />
            </div>
          )}

          {/* Company Filter */}
          {companyList && companyList.length > 0 && (
            <div className="flex flex-col gap-1.5 z-10">
              <label className="text-zinc-400 text-sm font-medium">
                Company
              </label>
              <SearchableDropdown
                name="company"
                value={filterValues.company}
                options={companyList}
                onChange={handleDropdownChange}
                placeholder="Select company..."
              />
            </div>
          )}
        </div>

        {/* Archived Checkbox - Lower z-index */}
        {archivedCount > 0 && (
          <div className="flex items-center gap-3 p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors z-0">
            <input
              type="checkbox"
              name="showArchived"
              id="showArchived"
              checked={filterValues.showArchived}
              onChange={handleCheckboxChange}
              className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
            />
            <label
              htmlFor="showArchived"
              className="text-zinc-300 text-sm font-medium cursor-pointer select-none grow"
            >
              Show Archived Applications
              <span className="ml-2 text-zinc-500 text-xs bg-zinc-800 px-2 py-0.5 rounded-full">
                {archivedCount}
              </span>
            </label>
          </div>
        )}

        {/* Submit Button */}
        <div className="mt-2 text-center">
          <button
            type="submit"
            className="w-full md:w-3/4 py-3.5 rounded-lg font-bold bg-amber-500 text-zinc-900 hover:bg-amber-400 shadow-lg shadow-amber-900/20 active:scale-[0.99] transition-all duration-200 cursor-pointer"
          >
            Filter Results
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default OptionsModal;
