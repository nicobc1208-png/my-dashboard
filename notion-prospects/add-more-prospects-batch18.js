/**
 * Nick Digital — Add More Prospects (Batch 18)
 * Run: NOTION_KEY=... node add-more-prospects-batch18.js
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
    label: '🔪 Plastic Surgery — Detroit, MI & Grand Rapids, MI',
    dbId: DB.plasticSurgery,
    prospects: [
      {
        name: 'Cosmetic Surgery Center — Michigan',
        owner: 'Dr. Garrett H. Bennett',
        location: 'Southfield, MI',
        phone: '(248) 357-3220',
        website: 'https://www.cosmeticsurgicenter.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Board-certified Detroit-area plastic surgeon in Southfield (Oakland County). Oakland County is Michigan\'s wealthiest county — Auburn Hills, Birmingham, Bloomfield Hills. No automated consultation booking or post-consult drip. Detroit metro has a strong automotive and medical sector professional workforce with high disposable income for premium aesthetics.',
      },
      {
        name: 'Plastic Surgery Associates of Michigan',
        owner: '',
        location: 'Troy, MI',
        phone: '(248) 362-1700',
        website: 'https://www.plasticsmichigan.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Multi-surgeon plastic surgery practice in Troy, MI (affluent Detroit suburb). Troy is home to major automotive HQs and executives. No automated consultation funnel or post-procedure nurturing. Detroit\'s automotive executive community = high-income patients investing in premium aesthetic procedures. Strong pitch for intake automation targeting this demographic.',
      },
      {
        name: 'Grand Rapids Plastic Surgery',
        owner: 'Dr. Scott Hollenbeck',
        location: 'Grand Rapids, MI',
        phone: '(616) 323-3102',
        website: 'https://www.grplasticsurgery.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Board-certified Grand Rapids plastic surgeon. Grand Rapids is Michigan\'s 2nd largest city and one of the fastest-growing metros in the Midwest. Amway/West Michigan Christian community = conservative spending culture but strong family and medical aesthetics demand. No automated consultation booking or post-consult follow-up. Underserved market.',
      },
    ],
  },

  {
    label: '⚖️ Personal Injury — Detroit, MI',
    dbId: DB.personalInjury,
    prospects: [
      {
        name: 'Goodman Acker P.C.',
        owner: '',
        location: 'Southfield, MI',
        phone: '(248) 286-8100',
        website: 'https://www.goodmanacker.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Top Michigan PI firm specializing in auto accidents and no-fault insurance claims. Michigan is unique with its no-fault auto insurance system — PI claims here have specific legal nuances. Active TV advertiser. No automated intake chatbot or post-settlement review collection. Michigan no-fault = high-volume, legally specialized PI cases. Automated intake captures post-midnight accident leads.',
      },
      {
        name: 'Lee Steinberg Law Firm',
        owner: 'Lee Steinberg',
        location: 'Southfield, MI',
        phone: '(248) 355-5555',
        website: 'https://www.leesteinberglaw.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Prominent Detroit-area PI attorney — Lee Steinberg is one of Michigan\'s most recognized PI lawyers. Heavy TV and radio presence. No automated 24/7 intake chatbot or post-settlement nurture. Michigan\'s no-fault system creates complex PI cases with high per-case value. Automated intake matching their advertising budget = dramatically better conversion from existing ad spend.',
      },
      {
        name: 'Garmo & Kiste, PLC',
        owner: '',
        location: 'Detroit, MI',
        phone: '(313) 962-4840',
        website: 'https://www.garmoandkiste.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Detroit personal injury and workers\' compensation firm. Serving the Detroit and Wayne County market. Detroit has high rates of auto accidents + significant industrial workforce = constant PI demand. No automated intake or 24/7 lead capture. Detroit PI is a competitive market where speed to response = case signed. Automated chatbot + SMS follow-up wins the race.',
      },
    ],
  },

  {
    label: '🏠 Roofing — Detroit Metro & Grand Rapids',
    dbId: DB.roofing,
    prospects: [
      {
        name: 'Sherriff-Goslin Roofing',
        owner: '',
        location: 'Jackson, MI',
        phone: '(517) 787-7800',
        website: 'https://www.sherriff-goslin.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Michigan roofer since 1906 — over 115 years of service across Michigan. Multiple offices statewide. Michigan winters are brutal with heavy snow and ice = constant roofing damage. 115 years of customer data with no automated re-engagement campaigns. Multi-location operation without multi-location automation. Pitch: storm damage landing pages + seasonal campaigns across all locations.',
      },
      {
        name: 'Allpoint Construction',
        owner: '',
        location: 'Wixom, MI',
        phone: '(248) 525-6950',
        website: 'https://www.allpointconstruction.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Detroit-area roofing + siding + windows contractor. Multi-service home improvement company in Oakland County (wealthy Detroit suburb). No automated cross-sell between roofing, siding, and windows. Multi-service model = bundled project pitch. After roof = automated follow-up offering siding and windows. Affluent Oakland County homeowners are high-value clients.',
      },
      {
        name: 'Holt Roofing',
        owner: '',
        location: 'Grand Rapids, MI',
        phone: '(616) 534-1834',
        website: 'https://www.holtroofing.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Grand Rapids roofing company serving West Michigan. Family-owned. Grand Rapids receives significant lake-effect snow from Lake Michigan — heavy snow + ice dam season creates massive winter roofing damage. No automated storm damage intake or ice dam emergency follow-up campaigns. West Michigan winter damage = highly predictable seasonal lead surge.',
      },
    ],
  },

  {
    label: '❄️ HVAC — Boise, ID & Spokane, WA',
    dbId: DB.hvac,
    prospects: [
      {
        name: 'Century Heating & Air',
        owner: '',
        location: 'Boise, ID',
        phone: '(208) 629-7777',
        website: 'https://www.centuryheatingandair.com',
        hasWebsite: 'Yes', wqs: 5, opp: 9,
        notes: 'Boise HVAC contractor in one of the fastest-growing metros in the US. Boise has grown 30%+ in the past decade — Idaho\'s boom city. Desert climate with hot summers (100°F+) and cold winters = strong year-round HVAC demand. No automated seasonal maintenance campaigns or new homeowner outreach. Explosive growth = automation for new homeowners is the perfect pitch.',
      },
      {
        name: 'Treasure Valley Heating and Cooling',
        owner: '',
        location: 'Nampa, ID',
        phone: '(208) 898-4115',
        website: 'https://www.tvheatcool.com',
        hasWebsite: 'Yes', wqs: 5, opp: 9,
        notes: 'HVAC company serving the Treasure Valley (Boise metro: Nampa, Caldwell, Meridian, Kuna). Treasure Valley is the fastest-growing region in the Pacific Northwest. Nampa and Meridian are growing at over 5% annually. No automated new homeowner campaigns or seasonal reminders. Boise/Nampa corridor = new subdivisions being built constantly = automated new construction HVAC follow-up.',
      },
      {
        name: 'Sunset Heating & Cooling',
        owner: '',
        location: 'Spokane, WA',
        phone: '(509) 747-3422',
        website: 'https://www.sunsetheatcool.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Spokane HVAC company serving Eastern Washington and North Idaho. Spokane is a major inland Northwest city (570K+ metro) with extreme temperature swings — cold winters (-10°F) and hot summers (100°F+). No automated seasonal campaigns or maintenance plan upsells. Spokane is dramatically underserved by HVAC digital agencies. Early-mover advantage is enormous here.',
      },
    ],
  },

  {
    label: '🦷 Cosmetic Dentists — Detroit & Boise',
    dbId: DB.cosmeticDentist,
    prospects: [
      {
        name: 'Birmingham Dental — Michigan',
        owner: '',
        location: 'Birmingham, MI',
        phone: '(248) 646-5577',
        website: 'https://www.birminghamsmile.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Cosmetic dental practice in Birmingham, MI — one of Michigan\'s most affluent communities. Birmingham is the luxury retail and dining hub of the Detroit metro. Serving high-income Oakland County professionals. No automated new patient intake or smile consultation follow-up. Birmingham\'s premium demographic = clients spending $10,000–$40,000 on smile makeovers with high conversion from automation.',
      },
      {
        name: 'Dental Implant Experts of Michigan',
        owner: '',
        location: 'Warren, MI',
        phone: '(586) 751-1666',
        website: 'https://www.dentalimplantexpertsmi.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Implant-focused dental practice in Warren (Macomb County, Detroit suburb). Macomb County is a large, growing Detroit suburban market. Implant-only focus = niche automation pitch: automated pre-consultation implant education drip + post-consultation follow-up. At $3,000–$6,000 per implant, automation improving case acceptance by 20% = massive revenue lift.',
      },
      {
        name: 'Boise Oral & Maxillofacial Surgery',
        owner: '',
        location: 'Boise, ID',
        phone: '(208) 345-3450',
        website: 'https://www.boiseoralsurgery.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Oral surgery + dental implants in Boise. High-ticket procedures in Idaho\'s fastest-growing city. Boise\'s population boom means constant new dental patients. No automated post-consultation implant education or case acceptance drip. Boise is extremely underserved for dental automation — being first to implement a strong digital follow-up = dominant position in the market.',
      },
    ],
  },

  {
    label: '🦴 Chiro/PT — Detroit & Boise',
    dbId: DB.chiroPT,
    prospects: [
      {
        name: 'Sterling Chiropractic',
        owner: '',
        location: 'Sterling Heights, MI',
        phone: '(586) 826-8226',
        website: 'https://www.sterlingchiropractic.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Chiropractic practice in Sterling Heights (Macomb County — one of Michigan\'s most populous suburbs). Sterling Heights has a large blue-collar and manufacturing workforce = high rates of repetitive strain and workplace injuries. No automated new patient intake or PI attorney referral program. Workers\' comp chiro pitch: automated intake for workplace injury claims + attorney referral tracking.',
      },
      {
        name: 'Michigan Back & Pain Center',
        owner: '',
        location: 'Southfield, MI',
        phone: '(248) 557-3093',
        website: 'https://www.michiganbackandpaincenter.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Chiropractic + pain management practice in Southfield serving Oakland County. Michigan\'s no-fault auto insurance = injured auto accident patients often seek chiro + pain management. Multi-service model without automated cross-service referrals. Auto accident chiro is a high-reimbursement specialty in Michigan. Pitch: automated PI intake + insurance verification + attorney referral system.',
      },
      {
        name: 'Boise Physical Therapy',
        owner: '',
        location: 'Boise, ID',
        phone: '(208) 429-0083',
        website: 'https://www.boisept.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Physical therapy clinic in Boise serving the Treasure Valley. Boise\'s active outdoor culture (skiing, mountain biking, hiking, trail running) = consistent sports injury and orthopedic PT demand. No automated new patient intake or post-discharge review collection. Boise\'s active population + rapid growth = constantly expanding patient base with strong retention through wellness programs.',
      },
    ],
  },

  {
    label: '🏡 Real Estate — Detroit Metro & Boise, ID',
    dbId: DB.realEstate,
    prospects: [
      {
        name: 'Max Broock Realtors',
        owner: '',
        location: 'Birmingham, MI',
        phone: '(248) 644-6700',
        website: 'https://www.maxbroock.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Detroit metro\'s premier luxury real estate firm — Max Broock has served Birmingham, Bloomfield Hills, and Oakland County luxury for decades. Affiliated with Luxury Portfolio International. Michigan luxury market is growing as remote work frees buyers from Detroit office proximity. No automated buyer/seller CRM. Strong premium pitch for the most recognized luxury brand in Michigan.',
      },
      {
        name: 'Hall & Hunter Realtors',
        owner: '',
        location: 'Birmingham, MI',
        phone: '(248) 644-3500',
        website: 'https://www.hallandhunter.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Boutique luxury real estate in Birmingham and the Detroit metro\'s North Oakland County corridor. 35+ years serving Bloomfield Hills, Birmingham, Bingham Farms. Deep community relationships. No automated buyer/seller drip at scale. Oakland County luxury market has rebounded strongly — remote work luxury buyers are re-entering the market at all-time highs.',
      },
      {
        name: 'Silvercreek Realty Group — Boise',
        owner: '',
        location: 'Meridian, ID',
        phone: '(208) 383-9465',
        website: 'https://www.silvercreekrealty.net',
        hasWebsite: 'Yes', wqs: 6, opp: 9,
        notes: 'One of Idaho\'s largest independent real estate firms, headquartered in Meridian (fastest-growing Boise suburb). Boise is one of the hottest real estate markets in the US — California and Pacific Northwest buyers relocating for affordability. No automated buyer/seller CRM or lead nurture. Boise market velocity = massive automation ROI. Agents who automate follow-up capture significantly more of this migration wave.',
      },
    ],
  },
];

async function main() {
  console.log('\n🚀 Batch 18 — Adding more real US businesses to Notion…\n');
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

  console.log(`\n✅ Batch 18 complete! ${grandTotal} new prospects added.\n`);
}

main().catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
