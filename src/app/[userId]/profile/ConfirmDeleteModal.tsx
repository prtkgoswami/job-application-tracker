import { useState } from "react";
import PasswordInput from "@/app/components/PasswordInput";
import Modal from "@/app/components/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import {
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  User,
} from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { FirebaseError } from "firebase/app";

type Props = {
  isVisible: boolean;
  user: User;
  onClose: () => void;
};

const ConfirmDeleteModal = ({ isVisible, user, onClose }: Props) => {
  const [password, setPassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleAccountDelete = async () => {
    if (!user.email) return;

    try {
      setIsDeleting(true);
      const cred = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, cred);

      // 1. Delete All Applications for User from "jobs"
      const appsRef = collection(db, "jobs");
      const q = query(appsRef, where("userId", "==", user.uid));
      const appsSnap = await getDocs(q);

      const batch = writeBatch(db);

      appsSnap.docs.forEach((appSnap) => {
        batch.delete(appSnap.ref);
      });

      // 2. Delete All Profile Data for User from "users"
      const userRef = doc(db, "users", user.uid);
      batch.delete(userRef);

      await batch.commit();

      // 3. Delete User
      await deleteUser(user);

      toast.success("Account Deletion Successful");
      setTimeout(() => {
        router.push("/auth");
      }, 800);
    } catch (err) {
      console.error("Account Deletion Failed", err);
      if (err instanceof FirebaseError) {
        if (err.code === "auth/invalid-credential") {
          toast.error("Password is Invalid");
        } else {
          toast.error("Could not Delete Account");
        }
      } else {
        toast.error("Could not Delete Account");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      title="Danger"
      modalClasses="w-full md:w-1/2 shadow-lg shadow-gray-900"
      theme="dark"
      onClose={onClose}
    >
      <div className="flex flex-col w-full items-center py-10 px-3">
        <FontAwesomeIcon
          icon={faTriangleExclamation}
          className="text-red-500 animate-pulse"
          size="5x"
        />
        <h2 className="text-amber-500 text-3xl font-medium leading-relaxed mt-5">
          All Data will be Deleted Permanently
        </h2>
        <h4 className="text-gray-400 text-lg font-medium leading-relaxed text-center">
          Are you sure you want to delete all Data associated with this account?
        </h4>
        <div className="flex flex-col items-center gap-5 mt-8 w-2/3">
          <PasswordInput
            name="user-password"
            placeholder="Enter your Password to Delete"
            autocomplete="new-password"
            className="text-lg border-b border-gray-400 px-4 py-2 w-full"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
          <button
            type="button"
            className="px-4 py-2 text-gray-800 bg-amber-400 disabled:bg-gray-400 hover:bg-amber-500 text-lg cursor-pointer uppercase w-40 rounded-lg"
            onClick={handleAccountDelete}
            disabled={password.length === 0}
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDeleteModal;
