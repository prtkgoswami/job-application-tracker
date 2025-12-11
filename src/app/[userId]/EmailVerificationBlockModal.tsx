"use client";
import { useAuth } from "@app/AuthProvider";
import Modal from "@components/Modal";
import { sendEmailVerification } from "firebase/auth";
import { toast } from "react-toastify";

const EmailVerificationBlockModal = () => {
  const user = useAuth();

  if (!user || user?.emailVerified) return <></>;

  const handleResendEmail = async () => {
    try {
      await sendEmailVerification(user);
      toast.success("Verification Email Sent.");
    } catch (err) {
      toast.error("Could not Send the Email");
    }
  };

  const handleRefreshClick = () => {
    window.location.reload();
  };

  return (
    <Modal
      isVisible={true}
      onClose={() => {}}
      showCloseButton={false}
      modalClasses="md:w-1/2 p-3 md:p-8"
    >
      <div className="flex flex-col md:items-center">
        <h2 className="text-4xl md:text-6xl text-gray-800">Almost There!</h2>
        <h4 className="text-xl md:text-2xl text-amber-600 mb-8">
          Verify Your Email to Get Started
        </h4>
        <p className="md:text-center leading-relaxed text-gray-800 mb-5">
          We&apos;ve sent a verification email to your address. Click the
          verification link in the email to activate your account and start
          using all our features. Didn&apos;t receive it? Check your spam folder
          or request a new one.
        </p>

        <p className="md:text-center leading-relaxed text-gray-800 mb-10">Can&apos;t find the email. Try <span className="text-blue-500 cursor-pointer" onClick={handleResendEmail}>Sending Again</span></p>

        <button
          className="px-4 py-4 md:py-2 bg-amber-400 hover:bg-amber-500 rounded-lg text-gray-800 w-full md:w-80 cursor-pointer"
          onClick={handleRefreshClick}
        >
          Refresh Page
        </button>
      </div>
    </Modal>
  );
};

export default EmailVerificationBlockModal;
