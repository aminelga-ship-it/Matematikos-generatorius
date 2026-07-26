import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface TaskRequest {
  grade: number;
  taskCount: number;
  prompt: string;
  difficulty: string;
  imageBase64?: string;
  withDiagram?: boolean;
  withGraph?: boolean;
}

interface DiagramConfig {
  type: string;
  parameters: Record<string, number>;
  labels: Record<string, string>;
}

interface Task {
  question: string;
  answer: string;
  solution: string;
  diagram_config?: DiagramConfig;
  function_equation?: string;
}

const gradeDescriptions: Record<number, string> = {
  1: "1 klasė (6-7 metai): sudėtis ir atimtis iki 20, skaičiavimas iki 100",
  2: "2 klasė (7-8 metai): sudėtis ir atimtis iki 100, dauginimas ir dalyba pradžia",
  3: "3 klasė (8-9 metai): dauginimas ir dalyba, skaičiavimas iki 1000",
  4: "4 klasė (9-10 metai): keturių veiksmų aritmetika, trupmenų pradžia, ilgiai ir svoriai",
  5: "5 klasė (10-11 metai): paprastosios trupmenos, dešimtainės trupmenos, procentai pradžia",
  6: "6 klasė (11-12 metai): procentai, santykiai, proporcijos, neigiami skaičiai",
  7: "7 klasė (12-13 metai): algebros pradžia, lygtys, koordinačių sistema, geometrija",
  8: "8 klasė (13-14 metai): lygčių sistemos, kvadratas ir kvadratinė šaknis, geometrija",
  9: "9 klasė (14-15 metai): kvadratinės lygtys, trigonometrija pradžia, statistika",
  10: "10 klasė (15-16 metai): trigonometrinės funkcijos, logaritmai pradžia, geometrija",
  11: "11 klasė (16-17 metai): derivatos, integralai pradžia, tikimybių teorija",
  12: "12 klasė (17-18 metai): integralai, begalinės eilutės, sudėtingesnė geometrija, brandos egzaminų lygis",
};

const GRADE_1_RULES = {
  grade: 1,
  curriculum: "LT 2022 Bendroji programa",
  purpose: "Formuoti skaičiaus sampratą, ugdyti loginį mąstymą, mokyti spręsti paprastas kasdienes matematines situacijas.",
  topics: [
    {
      id: "numbers",
      title: "Skaičiai iki 100",
      theory: [
        "Skaičių skaitymas ir rašymas",
        "Skaičių seka",
        "Skaičių palyginimas",
        "Didesnis, mažesnis, lygus",
        "Skaičiaus sudėtis",
        "Dešimtys ir vienetai",
      ],
      skills: ["Skaičiuoti pirmyn ir atgal", "Rasti kaimyninius skaičius", "Lyginti skaičius", "Sudaryti skaičių iš dalių"],
    },
    {
      id: "operations",
      title: "Sudėtis ir atimtis",
      theory: [
        "Sudėtis iki 20",
        "Atimtis iki 20",
        "Peržengiant dešimtį",
        "Veiksmų ryšys",
        "Nežinomas dėmuo arba atėminys",
      ],
      skills: ["Skaičiuoti mintinai", "Naudoti skaičiavimo strategijas", "Pasitikrinti atsakymą"],
    },
    {
      id: "word_problems",
      title: "Tekstiniai uždaviniai",
      theory: ["Vieno veiksmo uždaviniai", "Sudėties ir atimties situacijos", "Duomenų išskyrimas"],
      skills: ["Suprasti uždavinio tekstą", "Parinkti veiksmą", "Parašyti atsakymą"],
    },
    {
      id: "geometry",
      title: "Geometrija",
      theory: ["Taškas", "Linija", "Atkarpa", "Apskritimas", "Kvadratas", "Stačiakampis", "Trikampis"],
      skills: ["Atpažinti figūras", "Apibūdinti jų savybes", "Sudaryti figūras iš dalių"],
    },
    {
      id: "measurement",
      title: "Matavimai",
      theory: ["Ilgis", "Masė", "Talpa", "Laikas", "Pinigai"],
      skills: ["Palyginti dydžius", "Naudoti paprastus matavimo vienetus", "Spręsti praktines situacijas"],
    },
    {
      id: "patterns",
      title: "Dėsningumai",
      theory: ["Sekos", "Pasikartojantys raštai", "Paprastos taisyklės"],
      skills: ["Atpažinti dėsningumą", "Pratęsti seką", "Sukurti savo seką"],
    },
    {
      id: "data",
      title: "Duomenys",
      theory: ["Paprastos lentelės", "Piktogramos", "Duomenų palyginimas"],
      skills: ["Surinkti duomenis", "Perskaityti lentelę", "Padaryti paprastą išvadą"],
    },
  ],
  new_for_grade_1: [
    "Skaičiai iki 100",
    "Sudėtis ir atimtis iki 20 (įskaitant peržengiant dešimtį)",
    "Skaičiaus sandaros supratimas",
    "Tekstinių uždavinių sprendimo pradmenys",
    "Pagrindinės geometrinės figūros",
    "Praktiniai matavimai",
    "Paprasti duomenų vaizdavimo būdai",
  ],
  problem_types: [
    "Skaičiavimo pratimai",
    "Vieno veiksmo tekstiniai uždaviniai",
    "Skaičių palyginimas",
    "Figūrų atpažinimas",
    "Sekų tęsimas",
    "Praktiniai uždaviniai apie laiką, pinigus ir matavimus",
  ],
  difficulty: {
    basic: "Tiesioginis skaičiavimas arba atpažinimas.",
    intermediate: "Reikia pasirinkti tinkamą veiksmą arba pritaikyti taisyklę.",
    advanced: "Nestandartinis tekstinis arba loginis uždavinys su keliais samprotavimo žingsniais.",
  },
  expected_output: {
    always_show: ["Trumpa sprendimo eiga", "Naudotas veiksmas", "Galutinis atsakymas"],
    avoid: ["Sudėtingų matematinių terminų", "Kelių veiksmų sprendimų be paaiškinimo", "Vien atsakymo be sprendimo"],
  },
  teaching_focus: [
    "Skaičiaus samprata",
    "Loginis mąstymas",
    "Matematinis kalbėjimas",
    "Praktinis taikymas",
    "Pasitikėjimas sprendžiant paprastus uždavinius",
  ],
};

function buildGrade1Section(): string {
  const r = GRADE_1_RULES;
  const topicList = r.topics.map((t) => `  • ${t.title}: ${t.theory.join(", ")}`).join("\n");
  const newTopics = r.new_for_grade_1.map((n) => `  • ${n}`).join("\n");
  const problemTypes = r.problem_types.map((p) => `  • ${p}`).join("\n");
  const avoid = r.expected_output.avoid.map((a) => `  • ${a}`).join("\n");
  return `
1 KLASĖS MOKYMO PROGRAMA (${r.curriculum}):
Tikslas: ${r.purpose}

Leidžiamos temos ir teorija:
${topicList}

Pagrindinės temos 1 klasėje:
${newTopics}

Galimi uždavinių tipai:
${problemTypes}

DRAUDŽIAMA sprendime:
${avoid}

Sprendinyje VISADA rodyk: trumpą sprendimo eigą, naudotą veiksmą ir galutinį atsakymą.`;
}

