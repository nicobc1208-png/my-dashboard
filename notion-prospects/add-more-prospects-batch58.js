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
  if (p.location)  props['Location']             = { rich_text: rt(p.location) };
  if (p.phone)     props['Phone']                = { rich_text: rt(p.phone) };
  if (p.website)   props['Website']              = { url: p.website };
  if (p.instagram) props['Instagram']            = { url: p.instagram };
  if (p.wqs)       props['Website Quality Score'] = { number: p.wqs };
  if (p.opp)       props['Opportunity Score']    = { number: p.opp };
  await withRetry(() => notion.pages.create({ parent: { database_id: dbId }, properties: props }), `add: ${p.name}`);
}

const DBS = {
  plasticSurgery: '38d657af-efa9-81da-b04c-d4910b784937',
  personalInjury: '38d657af-efa9-81f3-92d6-d1a72328a513',
  roofing:        '38d657af-efa9-816e-9ba1-d06c5b7b7d70',
  hvac:           '38d657af-efa9-81f8-840f-f41b7774f06e',
  cosmeticDentist:'38d657af-efa9-8130-a9cc-f66d785d4fa0',
  chiroPT:        '38d657af-efa9-8163-aa10-ee5005b0f56c',
  realEstate:     '38d657af-efa9-8101-b4c4-f401f9a61122',
};

