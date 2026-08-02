/**
 * ŠABLONAS naujai klasei — nukopijuok į gradeRules.ts ir užpildyk.
 * Failas neimportuojamas Edge funkcijoje (tik dokumentacija).
 */

// --- 1. Detalus objektas (tavo darbo dokumentas) ---
export const GRADE_2_RULES_EXAMPLE = {
  grade: 2,
  curriculum: "LT 2022 Bendroji programa",
  purpose: "…",
  topics: [
    {
      id: "numbers",
      title: "Skaičiai iki 100",
      theory: ["…"],
      skills: ["…"],
    },
  ],
  number_limits: {
    natural_max: 100,
    allow_negative: false,
  },
  forbidden: ["…"],
} as const;

// --- 2. Kompaktiška eilutė į system promptą (tokenų taupymas) ---
export function buildGrade2SectionExample(): string {
  const t = GRADE_2_RULES_EXAMPLE.topics.map((x) => x.title).join(", ");
  return `2 KL.: temos — ${t}. Skaičiai iki 100; … Draudžiama: …`;
}

// --- 3. Registracija gradeRules.ts faile ---
// GRADE_CURRICULUM_SECTIONS[2] = buildGrade2Section;

// --- 4. Papildomos taisyklės (optional) — buildGradeConstraints(grade) switch ---
// if (grade === 2) return `2 KL.: …`;