const GRADE_5_RULES = {
  grade: 5,
  knowledge: {
    numbers: ["compare", "order", "round", "estimate", "add", "subtract", "multiply", "divide", "evaluate_expression"],
    fractions: ["find_equivalent", "simplify", "expand", "compare", "order", "add", "subtract"],
    decimals: ["compare", "order", "round", "add", "subtract", "multiply", "convert_fraction"],
    percent: ["understand", "convert_fraction", "convert_decimal", "find_percentage"],
    algebra: ["evaluate_expression", "find_unknown", "solve_simple_equation"],
    geometry: ["classify", "draw", "construct", "measure", "perimeter", "area"],
    measure: ["convert_units", "estimate", "time", "money"],
    stats: ["read_table", "read_chart", "create_table", "create_chart", "mean"],
  },
  problem_types: ["compute", "word", "geo", "measure", "stats", "real"],
  levels: {
    easy: "1 skill, 1 step",
    medium: "2 skills, ≤2 steps",
    hard: "multiple skills, ≤3 steps",
  },
  number_limits: {
    natural_max: 1000000,
    decimal_places_max: 3,
    allow_negative: false,
  },
  number_profile: {
    fractions: {
      easy: "same_denominator",
      medium: "related_denominators",
      hard: "small_coprime_denominators",
    },
  },
  forbidden: [
    "negative_numbers",
    "rational_numbers",
    "power",
    "square_root",
    "linear_equation_multi_step",
    "system_of_equations",
    "function",
    "direct_proportion",
    "inverse_proportion",
    "pythagorean_theorem",
    "probability",
  ],
};

const TOPIC_LABELS_5: Record<string, string> = {
  numbers: "Natūralieji skaičiai",
  fractions: "Trupmenos",
  decimals: "Dešimtainiai skaičiai",
  percent: "Procentai",
  algebra: "Algebriniai reiškiniai",
  geometry: "Geometrija",
  measure: "Matavimai",
  stats: "Statistika",
};

const FORBIDDEN_LABELS_5: Record<string, string> = {
  negative_numbers: "neigiami skaičiai",
  rational_numbers: "racionalieji skaičiai",
  power: "laipsniai",
  square_root: "kvadratinė šaknis",
  linear_equation_multi_step: "daugiažingsnės tiesinės lygtys",
  system_of_equations: "lygčių sistemos",
  function: "funkcijos",
  direct_proportion: "tiesioginis proporcingumas",
  inverse_proportion: "atvirkštinis proporcingumas",
  pythagorean_theorem: "Pitagoro teorema",
  probability: "tikimybė",
};

function buildGrade5Section(): string {
  const r = GRADE_5_RULES;
  const topicList = Object.entries(r.knowledge)
    .map(([k, skills]) => `  • ${TOPIC_LABELS_5[k] ?? k}: ${skills.join(", ")}`)
    .join("\n");
  const forbiddenList = r.forbidden
    .map((f) => `  • ${FORBIDDEN_LABELS_5[f] ?? f}`)
    .join("\n");
  return `
5 KLASĖS MOKYMO PROGRAMA:
Leidžiamos žinios ir gebėjimai:
${topicList}

Galimi uždavinių tipai: skaičiavimo pratimai, tekstiniai, geometrijos, matavimų, statistikos, realaus gyvenimo.

Sunkumo lygiai:
  • Lengvas: 1 gebėjimas, 1 žingsnis
  • Vidutinis: 2 gebėjimai, ≤2 žingsniai
  • Sunkus: keli gebėjimai, ≤3 žingsniai

Skaičių apribojimai:
  • Natūralieji skaičiai: maks. 1 000 000
  • Dešimtainiai skaičiai: maks. 3 skaitmenys po kablelio
  • Neigiami skaičiai: DRAUDŽIAMI

Trupmenų sunkumas:
  • Lengvas: vienodi vardikliai
  • Vidutinis: susiję vardikliai (vienas dalikliai iš kito)
  • Sunkus: maži tarpusavyje pirminiai vardikliai

ABSOLIUČIAI DRAUDŽIAMA naudoti:
${forbiddenList}`;
}

const GRADE_7_RULES = {
  grade: 7,
  curriculum: "LT 2022 Bendroji programa",
  purpose: "Spręsti uždavinius argumentuojant sprendimus, taikyti matematiką realiose situacijose, ugdyti matematinį samprotavimą.",
  topics: [
    {
      id: "numbers",
      title: "Racionalieji skaičiai",
      theory: [
        "Sveikieji ir racionalieji skaičiai",
        "Teigiami ir neigiami skaičiai",
        "Veiksmai su racionaliaisiais skaičiais",
        "Skaičių modulis",
        "Skaičių palyginimas",
        "Veiksmų tvarka",
        "Laipsnis su natūraliu rodikliu",
        "Skaičiavimai su trupmenomis ir dešimtainiais skaičiais",
      ],
      skills: ["Tiksliai skaičiuoti", "Pagrįsti veiksmų eigą", "Įvertinti atsakymo realumą"],
    },
    {
      id: "expressions",
      title: "Raidinės išraiškos",
      theory: [
        "Kintamasis",
        "Reiškinio reikšmė",
        "Vienanariai ir paprasti daugianariai",
        "Panašiųjų narių sutraukimas",
        "Formulių taikymas",
      ],
      skills: ["Sudaryti reiškinius pagal tekstą", "Supaprastinti reiškinius", "Apskaičiuoti reikšmes"],
    },
    {
      id: "equations",
      title: "Lygtys ir nelygybės",
      theory: ["Pirmosios eilės lygtis", "Lygties sprendimas", "Tekstiniai uždaviniai", "Paprastos nelygybės"],
      skills: ["Modeliuoti situacijas lygtimis", "Patikrinti sprendinį", "Interpretuoti rezultatą"],
    },
    {
      id: "proportions",
      title: "Santykiai ir proporcijos",
      theory: ["Santykis", "Proporcija", "Tiesioginis proporcingumas", "Atvirkštinis proporcingumas", "Mastelis"],
      skills: ["Spręsti praktinius uždavinius", "Naudoti proporcijas kasdienėse situacijose"],
    },
    {
      id: "geometry",
      title: "Geometrija",
      theory: [
        "Kampai",
        "Trikampiai",
        "Keturkampiai",
        "Apskritimas ir skritulys",
        "Perimetras",
        "Plotas",
        "Erdvinės figūros",
        "Tūrio samprata",
      ],
      skills: ["Atpažinti figūrų savybes", "Taikyti formules", "Argumentuoti geometrinius teiginius"],
    },
    {
      id: "coordinates",
      title: "Koordinačių sistema",
      theory: ["Taško koordinatės", "Koordinačių plokštuma", "Paprasti grafikai"],
      skills: ["Braižyti taškus", "Skaityti grafikus", "Interpretuoti priklausomybes"],
    },
    {
      id: "statistics",
      title: "Duomenys ir tikimybės",
      theory: [
        "Duomenų rinkimas",
        "Lentelės",
        "Diagramos",
        "Vidurkis",
        "Moda",
        "Mediana",
        "Paprasta tikimybė",
      ],
      skills: ["Analizuoti duomenis", "Daryti išvadas", "Vertinti informaciją"],
    },
  ],
  new_for_grade_7: [
    "Pilnas darbas su neigiamais racionaliaisiais skaičiais",
    "Raidinių reiškinių sistemingas taikymas",
    "Lygčių naudojimas tekstiniuose uždaviniuose",
    "Proporcingumo modeliai",
    "Koordinačių plokštumos taikymas",
    "Statistikos rodiklių (vidurkis, moda, mediana) taikymas",
    "Didesnis matematinio argumentavimo reikalavimas",
  ],
  problem_types: [
    "Vieno žingsnio skaičiavimai",
    "Kelių žingsnių skaičiavimai",
    "Tekstiniai uždaviniai",
    "Geometriniai įrodymai (paprasti)",
    "Modeliavimo uždaviniai",
    "Diagramų ir grafikų analizė",
    "Praktiniai gyvenimiški uždaviniai",
  ],
  difficulty: {
    basic: "Tiesioginis formulės ar taisyklės taikymas.",
    intermediate: "Kelių temų derinimas viename uždavinyje.",
    advanced: "Reikia pasirinkti metodą, argumentuoti sprendimą, analizuoti situaciją.",
  },
  expected_output: {
    always_show: [
      "Sprendimo eiga",
      "Naudota taisyklė",
      "Tarpiniai skaičiavimai",
      "Galutinis atsakymas su matavimo vienetais",
    ],
    avoid: ["Vien atsakymo pateikimo", "Nepaaiškintų veiksmų", "Neįvardytų matematinių taisyklių"],
  },
  teaching_focus: [
    "Matematinis samprotavimas",
    "Argumentavimas",
    "Modeliavimas",
    "Ryšys su realiomis situacijomis",
    "Skaitmeninis ir statistinis raštingumas",
  ],
};

