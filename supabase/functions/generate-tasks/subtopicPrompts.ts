/** Potemės AI turinys: raktas `${grade}:${slug}` (slug iš curriculum_subtopics). */

export type SubtopicPromptEntry = {
  title: string;
  /** Lengva / Vidutinė / Sunki — visi lygiai viename bloke */
  body: string;
};

const SUBTOPIC_PROMPTS: Record<string, SubtopicPromptEntry> = {
  "11:aibes": {
    title: "Aibės",
    body: `Lengva: skaitinių aibių ir $\\mathbb{N}$, $\\mathbb{Z}$, $\\mathbb{Q}$, $\\mathbb{I}$, $\\mathbb{R}$ aibių sąjunga, sankirta, skirtumas.

Vidutinė: sąjunga, sankirta, skirtumas su intervalais (ne su pavieniais skaičiais); poaibiai; maždaug 50 % užduočių — aibei priešinga aibė (suvienalytėje aibėje).

Sunki: viskas iš vidutinio + veiksmų eilutės su intervalinių aibių veiksmais; tekstiniai sudėtingesni uždaviniai su aibėmis.`,
  },
  "11:modulis": {
    title: "Modulis",
    body: `Lengva: iracionalių skaitinių reiškinių prastinimas naudojant modulį; modulio savybės; raidiniuose reiškiniuose iškelti daugiklį prieš kvadratinės šaknies ženklą.

Vidutinė: raidinis iracionalus arba po moduliu reiškinys naudojant modulį, kai duotas $x$ intervalas; sudėtingesni skaitiniai moduliniai reiškiniai.

Sunki: raidinio iracionalaus reiškinio prastinimas, kai po šaknimi yra kvadratinis trinaris, skaidomas per dvinario kvadrato formulę; raidinis iracionalus reiškinys naudojant modulį, kai $x$ intervalas neduotas; sudėtingi raidiniai moduliniai reiškiniai.`,
  },
  "11:laipsniai-ir-saknys": {
    title: "Laipsniai ir šaknys",
    body: `Lengva: laipsnių su racionaliuoju rodikliu skaičiavimas taikant vieną savybę (vienodų pagrindų daugyba/dalyba, laipsnio kėlimas laipsniu, pvz. $27^{2/3}$); šaknies keitimas laipsniu su racionaliuoju rodikliu ir atvirkščiai ($a^{m/n}=\\sqrt[n]{a^m}$); paprastos šaknų savybės su skaičiais ($\\sqrt[n]{ab}$, $\\sqrt[n]{a/b}$).

Vidutinė: reiškinių prastinimas taikant kelias laipsnių/šaknų savybes iš eilės; daugiklio iškėlimas prieš šaknies ženklą ir įkėlimas po juo (su raidėmis, kai nurodytas kintamojo ženklas); $\\sqrt[2k]{a^{2k}}=|a|$ taikymas; kvadratų skirtumo formulė su laipsniais su racionaliuoju rodikliu (pvz. $(a^{1/2}+b^{1/2})(a^{1/2}-b^{1/2})$); laipsnio su racionaliuoju rodikliu apibrėžimo sritis.

Sunki: kelių žingsnių raidiniai reiškiniai su trupmenomis ir laipsniais su racionaliuoju rodikliu; sumos/skirtumo kubas ir kubų sumos/skirtumo formulės ($a^3\\pm b^3$ skaidymas); laipsniai su iracionaliaisiais rodikliais (pvz. $3^{1+\\sqrt{2}}\\cdot 3^{1-\\sqrt{2}}$); kombinuoti skaičiuojami reiškiniai su skirtingais pagrindais, šaknimis ir neigiamais rodikliais.`,
  },
  "8:tiesioginis-proporcingumas": {
    title: "Tiesioginis proporcingumas",
    body:
      "Skaičiavimai, tiesinės funkcijos grafikas ir jo braižymas; funkcija $y=kx$; praktinis panaudojimas, pvz., $S=v\\cdot t$ formulė ar gyvenimiškuose uždaviniuose.",
  },
  "8:atvirkstinis-proporcingumas": {
    title: "Atvirkštinis proporcingumas",
    body: "Skaičiavimai, $y=k/x$ formulė, teigiamos $x$ ašies grafikas; lentelės, tekstiniai uždaviniai.",
  },
  "8:lygtis-su-dviem-nezinomaisiais": {
    title: "Lygtis su dviem nežinomaisiais",
    body:
      "Kurk uždavinius, kur reikėtų rasti kelis galimus lygties sprendinius $x$ ir $y$. Pvz., lengvas uždavinys būtų: raskite lygties $2x+y=10$ tris galimas sprendinių poras.",
  },
  "9:nepilnosios": {
    title: "Nepilnosios",
    body: `Nepilnosios kvadratinės lygtys: $ax^2=0$, $ax^2+c=0$, $ax^2+bx=0$.

Lengva: trumpos lygtys (2–4 nariai), viena lygybės pusė arba vienas perkėlimas.

Vidutinė: nepilnosios su nariais abiejose lygybės pusėse (Viso ~5 narius); gali būti skliaustai, trupmeniniai skaičiai.

Sunki: sudėtingesnės nepilnosios — keli žingsniai, trupmena su skaitiniu vardikliu ($\\frac{\\dots}{n}$, ne raidė vardiklyje); sutraukti panašius narius prieš skaidymą dauginamaisiais ar panaudoti greitosios daugybos formules`,
  },
  "9:pilnosios": {
    title: "Pilnosios",
    body: `Pilnosios kvadratinės lygtys $ax^2+bx+c=0$ ($a\\neq 0$).

Lengva: trumpos pilnosios (2–4 nariai, viena pusė); gali būti tik diskriminanto ($D=b^2-4ac$) skaičiavimas arba $D$ ženklo nustatymas.

Vidutinė: išspręsti pilnąsias lygtis; $D>0$, $D<0$ arba $D=0$. Gali būti 5-6 nariai išsidėstę abiejose lygybės pusėse. Patikrink atsakymus.

Sunki: sudėtingos pilnosios (nariai abiejose pusėse, gali trupmena su skaitiniu vardikliu ar šiaip sudėtingesni skaičiai); Diskriminantas >0;<0;0. Gali būti paprastos lygtys su parametrais, kurios pereina į tiesinę nelygybę.`,
  },
  "9:kvadratinio-trinario-skaidymas": {
    title: "Kvadratinio trinario skaidymas",
    body: `Visiems lygiams — TIK skaidyti kvadratinį trinarį $ax^2+bx+c$ dauginamaisiais (arba $(ax\\pm b)^2$); negali būti užduoties išspręsti lygtį.

Lengva: trumpos lygtys (2–4 nariai), trinaris lengvai skaidomas ($x^2+bx+c$, $2x^2+4x$ ir pan.).

Vidutinė: Sudėtingesni kvadratiniai triniai (>3 nariai), gali būti atskliautimas, trupmeniniai skaičiai. Patikrink atsakymus.

Sunki: Daug narių. PIRMIAUSIA sutraukti panašius narius ar atlikti kitokius pertvarkymus, tik tada skaidyti trinarį dauginamaisiais. Patikrink atsakymus.`,
  },
  "9:9-kvadratines-lygtys:tekstiniai-uzdaviniai": {
    title: "Tekstiniai uždaviniai (kvadratinės lygtys)",
    body: `Visiems lygiams — TIK tekstiniai uždaviniai sudaryti lygtį ir išspręsti; (gyvenimiški, geometriniai); ne grynos lygtys be konteksto.

Lengva: trumpas, aiškus tekstas; sudaryti ir išspręsti nepilną kvadratinę lygtį arba paprastą pilną.

Vidutinė: sudėtingesnis tekstas,$D>0$, $D=0$. Būtinai patikrink atsakymus.

Sunki: sudėtingas tekstinis su geometrija; gali būti parametrinė sąlyga (pvz. rasti $m$, kai…), kai galutinis žingsnis — tik tiesinė nelygybė; gali būti kelių dalių uždavinys ar šiaip netradicinis, kūrybiškas. Būtinai patikrink atsakymus.`,
  },
  "9:trigonometrines-funkcijos": {
    title: "Trigonometrinės funkcijos",
    body: `$\\sin$, $\\cos$, $\\tan$ sąvokos (pvz sinus yra statinis prieš su įžambine…); reikšmių apytikslis skaičiavimas skaičiuotuvu; tikslus $\\sin$, $\\cos$, $\\tan$ radimas iš stataus trikampio brėžinio, kai duotos kraštinės; kampo skaičiavimas skaičiuotuvu, kai duoda $\\sin$, $\\cos$, $\\tan$ reikšmė.`,
  },
  "9:staciojo-trikampio-krastiniu-ir-kampu-skaiciavimas": {
    title: "Stačiojo trikampio kraštinių ir kampų skaičiavimas",
    body: `Stačiojo trikampio kraštinių ir kampų skaičiavimas taikant $\\sin$, $\\cos$, $\\tan$; naudok $30^\\circ$, $45^\\circ$, $60^\\circ$ tikslias reikšmes, Pitagoro teoremą ar kitas trikampio savybės sunkiame lygyje.`,
  },
  "9:trigonometrines-lygybes": {
    title: "Trigonometrinės lygybės",
    body: `Kurk užduotis, kur naudojamos šios formulės: $\\sin^2\\alpha + \\cos^2\\alpha = 1$ (ir jos išvediniai: $\\sin^2\\alpha = 1 - \\cos^2\\alpha$, $\\cos^2\\alpha = 1 - \\sin^2\\alpha$). Tangento apibrėžimas per sinusą ir kosinusą. Sunkiam lygiui šios formulės gali būti derinamos su greitosios daugybos formulėmis ar bendravardiklinimu.`,
  },
  "9:9-staciojo-trikampio-trigonometrija:tekstiniai-uzdaviniai": {
    title: "Tekstiniai uždaviniai (trigonometrija)",
    body: `Generuok realaus pasaulio konteksto uždavinius (pvz., pastato / medžio aukštis, šešėlis, atstumas iki objekto, įkalnės / pakilimo ir nusileidimo kampas). Uždavinys turi susivesti į stačiojo trikampio skaičiavimą pagal taikomą $\\sin$, $\\cos$ arba $\\tan$. Atsakymai turi būti apvalinami, kampai laipsniais vienetų tikslumu.`,
  },
  "9:centrinis-ir-ibreztinis-kampai": {
    title: "Centrinis ir įbrėžtinis kampai",
    body: `Naudok centrinio ir įbrėžtinio kampų savybę; tai, kad du įbrėžtiniai kampai, kurie remiasi į tą patį lanką, yra lygūs; įbrėžtinis kampas, kuris remiasi į skersmenį.`,
  },
  "9:liestine-ir-kirstine": {
    title: "Liestinė ir kirstinė",
    body: `Derink šias taisykles: spindulys yra statmenas apskritimo liestinei lietimosi taške; dvi liestinės išeinančios iš vieno taško yra lygios; skersmens ir stygos susikirtimo statmeni taisyklė; stygų susikirtimo taisyklė. Gali būti Pitagoro teorema, $30^\\circ$, $45^\\circ$, $60^\\circ$ kampai.`,
  },
  "9:ispjova-ir-nuopjova": {
    title: "Išpjova ir nuopjova",
    body: `Lanko ilgio, išpjovos ploto, nuopjovos ploto formulių taikymas su standartiniais $30^\\circ$, $45^\\circ$, $60^\\circ$, $90^\\circ$, $120^\\circ$, $150^\\circ$, $180^\\circ$ kampais.`,
  },
  "9:laikrodziai": {
    title: "Laikrodžiai",
    body: `Kurk užduotis, susijusias su kampais tarp laikrodžio valandinės ir minutinės rodyklių arba rodyklių nubrėžto lanko / išpjovos ilgio bei ploto skaičiavimu.`,
  },
  "9:ivairios-funkcijos": {
    title: "Įvairios funkcijos",
    body: `Kurk užduotis, kur reikia apskaičiuoti reikšmes $f(x)$, kai duotas $x$ arba rasti $x$, kai duotas $f(x)$; tikrinti, ar taškas priklauso funkcijai; liepti nubraižyti $y=kx+b$ grafiką ir iš jo nustatyti funkcijos savybes (teigiamos ir neigiamos, kur kerta abscisių ir ordinačių ašis; funkcijos nuliai ($y=0$)). Funkcijų savybių uždaviniuose atsakymų nereikia — answer: "". Taip pat kurk uždavinius, kur žodžiu užrašytą funkciją reikia parašyti formule.

Svarbūs $x$ ir $y$ terminai: $x$ = argumentas, nepriklausomas kintamasis; $f(5)$ — mokinys supranta, kad $x=5$; $A(3;y)$ — mokinys supranta, kad $x=3$; abscisių ašis arba $Ox$ ašis. $y=f(x)$ = funkcijos reikšmė = priklausomas kintamasis; $f(x)=3$ — mokinys supranta, kad $y=3$; ordinačių ašis — $Oy$ ašis; $A(x;2)$ — mokinys supranta, kad $y=2$.

Lengva: rasti $f(x)$, kai duotas $x$; funkcijos nuliai; tikrinti taško priklausymą funkcijai.

Vidutinė: rasti $x$, kai duotas $f(x)$; visos savybės; žodžius užrašyti formule.

Sunki: gali būti viskas; kelios užduotys vienoje; sudėtingesni skaičiai (trupmenos ir pan.).`,
  },
  "9:tiesines-funkcijos": {
    title: "Tiesinės funkcijos",
    body: `Kurk užduotis, kur reikia apskaičiuoti reikšmes $f(x)$, kai duotas $x$ arba rasti $x$, kai duotas $f(x)$; tikrinti, ar taškas priklauso funkcijai; liepti nubraižyti $y=kx+b$ grafiką ir iš jo nustatyti funkcijos savybes (apibrėžimo sritis, reikšmių sritis, didėjimo ir mažėjimo intervalai, teigiamos ir neigiamos, didžiausios ir mažiausios reikšmės, kur kerta abscisių ir ordinačių ašis; funkcijos nuliai ($y=0$)). Braižymo ir funkcijų savybių uždaviniuose atsakymų nereikia — answer: "". Taip pat kurk užduotis, kur reikia nustatyti funkcijos $f(x)=kx+b$ formulę, kai duoti du taškai arba tiesiog rasti koeficientus $k$ ir $b$. Taip pat žodžiu užrašytą funkciją parašyti formule arba paklausti, kaip funkcija pasikeis, jei kažkaip pakoreguosime $k$ ir $b$ koeficientus (nereikia atsakymų — answer: "").

Svarbūs $x$ ir $y$ terminai: $x$ = argumentas, nepriklausomas kintamasis; $f(5)$ — mokinys supranta, kad $x=5$; $A(3;y)$ — mokinys supranta, kad $x=3$; abscisių ašis arba $Ox$ ašis. $y=f(x)$ = funkcijos reikšmė = priklausomas kintamasis; $f(x)=3$ — mokinys supranta, kad $y=3$; ordinačių ašis — $Oy$ ašis; $A(x;2)$ — mokinys supranta, kad $y=2$.

Lengva: rasti $f(x)$, kai duotas $x$; paprastos savybės; nubrėžti funkciją su paprastais skaičiais; tikrinti taško priklausymą funkcijai.

Vidutinė: rasti $x$, kai duotas $f(x)$; nubrėžti funkciją ir parašyti savybes; rasti koeficientus $k$ ir $b$ pagal 2 taškus; žodžius užrašyti formule.

Sunki: formulės $kx+b$ nustatymas iš dviejų taškų; užduotys su parametrais, pvz. „su kuriomis $m$ reikšmėmis duotos funkcijos grafikas kerta $x$ ašį taške …“; koeficientų $k$ ir $b$ keitimas (kaip pasikeis funkcija…); visos savybės vienoje užduotyje; gali būti kombinuotos užduotys su sudėtingesniais skaičiais, įdomesni atvejai, pvz. $k$ ar $b=0$.`,
  },
  "10:proporcingi-dydziai": {
    title: "Proporcingi dydžiai",
    body: `Uždaviniai su santykiais, gali būti kombinuoti su paprasta geometrija; proporcingoji dalyba. Uždaviniai su nemažai teksto ir gyvenimiškom situacijom; `,
  },
  "10:sudetiniai-procentai": {
    title: "Sudėtiniai procentai",
    body: `Taikyti sudėtinių procentų formulę ir rasti bet kurį jos nežinomą dydį; indėliai, paskolos, nuolaidos ant nuolaidos. Patikrink atsakymus.`,
  },
  "10:procentu-taikymo-uzdaviniai": {
    title: "Procentų taikymo uždaviniai",
    body: `Procentinis pokytis, džiovinimo, tirpalų koncentracijos, lydinių gyvenimiški uždaviniai.`,
  },
};

