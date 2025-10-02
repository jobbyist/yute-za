import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bot, Send } from "lucide-react";
import { useState } from "react";

const sampleQuestions = [
  "How do I start saving money?",
  "What's a good budget for a student?",
  "How can I invest R500?",
];

const sampleResponses = [
  "Great question! Starting to save is easier than you think. Here are 3 simple steps: 1) Set aside 10% of any income, 2) Open a savings account, 3) Automate your savings. Let me help you create a personalized savings plan...",
  "For students in South Africa, I recommend the 50/30/20 rule: 50% for necessities, 30% for wants, and 20% for savings. Based on typical student expenses, let's build a budget together...",
  "R500 is a great start! You have several options: 1) Start with a Tax-Free Savings Account, 2) Consider unit trusts with low minimums, 3) Explore educational investment apps. Would you like to explore these options in detail?",
];

export const AIDemo = () => {
  const [selectedQuestion, setSelectedQuestion] = useState(0);

  return (
    <section className="py-24 px-4 bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Meet Your AI Financial Coach
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ask anything about money, budgeting, saving, or investing—get instant, personalized advice
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Chat Interface */}
          <Card className="p-6 shadow-[var(--shadow-medium)] border-2">
            <div className="space-y-4">
              {/* AI Response */}
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Bot className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="flex-1 bg-muted/50 rounded-2xl rounded-tl-none p-4">
                  <p className="text-sm leading-relaxed text-foreground">
                    {sampleResponses[selectedQuestion]}
                  </p>
                </div>
              </div>

              {/* User Message */}
              <div className="flex gap-3 justify-end">
                <div className="flex-1 max-w-[80%] bg-primary text-primary-foreground rounded-2xl rounded-tr-none p-4">
                  <p className="text-sm leading-relaxed">
                    {sampleQuestions[selectedQuestion]}
                  </p>
                </div>
              </div>

              {/* Input Area */}
              <div className="flex gap-2 pt-4 border-t">
                <input
                  type="text"
                  placeholder="Ask me anything about finances..."
                  className="flex-1 bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  readOnly
                />
                <Button variant="default" size="icon" className="rounded-xl">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Sample Questions */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-foreground mb-6">
              Try These Questions
            </h3>
            {sampleQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => setSelectedQuestion(index)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 ${
                  selectedQuestion === index
                    ? "border-primary bg-primary/5 shadow-[var(--shadow-soft)]"
                    : "border-border bg-card hover:border-primary/50"
                }`}
              >
                <p className="font-medium text-foreground">{question}</p>
              </button>
            ))}
            <div className="pt-4">
              <Button variant="hero" size="lg" className="w-full">
                Start Chatting with AI
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
