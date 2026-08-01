import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

type SheetsClient = ReturnType<typeof google.sheets>;

async function readSheet(
  sheets: SheetsClient,
  spreadsheetId: string,
  sheetTitle: string
) {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `'${sheetTitle}'!A1:Z500`,
  });

  const rows = response.data.values;
  if (!rows || rows.length === 0) {
    return { sheet: sheetTitle, data: [] as Record<string, string>[] };
  }

  const headers = rows[0].map((h) => String(h ?? '').trim());
  const data = rows.slice(1).map((row) => {
    const rowObject: Record<string, string> = {};
    headers.forEach((header, index) => {
      if (!header) return;
      rowObject[header] = row[index] ? String(row[index]) : '';
    });
    return rowObject;
  });

  // Drop fully empty rows
  const filtered = data.filter((row) =>
    Object.values(row).some((v) => v.trim() !== '')
  );

  return { sheet: sheetTitle, data: filtered };
}

export async function GET(request: NextRequest) {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    const meta = await sheets.spreadsheets.get({
      spreadsheetId,
      fields: 'sheets.properties.title',
    });

    const tabTitles =
      meta.data.sheets
        ?.map((s) => s.properties?.title)
        .filter((t): t is string => Boolean(t)) ?? [];

    const requested = request.nextUrl.searchParams.get('tab');

    // Exact tab request: only that sheet (404 if missing/empty) so clients
    // can fall back to mock data when a program tab is not yet created.
    if (requested) {
      if (!tabTitles.includes(requested)) {
        return NextResponse.json(
          {
            message: `Tab "${requested}" tidak ditemukan`,
            sheet: null,
            tabs: tabTitles,
            data: [],
          },
          { status: 404 }
        );
      }

      const result = await readSheet(sheets, spreadsheetId!, requested);
      if (result.data.length === 0) {
        return NextResponse.json(
          {
            message: 'Data tidak ditemukan',
            sheet: result.sheet,
            tabs: tabTitles,
            data: [],
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        data: result.data,
        sheet: result.sheet,
        tabs: tabTitles,
      });
    }

    // Prefer tabs likely to hold Mengajar / student rows
    const preferredOrder = [
      'Data Siswa',
      'Data_Siswa',
      'IDN Mengajar',
      'Sheet1',
      'Mengajar',
      'Data',
      ...tabTitles,
    ].filter((t): t is string => typeof t === 'string' && tabTitles.includes(t));

    const uniqueTabs = [...new Set(preferredOrder)];

    let selected: { sheet: string; data: Record<string, string>[] } | null =
      null;

    for (const title of uniqueTabs) {
      const result = await readSheet(sheets, spreadsheetId!, title);
      if (result.data.length > 0) {
        selected = result;
        break;
      }
      if (!selected) selected = result;
    }

    if (!selected || selected.data.length === 0) {
      return NextResponse.json(
        {
          message: 'Data tidak ditemukan',
          sheet: selected?.sheet ?? null,
          tabs: tabTitles,
          data: [],
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: selected.data,
      sheet: selected.sheet,
      tabs: tabTitles,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error Google Sheets API:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data', details: message },
      { status: 500 }
    );
  }
}
