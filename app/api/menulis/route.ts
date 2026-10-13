import { NextResponse } from "next/server";
import { getMenulisData } from "@/lib/menulis-sheets";

export const dynamic = "force-dynamic";

export async function GET() {
  const payload = await getMenulisData();
  return NextResponse.json({
    ...payload,
    count: {
      menulis: payload.menulis.length,
      sertifikasi: payload.sertifikasi.length,
    },
  });
}
