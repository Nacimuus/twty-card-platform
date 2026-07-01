import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PalgonicLogo } from "@/components/PalgonicLogo";
import { CardOrderClient } from "@/components/CardOrderClient";
import type { CardData } from "@/components/PhysicalCardPreview";

export const metadata = { title: "Commander une carte NFC" };

export default async function OrderPage({
  params,
}: {
  params: Promise<{ cardId: string }>;
}) {
  const { cardId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch the digital card — must belong to this user
  const { data: card } = await supabase
    .from("profiles")
    .select(
      "id, full_name, title, company, email, phone, website, profile_image, company_logo, slug, user_id",
    )
    .eq("id", cardId)
    .eq("user_id", user.id)
    .single();

  if (!card) {
    // Card not found or not owned by user
    redirect("/dashboard");
  }

  // Fetch materials catalog
  const { data: products } = await supabase
    .from("card_products")
    .select("id, name, base_price, in_stock")
    .order("sort_order", { ascending: true });

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://palgonic.vercel.app";

  const cardData: CardData = {
    full_name: card.full_name,
    title: card.title,
    company: card.company,
    email: card.email,
    phone: card.phone,
    website: card.website,
    profile_image: card.profile_image,
    company_logo: card.company_logo,
    cardUrl: card.slug ? `${baseUrl}/u/${card.slug}` : baseUrl,
  };

  return (
    <main className="min-h-screen bg-creme-paper text-encre">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/dashboard" className="transition hover:opacity-80">
          <PalgonicLogo className="text-2xl" />
        </Link>
        <Link
          href="/dashboard"
          className="text-sm text-pierre transition hover:text-foret"
        >
          Tableau de bord
        </Link>
      </nav>

      <CardOrderClient
        data={cardData}
        products={products || []}
        sourceCardId={card.id}
      />
    </main>
  );
}
