export type DiagramType =
  | "SQUARE" | "RECTANGLE" | "RHOMBUS" | "PARALLELOGRAM" | "TRAPEZOID"
  | "RIGHT_TRIANGLE" | "TRIANGLE" | "CIRCLE"
  | "SIMILAR_TRIANGLES" | "CONGRUENT_TRIANGLES"
  | "CUBE" | "CUBOID" | "SQUARE_PYRAMID" | "TRIANGULAR_PYRAMID"
  | "CONE" | "CYLINDER";

export interface DiagramConfig {
  type: DiagramType;
  labels: Record<string, string>;
}

const DIAGRAM_TYPES_ALL = [
  "SQUARE", "RECTANGLE", "RHOMBUS", "PARALLELOGRAM", "TRAPEZOID",
  "RIGHT_TRIANGLE", "TRIANGLE", "CIRCLE",
  "SIMILAR_TRIANGLES", "CONGRUENT_TRIANGLES",
  "CUBE", "CUBOID", "SQUARE_PYRAMID", "TRIANGULAR_PYRAMID",
  "CONE", "CYLINDER",
] as const;

/** 1–6 kl. — tik plokščios figūros ir poros trikampių (be 3D). */
const DIAGRAM_TYPES_ELEMENTARY = [
  "SQUARE", "RECTANGLE", "TRIANGLE", "RIGHT_TRIANGLE", "CIRCLE",
  "SIMILAR_TRIANGLES", "CONGRUENT_TRIANGLES",
] as const;

const DIAGRAM_TYPE_ALIASES: Record<string, string> = {
  KVADRATAS: "SQUARE",
  "STAČIAKAMPIS": "RECTANGLE",
  STACIAKAMPIS: "RECTANGLE",
  ROMBAS: "RHOMBUS",
  LYGIAGRETAINIS: "PARALLELOGRAM",
  TRAPECIJA: "TRAPEZOID",
  "STATUSIS_TRIKAMPIS": "RIGHT_TRIANGLE",
  STATUSIS_TRIKAMPIS: "RIGHT_TRIANGLE",
  TRIKAMPIS: "TRIANGLE",
  ISOSCELES_TRIANGLE: "TRIANGLE",
  APSKRITIMAS: "CIRCLE",
  PANAŠŪS_TRIKAMPAI: "SIMILAR_TRIANGLES",
  PANASUS_TRIKAMPIAI: "SIMILAR_TRIANGLES",
  SIMILAR_TRIANGLES: "SIMILAR_TRIANGLES",
  LYGŪS_TRIKAMPAI: "CONGRUENT_TRIANGLES",
  LYGUS_TRIKAMPIAI: "CONGRUENT_TRIANGLES",
  CONGRUENT_TRIANGLES: "CONGRUENT_TRIANGLES",
  KUBAS: "CUBE",
  GRETASIENIS: "CUBOID",
  "STACIAKAMPIS_GRETASIENIS": "CUBOID",
  "STAČIAKAMPIS_GRETASIENIS": "CUBOID",
  "KETURKAMPE_PIRAMIDE": "SQUARE_PYRAMID",
  "KETURKAMPĖ_PIRAMIDĖ": "SQUARE_PYRAMID",
  KETURKAMPE_PIRAMIDE: "SQUARE_PYRAMID",
  "KETURKAMPIS": "SQUARE_PYRAMID",
  "TRIKAMPE_PIRAMIDE": "TRIANGULAR_PYRAMID",
  "TRIKAMPĖ_PIRAMIDĖ": "TRIANGULAR_PYRAMID",
  TRIKAMPE_PIRAMIDE: "TRIANGULAR_PYRAMID",
  "KŪGIS": "CONE",
  KUGIS: "CONE",
  RITINYS: "CYLINDER",
};