function buildGrade7Section(): string {
  const r = GRADE_7_RULES;
  const topicList = r.topics.map((t) => `  • ${t.title}: ${t.theory.join(", ")}`).join("\n");
  const newTopics = r.new_for_grade_7.map((n) => `  • ${n}`).join("\n");
  const problemTypes = r.problem_types.map((p) => `  • ${p}`).join("\n");
  const avoid = r.expected_output.avoid.map((a) => `  • ${a}`).join("\n");
  return `
7 KLASĖS MOKYMO PROGRAMA (${r.curriculum}):
Tikslas: ${r.purpose}

Leidžiamos temos ir teorija:
${topicList}

Nauja 7 klasėje (lyginant su 6 klase):
${newTopics}

Galimi uždavinių tipai:
${problemTypes}

DRAUDŽIAMA sprendime:
${avoid}

Sprendinyje VISADA rodyk: sprendimo eigą, naudotą taisyklę, tarpinius skaičiavimus ir galutinį atsakymą su matavimo vienetais.`;
}

const GRADE_8_RULES = {
  grade: 8,
  topics: [
    {
      title: "Realieji skaičiai",
      theory: [
        "Racionalieji ir iracionalieji skaičiai",
        "Kvadratinė ir kūbinė šaknis",
        "Skaičių aibės",
        "Laipsniai su sveikuoju rodikliu",
        "Standartinė išraiška",
      ],
      skills: [
        "Skaičiuoti su realiaisiais skaičiais",
        "Taikyti šaknų savybes",
        "Prastinti raidinius reiškinius su šaknimis",
        "Taikyti standartinę išraišką",
      ],
    },
    {
      title: "Algebra",
      theory: [
        "Vienanaris ir daugianaris",
        "Daugianarių veiksmai",
        "Skaidymas dauginamaisiais",
        "Kvadratinės greitosios daugybos formulės",
      ],
      skills: [
        "Supaprastinti raidinius reiškinius",
        "Skaidyti daugianarius",
        "Taikyti kvadratines greitosios daugybos formules",
        "Apskaičiuoti reiškinius",
      ],
    },
    {
      title: "Lygčių sistemos",
      theory: [
        "Tiesinių lygčių sistemos",
        "Keitimo būdas",
        "Sudėties būdas",
        "Sulyginimo būdas",
        "Paprasti judėjimo uždaviniai",
      ],
      skills: ["Spręsti lygčių sistemas", "Pasirinkti tinkamą sprendimo būdą", "Modeliuoti paprastus uždavinius"],
    },
    {
      title: "Vektoriai",
      theory: ["Vektoriaus ilgis ir kryptis", "Vektorių sudėtis ir atimtis", "Vektoriaus daugyba iš skaičiaus"],
      skills: [
        "Atpažinti ir braižyti vektorius",
        "Atlikti veiksmus su vektoriais",
        "Taikyti vektorius paprastuose geometriniuose uždaviniuose",
      ],
    },
    {
      title: "Geometrija",
      theory: [
        "Pitagoro teorema ir atvirkštinė",
        "30°, 45° ir 60° kampų savybės",
        "Lygiašonis ir lygiakraštis trikampiai",
        "Trikampio vidurio linija",
        "Trapecijos vidurio linija",
      ],
      skills: ["Taikyti Pitagoro teoremą", "Naudoti kampų savybes", "Apskaičiuoti ilgius ir plotus"],
    },
    {
      title: "Erdviniai kūnai",
      theory: ["Stačioji prizmė", "Taisyklingoji piramidė", "Ritinys", "Kūgis", "Rutulys ir sfera"],
      skills: [
        "Atpažinti erdvinius kūnus",
        "Apskaičiuoti paviršiaus plotą ir tūrį",
        "Spręsti taikomuosius uždavinius",
      ],
    },
    {
      title: "Duomenys ir tikimybė",
      theory: ["Duomenų rinkimas", "Lentelės ir diagramos", "Tikimybė"],
      skills: ["Analizuoti duomenis", "Interpretuoti diagramas", "Įvertinti paprastų įvykių tikimybę"],
    },
    {
      title: "Finansiniai skaičiavimai",
      theory: [
        "Procentų taikymas",
        "Nuolaida",
        "Antkainis",
        "Paprastosios ir sudėtinės palūkanos",
        "Pajamos, išlaidos, pelnas ir nuostolis",
        "Pirkimas išsimokėtinai",
      ],
      skills: ["Atlikti paprastus finansinius skaičiavimus", "Spręsti gyvenimiškas problemas"],
    },
  ],
  new_for_grade_8: [
    "Iracionaliųjų skaičių ir šaknų naudojimas",
    "Daugianariai ir kvadratinės greitosios daugybos formulės",
    "Tiesinių lygčių sistemos",
    "Vektoriai",
    "Finansiniai skaičiavimai",
    "Pitagoro teorema",
    "Erdvinių kūnų paviršiaus plotai ir tūriai",
  ],
  difficulty: {
    lengvas: "1 taisyklė, 1 žingsnis",
    vidutinis: "Kelios taisyklės, 2–3 žingsniai",
    sunkus: "Kelios temos, daugiau nei 2 žingsniai",
  },
};

function buildGrade8Section(): string {
  const r = GRADE_8_RULES;
  const topicList = r.topics.map((t) => `  • ${t.title}: ${t.theory.join(", ")}`).join("\n");
  const newTopics = r.new_for_grade_8.map((n) => `  • ${n}`).join("\n");
  return `
8 KLASĖS MOKYMO PROGRAMA:
Leidžiamos temos ir teorija:
${topicList}

Nauja 8 klasėje (lyginant su 7 klase):
${newTopics}

Sunkumo lygiai:
  • Lengvas: ${r.difficulty.lengvas}
  • Vidutinis: ${r.difficulty.vidutinis}
  • Sunkus: ${r.difficulty.sunkus}

Sprendinyje VISADA rodyk: sprendimo eigą, naudotą taisyklę, tarpinius skaičiavimus ir galutinį atsakymą su matavimo vienetais.`;
}

