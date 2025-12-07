import React from "react";
import Modal from "./Modal";
import { User } from "firebase/auth";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

type Props = {
  user: User;
  isVisible: boolean;
  onClose: () => void;
  onOpenNewApplication: () => void;
};

const WelcomeModal = ({
  user,
  isVisible,
  onClose,
  onOpenNewApplication,
}: Props) => {
  const markWelcomeSeen = async () => {
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { hasSeenWelcome: true });
    } catch (err) {
      console.error("Could not update hasSeenWelcome", err);
    }
  };

  const handleClose = async () => {
    await markWelcomeSeen();
    onClose();
  };

  const handleNewApplicationOpen = async () => {
    await markWelcomeSeen();
    onClose();
    onOpenNewApplication();
  };

  return (
    <Modal
      isVisible={isVisible}
      hideHeader
      hasBackdropPadding={false}
      onClose={handleClose}
      modalClasses="md:w-1/2 h-full md:h-[95%] shadow-lg shadow-gray-900 bg-gray-800"
      bodyClasses="flex flex-col relative"
    >
      <button
        className="absolute top-5 right-5 w-10 h-10 rounded-full cursor-pointer text-gray-900 z-10 bg-amber-500 hover:bg-amber-400 transition-colors duration-200 ease-in-out"
        onClick={handleClose}
      >
        <FontAwesomeIcon icon={faXmark} size="lg" />
      </button>

      <div className="min-h-full w-full flex flex-col">
        <section className="w-full h-60 md:h-70 relative shrink-0">
          <Image
            src="/interview.jpg"
            alt="welcome banner"
            fill
            className="object-cover object-top"
          />
        </section>
        <div className="w-full px-5 md:px-10 py-8 flex flex-col gap-8">
          <section>
            <h2 className="text-2xl md:text-3xl font-semibold text-amber-400">
              Welcome to Job Trackr
            </h2>
            <h4 className="text-sm md:text-base font-light text-gray-100 leading-relaxed">
              A clean, focused space to organize your job search and stay on top
              of every application.
            </h4>
          </section>

          <section>
            <h3 className="text-xl text-amber-400 mb-2">
              What you can do here
            </h3>
            <ul className="text-sm md:text-base list-disc list-inside text-gray-100 leading-relaxed marker:text-amber-500">
              <li>Save job postings with title, link, and description</li>
              <li>
                Track status as you move from wishlist → applied → interviewing
                → offer
              </li>
              <li>See when you last updated each application</li>
              <li>Keep everything private and tied to your account</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl text-amber-400 mb-2">Quick start</h3>
            <p className="text-sm md:text-base text-gray-200 leading-relaxed">
              Here’s how to get started in under a minute:
            </p>
            <ul className="text-sm md:text-base list-decimal list-inside text-gray-100 leading-relaxed marker:text-amber-500">
              <li>
                <span className="text-amber-400 mr-1">
                  Complete your profile
                </span>
                – add your name and basic details.
              </li>
              <li>
                <span className="text-amber-400 mr-1">
                  Add your first application
                </span>
                – paste a job link and notes.
              </li>
              <li>
                <span className="text-amber-400 mr-1">Keep it updated</span>–
                move entries through stages as you progress.
              </li>
            </ul>
          </section>

          <p className="text-amber-500 italic leading-relaxed">
            Your data stays private and is only visible to you. You’re in
            control of your job search.
          </p>

          <section className="flex flex-col md:flex-row gap-4 justify-end">
            <button
              className="px-4 py-4 md:py-2 border-2 border-amber-500 text-amber-400 hover:bg-amber-400 hover:text-gray-800 transition-colors duration-200 ease-in-out rounded-lg cursor-pointer"
              onClick={handleNewApplicationOpen}
            >
              Add First Application
            </button>
            <p className="text-center text-xs text-gray-200 md:hidden">OR</p>
            <button
              className="px-4 py-4 md:py-2 border-2 border-amber-500 text-amber-400 hover:bg-amber-400 hover:text-gray-800 transition-colors duration-200 ease-in-out rounded-lg cursor-pointer"
              onClick={handleClose}
            >
              Go to Dashboard
            </button>
          </section>

          {/* Safe Area Padding - For Mobile */}
          <div className="md:hidden py-5" />
        </div>
      </div>
    </Modal>
  );
};

export default WelcomeModal;
