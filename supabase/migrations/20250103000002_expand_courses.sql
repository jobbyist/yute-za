-- Expand course content with comprehensive educational material
-- Adding 5+ high-quality courses to each learning path

DO $$
DECLARE
  rookie_investor_id UUID;
  side_hustle_id UUID;
  crypto_id UUID;
BEGIN
  -- Get the learning path IDs
  SELECT id INTO rookie_investor_id FROM learning_paths WHERE name = 'The Rookie Investor';
  SELECT id INTO side_hustle_id FROM learning_paths WHERE name = 'The Side-Hustle Starter';
  SELECT id INTO crypto_id FROM learning_paths WHERE name = 'The Crypto Connoisseur';

  -- ============================================
  -- Additional courses for The Rookie Investor
  -- ============================================
  INSERT INTO courses (learning_path_id, title, description, content_type, duration_minutes, sort_order, xp_reward, is_published) VALUES
    (rookie_investor_id, 'Understanding the JSE', 'Deep dive into the Johannesburg Stock Exchange - how it works and how to start investing.', 'video', 18, 8, 20, true),
    (rookie_investor_id, 'ETFs vs Unit Trusts', 'Compare different investment vehicles available to South African investors.', 'text', 15, 9, 15, true),
    (rookie_investor_id, 'Tax-Free Savings Accounts', 'Maximize your returns with TFSAs - contribution limits, benefits, and strategies.', 'video', 14, 10, 15, true),
    (rookie_investor_id, 'Retirement Annuities 101', 'Understanding RAs and how they fit into your long-term wealth plan.', 'audio', 16, 11, 15, true),
    (rookie_investor_id, 'Property as an Investment', 'Real estate investing in South Africa - REITs, rental properties, and more.', 'video', 20, 12, 20, true),
    (rookie_investor_id, 'Dollar Cost Averaging', 'Learn how consistent investing beats trying to time the market.', 'interactive', 12, 13, 15, true),
    (rookie_investor_id, 'Reading Financial Statements', 'Analyze company financials to make informed investment decisions.', 'text', 22, 14, 20, true),
    (rookie_investor_id, 'Investment Psychology', 'Master your emotions and avoid common investor mistakes.', 'video', 16, 15, 15, true),
    (rookie_investor_id, 'Advanced Portfolio Strategies', 'Rebalancing, tax-loss harvesting, and optimizing your portfolio.', 'video', 18, 16, 20, true),
    (rookie_investor_id, 'Investment Mastery Quiz', 'Final comprehensive test of your investment knowledge.', 'quiz', 15, 17, 30, true);

  -- ============================================
  -- Additional courses for The Side-Hustle Starter
  -- ============================================
  INSERT INTO courses (learning_path_id, title, description, content_type, duration_minutes, sort_order, xp_reward, is_published) VALUES
    (side_hustle_id, 'Building Your Personal Brand', 'Create a compelling brand identity that attracts customers.', 'video', 16, 9, 20, true),
    (side_hustle_id, 'Social Media Marketing Strategy', 'Leverage Instagram, TikTok, and Facebook to grow your business.', 'interactive', 18, 10, 20, true),
    (side_hustle_id, 'Content Creation on a Budget', 'Create professional content with just your smartphone.', 'video', 14, 11, 15, true),
    (side_hustle_id, 'Customer Service Excellence', 'Build loyal customers through exceptional service.', 'audio', 12, 12, 15, true),
    (side_hustle_id, 'Financial Record Keeping', 'Essential bookkeeping for side hustlers - track income and expenses.', 'text', 15, 13, 15, true),
    (side_hustle_id, 'Tax Obligations for Side Hustlers', 'Understanding SARS requirements and staying compliant.', 'video', 16, 14, 20, true),
    (side_hustle_id, 'Negotiation Skills', 'Get paid what you\'re worth - master the art of negotiation.', 'video', 14, 15, 15, true),
    (side_hustle_id, 'Automation and Systems', 'Work smarter, not harder - automate repetitive tasks.', 'interactive', 17, 16, 20, true),
    (side_hustle_id, 'When to Go Full-Time', 'Know when it\'s time to quit your day job and scale.', 'text', 13, 17, 15, true),
    (side_hustle_id, 'Building a Team', 'Hire your first employees or contractors successfully.', 'video', 15, 18, 20, true),
    (side_hustle_id, 'Entrepreneurship Excellence Quiz', 'Test your side hustle mastery.', 'quiz', 15, 19, 35, true);

  -- ============================================
  -- Additional courses for The Crypto Connoisseur
  -- ============================================
  INSERT INTO courses (learning_path_id, title, description, content_type, duration_minutes, sort_order, xp_reward, is_published) VALUES
    (crypto_id, 'Advanced Blockchain Concepts', 'Consensus mechanisms, Layer 2 solutions, and scalability.', 'video', 22, 10, 25, true),
    (crypto_id, 'Altcoins Worth Watching', 'Evaluate alternative cryptocurrencies beyond Bitcoin and Ethereum.', 'video', 18, 11, 25, true),
    (crypto_id, 'Yield Farming and Staking', 'Earn passive income from your crypto holdings.', 'interactive', 20, 12, 25, true),
    (crypto_id, 'Crypto Wallet Deep Dive', 'Hardware wallets, software wallets, and best security practices.', 'text', 16, 13, 20, true),
    (crypto_id, 'Reading Crypto Charts', 'Technical analysis for cryptocurrency trading.', 'video', 19, 14, 25, true),
    (crypto_id, 'Spotting Scams and Rug Pulls', 'Protect yourself from crypto fraud and bad actors.', 'video', 15, 15, 20, true),
    (crypto_id, 'DAOs and Governance', 'Decentralized Autonomous Organizations - the future of collaboration.', 'video', 17, 16, 25, true),
    (crypto_id, 'The Metaverse and Web3', 'Understanding the next evolution of the internet.', 'video', 18, 17, 25, true),
    (crypto_id, 'Crypto Portfolio Management', 'Diversification strategies for digital assets.', 'interactive', 16, 18, 25, true),
    (crypto_id, 'South African Crypto Exchanges', 'Local platforms like Luno, VALR, and Ice3X - pros and cons.', 'text', 14, 19, 20, true),
    (crypto_id, 'Building on Blockchain', 'Introduction to smart contract development.', 'video', 24, 20, 30, true),
    (crypto_id, 'Crypto Master Quiz', 'Ultimate test of your cryptocurrency expertise.', 'quiz', 20, 21, 40, true);

  -- ============================================
  -- Add two new learning paths with full content
  -- ============================================
  
  -- Insert new learning path: Financial Freedom Fundamentals
  INSERT INTO learning_paths (name, description, difficulty_level, tier, icon, color, estimated_duration_hours, sort_order, is_published)
  VALUES ('Financial Freedom Fundamentals', 'Master budgeting, debt management, and building wealth from scratch.', 'beginner', 'free', '💰', '#3b82f6', 10, 4, true)
  RETURNING id INTO rookie_investor_id;

  INSERT INTO courses (learning_path_id, title, description, content_type, duration_minutes, sort_order, xp_reward, is_published) VALUES
    (rookie_investor_id, 'The Money Mindset Shift', 'Transform your relationship with money and break limiting beliefs.', 'video', 15, 1, 15, true),
    (rookie_investor_id, 'Budgeting Like a Boss', 'Create a realistic budget that actually works for your lifestyle.', 'interactive', 18, 2, 20, true),
    (rookie_investor_id, 'Emergency Fund Essentials', 'Build your financial safety net - how much and where to keep it.', 'video', 12, 3, 15, true),
    (rookie_investor_id, 'Understanding Debt', 'Good debt vs bad debt - and how to manage both.', 'text', 14, 4, 15, true),
    (rookie_investor_id, 'Debt Payoff Strategies', 'Snowball vs Avalanche method - choose your debt-free path.', 'video', 16, 5, 20, true),
    (rookie_investor_id, 'Credit Scores in SA', 'How credit bureaus work and how to improve your score.', 'video', 13, 6, 15, true),
    (rookie_investor_id, 'The Black Tax Reality', 'Navigating family financial obligations while building your own wealth.', 'audio', 17, 7, 20, true),
    (rookie_investor_id, 'Banking Smart', 'Choosing the right bank accounts and avoiding unnecessary fees.', 'text', 11, 8, 10, true),
    (rookie_investor_id, 'Insurance Basics', 'Protect what matters - life, disability, and funeral cover explained.', 'video', 15, 9, 15, true),
    (rookie_investor_id, 'Building Wealth Habits', 'Daily practices of financially successful people.', 'video', 14, 10, 15, true),
    (rookie_investor_id, 'Financial Freedom Quiz', 'Test your foundation knowledge.', 'quiz', 12, 11, 25, true);

  -- Insert new learning path: Property Wealth Builder
  INSERT INTO learning_paths (name, description, difficulty_level, tier, icon, color, estimated_duration_hours, sort_order, is_published)
  VALUES ('Property Wealth Builder', 'Everything you need to know about real estate investing in South Africa.', 'intermediate', 'pro', '🏠', '#ec4899', 14, 5, true)
  RETURNING id INTO side_hustle_id;

  INSERT INTO courses (learning_path_id, title, description, content_type, duration_minutes, sort_order, xp_reward, is_published) VALUES
    (side_hustle_id, 'Property Investment Fundamentals', 'Why real estate is a wealth-building powerhouse.', 'video', 16, 1, 20, true),
    (side_hustle_id, 'Understanding Property Markets', 'Analyze trends, locations, and opportunities in SA.', 'video', 18, 2, 20, true),
    (side_hustle_id, 'Financing Your First Property', 'Bonds, deposits, and getting approved by banks.', 'text', 17, 3, 20, true),
    (side_hustle_id, 'Location, Location, Location', 'How to identify high-growth areas and avoid mistakes.', 'interactive', 15, 4, 20, true),
    (side_hustle_id, 'Buy-to-Let Strategies', 'Generate passive income through rental properties.', 'video', 19, 5, 25, true),
    (side_hustle_id, 'Property Flipping 101', 'Buy, renovate, sell - the complete guide.', 'video', 20, 6, 25, true),
    (side_hustle_id, 'Being a Landlord', 'Tenant management, maintenance, and legal requirements.', 'audio', 16, 7, 20, true),
    (side_hustle_id, 'REITs Explained', 'Invest in property without buying physical real estate.', 'video', 14, 8, 15, true),
    (side_hustle_id, 'Property Development Basics', 'From land acquisition to building and selling.', 'video', 22, 9, 30, true),
    (side_hustle_id, 'Tax Benefits of Property', 'Deductions, allowances, and optimizing returns.', 'text', 15, 10, 20, true),
    (side_hustle_id, 'Property Wealth Quiz', 'Master your real estate knowledge.', 'quiz', 15, 11, 30, true);

END $$;
