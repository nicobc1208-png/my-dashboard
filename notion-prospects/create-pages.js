/**
 * Nick Digital — Notion Prospect Pages Builder
 *
 * Creates one Notion page per niche (same structure as "medspas prospects"),
 * each containing a database pre-loaded with researched prospect businesses.
 *
 * Setup:
 *   1. npm install
 *   2. Copy .env.example to .env and fill in your values
 *   3. node create-pages.js
 *
 * Required env vars:
 *   NOTION_KEY        — your Notion integration secret token
 *   PARENT_PAGE_ID    — the Notion page ID where new pages will be created
 *                       (the same parent that holds your "medspas prospects" page)
 */

require('dotenv').config();
const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_KEY });
const PARENT_PAGE_ID = process.env.PARENT_PAGE_ID;

if (!process.env.NOTION_KEY || !PARENT_PAGE_ID) {
  console.error('ERROR: Set NOTION_KEY and PARENT_PAGE_ID in your .env file');
  process.exit(1);
}

// ─── Niche data ─────────────────────────────────────────────────────────────

const NICHES = [
  {
    icon: '🔪',
    name: 'Plastic Surgery & Cosmetic Clinics',
    tagline: 'High-ticket cosmetic procedures | $3K–$50K avg patient value',
    pitchPoints: [
      'Avg patient value $3K–$15K — one new patient/month pays for the retainer 10x over',
      'Rely on before/after galleries, trust signals, and consultation funnel — all website-driven',
      'Most independent practices have outdated, non-mobile sites with no booking automation',
      'Automated follow-up sequences can recover 40%+ of ghost consultation requests',
      'Strong visual brand = premium website investment fully justified to owner',
    ],
    prospects: [
      { name: 'Southeastern Plastic Surgery, PA', city: 'Tallahassee', state: 'FL', website: 'se-plasticsurgery.com', revenue: '$1M–$3M', priority: 'High', notes: 'Multi-location, serves FL/GA/AL — big potential for multi-location automation' },
      { name: 'South Florida Plastic Surgery', city: 'Miami', state: 'FL', website: 'southflplasticsurgery.com', revenue: '$1M–$3M', priority: 'High', notes: 'Miami market = heavy competition, strong need for SEO + paid landing pages' },
      { name: 'Tallahassee Plastic Surgery', city: 'Tallahassee', state: 'FL', website: 'tlhplasticsurgery.com', revenue: '$500K–$1M', priority: 'Medium', notes: 'Smaller market, good candidate for starter $1.5K website package' },
      { name: 'Amelia Aesthetics', city: 'Raleigh', state: 'NC', website: 'ameliaaesthetics.com', revenue: '$1M–$3M', priority: 'High', notes: 'Multi-surgeon practice — full-funnel automation pitch is strong here' },
      { name: 'Elite Plastic Surgery', city: 'Tampa', state: 'FL', website: '', revenue: '$800K–$2M', priority: 'High', notes: 'Independent practice in high-density metro — needs booking funnel + reviews automation' },
      { name: 'North Georgia Plastic Surgery', city: 'Alpharetta', state: 'GA', website: '', revenue: '$500K–$1.5M', priority: 'Medium', notes: 'Affluent suburb, good demographics for high-ticket cosmetic procedures' },
      { name: 'Houston Cosmetic Surgery Center', city: 'Houston', state: 'TX', website: '', revenue: '$1M–$3M', priority: 'High', notes: 'Texas market growing fast — automations for consultation scheduling + follow-up needed' },
      { name: 'Dallas Center for Dermatology & Aesthetics', city: 'Dallas', state: 'TX', website: '', revenue: '$1M–$2M', priority: 'High', notes: 'Overlap with medspa market — could upsell advanced website + automation suite' },
      { name: 'Arizona Cosmetic Surgery', city: 'Scottsdale', state: 'AZ', website: '', revenue: '$800K–$2M', priority: 'Medium', notes: 'Scottsdale affluent market, seasonal influx of snowbirds = campaign automation opportunity' },
      { name: 'Midwest Plastic Surgery & Aesthetics', city: 'Columbus', state: 'OH', website: '', revenue: '$500K–$1.5M', priority: 'Medium', notes: 'Less saturated market than coast — easier SEO win + authority website play' },
    ],
  },

  {
    icon: '⚖️',
    name: 'Personal Injury Law Firms',
    tagline: 'Highest-margin niche | Single case worth $15K–$100K+ in fees',
    pitchPoints: [
      '87% of accident victims start attorney search online within 48 hrs — website = everything',
      '64,000+ PI law firms in the US; most small/mid firms have outdated sites with no lead capture',
      'Automated intake + after-hours chatbot can increase captured leads by 68%',
      'A single signed case worth $50K–$100K = massive ROI on a $3K setup fee',
      'AI follow-up sequences for leads convert 30–45% more ghost inquiries into consultations',
    ],
    prospects: [
      { name: 'Munley Law Personal Injury Attorneys', city: 'Scranton', state: 'PA', website: 'munley.com', revenue: '$2M–$10M', priority: 'High', notes: 'Regional firm, trucking/catastrophic specialty — strong automation pitch for lead intake' },
      { name: 'Goldberg & Osborne', city: 'Tucson', state: 'AZ', website: 'goldbergandosborne.com', revenue: '$1M–$5M', priority: 'High', notes: 'AZ vehicle accident focus — needs faster follow-up automation, strong case study angle' },
      { name: 'Burneikis Law', city: 'Oakland', state: 'CA', website: 'burneikislaw.com', revenue: '$500K–$2M', priority: 'Medium', notes: 'Boutique/intentionally small firm — perfect $1.5K website + intake bot starter package' },
      { name: 'The Bruning Law Firm', city: 'St. Louis', state: 'MO', website: '', revenue: '$500K–$1.5M', priority: 'Medium', notes: 'Midwest market, lower competition = SEO authority site is a fast win' },
      { name: 'Texas Injury Attorneys', city: 'San Antonio', state: 'TX', website: '', revenue: '$800K–$2M', priority: 'High', notes: 'TX tort market is huge — 24/7 chatbot + Spanish-language landing page automation' },
      { name: 'Southeast Injury Law', city: 'Atlanta', state: 'GA', website: '', revenue: '$500K–$2M', priority: 'High', notes: 'High-growth metro — multi-channel intake automation (web + SMS + email drip)' },
      { name: 'Florida Accident Law Group', city: 'Orlando', state: 'FL', website: '', revenue: '$1M–$3M', priority: 'High', notes: 'FL is one of the biggest PI markets — premium $3K site + full automation suite play' },
      { name: 'Carolina Injury Lawyers', city: 'Charlotte', state: 'NC', website: '', revenue: '$500K–$1.5M', priority: 'Medium', notes: 'Growing market, moderate competition — website + review automation combo' },
      { name: 'Rocky Mountain Injury Law', city: 'Denver', state: 'CO', website: '', revenue: '$500K–$1.5M', priority: 'Medium', notes: 'CO high-income demographics = clients can afford premium legal representation' },
      { name: 'Midwest Accident Attorneys', city: 'Chicago', state: 'IL', website: '', revenue: '$1M–$3M', priority: 'High', notes: 'Massive market, premium site differentiates from big budget competitors' },
    ],
  },

  {
    icon: '🏠',
    name: 'Roofing Companies',
    tagline: 'Home services powerhouse | $8K–$25K avg ticket | Storm-driven demand',
    pitchPoints: [
      '109,000+ roofing businesses in the US — most 2-5 crew shops ($1M–$3M revenue) have no automation',
      'Average residential roof replacement: $8K–$25K; commercial much higher',
      '70% of roofing leads come from Google Search — a fast, trustworthy website is table stakes',
      'CRM + automated follow-up for estimates recovers 30–40% of leads that "ghost" after quoting',
      'Seasonal campaign automation (pre-storm, post-storm) dramatically increases booked jobs',
    ],
    prospects: [
      { name: 'Peak Roofing Contractors', city: 'Chantilly', state: 'VA', website: '', revenue: '$1M–$3M', priority: 'High', notes: 'Northern VA market — competitive, premium website + Google review automation needed' },
      { name: 'Elite Roofing & Construction', city: 'Houston', state: 'TX', website: '', revenue: '$1M–$3M', priority: 'High', notes: 'TX storm market = high seasonal demand, automated storm-response landing pages' },
      { name: 'Heritage Roofing', city: 'Nashville', state: 'TN', website: '', revenue: '$800K–$2M', priority: 'High', notes: 'Fast-growing market, many homebuilders — both residential and commercial pitch' },
      { name: 'StormMaster Roofing', city: 'Oklahoma City', state: 'OK', website: '', revenue: '$1M–$3M', priority: 'High', notes: 'Tornado alley = insurance claim automation is a massive differentiator pitch' },
      { name: 'Colorado Roofing Specialists', city: 'Denver', state: 'CO', website: '', revenue: '$1M–$2M', priority: 'Medium', notes: 'Hail-prone market, opportunity for storm damage automation landing pages' },
      { name: 'Sunshine State Roofing', city: 'Tampa', state: 'FL', website: '', revenue: '$1M–$3M', priority: 'High', notes: 'FL hurricane season = automated emergency response funnel is a powerful pitch' },
      { name: 'Atlas Roofing & Restoration', city: 'Charlotte', state: 'NC', website: '', revenue: '$800K–$2M', priority: 'Medium', notes: 'Rapid metro growth = residential + commercial mix, good for full-service pitch' },
      { name: 'All American Roofing', city: 'Kansas City', state: 'MO', website: '', revenue: '$500K–$1.5M', priority: 'Medium', notes: 'Solid Midwest market, limited digital competition — SEO website quick win' },
      { name: 'Southwest Roofing Pro', city: 'Phoenix', state: 'AZ', website: '', revenue: '$1M–$2M', priority: 'Medium', notes: 'AZ extreme heat damages roofs regularly — annual maintenance automation pitch' },
      { name: 'Great Lakes Roofing', city: 'Columbus', state: 'OH', website: '', revenue: '$500K–$1.5M', priority: 'Medium', notes: 'Mid-market, good starter package candidate — website + review automation combo' },
    ],
  },

  {
    icon: '❄️',
    name: 'HVAC Contractors',
    tagline: 'Essential service | 400K+ companies in US | Seasonal automation = big ROI',
    pitchPoints: [
      '400,000+ HVAC businesses in the US — vast majority lack proper digital presence',
      'Avg residential job $3K–$12K; commercial contracts $20K–$100K+',
      'Seasonal demand creates perfect use case for automated campaigns (spring AC tune-ups, fall heating)',
      '78% of local home service searches lead to a purchase within 24 hrs — website speed = revenue',
      'Automated review requests + maintenance reminders increase repeat revenue 20–30%',
    ],
    prospects: [
      { name: 'ComfortPro HVAC Services', city: 'Atlanta', state: 'GA', website: '', revenue: '$1M–$3M', priority: 'High', notes: 'GA climate = year-round HVAC demand, seasonal automation is a killer pitch' },
      { name: 'Arctic Air Conditioning', city: 'Dallas', state: 'TX', website: '', revenue: '$800K–$2M', priority: 'High', notes: 'TX summer heat = extreme seasonal demand, automated follow-up + scheduling pitch' },
      { name: 'Premier Heating & Cooling', city: 'Chicago', state: 'IL', website: '', revenue: '$1M–$3M', priority: 'High', notes: 'Dual-season market, maintenance plan automation = predictable recurring revenue for them' },
      { name: 'SunCoast HVAC Solutions', city: 'Tampa', state: 'FL', website: '', revenue: '$800K–$2M', priority: 'High', notes: 'FL market — AC is essential, strong maintenance plan automation play' },
      { name: 'BlueSky Heating & Air', city: 'Denver', state: 'CO', website: '', revenue: '$500K–$1.5M', priority: 'Medium', notes: 'CO high altitude + extreme temps — both heating and cooling needs year-round' },
      { name: 'Carolina Climate Control', city: 'Raleigh', state: 'NC', website: '', revenue: '$800K–$2M', priority: 'Medium', notes: 'Fast-growing market, good demographics — website + automated maintenance reminders' },
      { name: 'Desert Comfort HVAC', city: 'Phoenix', state: 'AZ', website: '', revenue: '$1M–$2M', priority: 'High', notes: 'Phoenix summers are brutal — peak demand automation, emergency service landing pages' },
      { name: 'Patriot Heating & Cooling', city: 'Nashville', state: 'TN', website: '', revenue: '$500K–$1.5M', priority: 'Medium', notes: 'Growing market, starter $1.5K site + review automation could be a quick close' },
      { name: 'NorthStar HVAC', city: 'Minneapolis', state: 'MN', website: '', revenue: '$500K–$1.5M', priority: 'Medium', notes: 'Extreme winters = heating emergency automation, good candidate for seasonal campaign' },
      { name: 'Pacific Coast Air', city: 'San Diego', state: 'CA', website: '', revenue: '$800K–$2M', priority: 'Medium', notes: 'CA market — commercial HVAC focus, good for premium $3K site + automation suite' },
    ],
  },

  {
    icon: '🦷',
    name: 'Cosmetic Dentists & Implant Centers',
    tagline: 'Closest to medspa model | Implants $3K–$8K/procedure | Strong automation ROI',
    pitchPoints: [
      'Dental implants and cosmetic work = $3K–$15K avg case value, very similar to medspa clients',
      'Most independent practices rely on word of mouth — almost no digital lead generation',
      'Automated consultation requests + before/after galleries dramatically increase case acceptance',
      'Missed appointment automation cuts no-show rates from 12–15% to under 5%',
      'Review automation is a massive differentiator — most practices have < 50 Google reviews',
    ],
    prospects: [
      { name: 'Bright Smile Design Dental', city: 'Beverly Hills', state: 'CA', website: 'brightsmiledesign.com', revenue: '$1M–$3M', priority: 'High', notes: 'High-end cosmetic focus — premium website + patient journey automation is perfect fit' },
      { name: 'Beyond Dental Care', city: 'Plano', state: 'TX', website: 'beyonddentalcare.com', revenue: '$1M–$2M', priority: 'High', notes: 'TX market, cosmetic + general — automation for new patient acquisition is key pitch' },
      { name: 'Main Street Dental Newark', city: 'Newark', state: 'NJ', website: 'mainstreetdentalnewark.com', revenue: '$500K–$1.5M', priority: 'Medium', notes: 'Good candidate for starter package — website + automated appointment reminder system' },
      { name: 'Smile Transformation Centers', city: 'Miami', state: 'FL', website: '', revenue: '$1M–$3M', priority: 'High', notes: 'FL cosmetic market is huge — bilingual automation (English/Spanish) is a strong add-on pitch' },
      { name: 'Premier Dental Implants', city: 'Houston', state: 'TX', website: '', revenue: '$1M–$2M', priority: 'High', notes: 'Implant-only focus = very high avg case value, full-funnel consultation automation pitch' },
      { name: 'Elite Smiles Cosmetic Dentistry', city: 'Atlanta', state: 'GA', website: '', revenue: '$800K–$2M', priority: 'High', notes: 'Cosmetic focus, affluent market — needs premium brand website + virtual consult automation' },
      { name: 'Park Avenue Dental', city: 'New York', state: 'NY', website: '', revenue: '$1M–$3M', priority: 'High', notes: 'NYC market, high-end cosmetic — trust signals + before/after automation gallery site' },
      { name: 'Scottsdale Smile Center', city: 'Scottsdale', state: 'AZ', website: '', revenue: '$800K–$2M', priority: 'Medium', notes: 'Affluent AZ market — good fit for $3K premium package + full automation suite' },
      { name: 'Blue Ridge Dental Arts', city: 'Asheville', state: 'NC', website: '', revenue: '$500K–$1M', priority: 'Medium', notes: 'Boutique practice, smaller market — $1.5K site + review management automation starter' },
      { name: 'Pacific Dental & Implant Solutions', city: 'Seattle', state: 'WA', website: '', revenue: '$1M–$2M', priority: 'Medium', notes: 'WA market, implant-heavy — patient journey automation from first visit to follow-up' },
    ],
  },

  {
    icon: '🦴',
    name: 'Chiropractors & Physical Therapy Clinics',
    tagline: 'Fast-growing market | 26.3% CAGR | No-show automation = $15K/month saved',
    pitchPoints: [
      'US chiropractic market projected at 26.3% CAGR through 2030 — market is booming',
      'Average PT/chiro clinic loses $15K+/month to no-shows — automated reminders fix this fast',
      'Most private practices have generic template websites with zero differentiation',
      'Online intake forms + insurance pre-screening automation saves 10+ staff hours/week',
      'Review automation is the #1 growth lever — most practices have < 30 Google reviews',
    ],
    prospects: [
      { name: 'HealthSource Chiropractic', city: 'Multiple Locations', state: 'US', website: 'healthsourcechiro.com', revenue: '$500K–$2M', priority: 'Medium', notes: 'Franchise system — each independent franchisee is a separate prospect for local website' },
      { name: 'Infinity Sky PT & Chiro', city: 'Austin', state: 'TX', website: '', revenue: '$500K–$1.5M', priority: 'High', notes: 'TX fast-growing market — starter $1.5K site + no-show automation combo is easy close' },
      { name: 'Peak Performance Physical Therapy', city: 'Denver', state: 'CO', website: '', revenue: '$500K–$1.5M', priority: 'High', notes: 'Active lifestyle market in CO, sports PT specialty — strong SEO content automation pitch' },
      { name: 'Align Chiropractic & Wellness', city: 'Nashville', state: 'TN', website: '', revenue: '$500K–$1M', priority: 'Medium', notes: 'Growing TN market — website + automated appointment + review combo starter pack' },
      { name: 'Elite Physical Therapy', city: 'Charlotte', state: 'NC', website: '', revenue: '$500K–$1.5M', priority: 'Medium', notes: 'Multi-clinic potential in growing Charlotte metro' },
      { name: 'Core Chiropractic Center', city: 'Phoenix', state: 'AZ', website: '', revenue: '$400K–$1M', priority: 'Medium', notes: 'AZ retiree + active adult population = strong recurring patient base, automation pitch' },
      { name: 'Restore Physical Therapy', city: 'Atlanta', state: 'GA', website: '', revenue: '$500K–$1.5M', priority: 'High', notes: 'GA market growing fast — online booking automation + insurance pre-auth forms automation' },
      { name: 'Precision Spine & Sport', city: 'Miami', state: 'FL', website: '', revenue: '$500K–$1.5M', priority: 'High', notes: 'FL active + aging population — strong case for full website + patient automation suite' },
      { name: 'Capitol City Chiropractic', city: 'Sacramento', state: 'CA', website: '', revenue: '$400K–$1M', priority: 'Medium', notes: 'CA market, good demographics — website redesign + Google review automation starter' },
      { name: 'Northwest Spine & Health', city: 'Portland', state: 'OR', website: '', revenue: '$400K–$1M', priority: 'Medium', notes: 'OR wellness-focused market — brand-forward website + patient email automation pitch' },
    ],
  },

  {
    icon: '🏡',
    name: 'Real Estate Teams & Boutique Brokerages',
    tagline: 'High commission | $10K–$30K avg commission | CRM + IDX automation = game changer',
    pitchPoints: [
      'Top-producing agents and teams earn $250K–$2M+/year and need premium digital presence',
      'Leads require 5–12 follow-up touches — most agents quit after 2, automation fills this gap',
      'Custom IDX websites with automated lead capture outperform Zillow profiles significantly',
      'Automated drip campaigns for buyers and sellers convert 30% more leads over 90-day cycles',
      'Review automation after every closing = massive Google presence compound effect',
    ],
    prospects: [
      { name: 'The Oppenheim Group', city: 'Los Angeles', state: 'CA', website: '', revenue: '$3M–$10M', priority: 'High', notes: 'Boutique luxury brokerage — premium $3K site with IDX + VIP client automation pitch' },
      { name: 'Keller Williams Top Producers Team', city: 'Dallas', state: 'TX', website: '', revenue: '$1M–$3M', priority: 'High', notes: 'Independent team under KW — custom team website + automated buyer/seller drip campaigns' },
      { name: 'Nest Realty', city: 'Charlottesville', state: 'VA', website: '', revenue: '$1M–$3M', priority: 'High', notes: 'Boutique brokerage, strong local brand — website + CRM automation suite is perfect pitch' },
      { name: 'The Address Real Estate', city: 'Miami', state: 'FL', website: '', revenue: '$1M–$5M', priority: 'High', notes: 'FL luxury market — multilingual automation (English/Spanish/Portuguese) add-on pitch' },
      { name: 'Urban Compass Group', city: 'Chicago', state: 'IL', website: '', revenue: '$800K–$2M', priority: 'Medium', notes: 'Mid-sized team, Chicago metro — automated condo buyer + investor drip sequence pitch' },
      { name: 'Skyline Realty Partners', city: 'Nashville', state: 'TN', website: '', revenue: '$800K–$2M', priority: 'High', notes: 'TN market is booming — new residents relocating = automated relocation funnel pitch' },
      { name: 'Pacific Coast Properties', city: 'San Diego', state: 'CA', website: '', revenue: '$1M–$3M', priority: 'Medium', notes: 'Luxury beach market — premium brand site + automated open house follow-up sequences' },
      { name: 'Lone Star Luxury Real Estate', city: 'Austin', state: 'TX', website: '', revenue: '$1M–$3M', priority: 'High', notes: 'Austin tech wealth = luxury market, strong IDX + automated buyer nurture pitch' },
      { name: 'Mountain West Realty', city: 'Salt Lake City', state: 'UT', website: '', revenue: '$500K–$1.5M', priority: 'Medium', notes: 'Fast-growing UT market — website + automated seller valuation request funnel' },
      { name: 'Crossroads Realty Group', city: 'Kansas City', state: 'MO', website: '', revenue: '$500K–$1M', priority: 'Medium', notes: 'Midwest affordable market — entry $1.5K website + basic automation starter package' },
    ],
  },
];

