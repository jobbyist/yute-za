import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";

const Refunds = () => {
  return (
    <div className="min-h-screen">
      <Navigation />

      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-8">Refund Policy</h1>
          
          <Card className="p-8">
            <div className="prose prose-sm max-w-none">
              <p className="text-muted-foreground mb-6">
                Last updated: January 2025
              </p>

              <h2 className="text-2xl font-bold mb-4">1. Overview</h2>
              <p className="mb-6">
                At YUTE, we strive to provide the best financial wellness and literacy platform. This Refund Policy outlines the terms and conditions for refunds on our Pro and Elite subscription plans.
              </p>

              <h2 className="text-2xl font-bold mb-4">2. Subscription Refunds</h2>
              
              <h3 className="text-xl font-semibold mb-3">7-Day Money-Back Guarantee</h3>
              <p className="mb-6">
                We offer a 7-day money-back guarantee for new subscribers to Pro and Elite plans. If you're not satisfied with your subscription within the first 7 days, you may request a full refund. This applies only to your first subscription payment.
              </p>

              <h3 className="text-xl font-semibold mb-3">Conditions for Refunds</h3>
              <p className="mb-4">To be eligible for a refund, you must:</p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Request the refund within 7 days of your initial subscription payment</li>
                <li>Provide a valid reason for the refund request</li>
                <li>Not have violated our Terms of Service</li>
                <li>Submit the refund request through our official channels</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4">3. Non-Refundable Items</h2>
              <p className="mb-4">The following are not eligible for refunds:</p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Subscription renewals after the initial 7-day period</li>
                <li>Partial month subscriptions</li>
                <li>Promotional or discounted subscriptions (unless within the 7-day period)</li>
                <li>Annual subscriptions (after 7 days from purchase)</li>
                <li>Fees charged due to failed payment methods</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4">4. How to Request a Refund</h2>
              <p className="mb-4">To request a refund, please:</p>
              <ol className="list-decimal pl-6 mb-6 space-y-2">
                <li>Contact our support team at refunds@yute.co.za</li>
                <li>Include your account email address and subscription details</li>
                <li>Provide a brief explanation for your refund request</li>
                <li>Allow 5-7 business days for processing</li>
              </ol>

              <h2 className="text-2xl font-bold mb-4">5. Refund Processing</h2>
              <p className="mb-6">
                Once your refund request is approved, the refund will be processed to your original payment method within 7-10 business days. You will receive a confirmation email once the refund has been processed.
              </p>

              <h2 className="text-2xl font-bold mb-4">6. Cancellation Policy</h2>
              <p className="mb-6">
                You may cancel your subscription at any time. Upon cancellation, you will continue to have access to premium features until the end of your current billing period. No refunds will be provided for the remaining time in your billing cycle (except within the 7-day money-back guarantee period).
              </p>

              <h2 className="text-2xl font-bold mb-4">7. Promotional Codes and Discounts</h2>
              <p className="mb-6">
                Promotional codes and discounts are subject to their own terms and conditions. Refunds on promotional subscriptions will be calculated based on the discounted amount paid, not the full price. Promotional codes are valid for 24 hours from generation and cannot be extended or reinstated after expiration.
              </p>

              <h2 className="text-2xl font-bold mb-4">8. Disputed Charges</h2>
              <p className="mb-6">
                If you believe you have been charged in error, please contact us immediately at billing@yute.co.za before disputing the charge with your bank or credit card company. We will work with you to resolve any billing issues.
              </p>

              <h2 className="text-2xl font-bold mb-4">9. Important Legal Notice</h2>
              <p className="mb-6">
                <strong>IMPORTANT:</strong> YUTE provides educational content and tools for financial wellness and literacy. We do not offer financial advice or any services that require legal registration for licensing or authorization. Refunds do not affect the fact that any decisions made based on Platform content are your sole responsibility. Always consult with a qualified financial advisor before making investment decisions.
              </p>

              <h2 className="text-2xl font-bold mb-4">10. Changes to This Policy</h2>
              <p className="mb-6">
                We reserve the right to modify this Refund Policy at any time. Changes will be effective immediately upon posting on this page. Your continued use of the Platform after changes constitutes acceptance of the updated policy.
              </p>

              <h2 className="text-2xl font-bold mb-4">11. Contact Information</h2>
              <p className="mb-6">
                For questions about refunds or to request a refund, please contact:<br />
                Email: refunds@yute.co.za<br />
                Support: support@yute.co.za<br />
                Address: 123 Financial Street, Sandton, Johannesburg, 2196, South Africa
              </p>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Refunds;
