import { NextResponse } from "next/server";
import { getTabunganData } from "@/lib/tabungan-sheets";

export const dynamic = "force-dynamic";

export async function GET() {
  const payload = await getTabunganData();
  return NextResponse.json({ ...payload, count: payload.data.length });
}
