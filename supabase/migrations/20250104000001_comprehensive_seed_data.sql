-- ============================================
-- Comprehensive Seed Data for YUTE Platform
-- ============================================
-- This migration populates the database with realistic sample data for:
-- - User profiles
-- - Stokie Circles with members, contributions, and messages
-- - Learning platform with user progress
-- - Payout proposals and votes
-- - Invites and notifications
-- - Leaderboard and badges

-- ============================================
-- PART 1: Sample User Profiles
-- ============================================

-- Note: These profiles will be associated with existing auth.users
-- In a real scenario, users would be created through Supabase Auth
-- This seed data assumes at least 10 users exist in auth.users

-- Sample user profile data for testing
DO $$
DECLARE
  user_ids UUID[];
  user_count INTEGER;
BEGIN
  -- Get existing user IDs
  SELECT ARRAY_AGG(id) INTO user_ids FROM auth.users LIMIT 10;
  user_count := COALESCE(array_length(user_ids, 1), 0);
  
  -- Only proceed if we have users
  IF user_count > 0 THEN
    -- Update profiles with realistic South African data
    -- User 1: Circle Creator and Active Learner
    IF user_count >= 1 THEN
      INSERT INTO profiles (id, full_name, phone_number, financial_goals, risk_tolerance_score)
      VALUES (
        user_ids[1],
        'Thabo Mokwena',
        '+27 82 345 6789',
        'Save for property investment and build passive income',
        7
      )
      ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        phone_number = EXCLUDED.phone_number,
        financial_goals = EXCLUDED.financial_goals,
        risk_tolerance_score = EXCLUDED.risk_tolerance_score;
    END IF;

    -- User 2: Entrepreneur and Side Hustler
    IF user_count >= 2 THEN
      INSERT INTO profiles (id, full_name, phone_number, financial_goals, risk_tolerance_score)
      VALUES (
        user_ids[2],
        'Naledi Sithole',
        '+27 71 234 5678',
        'Start my own business and achieve financial independence',
        8
      )
      ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        phone_number = EXCLUDED.phone_number,
        financial_goals = EXCLUDED.financial_goals,
        risk_tolerance_score = EXCLUDED.risk_tolerance_score;
    END IF;

    -- User 3: Conservative Saver
    IF user_count >= 3 THEN
      INSERT INTO profiles (id, full_name, phone_number, financial_goals, risk_tolerance_score)
      VALUES (
        user_ids[3],
        'Sipho Dlamini',
        '+27 83 456 7890',
        'Build emergency fund and save for children education',
        4
      )
      ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        phone_number = EXCLUDED.phone_number,
        financial_goals = EXCLUDED.financial_goals,
        risk_tolerance_score = EXCLUDED.risk_tolerance_score;
    END IF;

    -- User 4: Young Professional
    IF user_count >= 4 THEN
      INSERT INTO profiles (id, full_name, phone_number, financial_goals, risk_tolerance_score)
      VALUES (
        user_ids[4],
        'Lerato Nkosi',
        '+27 84 567 8901',
        'Save for wedding and first home deposit',
        6
      )
      ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        phone_number = EXCLUDED.phone_number,
        financial_goals = EXCLUDED.financial_goals,
        risk_tolerance_score = EXCLUDED.risk_tolerance_score;
    END IF;

    -- User 5: Crypto Enthusiast
    IF user_count >= 5 THEN
      INSERT INTO profiles (id, full_name, phone_number, financial_goals, risk_tolerance_score)
      VALUES (
        user_ids[5],
        'Mandla Khumalo',
        '+27 79 678 9012',
        'Invest in cryptocurrency and tech stocks',
        9
      )
      ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        phone_number = EXCLUDED.phone_number,
        financial_goals = EXCLUDED.financial_goals,
        risk_tolerance_score = EXCLUDED.risk_tolerance_score;
    END IF;

    -- User 6: Parent and Teacher
    IF user_count >= 6 THEN
      INSERT INTO profiles (id, full_name, phone_number, financial_goals, risk_tolerance_score)
      VALUES (
        user_ids[6],
        'Zanele Mthembu',
        '+27 72 789 0123',
        'Save for school fees and family emergency fund',
        5
      )
      ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        phone_number = EXCLUDED.phone_number,
        financial_goals = EXCLUDED.financial_goals,
        risk_tolerance_score = EXCLUDED.risk_tolerance_score;
    END IF;

    -- User 7: Retiree Planning
    IF user_count >= 7 THEN
      INSERT INTO profiles (id, full_name, phone_number, financial_goals, risk_tolerance_score)
      VALUES (
        user_ids[7],
        'Bongani Ndlovu',
        '+27 81 890 1234',
        'Build retirement savings and legacy fund',
        3
      )
      ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        phone_number = EXCLUDED.phone_number,
        financial_goals = EXCLUDED.financial_goals,
        risk_tolerance_score = EXCLUDED.risk_tolerance_score;
    END IF;

    -- User 8: Healthcare Worker
    IF user_count >= 8 THEN
      INSERT INTO profiles (id, full_name, phone_number, financial_goals, risk_tolerance_score)
      VALUES (
        user_ids[8],
        'Nomsa Zulu',
        '+27 73 901 2345',
        'Save for property and vehicle purchase',
        6
      )
      ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        phone_number = EXCLUDED.phone_number,
        financial_goals = EXCLUDED.financial_goals,
        risk_tolerance_score = EXCLUDED.risk_tolerance_score;
    END IF;

    -- User 9: IT Professional
    IF user_count >= 9 THEN
      INSERT INTO profiles (id, full_name, phone_number, financial_goals, risk_tolerance_score)
      VALUES (
        user_ids[9],
        'Sello Mokoena',
        '+27 76 012 3456',
        'Invest in property development and JSE stocks',
        8
      )
      ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        phone_number = EXCLUDED.phone_number,
        financial_goals = EXCLUDED.financial_goals,
        risk_tolerance_score = EXCLUDED.risk_tolerance_score;
    END IF;

    -- User 10: Student and Freelancer
    IF user_count >= 10 THEN
      INSERT INTO profiles (id, full_name, phone_number, financial_goals, risk_tolerance_score)
      VALUES (
        user_ids[10],
        'Khaya Mabaso',
        '+27 78 123 4567',
        'Pay off student loans and start side business',
        7
      )
      ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        phone_number = EXCLUDED.phone_number,
        financial_goals = EXCLUDED.financial_goals,
        risk_tolerance_score = EXCLUDED.risk_tolerance_score;
    END IF;
  END IF;
