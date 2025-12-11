"use client";
import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import PasswordInput from "@components/PasswordInput";

type LoginFormProps = {
  isLoading: boolean;
  onRegisterClick: () => void;
  onForgotPasswordClick: () => void;
  onLogin: (e: React.FormEvent<HTMLFormElement>) => void;
};

const LoginForm = ({
  onRegisterClick,
  onLogin,
  onForgotPasswordClick,
  isLoading,
}: LoginFormProps) => {
  return (
    <div className="w-full flex flex-col items-center gap-5">
      <form
        className="flex flex-col gap-4 items-center w-full md:w-3/5"
        onSubmit={onLogin}
      >
        <input
          type="email"
          name="email"
          id=""
          placeholder="Email"
          className="px-4 py-2 border-b border-gray-50 w-4/5 focus-within:outline-none"
          required
        />
        <PasswordInput
          name="password"
          placeholder="Password"
          className="border-b border-gray-50 w-4/5"
          required
        />
        <button
          type="submit"
          className="mt-5 px-5 py-3 w-full font-semibold cursor-pointer border-2 border-gray-50 hover:bg-amber-400 hover:border-amber-500 hover:text-gray-800 transition-colors duration-200 ease-in-out rounded-md"
        >
          Login {isLoading && <FontAwesomeIcon icon={faSpinner} spin />}
        </button>
      </form>
      <div className="text-sm text-gray-200">
        New Here?{" "}
        <span
          className="text-blue-400 cursor-pointer"
          onClick={onRegisterClick}
        >
          Register Here
        </span>
      </div>
      <div
        className="text-blue-400 text-sm cursor-pointer"
        onClick={onForgotPasswordClick}
      >
        Forgot Password
      </div>
    </div>
  );
};

export default LoginForm;