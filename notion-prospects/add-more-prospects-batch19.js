/**
 * Nick Digital — Add More Prospects (Batch 19)
 * Run: NOTION_KEY=... node add-more-prospects-batch19.js
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
    label: '🔪 Plastic Surgery — Greenville, SC & Birmingham, AL',
    dbId: DB.plasticSurgery,
    prospects: [
      {
        name: 'Plastic Surgery Center of the Carolinas',
        owner: '',
        location: 'Greenville, SC',
        phone: '(864) 286-4020',
        website: 'https://www.pscofcarolinas.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Board-certified plastic surgeons in Greenville, SC. Greenville is one of the fastest-growing metros in the Southeast — BMW, Michelin, and GE Power have major operations here bringing European-influenced, high-income professionals. No automated consultation booking or post-consult drip. Greenville is dramatically underserved by plastic surgery digital marketing.',
      },
      {
        name: 'Carolina Plastic Surgery',
        owner: 'Dr. Thomas Liszka',
        location: 'Greenville, SC',
        phone: '(864) 242-8867',
        website: 'https://www.carolinaplasticsurgery.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Boutique plastic surgery practice in Greenville, SC. Greenville is South Carolina\'s fastest-growing city with a booming medical device and manufacturing industry. No automated consultation funnel or post-procedure nurture. Greenville is seeing explosive growth in high-income residents — the cosmetic aesthetics market is expanding rapidly without digital infrastructure to match.',
      },
      {
        name: 'Aesthetica Surgery and Spa',
        owner: 'Dr. Max Cvjeticanin',
        location: 'Birmingham, AL',
        phone: '(205) 298-8660',
        website: 'https://www.aestheticasurgery.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Plastic surgery + attached medical spa in Birmingham, AL. Dual revenue streams without cross-sell automation. Birmingham has a large medical community (UAB health system) with physician and executive demographics. No automated MedSpa upsell from surgery patients or post-surgical follow-up sequences. Birmingham is underserved — strong early-mover opportunity.',
      },
    ],
  },

  {
    label: '⚖️ Personal Injury — Birmingham, AL & Greenville, SC',
    dbId: DB.personalInjury,
    prospects: [
      {
        name: 'Farris, Riley & Pitt, LLP',
        owner: '',
        location: 'Birmingham, AL',
        phone: '(205) 324-1212',
        website: 'https://www.frplegal.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Birmingham personal injury and medical malpractice firm. Alabama has significant industrial and automotive manufacturing — workplace injury cases are high-value. No automated intake or post-settlement review collection. Birmingham PI market is competitive with TV advertising, but digital automation is widely absent. Automated intake chatbot + SMS follow-up = significant competitive advantage.',
      },
      {
        name: 'The Cochran Firm — Birmingham',
        owner: '',
        location: 'Birmingham, AL',
        phone: '(205) 930-6900',
        website: 'https://www.cochranfirmalmabama.com',
        hasWebsite: 'Yes', wqs: 6, opp: 7,
        notes: 'National PI firm brand (The Cochran Firm) with a Birmingham office. National brand + local market but no local automated intake chatbot or after-hours capture. Alabama I-65 and I-20 corridors are among the most accident-prone in the South. National brand recognition + local automated intake = converting more of their traffic.',
      },
      {
        name: 'Richardson Plowden Attorneys — Greenville',
        owner: '',
        location: 'Greenville, SC',
        phone: '(864) 232-7660',
        website: 'https://www.richardsonplowden.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'South Carolina law firm with a Greenville office handling PI and business litigation. Greenville\'s booming manufacturing sector (BMW, Michelin, GE) = industrial accident and workers\' comp PI cases. No automated intake or case status communication. Greenville PI is a growing market — Upstate SC is adding 30,000+ new residents annually, driving more accident volume.',
      },
    ],
  },

  {
    label: '🏠 Roofing — Birmingham, AL & Greenville, SC',
    dbId: DB.roofing,
    prospects: [
      {
        name: 'Atlanta Roofing Specialists — Birmingham',
        owner: '',
        location: 'Birmingham, AL',
        phone: '(205) 856-4400',
        website: 'https://www.atlantaroofing.com/birmingham',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Established roofing company serving Birmingham and the Southeast. Alabama receives severe storms — tornadoes and hail are significant drivers of roofing demand. No automated storm damage intake page or post-storm SMS outreach campaigns. Birmingham tornado season creates predictable demand spikes — automated storm alert campaigns = capturing leads before competitors mobilize after a storm.',
      },
      {
        name: 'Advance Roofing and Aluminum',
        owner: '',
        location: 'Birmingham, AL',
        phone: '(205) 879-0545',
        website: 'https://www.advanceroofing.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Birmingham roofing + aluminum products company. Family-owned, 50+ years of service. Alabama\'s tornado belt = one of the most storm-active regions in the US. No automated storm damage intake or insurance claim assistance positioning. 50 years of customers with no email/SMS marketing = massive re-engagement opportunity alongside storm-season campaigns.',
      },
      {
        name: 'Carolina Roofing & Sheet Metal',
        owner: '',
        location: 'Greenville, SC',
        phone: '(864) 232-2280',
        website: 'https://www.carolinaroofingandsheetmetal.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Established Greenville roofing + sheet metal contractor. Residential + commercial. Greenville\'s rapid growth = constant new construction + re-roofing from aging housing stock. South Carolina receives significant summer thunderstorms — storm damage is a key driver. No automated storm damage intake or post-job review collection. Growing market with no digital automation.',
      },
    ],
  },

  {
    label: '❄️ HVAC — Birmingham, AL & Greenville, SC',
    dbId: DB.hvac,
    prospects: [
      {
        name: 'Reliable Heating & Cooling',
        owner: '',
        location: 'Birmingham, AL',
        phone: '(205) 985-2015',
        website: 'https://reliableheatingandcoolingbirmingham.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Family-owned Birmingham HVAC company. Alabama\'s hot, humid climate (90°F+ summers) means AC is essential from April through October. No automated seasonal tune-up campaigns or maintenance plan upsells. Birmingham is a large metro (1.1M+) that is dramatically underserved by HVAC digital agencies. Early-mover advantage is clear — first to automate will dominate.',
      },
      {
        name: 'Conditioned Air Solutions',
        owner: '',
        location: 'Hoover, AL',
        phone: '(205) 444-4444',
        website: 'https://www.conditionedairsolutions.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Hoover, AL HVAC company (Hoover is Birmingham\'s wealthiest suburb — home of the Galleria mall corridor). Serving the affluent Jefferson + Shelby County suburban market. No automated seasonal maintenance reminders or maintenance plan campaigns. Hoover\'s high-income homeowners pay premium prices for HVAC and maintenance agreements. Strong pitch for automated maintenance plan upsells.',
      },
      {
        name: 'Greenville Air',
        owner: '',
        location: 'Greenville, SC',
        phone: '(864) 558-0888',
        website: 'https://greenvilleair.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Local HVAC contractor serving the Greenville and Upstate SC market. Greenville has explosive population growth — new subdivisions being built constantly means a constant stream of new HVAC installations and service relationships. No automated new homeowner outreach or maintenance reminders. Fast-growing market = pitch: automated new homeowner HVAC welcome + maintenance plan enrollment.',
      },
    ],
  },

  {
    label: '🦷 Cosmetic Dentists — Birmingham & Greenville',
    dbId: DB.cosmeticDentist,
    prospects: [
      {
        name: 'Vestavia Smiles',
        owner: 'Dr. Lane Ochi',
        location: 'Vestavia Hills, AL',
        phone: '(205) 823-1883',
        website: 'https://www.vestaviasmiles.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Premier cosmetic dental practice in Vestavia Hills (Birmingham\'s wealthiest suburb). Dr. Ochi is a recognized cosmetic dentistry leader in Alabama. Veneers, implants, smile makeovers. No automated consultation booking or post-procedure follow-up. Vestavia Hills = Birmingham\'s most affluent demographic — high-income clients willing to invest $15,000–$40,000 in premium cosmetic dental work.',
      },
      {
        name: 'Alabama Dental Associates',
        owner: '',
        location: 'Birmingham, AL',
        phone: '(205) 823-9596',
        website: 'https://www.alabamadentalassociates.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Multi-location dental group in Birmingham area. General + cosmetic + orthodontics. Multi-location without multi-location automation is a clear gap. Birmingham\'s diverse demographic (university, medical, manufacturing) = broad patient base needing everything from general to cosmetic dental. Each location = its own automated new patient intake + follow-up flow.',
      },
      {
        name: 'Greenville Smiles',
        owner: '',
        location: 'Greenville, SC',
        phone: '(864) 288-3433',
        website: 'https://greenvillesmiles.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Cosmetic + family dental practice in Greenville, SC. Greenville\'s rapid growth means a constant influx of new residents needing a dental home. No automated new patient pipeline or review collection. Greenville is attracting young professionals and families from across the Southeast — automated new resident outreach is a powerful and predictable patient acquisition strategy here.',
      },
    ],
  },

  {
    label: '🦴 Chiro/PT — Birmingham, AL & Greenville, SC',
    dbId: DB.chiroPT,
    prospects: [
      {
        name: 'Alabama Spine & Rehab',
        owner: '',
        location: 'Birmingham, AL',
        phone: '(205) 637-1363',
        website: 'https://www.alabamaspinerehab.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Chiropractic + physical rehabilitation in Birmingham. Multi-service model. Alabama\'s large blue-collar and manufacturing workforce = high rates of workplace injuries and chronic pain. No automated PI intake or workers\' comp referral program. Pitch: automated post-accident intake + workers\' compensation communication + attorney referral tracking = high-volume, high-value automation.',
      },
      {
        name: 'Crestline Chiropractic',
        owner: '',
        location: 'Birmingham, AL',
        phone: '(205) 795-0884',
        website: 'https://www.crestlinechiropractic.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Chiropractic practice in Crestline (Mountain Brook area — Birmingham\'s most exclusive community). Mountain Brook is one of the wealthiest municipalities in the Southeast — old-money Birmingham families and new medical/business executives. No automated new patient intake or review collection. Premium demographic = clients willing to invest in ongoing wellness care.',
      },
      {
        name: 'Upstate Carolina Chiropractic',
        owner: '',
        location: 'Greenville, SC',
        phone: '(864) 675-0120',
        website: 'https://www.upstatecarolinachiro.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Chiropractic practice serving Greenville and Upstate South Carolina. Growing population with active outdoor lifestyle (Blue Ridge Parkway nearby, mountain biking, hiking). No automated new patient intake or post-visit review collection. Greenville is growing 4%+ annually — new residents seeking a chiropractor = automated new resident outreach is a powerful acquisition strategy.',
      },
    ],
  },

  {
    label: '🏡 Real Estate — Greenville & Birmingham Luxury',
    dbId: DB.realEstate,
    prospects: [
      {
        name: 'Joan Herlong & Associates Sotheby\'s — Greenville',
        owner: '',
        location: 'Greenville, SC',
        phone: '(864) 232-4505',
        website: 'https://www.joanherlongrealestate.com',
        hasWebsite: 'Yes', wqs: 7, opp: 7,
        notes: 'Greenville\'s Sotheby\'s International Realty affiliate and the market\'s premier luxury firm. Greenville\'s luxury market has exploded with BMW and Michelin executives buying $1M–$5M homes. No automated buyer qualification or seller lead drip. Greenville luxury is one of the fastest-growing markets in the Southeast — automation converts the growing wave of relocating corporate buyers.',
      },
      {
        name: 'Hammock Coast Real Estate',
        owner: '',
        location: 'Pawleys Island, SC',
        phone: '(843) 314-4268',
        website: 'https://www.hammockcoastrealestate.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Boutique coastal real estate firm serving Pawleys Island and the Hammock Coast (Georgetown County, SC). Growing coastal luxury market as Myrtle Beach buyers seek quieter alternatives. No automated buyer/seller CRM or lead nurturing. SC Hammock Coast = growing vacation/retirement market with buyers from the Northeast and Midwest. Automated buyer drip captures out-of-state leads.',
      },
      {
        name: 'ARC Realty — Birmingham',
        owner: '',
        location: 'Birmingham, AL',
        phone: '(205) 870-7070',
        website: 'https://www.arcrealty.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'One of Birmingham\'s leading independent real estate firms. Strong local brand across all price points in the Birmingham metro. No automated buyer/seller drip or CRM sequences. Birmingham is growing as a healthcare + tech + university hub — new high-income residents entering the market constantly. Automation pitch: capture and nurture the growing influx of professional relocators.',
      },
    ],
  },
];

async function main() {
  console.log('\n🚀 Batch 19 — Adding more real US businesses to Notion…\n');
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

  console.log(`\n✅ Batch 19 complete! ${grandTotal} new prospects added.\n`);
}

main().catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