/** Tema be potemių arba bendros temos taisyklės (raktas `${grade}:topic:${topicSlug}`). */
const TOPIC_PROMPTS: Record<string, SubtopicPromptEntry> = {
  "8:topic:8-duomenys": {
    title: "Duomenys",
    body:
      "Duomenų rinkimas, vaizdavimas ir analizė; giliau nagrinėjamas vidurkis, moda, mediana bei imties plotis; duomenų grupavimas; klasikinė tikimybės formulė; bandymo baigtys; įvykių rūšys.",
  },
  "8:topic:8-vektoriai-geometrijoje": {
    title: "Vektoriai geometrijoje",
    body:
      "NENAUDOTI vektorių koordinačių, skaliarinės sandaugos ar koordinačių plokštumos formulių. Vektoriai braižomi schemoje (trikampio ar lygiagretainio taisyklė, lygūs ir priešingi vektoriai).",
  },
  "8:topic:8-saknys": {
    title: "Šaknys",
    body:
      "DRAUDŽIAMA: iracionaliosios lygtys; apibrėžimo sritis (ODZ). Lengvoms kurti su šaknų savybės pagal potemę. Vidutiniam lygiui - daugiau savybių, daugiau narių, sudėtingesni skaičiai. Sunkioms - dar sudėtingesni skaičiai ir ilgesni reiškiniai. Šaknis VISADA rašyk LaTeX: $\\sqrt{64}$, $\\sqrt[3]{27}$, $\\frac{\\sqrt{64}}{\\sqrt{16}}$ — DRAUDŽIAMA žodžiais („kvadratinę šaknį iš 64“ ir pan.).",
  },
  "9:topic:9-trupmeniniai-reiskiniai": {
    title: "Trupmeniniai reiškiniai",
    body: `answer laukas VISADA tuščias "" — ne generuok atsakymų. solution taip pat "".`,
  },
  "9:topic:9-kvadratines-funkcijos": {
    title: "Kvadratinės funkcijos",
    body: `Tikrink mokinių žinias, kai reikia apskaičiuoti reikšmes $f(x)$, kai duotas $x$ arba rasti $x$, kai duotas $f(x)$ (lengva); tikrinti, ar taškas priklauso funkcijai (lengva); liepkite nubraižyti parabolės grafiką ir iš jo nustatyti funkcijos savybes (apibrėžimo sritis, reikšmių sritis, didėjimo ir mažėjimo intervalai, teigiamos ir neigiamos, didžiausios ir mažiausios reikšmės, kur kerta abscisių ir ordinačių ašis; funkcijos nuliai ($y=0$)). Braižymo ir funkcijų savybių uždaviniuose atsakymų nereikia — answer: "". Taip pat kurk uždavinius, kur reikia nustatyti funkcijos formulę pagal potemės išraišką (vidutinis ir sunkus). Mokiniai turi suprasti visų išraiškų koeficientus ir kaip jie veikia — klausk, kaip funkcija pasikeis, jei pakoreguosime koeficientus (nereikia atsakymų — answer: ""; vidutinis ar sunkus lygis). Gali reikėti rasti nežinomo parametro reikšmę, kai duotas taškas (vidutinis, sunkus).

Svarbūs $x$ ir $y$ terminai: $x$ vadinamas argumentu, nepriklausomu kintamuoju; $f(5)$ — mokinys supranta, kad $x=5$; $A(3;y)$ — mokinys supranta, kad $x=3$; abscisių ašis yra $Ox$ ašis. $y=f(x)$ = funkcijos reikšmė = priklausomas kintamasis; $f(x)=3$ — mokinys supranta, kad $y=3$; ordinačių ašis yra $Oy$ ašis; $A(x;2)$ — mokinys supranta, kad $y=2$.`,
  },
  "9:topic:9-skaiciu-sekos": {
    title: "Skaičių sekos",
    body: `Sekos dėsningumo nustatymas ir kelių tolesnių narių užrašymas; rasti $n$-tąjį sekos narį iš formulės arba teksto (lengvas); rasti nario numerį $n$ iš formulės (kelintas narys) — vidutinis, sunkus; paprasti rekurentinės formulės uždaviniai (sunkus); seka žodžiais, ne tik formule; baigtinė ar begalinė seka (lengvas). Sąlygose gali būti apie pirminius, sudėtinius skaičius, skaičių kartotinius, daliklius, lyginius, nelyginius, dviženklius, triženklius skaičius ir pan.`,
  },
  "9:topic:9-statistika": {
    title: "Statistika",
    body: `Teigiama, neigiama koreliacija, koreliacijos koeficientas; duomenis vaizduoti sklaidos diagramoje; užrašyti tiesės lygtį, apie kurią išsidėstę sklaidos diagramos taškai; nubrėžti šią tiesę.`,
  },
};

