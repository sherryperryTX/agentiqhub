import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

async function verifyAdmin(authHeader: string | null): Promise<boolean> {
  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) return false;
  if (!authHeader?.startsWith("Bearer ")) return false;
  const token = authHeader.replace("Bearer ", "");
  const { data: { user } } = await supabaseAdmin.auth.getUser(token);
  if (!user) return false;
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  return profile?.is_admin === true;
}

export async function POST(req: Request) {
  try {
    const isAdmin = await verifyAdmin(req.headers.get("authorization"));
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const fileName = file.name.toLowerCase();
    const buffer = Buffer.from(await file.arrayBuffer());
    let text = "";

    if (fileName.endsWith(".pdf")) {
      // Parse PDF
      const pdfParse = require("pdf-parse");
      const pdfData = await pdfParse(buffer);
      text = pdfData.text;
    } else if (fileName.endsWith(".docx") || fileName.endsWith(".doc")) {
      // Parse Word document
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else if (fileName.endsWith(".txt") || fileName.endsWith(".md") || fileName.endsWith(".csv") || fileName.endsWith(".rtf")) {
      // Plain text files
      text = buffer.toString("utf-8");
    } else {
      return NextResponse.json({ error: `Unsupported file type: ${fileName.split(".").pop()}. Supported: PDF, DOCX, DOC, TXT, MD, CSV, RTF` }, { status: 400 });
    }

    if (!text.trim()) {
      return NextResponse.json({ error: "Could not extract any text from this file. It may be image-based or empty." }, { status: 400 });
    }

    return NextResponse.json({
      text: text.trim(),
      fileName: file.name,
      charCount: text.trim().length,
    });
  } catch (error: any) {
    console.error("Parse document error:", error);
    return NextResponse.json({ error: `Failed to parse document: ${error.message}` }, { status: 500 });
  }
}
