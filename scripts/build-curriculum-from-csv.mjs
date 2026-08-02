/**
 * Usage: node scripts/build-curriculum-from-csv.mjs "path/to/file.csv"
 * Writes supabase/migrations/20260730200000_curriculum_all_grades.sql
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function parseCsvLine(line) {
  const out = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (c === "," && !inQuotes) {
      out.push(cur.trim());
      cur = "";
      continue;
    }
    cur += c;
  }
  out.push(cur.trim());
  return out;
}

const LT = { ą: "a", č: "c", ę: "e", ė: "e", į: "i", š: "s", ų: "u", ū: "u", ž: "z" };

function slugify(text) {
  let s = text
    .toLowerCase()
    .replace(/[ąčęėįšųūž]/g, (ch) => LT[ch] ?? ch)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  if (!s) s = "item";
  return s.slice(0, 55);
}

function uniqueSlug(base, used) {
  let s = slugify(base);
  let n = 1;
  while (used.has(s)) {
    s = `${slugify(base).slice(0, 48)}-${++n}`;
  }
  used.add(s);
  return s;
}

function escapeSql(s) {
  return s.replace(/'/g, "''");
}

function parseCurriculum(csvText) {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  let start = 0;
  if (lines[0].toLowerCase().includes("klasė") || lines[0].toLowerCase().includes("tema")) {
    start = 1;
  }

  let grade = null;
  let currentTopic = null;
  const topics = [];
  const subtopics = [];

  for (let i = start; i < lines.length; i++) {
    const [kRaw, tRaw, pRaw] = parseCsvLine(lines[i]);
    const k = kRaw.trim();
    const t = tRaw.trim();
    const p = pRaw.trim().replace(/^[•\u2022]\s*/, "");

    if (k) {
      const g = parseInt(k, 10);
      if (!isNaN(g) && g >= 1 && g <= 12) grade = g;
    }

    if (t && grade != null) {
      currentTopic = { grade, title: t, subtopics: [] };
      topics.push(currentTopic);
      if (p) currentTopic.subtopics.push(p);
      continue;
    }

    if (p && currentTopic) {
      currentTopic.subtopics.push(p);
    }
  }

  return topics;
}

function buildSql(topicsFlat) {
  const topicSlugUsed = new Set();
  const topicRows = [];
  const subtopicRows = [];
  const gradeTopicSort = {};

  for (const topic of topicsFlat) {
    gradeTopicSort[topic.grade] = (gradeTopicSort[topic.grade] ?? 0) + 1;
    const topicSlug = uniqueSlug(`${topic.grade}-${topic.title}`, topicSlugUsed);
    topicRows.push({
      grade: topic.grade,
      slug: topicSlug,
      title: topic.title,
      sort: gradeTopicSort[topic.grade],
    });

    const subUsed = new Set();
    topic.subtopics.forEach((title, idx) => {
      const stSlug = uniqueSlug(title, subUsed);
      subtopicRows.push({
        grade: topic.grade,
        topicSlug,
        slug: stSlug,
        title,
        sort: idx + 1,
      });
    });
  }

  let sql = `/*
# Visų klasių curriculum (iš CSV)
*/

DELETE FROM curriculum_subtopics;
DELETE FROM curriculum_topics;

INSERT INTO curriculum_topics (grade, slug, title, sort_order) VALUES
`;

  sql += topicRows
    .map((r) => `  (${r.grade}, '${escapeSql(r.slug)}', '${escapeSql(r.title)}', ${r.sort})`)
    .join(",\n");

  sql += `
ON CONFLICT (grade, slug) DO UPDATE SET
  title = EXCLUDED.title,
  sort_order = EXCLUDED.sort_order;

INSERT INTO curriculum_subtopics (topic_id, slug, title, sort_order)
SELECT t.id, s.slug, s.title, s.ord
FROM curriculum_topics t
JOIN (VALUES
`;

  sql += subtopicRows
    .map(
      (r) =>
        `  (${r.grade}, '${escapeSql(r.topicSlug)}', '${escapeSql(r.slug)}', '${escapeSql(r.title)}', ${r.sort})`,
    )
    .join(",\n");

  sql += `
) AS s(grade, topic_slug, slug, title, ord)
  ON t.grade = s.grade AND t.slug = s.topic_slug
ON CONFLICT (topic_id, slug) DO UPDATE SET
  title = EXCLUDED.title,
  sort_order = EXCLUDED.sort_order;
`;

  return { sql, topicCount: topicRows.length, subtopicCount: subtopicRows.length };
}

const csvPath = process.argv[2];
if (!csvPath) {
  console.error("Provide CSV path");
  process.exit(1);
}

const csv = fs.readFileSync(csvPath, "utf8");
const topics = parseCurriculum(csv);
const { sql, topicCount, subtopicCount } = buildSql(topics);

const outPath = path.join(__dirname, "../supabase/migrations/20260730200000_curriculum_all_grades.sql");
fs.writeFileSync(outPath, sql, "utf8");
console.log(`Wrote ${outPath}: ${topicCount} topics, ${subtopicCount} subtopics`);
