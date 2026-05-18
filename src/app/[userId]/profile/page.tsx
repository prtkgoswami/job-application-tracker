"use client";
import ClickToCopyText from "@/components/ClickToCopyText";
import useUser from "@/hooks/useUser";
import { getDateInputString } from "@/lib/date";
import { db } from "@/lib/firebase";
import { User as UserType } from "@/types/user";
import {
  faCopy,
  faEnvelope,
  faFloppyDisk,
  faPen,
  faSpinner,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { User } from "firebase/auth";
import { doc, updateDoc, Timestamp } from "firebase/firestore";
import React, { useState } from "react";
import { toast } from "react-toastify";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import ChangePasswordSection from "./ChangePasswordSection";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import LinkingModal from "./LinkingModal";
import Tooltip from "@/components/Tooltip";
import { useApplicationsRefetch } from "@/contexts/ApplicationContext";

const ProfilePageContent = ({
  initialData,
  user,
}: {
  initialData: UserType;
  user: User;
}) => {
  const [profileData, setProfileData] = useState<UserType>(initialData);
  const [inEditMode, setInEditMode] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [linkMode, setLinkMode] = useState<"emailPassword" | "google" | null>(
    null
  );
  const {triggerRefetch} = useApplicationsRefetch();

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
      await updateDoc(col, payload);
      toast.success("Successfully saved Profile");
      setInEditMode(false);
      triggerRefetch();
    } catch (err) {
      console.error("Failed to save User Details", err);
      toast.error("Failed to save Profile");
    }
  };

  const providers = user.providerData;
  const isEmailChecked =
    providers.filter((p) => p.providerId === "password").length > 0;
  const isGoogleChecked =
    providers.filter((p) => p.providerId === "google.com").length > 0;

  return (
    <div className="w-full flex flex-col items-center gap-5 pb-12">
      <div className="w-full flex justify-between items-center px-3 py-2 md:px-5 pt-5">
        <h1 className="uppercase text-xl md:text-2xl font-light text-accent-1">
          Profile
        </h1>
        <div className="hidden md:flex gap-5 items-center">
          {inEditMode ? (
            <>
              <button
                className="py-2 px-8 border text-foreground/60 border-foreground/60 hover:text-foreground/80 hover:border-foreground/80 transition-colors duration-200 ease-in-out rounded-md cursor-pointer"
                onClick={toggleEditMode}
              >
                Cancel
              </button>
              <button
                className="py-2 px-10 border text-accent-1 border-accent-1 hover:bg-accent-1 hover:text-background transition-colors duration-200 ease-in-out rounded-md cursor-pointer"
                onClick={handleSaveClick}
              >
                Save
              </button>
            </>
          ) : (
            <button
              className="py-2 px-10 border text-accent-1 border-accent-1 hover:bg-accent-1 hover:text-background transition-colors duration-200 ease-in-out rounded-md cursor-pointer"
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
        <div className="text-accent-1 text-xl md:text-2xl md:px-4 pb-4 border-b border-accent-1 mb-5">
          Account Preferences
        </div>
        <div className="grid md:grid-cols-2 items-center gap-y-4 md:px-4">
          <>
            <p className="text-base md:text-lg text-accent-1">User ID</p>
            <ClickToCopyText
              textToCopy={profileData.uid}
              successToastMsg="User ID copied to Clipboard"
              failureToastMsg="Could not copy User ID to Clipboard"
            >
              <div className="px-3 py-2 border text-foreground/50 border-foreground/40 focus-visible:outline-none focus-visible:border-accent-1 w-full flex justify-between">
                <p>{profileData.uid}</p>
                <FontAwesomeIcon icon={faCopy} size="lg" />
              </div>
            </ClickToCopyText>
          </>
          <>
            <p className="text-base md:text-lg text-accent-1">Full Name</p>
            <input
              type="text"
              name="name"
              className="px-3 py-2 border border-gray-100/40 focus-visible:outline-none focus-visible:border-accent-1"
              value={profileData.name}
              onChange={handleChange}
              disabled={!inEditMode}
            />
          </>
          <>
            <div className="text-base md:text-lg text-accent-1 flex items-center">
              Email{" "}
              {user.emailVerified && (
                <span className="text-sm text-green-400 ml-1">(Verified)</span>
              )}
            </div>
            <input
              type="text"
              name="email"
              className="px-3 py-2 border border-gray-100/40 focus-visible:outline-none focus-visible:border-accent-1"
              value={profileData.email}
              onChange={handleChange}
              disabled={!inEditMode}
            />
          </>

          <ChangePasswordSection user={user} />

          <>
            <div className="text-base md:text-lg text-accent-1 flex items-center">
              Link Accounts
            </div>
            <div className="flex gap-3 justify-start md:justify-end">
              <Tooltip content="Link with Email" position="top">
                <button
                  className={`cursor-pointer disabled:text-accent-1 text-gray-200/60 hover:text-cyan-500`}
                  onClick={() => setLinkMode("emailPassword")}
                  disabled={isEmailChecked}
                >
                  <FontAwesomeIcon icon={faEnvelope} size="xl" />
                </button>
              </Tooltip>
              <Tooltip content="Link with Google" position="top">
                <button
                  className={`cursor-pointer disabled:text-accent-1 text-gray-200/60 hover:text-cyan-500`}
                  onClick={() => setLinkMode("google")}
                  disabled={isGoogleChecked}
                >
                  <FontAwesomeIcon icon={faGoogle} size="xl" />
                </button>
              </Tooltip>
            </div>
          </>

          <div className="md:col-span-2 border border-gray-50/50 p-5 rounded-xl mt-5 flex justify-between items-start gap-3 items-center">
            <div className="flex flex-col gap-1">
              <p className="text-base md:text-lg text-accent-1 pt-2">
                Delete Account
              </p>
              <p className="text-xs md:text-sm text-gray-400">
                Delete Account and all it&apos;s related Data
              </p>
            </div>
            <button
              type="submit"
              className="px-8 py-3 w-max bg-red-700 text-gray-100 hover:bg-red-800 transition-colors duration-200 ease-in-out text-lg rounded-lg cursor-pointer font-semibold"
              onClick={() => setShowConfirmDelete(true)}
            >
              Delete Account
            </button>
          </div>
        </div>
      </section>

      <section className="w-full md:w-4/5">
        <div className="text-amber-500 text-xl md:text-2xl md:px-4 pb-4 border-b border-accent-1 mb-5">
          Platform Preferences
        </div>
        <div className="grid md:grid-cols-2 items-start gap-y-4 px-4">
          <>
            <div className="flex flex-col gap-1">
              <p className="text-base md:text-lg text-accent-1 pt-2">
                Target per Day
              </p>
              <p className="text-xs md:text-sm text-gray-400">
                Goal for Applications per Day
              </p>
            </div>
            <input
              type="number"
              name="targetApplicationPerDay"
              className="px-3 py-2 border border-gray-100/40 focus-visible:outline-none focus-visible:border-accent-1"
              value={profileData.targetApplicationPerDay}
              onChange={handleChange}
              disabled={!inEditMode}
            />
          </>
          {profileData.archiveDate && (
            <>
              <div className="flex flex-col gap-1">
                <p className="text-base md:text-lg text-accent-1 pt-2">
                  Archive Date
                </p>
                <p className="text-xs md:text-sm text-gray-400">
                  Applications before this date will be archived
                </p>
              </div>
              <input
                type="date"
                name="archiveDate"
                className="px-3 py-2 border border-gray-100/40 focus-visible:outline-none focus-visible:border-accent-1"
                value={getDateInputString(new Date(profileData.archiveDate))}
                onChange={handleChange}
                disabled={!inEditMode}
              />
            </>
          )}
        </div>
      </section>

      <ConfirmDeleteModal
        isVisible={showConfirmDelete}
        user={user}
        onClose={() => setShowConfirmDelete(false)}
      />

      <LinkingModal linkMode={linkMode} onClose={() => setLinkMode(null)} />
    </div>
  );
};

const ProfilePage = () => {
  const { data, user, isLoading, error } = useUser();

  if (error) {
    toast.error("Failed to fetch User Profile");
  }

  if (isLoading) {
    <div className="min-h-screen w-full flex justify-center items-center gap-3">
      <FontAwesomeIcon icon={faSpinner} spin size="2x" />
      <p className="text-2xl text-gray-100 animate-pulse">Loading...</p>
    </div>;
  }

  if (!data || !user) return <></>;

  return <ProfilePageContent initialData={data} user={user} />;
};

export default ProfilePage;
