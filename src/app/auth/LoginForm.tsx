"use client";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import PasswordInput from "@components/PasswordInput";
import Link from "next/link";

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
    <div className="w-full h-full flex flex-col justify-between items-center grow">
      <div className="w-full grow flex flex-col gap-5 items-center">
        <h3 className="text-amber-500 font-extralight text-6xl mt-30 md:mb-5">
          JobTrackr
        </h3>

        <h3
          className="uppercase text-2xl font-extralight text-cyan-500 md:hidden"
          style={{ paddingBottom: "30px" }}
        >
          Login
        </h3>
        <form
          className="flex flex-col gap-4 items-center w-full md:w-3/5"
          onSubmit={onLogin}
        >
          <input
            type="email"
            name="email"
            id=""
            placeholder="Email"
            className="px-4 py-2 border-b border-gray-50 w-4/5 focus-within:outline-none focus-within:border-cyan-500"
            required
          />
          <PasswordInput
            name="password"
            placeholder="Password"
            className="border-b border-gray-50 w-4/5"
            focusClassNames="border-cyan-500!"
            required
          />
          <button
            type="submit"
            className="mt-5 px-5 py-3 w-full font-semibold cursor-pointer border-2 border-cyan-500 hover:bg-amber-500 hover:border-cyan-500 hover:text-gray-800 transition-colors duration-200 ease-in-out rounded-md"
          >
            Login {isLoading && <FontAwesomeIcon icon={faSpinner} spin />}
          </button>
        </form>
        <div className="text-sm text-gray-200">
          New Here?{" "}
          <span
            className="text-cyan-500 cursor-pointer"
            onClick={onRegisterClick}
          >
            Register Here
          </span>
        </div>
        <div
          className="text-cyan-500 text-sm cursor-pointer"
          onClick={onForgotPasswordClick}
        >
          Forgot Password
        </div>
      </div>

      <div className="flex justify-center gap-2 text-sm h-max items-center text-gray-100 border-t-2 border-amber-500 w-full md:w-[70%] pt-4 md:pb-4 mt-5 md:mt-2 justify-self-end">
        <Link
          href="/about"
          className="hover:text-cyan-500 transition-colors duration-200 ease-in-out"
        >
          About Us
        </Link>
        <div className="h-1 aspect-square rounded-full bg-amber-500" />
        <Link
          href="/privacy"
          className="hover:text-cyan-500 transition-colors duration-200 ease-in-out"
        >
          Privacy Policy
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
