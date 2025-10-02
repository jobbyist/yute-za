import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MessageCircle, Trophy, Heart } from "lucide-react";

const communityStats = [
  { icon: Users, value: "10,000+", label: "Active Members" },
  { icon: MessageCircle, value: "50k+", label: "Conversations" },
  { icon: Trophy, value: "5,000+", label: "Success Stories" },
  { icon: Heart, value: "95%", label: "Satisfaction Rate" },
];

const testimonials = [
  {
    name: "Thabo M.",
    location: "Johannesburg",
    message: "YUTE helped me save for my first car! The AI coach kept me accountable and the community inspired me daily.",
    achievement: "Saved R50,000 in 8 months",
  },
  {
    name: "Lerato K.",
    location: "Cape Town",
    message: "I learned about investing through YUTE's courses. Now I have a diversified portfolio and I'm helping my friends too!",
    achievement: "Started investing with R1,000",
  },
  {
    name: "Sipho N.",
    location: "Durban",
    message: "The peer network is amazing. Real people sharing real experiences. I've made friends and learned so much!",
    achievement: "Paid off R20k debt",
  },
];

export const Community = () => {
  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Join a Thriving Community
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect with thousands of young South Africans on their financial journey
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {communityStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className="p-6 text-center shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-medium)] transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary mb-4">
                  <Icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-3xl font-bold text-foreground mb-1">
                  {stat.value}
                </h3>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </Card>
            );
          })}
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="p-6 shadow-[var(--shadow-medium)] hover:shadow-[var(--shadow-glow)] transition-all duration-300 hover:-translate-y-1"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-semibold text-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  "{testimonial.message}"
                </p>
                <div className="pt-4 border-t border-border">
                  <p className="text-sm font-medium text-primary">
                    🎯 {testimonial.achievement}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button variant="hero" size="lg" className="min-w-[250px]">
            Join the Community
          </Button>
        </div>
      </div>
    </section>
  );
};
