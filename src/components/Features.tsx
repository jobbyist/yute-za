import { Bot, BookOpen, Users, Wallet, TrendingUp, Award } from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "AI Financial Assistant",
    description: "Get personalized financial advice powered by advanced AI, available 24/7 to guide your financial journey",
    gradient: "from-primary to-primary/50",
  },
  {
    icon: BookOpen,
    title: "Interactive Learning",
    description: "Access comprehensive courses on budgeting, investing, and financial planning designed for young South Africans",
    gradient: "from-secondary to-secondary/50",
  },
  {
    icon: Users,
    title: "Peer-to-Peer Network",
    description: "Connect with other young professionals, share experiences, and learn from community success stories",
    gradient: "from-accent to-accent/50",
  },
  {
    icon: Wallet,
    title: "Budget Tools",
    description: "Smart budgeting tools that help you track spending, set goals, and build healthy financial habits",
    gradient: "from-primary to-secondary",
  },
  {
    icon: TrendingUp,
    title: "Investment Guidance",
    description: "Learn about investment opportunities accessible to South African youth with step-by-step guidance",
    gradient: "from-secondary to-accent",
  },
  {
    icon: Award,
    title: "Achieve Milestones",
    description: "Earn badges and rewards as you complete learning modules and reach your financial goals",
    gradient: "from-accent to-primary",
  },
];

export const Features = () => {
  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Everything You Need to Thrive
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive tools and resources designed specifically for South Africa's next generation
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
