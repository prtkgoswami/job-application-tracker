'use client';

import { useState, useRef, useEffect } from 'react';

type Props = {
  options: string[];
  value: string;
  placeholder?: string;
  onChange: (option: string) => void;
}

const Dropdown = ({ options, value, onChange, placeholder = 'Select...' }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(value);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: string) => {
    setSelected(option);
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 bg-transparent text-gray-100 rounded-lg flex items-center justify-between hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        <span>{selected || placeholder}</span>
        <svg
          className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleSelect(option)}
              className={`
                px-4 py-2 cursor-pointer transition-colors
                ${selected === option 
                  ? 'bg-blue-500 text-white font-semibold' 
                  : 'text-gray-800 hover:bg-blue-100 hover:text-blue-900'
                }
              `}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;