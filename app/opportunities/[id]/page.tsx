import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import { optimizeCloudinaryUrl } from "@/lib/cloudinary";
import { Opportunity } from "@/types";
import {
  MapPin,
  Calendar,
  Building2,
  ExternalLink,
  ArrowLeft,
  Briefcase,
  GraduationCap,
  CheckCircle,
} from "lucide-react";

interface OpportunityDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: OpportunityDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const { data } = await supabaseAdmin
    .from("opportunities")
    .select("title, description, organization, image_url, is_active, is_visible")
    .eq("id", id)
    .single();

  if (!data) return { title: "Opportunity – Succevia Hub" };

  return {
    title: `${data.title} – ${data.organization} | Succevia Hub`,
    description: data.description.slice(0, 160),
    openGraph: {
      images: data.image_url ? [{ url: data.image_url }] : [],
    },
  };
}

export default async function OpportunityDetailPage({ params }: OpportunityDetailPageProps) {
  const { id } = await params;

  const { data } = await supabaseAdmin
    .from("opportunities")
    .select("*")
    .eq("id", id)
    .single();

  const opportunity = data as Opportunity | null;

  if (!opportunity || !opportunity.is_active || !opportunity.is_visible) {
    notFound();
  }

  const TypeIcon = opportunity.type === "job" ? Briefcase : GraduationCap;
  const typeLabel = opportunity.type === "job" ? "Job" : "Scholarship";
  const typeBadgeClass =
    opportunity.type === "job"
      ? "bg-blue-100 text-blue-700"
      : "bg-purple-100 text-purple-700";

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Back link */}
        <Link
          href="/opportunities"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#002147] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Opportunities
        </Link>

        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          {/* Hero image */}
          <div className="relative w-full h-64 sm:h-80 bg-slate-100">
            {opportunity.image_url ? (
              <Image
                src={optimizeCloudinaryUrl(opportunity.image_url, 1200)}
                alt={opportunity.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 768px"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="text-center">
                  <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">{opportunity.organization}</p>
                </div>
              </div>
            )}
            <span
              className={`absolute top-4 left-4 flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full shadow ${typeBadgeClass}`}
            >
              <TypeIcon className="w-3.5 h-3.5" />
              {typeLabel}
            </span>
          </div>

          <div className="p-6 sm:p-8">
            {/* Title + org */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#002147] leading-tight mb-2">
              {opportunity.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 mb-6">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4" />
                {opportunity.organization}
              </span>
              {opportunity.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {opportunity.location}
                </span>
              )}
              {opportunity.deadline && (
                <span className="flex items-center gap-1.5 text-amber-600 font-medium">
                  <Calendar className="w-4 h-4" />
                  Deadline: {opportunity.deadline}
                </span>
              )}
            </div>

            {/* Apply CTA */}
            <a
              href={opportunity.application_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#002147] hover:bg-[#003580] active:scale-95 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow mb-8"
            >
              <ExternalLink className="w-4 h-4" />
              Apply Now
            </a>

            <hr className="border-slate-100 mb-6" />

            {/* Description */}
            <section className="mb-6">
              <h2 className="text-base font-bold text-[#002147] mb-3">About this Opportunity</h2>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                {opportunity.description}
              </p>
            </section>

            {/* Requirements */}
            {opportunity.requirements && (
              <section className="mb-6">
                <h2 className="text-base font-bold text-[#002147] mb-3">Requirements</h2>
                <div className="bg-slate-50 rounded-xl p-4">
                  {opportunity.requirements.split("\n").map((line, i) =>
                    line.trim() ? (
                      <div key={i} className="flex items-start gap-2 mb-2 last:mb-0">
                        <CheckCircle className="w-4 h-4 text-[#25D366] shrink-0 mt-0.5" />
                        <p className="text-slate-600 text-sm">{line.trim()}</p>
                      </div>
                    ) : null
                  )}
                </div>
              </section>
            )}

            {/* Apply again at bottom */}
            <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[#002147]">Ready to apply?</p>
                <p className="text-xs text-slate-400">Click the button to go to the application page.</p>
              </div>
              <a
                href={opportunity.application_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1da851] active:scale-95 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow"
              >
                <ExternalLink className="w-4 h-4" />
                Apply Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
