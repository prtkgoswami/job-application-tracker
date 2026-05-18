"use client";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import PasswordInput from "@components/PasswordInput";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

type LoginFormProps = {
  isLoading?: boolean;
  onRegisterClick: () => void;
  onForgotPasswordClick: () => void;
  onLogin: (
    mode: "email" | "google",
    payload?: { email: string; password: string }
  ) => void;
};

const LoginForm = ({
  onRegisterClick,
  onLogin,
  onForgotPasswordClick,
  isLoading,
}: LoginFormProps) => {
  const handleLoginClick = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    onLogin("email", { email, password });
  };

  const handleLoginWithGoogleClick = () => {
    onLogin("google");
  };

  return (
    <div className="w-full h-full flex flex-col justify-between items-center grow relative">
        {isLoading && (
          <div className="absolute top-0 left-0 h-full w-full flex justify-center items-center bg-black/40 z-100">
            <div className="w-max flex flex-col gap-4 items-center bg-accent-1 px-3 py-8 rounded-lg text-background">
              <FontAwesomeIcon
                icon={faSpinner}
                size="4x"
                className="animate-spin"
              />
              <p className="text-lg font-semibold">Logging In User</p>
            </div>
          </div>
        )}

      <div className="w-full grow flex flex-col gap-5 items-center">
        <h3 className="text-accent-1 font-extralight text-6xl mt-30 md:mb-5">
          JobTrackr
        </h3>

        <h3
          className="uppercase text-2xl font-extralight text-accent-3 md:hidden"
          style={{ paddingBottom: "30px" }}
        >
          Login
        </h3>


        <form
          className="flex flex-col gap-4 items-center w-full md:w-3/5"
          onSubmit={handleLoginClick}
        >
          <input
            type="email"
            name="email"
            id=""
            placeholder="Email"
            className="px-4 py-2 border-b border-foreground w-4/5 focus-within:outline-none"
            required
          />
          <PasswordInput
            name="password"
            placeholder="Password"
            className="border-b border-foreground w-4/5"
            required
          />
        <div
          className="text-accent-3 text-sm cursor-pointer text-right w-4/5"
          onClick={onForgotPasswordClick}
        >
          Forgot Password
        </div>
          <button
            type="submit"
            className="mt-1 px-5 py-3 w-full font-semibold cursor-pointer border-2 border-accent-3 hover:border-accent-1 hover:bg-accent-2 hover:text-gray-800 transition-colors duration-200 ease-in-out rounded-md"
          >
            Login
          </button>
        </form>

        <div className="text-sm text-gray-200">
          New Here?{" "}
          <span
            className="text-accent-3 cursor-pointer"
            onClick={onRegisterClick}
          >
            Register Here
          </span>
        </div>

          <div className="w-[90%] md:w-1/2 flex gap-2 items-center">
            <div className="flex-1 border border-foreground/40 h-0" />
          </div>

          <button
            type="button"
            className="cursor-pointer w-full md:w-1/2 mt-2"
            onClick={handleLoginWithGoogleClick}
          >
            <div className="flex items-center border border-foreground hover:bg-accent-2 hover:border-accent-1 rounded-lg overflow-hidden group transition-colors duration-200 ease-in-out">
              <FontAwesomeIcon
                icon={faGoogle}
                size="lg"
                className="bg-accent-2 text-background py-5 md:py-4 px-5 h-full"
              />
              <p className="pr-4 pl-2 py-4 md:py-2 group-hover:text-background transition-colors duration-200 ease-in-out w-full">
                Login With Google
              </p>
            </div>
          </button>
      </div>

      <div className="flex justify-center gap-2 text-sm h-max items-center text-foreground border-t-2 border-accent-1 w-full md:w-[70%] pt-4 md:pb-4 mt-5 md:mt-2 justify-self-end">
          <Link
            href="/about"
            className="hover:text-accent-3 transition-colors duration-200 ease-in-out"
          >
            About Us
          </Link>
          <div className="h-1 aspect-square rounded-full bg-accent-3" />
          <Link
            href="/privacy"
            className="hover:text-accent-3 transition-colors duration-200 ease-in-out"
          >
            Privacy Policy
          </Link>
        </div>
    </div>
  );
};

export default LoginForm;
