-- Digital Wallet System for Stitch Money API Integration
-- Support for Pro and Elite subscription users

-- Create subscription tiers table if not exists
CREATE TABLE IF NOT EXISTS subscription_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE CHECK (name IN ('free', 'pro', 'elite')),
  price_monthly DECIMAL(10,2) NOT NULL,
  features JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert subscription tiers
INSERT INTO subscription_tiers (name, price_monthly, features) VALUES
  ('free', 0, '{"wallet": false, "academy_access": "basic", "circles": 3}'::jsonb),
  ('pro', 99, '{"wallet": true, "academy_access": "full", "circles": 10, "ebooks": false}'::jsonb),
  ('elite', 199, '{"wallet": true, "academy_access": "full", "circles": "unlimited", "ebooks": true}'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- User subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'pro', 'elite')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription"
  ON user_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscription"
  ON user_subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription"
  ON user_subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

-- Digital wallets table
CREATE TABLE IF NOT EXISTS digital_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  balance DECIMAL(12,2) DEFAULT 0.00 CHECK (balance >= 0),
  stitch_wallet_id TEXT,
  stitch_account_id TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE digital_wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own wallet"
  ON digital_wallets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wallet"
  ON digital_wallets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own wallet"
  ON digital_wallets FOR UPDATE
  USING (auth.uid() = user_id);

-- Wallet transactions table
CREATE TABLE IF NOT EXISTS wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID REFERENCES digital_wallets(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('deposit', 'withdrawal', 'transfer_in', 'transfer_out', 'circle_contribution', 'circle_payout')),
  amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
  balance_before DECIMAL(12,2) NOT NULL,
  balance_after DECIMAL(12,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  stitch_transaction_id TEXT,
  reference_id UUID,
  reference_type TEXT CHECK (reference_type IN ('circle', 'contribution', 'payout')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
  ON wallet_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON wallet_transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Podcast episodes table
CREATE TABLE IF NOT EXISTS podcast_episodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  episode_number INTEGER NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  audio_file_path TEXT NOT NULL,
  duration_seconds INTEGER,
  ebook_price DECIMAL(10,2) DEFAULT 20.00,
  play_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  dislike_count INTEGER DEFAULT 0,
  published_date DATE DEFAULT CURRENT_DATE,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE podcast_episodes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published episodes"
  ON podcast_episodes FOR SELECT
  USING (is_published = true);

-- Podcast interactions table (likes/dislikes)
CREATE TABLE IF NOT EXISTS podcast_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  episode_id UUID REFERENCES podcast_episodes(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('like', 'dislike')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(episode_id, user_id)
);

ALTER TABLE podcast_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view interactions"
  ON podcast_interactions FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own interactions"
  ON podcast_interactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own interactions"
  ON podcast_interactions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own interactions"
  ON podcast_interactions FOR DELETE
  USING (auth.uid() = user_id);

-- Podcast comments table
CREATE TABLE IF NOT EXISTS podcast_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  episode_id UUID REFERENCES podcast_episodes(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  parent_comment_id UUID REFERENCES podcast_comments(id) ON DELETE CASCADE,
  comment_text TEXT NOT NULL,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE podcast_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view comments"
  ON podcast_comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can post comments"
  ON podcast_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
  ON podcast_comments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON podcast_comments FOR DELETE
  USING (auth.uid() = user_id);

-- Ebook purchases table
CREATE TABLE IF NOT EXISTS ebook_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  episode_id UUID REFERENCES podcast_episodes(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  purchase_price DECIMAL(10,2) NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  download_count INTEGER DEFAULT 0,
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(episode_id, user_id)
);

ALTER TABLE ebook_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own purchases"
  ON ebook_purchases FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own purchases"
  ON ebook_purchases FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_digital_wallets_user_id ON digital_wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_wallet_id ON wallet_transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_user_id ON wallet_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_podcast_comments_episode_id ON podcast_comments(episode_id);
CREATE INDEX IF NOT EXISTS idx_podcast_interactions_episode_id ON podcast_interactions(episode_id);
CREATE INDEX IF NOT EXISTS idx_ebook_purchases_user_id ON ebook_purchases(user_id);

-- Add triggers
CREATE TRIGGER update_digital_wallets_updated_at
  BEFORE UPDATE ON digital_wallets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_subscriptions_updated_at
  BEFORE UPDATE ON user_subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wallet_transactions_updated_at
  BEFORE UPDATE ON wallet_transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_podcast_episodes_updated_at
  BEFORE UPDATE ON podcast_episodes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_podcast_comments_updated_at
  BEFORE UPDATE ON podcast_comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial podcast episodes
INSERT INTO podcast_episodes (episode_number, title, description, audio_file_path, duration_seconds, ebook_price, published_date, is_published) VALUES
  (
    1, 
    'EP. 1 - From Broke to Boss - Budgeting, Side Hustles & Surviving ''Adulting'' in SA',
    'We dive into the real struggles of managing money in South Africa. From creating budgets that work to hustling on the side while keeping your sanity, this episode is packed with practical tips for young South Africans navigating financial independence.',
    '/EP. 1 - From Broke to Boss - Budgeting, Side Hustles & Surviving ''Adulting'' in SA.mp3',
    1800,
    20.00,
    '2025-01-06'::DATE,
    true
  ),
  (
    2,
    'EP. 2: Investment Vibe Check: From FOMO Spending to JSE Stacking - Your Guide to Investing in South Africa',
    'Stop scrolling through investment TikToks and start building real wealth. We break down how to get started on the JSE, understand ETFs, and stop letting FOMO control your wallet. Plus, we discuss why investing isn''t just for rich people.',
    '/EP. 2 - Investment Vibe Check - From FOMO Spending to JSE Stacking - Your Guide to Investing in South Africa.mp3',
    2100,
    20.00,
    '2025-01-08'::DATE,
    true
  ),
  (
    3,
    'EP. 3: The Financial Receipts - Navigating Debt, Credit Scores, and the Realities of ''Black Tax'' in Mzansi',
    'Let''s talk about the receipts nobody wants to show. From crushing student debt to understanding why your credit score matters, we''re keeping it 100. We also tackle the reality of Black Tax and how to support family without sacrificing your own financial future.',
    '/EP. 3 - The Financial Receipts - Navigating Debt, Credit Scores, and the Realities of ''Black Tax'' in Mzansi.mp3',
    1950,
    20.00,
    '2025-01-13'::DATE,
    true
  );
