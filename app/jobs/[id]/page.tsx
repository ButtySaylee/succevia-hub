import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import { Opportunity } from "@/types";
import {
  MapPin,
  Calendar,
  Building2,
  ExternalLink,
  ArrowLeft,
  Briefcase,
  CheckCircle,
  Clock,
  Mail,
  Globe,
} from "lucide-react";

interface JobDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: JobDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const { data } = await supabaseAdmin
    .from("opportunities")
    .select("title, description, organization, image_url, is_active")
    .eq("id", id)
    .eq("type", "job")
    .single();

  if (!data) return { title: "Job – Succevia Hub" };

  return {
    title: `${data.title} – ${data.organization} | Succevia Hub`,
    description: data.description.slice(0, 160),
    openGraph: {
      images: data.image_url ? [{ url: data.image_url }] : [],
    },
  };
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;

  const { data } = await supabaseAdmin
    .from("opportunities")
    .select("*")
    .eq("id", id)
    .eq("type", "job")
    .single();

  const job = data as Opportunity | null;

  if (!job || !job.is_active || !job.is_visible) {
    notFound();
  }

  const isEmailApplication = job.application_url?.startsWith("mailto:");
  const displayUrl = isEmailApplication
    ? job.application_url.replace("mailto:", "")
    : job.application_url;

  const isExpired = job.deadline && new Date(job.deadline) < new Date();

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Back link */}
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#002147] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Jobs
        </Link>

        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          {/* Hero image */}
          <div className="relative w-full h-48 sm:h-64 bg-slate-100">
            {job.image_url ? (
              <Image
                src={job.image_url}
                alt={job.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 768px"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#002147]/5 to-[#003580]/10">
                <div className="text-center">
                  <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-2" />
                </div>
              </div>
            )}
            <span className="absolute top-4 left-4 flex items-center gap-1.5 text-sm font-semibold bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full shadow">
              <Briefcase className="w-3.5 h-3.5" />
              Job
            </span>
            {isExpired && (
              <span className="absolute top-4 right-4 flex items-center gap-1.5 text-sm font-semibold bg-red-50 text-red-700 px-3 py-1.5 rounded-full shadow">
                <Clock className="w-3.5 h-3.5" />
                Expired
              </span>
            )}
          </div>

          <div className="p-6 sm:p-8">
            {/* Title + org */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#002147] leading-tight mb-2">
              {job.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 mb-6">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4" />
                {job.organization}
              </span>
              {job.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {job.location}
                </span>
              )}
              {job.deadline && (
                <span className={`flex items-center gap-1.5 font-medium ${isExpired ? "text-red-600" : "text-amber-600"}`}>
                  <Calendar className="w-4 h-4" />
                  {isExpired ? "Expired" : `Deadline: ${job.deadline}`}
                </span>
              )}
            </div>

            {/* Apply CTA */}
            {!isExpired && (
              <a
                href={job.application_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#002147] hover:bg-[#003580] active:scale-95 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow mb-8"
              >
                <ExternalLink className="w-4 h-4" />
                Apply Now
              </a>
            )}

            <hr className="border-slate-100 mb-6" />

            {/* Description */}
            <section className="mb-6">
              <h2 className="text-base font-bold text-[#002147] mb-3">About this Job</h2>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                {job.description}
              </p>
            </section>

            {/* Requirements */}
            {job.requirements && (
              <section className="mb-6">
                <h2 className="text-base font-bold text-[#002147] mb-3">Requirements / Eligibility</h2>
                <div className="bg-slate-50 rounded-xl p-4">
                  {job.requirements.split("\n").map((line, i) =>
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

            {/* Application info */}
            <section className="mb-6 bg-gradient-to-r from-[#002147]/5 to-transparent rounded-xl p-5 border border-slate-100">
              <h2 className="text-base font-bold text-[#002147] mb-3 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                How to Apply
              </h2>
              {isEmailApplication ? (
                <div className="space-y-2">
                  <p className="text-sm text-slate-500">Send your application to:</p>
                  <a
                    href={job.application_url}
                    className="inline-flex items-center gap-2 bg-[#25D366]/10 text-[#1da851] text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#25D366]/20 transition-all"
                  >
                    <Mail className="w-4 h-4" />
                    {displayUrl}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-slate-500">Apply through the link below:</p>
                  <a
                    href={job.application_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#25D366]/10 text-[#1da851] text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#25D366]/20 transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {displayUrl.replace(/^https?:\/\//, "").substring(0, 50)}
                    {displayUrl.replace(/^https?:\/\//, "").length > 50 ? "..." : ""}
                  </a>
                </div>
              )}
            </section>

            {/* Apply again at bottom */}
            {!isExpired && (
              <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[#002147]">Ready to apply?</p>
                  <p className="text-xs text-slate-400">Click the button to submit your application.</p>
                </div>
                <a
                  href={job.application_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1da851] active:scale-95 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow"
                >
                  <ExternalLink className="w-4 h-4" />
                  Apply Now
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}