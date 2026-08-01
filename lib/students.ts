export interface IdnStudent {
  name: string;
  /** Raw grade+section as rostered, e.g. "9B" */
  grade: string;
  /** Display class, e.g. "IX-B" */
  className: string;
}

const GRADE_MAP: Record<string, string> = {
  "7": "VII",
  "8": "VIII",
  "9": "IX",
};

function toClassName(grade: string): string {
  const match = grade.match(/^(\d)([A-D])$/i);
  if (!match) return grade;
  const roman = GRADE_MAP[match[1]] ?? match[1];
  return `${roman}-${match[2].toUpperCase()}`;
}

function student(name: string, grade: string): IdnStudent {
  return { name, grade, className: toClassName(grade) };
}

/** Canonical IDN Jonggol student roster for mock / fallback data. */
export const IDN_STUDENTS: IdnStudent[] = [
  student("Rajjah Abqory Yasir", "9B"),
  student("Salman Hanan Mufti", "9B"),
  student("Utara Wicaksono", "9B"),
  student("Abdul Malik Karim Arvinahl", "9C"),
  student("Ahsan Khalifi Fajriyanto", "9C"),
  student("Almer Hadyan Raditya Den", "9C"),
  student("Yandhi Herlambang", "8C"),
  student("Zidane Fathan Alfarisii", "8C"),
  student("Achtarruziq Ali Firnandi", "7A"),
  student("Ahmad Husein", "7A"),
  student("Hazlam Ibad Athaillah", "7B"),
  student("Kenzie Aflah Mulyana", "7B"),
  student("Rayyan Firdaus Sudais", "7C"),
  student("Sabil Tsaqib Hasibuan", "7C"),
  student("Hans Roy Ghaffar", "9D"),
  student("Ahmad Syafi Multazam", "9A"),
  student("Muhammad Al Ghani Izzaldin", "8A"),
  student("Muhammad Fathan Ghifari", "8A"),
  student("Khairy Nabihan Elfathin", "8B"),
  student("Luqman", "8B"),
];

export function getStudent(name: string): IdnStudent {
  const found = IDN_STUDENTS.find(
    (s) => s.name.toLowerCase() === name.toLowerCase()
  );
  if (!found) {
    throw new Error(`IDN student not in roster: ${name}`);
  }
  return found;
}

/** Stable pick by index (wraps) for distributing roster across tabs. */
export function pickStudents(...indices: number[]): IdnStudent[] {
  return indices.map((i) => IDN_STUDENTS[i % IDN_STUDENTS.length]);
}