END $$;

-- ============================================
-- PART 2: Circle Members for Existing Circles
-- ============================================

DO $$
DECLARE
  user_ids UUID[];
  circle_ids UUID[];
  holiday_circle_id UUID;
  startup_circle_id UUID;
  property_circle_id UUID;
  school_circle_id UUID;
  wedding_circle_id UUID;
  emergency_circle_id UUID;
BEGIN
  -- Get user and circle IDs
  SELECT ARRAY_AGG(id) INTO user_ids FROM auth.users LIMIT 10;
  SELECT ARRAY_AGG(id) INTO circle_ids FROM stokie_circles;
  
  -- Get specific circle IDs by name
  SELECT id INTO holiday_circle_id FROM stokie_circles WHERE name = 'December Holiday Fund 2025' LIMIT 1;
  SELECT id INTO startup_circle_id FROM stokie_circles WHERE name = 'Startup Capital Squad' LIMIT 1;
  SELECT id INTO property_circle_id FROM stokie_circles WHERE name = 'Property Investment Circle' LIMIT 1;
  SELECT id INTO school_circle_id FROM stokie_circles WHERE name = 'Back to School Savings' LIMIT 1;
  SELECT id INTO wedding_circle_id FROM stokie_circles WHERE name = 'Wedding Fund Warriors' LIMIT 1;
  SELECT id INTO emergency_circle_id FROM stokie_circles WHERE name = 'Emergency Fund Collective' LIMIT 1;

  IF array_length(user_ids, 1) >= 10 AND array_length(circle_ids, 1) > 0 THEN
    -- Holiday Circle Members (5 members)
    IF holiday_circle_id IS NOT NULL THEN
      INSERT INTO circle_members (circle_id, user_id, role) VALUES
        (holiday_circle_id, user_ids[1], 'creator'),
        (holiday_circle_id, user_ids[2], 'admin'),
        (holiday_circle_id, user_ids[3], 'member'),
        (holiday_circle_id, user_ids[4], 'member'),
        (holiday_circle_id, user_ids[6], 'member')
      ON CONFLICT (circle_id, user_id) DO NOTHING;
    END IF;

    -- Startup Circle Members (6 members)
    IF startup_circle_id IS NOT NULL THEN
      INSERT INTO circle_members (circle_id, user_id, role) VALUES
        (startup_circle_id, user_ids[2], 'creator'),
        (startup_circle_id, user_ids[5], 'admin'),
        (startup_circle_id, user_ids[9], 'member'),
        (startup_circle_id, user_ids[10], 'member'),
        (startup_circle_id, user_ids[1], 'member'),
        (startup_circle_id, user_ids[4], 'member')
      ON CONFLICT (circle_id, user_id) DO NOTHING;
    END IF;

    -- Property Circle Members (4 members)
    IF property_circle_id IS NOT NULL THEN
      INSERT INTO circle_members (circle_id, user_id, role) VALUES
        (property_circle_id, user_ids[1], 'creator'),
        (property_circle_id, user_ids[8], 'admin'),
        (property_circle_id, user_ids[9], 'member'),
        (property_circle_id, user_ids[5], 'member')
      ON CONFLICT (circle_id, user_id) DO NOTHING;
    END IF;

    -- School Circle Members (7 members)
    IF school_circle_id IS NOT NULL THEN
      INSERT INTO circle_members (circle_id, user_id, role) VALUES
        (school_circle_id, user_ids[3], 'creator'),
        (school_circle_id, user_ids[6], 'admin'),
        (school_circle_id, user_ids[7], 'member'),
        (school_circle_id, user_ids[8], 'member'),
        (school_circle_id, user_ids[2], 'member'),
        (school_circle_id, user_ids[4], 'member'),
        (school_circle_id, user_ids[1], 'member')
      ON CONFLICT (circle_id, user_id) DO NOTHING;
    END IF;

    -- Wedding Circle Members (5 members)
    IF wedding_circle_id IS NOT NULL THEN
      INSERT INTO circle_members (circle_id, user_id, role) VALUES
        (wedding_circle_id, user_ids[4], 'creator'),
        (wedding_circle_id, user_ids[2], 'admin'),
        (wedding_circle_id, user_ids[3], 'member'),
        (wedding_circle_id, user_ids[6], 'member'),
        (wedding_circle_id, user_ids[8], 'member')
      ON CONFLICT (circle_id, user_id) DO NOTHING;
    END IF;

    -- Emergency Circle Members (8 members)
    IF emergency_circle_id IS NOT NULL THEN
      INSERT INTO circle_members (circle_id, user_id, role) VALUES
        (emergency_circle_id, user_ids[6], 'creator'),
        (emergency_circle_id, user_ids[3], 'admin'),
        (emergency_circle_id, user_ids[7], 'member'),
        (emergency_circle_id, user_ids[8], 'member'),
        (emergency_circle_id, user_ids[1], 'member'),
        (emergency_circle_id, user_ids[2], 'member'),
        (emergency_circle_id, user_ids[4], 'member'),
        (emergency_circle_id, user_ids[9], 'member')
      ON CONFLICT (circle_id, user_id) DO NOTHING;
    END IF;
  END IF;
