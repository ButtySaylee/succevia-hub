import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { Shield, Mail, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy – Succevia Hub",
  description: "Succevia Hub privacy policy. Learn how we collect, use, and protect your personal information.",
  alternates: { canonical: "https://succeviahub.vercel.app/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sm:p-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-[#002147] rounded-xl">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#002147]">Privacy Policy</h1>
          </div>
          <p className="text-slate-500 text-sm mb-8">Last updated: July 2026</p>

          <div className="space-y-6 text-sm sm:text-base text-slate-600 leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-[#002147] mb-2">1. Introduction</h2>
              <p>
                Succevia Hub (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to protecting your privacy. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our platform.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#002147] mb-2">2. Information We Collect</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Personal Information:</strong> Name, email address, phone number, and WhatsApp number when you create listings or use our services.</li>
                <li><strong>Listing Data:</strong> Product details, images, prices, and descriptions you post on our marketplace.</li>
                <li><strong>Usage Data:</strong> Pages visited, time spent, and interactions with our platform.</li>
                <li><strong>Device Information:</strong> Browser type, operating system, and device identifiers.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#002147] mb-2">3. How We Use Your Information</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>To operate and maintain our marketplace and services.</li>
                <li>To connect buyers and sellers via WhatsApp.</li>
                <li>To improve user experience and platform functionality.</li>
                <li>To send notifications about your listings and account.</li>
                <li>To comply with legal obligations and prevent fraud.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#002147] mb-2">4. Information Sharing</h2>
              <p>
                We do not sell your personal information. We may share your data with:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li><strong>Service Providers:</strong> Third-party services that help us operate (Cloudinary for image hosting, Supabase for database).</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights.</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#002147] mb-2">5. Data Security</h2>
              <p>
                We implement industry-standard security measures including encryption, secure socket layer (SSL) technology, 
                and regular security audits. Seller PINs are hashed and never stored in plain text.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#002147] mb-2">6. Your Rights</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Access your personal data held by us.</li>
                <li>Request correction of inaccurate data.</li>
                <li>Request deletion of your data (subject to legal obligations).</li>
                <li>Withdraw consent for data processing.</li>
                <li>Export your data in a portable format.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#002147] mb-2">7. Cookies</h2>
              <p>
                We use essential cookies for platform functionality. We may use analytics cookies to improve our service. 
                You can control cookie preferences through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#002147] mb-2">8. Third-Party Services</h2>
              <p>
                Our platform integrates with:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li><strong>WhatsApp:</strong> For buyer-seller communication.</li>
                <li><strong>Cloudinary:</strong> For image hosting and optimization.</li>
                <li><strong>Supabase:</strong> For database and authentication.</li>
                <li><strong>Google Analytics:</strong> For usage analytics (optional).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#002147] mb-2">9. Children's Privacy</h2>
              <p>
                Our services are not directed to individuals under 13. We do not knowingly collect information from children.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#002147] mb-2">10. Changes to This Policy</h2>
              <p>
                We may update this policy periodically. Changes will be posted on this page with an updated date.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#002147] mb-2">11. Contact Us</h2>
              <p>If you have questions about this policy, contact us:</p>
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-[#25D366]" />
                  <a href="mailto:support@succeviahub.com" className="text-[#25D366] hover:underline">support@succeviahub.com</a>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-[#25D366]" />
                  <span>+231777917740</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}