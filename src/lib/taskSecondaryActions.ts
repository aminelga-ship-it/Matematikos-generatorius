import type { BankDifficulty, Difficulty, Task } from "./types";

export interface TaskSecondaryActions {
  showReview: boolean;
  showGenerateAnswer: boolean;
  showGenerateSolutionAndAnswer: boolean;
}

function effectiveTaskDifficulty(
  task: Task,
  sessionDifficulty?: Difficulty,
): BankDifficulty {
  if (task.task_difficulty) return task.task_difficulty;
  if (sessionDifficulty === "lengvos" || sessionDifficulty === "sunkios") {
    return sessionDifficulty;
  }
  return "vidutinės";
}

function wantsSolutionButton(grade: number, diff: BankDifficulty): boolean {
  if (grade >= 9 && grade <= 10) return diff === "sunkios";
  if (grade >= 11 && grade <= 12) {
    return diff === "vidutinės" || diff === "sunkios";
  }
  return false;
}

export function getTaskSecondaryActions(
  task: Task,
  grade: number,
  sessionDifficulty?: Difficulty,
  options: { imageOnly?: boolean } = {},
): TaskSecondaryActions {
  const hasAnswer = (task.answer ?? "").trim().length > 0;
  const fromBank = task.from_approved_bank === true;

  if (grade <= 6) {
    return {
      showReview: false,
      showGenerateAnswer: false,
      showGenerateSolutionAndAnswer: false,
    };
  }

  if (options.imageOnly) {
    return {
      showReview: false,
      showGenerateAnswer: !hasAnswer,
      showGenerateSolutionAndAnswer: false,
    };
  }

  const diff = effectiveTaskDifficulty(task, sessionDifficulty);
  const wantsSolution = wantsSolutionButton(grade, diff);

  return {
    showReview: !fromBank,
    showGenerateAnswer: !hasAnswer && !wantsSolution,
    showGenerateSolutionAndAnswer: !hasAnswer && wantsSolution,
  };
}