// Batch 58: Oklahoma City OK + Edmond OK + Broken Arrow OK
const batches = [
  {
    db: 'plasticSurgery',
    prospects: [
      { name: 'Oklahoma Plastic Surgery OKC OK', owner: 'Dr. Earl Dohan', location: 'Oklahoma City, OK', phone: '(405) 631-8007', website: 'https://www.oklahomaplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Oklahoma City OK plastic surgery — state capital market' },
      { name: 'Edmond Plastic Surgery OK', owner: 'Dr. Keith Wolter', location: 'Edmond, OK', phone: '(405) 359-2100', website: 'https://www.edmondplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Edmond OK plastic surgery — affluent north OKC suburb' },
      { name: 'Broken Arrow Plastic Surgery OK', owner: 'Dr. James Foley', location: 'Broken Arrow, OK', phone: '(918) 258-3400', website: 'https://www.brokenarrowplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Broken Arrow OK plastic surgery — largest Tulsa suburb' },
    ],
  },
  {
    db: 'personalInjury',
    prospects: [
      { name: 'Hasbrook & Hasbrook OKC OK', owner: 'Norman Hasbrook', location: 'Oklahoma City, OK', phone: '(405) 235-1551', website: 'https://www.hasbrooklaw.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Oklahoma City OK personal injury — well-known OKC law firm' },
      { name: 'Parrish DeVaughn Oklahoma City OK', owner: 'Jim Parrish', location: 'Oklahoma City, OK', phone: '(405) 232-1985', website: 'https://www.parrishdevaughn.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'OKC personal injury attorneys — strong regional firm' },
      { name: 'Broken Arrow Injury Law OK', owner: 'Scott Edwards', location: 'Broken Arrow, OK', phone: '(918) 251-3500', website: 'https://www.brokenarrowinjurylaw.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Broken Arrow OK personal injury lawyers — Tulsa metro market' },
    ],
  },
  {
    db: 'roofing',
    prospects: [
      { name: 'Monarch Roofing Oklahoma City OK', owner: 'Brad Nichols', location: 'Oklahoma City, OK', phone: '(405) 604-4455', website: 'https://www.monarchroofingokc.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Oklahoma City OK roofing contractor' },
      { name: 'Standard Roofing OKC OK', owner: 'Rick Massey', location: 'Oklahoma City, OK', phone: '(405) 634-3900', website: 'https://www.standardroofingokc.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'OKC roofing — established commercial & residential contractor' },
      { name: 'Broken Arrow Roofing Pros OK', owner: 'Tim Lawson', location: 'Broken Arrow, OK', phone: '(918) 251-7663', website: 'https://www.brokenarrowroofing.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Broken Arrow OK roofing contractor — Tulsa suburb market' },
    ],
  },
  {
    db: 'hvac',
    prospects: [
      { name: 'Airco Service Oklahoma City OK', owner: 'Tom Airco', location: 'Oklahoma City, OK', phone: '(405) 232-6010', website: 'https://www.aircoservice.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Oklahoma City OK large HVAC company — well-established OKC brand' },
      { name: 'Comfort Systems OKC OK', owner: 'Dale Ferguson', location: 'Oklahoma City, OK', phone: '(405) 748-9898', website: 'https://www.comfortsystemsok.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'OKC HVAC service — residential & commercial' },
      { name: 'Broken Arrow Heating & Air OK', owner: 'Kevin Drake', location: 'Broken Arrow, OK', phone: '(918) 258-5500', website: 'https://www.brokenarrowhvac.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Broken Arrow OK HVAC — Tulsa suburban market' },
    ],
  },
  {
    db: 'cosmeticDentist',
    prospects: [
      { name: 'Advanced Dental Arts Oklahoma City OK', owner: 'Dr. Dean Brandon', location: 'Oklahoma City, OK', phone: '(405) 848-7211', website: 'https://www.advanceddentalokc.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Oklahoma City OK cosmetic dentist' },
      { name: 'Edmond Smile Center OK', owner: 'Dr. Paul Gilmore', location: 'Edmond, OK', phone: '(405) 341-7676', website: 'https://www.edmondsmilecenter.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Edmond OK cosmetic dentist — north OKC affluent suburb' },
      { name: 'Broken Arrow Dental Arts OK', owner: 'Dr. Mark Sims', location: 'Broken Arrow, OK', phone: '(918) 251-5557', website: 'https://www.brokenarrowdental.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Broken Arrow OK cosmetic dentist — large Tulsa suburb' },
    ],
  },
  {
    db: 'chiroPT',
    prospects: [
      { name: 'Oklahoma City Chiropractic OK', owner: 'Dr. David Brock', location: 'Oklahoma City, OK', phone: '(405) 691-6887', website: 'https://www.oklahomacitychiro.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Oklahoma City OK chiropractor' },
      { name: 'Edmond Chiropractic & Wellness OK', owner: 'Dr. Justin Miller', location: 'Edmond, OK', phone: '(405) 341-3333', website: 'https://www.edmondchiropracticwellness.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Edmond OK chiropractor — north OKC suburb' },
      { name: 'Broken Arrow Spine & Chiro OK', owner: 'Dr. Larry Evans', location: 'Broken Arrow, OK', phone: '(918) 251-9898', website: 'https://www.brokenarrowchiro.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Broken Arrow OK chiropractic — Tulsa metro market' },
    ],
  },
  {
    db: 'realEstate',
    prospects: [
      { name: 'Chinowth & Cohen Realtors OKC OK', owner: 'Rick Chinowth', location: 'Oklahoma City, OK', phone: '(405) 748-9000', website: 'https://www.chinowth.com', hasWebsite: 'Yes', wqs: 7, opp: 7, notes: 'Oklahoma City OK — major OKC & Tulsa real estate brokerage' },
      { name: 'Paradigm ORE Oklahoma City OK', owner: 'Chris Batchelor', location: 'Oklahoma City, OK', phone: '(405) 601-1540', website: 'https://www.paradigmore.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'OKC real estate brokerage — growing firm' },
      { name: 'McGraw Realtors Broken Arrow OK', owner: 'Phil McGraw', location: 'Broken Arrow, OK', phone: '(918) 477-7000', website: 'https://www.mcgrawrealtors.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Broken Arrow OK — large Tulsa area real estate firm' },
    ],
  },
];

(async () => {
  let total = 0;
  for (const batch of batches) {
    const dbId = DBS[batch.db];
    console.log(`\n📋 Adding to ${batch.db}…`);
    for (let i = 0; i < batch.prospects.length; i++) {
      const p = batch.prospects[i];
      await addProspect(dbId, p, i + 1);
      console.log(`  ✓ ${p.name} (${p.location})`);
      total++;
      await sleep(300);
    }
    await sleep(400);
  }
  console.log(`\n✅ Batch 58 complete — ${total} prospects added.`);
})();
