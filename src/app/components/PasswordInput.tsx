"use client";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

type PasswordInputProps = {
  value?: string;
  name: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  autocomplete?: React. HTMLInputAutoCompleteAttribute;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const PasswordInput = ({
  value,
  name,
  className,
  disabled = false,
  required = false,
  placeholder,
  autocomplete,
  onChange,
  onBlur
}: PasswordInputProps) => {
  const [isPwdVisible, setIsPwdVisible] = useState(false);

  const togglePwdVisible = () => {
    setIsPwdVisible((prev) => !prev);
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <input
        className="grow focus-visible:outline-none"
        type={isPwdVisible ? "text" : "password"}
        name={name}
        value={value}
        disabled={disabled}
        required={required}
        placeholder={placeholder}
        autoComplete={autocomplete}
        onChange={onChange}
        onBlur={onBlur}
      />
      <button type="button" className="cursor-pointer text-gray-100/60" onClick={togglePwdVisible}>
        <FontAwesomeIcon icon={isPwdVisible ? faEyeSlash : faEye} />
      </button>
    </div>
  );
};

export default PasswordInput;
