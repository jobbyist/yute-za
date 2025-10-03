import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Cookies = () => {
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  const handleAcceptAll = () => {
    setCookiePreferences({
      necessary: true,
      analytics: true,
      marketing: true,
    });
  };

  const handleSavePreferences = () => {
    // In a real implementation, this would save preferences to localStorage or cookies
    console.log("Saved cookie preferences:", cookiePreferences);
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-8">Cookie Policy</h1>
          
          <Card className="p-8 mb-8">
            <div className="prose prose-sm max-w-none">
              <p className="text-muted-foreground mb-6">
                Last updated: January 2025
              </p>

              <h2 className="text-2xl font-bold mb-4">1. What Are Cookies?</h2>
              <p className="mb-6">
                Cookies are small text files that are placed on your device when you visit our Platform. They help us provide you with a better experience by remembering your preferences and understanding how you use the Platform.
              </p>

              <h2 className="text-2xl font-bold mb-4">2. Types of Cookies We Use</h2>
              
              <h3 className="text-xl font-semibold mb-3">Necessary Cookies (Always Active)</h3>
              <p className="mb-6">
                These cookies are essential for the Platform to function properly. They enable core functionality such as security, authentication, and accessibility. Without these cookies, certain features of the Platform would not work.
              </p>

              <h3 className="text-xl font-semibold mb-3">Analytics Cookies (Optional)</h3>
              <p className="mb-6">
                Analytics cookies help us understand how visitors interact with the Platform. We use this information to improve user experience, fix bugs, and optimize performance. These cookies collect aggregated, anonymous data.
              </p>

              <h3 className="text-xl font-semibold mb-3">Marketing Cookies (Optional)</h3>
              <p className="mb-6">
                Marketing cookies track your activity across websites to deliver relevant advertisements. We may use these cookies to show you personalized offers and content based on your interests.
              </p>

              <h2 className="text-2xl font-bold mb-4">3. How We Use Cookies</h2>
              <p className="mb-4">We use cookies to:</p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Keep you signed in to your account</li>
                <li>Remember your preferences and settings</li>
                <li>Understand how you use the Platform</li>
                <li>Improve Platform performance and user experience</li>
                <li>Provide personalized content and recommendations</li>
                <li>Analyze traffic and usage patterns</li>
                <li>Deliver relevant advertisements</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4">4. Third-Party Cookies</h2>
              <p className="mb-6">
                Some cookies are placed by third-party services that appear on our Platform. These include:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li><strong>Google Analytics:</strong> To analyze Platform usage</li>
                <li><strong>Payment Processors:</strong> To process subscription payments securely</li>
                <li><strong>AI Service Providers:</strong> To power Gcini'mali Bot features</li>
              </ul>
              <p className="mb-6">
                These third parties have their own privacy policies governing the use of information they collect.
              </p>

              <h2 className="text-2xl font-bold mb-4">5. Managing Cookie Preferences</h2>
              <p className="mb-6">
                You can control and manage cookies in several ways:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Use the cookie preference tool below to customize your settings</li>
                <li>Configure your browser to block or delete cookies</li>
                <li>Use browser privacy modes or extensions</li>
              </ul>
              <p className="mb-6">
                Please note that blocking certain cookies may affect Platform functionality and your user experience.
              </p>

              <h2 className="text-2xl font-bold mb-4">6. Browser Settings</h2>
              <p className="mb-6">
                Most web browsers allow you to control cookies through their settings. Here's how to manage cookies in popular browsers:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
                <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
                <li><strong>Safari:</strong> Preferences → Privacy → Cookies and website data</li>
                <li><strong>Edge:</strong> Settings → Privacy, search, and services → Cookies</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4">7. Important Legal Notice</h2>
              <p className="mb-6">
                <strong>IMPORTANT:</strong> While we use cookies to personalize your experience, including interactions with Gcini'mali Bot, please remember that YUTE provides educational content only and does not offer financial advice or any services that require legal registration for licensing or authorization. Always consult with a qualified financial advisor before making investment decisions.
              </p>

              <h2 className="text-2xl font-bold mb-4">8. Changes to This Policy</h2>
              <p className="mb-6">
                We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date.
              </p>

              <h2 className="text-2xl font-bold mb-4">9. Contact Us</h2>
              <p className="mb-6">
                If you have questions about our use of cookies, please contact:<br />
                Email: privacy@yute.co.za<br />
                Address: 123 Financial Street, Sandton, Johannesburg, 2196, South Africa
              </p>
            </div>
          </Card>

          {/* Cookie Preferences Tool */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">Manage Cookie Preferences</h2>
            
            <div className="space-y-6">
              <div className="flex items-start justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Necessary Cookies</h3>
                  <p className="text-sm text-muted-foreground">
                    Required for the Platform to function. Cannot be disabled.
                  </p>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-muted-foreground">Always Active</span>
                </div>
              </div>

              <div className="flex items-start justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Analytics Cookies</h3>
                  <p className="text-sm text-muted-foreground">
                    Help us understand how you use the Platform to improve your experience.
                  </p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={cookiePreferences.analytics}
                    onChange={(e) =>
                      setCookiePreferences({
                        ...cookiePreferences,
                        analytics: e.target.checked,
                      })
                    }
                    className="w-5 h-5"
                  />
                </div>
              </div>

              <div className="flex items-start justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Marketing Cookies</h3>
                  <p className="text-sm text-muted-foreground">
                    Used to deliver personalized advertisements and promotional content.
                  </p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={cookiePreferences.marketing}
                    onChange={(e) =>
                      setCookiePreferences({
                        ...cookiePreferences,
                        marketing: e.target.checked,
                      })
                    }
                    className="w-5 h-5"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button onClick={handleSavePreferences} variant="outline" className="flex-1">
                  Save Preferences
                </Button>
                <Button onClick={handleAcceptAll} className="flex-1">
                  Accept All Cookies
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Cookies;