/** Temos be AI atsakymo generavimo metu. */
const TOPICS_OMIT_AI_ANSWERS = new Set([
  "9-trupmeniniai-reiskiniai",
  "10-racionaliosios-lygtys",
]);

/** Temos su atskiru „Rodyti atsakymą“ (GPT solve, −1 generavimas). */
const TOPICS_DEFERRED_SOLVE = new Set(["10-racionaliosios-lygtys"]);

export type SubtopicPromptRef = { slug: string; topicSlug: string };

export function subtopicPromptKey(grade: number, slug: string, topicSlug?: string): string {
  const s = slug.trim().toLowerCase();
  if (topicSlug) {
    const composite = `${grade}:${topicSlug.trim().toLowerCase()}:${s}`;
    if (SUBTOPIC_PROMPTS[composite]) return composite;
  }
  return `${grade}:${s}`;
}

export function getSubtopicPrompt(
  grade: number,
  slug: string,
  topicSlug?: string,
): SubtopicPromptEntry | null {
  return SUBTOPIC_PROMPTS[subtopicPromptKey(grade, slug, topicSlug)] ?? null;
}

export function topicOmitsAiAnswers(topicSlugs: string[]): boolean {
  return topicSlugs.some((s) => TOPICS_OMIT_AI_ANSWERS.has(s.trim().toLowerCase()));
}

