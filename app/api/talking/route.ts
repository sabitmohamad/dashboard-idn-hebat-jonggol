import { NextResponse } from "next/server";
import { getTalkingData } from "@/lib/talking-sheets";
import { talkingCounts } from "@/lib/talking";

export const dynamic = "force-dynamic";

export async function GET() {
  const payload = await getTalkingData();
  return NextResponse.json({
    ...payload,
    count: talkingCounts(payload),
  });
}
