import { useState } from "react";
import { GraduationCap, Loader2, Users } from "lucide-react";
import { setProfileRole } from "../lib/bankApi";

interface RolePickerModalProps {
  onComplete: () => void;
}

export function RolePickerModal({ onComplete }: RolePickerModalProps) {
  const [loading, setLoading] = useState<"teacher" | "student" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const choose = async (role: "teacher" | "student") => {
    setLoading(role);
    setError(null);
    try {
      await setProfileRole(role);
      onComplete();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Nepavyko išsaugoti.");
      setLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 sm:p-8 space-y-5">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-slate-800">Kaip naudositės programa?</h2>
          <p className="text-sm text-slate-500">
            Pasirinkite vaidmenį — vėliau galite naudoti generatorių abiem būdais, bet mokytojams bus papildoma grįžtamojo ryšio funkcija.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            disabled={!!loading}
            onClick={() => void choose("teacher")}
            className="flex flex-col items-center gap-2 p-5 rounded-xl border-2 border-slate-100 hover:border-indigo-300 hover:bg-indigo-50/50 transition disabled:opacity-60"
          >
            {loading === "teacher" ? (
              <Loader2 className="animate-spin text-indigo-600" size={28} />
            ) : (
              <GraduationCap size={28} className="text-indigo-600" />
            )}
            <span className="font-semibold text-slate-800">Mokytojas</span>
            <span className="text-xs text-slate-500 text-center">Galiu vertinti užduotis ir siųsti pastabas</span>
          </button>

          <button
            type="button"
            disabled={!!loading}
            onClick={() => void choose("student")}
            className="flex flex-col items-center gap-2 p-5 rounded-xl border-2 border-slate-100 hover:border-blue-300 hover:bg-blue-50/50 transition disabled:opacity-60"
          >
            {loading === "student" ? (
              <Loader2 className="animate-spin text-blue-600" size={28} />
            ) : (
              <Users size={28} className="text-blue-600" />
            )}
            <span className="font-semibold text-slate-800">Mokinys</span>
            <span className="text-xs text-slate-500 text-center">Generuoju užduotis savo mokymuisi</span>
          </button>
        </div>

        {error && <p className="text-sm text-red-600 text-center">{error}</p>}
      </div>
    </div>
  );
}
