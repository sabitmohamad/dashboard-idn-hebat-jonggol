import { google } from "googleapis";
import {
  MOCK_MENGAJAR_PAYLOAD,
  type MengajarPayload,
} from "@/src/data/mockMengajar";
import { mapSheetsRowsToMengajar } from "@/src/utils/mapSheetsToMengajar";

const SHEET_RANGES = [
  "'Mengajar_Log'!A2:L500",
  "'IDN Mengajar'!A2:L500",
  "'Mengajar'!A2:L500",
] as const;

function hasCredentials(): boolean {
  return Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_PRIVATE_KEY &&
      process.env.GOOGLE_SHEET_ID
  );
}

function fallback(message: string): MengajarPayload {
  return { ...MOCK_MENGAJAR_PAYLOAD, message };
}

/** Reads `Mengajar_Log` from Google Sheets, falling back to mock data. */
export async function getMengajarData(): Promise<MengajarPayload> {
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
        const { rekap, log } = mapSheetsRowsToMengajar(rows);

        if (rekap.length > 0 || log.length > 0) {
          return {
            rekap,
            log,
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
        ? `Tab Mengajar_Log tidak terbaca (${lastError}). Menampilkan data contoh.`
        : "Tab Mengajar_Log masih kosong. Menampilkan data contoh."
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error Google Sheets Mengajar:", error);
    return fallback(
      `Gagal mengambil data Sheets (${message}). Menampilkan data contoh.`
    );
  }
}
