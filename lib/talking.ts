import type {
  PodcastSession,
  TalkingPayload,
  WetSession,
  WttSession,
} from "@/src/data/mockTalking";

export type TalkingTab = "podcast" | "wtt" | "wet";

export interface TalkingStats {
  totalPodcast: number;
  donePodcast: number;
  totalWtt: number;
  totalWet: number;
  doneWet: number;
}

export interface ProgramSlice {
  name: string;
  value: number;
  color: string;
}

export function isDoneStatus(value: string): boolean {
  return value.trim().toLowerCase() === "done";
}

/** Spreadsheet cells often store paired names with newlines or `&`. */
export function formatTalkingNames(value: string): string {
  return value
    .split(/\s*(?:\n|&|,|;|\s+dan\s+)\s*/i)
    .map((n) => n.trim())
    .filter(Boolean)
    .join(" · ");
}

export function computeTalkingStats(
  podcast: PodcastSession[],
  wtt: WttSession[],
  wet: WetSession[]
): TalkingStats {
  return {
    totalPodcast: podcast.length,
    donePodcast: podcast.filter((s) => isDoneStatus(s.status_podcast)).length,
    totalWtt: wtt.length,
    totalWet: wet.length,
    doneWet: wet.filter((s) => isDoneStatus(s.status_wet)).length,
  };
}

export function buildProgramSlices(stats: TalkingStats): ProgramSlice[] {
  return [
    { name: "Podcast", value: stats.totalPodcast, color: "#A855F7" },
    { name: "WTT", value: stats.totalWtt, color: "#EC4899" },
    { name: "WET", value: stats.totalWet, color: "#38BDF8" },
  ].filter((s) => s.value > 0);
}

export function topicBadgeClass(topic: string): string {
  const palette = [
    "border-fuchsia-400/40 bg-fuchsia-500/15 text-fuchsia-200",
    "border-violet-400/40 bg-violet-500/15 text-violet-200",
    "border-pink-400/40 bg-pink-500/15 text-pink-200",
    "border-purple-400/40 bg-purple-500/15 text-purple-200",
    "border-indigo-400/40 bg-indigo-500/15 text-indigo-200",
    "border-sky-400/40 bg-sky-500/15 text-sky-200",
  ];
  let hash = 0;
  for (let i = 0; i < topic.length; i += 1) {
    hash = (hash + topic.charCodeAt(i) * (i + 1)) % palette.length;
  }
  return palette[hash] ?? palette[0];
}

export function talkingCounts(data: TalkingPayload) {
  return {
    podcast: data.podcast.length,
    wtt: data.wtt.length,
    wet: data.wet.length,
  };
}
