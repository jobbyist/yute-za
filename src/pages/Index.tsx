import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { AIDemo } from "@/components/AIDemo";
import { Community } from "@/components/Community";
import { CTA } from "@/components/CTA";
import { ChatBot } from "@/components/ChatBot";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <Features />
        <AIDemo />
        <Community />
        <CTA />
      </main>
      <ChatBot />
      <footer className="bg-muted/50 border-t border-border py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center text-muted-foreground">
            <p className="text-lg font-semibold mb-2">YUTE™</p>
            <p className="text-sm">
              South Africa's Next Generation Financial Wellness & Literacy Platform
            </p>
            <p className="text-xs mt-4">
              © 2025 YUTE. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
