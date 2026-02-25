-- =====================================================
-- Seed data: Migrate existing course content to database
-- Run this AFTER 01-course-tables.sql
-- =====================================================

INSERT INTO public.course_modules (id, title, section, description, tier, sort_order)
VALUES (1, 'What is AI? A Realtor''s Guide', 'AI Foundations', 'Understand what AI really is, how it works in simple terms, and why it matters for your real estate business.', 'free', 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_modules (id, title, section, description, tier, sort_order)
VALUES (2, 'Setting Up Your AI Toolkit', 'AI Foundations', 'Get hands-on with the essential AI tools every realtor needs, starting with ChatGPT and Claude.', 'free', 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_modules (id, title, section, description, tier, sort_order)
VALUES (3, 'Prompt Engineering for Realtors', 'AI Foundations', 'Master the art of talking to AI. Learn prompt formulas that get professional results every time.', 'free', 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_modules (id, title, section, description, tier, sort_order)
VALUES (4, 'AI Ethics & Compliance for Real Estate', 'AI Foundations', 'Navigate the legal and ethical landscape of AI in real estate, including Fair Housing compliance.', 'free', 4)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_modules (id, title, section, description, tier, sort_order)
VALUES (5, 'AI-Powered Email Mastery', 'Essential AI Tools', 'Transform your email game with AI. Templates for every stage of the transaction.', 'free', 5)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_modules (id, title, section, description, tier, sort_order)
VALUES (6, 'AI for Market Analysis', 'Essential AI Tools', 'Use AI to analyze market trends, create CMAs, and build client-ready market reports.', 'free', 6)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_modules (id, title, section, description, tier, sort_order)
VALUES (7, 'AI-Powered Social Media', 'Essential AI Tools', 'Build a consistent social media presence with AI-generated content calendars and posts.', 'free', 7)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_modules (id, title, section, description, tier, sort_order)
VALUES (8, 'AI Writing Workshop', 'Essential AI Tools', 'Hands-on practice writing listings, bios, and marketing copy with AI assistance.', 'free', 8)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_modules (id, title, section, description, tier, sort_order)
VALUES (9, 'AI Listing Description Mastery', 'Real Estate AI Workflows', 'Advanced listing techniques including multi-platform optimization and photo-based descriptions.', 'premium', 9)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_modules (id, title, section, description, tier, sort_order)
VALUES (10, 'Client Communication Mastery', 'Real Estate AI Workflows', 'Build AI-powered communication systems for every client touchpoint.', 'premium', 10)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_modules (id, title, section, description, tier, sort_order)
VALUES (11, 'CMA & Market Analysis Pro', 'Real Estate AI Workflows', 'Advanced market analysis techniques including investor reports and buyer briefs.', 'premium', 11)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_modules (id, title, section, description, tier, sort_order)
VALUES (12, 'AI Marketing Systems', 'Real Estate AI Workflows', 'Build complete marketing campaigns with AI — from email sequences to print materials.', 'premium', 12)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_modules (id, title, section, description, tier, sort_order)
VALUES (13, 'Transaction Management with AI', 'Advanced AI Strategies', 'Streamline your transactions with AI-powered timelines, checklists, and workflows.', 'premium', 13)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_modules (id, title, section, description, tier, sort_order)
VALUES (14, 'Social Media Strategy Pro', 'Advanced AI Strategies', 'Advanced social strategies including brand voice development and content repurposing.', 'premium', 14)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_modules (id, title, section, description, tier, sort_order)
VALUES (15, 'Presentations & Client Materials', 'Advanced AI Strategies', 'Create stunning listing presentations, buyer guides, and pitch materials with AI.', 'premium', 15)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_modules (id, title, section, description, tier, sort_order)
VALUES (16, 'AI Business Systems', 'Advanced AI Strategies', 'Build AI systems that run your business: morning briefings, listing launches, and ROI tracking.', 'premium', 16)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_modules (id, title, section, description, tier, sort_order)
VALUES (17, 'Certification Assessment', 'Certification', 'Complete your final assessment to earn your AI Mastery for Real Estate certificate.', 'premium', 17)
ON CONFLICT (id) DO NOTHING;

SELECT setval('course_modules_id_seq', (SELECT MAX(id) FROM course_modules));

INSERT INTO public.course_lessons (id, module_id, title, content, video_url, sort_order)
VALUES ('1-1', 1, 'AI Demystified: What It Actually Is', 'Artificial Intelligence isn''t the sci-fi robots you see in movies. For realtors, AI is simply software that can learn patterns and make predictions. Think of it as a very smart assistant that gets better the more you use it.

At its core, AI works by analyzing huge amounts of data to find patterns. When you use AI for real estate, it''s drawing on millions of examples of property descriptions, market data, client communications, and more to help you work faster and smarter.

**Key Takeaway:** AI is a tool, not a replacement. The best realtors will be those who learn to use AI as a force multiplier for their expertise.', NULL, 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_lessons (id, module_id, title, content, video_url, sort_order)
VALUES ('1-2', 1, 'How AI Applies to Real Estate', 'AI touches every part of the real estate transaction cycle. Here are the key areas where AI is already making an impact:

**Listing Descriptions:** Generate compelling, accurate property descriptions in seconds instead of hours.

**Client Communications:** Draft personalized emails, follow-ups, and market updates that sound like you wrote them.

**Market Analysis:** Analyze comparable sales, market trends, and pricing data faster than any human could.

**Marketing:** Create social media posts, email campaigns, and advertising copy tailored to your brand.

**Transaction Management:** Track timelines, generate checklists, and stay on top of every detail.', NULL, 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_lessons (id, module_id, title, content, video_url, sort_order)
VALUES ('1-3', 1, 'The AI Advantage: Why Early Adopters Win', 'The real estate industry is at a tipping point. Agents who adopt AI now will have a significant competitive advantage:

**Time Savings:** AI can reduce administrative tasks by 60-70%, freeing you to focus on relationships and closings.

**Consistency:** AI helps maintain consistent quality in all your communications and marketing.

**Scale:** Handle more clients without sacrificing quality. AI lets a solo agent operate like a team.

**Speed:** Respond to leads in minutes instead of hours. First response time is the #1 predictor of lead conversion.

The agents who master AI in 2026 will be the market leaders of 2027 and beyond.', NULL, 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_lessons (id, module_id, title, content, video_url, sort_order)
VALUES ('2-1', 2, 'ChatGPT: Your AI Starting Point', 'ChatGPT by OpenAI is the most widely-used AI assistant. Here''s how to get started:

**Creating Your Account:**
1. Go to chat.openai.com
2. Click ''Sign up'' and create a free account
3. The free tier gives you access to GPT-3.5, which is excellent for most real estate tasks

**Your First Conversation:**
Try typing: ''I''m a real estate agent in [your city]. Help me write a compelling listing description for a 3-bedroom, 2-bathroom ranch home with a renovated kitchen and large backyard.''

**Pro Tip:** Be specific! The more details you give AI, the better the output. Include square footage, neighborhood name, notable features, and your target buyer.', NULL, 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_lessons (id, module_id, title, content, video_url, sort_order)
VALUES ('2-2', 2, 'Claude: The Professional''s Choice', 'Claude by Anthropic excels at longer, more nuanced content — perfect for contracts, market reports, and client presentations.

**Getting Started with Claude:**
1. Visit claude.ai
2. Create a free account
3. Claude''s free tier is generous and ideal for business use

**Why Realtors Love Claude:**
- Handles longer documents (up to 200K tokens of context)
- Excellent at maintaining your writing style
- Great at analyzing data and creating reports
- More nuanced understanding of professional communication

**Try This:** Upload a past listing description you loved and ask Claude to ''analyze my writing style and create a style guide I can use for future listings.''', NULL, 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_lessons (id, module_id, title, content, video_url, sort_order)
VALUES ('2-3', 2, 'Free vs. Paid: What You Actually Need', 'Here''s the honest truth about free vs. paid AI tools:

**Free Tiers Are Powerful:**
For most real estate tasks, free tiers of ChatGPT and Claude are more than sufficient. You can write listings, draft emails, create social posts, and analyze market data without paying a cent.

**When to Upgrade ($20/month):**
- You''re using AI more than 20 times per day
- You need the latest AI models for complex tasks
- You want image generation capabilities
- You need priority access during peak times

**Our Recommendation:**
Start free. Upgrade only when you hit limits. Most agents find the free tier handles 80% of their needs.', NULL, 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_lessons (id, module_id, title, content, video_url, sort_order)
VALUES ('3-1', 3, 'The RECIPE Prompt Formula', 'Great AI output starts with great input. Use the RECIPE formula for consistent, professional results:

**R — Role:** Tell AI who to be
''You are an experienced luxury real estate copywriter...''

**E — Example:** Show what good looks like
''Here''s an example of a listing description I love: [paste example]''

**C — Context:** Provide background
''This is a 4-bed waterfront home in the Lake Norman area, priced at $850K...''

**I — Instructions:** Be specific about what you want
''Write a 200-word listing description highlighting the water views and updated kitchen''

**P — Parameters:** Set boundaries
''Use a warm, inviting tone. Avoid clichés like "move-in ready." Include a call to action.''

**E — Evaluate:** Ask AI to check its work
''Review your description for accuracy and suggest improvements.''', NULL, 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_lessons (id, module_id, title, content, video_url, sort_order)
VALUES ('3-2', 3, '10 Ready-to-Use Prompt Templates', 'Copy and customize these prompts for your daily work:

**1. Listing Description:**
''Write a [length]-word listing description for [property details]. Target buyer: [type]. Tone: [warm/luxury/casual]. Highlight: [top 3 features].''

**2. Buyer Follow-Up Email:**
''Draft a follow-up email to [buyer name] who viewed [property] yesterday. They loved [feature] but were concerned about [concern]. Be [tone] and suggest next steps.''

**3. Market Update:**
''Create a monthly market update for [area]. Include: median price change, inventory levels, days on market, and what this means for [buyers/sellers]. Keep it under 300 words.''

**4. Social Media Post:**
''Write an Instagram caption for [photo description]. Include relevant hashtags. Make it engaging and include a soft call to action.''

**5. Neighborhood Guide:**
''Write a 500-word neighborhood guide for [area] targeting [audience]. Include: schools, dining, recreation, commute times, and community vibe.''', NULL, 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_lessons (id, module_id, title, content, video_url, sort_order)
VALUES ('3-3', 3, 'Common Mistakes and How to Fix Them', 'Avoid these prompt pitfalls that trip up most agents:

**Mistake #1: Being Too Vague**
Bad: ''Write a listing description''
Good: ''Write a 150-word listing description for a modern 3BR/2BA condo in downtown Austin, targeting young professionals, highlighting the rooftop pool and walkability score of 95''

**Mistake #2: Not Iterating**
AI rarely gets it perfect on the first try. Use follow-up prompts:
- ''Make it more conversational''
- ''Add more sensory details''
- ''Shorten to 100 words''
- ''Change the tone to luxury''

**Mistake #3: Not Providing Your Voice**
Share examples of YOUR writing. Say: ''Here are 3 emails I''ve written. Match my communication style for all future drafts.''

**Mistake #4: Accepting Without Editing**
Always review and personalize AI output. Add local knowledge, personal touches, and verify all facts.', NULL, 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_lessons (id, module_id, title, content, video_url, sort_order)
VALUES ('4-1', 4, 'Fair Housing and AI: What You Must Know', 'AI can inadvertently create Fair Housing violations if you''re not careful. Here''s what every agent must understand:

**The Risk:** AI models are trained on historical data, which may contain biases. If you ask AI to describe a neighborhood''s ''character'' or ''ideal buyer,'' it might generate language that violates Fair Housing Act protections.

**Protected Classes (Federal):**
Race, Color, National Origin, Religion, Sex, Familial Status, Disability

**Safe Practices:**
1. Never ask AI to describe the demographics of a neighborhood
2. Review all AI-generated content for discriminatory language
3. Focus on property features, not people features
4. Use inclusive language in all listings and marketing
5. Don''t let AI make steering recommendations

**Red Flag Phrases to Watch For:**
- ''Perfect for young professionals'' (familial status)
- ''Walking distance to churches'' (religion)
- ''Safe neighborhood'' (potential racial implication)
- ''Master bedroom'' (some MLS systems now prefer ''primary bedroom'')', NULL, 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_lessons (id, module_id, title, content, video_url, sort_order)
VALUES ('4-2', 4, 'Data Privacy and Client Confidentiality', 'When using AI tools, you''re sharing information with third-party services. Here''s how to protect your clients:

**Never Share with AI:**
- Social Security numbers
- Financial documents or bank statements
- Full legal names paired with transaction details
- Settlement statements or closing documents
- Medical information (even for ADA accommodations)

**Safe to Share:**
- Property features and descriptions
- General market data
- Generic email templates
- Marketing copy without personal details

**Best Practice:** Anonymize before you share. Instead of ''Draft an email to John Smith about his offer on 123 Main St,'' try ''Draft an email to a buyer whose offer on a home was accepted, expressing excitement and outlining next steps.''', NULL, 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_lessons (id, module_id, title, content, video_url, sort_order)
VALUES ('4-3', 4, 'Disclosure: When to Tell Clients About AI', 'Transparency builds trust. Here''s when and how to disclose AI use:

**When Disclosure is Recommended:**
- When AI-generated content is presented as professional analysis
- When AI tools access client data (with consent)
- When clients ask about your process

**How to Frame It:**
''I use AI tools to help me work more efficiently, which means I can dedicate more time to serving you personally. All AI-generated content is reviewed and personalized by me before it reaches you.''

**Your Competitive Advantage:**
Being transparent about AI use actually builds trust. Clients appreciate knowing you''re using cutting-edge tools to serve them better, as long as the human expertise remains central.

**NAR Guidelines:** The National Association of Realtors encourages AI adoption while emphasizing human oversight. Stay current with NAR''s technology guidelines at nar.realtor.', NULL, 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_lessons (id, module_id, title, content, video_url, sort_order)
VALUES ('5-1', 5, 'The 4 Email Categories Every Agent Needs', 'Organize your AI email toolkit into four categories that cover your entire business:

**1. Lead Response (Speed-to-Lead)**
First contact with new leads. These need to be fast, personal, and action-oriented.
AI Prompt: ''Write a warm, 3-sentence response to a buyer lead who inquired about [property]. Include one specific detail about the property and a question to start a conversation.''

**2. Nurture Sequences**
Keeping in touch with your database. Monthly market updates, holiday greetings, anniversary check-ins.
AI Prompt: ''Create a 6-month email nurture sequence for past clients. One email per month, each providing genuine value about homeownership, local events, or market insights.''

**3. Transaction Updates**
Keeping clients informed during active transactions. Inspection results, appraisal updates, closing prep.
AI Prompt: ''Draft a client update email explaining that the home inspection revealed [issue]. Be reassuring but honest. Include next steps and timeline.''

**4. Referral Generation**
Asking for referrals and reviews at the right moments.
AI Prompt: ''Write a post-closing email thanking [client type] and naturally asking for referrals. Include a specific compliment about working with them.''', NULL, 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_lessons (id, module_id, title, content, video_url, sort_order)
VALUES ('5-2', 5, 'Building Your AI Voice Profile', 'The biggest complaint about AI emails? They sound generic. Fix this by creating a Voice Profile:

**Step 1: Gather Your Best Emails**
Find 5-10 emails you''ve written that got great responses. These represent your natural voice.

**Step 2: Create Your Profile Prompt**
''Analyze these email examples and create a writing style guide for me. Note my:
- Typical greeting and sign-off
- Sentence length and complexity
- Use of humor or formality
- How I structure information
- Words and phrases I commonly use
- My overall tone''

**Step 3: Use It Every Time**
Start each email request with: ''Using my voice profile [paste profile], write an email that...''

**Step 4: Refine Over Time**
Every month, update your voice profile with new examples of emails that worked well.

**Pro Tip:** Save your voice profile as a document. Copy and paste it at the start of every email prompt.', NULL, 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_lessons (id, module_id, title, content, video_url, sort_order)
VALUES ('5-3', 5, 'Speed-to-Lead: The 2-Minute Response System', 'Studies show that responding to leads within 5 minutes increases conversion by 400%. Here''s your AI-powered system:

**Pre-Build 10 Response Templates:**
Create AI-generated templates for your most common lead types:
1. Zillow/Realtor.com property inquiry
2. Open house sign-in follow-up
3. Website contact form
4. Social media DM
5. Referral introduction
6. Expired listing outreach
7. FSBO outreach
8. Relocation inquiry
9. Investment property inquiry
10. First-time buyer inquiry

**The 2-Minute Workflow:**
1. Lead comes in (30 seconds to read)
2. Select the matching template (10 seconds)
3. Customize 2-3 details: name, property, personal touch (60 seconds)
4. Review and send (20 seconds)

**The Personal Touch That Matters:**
Always add ONE specific detail that shows you''re a real person:
- Reference something from their inquiry
- Mention a specific neighborhood detail
- Note the current weather or local event', NULL, 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_lessons (id, module_id, title, content, video_url, sort_order)
VALUES ('6-1', 6, 'Creating AI-Enhanced CMAs', 'A Comparative Market Analysis is one of your most important tools. AI can make yours stand out:

**The AI-Enhanced CMA Process:**
1. Pull your comparable sales data from MLS (you still need the data)
2. Feed the data to AI with this prompt:

''Analyze these comparable sales for [subject property address]:
[Paste comp data: address, sale price, sqft, beds/baths, sale date, condition]

Create a market analysis narrative that explains:
- Why these comps were selected
- How each comp compares to the subject property
- Adjustments for differences (size, condition, features, timing)
- A recommended list price range with justification
- Current market conditions affecting pricing

Write it for a homeowner audience — professional but not technical.''

**What AI Does Best:** Turning raw numbers into a compelling story that helps clients understand their home''s value.

**What You Still Need to Do:** Verify the data, apply your local market knowledge, and make the final pricing recommendation.', NULL, 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_lessons (id, module_id, title, content, video_url, sort_order)
VALUES ('6-2', 6, 'Monthly Market Reports That Clients Love', 'Stand out in your market by sending AI-powered monthly reports:

**The 5-Section Monthly Report:**

**1. Market Snapshot** (3-4 sentences)
Median price, inventory, days on market vs. last month

**2. What This Means for Buyers** (2-3 sentences)
Practical advice based on current conditions

**3. What This Means for Sellers** (2-3 sentences)
Practical advice for the other side

**4. Featured Neighborhood Spotlight** (4-5 sentences)
Rotate through neighborhoods each month

**5. My Take** (2-3 sentences)
Your personal prediction or observation — this is where YOUR expertise shines

**AI Prompt Template:**
''Using this market data for [area] in [month/year]:
[Paste stats]

Write a monthly market report following this 5-section format. Keep the total under 400 words. Tone: knowledgeable but approachable. End with a subtle call to action.''', NULL, 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_lessons (id, module_id, title, content, video_url, sort_order)
VALUES ('6-3', 6, 'Investment Analysis with AI', 'Help investor clients make data-driven decisions using AI:

**Rental Property Analysis Prompt:**
''Analyze this potential rental investment:
- Purchase price: $___
- Estimated monthly rent: $___
- Property taxes: $___/year
- Insurance: $___/year
- HOA (if any): $___/month
- Estimated maintenance: ___% of rent
- Down payment: ___%
- Interest rate: ___%

Calculate and explain:
1. Monthly cash flow (positive or negative)
2. Cap rate
3. Cash-on-cash return
4. Break-even occupancy rate
5. 5-year projected ROI

Present this in a format suitable for an investor client.''

**Why This Works:** You provide the local market knowledge (realistic rent estimates, maintenance costs), and AI does the math and creates a professional presentation. This positions you as the go-to agent for investors in your market.', NULL, 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_lessons (id, module_id, title, content, video_url, sort_order)
VALUES ('7-1', 7, 'The 30-Day Content Calendar', 'Stop scrambling for social media ideas. Let AI build your monthly calendar:

**Content Pillar Strategy:**
Organize posts into 5 pillars that rotate throughout the week:
- Monday: Market Monday (stats, trends, insights)
- Tuesday: Tip Tuesday (buyer/seller advice)
- Wednesday: Listing Spotlight
- Thursday: Neighborhood Feature
- Friday: Fun Friday (personal, behind-the-scenes)

**AI Prompt for Calendar:**
''Create a 30-day social media content calendar for a real estate agent in [city]. Follow this pillar schedule: [pillars]. For each day, provide:
1. Post topic
2. Caption (150 words max)
3. Image description/suggestion
4. 5 relevant hashtags
5. Best time to post

Voice: [your brand voice]. Mix educational, entertaining, and promotional content (60/30/10 ratio).''

**Pro Tip:** Generate the full month in one sitting, then schedule using a tool like Later or Buffer.', NULL, 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_lessons (id, module_id, title, content, video_url, sort_order)
VALUES ('7-2', 7, 'Platform-Specific Strategies', 'Each platform has different rules. Here''s how to adapt with AI:

**Instagram (Visual-First):**
AI Prompt: ''Write an Instagram carousel post about [topic]. Create 5-7 slides with a hook on slide 1, valuable content on slides 2-6, and a CTA on the last slide. Keep text short — 20 words max per slide.''

**LinkedIn (Professional):**
AI Prompt: ''Write a LinkedIn post about [real estate insight]. Start with a bold opening line. Use short paragraphs. Include a personal anecdote. End with a question to encourage comments. 200 words max.''

**Facebook (Community):**
AI Prompt: ''Write a Facebook post for a real estate agent about [topic]. Make it conversational and community-focused. Include a question to encourage engagement. 100-150 words.''

**TikTok/Reels (Short Video Scripts):**
AI Prompt: ''Write a 30-second video script about [real estate tip]. Hook in first 3 seconds. Deliver one clear takeaway. End with a call to action. Include visual direction notes.''', NULL, 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_lessons (id, module_id, title, content, video_url, sort_order)
VALUES ('7-3', 7, 'Hashtag Strategy and Engagement', 'AI can optimize your hashtag game and help you engage meaningfully:

**The 3-Tier Hashtag Formula:**
1. **Broad** (500K+ posts): #realestate #homebuying #dreamhome
2. **Niche** (10K-500K): #[city]realtor #firsttimebuyertips #luxuryliving
3. **Hyper-Local** (under 10K): #[neighborhood]homes #[city]realestate

**AI Prompt for Hashtags:**
''Generate 30 hashtags for a real estate agent in [city] organized into three tiers: broad (10), niche (10), and hyper-local (10). I specialize in [specialty].''

**AI for Engagement Responses:**
When someone comments on your posts, use AI to help craft thoughtful responses:
''Someone commented [comment] on my post about [topic]. Write a warm, genuine response that continues the conversation and positions me as helpful. 2-3 sentences max.''

**Key Rule:** Never automate engagement responses. Use AI as a starting point, then personalize.', NULL, 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_lessons (id, module_id, title, content, video_url, sort_order)
VALUES ('8-1', 8, 'Writing Compelling Listing Descriptions', 'The 5-component formula for AI-assisted listing descriptions:

**Component 1: The Hook (First Sentence)**
Grab attention immediately. Never start with the address.
Bad: ''123 Main Street is a 3-bedroom home.''
Good: ''Sun-drenched mornings and chef-worthy dinners await in this beautifully renovated Craftsman.''

**Component 2: The Story (2-3 Sentences)**
Paint a picture of the lifestyle, not just the features.
''Imagine weekend brunches on the wraparound porch, kids playing in the fenced backyard, and cozy evenings by the stone fireplace.''

**Component 3: The Features (3-5 Highlights)**
Lead with what makes this property special.

**Component 4: The Neighborhood (1-2 Sentences)**
Locate the home in its community context.

**Component 5: The Close (Call to Action)**
Create urgency without being pushy.
''Schedule your private tour before this gem finds its forever family.''

**AI Prompt:**
''Using the 5-component listing formula (hook, story, features, neighborhood, close), write a [word count]-word listing description for: [all property details]. Target buyer: [description]. Tone: [warm/luxury/energetic].''', NULL, 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_lessons (id, module_id, title, content, video_url, sort_order)
VALUES ('8-2', 8, 'Crafting Your Agent Bio', 'Your bio is often the first thing potential clients read. Here''s how to make it convert:

**The 4-Part Bio Framework:**

**1. Opening Hook:**
Lead with what makes you different, not your license date.
''Sherry Perry doesn''t just sell homes — she helps families find where their next chapter begins.''

**2. Your Story:**
Why real estate? What drives you? Make it human.

**3. Your Results:**
Specific numbers and achievements. Quantify your success.

**4. Personal Touch:**
One or two personal details that make you relatable.

**AI Prompt:**
''Write a real estate agent bio for [name] using this framework:
- Hook: What makes me unique is [differentiator]
- Story: I got into real estate because [reason]
- Results: [years experience], [homes sold], [areas served], [specialties]
- Personal: Outside of real estate, I [hobbies/family]

Write in first person. 200 words. Tone: [warm and professional/energetic/luxury].''', NULL, 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_lessons (id, module_id, title, content, video_url, sort_order)
VALUES ('8-3', 8, 'Marketing Copy That Converts', 'From email subject lines to ad copy, AI can help you write marketing that gets results:

**Email Subject Lines (Test 3-5 per campaign):**
AI Prompt: ''Generate 10 email subject lines for [campaign type]. Each should be under 50 characters. Mix curiosity, urgency, and value. Target: [audience].''

**Open House Invitations:**
AI Prompt: ''Write an open house invitation for [property] this [day/time]. Make it feel exclusive, not generic. Include one unique detail about the property. Add RSVP instructions. 100 words.''

**Just Sold/Just Listed Postcards:**
AI Prompt: ''Write front-and-back copy for a [just sold/just listed] postcard. Front: attention-grabbing headline + 1 sentence. Back: property highlights, market insight, and call to action. Keep it scannable.''

**Google/Facebook Ad Copy:**
AI Prompt: ''Write 3 variations of a [Google/Facebook] ad for [objective]. Include headline (30 chars), description (90 chars), and call to action. Target: [audience in city].''', NULL, 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_lessons (id, module_id, title, content, video_url, sort_order)
VALUES ('9-1', 9, 'Multi-Platform Listing Optimization', 'Different platforms have different character limits and audiences. Optimize your listings for each:

**MLS (Full Description):** 500-1000 words, feature-rich, SEO keywords
**Zillow/Realtor.com:** 250-400 words, buyer-emotional, lifestyle-focused
**Social Media:** 150 words max, hook-first, hashtag-optimized
**Print/Flyer:** 75-100 words, scannable, bullet-friendly

AI Prompt: ''I have this full listing description: [paste]. Now create optimized versions for: 1) Zillow (300 words), 2) Instagram (150 words with hashtags), 3) Print flyer (75 words with bullet points). Maintain the same voice and key selling points across all versions.''', NULL, 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_lessons (id, module_id, title, content, video_url, sort_order)
VALUES ('9-2', 9, 'Photo-Based Description Generation', 'Leverage AI vision capabilities to generate descriptions from listing photos:

**The Process:**
1. Upload your best 5-10 listing photos to Claude or ChatGPT (paid versions support images)
2. Use this prompt: ''Based on these listing photos, write a compelling description. Identify: architectural style, notable features visible, condition/updates, natural light quality, outdoor spaces, and overall vibe. 300 words, warm and inviting tone.''

**Why This Works:** AI can spot details you might overlook and describe them in fresh, creative language.

**Best Practice:** Always verify AI''s observations against reality. AI might misidentify materials or features.', NULL, 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_lessons (id, module_id, title, content, video_url, sort_order)
VALUES ('9-3', 9, 'The 5-Component Listing Formula Deep Dive', 'Take your listing descriptions from good to exceptional:

**Advanced Hook Techniques:**
- Question hooks: ''What if your morning commute was a walk through tree-lined streets?''
- Statistic hooks: ''In a market where homes sell in 7 days, this one deserves a second look.''
- Sensory hooks: ''The scent of fresh herbs from the kitchen garden greets you at the door.''

**Storytelling Mastery:**
Don''t describe rooms — describe moments. Not ''large kitchen with granite counters'' but ''Sunday morning pancakes on the granite island while the kids set the breakfast nook table.''

**AI Prompt for Premium Listings:**
''Write a luxury listing description using sensory language and lifestyle storytelling. Property: [details]. Budget buyer: [profile]. I want the reader to FEEL what living here is like. 400 words. Include one unexpected detail that creates memorability.''', NULL, 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_lessons (id, module_id, title, content, video_url, sort_order)
VALUES ('10-1', 10, 'Lead Response Sequences', 'Build automated yet personal-feeling response sequences:

**The 7-Touch Lead Sequence:**
Day 1: Immediate response (within 2 minutes) — personal, specific to inquiry
Day 2: Value-add follow-up — share relevant market insight
Day 4: Social proof — mention recent client success story
Day 7: Resource share — send neighborhood guide or market report
Day 14: Check-in — casual, non-pushy reconnection
Day 21: Value offer — free CMA, buyer consultation, etc.
Day 30: Long-term nurture transition — add to monthly newsletter

AI Prompt: ''Create a 7-touch email sequence for a [buyer/seller] lead in [area]. Each email should feel personal and provide genuine value. Include subject lines. The sequence should gradually build trust without being pushy.''', NULL, 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_lessons (id, module_id, title, content, video_url, sort_order)
VALUES ('10-2', 10, 'Transaction Update Templates', 'Keep clients informed and calm throughout the transaction:

**Key Milestone Updates:**
1. Offer accepted congratulations
2. Inspection scheduled notification
3. Inspection results explanation
4. Appraisal update
5. Loan approval celebration
6. Closing prep checklist
7. Post-closing thank you + next steps

AI Prompt: ''Write a client email explaining that the home inspection found [specific issues]. Strike a balance between honest transparency and reassurance. Explain what these findings typically mean, what our options are, and recommend next steps. Keep the tone calm and confident.''', NULL, 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_lessons (id, module_id, title, content, video_url, sort_order)
VALUES ('10-3', 10, 'Building Your Voice Profile System', 'Advanced voice matching for truly personalized AI communications:

**The Voice Profile Document:**
Create a master document with:
- 10 examples of your best emails
- Your preferred greetings and sign-offs
- Words you love and words you never use
- Your humor style (or lack thereof)
- Your communication philosophy

**Using It Consistently:**
Start EVERY AI prompt with: ''Using my voice profile below, [instruction]. Voice Profile: [paste]''

**Seasonal Updates:**
Update your voice profile quarterly with fresh examples. Your communication style evolves, and your AI should evolve with it.', NULL, 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_lessons (id, module_id, title, content, video_url, sort_order)
VALUES ('11-1', 11, 'Narrative CMA Reports', 'Transform your CMAs from spreadsheets into compelling stories:

**The Narrative Approach:**
Instead of just showing numbers, tell the story of the market.

''The [neighborhood] market has shifted notably in the past 90 days. While the median price increased 4.2% to $485,000, the real story is in the details: homes with updated kitchens are selling 12 days faster and commanding 8% premiums over comparable properties without updates.

For your home at [address], this means...''

**AI Prompt:**
''Create a narrative CMA report for [address]. Data: [comp details]. Write it as a story, not a spreadsheet. Explain WHY prices are what they are, not just what they are. Include adjustment explanations a homeowner would understand. 500 words, professional but conversational.''', NULL, 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_lessons (id, module_id, title, content, video_url, sort_order)
VALUES ('11-2', 11, 'Buyer Market Briefs', 'Give your buyer clients a competitive edge with AI-generated market briefs:

**The Buyer Brief Template:**
1. Current market conditions in their target area
2. Price trend analysis (is it getting more or less competitive?)
3. Inventory analysis (how many options are available?)
4. Strategy recommendations based on conditions
5. Comparable recent sales to set expectations

AI Prompt: ''Create a buyer market brief for someone looking in [area] with a budget of $[amount] for a [property type]. Include: current conditions, price trends, available inventory analysis, and strategic recommendations for making competitive offers in this market.''', NULL, 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_lessons (id, module_id, title, content, video_url, sort_order)
VALUES ('11-3', 11, 'Investment Analysis Reports', 'Position yourself as the go-to agent for investors with detailed AI-generated analysis:

**The Complete Investment Report:**
1. Property overview and acquisition cost analysis
2. Rental income projections (conservative, moderate, aggressive)
3. Operating expense breakdown
4. Cash flow analysis (monthly and annual)
5. ROI metrics: cap rate, cash-on-cash return, GRM
6. 5-year appreciation projection
7. Risk factors and mitigation strategies

AI Prompt: ''Create a comprehensive investment analysis for [property]. Purchase price: $[X]. Estimated rent: $[X]/month. Include three scenarios (conservative, moderate, aggressive) for rental income. Calculate all standard investment metrics. Present risks honestly. Format for a sophisticated investor audience.''', NULL, 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_lessons (id, module_id, title, content, video_url, sort_order)
VALUES ('12-1', 12, 'Social Media Content Calendars', 'Build a 90-day content engine using AI:

**The Content Pillar System:**
Create 5 content categories and rotate them:
1. Market Insights (educational)
2. Property Features (promotional)
3. Community Spotlight (engagement)
4. Behind the Scenes (personal)
5. Client Success Stories (social proof)

**AI Prompt for 90 Days:**
''Create a 90-day social media calendar for a real estate agent in [city]. 5 posts per week using these pillars: [list]. For each post: topic, platform (Instagram/LinkedIn/Facebook), caption (platform-optimized length), image suggestion, and 5 hashtags. Include seasonal/holiday tie-ins.''', NULL, 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_lessons (id, module_id, title, content, video_url, sort_order)
VALUES ('12-2', 12, 'Email Campaign Architecture', 'Build email campaigns that nurture leads into clients:

**Campaign Types:**
1. Welcome Series (new subscribers): 5 emails over 2 weeks
2. Buyer Education: 8 emails over 4 weeks
3. Seller Preparation: 6 emails over 3 weeks
4. Past Client Nurture: Monthly for 12 months
5. Market Update: Monthly newsletter

AI Prompt: ''Create a [campaign type] email sequence. Number of emails: [X]. Spacing: [frequency]. Each email needs: subject line (under 50 chars), preview text (under 100 chars), body copy (under 300 words), and CTA. The series should progressively build trust and lead toward [goal].''', NULL, 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_lessons (id, module_id, title, content, video_url, sort_order)
VALUES ('12-3', 12, 'Print and Digital Materials', 'Use AI to create compelling copy for all your marketing materials:

**Just Listed/Just Sold Postcards:**
''Write postcard copy for a [just listed/just sold] announcement. Property: [details]. Front: bold headline + one sentence hook. Back: 3 key features, market context sentence, and CTA with contact info. Make it scannable — use short phrases.''

**Neighborhood Guides:**
''Create a comprehensive neighborhood guide for [area]. Include: overview, schools, dining, recreation, commute info, market snapshot, and why people love living here. 800 words. Include section headers. Target: [audience].''

**Property Brochures:**
''Write copy for a luxury property brochure for [address]. Pages: cover (headline + tagline), lifestyle page (300 words), features page (organized by category), floor plan page (room descriptions), neighborhood page, agent bio page. Tone: sophisticated and aspirational.''', NULL, 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_lessons (id, module_id, title, content, video_url, sort_order)
VALUES ('13-1', 13, 'AI Transaction Timelines', 'Never miss a deadline with AI-generated transaction management:

**The Smart Timeline System:**
AI Prompt: ''Create a detailed transaction timeline for a [purchase/sale] in [state]. Closing date: [date]. Include every key milestone with:
- Action item
- Responsible party (buyer, seller, agent, lender, title)
- Deadline
- What happens if missed
- Reminder timing (when to follow up)

State-specific requirements for [state]. Format as a checklist.''

**Pro Tip:** Generate a new timeline for each transaction, customized to the specific deal terms, financing type, and state requirements.', NULL, 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_lessons (id, module_id, title, content, video_url, sort_order)
VALUES ('13-2', 13, 'Document Preparation Workflows', 'Use AI to prepare and review transaction documents efficiently:

**Pre-Listing Checklist:**
AI Prompt: ''Create a comprehensive pre-listing document checklist for a [property type] in [state]. Include every document the seller needs to gather, every disclosure required, and every form I need to prepare. Organize by category: seller documents, property documents, required disclosures, listing agreement components.''

**Post-Inspection Action Plans:**
AI Prompt: ''The home inspection revealed these issues: [list]. Create an action plan that: 1) Categorizes each issue (safety, structural, cosmetic, maintenance), 2) Estimates repair costs, 3) Recommends which to request repair vs. credit, 4) Drafts repair request language for the amendment.''', NULL, 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_lessons (id, module_id, title, content, video_url, sort_order)
VALUES ('13-3', 13, 'Post-Closing Workflows', 'The transaction ends at closing, but the relationship doesn''t:

**30-Day Post-Closing Sequence:**
Day 1: Closing day congratulations + gift delivery
Day 3: ''How''s the move going?'' check-in
Day 7: Utility setup reminder + local vendor recommendations
Day 14: ''Settling in?'' check-in + neighborhood guide
Day 30: Homeownership tips + request for review

**Annual Client Care Calendar:**
AI Prompt: ''Create a 12-month post-closing client care calendar. Include: seasonal home maintenance reminders, home anniversary acknowledgment, market value update, property tax reminder, and 4 touchpoints that provide genuine value. Make each contact feel personal, not automated.''', NULL, 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_lessons (id, module_id, title, content, video_url, sort_order)
VALUES ('14-1', 14, 'Brand Voice Development', 'Create a consistent, recognizable brand voice across all platforms:

**The Brand Voice Workshop:**
1. Define your brand personality (3-5 adjectives)
2. Identify your unique perspective on real estate
3. Create your ''do'' and ''don''t'' language guide
4. Establish your visual style consistency

AI Prompt: ''I''m a real estate agent who wants to be known for [qualities]. My target audience is [description]. My unique angle is [differentiator]. Create a comprehensive brand voice guide that includes: tone descriptors, vocabulary preferences (words to use/avoid), content themes, and example posts showing the voice in action across Instagram, LinkedIn, and Facebook.''', NULL, 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_lessons (id, module_id, title, content, video_url, sort_order)
VALUES ('14-2', 14, 'Content Repurposing Engine', 'Create once, publish everywhere — the smart way:

**The 1-to-7 Method:**
Start with one piece of long-form content and transform it into 7 pieces:
1. Long blog post or article (original)
2. Instagram carousel (key points)
3. LinkedIn article (professional angle)
4. Facebook post (community angle)
5. Email newsletter feature
6. Video script (1-2 minutes)
7. Twitter/X thread

AI Prompt: ''Take this article I wrote: [paste]. Now repurpose it into 6 additional formats: Instagram carousel (5 slides), LinkedIn post (200 words), Facebook post (150 words), email excerpt (100 words with link), 60-second video script, and Twitter thread (5 tweets). Maintain the core message but adapt for each platform''s audience and format.''', NULL, 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_lessons (id, module_id, title, content, video_url, sort_order)
VALUES ('14-3', 14, 'Engagement and Growth Strategies', 'Use AI to analyze and improve your social media performance:

**Weekly Review Prompt:**
''Here are my top 5 performing posts this week: [paste]. And my 3 worst: [paste]. Analyze: What made the top posts work? What can I learn from the underperformers? Give me 5 specific recommendations for next week''s content based on these patterns.''

**Community Building:**
AI Prompt: ''I want to build a local real estate community on [platform]. Create a strategy that includes: group/community name suggestions, weekly content themes, engagement prompts, rules/guidelines, and a 30-day launch plan to get the first 100 members.''

**Collaboration Strategy:**
''Create a list of 10 types of local businesses I should collaborate with for cross-promotion. For each, suggest a specific collaboration idea and a DM template I can send to initiate the partnership.''', NULL, 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_lessons (id, module_id, title, content, video_url, sort_order)
VALUES ('15-1', 15, 'The Winning Listing Presentation', 'Build a listing presentation framework that wins:

**The 10-Slide Structure:**
1. Cover: Your brand + property address
2. About You: Credibility and track record
3. Market Analysis: Current conditions
4. Pricing Strategy: CMA summary
5. Marketing Plan: Your full strategy
6. Online Presence: Digital marketing approach
7. Photography & Staging: Visual strategy
8. Timeline: From listing to closing
9. Communication: How you keep them informed
10. Next Steps: Clear path forward

AI Prompt: ''Create the content for a 10-slide listing presentation for [property]. My track record: [stats]. The seller''s main concerns are [concerns]. Write compelling content for each slide that addresses their concerns while showcasing my value.''', NULL, 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_lessons (id, module_id, title, content, video_url, sort_order)
VALUES ('15-2', 15, 'Buyer Guides That Convert', 'Create comprehensive buyer guides that establish your expertise:

AI Prompt: ''Create a first-time buyer guide for the [city] market. Include: step-by-step buying process, current market conditions, financing options, what to expect at each stage, common mistakes to avoid, and local-specific tips. 2000 words, organized with clear headers. Tone: encouraging and informative.''

**Sections to Include:**
1. The Home Buying Journey (overview timeline)
2. Financial Preparation (credit, savings, pre-approval)
3. Working with an Agent (your value proposition)
4. The Search Process
5. Making an Offer
6. Under Contract to Closing
7. Moving Day and Beyond', NULL, 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_lessons (id, module_id, title, content, video_url, sort_order)
VALUES ('15-3', 15, 'Quick-Turn Materials', 'Generate professional materials on tight deadlines:

**Open House Flyers (5 minutes):**
''Create open house flyer copy for [property] on [date/time]. Include: headline, 3 key features, agent info, and a QR code call-to-action suggestion. Fit on one page.''

**Client Thank You Notes (2 minutes):**
''Write a heartfelt closing day note for [client names] who just [bought/sold] [property type] in [area]. Reference [specific detail from our work together]. Handwritten style, 4-5 sentences.''

**Market Snapshot Graphics (3 minutes):**
''Create text content for a market snapshot infographic. Area: [area]. Stats: [data]. Format: 5 key stats with brief explanations. Make each stat have a headline, number, and one-sentence context.''', NULL, 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_lessons (id, module_id, title, content, video_url, sort_order)
VALUES ('16-1', 16, 'The AI Morning Briefing', 'Start every day informed and ready with your AI-powered morning routine:

**The 5-Minute Morning Briefing:**
1. Check MLS for new listings matching buyer criteria
2. Review overnight leads and prioritize
3. Check today''s transaction deadlines
4. Generate daily social media post
5. Review market news headlines

AI Prompt: ''Create my morning briefing. Today''s date: [date]. Active buyers looking for: [criteria]. Active listings: [addresses]. Pending transactions: [details]. Generate: 1) Buyer match alerts, 2) Priority task list, 3) Today''s social media post about [topic], 4) Any deadlines within 48 hours.''', NULL, 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_lessons (id, module_id, title, content, video_url, sort_order)
VALUES ('16-2', 16, 'The Listing Launch System', 'Systematize your listing launches for maximum impact:

**7-Day Listing Launch Sequence:**
Day -3: Coming Soon teaser on social media
Day -1: Email blast to agent network
Day 0: MLS entry + all platforms go live + social media blitz
Day 1: Targeted ads begin
Day 3: First open house
Day 5: Market feedback report to seller
Day 7: Strategy review and adjust

AI Prompt: ''Create a complete 7-day listing launch plan for [property] priced at $[X] in [area]. Generate all needed copy: coming soon post, agent email, social posts for days 0, 1, 3, 5, 7, targeted ad copy (Facebook + Instagram), and seller feedback report template. Target buyer: [profile].''', NULL, 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_lessons (id, module_id, title, content, video_url, sort_order)
VALUES ('16-3', 16, 'ROI Tracking and Business Intelligence', 'Use AI to track and optimize your business performance:

**Monthly Business Review Prompt:**
''Here are my numbers for [month]: Leads generated: [X], Showings: [X], Offers written: [X], Closings: [X], Revenue: $[X], Marketing spend: $[X], Time spent on admin: [X] hours.

Analyze my conversion rates at each stage. Compare to industry averages. Identify my biggest bottleneck. Suggest 3 specific improvements for next month. Calculate my cost per lead, cost per closing, and effective hourly rate.''

**Annual Business Plan:**
AI Prompt: ''Create a real estate business plan for [year]. Last year''s results: [summary]. My goals: [income/transaction targets]. Create a plan that includes: monthly targets, lead generation strategy, marketing budget allocation, systems to build, and skills to develop. Make it actionable with specific weekly activities.''', NULL, 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_lessons (id, module_id, title, content, video_url, sort_order)
VALUES ('17-1', 17, 'Assessment Overview', 'Congratulations on reaching the final module! Here''s what the certification assessment covers:

**Format:** 50 multiple-choice questions + 3 practical tasks

**Topics Covered:**
All 16 previous modules, weighted by section:
- AI Foundations (20%)
- Essential AI Tools (25%)
- Real Estate AI Workflows (30%)
- Advanced AI Strategies (25%)

**Passing Score:** 70% overall

**Practical Tasks:**
1. Write an AI-assisted listing description using the 5-component formula
2. Create an AI prompt that generates a client email matching a given voice profile
3. Design an AI-powered marketing plan for a property launch

**Certificate:** Upon passing, you''ll receive a professional AI Mastery for Real Estate certificate with your name, score, and completion date. This certificate can be shared on LinkedIn and included in your marketing materials.', NULL, 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_lessons (id, module_id, title, content, video_url, sort_order)
VALUES ('17-2', 17, 'Study Guide and Key Concepts', 'Review these key concepts before your assessment:

**Module 1-4 Review:**
- AI is a tool, not a replacement
- The RECIPE prompt formula (Role, Example, Context, Instructions, Parameters, Evaluate)
- Fair Housing compliance with AI (protected classes, safe practices)
- Data privacy best practices (anonymize before sharing)

**Module 5-8 Review:**
- 4 email categories (lead response, nurture, transaction, referral)
- Voice Profile creation and maintenance
- CMA narrative approach
- Social media content pillars and calendar strategy
- The 5-component listing formula

**Module 9-12 Review:**
- Multi-platform listing optimization
- 7-touch lead sequence
- Investment analysis metrics (cap rate, cash-on-cash, GRM)
- 90-day content calendar creation

**Module 13-16 Review:**
- Transaction timeline management
- Brand voice development
- The 1-to-7 content repurposing method
- 10-slide listing presentation structure
- AI morning briefing system
- Listing launch 7-day sequence', NULL, 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_lessons (id, module_id, title, content, video_url, sort_order)
VALUES ('17-3', 17, 'Begin Your Assessment', 'You''re ready! Click the quiz button below to begin your 50-question certification assessment.

**Tips for Success:**
1. Read each question carefully
2. Think about real-world application, not just theory
3. Trust your instincts — you''ve learned this material
4. You can retake the assessment if needed

**After Passing:**
- Your certificate will be generated automatically
- Download and save your certificate PDF
- Share on LinkedIn with the hashtag #AIRealtorCertified
- Add it to your email signature and marketing materials

**Remember:** This certification shows clients and colleagues that you''re at the forefront of real estate technology. You''ve invested in your future, and it will pay dividends.

Good luck, and congratulations on completing AI Mastery for Real Estate!', NULL, 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (1, 'What is the best description of AI for real estate agents?', '["A robot that replaces agents","Software that learns patterns to help you work smarter","A database of property listings","An automated phone system"]'::jsonb, 1, 1);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (1, 'Which area does AI NOT directly help with in real estate?', '["Writing listing descriptions","Physically showing homes to buyers","Creating marketing materials","Analyzing market data"]'::jsonb, 1, 2);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (1, 'What is the #1 predictor of lead conversion?', '["Price of the property","Agent''s years of experience","First response time","Number of photos in listing"]'::jsonb, 2, 3);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (1, 'By how much can AI reduce administrative tasks?', '["10-20%","30-40%","60-70%","90-100%"]'::jsonb, 2, 4);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (1, 'What is the best way to think about AI as a realtor?', '["It will replace my job","It''s a force multiplier for my expertise","It''s only for tech-savvy agents","It''s a passing trend"]'::jsonb, 1, 5);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (2, 'What is the free version of ChatGPT powered by?', '["GPT-4","GPT-3.5","GPT-5","Claude"]'::jsonb, 1, 1);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (2, 'What is Claude particularly good at compared to ChatGPT?', '["Image generation","Voice calls","Longer documents and nuanced content","Social media posts only"]'::jsonb, 2, 2);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (2, 'When should you upgrade to a paid AI plan?', '["Immediately — free versions are useless","When you''re using AI more than 20 times per day","Never — free is always sufficient","Only if your broker requires it"]'::jsonb, 1, 3);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (2, 'What should you include in an AI prompt for a listing description?', '["Just the address","Square footage, features, neighborhood, target buyer","Only the price","The MLS number"]'::jsonb, 1, 4);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (2, 'How much context can Claude handle in a single conversation?', '["1,000 words","10,000 words","Up to 200K tokens","Only 500 characters"]'::jsonb, 2, 5);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (3, 'What does the ''R'' stand for in the RECIPE formula?', '["Results","Role","Review","Respond"]'::jsonb, 1, 1);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (3, 'What is the most common prompt mistake realtors make?', '["Using too many details","Being too vague","Writing too much","Using technical jargon"]'::jsonb, 1, 2);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (3, 'What should you always do after AI generates content?', '["Post it immediately","Delete it and start over","Review, edit, and personalize it","Share it with your broker first"]'::jsonb, 2, 3);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (3, 'How can you get AI to match your writing style?', '["It''s impossible","Share examples of your past writing","Pay for the premium version","Use a special code word"]'::jsonb, 1, 4);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (3, 'What does the ''E'' at the end of RECIPE stand for?', '["Email","Example","Evaluate","Execute"]'::jsonb, 2, 5);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (4, 'Which of these is a Fair Housing violation risk with AI?', '["Using AI to write listing descriptions","Asking AI to describe a neighborhood''s demographics","Using AI for market analysis","Drafting follow-up emails with AI"]'::jsonb, 1, 1);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (4, 'What should you NEVER share with an AI tool?', '["Property square footage","General market trends","Client financial documents","Neighborhood amenities"]'::jsonb, 2, 2);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (4, 'What is the best practice before sharing client info with AI?', '["Get written consent for everything","Anonymize the details first","Only use paid AI tools","Share everything — AI is confidential"]'::jsonb, 1, 3);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (4, 'How should you frame AI use to clients?', '["Don''t mention it","Say AI does all your work","Explain it helps you work efficiently with human oversight","Tell them AI is more accurate than humans"]'::jsonb, 2, 4);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (4, 'Which phrase could be a Fair Housing red flag in AI-generated content?', '["Spacious backyard","Updated kitchen","Perfect for young professionals","Hardwood floors throughout"]'::jsonb, 2, 5);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (5, 'What are the 4 email categories every agent needs?', '["Morning, afternoon, evening, weekend","Lead response, nurture, transaction, referral","Buyers, sellers, investors, renters","Short, medium, long, follow-up"]'::jsonb, 1, 1);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (5, 'How much does responding within 5 minutes increase lead conversion?', '["50%","100%","200%","400%"]'::jsonb, 3, 2);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (5, 'What is an AI Voice Profile?', '["A recording of your voice","A style guide based on your best writing","Your AI account settings","A headshot for your email signature"]'::jsonb, 1, 3);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (5, 'What should you always add to an AI-generated email?', '["More buzzwords","A longer signature","One specific personal detail","Multiple property links"]'::jsonb, 2, 4);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (5, 'How often should you update your Voice Profile?', '["Never — set it once","Monthly","Every year","Only when AI updates"]'::jsonb, 1, 5);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (6, 'What does AI do best in a CMA?', '["Pulls MLS data automatically","Turns raw numbers into compelling narratives","Sets the final list price","Generates comparable sales"]'::jsonb, 1, 1);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (6, 'How many sections should a monthly market report have?', '["3","5","7","10"]'::jsonb, 1, 2);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (6, 'What should the ''My Take'' section of a market report include?', '["Just the statistics","Your personal prediction or observation","A disclaimer","Links to listings"]'::jsonb, 1, 3);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (6, 'What does ''cap rate'' measure in investment analysis?', '["Monthly mortgage payment","Annual return on property value","Tax deductions","Appreciation rate"]'::jsonb, 1, 4);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (6, 'What is YOUR role when AI generates a CMA narrative?', '["Nothing — AI handles it all","Verify data, apply local knowledge, make final recommendation","Just add your logo","Forward it to the client unchanged"]'::jsonb, 1, 5);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (7, 'What is the recommended content ratio for social media?', '["100% promotional","50/50 educational and promotional","60% educational, 30% entertaining, 10% promotional","All listing posts"]'::jsonb, 2, 1);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (7, 'What should always be on the first slide of an Instagram carousel?', '["Your headshot","A hook that grabs attention","Your contact info","The hashtags"]'::jsonb, 1, 2);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (7, 'How many tiers should your hashtag strategy have?', '["1","2","3","5"]'::jsonb, 2, 3);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (7, 'Should you automate AI engagement responses?', '["Yes — saves time","No — use AI as starting point, then personalize","Only on weekends","Only for negative comments"]'::jsonb, 1, 4);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (7, 'What content pillar is recommended for Mondays?', '["Fun content","Listing spotlight","Market data and insights","Neighborhood features"]'::jsonb, 2, 5);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (8, 'What is the first component of the listing description formula?', '["The address","The price","A hook/attention-grabber","The square footage"]'::jsonb, 2, 1);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (8, 'What should your agent bio lead with?', '["Your license date","What makes you different","Your brokerage name","Your phone number"]'::jsonb, 1, 2);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (8, 'How many email subject line variations should you test per campaign?', '["1","3-5","10-15","Just use one every time"]'::jsonb, 1, 3);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (8, 'What should a listing description NEVER start with?', '["A lifestyle statement","The address","A question","An emotional hook"]'::jsonb, 1, 4);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (8, 'What tone options work best for luxury property descriptions?', '["Casual and fun","Elegant and aspirational","Urgent and aggressive","Technical and detailed"]'::jsonb, 1, 5);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (9, 'What is the ideal length for a Zillow listing description?', '["75 words","150 words","250-400 words","1000+ words"]'::jsonb, 2, 1);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (9, 'What should you always do after AI generates a photo-based description?', '["Post it immediately","Verify observations against reality","Add more photos","Delete the photos"]'::jsonb, 1, 2);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (9, 'What type of hook uses sensory details?', '["Question hook","Statistic hook","Sensory hook","Price hook"]'::jsonb, 2, 3);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (9, 'Instead of describing rooms, what should you describe?', '["Square footage","Paint colors","Moments and lifestyle","Construction materials"]'::jsonb, 2, 4);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (9, 'For social media listings, what''s the maximum recommended word count?', '["50 words","150 words","400 words","1000 words"]'::jsonb, 1, 5);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (10, 'How many touches are in the recommended lead sequence?', '["3","5","7","10"]'::jsonb, 2, 1);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (10, 'When should the first lead response go out?', '["Within 24 hours","Within 2 minutes","Within 1 week","When you have time"]'::jsonb, 1, 2);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (10, 'How often should you update your Voice Profile?', '["Never","Monthly","Quarterly","Annually"]'::jsonb, 2, 3);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (10, 'What tone should an inspection results email strike?', '["Alarming and urgent","Honest transparency with reassurance","Overly optimistic","Legal and technical"]'::jsonb, 1, 4);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (10, 'What is the purpose of Touch #4 in the lead sequence?', '["Close the deal","Share a resource like a neighborhood guide","Ask for referrals","Send a contract"]'::jsonb, 1, 5);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (11, 'What makes a narrative CMA different from a traditional one?', '["It uses bigger fonts","It tells the story behind the numbers","It excludes comparable sales","It''s always shorter"]'::jsonb, 1, 1);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (11, 'How many sections should a buyer market brief have?', '["2","3","5","10"]'::jsonb, 2, 2);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (11, 'What investment metric measures annual return relative to property value?', '["Cash-on-cash return","Cap rate","GRM","ROI"]'::jsonb, 1, 3);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (11, 'How many rental income scenarios should an investment report include?', '["1 (best case)","2 (best and worst)","3 (conservative, moderate, aggressive)","5 scenarios"]'::jsonb, 2, 4);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (11, 'What should a CMA narrative explain that numbers alone cannot?', '["The MLS number","WHY prices are what they are","The agent''s commission","The loan terms"]'::jsonb, 1, 5);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (12, 'How many content pillars should your social media strategy have?', '["2","3","5","10"]'::jsonb, 2, 1);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (12, 'What''s the recommended length for a welcome email series?', '["1 email","5 emails over 2 weeks","20 emails over 6 months","Just one newsletter"]'::jsonb, 1, 2);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (12, 'What should the front of a postcard include?', '["Your full bio","Bold headline + one sentence hook","Market statistics","Multiple property photos"]'::jsonb, 1, 3);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (12, 'What is the 60/30/10 content ratio?', '["60% video, 30% photos, 10% text","60% educational, 30% entertaining, 10% promotional","60% listings, 30% sold, 10% personal","60% Instagram, 30% Facebook, 10% LinkedIn"]'::jsonb, 1, 4);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (12, 'How long should a neighborhood guide be?', '["100 words","300 words","800 words","2000 words"]'::jsonb, 2, 5);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (13, 'What should an AI transaction timeline include for each milestone?', '["Just the date","Action, responsible party, deadline, consequences, reminder timing","Only the agent''s tasks","Just the closing date"]'::jsonb, 1, 1);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (13, 'How should inspection issues be categorized?', '["By room","Safety, structural, cosmetic, maintenance","By cost only","By who caused them"]'::jsonb, 1, 2);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (13, 'When should the post-closing review request be sent?', '["Closing day","Day 3","Day 14","Day 30"]'::jsonb, 3, 3);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (13, 'Why generate a new timeline for each transaction?', '["AI forgets previous ones","Each deal has unique terms, financing, and state requirements","It''s required by law","Clients expect it"]'::jsonb, 1, 4);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (13, 'What should the annual client care calendar include?', '["Monthly sales pitches","Seasonal maintenance, anniversary, value updates, genuine value","Only holiday cards","Quarterly CMA reports"]'::jsonb, 1, 5);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (14, 'How many adjectives should define your brand personality?', '["1","3-5","10-15","As many as possible"]'::jsonb, 1, 1);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (14, 'What is the ''1-to-7 Method''?', '["Post 7 times a day","Transform 1 piece of content into 7 formats","Follow 7 influencers","Use 7 hashtags per post"]'::jsonb, 1, 2);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (14, 'How often should you review social media performance?', '["Monthly","Weekly","Daily","Quarterly"]'::jsonb, 1, 3);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (14, 'What''s a good first goal for a community group?', '["1,000 members in a week","100 members in 30 days","10,000 followers","Go viral immediately"]'::jsonb, 1, 4);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (14, 'What makes a brand voice consistent?', '["Using the same photo everywhere","Defined personality, vocabulary, and tone guide","Posting at the same time","Same hashtags every post"]'::jsonb, 1, 5);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (15, 'How many slides should a winning listing presentation have?', '["5","10","20","30"]'::jsonb, 1, 1);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (15, 'What should Slide 4 of a listing presentation cover?', '["Your bio","Market analysis","Pricing strategy with CMA","Photography plan"]'::jsonb, 2, 2);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (15, 'How long should a quick-turn open house flyer take to create with AI?', '["5 minutes","30 minutes","2 hours","1 day"]'::jsonb, 0, 3);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (15, 'What should a first-time buyer guide''s tone be?', '["Technical and legal","Encouraging and informative","Urgent and aggressive","Minimal and brief"]'::jsonb, 1, 4);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (15, 'What makes a closing thank-you note personal?', '["Using fancy stationery","Referencing a specific detail from working together","Making it long","Including market stats"]'::jsonb, 1, 5);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (16, 'How long should the AI morning briefing take?', '["30 seconds","5 minutes","30 minutes","1 hour"]'::jsonb, 1, 1);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (16, 'When should the ''coming soon'' social teaser go out?', '["Day of listing","3 days before","1 week before","After first showing"]'::jsonb, 1, 2);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (16, 'What should a monthly business review analyze?', '["Only revenue","Conversion rates at each stage","Only social media metrics","Just closing count"]'::jsonb, 1, 3);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (16, 'What''s included in the listing launch Day 0 activities?', '["Just MLS entry","MLS + all platforms + social media blitz","Only the open house","Agent email only"]'::jsonb, 1, 4);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (16, 'What business metric tells you your biggest growth opportunity?', '["Total revenue","The conversion bottleneck between stages","Number of social followers","Years in business"]'::jsonb, 1, 5);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (17, 'What is the RECIPE prompt formula?', '["A cooking technique","Role, Example, Context, Instructions, Parameters, Evaluate","Research, Execute, Create, Improve, Publish, Engage","Read, Edit, Check, Input, Print, Export"]'::jsonb, 1, 1);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (17, 'What is the passing score for certification?', '["50%","60%","70%","90%"]'::jsonb, 2, 2);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (17, 'How many content pillars should a social media strategy have?', '["2","5","8","12"]'::jsonb, 1, 3);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (17, 'What is the 1-to-7 content method?', '["Post 7 times daily","Transform 1 piece into 7 formats","Work 1 hour, earn 7 leads","Create 1 listing, get 7 offers"]'::jsonb, 1, 4);

INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)
VALUES (17, 'What should you ALWAYS do with AI-generated content?', '["Post immediately without review","Review, edit, and add personal expertise","Delete it and start from scratch","Share it only on social media"]'::jsonb, 1, 5);


