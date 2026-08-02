/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_SITE_URL?: string;
  /** true = svečias elgiamas kaip PRO (tik vystymui) */
  readonly VITE_DEV_GUEST_AS_PRO?: string;
  /** true = rodyti banko/AI santrauką po generavimo (staging) */
  readonly VITE_SHOW_GENERATION_META?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
