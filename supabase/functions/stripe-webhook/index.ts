import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe@^14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

type PlanType = "PRO mėnesinis" | "PRO metinis" | "UNLIMITED mėnesinis" | "Limitų papildymas";

const PRO_SCHOOL_YEAR_END = "2027-06-30";

/** Papildomo limitų paketo (6,99 €) kreditai — turi sutapti su planLimits.ts */
const EXTRA_LIMITS_PACKAGE = {
  bonusRequests: 50,
  bonusTasks: 150,
  bonusSecondary: 40,
} as const;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, stripe-signature",
};

function planToProfilePlan(plan: PlanType): "pro" | "unlimited" | null {
  if (plan === "UNLIMITED mėnesinis") return "unlimited";
  if (plan === "PRO mėnesinis" || plan === "PRO metinis") return "pro";
  return null;
}

async function orderAlreadyProcessed(
  supabaseAdmin: ReturnType<typeof createClient>,
  sessionId: string,
): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from("stripe_orders")
    .select("id")
    .eq("stripe_session_id", sessionId)
    .maybeSingle();
  return !!data;
}

async function handleCheckoutCompleted(
  supabaseAdmin: ReturnType<typeof createClient>,
  session: Stripe.Checkout.Session,
): Promise<void> {
  const sessionId = session.id;
  if (!sessionId) return;

  if (await orderAlreadyProcessed(supabaseAdmin, sessionId)) {
    return;
  }

  const userId = session.client_reference_id ?? session.metadata?.user_id;
  const plan = session.metadata?.plan as PlanType | undefined;

  if (!userId || !plan) {
    console.error("Checkout be user_id arba plan:", sessionId);
    return;
  }

  const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id ?? null;
  const subscriptionId =
    typeof session.subscription === "string" ? session.subscription : session.subscription?.id ?? null;
  const paymentIntentId =
    typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id ?? null;

  await supabaseAdmin.from("stripe_orders").insert({
    user_id: userId,
    stripe_session_id: sessionId,
    stripe_payment_intent_id: paymentIntentId,
    stripe_subscription_id: subscriptionId,
    stripe_customer_id: customerId,
    plan,
    amount_total: session.amount_total ?? null,
    currency: session.currency ?? null,
    status: "completed",
  });

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("bonus_requests, bonus_tasks, bonus_secondary, plan_expires_at")
    .eq("id", userId)
    .maybeSingle();

  if (plan === "Limitų papildymas") {
    await supabaseAdmin
      .from("profiles")
      .update({
        bonus_requests: (profile?.bonus_requests ?? 0) + EXTRA_LIMITS_PACKAGE.bonusRequests,
        bonus_tasks: (profile?.bonus_tasks ?? 0) + EXTRA_LIMITS_PACKAGE.bonusTasks,
        bonus_secondary: (profile?.bonus_secondary ?? 0) + EXTRA_LIMITS_PACKAGE.bonusSecondary,
        stripe_customer_id: customerId ?? undefined,
      })
      .eq("id", userId);
    return;
  }

  const profilePlan = planToProfilePlan(plan);
  if (!profilePlan) return;

  const update: Record<string, unknown> = {
    plan: profilePlan,
    stripe_customer_id: customerId,
    stripe_subscription_id: subscriptionId,
  };

  if (plan === "PRO metinis") {
    update.plan_expires_at = PRO_SCHOOL_YEAR_END;
  } else if (plan === "PRO mėnesinis" || plan === "UNLIMITED mėnesinis") {
    update.plan_expires_at = null;
  }

  await supabaseAdmin.from("profiles").update(update).eq("id", userId);
}

async function handleSubscriptionDeleted(
  supabaseAdmin: ReturnType<typeof createClient>,
  subscription: Stripe.Subscription,
): Promise<void> {
  const customerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer?.id;
  if (!customerId) return;

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("id, plan_expires_at, stripe_subscription_id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();

  if (!profile) return;

  if (profile.stripe_subscription_id && profile.stripe_subscription_id !== subscription.id) {
    return;
  }

  const expiresAt = profile.plan_expires_at;
  const stillValidByDate = expiresAt && expiresAt >= new Date().toISOString().slice(0, 10);

  if (stillValidByDate) {
    await supabaseAdmin
      .from("profiles")
      .update({ stripe_subscription_id: null })
      .eq("id", profile.id);
    return;
  }

  await supabaseAdmin
    .from("profiles")
    .update({
      plan: "free",
      stripe_subscription_id: null,
    })
    .eq("id", profile.id);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

  if (!stripeKey || !webhookSecret) {
    console.error("Trūksta STRIPE_SECRET_KEY arba STRIPE_WEBHOOK_SECRET");
    return new Response(JSON.stringify({ error: "Stripe webhook nesukonfigūruotas." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const stripe = new Stripe(stripeKey, {
    apiVersion: "2024-06-20",
    httpClient: Stripe.createFetchHttpClient(),
  });

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response(JSON.stringify({ error: "Missing stripe-signature" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const body = await req.text();
  let event: Stripe.Event;

  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new Response(JSON.stringify({ error: "Invalid signature" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(supabaseAdmin, event.data.object as Stripe.Checkout.Session);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(supabaseAdmin, event.data.object as Stripe.Subscription);
        break;
      default:
        break;
    }
  } catch (err) {
    console.error("Webhook handler error:", event.type, err);
    return new Response(JSON.stringify({ error: "Handler failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
