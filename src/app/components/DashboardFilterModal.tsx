"use client";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

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
};

type DashboardFilterModalProps = {
  isVisible: boolean;
  activeFilters: ActiveFilters;
  companyList: string[];
  locationList: string[];
  setActiveFilters: (filters: ActiveFilters) => void;
  onClose: () => void;
};

const DashboardFilterModal = ({
  isVisible,
  activeFilters,
  companyList,
  locationList,
  setActiveFilters,
  onClose,
}: DashboardFilterModalProps) => {
  const [filterValues, setFilterValues] =
    useState<ActiveFilters>(activeFilters);

  const handleClearClick = (fieldName: string) => {
    if (!Object.keys(filterValues).includes(fieldName)) return;

    setFilterValues((prev) => ({ ...prev, [fieldName]: "" }));
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (!name) return;

    setFilterValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setActiveFilters(filterValues);
    onClose();
  };

  if (!isVisible) {
    return <></>;
  }

  return (
    <div className="absolute top-0 left-0 h-full w-full flex justify-center items-center bg-gray-800/40">
      <div className="w-full md:w-3/7 bg-gray-100 h-max rounded-lg relative flex flex-col gap-5 items-center p-5">
        <div className="w-full flex justify-between">
          <h3 className="text-2xl text-gray-800">Filters</h3>
          <button
            className="w-10 h-10 cursor-pointer flex justify-center items-center rounded-full text-gray-800 hover:bg-amber-400/60"
            onClick={onClose}
          >
            <FontAwesomeIcon icon={faXmark} size="lg" />
          </button>
        </div>

        <div className="w-full md:w-3/4 items-center pb-8">
          <form className="grid grid-cols-5 gap-5" onSubmit={handleSubmit}>
            <>
              <label className="text-gray-800 col-span-2">
                <span className="hidden md:block">Application</span> Status:
              </label>
              <div className="flex gap-1 items-center col-span-3">
                <select
                  name="status"
                  value={filterValues.status}
                  onChange={handleFilterChange}
                  className="border bg-gray-100 border-gray-800 rounded-md text-gray-800 capitalize px-4 py-2 cursor-pointer grow"
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
              <label className="text-gray-800 col-span-2">
                Job Types:
              </label>
              <div className="flex gap-1 items-center col-span-3">
                <select
                  name="jobType"
                  value={filterValues.jobType}
                  onChange={handleFilterChange}
                  className="border bg-gray-100 border-gray-800 rounded-md text-gray-800 capitalize px-4 py-2 cursor-pointer grow"
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
                <label className="text-gray-800 col-span-2">
                  Location:
                </label>
                <div className="flex gap-1 items-center col-span-3">
                  <select
                    name="location"
                    value={filterValues.location}
                    onChange={handleFilterChange}
                    className="border bg-gray-100 border-gray-800 rounded-md text-gray-800 capitalize px-4 py-2 cursor-pointer grow"
                  >
                    <option value="" className="capitalize">
                      all
                    </option>
                    {locationList.map((filter) => (
                      <option
                        key={filter}
                        value={filter}
                        className="capitalize"
                      >
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
                <label className="text-gray-800 col-span-2">
                  Company:
                </label>
                <div className="flex gap-1 items-center col-span-3">
                  <select
                    name="company"
                    value={filterValues.company}
                    onChange={handleFilterChange}
                    className="border bg-gray-100 border-gray-800 rounded-md text-gray-800 capitalize px-4 py-2 cursor-pointer grow"
                  >
                    <option value="" className="capitalize">
                      all
                    </option>
                    {companyList.map((filter) => (
                      <option
                        key={filter}
                        value={filter}
                        className="capitalize"
                      >
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

            <div className="col-span-5 flex justify-center mt-5">
              <button
                type="submit"
                className="w-full md:w-2/3 flex justify-center py-3 rounded-lg cursor-pointer border-2 border-amber-500 text-gray-800 hover:bg-amber-400 transition-colors duration-200 ease-in-out"
              >
                Filter Results
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DashboardFilterModal;
