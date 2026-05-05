import { supabase } from "@/lib/supabase";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!data) {
    return new Response("Profile not found", { status: 404 });
  }

  const vcard = `
BEGIN:VCARD
VERSION:3.0
FN:${data.full_name || ""}
TITLE:${data.title || ""}
TEL:${data.phone || ""}
EMAIL:${data.email || ""}
URL:${data.website || ""}
END:VCARD
`.trim();

  return new Response(vcard, {
    headers: {
      "Content-Type": "text/vcard",
      "Content-Disposition": `attachment; filename="${slug}.vcf"`,
    },
  });
}