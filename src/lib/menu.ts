type MenuItem = {
  id: string;
  routeKey: string;
  title: string;
  experimentKey?: string;
};

const MENU: MenuItem[] = [
  {
    id: "menu-item-jobs",
    routeKey: "jobs",
    title: "Jobs Dashboard",
  },
  {
    id: "menu-item-analytics",
    routeKey: "analytics",
    title: "Analytics Dashboard",
    experimentKey: "show_analytics_menu_option",
  },
  {
    id: "menu-item-schedule",
    routeKey: "schedule",
    title: "Schedule",
    experimentKey: "show_schedule_menu_option",
  },
  {
    id: "menu-item-profile",
    routeKey: "profile",
    title: "Profile Preferences",
  },
  {
    id: "menu-item-about",
    routeKey: "about",
    title: "About",
  },
  {
    id: "menu-item-privacy",
    routeKey: "privacy",
    title: "Privacy Policy",
  },
];

export const getMenuItems = (
  featureFlags: Record<string, boolean> | undefined,
) => {
  if (!featureFlags) return MENU;
  return MENU.filter(
    (item) => !item.experimentKey || featureFlags[item.experimentKey],
  );
};