export function normalizeDiagramType(raw: string): DiagramType | null {
  const upper = raw.toUpperCase().trim();
  if ((DIAGRAM_TYPES_ALL as readonly string[]).includes(upper)) return upper as DiagramType;
  const aliased = DIAGRAM_TYPE_ALIASES[upper];
  if (aliased) return aliased as DiagramType;
  return null;
}

export function buildDiagramSection(grade = 12): string {
  const elementary = grade >= 1 && grade <= 6;
  const types = elementary ? DIAGRAM_TYPES_ELEMENTARY : DIAGRAM_TYPES_ALL;

  const dualBlock = elementary
    ? `
- SIMILAR_TRIANGLES: du panašūs statusieji trikampiai (kairė mažesnė, dešinė didesnė) — labels: left_a, left_b, left_c (arba left_c:"X"), right_a, right_b, right_c. Nenaudok bendrų a,b,c abiem trikampiams — tik left_* ir right_*.
- CONGRUENT_TRIANGLES: du lygūs statusieji trikampiai — tie patys label raktai left_* / right_*.
- Ieškoma kraštinė — reikšmė "X" toje labels pozicijoje (pvz. right_a:"X" jei ieškomas statinis). question: „Raskite kraštinės $X$ ilgį“ — DRAUDŽIAMA minėti left_a, right_a ir kitus JSON raktus. answer: $X=6$ cm (skaičius).`
    : "";

  return `BRĖŽINYS (diagram_config):
- type ∈ {${types.join(", ")}}.
- labels — matmenys ant figūros (a,b,c,h,r…; left_a, right_b… poroms; reikšmės "5 cm", "12°", "X").
- Geometrijoje ieškoma kraštinė — visada "X", ne "?".
- Jei question nurodo skaičiuoti pagal brėžinį — diagram_config PRIVALOMAS; labels turi duotus skaičius + X kur reikia.
- DRAUDŽIAMA: tuščias labels {} kai užduotis remiasi brėžiniu.
- RIGHT_TRIANGLE: a,b statiniai, c įstrižainė. TRIANGLE: kraštinės a,b,c.${dualBlock}
- diagram_config neįtrauk, jei užduotis visiškai ne apie figūrą.`;
}

export function fixDiagramQuestionText(question: string, config?: DiagramConfig): string {
  if (!config?.labels) return question;
  const hasX = Object.values(config.labels).some(
    (v) => String(v ?? "").trim().toUpperCase() === "X",
  );
  if (!hasX) return question;

  let q = question;
  q = q.replace(/\b(left|right)_?[abc]\b/gi, "$X$");
  q = q.replace(/\b(right|left)\s+a\b/gi, "$X$");
  q = q.replace(/\braskite[^.?]*\bright_a\b/gi, "Raskite kraštinės $X$ ilgį");
  q = q.replace(/\braskite[^.?]*\bleft_a\b/gi, "Raskite kraštinės $X$ ilgį");
  if (!/\$X\$|\bX\b/i.test(q)) {
    q = `${q.replace(/\.\s*$/, "")}. Raskite kraštinės $X$ ilgį.`.replace(/\.\./g, ".");
  }
  return q.replace(/\s{2,}/g, " ").trim();
}

export function questionReferencesDiagram(question: string): boolean {
  return /brėžin|brėžinyje|diagram|figūr(?:oje|a|os)|pagal\s+(?:brėžin|duomenis|pateikt)|parodyt(?:a|as|i)|schema(?:je|)?/iu.test(
    question,
  );
}

export function countDiagramLabelValues(labels: Record<string, string> | undefined): number {
  if (!labels) return 0;
  return Object.values(labels).filter((v) => String(v ?? "").trim().length > 0).length;
}

export function diagramConfigHasRequiredData(
  question: string,
  config: DiagramConfig | undefined,
): boolean {
  const n = countDiagramLabelValues(config?.labels);
  if (questionReferencesDiagram(question)) {
    return n >= 2;
  }
  if (config) return n >= 2;
  return true;
}
