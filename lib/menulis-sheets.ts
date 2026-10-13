import { google } from "googleapis";
import {
  MOCK_MENULIS_PAYLOAD,
  type MenulisPayload,
} from "@/src/data/mockMenulis";
import { mapSheetsRowsToMenulis } from "@/src/utils/mapSheetsToMenulis";

const PREFERRED_TABS = [
  "Menulis_Sertifikasi_Report",
  "Menulis_Log",
  "Sertifikasi_Log",
  "IDN Menulis dan Sertifikasi",
  "IDN Menulis",
  "Menulis",
] as const;

function hasCredentials(): boolean {
  return Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_PRIVATE_KEY &&
      process.env.GOOGLE_SHEET_ID
  );
}

function fallback(message: string): MenulisPayload {
  return { ...MOCK_MENULIS_PAYLOAD, message };
}

function pickMenulisTab(titles: string[]): string | null {
  const exact = PREFERRED_TABS.find((name) => titles.includes(name));
  if (exact) return exact;
  return (
    titles.find((title) => /menulis|sertifikasi/i.test(title)) ?? null
  );
}

/** Reads the live menulis/sertifikasi tab from Google Sheets. */
export async function getMenulisData(): Promise<MenulisPayload> {
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

    const meta = await sheets.spreadsheets.get({
      spreadsheetId,
      fields: "sheets.properties.title",
    });
    const titles =
      meta.data.sheets
        ?.map((sheet) => sheet.properties?.title)
        .filter((title): title is string => Boolean(title)) ?? [];

    const candidates = [
      ...new Set(
        [pickMenulisTab(titles), ...PREFERRED_TABS].filter(
          (title): title is string =>
            typeof title === "string" && titles.includes(title)
        )
      ),
    ];

    if (candidates.length === 0) {
      return fallback(
        "Tab rekap menulis belum ada di spreadsheet. Menampilkan data contoh."
      );
    }

    let lastError: string | null = null;

    for (const title of candidates) {
      try {
        const response = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range: `'${title.replace(/'/g, "''")}'!A1:I500`,
        });
        const rows = (response.data.values ?? []) as unknown[][];
        const { menulis, sertifikasi } = mapSheetsRowsToMenulis(rows);

        if (menulis.length > 0 || sertifikasi.length > 0) {
          return {
            menulis,
            sertifikasi,
            connected: true,
            sheet: title,
            source: "sheets",
          };
        }
      } catch (err) {
        lastError = err instanceof Error ? err.message : "Unknown range error";
      }
    }

    return fallback(
      lastError
        ? `Rekap menulis belum terbaca (${lastError}). Menampilkan data contoh.`
        : "Rekap menulis masih kosong. Menampilkan data contoh."
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error Google Sheets Menulis:", error);
    return fallback(
      `Gagal mengambil data Sheets (${message}). Menampilkan data contoh.`
    );
  }
}
