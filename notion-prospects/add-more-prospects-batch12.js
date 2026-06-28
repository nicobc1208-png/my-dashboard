/**
 * Nick Digital — Add More Prospects (Batch 12)
 * Run: NOTION_KEY=... node add-more-prospects-batch12.js
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
    label: '🔪 Plastic Surgery — Baltimore / DC Suburbs',
    dbId: DB.plasticSurgery,
    prospects: [
      {
        name: 'Chesapeake Vein Center and MedSpa',
        owner: 'Dr. Surendra Bhavsar',
        location: 'Virginia Beach, VA',
        phone: '(757) 663-4000',
        website: 'https://www.chesapeakevein.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Plastic surgery + vein treatment + MedSpa in Virginia Beach. Multi-revenue model (surgery + MedSpa) with no cross-sell automation. Virginia Beach is a major coastal metro with a large military and government workforce. No automated MedSpa upsell from surgery patients. Pitch: post-surgical patients automatically receive MedSpa follow-up offers.',
      },
      {
        name: 'Plastic Surgery Center of Maryland',
        owner: '',
        location: 'Lutherville, MD',
        phone: '(410) 296-0414',
        website: 'https://www.marylandplasticsurgery.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Established plastic surgery practice in the Baltimore suburbs (Lutherville / Timonium). Serving affluent North Baltimore County communities. No automated consultation funnel or post-consult nurturing. Baltimore metro has strong healthcare and biotech workforce = premium income patients. Good local reputation with zero digital automation.',
      },
      {
        name: 'Reston Plastic Surgery',
        owner: '',
        location: 'Reston, VA',
        phone: '(703) 481-0002',
        website: 'https://www.restonplasticsurgery.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Plastic surgery practice in Reston, VA — the heart of the DC tech corridor (Amazon HQ2 nearby, countless government contractors). Northern Virginia is one of the highest-income regions in the US. No automated consultation booking or post-procedure drip. NoVA tech wealth = elite cosmetic market with clients spending $20,000–$60,000 on procedures.',
      },
    ],
  },

  {
    label: '⚖️ Personal Injury — Baltimore / DC Area',
    dbId: DB.personalInjury,
    prospects: [
      {
        name: 'Peter Angelos Law',
        owner: '',
        location: 'Baltimore, MD',
        phone: '(800) 556-4427',
        website: 'https://www.pangeloslaw.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'One of the most recognized personal injury and mass tort firms in Maryland. High-profile cases, major asbestos and mesothelioma verdicts. No automated intake chatbot or post-settlement review automation. Baltimore PI market is large with high accident rates on I-95 and the Beltway. Brand recognition = automated intake converts more of their traffic.',
      },
      {
        name: 'Dubin Law Group',
        owner: '',
        location: 'Rockville, MD',
        phone: '(301) 608-2990',
        website: 'https://www.dubinlaw.net',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Maryland PI firm serving Montgomery County and the DC suburbs. Car accidents, truck accidents, wrongful death. Montgomery County is one of the wealthiest counties in the US — PI case values are high. No automated intake or post-settlement review collection. High-value market with no digital automation = strong opportunity.',
      },
      {
        name: 'Portner & Shure',
        owner: '',
        location: 'Columbia, MD',
        phone: '(410) 995-1515',
        website: 'https://www.portnerandshure.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Maryland and Virginia PI firm serving Columbia, Baltimore, and Northern Virginia. Multi-state practice = multiple market pitches. No automated intake or 24/7 lead capture. I-95 corridor between Baltimore and DC has some of the highest accident rates on the East Coast — automated after-hours chatbot is a clear ROI story.',
      },
    ],
  },

  {
    label: '🏠 Roofing — Baltimore / DC Suburbs',
    dbId: DB.roofing,
    prospects: [
      {
        name: 'Roofing by Bruce',
        owner: '',
        location: 'Monkton, MD',
        phone: '(410) 329-2100',
        website: 'https://www.roofingbybruce.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Maryland roofer with 30+ years serving Baltimore and surrounding counties. Family-owned, strong local reputation. Baltimore receives significant storm activity — hail and ice damage are seasonal drivers. No automated storm damage intake page or post-job review collection. 30 years of customers with zero email/SMS automation = massive re-engagement pitch.',
      },
      {
        name: 'Reliable Roofing & Restoration',
        owner: '',
        location: 'Silver Spring, MD',
        phone: '(301) 455-4444',
        website: 'https://www.reliableroofingmd.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Maryland roofer serving Montgomery and Prince George\'s Counties (DC suburbs). Residential + commercial. DC suburbs have high home values and affluent homeowners willing to pay premium for quality roofing. No automated estimate requests or review generation. Prime DC suburb location = premium pricing power that automation amplifies.',
      },
      {
        name: 'All American Roofing',
        owner: '',
        location: 'Manassas, VA',
        phone: '(703) 330-4700',
        website: 'https://allamericanroofingva.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Northern Virginia roofer serving Manassas, Prince William County, and surrounding NoVA communities. Fast-growing area with massive construction activity. Northern Virginia homeowners pay premium prices for services. No automated storm damage follow-up or review collection. Growing NoVA suburbs = constant new roofing demand from new construction + existing stock.',
      },
    ],
  },

  {
    label: '❄️ HVAC — St. Louis, MO',
    dbId: DB.hvac,
    prospects: [
      {
        name: 'Scott-Lee Heating Company',
        owner: '',
        location: 'St. Louis, MO',
        phone: '(314) 200-0788',
        website: 'https://www.scottleeheating.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Family-owned St. Louis HVAC company with 35+ years of service. Residential heating and cooling across the St. Louis metro. St. Louis has extreme seasonal swings — hot humid summers and cold winters. No automated seasonal maintenance reminders or maintenance plan upsell. Large existing customer base = immediate re-engagement revenue opportunity.',
      },
      {
        name: 'Galmiche & Sons Heating and Air',
        owner: '',
        location: 'Chesterfield, MO',
        phone: '(314) 993-1110',
        website: 'https://galmichemechanical.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Second-generation HVAC company in Chesterfield (affluent St. Louis suburb). Serving west St. Louis County since 1993. Chesterfield is one of the wealthiest St. Louis suburbs — premium HVAC clients. No automated maintenance plan upsells or seasonal campaigns. Affluent suburb market = high margin jobs where automation ROI is strong.',
      },
      {
        name: 'Hoffmann Brothers Heating, Air, Plumbing & Electric',
        owner: '',
        location: 'St. Louis, MO',
        phone: '(314) 664-3011',
        website: 'https://www.hoffmannbrothers.com',
        hasWebsite: 'Yes', wqs: 6, opp: 7,
        notes: 'Multi-service St. Louis home services company (HVAC + plumbing + electrical). Four generations of family ownership since 1921. Over 100 years of service with limited digital automation. Multi-service model without cross-sell automation is a massive missed opportunity. Pitch: separate automated funnels for HVAC vs. plumbing vs. electrical + unified maintenance plan.',
      },
    ],
  },

  {
    label: '🦷 Cosmetic Dentists — Baltimore / DC',
    dbId: DB.cosmeticDentist,
    prospects: [
      {
        name: 'Dental Arts of Rockville',
        owner: '',
        location: 'Rockville, MD',
        phone: '(301) 881-1991',
        website: 'https://www.dentalartsofrockville.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Cosmetic + general dentistry in Rockville, MD — one of the DC area\'s wealthiest suburbs. Serving Montgomery County professionals (government, law, medicine). No automated new patient intake or consultation follow-up. DC suburban demographic has extremely high disposable income — smile makeovers, veneers, and implants have strong demand in this market.',
      },
      {
        name: 'Hunt Valley Dental Centre',
        owner: '',
        location: 'Hunt Valley, MD',
        phone: '(410) 527-0800',
        website: 'https://huntvalleydental.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Cosmetic + implant + restorative dentistry in Hunt Valley (North Baltimore suburban corridor). Serving affluent North Baltimore County. No automated new patient acquisition or post-procedure review collection. North Baltimore County (Hunt Valley, Cockeysville, Timonium) = high-income professionals who invest in premium cosmetic dental work.',
      },
      {
        name: 'Old Town Smiles',
        owner: '',
        location: 'Alexandria, VA',
        phone: '(703) 836-7000',
        website: 'https://www.oldtownsmiles.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Cosmetic + general dentistry in Old Town Alexandria, VA — one of DC\'s most affluent neighborhoods. Old Town is historic, walkable, and home to government officials, lawyers, and lobbyists. No automated new patient intake or consultation follow-up. DC/NoVA clientele = extremely high incomes + brand-conscious = premium cosmetic dental pitch.',
      },
    ],
  },

  {
    label: '🦴 Chiro/PT — St. Louis, MO',
    dbId: DB.chiroPT,
    prospects: [
      {
        name: 'STL Chiropractic & Sports Recovery',
        owner: '',
        location: 'St. Louis, MO',
        phone: '(314) 207-8704',
        website: 'https://stlchiropractic.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Sports-focused chiropractic + recovery clinic in St. Louis. Targets athletes and active professionals. St. Louis has a strong sports culture (Cardinals, Blues, collegiate sports). No automated injury-intake forms or post-visit review collection. Sports-specific pitch: automated injury intake funnel + recovery check-in sequences = perfect fit.',
      },
      {
        name: 'Synergy Chiropractic & Wellness',
        owner: '',
        location: 'Ballwin, MO',
        phone: '(636) 227-1600',
        website: 'https://www.synergychiroballwin.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Chiropractic + wellness in Ballwin (affluent St. Louis suburb, West County). Multi-service model. Ballwin/Chesterfield/Manchester corridor is an affluent suburban market. No automated patient communication or wellness plan upsells. Affluent suburb demographic = perfect for automated wellness plan follow-up after initial chiro visit.',
      },
      {
        name: 'Missouri Spine & Injury Center',
        owner: '',
        location: 'St. Louis, MO',
        phone: '(314) 499-6416',
        website: 'https://www.missourispineandinjury.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Personal injury chiropractic practice in St. Louis — specifically targets auto accident victims and PI cases. PI-focused chiro is a high-value niche (insurance pays). No automated intake for post-accident patients or attorney referral program. Pitch: automated post-accident intake + attorney referral system = strong B2B angle with PI attorneys.',
      },
    ],
  },

  {
    label: '🏡 Real Estate — Baltimore / DC Suburbs Luxury',
    dbId: DB.realEstate,
    prospects: [
      {
        name: 'Monument Sotheby\'s International Realty',
        owner: '',
        location: 'Baltimore, MD',
        phone: '(410) 525-5435',
        website: 'https://www.monumentsothebysrealty.com',
        hasWebsite: 'Yes', wqs: 7, opp: 7,
        notes: 'Maryland\'s premier luxury real estate brokerage, affiliated with Sotheby\'s International Realty. Serves Baltimore, Annapolis, Eastern Shore, DC suburbs. Strong global network but no automated local lead nurture or buyer drip at scale. Maryland luxury market is growing as DC-area residents seek more space — automation ROI on even one additional luxury sale is massive.',
      },
      {
        name: 'Ttr Sotheby\'s International Realty',
        owner: '',
        location: 'Washington, DC',
        phone: '(202) 333-1212',
        website: 'https://www.ttrsir.com',
        hasWebsite: 'Yes', wqs: 7, opp: 7,
        notes: 'Washington DC\'s premier luxury brokerage, affiliated with Sotheby\'s. Serves DC, Northern Virginia, and Maryland luxury markets. Strong brand + global reach but no automated buyer qualification or seller lead drip at the local level. DC luxury market median price $800K+ — one additional transaction from automation = $25,000–$50,000 commission.',
      },
      {
        name: 'Washington Fine Properties',
        owner: '',
        location: 'Washington, DC',
        phone: '(202) 944-8400',
        website: 'https://www.washingtonfineprop.com',
        hasWebsite: 'Yes', wqs: 7, opp: 7,
        notes: 'Independent DC luxury brokerage specializing in Georgetown, Kalorama, Embassy Row, and Chevy Chase. DC\'s most prestigious independent firm. No automated buyer nurture or seller lead pipeline. Georgetown/Kalorama homes sell for $2M–$10M+ — automation that converts even one additional qualified buyer from their existing traffic = extraordinary ROI.',
      },
    ],
  },
];

async function main() {
  console.log('\n🚀 Batch 12 — Adding more real US businesses to Notion…\n');
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

  console.log(`\n✅ Batch 12 complete! ${grandTotal} new prospects added.\n`);
}

main().catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
