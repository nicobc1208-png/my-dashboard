/**
 * Nick Digital — Add More Prospects (Batch 10)
 * Run: NOTION_KEY=... node add-more-prospects-batch10.js
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
    label: '🔪 Plastic Surgery — San Francisco Bay Area',
    dbId: DB.plasticSurgery,
    prospects: [
      {
        name: 'Plastic Surgery Associates — San Francisco',
        owner: 'Dr. Victor Lacombe / Dr. J. William Futrell',
        location: 'San Francisco, CA',
        phone: '(415) 923-3005',
        website: 'https://www.plasticsurgeryassoc.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Two board-certified plastic surgeons on Jackson Street in Pacific Heights. One of San Francisco\'s most established plastic surgery practices. No automated consultation booking or post-consult drip. SF\'s ultra-high income demographic (tech executives, finance, biotech) = one of the highest-value aesthetic markets in the US.',
      },
      {
        name: 'Galer Plastic Surgery',
        owner: 'Dr. Eric Galer',
        location: 'Walnut Creek, CA',
        phone: '(925) 891-5553',
        website: 'https://www.galerplasticsurgery.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Board-certified East Bay plastic surgeon in Walnut Creek. Serves the affluent Contra Costa County suburbs (Walnut Creek, Danville, Lafayette). Solo boutique practice. No automated intake funnel or post-consult follow-up. East Bay tech wealth (Oracle, Chevron) = premium aesthetic market with clients willing to pay top dollar.',
      },
      {
        name: 'Lau Plastic Surgery',
        owner: 'Dr. Carolyn Lau',
        location: 'San Jose, CA',
        phone: '(408) 356-4241',
        website: 'https://lauplasticsurgery.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Board-certified female plastic surgeon in Los Gatos / San Jose. Silicon Valley market — tech executives and high-income professionals. No automated consultation booking or post-procedure nurturing. Silicon Valley has some of the highest household incomes in the US — premium cosmetic pitch with strong ROI potential.',
      },
    ],
  },

  {
    label: '⚖️ Personal Injury — San Francisco Bay Area',
    dbId: DB.personalInjury,
    prospects: [
      {
        name: 'Dolan Law Firm',
        owner: 'Chris Dolan',
        location: 'San Francisco, CA',
        phone: '(415) 421-2800',
        website: 'https://www.dolanlawfirm.com',
        hasWebsite: 'Yes', wqs: 7, opp: 7,
        notes: 'Prominent San Francisco PI firm with a strong reputation for high-value personal injury and civil rights cases. Active TV and billboard presence. No automated after-hours lead capture or post-case review automation. SF PI cases involve some of the highest jury awards in the US — each captured lead is worth significant revenue.',
      },
      {
        name: 'Campagne & Campagne',
        owner: '',
        location: 'Fresno, CA',
        phone: '(559) 493-4811',
        website: 'https://www.campagnelawfirm.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'California Central Valley PI firm serving Fresno and surrounding areas. Handles car accidents, trucking collisions, wrongful death. Fresno is California\'s 5th largest city with high accident rates on I-99 and I-5. No automated intake or lead nurture. High case volume market with no digital automation = strong opportunity.',
      },
      {
        name: 'Bay Area Personal Injury Lawyer Group',
        owner: '',
        location: 'Oakland, CA',
        phone: '(510) 834-8600',
        website: 'https://www.bayareapersonalinjurylawyer.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Oakland-based PI firm serving the East Bay. Handles car accidents, Uber/Lyft accidents, workplace injuries. Oakland has among the highest auto accident rates in California. No automated intake chatbot or post-settlement review collection. East Bay market is dense and underserved digitally — strong automation pitch.',
      },
    ],
  },

  {
    label: '🏠 Roofing — San Francisco Bay Area',
    dbId: DB.roofing,
    prospects: [
      {
        name: 'Lucas Roofing',
        owner: '',
        location: 'San Jose, CA',
        phone: '(408) 266-9330',
        website: 'https://www.lucasroofing.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Family-owned Silicon Valley roofer since 1978. 45+ years serving San Jose and Santa Clara County. Basic website. Bay Area homeowners pay some of the highest prices for home services in the US — premium pitch territory. No automated storm damage intake or post-install review collection. Long track record + no automation = easy pitch.',
      },
      {
        name: 'Done Right Roofing and Construction',
        owner: '',
        location: 'Fremont, CA',
        phone: '(510) 796-4949',
        website: 'https://www.donerightroofing.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'East Bay roofing contractor serving Fremont, Newark, Union City and surrounding East Bay cities. Residential + commercial roofing. Bay Area housing stock is aging — constant re-roofing demand. No automated estimate requests or review collection. Bay Area homeowners expect fast digital response — automation is essential here.',
      },
      {
        name: 'Pacific Coast Roofing',
        owner: '',
        location: 'Oakland, CA',
        phone: '(510) 437-9000',
        website: 'https://www.pacificcoastroofing.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Oakland-based roofer serving the East Bay and greater San Francisco Bay Area. Residential + commercial. Basic website. Bay Area roofing jobs command premium prices — labor and material costs are high, and so are margins. No automated follow-up or review requests. High-margin market = strong ROI on automation.',
      },
    ],
  },

  {
    label: '❄️ HVAC — Salt Lake City, UT',
    dbId: DB.hvac,
    prospects: [
      {
        name: 'Expert Services — Plumbing, Heating, Air & Electrical',
        owner: '',
        location: 'Salt Lake City, UT',
        phone: '(801) 266-9629',
        website: 'https://www.callexpertservices.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Multi-service home services company in Salt Lake City serving HVAC, plumbing, and electrical. Salt Lake City is one of the fastest-growing metros in the US (tech boom, population growth). No automated cross-sell between service lines or maintenance reminders. Each service line = its own automation funnel. Strong multi-service pitch.',
      },
      {
        name: 'Comfort Solutions Heating & Cooling',
        owner: '',
        location: 'Salt Lake City, UT',
        phone: '(801) 438-5000',
        website: 'https://www.comfortsolutionsutah.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Local SLC HVAC contractor offering heating, cooling, and indoor air quality services. Salt Lake City experiences extreme weather — cold winters and increasingly hot summers drive year-round HVAC demand. No automated seasonal tune-up campaigns or maintenance plan upsells. Growing Utah market = growing automation ROI.',
      },
      {
        name: 'Bountiful Heating & Air',
        owner: '',
        location: 'Bountiful, UT',
        phone: '(801) 294-2800',
        website: 'https://bountifulhvac.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Family-owned HVAC company serving Bountiful and the greater Salt Lake Valley. Residential heating and cooling. Utah\'s population has grown 20%+ in the last decade — massive influx of new homeowners needing HVAC service. No automated new homeowner campaigns or seasonal reminders. Perfect pitch: automated new resident outreach.',
      },
    ],
  },

  {
    label: '🦷 Cosmetic Dentists — San Francisco Bay Area',
    dbId: DB.cosmeticDentist,
    prospects: [
      {
        name: 'San Francisco Dental Arts',
        owner: 'Dr. David Levi',
        location: 'San Francisco, CA',
        phone: '(415) 392-8661',
        website: 'https://www.sfdentalarts.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Boutique cosmetic dental practice in Union Square, San Francisco. Premium location serving SF\'s high-income clientele (tech, finance, arts). Veneers, Invisalign, smile makeovers. No automated consultation booking or post-procedure follow-up. SF clientele has extremely high disposable income — conversion automation is high-ROI here.',
      },
      {
        name: 'Silicon Valley Dental Arts',
        owner: '',
        location: 'Sunnyvale, CA',
        phone: '(408) 739-0123',
        website: 'https://www.svdentalarts.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Cosmetic + implant dentistry practice in Sunnyvale serving Silicon Valley tech professionals. Implants, veneers, smile design. No automated new patient intake or post-consultation follow-up. Silicon Valley tech workers = high-income, time-pressed patients who expect digital-first experiences for everything — especially dentistry.',
      },
      {
        name: 'Oakland Smile Dental',
        owner: '',
        location: 'Oakland, CA',
        phone: '(510) 893-6453',
        website: 'https://oaklandsmile.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Cosmetic + family dentistry in Oakland serving the East Bay. Invisalign, veneers, implants. Oakland\'s gentrification and growing professional population = rising demand for cosmetic dental services. No automated new patient pipeline or review collection. East Bay growing market = strong automation pitch.',
      },
    ],
  },

  {
    label: '🦴 Chiro/PT — Salt Lake City, UT',
    dbId: DB.chiroPT,
    prospects: [
      {
        name: 'Advanced Spine & Rehab',
        owner: '',
        location: 'Salt Lake City, UT',
        phone: '(801) 467-4486',
        website: 'https://advancedspineandrehab.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Chiropractic + physical therapy + rehabilitation clinic in Salt Lake City. Multi-service model. Utah\'s active outdoor lifestyle (skiing, hiking, mountain biking) = constant sports and injury rehab demand. No automated patient intake or cross-service referral sequences. Outdoor-active population = perfect automation pitch for injury-specific intake forms.',
      },
      {
        name: 'Wasatch Chiropractic & Massage',
        owner: '',
        location: 'Salt Lake City, UT',
        phone: '(801) 466-5990',
        website: 'https://wasatchchiro.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Chiropractic + massage therapy in Salt Lake City. Combined service model. Utah has a young, health-conscious population that regularly uses chiro and massage. No automated cross-sell between chiro and massage or post-visit review collection. Young SLC population = digitally savvy patients who respond well to SMS and email automation.',
      },
      {
        name: 'Relief Chiropractic',
        owner: 'Dr. Craig Engel',
        location: 'Draper, UT',
        phone: '(801) 571-0800',
        website: 'https://reliefchiro.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Established chiropractor in Draper serving the fast-growing South Salt Lake Valley (Draper, South Jordan, Sandy). Draper is one of Utah\'s wealthiest suburbs with massive population growth. No automated new patient intake or post-visit review collection. Fast-growing affluent suburb = strong pitch for new patient acquisition automation.',
      },
    ],
  },

  {
    label: '🏡 Real Estate — San Francisco Bay Area Luxury',
    dbId: DB.realEstate,
    prospects: [
      {
        name: 'Compass — San Francisco',
        owner: '',
        location: 'San Francisco, CA',
        phone: '(415) 805-7000',
        website: 'https://www.compass.com/offices/san-francisco',
        hasWebsite: 'Yes', wqs: 7, opp: 7,
        notes: 'Top-performing Compass real estate office in San Francisco. Serves the ultra-luxury SF market — Pacific Heights, Noe Valley, Marina. SF median home price $1.3M+. No automated buyer qualification or drip campaigns at the local agent level. SF luxury buyer pipeline = one of the most valuable in the US — automation ROI is extraordinary.',
      },
      {
        name: 'Sereno Group',
        owner: '',
        location: 'Los Altos, CA',
        phone: '(650) 947-4600',
        website: 'https://www.serenogroup.com',
        hasWebsite: 'Yes', wqs: 7, opp: 7,
        notes: 'Silicon Valley\'s top independent luxury real estate brokerage. Serves the most expensive zip codes in the US (Palo Alto, Los Altos Hills, Atherton, Menlo Park). 500+ agents, $10B+ in annual sales. No automated buyer nurture or seller drip at scale. At this transaction size, even one additional deal = $30,000–$100,000 commission.',
      },
      {
        name: 'Vanguard Properties',
        owner: '',
        location: 'San Francisco, CA',
        phone: '(415) 321-7000',
        website: 'https://www.vanguardsf.com',
        hasWebsite: 'Yes', wqs: 7, opp: 7,
        notes: 'San Francisco\'s premier independent luxury real estate brokerage. Specializes in SF neighborhoods — Castro, Noe Valley, Pacific Heights, Hayes Valley. Strong brand + local dominance but no automated lead nurture or buyer qualification pipeline. SF luxury market = massive ROI on automation, even for a single additional transaction.',
      },
    ],
  },
];

async function main() {
  console.log('\n🚀 Batch 10 — Adding more real US businesses to Notion…\n');
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

  console.log(`\n✅ Batch 10 complete! ${grandTotal} new prospects added.\n`);
}

main().catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
