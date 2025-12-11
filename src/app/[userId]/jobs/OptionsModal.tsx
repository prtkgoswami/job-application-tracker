"use client";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import Modal from "@components/Modal";
import { logAnalyticsEvent } from "@lib/analytics";

const JOB_STATUS_FILTERS = [
  "active",
  "applied",
  "wishlisted",
  "interviewing",
  "offered",
  "rejected",
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

  const handleClearClick = (fieldName: string) => {
    if (!Object.keys(filterValues).includes(fieldName)) return;

    setFilterValues((prev) => ({ ...prev, [fieldName]: "" }));
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, type } = e.target;
    if (!name) return;

    if (type === "checkbox") {
      const { checked } = e.target;
      setFilterValues((prev) => ({ ...prev, [name]: checked }));
    } else {
      const { value } = e.target;
      setFilterValues((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setActiveFilters(filterValues);

    // Analytics
    logAnalyticsEvent("filter_applications", {
      "filter_keys": Object.keys(filterValues).join(','),
      "filter_values": Object.values(filterValues).join(',')
    })

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
      modalClasses="md:w-3/7 h-max flex flex-col gap-5 items-center"
      bodyClasses="px-3 flex justify-center"
    >
      <div className="w-full md:w-3/4 pb-8">
        <form
          className="grid grid-cols-2 md:grid-cols-5 gap-5 items-center"
          onSubmit={handleSubmit}
        >
          <>
            <label className="text-gray-800 md:col-span-2">
              <span className="hidden md:block">Application</span> Status:
            </label>
            <div className="flex gap-1 items-center md:col-span-3">
              <select
                name="status"
                value={filterValues.status}
                onChange={handleFilterChange}
                className="border bg-gray-100 border-gray-800 rounded-md text-gray-800 capitalize px-4 py-2 cursor-pointer grow text-sm md:text-base"
              >
                <option value="" className="capitalize">
                  all
                </option>
                {JOB_STATUS_FILTERS.map((filter) => (
                  <option key={filter} value={filter} className="capitalize">
                    {filter}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="cursor-pointer text-amber-600 hover:text-amber-500 transition-colors duration-200 ease-in-out"
                onClick={() => handleClearClick("status")}
              >
                <FontAwesomeIcon icon={faXmark} size="sm" />
              </button>
            </div>
          </>

          <>
            <label className="text-gray-800 md:col-span-2">Job Types:</label>
            <div className="flex gap-1 items-center md:col-span-3">
              <select
                name="jobType"
                value={filterValues.jobType}
                onChange={handleFilterChange}
                className="border bg-gray-100 border-gray-800 rounded-md text-gray-800 capitalize px-4 py-2 cursor-pointer grow text-sm md:text-base"
              >
                <option value="" className="capitalize">
                  all
                </option>
                {JOB_TYPE_FILTERS.map((filter) => (
                  <option key={filter} value={filter} className="capitalize">
                    {filter}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="cursor-pointer text-amber-600 hover:text-amber-500 transition-colors duration-200 ease-in-out"
                onClick={() => handleClearClick("jobType")}
              >
                <FontAwesomeIcon icon={faXmark} size="sm" />
              </button>
            </div>
          </>

          {locationList && locationList.length > 0 && (
            <>
              <label className="text-gray-800 md:col-span-2">Location:</label>
              <div className="flex gap-1 items-center md:col-span-3">
                <select
                  name="location"
                  value={filterValues.location}
                  onChange={handleFilterChange}
                  className="border bg-gray-100 border-gray-800 rounded-md text-gray-800 capitalize px-4 py-2 cursor-pointer grow text-sm md:text-base"
                >
                  <option value="" className="capitalize">
                    all
                  </option>
                  {locationList.map((filter) => (
                    <option key={filter} value={filter} className="capitalize">
                      {filter}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="cursor-pointer text-amber-600 hover:text-amber-500 transition-colors duration-200 ease-in-out"
                  onClick={() => handleClearClick("location")}
                >
                  <FontAwesomeIcon icon={faXmark} size="sm" />
                </button>
              </div>
            </>
          )}

          {companyList && companyList.length > 0 && (
            <>
              <label className="text-gray-800 md:col-span-2">Company:</label>
              <div className="flex gap-1 items-center md:col-span-3 max-w-full">
                <select
                  name="company"
                  value={filterValues.company}
                  onChange={handleFilterChange}
                  className="border bg-gray-100 border-gray-800 rounded-md text-gray-800 capitalize px-4 py-2 cursor-pointer grow text-sm md:text-base w-full"
                >
                  <option value="" className="capitalize">
                    all
                  </option>
                  {companyList.map((filter) => (
                    <option key={filter} value={filter} className="capitalize">
                      {filter}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="cursor-pointer text-amber-600 hover:text-amber-500 transition-colors duration-200 ease-in-out"
                  onClick={() => handleClearClick("company")}
                >
                  <FontAwesomeIcon icon={faXmark} size="sm" />
                </button>
              </div>
            </>
          )}

          <>
            <label className="text-gray-800 md:col-span-2">
              Show Archived ({archivedCount}):
            </label>
            <div className="flex justify-center gap-1 items-center md:col-span-3">
              <input
                type="checkbox"
                name="showArchived"
                checked={filterValues.showArchived}
                onChange={handleFilterChange}
              />
            </div>
          </>

          <div className="col-span-2 md:col-span-5 flex justify-center mt-5">
            <button
              type="submit"
              className="w-full md:w-2/3 flex justify-center py-3 rounded-lg cursor-pointer border-2 border-amber-500 text-gray-800 hover:bg-amber-400 transition-colors duration-200 ease-in-out"
            >
              Filter Results
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default OptionsModal;
