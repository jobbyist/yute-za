import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bot, Send, X, MessageCircle, Loader2, Lock, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatBot2Props {
  userTier?: "free" | "pro" | "elite";
}

export const ChatBot2 = ({ userTier = "free" }: ChatBot2Props) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Welcome to GCINI'MALI BOT 2.0! 🚀 I'm your advanced AI financial advisor with personalized insights and goal tracking. How can I help you achieve your financial goals today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Check if user has access
  const hasAccess = userTier === "pro" || userTier === "elite";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || !hasAccess) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Call a different Supabase function for Bot 2.0 with Gemini 2.5 Pro
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-with-gcinimali-pro`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: [...messages, userMessage],
            userId: user?.id,
            userTier,
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          toast({
            title: "Too many requests",
            description: "Please wait a moment before sending another message.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        if (response.status === 402) {
          toast({
            title: "Service unavailable",
            description: "AI service requires additional credits.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        throw new Error("Failed to get response");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      if (reader) {
        // Add assistant message placeholder
        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

        let buffer = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.trim() === "") continue;
            if (line.startsWith(":")) continue;
            if (!line.startsWith("data: ")) continue;

            const data = line.slice(6);
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                assistantMessage += content;
                setMessages((prev) => {
                  const newMessages = [...prev];
                  newMessages[newMessages.length - 1] = {
                    role: "assistant",
                    content: assistantMessage,
                  };
                  return newMessages;
                });
              }
            } catch (e) {
              console.error("Error parsing SSE data:", e);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      // Remove the last user message if there was an error
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleUpgrade = () => {
    navigate("/bot-promo");
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-primary shadow-[var(--shadow-glow)] hover:opacity-90 transition-all duration-300 flex items-center justify-center group"
          aria-label="Open Gcini'mali Bot 2.0"
        >
          {hasAccess ? (
            <MessageCircle className="w-7 h-7 text-primary-foreground group-hover:scale-110 transition-transform" />
          ) : (
            <Lock className="w-7 h-7 text-primary-foreground group-hover:scale-110 transition-transform" />
          )}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 z-50 w-[380px] h-[600px] shadow-[var(--shadow-medium)] flex flex-col overflow-hidden border-2 border-purple-500/20">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-primary p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <Bot className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-primary-foreground">
                    GCINI'MALI BOT 2.0
                  </h3>
                  <Zap className="w-4 h-4 text-amber-300" />
                </div>
                <p className="text-xs text-primary-foreground/80">
                  {hasAccess ? "Advanced AI Financial Advisor" : "Premium Feature"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-primary-foreground hover:opacity-80 transition-opacity"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages or Upgrade Prompt */}
          {hasAccess ? (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-primary flex items-center justify-center">
                        <Bot className="w-5 h-5 text-primary-foreground" />
                      </div>
                    )}
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-purple-500 to-primary text-primary-foreground rounded-tr-none"
                          : "bg-card border border-border rounded-tl-none"
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && messages[messages.length - 1]?.role === "user" && (
                  <div className="flex gap-3 justify-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-primary flex items-center justify-center">
                      <Bot className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div className="bg-card border border-border rounded-2xl rounded-tl-none px-4 py-2.5">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border bg-background">
                <div className="mb-3 text-xs text-muted-foreground text-center px-2">
                  ⚠️ Educational purposes only. Not financial advice. Consult a professional advisor for investment decisions.
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about goals, investments, strategies..."
                    className="flex-1 bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    size="icon"
                    className="rounded-xl bg-gradient-to-r from-purple-500 to-primary"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto">
                  <Lock className="w-8 h-8 text-purple-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Premium Feature</h3>
                  <p className="text-muted-foreground mb-6">
                    Unlock GCINI'MALI BOT 2.0 with advanced AI, personalized insights, and goal tracking.
                  </p>
                  <Button
                    onClick={handleUpgrade}
                    className="bg-gradient-to-r from-purple-500 to-primary"
                  >
                    Upgrade to Pro or Elite
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground space-y-2">
                  <p>✓ Advanced Gemini 2.5 Pro AI</p>
                  <p>✓ Financial goal tracking</p>
                  <p>✓ Personalized strategies</p>
                  <p>✓ Priority support</p>
                </div>
              </div>
            </div>
          )}
        </Card>
      )}
    </>
  );
};
