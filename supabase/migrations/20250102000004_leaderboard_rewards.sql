-- Add first place rewards system
-- This migration adds support for tracking first place winners and awarding 10,000 bonus points

-- Create leaderboard_seasons table to track competition periods
CREATE TABLE IF NOT EXISTS leaderboard_seasons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('upcoming', 'active', 'completed')),
  first_place_bonus_xp INTEGER DEFAULT 10000,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create leaderboard_winners table to track historical winners
CREATE TABLE IF NOT EXISTS leaderboard_winners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id UUID REFERENCES leaderboard_seasons(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rank INTEGER NOT NULL,
  final_xp INTEGER NOT NULL,
  bonus_xp INTEGER DEFAULT 0,
  awarded_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(season_id, rank)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_leaderboard_seasons_status ON leaderboard_seasons(status);
CREATE INDEX IF NOT EXISTS idx_leaderboard_winners_user_id ON leaderboard_winners(user_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_winners_season_id ON leaderboard_winners(season_id);

-- Add RLS policies
ALTER TABLE leaderboard_seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_winners ENABLE ROW LEVEL SECURITY;

-- Everyone can view seasons and winners
CREATE POLICY "Seasons are viewable by everyone"
  ON leaderboard_seasons FOR SELECT
  USING (true);

CREATE POLICY "Winners are viewable by everyone"
  ON leaderboard_winners FOR SELECT
  USING (true);

-- Function to award first place bonus
CREATE OR REPLACE FUNCTION award_first_place_bonus(
  p_season_id UUID,
  p_user_id UUID,
  p_final_xp INTEGER
) RETURNS VOID AS $$
DECLARE
  v_bonus_xp INTEGER;
BEGIN
  -- Get the bonus XP for this season
  SELECT first_place_bonus_xp INTO v_bonus_xp
  FROM leaderboard_seasons
  WHERE id = p_season_id;

  -- Award the bonus to the user
  UPDATE user_xp
  SET 
    total_xp = total_xp + v_bonus_xp,
    level = FLOOR((total_xp + v_bonus_xp) / 100) + 1,
    updated_at = NOW()
  WHERE user_id = p_user_id;

  -- Record the winner
  INSERT INTO leaderboard_winners (season_id, user_id, rank, final_xp, bonus_xp)
  VALUES (p_season_id, p_user_id, 1, p_final_xp, v_bonus_xp)
  ON CONFLICT (season_id, rank) DO UPDATE
  SET user_id = p_user_id, final_xp = p_final_xp, bonus_xp = v_bonus_xp, awarded_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Create a default ongoing season
INSERT INTO leaderboard_seasons (name, start_date, end_date, status, first_place_bonus_xp)
VALUES (
  'Season 1 - Grand Launch',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '90 days',
  'active',
  10000
)
ON CONFLICT DO NOTHING;
