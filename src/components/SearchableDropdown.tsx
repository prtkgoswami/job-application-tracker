"use client";
import { faChevronDown, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";

type SearchableDropdownProps = {
  name: string;
  value: string;
  options: string[];
  onChange: (name: string, value: string) => void;
  placeholder?: string;
  className?: string; // Expects layout classes like 'z-50'
};

const SearchableDropdown = ({
  name,
  value,
  options,
  onChange,
  placeholder = "Select...",
  className = "",
}: SearchableDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState(value);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearch(value);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        // On blur, strict check logic:
        // If current search matches an option (case-insensitive), select it.
        // If search is empty, clear selection.
        // Otherwise, revert to the currently selected value.
        const match = options.find(
          (o) => o.toLowerCase() === search.toLowerCase(),
        );

        if (match) {
          if (match !== value) onChange(name, match);
          setSearch(match);
        } else if (search.trim() === "") {
          if (value !== "") onChange(name, "");
          setSearch("");
        } else {
          setSearch(value);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [search, value, name, onChange, options]);

  const filtered = options.filter((opt) =>
    opt.toLowerCase().startsWith(search.toLowerCase()),
  );

  const handleSelect = (opt: string) => {
    onChange(name, opt);
    setSearch(opt);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent triggering row clicks if any
    onChange(name, "");
    setSearch("");
    // Keep focus logic if we want, or just clear
  };

  return (
    <div className={`relative ${className}`} ref={wrapperRef}>
      <div className="relative">
        <input
          type="text"
          className="w-full pl-4 pr-10 py-2.5 bg-zinc-900 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-lg transition-all capitalize"
          placeholder={placeholder}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
        <div className="absolute inset-y-0 right-0 flex items-center px-3 gap-2">
          {search && (
            <button
              type="button"
              onClick={handleClear}
              className="text-zinc-500 hover:text-amber-500 transition-colors cursor-pointer"
              tabIndex={-1}
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          )}
          <FontAwesomeIcon
            icon={faChevronDown}
            className="text-zinc-500 text-xs pointer-events-none"
          />
        </div>
      </div>

      {isOpen && (filtered.length > 0 || search) && (
        <ul className="absolute z-50 w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl shadow-black/40 max-h-60 overflow-y-auto custom-scrollbar">
          {filtered.length > 0 ? (
            filtered.map((opt) => (
              <li
                key={opt}
                className={`px-4 py-2.5 hover:bg-zinc-700 cursor-pointer capitalize text-sm border-b border-zinc-700/50 last:border-0 ${
                  opt === value ? "text-amber-500 font-medium" : "text-zinc-300"
                }`}
                onMouseDown={(e) => {
                  e.preventDefault(); // Prevent blur before click
                  handleSelect(opt);
                }}
              >
                {opt}
              </li>
            ))
          ) : (
            <li className="px-4 py-3 text-zinc-500 text-sm italic">
              No matching options
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchableDropdown;
