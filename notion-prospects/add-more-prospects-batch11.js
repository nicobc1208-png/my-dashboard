/**
 * Nick Digital — Add More Prospects (Batch 11)
 * Run: NOTION_KEY=... node add-more-prospects-batch11.js
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
    label: '🔪 Plastic Surgery — Philadelphia, PA',
    dbId: DB.plasticSurgery,
    prospects: [
      {
        name: 'Claytor Noone Plastic Surgery',
        owner: 'Dr. R. Brannon Claytor / Dr. Brian Noone',
        location: 'Bryn Mawr, PA',
        phone: '(610) 527-4833',
        website: 'https://www.claytornoone.com',
        hasWebsite: 'Yes', wqs: 7, opp: 7,
        notes: 'Two board-certified plastic surgeons on the Philadelphia Main Line (Bryn Mawr). One of the most prestigious practice locations in the region — serving Radnor, Villanova, Wayne, Paoli. Good website but no automated consultation funnel or post-consult drip. Main Line Philadelphia is among the wealthiest suburbs in the US — premium pitch territory.',
      },
      {
        name: 'Penn Plastic Surgery',
        owner: '',
        location: 'Philadelphia, PA',
        phone: '(215) 662-7920',
        website: 'https://www.pennmedicine.org/for-patients-and-visitors/find-a-program-or-service/plastic-surgery',
        hasWebsite: 'Yes', wqs: 7, opp: 6,
        notes: 'Academic plastic surgery practice at Penn Medicine in Philadelphia. High-volume, high-credibility practice. No automated private-pay consultation funnel or cosmetic procedure drip. Penn\'s patient base skews academic/professional — cosmetic upsell automation for existing patients seeking aesthetics alongside reconstructive care.',
      },
      {
        name: 'Amachi Plastic Surgery',
        owner: 'Dr. Amachi',
        location: 'Philadelphia, PA',
        phone: '(215) 322-5042',
        website: 'https://www.amachiplasticsurgery.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Philadelphia-area plastic surgeon with a boutique independent practice. Comprehensive cosmetic and reconstructive services. Basic website with no automated intake or post-consult follow-up. Independent Philadelphia practices are underserved by digital automation compared to larger markets — strong early-mover advantage for Nick Digital.',
      },
    ],
  },

  {
    label: '⚖️ Personal Injury — Philadelphia',
    dbId: DB.personalInjury,
    prospects: [
      {
        name: 'Ross Feller Casey',
        owner: '',
        location: 'Philadelphia, PA',
        phone: '(215) 567-7333',
        website: 'https://www.rossfellercasey.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Top Philadelphia PI and medical malpractice firm. Nationally recognized for high-value verdicts and settlements. No automated after-hours lead capture or post-settlement review collection. Philadelphia PI market produces some of the largest verdicts in Pennsylvania — automated intake chatbot converts leads while the team sleeps.',
      },
      {
        name: 'Soloff & Zervanos',
        owner: '',
        location: 'Philadelphia, PA',
        phone: '(215) 732-2260',
        website: 'https://www.szinjurylaw.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Philadelphia personal injury firm with decades of experience. Handles car accidents, slip & falls, medical malpractice. Strong reputation but no automated lead capture or post-case nurture. Philadelphia has a large blue-collar workforce with high accident rates — automated intake that works 24/7 is essential for high case volume.',
      },
      {
        name: 'Freeburn Hamilton & Siegel',
        owner: '',
        location: 'Philadelphia, PA',
        phone: '(215) 764-5297',
        website: 'https://www.freeburnhamilton.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Philadelphia and Pennsylvania PI firm with broad practice areas — car accidents, workplace injuries, medical malpractice. Basic website. No automated client intake or case status communication. Pitch: automated intake + case status SMS updates dramatically reduce inbound client calls, freeing up attorney time while improving client satisfaction.',
      },
    ],
  },

  {
    label: '🏠 Roofing — Philadelphia Metro',
    dbId: DB.roofing,
    prospects: [
      {
        name: 'Feher Roofing',
        owner: '',
        location: 'Wyomissing, PA',
        phone: '(610) 375-8130',
        website: 'https://www.feherroofing.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Family-owned Pennsylvania roofer since 1929. Nearly 100 years of roofing service in Eastern PA. Berks County + surrounding areas. Extraordinary longevity with minimal digital presence. PA weather — ice, snow, storms — drives consistent demand. Pitch: 95-year reputation + automated storm damage campaigns = premium ROI.',
      },
      {
        name: 'Delaware Valley Roofing & Siding',
        owner: '',
        location: 'Philadelphia, PA',
        phone: '(215) 464-1444',
        website: 'https://www.dvroofing.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Philadelphia-area roofing + siding contractor serving the Delaware Valley. Residential + commercial. Multi-service model without cross-service automation. No automated storm damage intake or post-job review collection. Philadelphia\'s diverse housing stock — rowhouses, colonials, Cape Cods — means constant roofing work year-round.',
      },
      {
        name: 'Advanced Roofing',
        owner: '',
        location: 'Cherry Hill, NJ',
        phone: '(856) 662-0990',
        website: 'https://advroofing.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'South Jersey roofing contractor serving Cherry Hill and surrounding South Jersey communities (just across from Philadelphia). 30+ years in business. NJ homeowners pay premium prices for home services. No automated estimate requests or review generation. South Jersey suburban market = affluent homeowners who expect fast digital response.',
      },
    ],
  },

  {
    label: '❄️ HVAC — Kansas City, MO',
    dbId: DB.hvac,
    prospects: [
      {
        name: 'Overland Park Heating & Cooling',
        owner: '',
        location: 'Overland Park, KS',
        phone: '(913) 210-3768',
        website: 'https://www.opheatingandcooling.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Family-owned HVAC contractor in Overland Park (KC suburban market). Overland Park is the largest city in Kansas — affluent KC suburb with strong home values. KC metro has extreme seasonal swings (humid summers 95°F+, cold winters). No automated seasonal tune-up campaigns or maintenance plan upsells. KC suburb market is underserved.',
      },
      {
        name: 'Priced Right Heating and Cooling',
        owner: '',
        location: 'Kansas City, MO',
        phone: '(816) 888-8599',
        website: 'https://www.pricedrighthvac.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Kansas City HVAC company serving the KC metro on both sides of the state line (MO + KS). Local independent. KC\'s extreme weather — hot humid summers and cold winters — makes HVAC maintenance year-round. No automated maintenance reminders or emergency dispatch confirmation. Local independent = easy automation pitch with clear ROI.',
      },
      {
        name: 'Comfort Control Heating & Cooling',
        owner: '',
        location: 'Kansas City, MO',
        phone: '(816) 461-1861',
        website: 'https://www.comfortcontrolkc.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Independent KC HVAC company. Family-operated, strong reputation. Basic website. Kansas City is a growing metro with strong manufacturing, tech, and healthcare sectors. No automated seasonal campaigns or post-service review collection. KC is underserved by digital agencies targeting HVAC — early-mover advantage for Nick Digital.',
      },
    ],
  },

  {
    label: '🦷 Cosmetic Dentists — Philadelphia',
    dbId: DB.cosmeticDentist,
    prospects: [
      {
        name: 'Main Line Dental Group',
        owner: '',
        location: 'Wayne, PA',
        phone: '(610) 688-5500',
        website: 'https://www.mainlinedentalgroup.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Cosmetic + implant + general dentistry on the Philadelphia Main Line (Wayne, PA). Serving one of the wealthiest demographics in Pennsylvania. No automated new patient intake or post-consultation drip. Main Line clients have disposable income for premium cosmetic dental work — automated smile consultation funnel is a strong pitch.',
      },
      {
        name: 'Center City Dental Arts',
        owner: '',
        location: 'Philadelphia, PA',
        phone: '(215) 568-6222',
        website: 'https://centercitydentalarts.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Cosmetic + general dentistry in Center City Philadelphia. Prime urban location serving professionals, students, and healthcare workers in Philly\'s core. No automated new patient acquisition or follow-up. Philadelphia\'s large professional workforce (law, medicine, finance, education) = strong cosmetic dental market ripe for automation.',
      },
      {
        name: 'Dental Excellence of Newtown',
        owner: 'Dr. Mark Deem',
        location: 'Newtown, PA',
        phone: '(215) 968-8830',
        website: 'https://www.dentalexcellencenewtown.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Cosmetic + reconstructive dental practice in Newtown, Bucks County. Serving affluent Bucks County communities (Newtown, Yardley, New Hope). Implants, veneers, smile makeovers. No automated consultation follow-up or review collection. Bucks County is one of PA\'s wealthiest counties — premium dental clients willing to invest in cosmetics.',
      },
    ],
  },

  {
    label: '🦴 Chiro/PT — Kansas City, MO',
    dbId: DB.chiroPT,
    prospects: [
      {
        name: 'Kansas City Spine & Sport',
        owner: '',
        location: 'Kansas City, MO',
        phone: '(816) 531-2788',
        website: 'https://www.kcspineandsport.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Chiropractic + sports medicine in Kansas City. Sports-focused model targeting KC athletes and active professionals. KC has strong sports culture (Chiefs, Royals) — athletes and weekend warriors constantly need chiro care. No automated injury intake or post-visit follow-up. Sports-specific automation pitch: injury-recovery intake forms + follow-up sequences.',
      },
      {
        name: 'Advanced Physical Medicine of Kansas City',
        owner: '',
        location: 'Kansas City, MO',
        phone: '(816) 459-2273',
        website: 'https://www.apmkc.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Multi-specialty clinic: chiropractic + physical therapy + pain management + massage. KC multi-service model with no cross-service automation. Each discipline = its own patient population that should be cross-referred. Pitch: automated referral sequences between services = significantly more revenue per patient.',
      },
      {
        name: 'Leawood Chiropractic',
        owner: '',
        location: 'Leawood, KS',
        phone: '(913) 498-0200',
        website: 'https://www.leawoodchiropractic.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Chiropractic practice in Leawood, KS — one of the wealthiest Kansas City suburbs (median household income $130K+). Premium KC suburb with affluent professional clientele. No automated new patient intake or review collection. Leawood\'s high-income demographic = willing to pay for premium care + ongoing wellness plans. Strong pitch for maintenance plan upsells.',
      },
    ],
  },

  {
    label: '🏡 Real Estate — Philadelphia Luxury',
    dbId: DB.realEstate,
    prospects: [
      {
        name: 'BHHS Fox & Roach Realtors',
        owner: '',
        location: 'Wayne, PA',
        phone: '(610) 688-8300',
        website: 'https://www.foxroach.com',
        hasWebsite: 'Yes', wqs: 7, opp: 7,
        notes: 'The largest Berkshire Hathaway HomeServices affiliate in the US, headquartered on the Philadelphia Main Line. 5,000+ agents across PA, NJ, DE. Massive agent network with no local automated buyer/seller drip at scale. At this volume, even 1% lift in lead conversion across their agent network = millions in additional GCI.',
      },
      {
        name: 'Elfant Wissahickon Realtors',
        owner: '',
        location: 'Philadelphia, PA',
        phone: '(215) 247-3600',
        website: 'https://www.ewrealtors.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Boutique independent Philadelphia real estate firm serving Chestnut Hill, Mt. Airy, Germantown, and surrounding neighborhoods. Deep community roots. No automated buyer/seller CRM or lead nurturing. Philadelphia\'s diverse neighborhood market (young professionals, families, academics) = strong automation pitch for neighborhood-specific buyer drip campaigns.',
      },
      {
        name: 'Maxwell Realty Company',
        owner: '',
        location: 'Philadelphia, PA',
        phone: '(215) 546-6000',
        website: 'https://www.maxwellrealty.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Boutique luxury Philadelphia real estate firm specializing in Center City, Society Hill, Rittenhouse Square, and Old City. 50+ years in the Philadelphia luxury market. No automated buyer qualification or seller nurture sequences. Center City luxury condo market is growing rapidly — automated buyer pipeline = significant revenue uplift.',
      },
    ],
  },
];

async function main() {
  console.log('\n🚀 Batch 11 — Adding more real US businesses to Notion…\n');
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

  console.log(`\n✅ Batch 11 complete! ${grandTotal} new prospects added.\n`);
}

main().catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
