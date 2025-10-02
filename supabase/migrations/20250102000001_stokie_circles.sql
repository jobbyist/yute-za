-- Phase 2: Stokie Circles Database Schema

-- Create stokie_circles table
CREATE TABLE IF NOT EXISTS stokie_circles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  goal_description TEXT NOT NULL,
  target_amount DECIMAL(12, 2) NOT NULL,
  current_amount DECIMAL(12, 2) DEFAULT 0,
  monthly_contribution DECIMAL(10, 2) NOT NULL,
  is_private BOOLEAN DEFAULT false,
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  payout_type TEXT NOT NULL CHECK (payout_type IN ('rotating', 'lump_sum')),
  next_payout_date DATE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create circle_members table
CREATE TABLE IF NOT EXISTS circle_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id UUID NOT NULL REFERENCES stokie_circles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('creator', 'admin', 'member')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  UNIQUE(circle_id, user_id)
);

-- Create contributions table
CREATE TABLE IF NOT EXISTS contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id UUID NOT NULL REFERENCES stokie_circles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  contribution_date TIMESTAMPTZ DEFAULT NOW(),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_reference TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create circle_messages table
CREATE TABLE IF NOT EXISTS circle_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id UUID NOT NULL REFERENCES stokie_circles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create payout_votes table
CREATE TABLE IF NOT EXISTS payout_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id UUID NOT NULL REFERENCES stokie_circles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('approve', 'reject', 'abstain')),
  payout_proposal_id UUID NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(circle_id, user_id, payout_proposal_id)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_circle_members_circle_id ON circle_members(circle_id);
CREATE INDEX IF NOT EXISTS idx_circle_members_user_id ON circle_members(user_id);
CREATE INDEX IF NOT EXISTS idx_contributions_circle_id ON contributions(circle_id);
CREATE INDEX IF NOT EXISTS idx_contributions_user_id ON contributions(user_id);
CREATE INDEX IF NOT EXISTS idx_circle_messages_circle_id ON circle_messages(circle_id);
CREATE INDEX IF NOT EXISTS idx_payout_votes_circle_id ON payout_votes(circle_id);

-- Add RLS (Row Level Security) policies
ALTER TABLE stokie_circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE circle_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE circle_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE payout_votes ENABLE ROW LEVEL SECURITY;

-- Policies for stokie_circles
CREATE POLICY "Public circles are viewable by everyone"
  ON stokie_circles FOR SELECT
  USING (is_private = false OR auth.uid() IN (
    SELECT user_id FROM circle_members WHERE circle_id = stokie_circles.id
  ));

CREATE POLICY "Users can create circles"
  ON stokie_circles FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Only creators can update circles"
  ON stokie_circles FOR UPDATE
  USING (auth.uid() = creator_id);

-- Policies for circle_members
CREATE POLICY "Circle members are viewable by circle members"
  ON circle_members FOR SELECT
  USING (auth.uid() IN (
    SELECT user_id FROM circle_members WHERE circle_id = circle_members.circle_id
  ));

CREATE POLICY "Users can join public circles"
  ON circle_members FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND (
      EXISTS (SELECT 1 FROM stokie_circles WHERE id = circle_id AND is_private = false)
      OR EXISTS (SELECT 1 FROM circle_members WHERE circle_id = circle_members.circle_id AND role IN ('creator', 'admin'))
    )
  );

-- Policies for contributions
CREATE POLICY "Contributions are viewable by circle members"
  ON contributions FOR SELECT
  USING (auth.uid() IN (
    SELECT user_id FROM circle_members WHERE circle_id = contributions.circle_id
  ));

CREATE POLICY "Circle members can add contributions"
  ON contributions FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (SELECT 1 FROM circle_members WHERE circle_id = contributions.circle_id AND user_id = auth.uid() AND is_active = true)
  );

-- Policies for circle_messages
CREATE POLICY "Messages are viewable by circle members"
  ON circle_messages FOR SELECT
  USING (auth.uid() IN (
    SELECT user_id FROM circle_members WHERE circle_id = circle_messages.circle_id
  ));

CREATE POLICY "Circle members can post messages"
  ON circle_messages FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (SELECT 1 FROM circle_members WHERE circle_id = circle_messages.circle_id AND user_id = auth.uid() AND is_active = true)
  );

-- Policies for payout_votes
CREATE POLICY "Votes are viewable by circle members"
  ON payout_votes FOR SELECT
  USING (auth.uid() IN (
    SELECT user_id FROM circle_members WHERE circle_id = payout_votes.circle_id
  ));

CREATE POLICY "Circle members can vote"
  ON payout_votes FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (SELECT 1 FROM circle_members WHERE circle_id = payout_votes.circle_id AND user_id = auth.uid() AND is_active = true)
  );

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_stokie_circles_updated_at
  BEFORE UPDATE ON stokie_circles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_circle_messages_updated_at
  BEFORE UPDATE ON circle_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