export function topicUsesDeferredSolve(topicSlugs: string[]): boolean {
  return topicSlugs.some((s) => TOPICS_DEFERRED_SOLVE.has(s.trim().toLowerCase()));
}

export function isDeferredAnswerTopicSlug(slug: string): boolean {
  return TOPICS_DEFERRED_SOLVE.has(slug.trim().toLowerCase());
}

export function getTopicPrompt(grade: number, topicSlug: string): SubtopicPromptEntry | null {
  return TOPIC_PROMPTS[`${grade}:topic:${topicSlug.trim().toLowerCase()}`] ?? null;
}

function difficultyTierInstruction(difficulty: string): string {
  if (difficulty === "lengvos") {
    return "Sunkumas: generuok TIK „Lengva“ lygio užduotis (kitų skyrių nenaudok).";
  }
  if (difficulty === "vidutinės") {
    return "Sunkumas: generuok TIK „Vidutinė“ lygio užduotis.";
  }
  if (difficulty === "sunkios") {
    return "Sunkumas: generuok TIK „Sunki“ lygio užduotis.";
  }
  if (difficulty === "ivairus" || difficulty === "savarankiskas") {
    return "Sunkumas: 40% Lengva / 40 % Vidutinė / 20% Sunki)";
  }
  return "";
}

