"use client";
import ClickToCopyText from "@/app/components/ClickToCopyText";
import PasswordInput from "@/app/components/PasswordInput";
import useUser from "@/app/hooks/useUser";
import { getDateInputString } from "@/app/lib/date";
import { db } from "@/app/lib/firebase";
import { User as UserType } from "@/app/types/user";
import {
  faFloppyDisk,
  faPen,
  faSpinner,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FirebaseError } from "firebase/app";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  User,
} from "firebase/auth";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import React, { useState } from "react";
import { toast } from "react-toastify";

const ProfilePageContent = ({
  initialData,
  user,
}: {
  initialData: UserType;
  user: User;
}) => {
  const [profileData, setProfileData] = useState<UserType>(initialData);
  const [inEditMode, setInEditMode] = useState(false);
  const [passwordChangeErrors, setPasswordChangeErrors] = useState<{
    currPassword?: string;
    newPwd?: string;
    confirmPwd?: string;
  }>({});
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (!name || !value) return;

    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleEditMode = () => {
    setInEditMode((prev) => !prev);
  };

  const handleSaveClick = async () => {
    try {
      const payload = {
        name: profileData.name,
        email: profileData.email,
        targetApplicationPerDay: profileData.targetApplicationPerDay,
        archiveDate: Timestamp.fromDate(new Date(profileData.archiveDate)),
      };

      const col = doc(db, "users", profileData.uid);
      await setDoc(col, payload);
      toast.success("Successfully saved Profile");
      setInEditMode(false);
    } catch (err) {
      console.error("Failed to save User Details", err);
      toast.error("Failed to save Profile");
    }
  };

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
        profileData.email,
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
    <div className="w-full px-5 py-5 md:p-10 flex flex-col items-center gap-8 md:gap-15">
      <div className="w-full flex justify-between items-center">
        <h1 className="uppercase text-2xl md:text-3xl font-light text-amber-400">
          Profile
        </h1>
        <div className="hidden md:flex gap-5 items-center">
          {inEditMode ? (
            <>
              <button
                className="text-lg py-2 px-8 border border-gray-100 hover:bg-amber-400 hover:text-gray-800 hover:border-amber-600 transition-colors duration-200 ease-in-out rounded-md cursor-pointer"
                onClick={toggleEditMode}
              >
                Cancel
              </button>
              <button
                className="text-lg py-2 px-8 border border-gray-100 hover:bg-amber-400 hover:text-gray-800 hover:border-amber-600 transition-colors duration-200 ease-in-out rounded-md cursor-pointer"
                onClick={handleSaveClick}
              >
                Save
              </button>
            </>
          ) : (
            <button
              className="text-lg py-2 px-8 border border-gray-100 hover:bg-amber-400 hover:text-gray-800 hover:border-amber-600 transition-colors duration-200 ease-in-out rounded-md cursor-pointer"
              onClick={toggleEditMode}
            >
              Edit
            </button>
          )}
        </div>
        <div className="md:hidden flex gap-5 items-center">
          {inEditMode ? (
            <>
              <button className="text-lg" onClick={toggleEditMode}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
              <button className="text-lg" onClick={handleSaveClick}>
                <FontAwesomeIcon icon={faFloppyDisk} />
              </button>
            </>
          ) : (
            <button className="text-lg" onClick={toggleEditMode}>
              <FontAwesomeIcon icon={faPen} />
            </button>
          )}
        </div>
      </div>

      <section className="w-full md:w-4/5">
        <div className="text-amber-500 text-xl md:text-2xl md:px-4 pb-4 border-b border-amber-400 mb-5">
          Account Preferences
        </div>
        <div className="grid md:grid-cols-2 items-center gap-y-4 md:px-4">
          <>
            <p className="text-base md:text-lg text-amber-400">User ID</p>
            <ClickToCopyText
              textToCopy={profileData.uid}
              successToastMsg="User ID copied to Clipboard"
              failureToastMsg="Could not copy User ID to Clipboard"
            >
              <p className="px-3 py-2 border text-gray-100/60 border-gray-100/40 focus-visible:outline-none focus-visible:border-amber-400 w-full">
                {profileData.uid}
              </p>
            </ClickToCopyText>
          </>
          <>
            <p className="text-base md:text-lg text-amber-400">Full Name</p>
            <input
              type="text"
              name="name"
              className="px-3 py-2 border border-gray-100/40 focus-visible:outline-none focus-visible:border-amber-400"
              value={profileData.name}
              onChange={handleChange}
              disabled={!inEditMode}
            />
          </>
          <>
            <p className="text-base md:text-lg text-amber-400">Email</p>
            <input
              type="text"
              name="email"
              className="px-3 py-2 border border-gray-100/40 focus-visible:outline-none focus-visible:border-amber-400"
              value={profileData.email}
              onChange={handleChange}
              disabled={!inEditMode}
            />
          </>

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
                    className={`px-3 py-2 border ${
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
                    className={`px-3 py-2 border ${
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
                    className={`px-3 py-2 border ${
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
        </div>
      </section>

      <section className="w-full md:w-4/5">
        <div className="text-amber-500 text-xl md:text-2xl md:px-4 pb-4 border-b border-amber-400 mb-5">
          Platform Preferences
        </div>
        <div className="grid md:grid-cols-2 items-start gap-y-4 px-4">
          <>
            <div className="flex flex-col gap-1">
              <p className="text-base md:text-lg text-amber-400 pt-2">
                Target per Day
              </p>
              <p className="text-xs md:text-sm text-gray-400">
                Goal for Applications per Day
              </p>
            </div>
            <input
              type="number"
              name="targetApplicationPerDay"
              className="px-3 py-2 border border-gray-100/40 focus-visible:outline-none focus-visible:border-amber-400"
              value={profileData.targetApplicationPerDay}
              onChange={handleChange}
              disabled={!inEditMode}
            />
          </>
          {profileData.archiveDate && (
            <>
              <div className="flex flex-col gap-1">
                <p className="text-base md:text-lg text-amber-400 pt-2">
                  Archive Date
                </p>
                <p className="text-xs md:text-sm text-gray-400">
                  Applications before this date will be archived
                </p>
              </div>
              <input
                type="date"
                name="archiveDate"
                className="px-3 py-2 border border-gray-100/40 focus-visible:outline-none focus-visible:border-amber-400"
                value={getDateInputString(new Date(profileData.archiveDate))}
                onChange={handleChange}
                disabled={!inEditMode}
              />
            </>
          )}
        </div>
      </section>
    </div>
  );
};

const ProfilePage = () => {
  const { data, user, isLoading, error } = useUser();

  if (error) {
    toast.error("Failed to fetch User Profile")
  }

  if(isLoading) {
    <div className="min-h-screen w-full flex justify-center items-center gap-3">
      <FontAwesomeIcon icon={faSpinner} spin size="2x" />
      <p className="text-2xl text-gray-100 animate-pulse">Loading...</p>
    </div>
  }

  if (!data || !user) return <></>;

  return <ProfilePageContent initialData={data} user={user} />;
};

export default ProfilePage;
