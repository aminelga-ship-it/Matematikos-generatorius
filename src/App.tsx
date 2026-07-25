import React, { useState, useEffect, useCallback } from "react";
import { Calculator, AlertCircle, Sparkles } from "lucide-react";
import { GenerateForm } from "./components/GenerateForm";
import { TasksView } from "./components/TasksView";
import { HistoryPanel } from "./components/HistoryPanel";
import { generateTasks, saveSession, getRecentSessions, loadSession } from "./lib/api";
import type { Task, MathSession, Difficulty } from "./lib/types";
import { GeoGebraGraph } from './components/GeoGebraGraph';

export default function App() {
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
  const [currentGrade, setCurrentGrade] = useState(5);

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

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-200">
            <Calculator size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 leading-none">MatematikaAI</h1>
            <p className="text-xs text-slate-400 mt-0.5">Matematikos užduočių generatorius</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-full">
            <Sparkles size={13} className="text-blue-500" />
            <span className="text-xs font-medium text-blue-600">Lietuvos moksleiviams</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {tasks ? (
          <TasksView
            tasks={tasks}
            grade={currentGrade}
            taskCount={taskCount}
            showAnswers={showAnswers}
            showSolutions={showSolutions}
            onToggleAnswers={() => setShowAnswers((p) => !p)}
            onToggleSolutions={() => setShowSolutions((p) => !p)}
            onReset={handleReset}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-slate-800 leading-tight">
                  Generuok matematikos<br />
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
                onGradeChange={(v) => { setGrade(v); if (v < 7) setWithDiagram(false); if (v < 9) setWithGraph(false); }}
                onTaskCountChange={setTaskCount}
                onPromptChange={setPrompt}
                onDifficultyChange={setDifficulty}
                onImageChange={setImageBase64}
                onWithDiagramChange={setWithDiagram}
                onWithGraphChange={setWithGraph}
                onSubmit={handleGenerate}
              />
            </div>
            <div className="space-y-6">
              <HistoryPanel sessions={sessions} onSelect={handleSelectSession} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
