import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { DigitalWallet } from "@/components/DigitalWallet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface ProfileData {
  full_name: string;
  date_of_birth: string;
  phone_number: string;
  email: string;
}

interface UserSubscription {
  tier: string;
  status: string;
}

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [profile, setProfile] = useState<ProfileData>({
    full_name: "",
    date_of_birth: "",
    phone_number: "",
    email: "",
  });

  const fetchSubscription = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("user_subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data) {
        setSubscription(data);
      } else {
        // Create default free subscription if it doesn't exist
        const { data: newSub, error: createError } = await supabase
          .from("user_subscriptions")
          .insert({ user_id: user.id, tier: "free" })
          .select()
          .single();

        if (createError) throw createError;
        setSubscription(newSub);
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
    }
  }, [user]);

  const fetchProfile = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data) {
        setProfile({
          full_name: data.full_name || "",
          date_of_birth: data.date_of_birth || "",
          phone_number: data.phone_number || "",
          email: data.email || user.email || "",
        });
      } else {
        setProfile({
          full_name: "",
          date_of_birth: "",
          phone_number: "",
          email: user.email || "",
        });
      }
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchSubscription();
    }
  }, [user, fetchProfile, fetchSubscription]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          full_name: profile.full_name,
          date_of_birth: profile.date_of_birth,
          phone_number: profile.phone_number,
          email: profile.email,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your profile has been updated.",
      });
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    try {
      // Delete user profile data (POPIA compliance - right to erasure)
      const { error: profileError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", user.id);

      if (profileError) throw profileError;

      // Delete user subscription data
      const { error: subscriptionError } = await supabase
        .from("user_subscriptions")
        .delete()
        .eq("user_id", user.id);

      if (subscriptionError) throw subscriptionError;

      // Delete auth user account
      const { error: authError } = await supabase.auth.admin.deleteUser(user.id);

      if (authError) {
        console.error("Auth deletion error:", authError);
      }

      toast({
        title: "Account Deleted",
        description: "Your account and all associated data have been permanently deleted in compliance with POPIA regulations.",
      });

      await signOut();
      navigate("/");
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete account",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="pt-24 pb-16 px-4 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
        <div className="container mx-auto max-w-4xl">
          <Card className="p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
              <p className="text-muted-foreground">
                Manage your personal information and digital wallet
              </p>
            </div>

            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="wallet">
                  Digital Wallet
                  {subscription && (subscription.tier === "pro" || subscription.tier === "elite") && (
                    <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                      {subscription.tier.toUpperCase()}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      type="text"
                      placeholder="John Doe"
                      value={profile.full_name}
                      onChange={(e) =>
                        setProfile({ ...profile, full_name: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                    <Input
                      id="date_of_birth"
                      type="date"
                      value={profile.date_of_birth}
                      onChange={(e) =>
                        setProfile({ ...profile, date_of_birth: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone_number">Phone Number</Label>
                    <Input
                      id="phone_number"
                      type="tel"
                      placeholder="+27 XX XXX XXXX"
                      value={profile.phone_number}
                      onChange={(e) =>
                        setProfile({ ...profile, phone_number: e.target.value })
                      }
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" disabled={saving} className="flex-1">
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleSignOut}
                    >
                      Sign Out
                    </Button>
                  </div>

                  {/* Account Deletion Section - POPIA Compliance */}
                  <div className="pt-8 mt-8 border-t border-destructive/20">
                    <h3 className="text-lg font-semibold text-destructive mb-2">Danger Zone</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Permanently delete your account and all associated data. This action cannot be undone and complies with POPIA (Protection of Personal Information Act) regulations.
                    </p>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" type="button">
                          Delete My Account
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account and remove all your data from our servers in compliance with POPIA regulations. All your financial profiles, progress, and personal information will be erased.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Yes, Delete My Account
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="wallet" className="space-y-6">
                {subscription && (subscription.tier === "pro" || subscription.tier === "elite") ? (
                  <DigitalWallet />
                ) : (
                  <Card className="p-8 text-center">
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold">Upgrade to Access Digital Wallet</h3>
                      <p className="text-muted-foreground">
                        Digital Wallet is available for Pro and Elite subscribers
                      </p>
                      <Button onClick={() => toast({
                        title: "Upgrade support",
                        description: "Please contact support and we’ll help you switch to Pro or Elite.",
                      })}>
                        Upgrade to Pro
                      </Button>
                    </div>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
