import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnglesLeft,
  faAnglesRight,
  faArrowRightFromBracket,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../AuthProvider";

type SidebarProps = {
  onLogout: () => void;
  onNewEntryClick: () => void;
};

const Sidebar = ({ onLogout, onNewEntryClick }: SidebarProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const pathName = usePathname();
  const user = useAuth();
  const userId = user?.uid;

  const routeToPage = (route: string) => {
    router.push(`/${userId}/${route}`);
  };

  const pathItems = pathName.split('/');
  const page = pathItems[pathItems.length - 1];

  return (
    <div
      className={`relative transition-[width] duration-200 ease-in-out ${
        isExpanded ? "w-90" : "w-20"
      }`}
    >
      <div
        className={`absolute top-0 left-0 transition-[max-width] duration-200 ease-in-out z-60 overflow-hidden ${
          isExpanded ? "max-w-100" : "max-w-17"
        } border-r border-gray-200`}
      >
        <div
          className={`h-screen hidden md:flex flex-col justify-between grow gap-2 ${
            isExpanded ? "px-4 py-4" : "px-[0.6rem] py-4"
          } border-r border-gray-50 w-70 bg-zinc-950 shadow-xl shadow-zinc-900`}
        >
          <div>
            <div
              className={`mb-5 flex items-center ${
                isExpanded ? "justify-between" : " justify-start"
              }`}
            >
              {isExpanded && (
                <h3 className={`text-4xl text-amber-500 select-none transition-opacity duration-200 ease-in-out ${
                  isExpanded ? "opacity-100" : "opacity-0"
                }`}>
                  JobTrackr
                </h3>
              )}
              <button
                type="button"
                className={`w-12 h-12 z-80 rounded-lg text-center bg-amber-400 hover:bg-amber-500 text-gray-800 transition-all duration-200 ease-in-out cursor-pointer py-1`}
                onClick={() => setIsExpanded((prev) => !prev)}
              >
                <FontAwesomeIcon
                  icon={isExpanded ? faAnglesLeft : faAnglesRight}
                />
              </button>
            </div>

            {isExpanded && (
              <div
                className={`transition-opacity duration-200 ease-in-out ${
                  isExpanded ? "opacity-100" : "opacity-0"
                }`}
              >
                <h3 className="px-2 text-2xl font-light mb-5 text-amber-500">
                  Hello {user?.displayName?.split(" ")[0]}!
                </h3>

                <nav className="flex flex-col gap-3">
                  <div
                    onClick={() => {
                      routeToPage("jobs");
                    }}
                    className={`p-2 text-lg rounded-md select-none ${ page === "jobs" ? "border-2 border-amber-500 text-amber-500" : "cursor-pointer hover:bg-amber-500  hover:text-gray-900"} transition-colors duration-200 ease-in-out`}
                  >
                    Applications
                  </div>
                  <div
                    onClick={() => {
                      routeToPage("analysis");
                    }}
                    className={`p-2 text-lg rounded-md select-none ${ page === "analysis" ? "border-2 border-amber-500 text-amber-500" : "cursor-pointer hover:bg-amber-500  hover:text-gray-900"} transition-colors duration-200 ease-in-out cursor-pointer hidden`}
                  >
                    Analysis
                  </div>
                  <div
                    onClick={() => {
                      routeToPage("profile");
                    }}
                    className={`p-2 text-lg rounded-md select-none ${ page === "profile" ? "border-2 border-amber-500 text-amber-500" : "cursor-pointer hover:bg-amber-500  hover:text-gray-900"} transition-colors duration-200 ease-in-out cursor-pointer`}
                  >
                    Profile
                  </div>
                  <div
                    onClick={() => {
                      routeToPage("about");
                    }}
                    className={`p-2 text-lg rounded-md select-none ${ page === "about" ? "border-2 border-amber-500 text-amber-500" : "cursor-pointer hover:bg-amber-500  hover:text-gray-900"} transition-colors duration-200 ease-in-out cursor-pointer`}
                  >
                    About
                  </div>
                </nav>
              </div>
            )}
          </div>

          {isExpanded ? (
            <div className="w-full flex flex-col gap-3">
              <button
                className="cursor-pointer justify-self-end flex justify-center items-center py-3 rounded-lg bg-amber-400 hover:bg-amber-500 text-gray-800"
                onClick={onNewEntryClick}
              >
                <FontAwesomeIcon icon={faPlus} className="mr-1" />
                New Application
              </button>
              <button
                className="cursor-pointer justify-self-end flex justify-center items-center py-3 rounded-lg bg-amber-400 hover:bg-amber-500 text-gray-800"
                onClick={onLogout}
              >
                Logout
                <FontAwesomeIcon
                  icon={faArrowRightFromBracket}
                  className="ml-2"
                />
              </button>
            </div>
          ) : (
            <div className="w-full flex flex-col gap-3">
              <button
                className="w-12 aspect-square cursor-pointer justify-self-end flex justify-center items-center py-3 rounded-lg bg-amber-400 hover:bg-amber-500 text-gray-800"
                onClick={onNewEntryClick}
              >
                <FontAwesomeIcon icon={faPlus} size="1x" className="mr-1" />
              </button>
              <button
                className="w-12 aspect-square cursor-pointer justify-self-end flex justify-center items-center py-3 rounded-lg bg-amber-400 hover:bg-amber-500 text-gray-800"
                onClick={onLogout}
              >
                <FontAwesomeIcon
                  icon={faArrowRightFromBracket}
                  className="ml-2"
                  size="1x"
                />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
