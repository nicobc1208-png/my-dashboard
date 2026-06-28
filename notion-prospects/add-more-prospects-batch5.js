/**
 * Nick Digital — Add More Prospects (Batch 5)
 * Run: NOTION_KEY=... node add-more-prospects-batch5.js
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
    label: '🔪 Plastic Surgery — Minneapolis',
    dbId: DB.plasticSurgery,
    prospects: [
      {
        name: 'Edina Plastic Surgery',
        owner: '',
        location: 'Edina, MN',
        phone: '(952) 925-1765',
        website: 'https://www.edinaplasticsurgery.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Board-certified plastic surgeons in Edina, MN (Minneapolis suburb). Full cosmetic + reconstructive menu. Edina is one of the wealthiest Twin Cities suburbs. No automated consultation funnel or post-consult follow-up. Strong candidate for intake automation + review drip.',
      },
      {
        name: 'Mesna Plastic Surgery & Aesthetic Center',
        owner: '',
        location: 'Minneapolis, MN',
        phone: '(952) 927-4556',
        website: 'https://www.plasticsurgeryminneapolis.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Board-certified plastic surgeon with 20+ years of experience. Aesthetic center attached to practice = medspa + surgery revenue streams. No automated cross-sell between surgery and medspa services. Pitch: separate automated funnels for surgical vs. non-surgical procedures.',
      },
      {
        name: 'Minneapolis Plastic Surgery, Ltd',
        owner: 'Dr. Douglas L. Gervais / Dr. Richard H. Tholen',
        location: 'Minneapolis, MN',
        phone: '(763) 545-0443',
        website: 'https://mpsmn.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Two ABPS board-certified surgeons in Minneapolis. Established multi-surgeon practice. Basic website — no chatbot, no automated booking, no post-consult drip. Twin Cities market is underserved by digital agencies targeting plastic surgery. Premium pitch opportunity.',
      },
    ],
  },

  {
    label: '⚖️ Personal Injury — Dallas',
    dbId: DB.personalInjury,
    prospects: [
      {
        name: 'Mullen & Mullen Law Firm',
        owner: '',
        location: 'Dallas, TX',
        phone: '(214) 747-5240',
        website: 'https://www.mullenandmullen.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Dallas PI firm in business for over 40 years. Family-run, deep community roots. Website is functional but no automated intake or after-hours capture. Dallas is the 9th-largest US city — massive accident volume. Pitch: 24/7 intake chatbot + automated case-status updates to stop client churn.',
      },
      {
        name: 'Anderson Injury Lawyers',
        owner: '',
        location: 'Dallas, TX',
        phone: '(214) 327-8000',
        website: 'https://maafirm.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: '17+ years helping accident victims in Dallas. Active caseload, multi-attorney firm. No automated lead nurturing or client communication sequences. Dallas traffic accidents are among the most frequent in TX. Automated intake + SMS status updates = major quality-of-life upgrade for their team and clients.',
      },
      {
        name: 'The Benton Law Firm',
        owner: '',
        location: 'Dallas, TX',
        phone: '(214) 556-8321',
        website: 'https://www.thebentonlawfirm.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Boutique Dallas personal injury firm. Strong local reputation. No automated review collection or client referral program. Dallas PI market is competitive — automated Google review drip post-settlement + referral automation would differentiate this firm significantly.',
      },
    ],
  },

  {
    label: '🏠 Roofing — Minneapolis / St. Paul',
    dbId: DB.roofing,
    prospects: [
      {
        name: 'Kaufman Roofing',
        owner: '',
        location: 'Minneapolis, MN',
        phone: '(612) 722-0965',
        website: 'https://www.kaufmanroofing.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Family-owned Minneapolis roofer since 1930. Nearly 100 years of Twin Cities roofing. MN hail and ice storm season creates massive seasonal demand. Basic website with zero digital automation. 90+ years of customer data with no email/SMS marketing. Enormous re-engagement opportunity.',
      },
      {
        name: 'Twin City Roofing',
        owner: '',
        location: 'Minneapolis, MN',
        phone: '(651) 636-9640',
        website: 'https://www.twincityroofing.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Established Twin Cities roofing + siding + construction specialists. Multi-service model without cross-service automation. Minnesota winters are brutal — ice dam damage creates emergency roofing leads that need immediate automated follow-up to convert before competition swoops in.',
      },
      {
        name: 'Sellers Roofing',
        owner: '',
        location: 'St. Paul, MN',
        phone: '(651) 703-2336',
        website: 'https://roofingexpertsstpaul.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Family-owned St. Paul roofing company. Residential + commercial work. Basic website. St. Paul is the state capital and part of a large metro market. No automated storm damage landing pages or review collection. Pitch: automated hail/ice damage intake form + Google review drip post-install.',
      },
    ],
  },

  {
    label: '❄️ HVAC — Dallas / Fort Worth',
    dbId: DB.hvac,
    prospects: [
      {
        name: 'DFW HVAC',
        owner: '',
        location: 'Dallas, TX',
        phone: '(972) 777-2665',
        website: 'https://dfwhvac.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Three-generation family-owned HVAC contractor serving all of Dallas-Fort Worth. Deep community roots, 162+ five-star reviews. Basic website — no online booking or automated maintenance reminders. DFW summers are extreme (100°F+) — AC emergencies create high-urgency leads that need same-day automated response.',
      },
      {
        name: 'Baker Brothers Plumbing, Air & Electric',
        owner: '',
        location: 'Dallas, TX',
        phone: '(214) 892-2225',
        website: 'https://bakerbrothersplumbing.com',
        hasWebsite: 'Yes', wqs: 6, opp: 7,
        notes: 'Family-operated DFW institution since 1945. Multi-service (HVAC + plumbing + electrical). 80+ years in business with a massive customer database. No automated cross-sell between services or maintenance plan upsell campaign. Each service line is its own automation funnel — massive ROI pitch.',
      },
      {
        name: 'Rescue Air Heating, Cooling & Plumbing',
        owner: '',
        location: 'Dallas, TX',
        phone: '(972) 201-3253',
        website: 'https://www.rescueairtx.com',
        hasWebsite: 'Yes', wqs: 5, opp: 9,
        notes: 'Small, independently-owned Dallas HVAC + plumbing company. Growing business with no automated systems. Small team = can\'t manually follow up on every lead. Pitch: automated intake + dispatch confirmation + post-service review collection would let them compete with the big boys without hiring more staff.',
      },
    ],
  },

  {
    label: '🦷 Cosmetic Dentists — Austin',
    dbId: DB.cosmeticDentist,
    prospects: [
      {
        name: 'Austin Advanced Dentistry',
        owner: '',
        location: 'Austin, TX',
        phone: '(512) 886-6734',
        website: 'https://www.austinadvanceddentistry.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'General + cosmetic + implant dentistry in Austin. Austin is one of the fastest-growing US cities with a young, high-income tech worker demographic. No automated new patient acquisition or post-visit review collection. Growing market + digital-native clientele = strong automation pitch.',
      },
      {
        name: 'Lifetime Smiles Cosmetic Dentistry',
        owner: '',
        location: 'Austin, TX',
        phone: '(512) 900-2384',
        website: 'https://www.atxdentistry.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'South Austin cosmetic + family dentistry practice. Veneers, Invisalign, implants. Good local reputation but no automated new patient intake or consultation follow-up. Austin\'s massive influx of new residents = constant stream of patients looking for a new dental home — automated new patient campaigns are essential.',
      },
      {
        name: 'The Cosmetic Dentists of Austin',
        owner: '',
        location: 'Austin, TX',
        phone: '(512) 333-7777',
        website: 'https://www.thecosmeticdentistsofaustin.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Dedicated cosmetic dental practice in Austin. Dental implants + veneers + smile makeovers specialty. No automated post-consultation drip or review request sequence. Austin tech culture = clients who expect digital-first experiences. Pitch: automated consultation booking + AI follow-up sequence.',
      },
    ],
  },

  {
    label: '🦴 Chiro/PT — Austin',
    dbId: DB.chiroPT,
    prospects: [
      {
        name: 'Austin Chiropractic & Rehab',
        owner: '',
        location: 'Austin, TX',
        phone: '(512) 451-0115',
        website: 'https://www.austinchiroandrehab.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Austin chiropractic + rehabilitation clinic. Active community, good local reputation. No automated appointment reminders or post-treatment review collection. Austin is growing by 150+ people per day — massive new patient acquisition opportunity for practices with automated intake.',
      },
      {
        name: 'Wright Family Chiropractic',
        owner: 'Dr. James Wright / Dr. Tyler Wright',
        location: 'Austin, TX',
        phone: '(512) 476-5695',
        website: 'https://www.wrightfamilychiroaustin.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Father-son chiropractic practice serving Cedar Park, Austin, and surrounding areas. Multi-location family practice. No automated patient communication or referral program. Family brand + multi-location = multi-funnel automation pitch: each location gets its own intake + follow-up flow.',
      },
      {
        name: 'Austin Preferred Integrative Medicine',
        owner: '',
        location: 'Austin, TX',
        phone: '(512) 442-2727',
        website: 'https://austinpreferred.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Multi-discipline clinic: chiropractic + physical therapy + holistic medicine. Multi-service model with no cross-discipline automation. Austin health-conscious population = clients who use multiple services. Automated cross-sell sequences between chiro, PT, and wellness services = strong revenue uplift pitch.',
      },
    ],
  },

  {
    label: '🏡 Real Estate — Austin Luxury',
    dbId: DB.realEstate,
    prospects: [
      {
        name: 'Eric Moreland Group',
        owner: 'Eric Moreland',
        location: 'Austin, TX',
        phone: '(512) 480-0844',
        website: 'https://ericmorelandgroup.com',
        hasWebsite: 'Yes', wqs: 7, opp: 7,
        notes: 'Top Austin luxury real estate team, 20+ years shaping Austin\'s highest residential tier. Strong reputation but no automated buyer drip or seller lead nurturing. Austin luxury market has exploded with tech IPOs and relocations. Automation ROI on high-commission transactions is massive.',
      },
      {
        name: 'Kifer Sparks Agency',
        owner: '',
        location: 'Austin, TX',
        phone: '',
        website: 'https://www.ksarealtors.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Boutique women-owned Austin luxury real estate firm. Personal, problem-solving approach that differentiates from national franchises. No automated CRM follow-up or lead nurturing. Austin is one of the hottest RE markets in the US — boutique brand + automation = powerful competitive advantage.',
      },
      {
        name: 'Austin Portfolio Real Estate',
        owner: '',
        location: 'Austin, TX',
        phone: '',
        website: 'https://www.austinportfoliorealestate.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Boutique Keller Williams Luxury International brokerage in Austin. Specializes in luxury homes across Austin metro. No automated buyer qualification or seller lead drip. Austin luxury real estate is booming — high-income buyers expect premium digital touchpoints that this firm doesn\'t yet offer.',
      },
    ],
  },
];

async function main() {
  console.log('\n🚀 Batch 5 — Adding more real US businesses to Notion…\n');
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

  console.log(`\n✅ Batch 5 complete! ${grandTotal} new prospects added.\n`);
}

main().catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
