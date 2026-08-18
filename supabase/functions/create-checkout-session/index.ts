import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe@^14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

type PlanType = "PRO mėnesinis" | "PRO metinis" | "UNLIMITED mėnesinis" | "Limitų papildymas";

const PLAN_PRICE_MAP: Record<PlanType, string> = {
  "PRO mėnesinis": "PRICE_MONTHLY",
  "PRO metinis": "PRICE_YEARLY",
  "UNLIMITED mėnesinis": "PRICE_UNLIMITED_MONTHLY",
  "Limitų papildymas": "PRICE_EXTRA_COINS",
};

const SUBSCRIPTION_PLANS: PlanType[] = ["PRO mėnesinis", "UNLIMITED mėnesinis"];

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      return new Response(
        JSON.stringify({ error: "Stripe nesukonfigūruotas." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Neprisijungęs vartotojas." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

    const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        Authorization: authHeader,
        apikey: supabaseAnonKey,
      },
    });

    if (!userResponse.ok) {
      return new Response(
        JSON.stringify({ error: "Neprisijungęs vartotojas." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const user = await userResponse.json();
    if (!user?.id) {
      return new Response(
        JSON.stringify({ error: "Neprisijungęs vartotojas." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const plan = body?.plan as string;
    const returnOriginRaw = typeof body?.returnOrigin === "string" ? body.returnOrigin.trim() : "";
    const siteUrlFromEnv = (Deno.env.get("SITE_URL") ?? "").replace(/\/$/, "");
    const defaultSite = siteUrlFromEnv || "https://math-generator.bolt.host";

    let returnBase = defaultSite;
    if (returnOriginRaw) {
      try {
        const parsed = new URL(returnOriginRaw);
        if (parsed.protocol === "http:" || parsed.protocol === "https:") {
          returnBase = parsed.origin;
        }
      } catch {
        // ignore invalid origin
      }
    }

    if (!plan || !(plan in PLAN_PRICE_MAP)) {
      return new Response(
        JSON.stringify({ error: "Neteisingas planas. Galimi: „PRO mėnesinis“, „PRO metinis“, „UNLIMITED mėnesinis“, „Limitų papildymas“." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const typedPlan = plan as PlanType;
    const priceEnvVar = PLAN_PRICE_MAP[typedPlan];
    const priceId = Deno.env.get(priceEnvVar);

    if (!priceId) {
      return new Response(
        JSON.stringify({ error: `Kaina nesukonfigūruota (${priceEnvVar}).` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2024-06-20",
      httpClient: Stripe.createFetchHttpClient(),
    });

    const isSubscription = SUBSCRIPTION_PLANS.includes(typedPlan);
    const mode: "subscription" | "payment" = isSubscription ? "subscription" : "payment";

    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${returnBase}/?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${returnBase}/?view=pricing`,
      customer_email: user.email ?? undefined,
      client_reference_id: user.id,
      metadata: { user_id: user.id, plan: typedPlan },
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Checkout session error:", err);
    return new Response(
      JSON.stringify({ error: "Nepavyko sukurti mokėjimo sesijos." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
