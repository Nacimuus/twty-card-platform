import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const { cardId, eventType } = await request.json();
  if (!cardId || !eventType) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("card_analytics")
    .insert({ card_id: cardId, event_type: eventType });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}