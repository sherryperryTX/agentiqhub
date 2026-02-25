import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, { apiVersion: "2024-04-10" });
}

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function POST(req: Request) {
  const stripe = getStripe();
  const supabaseAdmin = getSupabaseAdmin();
  if (!stripe || !supabaseAdmin) {
    return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  }

  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const courseId = session.metadata?.courseId ? parseInt(session.metadata.courseId) : 1;

    if (userId) {
      // Grant course access
      const { error: accessError } = await supabaseAdmin
        .from("user_courses")
        .upsert(
          {
            user_id: userId,
            course_id: courseId,
            access_type: "purchased",
            stripe_session_id: session.id,
          },
          { onConflict: "user_id,course_id" }
        );

      if (accessError) console.error("Error granting course access:", accessError);
      else console.log(`User ${userId} purchased course ${courseId}`);

      // Backward compat: also update profiles.tier for AI Mastery (course 1)
      if (courseId === 1) {
        await supabaseAdmin
          .from("profiles")
          .update({ tier: "premium", stripe_customer_id: session.customer as string })
          .eq("id", userId);
      }
    }
  }

  return NextResponse.json({ received: true });
}
