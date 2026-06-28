/**
 * Nick Digital — Add More Prospects (Batch 14)
 * Run: NOTION_KEY=... node add-more-prospects-batch14.js
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
    label: '🔪 Plastic Surgery — Sacramento, CA',
    dbId: DB.plasticSurgery,
    prospects: [
      {
        name: 'Sacramento Aesthetic Surgery',
        owner: 'Dr. Scott Green',
        location: 'Sacramento, CA',
        phone: '(916) 929-1833',
        website: 'https://www.sacramentoplasticsurgery.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Board-certified Sacramento plastic surgeon with 20+ years of experience. Solo boutique practice. Sacramento is California\'s capital city and 6th largest metro with a growing affluent population (government, healthcare, agriculture). No automated consultation booking or post-consult follow-up. Underserved Sacramento market = strong early-mover opportunity.',
      },
      {
        name: 'Capital Plastic Surgery',
        owner: 'Dr. Keith Neaman',
        location: 'Sacramento, CA',
        phone: '(916) 333-8985',
        website: 'https://capitalplasticsurgery.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Board-certified Sacramento plastic surgeon with a modern, younger-skewing brand. Comprehensive cosmetic menu + social media presence. No automated intake funnel or post-consult drip despite active social. Sacramento\'s growing tech influx from the Bay Area is bringing high-income residents — premium cosmetic market is expanding.',
      },
      {
        name: 'Eris Plastic Surgery',
        owner: 'Dr. Eris Smet',
        location: 'Roseville, CA',
        phone: '(916) 774-0024',
        website: 'https://www.erismd.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Board-certified female plastic surgeon in Roseville (Sacramento suburb). Placer County is one of the fastest-growing and wealthiest counties in California. Solo boutique practice targeting the affluent Sacramento suburbs (Roseville, Rocklin, Folsom, El Dorado Hills). No automated consultation funnel. Women-led practice in high-income suburb = premium pitch.',
      },
    ],
  },

  {
    label: '⚖️ Personal Injury — Richmond, VA',
    dbId: DB.personalInjury,
    prospects: [
      {
        name: 'Allen & Allen Law Firm',
        owner: '',
        location: 'Richmond, VA',
        phone: '(804) 353-1200',
        website: 'https://www.allenandallen.com',
        hasWebsite: 'Yes', wqs: 7, opp: 7,
        notes: 'Virginia\'s most recognized PI firm — 100+ years, 5 generations of the Allen family. Dominant TV and billboard presence across Virginia. Multi-office (Richmond, Charlottesville, Fredericksburg, etc.). No automated after-hours intake chatbot or post-settlement review program. Virginia\'s largest PI firm = automated intake that matches their marketing investment would significantly lift conversion.',
      },
      {
        name: 'Emroch & Kilduff',
        owner: '',
        location: 'Richmond, VA',
        phone: '(804) 358-1568',
        website: 'https://www.emrochandkilduff.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Richmond Virginia PI firm with decades serving injured Virginians. Car accidents, truck accidents, wrongful death. Good local reputation with no automated intake or lead nurture. Richmond is a growing city with increasing commuter traffic and accident volume. Pitch: 24/7 intake chatbot + automated SMS case updates = fewer client complaints + more conversions.',
      },
      {
        name: 'Corey Pollard Law',
        owner: 'Corey Pollard',
        location: 'Richmond, VA',
        phone: '(804) 251-1620',
        website: 'https://www.coreypollardlaw.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Richmond VA workers\' compensation and personal injury attorney. Solo practice. Workers\' comp PI is high-volume with predictable case patterns. No automated intake or case status communication. Solo attorney = automation is survival — can\'t manually follow up on every lead. Pitch: automated intake + case status updates = compete with big firms without hiring.',
      },
    ],
  },

  {
    label: '🏠 Roofing — Sacramento, CA',
    dbId: DB.roofing,
    prospects: [
      {
        name: 'Straight Line Roofing and Construction',
        owner: '',
        location: 'Sacramento, CA',
        phone: '(916) 481-3700',
        website: 'https://www.straightlineroofing.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Sacramento roofer with 20+ years serving the region. Residential + commercial. Sacramento\'s hot, dry summers and periodic winter storms create roofing demand. California\'s high construction costs mean roofing jobs command premium prices. No automated estimate requests or review collection. California premium pricing = high automation ROI.',
      },
      {
        name: 'Ace Roofing Company',
        owner: '',
        location: 'Sacramento, CA',
        phone: '(916) 525-5359',
        website: 'https://www.aceroofingco.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Sacramento area roofing company serving the greater Sacramento Valley. Family-owned and operated. Basic website. Sacramento Valley\'s intense summer heat causes roof wear and premature aging — maintenance and re-roofing demand is strong. No automated maintenance follow-up or review collection. Sacramento roofing market is competitive — automation differentiates.',
      },
      {
        name: 'Gold Shield Roofing',
        owner: '',
        location: 'Elk Grove, CA',
        phone: '(916) 683-3100',
        website: 'https://goldshieldroofing.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Elk Grove roofing company (South Sacramento suburb — one of the fastest-growing cities in California). Residential focus. Elk Grove is growing rapidly with new housing developments that need new and replacement roofs. No automated estimate requests or post-install review collection. High-growth suburb = constant new construction + re-roofing pipeline.',
      },
    ],
  },

  {
    label: '❄️ HVAC — Richmond, VA & Virginia Beach, VA',
    dbId: DB.hvac,
    prospects: [
      {
        name: 'Woody Heating and Cooling',
        owner: '',
        location: 'Richmond, VA',
        phone: '(804) 559-6699',
        website: 'https://www.woodyheatingandcooling.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Family-owned Richmond HVAC company with decades of service. Residential heating and cooling. Richmond has hot humid summers and cold winters — strong year-round HVAC demand. No automated seasonal maintenance reminders or maintenance plan campaigns. Richmond is an underserved market for HVAC digital automation — strong early-mover opportunity.',
      },
      {
        name: 'ARS / Rescue Rooter Virginia Beach',
        owner: '',
        location: 'Virginia Beach, VA',
        phone: '(757) 310-4100',
        website: 'https://www.ars.com/virginia-beach',
        hasWebsite: 'Yes', wqs: 6, opp: 7,
        notes: 'National franchise HVAC + plumbing company with a strong Virginia Beach presence. Multi-service model (HVAC + plumbing). Virginia Beach is a major coastal city with military presence + growing civilian population. No local automated cross-sell between services. Local franchise = can pitch local automation enhancement on top of their national system.',
      },
      {
        name: 'Enviro Air Heating & Cooling',
        owner: '',
        location: 'Midlothian, VA',
        phone: '(804) 639-1001',
        website: 'https://www.enviroaironline.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'HVAC contractor in Midlothian (affluent Richmond suburb, Chesterfield County). Serving the fast-growing western Richmond suburbs. Midlothian/Chesterfield is one of the fastest-growing, most affluent areas of Virginia. No automated maintenance reminders or new homeowner acquisition campaigns. Affluent growth suburb = ideal market for automated HVAC maintenance plan upsells.',
      },
    ],
  },

  {
    label: '🦷 Cosmetic Dentists — Sacramento & Richmond',
    dbId: DB.cosmeticDentist,
    prospects: [
      {
        name: 'Smiles at Stadium',
        owner: 'Dr. Steven Loh',
        location: 'Sacramento, CA',
        phone: '(916) 448-5505',
        website: 'https://www.smilesatstadium.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Cosmetic + general dental practice in Downtown Sacramento near Golden 1 Center. Modern branding, prime urban location. Serving downtown professionals and government workers. No automated new patient intake or consultation follow-up. Sacramento\'s growing downtown professional population = strong demand for cosmetic dentistry. Good candidate for automated new patient funnel.',
      },
      {
        name: 'Brident Dental & Orthodontics — Sacramento',
        owner: '',
        location: 'Sacramento, CA',
        phone: '(916) 922-7100',
        website: 'https://www.brident.com',
        hasWebsite: 'Yes', wqs: 6, opp: 7,
        notes: 'Multi-location dental group with Sacramento presence. General + cosmetic + orthodontics. Multi-location model without location-specific automated intake. Sacramento locations serve a diverse demographic. Pitch: each location gets its own automated new patient intake funnel + review collection pipeline = lift across all locations.',
      },
      {
        name: 'Richmond Smile Center',
        owner: '',
        location: 'Richmond, VA',
        phone: '(804) 282-4867',
        website: 'https://www.richmondsimilecenter.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Cosmetic + general dental practice in West End Richmond (affluent corridor). Serving Richmond\'s professional and government workforce. No automated new patient intake or smile consultation funnel. West End Richmond is the affluent side of the city — professionals willing to invest in cosmetic dental work who expect fast digital communication.',
      },
    ],
  },

  {
    label: '🦴 Chiro/PT — Richmond, VA & Virginia Beach',
    dbId: DB.chiroPT,
    prospects: [
      {
        name: 'Back & Neck Pain Center',
        owner: '',
        location: 'Richmond, VA',
        phone: '(804) 320-9800',
        website: 'https://www.backandneckpaincenter.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Chiropractic + physical therapy pain management practice in Richmond. Focused on chronic back and neck pain. High-demand specialty — back pain is the #1 cause of disability in the US. No automated new patient intake or post-visit review collection. Chronic pain patients = recurring long-term relationships. Automated patient journey = strong retention.',
      },
      {
        name: 'Active Family Chiropractic',
        owner: '',
        location: 'Midlothian, VA',
        phone: '(804) 744-9555',
        website: 'https://www.activefamilychiro.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Family chiropractic practice in Midlothian (affluent Richmond suburb). Serves the fast-growing Chesterfield County family demographic. No automated appointment reminders or wellness plan follow-up. Family practice = multiple family members = higher lifetime patient value. Automated family wellness plan upsell pitch = significant revenue lift.',
      },
      {
        name: 'Beach Chiropractic & Physical Therapy',
        owner: '',
        location: 'Virginia Beach, VA',
        phone: '(757) 422-8000',
        website: 'https://www.beachchiro.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Chiropractic + physical therapy in Virginia Beach. Serving the large military + civilian population of Virginia Beach. Virginia Beach has one of the largest active military bases in the world (Naval Station Norfolk nearby) — military families and veterans are a large patient base. No automated intake or review collection. Military market = steady, predictable patient flow that automation amplifies.',
      },
    ],
  },

  {
    label: '🏡 Real Estate — Sacramento & Richmond Luxury',
    dbId: DB.realEstate,
    prospects: [
      {
        name: 'Lyon Real Estate',
        owner: '',
        location: 'Sacramento, CA',
        phone: '(916) 447-2666',
        website: 'https://www.lyonrealestate.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Sacramento\'s largest independent real estate firm since 1947. 1,500+ agents, 17+ offices across the Sacramento region. Bay Area exodus has driven Sacramento home prices up significantly. No automated buyer/seller CRM or lead nurture at scale. As Sacramento\'s largest independent, even a modest lift in lead conversion across 1,500 agents = massive GCI impact.',
      },
      {
        name: 'Coldwell Banker Realty — Sacramento',
        owner: '',
        location: 'Sacramento, CA',
        phone: '(916) 929-1000',
        website: 'https://www.coldwellbanker.com/offices/sacramento',
        hasWebsite: 'Yes', wqs: 7, opp: 7,
        notes: 'Dominant Sacramento real estate office for Coldwell Banker. High agent volume and strong brand. Sacramento market is growing as Bay Area tech workers relocate for affordability. No local automated buyer drip at the agent level. Pitch: locally branded automation on top of their national platform = differentiation within the franchise.',
      },
      {
        name: 'The Steele Group Sotheby\'s International Realty',
        owner: '',
        location: 'Richmond, VA',
        phone: '(804) 282-7400',
        website: 'https://www.thesteelegroup.com',
        hasWebsite: 'Yes', wqs: 7, opp: 7,
        notes: 'Richmond\'s premier luxury real estate brokerage, affiliated with Sotheby\'s International Realty. Serves the Richmond luxury market — Windsor Farms, Westover Hills, River Road corridor. Richmond luxury is growing as DC-area residents relocate. No automated buyer qualification or seller drip. At Sotheby\'s price points, automation ROI on even one additional deal is substantial.',
      },
    ],
  },
];

async function main() {
  console.log('\n🚀 Batch 14 — Adding more real US businesses to Notion…\n');
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

  console.log(`\n✅ Batch 14 complete! ${grandTotal} new prospects added.\n`);
}

main().catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
