import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useAuth } from "../AuthProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnglesLeft,
  faAnglesRight,
  faArrowRightFromBracket,
  faAsterisk,
  faCaretRight,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { MENU_OPTIONS } from "./layout";
import Tooltip from "@/components/Tooltip";
import useJobs from "@/hooks/useJobs";

type Props = {
  onLogout: () => void;
  onNewEntryClick: () => void;
};

const Sidebar = ({ onLogout, onNewEntryClick }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const pathName = usePathname();
  const user = useAuth();
  const userId = user?.uid;
  const pathItems = pathName.split("/");
  const page = pathItems[pathItems.length - 1];
  const { counts } = useJobs(userId);

  const routeToPage = (route: string, params?: string) => {
    if (new Set(["about", "privacy"]).has(route)) {
      router.push(`/${route}`);
    } else {
      router.push(`/${userId}/${route}?${params}`);
    }
    setIsExpanded(false);
  };

  return (
    <div className="relative h-full w-20 hidden md:block">
      <div className="h-full flex flex-col items-center justify-between py-5 bg-zinc-950 border-r border-amber-500">
        <button
          type="button"
          className={`w-12 h-12 z-80 rounded-lg text-center bg-amber-500 hover:bg-amber-400 text-gray-800 transition-all duration-200 ease-in-out cursor-pointer py-1`}
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          <FontAwesomeIcon icon={isExpanded ? faAnglesLeft : faAnglesRight} />
        </button>

        <div className="w-full flex flex-col items-center gap-4">
          <Tooltip content="New Application">
            <button
              className="w-12 aspect-square cursor-pointer justify-self-end flex justify-center items-center py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-gray-800"
              onClick={() => {
                onNewEntryClick();
                setIsExpanded(false);
              }}
            >
              <FontAwesomeIcon icon={faPlus} size="1x" className="mr-1" />
            </button>
          </Tooltip>
          <Tooltip content="Logout">
            <button
              className="w-12 aspect-square cursor-pointer justify-self-end flex justify-center items-center py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-gray-800"
              onClick={() => {
                onLogout();
                setIsExpanded(false);
              }}
            >
              <FontAwesomeIcon
                icon={faArrowRightFromBracket}
                className="ml-2"
                size="1x"
              />
            </button>
          </Tooltip>
        </div>
      </div>

      <div
        className={`absolute top-0 h-full left-19 bg-amber-500 ${
          isExpanded ? "w-80 opacity-100" : "w-0 opacity-0"
        } transition-[width,opacity] duration-200 ease-in-out border-r-2 border-gray-800 ${
          !isExpanded ? "overflow-hidden" : ""
        }`}
      >
        <div className="flex flex-col gap-5 p-5 h-full justify-between">
          <div>
            <h3 className={`text-4xl py-2 text-gray-800 select-none mb-2`}>
              JobTrackr
            </h3>
            <h3 className="text-2xl font-extralight mb-5 text-gray-800">
              Hello {user?.displayName?.split(" ")[0]}!
            </h3>
            {counts.wishlisted > 0 && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-full h-0 border border-amber-800" />
                  <FontAwesomeIcon
                    icon={faAsterisk}
                    size="lg"
                    className="text-red-700"
                  />
                  <div className="w-full h-0 border border-amber-800" />
                </div>
                <div className="text-amber-900 font-extralight italic">
                  You have{" "}
                  <span className="font-semibold">
                    {counts.wishlisted} Jobs
                  </span>{" "}
                  in your wishlist. <span className="underline cursor-pointer" onClick={() => routeToPage("jobs", "status=wishlisted")}>Maybe take some time to follow-up with them.</span>
                </div>
                <div className="w-full h-0 border border-amber-800" />
              </div>
            )}
          </div>
          <div className={``}>
            <nav className="flex flex-col gap-3">
              {MENU_OPTIONS.map((option) => {
                const isSelected = page === option.route;
                return (
                  <div
                    key={option.name}
                    onClick={() => {
                      routeToPage(option.route);
                    }}
                    className={`py-2 text-xl select-none ${
                      option.hidden && "hidden"
                    } ${
                      isSelected ? "" : "cursor-pointer "
                    } text-gray-800 transition-colors duration-200 ease-in-out`}
                  >
                    <span className="w-5 aspect-square inline-block mr-1">
                      {isSelected && <FontAwesomeIcon icon={faCaretRight} />}
                    </span>
                    {option.name}
                  </div>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
