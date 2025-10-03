import { Button } from "@/components/ui/button";
import { Menu, CircleDollarSign, GraduationCap, Trophy, Sparkles, Mail } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link to="/">
              <img 
                src="/yuteblack.svg" 
                alt="YUTE Logo" 
                style={{ width: '110px', height: 'auto' }}
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/stokie-circles" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium">
              <CircleDollarSign className="w-4 h-4" />
              <span>Stokie Circles</span>
            </Link>
            <Link to="/academy" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium">
              <GraduationCap className="w-4 h-4" />
              <span>VAULT SCHOOL</span>
            </Link>
            <Link to="/leaderboard" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium">
              <Trophy className="w-4 h-4" />
              <span>Leaderboard</span>
            </Link>
            <Link to="/ai-assistant" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium">
              <Sparkles className="w-4 h-4" />
              <span>AI Assistant</span>
            </Link>
             <a href="#features" className="text-foreground hover:text-primary transition-colors font-medium">
              <b>Explore All Features →</b>
            </a>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/auth">
              <Button variant="ghost">Sign Up/Login</Button>
            </Link>
            <Link to="/contact">
              <Button variant="default">Contact Support</Button>
            </Link>
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
            <Link to="/stokie-circles" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium">
              <CircleDollarSign className="w-4 h-4" />
              <span>Stokie Circles</span>
            </Link>
            <Link to="/academy" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium">
              <GraduationCap className="w-4 h-4" />
              <span>VAULT SCHOOL</span>
            </Link>
            <Link to="/leaderboard" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium">
              <Trophy className="w-4 h-4" />
              <span>Leaderboard</span>
            </Link>
            <Link to="/ai-assistant" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium">
              <Sparkles className="w-4 h-4" />
              <span>AI Assistant</span>
            </Link>
            <a href="#features" className="text-foreground hover:text-primary transition-colors font-medium">
              <b>Explore All Features →</b>
            </a>
            <div className="flex flex-col gap-2 pt-4">
              <Link to="/auth" className="w-full">
                <Button variant="ghost" className="w-full">Sign Up/Login</Button>
              </Link>
              <Link to="/contact" className="w-full">
                <Button variant="default" className="w-full">Contact Support</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
