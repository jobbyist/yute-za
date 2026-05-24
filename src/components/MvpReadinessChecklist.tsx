import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

const checklist = [
  "Set up error boundaries and user-friendly fallback states on every critical route.",
  "Track API failures, slow responses, and retries with clear in-app feedback messages.",
  "Add onboarding completion analytics to spot drop-off points and improve conversion flow.",
  "Implement form validation and graceful recovery for auth, profile, and payment actions.",
  "Add uptime, performance, and Core Web Vitals monitoring for real-time platform health.",
  "Run weekly copy and UX reviews to keep tone fresh, clear, and conversion-focused.",
  "Create a feedback loop: capture user feedback, triage themes, and ship measurable fixes.",
  "Add incident playbooks for outage communication, rollback, and post-mortem follow-up.",
];

export const MvpReadinessChecklist = () => {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto max-w-5xl">
        <Card className="p-8 md:p-10 border-2">
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold">
                MVP readiness checklist
              </h2>
              <p className="text-muted-foreground">
                Sharp-sharp priorities to keep YUTE stable, responsive, and ready
                for growth.
              </p>
            </div>

            <ul className="space-y-4">
              {checklist.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm md:text-base text-foreground">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>
    </section>
  );
};
