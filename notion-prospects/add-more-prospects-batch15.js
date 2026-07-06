/**
 * Nick Digital — Add More Prospects (Batch 15)
 * Run: NOTION_KEY=... node add-more-prospects-batch15.js
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
    label: '🔪 Plastic Surgery — Cincinnati, OH & Louisville, KY',
    dbId: DB.plasticSurgery,
    prospects: [
      {
        name: 'CincyPlasticSurgery',
        owner: 'Dr. Richard J. Brown',
        location: 'Cincinnati, OH',
        phone: '(513) 891-5426',
        website: 'https://www.cincyplasticsurgery.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Board-certified Cincinnati plastic surgeon with 30+ years of experience. Solo boutique practice in Cincinnati\'s Hyde Park neighborhood. Cincinnati is a major Midwest metro with strong P&G, healthcare, and financial sector wealth. No automated consultation booking or post-consult drip. Underserved market for digital automation in aesthetics.',
      },
      {
        name: 'The Plastic Surgery Group',
        owner: '',
        location: 'Cincinnati, OH',
        phone: '(513) 351-3223',
        website: 'https://www.theplasticsurgerygroup.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Multi-surgeon plastic surgery practice in Cincinnati. Full cosmetic + reconstructive menu. Cincinnati\'s affluent suburbs (Indian Hill, Hyde Park, Mt. Lookout) have strong demand for premium aesthetics. No automated intake or post-consult drip. Multi-surgeon volume = strong ROI for an automated consultation + follow-up system.',
      },
      {
        name: 'Louisville Plastic Surgery',
        owner: 'Dr. Michael Bogden',
        location: 'Louisville, KY',
        phone: '(502) 897-5000',
        website: 'https://www.louisvilleplasticsurgery.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Board-certified Louisville plastic surgeon in the affluent East End. Louisville is a growing Southern city with horse racing culture, bourbon industry, and a strong medical sector (Humana HQ). No automated consultation funnel or post-consult nurturing. Louisville is underserved by digital agencies targeting plastic surgery — strong early-mover advantage.',
      },
    ],
  },

  {
    label: '⚖️ Personal Injury — Cincinnati & Louisville',
    dbId: DB.personalInjury,
    prospects: [
      {
        name: 'Woltermann & Rowlett, LLC',
        owner: '',
        location: 'Cincinnati, OH',
        phone: '(513) 280-8808',
        website: 'https://www.wr-law.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Cincinnati personal injury and medical malpractice firm. Handles car accidents, workplace injuries, malpractice. Cincinnati has significant industrial and trucking accident volume (I-71/I-75 corridor). No automated intake or 24/7 lead capture. Pitch: automated chatbot captures after-hours injury leads that their phone misses — critical for high-volume trucking cases.',
      },
      {
        name: 'Katz, Greenberger & Norton LLP',
        owner: '',
        location: 'Cincinnati, OH',
        phone: '(513) 721-5151',
        website: 'https://www.kgnlaw.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Established Cincinnati PI and workers\' compensation firm. 50+ years of experience. High case volume from workers\' comp and auto accidents. No automated intake or case status communication. High volume practice = automation dramatically reduces administrative burden while improving client experience. Strong pitch for efficiency + conversion.',
      },
      {
        name: 'Gray & White Law',
        owner: '',
        location: 'Louisville, KY',
        phone: '(502) 210-8942',
        website: 'https://www.grayandwhitelaw.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Louisville personal injury firm with a modern brand and active digital presence. Car accidents, trucking accidents, medical malpractice. No automated intake or post-settlement review collection despite their digital-forward approach. Louisville is a major trucking hub on I-64/I-65 — trucking accident cases are high-value. Automated 24/7 intake converts the leads their ads generate.',
      },
    ],
  },

  {
    label: '🏠 Roofing — Louisville, KY & Cincinnati, OH',
    dbId: DB.roofing,
    prospects: [
      {
        name: 'Werner Roofing',
        owner: '',
        location: 'Louisville, KY',
        phone: '(502) 458-7663',
        website: 'https://www.wernerroofing.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Family-owned Louisville roofer with 50+ years of service. One of the most established roofing companies in Kentucky. Louisville has spring storm season with tornadoes and hail — consistent storm damage demand. 50 years of customers with no email/SMS automation. Massive re-engagement opportunity + storm damage lead capture automation.',
      },
      {
        name: 'Cincinnati Roofing',
        owner: '',
        location: 'Cincinnati, OH',
        phone: '(513) 518-7663',
        website: 'https://www.cincinnatiroofing.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Cincinnati roofing company serving the tri-state area (OH, KY, IN). Residential + commercial. Cincinnati receives significant weather events — storms, hail, ice. No automated storm damage intake or post-job review collection. Tri-state market = broad geographic reach that automation can leverage across multiple service areas.',
      },
      {
        name: 'Ohio Valley Roofing',
        owner: '',
        location: 'Cincinnati, OH',
        phone: '(513) 281-0600',
        website: 'https://www.ohiovalleyroofing.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Established Cincinnati roofing contractor serving southwestern Ohio and northern Kentucky. Long track record, family-owned. Basic website. Cincinnati metro straddles the Ohio River — diverse housing stock from older urban homes to new suburban construction. No automated estimate requests or review generation. Strong pitch for local market domination through automation.',
      },
    ],
  },

  {
    label: '❄️ HVAC — Hartford, CT & Providence, RI',
    dbId: DB.hvac,
    prospects: [
      {
        name: 'Airtime Heating & Air Conditioning',
        owner: '',
        location: 'Hartford, CT',
        phone: '(860) 216-3654',
        website: 'https://www.airtimehvac.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Hartford, CT HVAC contractor serving central Connecticut. Hartford is the insurance capital of the US — high-income insurance professionals and corporate workforce. New England winters are brutal = strong heating demand. No automated seasonal tune-up campaigns or maintenance plan upsells. Hartford\'s insurance industry = clients who understand ROI and value preventative maintenance.',
      },
      {
        name: 'Degree One Inc.',
        owner: '',
        location: 'Meriden, CT',
        phone: '(203) 440-7272',
        website: 'https://www.degreeoneinc.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Connecticut HVAC company serving the New Haven / Hartford corridor. Meriden is centrally located between CT\'s two major metros. CT homeowners pay some of the highest home service costs in the US — strong margin environment. No automated maintenance reminders or emergency response confirmation. CT market = high-income homeowners who value reliability.',
      },
      {
        name: 'Cranston Heating & Air Conditioning',
        owner: '',
        location: 'Cranston, RI',
        phone: '(401) 781-6100',
        website: 'https://www.cranstonheating.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Rhode Island HVAC company serving Cranston and greater Providence area. Providence is a growing metro with strong Brown University, RISD, and healthcare sector. New England winters + hot summers = year-round HVAC demand. No automated seasonal maintenance reminders or post-service reviews. Providence is an underserved market — early-mover advantage.',
      },
    ],
  },

  {
    label: '🦷 Cosmetic Dentists — Cincinnati & Louisville',
    dbId: DB.cosmeticDentist,
    prospects: [
      {
        name: 'Midwest Dental Arts',
        owner: '',
        location: 'Cincinnati, OH',
        phone: '(513) 891-8980',
        website: 'https://www.midwestdentalarts.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Cosmetic + implant dentistry in Blue Ash (affluent Cincinnati suburb). Veneers, Invisalign, implants. Blue Ash is home to major corporations (P&G nearby, various Fortune 500 offices). No automated new patient intake or consultation follow-up. Corporate suburb = high-income professionals seeking premium cosmetic dental services. Strong automation pitch.',
      },
      {
        name: 'Taylor-made Smiles',
        owner: 'Dr. Taylor',
        location: 'Cincinnati, OH',
        phone: '(513) 421-7625',
        website: 'https://www.taylor-madesmiles.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Cosmetic + family dentistry in downtown Cincinnati. Serving Cincinnati\'s growing urban professional population. No automated new patient intake or smile consultation funnel. Downtown Cincinnati is revitalizing with young professionals, tech companies, and creative industries — growing cosmetic dental market. Pitch: automated new resident outreach + consultation booking.',
      },
      {
        name: 'Louisville Dental Associates',
        owner: '',
        location: 'Louisville, KY',
        phone: '(502) 895-4445',
        website: 'https://www.louisvilledentalassociates.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Cosmetic + general dental practice in Louisville\'s Highlands neighborhood. The Highlands is Louisville\'s most vibrant, trendy neighborhood — young professionals, artists, business owners. No automated new patient pipeline or review collection. Highlands demographic = digitally native young professionals who respond to SMS and email automation.',
      },
    ],
  },

  {
    label: '🦴 Chiro/PT — Cincinnati & Louisville',
    dbId: DB.chiroPT,
    prospects: [
      {
        name: 'Total Health Chiropractic',
        owner: '',
        location: 'Cincinnati, OH',
        phone: '(513) 677-2200',
        website: 'https://totalhealthchiro.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Multi-location chiropractic practice serving greater Cincinnati (Mason, Blue Ash). Multi-office without multi-location automation is a clear gap. Cincinnati metro is large and spread across multiple affluent suburbs. Each location gets its own automated intake + follow-up flow = strong multi-location pitch. Mason is home to major companies — corporate wellness angle.',
      },
      {
        name: 'Advanced Chiropractic Relief',
        owner: '',
        location: 'Louisville, KY',
        phone: '(502) 447-2020',
        website: 'https://www.advancedchiropracticrelief.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Louisville chiropractic practice with a strong focus on chronic pain and auto accident cases. PI-adjacent chiro = high insurance reimbursements + strong case value. No automated intake or PI attorney referral program. Louisville is a major trucking hub — auto accident chiro cases are frequent and high-value. Pitch: automated PI intake + attorney referral system.',
      },
      {
        name: 'Southern Indiana Sports and Family Chiropractic',
        owner: '',
        location: 'Jeffersonville, IN',
        phone: '(812) 282-2248',
        website: 'https://www.southernindianachiro.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Chiropractic practice across the river from Louisville in Jeffersonville, IN (Clark County). Serves both Indiana and Kentucky patients. Cross-state location = dual market pitch. No automated new patient intake or review collection. Indiana side of Louisville is growing rapidly — new housing developments mean new families needing chiro services.',
      },
    ],
  },

  {
    label: '🏡 Real Estate — Cincinnati & Louisville Luxury',
    dbId: DB.realEstate,
    prospects: [
      {
        name: 'Comey & Shepherd Realtors',
        owner: '',
        location: 'Cincinnati, OH',
        phone: '(513) 351-3300',
        website: 'https://www.comeyandshepherd.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Cincinnati\'s oldest independent real estate firm — 100+ years of serving the Tri-State. Strong local brand across all Cincinnati neighborhoods. No automated buyer/seller CRM or lead nurturing at scale. Cincinnati\'s growing tech scene + P&G corporate relocations = constant buyer pipeline. 100 years of brand trust + automation = powerful combination.',
      },
      {
        name: 'Sibcy Cline Realtors',
        owner: '',
        location: 'Cincinnati, OH',
        phone: '(513) 985-4000',
        website: 'https://www.sibcycline.com',
        hasWebsite: 'Yes', wqs: 6, opp: 7,
        notes: 'Cincinnati\'s largest independent real estate company with 30+ offices across OH, KY, and IN. Dominant local market share. No automated buyer/seller drip at the individual agent level. Massive agent network = massive automation opportunity. Pitch: local-branded automation tools for their agents = competitive differentiation vs. national franchises.',
      },
      {
        name: 'Lenihan Sotheby\'s International Realty',
        owner: '',
        location: 'Louisville, KY',
        phone: '(502) 899-2221',
        website: 'https://www.lenihansothebysrealty.com',
        hasWebsite: 'Yes', wqs: 7, opp: 7,
        notes: 'Louisville\'s only Sotheby\'s International Realty affiliate. Serving Louisville\'s luxury market — Indian Hills, Glenview, Anchorage, Prospect. Strong global network but no automated local buyer qualification or seller nurturing. Louisville luxury market is growing with equestrian estates and bourbon country properties. Premium pitch for the premier Louisville luxury brand.',
      },
    ],
  },
];

async function main() {
  console.log('\n🚀 Batch 15 — Adding more real US businesses to Notion…\n');
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

  console.log(`\n✅ Batch 15 complete! ${grandTotal} new prospects added.\n`);
}

main().catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
