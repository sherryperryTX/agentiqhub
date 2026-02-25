-- =============================================
-- Add 5 new courses to AgentIQ Hub
-- Run AFTER 04-multi-course.sql
-- =============================================

-- Course 2: Undivided Interest in Property Ownership
INSERT INTO courses (slug, title, description, short_description, visibility, price, stripe_price_id, is_active, sort_order)
VALUES (
  'undivided-interest-property-ownership',
  'Undivided Interest in Property Ownership',
  'This comprehensive course covers everything real estate agents need to know about undivided interest in property ownership. You will learn the legal foundations of shared ownership structures including tenancy in common, joint tenancy, and community property. The course walks through real-world scenarios involving co-ownership disputes, partition actions, and how to advise clients who are buying or selling property with multiple owners. You will also explore title issues, financing challenges, and how to structure transactions involving undivided interests. Whether your client is inheriting shared property, investing with partners, or navigating a divorce situation, this course gives you the expertise to guide them with confidence.',
  'Master shared ownership structures, co-ownership transactions, and how to advise clients on undivided property interests.',
  'public',
  0,
  NULL,
  true,
  2
);

-- Course 3: Representing Buyers in Foreclosed Properties
INSERT INTO courses (slug, title, description, short_description, visibility, price, stripe_price_id, is_active, sort_order)
VALUES (
  'representing-buyers-foreclosed-properties',
  'Representing Buyers in Foreclosed Properties',
  'Navigate the complex world of foreclosure purchases with confidence. This course teaches agents how to represent buyers through every stage of the foreclosure process — from identifying opportunities and understanding the different types of foreclosures (pre-foreclosure, auction, REO, and HUD homes) to making competitive offers and managing the unique risks involved. You will learn how to evaluate bank-owned properties, work with asset managers, handle title issues and liens, negotiate repair credits, and set realistic expectations with your buyers. The course also covers the legal protections available to buyers, common pitfalls that derail foreclosure deals, and strategies for closing successfully in a competitive market.',
  'Learn to guide buyers through the foreclosure process including auctions, REOs, and bank-owned property negotiations.',
  'public',
  0,
  NULL,
  true,
  3
);

-- Course 4: Property Comparative Analysis
INSERT INTO courses (slug, title, description, short_description, visibility, price, stripe_price_id, is_active, sort_order)
VALUES (
  'property-comparative-analysis',
  'Property Comparative Analysis',
  'A strong CMA is the foundation of every successful listing presentation and buyer consultation. This course takes you from the basics of pulling comparable sales to the advanced art of making accurate adjustments and presenting your analysis with authority. You will learn how to select the right comparables, account for differences in features, condition, location, and market trends, and produce polished CMA reports that win client confidence. The course covers both residential and multi-family analysis, how to handle unique properties with limited comps, and how to use technology tools to streamline your CMA workflow. By the end, you will be able to price properties accurately, defend your valuations, and stand out as a market expert in every client conversation.',
  'Master the art and science of CMAs — pull comps, adjust values, and present market analyses that win listings.',
  'public',
  0,
  NULL,
  true,
  4
);

-- Course 5: Representing a Client in a Short-Sale Situation
INSERT INTO courses (slug, title, description, short_description, visibility, price, stripe_price_id, is_active, sort_order)
VALUES (
  'representing-client-short-sale',
  'Representing a Client in a Short-Sale Situation',
  'Short sales require specialized knowledge that most agents never learn until they are already in over their heads. This course prepares you to confidently represent sellers in short-sale situations from the very first consultation through closing. You will learn how to evaluate whether a short sale is the right option for your client, how to prepare hardship packages, how to communicate with loss mitigation departments, and how to manage the approval timeline with buyers, lenders, and title companies. The course covers BPO preparation, negotiation strategies with junior and senior lien holders, common reasons short sales get denied and how to avoid them, and the tax and credit implications your sellers need to understand. Whether you are new to short sales or looking to sharpen your skills, this course will make you the go-to agent for distressed property situations.',
  'Guide sellers through the short-sale process from lender negotiations and hardship letters to closing successfully.',
  'public',
  0,
  NULL,
  true,
  5
);

-- Course 6: Real Estate Tools Training
INSERT INTO courses (slug, title, description, short_description, visibility, price, stripe_price_id, is_active, sort_order)
VALUES (
  'real-estate-tools-training',
  'Real Estate Tools Training',
  'Today''s top-performing agents do not just know real estate — they know how to use the right tools to work faster and serve clients better. This hands-on course covers the essential technology platforms every agent should master. You will get step-by-step training on transaction management with dotloop, document organization with Google Drive, client communication tools, e-signature workflows, and more. Each module includes practical exercises so you can apply what you learn immediately. The course is designed for agents at any tech comfort level, from beginners setting up their first digital workspace to experienced agents looking to optimize their existing workflow. By the end, you will have a streamlined, professional technology stack that saves you hours every week.',
  'Hands-on training for dotloop, Google Drive, transaction management, and the essential tools every agent needs.',
  'public',
  0,
  NULL,
  true,
  6
);
