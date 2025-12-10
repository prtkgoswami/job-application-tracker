"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { FirebaseError } from "firebase/app";
import ForgotPasswordModal from "./ForgotPasswordModal";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import Image from "next/image";
import { loginWithEmailPassword, registerWithEmailPassword } from "@lib/auth";
import { signInWithGoogle } from "@lib/googleAuth";

const LOGIN_SUBTITLES = [
  "Continue your job search journey",
  "Your next opportunity is waiting",
  "Pick up right where you left off",
  "Your career progress awaits",
  "Let's keep the momentum going",
  "Your applications are waiting",
];
const REGISTER_SUBTITLES = [
  "Start tracking your job applications today",
  "Organize your job search in one place",
  "Your dream job journey begins here",
  "Track applications, stay organized, land your dream job",
  "Take control of your job hunt today",
  "Never lose track of an opportunity again",
];

const AuthPage = () => {
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const router = useRouter();
  const randomIndex = Math.floor(Math.random() * LOGIN_SUBTITLES.length);

  const handleLoginClick = async (
    mode: "email" | "google",
    payload?: { email: string; password: string }
  ) => {
    if (mode === "email") {
      setIsLoading(true);
    }

    try {
      let user: User | null = null;

      if (mode === "email" && payload) {
        const { email, password } = payload;
        user = await loginWithEmailPassword(email, password);
      } else {
        user = await signInWithGoogle();
      }

      if (!user) {
        throw new Error("User Not Found");
      }

      router.push(`/${user.uid}/jobs`);
    } catch (err) {
      console.error("Failed to Login", err);
      if (err instanceof FirebaseError) {
        if (err.code === "auth/invalid-credential") {
          toast.error("Login Credentials are invalid");
        } else if (err.code === "auth/popup-closed-by-user") {
          //  Do nothing
        } else {
          toast.error("Failed to Login");
        }
      } else {
        toast.error("Failed to Login");
      }
    } finally {
      if (mode === "email") {
        setIsLoading(false);
      }
    }
  };

  const handleRegisterClick = async (
    mode: "email" | "google",
    payload?: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    }
  ) => {
    setIsLoading(true);

    try {
      let user: User | null = null;

      if (mode === "email" && payload) {
        const { firstName, lastName, email, password } = payload;
        user = await registerWithEmailPassword(
          firstName,
          lastName,
          email,
          password
        );
      } else if (mode === "google") {
        user = await signInWithGoogle();
      }

      if (!user) {
        throw new Error("User could not be created");
      }

      toast.success("User successfully Registerred");
      router.push(`/${user.uid}/jobs`);
    } catch (err) {
      console.error("Failed to Register", err);
      if (err instanceof FirebaseError) {
        if (err.code === "auth/popup-closed-by-user") {
          //  Do nothing
        } else {
      toast.error((err as Error).message || "Failed to Register");
        }
      } else {
      toast.error("Failed to Register");
      }
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

  const renderCover = (authMode: "login" | "register") => {
    return (
      <div className={`w-full h-full relative`}>
        <div className="w-full h-full relative">
          <Image
            src="/auth_bg.jpg"
            alt="Auth Page Background"
            fill
            className="object-cover object-center"
          />
        </div>
        <div className="absolute left-0 top-0 w-full h-full flex flex-col gap-3 justify-center items-center px-8 z-20">
          <h1 className="text-gray-800 text-shadow-lg text-shadow-amber-600 text-6xl uppercase font-bold select-none text-center mb-5">
            {authMode === "login" ? "Welcome Back" : "Let's Get Started"}
          </h1>
          <h4 className="text-gray-800 text-3xl font-extralight select-none text-center text-shadow-lg text-shadow-amber-600">
            {authMode === "login"
              ? LOGIN_SUBTITLES[randomIndex]
              : REGISTER_SUBTITLES[randomIndex]}
          </h4>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="hidden md:grid grid-cols-2 min-h-screen relative">
        <div>
          <LoginForm
            isLoading={authMode === "login" && isLoading}
            onRegisterClick={() => setAuthMode("register")}
            onForgotPasswordClick={() => setShowResetPasswordModal(true)}
            onLogin={handleLoginClick}
          />
        </div>
        <div>
          <RegisterForm
            isLoading={authMode === "register" && isLoading}
            onLoginClick={() => setAuthMode("login")}
            onRegister={handleRegisterClick}
          />
        </div>
        <div
          className={`absolute top-0 left-0 w-1/2 h-full transition-transform duration-500 bg-amber-500 ease-out ${
            authMode === "login" ? "translate-x-full" : "translate-x-0"
          }`}
        >
          {renderCover(authMode)}
        </div>
      </div>

      <div className="md:hidden min-h-screen flex flex-col p-5">
        <div className="w-full h-full grow flex flex-col justify-center items-center">
          {authMode === "login" && (
            <LoginForm
              isLoading={authMode === "login" && isLoading}
              onRegisterClick={() => setAuthMode("register")}
              onForgotPasswordClick={() => setShowResetPasswordModal(true)}
              onLogin={handleLoginClick}
            />
          )}
          {authMode === "register" && (
            <RegisterForm
              isLoading={authMode === "register" && isLoading}
              onLoginClick={() => setAuthMode("login")}
              onRegister={handleRegisterClick}
            />
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
