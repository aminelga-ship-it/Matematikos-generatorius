import { Header } from './components/Header';
import { PageBackground } from './components/PageBackground';
import { useState, useEffect, useCallback } from "react";
import { AlertCircle } from "lucide-react";
import { GenerateForm } from "./components/GenerateForm";
import { TasksView } from "./components/TasksView";
import { HistoryPanel } from "./components/HistoryPanel";
import { PricingPage } from "./components/PricingPage";
import { GuidePage } from "./components/GuidePage";
import { AdminBankPage } from "./components/AdminBankPage";
import { RolePickerModal } from "./components/RolePickerModal";
import { generateTasks, saveSession, getRecentSessions, loadSession, solveTaskAnswer, ProLimitExhaustedError } from "./lib/api";
import { selectionSlugsUseGenerateAnswer, resolveTopicSlugsFromSelection } from "./lib/deferredAnswers";
import { updateTaskBankItem, createGeneratedTaskBankDraft } from "./lib/bankApi";
import type { Task, MathSession, Difficulty, GenerationMode, BankDifficulty } from "./lib/types";
import { usePlan, useUpgradeGate } from './lib/usePlan';
import { supabase } from "./lib/supabase";
import { useAuth } from "./hooks/useAuth";
import { showGenerationSourceHint } from "./lib/devFlags";

type View = 'app' | 'pricing' | 'guide' | 'admin';

function toBankDifficulty(d: Difficulty): BankDifficulty {
  if (d === "lengvos" || d === "sunkios") return d;
  return "vidutinės";
}

