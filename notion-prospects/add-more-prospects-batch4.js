/**
 * Nick Digital — Add More Prospects (Batch 4)
 * Run: NOTION_KEY=... node add-more-prospects-batch4.js
 */

const { Client } = require('@notionhq/client');

const NOTION_KEY = process.env.NOTION_KEY;
const notion = new Client({ auth: NOTION_KEY });

const rt = (text) => [{ type: 'text', text: { content: String(text || '') } }];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function withRetry(fn, label, retries = 4) {
  for (let i = 0; i <= retries; i++) {
    try { return await fn(); } catch (e) {
      if (i === retries) throw e;
      const wait = 1000 * Math.pow(2, i);
      console.log(`    ⚠ Retry ${i + 1} in ${wait}ms for "${label}"…`);
      await sleep(wait);
    }
  }
}

async function addProspect(dbId, p, index) {
  const props = {
    'Business Name': { title: rt(p.name) },
    '#':             { number: index },
    'Status':        { select: { name: 'New' } },
    'Notes':         { rich_text: rt(p.notes || '') },
    'Has Website':   { select: { name: p.hasWebsite || 'No' } },
  };
  if (p.owner)     props['Owner Name']           = { rich_text: rt(p.owner) };
  if (p.location)  props['Location']              = { rich_text: rt(p.location) };
  if (p.phone)     props['Phone']                 = { rich_text: rt(p.phone) };
  if (p.website)   props['Website']               = { url: p.website };
  if (p.instagram) props['Instagram']             = { url: p.instagram };
  if (p.wqs)       props['Website Quality Score'] = { number: p.wqs };
  if (p.opp)       props['Opportunity Score']     = { number: p.opp };
  await withRetry(() => notion.pages.create({ parent: { database_id: dbId }, properties: props }), `add: ${p.name}`);
}

const DB = {
  plasticSurgery: '38d657af-efa9-81da-b04c-d4910b784937',
  personalInjury: '38d657af-efa9-81f3-92d6-d1a72328a513',
  roofing:        '38d657af-efa9-816e-9ba1-d06c5b7b7d70',
  hvac:           '38d657af-efa9-81f8-840f-f41b7774f06e',
  cosmeticDentist:'38d657af-efa9-8130-a9cc-f66d785d4fa0',
  chiroPT:        '38d657af-efa9-8163-aa10-ee5005b0f56c',
  realEstate:     '38d657af-efa9-8101-b4c4-f401f9a61122',
};