/** Sujungia pasirinktų potemių ir temų promptus; guided=true jei bent vienas turi aprašą. */
export function buildSubtopicPromptBlock(
  grade: number,
  subtopicRefs: SubtopicPromptRef[],
  difficulty: string,
  topicSlugs: string[] = [],
): { text: string; guided: boolean; omitAnswers: boolean; deferredAnswers: boolean } {
  const uniqueTopicSlugs = [...new Set(topicSlugs.map((s) => s.trim().toLowerCase()).filter(Boolean))];
  const seenSubtopicKeys = new Set<string>();
  const parts: string[] = [];

  for (const topicSlug of uniqueTopicSlugs) {
    const entry = getTopicPrompt(grade, topicSlug);
    if (entry) {
      parts.push(`TEMA: ${entry.title}\n${entry.body}`);
    }
  }

  for (const ref of subtopicRefs) {
    const slug = ref.slug.trim().toLowerCase();
    const topicSlug = ref.topicSlug.trim().toLowerCase();
    if (!slug) continue;
    const key = subtopicPromptKey(grade, slug, topicSlug);
    if (seenSubtopicKeys.has(key)) continue;
    seenSubtopicKeys.add(key);
    const entry = getSubtopicPrompt(grade, slug, topicSlug);
    if (entry) {
      parts.push(`POTEMĖ: ${entry.title}\n${entry.body}`);
    }
  }

  const omitAnswers = topicOmitsAiAnswers(uniqueTopicSlugs);
  const deferredAnswers = topicUsesDeferredSolve(uniqueTopicSlugs);

  if (parts.length === 0) {
    return { text: "", guided: false, omitAnswers, deferredAnswers };
  }

  const tier = difficultyTierInstruction(difficulty);
  const antiCopy =
    "Neatkartok pavyzdinių sąlygų iš šio aprašo — kiekvieną kartą nauji skaičiai ir formulavimas.";
  return {
    text: [parts.join("\n\n"), tier, antiCopy].filter(Boolean).join("\n\n"),
    guided: true,
    omitAnswers,
    deferredAnswers,
  };
}
