/** Potemės AI turinys: raktas `${grade}:${slug}` (slug iš curriculum_subtopics). */

export type SubtopicPromptEntry = {
  title: string;
  /** Lengva / Vidutinė / Sunki — visi lygiai viename bloke */
  body: string;
};

/** Trumpas savybių + transformacijų branduolys 11 kl. konkrečioms funkcijoms (laipsninė, šaknies, …). Ne visos Savybės/Transformacijos potemės — tik žodynas. */
const GRADE11_FUNKCIJA_CORE = `VIENA užduotis = VIENAS tikslas. DRAUDŽIAMA: eskizas + visos savybės ($D$, $E$, lyginumas, monotoniškumas, ženklai, nuliai, $Ox$/$Oy$) + transformacijos + taškai — tai per ilga net sunkiam. Pasirink TIK 1-3 savybes arba 2–3 transformacijas; ARBA 2 taškai. Gali prašyti nubraižyti eskizą ir paklausti kelių savybių. Žemiau esantys pavyzdžiai, skirtingų užduočių tipai, ne vienos užduoties punktai. Nenaudoti terminų: asimptotė, amplitudė.`;

const GRADE11_LYGTYS_CORE = `VIENA užduotis = VIENA lygtis (ar viena sistema), 1-2 punktai. Žemiau tipai — atskiros užduotys, ne vienos užduoties sąrašas. Sprendinius tikrinti. Nenaudoti: asimptotė, amplitudė.`;

const GRADE11_NELYGYBES_CORE = `VIENA užduotis = VIENA nelygybė, dviguba nelygybė arba viena nelygybių sistema; maks. 2 punktai. Atsakymas intervalais (arba konkretus skaičius / natūralus $n$ tekstiniame). Sistemos tik $$\\begin{cases} ... \\\\ ... \\end{cases}$$ (ne \\{ su kableliu ar \\n).`;

const GRADE12_TRIG_TAPATYBIU_CORE = `VIENA užduotis = vienas tikslas (suprastinti, apskaičiuoti, išreikšti arba įrodyti); maks. 2 punktai. Rašyk $\\tg$, ne $\\tan$. Kampas $\\alpha$ arba $x$; laipsniai arba radianai (vienas formatas užduotyje). Pagrindinės: $\\sin^2\\alpha+\\cos^2\\alpha=1$; $\\tg\\alpha=\\frac{\\sin\\alpha}{\\cos\\alpha}$; $\\tg^2\\alpha+1=\\frac{1}{\\cos^2\\alpha}$ ($\\cos\\alpha\\neq 0$).`;

const GRADE12_TRIG_LYGTYS_CORE = `VIENA užduotis = VIENA lygtis; 1-2 punktai. Bendrinis sprendinys su $k\\in\\mathbb{Z}$ (tangentui periodas $\\pi$). Rašyk $\\tg$, ne $\\tan$`;

const GRADE12_TRIG_NELYGYBES_CORE = `VIENA užduotis = VIENA nelygybė; 1-2 punktai. Atsakymas intervalais su $+2\\pi k$ ($k\\in\\mathbb{Z}$); tangentui $+\\pi k$. Rašyk $\\tg$, ne $\\tan$. Žemiau galimi tipai`;

const GRADE12_ISVESTINE_SKAICIAVIMAS_CORE = `VIENA užduotis = vienas tikslas; 1-2 punktai.; nekopijuoti pavyzdžių - jie skirti geriau suprasti lygį ir tipą.`;

const GRADE12_STEREOMETRIJA_CORE = `VIENA užduotis = vienas tikslas; 1-2 punktai. Užduotys tinkamos 18 metų mokiniams (12 kl., VBE lygis). Aprašyk figūrą tekste (kubas $ABCDA_1B_1C_1D_1$, piramidė $SABCD$, prizmė…). Brėžinių NEGENERUOK — diagram_config nenaudoti. Pasviroji, statmuo, projekcija — žodžiuose arba LaTeX. Atsakymas su vienetais ($\\text{cm}^2$, $\\text{cm}^3$); $\\pi$ palik, jei reikia. Neatkartok pavyzdinių sąlygų — nauji skaičiai ir formulavimas.`;

const GRADE12_KOMBINATORIKA_CORE = `VIENA užduotis = vienas tikslas; 1-2 punktai. Užduotys tinkamos 18 metų mokiniams (12 kl., VBE lygis). Kombinatorika — skaičiuoti variantus ($P_n$, $A_n^k$, $C_n^k$); Neatkartok pavyzdinių sąlygų.`;

const GRADE12_TIKIMYBE_CORE = `VIENA užduotis = vienas tikslas; 1-2 punktai. Užduotys tinkamos 18 metų mokiniams (12 kl., VBE lygis). Klasikinė tikimybė $P(A)=\\frac{m}{n}$ — $m$ palankių, $n$ elementarių baigčių. Kombinatorika gali būti tarpinis žingsnis. Neatkartok pavyzdinių sąlygų.`;

