import { useEffect } from "react";
import { useLocation } from "react-router-dom";

type SeoEntry = {
  pattern: RegExp;
  title: string;
  description: string;
};

const SEO_ENTRIES: SeoEntry[] = [
  {
    pattern: /^\/$/,
    title: "YUTE | Financial wellness for young South Africans",
    description:
      "Build money confidence with AI coaching, gamified learning, Stokie Circles, and a thriving Mzansi community.",
  },
  {
    pattern: /^\/academy$/,
    title: "VAULT SCHOOL | Gamified financial learning | YUTE",
    description:
      "Learn budgeting, debt, and investing with short lessons, XP, badges, and practical South African examples.",
  },
  {
    pattern: /^\/academy\/path\/.+$/,
    title: "Learning Path | VAULT SCHOOL | YUTE",
    description:
      "Follow a structured path, track progress, and level up your money skills one lesson at a time.",
  },
  {
    pattern: /^\/academy\/course\/.+$/,
    title: "Course Player | VAULT SCHOOL | YUTE",
    description:
      "Complete interactive lessons, quizzes, and practical modules designed for real-life financial decisions in SA.",
  },
  {
    pattern: /^\/stokie-circles$/,
    title: "Stokie Circles | Digital stokvel savings | YUTE",
    description:
      "Save together with trusted circles, transparent contributions, and secure digital tools made for Mzansi.",
  },
  {
    pattern: /^\/circles\/.+$/,
    title: "Circle Dashboard | Stokie Circles | YUTE",
    description:
      "Manage your circle, contributions, voting, and payout plans in one secure place.",
  },
  {
    pattern: /^\/leaderboard$/,
    title: "Leaderboard | Financial learning rankings | YUTE",
    description:
      "Track top learners, celebrate progress, and stay motivated with community-powered rankings.",
  },
  {
    pattern: /^\/badges$/,
    title: "Badges & Achievements | YUTE",
    description:
      "Unlock achievements, earn XP rewards, and celebrate every milestone on your money growth journey.",
  },
  {
    pattern: /^\/ai-assistant$/,
    title: "Gcini'mali AI Assistant | YUTE",
    description:
      "Chat with an always-on AI money coach for budgeting tips, practical insights, and goal-focused guidance.",
  },
  {
    pattern: /^\/bot-promo$/,
    title: "Gcini'mali Bot plans and pricing | YUTE",
    description:
      "Compare plans, unlock premium AI features, and choose the right guidance package for your financial goals.",
  },
  {
    pattern: /^\/profile$/,
    title: "Your Profile | YUTE",
    description:
      "Manage your account, preferences, subscription, and wallet tools in your personal dashboard.",
  },
  {
    pattern: /^\/onboarding$/,
    title: "Onboarding | Set your money goals | YUTE",
    description:
      "Set goals, define your risk comfort, and personalise your YUTE experience in a few guided steps.",
  },
  {
    pattern: /^\/auth$/,
    title: "Sign in or create an account | YUTE",
    description:
      "Join YUTE to start your gamified financial learning journey and access your AI money companion.",
  },
  {
    pattern: /^\/contact$/,
    title: "Contact YUTE support",
    description:
      "Need help? Reach the YUTE team for account support, partnership queries, and platform guidance.",
  },
  {
    pattern: /^\/terms$/,
    title: "Terms of Service | YUTE",
    description:
      "Read YUTE terms covering platform use, responsibilities, subscriptions, and legal conditions.",
  },
  {
    pattern: /^\/privacy$/,
    title: "Privacy Policy | YUTE",
    description:
      "Learn how YUTE collects, processes, and protects your personal information under POPIA.",
  },
  {
    pattern: /^\/refunds$/,
    title: "Refund Policy | YUTE",
    description:
      "Review YUTE refund rules for subscriptions, timelines, and how to submit a refund request.",
  },
  {
    pattern: /^\/cookies$/,
    title: "Cookie Policy | YUTE",
    description:
      "Manage cookie choices and understand how YUTE uses cookies to improve your experience.",
  },
];

const upsertMeta = (attr: "name" | "property", key: string, content: string) => {
  let tag = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
};

const upsertCanonical = (href: string) => {
  let link = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
};

export const RouteSeo = () => {
  const location = useLocation();

  useEffect(() => {
    const current = SEO_ENTRIES.find((entry) => entry.pattern.test(location.pathname)) || {
      title: "YUTE | Financial wellness platform",
      description:
        "YUTE helps young South Africans build practical financial skills with AI guidance and community tools.",
    };

    const canonical = `${window.location.origin}${location.pathname}`;
    document.title = current.title;
    upsertMeta("name", "description", current.description);
    upsertMeta("property", "og:title", current.title);
    upsertMeta("property", "og:description", current.description);
    upsertMeta("property", "og:url", canonical);
    upsertMeta("name", "twitter:title", current.title);
    upsertMeta("name", "twitter:description", current.description);
    upsertCanonical(canonical);
  }, [location.pathname]);

  return null;
};
