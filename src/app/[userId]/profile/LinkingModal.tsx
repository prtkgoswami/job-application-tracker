"use client";
import Modal from "@/components/Modal";
import PasswordInput from "@/components/PasswordInput";
import { logAnalyticsEvent } from "@/lib/analytics";
import { auth } from "@/lib/firebase";
import { faAsterisk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  EmailAuthProvider,
  GoogleAuthProvider,
  linkWithCredential,
  linkWithPopup,
} from "firebase/auth";
import React, { ChangeEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";

type Props = {
  linkMode: "emailPassword" | "google" | null;
  onClose: () => void;
};

const LinkingModal = ({ linkMode, onClose }: Props) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<{
    password?: string;
    "confirm-password"?: string;
  }>({});

  const handleEmailPasswordLink = async (pwd: string) => {
    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        throw new Error("No authenticated user");
      }

      const creds = EmailAuthProvider.credential(user.email, pwd);
      await linkWithCredential(user, creds);
      logAnalyticsEvent("link_account_successful", {
        method: linkMode,
      });
      toast.success("Email Linked Successfully")
      onClose()
    } catch (err) {
      console.error("Failed to Link Email-Password Auth Method", err);
      toast.error("Failed to Link Account");
      logAnalyticsEvent("link_account_failed", {
        method: linkMode,
      });
    }
  };

  const handleGoogleLink = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("No authenticated user");
      }

      const googleProvider = new GoogleAuthProvider();
      await linkWithPopup(user, googleProvider);
      logAnalyticsEvent("link_account_successful", {
        method: linkMode,
      });
      toast.success("Google Account Linked Successfully")
      onClose()
    } catch (err) {
      console.error("Failed to Link Email-Password Auth Method", err);
      toast.error("Failed to Link Account");
      logAnalyticsEvent("link_account_failed", {
        method: linkMode,
      });
    }
  };

  const handleYes = () => {
    if (linkMode === "emailPassword") {
      void handleEmailPasswordLink(password);
    } else if (linkMode === "google") {
      void handleGoogleLink();
    }
  };

  const handleClose = () => {
    logAnalyticsEvent("link_account_cancelled", {
      method: linkMode,
    });
    onClose();
  };

  const handleComparePasswords = (e: ChangeEvent<HTMLInputElement>) => {
    setPasswordErrors({});

    if (password !== confirmPassword) {
      setPasswordErrors({
        password: "Passwords Don't Match",
        "confirm-password": "Passwords Don't Match",
      });
      return;
    }
  };

  useEffect(() => {
    if (linkMode !== null) {
      logAnalyticsEvent("link_account_modal_show", {
        method: linkMode,
      });
    }
  }, [linkMode]);

  return (
    <Modal
      isVisible={linkMode !== null}
      onClose={handleClose}
      modalClasses="md:w-2/5 flex flex-col items-center"
      bodyClasses="px-5 pb-5 flex flex-col items-center gap-8"
    >
      {linkMode === "google" && (
        <h3 className="text-2xl text-gray-800 text-center">
          Are you sure you want to link your Google Account?
        </h3>
      )}
      {linkMode === "emailPassword" && (
        <div className="flex flex-col items-center gap-8 md:mb-4">
          <h3 className="text-2xl text-gray-800 text-center mb-2">
            Are you sure you want to link your Email & Password?
          </h3>

          <div className="flex flex-col gap-6 items-center border-2 border-gray-300 text-gray-800 text-left rounded-lg pt-5 py-8 w-full md:w-5/6">
            <p className="text-lg">Set a password of choice</p>
            <div className="w-[90%] md:w-[80%]">
              <p className="w-full flex items-start">
                Password{" "}
                <FontAwesomeIcon
                  icon={faAsterisk}
                  size="xs"
                  className="text-red-600"
                />
              </p>
              <PasswordInput
                name="password"
                onChange={(e) => {
                  setPasswordErrors({});
                  setPassword(e.target.value);
                }}
                autocomplete="new-password"
                required
                placeholder="Password"
                className={`pr-2 text-gray-800 border-b ${
                  passwordErrors["password"]
                    ? "border-red-500"
                    : "border-gray-800"
                }`}
                focusClassNames="focus-within:border-cyan-500"
                buttonClassNames="text-gray-500"
              />
              {passwordErrors["password"] && (
                <p className="text-sm text-red-600 mt-2">
                  ERROR: {passwordErrors["password"]}
                </p>
              )}
            </div>
            <div className="w-[90%] md:w-[80%]">
              <p className="w-full flex items-start">
                Confirm Password{" "}
                <FontAwesomeIcon
                  icon={faAsterisk}
                  size="xs"
                  className="text-red-600"
                />
              </p>
              <PasswordInput
                name="confirm-password"
                onChange={(e) => {
                  setPasswordErrors({});
                  setConfirmPassword(e.target.value);
                }}
                onBlur={handleComparePasswords}
                autocomplete="new-password"
                required
                placeholder="Password"
                className={`pr-2 text-gray-800 border-b ${
                  passwordErrors["confirm-password"]
                    ? "border-red-500"
                    : "border-gray-800"
                }`}
                focusClassNames="focus-within:border-cyan-500"
                buttonClassNames="text-gray-500"
              />
              {passwordErrors["confirm-password"] && (
                <p className="text-sm text-red-600 mt-2">
                  ERROR: {passwordErrors["confirm-password"]}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col md:flex-row justify-end gap-4 w-[80%]">
        <button
          type="button"
          className="px-8 py-4 md:py-2 w-full bg-amber-400 disabled:bg-gray-300 text-gray-800 hover:bg-amber-500 transition-colors duration-200 ease-in-out text-lg rounded-lg cursor-pointer disabled:cursor-not-allowed"
          onClick={handleYes}
          disabled={
            linkMode === "emailPassword" && (!password || !confirmPassword || Object.entries(passwordErrors).length > 0)
          }
        >
          Yes
        </button>
        <button
          type="button"
          className="px-8 py-4 md:py-2 w-full border-2 border-amber-400 text-gray-800 hover:bg-amber-300 transition-colors duration-200 ease-in-out text-lg rounded-lg cursor-pointer"
          onClick={handleClose}
        >
          No
        </button>
      </div>
    </Modal>
  );
};

export default LinkingModal;
