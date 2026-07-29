import { Header } from './components/Header';
import { useState, useEffect, useCallback } from "react";
import { AlertCircle } from "lucide-react";
import { GenerateForm } from "./components/GenerateForm";
import { TasksView } from "./components/TasksView";
import { HistoryPanel } from "./components/HistoryPanel";
import { PricingPage } from "./components/PricingPage";
import { generateTasks, saveSession, getRecentSessions, loadSession } from "./lib/api";
import type { Task, MathSession, Difficulty } from "./lib/types";
import { SAVARANKISKAS_MIN_TASKS } from "./lib/types";
import { usePlan, useUpgradeGate } from './lib/usePlan';

type View = 'app' | 'pricing';

export default function App() {
  const [view, setView] = useState<View>('app');
  const [grade, setGrade] = useState(5);
  const [taskCount, setTaskCount] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("vidutinės");
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [withDiagram, setWithDiagram] = useState(false);
  const [withGraph, setWithGraph] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [showAnswers, setShowAnswers] = useState(false);
  const [showSolutions, setShowSolutions] = useState(false);
  const [sessions, setSessions] = useState<MathSession[]>([]);
  const [currentGrade, setCurrentGrade] = useState(7);

  const plan = usePlan();
  const { gate, modal } = useUpgradeGate();

  const goToPricing = useCallback(() => setView('pricing'), []);

  useEffect(() => {
    getRecentSessions().then(setSessions);
  }, []);

  const handleGenerate = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const effectiveWithDiagram = grade >= 7 ? withDiagram : false;
      const effectiveWithGraph = grade >= 9 ? withGraph : false;
      const generated = await generateTasks(
        grade,
        taskCount,
        prompt,
        difficulty,
        imageBase64 ?? undefined,
        effectiveWithDiagram,
        effectiveWithGraph
      );
      setTasks(generated);
      setCurrentGrade(grade);
      setShowAnswers(false);
      setShowSolutions(false);
      const saved = await saveSession(grade, taskCount, prompt, difficulty, generated, imageBase64 ?? undefined);
      if (saved) {
        setSessions((prev) => [saved, ...prev].slice(0, 10));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Įvyko nežinoma klaida.");
    } finally {
      setLoading(false);
    }
  }, [grade, taskCount, prompt, difficulty, imageBase64, withDiagram, withGraph]);

  const handleSelectSession = useCallback(async (id: string) => {
    const session = await loadSession(id);
    if (!session) return;
    setGrade(session.grade);
    setTaskCount(session.task_count);
    setPrompt(session.prompt);
    setDifficulty(session.difficulty ?? "vidutinės");
    setImageBase64(session.image_data ?? null);
    setTasks(session.tasks);
    setCurrentGrade(session.grade);
    setShowAnswers(false);
    setShowSolutions(false);
  }, []);

  const handleReset = useCallback(() => {
    setTasks(null);
    setError(null);
  }, []);

  const handleEditTask = useCallback((index: number, updated: Task) => {
    setTasks((prev) => {
      if (!prev) return prev;
      const next = [...prev];
      next[index] = updated;
      return next;
    });
  }, []);

  const handleLockedAction = useCallback((featureName: string) => {
    gate(false, featureName);
  }, [gate]);

  if (view === 'pricing') {
    return <PricingPage onBack={() => setView('app')} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header onOpenPricing={goToPricing} />

      <main className="max-w-5xl mx-auto px-6 py-10 flex-1 w-full">
        {tasks ? (
          <TasksView
            tasks={tasks}
            grade={currentGrade}
            taskCount={taskCount}
            showAnswers={showAnswers}
            showSolutions={showSolutions}
            canEdit={plan.canEditTasks}
            canExport={plan.canExport}
            canPrint={plan.canPrint}
            onToggleAnswers={() => setShowAnswers((p) => !p)}
            onToggleSolutions={() => setShowSolutions((p) => !p)}
            onReset={handleReset}
            onEditTask={handleEditTask}
            onLockedAction={handleLockedAction}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-slate-800 leading-tight">
                  Generuok matematikos <br />
                  <span className="text-blue-600">užduotis akimirksniu</span>
                </h2>
                <p className="text-slate-500 text-base">
                  Pasirink klasę, sunkumą ir aprašyk, ko nori — AI sukurs užduotis pagal Lietuvos mokymo programą.
                </p>
              </div>

              {error && (
                <div className="flex items-start gap-3 px-4 py-3.5 bg-red-50 rounded-xl border border-red-100">
                  <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <GenerateForm
                grade={grade}
                taskCount={taskCount}
                prompt={prompt}
                difficulty={difficulty}
                imagePreview={imageBase64}
                withDiagram={withDiagram}
                withGraph={withGraph}
                loading={loading}
                canUploadImage={plan.canUploadImage}
                canSavarankiskas={plan.isPro}
                maxTasksPerGeneration={plan.maxTasksPerGeneration}
                onGradeChange={(v) => {
                  setGrade(v);
                  if (v < 7) setWithDiagram(false);
                  if (v < 9) setWithGraph(false);
                }}
                onTaskCountChange={setTaskCount}
                onPromptChange={setPrompt}
                onDifficultyChange={(v) => {
                  setDifficulty(v);
                  if (v === "savarankiskas" && taskCount < SAVARANKISKAS_MIN_TASKS) {
                    setTaskCount(SAVARANKISKAS_MIN_TASKS);
                  }
                }}
                onImageChange={setImageBase64}
                onWithDiagramChange={setWithDiagram}
                onWithGraphChange={setWithGraph}
                onSubmit={handleGenerate}
                onLockedAction={handleLockedAction}
              />
            </div>

            {/* Dešinė pusė: istorija */}
            <div>
              <HistoryPanel
                sessions={sessions}
                onSelect={handleSelectSession}
              />
            </div>
          </div>
        )}
      </main>

      {modal(goToPricing)}
    </div>
  );
}