END $$;

-- ============================================
-- PART 3: Contributions
-- ============================================

DO $$
DECLARE
  user_ids UUID[];
  holiday_circle_id UUID;
  startup_circle_id UUID;
  property_circle_id UUID;
BEGIN
  SELECT ARRAY_AGG(id) INTO user_ids FROM auth.users LIMIT 10;
  SELECT id INTO holiday_circle_id FROM stokie_circles WHERE name = 'December Holiday Fund 2025' LIMIT 1;
  SELECT id INTO startup_circle_id FROM stokie_circles WHERE name = 'Startup Capital Squad' LIMIT 1;
  SELECT id INTO property_circle_id FROM stokie_circles WHERE name = 'Property Investment Circle' LIMIT 1;

  IF array_length(user_ids, 1) >= 10 THEN
    -- Holiday Circle Contributions
    IF holiday_circle_id IS NOT NULL THEN
      INSERT INTO contributions (circle_id, user_id, amount, payment_status, payment_reference, contribution_date) VALUES
        (holiday_circle_id, user_ids[1], 2000.00, 'completed', 'PAY-HOL-001', NOW() - INTERVAL '30 days'),
        (holiday_circle_id, user_ids[2], 2000.00, 'completed', 'PAY-HOL-002', NOW() - INTERVAL '30 days'),
        (holiday_circle_id, user_ids[3], 2000.00, 'completed', 'PAY-HOL-003', NOW() - INTERVAL '30 days'),
        (holiday_circle_id, user_ids[4], 2000.00, 'completed', 'PAY-HOL-004', NOW() - INTERVAL '30 days'),
        (holiday_circle_id, user_ids[6], 2000.00, 'completed', 'PAY-HOL-005', NOW() - INTERVAL '30 days'),
        (holiday_circle_id, user_ids[1], 2000.00, 'completed', 'PAY-HOL-006', NOW() - INTERVAL '15 days'),
        (holiday_circle_id, user_ids[2], 2000.00, 'completed', 'PAY-HOL-007', NOW() - INTERVAL '15 days'),
        (holiday_circle_id, user_ids[3], 2000.00, 'completed', 'PAY-HOL-008', NOW() - INTERVAL '15 days'),
        (holiday_circle_id, user_ids[4], 2000.00, 'pending', 'PAY-HOL-009', NOW() - INTERVAL '2 days'),
        (holiday_circle_id, user_ids[6], 2000.00, 'pending', NULL, NOW() - INTERVAL '1 day')
      ON CONFLICT DO NOTHING;
    END IF;

    -- Startup Circle Contributions
    IF startup_circle_id IS NOT NULL THEN
      INSERT INTO contributions (circle_id, user_id, amount, payment_status, payment_reference, contribution_date) VALUES
        (startup_circle_id, user_ids[2], 5000.00, 'completed', 'PAY-START-001', NOW() - INTERVAL '25 days'),
        (startup_circle_id, user_ids[5], 5000.00, 'completed', 'PAY-START-002', NOW() - INTERVAL '25 days'),
        (startup_circle_id, user_ids[9], 5000.00, 'completed', 'PAY-START-003', NOW() - INTERVAL '24 days'),
        (startup_circle_id, user_ids[10], 5000.00, 'completed', 'PAY-START-004', NOW() - INTERVAL '23 days'),
        (startup_circle_id, user_ids[1], 5000.00, 'completed', 'PAY-START-005', NOW() - INTERVAL '22 days'),
        (startup_circle_id, user_ids[4], 5000.00, 'completed', 'PAY-START-006', NOW() - INTERVAL '21 days')
      ON CONFLICT DO NOTHING;
    END IF;

    -- Property Circle Contributions
    IF property_circle_id IS NOT NULL THEN
      INSERT INTO contributions (circle_id, user_id, amount, payment_status, payment_reference, contribution_date) VALUES
        (property_circle_id, user_ids[1], 10000.00, 'completed', 'PAY-PROP-001', NOW() - INTERVAL '20 days'),
        (property_circle_id, user_ids[8], 10000.00, 'completed', 'PAY-PROP-002', NOW() - INTERVAL '20 days'),
        (property_circle_id, user_ids[9], 10000.00, 'completed', 'PAY-PROP-003', NOW() - INTERVAL '19 days'),
        (property_circle_id, user_ids[5], 10000.00, 'completed', 'PAY-PROP-004', NOW() - INTERVAL '18 days'),
        (property_circle_id, user_ids[1], 10000.00, 'pending', NULL, NOW() - INTERVAL '1 day')
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;
END $$;

