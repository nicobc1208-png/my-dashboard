/**
 * Nick Digital — Add More Prospects (Batch 2)
 * Run: NOTION_KEY=... node add-more-prospects-batch2.js
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
    label: '🔪 Plastic Surgery — Chicago',
    dbId: DB.plasticSurgery,
    prospects: [
      {
        name: 'Bloom Plastic Surgery',
        owner: 'Dr. Jacob Bloom',
        location: 'Chicago, IL',
        phone: '(312) 549-8691',
        website: 'https://www.bloomplasticsurgery.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Board-certified Chicago surgeon, ASPS member. Founded 2016. Chicago + western suburbs coverage. 39 Yelp reviews. Good branding but no automated intake or after-consult drip. Huge Chicago market.',
      },
      {
        name: 'Aesthetic Institute of Chicago',
        owner: 'Dr. Brian Braithwaite / Dr. Lorri Cobbins',
        location: 'Chicago, IL',
        phone: '(312) 361-8108',
        website: 'https://www.aestheticinstitutechicago.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Dual board-certified surgeons, downtown Chicago location. Full cosmetic surgery menu. Website is okay but no automated booking or post-consult nurture sequence.',
      },
      {
        name: 'Plastic Surgery Clinic of Chicago',
        owner: 'Dr. Parit Patel',
        location: 'Chicago, IL',
        phone: '(312) 819-5338',
        website: 'https://www.pscofchicago.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Board-certified (ASPS), Magnificent Mile location. Boutique practice. Basic website, no chatbot or consultation funnel. Affluent Michigan Ave market = high-ticket procedures. Easy premium pitch.',
      },
    ],
  },

  {
    label: '⚖️ Personal Injury — Nashville',
    dbId: DB.personalInjury,
    prospects: [
      {
        name: 'Reasonover Law Firm',
        owner: '',
        location: 'Nashville, TN',
        phone: '(615) 241-0405',
        website: 'https://reasonoverlaw.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Boutique Nashville PI firm — cases get undivided attorney attention. No automated client intake or 24/7 lead capture. Nashville is growing fast (new residents = new accident cases). Pitch: intake bot + drip automation.',
      },
      {
        name: 'DRS Law Personal Injury Lawyers',
        owner: '',
        location: 'Nashville, TN',
        phone: '(615) 742-1775',
        website: 'https://www.drslawfirm.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: '40-year family-founded Nashville firm. Handles TN, KY, GA. Multi-state multi-city coverage without multi-location automation is a massive gap. Full intake + drip automation pitch.',
      },
      {
        name: 'Kinnard Law',
        owner: 'Randall Kinnard',
        location: 'Nashville, TN',
        phone: '(615) 933-2893',
        website: 'https://www.kinnardlaw.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'US News Best Law Firm, recovered millions since 1977. Good reputation, outdated website. No after-hours chatbot despite being a high-volume PI firm. Pitch: branded chatbot + review automation.',
      },
      {
        name: 'The Williams Firm',
        owner: 'Jonathan Williams',
        location: 'Nashville, TN',
        phone: '(615) 256-8880',
        website: 'https://www.lrwlawfirm.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: '40+ year Nashville injury firm. Well-established brand. Basic website with no lead nurturing or automated intake form. Great candidate for website redesign + automated consultation booking system.',
      },
    ],
  },

  {
    label: '🏠 Roofing — Atlanta & San Antonio',
    dbId: DB.roofing,
    prospects: [
      {
        name: 'Bell Roofing',
        owner: '',
        location: 'Atlanta, GA',
        phone: '(678) 825-6331',
        website: 'https://www.bellroofingco.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Atlanta roofer since 1998, GAF Master Elite Contractor. 91 Yelp reviews. Basic website. Atlanta hail storms drive huge seasonal demand — automated storm damage lead capture + follow-up is the pitch.',
      },
      {
        name: 'Inspector Roofing & Restoration',
        owner: '',
        location: 'Alpharetta, GA',
        phone: '(678) 287-7169',
        website: 'https://inspector-roofing.com',
        hasWebsite: 'Yes', wqs: 5, opp: 9,
        notes: 'Owens Corning Preferred Contractor in North Atlanta. 5-star Google, 100+ reviews. Strong reputation but no automated post-inspection follow-up or review drip. Affluent North Atlanta suburbs = high-ticket roofing jobs.',
      },
      {
        name: 'Independence Roofing',
        owner: '',
        location: 'San Antonio, TX',
        phone: '(210) 685-0409',
        website: 'https://independenceroofingsa.com',
        hasWebsite: 'Yes', wqs: 4, opp: 8,
        notes: 'Residential + commercial roofing in SA. Basic website. Texas hail season + rapid SA metro growth = strong demand. Estimate automation + Google review drip would transform this business.',
      },
    ],
  },

  {
    label: '❄️ HVAC — Atlanta Metro',
    dbId: DB.hvac,
    prospects: [
      {
        name: 'The Air Company of Georgia',
        owner: '',
        location: 'Atlanta, GA',
        phone: '(404) 583-7788',
        website: 'https://www.theaircompanyga.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Local Atlanta HVAC serving Buckhead, Roswell, Alpharetta, Dunwoody, Sandy Springs, Marietta. Multi-area coverage with basic website. No automated scheduling or seasonal maintenance campaign. Strong growth market.',
      },
      {
        name: 'Georgia Home Heating & Air',
        owner: '',
        location: 'Alpharetta, GA',
        phone: '(678) 981-8815',
        website: 'https://georgiahomeac.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Small family-owned HVAC team serving Alpharetta + Milton. Lean independent shop passing savings to customers. Basic website. Affluent North Atlanta market + growing population = high demand for HVAC services.',
      },
      {
        name: 'A.R. Sims Heating & Air Conditioning',
        owner: '',
        location: 'Lawrenceville, GA',
        phone: '(770) 545-8530',
        website: 'https://www.arsimshvac.com',
        hasWebsite: 'Yes', wqs: 4, opp: 8,
        notes: 'Black-owned family business in Gwinnett County serving all surrounding Atlanta metro areas. Basic website. 24/7 emergency HVAC = needs after-hours online booking form + automated dispatch confirmation.',
      },
    ],
  },

  {
    label: '🦷 Cosmetic Dentists — Denver & Las Vegas',
    dbId: DB.cosmeticDentist,
    prospects: [
      {
        name: 'Denver Cosmetic & Implant Dentistry',
        owner: '',
        location: 'Denver, CO',
        phone: '(303) 597-9700',
        website: 'https://diccolorado.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Implant + cosmetic dentistry practice in Denver. Good reputation. Basic website. Denver metro is growing fast — automated new patient acquisition and follow-up would be a game changer for this practice.',
      },
      {
        name: 'Vegas Dental Experts',
        owner: 'Dr. Harvey Chin',
        location: 'Las Vegas, NV',
        phone: '(702) 876-6067',
        website: 'https://vegasdentalexpertsnevada.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Cosmetic + implants + family dentistry with Las Vegas and Henderson locations. Multi-location, no automated patient routing or booking. LV has massive tourism influx = unique opportunity for "same-day emergency + cosmetic" automation pitch.',
      },
      {
        name: 'Advanced Dental Las Vegas',
        owner: '',
        location: 'Las Vegas, NV',
        phone: '(702) 202-3400',
        website: 'https://www.advanceddentalnv.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Local Las Vegas practice offering cosmetic + implants + general care. 63 Yelp reviews. Decent local presence but no automated intake or patient journey flow. LV dental market is highly competitive — automation as differentiator pitch.',
      },
    ],
  },

  {
    label: '🦴 Chiro/PT — Charlotte, Denver & Atlanta',
    dbId: DB.chiroPT,
    prospects: [
      {
        name: 'Carolina Sports Clinic',
        owner: '',
        location: 'Charlotte, NC',
        phone: '(704) 544-5353',
        website: 'https://carolinasportsclinic.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Sports chiropractic + physical therapy in Charlotte (3 locations: Piedmont Row, Blakeney, Fort Mill SC). 89 Yelp reviews. Multi-location with no automation between sites. Sports injury niche = seasonal volume spikes that need automated marketing.',
      },
      {
        name: 'Denver Integrated Spine Center',
        owner: '',
        location: 'Denver, CO',
        phone: '(303) 758-9000',
        website: 'https://denver-chiropractic.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Denver premier multidisciplinary injury recovery + rehabilitation center. Multiple locations. Basic website. Injury recovery niche = high-urgency leads who need immediate response. Automated intake + appointment bot is critical.',
      },
      {
        name: 'Atlanta Chiropractic & Wellness Center',
        owner: '',
        location: 'Atlanta, GA',
        phone: '(404) 687-2382',
        website: 'https://atlantachiroandwellness.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Atlanta chiro + PT + kinesiology + functional medicine. 57 Yelp reviews. Multi-service clinic. Good reviews but no automated follow-up or review collection. Multi-service model = multiple automation pitches in one conversation.',
      },
    ],
  },

  {
    label: '🏡 Real Estate — Houston Luxury',
    dbId: DB.realEstate,
    prospects: [
      {
        name: 'Brooks & Davis Real Estate Firm',
        owner: '',
        location: 'Houston, TX',
        phone: '(713) 665-8329',
        website: 'https://brooksanddavisrealestatefirm.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'One of the largest 100% Black independently-owned RE brokerages in the US, based in Houston. Premium brand, strong community ties. No automated buyer/seller drip or CRM integration. Houston is the 4th largest US city — huge addressable market.',
      },
      {
        name: 'Greenwood King Properties',
        owner: 'Julie Greenwood / Linda King',
        location: 'Houston, TX',
        phone: '(713) 524-0888',
        website: 'https://greenwoodking.com',
        hasWebsite: 'Yes', wqs: 7, opp: 7,
        notes: 'Founded 1984. $1B+ annual sales since 2012. One of few privately-owned Houston brokerages of this size. Good website but no automated buyer drip or seller lead nurturing. Scale of operation = massive automation ROI. Premium pitch target.',
      },
    ],
  },
];

async function main() {
  console.log('\n🚀 Batch 2 — Adding more real US businesses to Notion…\n');
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

  console.log(`\n✅ Batch 2 complete! ${grandTotal} new prospects added.\n`);
}

main().catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
