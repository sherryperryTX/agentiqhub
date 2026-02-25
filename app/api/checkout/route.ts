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
  try {
    const stripe = getStripe();
    const supabaseAdmin = getSupabaseAdmin();
    if (!stripe) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
    }

    const { userId, userEmail, courseId, courseSlug } = await req.json();

    // Look up the course's Stripe price ID
    let stripePriceId = process.env.STRIPE_PRICE_ID!; // default fallback
    let successSlug = "ai-mastery";

    if (courseId && supabaseAdmin) {
      const { data: course } = await supabaseAdmin
        .from("courses")
        .select("stripe_price_id, slug")
        .eq("id", courseId)
        .single();

      if (course?.stripe_price_id) {
        stripePriceId = course.stripe_price_id;
      }
      if (course?.slug) {
        successSlug = course.slug;
      }
    } else if (courseSlug) {
      successSlug = courseSlug;
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price: stripePriceId, quantity: 1 }],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/courses/${successSlug}/learn?purchased=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/courses/${successSlug}?cancelled=true`,
      customer_email: userEmail,
      metadata: { userId, courseId: String(courseId || 1) },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
