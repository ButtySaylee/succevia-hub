import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { 
  ShoppingBag, ArrowRight, Users, BookOpen, Briefcase, GraduationCap,
  Wrench, Building2, CalendarDays, Sparkles,
  MessageCircle, CheckCircle, Shield, Globe,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Succevia Hub – Liberia's #1 Platform for Jobs, Scholarships & Marketplace",
  description:
    "Liberia's trusted platform for jobs, scholarships, buying & selling, professional services, business directory, and community. Find opportunities and grow your future.",
  keywords: [
    "succevia hub", "liberia jobs", "liberia scholarships", "liberia marketplace",
    "buy and sell liberia", "monrovia jobs", "liberia services", "liberia business directory",
    "liberia freelancers", "liberia opportunities",
  ],
  alternates: {
    canonical: "https://succeviahub.vercel.app",
  },
};

// Quick action cards
const QUICK_ACTIONS = [
  { href: "/marketplace", icon: ShoppingBag, label: "Marketplace", color: "bg-green-500" },
  { href: "/jobs", icon: Briefcase, label: "Find Jobs", color: "bg-blue-500" },
  { href: "/opportunities", icon: GraduationCap, label: "Scholarships", color: "bg-purple-500" },
  { href: "/services", icon: Wrench, label: "Request Service", color: "bg-orange-500" },
  { href: "/professionals", icon: Users, label: "Hire Pro", color: "bg-teal-500" },
  { href: "/businesses", icon: Building2, label: "Businesses", color: "bg-indigo-500" },
  { href: "/community", icon: Globe, label: "Communities", color: "bg-pink-500" },
  { href: "/learning", icon: BookOpen, label: "Learning", color: "bg-rose-500" },
  { href: "/events", icon: CalendarDays, label: "Events", color: "bg-cyan-500" },
];

