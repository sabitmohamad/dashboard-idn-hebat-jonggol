import type {
  PodcastSession,
  WetSession,
  WttSession,
} from "@/src/data/mockTalking";

/**
 * Indeks kolom tab `Talking_Log` (A = 0 … N = 13).
 * Tiga tabel program berdampingan dalam baris yang sama.
 *
 * Podcast: A no | B name_podcast | C date_podcast | D topic_podcast | E status_podcast
 * (F kosong)
 * WTT:     G name_wtt | H class_wtt | I date_wtt
 * (J kosong)
 * WET:     K name_wet | L class_wet | M date_wet | N status_wet
 */

const PODCAST_HEADERS = new Set([
  "no",
  "no.",
  "nomor",
  "name_podcast",
  "nama podcast",
]);
const WTT_HEADERS = new Set([
  "name_wtt",
  "nama wtt",
  "nama",
  "weekly talk",
]);
const WET_HEADERS = new Set([
  "name_wet",
  "nama wet",
  "nama",
  "weekly english talk",
]);

function cell(row: unknown[], index: number): string {
  const value = row[index];
  if (value === undefined || value === null) return "";
  return String(value).trim();
}

function toNumber(value: string): number {
  const n = Number(value.replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function mapPodcast(row: unknown[]): PodcastSession | null {
  const noRaw = cell(row, 0);
  const name = cell(row, 1);
  const topic = cell(row, 3);
  if (PODCAST_HEADERS.has(noRaw.toLowerCase()) || PODCAST_HEADERS.has(name.toLowerCase())) {
    return null;
  }
  if (!name && !topic) return null;
  return {
    no: toNumber(noRaw),
    name_podcast: name,
    date_podcast: cell(row, 2),
    topic_podcast: topic,
    status_podcast: cell(row, 4),
  };
}

function mapWtt(row: unknown[]): WttSession | null {
  const name = cell(row, 6);
  const className = cell(row, 7);
  const date = cell(row, 8);
  if (WTT_HEADERS.has(name.toLowerCase())) return null;
  if (!name && !date) return null;
  return {
    name_wtt: name,
    class_wtt: className,
    date_wtt: date,
  };
}

function mapWet(row: unknown[]): WetSession | null {
  const name = cell(row, 10);
  const className = cell(row, 11);
  const date = cell(row, 12);
  const status = cell(row, 13);
  if (WET_HEADERS.has(name.toLowerCase())) return null;
  if (!name && !date) return null;
  return {
    name_wet: name,
    class_wet: className,
    date_wet: date,
    status_wet: status,
  };
}

export function mapSheetsRowsToTalking(rows: unknown[][]): {
  podcast: PodcastSession[];
  wtt: WttSession[];
  wet: WetSession[];
} {
  const podcast: PodcastSession[] = [];
  const wtt: WttSession[] = [];
  const wet: WetSession[] = [];

  for (const row of rows) {
    const p = mapPodcast(row);
    if (p) podcast.push(p);
    const w = mapWtt(row);
    if (w) wtt.push(w);
    const e = mapWet(row);
    if (e) wet.push(e);
  }

  return { podcast, wtt, wet };
}
