-- Add invite system for private circles

-- Create circle_invites table
CREATE TABLE IF NOT EXISTS circle_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id UUID NOT NULL REFERENCES stokie_circles(id) ON DELETE CASCADE,
  invited_by_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invited_email TEXT NOT NULL,
  invited_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  invite_code TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'expired', 'cancelled')),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(circle_id, invited_email)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_circle_invites_circle_id ON circle_invites(circle_id);
CREATE INDEX IF NOT EXISTS idx_circle_invites_invited_email ON circle_invites(invited_email);
CREATE INDEX IF NOT EXISTS idx_circle_invites_invite_code ON circle_invites(invite_code);
CREATE INDEX IF NOT EXISTS idx_circle_invites_status ON circle_invites(status);

-- Add RLS policies
ALTER TABLE circle_invites ENABLE ROW LEVEL SECURITY;

-- Circle members can view invites for their circles
CREATE POLICY "Circle members can view invites"
  ON circle_invites FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM circle_members 
      WHERE circle_id = circle_invites.circle_id 
      AND user_id = auth.uid() 
      AND is_active = true
    )
    OR invited_user_id = auth.uid()
    OR invited_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- Circle admins and creators can create invites
CREATE POLICY "Circle admins can create invites"
  ON circle_invites FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM circle_members 
      WHERE circle_id = circle_invites.circle_id 
      AND user_id = auth.uid() 
      AND role IN ('creator', 'admin')
      AND is_active = true
    )
  );

-- Inviters can cancel their invites
CREATE POLICY "Inviters can update their invites"
  ON circle_invites FOR UPDATE
  USING (invited_by_id = auth.uid() OR invited_user_id = auth.uid());

-- Function to generate unique invite code
CREATE OR REPLACE FUNCTION generate_invite_code()
RETURNS TEXT AS $$
DECLARE
  v_code TEXT;
  v_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate random 8-character alphanumeric code
    v_code := upper(substring(md5(random()::text) from 1 for 8));
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM circle_invites WHERE invite_code = v_code) INTO v_exists;
    
    -- Exit loop if code is unique
    EXIT WHEN NOT v_exists;
  END LOOP;
  
  RETURN v_code;
END;
$$ LANGUAGE plpgsql;

-- Function to accept invite
CREATE OR REPLACE FUNCTION accept_circle_invite(
  p_invite_code TEXT
) RETURNS UUID AS $$
DECLARE
  v_invite_id UUID;
  v_circle_id UUID;
  v_user_id UUID;
  v_status TEXT;
  v_expires_at TIMESTAMPTZ;
BEGIN
  -- Get current user
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;

  -- Get invite details
  SELECT id, circle_id, status, expires_at
  INTO v_invite_id, v_circle_id, v_status, v_expires_at
  FROM circle_invites
  WHERE invite_code = p_invite_code
  AND (invited_user_id = v_user_id OR invited_email = (SELECT email FROM auth.users WHERE id = v_user_id));

  IF v_invite_id IS NULL THEN
    RAISE EXCEPTION 'Invite not found or not for this user';
  END IF;

  IF v_status != 'pending' THEN
    RAISE EXCEPTION 'Invite has already been %', v_status;
  END IF;

  IF v_expires_at < NOW() THEN
    -- Mark as expired
    UPDATE circle_invites
    SET status = 'expired', updated_at = NOW()
    WHERE id = v_invite_id;
    
    RAISE EXCEPTION 'Invite has expired';
  END IF;

  -- Add user to circle
  INSERT INTO circle_members (circle_id, user_id, role, is_active)
  VALUES (v_circle_id, v_user_id, 'member', true)
  ON CONFLICT (circle_id, user_id) DO UPDATE
  SET is_active = true, joined_at = NOW();

  -- Update invite status
  UPDATE circle_invites
  SET 
    status = 'accepted',
    accepted_at = NOW(),
    invited_user_id = v_user_id,
    updated_at = NOW()
  WHERE id = v_invite_id;

  RETURN v_circle_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add trigger to update updated_at timestamp
CREATE TRIGGER update_circle_invites_updated_at
  BEFORE UPDATE ON circle_invites
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
