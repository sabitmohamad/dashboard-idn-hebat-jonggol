import { google } from "googleapis";
import { NextResponse } from "next/server";
import { mockLombaData } from "@/src/data/mockLomba";
import { mapSheetsRowsToLombaItems } from "@/src/utils/mapSheetsToLomba";

export const dynamic = "force-dynamic";

const SHEET_RANGES = [
  "'Lomba_Filter'!A4:Q500",
  "'Lomba_Log'!A2:Q500",
  "'IDN Lomba'!A2:Q500",
  "'Lomba'!A2:Q500",
] as const;

function hasCredentials(): boolean {
  return Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_PRIVATE_KEY &&
      process.env.GOOGLE_SHEET_ID
  );
}

function fallbackResponse(reason: string, status = 200) {
  return NextResponse.json(
    {
      data: mockLombaData,
      sheet: null,
      source: "mock",
      connected: false,
      message: reason,
      count: mockLombaData.length,
    },
    { status }
  );
}

async function readRange(
  sheets: ReturnType<typeof google.sheets>,
  spreadsheetId: string,
  range: string
): Promise<string[][]> {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });
  const values = response.data.values;
  if (!values || values.length === 0) return [];
  return values.map((row) => row.map((cell) => String(cell ?? "")));
}

export async function GET() {
  if (!hasCredentials()) {
    return fallbackResponse(
      "Credentials Google Sheets belum diset. Menampilkan mockLombaData."
    );
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID!;

    let lastError: string | null = null;

    for (const range of SHEET_RANGES) {
      try {
        const rows = await readRange(sheets, spreadsheetId, range);
        const data = mapSheetsRowsToLombaItems(rows);

        if (data.length > 0) {
          const sheet = range.split("!")[0]?.replace(/'/g, "") ?? null;
          return NextResponse.json({
            data,
            sheet,
            range,
            source: "sheets",
            connected: true,
            count: data.length,
          });
        }
      } catch (err) {
        lastError = err instanceof Error ? err.message : "Unknown range error";
        // Coba range / tab berikutnya (tab mungkin belum ada)
        continue;
      }
    }

    return fallbackResponse(
      lastError
        ? `Tidak ada data Lomba di Sheets (${lastError}). Menampilkan mockLombaData.`
        : "Tidak ada data Lomba di Sheets. Menampilkan mockLombaData."
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error API /api/lomba:", error);
    return fallbackResponse(
      `Gagal mengambil data Sheets (${message}). Menampilkan mockLombaData.`
    );
  }
}
