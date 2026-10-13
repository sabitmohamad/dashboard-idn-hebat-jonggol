/**
 * Struktur objek selaras dengan tab Google Sheets `Talking_Log`.
 * Tiga program berdampingan dalam baris yang sama:
 * A–E Podcast · (F kosong) · G–I WTT · (J kosong) · K–N WET
 */

export interface PodcastSession {
  no: number;
  name_podcast: string;
  date_podcast: string;
  topic_podcast: string;
  status_podcast: string;
}

export interface WttSession {
  name_wtt: string;
  class_wtt: string;
  date_wtt: string;
}

export interface WetSession {
  name_wet: string;
  class_wet: string;
  date_wet: string;
  status_wet: string;
}

export interface TalkingPayload {
  podcast: PodcastSession[];
  wtt: WttSession[];
  wet: WetSession[];
  connected: boolean;
  sheet: string | null;
  source: "sheets" | "mock";
  message?: string;
}

export const MOCK_PODCAST: PodcastSession[] = [
  {
    no: 1,
    name_podcast: "Almer Hadyan Raditya Den",
    date_podcast: "12 Juli 2026",
    topic_podcast: "AI in Future Careers",
    status_podcast: "Done",
  },
  {
    no: 2,
    name_podcast: "Ahsan Khalifi Fajriyanto",
    date_podcast: "19 Juli 2026",
    topic_podcast: "Santri Tech Stories",
    status_podcast: "Done",
  },
  {
    no: 3,
    name_podcast: "Rajjah Abqory Yasir",
    date_podcast: "26 Juli 2026",
    topic_podcast: "Hackathon Mindset",
    status_podcast: "Done",
  },
  {
    no: 4,
    name_podcast: "Yandhi Herlambang",
    date_podcast: "2 Agustus 2026",
    topic_podcast: "Soft Skills for Speakers",
    status_podcast: "Scheduled",
  },
  {
    no: 5,
    name_podcast: "Hans Roy Ghaffar",
    date_podcast: "9 Agustus 2026",
    topic_podcast: "Building a Podcast Studio",
    status_podcast: "Done",
  },
  {
    no: 6,
    name_podcast: "Zidane Fathan Alfarisii",
    date_podcast: "16 Agustus 2026",
    topic_podcast: "English Confidence",
    status_podcast: "Done",
  },
];

export const MOCK_WTT: WttSession[] = [
  {
    name_wtt: "Hans Roy Ghaffar",
    class_wtt: "9D",
    date_wtt: "14 Juli 2026",
  },
  {
    name_wtt: "Rajjah Abqory Yasir, Salman Hanan Mufti",
    class_wtt: "9B",
    date_wtt: "21 Juli 2026",
  },
  {
    name_wtt: "Almer Hadyan Raditya Den",
    class_wtt: "9C",
    date_wtt: "28 Juli 2026",
  },
  {
    name_wtt: "Utara Wicaksono",
    class_wtt: "9B",
    date_wtt: "4 Agustus 2026",
  },
  {
    name_wtt: "Ahmad Syafi Multazam, Ahmad Husein",
    class_wtt: "9A",
    date_wtt: "11 Agustus 2026",
  },
  {
    name_wtt: "Kenzie Aflah Mulyana",
    class_wtt: "9C",
    date_wtt: "18 Agustus 2026",
  },
];

export const MOCK_WET: WetSession[] = [
  {
    name_wet: "Almer Hadyan Raditya Den",
    class_wet: "9C",
    date_wet: "15 Juli 2026",
    status_wet: "Done",
  },
  {
    name_wet: "Ahsan Khalifi Fajriyanto, Zidane Fathan Alfarisii",
    class_wet: "9C",
    date_wet: "22 Juli 2026",
    status_wet: "Done",
  },
  {
    name_wet: "Yandhi Herlambang",
    class_wet: "8C",
    date_wet: "29 Juli 2026",
    status_wet: "Done",
  },
  {
    name_wet: "Hans Roy Ghaffar",
    class_wet: "9D",
    date_wet: "5 Agustus 2026",
    status_wet: "Scheduled",
  },
  {
    name_wet: "Salman Hanan Mufti",
    class_wet: "9B",
    date_wet: "12 Agustus 2026",
    status_wet: "Done",
  },
  {
    name_wet: "Kenzie Aflah Mulyana, Utara Wicaksono",
    class_wet: "9C",
    date_wet: "19 Agustus 2026",
    status_wet: "Done",
  },
];

export const MOCK_TALKING_PAYLOAD: TalkingPayload = {
  podcast: MOCK_PODCAST,
  wtt: MOCK_WTT,
  wet: MOCK_WET,
  connected: false,
  sheet: null,
  source: "mock",
};
