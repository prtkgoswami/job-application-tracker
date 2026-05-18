"use client";
import React from "react";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  labelLeft?: string;
  labelRight?: string;
  disabled?: boolean;
}

const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  labelLeft,
  labelRight,
  disabled = false,
}) => {
  const toggleSwitch = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <div className={`flex items-center gap-3 select-none ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}>
      {/* Optional Left Label */}
      {labelLeft && (
        <span 
          className={`text-xs font-semibold tracking-wider uppercase transition-colors duration-200 ${
            !checked && !disabled ? "text-amber-500" : "text-zinc-500"
          }`}
        >
          {labelLeft}
        </span>
      )}

      {/* Track */}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={toggleSwitch}
        className={`relative inline-flex h-6 w-11 shrink-0 rounded-md border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:ring-offset-2 focus:ring-offset-zinc-950 ${
          disabled ? "bg-zinc-800 cursor-not-allowed" : checked ? "bg-amber-500 cursor-pointer" : "bg-zinc-800 cursor-pointer"
        }`}
      >
        <span className="sr-only">
          {labelRight || labelLeft ? `Toggle between ${labelLeft || "off"} and ${labelRight || "on"}` : "Toggle switch"}
        </span>
        
        {/* Thumb */}
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-sm shadow-md ring-0 transition duration-200 ease-in-out ${
            checked 
              ? "translate-x-5 bg-zinc-950" 
              : "translate-x-0 bg-zinc-400"
          }`}
        />
      </button>

      {/* Optional Right Label */}
      {labelRight && (
        <span 
          className={`text-xs font-semibold tracking-wider uppercase transition-colors duration-200 ${
            checked && !disabled ? "text-amber-500" : "text-zinc-500"
          }`}
        >
          {labelRight}
        </span>
      )}
    </div>
  );
};

export default Switch;