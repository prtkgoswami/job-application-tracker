"use client";
import PasswordInput from "@/components/PasswordInput";
import {
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FirebaseError } from "firebase/app";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  User,
} from "firebase/auth";
import React, { useState } from "react";
import { toast } from "react-toastify";

type Props = {
    user: User;
}

const ChangePasswordSection = ({user}: Props) => {
  const [passwordChangeErrors, setPasswordChangeErrors] = useState<{
    currPassword?: string;
    newPwd?: string;
    confirmPwd?: string;
  }>({});
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const changePwdform = e.currentTarget;

    const formData = new FormData(e.currentTarget);
    const currPassword = formData.get("currPassword")?.toString() ?? "";
    const newPwd = formData.get("newPassword")?.toString() ?? "";
    const confirmPwd = formData.get("confirmPassword")?.toString() ?? "";

    let errors: {
      currPassword?: string;
      newPwd?: string;
      confirmPwd?: string;
    } = {};

    if(!user || !user.email) {
        return;
    }

    if (!currPassword) {
      errors["currPassword"] = "Current password Required";
    }

    if (!newPwd) {
      errors["newPwd"] = "New password Required";
    }

    if (!confirmPwd) {
      errors["confirmPwd"] = "Confirm password Required";
    }

    if (newPwd && confirmPwd && newPwd !== confirmPwd) {
      errors = {
        ...errors,
        newPwd: "Passwords do not Match",
        confirmPwd: "Passwords do not Match",
      };
    }

    setPasswordChangeErrors(errors);
    if (Object.entries(errors).length > 0) return;

    if (currPassword === newPwd) {
      console.error("Failed to Change Password: Password already in use");
      toast.error("Password already in use");
      return;
    }

    try {
      setIsChangingPassword(true);
      const cred = EmailAuthProvider.credential(
        user.email,
        currPassword
      );
      await reauthenticateWithCredential(user, cred);

      await updatePassword(user, newPwd);

      toast.success("Successfully Changed Password");
      changePwdform.reset();
    } catch (err) {
      console.error("Failed to Change Password", err);

      if (err instanceof FirebaseError) {
        if (
          err.code === "auth/wrong-password" ||
          err.code === "auth/invalid-credential"
        ) {
          toast.error("Current Password is Incorrect");
        } else {
          toast.error("Failed to Change Password");
        }
      } else {
        toast.error("Failed to Change Password");
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="md:col-span-2 border border-gray-50/50 p-5 rounded-xl mt-5">
                <h4 className="text-base md:text-lg uppercase font-light mb-5">
                  Change Password
                </h4>
                <form
                  className="flex flex-col md:grid grid-cols-2 items-start gap-y-4"
                  onSubmit={handlePasswordChange}
                  autoComplete="off"
                >
                  <>
                    <p className="text-base md:text-lg text-amber-400 pt-2">
                      Current Password
                    </p>
                    <div className="flex flex-col gap-1 w-full">
                      <PasswordInput
                        name="currPassword"
                        className={`pr-2 border ${
                          passwordChangeErrors["currPassword"]
                            ? "border-red-500"
                            : "border-gray-100/40"
                        }`}
                        autocomplete="new-password"
                      />
                      {passwordChangeErrors["currPassword"] && (
                        <p className="text-right text-xs text-red-500">
                          {passwordChangeErrors["currPassword"]}
                        </p>
                      )}
                    </div>
                  </>
    
                  <>
                    <p className="text-base md:text-lg text-amber-400 pt-2">
                      New Password
                    </p>
                    <div className="flex flex-col gap-1 w-full">
                      <PasswordInput
                        name="newPassword"
                        className={`pr-2 border ${
                          passwordChangeErrors["newPwd"]
                            ? "border-red-500"
                            : "border-gray-100/40"
                        }`}
                        autocomplete="new-password"
                      />
                      {passwordChangeErrors["newPwd"] && (
                        <p className="text-right text-xs text-red-500">
                          {passwordChangeErrors["newPwd"]}
                        </p>
                      )}
                    </div>
                  </>
    
                  <>
                    <p className="text-base md:text-lg text-amber-400 pt-2">
                      Confirm Password
                    </p>
                    <div className="flex flex-col gap-1 w-full">
                      <PasswordInput
                        name="confirmPassword"
                        className={`pr-2 border ${
                          passwordChangeErrors["confirmPwd"]
                            ? "border-red-500"
                            : "border-gray-100/40"
                        }`}
                        autocomplete="new-password"
                      />
                      {passwordChangeErrors["confirmPwd"] && (
                        <p className="text-right text-xs text-red-500">
                          {passwordChangeErrors["confirmPwd"]}
                        </p>
                      )}
                    </div>
                  </>
    
                  <div className="col-span-2 flex justify-center md:justify-end mt-5 w-full">
                    <button
                      type="submit"
                      className="px-8 py-2 bg-amber-400 text-gray-800 hover:bg-amber-500 transition-colors duration-200 ease-in-out text-lg rounded-lg cursor-pointer"
                      disabled={isChangingPassword}
                    >
                      {isChangingPassword ? (
                        <FontAwesomeIcon icon={faSpinner} spin />
                      ) : (
                        "Change Password"
                      )}
                    </button>
                  </div>
                </form>
              </div>
  )
}

export default ChangePasswordSection