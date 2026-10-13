import { google } from "googleapis";
import {
  EMPTY_TABUNGAN_PAYLOAD,
  type TabunganPayload,
} from "@/src/data/tabungan";
import { mapSheetsRowsToTabungan } from "@/src/utils/mapSheetsToTabungan";

const SHEET_RANGES = [
  "'Data_Tabungan'!A1:P1000",
  "'Tabungan_Log'!A1:P1000",
  "'Tabungan'!A1:P1000",
  "'Tabungan Siswa'!A1:P1000",
] as const;

function hasCredentials(): boolean {
  return Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_PRIVATE_KEY &&
      process.env.GOOGLE_SHEET_ID
  );
}

function fallback(message: string): TabunganPayload {
  return { ...EMPTY_TABUNGAN_PAYLOAD, message };
}

/** Reads `Data_Tabungan` (or `Tabungan_Log` / `Tabungan`) from Google Sheets. */
export async function getTabunganData(): Promise<TabunganPayload> {
  if (!hasCredentials()) {
    return fallback(
      "Credentials Google Sheets belum diset, data tabungan tidak dapat dimuat."
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
        const data = mapSheetsRowsToTabungan(rows);

        if (data.length > 0) {
          return {
            data,
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
        ? `Tab Data_Tabungan tidak terbaca (${lastError}).`
        : "Tab Data_Tabungan masih kosong."
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error Google Sheets Tabungan:", error);
    return fallback(
      `Gagal mengambil data Sheets (${message}).`
    );
  }
}
