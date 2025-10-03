import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  ArrowRightLeft,
  TrendingUp,
  Clock,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DigitalWalletData {
  id: string;
  balance: number;
  status: string;
}

interface Transaction {
  id: string;
  transaction_type: string;
  amount: number;
  status: string;
  created_at: string;
  notes: string;
}

export const DigitalWallet = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [wallet, setWallet] = useState<DigitalWalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [circleId, setCircleId] = useState("");

  useEffect(() => {
    if (user) {
      fetchWallet();
      fetchTransactions();
    }
  }, [user]);

  const fetchWallet = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("digital_wallets")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") throw error;

      if (data) {
        setWallet(data);
      } else {
        // Create wallet if it doesn't exist
        const { data: newWallet, error: createError } = await supabase
          .from("digital_wallets")
          .insert({ user_id: user.id })
          .select()
          .single();

        if (createError) throw createError;
        setWallet(newWallet);
      }
    } catch (error) {
      console.error("Error fetching wallet:", error);
      toast({
        title: "Error",
        description: "Failed to load wallet",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    if (!user || !wallet) return;

    try {
      const { data, error } = await supabase
        .from("wallet_transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const handleDeposit = async () => {
    if (!user || !wallet || !depositAmount) return;

    setProcessing(true);
    try {
      const amount = parseFloat(depositAmount);
      if (amount <= 0) {
        throw new Error("Amount must be greater than 0");
      }

      // In production, this would integrate with Stitch Money API
      // For now, we'll simulate the transaction
      const newBalance = parseFloat(wallet.balance.toString()) + amount;

      const { error: transactionError } = await supabase
        .from("wallet_transactions")
        .insert({
          wallet_id: wallet.id,
          user_id: user.id,
          transaction_type: "deposit",
          amount: amount,
          balance_before: wallet.balance,
          balance_after: newBalance,
          status: "completed",
          notes: "Deposit via Stitch Money API",
        });

      if (transactionError) throw transactionError;

      const { error: updateError } = await supabase
        .from("digital_wallets")
        .update({ balance: newBalance })
        .eq("id", wallet.id);

      if (updateError) throw updateError;

      toast({
        title: "Deposit Successful",
        description: `R${amount.toFixed(2)} has been added to your wallet`,
      });

      setDepositAmount("");
      await fetchWallet();
      await fetchTransactions();
    } catch (error) {
      console.error("Error processing deposit:", error);
      toast({
        title: "Deposit Failed",
        description: error instanceof Error ? error.message : "Failed to process deposit",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleWithdraw = async () => {
    if (!user || !wallet || !withdrawAmount) return;

    setProcessing(true);
    try {
      const amount = parseFloat(withdrawAmount);
      if (amount <= 0) {
        throw new Error("Amount must be greater than 0");
      }
      if (amount > parseFloat(wallet.balance.toString())) {
        throw new Error("Insufficient balance");
      }

      const newBalance = parseFloat(wallet.balance.toString()) - amount;

      const { error: transactionError } = await supabase
        .from("wallet_transactions")
        .insert({
          wallet_id: wallet.id,
          user_id: user.id,
          transaction_type: "withdrawal",
          amount: amount,
          balance_before: wallet.balance,
          balance_after: newBalance,
          status: "completed",
          notes: "Withdrawal to bank account via Stitch Money API",
        });

      if (transactionError) throw transactionError;

      const { error: updateError } = await supabase
        .from("digital_wallets")
        .update({ balance: newBalance })
        .eq("id", wallet.id);

      if (updateError) throw updateError;

      toast({
        title: "Withdrawal Successful",
        description: `R${amount.toFixed(2)} has been sent to your bank account`,
      });

      setWithdrawAmount("");
      await fetchWallet();
      await fetchTransactions();
    } catch (error) {
      console.error("Error processing withdrawal:", error);
      toast({
        title: "Withdrawal Failed",
        description: error instanceof Error ? error.message : "Failed to process withdrawal",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleTransfer = async () => {
    if (!user || !wallet || !transferAmount || !circleId) return;

    setProcessing(true);
    try {
      const amount = parseFloat(transferAmount);
      if (amount <= 0) {
        throw new Error("Amount must be greater than 0");
      }
      if (amount > parseFloat(wallet.balance.toString())) {
        throw new Error("Insufficient balance");
      }

      const newBalance = parseFloat(wallet.balance.toString()) - amount;

      const { error: transactionError } = await supabase
        .from("wallet_transactions")
        .insert({
          wallet_id: wallet.id,
          user_id: user.id,
          transaction_type: "transfer_out",
          amount: amount,
          balance_before: wallet.balance,
          balance_after: newBalance,
          status: "completed",
          reference_id: circleId,
          reference_type: "circle",
          notes: "Transfer to Stokie Circle",
        });

      if (transactionError) throw transactionError;

      const { error: updateError } = await supabase
        .from("digital_wallets")
        .update({ balance: newBalance })
        .eq("id", wallet.id);

      if (updateError) throw updateError;

      toast({
        title: "Transfer Successful",
        description: `R${amount.toFixed(2)} has been transferred to your circle`,
      });

      setTransferAmount("");
      setCircleId("");
      await fetchWallet();
      await fetchTransactions();
    } catch (error) {
      console.error("Error processing transfer:", error);
      toast({
        title: "Transfer Failed",
        description: error instanceof Error ? error.message : "Failed to process transfer",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
      case "transfer_in":
      case "circle_payout":
        return <ArrowDownCircle className="w-5 h-5 text-green-500" />;
      case "withdrawal":
      case "transfer_out":
      case "circle_contribution":
        return <ArrowUpCircle className="w-5 h-5 text-red-500" />;
      default:
        return <ArrowRightLeft className="w-5 h-5 text-blue-500" />;
    }
  };

  const formatTransactionType = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="text-center">Loading wallet...</div>
      </Card>
    );
  }

  if (!wallet) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Wallet Balance Card */}
      <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Digital Wallet</h3>
                <Badge variant="outline" className="mt-1">
                  {wallet.status}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Available Balance</p>
              <p className="text-3xl font-bold">
                R{parseFloat(wallet.balance.toString()).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <ArrowDownCircle className="w-4 h-4" />
                  Deposit
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Deposit Funds</DialogTitle>
                  <DialogDescription>
                    Add money to your digital wallet from your bank account
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="deposit-amount">Amount (R)</Label>
                    <Input
                      id="deposit-amount"
                      type="number"
                      placeholder="0.00"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <Button
                    onClick={handleDeposit}
                    disabled={processing || !depositAmount}
                    className="w-full"
                  >
                    {processing ? "Processing..." : "Deposit via Stitch Money"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <ArrowUpCircle className="w-4 h-4" />
                  Withdraw
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Withdraw Funds</DialogTitle>
                  <DialogDescription>
                    Transfer money from your wallet to your bank account
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="withdraw-amount">Amount (R)</Label>
                    <Input
                      id="withdraw-amount"
                      type="number"
                      placeholder="0.00"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <Button
                    onClick={handleWithdraw}
                    disabled={processing || !withdrawAmount}
                    className="w-full"
                  >
                    {processing ? "Processing..." : "Withdraw via Stitch Money"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary" className="gap-2">
                  <ArrowRightLeft className="w-4 h-4" />
                  Transfer
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Transfer to Circle</DialogTitle>
                  <DialogDescription>
                    Send money to your Stokie Circle or receive payouts
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="transfer-amount">Amount (R)</Label>
                    <Input
                      id="transfer-amount"
                      type="number"
                      placeholder="0.00"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="circle-id">Circle ID</Label>
                    <Input
                      id="circle-id"
                      type="text"
                      placeholder="Enter circle ID"
                      value={circleId}
                      onChange={(e) => setCircleId(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={handleTransfer}
                    disabled={processing || !transferAmount || !circleId}
                    className="w-full"
                  >
                    {processing ? "Processing..." : "Transfer"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </Card>

      {/* Recent Transactions */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Transactions
            </h3>
            <Badge variant="outline">
              <TrendingUp className="w-3 h-3 mr-1" />
              Last 10
            </Badge>
          </div>

          {transactions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No transactions yet
            </p>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getTransactionIcon(transaction.transaction_type)}
                    <div>
                      <p className="font-medium text-sm">
                        {formatTransactionType(transaction.transaction_type)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(transaction.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold ${
                        transaction.transaction_type.includes("deposit") ||
                        transaction.transaction_type.includes("in") ||
                        transaction.transaction_type.includes("payout")
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.transaction_type.includes("deposit") ||
                      transaction.transaction_type.includes("in") ||
                      transaction.transaction_type.includes("payout")
                        ? "+"
                        : "-"}
                      R{parseFloat(transaction.amount.toString()).toFixed(2)}
                    </p>
                    <Badge
                      variant={
                        transaction.status === "completed" ? "default" : "outline"
                      }
                      className="text-xs"
                    >
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