// Feature sections
const FEATURES = [
  {
    icon: ShoppingBag,
    title: "Marketplace",
    description: "Buy and sell products safely via WhatsApp. From phones to vehicles, find what you need.",
    href: "/marketplace",
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: Briefcase,
    title: "Job Portal",
    description: "Find government, NGO, and private sector jobs. Full-time, part-time, remote, and internships.",
    href: "/jobs",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: GraduationCap,
    title: "Scholarships",
    description: "Discover scholarships for bachelor's, master's, PhD, and training programs worldwide.",
    href: "/opportunities",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: Wrench,
    title: "Request a Service",
    description: "Need tech support, repairs, design, or tutoring? Post a request and get quotations.",
    href: "/services",
    color: "from-orange-500 to-orange-600",
  },
  {
    icon: Building2,
    title: "Business Directory",
    description: "Discover local businesses. Read reviews, find contact info, and connect directly.",
    href: "/businesses",
    color: "from-indigo-500 to-indigo-600",
  },
  {
    icon: Users,
    title: "Professional Network",
    description: "Hire freelancers and professionals. From developers to designers, find top talent.",
    href: "/professionals",
    color: "from-teal-500 to-teal-600",
  },
  {
    icon: BookOpen,
    title: "Learning Center",
    description: "Access free and paid courses. Learn new skills and advance your career.",
    href: "/learning",
    color: "from-rose-500 to-rose-600",
  },
  {
    icon: CalendarDays,
    title: "Events",
    description: "Discover workshops, seminars, conferences, and networking events near you.",
    href: "/events",
    color: "from-cyan-500 to-cyan-600",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      {/* ==================== HERO SECTION ==================== */}
      <section className="relative bg-gradient-to-br from-[#002147] via-[#003580] to-[#0066cc] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" 
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} 
        />
        <div className="absolute inset-0 opacity-[0.08]">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse" />
          <div className="absolute top-40 right-20 w-80 h-80 bg-[#25D366] rounded-full mix-blend-overlay filter blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
          <div className="absolute bottom-20 left-1/3 w-60 h-60 bg-blue-400 rounded-full mix-blend-overlay filter blur-3xl animate-pulse" style={{ animationDelay: "4s" }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16 md:py-20 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6 text-xs text-slate-200">
              <Sparkles className="w-3.5 h-3.5 text-[#25D366]" />
              Liberia's #1 Opportunity Platform
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-balance mb-4">
              <span className="bg-gradient-to-r from-white via-slate-100 to-slate-200 bg-clip-text text-transparent">
                Your Future Starts Here
              </span>
            </h1>
            
            <p className="text-slate-200 text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed px-4 text-balance">
              Liberia's trusted platform for jobs, scholarships, marketplace, 
              professional services, and community. One platform, endless opportunities.
            </p>

            {/* Quick Action Cards - wider grid */}
            <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2 sm:gap-3 max-w-4xl mx-auto px-4 mb-8">
              {QUICK_ACTIONS.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="group flex flex-col items-center gap-1.5 p-2.5 sm:p-3 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <div className={`p-2 rounded-xl ${action.color} bg-opacity-20`}>
                    <action.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium text-slate-200 leading-tight text-center">
                    {action.label}
                  </span>
                </Link>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
              <Link
                href="/marketplace"
                className="group inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1da851] text-white font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-2xl text-sm sm:text-base shadow-2xl hover:shadow-green-500/30 transition-all duration-300 hover:scale-105 active:scale-95 min-h-[48px]"
              >
                <ShoppingBag className="w-5 h-5" />
                Browse Marketplace
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/sell"
                className="group inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-2xl text-sm sm:text-base shadow-lg border border-white/20 transition-all duration-300 hover:scale-105 active:scale-95 min-h-[48px]"
              >
                Start Selling
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      {/* ==================== FEATURES GRID ==================== */}
      <section className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#002147] mb-3">
            Everything You Need in One Place
          </h2>
          <p className="text-slate-500 text-sm sm:text-base max-w-2xl mx-auto">
            From finding jobs to hiring professionals, Succevia Hub connects you with opportunities to grow.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {FEATURES.map((feature) => (
            <Link
              key={feature.href}
              href={feature.href}
              className="group bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 card-hover"
            >
              <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${feature.color} mb-4 shadow-lg`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-[#002147] text-sm sm:text-base mb-2 group-hover:text-[#25D366] transition-colors">
                {feature.title}
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                {feature.description}
              </p>
              <div className="flex items-center gap-1 mt-3 text-[#25D366] text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Explore</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ==================== STATS BANNER ==================== */}
      <section className="bg-gradient-to-r from-[#002147] to-[#003580] py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
            {[
              { number: "180+", label: "Countries", icon: Globe },
              { number: "24/7", label: "Support", icon: MessageCircle },
              { number: "100%", label: "WhatsApp Safe", icon: Shield },
              { number: "Free", label: "To Join", icon: CheckCircle },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex justify-center mb-2">
                  <stat.icon className="w-6 h-6 text-[#25D366]" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white">{stat.number}</div>
                <div className="text-slate-400 text-xs sm:text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== PLATFORM OVERVIEW ==================== */}
      <section className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#002147] mb-4">
              Built for Liberia. Ready for the World.
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed mb-6">
              Succevia Hub is more than a marketplace. It's a complete opportunity ecosystem 
              designed to help Liberians find jobs, apply for scholarships, buy and sell products, 
              hire professionals, discover businesses, and connect with communities.
            </p>
            <div className="space-y-3">
              {[
                "🔍 Search everything - products, jobs, services, professionals",
                "💬 Connect instantly via WhatsApp with buyers and sellers",
                "🛡️ Safe trading with verified listings and reviews",
                "🌍 Liberia-first with global reach - 180+ countries supported",
                "📱 Mobile-optimized experience works on any device",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-[#25D366] rounded-full mt-2 shrink-0" />
                  <p className="text-sm text-slate-600">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-[#002147] mb-4">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Active Listings", value: "500+" },
                { label: "Job Opportunities", value: "100+" },
                { label: "Scholarships", value: "50+" },
                { label: "Professional Services", value: "30+" },
              ].map((stat) => (
                <div key={stat.label} className="bg-slate-50 rounded-xl p-4 text-center">
                  <div className="text-xl font-bold text-[#25D366]">{stat.value}</div>
                  <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link href="/marketplace" className="text-sm text-[#25D366] font-semibold hover:underline">
                Browse all listings →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CTA BANNER ==================== */}
      <section className="bg-gradient-to-r from-[#002147] to-[#003580] py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
            Ready to Grow Your Future?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mb-8 max-w-xl mx-auto">
            Join thousands of Liberians discovering opportunities every day. 
            It's free to get started.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/marketplace" className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1da851] text-white font-bold px-6 py-3 rounded-2xl shadow-lg hover:shadow-green-500/30 transition-all hover:scale-105 active:scale-95">
              <ShoppingBag className="w-5 h-5" />
              Browse Marketplace
            </Link>
            <Link href="/jobs" className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-2xl border border-white/20 transition-all hover:scale-105 active:scale-95">
              <Briefcase className="w-5 h-5" />
              Find Jobs
            </Link>
            <Link href="/services" className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-2xl border border-white/20 transition-all hover:scale-105 active:scale-95">
              <Wrench className="w-5 h-5" />
              Request Service
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="bg-[#001a33] text-slate-400 pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 mb-10">
            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-white font-bold text-sm mb-4">Succevia Hub</h3>
              <p className="text-xs leading-relaxed text-slate-500">
                Liberia's #1 platform for jobs, scholarships, marketplace, and professional services. 
                Connecting people with opportunities.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold text-xs mb-3 uppercase tracking-wider">Explore</h4>
              <ul className="space-y-2">
                {[
                  { href: "/marketplace", label: "Marketplace" },
                  { href: "/jobs", label: "Jobs" },
                  { href: "/opportunities", label: "Scholarships" },
                  { href: "/services", label: "Services" },
                  { href: "/professionals", label: "Professionals" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-xs hover:text-white transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-xs mb-3 uppercase tracking-wider">Community</h4>
              <ul className="space-y-2">
                {[
                  { href: "/businesses", label: "Business Directory" },
                  { href: "/community", label: "Communities" },
                  { href: "/learning", label: "Learning Center" },
                  { href: "/events", label: "Events" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-xs hover:text-white transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-xs mb-3 uppercase tracking-wider">Account</h4>
              <ul className="space-y-2">
                {[
                  { href: "/dashboard", label: "Dashboard" },
                  { href: "/sell", label: "Start Selling" },
                  { href: "/download/android", label: "Mobile App" },
                  { href: "/reset-pin", label: "Reset PIN" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-xs hover:text-white transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700/50 pt-6">
            <div className="flex flex-wrap justify-center gap-4 mb-4">
              <Link href="/about" className="text-xs text-slate-500 hover:text-white transition-colors">About</Link>
              <Link href="/privacy" className="text-xs text-slate-500 hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="text-xs text-slate-500 hover:text-white transition-colors">Terms</Link>
              <Link href="/dashboard" className="text-xs text-slate-500 hover:text-white transition-colors">Dashboard</Link>
              <Link href="/sell" className="text-xs text-slate-500 hover:text-white transition-colors">Sell</Link>
            </div>
            <div className="text-center">
              <p className="text-xs">© {new Date().getFullYear()} Succevia Hub · Liberia's Opportunity Platform 🇱🇷</p>
              <p className="text-[10px] text-slate-600 mt-1">
                Built with ❤️ by{" "}
                <a href="https://butty-portfolio.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-[#25D366] font-semibold hover:underline">Butty Saylee</a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}