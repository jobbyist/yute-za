import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";

const Terms = () => {
  return (
    <div className="min-h-screen">
      <Navigation />

      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-8">Terms of Service</h1>
          
          <Card className="p-8">
            <div className="prose prose-sm max-w-none">
              <p className="text-muted-foreground mb-6">
                Last updated: January 2025
              </p>

              <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
              <p className="mb-6">
                By accessing and using YUTE ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use the Platform.
              </p>

              <h2 className="text-2xl font-bold mb-4">2. Description of Service</h2>
              <p className="mb-6">
                YUTE is a financial wellness and literacy platform designed to provide educational content, tools, and AI-powered guidance to help users make informed financial decisions. The Platform does not offer financial advice or any services that require legal registration, licensing, or authorization.
              </p>

              <h2 className="text-2xl font-bold mb-4">3. Not Financial Advice</h2>
              <p className="mb-6">
                <strong>IMPORTANT:</strong> The information provided through YUTE, including AI-generated responses from Gcini'mali Bot (V1 and 2.0), is for educational purposes only and should not be considered as professional financial advice. YUTE does not offer financial advice or any services that require legal registration for licensing or authorization. Always consult with a qualified, licensed financial advisor before making investment decisions.
              </p>

              <h2 className="text-2xl font-bold mb-4">4. User Responsibilities</h2>
              <p className="mb-4">You agree to:</p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Provide accurate and complete information when creating your account</li>
                <li>Maintain the security of your account credentials</li>
                <li>Use the Platform in accordance with all applicable laws and regulations</li>
                <li>Not use the Platform for any unlawful or fraudulent purposes</li>
                <li>Take responsibility for your own financial decisions</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4">5. Intellectual Property</h2>
              <p className="mb-6">
                All content on the Platform, including but not limited to text, graphics, logos, images, and software, is the property of YUTE or its content suppliers and is protected by South African and international copyright laws.
              </p>

              <h2 className="text-2xl font-bold mb-4">6. Subscription and Payments</h2>
              <p className="mb-6">
                Certain features of the Platform may require a paid subscription (Pro or Elite tiers). By subscribing, you agree to pay all applicable fees. Subscriptions automatically renew unless cancelled. Promotional codes and discounts are subject to specific terms and expiration dates.
              </p>

              <h2 className="text-2xl font-bold mb-4">7. Disclaimer of Warranties</h2>
              <p className="mb-6">
                The Platform is provided "as is" without warranties of any kind, either express or implied. YUTE does not warrant that the Platform will be uninterrupted, error-free, or free of viruses or other harmful components.
              </p>

              <h2 className="text-2xl font-bold mb-4">8. Limitation of Liability</h2>
              <p className="mb-6">
                To the maximum extent permitted by law, YUTE shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use of the Platform.
              </p>

              <h2 className="text-2xl font-bold mb-4">9. Modifications to Service</h2>
              <p className="mb-6">
                YUTE reserves the right to modify or discontinue, temporarily or permanently, the Platform or any features with or without notice.
              </p>

              <h2 className="text-2xl font-bold mb-4">10. Governing Law</h2>
              <p className="mb-6">
                These Terms shall be governed by and construed in accordance with the laws of South Africa, without regard to its conflict of law provisions.
              </p>

              <h2 className="text-2xl font-bold mb-4">11. Contact Information</h2>
              <p className="mb-6">
                If you have any questions about these Terms, please contact us at:<br />
                Email: legal@yute.co.za<br />
                Address: 123 Financial Street, Sandton, Johannesburg, 2196, South Africa
              </p>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Terms;
