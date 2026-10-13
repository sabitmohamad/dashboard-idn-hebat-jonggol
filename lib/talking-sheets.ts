import { google } from "googleapis";
import {
  MOCK_TALKING_PAYLOAD,
  type TalkingPayload,
} from "@/src/data/mockTalking";
import { mapSheetsRowsToTalking } from "@/src/utils/mapSheetsToTalking";

const SHEET_RANGES = [
  "'Talking_Log'!A2:N500",
  "'IDN Talking'!A2:N500",
  "'Talking'!A2:N500",
] as const;

function hasCredentials(): boolean {
  return Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_PRIVATE_KEY &&
      process.env.GOOGLE_SHEET_ID
  );
}

function fallback(message: string): TalkingPayload {
  return { ...MOCK_TALKING_PAYLOAD, message };
}

/** Reads `Talking_Log` from Google Sheets, falling back to mock data. */
export async function getTalkingData(): Promise<TalkingPayload> {
  if (!hasCredentials()) {
    return fallback(
      "Credentials Google Sheets belum diset. Menampilkan data contoh."
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
        const response = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range,
        });
        const rows = (response.data.values ?? []) as unknown[][];
        const { podcast, wtt, wet } = mapSheetsRowsToTalking(rows);

        if (podcast.length > 0 || wtt.length > 0 || wet.length > 0) {
          return {
            podcast,
            wtt,
            wet,
            connected: true,
            sheet: range.split("!")[0]?.replace(/'/g, "") ?? null,
            source: "sheets",
          };
        }
      } catch (err) {
        lastError = err instanceof Error ? err.message : "Unknown range error";
      }
    }

    return fallback(
      lastError
        ? `Tab Talking_Log tidak terbaca (${lastError}). Menampilkan data contoh.`
        : "Tab Talking_Log masih kosong. Menampilkan data contoh."
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error Google Sheets Talking:", error);
    return fallback(
      `Gagal mengambil data Sheets (${message}). Menampilkan data contoh.`
    );
  }
}
