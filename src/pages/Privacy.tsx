import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";

const Privacy = () => {
  return (
    <div className="min-h-screen">
      <Navigation />

      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-8">Privacy Policy</h1>
          
          <Card className="p-8">
            <div className="prose prose-sm max-w-none">
              <p className="text-muted-foreground mb-6">
                Last updated: January 2025
              </p>

              <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
              <p className="mb-6">
                YUTE ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Platform. Please read this policy carefully.
              </p>

              <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold mb-3">Personal Information</h3>
              <p className="mb-4">We may collect the following personal information:</p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Name and email address</li>
                <li>Financial goals and preferences</li>
                <li>Risk tolerance information</li>
                <li>Usage data and interactions with the Platform</li>
                <li>Payment information (processed securely through third-party providers)</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">Automatically Collected Information</h3>
              <p className="mb-4">We automatically collect certain information when you use the Platform:</p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Device information (type, operating system)</li>
                <li>IP address and location data</li>
                <li>Browser type and version</li>
                <li>Pages visited and features used</li>
                <li>Time and date of visits</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
              <p className="mb-4">We use your information to:</p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Provide and personalize the Platform services</li>
                <li>Process your subscription and payments</li>
                <li>Improve and optimize the Platform</li>
                <li>Communicate with you about updates, offers, and support</li>
                <li>Analyze usage patterns and trends</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4">4. AI-Generated Content</h2>
              <p className="mb-6">
                When you interact with Gcini'mali Bot (V1 or 2.0), your conversations are processed by third-party AI services. We do not store your complete chat history permanently, but may retain anonymized data for service improvement. <strong>Remember: AI responses are for educational purposes only and do not constitute professional financial advice.</strong>
              </p>

              <h2 className="text-2xl font-bold mb-4">5. Data Sharing and Disclosure</h2>
              <p className="mb-4">We may share your information with:</p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li><strong>Service Providers:</strong> Third-party companies that help us operate the Platform (payment processors, analytics providers, AI service providers)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, sale, or acquisition</li>
              </ul>
              <p className="mb-6">
                We do NOT sell your personal information to third parties.
              </p>

              <h2 className="text-2xl font-bold mb-4">6. Data Security</h2>
              <p className="mb-6">
                We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
              </p>

              <h2 className="text-2xl font-bold mb-4">7. Your Rights</h2>
              <p className="mb-4">Under the Protection of Personal Information Act (POPIA), you have the right to:</p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate or incomplete information</li>
                <li>Request deletion of your information</li>
                <li>Object to processing of your information</li>
                <li>Withdraw consent at any time</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4">8. Cookies and Tracking</h2>
              <p className="mb-6">
                We use cookies and similar tracking technologies to enhance your experience. You can control cookies through your browser settings. See our Cookie Policy for more details.
              </p>

              <h2 className="text-2xl font-bold mb-4">9. Children's Privacy</h2>
              <p className="mb-6">
                The Platform is not intended for users under 18 years of age. We do not knowingly collect personal information from children under 18.
              </p>

              <h2 className="text-2xl font-bold mb-4">10. Changes to This Policy</h2>
              <p className="mb-6">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
              </p>

              <h2 className="text-2xl font-bold mb-4">11. Contact Us</h2>
              <p className="mb-6">
                If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us at:<br />
                Email: privacy@yute.co.za<br />
                Address: 123 Financial Street, Sandton, Johannesburg, 2196, South Africa
              </p>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Privacy;
