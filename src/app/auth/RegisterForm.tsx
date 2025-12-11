"use client";
import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import PasswordInput from "@components/PasswordInput";
import Link from "next/link";

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
    <div className="w-full h-full flex flex-col items-center grow">
      <div className="w-full grow flex flex-col items-center gap-5 justify-center">
      <h3 className="text-amber-500 font-extralight text-6xl md:mb-5">
        JobTrackr
      </h3>
      <h3
        className="uppercase text-2xl font-extralight text-cyan-500 md:hidden"
        style={{ paddingBottom: "30px" }}
      >
        Register
      </h3>
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
          className="px-4 py-2 border-b border-gray-50 w-4/5 focus-within:outline-none focus:border-cyan-500"
          required
        />
        <input
          type="text"
          name="last-name"
          id=""
          placeholder="Last Name"
          className="px-4 py-2 border-b border-gray-50 w-4/5 focus-within:outline-none focus:border-cyan-500"
          required
        />
        <input
          type="email"
          name="email"
          id=""
          placeholder="Email"
          className="px-4 py-2 border-b border-gray-50 w-4/5 focus-within:outline-none focus:border-cyan-500"
          required
        />
        <PasswordInput
          name="password"
          placeholder="Password"
          className={`w-4/5 ${
            formError && formError.password
              ? "border border-red-500"
              : "border-b border-gray-50"
          }`}
          focusClassNames="border-cyan-500!"
          autocomplete="new-password"
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
          className={`w-4/5 ${
            formError && formError.password
              ? "border border-red-500"
              : "border-b border-gray-50"
          }`}
          focusClassNames="border-cyan-500!"
          required
          autocomplete="new-password"
          onBlur={handleConfirmPasswordChange}
        />
        {Object.keys(formError).includes("confirm-password") && (
          <p className="text-xs text-red-500 text-left">
            Error:: {formError["confirm-password"]}
          </p>
        )}
        <button
          type="submit"
          className="mt-5 w-full px-5 py-3 font-semibold cursor-pointer border-2 border-cyan-500 hover:bg-amber-400 hover:border-cyan-500 hover:text-gray-800 transition-colors duration-200 ease-in-out rounded-md"
        >
          Register {isLoading && <FontAwesomeIcon icon={faSpinner} spin />}
        </button>
      </form>
      <div className="text-sm text-gray-200">
        Already Registerred?{" "}
        <span className="text-cyan-500 cursor-pointer" onClick={onLoginClick}>
          Login Here
        </span>
      </div>
      </div>
      <div className="flex justify-center gap-2 text-sm h-max items-center text-gray-100 border-t-2 border-amber-500 w-full md:w-[70%] pt-4 md:pb-4 mt-5 md:mt-2 justify-self-end">
        <Link href="/about" className="hover:text-cyan-500">
          About Us
        </Link>
        <div className="h-1 aspect-square rounded-full bg-amber-500" />
        <Link href="/privacy" className="hover:text-cyan-500">
          Privacy Policy
        </Link>
      </div>
    </div>
  );
};

export default RegisterForm;