const BATCHES = [
  {
    label: '🔪 Plastic Surgery — Phoenix & Scottsdale',
    dbId: DB.plasticSurgery,
    prospects: [
      {
        name: 'John J. Corey, MD',
        owner: 'Dr. John J. Corey',
        location: 'Scottsdale, AZ',
        phone: '(480) 767-7700',
        website: 'https://doctorcorey.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Board-certified plastic surgeon serving Scottsdale, Phoenix, Gilbert, Mesa, Chandler. Solo practice with strong reputation. Website is decent but no automated consultation booking or post-consult nurture. Scottsdale/Phoenix affluent market = high-ticket procedures.',
      },
      {
        name: 'Scottsdale Center for Plastic Surgery',
        owner: 'Dr. Robert Cohen / Dr. Steven Sigalove',
        location: 'Paradise Valley, AZ',
        phone: '(480) 423-1973',
        website: 'https://www.scottsdalecenterforplasticsurgery.com',
        hasWebsite: 'Yes', wqs: 7, opp: 7,
        notes: 'Two board-certified surgeons, Paradise Valley location. Full cosmetic surgery menu. Decent website but no automated intake or drip sequence. Paradise Valley is one of the wealthiest zip codes in AZ — ultra-high-ticket clientele. Strong candidate for premium automation package.',
      },
      {
        name: 'Mosharrafa Plastic Surgery',
        owner: '',
        location: 'Phoenix, AZ',
        phone: '(602) 598-5060',
        website: 'https://mosharrafa.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Board-certified Phoenix plastic surgery group. Multi-surgeon practice. Website is functional but no automated consultation booking or post-procedure follow-up. Phoenix metro is one of the fastest-growing US cities — large addressable market for premium aesthetics.',
      },
      {
        name: 'Forma Plastic Surgery',
        owner: '',
        location: 'Scottsdale, AZ',
        phone: '(480) 657-2000',
        website: 'https://formaplasticsurgery.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Board-certified Scottsdale plastic surgeons with combined 60 years expertise. Cosmetic + reconstructive. Professional website but no automated booking funnel or post-consult drip. Scottsdale luxury market = clients expect premium digital experience. Great pitch target.',
      },
    ],
  },

  {
    label: '⚖️ Personal Injury — Miami',
    dbId: DB.personalInjury,
    prospects: [
      {
        name: 'Gerson & Schwartz Accident & Injury Lawyers',
        owner: 'Philip M. Gerson',
        location: 'Miami, FL',
        phone: '(305) 371-6000',
        website: 'https://www.injuryattorneyfla.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Founded by Philip M. Gerson in 1970. One of Miami\'s most established PI firms. Long-standing reputation but digital presence is dated. No automated intake or after-hours lead capture. Miami is a massive accident/personal injury market — automated lead capture would dramatically increase case volume.',
      },
      {
        name: 'Gallardo Law Firm',
        owner: '',
        location: 'Miami, FL',
        phone: '(305) 261-7000',
        website: 'https://gallardolawyers.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Miami personal injury law firm. Large Latin American client base. Spanish + English bilingual capability. No automated bilingual intake chatbot or post-consultation drip. Bilingual automation is a specific, powerful pitch for this firm given Miami\'s demographics.',
      },
      {
        name: 'Shaked Law Personal Injury Lawyers',
        owner: '',
        location: 'Miami, FL',
        phone: '(305) 937-0191',
        website: 'https://shakedlaw.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Miami personal injury firm focused on car accidents, slip and falls, wrongful death. Active digital presence but no automated 24/7 intake or case-status follow-up. Miami traffic accident volume is among the highest in the US — 24/7 intake bot is essential for capturing overnight leads.',
      },
    ],
  },

  {
    label: '🏠 Roofing — Denver',
    dbId: DB.roofing,
    prospects: [
      {
        name: 'Roofcorp of Metro Denver',
        owner: '',
        location: 'Denver, CO',
        phone: '(303) 766-2444',
        website: 'https://roofingexperts.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Family-owned Denver roofer since 1996, A+ BBB rating. Residential + commercial roofing. Denver hail season is brutal — storm damage leads pour in seasonally and disappear fast. Basic website with no automated hail storm capture page or follow-up drip. Strong pitch angle.',
      },
      {
        name: 'Elite Roofing & Solar',
        owner: '',
        location: 'Denver, CO',
        phone: '(303) 296-0361',
        website: 'https://elite-roofs.com',
        hasWebsite: 'Yes', wqs: 6, opp: 7,
        notes: 'GAF Master Elite roofing contractor in Denver since 2006. Roofing + solar combination. Growing solar demand + roofing = dual revenue stream that needs separate automated funnels for each. No solar estimate automation or cross-sell drip. Strong upsell pitch.',
      },
      {
        name: 'Quick Roofing',
        owner: '',
        location: 'Denver, CO',
        phone: '(303) 264-2832',
        website: 'https://quickroofing.com',
        hasWebsite: 'Yes', wqs: 6, opp: 7,
        notes: 'Family-owned Denver roofer since 1984. GAF Platinum Preferred contractor, A+ BBB. Established brand but digital automation is minimal. 40+ years of customer data with zero email/SMS drip marketing. Massive re-engagement opportunity for past customers + new seasonal campaigns.',
      },
    ],
  },

  {
    label: '❄️ HVAC — Portland',
    dbId: DB.hvac,
    prospects: [
      {
        name: 'Rose Heating & Air Conditioning',
        owner: '',
        location: 'Portland, OR',
        phone: '(503) 283-5183',
        website: 'https://www.roseheating.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Trusted Portland HVAC company since 1959. Over 65 years of local service. Legacy brand with an outdated digital presence. No automated maintenance reminders or online scheduling. Portland\'s cold wet winters + hot summers = year-round demand. Pitch: 65-year reputation deserves a modern automation stack.',
      },
      {
        name: 'A-TEMP Heating & Cooling',
        owner: '',
        location: 'Portland, OR',
        phone: '(503) 650-5014',
        website: 'https://www.atempheating.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Family-owned Portland HVAC company for 50+ years. Strong local reputation across Portland metro. Basic website with no automated booking or seasonal service reminders. Multi-decade customer base = huge opportunity for automated maintenance plan upsells and review collection.',
      },
      {
        name: 'Sunset Heating, Cooling & Electrical',
        owner: '',
        location: 'Portland, OR',
        phone: '(503) 500-5866',
        website: 'https://www.sunsethc.com',
        hasWebsite: 'Yes', wqs: 6, opp: 7,
        notes: 'Multi-service Portland company (HVAC + electrical + plumbing). Decades of local trust. Good website but no automated cross-sell between services or online scheduling. Multi-service model = multiple automated funnel opportunities. Pitch: each service line gets its own automated intake + follow-up flow.',
      },
    ],
  },

  {
    label: '🦷 Cosmetic Dentists — Scottsdale',
    dbId: DB.cosmeticDentist,
    prospects: [
      {
        name: 'ProSmile Dental Implant Center',
        owner: '',
        location: 'Scottsdale, AZ',
        phone: '(480) 878-7717',
        website: 'https://www.prosmileaz.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Board-certified oral surgeon + cosmetic dentist team. Scottsdale + Phoenix locations. Multi-location with no automated patient routing between sites. Dental implants = high-ticket ($3,000–$6,000+). No automated post-consultation follow-up. Scottsdale affluent market = ready buyers who need a push.',
      },
      {
        name: 'Alpers Family & Cosmetic Dentistry',
        owner: 'Dr. Kristopher Alpers',
        location: 'Scottsdale, AZ',
        phone: '(480) 998-3355',
        website: 'https://www.alpersdentistry.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Award-winning cosmetic + family dentistry in Scottsdale. Dr. Kristopher Alpers specializes in implants + cosmetic work. No automated new patient journey or post-visit review collection. Scottsdale patients are high-income and expect premium digital touchpoints — automation is the pitch.',
      },
      {
        name: 'Aesthetic Dentistry of Scottsdale',
        owner: 'Dr. Michael Kelly',
        location: 'Scottsdale, AZ',
        phone: '(480) 513-2620',
        website: 'https://www.aestheticdentistryofscottsdale.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'North Scottsdale cosmetic dentistry practice. Focus on veneers, implants, smile makeovers. Good reputation, 33 reviews. No automated consultation scheduling or post-treatment drip. North Scottsdale clientele = budget for premium procedures and premium digital experiences.',
      },
    ],
  },

  {
    label: '🦴 Chiro/PT — Denver',
    dbId: DB.chiroPT,
    prospects: [
      {
        name: 'Denver Chiropractic LLC',
        owner: '',
        location: 'Denver, CO',
        phone: '(303) 455-2225',
        website: 'https://denvercoloradochiropractic.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Denver chiropractic clinic. Established local practice. Basic website with minimal digital automation. Denver\'s outdoor-active population = high demand for chiro + injury recovery. No automated appointment reminders or review collection. Pitch: automated patient journey from first visit to 5-star Google review.',
      },
      {
        name: 'Denver Vitality Center',
        owner: '',
        location: 'Denver, CO',
        phone: '(303) 242-8089',
        website: 'https://denvervitalitycenter.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Premier chiropractic clinic with Denver + Lakewood locations. Multi-location practice with basic website. No automated cross-location patient routing or referral tracking. Multi-location = multi-funnel automation pitch. Denver is booming with young active professionals.',
      },
      {
        name: 'LoHi Chiropractic',
        owner: '',
        location: 'Denver, CO',
        phone: '(720) 644-9144',
        website: 'https://www.lohichiropractic.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Chiropractic practice in Denver\'s trendy LoHi (Lower Highlands) neighborhood. Young, affluent Denver professional clientele. Minimalist brand but no automated new patient intake or follow-up sequence. Neighborhood brand resonates — pitch: automated wellness check-ins + referral program for the fitness-focused LoHi crowd.',
      },
    ],
  },

  {
    label: '🏡 Real Estate — Miami Luxury',
    dbId: DB.realEstate,
    prospects: [
      {
        name: 'Luxe Living Realty',
        owner: '',
        location: 'Miami Beach, FL',
        phone: '(305) 673-6787',
        website: 'https://luxelivingmiami.com',
        hasWebsite: 'Yes', wqs: 7, opp: 7,
        notes: 'Premier boutique luxury brokerage — 3 Miami Beach locations (Lincoln Road, South of 5th, Fisher Island). Specializes in ultra-luxury Miami Beach condos + homes. Good website but no automated buyer drip or seller lead nurture. Miami Beach luxury market = high-commission transactions with clients expecting white-glove digital follow-up.',
      },
      {
        name: 'Best of Luxury Realty',
        owner: '',
        location: 'Aventura, FL',
        phone: '(305) 407-1657',
        website: 'https://www.bestofluxuryrealty.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Boutique luxury brokerage serving Miami-Dade, Broward, Palm Beach, Collier, Lee counties. Multi-county coverage without location-specific automation is a massive gap. No automated buyer/seller drip or CRM integration. South Florida luxury market is booming — automation ROI is huge at this scale.',
      },
      {
        name: 'The Jills Zeder Group',
        owner: 'The Jills Zeder Team',
        location: 'Miami Beach, FL',
        phone: '(305) 341-7447',
        website: 'https://jillszeder.com',
        hasWebsite: 'Yes', wqs: 7, opp: 7,
        notes: 'One of the top luxury real estate teams in the US, based in Miami Beach. $1B+ in sales volume. Good website but no automated buyer qualification or seller lead nurturing. At this transaction volume, even a 5% automation lift = millions in additional revenue. Premium pitch target.',
      },
    ],
  },
];

async function main() {
  console.log('\n🚀 Batch 4 — Adding more real US businesses to Notion…\n');
  let grandTotal = 0;

  for (const batch of BATCHES) {
    console.log(`${batch.label} (${batch.prospects.length})`);
    let added = 0;
    for (let i = 0; i < batch.prospects.length; i++) {
      const p = batch.prospects[i];
      try {
        await addProspect(batch.dbId, p, i + 1);
        process.stdout.write(`  ✓ ${p.name}\n`);
        added++;
      } catch (err) {
        console.error(`  ✗ ${p.name}: ${err.message}`);
      }
      await sleep(300);
    }
    console.log(`  → ${added}/${batch.prospects.length} added\n`);
    grandTotal += added;
    await sleep(400);
  }

  console.log(`\n✅ Batch 4 complete! ${grandTotal} new prospects added.\n`);
}

main().catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
