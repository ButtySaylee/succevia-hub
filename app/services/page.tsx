import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { SERVICE_CATEGORIES } from "@/types";
import { Wrench, Search, ArrowRight, Star, Clock, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Request a Service – Succevia Hub",
  description: "Post a service request and get quotations from professionals in Liberia. Tech support, repairs, design, tutoring, and more.",
  keywords: ["service request liberia", "hire professionals liberia", "tech support liberia", "repairs liberia"],
  alternates: { canonical: "https://succeviahub.vercel.app/services" },
};

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      
      <section className="relative bg-gradient-to-br from-[#002147] to-[#003580] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6 text-xs text-slate-200">
              <Wrench className="w-3.5 h-3.5 text-[#25D366]" />
              Services Marketplace
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">Request Any Service</h1>
            <p className="text-slate-300 text-sm sm:text-base mb-8 max-w-xl mx-auto">
              Need tech support, repairs, design, or tutoring? Post a request and get quotes from professionals.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/services/request" className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1da851] text-white font-bold px-6 py-3 rounded-2xl shadow-lg transition-all hover:scale-105">
                <Wrench className="w-5 h-5" />
                Request a Service
              </Link>
              <Link href="/services/requests" className="inline-flex items-center gap-2 bg-white/10 backdrop-blur hover:bg-white/20 text-white px-6 py-3 rounded-2xl border border-white/20 transition-all hover:scale-105">
                Browse Open Requests
              </Link>
              <Link href="/professionals" className="inline-flex items-center gap-2 bg-white/10 backdrop-blur hover:bg-white/20 text-white px-6 py-3 rounded-2xl border border-white/20 transition-all hover:scale-105">
                Find Professionals
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      {/* Service Categories */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-extrabold text-[#002147] mb-2">Browse Service Categories</h2>
          <p className="text-slate-500 text-sm">Find the right professional for any job</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {SERVICE_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/services?category=${cat.id}`}
              className="group bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 hover:shadow-lg transition-all text-center hover:-translate-y-0.5"
            >
              <div className="text-3xl mb-2">{cat.icon}</div>
              <div className="text-xs sm:text-sm font-semibold text-slate-700 group-hover:text-[#25D366] transition-colors">
                {cat.label}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-white border-t border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-extrabold text-[#002147] text-center mb-8">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "1", title: "Post a Request", desc: "Describe what you need, your budget, and deadline." },
              { step: "2", title: "Get Quotations", desc: "Professionals send you offers. Compare and choose." },
              { step: "3", title: "Hire & Complete", desc: "Chat, agree on terms, and get the job done." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-[#25D366] text-white rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold text-[#002147] mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}