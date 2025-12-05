"use client";

import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";
import MobileMenu from "../components/MobileMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faSpinner } from "@fortawesome/free-solid-svg-icons";
import EntryModal from "../components/EntryModal";
import { ApplicationsProvider } from "../contexts/ApplicationContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [user, setUser] = useState<User | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showEntryModal, setShowEntryModal] = useState(false);
  const router = useRouter();

  const handleShowMobileMenu = () => {
    setShowMobileMenu(true);
  };

  const handleCloseMobileMenu = () => {
    setShowMobileMenu(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/auth");
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/auth");
      } else {
        setUser(user);
      }
      setIsCheckingAuth(false);
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

  if (!user) {
    return null;
  }

  return (
    <ApplicationsProvider>
      <div className="min-h-screen w-full relative md:grid grid-cols-9 gap-4">
        <Sidebar
          onLogout={handleLogout}
          onNewEntryClick={() => setShowEntryModal(true)}
        />

        <header className="md:hidden flex justify-between items-center mb-5 px-3 py-3">
          <h2 className="text-2xl md:text-2xl text-amber-400">
            Job Tracker{" "}
            <span className="hidden md:inline-block">- Job Dashboard</span>
          </h2>
          <div className="flex gap-4 md:hidden">
            <button
              className="cursor-pointer w-10 aspect-square rounded-md text-gray-50 hover:bg-amber-500 hover:text-gray-900"
              onClick={handleShowMobileMenu}
            >
              <FontAwesomeIcon icon={faBars} size="xl" />
            </button>
          </div>
        </header>

        <div className="flex flex-col md:col-span-7 h-screen overflow-auto">{children}</div>

        <MobileMenu
          showMenu={showMobileMenu}
          onCloseMobileMenu={handleCloseMobileMenu}
          onNewEntryClick={() => setShowEntryModal(true)}
          onLogout={handleLogout}
        />

        <EntryModal
          showModal={showEntryModal}
          userId={user.uid}
          onClose={() => setShowEntryModal(false)}
        />
      </div>
    </ApplicationsProvider>
  );
}
