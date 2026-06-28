/**
 * Nick Digital — Add More Prospects (Batch 16)
 * Run: NOTION_KEY=... node add-more-prospects-batch16.js
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
    label: '🔪 Plastic Surgery — San Antonio, TX',
    dbId: DB.plasticSurgery,
    prospects: [
      {
        name: 'Gawley Plastic Surgery',
        owner: 'Dr. Steven Gawley',
        location: 'San Antonio, TX',
        phone: '(210) 692-1181',
        website: 'https://www.gawleyplasticsurgery.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Board-certified San Antonio plastic surgeon with a boutique practice. San Antonio is the 7th largest US city (1.5M+) with a massive and growing population. No automated consultation booking or post-consult drip. San Antonio has a large military community + strong healthcare workforce = premium aesthetics demand in an underserved digital market.',
      },
      {
        name: 'Willis Plastic Surgery',
        owner: 'Dr. Jeremy Willis',
        location: 'San Antonio, TX',
        phone: '(210) 615-6879',
        website: 'https://www.willisplasticsurgery.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Board-certified San Antonio plastic surgeon in the medical district. Comprehensive cosmetic and reconstructive services. San Antonio has among the fastest growing affluent neighborhoods in Texas (Alamo Heights, Stone Oak, The Dominion). No automated intake funnel or post-procedure nurturing. San Antonio is Texas\'s most underserved major metro for digital agency services.',
      },
      {
        name: 'Aesthetic Surgery of San Antonio',
        owner: '',
        location: 'San Antonio, TX',
        phone: '(210) 495-5700',
        website: 'https://www.aesanantonio.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Multi-surgeon plastic surgery center in San Antonio. Full cosmetic menu + aesthetic treatments. San Antonio\'s proximity to the US-Mexico border drives medical tourism as well as local demand. No automated consultation funnel or cross-service automation for aesthetic treatments vs. surgery. Dual revenue pitch: separate automated funnels for surgery vs. aesthetics.',
      },
    ],
  },

  {
    label: '⚖️ Personal Injury — San Antonio, TX',
    dbId: DB.personalInjury,
    prospects: [
      {
        name: 'Carabin Shaw',
        owner: '',
        location: 'San Antonio, TX',
        phone: '(800) 862-1260',
        website: 'https://carabinshaw.com',
        hasWebsite: 'Yes', wqs: 7, opp: 7,
        notes: 'Top San Antonio personal injury firm with offices across Texas. High-volume, multi-practice areas (car accidents, workers\' comp, medical malpractice, birth injury). Strong marketing presence but no automated after-hours intake or post-settlement review collection. San Antonio\'s massive traffic and construction growth = constant PI case supply. Automation converts their ad spend more efficiently.',
      },
      {
        name: 'Thomas J. Henry Law',
        owner: 'Thomas J. Henry',
        location: 'San Antonio, TX',
        phone: '(210) 366-1111',
        website: 'https://www.thomasjhenrylaw.com',
        hasWebsite: 'Yes', wqs: 7, opp: 7,
        notes: 'One of the largest PI firms in Texas — Tom Henry is a prolific TV and billboard advertiser across Texas. Despite enormous ad spend, no automated 24/7 intake chatbot or immediate response automation on their site. Texas has massive personal injury case volume. Automating their lead response even by 30 minutes faster = significant additional case captures.',
      },
      {
        name: 'Ketterman Rowland & Westlund',
        owner: '',
        location: 'San Antonio, TX',
        phone: '(210) 490-7000',
        website: 'https://www.krwlawyers.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'San Antonio PI firm serving South Texas — car accidents, 18-wheeler crashes, oil field accidents. South Texas has significant industrial and oilfield accident cases (high-value). No automated intake or 24/7 lead capture. I-35 corridor between San Antonio and Laredo is one of the busiest trucking routes in the US = consistent high-value PI case supply.',
      },
    ],
  },

  {
    label: '🏠 Roofing — San Antonio, TX',
    dbId: DB.roofing,
    prospects: [
      {
        name: 'Alpha Roofing',
        owner: '',
        location: 'San Antonio, TX',
        phone: '(210) 361-3600',
        website: 'https://www.alpharoofingsa.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Locally owned San Antonio roofing company. Texas has severe hail storms — San Antonio regularly gets hail events that drive emergency roofing demand. No automated storm damage intake page or post-storm outreach. Texas hail season creates massive demand spikes — automated storm alert campaigns + immediate estimate landing pages = capturing leads before competitors.',
      },
      {
        name: 'Beyer Boys Roofing & Sheet Metal',
        owner: '',
        location: 'San Antonio, TX',
        phone: '(210) 656-9111',
        website: 'https://www.beyerboys.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Established San Antonio roofing company with residential and commercial capabilities. Metal roofing specialty. San Antonio is growing rapidly with new construction in suburbs like Helotes, Schertz, Boerne. No automated estimate requests or post-job review collection. Growing metro + no digital automation = strong opportunity to become the go-to digitally.',
      },
      {
        name: 'Premier Roofing of San Antonio',
        owner: '',
        location: 'San Antonio, TX',
        phone: '(210) 899-5916',
        website: 'https://premierroofingsa.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Local San Antonio roofer focused on residential roofing + storm damage restoration. Texas insurance claims for storm damage are among the highest in the US. No automated insurance claim intake or storm damage follow-up campaigns. Pitch: automated storm damage intake + insurance claim assistance positioning = high-conversion leads during hail season.',
      },
    ],
  },

  {
    label: '❄️ HVAC — Albuquerque, NM & Tucson, AZ',
    dbId: DB.hvac,
    prospects: [
      {
        name: 'Anderson Air Corps',
        owner: '',
        location: 'Albuquerque, NM',
        phone: '(505) 855-9028',
        website: 'https://www.andersonaircorps.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Albuquerque HVAC contractor with a strong local reputation. Albuquerque has extreme weather — desert heat in summer (100°F+), cold winters at altitude. No automated seasonal tune-up campaigns or maintenance plan upsells. Albuquerque is a large Southwestern metro (650K+) that is dramatically underserved by digital agencies. Early-mover advantage is enormous here.',
      },
      {
        name: 'Master Mechanical Heating and Air',
        owner: '',
        location: 'Albuquerque, NM',
        phone: '(505) 294-5500',
        website: 'https://www.mastermechanicalhvac.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Family-owned Albuquerque HVAC company with 30+ years of service. New Mexico heat + altitude creates unique HVAC challenges (evaporative cooler conversions, high-altitude heating). No automated maintenance reminders or seasonal campaigns. 30 years of customers with zero email/SMS marketing = immediate re-engagement revenue opportunity.',
      },
      {
        name: 'Hamstra Heating & Cooling',
        owner: '',
        location: 'Tucson, AZ',
        phone: '(520) 549-4810',
        website: 'https://www.hamstrahvac.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Family-owned Tucson HVAC company since 1983. 40+ years serving the Tucson area. Tucson desert climate = brutal summers (110°F+) where AC is non-negotiable. No automated seasonal campaigns or maintenance plan upsells. Tucson is a large market (1M+ metro) that remains underserved by modern HVAC automation. Huge pitch opportunity.',
      },
    ],
  },

  {
    label: '🦷 Cosmetic Dentists — San Antonio & Albuquerque',
    dbId: DB.cosmeticDentist,
    prospects: [
      {
        name: 'Cosmetic Dental Associates — San Antonio',
        owner: '',
        location: 'San Antonio, TX',
        phone: '(210) 680-1500',
        website: 'https://cdatx.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Multi-location cosmetic + implant dental practice in San Antonio (3 locations). Veneers, implants, smile makeovers. Multi-location without multi-location automation is a significant gap. San Antonio\'s large military community = stable high-insurance-coverage patient base + growing civilian affluent market. Pitch: each location gets its own automated intake + follow-up funnel.',
      },
      {
        name: 'Alamo City Dental Care',
        owner: '',
        location: 'San Antonio, TX',
        phone: '(210) 391-0026',
        website: 'https://www.alamocitydental.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Cosmetic + family dental practice in San Antonio. General + cosmetic + orthodontics. San Antonio\'s population is growing 3%+ annually — massive influx of new residents needing a dental home. No automated new patient acquisition or review collection. Growing city = growing patient acquisition opportunity that automation unlocks.',
      },
      {
        name: 'Dental Artistry Albuquerque',
        owner: '',
        location: 'Albuquerque, NM',
        phone: '(505) 855-0600',
        website: 'https://dentalartistryabq.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Cosmetic + restorative dental practice in Albuquerque. Veneers, implants, smile design. Albuquerque is underserved by dental automation marketing — most practices here have basic websites with no automation. Being first to automate gives a dramatic competitive edge. Albuquerque has a large professional population (Sandia Labs, UNM hospital, government) with disposable income.',
      },
    ],
  },

  {
    label: '🦴 Chiro/PT — San Antonio, TX',
    dbId: DB.chiroPT,
    prospects: [
      {
        name: 'San Antonio Chiropractic',
        owner: '',
        location: 'San Antonio, TX',
        phone: '(210) 764-2550',
        website: 'https://www.sanantoniochiropractor.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Chiropractic practice in San Antonio serving the Stone Oak / North SA area. Stone Oak is one of San Antonio\'s most affluent communities. San Antonio has a large active military population — veterans are heavy chiro users (VA-related back/neck injuries). No automated new patient intake or review collection. Military market = steady, high-value chiro patient base.',
      },
      {
        name: 'CORE Health & Wellness',
        owner: '',
        location: 'San Antonio, TX',
        phone: '(210) 492-4040',
        website: 'https://www.corehealthsa.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Integrated health and wellness center in San Antonio combining chiropractic, physical therapy, and functional medicine. Multi-discipline model without cross-discipline automation. San Antonio\'s growing health-conscious population = strong demand for integrative care. Each discipline = its own automated funnel + cross-referral sequences. Strong multi-service pitch.',
      },
      {
        name: 'San Antonio Physical Therapy',
        owner: '',
        location: 'San Antonio, TX',
        phone: '(210) 520-1432',
        website: 'https://sanantoniopt.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Physical therapy clinic serving San Antonio with orthopedic and sports PT. Military-adjacent market — Fort Sam Houston and JBSA are nearby. No automated new patient intake or physician referral tracking. Military PT market is high-volume and insurance-covered. Pitch: automated physician referral intake + patient communication sequences = strong volume uplift.',
      },
    ],
  },

  {
    label: '🏡 Real Estate — San Antonio & Albuquerque',
    dbId: DB.realEstate,
    prospects: [
      {
        name: 'Phyllis Browning Company',
        owner: '',
        location: 'San Antonio, TX',
        phone: '(210) 524-0500',
        website: 'https://www.phyllisbrowning.com',
        hasWebsite: 'Yes', wqs: 7, opp: 7,
        notes: 'San Antonio\'s premier luxury independent real estate brokerage. 500+ agents, the go-to brand for San Antonio luxury. Strong local reputation across all price points but especially $500K+. No automated buyer/seller CRM or lead nurture sequences. San Antonio is growing rapidly — luxury market is expanding as Austin-area buyers look south for value. Premium pitch.',
      },
      {
        name: 'Kuper Sotheby\'s International Realty',
        owner: '',
        location: 'San Antonio, TX',
        phone: '(210) 822-8602',
        website: 'https://www.kupersothebysrealty.com',
        hasWebsite: 'Yes', wqs: 7, opp: 7,
        notes: 'San Antonio\'s Sotheby\'s International Realty affiliate — the dominant luxury brand in the market. Serves San Antonio luxury, Hill Country estates, and South Texas ranches. Strong global network but no automated buyer qualification or seller lead drip. Hill Country luxury market is booming with Austin and Dallas spillover buyers. Premium automation pitch.',
      },
      {
        name: 'Berkshire Hathaway HomeServices — Albuquerque',
        owner: '',
        location: 'Albuquerque, NM',
        phone: '(505) 798-6300',
        website: 'https://www.nmhomes.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Berkshire Hathaway affiliate serving New Mexico real estate. Albuquerque\'s real estate market is growing as remote workers discover its affordability vs. other Southwest metros. No automated buyer/seller drip at the local agent level. Albuquerque is an underserved market for real estate automation — being the first agent team with automated follow-up = major competitive advantage.',
      },
    ],
  },
];

async function main() {
  console.log('\n🚀 Batch 16 — Adding more real US businesses to Notion…\n');
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

  console.log(`\n✅ Batch 16 complete! ${grandTotal} new prospects added.\n`);
}

main().catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
