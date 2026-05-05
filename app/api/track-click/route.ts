import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  const body = await request.json();

  const { cardId, eventType } = body;

  const { error } = await supabase
    .from("card_analytics")
    .insert({
      card_id: cardId,
      event_type: eventType,
    });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}