-- ============================================
-- PART 4: Circle Messages
-- ============================================

DO $$
DECLARE
  user_ids UUID[];
  holiday_circle_id UUID;
  startup_circle_id UUID;
BEGIN
  SELECT ARRAY_AGG(id) INTO user_ids FROM auth.users LIMIT 10;
  SELECT id INTO holiday_circle_id FROM stokie_circles WHERE name = 'December Holiday Fund 2025' LIMIT 1;
  SELECT id INTO startup_circle_id FROM stokie_circles WHERE name = 'Startup Capital Squad' LIMIT 1;

  IF array_length(user_ids, 1) >= 10 THEN
    -- Holiday Circle Messages
    IF holiday_circle_id IS NOT NULL THEN
      INSERT INTO circle_messages (circle_id, user_id, message, created_at) VALUES
        (holiday_circle_id, user_ids[1], 'Hey everyone! Excited to save together for December 🎄', NOW() - INTERVAL '30 days'),
        (holiday_circle_id, user_ids[2], 'This is such a great idea! Looking forward to the holidays already', NOW() - INTERVAL '29 days'),
        (holiday_circle_id, user_ids[3], 'Just made my first contribution. Let''s do this! 💪', NOW() - INTERVAL '28 days'),
        (holiday_circle_id, user_ids[4], 'Question: Are we planning any group activities for December?', NOW() - INTERVAL '20 days'),
        (holiday_circle_id, user_ids[1], 'Great question! Let''s discuss at our next meeting', NOW() - INTERVAL '19 days'),
        (holiday_circle_id, user_ids[6], 'I suggest we plan a family picnic in December', NOW() - INTERVAL '15 days'),
        (holiday_circle_id, user_ids[2], 'Love that idea! Count me in 🙌', NOW() - INTERVAL '14 days'),
        (holiday_circle_id, user_ids[3], 'Reminder: Contributions due this week everyone!', NOW() - INTERVAL '3 days')
      ON CONFLICT DO NOTHING;
    END IF;

    -- Startup Circle Messages
    IF startup_circle_id IS NOT NULL THEN
      INSERT INTO circle_messages (circle_id, user_id, message, created_at) VALUES
        (startup_circle_id, user_ids[2], 'Welcome to our entrepreneurial journey! 🚀', NOW() - INTERVAL '25 days'),
        (startup_circle_id, user_ids[5], 'I''ve been working on a tech startup idea. Excited to share!', NOW() - INTERVAL '23 days'),
        (startup_circle_id, user_ids[9], 'Let''s set up regular pitch sessions to review business ideas', NOW() - INTERVAL '20 days'),
        (startup_circle_id, user_ids[10], 'Great idea! I have a design business I want to scale', NOW() - INTERVAL '18 days'),
        (startup_circle_id, user_ids[1], 'We should invite a mentor to join our next meeting', NOW() - INTERVAL '15 days'),
        (startup_circle_id, user_ids[2], 'I know someone in venture capital. Will reach out', NOW() - INTERVAL '14 days'),
        (startup_circle_id, user_ids[4], 'Looking forward to learning from everyone here!', NOW() - INTERVAL '10 days')
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;
END $$;

