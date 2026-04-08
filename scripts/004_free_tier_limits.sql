-- Free Tier Limits - Restrict free users to 1 active case
-- This is the viral acquisition engine - free users get hooked, then upgrade

-- Drop existing insert policy and create new one with limit
DROP POLICY IF EXISTS "cases_insert_own" ON public.cases;

-- New policy: Free users can only insert if they have less than 1 active case
-- Pro users can insert unlimited cases
CREATE POLICY "cases_insert_with_limit" ON public.cases 
FOR INSERT WITH CHECK (
  auth.uid() = user_id 
  AND (
    -- Pro users have no limit
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND subscription_tier IN ('pro_monthly', 'pro_annual', 'pro_lifetime')
    )
    OR
    -- Free users limited to 1 active case
    (
      SELECT COUNT(*) FROM public.cases 
      WHERE user_id = auth.uid() 
      AND status NOT IN ('closed', 'archived', 'withdrawn')
    ) < 1
  )
);

-- Add pro_lifetime to subscription tier check constraint
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_subscription_tier_check;

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_subscription_tier_check 
CHECK (subscription_tier IN ('free', 'pro_monthly', 'pro_annual', 'pro_lifetime', 'pro_one_time'));

-- Index for performance on case counting query
CREATE INDEX IF NOT EXISTS idx_cases_user_status ON public.cases(user_id, status);

-- Function to check if user can create more cases
CREATE OR REPLACE FUNCTION public.can_create_case(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_tier TEXT;
  active_case_count INTEGER;
BEGIN
  -- Get user's subscription tier
  SELECT subscription_tier INTO user_tier
  FROM public.profiles
  WHERE id = user_uuid;
  
  -- Pro users always return true
  IF user_tier IN ('pro_monthly', 'pro_annual', 'pro_lifetime', 'pro_one_time') THEN
    RETURN TRUE;
  END IF;
  
  -- Count active cases for free users
  SELECT COUNT(*) INTO active_case_count
  FROM public.cases
  WHERE user_id = user_uuid
  AND status NOT IN ('closed', 'archived', 'withdrawn');
  
  -- Free users can create if they have less than 1 active case
  RETURN active_case_count < 1;
END;
$$;

-- Function to get user's case limit info
CREATE OR REPLACE FUNCTION public.get_case_limit_info(user_uuid UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_tier TEXT;
  active_count INTEGER;
  max_cases INTEGER;
  can_create BOOLEAN;
BEGIN
  -- Get user's subscription tier
  SELECT subscription_tier INTO user_tier
  FROM public.profiles
  WHERE id = user_uuid;
  
  -- Count active cases
  SELECT COUNT(*) INTO active_count
  FROM public.cases
  WHERE user_id = user_uuid
  AND status NOT IN ('closed', 'archived', 'withdrawn');
  
  -- Determine max cases based on tier
  IF user_tier IN ('pro_monthly', 'pro_annual', 'pro_lifetime', 'pro_one_time') THEN
    max_cases := -1; -- Unlimited
    can_create := TRUE;
  ELSE
    max_cases := 1;
    can_create := active_count < 1;
  END IF;
  
  RETURN jsonb_build_object(
    'subscription_tier', user_tier,
    'active_cases', active_count,
    'max_cases', max_cases,
    'can_create_case', can_create,
    'is_pro', user_tier IN ('pro_monthly', 'pro_annual', 'pro_lifetime', 'pro_one_time')
  );
END;
$$;
