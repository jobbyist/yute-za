-- Phase 3: YUTE Academy & Learning Platform Database Schema

-- Create learning_paths table
CREATE TABLE IF NOT EXISTS learning_paths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  difficulty_level TEXT NOT NULL CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  tier TEXT NOT NULL CHECK (tier IN ('free', 'pro', 'elite')),
  icon TEXT,
  color TEXT,
  estimated_duration_hours INTEGER,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  learning_path_id UUID NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content_type TEXT NOT NULL CHECK (content_type IN ('video', 'audio', 'text', 'quiz', 'interactive')),
  content_url TEXT,
  duration_minutes INTEGER,
  sort_order INTEGER DEFAULT 0,
  xp_reward INTEGER DEFAULT 10,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_course_progress table
CREATE TABLE IF NOT EXISTS user_course_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  learning_path_id UUID NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
  quiz_score INTEGER,
  time_spent_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Create badges table
CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  badge_type TEXT NOT NULL CHECK (badge_type IN ('achievement', 'milestone', 'special')),
  criteria_type TEXT NOT NULL CHECK (criteria_type IN ('courses_completed', 'xp_earned', 'streak_days', 'perfect_quiz')),
  criteria_value INTEGER NOT NULL,
  xp_bonus INTEGER DEFAULT 0,
  tier TEXT CHECK (tier IN ('free', 'pro', 'elite')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_badges table
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- Create user_xp table
CREATE TABLE IF NOT EXISTS user_xp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  current_streak_days INTEGER DEFAULT 0,
  longest_streak_days INTEGER DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_courses_learning_path_id ON courses(learning_path_id);
CREATE INDEX IF NOT EXISTS idx_user_course_progress_user_id ON user_course_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_course_progress_course_id ON user_course_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_xp_user_id ON user_xp(user_id);

-- Add RLS (Row Level Security) policies
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_xp ENABLE ROW LEVEL SECURITY;

-- Policies for learning_paths
CREATE POLICY "Published learning paths are viewable by everyone"
  ON learning_paths FOR SELECT
  USING (is_published = true);

-- Policies for courses
CREATE POLICY "Published courses are viewable by everyone"
  ON courses FOR SELECT
  USING (is_published = true);

-- Policies for user_course_progress
CREATE POLICY "Users can view their own progress"
  ON user_course_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON user_course_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON user_course_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Policies for badges
CREATE POLICY "Badges are viewable by everyone"
  ON badges FOR SELECT
  USING (true);

-- Policies for user_badges
CREATE POLICY "Users can view their own badges"
  ON user_badges FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can earn badges"
  ON user_badges FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policies for user_xp
CREATE POLICY "Users can view their own XP"
  ON user_xp FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view leaderboard"
  ON user_xp FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own XP"
  ON user_xp FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own XP"
  ON user_xp FOR UPDATE
  USING (auth.uid() = user_id);

-- Add triggers to update updated_at timestamp
CREATE TRIGGER update_learning_paths_updated_at
  BEFORE UPDATE ON learning_paths
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_course_progress_updated_at
  BEFORE UPDATE ON user_course_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_xp_updated_at
  BEFORE UPDATE ON user_xp
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert initial learning paths
INSERT INTO learning_paths (name, description, difficulty_level, tier, icon, color, estimated_duration_hours, sort_order, is_published)
VALUES 
  ('The Rookie Investor', 'Start your investment journey with the basics. Learn about stocks, bonds, and building your first portfolio.', 'beginner', 'free', '🎯', '#10b981', 8, 1, true),
  ('The Side-Hustle Starter', 'Turn your skills into income. Learn how to start and scale a successful side business.', 'intermediate', 'pro', '💼', '#f59e0b', 12, 2, true),
  ('The Crypto Connoisseur', 'Master the world of cryptocurrency. From Bitcoin basics to DeFi and NFTs.', 'advanced', 'elite', '₿', '#8b5cf6', 15, 3, true);

-- Insert initial badges
INSERT INTO badges (name, description, icon, badge_type, criteria_type, criteria_value, xp_bonus, tier)
VALUES 
  ('First Steps', 'Complete your first course', '🌟', 'achievement', 'courses_completed', 1, 50, 'free'),
  ('Knowledge Seeker', 'Complete 5 courses', '📚', 'achievement', 'courses_completed', 5, 100, 'free'),
  ('Learning Master', 'Complete 10 courses', '🎓', 'milestone', 'courses_completed', 10, 200, 'pro'),
  ('XP Champion', 'Earn 1000 XP', '⚡', 'milestone', 'xp_earned', 1000, 150, 'pro'),
  ('Perfect Score', 'Get 100% on a quiz', '💯', 'special', 'perfect_quiz', 100, 75, 'free'),
  ('Streak Master', 'Maintain a 7-day learning streak', '🔥', 'special', 'streak_days', 7, 100, 'free');