const GRADE_9_RULES = {
  grade: 9,
  topics: [
    {
      title: "Skaičių sekos",
      theory: ["n-tojo nario formulė", "Rekurentinis būdas"],
      skills: [
        "Atpažinti paprasčiausių sekų dėsningumus",
        "Rasti sekos narius ar jų numerius",
        "Sudaryti sekos formulę",
      ],
    },
    {
      title: "Algebra",
      theory: [
        "Trupmeninis raidinis reiškinys, jo apibrėžimo sritis",
        "Trupmeninių reiškinių prastinimas ir pertvarkymas",
        "Veiksmai su trupmeniniais reiškiniais",
        "Kvadratinio trinario skaidymas dauginamaisiais",
        "Trupmeninių reiškinių sudarymas",
      ],
      skills: [
        "Prastinti ir pertvarkyti reiškinius",
        "Atlikti veiksmus su trupmeniniais reiškiniais",
        "Skaidyti kvadratinius trinarus",
        "Sudaryti trupmeninius reiškinius",
      ],
    },
    {
      title: "Kvadratinės lygtys",
      theory: [
        "Nepilnoji ir pilnoji kvadratinė lygtis",
        "Diskriminantas",
        "Kvadratinės lygties sprendinių formulė",
      ],
      skills: ["Spręsti įvairias kvadratines lygtis"],
    },
    {
      title: "Lygčių sistemos",
      theory: ["Lygčių sistemos: 1 tiesinė ir 1 kvadratinė"],
      skills: [
        "Spręsti tiesines ir mišrias lygčių sistemas",
        "Sudaryti mišrias sistemas iš paprasto teksto",
        "Modeliuoti tik paprastas skaitines ir geometrines situacijas",
      ],
    },
    {
      title: "Funkcijos",
      theory: [
        "Tiesinė funkcija ir jos išraiška y=kx+b",
        "Parabolė ir jos išraiškos: y=ax²; y=ax²+c; y=ax²+bx+c; y=a(x−x₁)(x−x₂); y=a(x−m)²+n",
        "Įvairios funkcijos (naudojamos tik iš grafiko nustatyti savybes ar konkrečią x; y reikšmę)",
      ],
      skills: [
        "Braižyti tieses ir paraboles",
        "Nustatyti įvairių funkcijų savybes",
        "Spręsti grafinius uždavinius",
        "Rasti tiesės k ir b koeficientus, sudaryti tiesės formulę",
        "Rasti parabolės išraiškų koeficientus",
        "Spręsti nesudėtingus gyvenimiškus uždavinius su tiesine ir kvadratine funkcija",
        "Spręsti tiesinių ir kvadratinių lygčių sistemas grafiškai",
      ],
    },
    {
      title: "Trigonometrijos pradmenys",
      theory: [
        "Tik smailiojo kampo sin, cos, tan",
        "sin, cos, tan 30°, 45°, 60° tikslios reikšmės",
        "Trigonometrinio vieneto formulė",
        "tan išraiška per sin ir cos",
      ],
      skills: [
        "Rasti trikampio kraštines",
        "Rasti kampų dydžius",
        "Taikyti trigonometriją paprastos geometrijos ir praktiniuose uždaviniuose",
        "Prastinti paprasčiausius trigonometrinius reiškinius",
      ],
      forbidden: ["sin ir cos teoremos", ">90° kampai", "Vienetinis apskritimas", "tan tiesė"],
    },
    {
      title: "Apskritimo geometrija",
      theory: [
        "Centrinis ir įbrėžtinis kampai",
        "Liestinė ir kirstinė",
        "Išpjovos ir nuopjovos formulės",
        "Laikrodžio teorija",
      ],
      skills: [
        "Taikyti apskritimo savybes",
        "Apskaičiuoti išpjovos ir nuopjovos plotą bei perimetrą",
        "Spręsti kombinuotus paprastos ir apskritimo geometrijos uždavinius",
        "Apskaičiuoti kampą tarp laikrodžio rodyklių",
      ],
      instruction: "Sąlygoje pateikti „Laikykite π=3,14“ arba „Atsakymą pateikite su π“.",
    },
  ],
  new_for_grade_9: [
    "Skaičių sekos",
    "Kvadratinės lygtys",
    "Algebrinės trupmenos",
    "Funkcijos",
    "Apskritimo geometrijos savybės",
    "Trigonometrija",
  ],
  difficulty: {
    lengvas: "Paprasta lygtis, trumpas reiškinys, y=kx, y=ax², y=ax²+c, 1 žingsnio apskritimo geometrijos ar trigonometrijos uždaviniai.",
    vidutinis: "Ilgesni reiškiniai, visos aprašytos funkcijų išraiškos, 2–3 žingsnių apskritimo geometrijos ar trigonometrijos uždaviniai.",
    sunkus: "Lygčių ar reiškinių sudarymas, sudėtingesnės kvadratinės lygtys, funkcijų lygčių sudarymas, kelių dalių ar gyvenimiški uždaviniai, rekurentinės sekos, kombinuota kelių temų teorija, loginiai uždaviniai.",
  },
};

function buildGrade9Section(): string {
  const r = GRADE_9_RULES;
  const topicList = r.topics
    .map((t) => {
      const forbidden = "forbidden" in t && Array.isArray(t.forbidden)
        ? `\n    DRAUDŽIAMA: ${(t.forbidden as string[]).join(", ")}`
        : "";
      const instruction = "instruction" in t && t.instruction
        ? `\n    Pastaba: ${t.instruction}`
        : "";
      return `  • ${t.title}: ${t.theory.join(", ")}${forbidden}${instruction}`;
    })
    .join("\n");
  const newTopics = r.new_for_grade_9.map((n) => `  • ${n}`).join("\n");
  return `
9 KLASĖS MOKYMO PROGRAMA:
Leidžiamos temos ir teorija:
${topicList}

Nauja 9 klasėje (lyginant su 8 klase):
${newTopics}

Sunkumo lygiai:
  • Lengvas: ${r.difficulty.lengvas}
  • Vidutinis: ${r.difficulty.vidutinis}
  • Sunkus: ${r.difficulty.sunkus}

Sprendinyje VISADA rodyk: sprendimo eigą, naudotą taisyklę, tarpinius skaičiavimus ir galutinį atsakymą.`;
}

const difficultyDescriptions: Record<string, string> = {
  lengvos: "Lengvos užduotys: baziniai skaičiavimai, aiškios sąlygos, vienas sprendimo žingsnis.",
  vidutinės: `Vidutinio sunkumo užduotys — 2–3 NEPRIKLAUSOMI LOGINIAI ŽINGSNIAI (PRIVALOMA):
Kiekviena užduotis privalo reikalauti mažiausiai 2 nepriklausomų loginių žingsnių.
DRAUDŽIAMA: tiesioginis formulės taikymas su žinomomis reikšmėmis (pvz., „Apskaičiuok stačiakampio plotą, jei ilgis 5, plotis 3" — 1 žingsnis, per lengva).
PRIVALOMA: pirmiausia rasti vieną dydį iš sąlygos, tada juo pasinaudoti toliau. Arba kombinuoti 2 skirtingas taisykles/savybes viename sprendime.`,
  sunkios: `Sunkios užduotys — VBE A lygio standartas. PRIVALOMI kriterijai:
- Mažiausiai 4–6 sprendimo žingsniai su aiškia logine grandine
- Naudoti kintamųjų keitimą (pvz., $a^x = t$, $\\sin x = t$, $u = \\ln x$) rodiklinėse / trig. / logaritminėse nelygybėse ar lygtyse
- Kelių tipų sąlygos viename uždavinyje (pvz., logaritminė nelygybė + ODA tikrinimas, trig. lygtis + nurodytas intervalas)
- Netradiciniai metodai: parametrai, absoliučiosios vertės atvejų analizė, kvadratinė nelygybė viršūnės metodu
- Sprendimas privalo turėti aiškiai pažymėtus ODA tikrinimus ir galutinių atsakymų intervalus rašomus $\\cup$ / $\\cap$ žymėjimu
- PRIVALOMI TIPAI: rodiklinė nelygybė su keitimu (pvz., $4^x - 6 \\cdot 2^x + 8 \\leq 0$, keitimas $t = 2^x$); logaritminė (pvz., $\\log_2(x-1) + \\log_2(x+2) > 3$); trig. (pvz., $2\\sin^2 x - 3\\sin x + 1 < 0$, $x \\in [0;\\, 2\\pi]$); kombinuota su moduliu (pvz., $|x^2 - 4| \\leq x + 2$)
- DRAUDŽIAMA generuoti trivialias vieno žingsnio lygtis — kiekviena užduotis turi būti realus iššūkis abiturientui`,
};

