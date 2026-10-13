import { NextResponse } from "next/server";
import { getSeminarData } from "@/lib/seminar-sheets";
import { computeSeminarStats } from "@/lib/seminar";

export const dynamic = "force-dynamic";

export async function GET() {
  const payload = await getSeminarData();
  return NextResponse.json({
    ...payload,
    stats: computeSeminarStats(payload.data),
  });
}
