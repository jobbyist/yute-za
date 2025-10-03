-- Seed sample stokie circles (10 circles - mix of private and public)

INSERT INTO stokie_circles (
  name, 
  description, 
  goal_description, 
  target_amount, 
  current_amount, 
  monthly_contribution, 
  is_private, 
  creator_id, 
  payout_type, 
  next_payout_date, 
  status
) 
SELECT 
  name,
  description,
  goal_description,
  target_amount,
  current_amount,
  monthly_contribution,
  is_private,
  (SELECT id FROM auth.users LIMIT 1),
  payout_type,
  next_payout_date,
  status
FROM (VALUES
  -- Public Circles
  (
    'December Holiday Fund 2025',
    'Saving together for an amazing December holiday celebration with family and friends.',
    'Pool funds for December festivities, gifts, and family gatherings',
    120000.00,
    45000.00,
    2000.00,
    false,
    'rotating',
    '2025-12-01'::DATE,
    'active'
  ),
  (
    'Startup Capital Squad',
    'Young entrepreneurs pooling resources to fund business ideas and support each other.',
    'Generate seed capital for member business ventures',
    250000.00,
    87500.00,
    5000.00,
    false,
    'lump_sum',
    '2026-03-15'::DATE,
    'active'
  ),
  (
    'Property Investment Circle',
    'Working together to invest in rental property and build passive income.',
    'Raise down payment for investment property',
    500000.00,
    125000.00,
    10000.00,
    false,
    'lump_sum',
    '2026-06-30'::DATE,
    'active'
  ),
  (
    'Back to School Savings',
    'Parents saving for school fees, uniforms, and supplies for the new year.',
    'Cover back-to-school expenses for all members',
    60000.00,
    22000.00,
    1500.00,
    false,
    'rotating',
    '2026-01-05'::DATE,
    'active'
  ),
  (
    'Wedding Fund Warriors',
    'Planning ahead for dream weddings without the debt.',
    'Save for wedding expenses and celebrations',
    180000.00,
    54000.00,
    3000.00,
    false,
    'rotating',
    '2025-12-15'::DATE,
    'active'
  ),
  (
    'Emergency Fund Collective',
    'Building financial safety nets together for unexpected life events.',
    'Create emergency fund buffer for all members',
    90000.00,
    31500.00,
    1500.00,
    false,
    'rotating',
    '2025-11-01'::DATE,
    'active'
  ),
  
  -- Private Circles
  (
    'The Inner Circle Investment Club',
    'Exclusive investment group focusing on JSE stocks and cryptocurrency.',
    'Build diversified investment portfolio',
    1000000.00,
    350000.00,
    20000.00,
    true,
    'lump_sum',
    '2026-12-31'::DATE,
    'active'
  ),
  (
    'Family Legacy Fund',
    'Close family members building generational wealth together.',
    'Establish family trust and investment fund',
    750000.00,
    187500.00,
    12500.00,
    true,
    'lump_sum',
    '2027-06-30'::DATE,
    'active'
  ),
  (
    'Elite Tech Professionals Network',
    'Tech workers saving for property and investment opportunities.',
    'Pool resources for property development project',
    2000000.00,
    500000.00,
    25000.00,
    true,
    'lump_sum',
    '2027-12-31'::DATE,
    'active'
  ),
  (
    'University Alumni Fund',
    'Trusted alumni creating opportunities for current students.',
    'Provide bursaries and business loans to students',
    300000.00,
    105000.00,
    7500.00,
    true,
    'rotating',
    '2026-02-01'::DATE,
    'active'
  )
) AS circles(
  name, 
  description, 
  goal_description, 
  target_amount, 
  current_amount, 
  monthly_contribution, 
  is_private, 
  payout_type, 
  next_payout_date, 
  status
)
WHERE NOT EXISTS (
  SELECT 1 FROM stokie_circles WHERE name = circles.name
);