function selectModel(grade: number): string {
  return grade <= 6 ? "gpt-4o-mini" : "gpt-4o";
}

function buildDifficultyDescription(difficulty: string, grade: number): string {
  if (difficulty === "sunkios") {
    if (grade <= 4) {
      return `Sunkios užduotys (${grade} klasė): kelių veiksmų tekstiniai uždaviniai su 3–4 aritmetiniais veiksmais, nestandartiniai sprendimo keliai, skaičių savybių taikymas. DRAUDŽIAMA algebrą ar aukštesniųjų klasių metodus.`;
    }
    if (grade <= 6) {
      return `Sunkios užduotys (${grade} klasė) — GRIEŽTAI 3–4 LOGINIAI ŽINGSNIAI (PRIVALOMA):

KIEKVIENA užduotis privalo reikalauti mažiausiai 3–4 nepriklausomų loginių žingsnių. Tiesioginis skaičių įstatymas į formulę yra DRAUDŽIAMAS.

PRIVALOMA STRUKTŪRA — uždavinys turi būti KOMBINUOTAS arba NETIESIOGINIS:
- GEOMETRIJA (plotas/perimetras): DRAUDŽIAMA duoti kraštines tiesiogiai. Reikia: rasti vieną dydį per kitą, tada juo naudotis toliau. Pvz.: „Stačiakampio plotis $6\\text{ cm}$, jo plotas lygus kvadrato, kurio perimetras $24\\text{ cm}$, plotui. Raskite stačiakampio perimetrą." (1: kvadrato kraštinė $= 24 : 4 = 6\\text{ cm}$; 2: kvadrato plotas $= 6^2 = 36\\text{ cm}^2$; 3: stačiakampio ilgis $= 36 : 6 = 6\\text{ cm}$; 4: stačiakampio perimetras $= 2 \\cdot (6 + 6) = 24\\text{ cm}$).
- PROCENTAI: Ne „rask 20% nuo 150". O pvz.: „Prekė kainavo $X$. Po $15\\%$ nuolaidos ji kainuoja $Y$. Kita prekė kainuoja 2 kartus daugiau nei $Y$. Kiek kainuoja abi prekės kartu?" (3–4 žingsniai).
- TRUPMENOS: Ne „susumuok $\\frac{1}{2} + \\frac{1}{3}$". O daugiapakopiai: „Iš $60$ mokinių $\\frac{1}{3}$ sportuoja, $\\frac{1}{4}$ iš likusių dainuoja. Kiek mokinių nedaro nei vieno?" (3 žingsniai).
- SANTYKIAI/PROPORCIJOS: Kombinuoti su tekstine situacija, kur reikia pirmiausia rasti vieną dydį, tada juo remiantis — kitą.

GRIEŽTAI DRAUDŽIAMI uždaviniai (per paprasti sunkiam lygiui):
- „Stačiakampio ilgis $8\\text{ cm}$, plotis $5\\text{ cm}$. Rask plotą." (1 žingsnis — per lengva)
- „Rask $25\\%$ nuo $200$." (1 žingsnis — per lengva)
- „Susumuok $\\frac{1}{4} + \\frac{1}{2}$." (1 žingsnis — per lengva)
- Bet kuris uždavinys, kur atsakymas gaunamas vienu tiesiogiu skaičiavimu.

DRAUDŽIAMA algebrainės lygtys su nežinomuoju.`;
    }
    if (grade <= 8) {
      return `Sunkios užduotys (${grade} klasė): sudėtingos lygtys ir jų sistemos, daugiažingsniai uždaviniai derinant kelias taisykles, geometrija su papildoma algebra. Mažiausiai 3–4 sprendimo žingsniai su aiškia logine grandine.`;
    }
    return difficultyDescriptions["sunkios"];
  }

  if (difficulty === "vidutinės") {
    const base = difficultyDescriptions["vidutinės"];
    if (grade >= 5 && grade <= 6) {
      return base + `\n5–6 KLASEI SPECIFIŠKAI: naudok daugiau nei dviženklius skaičius (pvz., 347, 1285), veiksmų eilės taisykles su skliausteliais (pvz., $3 \\cdot (125 - 47) + 264 : 4$), trupmenų sudėtį su nevienodais vardikliais, paprastas tekstines situacijas (pvz., parduotuvės, greitį, pinigus).`;
    }
    if (grade >= 7 && grade <= 8) {
      return base + `\n7–8 KLASEI — GEOMETRIJA (PRIVALOMA):
- DRAUDŽIAMA: „Trikampis ABC turi kampus 60°, 70°, ?. Rask trečią." (1 žingsnis)
- DRAUDŽIAMA: „Stačiakampio kraštinės 4 ir 6. Rask plotą." (1 žingsnis)
- PRIVALOMA — kombinuok bent 2 skirtingus geometrinius faktus:
  Pvz.: „Lygiagrečios tiesės $a$ ir $b$ kirtos kirstine. Vienas kampas yra $3x + 10°$, kitas — $5x - 20°$. Rask $x$ ir visus kampus." (reikia: lygiagretumo savybė → lygtis → sprendimas → patikrinimas)
  Pvz.: „Trikampio ABC kampas A = 50°, kampas B = 2·kampas C. Rask kampus B ir C. Kokio tipo šis trikampis?" (reikia: kampų suma → lygtis → klasifikacija)
  Pvz.: „Lygiagretainio plotas 48 cm², aukštis 6 cm. Šoninė kraštinė dvigubai ilgesnė nei pagrindas. Rask perimetrą." (reikia: plotas → pagrindas → šonas → perimetras)
- Kampų uždaviniuose: duok algebraines išraiškas (pvz., $2x$, $3α-15°$), ne tiesiogiai skaičius.`;
    }
    return base;
  }

  return difficultyDescriptions["lengvos"];
}

function buildFormattingSection(grade: number): string {
  if (grade <= 4) {
    return `FORMULIŲ FORMATAVIMAS:
- Skaičius rašyk tiesiogiai. Matematinius reiškinius apgaub $...$: pvz., $3 + 5 = 8$, $12 \\cdot 4$
- JSON BACKSLASH TAISYKLĖ: \\\\cdot, \\\\times ir t.t.`;
  }
  if (grade <= 6) {
    return `FORMULIŲ FORMATAVIMAS:
- Matematines išraiškas apgaub $...$: pvz., $\\frac{3}{4}$, $25\\%$, $3 \\cdot (125 - 47)$
- Trupmenos: VISADA $\\frac{a}{b}$ — NIEKADA 3/4 su pasviruoju brūkšniu
- JSON BACKSLASH TAISYKLĖ: \\\\frac, \\\\cdot, \\\\times ir t.t.`;
  }
  if (grade <= 10) {
    return `FORMULIŲ FORMATAVIMAS:
- Visas išraiškas apgaub $...$ (inline) arba $$...$$ (atskira eilutė)
- Trupmenos: $\\frac{a}{b}$ — NIEKADA a/b su pasviruoju brūkšniu
- Laipsniai: $x^2$; šaknis: $\\sqrt{x}$; absoliučioji vertė: $|x|$
- Kintamieji tekste: $x$, $a$; simboliai: $\\leq$, $\\geq$, $\\neq$, $\\infty$
- JSON BACKSLASH TAISYKLĖ: \\\\frac, \\\\sqrt, \\\\leq, \\\\geq, \\\\neq ir t.t.`;
  }
  return `FORMULIŲ FORMATAVIMAS:
- Visas išraiškas apgaub $...$ (inline) arba $$...$$ (atskira eilutė)
- Trupmenos: $\\frac{a}{b}$; laipsniai: $x^2$; šaknis: $\\sqrt{x}$; abs. vertė: $|x|$
- Trig.: $\\sin x$, $\\cos x$, $\\tan x$; log.: $\\log_2 8$, $\\ln x$
- Simboliai: $\\leq$, $\\geq$, $\\neq$, $\\infty$, $\\cup$, $\\cap$; daugybos: $\\cdot$ arba $\\times$
- JSON BACKSLASH TAISYKLĖ: \\\\frac, \\\\sqrt, \\\\sin, \\\\cos, \\\\ln, \\\\log, \\\\leq, \\\\geq, \\\\neq ir t.t.`;
}

