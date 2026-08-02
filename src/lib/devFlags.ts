/** Vystymo režimas: neprisijungęs vartotojas turi visas PRO funkcijas. Produkcijoje: false arba pašalink. */
export function isDevGuestAsPro(): boolean {
  return import.meta.env.VITE_DEV_GUEST_AS_PRO === "true";
}

/** Banko/AI santrauka TasksView — tik dev arba VITE_SHOW_GENERATION_META */
export function showGenerationSourceHint(): boolean {
  return import.meta.env.DEV || import.meta.env.VITE_SHOW_GENERATION_META === "true";
}
