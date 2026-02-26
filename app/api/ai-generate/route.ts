import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

async function verifyAdmin(authHeader: string | null): Promise<boolean> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return false;
  if (!authHeader?.startsWith("Bearer ")) return false;
  const token = authHeader.replace("Bearer ", "");

  const supabaseUser = createClient(url, key, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const { data: { user } } = await supabaseUser.auth.getUser(token);
  if (!user) return false;
  const { data: profile } = await supabaseUser
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  return profile?.is_admin === true;
}

export async function POST(req: Request) {
  try {
    // Verify admin
    const isAdmin = await verifyAdmin(req.headers.get("authorization"));
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action, context } = await req.json();

    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
    if (!ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: "Anthropic API key not configured" }, { status: 500 });
    }

    let systemPrompt = `You are an AI course content assistant for AgentIQ Hub, an AI mastery course for real estate agents.
You help create professional, engaging training content that teaches realtors how to use AI in their business.

The course has 5 sections:
- Section I: AI Foundations (free tier)
- Section II: Essential AI Tools (free tier)
- Section III: Real Estate AI Workflows (premium tier)
- Section IV: Advanced AI Strategies (premium tier)
- Section V: Certification (premium tier)

Each module has 3 lessons and 5 quiz questions. Lessons should be practical, actionable, and include specific AI prompts realtors can use.

IMPORTANT: Always respond with valid JSON when generating structured content.`;

    let userPrompt = "";

    switch (action) {
      case "generate_module":
        userPrompt = `Create a complete new training module about: "${context.topic}"

Section: ${context.section || "Not specified"}
Tier: ${context.tier || "premium"}

Generate a JSON object with this exact structure:
{
  "title": "Module title",
  "section": "Section name",
  "description": "1-2 sentence module description",
  "tier": "${context.tier || 'premium'}",
  "lessons": [
    {
      "title": "Lesson 1 title",
      "content": "Full lesson content with **bold** formatting, specific AI prompts, and practical examples. At least 3 paragraphs."
    },
    {
      "title": "Lesson 2 title",
      "content": "Full lesson content..."
    },
    {
      "title": "Lesson 3 title",
      "content": "Full lesson content..."
    }
  ],
  "quiz": [
    {
      "question": "Question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0
    }
  ]
}

Generate exactly 3 lessons and 5 quiz questions. Make content practical and real estate specific.`;
        break;

      case "generate_lesson":
        userPrompt = `Create a single lesson for the module "${context.moduleName}" about: "${context.topic}"

Generate a JSON object:
{
  "title": "Lesson title",
  "content": "Full lesson content with **bold** formatting. Include specific AI prompts realtors can copy and use. At least 4 paragraphs with practical, actionable advice."
}`;
        break;

      case "generate_quiz":
        userPrompt = `Create quiz questions for the module "${context.moduleName}" covering: "${context.topic}"

Generate a JSON object:
{
  "questions": [
    {
      "question": "Question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0
    }
  ]
}

Generate exactly ${context.count || 5} questions. Make them practical — test understanding, not memorization.`;
        break;

      case "generate_video_script":
        userPrompt = `Create a video script for the lesson "${context.lessonTitle}" in module "${context.moduleName}".

The lesson content is:
${context.lessonContent?.substring(0, 2000) || "Not provided"}

Generate a JSON object:
{
  "title": "Video title",
  "duration": "Estimated duration (e.g. '5-7 minutes')",
  "script": "Full video script with [VISUAL] cues for screen recordings or slides. Include intro, main content sections, and outro. Write in a conversational, instructor tone."
}`;
        break;

      case "improve_content":
        userPrompt = `Improve this existing lesson content. Make it more engaging, practical, and add more specific AI prompts that realtors can use.

Current content:
${context.content}

${context.instructions ? `Additional instructions: ${context.instructions}` : ""}

Generate a JSON object:
{
  "title": "${context.title || 'Improved lesson'}",
  "content": "The improved full lesson content with **bold** formatting and practical AI prompts."
}`;
        break;

      case "generate_from_document":
        userPrompt = `You are creating training content for a real estate AI mastery course. A document has been provided. Your job is to transform this document into a structured training module with lessons and quizzes.

DOCUMENT CONTENT:
---
${context.documentContent?.substring(0, 8000) || "No content provided"}
---

${context.instructions ? `ADDITIONAL INSTRUCTIONS: ${context.instructions}` : ""}
${context.moduleName ? `MODULE NAME: ${context.moduleName}` : ""}

Create a complete training module based on this document. Organize the content into clear, digestible lessons that teach realtors practical skills. Add AI prompts they can copy and use.

Generate a JSON object with this exact structure:
{
  "title": "${context.moduleName || 'Module title based on the document'}",
  "section": "${context.section || 'Custom Training'}",
  "description": "1-2 sentence module description",
  "tier": "${context.tier || 'premium'}",
  "lessons": [
    {
      "title": "Lesson 1 title",
      "content": "Full lesson content with **bold** formatting. Incorporate key information from the document. Add practical AI prompts realtors can use. At least 3 substantial paragraphs."
    },
    {
      "title": "Lesson 2 title",
      "content": "Full lesson content..."
    },
    {
      "title": "Lesson 3 title",
      "content": "Full lesson content..."
    }
  ],
  "quiz": [
    {
      "question": "Question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0
    }
  ]
}

Generate exactly 3 lessons and 5 quiz questions. Make the content practical, engaging, and focused on real estate applications.`;
        break;

      case "chat":
        userPrompt = context.message;
        systemPrompt += `\n\nYou are having an interactive planning conversation with the course administrator (Sherry). Your role is to be a proactive course design partner — not just answer questions, but actively help plan and develop course content through back-and-forth dialogue.

IMPORTANT BEHAVIORS:
1. ASK CLARIFYING QUESTIONS before suggesting content. For example:
   - "What specific pain points do your realtors face with this topic?"
   - "What skill level should this module target — beginners or agents who already use some AI?"
   - "How many lessons are you thinking for this module? The standard is 3, but we could do more."
   - "Should this be a free teaser module or premium content?"

2. PLAN BEFORE BUILDING: When discussing new modules or content, outline the plan first:
   - Suggest a module structure (lesson titles, key topics per lesson)
   - Get confirmation before recommending they use the Quick Generate or Document Upload tools
   - Help refine the plan through conversation

3. BE PROACTIVE: Suggest related content ideas, identify gaps in the current curriculum, and recommend improvements.

4. REMEMBER CONTEXT: Reference earlier parts of the conversation. If Sherry mentioned something 3 messages ago, build on it.

5. When the plan is finalized, tell Sherry she can use the "Quick Generate" panel on the left to create the module with a specific topic, or use the Content Manager tab to build it manually.

The current course has these sections:
- Section I: AI Foundations (free) — basics of AI and Claude
- Section II: Essential AI Tools (free) — Cowork mode, connectors
- Section III: Real Estate AI Workflows (premium) — listings, clients, CMA, marketing
- Section IV: Advanced AI Strategies (premium) — transactions, social media, presentations
- Section V: Certification (premium) — final assessment`;
        break;

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }

    // Build messages array — for chat, include conversation history
    let messages: { role: string; content: string }[] = [];
    if (action === "chat" && context.history && Array.isArray(context.history)) {
      // Include previous conversation turns for context
      messages = context.history.map((msg: { role: string; content: string }) => ({
        role: msg.role,
        content: msg.content,
      }));
      // Add the current message
      messages.push({ role: "user", content: userPrompt });
    } else {
      messages = [{ role: "user", content: userPrompt }];
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5-20250929",
        max_tokens: 4096,
        system: systemPrompt,
        messages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Anthropic API error:", response.status, errorText);
      let friendlyError = `AI error (${response.status})`;
      if (response.status === 401) {
        friendlyError = "Invalid Anthropic API key. Please check the ANTHROPIC_API_KEY in Vercel environment variables.";
      } else if (response.status === 429) {
        friendlyError = "Rate limit exceeded. Please wait a moment and try again.";
      } else if (response.status === 400) {
        friendlyError = `Bad request: ${errorText.substring(0, 300)}`;
      } else if (response.status === 403) {
        friendlyError = "API key does not have permission for this model. Check your Anthropic plan.";
      } else {
        friendlyError = `AI error (${response.status}): ${errorText.substring(0, 300)}`;
      }
      return NextResponse.json({ error: friendlyError }, { status: 500 });
    }

    const result = await response.json();
    const aiText = result.content[0]?.text || "";

    // Try to extract JSON from the response
    let parsedContent = null;
    if (action !== "chat") {
      try {
        // Look for JSON in the response
        const jsonMatch = aiText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedContent = JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        // If JSON parsing fails, return as text
      }
    }

    return NextResponse.json({
      text: aiText,
      parsed: parsedContent,
      action,
    });
  } catch (error: any) {
    console.error("AI generate error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
