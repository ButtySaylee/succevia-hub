import Navbar from "@/components/Navbar";
import Link from "next/link";
import { CheckCircle, MessageCircle, Home } from "lucide-react";

const ADMIN_WA = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP ?? "";
const MOMO = process.env.NEXT_PUBLIC_MOMO_NUMBER ?? "";

interface Props {
  searchParams: Promise<{ title?: string }>;
}

export default async function SellSuccessPage({ searchParams }: Props) {
  const { title } = await searchParams;

  const waMsg = encodeURIComponent(
    `Hi, I just submitted a listing on Gbana Market titled "${title ?? "my item"}" and I'm ready to pay the listing fee. Please confirm my payment details.`
  );

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <CheckCircle className="w-16 h-16 text-[#25D366] mx-auto mb-4" />
          <h1 className="text-2xl font-extrabold text-[#002147] mb-2">
            Listing Submitted!
          </h1>
          <p className="text-slate-500 text-sm mb-6">
            Your item has been received and is awaiting approval. We will
            review it shortly and notify you on WhatsApp.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700 mb-6 text-left">
            <p className="font-semibold mb-1">Pay your listing fee to go live</p>
            <p>
              Send <strong>LRD 100 / USD 0.50</strong> via MoMo to{" "}
              <strong>{MOMO}</strong>, then tap the button below so we can
              confirm and approve your listing.
            </p>
          </div>

          <a
            href={`https://wa.me/${ADMIN_WA}?text=${waMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1da851] text-white font-semibold py-3 rounded-xl text-sm transition-all shadow mb-3"
          >
            <MessageCircle className="w-4 h-4" />
            Contact Us on WhatsApp
          </a>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl text-sm transition-all"
          >
            <Home className="w-4 h-4" />
            Back to Marketplace
          </Link>
        </div>
      </div>
    </main>
  );
}