function buildTerminologySection(grade: number): string {
  if (grade >= 11) {
    return `TERMINOLOGIJA: Galima naudoti visą matematikos terminologiją — derivata, integralas, ekstremumas, monotoniškumas, asimptotė ir kt.`;
  }
  if (grade === 10) {
    return `TERMINOLOGIJA (10 klasė):
Galima: „trigonometrinės funkcijos", „logaritmas", „rodiklinė funkcija", „funkcija didėja/mažėja", „parabolė", „viršūnė", „diskriminantas".
DRAUDŽIAMA: „derivata", „integralas", „ekstremumas", „asimptotė", „monotoniškumas" — vietoj jų rašyk „didžiausia/mažiausia reikšmė", „funkcija didėja/mažėja".`;
  }
  if (grade === 9) {
    return `TERMINOLOGIJA (9 klasė):
Galima: „kvadratinė lygtis", „diskriminantas", „funkcijos nuliai", „parabolė", „viršūnė", „šakos nukreiptos aukštyn/žemyn", „didžiausia/mažiausia reikšmė", „tiesės lygtis $y = kx + b$".
DRAUDŽIAMA: „derivata", „integralas", „ekstremumas", „asimptotė", „monotoniškumas", „trigonometrinės funkcijos", „logaritmas".`;
  }
  if (grade >= 7) {
    return `TERMINOLOGIJA (${grade} klasė):
Galima: „lygtis", „reiškinys", „koordinatė", „absoliučioji reikšmė $|x|$", sudėtis/atimtis/daugyba/dalyba.
DRAUDŽIAMA: „kvadratinė lygtis", „diskriminantas", „derivata", „integralas", „ekstremumas", „asimptotė", „logaritmas", „trigonometrinės funkcijos".`;
  }
  if (grade >= 5) {
    return `TERMINOLOGIJA (${grade} klasė):
Galima: „trupmena", „procentas", „proporcija", „santykis", „sudėtis", „atimtis", „daugyba", „dalyba".
DRAUDŽIAMA: visi algebros, geometrijos ir aukštesnių klasių terminai (lygtys, koordinatės, logaritmai ir pan.).`;
  }
  return `TERMINOLOGIJA (${grade} klasė): Tik „sudėtis", „atimtis", „daugyba", „dalyba", „skaičius"${grade >= 3 ? `, „trupmena"` : ""}. Jokie algebros ar geometrijos terminai.`;
}