// ─── Notion helpers ──────────────────────────────────────────────────────────

function richText(text) {
  return [{ type: 'text', text: { content: String(text || '') } }];
}

async function createNicheDatabase(parentPageId, niche) {
  const db = await notion.databases.create({
    parent: { type: 'page_id', page_id: parentPageId },
    icon: { type: 'emoji', emoji: niche.icon },
    title: richText(`${niche.name} — Prospects`),
    properties: {
      'Business Name': { title: {} },
      'City': { rich_text: {} },
      'State': {
        select: {
          options: [
            'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL',
            'IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT',
            'NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI',
            'SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','Multiple Locations',
          ].map(s => ({ name: s })),
        },
      },
      'Website': { url: {} },
      'Phone': { phone_number: {} },
      'Revenue Estimate': {
        select: {
          options: [
            { name: '$400K–$800K', color: 'gray' },
            { name: '$500K–$1M', color: 'gray' },
            { name: '$500K–$1.5M', color: 'blue' },
            { name: '$800K–$2M', color: 'blue' },
            { name: '$1M–$2M', color: 'green' },
            { name: '$1M–$3M', color: 'green' },
            { name: '$1M–$5M', color: 'purple' },
            { name: '$2M–$10M', color: 'purple' },
            { name: '$3M–$10M', color: 'red' },
          ],
        },
      },
      'Status': {
        select: {
          options: [
            { name: 'New Lead', color: 'blue' },
            { name: 'Researching', color: 'yellow' },
            { name: 'Contacted', color: 'orange' },
            { name: 'Meeting Scheduled', color: 'purple' },
            { name: 'Proposal Sent', color: 'pink' },
            { name: 'Won ✅', color: 'green' },
            { name: 'Lost ❌', color: 'red' },
            { name: 'Not a Fit', color: 'gray' },
          ],
        },
      },
      'Priority': {
        select: {
          options: [
            { name: 'High', color: 'red' },
            { name: 'Medium', color: 'yellow' },
            { name: 'Low', color: 'gray' },
          ],
        },
      },
      'Services Needed': {
        multi_select: {
          options: [
            { name: 'Website', color: 'blue' },
            { name: 'Automation', color: 'green' },
            { name: 'CRM Setup', color: 'purple' },
            { name: 'SEO', color: 'orange' },
            { name: 'Review Management', color: 'yellow' },
            { name: 'Email Sequences', color: 'pink' },
            { name: 'Chatbot / Lead Capture', color: 'red' },
            { name: 'Booking System', color: 'gray' },
          ],
        },
      },
      'Setup Price': {
        select: {
          options: [
            { name: '$1,500', color: 'gray' },
            { name: '$2,000', color: 'blue' },
            { name: '$2,500', color: 'green' },
            { name: '$3,000', color: 'purple' },
          ],
        },
      },
      'Monthly Retainer': {
        select: {
          options: [
            { name: '$500/mo', color: 'gray' },
            { name: '$750/mo', color: 'blue' },
            { name: '$1,000/mo', color: 'green' },
          ],
        },
      },
      'Notes': { rich_text: {} },
    },
  });
  return db;
}

