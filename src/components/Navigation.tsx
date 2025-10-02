import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img 
              src="/yuteblack.svg" 
              alt="YUTE Logo" 
              style={{ width: '175px', height: 'auto' }}
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-foreground hover:text-primary transition-colors font-medium">
              Features
            </a>
            <a href="#ai" className="text-foreground hover:text-primary transition-colors font-medium">
              AI Coach
            </a>
            <a href="#community" className="text-foreground hover:text-primary transition-colors font-medium">
              Community
            </a>
            <a href="#resources" className="text-foreground hover:text-primary transition-colors font-medium">
              Resources
            </a>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost">Sign In</Button>
            <Button variant="default">Get Started</Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-6 h-6 text-foreground" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-border">
            <a href="#features" className="block text-foreground hover:text-primary transition-colors font-medium">
              Features
            </a>
            <a href="#ai" className="block text-foreground hover:text-primary transition-colors font-medium">
              AI Coach
            </a>
            <a href="#community" className="block text-foreground hover:text-primary transition-colors font-medium">
              Community
            </a>
            <a href="#resources" className="block text-foreground hover:text-primary transition-colors font-medium">
              Resources
            </a>
            <div className="flex flex-col gap-2 pt-4">
              <Button variant="ghost" className="w-full">Sign In</Button>
              <Button variant="default" className="w-full">Get Started</Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
