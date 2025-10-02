import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface CreateCircleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCircleCreated?: () => void;
}

export const CreateCircleDialog = ({
  open,
  onOpenChange,
  onCircleCreated,
}: CreateCircleDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    goal_description: "",
    target_amount: "",
    monthly_contribution: "",
    is_private: false,
    payout_type: "rotating" as "rotating" | "lump_sum",
    next_payout_date: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { data: circle, error: circleError } = await supabase
        .from("stokie_circles")
        .insert({
          name: formData.name,
          description: formData.description,
          goal_description: formData.goal_description,
          target_amount: parseFloat(formData.target_amount),
          monthly_contribution: parseFloat(formData.monthly_contribution),
          is_private: formData.is_private,
          creator_id: user.id,
          payout_type: formData.payout_type,
          next_payout_date: formData.next_payout_date || null,
        })
        .select()
        .single();

      if (circleError) throw circleError;

      // Add creator as a member with creator role
      const { error: memberError } = await supabase
        .from("circle_members")
        .insert({
          circle_id: circle.id,
          user_id: user.id,
          role: "creator",
        });

      if (memberError) throw memberError;

      toast({
        title: "Circle created!",
        description: "Your Stokie Circle has been created successfully.",
      });

      // Reset form
      setFormData({
        name: "",
        description: "",
        goal_description: "",
        target_amount: "",
        monthly_contribution: "",
        is_private: false,
        payout_type: "rotating",
        next_payout_date: "",
      });

      onOpenChange(false);
      onCircleCreated?.();
    } catch (error) {
      console.error("Error creating circle:", error);
      toast({
        title: "Error",
        description: "Failed to create circle. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create a Stokie Circle</DialogTitle>
          <DialogDescription>
            Set up your digital stokvel group. Fill in the details below to get
            started.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Circle Name *</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., December Holiday Fund"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Tell members what this circle is about..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal_description">Goal Description *</Label>
            <Input
              id="goal_description"
              required
              value={formData.goal_description}
              onChange={(e) =>
                setFormData({ ...formData, goal_description: e.target.value })
              }
              placeholder="e.g., December Payout, Emergency Fund"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target_amount">Target Amount (R) *</Label>
              <Input
                id="target_amount"
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.target_amount}
                onChange={(e) =>
                  setFormData({ ...formData, target_amount: e.target.value })
                }
                placeholder="50000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthly_contribution">
                Monthly Contribution (R) *
              </Label>
              <Input
                id="monthly_contribution"
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.monthly_contribution}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    monthly_contribution: e.target.value,
                  })
                }
                placeholder="500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="payout_type">Payout Type *</Label>
              <Select
                value={formData.payout_type}
                onValueChange={(value: "rotating" | "lump_sum") =>
                  setFormData({ ...formData, payout_type: value })
                }
              >
                <SelectTrigger id="payout_type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rotating">Rotating</SelectItem>
                  <SelectItem value="lump_sum">Lump Sum</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="next_payout_date">Next Payout Date</Label>
              <Input
                id="next_payout_date"
                type="date"
                value={formData.next_payout_date}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    next_payout_date: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_private"
              checked={formData.is_private}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_private: checked })
              }
            />
            <Label htmlFor="is_private" className="cursor-pointer">
              Make this circle private (invite-only)
            </Label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Circle"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