// Normalise LaTeX backslashes after JSON.parse.
//
// JSON spec defines these single-backslash escape sequences:
//   \f → U+000C form feed    (consumes backslash + f  → e.g. \frac becomes <FF>rac)
//   \b → U+0008 backspace   (consumes backslash + b  → e.g. \begin becomes <BS>egin)
//   \t → U+0009 tab         (consumes backslash + t  → e.g. \text becomes <HT>ext)
//   \n → U+000A newline     (consumes backslash + n  → e.g. \neq becomes <LF>eq)
//   \r → U+000D carriage return (consumes backslash + r)
//
// Recovery rule: control_char + remaining_letters → \control_letter + remaining_letters
//   U+000C + "rac{3}{4}"  → \frac{3}{4}   (prepend \f, not just \)
//   U+0008 + "egin{..."   → \begin{...
//   U+0009 + "ext{"       → \text{
//
function fixLatex(text: string): string {
  return text
    // Form feed (0x0C) came from JSON eating \f — prepend \f to restore
    .replace(/\u000C([a-zA-Z]+)/g, "\\f$1")
    // Backspace (0x08) came from JSON eating \b — prepend \b to restore
    .replace(/\u0008([a-zA-Z]+)/g, "\\b$1")
    // Tab (0x09) came from JSON eating \t — only fix before known LaTeX 't'-commands
    // (broad replacement risks mangling plain-text words that follow real tabs)
    .replace(/\u0009(ext\{)/g, "\\text{")
    .replace(/\u0009(heta\b)/g, "\\theta")
    .replace(/\u0009(imes\b)/g, "\\times")
    .replace(/\u0009(an(?:h)?\b)/g, "\\t$1")
    .replace(/\u0009(o\b)/g, "\\to")
    // Double-escaped backslashes: AI writes \\cmd in JSON source,
    // JSON.parse converts to a string with two chars: backslash + cmd.
    .replace(/\\\\([a-zA-Z]+)/g, "\\$1") // \\cmd → \cmd
    .replace(/\\\\,/g, "\\,")
    .replace(/\\\\!/g, "\\!")
    .replace(/\\\\;/g, "\\;")
    .replace(/\\\\:/g, "\\:");
}

function fixTaskLatex(task: Task): Task {
  return {
    question: fixLatex(task.question),
    answer: fixLatex(task.answer),
    solution: fixLatex(task.solution),
    diagram_config: task.diagram_config,
    function_equation: task.function_equation,
  };
}

function buildGradeConstraints(grade: number): string {
  if (grade === 3) return `
GRIEŽTI 3 KLASĖS APRIBOJIMAI (PRIVALOMA):
- DRAUDŽIAMA naudoti dvi trupmenas viename veiksme ar vienoje išraiškoje (pvz., $\\frac{3}{4} + \\frac{1}{8}$, $\\frac{2}{3} \\cdot \\frac{3}{5}$, $\\frac{5}{6} - \\frac{1}{3}$ ir panašiai).
- Trupmena leidžiama TIK šiuose kontekstuose:
    (a) Natūralusis skaičius dauginamas iš vienos trupmenos: pvz., $3 \\times \\frac{1}{4}$, $8 \\times \\frac{1}{2}$.
    (b) Trupmena naudojama kaip dalis visumos tekste: „$\\frac{1}{2}$ pyrago", „$\\frac{1}{4}$ litro", „$\\frac{3}{4}$ kelio".
- Kiekvienoje užduotyje trupmena gali būti TIKTAI VIENA — niekada dvi ar daugiau trupmenų viename sakinyje ar išraiškoje.
- Daugumai užduočių (bent pusei) nenaudok trupmenų iš viso — naudok dauginimą, dalybą, sudėtį ir atimtį iki 1000.`;

  if (grade === 7) return `
GRIEŽTI 7 KLASĖS APRIBOJIMAI — LAIPSNIAI (PRIVALOMA):
Kai tema susijusi su laipsniais ar eksponentais, tiesioginis skaičiaus kėlimas laipsniu (pvz., „Apskaičiuok $3^4$") NĖRA pakankamas uždavinio elementas — tai tik pagalbinis žingsnis, ne esminis. Uždaviniai su laipsniais privalo reikalauti LAIPSNIŲ SAVYBIŲ taikymo:
  (a) Sandaugos savybė: $a^m \\cdot a^n = a^{m+n}$
  (b) Dalybos savybė: $\\frac{a^m}{a^n} = a^{m-n}$
  (c) Laipsnio laipsnis: $(a^m)^n = a^{m \\cdot n}$
  (d) Sandaugos laipsnis: $(a \\cdot b)^n = a^n \\cdot b^n$
  (e) Nulinė rodiklio savybė: $a^0 = 1$

LEISTINI laipsnių uždaviniai:
  - „Suprastink: $\\frac{a^5 \\cdot a^3}{a^4}$" (sandaugos + dalybos savybė)
  - „Apskaičiuok: $\\frac{2^7 \\cdot 2^3}{2^4 \\cdot 2^2}$" (kelios savybės iš eilės)
  - „Suprastink: $(x^3)^2 \\cdot x^0$" (laipsnio laipsnis + nulinė savybė)
  - „Rask $n$, jei $2^n \\cdot 2^3 = 2^7$" (savybės + lygtis)

DRAUDŽIAMI laipsnių uždaviniai (per paprasti):
  - „Apskaičiuok $2^5$" — tiesioginis skaičiavimas, savybių nereikia
  - „Kiek yra $3^3$?" — tas pats
  - „Parašyk $8$ kaip $2$ laipsnį" — taip pat per lengva`;

  if (grade === 5) return "";

  return "";
}

function buildDiagramSection(): string {
  Kai užduočiai reikalingas geometrinis brėžinys (withDiagram: true), PRIVALOMA grąžinti "diagram_config" objektą su figūros tipu ir reikšmių žymėjimais.

GALIMI FIGŪRŲ TIPAI IR JŲ RAKTAI:

1. 2D FIGŪROS:
- "KVADRATAS" arba "SQUARE": labels -> { "a": "kraštinė" }
- "STAČIAKAMPIS" arba "RECTANGLE": labels -> { "a": "ilgis", "b": "plotis" }
- "ROMBAS" arba "RHOMBUS": labels -> { "a": "kraštinė", "d1": "įstrižainė 1", "d2": "įstrižainė 2" }
- "LYGIAGRETAINIS" arba "PARALLELOGRAM": labels -> { "a": "pagrindas", "b": "šoninė kraštinė", "h": "aukštinė" }
- "TRAPECIJA" arba "TRAPEZOID": labels -> { "a": "viršutinis pagrindas", "b": "apatinis pagrindas", "h": "aukštinė" }
- "STATUSIS_TRIKAMPIS" arba "RIGHT_TRIANGLE": labels -> { "a": "statinis 1", "b": "statinis 2", "c": "įžambinė" }
- "TRIKAMPIS" arba "TRIANGLE": labels -> { "a": "pagrindas", "b": "šoninė kraštinė", "h": "aukštinė" }
- "APSKRITIMAS" arba "CIRCLE": labels -> { "r": "spindulys", "d": "skersmuo" }

2. 3D FIGŪROS:
- "KUBAS" arba "CUBE": labels -> { "a": "briauna" }
- "GRETASIENIS" arba "CUBOID": labels -> { "a": "ilgis", "b": "plotis", "h": "aukštis" }
- "TRIKAMPE_PIRAMIDE" arba "TRIANGULAR_PYRAMID": labels -> { "a": "pagrindo kraštinė", "h": "piramidės aukštinė", "l": "apotema" }
- "KETURKAMPE_PIRAMIDE" arba "SQUARE_PYRAMID": labels -> { "a": "pagrindo kraštinė", "h": "piramidės aukštinė", "l": "apotema" }
- "KŪGIS" arba "CONE": labels -> { "r": "spindulys", "h": "aukštinė", "l": "sudaromoji" }
- "RITINYS" arba "CYLINDER": labels -> { "r": "spindulys", "h": "aukštinė" }

PAVYZDYS JSON STRUKTŪROS:
"diagram_config": {
  "type": "KETURKAMPE_PIRAMIDE",
  "labels": {
    "a": "6 cm",
    "h": "8 cm",
    "l": "10 cm"
  }
}
}

function buildSystemPrompt(grade: number, difficulty: string, taskCount: number, withDiagram: boolean, withGraph: boolean): string {
  const diagramSection = withDiagram ? buildDiagramSection() : "";

  const graphEquationRule = withGraph
    ? `\nFUNKCIJŲ GRAFIKAS — PRIVALOMA (function_equation laukas):
KIEKVIENOJE užduotyje PRIVALOMA grąžinti "function_equation" lauką su funkcijos formule.
Tai yra griežtas reikalavimas — užduotis be šio lauko bus laikoma neteisinga.
Generuok TIKTAI funkcijų užduotis (tiesinė, kvadratinė, kubinė, trigonometrinė, eksponentinė, logaritminė ir pan.).
Formulės formatas:
  • Tiesinė:       "y=2*x-3"
  • Kvadratinė:    "y=x^2-4"  arba  "y=(x-2)^2-3"
  • Kubinė:        "y=x^3-3*x"
  • Hiperbolė:     "y=1/x"
  • Eksponentinė:  "y=2^x"
  • Logaritminė:   "y=log(x)"
  • Trigonometrinė:"y=sin(x)"  arba  "y=cos(x)"
  • Šaknies:       "y=sqrt(x)"
Taisyklės:
1. Kėlimui laipsniu naudok "^" (pvz. "x^2").`
    : `\nFUNKCIJŲ GRAFIKAS (function_equation laukas — neprivalomas):
Kai užduotis susijusi su funkcija, kurią galima nubraižyti, PRIDĖK "function_equation" lauką.
Formulės formatas: "y=2*x-3", "y=x^2-4", "y=sin(x)" ir pan.
Taisyklės:
1. Formulė VISADA prasideda "y=".
2. Naudok "*" daugybai (pvz. "2*x", ne "2x").
3. Kėlimui laipsniu naudok "^" (pvz. "x^2").
4. Jei užduotis NETURI funkcijos (geometrija, procentai, tekstiniai uždaviniai) — function_equation laukas NEĮTRAUKIAMAS.`;

  const jsonEquationLine = `\n      "function_equation": "y=x^2-4"`;
  const jsonEquationOptional = `\n      "function_equation": "y=2*x-3"`;

  const jsonExample = withDiagram
    ? `{
  "tasks": [
    {
      "question": "Užduoties tekstas su $formulėmis$",
      "answer": "Galutinis atsakymas, pvz. $x = 3$",
      "solution": "Sprendimas žingsniais su $formulėmis$",
      "diagram_config": { "type": "triangle", "parameters": { "a": 5, "b": 4, "c": 6 }, "labels": { "a": "5 cm", "b": "?", "c": "6 cm" } }${withGraph ? "," + jsonEquationLine : ""}
    }
  ]
}`
    : `{
  "tasks": [
    {
      "question": "Užduoties tekstas su $formulėmis$",
      "answer": "Galutinis atsakymas, pvz. $x = 3$",
      "solution": "Sprendimas žingsniais su $formulėmis$"${withGraph ? "," + jsonEquationLine : ",\n      // neprivaloma: " + jsonEquationOptional}
    }
  ]
}`;

  return `Esi lietuviškas matematikos mokytojas. Generuok TIKSLIAI ${taskCount} matematikos užduočių lietuvių kalba Lietuvos moksleiviams.

Klasė: ${gradeDescriptions[grade] ?? `${grade} klasė`}
Sunkumo lygis: ${buildDifficultyDescription(difficulty, grade)}${buildGradeConstraints(grade)}

PRIVALOMA: grąžink TIKSLIAI ${taskCount} užduotis "tasks" masyve. Jei prašoma 1 — grąžink 1, jei 5 — grąžink 5.

UŽDUOČIŲ TIPAS (LABAI SVARBU):
- Jei vartotojas prašo lygties, nelygybės, reiškinio, išraiškos ar skaičiavimo — generuok GRYNĄ matematinę užduotį be jokio tekstinio pasakojimo. Pvz.: "Išspręsk lygtį $x^2 - 5x + 6 = 0$" arba "Suprastink reiškinį $\\frac{x^2-1}{x-1}$". Jokios parduotuvės, automobiliai, obuoliai ar panašios istorijos.
- Tekstinį (situacinį) uždavinį generuok TIK jei vartotojas aiškiai prašo žodinės / tekstinės / gyvenimiškos užduoties.
- Laikykis šio principo griežtai pagal vartotojo prašymą.

${buildTerminologySection(grade)}${grade === 1 ? buildGrade1Section() : grade === 5 ? buildGrade5Section() : grade === 7 ? buildGrade7Section() : grade === 8 ? buildGrade8Section() : grade === 9 ? buildGrade9Section() : ""}

SPRENDIMAI (PRIVALOMA):
- Sprendimas GLAUSTAS — maksimaliai 3–4 esminiai žingsniai, tik gryni matematiniai veiksmai.
- Teisingai: „1. $2x = 8$ 2. $x = 4$". Neteisingai: „Pirmiausia perkelkime narius..."

MATEMATINIS TIKSLUMAS (ABSOLIUČIAI PRIVALOMA — NEKLYSTAMA):
Prieš grąžinant, PATIKRINK kiekvieną teiginį ir kiekvieną naudojamą taisyklę.

DRAUDŽIAMOS KLAIDINGOS GEOMETRINĖS TAISYKLĖS:
- „Pusiaukraštinė lygi pusei kraštinės" — NETEISINGA bendram trikampiui.
  Tai galioja TIK stačiakampiam trikampiui: pusiaukraštinė Į ĮSTRIŽAINĘ = įstrižainė / 2.
  Bendram trikampiui naudok formulę: $m_a = \\frac{1}{2}\\sqrt{2b^2 + 2c^2 - a^2}$
- „Trikampio pusiaukraštinė dalinasi santykiu 2:1" — tai yra MEDIANOS ir svorio centro savybė, NE bet kurios pusiaukraštinės
- Draudžiama taikyti specifinius teoremas (pvz., Pitagoro, medianų formules, kampų bisektrises) kaip bendras taisykles, kai sąlyga jų netenkina
- Kiekvieną žingsnį PATIKRINK: ar sąlyga (pvz., ar trikampis statusis?) tikrai suteikia teisę naudoti šią taisyklę?

SAVITIKRINIMO REIKALAVIMAS:
Prieš grąžinant JSON — perskaityk sprendimą nuo pradžios. Patikrink:
1. Ar galutinis atsakymas sutampa su sąlyga (įstatyk atgal)?
2. Ar kiekviena naudojama taisyklė/teorema tikrai taikoma ŠIAI figūrai, ne tik panašiai?
3. Ar skaičiai geometriškai galimi (trikampio nelygybė, kampų suma = 180° ir pan.)?
${diagramSection}
${graphEquationRule}
${buildFormattingSection(grade)}

Grąžink atsakymą TIKTAI kaip JSON objektą (be markdown, be papildomo teksto) su TIKSLIAI ${taskCount} elementais masyve:
${jsonExample}`;
}

function buildUserMessage(taskCount: number, prompt: string): string {
  return `Sugeneruok ${taskCount} matematikos užduočių pagal šį aprašymą:\n\n${prompt}\n\nGrąžink tik JSON objektą su "tasks" masyvu.`;
}

function buildImageUserContent(taskCount: number, prompt: string, imageBase64: string): object[] {
  const mimeMatch = imageBase64.match(/^data:(image\/[a-z]+);base64,/);
  const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";
  const base64Data = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");

  const textPart = prompt && prompt.trim().length >= 3
    ? `Nuotraukoje pavaizduota užduotis. Sugeneruok ${taskCount} panašių užduočių.\n\nPapildomas aprašymas: ${prompt}\n\nGrąžink tik JSON objektą su "tasks" masyvu.`
    : `Nuotraukoje pavaizduota matematikos užduotis. Nuskaityk ją ir sugeneruok ${taskCount} panašių užduočių.\n\nGrąžink tik JSON objektą su "tasks" masyvu.`;

  return [
    { type: "image_url", image_url: { url: `data:${mimeType};base64,${base64Data}`, detail: "high" } },
    { type: "text", text: textPart },
  ];
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { grade, taskCount, prompt, difficulty, imageBase64, withDiagram, withGraph }: TaskRequest = await req.json();

    if (!grade || grade < 1 || grade > 12) {
      return new Response(
        JSON.stringify({ error: "Netinkama klasė. Pasirinkite nuo 1 iki 12." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!taskCount || taskCount < 1 || taskCount > 30) {
      return new Response(
        JSON.stringify({ error: "Netinkamas užduočių skaičius. Pasirinkite nuo 1 iki 30." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const hasPrompt = prompt && prompt.trim().length >= 3;
    const hasImage = !!imageBase64;

    if (!hasPrompt && !hasImage) {
      return new Response(
        JSON.stringify({ error: "Prašome aprašyti norimą užduotį arba įkelti nuotrauką." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const openaiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiKey) {
      return new Response(
        JSON.stringify({ error: "OpenAI API raktas nesukonfigūruotas." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userContent = imageBase64
      ? buildImageUserContent(taskCount, prompt, imageBase64)
      : buildUserMessage(taskCount, prompt);

    const openaiBody: Record<string, unknown> = {
      model: selectModel(grade),
      messages: [
        { role: "system", content: buildSystemPrompt(grade, difficulty ?? "vidutinės", taskCount, !!(withDiagram && grade >= 7), !!(withGraph && grade >= 9)) },
        { role: "user", content: userContent },
      ],
      temperature: 0.7,
      max_tokens: 8000,
    };

    // response_format: json_object forces valid JSON without markdown fences.
    // Not supported for vision (multimodal) requests.
    if (!imageBase64) {
      openaiBody.response_format = { type: "json_object" };
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify(openaiBody),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenAI error:", errText);
      return new Response(
        JSON.stringify({ error: "Nepavyko susisiekti su AI paslauga." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content ?? "";

    let tasks: Task[] = [];
    try {
      // Strip markdown fences (vision responses may include them)
      const cleaned = content.replace(/^```[\w]*\n?/m, "").replace(/```[\s]*$/m, "").trim();
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed)) {
        tasks = parsed;
      } else if (Array.isArray(parsed.tasks)) {
        tasks = parsed.tasks;
      } else {
        throw new Error("No tasks array in response");
      }
      // Normalise any double-escaped LaTeX backslashes the AI may have produced
      tasks = tasks.map(fixTaskLatex);
      // When graph mode is active, drop any task missing function_equation
      if (withGraph && grade >= 9) {
        tasks = tasks.filter((t) => typeof t.function_equation === "string" && t.function_equation.trim().length > 0);
      }
    } catch {
      console.error("Failed to parse AI response:", content);
      return new Response(
        JSON.stringify({ error: "Nepavyko apdoroti AI atsakymo. Bandykite dar kartą." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ tasks }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(
      JSON.stringify({ error: "Įvyko klaida. Bandykite dar kartą." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
