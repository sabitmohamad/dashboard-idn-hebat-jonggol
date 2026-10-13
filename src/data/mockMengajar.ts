/**
 * Struktur objek selaras dengan tab Google Sheets `Mengajar_Log`.
 * A–D: rekap siswa · E–L: log kegiatan mengajar.
 */

export interface RekapSiswaMengajar {
  id: string;
  kelas: string;
  nama: string;
  totalMengajar: number;
}

export interface LogMengajar {
  no: string;
  namaSiswa: string;
  namaSekolah: string;
  bulan: string;
  pekan: string;
  materi: string;
  tanggal: string;
  jumlahPeserta: number;
}

export interface MengajarPayload {
  rekap: RekapSiswaMengajar[];
  log: LogMengajar[];
  connected: boolean;
  sheet: string | null;
  source: "sheets" | "mock";
  message?: string;
}

export const MOCK_REKAP_MENGAJAR: RekapSiswaMengajar[] = [
  { id: "S-001", kelas: "9B", nama: "Rajjah Abqory Yasir", totalMengajar: 9 },
  { id: "S-002", kelas: "9B", nama: "Salman Hanan Mufti", totalMengajar: 7 },
  { id: "S-003", kelas: "9C", nama: "Almer Hadyan Raditya Den", totalMengajar: 7 },
  { id: "S-004", kelas: "9A", nama: "Ahmad Syafi Multazam", totalMengajar: 6 },
  { id: "S-005", kelas: "9C", nama: "Abdul Malik Karim Arvinahl", totalMengajar: 5 },
  { id: "S-006", kelas: "8A", nama: "Muhammad Al Ghani Izzaldin", totalMengajar: 5 },
  { id: "S-007", kelas: "8A", nama: "Muhammad Fathan Ghifari", totalMengajar: 4 },
  { id: "S-008", kelas: "9B", nama: "Utara Wicaksono", totalMengajar: 4 },
  { id: "S-009", kelas: "8C", nama: "Zidane Fathan Alfarisii", totalMengajar: 3 },
  { id: "S-010", kelas: "8B", nama: "Khairy Nabihan Elfathin", totalMengajar: 3 },
  { id: "S-011", kelas: "9D", nama: "Hans Roy Ghaffar", totalMengajar: 2 },
  { id: "S-012", kelas: "8C", nama: "Yandhi Herlambang", totalMengajar: 2 },
];

export const MOCK_LOG_MENGAJAR: LogMengajar[] = [
  {
    no: "1",
    namaSiswa: "Rajjah Abqory Yasir, Salman Hanan Mufti, Utara Wicaksono",
    namaSekolah: "SDI As Salam Joglo",
    bulan: "Juli",
    pekan: "3",
    materi: "Game Scratch - Block Braker",
    tanggal: "14 - 16 Juli 2026",
    jumlahPeserta: 25,
  },
  {
    no: "2",
    namaSiswa: "Almer Hadyan Raditya Den, Ahmad Syafi Multazam",
    namaSekolah: "SDN Jonggol 01",
    bulan: "Juli",
    pekan: "4",
    materi: "Pengenalan Coding dengan Code.org",
    tanggal: "21 - 22 Juli 2026",
    jumlahPeserta: 30,
  },
  {
    no: "3",
    namaSiswa: "Abdul Malik Karim Arvinahl, Muhammad Al Ghani Izzaldin, Rajjah Abqory Yasir",
    namaSekolah: "MI Al-Hikmah Cileungsi",
    bulan: "Agustus",
    pekan: "1",
    materi: "Game Scratch - Block Braker",
    tanggal: "4 - 6 Agustus 2026",
    jumlahPeserta: 22,
  },
  {
    no: "4",
    namaSiswa: "Salman Hanan Mufti, Almer Hadyan Raditya Den",
    namaSekolah: "SDI As Salam Joglo",
    bulan: "Agustus",
    pekan: "2",
    materi: "Desain Grafis dengan Canva",
    tanggal: "11 - 13 Agustus 2026",
    jumlahPeserta: 25,
  },
  {
    no: "5",
    namaSiswa: "Muhammad Fathan Ghifari, Zidane Fathan Alfarisii, Khairy Nabihan Elfathin",
    namaSekolah: "SDN Sukamanah 02",
    bulan: "Agustus",
    pekan: "3",
    materi: "Pengenalan Coding dengan Code.org",
    tanggal: "18 - 19 Agustus 2026",
    jumlahPeserta: 28,
  },
  {
    no: "6",
    namaSiswa: "Rajjah Abqory Yasir, Ahmad Syafi Multazam, Utara Wicaksono",
    namaSekolah: "SD IT Nurul Falah",
    bulan: "Agustus",
    pekan: "4",
    materi: "Robotik Dasar dengan Micro:bit",
    tanggal: "25 - 27 Agustus 2026",
    jumlahPeserta: 20,
  },
  {
    no: "7",
    namaSiswa: "Abdul Malik Karim Arvinahl, Hans Roy Ghaffar",
    namaSekolah: "MI Al-Hikmah Cileungsi",
    bulan: "September",
    pekan: "1",
    materi: "Robotik Dasar dengan Micro:bit",
    tanggal: "1 - 3 September 2026",
    jumlahPeserta: 24,
  },
  {
    no: "8",
    namaSiswa: "Muhammad Al Ghani Izzaldin, Yandhi Herlambang, Almer Hadyan Raditya Den",
    namaSekolah: "SDN Jonggol 01",
    bulan: "September",
    pekan: "2",
    materi: "Game Scratch - Block Braker",
    tanggal: "8 - 10 September 2026",
    jumlahPeserta: 32,
  },
];

export const MOCK_MENGAJAR_PAYLOAD: MengajarPayload = {
  rekap: MOCK_REKAP_MENGAJAR,
  log: MOCK_LOG_MENGAJAR,
  connected: false,
  sheet: null,
  source: "mock",
};
