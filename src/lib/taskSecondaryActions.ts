import type { Task } from "./types";

export interface TaskSecondaryActions {
  showReview: boolean;
  showGenerateAnswer: boolean;
}

export function getTaskSecondaryActions(
  task: Task,
  grade: number,
  options: { imageOnly?: boolean } = {},
): TaskSecondaryActions {
  const hasAnswer = (task.answer ?? "").trim().length > 0;
  const fromBank = task.from_approved_bank === true;

  if (grade <= 6) {
    return {
      showReview: false,
      showGenerateAnswer: false,
    };
  }

  if (options.imageOnly) {
    return {
      showReview: false,
      showGenerateAnswer: !hasAnswer,
    };
  }

  return {
    showReview: !fromBank,
    showGenerateAnswer: !hasAnswer,
  };
}
