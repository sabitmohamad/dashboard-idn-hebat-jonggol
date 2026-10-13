import { google } from "googleapis";
import {
  MOCK_SEMINAR_PAYLOAD,
  type SeminarPayload,
} from "@/src/data/mockSeminar";
import { mapSheetsRowsToSeminar } from "@/src/utils/mapSheetsToSeminar";

const SHEET_RANGES = ["'Seminar_Report'!A1:F1000"] as const;

function hasCredentials(): boolean {
  return Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_PRIVATE_KEY &&
      process.env.GOOGLE_SHEET_ID
  );
}

function fallback(message: string): SeminarPayload {
  return { ...MOCK_SEMINAR_PAYLOAD, message };
}

/** Reads `Seminar_Report` from Google Sheets, falling back to mock data. */
export async function getSeminarData(): Promise<SeminarPayload> {
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
        const data = mapSheetsRowsToSeminar(rows);

        if (data.length > 0) {
          return {
            data,
            connected: true,
            sheet: range.split("!")[0]?.replace(/'/g, "") ?? "Seminar_Report",
            source: "sheets",
          };
        }
      } catch (err) {
        lastError = err instanceof Error ? err.message : "Unknown range error";
      }
    }

    return fallback(
      lastError
        ? `Tab Seminar_Report tidak terbaca (${lastError}). Menampilkan data contoh.`
        : "Tab Seminar_Report masih kosong. Menampilkan data contoh."
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error Google Sheets Seminar:", error);
    return fallback(
      `Gagal mengambil data Sheets (${message}). Menampilkan data contoh.`
    );
  }
}
