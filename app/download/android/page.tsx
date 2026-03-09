import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import AndroidInstallOptions from "@/components/AndroidInstallOptions";

export const metadata: Metadata = {
  title: "Download GbanaMarket Android App",
  description:
    "Install GbanaMarket on Android via browser install or download the official APK fallback.",
  alternates: {
    canonical: "https://gbanamarket.vercel.app/download/android",
  },
};

export default function AndroidDownloadPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <section className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-extrabold text-[#002147] sm:text-3xl">Get GbanaMarket on Android</h1>
        <p className="mt-3 text-sm text-slate-600 sm:text-base">
          Install directly from your browser for automatic updates, or use the APK fallback if needed.
        </p>

        <div className="mt-6">
          <AndroidInstallOptions />
        </div>
      </section>
    </main>
  );
}
