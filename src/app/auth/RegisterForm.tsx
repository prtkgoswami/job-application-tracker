"use client";
import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import PasswordInput from "../components/PasswordInput";

type RegisterFormProps = {
  isLoading: boolean;
  onLoginClick: () => void;
  onRegister: (e: React.FormEvent<HTMLFormElement>) => void;
};

const RegisterForm = ({
  onLoginClick,
  onRegister,
  isLoading,
}: RegisterFormProps) => {
  const [formError, setFormError] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);

  const handleRegisterClick = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (Object.entries(formError).length > 0) return;

    onRegister(e);
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!formRef.current) return;

    const confirmPwd = e.target.value;
    const pwd = formRef.current.password.value;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, "confirm-password": _, ...restErrors } = formError;

    if (confirmPwd !== pwd) {
      setFormError({
        ...restErrors,
        password: "Passwords do not match",
        "confirm-password": "Passwords do not match",
      });
    } else {
      setFormError(restErrors);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-5">
      <form
        className="flex flex-col items-center gap-4 w-full md:w-3/5"
        onSubmit={handleRegisterClick}
        ref={formRef}
      >
        <input
          type="text"
          name="first-name"
          id=""
          placeholder="First Name"
          className="px-4 py-2 border-b border-gray-50 w-4/5"
          required
        />
        <input
          type="text"
          name="last-name"
          id=""
          placeholder="Last Name"
          className="px-4 py-2 border-b border-gray-50 w-4/5"
          required
        />
        <input
          type="email"
          name="email"
          id=""
          placeholder="Email"
          className="px-4 py-2 border-b border-gray-50 w-4/5"
          required
        />
        <PasswordInput
          name="password"
          placeholder="Password"
          className={`px-4 py-2 w-4/5 ${
            formError && formError.password
              ? "border border-red-500"
              : "border-b border-gray-50"
          }`}
          required
        />
        {Object.keys(formError).includes("password") && (
          <p className="text-xs text-red-500 text-left">
            Error:: {formError.password}
          </p>
        )}
        <PasswordInput
          name="confirm-password"
          placeholder="Confirm Password"
          className={`px-4 py-2 w-4/5 ${
            formError && formError.password
              ? "border border-red-500"
              : "border-b border-gray-50"
          }`}
          required
          onBlur={handleConfirmPasswordChange}
        />
        {Object.keys(formError).includes("confirm-password") && (
          <p className="text-xs text-red-500 text-left">
            Error:: {formError["confirm-password"]}
          </p>
        )}
        <button
          type="submit"
          className="mt-5 w-full px-5 py-3 cursor-pointer border-2 border-gray-50 hover:bg-gray-100 hover:text-gray-800 transition-colors duration-200 ease-in-out rounded-md"
        >
          Register {isLoading && <FontAwesomeIcon icon={faSpinner} spin />}
        </button>
      </form>
      <div className="text-sm text-gray-200">
        Already Registerred?{" "}
        <span className="text-blue-400 cursor-pointer" onClick={onLoginClick}>
          Login Here
        </span>
      </div>
    </div>
  );
};

export default RegisterForm;