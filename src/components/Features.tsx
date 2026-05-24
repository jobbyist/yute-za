import { Bot, BookOpen, Users, Wallet, TrendingUp, Award } from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "AI Financial Assistant",
    description: "Ask your money questions anytime and get practical guidance in plain language that actually makes sense.",
    gradient: "from-primary to-primary/50",
  },
  {
    icon: BookOpen,
    title: "Interactive Learning",
    description: "Master budgeting, debt, and investing with short lessons built for real life in South Africa.",
    gradient: "from-secondary to-secondary/50",
  },
  {
    icon: Users,
    title: "Peer-to-Peer Network",
    description: "Swap wins, lessons, and motivation with a community that gets your hustle and your goals.",
    gradient: "from-accent to-accent/50",
  },
  {
    icon: Wallet,
    title: "Budget Tools",
    description: "Track spending, set smart goals, and stay accountable so payday doesn’t disappear by week two.",
    gradient: "from-primary to-secondary",
  },
  {
    icon: TrendingUp,
    title: "Investment Guidance",
    description: "Learn where to start with investing in SA, from low-entry options to long-term wealth moves.",
    gradient: "from-secondary to-accent",
  },
  {
    icon: Award,
    title: "Achieve Milestones",
    description: "Earn XP, badges, and momentum as you complete lessons and stack consistent money habits.",
    gradient: "from-accent to-primary",
  },
];

export const Features = () => {
  return (
    <section id="features" className="py-24 px-4 bg-muted/30">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Everything you need to thrive
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A conversion-focused toolkit designed for ambitious young South Africans.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group bg-card border border-border rounded-2xl p-8 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-medium)] transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
