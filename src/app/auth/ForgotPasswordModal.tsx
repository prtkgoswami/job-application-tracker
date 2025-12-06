import React, { useEffect, useState } from "react";
import Modal from "../components/Modal";
import { toast } from "react-toastify";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../lib/firebase";
import { FirebaseError } from "firebase/app";

type ForgotPasswordModalProps = {
  isVisible: boolean;
  onClose: () => void;
};

const ForgotPasswordModal = ({
  isVisible,
  onClose,
}: ForgotPasswordModalProps) => {
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [email, setEmail] = useState("");

  const handleEmailSent = async () => {
    if (!email) return;

    try {
      setIsSendingEmail(true);
      await sendPasswordResetEmail(auth, email);
      setIsEmailSent(true);
      toast.success("Password Reset email Sent.");
    } catch (err) {
      console.error("Failed to send reset email", err)
      if (err instanceof FirebaseError) {
        if (err.code === "auth/invalid-email") {
          toast.error("Email is Invalid");
        } else {
          toast.error("Password Reset email could not be sent");
        }
      } else {
        toast.error("Password Reset email could not be sent");
      }
    } finally {
      setIsSendingEmail(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      setIsEmailSent(false);
      setEmail("");
    }
  }, [isVisible, onClose]);

  return (
    <Modal isVisible={isVisible} onClose={onClose} modalClasses="md:w-1/2">
      <div className="flex flex-col items-center gap-2 p-5 pt-0 w-full">
        <p className="text-xl text-gray-800">Send Reset Password Email</p>
        <p className=" text-gray-800">Enter your registerred email</p>
        <div className="w-full flex flex-col gap-4 items-center py-5">
          <input
            type="email"
            name="email"
            placeholder="Enter your email here..."
            className="text-gray-800 text-center text-xl border-b-2 border-gray-800 w-full md:w-2/3 focus-within:outline-none py-2 px-3 disabled:text-gray-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isEmailSent}
            required
          />
          {isEmailSent ? (
            <p className="text-base text-center text-green-600">
              Password Reset email has been sent to {email}.
            </p>
          ) : (
            <button
              type="button"
              className="cursor-pointer border-2 text-lg border-amber-500 bg-amber-500 text-gray-800 disabled:border-gray-400 disabled:bg-gray-400 disabled:text-gray-600 hover:bg-amber-400 hover:text-gray-800 transition-colors duration-200 ease-in-out px-8 py-2 rounded-md"
              disabled={isSendingEmail || !email}
              onClick={handleEmailSent}
            >
              {isSendingEmail ? "Sending Email..." : "Send Email"}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ForgotPasswordModal;
