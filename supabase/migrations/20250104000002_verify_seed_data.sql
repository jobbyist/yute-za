-- ============================================
-- Seed Data Verification Script
-- ============================================
-- This script provides queries to verify that seed data was loaded correctly
-- Run these queries to check data population across all tables

-- ============================================
-- Summary Statistics
-- ============================================

-- Count of records in each table
SELECT 
  'profiles' as table_name, 
  COUNT(*) as record_count 
FROM profiles
UNION ALL
SELECT 
  'stokie_circles', 
  COUNT(*) 
FROM stokie_circles
UNION ALL
SELECT 
  'circle_members', 
  COUNT(*) 
FROM circle_members
UNION ALL
SELECT 
  'contributions', 
  COUNT(*) 
FROM contributions
UNION ALL
SELECT 
  'circle_messages', 
  COUNT(*) 
FROM circle_messages
UNION ALL
SELECT 
  'payout_proposals', 
  COUNT(*) 
FROM payout_proposals
UNION ALL
SELECT 
  'payout_votes', 
  COUNT(*) 
FROM payout_votes
UNION ALL
SELECT 
  'user_xp', 
  COUNT(*) 
FROM user_xp
UNION ALL
SELECT 
  'user_course_progress', 
  COUNT(*) 
FROM user_course_progress
UNION ALL
SELECT 
  'user_badges', 
  COUNT(*) 
FROM user_badges
UNION ALL
SELECT 
  'circle_invites', 
  COUNT(*) 
FROM circle_invites
UNION ALL
SELECT 
  'notifications', 
  COUNT(*) 
FROM notifications
UNION ALL
SELECT 
  'learning_paths', 
  COUNT(*) 
FROM learning_paths
UNION ALL
SELECT 
  'courses', 
  COUNT(*) 
FROM courses
ORDER BY table_name;

-- ============================================
-- Detailed Verification Queries
-- ============================================

-- View seeded circles with member counts
SELECT 
  sc.name as circle_name,
  sc.payout_type,
  sc.target_amount,
  sc.current_amount,
  sc.is_private,
  sc.status,
  COUNT(DISTINCT cm.user_id) as member_count
FROM stokie_circles sc
LEFT JOIN circle_members cm ON sc.id = cm.circle_id
GROUP BY sc.id, sc.name, sc.payout_type, sc.target_amount, sc.current_amount, sc.is_private, sc.status
ORDER BY member_count DESC;

-- View user learning progress summary
SELECT 
  p.full_name,
  ux.level,
  ux.total_xp,
  ux.current_streak_days,
  COUNT(DISTINCT ucp.course_id) as courses_started,
  COUNT(DISTINCT CASE WHEN ucp.is_completed THEN ucp.course_id END) as courses_completed,
  COUNT(DISTINCT ub.badge_id) as badges_earned
FROM profiles p
LEFT JOIN user_xp ux ON p.id = ux.user_id
LEFT JOIN user_course_progress ucp ON p.id = ucp.user_id
LEFT JOIN user_badges ub ON p.id = ub.user_id
GROUP BY p.id, p.full_name, ux.level, ux.total_xp, ux.current_streak_days
ORDER BY ux.total_xp DESC NULLS LAST;

-- View contribution summary by circle
SELECT 
  sc.name as circle_name,
  COUNT(*) as total_contributions,
  SUM(c.amount) as total_amount,
  COUNT(CASE WHEN c.payment_status = 'completed' THEN 1 END) as completed_count,
  COUNT(CASE WHEN c.payment_status = 'pending' THEN 1 END) as pending_count,
  SUM(CASE WHEN c.payment_status = 'completed' THEN c.amount ELSE 0 END) as completed_amount
FROM stokie_circles sc
LEFT JOIN contributions c ON sc.id = c.circle_id
GROUP BY sc.id, sc.name
HAVING COUNT(*) > 0
ORDER BY total_amount DESC;

-- View active payout proposals with vote counts
SELECT 
  pp.id,
  sc.name as circle_name,
  p.full_name as recipient,
  pp.amount,
  pp.proposal_type,
  pp.status,
  pp.votes_approve,
  pp.votes_reject,
  pp.votes_abstain,
  pp.votes_required,
  pp.voting_deadline
FROM payout_proposals pp
JOIN stokie_circles sc ON pp.circle_id = sc.id
JOIN profiles p ON pp.recipient_id = p.id
ORDER BY pp.created_at DESC;

-- View recent circle messages
SELECT 
  sc.name as circle_name,
  p.full_name as author,
  cm.message,
  cm.created_at
FROM circle_messages cm
JOIN stokie_circles sc ON cm.circle_id = sc.id
JOIN profiles p ON cm.user_id = p.id
ORDER BY cm.created_at DESC
LIMIT 20;

-- View badge distribution
SELECT 
  b.name as badge_name,
  b.badge_type,
  COUNT(DISTINCT ub.user_id) as users_earned
FROM badges b
LEFT JOIN user_badges ub ON b.id = ub.badge_id
GROUP BY b.id, b.name, b.badge_type
ORDER BY users_earned DESC;

-- View notification summary
SELECT 
  category,
  status,
  COUNT(*) as count
FROM notifications
GROUP BY category, status
ORDER BY category, status;
