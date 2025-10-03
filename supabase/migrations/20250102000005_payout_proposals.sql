-- Add payout proposals table for voting system

-- Create payout_proposals table
CREATE TABLE IF NOT EXISTS payout_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id UUID NOT NULL REFERENCES stokie_circles(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  proposed_by_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  reason TEXT NOT NULL,
  proposal_type TEXT NOT NULL DEFAULT 'rotating' CHECK (proposal_type IN ('rotating', 'emergency', 'goal_reached')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
  votes_required INTEGER NOT NULL,
  votes_approve INTEGER DEFAULT 0,
  votes_reject INTEGER DEFAULT 0,
  votes_abstain INTEGER DEFAULT 0,
  voting_deadline TIMESTAMPTZ NOT NULL,
  executed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_payout_proposals_circle_id ON payout_proposals(circle_id);
CREATE INDEX IF NOT EXISTS idx_payout_proposals_status ON payout_proposals(status);
CREATE INDEX IF NOT EXISTS idx_payout_proposals_recipient_id ON payout_proposals(recipient_id);

-- Add RLS policies
ALTER TABLE payout_proposals ENABLE ROW LEVEL SECURITY;

-- Circle members can view proposals for their circles
CREATE POLICY "Circle members can view proposals"
  ON payout_proposals FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM circle_members 
      WHERE circle_id = payout_proposals.circle_id 
      AND user_id = auth.uid() 
      AND is_active = true
    )
  );

-- Circle admins and creators can create proposals
CREATE POLICY "Circle admins can create proposals"
  ON payout_proposals FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM circle_members 
      WHERE circle_id = payout_proposals.circle_id 
      AND user_id = auth.uid() 
      AND role IN ('creator', 'admin')
      AND is_active = true
    )
  );

-- Proposers can update their own proposals before voting starts
CREATE POLICY "Proposers can update their proposals"
  ON payout_proposals FOR UPDATE
  USING (proposed_by_id = auth.uid() AND status = 'pending');

-- Update payout_votes to reference payout_proposals
ALTER TABLE payout_votes DROP CONSTRAINT IF EXISTS payout_votes_payout_proposal_id_check;
ALTER TABLE payout_votes ADD CONSTRAINT payout_votes_proposal_id_fkey 
  FOREIGN KEY (payout_proposal_id) REFERENCES payout_proposals(id) ON DELETE CASCADE;

-- Function to update vote counts
CREATE OR REPLACE FUNCTION update_proposal_vote_counts()
RETURNS TRIGGER AS $$
BEGIN
  -- Update vote counts on the proposal
  UPDATE payout_proposals
  SET
    votes_approve = (
      SELECT COUNT(*) FROM payout_votes 
      WHERE payout_proposal_id = NEW.payout_proposal_id 
      AND vote_type = 'approve'
    ),
    votes_reject = (
      SELECT COUNT(*) FROM payout_votes 
      WHERE payout_proposal_id = NEW.payout_proposal_id 
      AND vote_type = 'reject'
    ),
    votes_abstain = (
      SELECT COUNT(*) FROM payout_votes 
      WHERE payout_proposal_id = NEW.payout_proposal_id 
      AND vote_type = 'abstain'
    ),
    updated_at = NOW()
  WHERE id = NEW.payout_proposal_id;

  -- Check if proposal should be approved/rejected
  DECLARE
    v_votes_required INTEGER;
    v_votes_approve INTEGER;
    v_votes_reject INTEGER;
  BEGIN
    SELECT votes_required, votes_approve, votes_reject 
    INTO v_votes_required, v_votes_approve, v_votes_reject
    FROM payout_proposals
    WHERE id = NEW.payout_proposal_id;

    -- If majority approve, mark as approved
    IF v_votes_approve >= (v_votes_required / 2 + 1) THEN
      UPDATE payout_proposals
      SET status = 'approved', updated_at = NOW()
      WHERE id = NEW.payout_proposal_id AND status = 'pending';
    -- If majority reject, mark as rejected
    ELSIF v_votes_reject >= (v_votes_required / 2 + 1) THEN
      UPDATE payout_proposals
      SET status = 'rejected', updated_at = NOW()
      WHERE id = NEW.payout_proposal_id AND status = 'pending';
    END IF;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for vote counts
DROP TRIGGER IF EXISTS trigger_update_proposal_vote_counts ON payout_votes;
CREATE TRIGGER trigger_update_proposal_vote_counts
  AFTER INSERT OR UPDATE ON payout_votes
  FOR EACH ROW
  EXECUTE FUNCTION update_proposal_vote_counts();

-- Add trigger to update updated_at timestamp
CREATE TRIGGER update_payout_proposals_updated_at
  BEFORE UPDATE ON payout_proposals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
