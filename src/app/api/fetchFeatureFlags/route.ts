import { NextResponse } from "next/server";

const FEATURE_FLAG_MAPPING = {
  show_analytics_menu_option: ["fpSYEVNzyKdC8a87HkkiTIsLFL73"],
  show_schedule_menu_option: ["fpSYEVNzyKdC8a87HkkiTIsLFL73"],
  show_job_detail_banner: ["fpSYEVNzyKdC8a87HkkiTIsLFL73"],
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const uid = searchParams.get("uid") as string | null;

  if (!uid) {
    return NextResponse.json({ error: "Missing UID" }, { status: 400 });
  }

  const userFeatureFlags = Object.entries(FEATURE_FLAG_MAPPING).reduce(
    (acc: Record<string, boolean>, [key, whitelist]) => {
      acc[key] = new Set(whitelist).has(uid);
      return acc;
    },
    {},
  );

  return NextResponse.json({ data: userFeatureFlags }, { status: 200 });
}
