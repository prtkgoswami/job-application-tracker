"use client";

import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "@lib/firebase";
import { useRouter } from "next/navigation";
import MobileMenu from "./MobileMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faSpinner } from "@fortawesome/free-solid-svg-icons";
import NewApplicationModal from "./NewApplicationModal";
import { ApplicationsProvider } from "@contexts/ApplicationContext";
import EmailVerificationBlockModal from "./EmailVerificationBlockModal";
import useUser from "@hooks/useUser";
import WelcomeModal from "./WelcomeModal";
import { unsetAnalyticsUserId } from "@lib/analytics";
import Sidebar from "./Sidebar";

export const MENU_OPTIONS = [
  {name: "Applications", route:"jobs", hidden: false},
  {name: "Analysis", route:"analysis", hidden: true},
  {name: "Profile", route:"profile", hidden: false},
  {name: "About", route:"about", hidden: false},
  {name: "Privacy", route:"privacy", hidden: false},
]

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [user, setUser] = useState<User | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNewEntryModal, setNewShowEntryModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const router = useRouter();
  const { data: profileData, isLoading: isLoadingProfile } = useUser();

  const handleShowMobileMenu = () => {
    setShowMobileMenu(true);
  };

  const handleCloseMobileMenu = () => {
    setShowMobileMenu(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    unsetAnalyticsUserId();
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

  useEffect(() => {
    if (profileData && !profileData.hasSeenWelcome) {
      setShowWelcomeModal(true);
    }
  }, [profileData]);

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

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen w-full flex flex-col justify-center items-center">
        <FontAwesomeIcon icon={faSpinner} spin size="5x" />
        <h2 className="text-3xl text-gray-200 animate-pulse mt-8">
          Fetching Profile ...
        </h2>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <ApplicationsProvider>
      <div className="h-screen w-full relative flex flex-col md:flex-row gap-1">
        <Sidebar
          onLogout={handleLogout}
          onNewEntryClick={() => setNewShowEntryModal(true)}
        />

        {/* Mobile-Only Header */}
        <header className="md:hidden flex justify-between items-center mb-3 px-3 py-3">
          <h2 className="text-2xl md:text-2xl text-amber-400">
            JobTrackr{" "}
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

        <div className="flex flex-col w-full h-screen overflow-auto">
          {children}
        </div>

        <MobileMenu
          showMenu={showMobileMenu}
          onCloseMobileMenu={handleCloseMobileMenu}
          onNewEntryClick={() => setNewShowEntryModal(true)}
          onLogout={handleLogout}
        />

        <NewApplicationModal
          showModal={showNewEntryModal}
          userId={user.uid}
          onClose={() => setNewShowEntryModal(false)}
        />

        <EmailVerificationBlockModal />

        <WelcomeModal
          user={user}
          isVisible={showWelcomeModal}
          onClose={() => setShowWelcomeModal(false)}
          onOpenNewApplication={() => setNewShowEntryModal(true)}
        />
      </div>
    </ApplicationsProvider>
  );
}
