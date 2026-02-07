type MenuItem = {
  id: string;
  key: string;
  title: string;
  isExperimental?: boolean;
};

const MENU: MenuItem[] = [
  {
    id: "menu-item-jobs",
    key: "jobs",
    title: "Jobs Dashboard",
  },
  {
    id: "menu-item-analytics",
    key: "analytics",
    title: "Analytics Dashboard",
    isExperimental: true,
  },
  {
    id: "menu-item-schedule",
    key: "schedule",
    title: "Schedule",
    isExperimental: true,
  },
  {
    id: "menu-item-profile",
    key: "profile",
    title: "Profile Preferences",
  },
  {
    id: "menu-item-about",
    key: "about",
    title: "About",
  },
  {
    id: "menu-item-privacy",
    key: "privacy",
    title: "Privacy Policy",
  },
];

export const getMenuItems = (userId: string | undefined) => {
  const whitelistedUsers =
    process.env.NEXT_PUBLIC_EXPERIMENT_WHITELISTED_USER_LIST?.split("|");

  if (!userId) {
    return MENU.filter((item) => !item.isExperimental);
  }

  if (!whitelistedUsers || whitelistedUsers.indexOf(userId) >= 0) return MENU;

  return MENU.filter((item) => !item.isExperimental);
};