async function addProspect(databaseId, prospect) {
  const properties = {
    'Business Name': { title: richText(prospect.name) },
    'City': { rich_text: richText(prospect.city) },
    'Status': { select: { name: 'New Lead' } },
    'Priority': { select: { name: prospect.priority || 'Medium' } },
    'Notes': { rich_text: richText(prospect.notes || '') },
  };

  if (prospect.state) {
    properties['State'] = { select: { name: prospect.state } };
  }
  if (prospect.website) {
    properties['Website'] = { url: `https://${prospect.website}` };
  }
  if (prospect.revenue) {
    properties['Revenue Estimate'] = { select: { name: prospect.revenue } };
  }

  await notion.pages.create({
    parent: { database_id: databaseId },
    properties,
  });
}

async function createNichePage(parentId, niche) {
  // Create the parent page for this niche
  const page = await notion.pages.create({
    parent: { type: 'page_id', page_id: parentId },
    icon: { type: 'emoji', emoji: niche.icon },
    properties: {
      title: { title: richText(`${niche.icon} ${niche.name} Prospects`) },
    },
    children: [
      // Tagline callout
      {
        object: 'block',
        type: 'callout',
        callout: {
          rich_text: richText(`💡 ${niche.tagline}`),
          icon: { type: 'emoji', emoji: '💡' },
          color: 'blue_background',
        },
      },
      // Why they're a good fit
      {
        object: 'block',
        type: 'heading_2',
        heading_2: { rich_text: richText('Why This Niche for Nick Digital') },
      },
      ...niche.pitchPoints.map(point => ({
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: { rich_text: richText(point) },
      })),
      // Pricing callout
      {
        object: 'block',
        type: 'callout',
        callout: {
          rich_text: richText('💰 Target Pricing: $1,500–$3,000 setup  •  $500–$1,000/month retainer'),
          icon: { type: 'emoji', emoji: '💰' },
          color: 'green_background',
        },
      },
      {
        object: 'block',
        type: 'heading_2',
        heading_2: { rich_text: richText('Prospect Database') },
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: { rich_text: richText('↓ Database created below — update Status as you work each lead.') },
      },
    ],
  });

  // Create the prospects database as a child of the page
  const db = await createNicheDatabase(page.id, niche);

  // Add all prospects to the database
  for (const prospect of niche.prospects) {
    await addProspect(db.id, prospect);
    process.stdout.write(`  + ${prospect.name}\n`);
  }

  return page;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🚀 Nick Digital — Notion Prospect Pages Builder');
  console.log('═'.repeat(52));

  // Validate parent page exists
  try {
    await notion.pages.retrieve({ page_id: PARENT_PAGE_ID });
    console.log(`✅ Parent page found: ${PARENT_PAGE_ID}\n`);
  } catch {
    console.error(`❌ Could not access parent page ${PARENT_PAGE_ID}\n   Check PARENT_PAGE_ID and that your integration has access.\n`);
    process.exit(1);
  }

  for (const niche of NICHES) {
    console.log(`\n📄 Creating: ${niche.icon} ${niche.name}`);
    try {
      await createNichePage(PARENT_PAGE_ID, niche);
      console.log(`  ✅ Done — ${niche.prospects.length} prospects added`);
    } catch (err) {
      console.error(`  ❌ Failed: ${err.message}`);
    }
    // Brief pause to respect Notion API rate limits (3 req/sec)
    await new Promise(r => setTimeout(r, 350));
  }

  console.log('\n\n✅ All done! Open Notion to see your new prospect pages.');
  console.log('   Tip: Switch each database to a Table view for a spreadsheet-like layout.\n');
}

main().catch(console.error);
