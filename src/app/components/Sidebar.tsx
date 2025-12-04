import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

type SidebarProps = {
  onLogout: () => void;
  onNewEntryClick: () => void;
};

const Sidebar = ({ onLogout, onNewEntryClick }: SidebarProps) => {
  const router = useRouter();
  const user = useAuth();
  const userId = user?.uid;

  const routeToPage = (route: string) => {
    router.push(`/${userId}/${route}`);
  };

  return (
    <div className="flex-col justify-between grow gap-2 px-4 py-4 border-r border-gray-50 col-span-2 hidden md:flex">
      <div>
        <h2 className="px-2 text-2xl font-semibold uppercase mb-5">
          Job Tracker
        </h2>
        <nav className="flex flex-col gap-3">
          <div
            onClick={() => {
              routeToPage("jobs");
            }}
            className="p-2 rounded-md hover:bg-amber-500 hover:text-gray-900 transition-colors duration-200 ease-in-out cursor-pointer"
          >
            Job Dashboard
          </div>
          <div
            onClick={() => {
              routeToPage("analysis");
            }}
            className="p-2 rounded-md hover:bg-amber-500 hover:text-gray-900 transition-colors duration-200 ease-in-out cursor-pointer"
          >
            Analysis Dashboard *Coming Soon*
          </div>
        </nav>
      </div>
      <div className="w-full flex flex-col gap-3">
        <button
          className="cursor-pointer justify-self-end flex justify-center items-center py-3 rounded-lg bg-amber-400 hover:bg-amber-500 text-gray-800"
          onClick={onNewEntryClick}
        >
          <FontAwesomeIcon icon={faPlus} className="mr-1" />
          Add Entry
        </button>
        <button
          className="cursor-pointer justify-self-end flex justify-center items-center py-3 rounded-lg bg-amber-400 hover:bg-amber-500 text-gray-800"
          onClick={onLogout}
        >
          Logout
          <FontAwesomeIcon icon={faArrowRightFromBracket} className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
