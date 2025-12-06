"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/app/lib/firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import {
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import PasswordInput from "../components/PasswordInput";
import { FirebaseError } from "firebase/app";
import ForgotPasswordModal from "./ForgotPasswordModal";

type RegisterFormProps = {
  isLoading: boolean;
  onLoginClick: () => void;
  onRegister: (e: React.FormEvent<HTMLFormElement>) => void;
};

type LoginFormProps = {
  isLoading: boolean;
  onRegisterClick: () => void;
  onForgotPasswordClick: () => void;
  onLogin: (e: React.FormEvent<HTMLFormElement>) => void;
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
          className="px-4 py-2 border-b border-gray-50 w-4/5"
          required
        />
        <PasswordInput
          name="password"
          placeholder="Password"
          className="px-4 py-2 border-b border-gray-50 w-4/5"
          required
        />
        <button
          type="submit"
          className="mt-5 px-5 py-3 w-full cursor-pointer border-2 border-gray-50 hover:bg-gray-100 hover:text-gray-800 transition-colors duration-200 ease-in-out rounded-md"
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

const AuthPage = () => {
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const router = useRouter();

  const handleLoginClick = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    setIsLoading(true);

    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      router.push(`/${userCred.user.uid}/jobs`);
    } catch (err) {
      console.error("Failed to Login", err);
      if (err instanceof FirebaseError) {
        if (err.code === "auth/invalid-credential") {
          toast.error("Login Credentials are invalid");
        } else {
          toast.error("Failed to Login");
        }
      } else {
          toast.error("Failed to Login");
        }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterClick = async (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);

    const firstName = String(formData.get("first-name") || "");
    const lastName = String(formData.get("last-name") || "");
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    setIsLoading(true);

    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const displayName = `${firstName} ${lastName}`.trim();
      if (displayName) {
        await updateProfile(userCred.user, { displayName });
      }

      const userPayload = {
        name: displayName,
        email: email,
        targetApplicationPerDay: 0,
        archiveDate: serverTimestamp(),
      };
      const docRef = doc(db, "users", userCred.user.uid);
      await setDoc(docRef, userPayload);

      router.push(`/${userCred.user.uid}/jobs`);
    } catch (err) {
      console.error("Failed to Register", err);
      toast.error((err as Error).message || "Failed to Register");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace(`/${user.uid}/jobs`);
      } else {
        setIsCheckingAuth(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen w-full flex flex-col justify-center items-center">
        <FontAwesomeIcon icon={faSpinner} spin size="5x" />
        <h2 className="text-3xl text-gray-200 animate-pulse mt-8">
          Checking User Auth ...
        </h2>
      </div>
    );
  }

  return (
    <>
      <div className="hidden md:grid grid-cols-2 min-h-screen">
        <div className="w-full h-full flex justify-center items-center">
          {authMode === "login" ? (
            <LoginForm
              isLoading={isLoading}
              onRegisterClick={() => setAuthMode("register")}
              onForgotPasswordClick={() => setShowResetPasswordModal(true)}
              onLogin={handleLoginClick}
            />
          ) : (
            <div className="w-full h-full bg-green-300 flex flex-col gap-2 justify-center items-center">
              <h3 className="text-green-800/60 uppercase font-semibold text-3xl">
                Job Trackr
              </h3>
              <h1 className="text-green-800/30 text-8xl uppercase font-bold select-none">
                Register
              </h1>
            </div>
          )}
        </div>
        <div className="w-full h-full flex justify-center items-center">
          {authMode === "register" ? (
            <RegisterForm
              isLoading={isLoading}
              onLoginClick={() => setAuthMode("login")}
              onRegister={handleRegisterClick}
            />
          ) : (
            <div className="w-full h-full bg-blue-300 flex flex-col gap-2 justify-center items-center">
              <h3 className="text-blue-800/60 uppercase font-semibold text-3xl">
                Job Trackr
              </h3>
              <h1 className="text-blue-800/30 text-8xl uppercase font-bold select-none">
                Login
              </h1>
            </div>
          )}
        </div>
      </div>

      <div className="md:hidden min-h-screen flex flex-col p-5">
        <div className="w-full h-full grow flex flex-col justify-center items-center">
          <h1
            className="text-4xl uppercase font-semibold text-amber-400 text-center"
            style={{ paddingBottom: "30px", lineHeight: "60px" }}
          >
            Job Application Tracker
          </h1>
          {authMode === "login" && (
            <>
              <h3
                className="uppercase text-2xl font-semibold text-gray-100/50"
                style={{ paddingBottom: "30px" }}
              >
                Login
              </h3>
              <LoginForm
                isLoading={isLoading}
                onRegisterClick={() => setAuthMode("register")}
                onForgotPasswordClick={() => setShowResetPasswordModal(true)}
                onLogin={handleLoginClick}
              />
            </>
          )}
          {authMode === "register" && (
            <>
              <h3
                className="uppercase text-2xl font-semibold text-gray-100/50"
                style={{ paddingBottom: "30px" }}
              >
                Register
              </h3>
              <RegisterForm
                isLoading={isLoading}
                onLoginClick={() => setAuthMode("login")}
                onRegister={handleRegisterClick}
              />
            </>
          )}
        </div>
      </div>

      <ForgotPasswordModal
        isVisible={showResetPasswordModal}
        onClose={() => setShowResetPasswordModal(false)}
      />
    </>
  );
};

export default AuthPage;
