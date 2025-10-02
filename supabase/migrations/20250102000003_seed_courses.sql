-- Seed initial courses for the learning paths

-- Get learning path IDs (we'll need to run this after the paths are created)
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

  -- Insert courses for The Rookie Investor (Free)
  INSERT INTO courses (learning_path_id, title, description, content_type, duration_minutes, sort_order, xp_reward, is_published) VALUES
    (rookie_investor_id, 'Welcome to Investing', 'Learn what investing is and why it matters for your financial future.', 'video', 12, 1, 10, true),
    (rookie_investor_id, 'Understanding Stocks', 'Discover how stocks work and what makes companies valuable.', 'video', 15, 2, 15, true),
    (rookie_investor_id, 'Bonds 101', 'Learn about bonds and how they provide stable income.', 'audio', 10, 3, 10, true),
    (rookie_investor_id, 'Diversification Basics', 'Understand why putting all eggs in one basket is risky.', 'text', 8, 4, 10, true),
    (rookie_investor_id, 'Building Your First Portfolio', 'Step-by-step guide to creating a balanced investment portfolio.', 'interactive', 20, 5, 20, true),
    (rookie_investor_id, 'Risk vs. Reward', 'Learn how to balance risk and potential returns.', 'video', 12, 6, 15, true),
    (rookie_investor_id, 'Investment Basics Quiz', 'Test your knowledge of investment fundamentals.', 'quiz', 10, 7, 25, true);

  -- Insert courses for The Side-Hustle Starter (Pro)
  INSERT INTO courses (learning_path_id, title, description, content_type, duration_minutes, sort_order, xp_reward, is_published) VALUES
    (side_hustle_id, 'Finding Your Niche', 'Identify profitable side hustle opportunities that match your skills.', 'video', 15, 1, 15, true),
    (side_hustle_id, 'Market Research Made Easy', 'Learn how to validate your business idea before investing time.', 'interactive', 20, 2, 20, true),
    (side_hustle_id, 'Creating Your Business Plan', 'Simple framework for planning your side business.', 'text', 18, 3, 15, true),
    (side_hustle_id, 'Pricing Your Services', 'How to price competitively while ensuring profitability.', 'video', 12, 4, 15, true),
    (side_hustle_id, 'Marketing on a Budget', 'Low-cost marketing strategies that actually work.', 'video', 15, 5, 15, true),
    (side_hustle_id, 'Managing Your Time', 'Balance your day job and side hustle effectively.', 'audio', 10, 6, 10, true),
    (side_hustle_id, 'Scaling Your Side Hustle', 'When and how to grow your business.', 'video', 15, 7, 20, true),
    (side_hustle_id, 'Side Hustle Mastery Quiz', 'Test your entrepreneurial knowledge.', 'quiz', 12, 8, 30, true);

  -- Insert courses for The Crypto Connoisseur (Elite)
  INSERT INTO courses (learning_path_id, title, description, content_type, duration_minutes, sort_order, xp_reward, is_published) VALUES
    (crypto_id, 'Blockchain Fundamentals', 'Understand the technology behind cryptocurrencies.', 'video', 18, 1, 20, true),
    (crypto_id, 'Bitcoin Deep Dive', 'Everything you need to know about the original cryptocurrency.', 'video', 20, 2, 25, true),
    (crypto_id, 'Ethereum & Smart Contracts', 'Learn how Ethereum powers decentralized applications.', 'video', 18, 3, 25, true),
    (crypto_id, 'DeFi Explained', 'Decentralized Finance: The future of banking?', 'video', 15, 4, 20, true),
    (crypto_id, 'NFTs & Digital Assets', 'Understanding non-fungible tokens and their use cases.', 'interactive', 15, 5, 20, true),
    (crypto_id, 'Crypto Security', 'How to keep your digital assets safe.', 'text', 12, 6, 15, true),
    (crypto_id, 'Trading Strategies', 'Learn different approaches to crypto trading.', 'video', 20, 7, 25, true),
    (crypto_id, 'Crypto Tax & Regulations', 'Navigate the legal landscape of cryptocurrency in South Africa.', 'text', 15, 8, 20, true),
    (crypto_id, 'Crypto Expert Quiz', 'Prove your cryptocurrency mastery.', 'quiz', 15, 9, 35, true);
END $$;
