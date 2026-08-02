import { supabase } from "./supabase";
import { DEFAULT_GENERATION_GUIDE, GENERATION_GUIDE_KEY, sanitizeGuideContent } from "./guideContentDefaults";
import type { GenerationGuideContent } from "./guideTypes";

function isGuideContent(v: unknown): v is GenerationGuideContent {
  if (!v || typeof v !== "object") return false;
  const o = v as GenerationGuideContent;
  return typeof o.pageTitle === "string" && Array.isArray(o.sections);
}

export async function fetchGenerationGuide(): Promise<GenerationGuideContent> {
  const { data, error } = await supabase
    .from("app_content")
    .select("value")
    .eq("key", GENERATION_GUIDE_KEY)
    .maybeSingle();

  if (error) {
    console.error("fetchGenerationGuide:", error);
    return DEFAULT_GENERATION_GUIDE;
  }

  if (data?.value && isGuideContent(data.value)) {
    return sanitizeGuideContent(data.value);
  }

  return sanitizeGuideContent(DEFAULT_GENERATION_GUIDE);
}

export async function saveGenerationGuide(content: GenerationGuideContent): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Reikia prisijungti.");

  const { error } = await supabase.from("app_content").upsert(
    {
      key: GENERATION_GUIDE_KEY,
      value: content,
      updated_at: new Date().toISOString(),
      updated_by: user.id,
    },
    { onConflict: "key" },
  );

  if (error) throw new Error(error.message);
}
