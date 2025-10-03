-- Fix search_path in existing functions to prevent SQL injection
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'free');
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT role FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1;
$function$;

-- Function to check if user has completed course
CREATE OR REPLACE FUNCTION public.check_and_award_badges(p_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_total_xp INTEGER;
  v_courses_completed INTEGER;
  v_current_streak INTEGER;
BEGIN
  -- Get user stats
  SELECT COALESCE(total_xp, 0), COALESCE(current_streak_days, 0)
  INTO v_total_xp, v_current_streak
  FROM public.user_xp
  WHERE user_id = p_user_id;
  
  -- Get courses completed count
  SELECT COUNT(*)
  INTO v_courses_completed
  FROM public.user_course_progress
  WHERE user_id = p_user_id AND is_completed = true;
  
  -- Award XP-based badges
  IF v_total_xp >= 100 AND NOT EXISTS (
    SELECT 1 FROM public.user_badges ub
    JOIN public.badges b ON ub.badge_id = b.id
    WHERE ub.user_id = p_user_id AND b.criteria_type = 'xp' AND b.criteria_value = 100
  ) THEN
    INSERT INTO public.user_badges (user_id, badge_id)
    SELECT p_user_id, id FROM public.badges 
    WHERE criteria_type = 'xp' AND criteria_value = 100
    LIMIT 1;
  END IF;
  
  IF v_total_xp >= 500 AND NOT EXISTS (
    SELECT 1 FROM public.user_badges ub
    JOIN public.badges b ON ub.badge_id = b.id
    WHERE ub.user_id = p_user_id AND b.criteria_type = 'xp' AND b.criteria_value = 500
  ) THEN
    INSERT INTO public.user_badges (user_id, badge_id)
    SELECT p_user_id, id FROM public.badges 
    WHERE criteria_type = 'xp' AND criteria_value = 500
    LIMIT 1;
  END IF;
  
  -- Award course completion badges
  IF v_courses_completed >= 1 AND NOT EXISTS (
    SELECT 1 FROM public.user_badges ub
    JOIN public.badges b ON ub.badge_id = b.id
    WHERE ub.user_id = p_user_id AND b.criteria_type = 'courses_completed' AND b.criteria_value = 1
  ) THEN
    INSERT INTO public.user_badges (user_id, badge_id)
    SELECT p_user_id, id FROM public.badges 
    WHERE criteria_type = 'courses_completed' AND criteria_value = 1
    LIMIT 1;
  END IF;
  
  IF v_courses_completed >= 5 AND NOT EXISTS (
    SELECT 1 FROM public.user_badges ub
    JOIN public.badges b ON ub.badge_id = b.id
    WHERE ub.user_id = p_user_id AND b.criteria_type = 'courses_completed' AND b.criteria_value = 5
  ) THEN
    INSERT INTO public.user_badges (user_id, badge_id)
    SELECT p_user_id, id FROM public.badges 
    WHERE criteria_type = 'courses_completed' AND criteria_value = 5
    LIMIT 1;
  END IF;
  
  -- Award streak badges
  IF v_current_streak >= 7 AND NOT EXISTS (
    SELECT 1 FROM public.user_badges ub
    JOIN public.badges b ON ub.badge_id = b.id
    WHERE ub.user_id = p_user_id AND b.criteria_type = 'streak_days' AND b.criteria_value = 7
  ) THEN
    INSERT INTO public.user_badges (user_id, badge_id)
    SELECT p_user_id, id FROM public.badges 
    WHERE criteria_type = 'streak_days' AND criteria_value = 7
    LIMIT 1;
  END IF;
  
  IF v_current_streak >= 30 AND NOT EXISTS (
    SELECT 1 FROM public.user_badges ub
    JOIN public.badges b ON ub.badge_id = b.id
    WHERE ub.user_id = p_user_id AND b.criteria_type = 'streak_days' AND b.criteria_value = 30
  ) THEN
    INSERT INTO public.user_badges (user_id, badge_id)
    SELECT p_user_id, id FROM public.badges 
    WHERE criteria_type = 'streak_days' AND criteria_value = 30
    LIMIT 1;
  END IF;
END;
$function$;