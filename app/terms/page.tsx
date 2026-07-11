import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { Scale, Mail, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service – Succevia Hub",
  description: "Succevia Hub terms of service. Please read these terms carefully before using our platform.",
  alternates: { canonical: "https://succeviahub.vercel.app/terms" },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sm:p-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-[#002147] rounded-xl">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#002147]">Terms of Service</h1>
          </div>
          <p className="text-slate-500 text-sm mb-8">Last updated: July 2026</p>

          <div className="space-y-6 text-sm sm:text-base text-slate-600 leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-[#002147] mb-2">1. Acceptance of Terms</h2>
              <p>
                By accessing or using Succevia Hub (&ldquo;the Platform&rdquo;), you agree to be bound by these Terms of Service. 
                If you do not agree, please do not use the Platform.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#002147] mb-2">2. Description of Service</h2>
              <p>
                Succevia Hub is an online platform that connects buyers and sellers, job seekers and employers, 
                professionals and clients, and provides access to scholarships, learning resources, and community features. 
                We facilitate connections but are not a party to any transaction between users.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#002147] mb-2">3. User Responsibilities</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Provide accurate and truthful information in all listings and communications.</li>
                <li>Not post fraudulent, misleading, or prohibited content.</li>
                <li>Not use the Platform for any illegal purpose.</li>
                <li>Respect other users' privacy and rights.</li>
                <li>Maintain the confidentiality of your seller PIN.</li>
                <li>Comply with all applicable local, national, and international laws.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#002147] mb-2">4. Listing Guidelines</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>All listings must be accurate and describe the actual item or service.</li>
                <li>Prohibited items include illegal goods, weapons, drugs, and counterfeit products.</li>
                <li>We reserve the right to remove any listing without notice.</li>
                <li>Sellers are responsible for honoring their listed prices and terms.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#002147] mb-2">5. Transactions</h2>
              <p>
                All transactions are conducted directly between buyers and sellers via WhatsApp. 
                Succevia Hub does not handle payments, process transactions, or provide escrow services. 
                Users are responsible for their own due diligence.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#002147] mb-2">6. Intellectual Property</h2>
              <p>
                The Platform and its original content, features, and functionality are owned by Succevia Hub 
                and are protected by international copyright, trademark, and other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#002147] mb-2">7. Limitation of Liability</h2>
              <p>
                Succevia Hub is provided &ldquo;as is&rdquo; without warranties of any kind. We are not liable for:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Disputes between buyers and sellers.</li>
                <li>Loss or damage resulting from use of the Platform.</li>
                <li>Accuracy of listings or user-provided content.</li>
                <li>Service interruptions or technical issues.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#002147] mb-2">8. Account Termination</h2>
              <p>
                We reserve the right to suspend or terminate access to the Platform for violations of these terms, 
                fraudulent activity, or any conduct we deem harmful to the community.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#002147] mb-2">9. Indemnification</h2>
              <p>
                You agree to indemnify and hold Succevia Hub harmless from any claims, damages, or expenses 
                arising from your use of the Platform or violation of these terms.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#002147] mb-2">10. Changes to Terms</h2>
              <p>
                We may modify these terms at any time. Continued use of the Platform after changes constitutes 
                acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#002147] mb-2">11. Governing Law</h2>
              <p>
                These terms shall be governed by the laws of the Republic of Liberia.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#002147] mb-2">12. Contact</h2>
              <p>For questions about these terms, contact us:</p>
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