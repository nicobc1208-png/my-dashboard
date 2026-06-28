/**
 * Nick Digital — Add More Prospects (Batch 7)
 * Run: NOTION_KEY=... node add-more-prospects-batch7.js
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
    label: '🔪 Plastic Surgery — Boston, MA',
    dbId: DB.plasticSurgery,
    prospects: [
      {
        name: 'Taylor & Sullivan Plastic Surgery',
        owner: 'Dr. Helena O. Taylor / Dr. Stephen R. Sullivan',
        location: 'Cambridge, MA',
        phone: '(617) 492-0620',
        website: 'https://www.massplasticsurgeons.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Two board-certified plastic surgeons in Cambridge, MA. Harvard-adjacent market = educated, affluent clientele with high expectations. No automated consultation booking or post-consult follow-up. Boston metro has one of the highest median incomes in the US — premium pitch territory.',
      },
      {
        name: 'Coastal Plastic Surgery',
        owner: 'Dr. Dax Guenther',
        location: 'Hingham, MA',
        phone: '(781) 740-7840',
        website: 'https://www.bostoncoastalplasticsurgery.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Board-certified Boston-area plastic surgeon in the affluent South Shore. Boutique solo practice. Good branding but no automated intake funnel or drip sequence. South Shore Boston is wealthy suburban market — clients expect premium digital experience to match the premium pricing.',
      },
      {
        name: 'Boston Center for Plastic Surgery',
        owner: 'Dr. Leonard Miller',
        location: 'Boston, MA',
        phone: '(617) 357-3500',
        website: 'https://www.bostoncenterforplasticsurgery.com',
        hasWebsite: 'Yes', wqs: 7, opp: 7,
        notes: 'Founded by Leonard Miller, MD, FACS, FRCS — board-certified Boston plastic surgeon with extensive credentials. Premium Newbury Street-area location. Strong reputation but no automated consultation booking or post-procedure nurture. Boston luxury market = clients spending $15,000–$50,000 on procedures need premium follow-up.',
      },
    ],
  },

  {
    label: '⚖️ Personal Injury — Boston',
    dbId: DB.personalInjury,
    prospects: [
      {
        name: 'Breakstone, White & Gluck',
        owner: '',
        location: 'Boston, MA',
        phone: '(800) 379-1244',
        website: 'https://www.bwglaw.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Top 100 Super Lawyers in MA and New England. High-profile firm that relies on reputation over advertising. No automated client intake or post-settlement review collection. Their "no billboards" approach means every lead matters — a branded intake chatbot + follow-up drip would dramatically increase conversion without hurting brand integrity.',
      },
      {
        name: 'Sweeney Merrigan Personal Injury Lawyers',
        owner: '',
        location: 'Boston, MA',
        phone: '(617) 391-9001',
        website: 'https://www.sweeneymerrigan.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Boston PI firm with 100+ years combined attorney experience. 24/7 availability claim but no actual AI intake chatbot on site. Pitch: AI chatbot makes their 24/7 claim real — automatically captures and qualifies new injury leads overnight when their team can\'t answer. Converts their marketing promise into a reality.',
      },
      {
        name: 'DiBella Law',
        owner: '',
        location: 'Boston, MA',
        phone: '(855) 342-3552',
        website: 'https://www.dibellalawoffice.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Boston PI firm with 20+ years serving injured Massachusetts residents. Good local reputation. No automated intake or post-settlement nurture. Massachusetts is a no-fault state with high accident rates near Boston — automated intake that immediately qualifies PI leads is critical for high case volume.',
      },
    ],
  },

  {
    label: '🏠 Roofing — Boston Metro',
    dbId: DB.roofing,
    prospects: [
      {
        name: 'Penshorn Roofing',
        owner: '',
        location: 'Jamaica Plain, MA',
        phone: '(617) 524-4640',
        website: 'https://penshornroofing.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Owner-operated Greater Boston roofer since 1894. Over 130 years of family roofing in New England. Minimal digital presence despite extraordinary longevity. New England winters — ice dams + storm damage — create massive seasonal demand. Pitch: 130-year reputation deserves a modern automated storm damage + maintenance campaign.',
      },
      {
        name: 'Visocchi Roofing',
        owner: '',
        location: 'Waltham, MA',
        phone: '(781) 953-1508',
        website: 'https://visocchiroofing.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Family-owned Boston metro roofer serving Waltham + Greater Boston + Metrowest. Local reputation, basic website. Boston\'s old housing stock = constant roofing needs (slate, flat, copper). No automated estimate requests or post-job review collection. Boston homeowners pay premium prices — auto follow-up is a must.',
      },
      {
        name: 'Greater Boston Roofing',
        owner: '',
        location: 'Boston, MA',
        phone: '(617) 744-9690',
        website: 'https://greaterbostonroofing.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Greater Boston roofing contractor serving the metro area. Residential + commercial. Basic website with no automated storm damage landing pages or review collection. Boston winter storms create emergency roofing demand — automated storm alert campaigns + instant estimate requests would capture high-urgency leads.',
      },
    ],
  },

  {
    label: '❄️ HVAC — Charlotte, NC',
    dbId: DB.hvac,
    prospects: [
      {
        name: 'Acosta Heating, Cooling & Electrical',
        owner: '',
        location: 'Charlotte, NC',
        phone: '(704) 292-6242',
        website: 'https://www.acostainc.com',
        hasWebsite: 'Yes', wqs: 6, opp: 7,
        notes: 'Charlotte\'s trusted HVAC + electrical experts since 1980. Multi-service (HVAC + electrical). 45+ years in business with no automated cross-sell between services. Charlotte is one of the fastest-growing US cities — new construction + population boom = massive HVAC demand. Pitch: separate automated intake for HVAC vs. electrical.',
      },
      {
        name: 'Travis Crawford Heating, Cooling & Plumbing',
        owner: 'Travis Crawford',
        location: 'Charlotte, NC',
        phone: '(704) 999-9174',
        website: 'https://traviscrawfordhvac.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Founder-operated Charlotte HVAC + plumbing company since 2009. Growing local business. HVAC + plumbing combination without automated cross-sell is a huge missed opportunity. Charlotte\'s hot summers (90°F+) + growing population = constant HVAC demand. Pitch: automated seasonal maintenance reminders + emergency dispatch confirmation.',
      },
      {
        name: 'Charlotte Comfort Systems',
        owner: '',
        location: 'Charlotte, NC',
        phone: '(704) 366-1661',
        website: 'https://charlottecomfortsystems.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Local Charlotte HVAC contractor since 1998. 25+ years serving greater Charlotte area. Basic website. Charlotte metro is booming with new residents who need HVAC service. No automated maintenance plan upsells or seasonal tune-up campaigns. Large customer database = immediate revenue with automated re-engagement.',
      },
    ],
  },

  {
    label: '🦷 Cosmetic Dentists — Charlotte',
    dbId: DB.cosmeticDentist,
    prospects: [
      {
        name: 'Uptown Charlotte Smiles',
        owner: 'Dr. Moore / Dr. Phillips',
        location: 'Charlotte, NC',
        phone: '(704) 342-3213',
        website: 'https://www.uptowncharlottesmiles.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Uptown Charlotte cosmetic + implant dentistry. Prime location in Charlotte\'s booming Uptown district — high-income professionals, banking executives, and tech workers. No automated new patient intake or consultation follow-up. Uptown clientele = premium demographics willing to invest in cosmetics.',
      },
      {
        name: 'Charlotte Dental Implant Center',
        owner: 'Dr. Rush Sunar',
        location: 'Charlotte, NC',
        phone: '(704) 375-4252',
        website: 'https://charlottedentalimplantcenter.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Dental implant specialist — Dr. Rush Sunar focuses exclusively on implants (single, All-on-4, full-arch). Niche focus = niche automation pitch: automated pre-consultation implant education sequence + post-consultation follow-up dramatically improves case acceptance rate for $5,000–$30,000 procedures.',
      },
      {
        name: 'Midtown General & Cosmetic Dentistry Charlotte',
        owner: '',
        location: 'Charlotte, NC',
        phone: '(704) 307-4525',
        website: 'https://www.charlottemidtowndentistry.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'General + cosmetic + implant dentistry in Charlotte\'s Midtown area. Growing Charlotte Midtown = young professional demographic with rising disposable income. No automated new patient follow-up or review collection. Charlotte is growing by 100+ people daily — automated new resident outreach is a powerful pitch.',
      },
    ],
  },

  {
    label: '🦴 Chiro/PT — Charlotte',
    dbId: DB.chiroPT,
    prospects: [
      {
        name: 'Charlotte Chiropractic and Rehab',
        owner: '',
        location: 'Charlotte, NC',
        phone: '(704) 543-4307',
        website: 'https://www.charlottechirorehab.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Chiropractic + rehabilitation clinic in Dilworth / South End Charlotte. Trendy Charlotte neighborhood with active young professional population. No automated appointment reminders or post-treatment review collection. Charlotte\'s sports culture (Panthers, running clubs, cycling) = constant chiro demand.',
      },
      {
        name: 'Performance Rehab Associates',
        owner: '',
        location: 'Charlotte, NC',
        phone: '(980) 819-8020',
        website: 'https://www.pracharlotte.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Integrative sports + performance rehab + physical therapy + chiropractic — 3 Charlotte locations (South Charlotte, Plaza Midwood, Lake Norman). Multi-location multi-service with no cross-location automation. 3 locations = 3 automated intake funnels + cross-referral campaigns. Strong multi-location automation pitch.',
      },
      {
        name: 'Greenapple Sports & Wellness',
        owner: '',
        location: 'Charlotte, NC',
        phone: '(704) 527-7246',
        website: 'https://www.greenapplesports.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Sports + wellness chiropractic clinic in Charlotte. Targets athletic and sports injury demographics. No automated patient intake or injury recovery follow-up sequences. Charlotte\'s growing sports culture + active lifestyle population = high demand for sports chiro. Automation pitch: injury-specific automated intake forms + recovery check-ins.',
      },
    ],
  },

  {
    label: '🏡 Real Estate — Charlotte Luxury',
    dbId: DB.realEstate,
    prospects: [
      {
        name: 'Cottingham Chalk',
        owner: '',
        location: 'Charlotte, NC',
        phone: '(704) 364-1700',
        website: 'https://www.cottinghamchalk.com',
        hasWebsite: 'Yes', wqs: 7, opp: 7,
        notes: 'Charlotte\'s premier boutique independent real estate firm. 30+ years setting the standard for real estate excellence. Works with prominent families, estates, and bank trustees. Good website but no automated buyer/seller CRM or lead nurturing. Charlotte\'s explosive growth + corporate relocations = massive buyer pipeline that needs automation.',
      },
      {
        name: 'Dickens Mitchener',
        owner: '',
        location: 'Charlotte, NC',
        phone: '(704) 342-1000',
        website: 'https://www.dickensmitchener.com',
        hasWebsite: 'Yes', wqs: 7, opp: 7,
        notes: 'Boutique Charlotte luxury real estate firm with international affiliations and 30+ years of experience. Strong reputation among Charlotte\'s top earners (banking, finance, tech). No automated buyer drip or seller lead nurturing at scale. Charlotte bank HQs (BofA, Truist) = ultra-high-income buyers who expect premium digital follow-up.',
      },
      {
        name: 'Ivester Jackson Christie\'s International Real Estate',
        owner: '',
        location: 'Charlotte, NC',
        phone: '(704) 342-3000',
        website: 'https://www.ivesterjackson.com',
        hasWebsite: 'Yes', wqs: 7, opp: 7,
        notes: 'North Carolina\'s premier luxury brokerage, affiliated with Christie\'s International Real Estate. 30+ years, Southeast\'s leading boutique. Strong brand + global network but no automated buyer qualification or seller lead drip. At Christie\'s volume and price points, automation ROI on even one additional closed deal = massive.',
      },
    ],
  },
];

async function main() {
  console.log('\n🚀 Batch 7 — Adding more real US businesses to Notion…\n');
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

  console.log(`\n✅ Batch 7 complete! ${grandTotal} new prospects added.\n`);
}

main().catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