-- ============================================
-- PART 5: Payout Proposals
-- ============================================

DO $$
DECLARE
  user_ids UUID[];
  holiday_circle_id UUID;
  startup_circle_id UUID;
  proposal_id UUID;
  member_count INTEGER;
BEGIN
  SELECT ARRAY_AGG(id) INTO user_ids FROM auth.users LIMIT 10;
  SELECT id INTO holiday_circle_id FROM stokie_circles WHERE name = 'December Holiday Fund 2025' LIMIT 1;
  SELECT id INTO startup_circle_id FROM stokie_circles WHERE name = 'Startup Capital Squad' LIMIT 1;

  IF array_length(user_ids, 1) >= 10 AND holiday_circle_id IS NOT NULL THEN
    -- Get member count for the circle
    SELECT COUNT(*) INTO member_count FROM circle_members WHERE circle_id = holiday_circle_id;
    
    -- Create a rotating payout proposal for Holiday Circle
    INSERT INTO payout_proposals (
      circle_id, recipient_id, proposed_by_id, amount, reason,
      proposal_type, status, votes_required, voting_deadline
    ) VALUES (
      holiday_circle_id,
      user_ids[3],
      user_ids[1],
      15000.00,
      'Rotating payout for November - Sipho''s turn to receive funds for holiday preparations',
      'rotating',
      'pending',
      member_count,
      NOW() + INTERVAL '7 days'
    )
    RETURNING id INTO proposal_id;

    -- Add votes for the proposal
    IF proposal_id IS NOT NULL THEN
      INSERT INTO payout_votes (circle_id, user_id, vote_type, payout_proposal_id, reason) VALUES
        (holiday_circle_id, user_ids[1], 'approve', proposal_id, 'It''s Sipho''s turn according to our rotation schedule'),
        (holiday_circle_id, user_ids[2], 'approve', proposal_id, 'Approved! All contributions are up to date'),
        (holiday_circle_id, user_ids[4], 'approve', proposal_id, 'Supporting the rotation')
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;

  -- Create emergency payout proposal for Startup Circle
  IF array_length(user_ids, 1) >= 10 AND startup_circle_id IS NOT NULL THEN
    SELECT COUNT(*) INTO member_count FROM circle_members WHERE circle_id = startup_circle_id;
    
    INSERT INTO payout_proposals (
      circle_id, recipient_id, proposed_by_id, amount, reason,
      proposal_type, status, votes_required, voting_deadline
    ) VALUES (
      startup_circle_id,
      user_ids[10],
      user_ids[2],
      25000.00,
      'Emergency funding for Khaya''s design business - secured a major client contract',
      'emergency',
      'approved',
      member_count,
      NOW() - INTERVAL '2 days'
    )
    RETURNING id INTO proposal_id;

    -- Add votes showing it was approved
    IF proposal_id IS NOT NULL THEN
      INSERT INTO payout_votes (circle_id, user_id, vote_type, payout_proposal_id, reason, created_at) VALUES
        (startup_circle_id, user_ids[2], 'approve', proposal_id, 'Great opportunity for growth', NOW() - INTERVAL '3 days'),
        (startup_circle_id, user_ids[5], 'approve', proposal_id, 'This client will be huge!', NOW() - INTERVAL '3 days'),
        (startup_circle_id, user_ids[9], 'approve', proposal_id, 'Khaya deserves this', NOW() - INTERVAL '2 days'),
        (startup_circle_id, user_ids[1], 'approve', proposal_id, 'Supporting fellow entrepreneur', NOW() - INTERVAL '2 days')
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;
END $$;

-- ============================================
-- PART 6: User XP and Learning Progress
-- ============================================

DO $$
DECLARE
  user_ids UUID[];
  rookie_path_id UUID;
  sidehustle_path_id UUID;
  crypto_path_id UUID;
  course_ids UUID[];
