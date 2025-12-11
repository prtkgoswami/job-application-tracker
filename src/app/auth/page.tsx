"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@lib/firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import ForgotPasswordModal from "./ForgotPasswordModal";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { logAnalyticsEvent, setAnalyticsUserId } from "@lib/analytics";
import { getDifferenceFromNow } from "@lib/date";
import Image from "next/image";

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

  const handleLoginClick = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    setIsLoading(true);

    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      toast.success("User logged in");

      // Analytics
      setAnalyticsUserId(userCred.user.uid);
      logAnalyticsEvent("user_returned", {
        days_since_last_visit: userCred.user.metadata.lastSignInTime
          ? Math.floor(
              getDifferenceFromNow(
                new Date(userCred.user.metadata.lastSignInTime)
              ) /
                (1000 * 3600 * 24)
            )
          : "unknown",
        timestamp: serverTimestamp(),
      });

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
      const user = userCred.user;

      await sendEmailVerification(user);

      const displayName = `${firstName} ${lastName}`.trim();
      if (displayName) {
        await updateProfile(user, { displayName });
      }

      const userPayload = {
        name: displayName,
        email: email,
        targetApplicationPerDay: 0,
        archiveDate: serverTimestamp(),
        hasSeenWelcome: false,
      };
      const docRef = doc(db, "users", user.uid);
      await setDoc(docRef, userPayload);

      toast.success("User successfully Registerred");

      // Analytics
      setAnalyticsUserId(user.uid);
      logAnalyticsEvent("account_created", {
        signup_method: "email",
        timestamp: serverTimestamp(),
      });

      router.push(`/${user.uid}/jobs`);
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
          {/* <h3 className="text-gray-800 text-shadow-lg text-shadow-amber-600 font-semibold text-6xl mb-8">
            JobTrackr
          </h3> */}
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
            isLoading={isLoading}
            onRegisterClick={() => setAuthMode("register")}
            onForgotPasswordClick={() => setShowResetPasswordModal(true)}
            onLogin={handleLoginClick}
          />
        </div>
        <div>
          <RegisterForm
            isLoading={isLoading}
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
              isLoading={isLoading}
              onRegisterClick={() => setAuthMode("register")}
              onForgotPasswordClick={() => setShowResetPasswordModal(true)}
              onLogin={handleLoginClick}
            />
          )}
          {authMode === "register" && (
            <RegisterForm
              isLoading={isLoading}
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
