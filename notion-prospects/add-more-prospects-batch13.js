/**
 * Nick Digital — Add More Prospects (Batch 13)
 * Run: NOTION_KEY=... node add-more-prospects-batch13.js
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
    label: '🔪 Plastic Surgery — New Orleans, LA',
    dbId: DB.plasticSurgery,
    prospects: [
      {
        name: 'Lupo Center for Aesthetic and General Dermatology',
        owner: 'Dr. Mary P. Lupo',
        location: 'New Orleans, LA',
        phone: '(504) 899-2525',
        website: 'https://www.lupocenter.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Leading New Orleans cosmetic dermatology + aesthetic practice. Dr. Lupo is a nationally recognized cosmetic dermatologist. Strong brand but no automated consultation booking or post-consult drip. New Orleans attracts medical tourism + has a growing affluent professional population. Premium pitch for an established authority figure in the market.',
      },
      {
        name: 'Coleman Plastic Surgery',
        owner: 'Dr. Sydney Coleman',
        location: 'New Orleans, LA',
        phone: '(504) 891-2300',
        website: 'https://www.colemanplasticsurgery.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'World-renowned New Orleans plastic surgeon known for fat transfer techniques. Internationally recognized board-certified surgeon. Boutique practice with a global reputation but no automated consultation booking or patient follow-up. Even a fraction of his website traffic converting through automated booking = significant revenue.',
      },
      {
        name: 'Plastic Surgery Group of New Orleans',
        owner: '',
        location: 'Metairie, LA',
        phone: '(504) 780-9510',
        website: 'https://psgnola.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Multi-surgeon plastic surgery group in Metairie (New Orleans suburb). Full cosmetic + reconstructive menu. No automated consultation funnel or post-consult follow-up drip. New Orleans metro is underserved by digital agencies specializing in aesthetics — early-mover advantage. Metairie is the most affluent community in the Greater New Orleans area.',
      },
    ],
  },

  {
    label: '⚖️ Personal Injury — New Orleans, LA',
    dbId: DB.personalInjury,
    prospects: [
      {
        name: 'Martzell, Bickford & Centola',
        owner: '',
        location: 'New Orleans, LA',
        phone: '(504) 581-9065',
        website: 'https://www.mbclaw.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Prominent New Orleans PI and mass tort firm with major verdicts against oil companies and corporations. High-value cases. No automated lead capture or 24/7 intake. Louisiana is a heavy PI market with regular industrial accidents, maritime injuries, and oil & gas incidents. Automated intake chatbot captures after-hours oil/gas accident leads — critical in this market.',
      },
      {
        name: 'Gatti, Keltner, Bienvenu & Montesi',
        owner: '',
        location: 'New Orleans, LA',
        phone: '(504) 581-3700',
        website: 'https://www.gkbmlaw.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'New Orleans personal injury firm handling car accidents, medical malpractice, and wrongful death. Well-established local firm. No automated intake or post-settlement review collection. New Orleans has one of the highest traffic fatality rates in the US — massive PI case supply. Automated 24/7 intake is essential here.',
      },
      {
        name: 'The Townsley Law Firm',
        owner: 'Gordon Townsley',
        location: 'Lake Charles, LA',
        phone: '(337) 478-1400',
        website: 'https://www.townsleylawfirm.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Southwest Louisiana PI firm in Lake Charles. Handles industrial accidents, oil & gas explosions, car accidents. Lake Charles is a major petrochemical hub — industrial accident PI cases are high-value and frequent. No automated intake or attorney referral program. Industrial accident market = massive case values where one captured lead = $100K+ settlement.',
      },
    ],
  },

  {
    label: '🏠 Roofing — New Orleans Metro',
    dbId: DB.roofing,
    prospects: [
      {
        name: 'Fortify Roofing',
        owner: '',
        location: 'Metairie, LA',
        phone: '(504) 834-8999',
        website: 'https://www.fortifyroofing.com',
        hasWebsite: 'Yes', wqs: 5, opp: 9,
        notes: 'New Orleans area roofer specializing in storm damage and hurricane restoration. Louisiana is one of the most hurricane-prone states in the US — Katrina, Ida, and countless tropical storms drive massive roofing demand. No automated storm damage intake funnel or post-storm outreach campaigns. Perfect pitch: automated hurricane/storm damage landing pages + SMS outreach after named storms.',
      },
      {
        name: 'Slavco Construction and Roofing',
        owner: '',
        location: 'Kenner, LA',
        phone: '(504) 469-0898',
        website: 'https://www.slavcoconstruction.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Family-owned New Orleans metro roofer + general contractor. Roofing + siding + gutters. Multi-service model in a market where storms create simultaneous multi-service demand. No automated storm damage intake or cross-service follow-up. Louisiana storm market = homeowners often need roof + siding + gutters all at once — automated bundled service pitch.',
      },
      {
        name: 'Perfect Exteriors of Minnesota (Baton Rouge location)',
        owner: '',
        location: 'Baton Rouge, LA',
        phone: '(225) 341-3333',
        website: 'https://perfectexteriorsofmn.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Storm damage roofing specialist with a Baton Rouge market presence. Baton Rouge is Louisiana\'s capital city — a major market separate from New Orleans. No automated storm damage intake or post-installation review requests. Louisiana\'s aggressive storm season means demand spikes are predictable — automated storm alert campaigns = lead capture before competitors mobilize.',
      },
    ],
  },

  {
    label: '❄️ HVAC — Memphis, TN',
    dbId: DB.hvac,
    prospects: [
      {
        name: 'Griffin Heating and Air',
        owner: '',
        location: 'Memphis, TN',
        phone: '(901) 867-9400',
        website: 'https://www.griffinhvac.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Family-owned Memphis HVAC company. Residential + light commercial. Memphis has a continental climate with hot humid summers (95°F+) and cold winters — year-round HVAC demand. No automated seasonal tune-up reminders or maintenance plan campaigns. Memphis is a major underserved market where automation gives an immediate competitive edge.',
      },
      {
        name: 'Mid-South Heating and Air',
        owner: '',
        location: 'Memphis, TN',
        phone: '(901) 624-3922',
        website: 'https://midsouthhvac.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Memphis HVAC contractor serving the Mid-South region. Family-operated with good local reviews. Basic website. Memphis metro area is large (1.3M+ population) with extreme weather. No automated maintenance reminders or emergency response confirmation. Large metro + underserved digitally = strong ROI for early automation adopter.',
      },
      {
        name: 'Action Air Conditioning',
        owner: '',
        location: 'Memphis, TN',
        phone: '(901) 751-0677',
        website: 'https://www.actionairconditioning.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Established Memphis HVAC company with years of service. Residential focus. Memphis summers are brutal — heat indices regularly exceed 105°F — creating massive AC demand. No online booking or automated seasonal reminders. High heat = high urgency = customers who need fast response that automated systems can provide 24/7.',
      },
    ],
  },

  {
    label: '🦷 Cosmetic Dentists — New Orleans',
    dbId: DB.cosmeticDentist,
    prospects: [
      {
        name: 'Exceptional Dentistry of New Orleans',
        owner: 'Dr. Louis Malcmacher',
        location: 'New Orleans, LA',
        phone: '(504) 525-1718',
        website: 'https://www.exceptionaldentist.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Premium cosmetic dental practice in downtown New Orleans. Full-service cosmetic menu — veneers, implants, full-mouth reconstruction. New Orleans has medical tourism appeal + strong local affluent market. No automated consultation booking or post-procedure follow-up. Downtown NOLA location = tourist + professional mix willing to invest in premium dental work.',
      },
      {
        name: 'Metairie Dental Associates',
        owner: '',
        location: 'Metairie, LA',
        phone: '(504) 833-5899',
        website: 'https://www.metairiedentalassociates.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Cosmetic + general dentistry in Metairie (most affluent New Orleans suburb). Invisalign, veneers, implants. No automated new patient intake or post-consultation review collection. Metairie residents = highest-income demographic in the NOLA metro willing to invest in premium cosmetic dental services. Strong automation pitch for new patient acquisition.',
      },
      {
        name: 'Roberts Dental Group',
        owner: '',
        location: 'Mandeville, LA',
        phone: '(985) 626-4401',
        website: 'https://www.robertsdentalgroup.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Cosmetic + family dentistry in Mandeville (affluent Northshore community across Lake Pontchartrain from New Orleans). Mandeville/Covington/Slidell = fastest-growing, most affluent suburbs in the NOLA metro. No automated new patient pipeline or consultation follow-up. Growing affluent suburb = ideal for new resident outreach automation.',
      },
    ],
  },

  {
    label: '🦴 Chiro/PT — Memphis, TN',
    dbId: DB.chiroPT,
    prospects: [
      {
        name: 'Memphis Chiropractic Center',
        owner: '',
        location: 'Memphis, TN',
        phone: '(901) 685-6613',
        website: 'https://memphischiropracticcenter.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Established chiropractic practice in East Memphis serving midtown and East Memphis communities. Good local reputation. No automated new patient intake or post-visit review collection. East Memphis is one of the most affluent pockets of the city — patients who can afford ongoing wellness care. Pitch: automated wellness maintenance plan follow-up.',
      },
      {
        name: 'Active Care Chiropractic & Rehabilitation',
        owner: '',
        location: 'Memphis, TN',
        phone: '(901) 757-4777',
        website: 'https://www.activecarememphis.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Chiropractic + physical rehabilitation clinic in Memphis. Multi-service model. No automated cross-sell between chiro and rehab or appointment reminder sequences. Memphis has a high rate of auto accidents and workplace injuries — chiro + rehab combo is in strong demand. Automated injury intake = immediate competitive advantage.',
      },
      {
        name: 'Collierville Physical Therapy',
        owner: '',
        location: 'Collierville, TN',
        phone: '(901) 854-4700',
        website: 'https://www.colliervillept.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Physical therapy clinic in Collierville (Shelby County\'s most affluent suburb, east of Memphis). Orthopedic + sports PT. Collierville is growing rapidly and is home to high-income families. No automated new patient intake or physician referral tracking. Affluent suburb = premium private-pay PT clients + good insurance = high per-patient value.',
      },
    ],
  },

  {
    label: '🏡 Real Estate — New Orleans & Nashville Luxury',
    dbId: DB.realEstate,
    prospects: [
      {
        name: 'Gardner Realtors',
        owner: '',
        location: 'New Orleans, LA',
        phone: '(504) 888-5555',
        website: 'https://www.gardnerrealtors.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'New Orleans\' largest independent real estate company since 1943. 25+ offices across South Louisiana. Deep local roots with no modern automated buyer/seller CRM. New Orleans real estate market is booming post-COVID with remote workers relocating. Largest independent = highest potential automation ROI — even 1% conversion lift across 25 offices is enormous.',
      },
      {
        name: 'The Corcoran Connection',
        owner: '',
        location: 'Nashville, TN',
        phone: '(615) 454-8888',
        website: 'https://www.corcoranconnection.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Nashville boutique real estate firm affiliated with Corcoran Group. Serving Nashville\'s booming luxury market — Brentwood, Franklin, Belle Meade. Nashville is one of the fastest-growing US cities. No automated buyer qualification or seller drip at scale. Nashville\'s hot market + Corcoran brand = automation pitch with immediate ROI on luxury transactions.',
      },
      {
        name: 'Zeitlin Sotheby\'s International Realty',
        owner: '',
        location: 'Nashville, TN',
        phone: '(615) 383-0183',
        website: 'https://www.zeitlinsothebysrealty.com',
        hasWebsite: 'Yes', wqs: 7, opp: 7,
        notes: 'Nashville\'s premier luxury real estate brokerage, affiliated with Sotheby\'s. 60+ years serving Nashville and Middle Tennessee. Nashville luxury market has exploded — celebrities, athletes, corporate relocations. No automated buyer drip or seller qualification pipeline. At Sotheby\'s price points, automation converting even one additional lead = $30,000–$100,000+ commission.',
      },
    ],
  },
];

async function main() {
  console.log('\n🚀 Batch 13 — Adding more real US businesses to Notion…\n');
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

  console.log(`\n✅ Batch 13 complete! ${grandTotal} new prospects added.\n`);
}

main().catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