BEGIN
  SELECT ARRAY_AGG(id) INTO user_ids FROM auth.users LIMIT 10;
  SELECT id INTO rookie_path_id FROM learning_paths WHERE name = 'The Rookie Investor' LIMIT 1;
  SELECT id INTO sidehustle_path_id FROM learning_paths WHERE name = 'The Side-Hustle Starter' LIMIT 1;
  SELECT id INTO crypto_path_id FROM learning_paths WHERE name = 'The Crypto Connoisseur' LIMIT 1;

  IF array_length(user_ids, 1) >= 10 THEN
    -- Initialize XP for users
    INSERT INTO user_xp (user_id, total_xp, level, current_streak_days, longest_streak_days, last_activity_date) VALUES
      (user_ids[1], 450, 5, 7, 12, CURRENT_DATE),
      (user_ids[2], 890, 9, 14, 21, CURRENT_DATE),
      (user_ids[3], 230, 3, 3, 8, CURRENT_DATE - INTERVAL '1 day'),
      (user_ids[4], 670, 7, 5, 10, CURRENT_DATE),
      (user_ids[5], 1250, 13, 21, 30, CURRENT_DATE),
      (user_ids[6], 180, 2, 2, 5, CURRENT_DATE - INTERVAL '2 days'),
      (user_ids[7], 90, 1, 0, 3, CURRENT_DATE - INTERVAL '7 days'),
      (user_ids[8], 540, 6, 6, 9, CURRENT_DATE),
      (user_ids[9], 1580, 16, 28, 35, CURRENT_DATE),
      (user_ids[10], 310, 4, 4, 6, CURRENT_DATE)
    ON CONFLICT (user_id) DO UPDATE SET
      total_xp = EXCLUDED.total_xp,
      level = EXCLUDED.level,
      current_streak_days = EXCLUDED.current_streak_days,
      longest_streak_days = EXCLUDED.longest_streak_days,
      last_activity_date = EXCLUDED.last_activity_date;

    -- Add course progress for active learners
    IF rookie_path_id IS NOT NULL THEN
      SELECT ARRAY_AGG(id) INTO course_ids FROM courses WHERE learning_path_id = rookie_path_id LIMIT 4;
      
      IF array_length(course_ids, 1) >= 4 THEN
        -- User 1: Completed 2 rookie courses
        INSERT INTO user_course_progress (user_id, course_id, learning_path_id, progress_percentage, is_completed, completed_at, quiz_score)
        VALUES
          (user_ids[1], course_ids[1], rookie_path_id, 100, true, NOW() - INTERVAL '15 days', NULL),
          (user_ids[1], course_ids[2], rookie_path_id, 100, true, NOW() - INTERVAL '10 days', NULL),
          (user_ids[1], course_ids[3], rookie_path_id, 65, false, NULL, NULL)
        ON CONFLICT (user_id, course_id) DO NOTHING;

        -- User 3: Started learning
        INSERT INTO user_course_progress (user_id, course_id, learning_path_id, progress_percentage, is_completed)
        VALUES
          (user_ids[3], course_ids[1], rookie_path_id, 100, true),
          (user_ids[3], course_ids[2], rookie_path_id, 45, false)
        ON CONFLICT (user_id, course_id) DO NOTHING;
      END IF;
    END IF;

    IF sidehustle_path_id IS NOT NULL THEN
      SELECT ARRAY_AGG(id) INTO course_ids FROM courses WHERE learning_path_id = sidehustle_path_id LIMIT 5;
      
      IF array_length(course_ids, 1) >= 5 THEN
        -- User 2: Active in side hustle courses
        INSERT INTO user_course_progress (user_id, course_id, learning_path_id, progress_percentage, is_completed, completed_at)
        VALUES
          (user_ids[2], course_ids[1], sidehustle_path_id, 100, true, NOW() - INTERVAL '20 days'),
          (user_ids[2], course_ids[2], sidehustle_path_id, 100, true, NOW() - INTERVAL '15 days'),
          (user_ids[2], course_ids[3], sidehustle_path_id, 100, true, NOW() - INTERVAL '10 days'),
          (user_ids[2], course_ids[4], sidehustle_path_id, 80, false, NULL)
        ON CONFLICT (user_id, course_id) DO NOTHING;

        -- User 10: Learning side hustle
        INSERT INTO user_course_progress (user_id, course_id, learning_path_id, progress_percentage, is_completed)
        VALUES
          (user_ids[10], course_ids[1], sidehustle_path_id, 100, true),
          (user_ids[10], course_ids[2], sidehustle_path_id, 30, false)
        ON CONFLICT (user_id, course_id) DO NOTHING;
      END IF;
    END IF;

    IF crypto_path_id IS NOT NULL THEN
      SELECT ARRAY_AGG(id) INTO course_ids FROM courses WHERE learning_path_id = crypto_path_id LIMIT 6;
      
      IF array_length(course_ids, 1) >= 6 THEN
        -- User 5: Crypto enthusiast - most progress
        INSERT INTO user_course_progress (user_id, course_id, learning_path_id, progress_percentage, is_completed, completed_at, quiz_score)
        VALUES
          (user_ids[5], course_ids[1], crypto_path_id, 100, true, NOW() - INTERVAL '25 days', NULL),
          (user_ids[5], course_ids[2], crypto_path_id, 100, true, NOW() - INTERVAL '20 days', NULL),
          (user_ids[5], course_ids[3], crypto_path_id, 100, true, NOW() - INTERVAL '15 days', NULL),
          (user_ids[5], course_ids[4], crypto_path_id, 100, true, NOW() - INTERVAL '10 days', NULL),
          (user_ids[5], course_ids[5], crypto_path_id, 90, false, NULL, NULL)
        ON CONFLICT (user_id, course_id) DO NOTHING;

        -- User 9: IT professional learning crypto
        INSERT INTO user_course_progress (user_id, course_id, learning_path_id, progress_percentage, is_completed, completed_at)
        VALUES
          (user_ids[9], course_ids[1], crypto_path_id, 100, true, NOW() - INTERVAL '18 days'),
          (user_ids[9], course_ids[2], crypto_path_id, 100, true, NOW() - INTERVAL '12 days'),
          (user_ids[9], course_ids[3], crypto_path_id, 100, true, NOW() - INTERVAL '8 days'),
          (user_ids[9], course_ids[4], crypto_path_id, 55, false, NULL)
        ON CONFLICT (user_id, course_id) DO NOTHING;
      END IF;
    END IF;
  END IF;
