-- Add notification system for Email, SMS, and Push notifications

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('email', 'sms', 'push', 'in_app')),
  category TEXT NOT NULL CHECK (category IN ('circle_invite', 'payout_proposal', 'payout_approved', 'course_completed', 'badge_earned', 'level_up', 'message', 'contribution', 'leaderboard')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'read')),
  sent_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user notification preferences
CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_enabled BOOLEAN DEFAULT true,
  sms_enabled BOOLEAN DEFAULT false,
  push_enabled BOOLEAN DEFAULT true,
  in_app_enabled BOOLEAN DEFAULT true,
  circle_invites BOOLEAN DEFAULT true,
  payout_proposals BOOLEAN DEFAULT true,
  course_updates BOOLEAN DEFAULT true,
  badge_achievements BOOLEAN DEFAULT true,
  messages BOOLEAN DEFAULT true,
  leaderboard_updates BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_notification_preferences_user_id ON notification_preferences(user_id);

-- Add RLS policies
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

-- Users can only view their own notifications
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

-- Users can mark their notifications as read
CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid());

-- Users can view and update their own preferences
CREATE POLICY "Users can view their own preferences"
  ON notification_preferences FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own preferences"
  ON notification_preferences FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own preferences"
  ON notification_preferences FOR UPDATE
  USING (user_id = auth.uid());

-- Function to create notification
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_type TEXT,
  p_category TEXT,
  p_title TEXT,
  p_message TEXT,
  p_data JSONB DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_notification_id UUID;
  v_prefs RECORD;
BEGIN
  -- Get user preferences
  SELECT * INTO v_prefs
  FROM notification_preferences
  WHERE user_id = p_user_id;

  -- If no preferences exist, create default ones
  IF v_prefs IS NULL THEN
    INSERT INTO notification_preferences (user_id)
    VALUES (p_user_id)
    RETURNING * INTO v_prefs;
  END IF;

  -- Check if user wants this type of notification
  IF (p_type = 'email' AND NOT v_prefs.email_enabled) OR
     (p_type = 'sms' AND NOT v_prefs.sms_enabled) OR
     (p_type = 'push' AND NOT v_prefs.push_enabled) OR
     (p_type = 'in_app' AND NOT v_prefs.in_app_enabled) THEN
    RETURN NULL;
  END IF;

  -- Create notification
  INSERT INTO notifications (user_id, type, category, title, message, data)
  VALUES (p_user_id, p_type, p_category, p_title, p_message, p_data)
  RETURNING id INTO v_notification_id;

  RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql;

-- Function to send notification on circle invite
CREATE OR REPLACE FUNCTION notify_circle_invite()
RETURNS TRIGGER AS $$
DECLARE
  v_circle_name TEXT;
  v_inviter_name TEXT;
BEGIN
  -- Get circle and inviter details
  SELECT name INTO v_circle_name
  FROM stokie_circles
  WHERE id = NEW.circle_id;

  SELECT full_name INTO v_inviter_name
  FROM profiles
  WHERE id = NEW.invited_by_id;

  -- Create notification if user exists
  IF NEW.invited_user_id IS NOT NULL THEN
    PERFORM create_notification(
      NEW.invited_user_id,
      'in_app',
      'circle_invite',
      'Circle Invitation',
      format('%s invited you to join %s', COALESCE(v_inviter_name, 'Someone'), v_circle_name),
      jsonb_build_object(
        'circle_id', NEW.circle_id,
        'invite_code', NEW.invite_code
      )
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for circle invites
DROP TRIGGER IF EXISTS trigger_notify_circle_invite ON circle_invites;
CREATE TRIGGER trigger_notify_circle_invite
  AFTER INSERT ON circle_invites
  FOR EACH ROW
  EXECUTE FUNCTION notify_circle_invite();

-- Add triggers to update updated_at
CREATE TRIGGER update_notifications_updated_at
  BEFORE UPDATE ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_preferences_updated_at
  BEFORE UPDATE ON notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
