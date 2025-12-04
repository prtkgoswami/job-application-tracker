import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faClose,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

type MobileMenuProps = {
  showMenu: boolean;
  onCloseMobileMenu: () => void;
  onNewEntryClick: () => void;
  onLogout: () => void;
};

const MobileMenu = ({
  showMenu,
  onCloseMobileMenu,
  onNewEntryClick,
  onLogout,
}: MobileMenuProps) => {
  const router = useRouter();
  const user = useAuth();
  const userId = user?.uid;

  const routeToPage = (route: string) => {
    router.push(`/${userId}/${route}`);
  };

  if (!showMenu) {
    return <></>;
  }

  return (
    <div className="absolute top-0 left-0 w-full h-full flex flex-col p-4 bg-amber-400">
      <div className="flex flex-row-reverse">
        <button
          className="text-gray-900 cursor-pointer"
          onClick={onCloseMobileMenu}
        >
          <FontAwesomeIcon icon={faClose} size="xl" />
        </button>
      </div>

      <h2 className="px-2 text-4xl font-semibold uppercase mb-5 text-gray-800">
        Menu
      </h2>
      <nav className="flex flex-col gap-3">
        <div
          onClick={() => {
            routeToPage("jobs");
            onCloseMobileMenu();
          }}
          className="p-2 rounded-md text-2xl text-gray-800 cursor-pointer"
        >
          Job Dashboard
        </div>
        <div
          onClick={() => {
            routeToPage("analysis");
            onCloseMobileMenu();
          }}
          className="p-2 rounded-md text-2xl text-gray-800 cursor-pointer"
        >
          Analysis Dashboard
        </div>
        <div
          onClick={() => {
            routeToPage("about");
            onCloseMobileMenu();
          }}
          className="p-2 rounded-md text-2xl text-gray-800 cursor-pointer"
        >
          About
        </div>
      </nav>

      <div className="grow w-full flex flex-col justify-end gap-3">
        <button
          className="cursor-pointer justify-self-end flex justify-center items-center py-3 rounded-lg text-2xl bg-gray-800 text-amber-400"
          onClick={onNewEntryClick}
        >
          <FontAwesomeIcon icon={faPlus} className="mr-1" />
          Add Entry
        </button>
        <button
          className="cursor-pointer justify-self-end flex justify-center items-center py-3 rounded-lg text-2xl bg-gray-800 text-amber-400"
          onClick={onLogout}
        >
          Logout
          <FontAwesomeIcon icon={faArrowRightFromBracket} className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default MobileMenu;