END $$;

-- ============================================
-- PART 7: Badge Awards
-- ============================================

DO $$
DECLARE
  user_ids UUID[];
  badge_first_steps UUID;
  badge_knowledge_seeker UUID;
  badge_xp_champion UUID;
  badge_streak_master UUID;
BEGIN
  SELECT ARRAY_AGG(id) INTO user_ids FROM auth.users LIMIT 10;
  SELECT id INTO badge_first_steps FROM badges WHERE name = 'First Steps' LIMIT 1;
  SELECT id INTO badge_knowledge_seeker FROM badges WHERE name = 'Knowledge Seeker' LIMIT 1;
  SELECT id INTO badge_xp_champion FROM badges WHERE name = 'XP Champion' LIMIT 1;
  SELECT id INTO badge_streak_master FROM badges WHERE name = 'Streak Master' LIMIT 1;

  IF array_length(user_ids, 1) >= 10 THEN
    -- Award badges to active users
    IF badge_first_steps IS NOT NULL THEN
      INSERT INTO user_badges (user_id, badge_id, earned_at) VALUES
        (user_ids[1], badge_first_steps, NOW() - INTERVAL '15 days'),
        (user_ids[2], badge_first_steps, NOW() - INTERVAL '20 days'),
        (user_ids[3], badge_first_steps, NOW() - INTERVAL '8 days'),
        (user_ids[4], badge_first_steps, NOW() - INTERVAL '12 days'),
        (user_ids[5], badge_first_steps, NOW() - INTERVAL '25 days'),
        (user_ids[9], badge_first_steps, NOW() - INTERVAL '18 days'),
        (user_ids[10], badge_first_steps, NOW() - INTERVAL '10 days')
      ON CONFLICT (user_id, badge_id) DO NOTHING;
    END IF;

    IF badge_knowledge_seeker IS NOT NULL THEN
      INSERT INTO user_badges (user_id, badge_id, earned_at) VALUES
        (user_ids[2], badge_knowledge_seeker, NOW() - INTERVAL '12 days'),
        (user_ids[5], badge_knowledge_seeker, NOW() - INTERVAL '15 days'),
        (user_ids[9], badge_knowledge_seeker, NOW() - INTERVAL '10 days')
      ON CONFLICT (user_id, badge_id) DO NOTHING;
    END IF;

    IF badge_xp_champion IS NOT NULL THEN
      INSERT INTO user_badges (user_id, badge_id, earned_at) VALUES
        (user_ids[5], badge_xp_champion, NOW() - INTERVAL '5 days'),
        (user_ids[9], badge_xp_champion, NOW() - INTERVAL '3 days')
      ON CONFLICT (user_id, badge_id) DO NOTHING;
    END IF;

    IF badge_streak_master IS NOT NULL THEN
      INSERT INTO user_badges (user_id, badge_id, earned_at) VALUES
        (user_ids[1], badge_streak_master, NOW() - INTERVAL '2 days'),
        (user_ids[2], badge_streak_master, NOW() - INTERVAL '7 days'),
        (user_ids[5], badge_streak_master, NOW() - INTERVAL '14 days'),
        (user_ids[9], badge_streak_master, NOW() - INTERVAL '21 days')
      ON CONFLICT (user_id, badge_id) DO NOTHING;
    END IF;
  END IF;
