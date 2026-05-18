import { usePathname, useRouter } from "next/navigation";
import React, { MouseEventHandler, useEffect, useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnglesLeft,
  faAnglesRight,
  faArrowRightFromBracket,
  faAsterisk,
  faCalendarAlt,
  faCaretRight,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import Tooltip from "@/components/Tooltip";
import useJobs from "@/hooks/useJobs";
import { useApplicationsRefetch } from "@/contexts/ApplicationContext";
import { getMenuItems } from "@/lib/menu";
import { useFeatureFlags } from "@/contexts/FeatureFlagContext";

type Props = {
  onLogout: () => void;
  onNewEntryClick: () => void;
};

const Sidebar = ({ onLogout, onNewEntryClick }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const pathName = usePathname();
  const user = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);
  const userId = user?.uid;
  const pathItems = pathName.split("/");
  const page = pathItems[pathItems.length - 1];
  const { refetchKey } = useApplicationsRefetch();
  const { counts } = useJobs(userId, refetchKey);
  const { featureFlags } = useFeatureFlags();
  const menuItems = getMenuItems(featureFlags);

  const routeToPage = (route: string, params?: string) => {
      router.push(`/${userId}/${route}?${params ?? ""}`);
    setIsExpanded(false);
  };

  useEffect(() => {
    const clickHandler = (e: MouseEvent) => {
      e.stopPropagation();
      if (!e.target) return;

      if (!menuRef.current?.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener("click", clickHandler);

    return () => {
      document.removeEventListener("click", clickHandler);
    };
  }, []);

  return (
    <div className="relative h-full w-20 hidden md:block" ref={menuRef}>
      <div className="h-full flex flex-col items-center justify-between py-5 bg-background border-r border-accent-1">
        <button
          type="button"
          className={`w-12 h-12 rounded-lg text-center bg-accent-1 hover:bg-accent-1/90 text-background transition-all duration-200 ease-in-out cursor-pointer py-1`}
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          <FontAwesomeIcon icon={isExpanded ? faAnglesLeft : faAnglesRight} />
        </button>

        <div className="w-full flex flex-col items-center gap-4">
          <Tooltip content="New Application">
            <button
              className="w-12 aspect-square cursor-pointer justify-self-end flex justify-center items-center py-3 rounded-lg bg-accent-1 hover:bg-accent-1/90 text-gray-800"
              onClick={() => {
                onNewEntryClick();
                setIsExpanded(false);
              }}
            >
              <FontAwesomeIcon icon={faPlus} size="1x" className="" />
            </button>
          </Tooltip>
          <Tooltip content="Schedule">
            <button
              className="w-12 aspect-square cursor-pointer justify-self-end flex justify-center items-center py-3 rounded-lg bg-accent-1 hover:bg-accent-1/90 text-gray-800"
              onClick={() => {
                routeToPage("schedule");
                setIsExpanded(false);
              }}
            >
              <FontAwesomeIcon icon={faCalendarAlt} size="1x" className="" />
            </button>
          </Tooltip>
          <Tooltip content="Logout">
            <button
              className="w-12 aspect-square cursor-pointer justify-self-end flex justify-center items-center py-3 rounded-lg bg-accent-1 hover:bg-accent-1/90 text-gray-800"
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
        className={`absolute top-0 h-full left-19 bg-accent-1 z-60 ${
          isExpanded ? "w-80 opacity-100" : "w-0 opacity-0"
        } transition-[width,opacity] duration-200 ease-in-out border-r-2 border-background ${
          !isExpanded ? "overflow-hidden" : ""
        }`}
      >
        <div className="flex flex-col gap-5 p-5 h-full justify-between">
          <div>
            <h3
              className={`text-3xl font-semibold py-2 text-background select-none mb-2 cursor-pointer`}
              onClick={() => routeToPage("jobs")}
            >
              JobTrackr
            </h3>
            <h3 className="text-2xl font-extralight mb-5 text-background">
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
                <div className="text-background/65 font-extralight italic">
                  You have{" "}
                  <span className="font-semibold">
                    {counts.wishlisted} Jobs
                  </span>{" "}
                  in your wishlist.{" "}
                  <span
                    className="underline cursor-pointer"
                    onClick={() => routeToPage("jobs", "status=wishlisted")}
                  >
                    Maybe take some time to follow-up with them.
                  </span>
                </div>
                <div className="w-full h-0 border border-amber-800" />
              </div>
            )}
          </div>
          <div className={``}>
            <nav className="flex flex-col gap-3">
              {menuItems.map(({ id, routeKey, title }) => {
                const isSelected = page === routeKey;
                return (
                  <div
                    key={id}
                    onClick={() => {
                      routeToPage(routeKey);
                    }}
                    className={`py-2 text-xl select-none ${
                      isSelected ? "" : "cursor-pointer "
                    } text-background hover:text-background/50 transition-colors duration-150 ease-in-out`}
                  >
                    <span className="w-5 aspect-square inline-block mr-1">
                      {isSelected && <FontAwesomeIcon icon={faCaretRight} />}
                    </span>
                    {title}
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
