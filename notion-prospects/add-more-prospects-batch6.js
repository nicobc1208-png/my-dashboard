/**
 * Nick Digital — Add More Prospects (Batch 6)
 * Run: NOTION_KEY=... node add-more-prospects-batch6.js
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
    label: '🔪 Plastic Surgery — Tampa, FL',
    dbId: DB.plasticSurgery,
    prospects: [
      {
        name: 'Traci Temmen MD',
        owner: 'Dr. Traci Temmen',
        location: 'Tampa, FL',
        phone: '(813) 771-6393',
        website: 'https://www.tracitemmenmd.com',
        hasWebsite: 'Yes', wqs: 7, opp: 7,
        notes: 'Board-certified female plastic surgeon in the Tampa area. Women-owned boutique practice = strong brand differentiation. Good website but no automated consultation funnel or post-visit drip. Tampa is Florida\'s 3rd largest city with a growing affluent population — great market for premium aesthetic services.',
      },
      {
        name: 'Joshua A. Halpern MD',
        owner: 'Dr. Joshua A. Halpern',
        location: 'Tampa, FL',
        phone: '(813) 872-2696',
        website: 'https://www.drhalpern.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Board-certified plastic surgeon in Tampa with a solo practice. Comprehensive cosmetic surgery menu. Basic website with no automated intake or post-consult nurturing. Solo surgeons are ideal automation clients — lean team means they need automated systems to compete with larger practices.',
      },
      {
        name: 'Vivify Plastic Surgery',
        owner: 'Dr. Dallas Buchanan',
        location: 'Tampa, FL',
        phone: '(833) 284-8439',
        website: 'https://www.vivifyps.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Board-certified Tampa plastic surgeon — newer practice with modern branding. No automated new patient acquisition or post-consult follow-up. Newer practice = hungry for growth. Pitch: automated consultation booking + drip sequence converts more consultations into booked procedures.',
      },
    ],
  },

  {
    label: '⚖️ Personal Injury — Tampa',
    dbId: DB.personalInjury,
    prospects: [
      {
        name: 'Catania & Catania Injury Lawyers',
        owner: '',
        location: 'Tampa, FL',
        phone: '(813) 222-8545',
        website: 'https://www.cataniaandcatania.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Tampa PI firm with 120+ years combined attorney experience. Handles car accidents, slip & falls, medical malpractice, workers\' comp. No automated client intake or 24/7 lead capture. Tampa traffic accidents are frequent — after-hours AI chatbot pitch converts the calls they currently miss.',
      },
      {
        name: 'Winters & Yonker Personal Injury Lawyers',
        owner: '',
        location: 'Tampa, FL',
        phone: '(813) 223-6200',
        website: 'https://wintersandyonker.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Tampa PI firm with 119+ years combined attorney experience. Active digital presence but no automated post-consultation follow-up or client communication sequences. Tampa Bay is a booming market — automated review generation post-settlement + referral drip would significantly grow their pipeline.',
      },
      {
        name: 'Vanguard Attorneys',
        owner: '',
        location: 'Tampa, FL',
        phone: '(813) 471-4444',
        website: 'https://www.vanguardinjuryattorneys.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Boutique Tampa personal injury law firm. Strong client focus and local reputation. No automated intake or referral tracking. Pitch: branded chatbot + automated SMS follow-up for new leads dramatically reduces the time-to-case-signed, which is critical in competitive Tampa PI market.',
      },
    ],
  },

  {
    label: '🏠 Roofing — Tampa Bay, FL',
    dbId: DB.roofing,
    prospects: [
      {
        name: 'Acoma Roofing',
        owner: '',
        location: 'Tampa Bay, FL',
        phone: '(727) 733-5580',
        website: 'https://www.acomaroofing.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Third-generation family-owned roofer with 70+ years of Tampa Bay service. Deeply established brand but basic digital presence. Florida hurricane season + high humidity = constant roofing demand. 70 years of customer data with zero email/SMS automation. Enormous re-engagement potential.',
      },
      {
        name: 'No. 1 Home Roofing',
        owner: '',
        location: 'Palm Harbor, FL',
        phone: '(727) 781-7663',
        website: 'https://www.no1homeroofing.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Family-owned Tampa Bay roofer since 2000. Specializes in residential roofing + storm damage. Florida\'s hurricane and storm damage season creates massive spikes in demand. No automated storm damage intake page or post-storm follow-up drip. Perfect pitch for location-specific storm landing pages.',
      },
      {
        name: 'Bayside Roofing Pros',
        owner: '',
        location: 'Tampa Bay, FL',
        phone: '(727) 844-7663',
        website: 'https://baysideroofingpros.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Trusted family-owned Tampa Bay roofer for 30+ years. A+ BBB rating. Basic website. Three decades of service with no automated follow-up or review collection system. Large existing customer database + no email marketing = immediate revenue unlock with automated re-engagement campaign.',
      },
    ],
  },

  {
    label: '❄️ HVAC — Seattle, WA',
    dbId: DB.hvac,
    prospects: [
      {
        name: 'Seattle Air Superior',
        owner: '',
        location: 'Seattle, WA',
        phone: '(866) 351-3660',
        website: 'https://seattleairsuperior.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Seattle HVAC contractor since 2006. Residential heating, cooling, and air quality services. Seattle\'s mild climate is shifting — increasing summer heat makes AC a growing necessity. Basic website. No automated seasonal tune-up reminders or online booking. Growing AC demand = growing automation ROI.',
      },
      {
        name: 'Evergreen State Heat & AC',
        owner: '',
        location: 'Snohomish, WA',
        phone: '(425) 252-3114',
        website: 'https://essmwa.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Family-owned Pacific Northwest HVAC company founded in 1968. Over 55 years serving Seattle metro area (Snohomish + Everett). Long-established brand with minimal digital automation. Massive customer database with no automated maintenance reminders or seasonal campaigns. Strong re-engagement pitch.',
      },
      {
        name: 'Evergreen Home Heating and Energy',
        owner: '',
        location: 'Seattle, WA',
        phone: '(206) 565-1455',
        website: 'https://evergreenhomeheatingandenergy.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Trane-certified HVAC dealer serving Seattle and Tukwila. Heat pump installations are booming in the Pacific Northwest due to cold climate + rising energy costs. No automated heat pump upsell campaign or post-install follow-up. Growing green energy market = strong pitch for automated energy efficiency campaigns.',
      },
    ],
  },

  {
    label: '🦷 Cosmetic Dentists — Tampa',
    dbId: DB.cosmeticDentist,
    prospects: [
      {
        name: 'General and Cosmetic Dentistry of Tampa',
        owner: '',
        location: 'Tampa, FL',
        phone: '(813) 960-5869',
        website: 'https://www.tampacosmeticdentist.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'General + cosmetic + implant dentistry practice in Tampa. Dual zip codes (33624 + 33609) = two-market coverage. No automated new patient intake or post-consultation follow-up. Tampa\'s growing population means constant stream of new residents looking for a dental home. Automated new patient campaigns are essential.',
      },
      {
        name: 'Eden Dental Aesthetics',
        owner: '',
        location: 'Tampa, FL',
        phone: '(813) 962-2731',
        website: 'https://www.edatampa.com',
        hasWebsite: 'Yes', wqs: 7, opp: 7,
        notes: 'Top cosmetic dental practice in Tampa, ranked #1 for smile makeovers in the US. Premium brand, high-quality cases. Good website but no automated consultation booking or post-procedure nurture. Elite cosmetic cases = high-ticket ($10,000–$50,000 smile makeovers). Automation converts more consultations = massive revenue lift.',
      },
      {
        name: 'Smiles Tampa',
        owner: '',
        location: 'Tampa, FL',
        phone: '(813) 333-9992',
        website: 'https://smiles-tampa.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Tampa cosmetic + implant dentistry. Local practice with good reviews. Basic website with no automated intake or post-visit follow-up. Tampa is a top-20 US metro with strong dental market. Pitch: automated new patient welcome sequence + post-treatment review collection dramatically improves patient retention.',
      },
    ],
  },

  {
    label: '🦴 Chiro/PT — Tampa',
    dbId: DB.chiroPT,
    prospects: [
      {
        name: 'Tampa Chiropractic Center',
        owner: '',
        location: 'Tampa, FL',
        phone: '(813) 983-1400',
        website: 'https://tampa-chiropractic-center.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Integrated chiropractic + physical therapy clinic in Tampa. Multi-service model. Basic website with no automated appointment reminders or post-treatment review requests. Tampa\'s growing population + warm weather = year-round sports/outdoor activity injuries. Automated patient communication would transform their retention.',
      },
      {
        name: 'Dr. Edelson Chiropractic & Massage',
        owner: 'Dr. Edelson',
        location: 'Tampa, FL',
        phone: '(813) 831-8321',
        website: 'https://tampa.chiropractor-edelson.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Established solo chiropractor in South Tampa with massage therapy add-on. Multi-service model. No automated cross-sell between chiro and massage or post-treatment follow-up. Solo practice = small team that can\'t manually follow up on every patient. Automation is the pitch for efficiency.',
      },
      {
        name: 'Essential ChiroCare',
        owner: '',
        location: 'Tampa, FL',
        phone: '(813) 253-0711',
        website: 'https://www.essentialchirocare.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Multi-location chiropractic practice in Tampa (South Tampa + West Hillsborough). Two locations with no cross-location patient routing or automated booking. Multi-location model = pitch: each location gets its own automated intake + follow-up flow + review collection pipeline.',
      },
    ],
  },

  {
    label: '🏡 Real Estate — Tampa Bay Luxury',
    dbId: DB.realEstate,
    prospects: [
      {
        name: 'Smith & Associates Real Estate',
        owner: '',
        location: 'Tampa, FL',
        phone: '(813) 839-3800',
        website: 'https://www.smithandassociates.com',
        hasWebsite: 'Yes', wqs: 7, opp: 7,
        notes: 'Tampa Bay\'s premier independent luxury real estate brokerage since 1969. #1 luxury brokerage by market share — $1M+ properties, avg. price $1.95M. Strong brand but no automated buyer drip or seller lead nurturing at scale. At this volume, even 5% automation lift = millions in additional revenue.',
      },
      {
        name: 'Luxury & Beach Realty',
        owner: '',
        location: 'St. Petersburg, FL',
        phone: '(727) 272-7703',
        website: 'https://joinlbr.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Boutique luxury brokerage in Tampa Bay + Naples + Orlando since 2013. Completely independent. No automated buyer/seller CRM or lead drip. Multi-market coverage without multi-location automation is a massive gap. Pitch: automated market-specific buyer drip for each city they serve.',
      },
      {
        name: 'Spiegel Luxury Group',
        owner: '',
        location: 'St. Petersburg, FL',
        phone: '(727) 452-9659',
        website: 'https://spiegelluxurygroup.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Boutique luxury real estate brokerage in Tampa Bay area. Specializes in high-end waterfront and luxury properties. Growing boutique brand with no automated lead nurturing or CRM sequences. Tampa Bay luxury waterfront market is booming post-pandemic — automated buyer/seller pipeline would accelerate growth significantly.',
      },
    ],
  },
];

async function main() {
  console.log('\n🚀 Batch 6 — Adding more real US businesses to Notion…\n');
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

  console.log(`\n✅ Batch 6 complete! ${grandTotal} new prospects added.\n`);
}

main().catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
