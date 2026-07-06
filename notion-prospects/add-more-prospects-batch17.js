/**
 * Nick Digital — Add More Prospects (Batch 17)
 * Run: NOTION_KEY=... node add-more-prospects-batch17.js
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
    label: '🔪 Plastic Surgery — Orlando, FL',
    dbId: DB.plasticSurgery,
    prospects: [
      {
        name: 'Altamonte Plastic Surgery',
        owner: 'Dr. Marcus Crawford',
        location: 'Altamonte Springs, FL',
        phone: '(407) 834-9955',
        website: 'https://www.altamonteplasticsurgery.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Board-certified plastic surgeon in Altamonte Springs (Orlando suburb). Comprehensive cosmetic + reconstructive menu. Orlando metro has 3M+ people and a high tourism/hospitality workforce with disposable income for aesthetics. No automated consultation booking or post-consult drip. Orlando is a massively underserved plastic surgery market for digital agencies.',
      },
      {
        name: 'Millard Plastic Surgery Centers',
        owner: 'Dr. Jeffery Millard',
        location: 'Orlando, FL',
        phone: '(407) 365-3009',
        website: 'https://www.millardplastic.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Board-certified Orlando plastic surgeon with two Central Florida locations (Oviedo + Orlando). Multi-location plastic surgery practice without multi-location automation. Orlando\'s tech corridor (Lake Nona, Medical City) brings high-income professionals. No automated consultation booking or cross-location patient routing. Strong multi-location automation pitch.',
      },
      {
        name: 'Todd Remington MD Plastic Surgery',
        owner: 'Dr. Todd Remington',
        location: 'Orlando, FL',
        phone: '(407) 897-1777',
        website: 'https://www.drremington.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Board-certified plastic surgeon in College Park, Orlando. Solo boutique practice serving Central Florida. College Park is one of Orlando\'s most desirable neighborhoods — affluent, walkable, professional. No automated consultation funnel or post-procedure follow-up. Orlando\'s booming population growth means constant new potential aesthetic patients entering the market.',
      },
    ],
  },

  {
    label: '⚖️ Personal Injury — Orlando & Jacksonville, FL',
    dbId: DB.personalInjury,
    prospects: [
      {
        name: 'Morgan & Morgan — Orlando',
        owner: '',
        location: 'Orlando, FL',
        phone: '(407) 420-1414',
        website: 'https://www.forthepeople.com/florida/orlando',
        hasWebsite: 'Yes', wqs: 7, opp: 7,
        notes: 'Orlando office of America\'s largest personal injury firm. Morgan & Morgan is headquartered in Orlando and dominates Florida PI advertising. Despite massive infrastructure, local office intake still relies on call centers — no automated local chatbot or SMS follow-up for web leads. Florida is a no-fault state with massive accident volume. Pitch: local automated web lead response.',
      },
      {
        name: 'Rue & Ziffra',
        owner: '',
        location: 'Port Orange, FL',
        phone: '(386) 788-7700',
        website: 'https://www.rueziffra.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Established Florida PI firm with offices in Daytona Beach area. 40+ years helping Florida accident victims. Volusia County has high accident rates on I-4 and US-1. No automated intake or post-settlement review collection. I-4 corridor between Orlando and Daytona = one of Florida\'s deadliest highways — constant PI case supply.',
      },
      {
        name: 'Pajcic & Pajcic',
        owner: '',
        location: 'Jacksonville, FL',
        phone: '(904) 358-8881',
        website: 'https://www.pajcic.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'One of Jacksonville\'s most recognized PI firms with 40+ years of service. Multi-attorney team with high-profile cases. Jacksonville is Florida\'s largest city by area (900+ sq miles) with significant military + logistics workforce. No automated 24/7 intake or post-settlement review program. Jacksonville\'s size + military presence = large, consistent PI caseload.',
      },
    ],
  },

  {
    label: '🏠 Roofing — Orlando & Jacksonville, FL',
    dbId: DB.roofing,
    prospects: [
      {
        name: 'Weathermaster Roofing',
        owner: '',
        location: 'Kissimmee, FL',
        phone: '(407) 933-7333',
        website: 'https://www.weathermasterroofing.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Central Florida roofer serving Kissimmee and the greater Orlando area. Hurricane season + heavy Florida rains create massive roofing demand. No automated storm damage intake or hurricane prep campaigns. Kissimmee is in Osceola County — one of the fastest-growing counties in Florida. Growing market + storm exposure = strong roofing demand with automation amplifying lead capture.',
      },
      {
        name: 'RoofClaim.com',
        owner: '',
        location: 'Orlando, FL',
        phone: '(888) 662-7663',
        website: 'https://www.roofclaim.com',
        hasWebsite: 'Yes', wqs: 6, opp: 7,
        notes: 'Florida storm damage roofing specialist with a focus on insurance claim assistance. Florida hurricane market = insurance claims are the dominant driver of roofing revenue. Digital-forward brand but no automated post-storm SMS outreach campaigns. Pitch: automated storm alert campaigns + insurance claim intake sequences timed to named storm events.',
      },
      {
        name: 'Premier Roofing — Jacksonville',
        owner: '',
        location: 'Jacksonville, FL',
        phone: '(904) 701-5000',
        website: 'https://premierroofingfl.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Jacksonville roofing contractor serving North Florida. Residential + commercial. Jacksonville has a large geographic footprint — roofing companies that serve all of Duval, St. Johns, and Clay counties need strong digital infrastructure. No automated estimate requests or review collection. Jacksonville\'s suburban growth (Ponte Vedra, Fleming Island, Nocatee) = constant new roofing demand.',
      },
    ],
  },

  {
    label: '❄️ HVAC — Orlando & Jacksonville, FL',
    dbId: DB.hvac,
    prospects: [
      {
        name: 'Rinaldi\'s Air Conditioning & Heating',
        owner: '',
        location: 'Orlando, FL',
        phone: '(407) 275-0705',
        website: 'https://www.rinaldis.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Family-owned Orlando HVAC company since 1969. Over 50 years serving Central Florida. Orlando\'s tropical climate means AC runs 10–11 months per year — HVAC is not seasonal, it\'s year-round necessity. No automated maintenance reminders or post-service reviews. 50 years of customer data with zero email/SMS marketing = massive re-engagement revenue.',
      },
      {
        name: 'Sun Air Solutions',
        owner: '',
        location: 'Orlando, FL',
        phone: '(407) 656-3844',
        website: 'https://sunairsolutions.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Local Orlando HVAC contractor serving Orange and Seminole counties. Residential focus. Orlando is one of the fastest-growing US metros — massive new construction + population influx means constant HVAC installation and service demand. No automated new homeowner outreach or maintenance plan campaigns. Fast-growing market = strong ROI on automation.',
      },
      {
        name: 'Climate Masters',
        owner: '',
        location: 'Jacksonville, FL',
        phone: '(904) 356-3963',
        website: 'https://www.climatemasters.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Jacksonville HVAC company with 25+ years of service. Residential + light commercial. Jacksonville\'s subtropical climate means AC is essential from April through October. No automated seasonal campaigns or post-service review collection. Jacksonville is FL\'s largest city by population and rapidly growing — automation serves a constantly expanding customer base.',
      },
    ],
  },

  {
    label: '🦷 Cosmetic Dentists — Orlando & Jacksonville',
    dbId: DB.cosmeticDentist,
    prospects: [
      {
        name: 'Windermere Dental Group',
        owner: '',
        location: 'Windermere, FL',
        phone: '(407) 905-0100',
        website: 'https://www.windermereditalgroupfl.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Cosmetic + family dental practice in Windermere (one of Orlando\'s most affluent communities). Dr. Phillips, Windermere, and Bay Hill are home to professional athletes, executives, and high-income professionals. No automated new patient intake or smile consultation funnel. Premium Orlando suburb = ideal client demographic for high-ticket cosmetic dentistry.',
      },
      {
        name: 'Premier Dental of Orlando',
        owner: '',
        location: 'Orlando, FL',
        phone: '(407) 857-1700',
        website: 'https://www.premierdentaloforlando.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Cosmetic + implant + family dentistry in South Orlando. Multi-service dental practice. Orlando\'s massive population growth means constant stream of new residents needing a dental home. No automated new patient acquisition or review collection. Orlando is one of the fastest-growing US cities — new resident outreach automation is a powerful, predictable pitch.',
      },
      {
        name: 'Dent1st — Jacksonville',
        owner: '',
        location: 'Jacksonville, FL',
        phone: '(904) 296-2555',
        website: 'https://www.dent1st.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Multi-location dental group in Jacksonville with several offices across Duval and St. Johns Counties. General + cosmetic + orthodontics. Multi-location model with no location-specific automation. Jacksonville\'s geographic sprawl (900 sq miles) means location-specific marketing matters enormously. Each location gets its own automated intake funnel = strong multi-location pitch.',
      },
    ],
  },

  {
    label: '🦴 Chiro/PT — Orlando & Jacksonville, FL',
    dbId: DB.chiroPT,
    prospects: [
      {
        name: 'Injury Centers of Brevard',
        owner: '',
        location: 'Melbourne, FL',
        phone: '(321) 622-3200',
        website: 'https://www.injurycentersofbrevard.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'PI-focused chiropractic + injury rehabilitation in Brevard County (Space Coast, east of Orlando). Melbourne and Brevard County are growing rapidly with Space X, Boeing, and NASA bringing high-income aerospace workers. Auto accident chiro cases are the primary driver. No automated PI intake or attorney referral program. Space Coast growth = expanding patient base.',
      },
      {
        name: 'Back to Health Chiropractic — Orlando',
        owner: '',
        location: 'Orlando, FL',
        phone: '(407) 898-6200',
        website: 'https://www.orlandochiropractor.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Established chiropractic practice in Orlando serving the Mills 50 / Colonialtown area. Orlando\'s active tourism and hospitality workforce (Disney, Universal, hotels) = high rates of repetitive strain and injury. No automated new patient intake or post-visit follow-up. Orlando is a 3M+ metro with massive chiro demand — automation gives a competitive edge.',
      },
      {
        name: 'Beaches Chiropractic & Rehabilitation',
        owner: '',
        location: 'Jacksonville Beach, FL',
        phone: '(904) 247-1250',
        website: 'https://www.beacheschiropractic.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Chiropractic + physical therapy at Jacksonville Beach. Beach community = active lifestyle, surfing/sports injuries, and an affluent professional demographic. No automated new patient intake or post-visit review collection. Jacksonville Beach is one of the most desirable addresses in NE Florida — clients are digitally savvy and willing to invest in wellness. Strong automation pitch.',
      },
    ],
  },

  {
    label: '🏡 Real Estate — Orlando & Jacksonville Luxury',
    dbId: DB.realEstate,
    prospects: [
      {
        name: 'Premier Sotheby\'s International Realty — Orlando',
        owner: '',
        location: 'Orlando, FL',
        phone: '(407) 644-3295',
        website: 'https://www.premiersothebysrealty.com',
        hasWebsite: 'Yes', wqs: 7, opp: 7,
        notes: 'Sotheby\'s International Realty affiliate serving Central Florida luxury. Dominates the Dr. Phillips, Windermere, Winter Park, and Lake Nona luxury markets. Orlando luxury has grown significantly with tech and medical relocations. No automated buyer qualification or seller drip at scale. Orlando luxury expansion = automation ROI on high-commission transactions.',
      },
      {
        name: 'Fannie Hillman + Associates',
        owner: '',
        location: 'Winter Park, FL',
        phone: '(407) 644-1234',
        website: 'https://www.fanniehillman.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Boutique luxury real estate firm in Winter Park, FL — Orlando\'s most prestigious municipality. 40+ years serving the Park Avenue luxury market. Winter Park homes routinely sell for $1M–$5M+. No automated buyer/seller CRM or lead nurturing. Winter Park\'s exclusive market + boutique brand = automation pitch with immediate high-value ROI.',
      },
      {
        name: 'Ponte Vedra Club Realty',
        owner: '',
        location: 'Ponte Vedra Beach, FL',
        phone: '(904) 280-6490',
        website: 'https://www.pvcrealty.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Boutique luxury real estate in Ponte Vedra Beach (Jacksonville\'s premier coastal community). Serves the PGA Tour community, Sawgrass, and Ponte Vedra luxury coastal market. No automated buyer qualification or seller nurturing. Ponte Vedra is home to PGA Tour HQ + countless golf community residents — high-income lifestyle buyers who expect premium digital touchpoints.',
      },
    ],
  },
];

async function main() {
  console.log('\n🚀 Batch 17 — Adding more real US businesses to Notion…\n');
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

  console.log(`\n✅ Batch 17 complete! ${grandTotal} new prospects added.\n`);
}

main().catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
