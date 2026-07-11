import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { 
  Globe, Target, Heart, Shield, Users, 
  ShoppingBag, Briefcase, GraduationCap, ArrowRight 
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us – Succevia Hub",
  description: "Learn about Succevia Hub, Liberia's #1 platform for jobs, scholarships, marketplace, and professional services.",
  alternates: { canonical: "https://succeviahub.vercel.app/about" },
};

const VALUES = [
  {
    icon: Target,
    title: "Our Mission",
    description: "To empower Liberians and Africans worldwide by providing a unified platform that connects people with opportunities for economic growth and personal development.",
  },
  {
    icon: Heart,
    title: "Our Vision",
    description: "To become Africa's most trusted opportunity ecosystem, where anyone can find a job, get an education, start a business, or grow their career.",
  },
  {
    icon: Shield,
    title: "Trust & Safety",
    description: "We prioritize user safety with verified listings, secure PIN-based seller authentication, and direct WhatsApp communication that keeps transactions transparent.",
  },
  {
    icon: Users,
    title: "Community First",
    description: "Built by Liberians for Liberians, with a global reach. We understand local needs and provide solutions that work for our community.",
  },
];

const STATS = [
  { value: "500+", label: "Active Listings" },
  { value: "100+", label: "Job Opportunities" },
  { value: "50+", label: "Scholarships" },
  { value: "180+", label: "Countries Reached" },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#002147] via-[#003580] to-[#0066cc] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" 
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} 
        />
        <div className="max-w-4xl mx-auto px-4 py-16 sm:py-20 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6 text-xs text-slate-200">
            <Globe className="w-3.5 h-3.5 text-[#25D366]" />
            About Succevia Hub
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Empowering Opportunities,<br />
            <span className="text-[#25D366]">Connecting Communities</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Succevia Hub is Liberia's #1 platform for jobs, scholarships, marketplace, 
            professional services, and community. We're on a mission to make opportunity accessible to everyone.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 text-center hover:shadow-md transition-all">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#25D366]">{stat.value}</div>
              <div className="text-xs sm:text-sm text-slate-600 font-medium mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {VALUES.map((value) => (
            <div key={value.title} className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 hover:shadow-lg transition-all">
              <div className="inline-flex p-3 bg-[#002147] rounded-2xl mb-4">
                <value.icon className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-[#002147] mb-2">{value.title}</h2>
              <p className="text-slate-500 text-sm leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="bg-white border-t border-slate-100 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#002147] text-center mb-6">Our Story</h2>
          <div className="text-slate-500 text-sm sm:text-base leading-relaxed space-y-4">
            <p>
              Succevia Hub was born from a simple observation: Liberians needed a single, trusted platform 
              where they could find jobs, apply for scholarships, buy and sell products, hire professionals, 
              and connect with their community.
            </p>
            <p>
              Founded by <strong>Butty Saylee</strong>, Succevia Hub started as a marketplace and quickly 
              grew into a comprehensive opportunity ecosystem. Today, we serve thousands of users across 
              Liberia and beyond, connecting people with the resources they need to succeed.
            </p>
            <p>
              We're proud to be Liberia-first while thinking globally. Our platform supports users from 
              over 180 countries, and we're continuously expanding our features to serve our growing community.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#002147] text-center mb-8">
          What We Offer
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {[
            { icon: ShoppingBag, title: "Marketplace", desc: "Buy and sell products safely via WhatsApp. From phones to vehicles, find what you need.", href: "/marketplace" },
            { icon: Briefcase, title: "Job Portal", desc: "Find government, NGO, and private sector jobs. Full-time, part-time, remote, and internships.", href: "/jobs" },
            { icon: GraduationCap, title: "Scholarships", desc: "Discover scholarships for bachelor's, master's, PhD, and training programs worldwide.", href: "/opportunities" },
          ].map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="group bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div className="inline-flex p-3 bg-gradient-to-br from-[#25D366] to-[#1da851] rounded-2xl mb-4">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-[#002147] mb-2 group-hover:text-[#25D366] transition-colors">{feature.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
              <div className="flex items-center gap-1 mt-3 text-[#25D366] text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Explore</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}