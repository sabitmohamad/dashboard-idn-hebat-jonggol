import { NextResponse } from "next/server";
import { getMengajarData } from "@/lib/mengajar-sheets";

export const dynamic = "force-dynamic";

export async function GET() {
  const payload = await getMengajarData();
  return NextResponse.json({
    ...payload,
    count: { rekap: payload.rekap.length, log: payload.log.length },
  });
}
