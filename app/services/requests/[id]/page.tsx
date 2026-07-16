import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import { SERVICE_CATEGORIES } from "@/types";
import {
  Wrench,
  MapPin,
  Clock,
  ArrowLeft,
  MessageCircle,
  DollarSign,
  User,
  ArrowUpRight,
  Shield,
} from "lucide-react";

interface ServiceRequestDetailPageProps {
  params: Promise<{ id: string }>;
}

function getCategoryLabel(catId: string): string {
  const found = SERVICE_CATEGORIES.find(c => c.id === catId);
  return found?.label ?? catId;
}

function getCategoryIcon(catId: string): string {
  const found = SERVICE_CATEGORIES.find(c => c.id === catId);
  return found?.icon ?? "🛠️";
}

function getImageUrls(req: any): string[] {
  if (req.image_urls && Array.isArray(req.image_urls) && req.image_urls.length > 0) {
    return req.image_urls;
  }
  if (req.name && typeof req.name === "string" && req.name.startsWith("{")) {
    try {
      const parsed = JSON.parse(req.name);
      if (parsed.i && Array.isArray(parsed.i)) return parsed.i;
    } catch {}
  }
  return [];
}

function getUserName(req: any): string | null {
  if (req.name && typeof req.name === "string" && req.name.startsWith("{")) {
    try {
      const parsed = JSON.parse(req.name);
      if (typeof parsed.n === "string" && parsed.n.trim()) return parsed.n.trim();
      return null;
    } catch {
      return null;
    }
  }
  if (typeof req.name === "string" && req.name.startsWith("{")) return null;
  return req.name?.trim() || null;
}

export async function generateMetadata({
  params,
}: ServiceRequestDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const { data } = await supabaseAdmin
    .from("service_requests")
    .select("title, description")
    .eq("id", id)
    .single();

  if (!data) return { title: "Service Request – Succevia Hub" };

  return {
    title: `${data.title} – Service Request | Succevia Hub`,
    description: data.description.slice(0, 160),
  };
}

export default async function ServiceRequestDetailPage({ params }: ServiceRequestDetailPageProps) {
  const { id } = await params;

  const { data: req, error } = await supabaseAdmin
    .from("service_requests")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !req || req.status !== "open" || !req.is_visible) {
    notFound();
  }

  const urls = getImageUrls(req);
  const userName = getUserName(req);

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Back link */}
        <Link
          href="/services/requests"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#002147] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Service Requests
        </Link>

        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          {/* Hero image — click for full view */}
          {urls.length > 0 && (
            <a
              href={urls[0]}
              target="_blank"
              rel="noopener noreferrer"
              className="relative block w-full h-48 sm:h-64 bg-slate-100 group/image cursor-zoom-in"
            >
              <Image
                src={urls[0]}
                alt={req.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 768px"
              />
              {urls.length > 1 && (
                <span className="absolute top-4 right-4 bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm z-10">
                  +{urls.length - 1} photos
                </span>
              )}
              <span className="absolute top-4 left-4 flex items-center gap-1.5 text-sm font-semibold bg-[#25D366]/90 text-white px-3 py-1.5 rounded-full shadow backdrop-blur-sm z-10">
                <Wrench className="w-3.5 h-3.5" />
                {getCategoryIcon(req.category)} {getCategoryLabel(req.category)}
              </span>
            </a>
          )}

          <div className="p-6 sm:p-8">
            {/* Title */}
            <div className="flex items-start justify-between gap-4 mb-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#002147] leading-tight">
                {req.title}
              </h1>
              <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                req.urgency === "urgent" ? "bg-red-50 text-red-700" :
                req.urgency === "high" ? "bg-orange-50 text-orange-700" :
                req.urgency === "medium" ? "bg-amber-50 text-amber-700" :
                "bg-slate-100 text-slate-600"
              }`}>
                {req.urgency}
              </span>
            </div>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 mb-6">
              {req.budget && (
                <span className="flex items-center gap-1.5 font-bold text-[#25D366]">
                  <DollarSign className="w-4 h-4" />
                  {req.budget}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {req.county || req.city
                  ? [req.city, req.county].filter(Boolean).join(", ")
                  : req.country}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {new Date(req.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1.5 text-xs bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">
                {req.service_mode === "online" ? "Online" : req.service_mode === "in_person" ? "In-Person" : "Online & In-Person"}
              </span>
            </div>

            <hr className="border-slate-100 mb-6" />

            {/* Description */}
            <section className="mb-6">
              <h2 className="text-base font-bold text-[#002147] mb-3">Description</h2>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                {req.description}
              </p>
            </section>

            {/* Requester info */}
            {userName && (
              <section className="mb-6">
                <h2 className="text-base font-bold text-[#002147] mb-3">Requested by</h2>
                <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="w-10 h-10 bg-[#002147] rounded-full flex items-center justify-center text-white font-bold">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold">{userName}</p>
                    <p className="text-xs text-slate-400">Service requester</p>
                  </div>
                </div>
              </section>
            )}

            {/* Image gallery */}
            {urls.length > 1 && (
              <section className="mb-6">
                <h2 className="text-base font-bold text-[#002147] mb-3">
                  Photos ({urls.length})
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {urls.slice(1).map((url, idx) => (
                    <a
                      key={idx}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative block aspect-square bg-slate-100 rounded-xl overflow-hidden group/image cursor-zoom-in"
                    >
                      <Image
                        src={url}
                        alt={`${req.title} photo ${idx + 2}`}
                        fill
                        className="object-cover group-hover/image:scale-110 transition-transform duration-300"
                        sizes="(max-width: 640px) 50vw, 200px"
                      />
                    </a>
                  ))}
                </div>
              </section>
            )}

            {/* Contact CTA */}
            <div className="bg-gradient-to-r from-[#25D366]/10 to-transparent rounded-xl p-5 border border-slate-100">
              <h2 className="text-base font-bold text-[#002147] mb-2 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                Contact Requester
              </h2>
              <p className="text-sm text-slate-500 mb-4">
                Interested in helping? Contact the requester directly on WhatsApp.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={`https://wa.me/${req.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1da851] active:scale-95 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat on WhatsApp
                  <ArrowUpRight className="w-4 h-4" />
                </a>
                <div className="flex items-center gap-2 text-xs text-slate-400 bg-white rounded-xl px-4 py-3 border border-slate-100">
                  <Shield className="w-3.5 h-3.5" />
                  <span>
                    <span className="font-mono">{req.whatsapp}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}