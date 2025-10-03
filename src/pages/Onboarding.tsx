import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Check, ChevronRight, Sparkles, Target, Shield } from "lucide-react";

const STEPS = 4;

const Onboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [financialGoals, setFinancialGoals] = useState("");
  const [riskQuestions, setRiskQuestions] = useState({
    q1: "",
    q2: "",
    q3: "",
  });
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const calculateRiskScore = () => {
    let score = 0;
    if (riskQuestions.q1 === "high") score += 3;
    else if (riskQuestions.q1 === "medium") score += 2;
    else score += 1;

    if (riskQuestions.q2 === "high") score += 3;
    else if (riskQuestions.q2 === "medium") score += 2;
    else score += 1;

    if (riskQuestions.q3 === "high") score += 3;
    else if (riskQuestions.q3 === "medium") score += 2;
    else score += 1;

    return score;
  };

  const handleComplete = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const riskScore = calculateRiskScore();
      
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          financial_goals: financialGoals,
          risk_tolerance_score: riskScore,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: "Welcome to YUTE!",
        description: "Your profile has been set up successfully.",
      });

      navigate("/profile");
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedPlan !== "";
      case 2:
        return financialGoals.trim() !== "";
      case 3:
        return riskQuestions.q1 && riskQuestions.q2 && riskQuestions.q3;
      case 4:
        return disclaimerAccepted;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep < STEPS) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {Array.from({ length: STEPS }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-2 mx-1 rounded-full ${
                  i < currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-center text-muted-foreground">
            Step {currentStep} of {STEPS}
          </p>
        </div>

        {/* Step Content */}
        <Card className="p-8">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h2 className="text-3xl font-bold mb-2">Welcome to YUTE!</h2>
                <p className="text-muted-foreground">
                  Choose a plan to get started on your financial wellness journey
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Card
                  className={`p-6 cursor-pointer transition-all ${
                    selectedPlan === "free"
                      ? "border-primary border-2 bg-primary/5"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedPlan("free")}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold">Free</h3>
                    <div className="text-3xl font-bold">R0</div>
                  </div>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      <span className="text-sm">Basic financial tools</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      <span className="text-sm">AI coach access</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      <span className="text-sm">Community access</span>
                    </li>
                  </ul>
                </Card>

                <Card
                  className={`p-6 cursor-pointer transition-all ${
                    selectedPlan === "premium"
                      ? "border-primary border-2 bg-primary/5"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedPlan("premium")}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold">Premium</h3>
                    <div className="text-3xl font-bold">R99</div>
                  </div>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      <span className="text-sm">Everything in Free</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      <span className="text-sm">Advanced analytics</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      <span className="text-sm">Priority support</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      <span className="text-sm">Exclusive content</span>
                    </li>
                  </ul>
                </Card>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Target className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h2 className="text-3xl font-bold mb-2">Your Financial Goals</h2>
                <p className="text-muted-foreground">
                  Tell us what you want to achieve financially
                </p>
              </div>

              <div className="space-y-4">
                <Label htmlFor="goals">What are your financial goals?</Label>
                <Textarea
                  id="goals"
                  placeholder="E.g., Save for a house deposit, pay off debt, start investing, build an emergency fund..."
                  value={financialGoals}
                  onChange={(e) => setFinancialGoals(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
                <p className="text-sm text-muted-foreground">
                  Be as specific as possible. This will help us personalize your experience.
                </p>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Shield className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h2 className="text-3xl font-bold mb-2">Risk Tolerance</h2>
                <p className="text-muted-foreground">
                  Help us understand your investment comfort level
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>1. How would you react if your investment lost 20% of its value?</Label>
                  <RadioGroup
                    value={riskQuestions.q1}
                    onValueChange={(value) =>
                      setRiskQuestions({ ...riskQuestions, q1: value })
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="low" id="q1-low" />
                      <Label htmlFor="q1-low" className="font-normal cursor-pointer">
                        Sell immediately to prevent further losses
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medium" id="q1-medium" />
                      <Label htmlFor="q1-medium" className="font-normal cursor-pointer">
                        Wait and see what happens
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="high" id="q1-high" />
                      <Label htmlFor="q1-high" className="font-normal cursor-pointer">
                        Buy more at the lower price
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>2. What's your investment time horizon?</Label>
                  <RadioGroup
                    value={riskQuestions.q2}
                    onValueChange={(value) =>
                      setRiskQuestions({ ...riskQuestions, q2: value })
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="low" id="q2-low" />
                      <Label htmlFor="q2-low" className="font-normal cursor-pointer">
                        Less than 3 years
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medium" id="q2-medium" />
                      <Label htmlFor="q2-medium" className="font-normal cursor-pointer">
                        3-7 years
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="high" id="q2-high" />
                      <Label htmlFor="q2-high" className="font-normal cursor-pointer">
                        More than 7 years
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>3. What's more important to you?</Label>
                  <RadioGroup
                    value={riskQuestions.q3}
                    onValueChange={(value) =>
                      setRiskQuestions({ ...riskQuestions, q3: value })
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="low" id="q3-low" />
                      <Label htmlFor="q3-low" className="font-normal cursor-pointer">
                        Protecting my money from losses
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medium" id="q3-medium" />
                      <Label htmlFor="q3-medium" className="font-normal cursor-pointer">
                        Balanced growth with some protection
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="high" id="q3-high" />
                      <Label htmlFor="q3-high" className="font-normal cursor-pointer">
                        Maximizing returns, even with higher risk
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Shield className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h2 className="text-3xl font-bold mb-2">Legal Disclaimer</h2>
                <p className="text-muted-foreground">
                  Please read and accept the terms below
                </p>
              </div>

              <Card className="p-6 bg-muted/50 max-h-96 overflow-y-auto">
                <div className="prose prose-sm">
                  <h3 className="font-semibold mb-2">Important Information</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    YUTE is a financial wellness and literacy platform designed to provide
                    educational content and tools to help you make informed financial decisions.
                  </p>

                  <h4 className="font-semibold mb-2">Not Financial Advice</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    The information provided through YUTE, including AI-generated responses,
                    is for educational purposes only and should not be considered as
                    professional financial advice. YUTE does not offer financial advice or 
                    any services that require legal registration, licensing, or authorization.
                    Always consult with a qualified financial advisor before making investment decisions.
                  </p>

                  <h4 className="font-semibold mb-2">Risk Acknowledgment</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    All investments carry risk, including the potential loss of principal.
                    Past performance does not guarantee future results. You are responsible
                    for your own financial decisions.
                  </p>

                  <h4 className="font-semibold mb-2">Privacy & Data</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    We take your privacy seriously and will handle your personal information
                    in accordance with applicable data protection laws. Your data will be
                    used to personalize your experience and improve our services.
                  </p>
                </div>
              </Card>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="disclaimer"
                  checked={disclaimerAccepted}
                  onCheckedChange={(checked) =>
                    setDisclaimerAccepted(checked as boolean)
                  }
                />
                <Label
                  htmlFor="disclaimer"
                  className="text-sm font-normal cursor-pointer"
                >
                  I have read and understood the disclaimer. I acknowledge that YUTE
                  provides educational content only and does not provide professional
                  financial advice.
                </Label>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              Back
            </Button>
            <Button
              onClick={nextStep}
              disabled={!canProceed() || loading}
            >
              {loading ? (
                "Completing..."
              ) : currentStep === STEPS ? (
                "Complete Setup"
              ) : (
                <>
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