export default function App() {
  const [view, setView] = useState<View>('app');
  const [grade, setGrade] = useState(5);
  const [taskCount, setTaskCount] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("vidutinės");
  const [generationMode, setGenerationMode] = useState<GenerationMode>("text");
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [withDiagram, setWithDiagram] = useState(false);
  const [withGraph, setWithGraph] = useState(false);
  const [withSolution, setWithSolution] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [proLimitExhausted, setProLimitExhausted] = useState(false);
  const [generationMeta, setGenerationMeta] = useState<{ bankCount: number; aiCount: number } | null>(null);
  const [generateAnswerPilot, setGenerateAnswerPilot] = useState(false);
  const [activeTopicSlugs, setActiveTopicSlugs] = useState<string[]>([]);
  const [generatingAnswerIndex, setGeneratingAnswerIndex] = useState<number | null>(null);
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [showAnswers, setShowAnswers] = useState(false);
  const [showSolutions, setShowSolutions] = useState(false);
  const [sessions, setSessions] = useState<MathSession[]>([]);
  const [currentGrade, setCurrentGrade] = useState(7);

  const plan = usePlan();
  const { gate, modal } = useUpgradeGate();
  const { user, profile, refetchProfile } = useAuth();
  const [subtopicIds, setSubtopicIds] = useState<string[]>([]);
  const [topicIds, setTopicIds] = useState<string[]>([]);
  const [showRolePicker, setShowRolePicker] = useState(false);

  useEffect(() => {
    if (user && profile && profile.role == null) {
      setShowRolePicker(true);
    } else {
      setShowRolePicker(false);
    }
  }, [user, profile]);

  const goToPricing = useCallback(() => setView((v) => (v === 'pricing' ? 'app' : 'pricing')), []);
  const goToLimitTopUp = useCallback(() => {
    setView('pricing');
    window.setTimeout(() => {
      document.getElementById('limit-topup')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  }, []);
  const goToGuide = useCallback(() => setView((v) => (v === 'guide' ? 'app' : 'guide')), []);

  useEffect(() => {
    getRecentSessions().then(setSessions);
  }, []);

  useEffect(() => {
    if (generationMode === "topic") {
      setWithSolution(false);
      return;
    }
    if (grade < 7 || (difficulty !== "sunkios" && difficulty !== "ivairus")) {
      setWithSolution(false);
    }
  }, [difficulty, generationMode, grade]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("view") === "pricing") {
      setView("pricing");
    }

    const hasAuthCallback =
      params.has("code") ||
      window.location.hash.includes("access_token") ||
      params.has("error_description");

    if (!hasAuthCallback) return;

    void supabase.auth.getSession().finally(() => {
      window.history.replaceState({}, "", "/");
    });
  }, []);

  const generateAnswerMode =
    generateAnswerPilot || selectionSlugsUseGenerateAnswer(activeTopicSlugs);

  useEffect(() => {
    if (!tasks || generationMode !== "topic") return;
    if (topicIds.length === 0 && subtopicIds.length === 0) return;
    void resolveTopicSlugsFromSelection(topicIds, subtopicIds).then((slugs) => {
      setActiveTopicSlugs(slugs);
      if (selectionSlugsUseGenerateAnswer(slugs)) {
        setGenerateAnswerPilot(true);
      }
    });
  }, [tasks, generationMode, topicIds, subtopicIds]);

  const handleGenerate = useCallback(async () => {
    if (!user) {
      setError("Norėdami generuoti užduotis, prisijunkite.");
      return;
    }
    setLoading(true);
    setError(null);
    setProLimitExhausted(false);

    try {
      const effectiveWithDiagram = grade <= 6 ? withDiagram : false;
      const effectiveWithGraph = grade >= 9 ? withGraph : false;
      const { tasks: generated, meta } = await generateTasks(
        grade,
        taskCount,
        prompt,
        difficulty,
        imageBase64 ?? undefined,
        effectiveWithDiagram,
        effectiveWithGraph,
        withSolution,
        generationMode === "topic" ? subtopicIds : undefined,
        generationMode === "topic" ? topicIds : undefined,
        generationMode,
      );
      setTasks(generated);
      setGenerationMeta(
        meta && generationMode === "topic"
          ? { bankCount: meta.bankCount, aiCount: meta.aiCount }
          : null,
      );
      if (generationMode === "topic") {
        const slugs = await resolveTopicSlugsFromSelection(topicIds, subtopicIds);
        setActiveTopicSlugs(slugs);
        const pilot =
          meta?.deferredAnswers === true ||
          selectionSlugsUseGenerateAnswer(slugs) ||
          (grade === 10 && (topicIds.length > 0 || subtopicIds.length > 0));
        setGenerateAnswerPilot(pilot);
      } else {
        setActiveTopicSlugs([]);
        setGenerateAnswerPilot(false);
      }
      setCurrentGrade(grade);
      setShowAnswers(false);
      setShowSolutions(false);
      const sessionPrompt =
        generationMode === "topic"
          ? `Pagal temą (${subtopicIds.length} potemės, ${topicIds.length} temos)`
          : imageBase64 && prompt.trim().length < 3
            ? "Sukurk panašią užduotį (nuotrauka)"
            : prompt;
      const saved = await saveSession(
        grade,
        taskCount,
        sessionPrompt,
        difficulty,
        generated,
        imageBase64 ?? undefined,
        generationMode === "topic" ? topicIds : undefined,
        generationMode === "topic" ? subtopicIds : undefined,
      );
      if (saved) {
        setSessions((prev) => [saved, ...prev].slice(0, 10));
      }
    } catch (err) {
      if (err instanceof ProLimitExhaustedError) {
        setProLimitExhausted(true);
        setError(err.message);
      } else {
        setProLimitExhausted(false);
        setError(err instanceof Error ? err.message : "Įvyko nežinoma klaida.");
      }
    } finally {
      setLoading(false);
    }
  }, [user, grade, taskCount, prompt, difficulty, generationMode, imageBase64, withDiagram, withGraph, withSolution, subtopicIds, topicIds]);

  const handleSelectSession = useCallback(async (id: string) => {
    const session = await loadSession(id);
    if (!session) return;
    setGrade(session.grade);
    setTaskCount(session.task_count);
    setPrompt(session.prompt);
    if (session.difficulty === "savarankiskas" || session.prompt.startsWith("Pagal temą")) {
      setGenerationMode("topic");
      setDifficulty(
        session.difficulty === "ivairus" ? "vidutinės" : (session.difficulty ?? "vidutinės"),
      );
    } else {
      setGenerationMode("text");
      if (
        session.difficulty === "ivairus" ||
        session.difficulty === "lengvos" ||
        session.difficulty === "vidutinės" ||
        session.difficulty === "sunkios"
      ) {
        setDifficulty(session.difficulty);
      }
    }
    setImageBase64(session.image_data ?? null);
    setTasks(session.tasks);
    setTopicIds(session.topic_ids ?? []);
    setSubtopicIds(session.subtopic_ids ?? []);
    setCurrentGrade(session.grade);
    const sessionSlugs = await resolveTopicSlugsFromSelection(
      session.topic_ids ?? [],
      session.subtopic_ids ?? [],
    );
    setActiveTopicSlugs(sessionSlugs);
    setGenerateAnswerPilot(
      selectionSlugsUseGenerateAnswer(sessionSlugs) ||
        (session.grade === 10 &&
          ((session.topic_ids?.length ?? 0) > 0 || (session.subtopic_ids?.length ?? 0) > 0)),
    );
    setShowAnswers(false);
    setShowSolutions(false);
  }, []);

  const handleReset = useCallback(() => {
    setTasks(null);
    setGenerationMeta(null);
    setGenerateAnswerPilot(false);
    setActiveTopicSlugs([]);
    setGeneratingAnswerIndex(null);
    setError(null);
    setSubtopicIds([]);
    setTopicIds([]);
  }, []);

  const handleGenerateAnswer = useCallback(async (index: number, question: string) => {
    const trimmed = question.trim();
    if (!trimmed) {
      setError("Užduoties tekstas tuščias — negalima generuoti atsakymo.");
      return;
    }
    setGeneratingAnswerIndex(index);
    setError(null);
    try {
      const answer = await solveTaskAnswer(currentGrade, trimmed);
      setTasks((prev) => {
        if (!prev) return prev;
        const next = [...prev];
        const t = next[index];
        if (t) next[index] = { ...t, answer: answer.trim() };
        return next;
      });
      void refetchProfile();
    } catch (err) {
      if (err instanceof ProLimitExhaustedError) {
        setProLimitExhausted(true);
        setError(err.message);
      } else {
        setProLimitExhausted(false);
        setError(err instanceof Error ? err.message : "Nepavyko generuoti atsakymo.");
      }
    } finally {
      setGeneratingAnswerIndex(null);
    }
  }, [currentGrade, refetchProfile]);

  const handleBankFeedback = useCallback((index: number, result: "approved" | "draft" | "deleted") => {
    if (result === "deleted") {
      setTasks((prev) => {
        if (!prev) return prev;
        const next = [...prev];
        const t = next[index];
        if (t) next[index] = { ...t, bank_item_id: undefined };
        return next;
      });
    }
  }, []);

  const handleBankItemLinked = useCallback((index: number, bankItemId: string) => {
    setTasks((prev) => {
      if (!prev) return prev;
      const next = [...prev];
      const t = next[index];
      if (t) next[index] = { ...t, bank_item_id: bankItemId };
      return next;
    });
  }, []);

  const handleEditTask = useCallback((index: number, updated: Task) => {
    const persist = async () => {
      let bankId = updated.bank_item_id;
      const isStaff = profile?.role === "teacher" || profile?.role === "admin";
      if (!bankId && isStaff) {
        try {
          bankId = await createGeneratedTaskBankDraft({
            grade: currentGrade,
            difficulty: toBankDifficulty(difficulty),
            task: updated,
          });
          updated = { ...updated, bank_item_id: bankId };
        } catch (e) {
          console.error("Bank draft create:", e);
        }
      }
      setTasks((prev) => {
        if (!prev) return prev;
        const next = [...prev];
        next[index] = updated;
        return next;
      });
      if (bankId) {
        const isAdmin = profile?.role === "admin";
        void updateTaskBankItem(bankId, {
          question: updated.question,
          answer: updated.answer,
          solution: updated.solution,
          function_equation: updated.function_equation ?? null,
          diagram_config: updated.diagram_config ?? null,
          source: isAdmin ? "manual" : "user_corrected",
        }).catch((e) => console.error("Bank update:", e));
      }
    };
    void persist();
  }, [profile?.role, currentGrade, difficulty]);

  const handleLockedAction = useCallback((featureName: string) => {
    gate(false, featureName);
  }, [gate]);

  const isAdmin = profile?.role === "admin";
  const showTeacherFeedback = profile?.role === "teacher" || isAdmin;

  return (
    <div className="min-h-screen flex flex-col relative">
      <PageBackground />
      <Header
        onOpenPricing={goToPricing}
        pricingOpen={view === 'pricing'}
        onOpenGuide={goToGuide}
        guideOpen={view === 'guide'}
        onOpenAdmin={isAdmin ? () => setView((v) => (v === 'admin' ? 'app' : 'admin')) : undefined}
        adminOpen={view === 'admin'}
      />

      <main className={`mx-auto px-4 sm:px-6 py-8 flex-1 w-full ${
        view === 'pricing' ? 'max-w-6xl' : view === 'admin' ? 'max-w-5xl' : view === 'guide' ? 'max-w-3xl' : 'max-w-4xl'
      }`}>
        {view === 'admin' && isAdmin ? (
          <AdminBankPage onBack={() => setView('app')} />
        ) : view === 'pricing' ? (
          <PricingPage />
        ) : view === 'guide' ? (
          <GuidePage isAdmin={isAdmin} />
        ) : tasks ? (
          <TasksView
            tasks={tasks}
            grade={currentGrade}
            taskCount={taskCount}
            showAnswers={showAnswers}
            showSolutions={showSolutions}
            canEdit={plan.canEditTasks || isAdmin}
            canExport={plan.canExport}
            canPrint={plan.canPrint}
            onToggleAnswers={() => setShowAnswers((p) => !p)}
            onToggleSolutions={() => setShowSolutions((p) => !p)}
            onReset={handleReset}
            onEditTask={handleEditTask}
            onLockedAction={handleLockedAction}
            showTeacherFeedback={showTeacherFeedback}
            sessionDifficulty={difficulty}
            topicIds={generationMode === "topic" ? topicIds : undefined}
            subtopicIds={generationMode === "topic" ? subtopicIds : undefined}
            sourceHint={
              generateAnswerMode
                ? "Atsakymą generuokite mygtuku „Generuoti atsakymą“ po kiekviena užduotimi (1 generavimo užduotis)."
                : showGenerationSourceHint() && generationMeta
                  ? `${generationMeta.bankCount} užduotys iš patvirtinto banko, ${generationMeta.aiCount} sugeneruota AI`
                  : undefined
            }
            generateAnswerMode={generateAnswerMode}
            generatingAnswerIndex={generatingAnswerIndex}
            onGenerateAnswer={handleGenerateAnswer}
            onBankFeedback={handleBankFeedback}
            onBankItemLinked={handleBankItemLinked}
            error={error}
            proLimitExhausted={proLimitExhausted}
            onLimitTopUp={goToLimitTopUp}
          />
        ) : (
          <div className="flex flex-col gap-10">
            <div className="w-full max-w-3xl mx-auto space-y-5">
              <div className="space-y-2 text-center">
                <h2 className="text-3xl font-bold text-slate-800 leading-tight">
                  Generuok matematikos <br />
                  <span className="text-blue-600">užduotis akimirksniu</span>
                </h2>
                <p className="text-slate-500 text-base max-w-2xl mx-auto">
                  Pasirinkite klasę, sudėtingumo lygį, užduočių kiekį ir generavimo būdą
                </p>
              </div>

              {error && (
                <div className="flex items-start gap-3 px-4 py-3.5 bg-red-50 rounded-xl border border-red-100">
                  <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">
                    {proLimitExhausted ? (
                      <>
                        Atsiprašome, jūsų limitas išnaudotas.{" "}
                        <button
                          type="button"
                          onClick={goToLimitTopUp}
                          className="font-semibold text-amber-800 underline hover:text-amber-900"
                        >
                          Papildykite limitus
                        </button>
                        .
                      </>
                    ) : (
                      error
                    )}
                  </p>
                </div>
              )}

              <GenerateForm
                grade={grade}
                taskCount={taskCount}
                prompt={prompt}
                difficulty={difficulty}
                generationMode={generationMode}
                imagePreview={imageBase64}
                withDiagram={withDiagram}
                withGraph={withGraph}
                withSolution={withSolution}
                loading={loading}
                canUploadImage={plan.canUploadImage}
                maxTasksPerGeneration={plan.maxTasksPerGeneration}
                onGradeChange={(v) => {
                  setGrade(v);
                  setSubtopicIds([]);
                  setTopicIds([]);
                  setActiveTopicSlugs([]);
                  if (v > 6) setWithDiagram(false);
                  if (v < 9) setWithGraph(false);
                }}
                onTaskCountChange={setTaskCount}
                onPromptChange={setPrompt}
                onDifficultyChange={(v) => {
                  setDifficulty(v);
                }}
                onGenerationModeChange={(v) => {
                  setGenerationMode(v);
                  if (v === "topic") {
                    setWithSolution(false);
                    if (difficulty === "savarankiskas") setDifficulty("ivairus");
                  } else if (difficulty === "savarankiskas") {
                    setDifficulty("ivairus");
                  }
                }}
                onImageChange={setImageBase64}
                onWithDiagramChange={setWithDiagram}
                onWithGraphChange={setWithGraph}
                onWithSolutionChange={setWithSolution}
                onSubmit={handleGenerate}
                onLockedAction={handleLockedAction}
                selectedSubtopicIds={subtopicIds}
                onSubtopicIdsChange={setSubtopicIds}
                selectedTopicIds={topicIds}
                onTopicIdsChange={setTopicIds}
                onTopicSlugsChange={setActiveTopicSlugs}
              />
            </div>

            <div className="w-full max-w-3xl mx-auto">
              <HistoryPanel
                sessions={sessions}
                onSelect={handleSelectSession}
              />
            </div>
          </div>
        )}
      </main>

      {modal(goToPricing)}
      {showRolePicker && (
        <RolePickerModal onComplete={() => void refetchProfile()} />
      )}
    </div>
  );
}