const GRADE12_SKIRSTINIAI_CORE = `VIENA užduotis = vienas tikslas; maksimum 2 punktai. Užduotys tinkamos 18 metų mokiniams (12 kl., VBE lygis). Diskretus atsitiktinis dydis $X$. Skirstinį pateik kaip duomenis ($X$: reikšmės; $P(X)$: tikimybės) ne lentele. Skirstiniams patikrink $\\sum p_i=1$. Neatkartok pavyzdinių sąlygų.`;

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
    body: `Lengva: laipsnių ir šaknų su racionaliuoju rodikliu skaičiavimas taikant 1-2 savybes (vienodų pagrindų daugyba/dalyba, laipsnio kėlimas laipsniu, neigiamas, trupmeninis laipsnio rodiklis ir pan. laipsnių savybės; šaknies keitimas laipsniu su racionaliuoju rodikliu ir atvirkščiai; paprastos šaknų savybės su skaičiais.

Vidutinė: reiškinių prastinimas taikant kelias laipsnių/šaknų savybes iš eilės; daugiklio iškėlimas prieš šaknies ženklą ir įkėlimas po juo (su raidėmis, kai nurodytas kintamojo ženklas); $\\sqrt[2k]{a^{2k}}=|a|$ taikymas; kvadratų skirtumo formulė su laipsniais su racionaliuoju rodikliu (pvz. $(a^{1/2}+b^{1/2})(a^{1/2}-b^{1/2})$); laipsnio su racionaliuoju rodikliu apibrėžimo sritis.

Sunki: kelių žingsnių raidiniai reiškiniai su trupmenomis ir laipsniais, šaknimis su racionaliuoju rodikliu; sumos/skirtumo kubas ir kubų sumos/skirtumo formulių tiesioginis taikymas; laipsniai su iracionaliaisiais rodikliais (pvz. $3^{1+\\sqrt{2}}\\cdot 3^{1-\\sqrt{2}}$); kombinuoti skaičiuojami reiškiniai su skirtingais pagrindais, šaknimis ir neigiamais rodikliais.`,
  },
  "11:logaritmai": {
    title: "Logaritmai",
    body: `Logaritmo apibrėžimas; gali būti dešimtainis $\\lg x$ ar natūralusis $\\ln x$ logaritmai; pagrindinės savybės; logaritmavimas ir antilogaritmavimas; įdėtiniai logaritmai; pagrindo keitimo formulė.

Lengva: eksponentinę lygtį užrašyti logaritmine forma ir atvirkščiai; apskaičiuoti logaritminį reiškinį, kai rezultatas sveikasis skaičius ar paprasta trupmena; taikyti pagrindines savybes su paprastais skaičiais; nustatyti, ar skaičius priklauso $\\mathbb{N}$, $\\mathbb{Z}$, $\\mathbb{I}$ rinkiniams.

Vidutinė: logaritmai su šaknimis, trupmeniniu pagrindu ar argumentu ($\\lg\\sqrt[5]{0.01}$, $\\log_{1/5}125$, $\\ln\\sqrt{e^2}$); rasti $x$, kai pagrindas ar argumentas — šaknis ar trupmena ($\\log_x 16=\\frac{1}{2}$); taikyti sandaugos ir dalmens savybes ($\\log_{15}3+\\log_{15}5$, $\\log_5 75-\\log_5 3$); paprasti įdėtiniai logaritmai ($\\log_2(\\log_2 16)$); pagrindinė tapatybė $a^{\\log_a b}$ ($2^{\\log_2 7}$, $10^{\\lg 8}$); logaritmavimas — išskaidyti $\\log_a\\frac{81x^2}{\\sqrt[3]{y}}$; antilogaritmavimas — iš $\\lg x=2\\lg y-\\lg z+0.5\\lg t$ išreikšti $x$.

Sunki: kelių žingsnių skaičiuojami reiškiniai ($27^{-\\log_3 2}$, $\\sqrt{10^{2+\\lg 16}}$; sudėtingi įdėtiniai ir kombinuoti ($\\log_4(\\log_{16}256)+\\log_4 2$); skaičiuoti logaritmą per duotą reikšmę ($\\log_3 6.75$, kai $\\log_3 2=a$; $\\lg 112$, kai $\\lg 2=m$, $\\lg 7=n$); raidiniai — duota $x=\\frac{yz^3}{\\sqrt[5]{t}}$, užrašyti $\\log_a x$ per $\\log_a y$, $\\log_a z$, $\\log_a t$; sudėtingas logaritmavimas su dešimtainiais daugikliais ir šaknimis; pagrindo keitimas ir tapatybės patikrinimas.`,
  },
  "11:posukio-kampas-sinusas-ir-kosinusas-vienetinis-apskriti": {
    title: "Posūkio kampas, sinusas ir kosinusas. Vienetinis apskritimas",
    body: `Kampo radianų ir laipsnių vienetai; posūkio kampas vienetiniame apskritime; taškas $A_\\alpha(x;y)$, $\\sin\\alpha=y$, $\\cos\\alpha=x$; ketvirčiai; periodiškumas $2\\pi k$; $\\sin\\alpha$, $\\cos\\alpha$ reikšmių intervalas $[-1;1]$; ženklai ketvirčiuose; lyginimas ir eiliškumas reikšmių.

Lengva: konvertuoti tarp laipsnių ir radianų standartiniais kampais; nustatyti kampą vienetiniame apskritime ($0$–$2\\pi$); rasti $\\sin\\alpha$, $\\cos\\alpha$ taško koordinatėse; apskaičiuoti paprastus reiškiniai su $30^\\circ$, $45^\\circ$, $60^\\circ$, $90^\\circ$, $\\pi$ ir pan.; nustatyti ketvirtį; patikrinti, ar lygtis $\\sin\\alpha=1.2$ gali būti teisinga.

Vidutinė: kampai $>360^\\circ$ ar $<0$; rasti $\\alpha$ duotame intervale; laikrodžio / sukimosi kampai; geometrija su radianais (trikampiai, daugiakampiai); periodiškumas ($\\sin 1125^\\circ$, $\\cos(-23\\pi/2)$); rasti visus $\\alpha$ intervale, kai $\\sin\\alpha=-1$ ar $\\cos\\alpha=0$; nustatyti ženklą dideliems kampams; min/max reiškinio $a\\sin\\alpha+b$; rasti $\\sin\\alpha$ iš $\\cos\\alpha$ (ar atvirkščiai) nurodytame ketvirtyje.

Sunki: abstraktūs kampų rinkiniai ($\\alpha=\\frac{\\pi k}{8}$); ketvirtis išraiškoms ($\\alpha-\\pi$, jei $\\alpha$ III ketv.); simetrija vienetiniame apskritime; lyginti $\\sin 3$ ir $\\cos 4$; rasti parametro $m$ reikšmes, kai $\\sin\\alpha=m+2$ gali būti teisinga; supaprastinti $| \\sin\\alpha|-\\sin\\alpha$, $\\sqrt{(2\\sin\\frac{\\pi}{4}-1)^2}$ pagal $\\alpha$ intervalą; sudėtingi reiškiniai su keliais kampais, redukcijos taisyklės`,
  },
  "11:arksinusas-ir-arkkosinusas": {
    title: "Arksinusas ir arkkosinusas",
    body: `$\\arcsin$ ir $\\arccos$ apibrėžimo sritis; pagrindinės savybės $\\sin(\\arcsin x)$, $\\arccos(\\cos x)$; $\\arccos(-b)=\\pi-\\arccos b$; lygtis $a\\sin\\alpha=m$, $a\\cos\\alpha=m$ — išreikšti $\\alpha$.

Lengva: ar išraiška turi prasmę ($\\arcsin x$, $\\arccos x$); apskaičiuoti $\\arcsin$ / $\\arccos$ lentelės reikšmėms; patikrinti paprastas lygybes ($\\arccos 0=\\frac{\\pi}{2}$); taikyti $\\arccos(-b)=\\pi-\\arccos b$.

Vidutinė: sumos ir skirtumai ($\\arcsin\\frac{\\sqrt3}{2}+\\arccos(-\\frac{\\sqrt2}{2})$); $\\arccos(\\cos(-\\frac{5\\pi}{6}))$, $\\sin(\\arcsin x+\\arcsin y)$ su duotais $x,y$; iš $0.5\\cos\\alpha=m-1$ rasti $\\alpha$; sudėtingi skaitmeniniai reiškiniai su keliais $\\arcsin$ / $\\arccos$.

Sunki: kompozicijos $\\cos(\\arccos(-\\frac{1}{2})+\\arccos\\frac{\\sqrt3}{2})$; $\\sin^2(\\arcsin\\frac{\\sqrt3}{2})-\\cos^2(\\arccos\\frac{1}{2})$; logikos uždaviniai (jei $\\alpha,\\beta\\in[0;\\pi]$ ir $\\cos\\alpha=\\cos\\beta$, ar $\\alpha=\\beta$?); parametras $m$ — kada lygtis su $\\arcsin$ / $\\arccos$ turi sprendimą.`,
  },
  "11:tangentas-ir-jo-tiese-arktangentas": {
    title: "Tangentas ir jo tiesė, arktangentas",
    body: `Tangentas vienetiniame apskritime ($tg\\alpha=\\frac{y}{x}$); $arctg$ apibrėžimas ir sritis $(-\\frac{\\pi}{2};\\frac{\\pi}{2})$; $tg(arctg b)=b$; $arctg(-b)=-arctg b$; tangentas ir jo tiesė ant apskritimo.

Lengva: rasti $tg\\alpha$ iš taško koordinačių; apskaičiuoti $tg$ standartiniais kampais (laipsniais ir radianais); paprasti $arctg$ reikšmės ($0$, $\\pm1$, $\\pm\\frac{\\sqrt3}{3}$, $\\pm\\sqrt3$); nustatyti $tg$ ženklą.

Vidutinė: $tg$ dideliems ar neigiamais kampais; lyginti $tg$ reikšmes; rasti $tg\\alpha$ iš $\\sin\\alpha$ ar $\\cos\\alpha$ nurodytame ketvirtyje; rasti $\\alpha$ intervale, kai $tg\\alpha=-1$ ar $tg\\alpha=3$; supaprastinti $|tg\\alpha|-tg\\alpha$ duotame intervale; patikrinti lygybių teisingumą.

Sunki: sudėtiniai reiškiniai su $arctg$, gali būti sin, cos, arccos, arcsin; parametrai ir intervalai su tangentu.`,
  },
  "11:skaiciu-seka": {
    title: "Skaičių seka",
    body: `$n$-tojo nario formulė $a_n$; rekurentinė formulė $a_{n+1}$; monotoniškumas; nelygybės su $n \\in \\mathbb{N}$; sekos nario numerio radimas.

Lengva: užrašyti pirmus narius iš formulės ar teksto; apskaičiuoti $a_k$, $a_{n+1}$, $a_{2n-1}$; nustatyti, ar skaičius priklauso sekai; paprastas monotoniškumas ($a_n=3n-10$); 1–2 žingsnių rekurentinė seka.

Vidutinė: seka žodžiais (dalikliai, kartotiniai, lyginiai/nelyginiai); nelygybės $a_n<b$ ar intervalas; teigiamų/neigiamų narių skaičius; rasti $n$, kai $a_n$ didžiausias ar mažiausias (kvadratinė $a_n$); rekurentinės su keliais žingsniais; paprasti tekstiniai.

Sunki: periodinė rekurentinė seka; rasti $n$, kai skirtumas dviejų gretimų narių duotas; kombinuoti su nelygybėmis ir parametrais; neolimpiadiniai, bet kelių žingsnių uždaviniai.`,
  },
  "11:aritmetine-progresija": {
    title: "Aritmetinė progresija",
    body: `Aritmetinė progresija $(a_n)$; $a_n=a_1+d(n-1)$; rekurentinė $a_{n+1}=a_n+d$; skirtumas $d$; aritmetinės progresijos savybė $a_n=\\frac{a_{n-1}+a_{n+1}}{2}$; suma $S_n=\\frac{a_1+a_n}{2}\\cdot n$ ir $S_n=\\frac{2a_1+d(n-1)}{2}\\cdot n$; $a_n=S_n-S_{n-1}$.

Lengva: pirmi nariai iš $a_1$ ir $d$; rasti $a_k$; įrodyti, kad formulė $a_n=3n-14$ yra AP; rasti $d$ ar $a_1$; įterpti skaičius tarp duotų; paprastas $S_n$ skaičiavimas.

Vidutinė: lygčių sistemos rasti $a_1$, $d$ iš duotų narių; nelygybės ($a_n<b$, intervalas); tekstiniai (atstumas, alga, sportas); AP savybė — rasti trūkstamus narius; suma nuo $a_k$ iki $a_m$; rasti $n$ iš $S_n$.

Sunki: sumos su kvadratu $a_n^2$ ar simetrija ($a_1+a_n$); lygtis su AP suma ($1+3+5+\\dots$); tekstiniai su keliais žingsniais (dviratininkai, knygos, daugiakampis); derinti AP su geometrija (trikampio kampai, kraštinės); ne olimpiadiniai.`,
  },
  "11:geometrine-progresija": {
    title: "Geometrinė progresija",
    body: `$(b_n)$; $b_n=b_1\\cdot q^{n-1}$; rekurentinė $b_{n+1}=b_n\\cdot q$; vardiklis $q$; geometrinė savybė $b_n^2=b_{n-1}\\cdot b_{n+1}$; procentinis pokytis: augimas $q=1+p$, mažėjimas $q=1-p$, lieka $\\frac{k}{m}$ dalies $\\Rightarrow q=\\frac{k}{m}$.

Lengva: pirmi nariai; rasti $b_k$; įrodyti, kad $b_n=2\\cdot 3^n$ yra GP; rasti $q$ iš $b_1$, $b_3$; paprastas procentinis augimas (1–2 žingsniai).

Vidutinė: rasti $n$, kai $b_n$ duotas (gali logaritmas); trūkstami nariai sekos viduryje; GP savybė ($b_1\\cdot b_3$, $b_2\\cdot b_4$); tekstiniai su procentais (alga, GDP, bakterijos, oro siurbimas).

Sunki: keturi skaičiai AP→GP transformacija; įrodymas su logaritmais; lenktynių laikas (GP + AP); $b_n\\cdot b_m=b_k\\cdot b_l$ kai $m+n=k+l$; sudėtingi finansiniai ar fiziniai kontekstai; ne olimpiadiniai.`,
  },
  "11:nykstamoji-geometrine-progresija": {
    title: "Nykstamoji geometrinė progresija",
    body: `Begalinė progresija, $|q|<1$, $q\\neq 0$; visų narių suma $S=\\frac{b_1}{1-q}$; baigtinės sumos $S_n=\\frac{b_1(1-q^n)}{1-q}$; pasikartojančios dešimtainės trupmenos → paprastoji trupmena. Nenaudoti sigma sumos žymėjimo.

Lengva: rasti $S$ iš $b_1$, $q$; suma iš užrašytos sekos ($5+2+\\frac{4}{5}+\\dots$); paversti pasikartojančią dešimtainę į paprastąją trupmeną; paprastas $S_n$.

Vidutinė: rasti $q$, $b_1$ ar $S$ iš sąryšių; lygtis su begaline suma; tekstiniai (kritimas, šuoliai, lėtėjimas); geometriniai modeliai (apskritimai).

Sunki: $S_n$ ir $S$ santykis; dvi nykstančios progresijos su sąryšiais; nelygybė $S_n$ skiriasi nuo $S$ ne daugiau kaip 1 %; kombinuoti su šaknimis ir dideliais laipsniais; lygtis su begaline suma; tekstiniai (kritimas, šuoliai, lėtėjimas); geometriniai modeliai (apskritimai). Ne olimpiadiniai.`,
  },
  "11:Savybės": {
    title: "Savybės",
    body: `Savybės iš grafiko ir iš funkcijos formulės. Grafikų ir lentelių NEBRAIŽYK — liepk mokiniui nubraižyti; taškus rašyk tekste. Apibrėžimo sritis (šaknies, vardiklis $\\neq 0$, logaritmo), reikšmių sritis, lyginumas, periodinė ar ne, monotoniškumas, pastovaus ženklo intervalai, tolydi ar ne, sudėtinės funkcijos (pvz. užrašyti $f(g(x))$), funkcijos apibrėžtos keliais reiškiniais (sistemomis, kai $x>a$ ir $x<a$); ribų skaičiavimas, vienpusės ribos iš kairės ir dešinės; funkcijos nuliai, kur kerta abscisių ir ordinačių ašis. Draudžiama klausti apie asimptotes ir amplitudę (terminai nevartojami), išvestinės, integralai.

Lengva: apibrėžimo sritis viena sąlyga, paprasta kvadratinė šaknis, nelyginio laipsnio šaknis ($f(x)=\\frac{3x+2}{2}$, $\\sqrt{5x-2}$, $\\sqrt[3]{3x-2}$); reikšmių sritis tiesinei ($x-3$); nuliai ir kirtimas su $Ox$, $Oy$ ($x^2-4$, $(x-1)(x+2)$); lyginumas iš paprasto grafiko ar daugianario; didžiausia/mažiausia reikšmė iš paprasto tolydaus grafiko; užrašyti $f(g(x))$ su paprastomis $f$, $g$; riba įstatymu ($\\lim_{x\\to 3}(2x^2+4x+1)$).

Vidutinė: apibrėžimo sritis su keliomis sąlygomis — kvadratinis vardiklis, dvi šaknys, šaknis ir modulis, logaritmas ir šaknis ($\\frac{2x-5}{x^2+3x}$, $\\frac{\\sqrt{x-3}}{\\sqrt{5-x}}$, $\\frac{\\sqrt{5x-2}}{|x-3|}$, $\\log_3(x-2)+\\sqrt{2x-4}$, $\\sqrt{x+3}+\\frac{x+2}{x-5}$); reikšmių sritis parabolei ar šakniai ($8-x^2$, $x^2-5x+6$, $\\sqrt{x}-3$); lyginumas algebriškai ($\\sqrt{x}-3$, $|x|x^5+x$, $\\frac{x^2-2}{x^4+3}$); dalimis apibrėžta (2 dalys) — brėžti, rasti trūkio tašką; iš grafiko — monotoniškumas, periodiškumas ($T$), pastovaus ženklo intervalai, vienpusės ribos; riba $0/0$ skaidant ($\\lim_{x\\to 2}\\frac{x-2}{x^2+x-6}$); lentelė, kai $x$ artėja prie taško.

Sunki: apibrėžimo sritis su keliomis skirtingomis sąlygomis ($\\frac{3}{x}-\\frac{2x+1}{\\sqrt{x-2}}$, $\\frac{\\sqrt[4]{-x}}{x^2-4}$, $\\sqrt{4-\\frac{2}{x}}$, $\\frac{x^2+6}{\\log_2(3x+2)}$); vienoje užduotyje 1–2 savybės (ne visos iš karto); ribos racionalizuojant ($\\lim_{x\\to 0}\\frac{\\sqrt{x+1}-1}{x}$). Ne olimpiadiniai, BMP lygyje.`,
  },
  "11:transformacijos": {
    title: "Transformacijos",
    body: `Pagrindinė formulė $y=a\\cdot f(b(x+c))+d$. $a$ — atstumai iki $Ox$; $b$ — atstumai iki $Oy$. $c$ — pastūmimas į šonus, $d$ — į viršų ar žemyn. Bazė dažniausiai $f(x)=x^2$, $|x|$, arba aprašyti taškai. Grafikų ir lentelių NEBRAIŽYK — liepk mokiniui nubraižyti.

Lengva: viena transformacija — pastūmimas į šonus arba aukštyn/žemyn; simetrija $y=-f(x)$, $y=f(-x)$; taško naujos koordinatės ($A(-3;5)$ po $g(x)=f(x)+10$ ar $f(x-1)$); atpažinti paprastą pastūmimą iš eskizo arba paklausti kaip pasikeitė pradinis grafikas jei pvz. f(x) patapo f(x+3)-1.

Vidutinė: 2–3 transformacijos (be savybių paketo); užrašyti formulę iš aprašymo ($x^2$ 6 į kairę ir 3 į viršų) ARBA tik $D(g)$, $E(g)$; atpažinti $(x+1)^2$ iš $x^2+2x+1$; nuliai po $f(3x)$; taškas po $f(x-1)-5$; lygtis per pastūmimą ($(x-5)^2-(x-5)-12=0$, kai žinomi $x^2-x-12=0$ šaknys).

Sunki: 3-4 transformacijos iš karto — $g(x)=af(bx)$ iš grafikų (rasti $a$, $b$); atvirkštinis taškas: $A(a;b)$ ant $f$ virsta $A'(3;6)$ ant $y=2f(x+1)-4$; kelių žingsnių $-0.25(x+2)^2-2$, $-(2x+4)^2+2$; $-f(-x)$ ir $\\frac12 f(x+2)-1$ iš dalimis grafiko; plotas po $5-|x-6|$ ir palyginimas su $2f$, $3f$, $0.5f$; geometrija — stačiakampis po $y=9-x^2$, kaip horizontalus tempimas keičia ploto formulę. Ne olimpiadiniai.`,
  },
  "11:laipsnine": {
    title: "Laipsninė",
    body: `${GRADE11_FUNKCIJA_CORE}

Laipsninė $f(x)=ax^n$ ($n$ sveikasis ar racionalusis); transformuota $a\\bigl(k(x-p)\\bigr)^n+q$; hiperbolė $\\frac{k}{x+c}+d$.

Lengva: reikšmės ($f(x)=x^3$, $g(x)=x^4$, $f(\\sqrt{3})\\cdot g(-2)$); palyginti $x^{2024}$ ir $x^{2025}$ taškuose; ar reiškinys laipsninė ir užrašyti $ax^n$ ($2x^2\\cdot 4x^3$, $\\frac{3x^5}{2x^2}$); rasti $n$ ar $a$ iš vieno taško ($x^n$ eina per $B(2;8)$); paprastas pastūmimas („$x^4$ dviem į dešinę ir trimis į viršų“).

Vidutinė: didėjanti/mažėjanti ($x^5$, $-0.6x^4$, $3x^6$); ketvirčiai pagal $n$ lyginumą ir $a$ ženklą; $a$, $b$ iš aprašyto grafiko (taškai žodžiu); $D(f)$, $E(f)$ ($3(x-12)^4-7$, $\\frac{4}{x+1}-3$); išvardyti transformacijas $g(x)=4\\bigl(3(x+2)\\bigr)^4-6$ nuo $x^4$; hiperbolė — $k$, $c$, $d$ iš pastūmimų ir taško.

Sunki: kaip vidutinė + 1 žingsnis. Keli taškai per $2\\bigl(\\frac14(x+4)\\bigr)^2-3$; $\\frac{11x+12}{x}$ į $\\frac{k}{x}+d$; palyginti $\\frac{1}{x^2}$ ir $6-\\frac{1}{(x+4)^2}$; liepk nubraižyti ir rasti kiek sprendinių vienai lygčiai ($x^5=32$); trumpas tekstinis $I=\\frac{k}{l^2}$ arba $V=\\frac{4}{3}\\pi R^3$.`,
  },
  "11:saknies": {
    title: "Šaknies",
    body: `${GRADE11_FUNKCIJA_CORE}

Šaknies funkcija $\\sqrt{x}$, $\\sqrt[3]{x}$, $\\sqrt[n]{x}$; transformuota $a\\sqrt{b(x+c)}+d$.

Lengva: reikšmės ($f(x)=\\sqrt{x}$, $g(x)=\\sqrt[3]{x}$, $f(9)+g(27)$); $D(f)$, $E(f)$ paprastai ($\\sqrt{x+1}$, $\\sqrt[3]{x-3}$); $a$ iš taško ($a\\sqrt{x}$ eina per $A(4;6)$); vienas pastūmimas ($\\sqrt{x}$ 3 į kairę ir 5 žemyn).

Vidutinė: $D(f)$ lyginio/nelyginio laipsnio šakniai, $\\sqrt{4x^2-16}$, $\\sqrt[6]{\\frac{6}{x-1}}$; lyginumas ($\\sqrt{x}-2$, $5+\\sqrt[3]{x}$, $\\sqrt{x^2+1}$); didėjanti/mažėjanti ($3\\sqrt{x}$, $-4\\sqrt{x}$); 2–3 transformacijos į formulę; $k$ iš taško ($k\\sqrt{x-2}$); pagal aprašytą grafiką atskirti $\\sqrt{x-2}$ ir $\\sqrt{-x+2}$.

Sunki: kaip vidutinė + 1 žingsnis. $a,b,c,d$ iš aprašyto grafiko (pradžia, taškas); $D(f)$ su dviem šaknimis (viena funkcija); liepk nubraižyti ir grafiškai išspręsti vieną nelygybę ($\\sqrt[3]{x+1}<x-5$); trumpas tekstinis $T=2\\pi\\sqrt{l/g}$ (1–2 klausimai). Ne $g$ iš $f$ su 4 keistais koeficientais, ne a–t $D(f)$ sąrašai.`,
  },
  "11:rodikline": {
    title: "Rodiklinė",
    body: `${GRADE11_FUNKCIJA_CORE}

Rodiklinė $f(x)=a^x$ ($a>0$, $a\\neq 1$); $e^x$; transformuota $k\\cdot a^{b(x+c)}+d$. Ne laipsninė ($x^n$, $2x^e$).

Lengva: ar rodiklinė ir didėjanti/mažėjanti ($4^x$, $(2/3)^x$, $e^x$ vs $2x^e$, $x^{-4}$); reikšmės $x=-2,0,3$ ($3^x$, $(1/4)^{-x}$); palyginti $3^{0.5}$ ir $3^5$; $a$ iš vieno taško ($a^x$ per $A(4;4)$).

Vidutinė: iš reikšmių tekste (ne lentelė) — tiesinė ar rodiklinė; $k$ ir $p$, jei $3.2^k<3.2^p$; $D(f)$, $E(f)$ ($-1.5^x$, $10^{-x}$, $(2/3)^x$); 2–3 transformacijos ($2\\cdot 3^x-4$, $6^{x-2}+3$); pagal taškus $(0;1)$, $(1;5)$ atskirti $5^x$ ir $(1/4)^x$.

Sunki: kaip vidutinė + 1 žingsnis. Lyginumas ($7^{|x|}$, $5^{x^2+2}$); min/max per rodiklį ($(\\frac14)^{x^2-4x}$); $s(x)=-\\frac12\\cdot 5^{2(x-4)}+3$ transformacijos; liepk nubraižyti ir kiek sprendinių $3^x=2-x$; trumpas tekstinis (bakterijos, $K(t)=30\\cdot 1.149^t$, indėlis) — 1–2 klausimai, ne paskolos 4 dalys.`,
  },
  "11:logaritmine": {
    title: "Logaritminė",
    body: `${GRADE11_FUNKCIJA_CORE}

Logaritminė $\\log_a x$, $\\lg$, $\\ln$; transformuota $k\\log_a\\bigl(b(x+c)\\bigr)+d$.

Lengva: didėjanti/mažėjanti pagal pagrindą ($\\log_{0.02}x$, $\\log_{1.01}x$); ženklo nustatymas ($\\log_7 0.5$, $\\ln(1/e)$); $D(f)$ linijiniam argumentui; paprastas pastūmimas; ar taškas priklauso ($B(2\\sqrt{2};2)$ ir $\\log_{\\sqrt{2}}x$).

Vidutinė: $D(f)$ kvadratui ar paprastai trupmenai ($\\log_4(x^2+4)$, $\\log_2\\frac{x^2+x+6}{9-x^2}$ — viena funkcija); $a$ iš taškų $(1;0)$ ir $(2;1)$; 2–3 transformacijos; $\\log_a 4>\\log_a 5$ — rasti $a$; liepk nubraižyti $\\log_2 x$ ir $\\sqrt{x}$, kiek susikirtimų.

Sunki: kaip vidutinė + 1 žingsnis. $D(f)$ su logaritmu ir šaknimi (viena funkcija, ne a–t sąrašas); formulė iš dviejų taškų; $k,b,c,d$ iš aprašyto grafiko; trumpas tekstinis (Richteris $M=\\lg(I/I_0)$, radiocarbon $M=-8267\\ln(K/K_0)$) — 1 skaičiavimas. Ne tapatybės įrodymas su 4 grafikais.`,
  },
  "11:trigonometrines": {
    title: "Trigonometrinės",
    body: `${GRADE11_FUNKCIJA_CORE}

$\\sin x$, $\\cos x$, $\\mathrm{tg}\\, x$ (radianai); $y=a\\sin\\bigl(b(x+c)\\bigr)+d$ (koeficientas $a$ — didž./maž. reikšmės, periodas, pastūmimai).

Lengva: $D(f)$ be apribojimų ($\\sin x+10$, $3\\sin x-2$); $E(f)$ ir min/max ($3\\sin x$, $3-\\sin x$); paprastas pastūmimas; liepk nubraižyti ir grafiškai $\\sin x=\\frac{\\sqrt{2}}{2}$ intervale $[0;2\\pi]$.

Vidutinė: $D(f)$ su vardikliu ar šaknimi ($\\frac{2}{\\sin x}$, $3-\\sqrt{\\sin x}$, $\\mathrm{tg}(x+\\frac{\\pi}{3})$); $E(f)$ ($8\\cos(x-\\frac{\\pi}{3})-1$); periodas $\\sin(3x)$, $-\\cos(0.5x)$; lyginumas paprastai; $a$, $b$ iš aprašytos bangos (didž./maž. reikšmės ir $T$); 2 transformacijos.

Sunki: kaip vidutinė + 1 žingsnis. $D(f)$ vienai kombinuotai ($\\sqrt{\\cos x-\\sin x}$ arba $\\frac{2}{1-\\cos x}$); $a,b,c,d$ iš aprašytos bangos (min, max, $T$, pastūmimas); žodinė 3–4 transformacijų seka nuo $\\cos x$; liepk nubraižyti ir vieną nelygybę ($\\sin x>\\frac{\\sqrt{3}}{2}$). Ne a–u $D(f)$ sąrašai, ne dalimis + 5 lygtys.`,
  },
  "11:11-lygtys:su-parametru": {
    title: "Su parametru",
    body: `${GRADE11_LYGTYS_CORE}

Parametras $p$ (ar $k,m$). Tipai: tiesinė $px+b=0$, $ax+p=0$, $(p+2)x=p-1$; kvadratinė $px^2+bx+c=0$, $ax^2+px+c=0$, $ax^2+bx+p=0$. Kai $x^2$ koeficientas priklauso nuo $p$ — pirmiausia atvejis $=0$ (tampa tiesine).

Lengva: tiesinė su $p$ ($px-5x=4$, $(p+2)x=p-1$) — rasti $x$ arba su kuriomis $p$ yra 1 / 0 / be galo daug sprendinių.

Vidutinė: tiesinė, kai $p$ koeficientai kvadratiniai ($(p^2-4)x=p+2$); kvadratinė su pastoviu $x^2$ nariu — $D(p)$, kiek sprendinių ($D>0$, $=0$, $<0$), pvz. $x^2-(p-1)x+4=0$.

Sunki: kvadratinės lygtys su sudėtingesniais parametrais. Jokių olimpiadinių.`,
  },
  "11:11-lygtys:iracionaliosios": {
    title: "Iracionaliosios",
    body: `${GRADE11_LYGTYS_CORE}

Tipai: $\\sqrt[n]{f(x)}=a$; $\\sqrt{f(x)}=g(x)$; $\\sqrt{f(x)}=\\sqrt{g(x)}+a$ arba $\\sqrt{f}+\\sqrt{g}=c$; $f(x)\\cdot\\sqrt[n]{g(x)}=0$.

Lengva: viena šaknis = skaičius ($\\sqrt{2x-1}=6$, $\\sqrt[3]{3x-4}=-2$, $\\sqrt[4]{5x+6}=2$); gali nebūti sprendinių ($\\sqrt{\\ldots}=-2$).

Vidutinė: $\\sqrt{f}=g$ ($\\sqrt{x+2}=x$, $\\sqrt{4-x}=x+2$); sandauga $=0$ ($(x-5)\\sqrt{x^2-7x-8}=0$); funkcijos nuliai ($6-\\sqrt{7x+2}$); susikirtimas $\\sqrt{3x+7}=x-1$.

Sunki: Dvi šaknys ($\\sqrt{x+2}=2+\\sqrt{x-6}$, $\\sqrt{x}+\\sqrt{25-x}=5$); keitimas $\\sqrt[4]{x}=y$ ($\\sqrt{x}-\\sqrt[4]{x}-6=0$); įrodyti, kad nėra sprendinių pagal $D$. Ne begalinės sandaugos`,
  },
  "11:11-lygtys:rodiklines": {
    title: "Rodiklinės",
    body: `${GRADE11_LYGTYS_CORE}

Tipai: $a^x=b$; $a^{f(x)}=a^{g(x)}$; $a^{x+c}+a^{x+d}=t$; $a^{2x}+a^x+t=0$ (keitimas $u=a^x$). $a>0$, $a\\neq 1$, $b>0$.

Lengva: tas pats pagrindas ($3^{5x+1}=9^{2x}$, $8^{x+1}\\cdot 8^{2x}=1$); $a^x=b$ ($e^x=2$); paprastas keitimas ($7^{2x}-6\\cdot 7^x-7=0$).

Vidutinė: iškėlimas ($7^{x-1}+3\\cdot 7^x=154$); šaknis rodiklyje ($2^{\\sqrt{x-5}}=8$); $f(x)=g(x)$ ($0.6^{x^2-10}=(5/3)^x$); trumpas procentinis ($25000$ mažėja $20\\%$ — kada $10240$).

Sunki: keitimas su $a^{-x}$ ($5^x-24=25/5^x$, $3^x+3^{1-x}=4$); GP sąlyga ($5^x,5^x+1,5^x+3$); tekstinis, kai $t$ per $\\log$ / $\\ln$. Ne 4 dalių paskola.`,
  },
  "11:11-lygtys:logaritmines": {
    title: "Logaritminės",
    body: `${GRADE11_LYGTYS_CORE}

Tipai: $\\log_a x=b$; $\\log_a f(x)=b$; $\\log_a f+\\log_a g=b$; $\\log_a^2 x+\\log_a x+t=0$ (keitimas $y=\\log_a x$). $a>0$, $a\\neq 1$; argumentas $>0$. Savybės: suma, skirtumas, $n\\log_a x$.

Lengva: $\\log_a x=b$ ($\\log_3 x=4$, $\\log_{1/3}x=-3$); linijinis argumentas ($\\log_4(4-5x)=2$); sulyginti argumentus ($\\log_3(2x+18)=\\log_3 24$).

Vidutinė: kvadratinis ar trupmeninis argumentas; $\\log_x A=b$; savybės ($\\lg(3-x)-\\lg(x+2)=2\\lg 2$); keitimas ($2\\log_3^2 x-7\\log_3 x=-3$).

Sunki: naudojamos logaritmų savybės pertvarkant lygtį ir tik tada sprendžiama lygtis. Pagrindo keitimas; 1-3 įdėtiniai $\\log_2(\\log_5 x)=1$.`,
  },
  "11:11-lygtys:su-moduliu": {
    title: "Su moduliu",
    body: `${GRADE11_LYGTYS_CORE}

Tipai: $|f(x)|=a$ ($a\\ge 0$; jei $a<0$ — nėra sprendinių); $|f(x)|=g(x)$ (tikrinti $g\\ge 0$). $f$, $g$ — reiškiniai.

Lengva: $|ax+b|=c$ ($|x-3|=6$, $|x|=-1$); daugiklis prieš modulį ($4|-3x+8|=28$).

Vidutinė: kvadratas modulyje ($|x^2-5x|=6$); $|f|=g$ linijiniam $g$ ($|2x-7|=4-3x$); $\\sqrt{(ax+b)^2}=|ax+b|$ tapatybė; nuliai $|4x-7|-1=0$; intervalas žodžiu ($|x-a|=b$).

Sunki: $|f(x)|=g(x)$; gali būti $|\\sqrt{\\ldots}-c|=d$; $\\log_a|f(x)|=c$ arba $|\\log_a f(x)|=c$ — viena lygtis. Ne 3 modulių suma + ekvivalentumo 4 poros.`,
  },
  "11:11-lygtys:lygciu-sistemos": {
    title: "Lygčių sistemos",
    body: `${GRADE11_LYGTYS_CORE}

Sistema tik $$\\begin{cases} ... \\\\ ... \\end{cases}$$ (tarp lygčių \\\\ , ne \\n ir ne kablelis vienoje eilutėje). 2 nežinomieji (tiesinė+kvadratinė, $xy$, $1/x$, apskritimas) arba 3 tiesinės $x,y,z$. Būdai: sudėtis, keitimas, naujas nežinomasis. Sprendinys — pora arba trejetas.

Lengva: išreikšti $x$ per $y$ ($2x+5=6y$); ar pora tinka; viena sveikoji pora; 1 tiesinė, 1 kvadratinė lygtis.

Vidutinė: tiesinė + apskritimas / parabolė; Šaknys sistemoje ar paprasta rodiklinė funkcija; $1/x=t$, $1/y=k$; simetrinė $x+y=t$, $xy=k$. Grafikas — gali liepti nubraižyti ir nuskaityti susikirtimą.

Sunki: tiesinė sistema su trimis nežinomaisiais ir trimis lygtimis. Šaknys sistemoje; tiesinė + apskritimas; rodiklinė / logaritminė pora ($\\log_2 x+\\log_2 y=2$); trumpas tekstinis (2–3 nežinomieji).`,
  },
  "11:11-nelygybes:aukstesnes-nei-2-laipsnio": {
    title: "Aukštesnės nei 2 laipsnio nelygybės",
    body: `${GRADE11_NELYGYBES_CORE}

Intervalų metodo sprendimas: lygtis $=0$, nuliai, ženklų lentelė, nelygybės atsakymai. Užduočių tipai: Kubinės / keturtinės — skaidyti dauginamaisiais (išskelti bendrą dauginį, grupavimas, greitoji daugyba).

Lengva: jau skaidyta forma $(x-a)(x-b)(x-c)>0$, $x(x-2)(3-x)\\ge 0$; ar $x$ tenkina nelygybę? ($x=2$ ir $(x-3)(x+5)(x+6)>0$); paprasti nuliai, 2–3 intervalai.

Vidutinė: prieš sprendimą skaidyti dauginamaisiais, sutraukti; vienas koeficientas su minusu ($(3-x)$, $(a-x)$) arba $(x^2-4)(9-x^2)\\ge 0$ arba keturi nuliai.

Sunki: lyginis kartotumas ($x^2(x-1)^2(x-4)\\ge 0$ — izoliuoti taškai $\\{0,1\\}\\cup[4;+\\infty)$); $x^2(x^2-2x+1)(x-4)\\ge 0$; rasti didž. / maž. sveikąjį sprendinį; trumpas tekstinis su kubiniu modeliu ($-2x^3+96x^2-270x>0$ — natūralūs $x$). Ne olimpiadiniai.`,
  },
  "11:11-nelygybes:racionaliosios": {
    title: "Racionaliosios",
    body: `${GRADE11_NELYGYBES_CORE}

Tipai: $\\frac{f(x)}{g(x)}>0$ ($g\\neq 0$); $\\frac{f}{g}\\ge 0$; lyginimas su skaičiumi ($\\frac{2}{x-3}>1$, $\\frac{x}{x+2}<-3$); kelios trupmenos abiejose pusėse; kubinis / kvadratinis numeratorius ($\\frac{x^3-7x-6}{x^2-4}\\ge 0$). $D$: vardiklis $\\neq 0$; su šakniimi / log — bendra $D$.

Lengva: $\\frac{x-a}{x-b}>0$, $\\frac{x(x+8)}{5-x}\\le 0$; $\\frac{1}{x}>8$; $\\frac{x-5}{2-x}>0$; rasti didž. natūralųjį sprendinį.

Vidutinė: perkelti į vieną pusę, bendras vardiklis; $\\frac{x}{x-3}\\le\\frac{2}{x}$; $\\frac{2x-1}{x+1}<\\frac{3x+2}{x-1}$; $D(f)$ su šaknim ir logaritmu ($\\sqrt{\\frac{x+2}{x-3}}+\\sqrt{x}$, $\\log_2\\frac{x}{2x+10}$); trumpas tekstinis (kuro sąnaudos, kainos intervalas).

Sunki: kelios trupmenos; tekstinis su kvadratine pelno / užsakymų funkcija ($P(x)=-0.1x^2+50x-2640$); parametras — su kuriomis $m$ sprendinys teigiamas.`,
  },
  "11:11-nelygybes:sistemos": {
    title: "Sistemos",
    body: `${GRADE11_NELYGYBES_CORE}

Dviguba nelygybė $a<f(x)<b$ (tiesinė arba kvadratinė). Sistemos: 2–3 nelygybės, sankirta. Gali būti $D(f)$ kaip sistema ($\\lg(x+2)>0$ ir $\\sqrt{10-x}$).

Lengva: 2 sunkios tiesinės; dviguba tiesinė ($-6<-3(x+2)<2$); ar duotas skaičius tenkina duotą sudėtingesnę nelygybę?

Vidutinė: tiesinė + racionalioji / kvadratinė; dviguba kvadratinė ($4<x^2\\le 9$, $1\\le x^2\\le 4$); 3 tiesinės $x,y,z$ arba 2 su trupmena; $\\{x^2-5x+6<0,\\ x^2+3x-4>0\\}$.

Sunki: 3 nelygybės ($\\{x+2>\\frac{x}{3},\\ -x+2<0,\\ 2x-1<x+3\\}$); dviguba su šaknim ar dar kokia įdomesne funkcija ($2<(x-\\sqrt{7})(x+\\sqrt{7})<9$); $0<x^2+2x-24<11$; lygtis + nelygybė ($\\{|2x-y|=5,\\ \\ldots\\}$); $D$ sudėtinga ($\\frac{\\lg(x+2)}{\\sqrt{10-x}}$).`,
  },
  "11:11-nelygybes:su-moduliu": {
    title: "Su moduliu",
    body: `${GRADE11_NELYGYBES_CORE}

Tipai: 1) $|f(x)|<>a$; 2) $\\sqrt{(f(x))^2}<>a$; 3) $|f|<>g$ — tikrinti $g\\ge 0$. Gali būti grafiškai.

Lengva: 1) tipas — $f$ tiesinė arba kvadratinė; 2) tipas — paprasta $f$ ir skaičiai.

Vidutinė: 2) tipas — sudėtingesnė $f$ (kvadratinė po šakni, aukštas laipsnis); 3) tipas — $g$ tiesinė.

Sunki: 3) tipas — $f$ ir $g$ įvairios (tiesinė ir kvadratinė, dvi tiesinės). Gali gautis ne tradicinis atsakymas.`,
  },
  "11:11-nelygybes:rodiklines": {
    title: "Rodiklinės",
    body: `${GRADE11_NELYGYBES_CORE}

Tipai: 1) $a^{f(x)}<>a^{g(x)}$ — vienodas pagrindas ($a>1$ ženklas tas pats, $0<a<1$ keičiasi); 2) $a^{f(x)}<>b$; 3) $a^{f(x)}<>b^{g(x)}$ skirtingi pagrindai — sutapatinti; 4) $u=a^x$; 5) $|f(x)|$ rodiklyje; 7) $D(f)$ su rodikline; 8) sistema; 9) parametras $a$; 10) tekstinis augimas / mažėjimas.

Lengva: 1) — $f,g$ linijiniai, aiškus pagrindas; 2) — be sprendinių ar visi $\\mathbb{R}$; 3) — lengvai susivienodina.

Vidutinė: 1) — $f$ kvadratinis arba modulis rodiklyje; 2) su logaritmu; 3) — keli žingsniai, sunkiai susivienodina pagrindai; 5)— viena duota rodiklinė; 7) — paprasta $D$.

Sunki: 8) 10); progresija rodiklyje — retai, kombinuoti uždaviniai su kitom temom (transformacijos, nelygybės su moduliu, racionaliosios ar laipsninės nelygybės)`,
  },
  "11:11-nelygybes:logaritmines": {
    title: "Logaritminės",
    body: `${GRADE11_NELYGYBES_CORE}

Tipai: 1) $\\log_a f(x)<>\\log_a g(x)$ — $f,g>0$; $a>1$ / $0<a<1$ taisyklė; 2) $\\log_a f(x)<>b$ — argumentas $>0$; 3) savybės (suma, skirtumas, $n\\log$) prieš sprendimą; 4) $| \\log |$ arba modulis argumente; 5) trupmeninis argumentas; 6) sistema; 7) $D(f)$ / kur $f(x)>0$; 8) kombinuota (log + šaknis / trupmena); 9) tekstinis; 10) maž. / didž. sveikasis sprendinys.

Lengva: 1) — linijinis argumentas; 2) — $b$ sveikas; pagrindas $>1$ ar aiškus $<1$.

Vidutinė: 2) — kvadratinis / trupmeninis argumentas; 3); 4); 5); 7); 10).

Sunki: 3) daug savybių; 5); 6); 7); 8); 9).`,
  },
  "12:12-trigonometrija:tapatybes": {
    title: "Tapatybės",
    body: `${GRADE12_TRIG_TAPATYBIU_CORE}

Tipai: 1) Suprastinti su $\\sin^2\\alpha+\\cos^2\\alpha=1$, $\\tg\\alpha$, $\\tg^2\\alpha+1=\\frac{1}{\\cos^2\\alpha}$; 2) Suprastinti trigonometrinius reiškinius su trupmenomis (galimas bendravardiklinimas, skaidymu dauginamaisiais, greitoji daugyba ir pan. algebra); 3) Rasti $\\sin$, $\\cos$, $\\tg$ duoto ketvirčio — duota viena funkcija; 4) Tiksli reikšmė sumos/skirtumo ($\\sin15^\\circ$, $\\cos\\frac{7\\pi}{12}$); 5) $\\sin(\\alpha\\pm\\beta)$, $\\cos(\\alpha\\pm\\beta)$ — skaičiuoti ar suprastinti; 6) $\\tg(\\alpha\\pm\\beta)$; 7) Dvigubo kampo skaitinė ($2\\sin\\alpha\\cos\\alpha$, $\\cos^2\\alpha-\\sin^2\\alpha$, $\\tg(2\\alpha)$) — atpažinti formulę; 8) Duotas $\\sin\\alpha$ / $\\cos\\alpha$ + ketvirtis — $\\sin(2\\alpha)$, $\\cos(2\\alpha)$, $\\tg(2\\alpha)$; 9) Suprastinti su dvigubo kampo formulomis; 10) Redukcija per sumą/skirtumą ($\\cos(\\pi+\\alpha)$, $\\sin(\\frac{3\\pi}{2}+\\alpha)$); 11) Tapatybės įrodymas; 12) Algebra: $\\sin^3\\alpha\\pm\\cos^3\\alpha$, $(\\sin\\alpha\\pm\\cos\\alpha)^2$; duota $\\sin\\alpha+\\cos\\alpha=m$ — rasti $\\sin\\alpha\\cos\\alpha$; 13) Išreikšti $\\sin(3\\alpha)$, $\\sin(4\\alpha)$ per $\\sin\\alpha$ (arba $\\cos$).

Lengva: 1) — sveikieji koeficientai;3) klausti vienos kitos funkcijos; 7) — standartiniai kampai ($30^\\circ$, $45^\\circ$, $60^\\circ$), atpažinti formulę.

Vidutinė: 1) sudėtingesni koeficientai, gali reikėti kelių pertvarkymų; 2); 3); 4); 5); 6) — su ketvirčiu ar supaprastinimas; 8); 9); 10) su mažais skaičiais;

Sunki: 2), 8), 9) ir 10) - sudėtingi atvejai; 11); 12); 13)`,
  },
  "12:12-trigonometrija:lygtys": {
    title: "Lygtys",
    body: `${GRADE12_TRIG_LYGTYS_CORE}

Tipai: 1) $\\sin x=a$, $\\cos x=a$, $\\tg x=a$ — lentelės reikšmės, $0$, $\\pm1$; 2) $\\sin(kx+b)=a$, $\\cos(kx+b)=a$, $\\tg(kx+b)=a$; 3) Koeficientas ($m\\sin(\\ldots)+c=0$); 4) Neigiama argumento dalis ($\\sin(-x)$, $\\cos(-x)$); 5) Sprendiniai intervale $[a;b]$ arba sprendinių skaičius intervale; 6) Nėra sprendinių ($|a|>1$, $\\cos x=\\tg x$); 7) $\\sin^2 x=a$, $\\tg^2 x=a$, $|\\tg x|=a$; 8) Skaidymas dauginamaisiais ($\\sin x(\\cos x-1)=0$); 9) Dvigubo kampo prieš skaidymą ($(1-\\cos2x)\\cos x+\\sin2x=0$); 10) Keitinys $t=\\sin x$ / $\\cos x$ / $\\tg x$ — kvadratinė; 11) Homogeninė $a\\sin x+b\\cos x=0$; 12) Tapatybių taikymas (suma/skirtumas, $\\sin^2+\\cos^2=1$, $\\frac{1}{\\cos^2}=1+\\tg^2$); 13) Trupmeninė su $\\tg$ ($2\\tg x+\\frac{1}{\\tg x}=3$) — $D$; 14) Funkcijų susikirtimas $f(x)=g(x)$; 15) Kelių dvigubo kampo taikymas ($\\sin x\\cos x\\cos2x\\cos4x=\\frac{1}{16}$).

Lengva: 1) 2) 3) paprasti skaičiai 6) — atpažinti be sprendimo.
Vidutinė: 2) 3); 4); 5) — trumpas intervalas, 1-2 sprendiniai; 6) su sprendimu prieš išvadą, kad nėra sprendinių 7) 8) — aiškus bendras dauginamasis; 9) aiškiai pastebima 10) — tiesioginė kvadratinė; 11).

Sunki: 8); 9); 12) — kelios tapatybės; 13); 14); 15); 10) — tapatybė prieš keitinį; 11) pertvarkymai prieš homogeninę; 5) — sudėtingas intervalas (3-4 tinkantys sprendiniai)`,
  },
  "12:12-trigonometrija:nelygybes": {
    title: "Nelygybės",
    body: `${GRADE12_TRIG_NELYGYBES_CORE}

Tipai: 1) $\\sin x<>a$; 2) $\\cos x<>a$; 3) $\\tg x<>a$; 4) $A\\sin(kx+b)+B<>0$; 5) Transformuotas argumentas ($\\cos(x-\\frac{\\pi}{3})$, $\\tg(\\frac{\\pi}{6}-2x)$); 6) $|a|>1$ — visi $\\mathbb{R}$ arba $\\varnothing$; 7) $\\sin^2 x<>a$ → $\\cos(2x)$; 8) Tapatybių taikymas (suma/skirtumas, dvigubas kampas, $\\tg$ sumos formulė); 9) Kelių žingsnių pertvarkymas ($2\\cos^2(2x)+\\sin(2x)-\\cos(4x)<1$); 10) Apibrėžimo sritis iš nelygybės po šakni / vardiklio; 11) Parametras — su kuriomis $a$, $m$ nelygybė teisinga visiems $x$ arba neturi sprendinių; 12) Sprendinių ieškojimas duotam intervale; 13) Tekstinis periodinis ($h(t)=a+b\\sin(\\ldots)+c\\cos(\\ldots)$, kada $h>k$).

Lengva: 1)–4) — lentelės reikšmės; 6) - iš karto atpažįstamas;

Vidutinė: 4); 5); 6) reikia pertvarkyti prieš pastebint, kad sprendinių nėra 7); 8) — viena tapatybė; 10) 12) — trumpas intervalas arti 0.

Sunki: 12) ilgesnis intervalas arba šiek tiek tolimesnis nuo 0; 10) sudėtingesnis reiškinys; 11); 13); 8)–9) kombinuoti kelios tapatybės.`,
  },
  "12:12-isvestines:samprata-ir-ribos": {
    title: "Samprata ir ribos",
    body: `Nekopijuok pavyzdžių, bet sukurk kažką panašaus.
    
Lengva: rasti trūkio taškus racionalioje funkcijoje ($f(x)=\\frac{1}{x^4}$, $\\frac{4x+1}{x^3+6x^2}$ — vardiklis $=0$); apskaičiuoti funkcijos reikšmės pokytį $\\Delta f$, kai duota $x_0$ ir $\\Delta x$ (pvz. $f(x)=\\frac{1}{2x-1}$, $x_0=0.8$, $\\Delta x=-0.2$).

Vidutinė: ištirti tolygumą taške kūrinėje funkcijoje ($$\\begin{cases} x, & x\\le -1 \\\\ x^3, & x>-1 \\end{cases}$$ ties $x=-1$) ir nubraižyti eskizą; apskaičiuoti $\\Delta f$ intervale (pvz. $f(x)=7+2x-x^2$ intervale $[-1;0.9]$).

Sunki: parinkti parametrą $m$, kad kūrinė funkcija būtų tolydi visoje $\\mathbb{R}$ ($$\\begin{cases} -0.5x+2, & x\\le 1 \\\\ 2x+m, & x>1 \\end{cases}$$) ir nubraižyti eskizą; tekstinis uždavinys su pokyčiu (pvz. kubo paviršiaus ploto pokytis, kai briauna $5\\text{ cm}$ pailgėja $0.1\\text{ cm}$).`,
  },
  "12:12-isvestines:isvestiniu-skaiciavimas": {
    title: "Išvestinių skaičiavimas",
    body: `${GRADE12_ISVESTINE_SKAICIAVIMAS_CORE}

Tipai: 1) $f'(x)$ — laipsninė su daugianariu; 2) Sandauga ($(4x+1)(x+1)$; 3) Dalmens taisyklė ($\\frac{x-1}{3x+2}$, $\\frac{\\ln(2x+6)}{x+3}$); 4) Suprastinti, tada $f'(x_0)$ ($(\\sqrt{x}-5)(\\sqrt{x}+5)$, $f'(6)$); 5) Išspręsti $g'(x)=f'(x)$ arba $f'(x)=g'(2)$; 9) Išspręsti $f'(x)=0$ (racionalinė, logaritminė); 10) $f'(x_0)+f(x_0)$ su neigiamais laipsniais; 11) Sudėtinė funkcija ($(5+x^3)^{13}$, $\\frac{3}{(4x-7)^5}$, $(15-4x)^6$, $\\frac{2x}{(3x+1)^4}$); 12) $e^x$, $a^x$ ($(e^x(3x^3-x+2))$, $e^{x-x^2}$, $3^x$, $7^{2x+1}$, $\\frac{x}{2^x}$); 13) Lietinė prie $e^{-x}$, $8^{-x}$, $0.5e^{-2x}$ — lygtis arba $k$; 14) $\\ln x$, $\\log_a x$ (sandauga, dalmuo, sudėtinė: $\\ln(5x)$, $\\ln^3 x$, $\\frac{\\ln(2x+6)}{x+3}$); 15) $\\tan\\alpha=f'(x_0)$ ($f(x)=\\sqrt[4]{2x-1}$, $x_0=1$); 17) Trigonometrinės: $(\\sin x)'$, $(\\cos x)'$, $(\\tg x)'$; sudėtinė ($\\cos(2x)$, $\\tg(\\frac{\\pi}{4}+x)$, $\\sin(\\frac{\\pi}{3}x)$); 18) $\\frac{\\cos x+2}{3+\\sin x}$, $\\ln x\\cdot\\sin x$; 19) Rasti $x$, kur $f'(x)=0$ ($\\sin x+\\cos x$, $\\sqrt{2}\\sin x-x$, $2\\tg x-2x$).

Lengva: 1); 4), 5) su paprastom funkcijom; 10) vienas neigiamas laipsnis; 11) — linijinis vidinis ($(15-4x)^6$); 12)paprasti atvejai; 17)paprasti atvejai.

Vidutinė: 2); 3); 4), 5) su sudėtingesnėm funkcijom; 9) — kvadratinė po $f'$; 10); 11); 12); 13); 14) — paprastesni atvejai; 15); 17) — sudėtingesni atvejai.

Sunki: 3) - dalmuo kombinuotas su sudėtingesnėm funkcijom; 5) sudėtingi atvejai; 9) trupmeninė su $D$; 11) — sudėtingesnė; gali būti 3 funkcijos vienoje; 12) — sudėtingesni atvejai; 14) — sudėtingesni atvejai; 17) sudėtingi atvejai; 18); 19);`,
  },
  "12:12-isvestines:isvestiniu-pritaikymas": {
    title: "Išvestinių pritaikymas",
    body: `${GRADE12_ISVESTINE_SKAICIAVIMAS_CORE}

Tipai: 0) Liestinė lygiagreti duotai (pvz $f(x)=x^2-6x+2$ lygiagreti $y=-2x+8$); 1) f'(x)=k=tg(alpha) taikymas; 2) Lietinės lygtis ($f(x)=2x^2+1$, $x_0=2$); 4) Vidutinis greitis intervale; 5) Momentinis greitis $v(t)=s'(t)$ taške; 6) $v(t)$ ir $a(t)$ iš $s(t)=t^3-3t^2+1$; 7) Monotonijos intervalai (daugianaris); 8) Įrodyti monotoniją visoje $\\mathbb{R}$; 9) Kritiniai taškai; 10) Ekstremumai iš grafiko / apibrėžimai; 11) $f'(x)=0$ trigonometrinė kritiniams taškams; 12) Ekstremumo taškai ir reikšmės ($2x^3-24x$; $4x^2-x^4$); 13) Monotonija + ekstremumai racionalioje ($\\frac{3x+x^2}{x-1}$, $\\frac{x^2-8x}{x+1}$); 14) Didž. / maž. reikšmė $[a;b]$ (kubinė, $\\sqrt{x^2+1}$, $\\ln x$); 15) $[a;b]$ be kritinių — tik galai ($\\frac{2}{x+1}-4$); 16) Didž. greitis intervale iš $s(t)$; 17) Optimizavimas: plotas / perimetras (stačiakampis $100\\text{ m}$ sienos); 18) Skaičiaus skaidymas — didž. sandauga ($42=a+b$, $ab^2$); 19) Stačiakampis fiksuotu ploto — min. perimetras; 20) Atviras cilindras — min. paviršius duotam tūriui; 22) Natūralus $a$ — min. $a+\\frac{4}{a^2}$; 23) Fizika: $v(t)=s'(t)$, $a(t)=v'(t)$. 

Lengva: 2) tiesioginis lygties užrašymas; 4); 7); 9) — kvadratinė, kūbinė; 12); 14) — kvadratinė $[a;b]$; 17) — stačiakampis su aiškiu perimetru.

Vidutinė: 0); 1); 2) sudėtingesni atvejai; 5); 6); 7) sudėtingesnių funkcijų; 8) viena funkcija; 9) sudėtingesnių funkcijų; 10); 12) — sudėtingesni atvejai, pvz. $3x^4-6x^3-1$; 13); 14) — sudėtingesni atvejai $\\sqrt{x^2+1}$ ar $\\ln x$; 15); 16);17); 18); 19); 23) greitis.

Sunki: 0), 1), 6) - sunkūs atvejai 8); 9) — $\\sqrt{x^2-x}$, $2\\sin x-\\cos(2x)$; 11); 13) pilnas tyrimas; 14) — $2\\cos(0.5x)-x$ intervale;16); 20); 22);23) pagreitis; 17) su papildoma sąlyga; 18); 12) — $\\ln(3x^2-15x)$ kritiniai.`,
  },
  "12:12-stereometrija-3d:tieses-ir-plokstumos": {
    title: "Tiesės ir plokštumos",
    body: `${GRADE12_STEREOMETRIJA_CORE}

Sąvokos ir teoremos: stereometrijos aksiomos; plokštumos apibrėžimas (3 nekolinearūs taškai; tiesė ir taškas ne ant jos; dvi kertančios ar lygiagrečios tiesės); prasilenkiančių tiesių požymis; tiesės ir plokštumos lygiagretumo požymis; tiesės ir plokštumos statmenumo požymis; dviejų plokštumų lygiagretumo požymis; dviejų plokštumų statmenumo požymis; trijų statmenų teorema (statmuo, pasviroji, projekcija).

Kampai: kampas tarp prasilenkiančiųjų tiesių; kampas tarp pasvirosios ir plokštumos; dvisienis kampas (kampas tarp plokštumų).

Atstumai: nuo taško iki tiesės; nuo taško iki plokštumos; tarp lygiagrečių tiesių; tarp prasilenkiančiųjų tiesių; tarp tiesės ir lygiagrečios plokštumos; tarp lygiagrečių plokštumų.

Tipai (lygio orientacija — nekopijuoti): kubas — plokštumų sankirta, lygiagretumas, statmenumas; trijų statmenų teorema (piramidė ar rombas pagrinde — įrodyti statmenumą, rasti kraštinę); įrodyti statmenumą erdvėje; kampas tarp plokštumų (stačioji prizmė, piramidė); pasviroji ir projekcija — $\\cos$ kampo su plokštuma; kvadratas ir lygiagretainis skirtingose plokštumose — atstumas.`,
  },
  "12:12-stereometrija-3d:briaunainiai": {
    title: "Briaunainiai",
    body: `${GRADE12_STEREOMETRIJA_CORE}

Kūnai: prizmė (stačioji, taisyklingoji, gretasienis, kubas); piramidė (taisyklingoji, trikampė, keturkampė, tetraedras); nupjautinė piramidė. Paviršiaus plotas — šoninio ir viso. Pjūviai: įstrižinis, lygiagretus su pagrindu. Panašumas — pjūvis lygiagrečiam su pagrindu ($k^2$ plotų santykis).

Lengva: Taisyklingos, paprastos figūros, tiesioginis formulių taikymas arba papildomai nebent surasti kokią kraštinę, aukštinę ar įstrižainę su pitagoro teorema, trikampio 30,45,60 laipsnių kampų taisyklėmis.

Vidutinė: pirma rasti trūkstamą matmenį ($H$ iš $S_{pav}$; kraštinę iš Pitagoro ar erdvinės įstrižainės) gali būti figūrų savybės; tada $V$ ar paviršius. Piramidė: rombas, lygiagretainis pagrinde; viena briauna statmena pagrindui ar pan. Nupjautinė piramidė — duotos kraštinės ir $H$. Prizmės sienų/briaunų/taškų skaičius ($n$-gonas). Pjūvio plotas (įstrižinis ar lygiagretusis stačiojoje prizmėje).

Sunki: tūrio ar ploto skaičiavimas tik prieš tai atlikus keletą skaičiavimų naudojant pitagoro t., figūrų savybes, trigonometriją, panašumo sąvybės ar pan. Prizmė su trapecijos pagrindu + įstrižinio pjūvio plotas — $S_{pav}$, $V$, pjūvis $A_1BCD_1$. Piramidė: taisyklingasis trikampis — pjūvis per $H$ ir briauną → $S_{šon}$, $V$; lygiagretusis pjūvis → tūris didelės ar mažos piramidės (panašių figūrų tūrių savybė). Tetraedras — pjūvio per vidurio taškus perimetras. Nupjautinė piramidė — įstrižinio pjūvio plotas → $V$; $S_{šon}$, $H$ ir briaunų skirtumas → $V$. Pjūvis per vidurio taškus ($KMN$). Įrodyti ar taikyti savybes (kvadratas įstrižainės, kubo kraštinė +2 → tūrio pokytis).`,
  },
  "12:12-stereometrija-3d:sukiniai": {
    title: "Sukiniai",
    body: `${GRADE12_STEREOMETRIJA_CORE}

Kūnai: ritinys; kūgis (sudaromoji $l$); nupjautinis kūgis; rutulys; sfera; rutulio nuopjova. Pjūviai: ašinis (stačiojoje prizmėje — stačiakampis; kūgyje — trikampis), lygiagretus su pagrindu. Panašumas kūnų — $k$, $k^2$ plotų, $k^3$ tūrių.

Lengva: paprastos figūros, 1-3 paprasti veiksmai: formulių taikymas, pigagoro teorema, trikampio 30,45,60 laipsnių taisyklės. Jei duoti pjūviai, tada tiesioginis pjūvio ploto ar perimetro skaičiavimas.

Vidutinė: ašinio pjūvio plotas arba įstrižainė ir kampas su pagrindu ($45^\\circ$, $60^\\circ$) → rasti $H$, $R$, tada $V$ ar $S$. Kūgis — $l$ ir $d$ → $H$; apsisukimo stačiakampis → pagrindo skersmuo. Santykis matmenų ($h=r+2$) ir $S_{pav}$ — rasti $S_{šon}/S_{pagr}$. Kūgis pjūvis lygiagrečiam su pagrindu — pjūvio plotas (panašumas). Rutulys pjūvis — $R$ ir atstumas nuo centro → pjūvio plotas. Nupjautinis kūgis iš trapecijos sukimosi. Kūgio ašinio pjūvio perimetras ir $H$ → $l$, $R$.

Sunki: tūrio ar ploto skaičiavimas tik prieš tai atlikus keletą skaičiavimų naudojant pitagoro t., figūrų savybes, trigonometriją, figūrų panašumą ar pan.; ritinys — pjūvis lygiagretus ašiai (ne per centrą), kampas su ašimi — pjūvio plotas. Kūgis pjūvis lygiagrečiam, žinomas atstumas nuo viršūnės — pjūvio plotas arba tūrio dalys. Pjūvis lygiagrečiam — dvi tūrio dalys (mažas kūgis + nupjautinis). Panašumo koeficientas $k$ — plotai ir tūriai. Rutulio nuopjova — $V$ ir $S$ iš $R$, $H$. Kombinuotas ritinys+kūgis — tūris, svoris ($\\rho$), paviršius dengimui. Kūgis: ašinio pjūvio plotas ir santykis $V:S_{šon}$ — sistema, rasti $l$.`,
  },
  "12:12-tikimybes-ir-kombinatorika:rinkiniai": {
    title: "Rinkiniai",
    body: `${GRADE12_KOMBINATORIKA_CORE}

Sąvokos: kombinatorikos sudėties taisyklė (arba); daugybos taisyklė (ir); kėliniai $P_n$; faktorialas $n!$; gretiniai $A_n^k$; deriniai $C_n^k$; Paskalio taisyklė; Niutono binomas; binominiai koeficientai. Pasirinkimas: eilės tvarka svarbi → $P_n$ ar $A_n^k$; nesvarbi → $C_n^k$.

Lengva: tiesioginis $P_n$, $A_n^k$ ar $C_n^k$ (maži $n$, $k$); sudėtis ARBA daugyba atskirai (gėrimas + dydis, vienas daiktas iš grupių); faktorialo skaičiavimas $\\frac{n!}{(n-k)!}$; trumpas skaitmenų rinkinys be $0$; išskleisti $(x\\pm a)^n$ ($n\\le 5$); surašyti kelis kėlinius.

Vidutinė: sudėtis ir daugyba kartu ($(m_1\\cdot m_2)+(m_3\\cdot m_4)$); žodis — bent $k$ skirtingų raidžių; skaitmenys su $0$ (pirmas $\\neq 0$); grupės kartu (SF knygos + biografijos); lygtis su $x!$; rasti $k$-tąjį ar $n$-tąjį binomo termą; skaitmenų rinkinys — lyginis, nelyginis, be pasikartojimų; derinių sandauga, suma (raudoni + žali kamuoliukai).

Sunki: daugiau rinkinių (didesni skaičiai); bent $k$ skirtingų raidžių iš žodžio (suma $A_n^k$); sudėtingas skaitmenų/kodų uždavinys; rasti $n$ iš $\\sum C_n^k=2^n$ ar koeficiento; parametras binome (be $x$ terminas); sėdėjimas su apribojimais; Paskalio taikymas; derinių suma „bent 3“ ar „ne daugiau kaip 4“; rankų paspaudimai, įstrižainių skaičius, kūrybiškesni gyvenimiški uždaviniai`,
  },
  "12:12-tikimybes-ir-kombinatorika:tikimybes": {
    title: "Tikimybės",
    body: `${GRADE12_TIKIMYBE_CORE}

Sąvokos: klasikinė tikimybė; būtinas įvykis $\\Omega$; negalimas $\\emptyset$; priešingas $\\bar{A}$; nepriklausomi įvykiai; nesutaikomieji; $P(A\\cup B)=P(A)+P(B)-P(A\\cap B)$; Bernulio bandymai $P_n(k)$.

Lengva: tiesioginis $P=\\frac{m}{n}$ — kortelės, raidė iš žodžio, kamuoliukai iš maišo, lošimų kauliukai (klasikiniai); būtinas ar negalimas; priešingas ($P(\\bar{A})=1-P(A)$); nesutaikomieji (mėlyni ar raudoni). Tikimybės su "ir/arba".

Vidutinė: nepriklausomi — $P(A\\cap B)=P(A)P(B)$ (dvi dėžės, trys lentynos); $P(A\\cup B)$ su sankirta (lankininkai); ar nesutaikomieji / nepriklausomi (duoti $P(A)$, $P(B)$, $P(A\\cup B)$); Bernulio — tiksliai $k$ kartų; kombinatorika + tikimybė (komanda 2M+2B); sugrąžinimas į dėžę - šiek tiek sudėtingesni tikimybių uždaviniai.

Sunki: bent vienas ($1-P(\\bar{A}\\cap\\bar{B})$); knygos eilėje + tikimybė; loterija bent 3 iš 5; Bernulio „bent $k$“; kombinatorika (pirštinės be poros, eilėje tarp asmenų, bent du vienodi skaitmenys). Gana sudėtingi, kombinuoti tikimybių uždaviniai. Gali būti gyvenimiški.`,
  },
  "12:12-tikimybes-ir-kombinatorika:skirstiniai-ex-dx-ir-kt": {
    title: "Skirstiniai, EX, DX ir kt.",
    body: `${GRADE12_SKIRSTINIAI_CORE}

Galimos sąlygos (ne visos, o 1-2 vienoje užduotyje): diskretus atsitiktinis dydis $X$ ir jo skirstinys ($x_i$, $p_i$). Matematinė viltis $EX$; dispersija $DX$; standartinis nuokrypis $\\sigma(X)$. Sudaryti skirstinį iš kombinatorikos (kamuoliukai, kortelės, kortelės iki trikampio ir pan.). Rasti trūkstamą $p_i$ kai $\\sum p_i=1$. Apskaičiuoti $EX$, $DX$, $\\sigma$ (suapvalinti pagal sąlygą). Normalus (Gauso) skirstinys — savybės: simetrija apie $EX$, $\\sigma$ lemia „platumą“; taikymų kontekstas be integralo skaičiavimo.`,
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
  "10:10-lygciu-sistemos:lygciu-sistemu-sprendimas": {
    title: "Lygčių sistemų, kurių viena lygtis yra tiesinė, o kita - trupmeninė arba kvadratinė, sprendimas",
    body: `Sistema: viena lygtis tiesinė ($ax+by=c$), kita — trupmeninė (su $x$ ar $y$ vardikliu) arba kvadratinė ($ax^2+bx+c=0$ arba su $x^2$, $y^2$). Nežinomieji tik $x$ ir $y$. Užrašyk $$\\begin{cases} ... \\\\ ... \\end{cases}$$ (ne \\{ su \\n).

Lengva: duota sistema be teksto; viena lygtis aiškiai tiesinė, kita — paprasta kvadratinė arba racionalioji; 1–2 perkėlimai.

Vidutinė: trupmeninė lygtis reikalauja išskirti bendrą dauginį ar sutraukti; kvadratinė su $D>0$ arba $D=0$; gali būti 3–4 nariai abiejose pusėse.

Sunki: sudėtingesnė trupmeninė (kelios trupmenos, apibrėžimo sritis); kvadratinė su parametrais arba kombinuota su trupmenine; patikrink sprendinius (ypač racionaliose). Patikrink atsakymus.`,
  },
  "10:10-lygciu-sistemos:tekstiniai-uzdaviniai": {
    title: "Tekstiniai uždaviniai",
    body: `Uždaviniai su skaičiais, pvz.: „Trupmenos skaitiklis ir vardiklis yra natūralieji skaičiai. Vardiklio ir skaitiklio skirtumas lygus 4. Jeigu skaitiklį ir vardiklį padidintume 5 vienetais, trupmenos reikšmė padidėtų 3 kartus. Raskite šią trupmeną.“ Darbo ir judėjimo uždaviniai; geometriniai ir gyvenimiški uždaviniai. Sudaryti lygčių sistemą iš teksto (viena lygtis tiesinė, kita trupmeninė arba kvadratinė) ir išspręsti.

Lengva: trumpas tekstas, aiškiai sudaryti 2 lygtis.

Vidutinė: daugiau teksto, reikia patys parinkti kintamuosius; darbo ar judėjimo kontekstas.

Sunki: kombinuoti geometrinį ar gyvenimiški kontekstą su trupmenine/kvadratine lygtimi; patikrink atsakymus.`,
  },
  "10:10-kvadratines-nelygybes:algebrinis-budas": {
    title: "Algebrinis būdas",
    body: `Atsakymas intervalais.

Lengva: jau skaidyta forma $(x-a)(x-b)>0$ arba $<0$; nepilnosios $ax^2+bx \le 0$, $ax^2+c>0$, $ax^2<k$; paprastos $(ax+b)^2>0$ arba $\le 0$; gali būti „ar skaičius … yra sprendinys?“.

Vidutinė: pilnas trinaris $ax^2+bx+c$ po skaidymo dauginamaisiais arba kvadratas $(x\pm m)^2$; perstatyti narius prieš sprendimą; $D>0$, $D=0$ arba $D<0$ atvejai.

Sunki: išskleisti ir supaprastinti prieš sprendimą (skliaustai, $(x-a)^2$); rasti didžiausią sveikąjį ar mažiausią natūralųjį sprendinį; $f(x)<0$ kai duota $f(x)=ax^2+bx+c$; dvi nelygybės — bendri sprendiniai (sankirta). Patikrink atsakymus.`,
  },
  "10:10-kvadratines-nelygybes:grafinis-ir-intervalu-metodai": {
    title: "Grafinis ir intervalų metodai",
    body: `Kvadratinės nelygybės — grafinis būdas (nuliai, parabolė) arba intervalų būdas (nuliai, ženklų intervalai). Atsakymas intervalais; gali nurodyti spręsti „grafiniu“ ar „intervalų“ metodu.

Lengva: grafinis — nepilnosios $x^2+bx>0$, $x^2-c>0$, $c-x^2\le 0$; paprastas trinaris $x^2+bx+c<0$. Intervalų — jau skaidyta $x(3x-1)>0$, $(ax+b)(cx+d)\ge 0$; paprasti $x^2+bx>0$, $k-x^2\le 0$.

Vidutinė: grafinis — perstatyti $x^2-2<-x$, $(x-1)^2-7\le 4x+1$; $D=0$ / visi $x$ / tuščia aibė; didžiausias sveikasis sprendinys; natūralių sprendinių suma; $\sqrt{x^2+20x}$ apibrėžimo sritis ($\ge 0$ po šaknimi). Intervalų — trinaris po skaidymo; trupmeniniai koeficientai.

Sunki: grafinis — $\frac{5}{x^2-3x}>0$; įrodyti, kad nelygybė teisinga visiems $x$; $\frac{x^2+4x}{3}+\frac{2+2x}{2}<1$ ir rasti sveikų sprendinių vidurkį; dvi nelygybės — bendri sprendiniai (sankirta) rašyk $$\\begin{cases} ... \\\\ ... \\end{cases}$$; $\sqrt{5x^2-15x}$ ODZ, sveiki $x$. Intervalų — išskleisti prieš metodą: $x(x+3)<4x+6$, $(x+6)^2-x(x-4)>x^2$, $(x+1)^2-2x(x+3)<-4x$; $-x^2+bx+c$. Patikrink atsakymus.`,
  },
  "10:10-kvadratines-nelygybes:tekstiniai-uzdaviniai": {
    title: "Tekstiniai uždaviniai",
    body: `TIK tekstiniai uždaviniai — sudaryti kvadratinę nelygybę iš sąlygos ir išspręsti; atsakymas intervalais arba konkretus skaičius (natūralus, sveikas). DRAUDŽIAMA: grynos lygtys/nelygybės be konteksto; parametrai $k$, $m$, $t$ be teksto (diskriminantas „su kuriomis $k$…“).

Lengva: stačiakampio plotas ir kraštinės ($S \le k$, viena kraštinė ilgesnė už kitą); trys iš eilės natūralių (arba ne neigiamų) skaičių kvadratų suma $\le k$ ir panašūs aiškūs uždaviniai.

Vidutinė: stačiakampis lyginant su kvadratu; stačiasis trikampis — jų suma ar skirtumas ir plotas $>/< k$; fizika/ekonomika su duota formule: $s(t)=at^2+bt+c$ (atstumas $>k$), $P(x)=-ax^2+bx+c$ (pelnas $\ge k$), $h(t)=at-bt^2$ (aukštis $>k$) — rasti $t$ ar $x$ intervalą ar min. sveiką $t$.

Sunki: sklypas su vidine tvora, bendras fence ilgis ir plotas $\ge k$; du natūralūs skaičiai su liekanomis dalijant ir sandauga $\le k$; terasos ilgis/plotis ir plotas tarp ribų; nelygybių sistemos — $$\\begin{cases} ... \\\\ ... \\end{cases}$$ (ne kablelis vienoje eilutėje). Patikrink atsakymus.`,
  },
  "10:10-panasios-figuros:panasieji-trikampiai": {
    title: "Trikampio panašumo požymiai",
    body: `Trikampių panašumas: požymiai pagal du kampus (AA), dvi kraštines ir kampą tarp jų (SAS), tris kraštines (SSS). Atitinkamos kraštinės ir atitinkami kampai. Panašumo koeficientas $k$ — atitinkamų kraštinių santykis.

Lengva: „Nustatykite, ar trikampiai panašūs. Atsakymą pagrįskite“ — du duoti kampai arba statusis lygiašonis trikampis; AA požymis; rasti trečią kampą iš $180^\circ$ sumos. Du panašūs trikampiai su duotais 2 kampais — užrašyti atitinkamas kraštines ir kampus. Rasti $x$ pagal proporciją, kai trikampiai jau panašūs ir duotos 3 kraštinės (aiškus $k$).

Vidutinė: SAS ir SSS; patikrinti proporcijas ($8:10$ ir $4:5$ ir $37^\circ$). Įrodyti panašumą brėžinyje (lygiagretūs pagrindai, bendras kampas, „smėlio laikrodžio“ trikampiai su kryžminiais kampais). Proporcingos atkarpos: trikampio viduje atkarpa lygiagreti pagrindui — rasti $x$ (Talio teorema / panašumas). Dvi lygiagrečios tiesės ir kertančios — rasti nežinomą atkarpą. Keli atvejai (a–d) skirtingais požymiais.

Sunki: įrodyti panašumą ir užrašyti kraštinių proporcijas (sudėtingas brėžinys su keliais trikampiais); aukštinės į įžambinę statusiame trikampyje (panašūs trikampiai); trapecija su įstrižainėmis. rasti $x$ ir $y$ keliuose trikampiuose. Užduotims su dviem panašiais trikampiais ir viena nežinoma kraštine — diagram_config SIMILAR_TRIANGLES (left_*/right_* labels). Patikrink atsakymus.`,
  },
  "10:10-panasios-figuros:panasiuju-trikampiu-perimetrai-ir-plotai": {
    title: "Panašiųjų trikampių perimetrai ir plotai",
    body: `Panašūs trikampiai: perimetrų santykis $P_1/P_2=k$; plotų santykis $S_1/S_2=k^2$; atitinkamų aukštinių santykis $k$. Vidurinė linija sukuria panašų trikampį su $k=1:2$, plotas $1:4$.

Lengva: duotas vieno trikampio perimetras ir kitų kraštinės — rasti kraštines arba $k$ Taisyklingasis trikampis: duotas kraštinė ir perimetras — rasti kitą perimetrą pagal $k$. Rasti $k$ iš kraštinių ir apskaičiuoti perimetrą.

Vidutinė: rasti kraštines, kai duotas perimetras ir $k$; rasti abu perimetrus, kai duota ilgiausia/ trumpiausia kraštinė ir $k$; perimetrų skirtumas arba suma su kraštinių santykiu ($P_{ABC}-P_{DEF}=75$, $AB/DE=3/2$). Plotų santykis iš $k$ — rasti plotą arba $k$. Aukštinės: įrodyti arba taikyti, kad $B_1D_1/BD=k$. Vidurinė linija — rasti kraštines ir plotus ($S_{AEF}/S_{ACD}$).

Sunki: plotų suma arba skirtumas su duotu $k$; plotai iš atitinkamų kraštinių ilgių (pvz. $2{,}4$ ir $12$ cm) ir plotų sumos/skirtumo. Įrodyti panašumą su lygiagrečia atkarpa, rasti $k$ ir plotus. Kombinuota: jei $\triangle A\sim\triangle B$ ($k_1$) ir $\triangle B\sim\triangle C$ ($k_2$) — plotų santykis $\triangle A$ ir $\triangle C$. Žemėlapio mastelis (1:1200, 1:3500) — trikampio sklypo plotas areais. „Argumentuokime“ — ar duoti plotų ir kraštinių santykiai suderinami su $k^2$? Patikrink atsakymus.`,
  },
  "10:10-panasios-figuros:pusiaukrastiniu-savybes": {
    title: "Pusiaukraštinių savybės",
    body: `Pusiaukraštinė (median) — kraštinė į vidurio tašką. Savybės: centroidas $O$ dalija pusiaukraštinę santykiu $2:1$ nuo viršūnės ($AO/OA_1=BO/OB_1=CO/OC_1=2/1$); viena pusiaukraštinė dalija trikampį į du lygius plotus; trys pusiaukraštinės dalija į 6 lygius plotus ($S_1=S_2=\cdots=S_6$); statusiame trikampyje pusiaukraštinė į įžambinę $CD=\frac12 AB$.

Lengva: duotas $AO$, $BO$ arba $CO$ — rasti $OA_1$, $OB_1$, $OC_1$ arba visą pusiaukraštinę. Užpildyti santykiai ($KO=\Box KE$, $DM=\Box OM$). Vienos pusiaukraštinės plotai lygūs.

Vidutinė: perimetras keturkampio $OECD$ sudaryto iš pusiaukraštinių dalių; perimetras $\triangle MOK$ ir vidurinių taškų atkarpų ilgiai. Statusis trikampis su $30^\circ$ kampu — pusiaukraštinės ir kampai. Lygiašonis trikampis — kampai ir pusiaukraštinės ilgiai. Lygiakraštis — pusiaukraštinės ilgis ir plotai ($\triangle AON$, visas trikampis).

Sunki: vidurio taškų trikampis — duotas mažo trikampio plotas, rasti didžio ($1:4$). Dvi pusiaukraštinės statmenos — duoti segmentai nuo $O$, rasti plotą. Statusiame trikampyje palyginti plotus $\triangle ABM$ ir $\triangle BMC$ (pusiaukraštinė ir aukštinė iš tos viršūnės). Kampai, kai pusiaukraštinė dalija kampą santykiu $1:2$ arba vienas $30^\circ$ didesnis už kitą. Patikrink atsakymus.`,
  },
  "10:10-panasios-figuros:pusiaukampiniu-savybe": {
    title: "Pusiaukampinių savybė",
    body: `Kampo pusiaukampinė dalija priešais esančią kraštinę į atkarpas, proporcingas gretimų kraštinių ilgiams: $\frac{AD}{DC}=\frac{AB}{BC}$ (arba $\frac{AD}{AB}=\frac{DC}{BC}$).

Lengva: brėžinys su pusiaukampine — rasti $x$ iš trijų duotų ilgių (a–f tipo); paprastas statusis trikampis su pusiaukampine.

Vidutinė: duotas perimetras ir pusiaukampinės dalijimo santykis — rasti kraštines; lygiašonis trikampis su pusiaukampine. Stačiakampis/kvadratas įrašytas trikampyje — pusiaukampinė kaip įstrižainė (Patarimas: $CE$ ar $ME$ yra pusiaukampinė).

Sunki: duoti kampai ($15^\circ$, $72^\circ$ ir pan.) — rasti pusiaukampinės ilgį, kraštines ir trikampio plotą; kelių žingsnių uždavinys su pusiaukampine ir papildomomis sąlygomis. Patikrink atsakymus.`,
  },
  "10:10-panasios-figuros:panasieji-daugiakampiai": {
    title: "Panašieji daugiakampiai",
    body: `Panašieji daugiakampiai: atitinkamų kraštinių santykis $k$; perimetrų santykis $k$; plotų santykis $k^2$. Visi lygiagretainiai to paties kampo panašūs; visi kvadratai panašūs; lygiagretainiai/kvadratai/trapecijos/rombai — ne visada tarpusavyje panašūs.

Lengva: užrašyti teisingą panašių trikampių kraštinių proporciją (pvz. $\triangle KMN\sim\triangle KPR$, $PR\parallel MN$). Perimetrų santykis iš kraštinių ($16$, $24$, $30$ ir ilgiausia $36$). Pasirinkti teisingą teiginį: ar visi trikampiai/kvadratai/trapecijos/rombai visada panašūs?

Vidutinė: panašių daugiakampių plotai ($0{,}88$ ir $10{,}78$ dm$^2$) — rasti trumpiausią kraštinę iš $k^2$. Lygiagretainis su aukštinėmis — rasti kraštinę ir plotą. Stačiakampyje $M$, $N$ vidurio taškai — plotų santykis $\triangle AMN$ ir $\triangle MNC$. Pusiaukraštinės centroidas — $OE=8$, rasti $AO$.

Sunki: Originalesnės užduotys, kur naudojami daugiakampių perimetrai, plotai ir jų panašumo savybės. Patikrink atsakymus.`,
  },
  "10:10-trigonometrija:posukio-kampas": {
    title: "Posūkio kampas",
    body: `Vienetinis apskritimas; posūkio kampas $0^\circ$–$180^\circ$ (I ir II ketvirtis). Taško $(x;y)$ ant apskritimo: $\\sin\\alpha=y$, $\\cos\\alpha=x$, $\\tg\\alpha=\\frac{y}{x}$. $x^2+y^2=1$. Rašyk $\\tg$, ne $\\tan$.

Lengva: nustatyti ketvirtį (1 arba 2); apskaičiuoti sin cos arba tg [0;180] laipsnių; duotas $x$ ar $y$ — rasti antrą koordinatę iš vienetinio apskritimo (paprastos trupmenos); nurodyti ženklus I/II ketvirtyje.

Vidutinė: taškas $B(\\frac{\\sqrt2}{2};\\frac{\\sqrt2}{2})$, $B(\\frac12;\\frac{\\sqrt3}{2})$, II ketvirtyje $B(-\\frac{\\sqrt3}{2};\\frac12)$ — rasti posūkio kampo dydį. Duota abscisė - rasti ordinatę ir $\\sin$, $\\cos$, $\\tg$. Duota ordinatė — rasti $x$ (nurodytas ketvirtis arba visi atvejai). Brėžinyje duotos ašies atkarpų ilgiai ($OA_1=\\frac13$, $OB_2=\\frac23$) — rasti likusias atkarpas ir trigonometrines reikšmes. Ženklai: $\\sin\\alpha\\cdot\\cos 110^\circ$; nustatyti ketvirtį iš ženklų. Duotas pvz $\\sin\\alpha=\\frac8{17}$ (II ketvirtis) — rasti $\\cos\\alpha$; duotas cos, rasti sin ar tg. Tikslūs skaičiai 30,45,60,90,120,135,150,180 laipsnių trigonometrinių funkcijų; Sumažinimo formulės: $\\sin(180^\\circ-\\alpha)=\\sin\\alpha$, $\\cos(180^\\circ-\\alpha)=-\\cos\\alpha$; $\\sin 16^\\circ-\\sin 164^\\circ$; supaprastinti $4\\sin(180^\\circ-\\alpha)+5\\sin\\alpha$.

Sunki: kaip Vidutinė, bet didesni skaičiai ir ilgesni reiškiniai (pvz. $\\sin^2 20^\\circ+\\cos^2 20^\\circ-\\sin 140^\\circ+\\sin 40^\\circ$); „Argumentuokime“; Trumpas tekstinis kontekstas su koordinatėmis — nepersudėtingas. Patikrink atsakymus.`,
  },
  "10:10-trigonometrija:trikampio-ploto-formule": {
    title: "Trikampio ploto formulė",
    body: `Ploto formulės: $S_{\\triangle ABC}=\\frac12 ab\\sin\\angle C$ (ir analogiškai su kitais kampais) taikymas. Lygiagretainis: $S=ab\\sin\\angle A$. Rombas: $S=a^2\\sin\\alpha$. Kampų suma trikampyje $180^\\circ$.

Lengva: paprasti trigonometrinės ploto formulės taikymo uždaviniai skaičiuojant trikampio ar lygiagretainio plotą.

Vidutinė: kraštinės su šaknimis ($18\\sqrt3$ ir $6$, kampas $60^\\circ$; $60\\sqrt2$ ir $54$, $45^\\circ$); išorinis kampas $150^\\circ$ — rasti vidinį ir plotą; kampų santykis $10:5:3$ arba vienas $20^\\circ$ didesnis už kitą; duotas $\\cos\\alpha$ — rasti $\\sin\\alpha$ per $\\sin^2\\alpha+\\cos^2\\alpha=1$, tada plotas; rasti kraštinę iš ploto ir dviejų kraštinių su kampu; lygiašonis — aukštinė, plotas, $\\sin$ kampo tarp kraštinių; rombas — rasti kampus arba perimetrą iš ploto ir kraštinės; kraštinių santykis $2:3$ arba $x$ ir $x+2$ lygiagretainyje.

Sunki: kaip Vidutinė, bet sudėtingesni skaičiai; kampai $x^\\circ$, $2x^\\circ$, $15x^\\circ$; du atvejai kampo (smailus ir bukas) kai duotos kraštinės ir plotas; rombas su tikslumu $0{,}1$ arba $0{,}01$; trumpas tekstinis uždavinys (sklypo plotas) — nepersudėtingas. Patikrink atsakymus.`,
  },
  "10:10-trigonometrija:sinusu-teorema": {
    title: "Sinusų teorema",
    body: `Sinusų teoremos taikymas smailiajam ir bukajam trikampiui.

Lengva: du kampai ir viena kraštinė — rasti kitą kraštinę (apvalinti); dvi kraštinės ir kampas tarp vienos iš jų — rasti kampą (apvalinti iki sveikų laipsnių).

Vidutinė: lygiagretainis $ABCD$ ir įstrižainė; Du kampai ir apibrėžtinis apskritimas spindulys $R$ — kraštinės; duotas apskritimo perimetras $10\\pi$ arba plotas $64\\pi$ — rasti $R$, tada kraštines. Lygiašonis $AB=BC$, $\\angle B=120^\\circ$, kampo pusiaukampinė $AD=12$ — kraštinė.

Sunki: kaip Vidutinė, bet didesni skaičiai; Trumpas tekstinis (pvz kelias, upė, dvi matuotos atkarpos ir kampai) — nepersudėtingas. Patikrink atsakymus.`,
  },
  "10:10-trigonometrija:kosinusu-teorema": {
    title: "Kosinusų teorema",
    body: `Kosinusų teorema: $c^2=a^2+b^2-2ab\\cos C$ (ir analogijos). Rasti kampą, kai žinomos trys kraštinės arba rasti kraštinę, kai žinomos kitos dvi kraštinės ir kampas tarp jų.

Lengva: tiesioginis kosinusų teoremos taikymas.

Vidutinė: kosinusų teoremos taikymas, kai reikia ją įžvelgti, pavyzdžiui per lygiagretainį. Tekstiniai, gyvenimiški uždaviniai, sudėtingesni skaičiai.

Sunki: kaip Vidutinė, tik dar vienas papildomas žingsnis, pvz ploto apskaičiavimas.`,
  },
  "10:10-trigonometrija:gyvenimisko-turinio-uzdaviniai": {
    title: "Gyvenimiško turinio uždaviniai",
    body: `Mišrios 10 kl. trigonometrijos užduotys: sinusų ir kosinusų teoremos, plotas $\\frac12 ab\\sin C$, lygiagretainio savybės, kartais vienetinis apskritimas. Gyvenimiškas kontekstas.

Lengva: vienas aiškus žingsnis — rasti kraštinę, kampą arba plotą iš duotų duomenų; paprastas lygiagretainis arba trikampis.

Vidutinė: keli žingsniai — pvz. lygiagretainio įstrižainių skirtumas $10$ cm, kraštinių skirtumas $3$ cm, perimetras $58$ cm — rasti įstrižaines; viena įstrižainė $2\\sqrt{97}$, kraštinių skirtumas $10$, perimetras $44$ — kita įstrižainė; kraštinių santykis $5/8$, įstrižainės $36$ ir $3\\sqrt{34}$ — perimetras; bukas kampas iš $\\sin\\alpha$, tada kosinusų teorema; plotas + kraštinė + įstrižainė lygiagretainyje.

Sunki: kaip Vidutinė, bet didesni skaičiai ir šiek tiek ilgesnis tekstas (statybos, kelias, upė, žemėlapis, tentas — nepersudėtingas modelis); 3–4 žingsniai, bet vis dar 10 kl. lygis — be sudėtingos fizikos. Gali derinti plotą ir kosinusų teoremą vienoje situacijoje. Patikrink atsakymus.`,
  },
  "10:10-tikimybes-ir-kombinatorika:elementu-tvarka-svarbi": {
    title: "Elementų tvarka svarbi",
    body: `Gretiniai ir kėliniai, daugybos taisyklė.

Užduočių tipai: slaptažodis; kodo sudarymas iš raidžių ar skaitmenų; pirmos, antros, trečios vietos paskyrimas (tvarka svarbi); dažų parinkimas ornamentams — skirtingos arba gali kartotis (daugybos taisyklė); pamokų tvarkaraštis iš temų sąrašo; kodo ilgis 4, 5 arba 6 raidės — suma $A_n^4+A_n^5+A_n^6$; žodžių sudarymas iš raidžių (pvz. D, E, I, M, Š, T); žodžiai su pasikartojančiomis raidėmis; triženkliai ir keturženkliai skaičiai iš skaitmenų rinkinio — su ir be pasikartojimų; kai rinkinyje yra $0$ — pirmas skaitmuo $\\neq 0$.

Gali būti: surašyti visus elementus, rasti variantų skaičių, palyginti su ir be pasikartojimų. Patikrink atsakymus.`,
  },
  "10:10-tikimybes-ir-kombinatorika:elementu-tvarka-nesvarbi": {
    title: "Elementų tvarka nesvarbi",
    body: `Deriniai $C_n^k=\\frac{n!}{k!(n-k)!}$.

Užduočių tipai: išrinkti $k$ iš $n$ be tvarkos — bėgikų komanda (vienas privalomas), plaukikų komanda (du privalomi); mišri rinkinių parinkimas (balti ir geltoni teniso kamuoliukai — derinių sandauga); mokyklos parlamentas iš merginų ir berniukų (be apribojimų, tikslus santykis, privalomas asmuo); testo klausimų ir užduočių parinkimas iš skirtingų grupių; loterijos bilietų išrinkimas (tikslus arba bent $k$ laimingų); delegacija iš kelių kategorijų; rankų paspaudimai ($C_n^2$); skaitmenys didėjančia arba mažėjančia tvarka; trys skaičiai iš intervalo, kurių suma lyginė; keturženklis skaičius su tiksliai 2 lygiais ir 2 nelyginiais skaitmenimis be pasikartojimų; trikampiai iš taškų ant dviejų lygiagrečių linijų.

Gali būti: rasti $n$ iš duoto derinių skaičiaus. Patikrink atsakymus.`,
  },
  "10:10-tikimybes-ir-kombinatorika:tikimybe": {
    title: "Tikimybė",
    body: `Klasikinė tikimybė $P(A)=\\frac{m}{n}$ — palankių baigčių skaičius padalintas iš visų elementarių baigčių. Bandymo baigtis, elementarus įvykis, priešingas įvykis $\\bar{A}$: $P(\\bar{A})=1-P(A)$.

Užduočių tipai: pasirinkimas iš grupių (pvz. 4 braškių ir 6 vyšnių uogienės — tikimybė braškių); kamuoliukas iš maišo (raudoni/geltoni/balti); nustatyti dažniausią ar retą spalvą iš duotų tikimybių; loterija su keliais prizų lygiais; raidė iš žodžio MATEMATIKA; skaičius iš duoto rinkinio — lyginis, nelyginis, dalijasi iš 3, $>k$, pirminis; klasė (berniukai/merginos, domėjimas matematika); palyginti tikimybes iš skirtingų dėžių; rasti $n$ iš $P(A)$ ir žinomų skaičių; sekos $a_n$ narys dalijasi iš 3; kortelės 1, 3, 5, 8 — dvi ištrauktos, sudarytas dviženklis skaičius: surašyti baigtis, tikimybė lyginio, tikimybė pirminio.

Kombinatorika gali būti tarpinis žingsnis (baigčių skaičius), bet užduotis baigiasi tikimybe. Patikrink atsakymus.`,
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
  "10:topic:10-tikimybes-ir-kombinatorika": {
    title: "Tikimybės ir kombinatorika",
    body: `Bendros taisyklės (1 ir 2 potemės): atskirti, ar elementų tvarka svarbi.

Tvarka SVARBI (gretiniai, kėliniai): slaptažodis, saugos kodas, koncerto atlikėjų eilė, klasės prezidento, pavaduotojo ir organizatoriaus rinkimas, dviženklis skaičius iš kortelių (13 $\\neq$ 31), vektorius $\\vec{LK}$ $\\neq$ $\\vec{KL}$, vizitinių kortelių mainai.

Tvarka NESVARBI (deriniai): knygų sąrašas, seminaro dalyvių parinkimas, teniso mačų poros, rankų paspaudimai, atkarpa $LK=KL$, kortelių pora su lygine suma ({1,3} = {3,1}).

Užduotys gali prašyti: surašyti visus rinkinius su ir be tvarkos; sugalvoti situaciją, kur rinkimo tvarka svarbi ar nesvarbi; pagrįsti, kur atveju tvarka svarbi (a–h tipo sąrašai); taškai $L,K,N,P,R$ — atkarpas (be tvarkos) ir vektorius (su tvarka). Kombinatorikos užduotys — skaičiuoti variantus; tikimybės — $P(A)=m/n$.`,
  },
  "11:topic:11-vektoriai": {
    title: "Vektoriai",
    body: `Vektoriai koordinačių plokštumoje. VIENA užduotis = vienas tikslas; maks. 2 trumpi punktai. Jei reikia, aprašyk figūrą tekste (trikampis $ABC$, lygiagretainis $ABCD$). Žymėjimas: $\\vec{AB}$, $\\vec{a}$; koordinatės $(x;y)$.

Sąvokos: lygieji, priešingieji; kolinearūs; vienakrypčiai / priešpriešiniai. Trikampio, lygiagretainio taisyklės; $\\vec{AB}-\\vec{AC}=\\vec{CB}$. veiksmai su vektoriais ir jų koordinatėmis, skaliarinė sandauga. Kampą skaičiuok, kai vektoriai iš to paties taško.

Užduočių tipai (rinkis vieną):
1) Modulis / ilgis $|\\vec{a}|$.
2) Koordinatės vektoriaus iš taškų arba komponentės iš sąlygos. Veiksmai su koordinatėm.
3) Kollinearumas — nustatyti ar įrodyti (proporcingumas koordinačių).
4) Statmenumas — nustatyti ar įrodyti ($\\vec{a}\\cdot\\vec{b}=0$).
5) Kampas $\\varphi$ tarp vektorių (per skaliarinę sandaugą).
6) Skaliarinė sandauga — per koordinates arba per $|\\vec{a}|$, $|\\vec{b}|$, $\\cos\\varphi$ (duota $\\varphi$ arba $\\sin\\varphi$).
7) Veiksmai su vektoriais: sudėtis, atimtis, daugyba iš skaičiaus; supaprastinti reiškinį ($2\\vec{a}-3\\vec{b}+\\vec{c}$, $k\\vec{a}+m\\vec{b}$).
8) Išreiškimas figūroje: trikampis ar lygiagretainis — vektorius per įstrižaines, pusiaukraštines, vidurio linijas, lygiagrečias kraštines, tašką ant kraštinės ar susikirtimą; gali būti nežinomas parametras $k$ ($\\vec{AD}=k\\vec{BC}$).

Gali papildomai: ar vektoriai lygieji / priešingieji / vienakrypčiai (be skaičiavimo). Sudėtingumą reguliuok per skaičius (pvz. lengvas - sveikieji, vidutinis - racionalieji, sunkus - iracionalieji), žingsnių skaičiumi ir savo nuožiūra`,
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

function difficultyTierInstruction(difficulty: string, includeVidutineWithSunki = false): string {
  if (difficulty === "lengvos") {
    return "Sunkumas: generuok TIK „Lengva“ lygio užduotis (kitų skyrių nenaudok).";
  }
  if (difficulty === "vidutinės") {
    return "Sunkumas: generuok TIK „Vidutinė“ lygio užduotis.";
  }
  if (difficulty === "sunkios") {
    return includeVidutineWithSunki
      ? "Sunkumas: generuok TIK „Sunki“ lygio užduotis (potemėje įtraukta ir „Vidutinė“)."
      : "Sunkumas: generuok TIK „Sunki“ lygio užduotis.";
  }
  if (difficulty === "ivairus" || difficulty === "savarankiskas") {
    return "Sunkumas: 40% Lengva / 40 % Vidutinė / 20% Sunki)";
  }
  return "";
}

type TierLabel = "Lengva" | "Vidutinė" | "Sunki";

function parseTieredSubtopicBody(body: string): {
  intro: string;
  tiers: Partial<Record<TierLabel, string>>;
} {
  const tiers: Partial<Record<TierLabel, string>> = {};
  const matches: { label: TierLabel; start: number; headerEnd: number }[] = [];

  for (const m of body.matchAll(/(?:^|\n)(Lengva|Vidutinė|Sunki):\s*/g)) {
    matches.push({
      label: m[1] as TierLabel,
      start: m.index!,
      headerEnd: m.index! + m[0].length,
    });
  }

  if (matches.length === 0) {
    return { intro: body.trim(), tiers: {} };
  }

  const intro = body.slice(0, matches[0].start).trim();
  for (let i = 0; i < matches.length; i++) {
    const contentStart = matches[i].headerEnd;
    const contentEnd = i + 1 < matches.length ? matches[i + 1].start : body.length;
    tiers[matches[i].label] = body.slice(contentStart, contentEnd).trim();
  }
  return { intro, tiers };
}

/** Grąžina tik reikiamus sudėtingumo skyrius. */
export function formatSubtopicBodyForDifficulty(
  body: string,
  difficulty: string,
  options?: { includeVidutineWithSunki?: boolean },
): string {
  const { intro, tiers } = parseTieredSubtopicBody(body);
  if (Object.keys(tiers).length === 0) return body;

  if (difficulty === "ivairus" || difficulty === "savarankiskas") return body;

  const parts: string[] = [];
  if (intro) parts.push(intro);

  if (difficulty === "lengvos" && tiers.Lengva) {
    parts.push(`Lengva: ${tiers.Lengva}`);
  } else if (difficulty === "vidutinės" && tiers.Vidutinė) {
    parts.push(`Vidutinė: ${tiers.Vidutinė}`);
  } else if (difficulty === "sunkios") {
    if (options?.includeVidutineWithSunki && tiers.Vidutinė) {
      parts.push(`Vidutinė: ${tiers.Vidutinė}`);
    }
    if (tiers.Sunki) parts.push(`Sunki: ${tiers.Sunki}`);
  } else {
    return body;
  }

  return parts.join("\n\n");
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

  const includeVidutineWithSunkiForTopic = (topicSlug: string) => {
    const t = topicSlug.trim().toLowerCase();
    return (grade === 10 && t === "10-trigonometrija") || t === "11-funkcijos";
  };

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
      const body = formatSubtopicBodyForDifficulty(entry.body, difficulty, {
        includeVidutineWithSunki: includeVidutineWithSunkiForTopic(topicSlug),
      });
      parts.push(`POTEMĖ: ${entry.title}\n${body}`);
    }
  }

  const omitAnswers = topicOmitsAiAnswers(uniqueTopicSlugs);
  const deferredAnswers = topicUsesDeferredSolve(uniqueTopicSlugs);

  if (parts.length === 0) {
    return { text: "", guided: false, omitAnswers, deferredAnswers };
  }

  const includeVidutineWithSunki =
    uniqueTopicSlugs.some(includeVidutineWithSunkiForTopic) ||
    subtopicRefs.some((r) => includeVidutineWithSunkiForTopic(r.topicSlug));

  const tier = difficultyTierInstruction(difficulty, includeVidutineWithSunki);
  const antiCopy =
    "Neatkartok pavyzdinių sąlygų iš šio aprašo — kiekvieną kartą nauji skaičiai ir formulavimas.";
  return {
    text: [parts.join("\n\n"), tier, antiCopy].filter(Boolean).join("\n\n"),
    guided: true,
    omitAnswers,
    deferredAnswers,
  };
}
