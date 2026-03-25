import Navbar from "@/components/Navbar";
import Link from "next/link";
import { CheckCircle, Home } from "lucide-react";

interface Props {
  searchParams: Promise<{ title?: string }>;
}

export default async function SellSuccessPage({ searchParams }: Props) {
  const { title } = await searchParams;

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <CheckCircle className="w-16 h-16 text-[#25D366] mx-auto mb-4" />
          <h1 className="text-2xl font-extrabold text-[#002147] mb-2">
            Listing Published!
          </h1>
          <p className="text-slate-500 text-sm mb-6">
            Great! Your listing "{title ?? "item"}" is now live on the marketplace.
            Buyers can find and contact you directly via WhatsApp.
          </p>

          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-700 mb-6 text-left">
            <p className="font-semibold mb-1">✅ Your listing is now live!</p>
            <p>
              Buyers worldwide can now see your item and contact you directly through WhatsApp.
              You'll receive messages from interested buyers.
            </p>
          </div>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1da851] text-white font-semibold py-3 rounded-xl text-sm transition-all shadow mb-3"
          >
            <Home className="w-4 h-4" />
            View Your Live Listing
          </Link>

          <Link
            href="/sell"
            className="flex items-center justify-center gap-2 w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl text-sm transition-all"
          >
            Sell Another Item
          </Link>
        </div>
      </div>
    </main>
  );
}
