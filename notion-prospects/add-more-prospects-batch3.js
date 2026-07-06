/**
 * Nick Digital — Add More Prospects (Batch 3)
 * Run: NOTION_KEY=... node add-more-prospects-batch3.js
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
    label: '🔪 Plastic Surgery — San Diego & Indianapolis',
    dbId: DB.plasticSurgery,
    prospects: [
      {
        name: 'Coastal Plastic Surgeons',
        owner: 'Dr. Munish Batra / Dr. Chagri Cakmakoglu',
        location: 'San Diego, CA',
        phone: '(858) 847-0800',
        website: 'https://coastalplasticsurgeons.com',
        hasWebsite: 'Yes', wqs: 7, opp: 7,
        notes: 'Two board-certified surgeons, San Diego. Full plastic surgery + medspa services. Good website but no automated intake or post-consult drip sequence. San Diego affluent market — high-ticket procedures.',
      },
      {
        name: 'Pacific Lipo',
        owner: '',
        location: 'San Diego, CA',
        phone: '(858) 427-8899',
        website: 'https://pacificlipo.com',
        hasWebsite: 'Yes', wqs: 7, opp: 7,
        notes: 'Specialized liposuction + body contouring practice in San Diego. Niche focus = strong SEO opportunity. No automated consultation booking or post-consult follow-up. Affluent San Diego + La Jolla clientele.',
      },
      {
        name: 'La Jolla Cosmetic Surgery Centre',
        owner: '',
        location: 'La Jolla, CA',
        phone: '(858) 452-1981',
        website: 'https://ljcsc.com',
        hasWebsite: 'Yes', wqs: 7, opp: 8,
        notes: 'Premier La Jolla cosmetic surgery center. One of San Diego\'s most established practices. Multiple surgeons. Strong reputation but old-school intake process — no chatbot, no automated post-consult nurturing. Ultra-affluent La Jolla market.',
      },
      {
        name: 'The Gillian Institute',
        owner: 'Dr. Kimberly Short',
        location: 'Indianapolis, IN',
        phone: '(317) 913-3260',
        website: 'https://indyplasticsurgery.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Board-certified female plastic surgeon in Indianapolis. Boutique aesthetic practice. Website is basic with no automated booking or nurture flow. Indy is a growing midwestern market underserved by digital agencies.',
      },
    ],
  },

  {
    label: '⚖️ Personal Injury — Las Vegas',
    dbId: DB.personalInjury,
    prospects: [
      {
        name: 'Naqvi Injury Law',
        owner: 'Farhan Naqvi',
        location: 'Las Vegas, NV',
        phone: '(702) 553-1000',
        website: 'https://naqvilaw.com',
        hasWebsite: 'Yes', wqs: 7, opp: 7,
        notes: 'Multi-location Las Vegas PI firm (Henderson + Las Vegas). High-volume practice. Good website but no after-hours AI intake or review automation. LV has massive accident volume from tourists + growing population. Scale of operation = huge ROI on automation.',
      },
      {
        name: 'Claggett & Sykes Trial Lawyers',
        owner: '',
        location: 'Las Vegas, NV',
        phone: '(702) 333-7777',
        website: 'https://claggettlaw.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Boutique trial firm in Las Vegas focused on serious injury cases. Strong reputation, outdated digital presence. No automated lead capture or client intake. High-value cases = budget for premium automation package.',
      },
      {
        name: 'Shook & Stone',
        owner: '',
        location: 'Las Vegas, NV',
        phone: '(702) 570-0000',
        website: 'https://shookandstone.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Las Vegas personal injury firm with strong community presence. No 24/7 intake bot or automated follow-up sequence. Pitch: after-hours chatbot captures tourist accident cases competitors miss. LV tourism = unique lead source.',
      },
    ],
  },

  {
    label: '🏠 Roofing — Oklahoma City',
    dbId: DB.roofing,
    prospects: [
      {
        name: 'LHI OKC (Lifestyle Home Improvement)',
        owner: '',
        location: 'Oklahoma City, OK',
        phone: '(405) 470-6999',
        website: 'https://lhiokc.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Veteran-owned roofing company, A+ BBB rating, Oklahoma City. Roofing + siding + windows. Veterans-owned angle = great brand story but no digital automation. OKC is tornado alley — storm damage season drives massive roofing demand. Automated storm lead capture pitch.',
      },
      {
        name: 'Elliott Roofing',
        owner: '',
        location: 'Oklahoma City, OK',
        phone: '(405) 789-4646',
        website: 'https://elliottroofs.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Family-owned OKC roofer since 1981. 40+ years of service in the OKC market. Basic website. Tornado + hail storm season = huge seasonal demand spikes they miss due to manual intake. Automated storm estimate landing pages + follow-up drip would dramatically increase revenue.',
      },
      {
        name: 'Shamrock Roofing OKC',
        owner: '',
        location: 'Oklahoma City, OK',
        phone: '(405) 300-1477',
        website: 'https://shamrockroofer.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Nearly 50-year family-owned roofing company in OKC. Multi-generational business with strong reputation. Website is outdated. No automated estimate requests or post-job review collection. Premium candidate for website redesign + automated storm damage pipeline.',
      },
    ],
  },

  {
    label: '❄️ HVAC — Las Vegas & Indianapolis',
    dbId: DB.hvac,
    prospects: [
      {
        name: 'Infinity Heating and Cooling',
        owner: '',
        location: 'Las Vegas, NV',
        phone: '(702) 825-7576',
        website: 'https://infinityheatingandcooling.com',
        hasWebsite: 'Yes', wqs: 5, opp: 9,
        notes: 'Trane Comfort Specialist HVAC contractor in Las Vegas. LV is one of the hottest US cities — AC is a 365-day necessity. Basic website. No automated seasonal maintenance reminders or after-hours emergency booking. Peak summer demand needs automated intake to avoid missed leads.',
      },
      {
        name: 'One Hour Air Conditioning & Heating of Indianapolis',
        owner: '',
        location: 'Indianapolis, IN',
        phone: '(317) 743-5737',
        website: 'https://onehourheatindianapolis.com',
        hasWebsite: 'Yes', wqs: 5, opp: 7,
        notes: 'Indianapolis franchise HVAC dealer. Residential installs + service. Basic web presence. Indy has harsh winters and hot summers — seasonal demand is high. Automated maintenance reminder campaigns + online booking would significantly increase repeat service revenue.',
      },
      {
        name: 'Action Air Conditioning',
        owner: '',
        location: 'Las Vegas, NV',
        phone: '(702) 255-4010',
        website: 'https://actionairlv.com',
        hasWebsite: 'Yes', wqs: 4, opp: 9,
        notes: 'Local Las Vegas HVAC service company. Older website. Las Vegas heat makes HVAC an emergency service year-round. No automated dispatch confirmation or online booking. Pitch: 24/7 booking chatbot + automated follow-up for post-service reviews.',
      },
    ],
  },

  {
    label: '🦷 Cosmetic Dentists — Portland',
    dbId: DB.cosmeticDentist,
    prospects: [
      {
        name: 'NW Implant Center',
        owner: 'Dr. Hyungsup Lee / Dr. Kevin Kim',
        location: 'Portland, OR',
        phone: '(503) 922-2020',
        website: 'https://nwimplantcenter.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Dental implant specialists in Portland. Board-certified oral surgeons. Good reputation. Website lacks automated new patient intake or consultation booking. Portland metro is growing fast with high healthcare spending demographics.',
      },
      {
        name: 'Portland Smile Design',
        owner: '',
        location: 'Portland, OR',
        phone: '(503) 223-4182',
        website: 'https://portlandsmiledesign.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Cosmetic + restorative dentistry boutique practice in downtown Portland. Veneers, Invisalign, whitening focus. No automated new patient capture or post-consultation follow-up. Premium Portland clientele willing to invest in cosmetic dental work.',
      },
      {
        name: 'Cascade Esthetic Dentistry',
        owner: 'Dr. James Kohler',
        location: 'Portland, OR',
        phone: '(503) 292-5483',
        website: 'https://cascadeesthetic.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Boutique cosmetic dental practice in Portland focusing on smile makeovers, veneers, and implants. Basic website with no chatbot or automated follow-up sequence. Portland\'s affluent tech worker population = high-value cosmetic dental market.',
      },
    ],
  },

  {
    label: '🦴 Chiro/PT — Las Vegas & Portland',
    dbId: DB.chiroPT,
    prospects: [
      {
        name: 'Canyon Lake Chiropractic & Physical Therapy',
        owner: '',
        location: 'Las Vegas, NV',
        phone: '(702) 258-3300',
        website: 'https://canyonlakechiropracticandphysicaltherapy.com',
        hasWebsite: 'Yes', wqs: 4, opp: 9,
        notes: 'Chiropractic + physical therapy combined clinic in Las Vegas. Multi-service model. Very basic website. LV has high accident rate from tourism + traffic. No automated intake for personal injury referrals or post-treatment review collection. Massive automation opportunity.',
      },
      {
        name: 'Portland Chiropractic Clinic',
        owner: '',
        location: 'Portland, OR',
        phone: '(503) 255-0306',
        website: 'https://portlandchiropractic.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Established chiropractic practice in Portland. Good local reputation. No automated appointment reminders or follow-up sequences. Portland\'s active outdoor lifestyle population = strong demand for chiro + PT services year-round.',
      },
      {
        name: 'Injury Rehab and Wellness Center',
        owner: '',
        location: 'Las Vegas, NV',
        phone: '(702) 509-5098',
        website: 'https://injuryrehabwellness.com',
        hasWebsite: 'Yes', wqs: 4, opp: 9,
        notes: 'PI-focused rehab + wellness center in Las Vegas. Personal injury + chiro + PT combined. No automated intake for accident victims or attorney referral tracking. Las Vegas accident volume is massive — automated lead-to-appointment pipeline would transform their business.',
      },
    ],
  },

  {
    label: '🏡 Real Estate — Seattle & Phoenix',
    dbId: DB.realEstate,
    prospects: [
      {
        name: 'Real Residential',
        owner: '',
        location: 'Seattle, WA',
        phone: '(206) 427-7325',
        website: 'https://realresidential.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Boutique Seattle real estate brokerage. Independent, non-franchise. Seattle is one of the most competitive RE markets in the US. No automated buyer/seller drip or lead nurture sequence. Premium tech-worker clientele = high property values and high-ticket transactions.',
      },
      {
        name: 'Realty Executives Arizona Territory',
        owner: '',
        location: 'Phoenix, AZ',
        phone: '(480) 355-3700',
        website: 'https://realtyexecutivesaz.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Phoenix metro real estate brokerage. Phoenix is one of the fastest-growing US cities. No automated lead nurturing or CRM follow-up sequences. Growing market + high sales volume = massive ROI on buyer/seller drip automation.',
      },
      {
        name: 'Silverleaf Realty',
        owner: '',
        location: 'Scottsdale, AZ',
        phone: '(480) 502-7653',
        website: 'https://silverleafrealty.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Luxury Scottsdale real estate specialists. High-end homes $1M+. Affluent clientele. Basic website with no automated follow-up for buyer leads or seller listings. Luxury real estate = clients expect premium experience — automated touchpoints are a must.',
      },
    ],
  },
];

async function main() {
  console.log('\n🚀 Batch 3 — Adding more real US businesses to Notion…\n');
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

  console.log(`\n✅ Batch 3 complete! ${grandTotal} new prospects added.\n`);
}

main().catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