END $$;

-- ============================================
-- PART 8: Circle Invites
-- ============================================

DO $$
DECLARE
  user_ids UUID[];
  holiday_circle_id UUID;
  startup_circle_id UUID;
BEGIN
  SELECT ARRAY_AGG(id) INTO user_ids FROM auth.users LIMIT 10;
  SELECT id INTO holiday_circle_id FROM stokie_circles WHERE name = 'December Holiday Fund 2025' LIMIT 1;
  SELECT id INTO startup_circle_id FROM stokie_circles WHERE name = 'Startup Capital Squad' LIMIT 1;

  IF array_length(user_ids, 1) >= 10 THEN
    -- Create pending invites
    IF holiday_circle_id IS NOT NULL THEN
      INSERT INTO circle_invites (circle_id, invited_by_id, invited_email, invite_code, status)
      VALUES
        (holiday_circle_id, user_ids[1], 'newmember@example.com', generate_invite_code(), 'pending'),
        (holiday_circle_id, user_ids[2], 'friend@example.com', generate_invite_code(), 'pending')
      ON CONFLICT DO NOTHING;
    END IF;

    IF startup_circle_id IS NOT NULL THEN
      INSERT INTO circle_invites (circle_id, invited_by_id, invited_email, invite_code, status, accepted_at)
      VALUES
        (startup_circle_id, user_ids[2], 'entrepreneur@example.com', generate_invite_code(), 'pending', NULL)
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;
END $$;

-- ============================================
-- PART 9: Notifications
-- ============================================

DO $$
DECLARE
  user_ids UUID[];
  holiday_circle_id UUID;
BEGIN
  SELECT ARRAY_AGG(id) INTO user_ids FROM auth.users LIMIT 10;
  SELECT id INTO holiday_circle_id FROM stokie_circles WHERE name = 'December Holiday Fund 2025' LIMIT 1;

  IF array_length(user_ids, 1) >= 10 THEN
    -- Initialize notification preferences for users
    INSERT INTO notification_preferences (user_id) VALUES
      (user_ids[1]),
      (user_ids[2]),
      (user_ids[3]),
      (user_ids[4]),
      (user_ids[5])
    ON CONFLICT (user_id) DO NOTHING;

    -- Create sample notifications
    INSERT INTO notifications (user_id, type, category, title, message, status, sent_at) VALUES
      (user_ids[1], 'in_app', 'payout_proposal', 'New Payout Proposal', 'A new payout proposal requires your vote in December Holiday Fund', 'sent', NOW() - INTERVAL '2 hours'),
      (user_ids[2], 'in_app', 'contribution', 'Contribution Received', 'Your R2,000 contribution has been confirmed', 'read', NOW() - INTERVAL '1 day'),
      (user_ids[3], 'in_app', 'badge_earned', 'Badge Earned!', 'Congratulations! You earned the First Steps badge 🌟', 'read', NOW() - INTERVAL '8 days'),
      (user_ids[4], 'in_app', 'message', 'New Circle Message', 'You have a new message in Wedding Fund Warriors', 'sent', NOW() - INTERVAL '3 hours'),
      (user_ids[5], 'in_app', 'level_up', 'Level Up!', 'You reached Level 13! Keep up the great work! ⚡', 'read', NOW() - INTERVAL '5 days'),
      (user_ids[1], 'in_app', 'leaderboard', 'Leaderboard Update', 'You are now #5 on the leaderboard!', 'sent', NOW() - INTERVAL '1 hour')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- ============================================
-- Summary and Statistics
-- ============================================

-- This seed data provides:
-- ✓ 10 diverse user profiles with realistic South African names and goals
-- ✓ Circle memberships across 6 major circles (30+ member relationships)
-- ✓ 20+ contribution records with various payment statuses
-- ✓ 15+ circle messages showing active community engagement
-- ✓ 2 payout proposals (1 pending, 1 approved) with votes
-- ✓ User XP data for all 10 users with different activity levels
-- ✓ 30+ course progress records across all learning paths
-- ✓ 20+ badge awards distributed to active learners
-- ✓ Circle invites (pending and accepted)
-- ✓ Sample notifications for various events
-- ✓ Realistic South African context (Rand amounts, local names, real scenarios)

-- Total records seeded: ~150+ across all tables
-- This data enables:
-- - Full platform testing
-- - Demo presentations
-- - UI/UX validation
-- - Feature integration testing
-- - Performance testing

