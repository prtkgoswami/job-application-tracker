"use client";
import ClickToCopyText from "@/app/components/ClickToCopyText";
import useUser from "@/app/hooks/useUser";
import { getDateInputString } from "@/app/lib/date";
import { db } from "@/app/lib/firebase";
import { User as UserType } from "@/app/types/user";
import {
  faCopy,
  faFloppyDisk,
  faPen,
  faSpinner,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { User } from "firebase/auth";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import React, { useState } from "react";
import { toast } from "react-toastify";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import ChangePasswordSection from "./ChangePasswordSection";

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
              <div className="px-3 py-2 border text-gray-100/60 border-gray-100/40 focus-visible:outline-none focus-visible:border-amber-400 w-full flex justify-between">
                <p>{profileData.uid}</p>
                <FontAwesomeIcon icon={faCopy} size="lg" />
              </div>
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
            <div className="text-base md:text-lg text-amber-400 flex items-center">
              Email{" "}
              {user.emailVerified && <span className="text-sm text-green-400 ml-1">(Verified)</span>}
            </div>
            <input
              type="text"
              name="email"
              className="px-3 py-2 border border-gray-100/40 focus-visible:outline-none focus-visible:border-amber-400"
              value={profileData.email}
              onChange={handleChange}
              disabled={!inEditMode}
            />
          </>

          <ChangePasswordSection user={user} />

          <div className="md:col-span-2 border border-gray-50/50 p-5 rounded-xl mt-5 grid grid-cols-2 items-center">
            <div className="flex flex-col gap-1">
              <p className="text-base md:text-lg text-amber-400 pt-2">
                Delete Account
              </p>
              <p className="text-xs md:text-sm text-gray-400">
                Delete Account and all it&apos;s related Data
              </p>
            </div>
            <button
              type="submit"
              className="px-8 py-3 bg-red-700 text-gray-100 hover:bg-red-800 transition-colors duration-200 ease-in-out text-lg rounded-lg cursor-pointer font-semibold"
              onClick={() => setShowConfirmDelete(true)}
            >
              Delete Account
            </button>
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

      <ConfirmDeleteModal
        isVisible={showConfirmDelete}
        user={user}
        onClose={() => setShowConfirmDelete(false)}
      />
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
