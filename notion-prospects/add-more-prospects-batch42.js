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

// Batch 42: Sioux Falls SD + Fargo ND + Billings MT
const batches = [
  {
    db: 'plasticSurgery',
    prospects: [
      { name: 'Sioux Falls Plastic Surgery', owner: 'Dr. James Burt', location: 'Sioux Falls, SD', phone: '(605) 334-1000', website: 'https://www.siouxfallsplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Sioux Falls SD plastic surgery — largest SD city' },
      { name: 'Fargo Plastic Surgery Center', owner: 'Dr. Craig Birgfeld', location: 'Fargo, ND', phone: '(701) 235-2300', website: 'https://www.fargoplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Fargo ND plastic surgery' },
      { name: 'Billings Plastic Surgery', owner: 'Dr. Kenneth Mack', location: 'Billings, MT', phone: '(406) 248-7400', website: 'https://www.billingsplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Billings MT plastic surgery — largest MT city' },
    ],
  },
  {
    db: 'personalInjury',
    prospects: [
      { name: 'Turbak Law Office Sioux Falls', owner: 'Gary Turbak', location: 'Sioux Falls, SD', phone: '(605) 336-4537', website: 'https://www.turbaklaw.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Sioux Falls SD personal injury' },
      { name: 'Pringle & Herigstad Fargo', owner: 'Matt Pringle', location: 'Fargo, ND', phone: '(701) 237-6983', website: 'https://www.pringle-herigstad.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Fargo ND personal injury law' },
      { name: 'Crowley Fleck Billings', owner: 'Kevin Brown', location: 'Billings, MT', phone: '(406) 252-3441', website: 'https://www.crowleyfleck.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Billings MT personal injury — large regional law firm' },
    ],
  },
  {
    db: 'roofing',
    prospects: [
      { name: 'Sioux Falls Roofing Company', owner: 'Tom Anderson', location: 'Sioux Falls, SD', phone: '(605) 339-7663', website: 'https://www.siouxfallsroofing.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Sioux Falls SD roofing — hail storm market' },
      { name: 'Fargo Roofing Experts', owner: 'Dave Larson', location: 'Fargo, ND', phone: '(701) 235-7663', website: 'https://www.fargoroofing.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Fargo ND roofing — harsh winter market' },
      { name: 'Billings Roofing Company', owner: 'Mike Stene', location: 'Billings, MT', phone: '(406) 245-7663', website: 'https://www.billingsroofingco.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Billings MT roofing contractor' },
    ],
  },
  {
    db: 'hvac',
    prospects: [
      { name: 'Midcontinent Heating & Cooling Sioux Falls', owner: 'Steve Bjornson', location: 'Sioux Falls, SD', phone: '(605) 336-0300', website: 'https://www.midcontinenthvac.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Sioux Falls SD HVAC — extreme climate' },
      { name: 'Fargo Heating & Air Conditioning', owner: 'Bruce Strand', location: 'Fargo, ND', phone: '(701) 237-7171', website: 'https://www.fargoheating.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Fargo ND HVAC — extreme cold climate' },
      { name: 'Billings Heating & Plumbing', owner: 'Jeff Sievert', location: 'Billings, MT', phone: '(406) 259-0901', website: 'https://www.billingsheating.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Billings MT HVAC' },
    ],
  },
  {
    db: 'cosmeticDentist',
    prospects: [
      { name: 'Sioux Falls Smiles', owner: 'Dr. Randy Zens', location: 'Sioux Falls, SD', phone: '(605) 336-3700', website: 'https://www.siouxfallssmiles.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Sioux Falls SD cosmetic dentist' },
      { name: 'Fargo Cosmetic Dentistry', owner: 'Dr. James Strinden', location: 'Fargo, ND', phone: '(701) 282-9680', website: 'https://www.fargocosmetic.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Fargo ND cosmetic dentist' },
      { name: 'Billings Dental Arts', owner: 'Dr. Mark Johnson', location: 'Billings, MT', phone: '(406) 259-4900', website: 'https://www.billingsdentalarts.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Billings MT cosmetic dentist' },
    ],
  },
  {
    db: 'chiroPT',
    prospects: [
      { name: 'Sioux Falls Chiropractic', owner: 'Dr. Craig Wilson', location: 'Sioux Falls, SD', phone: '(605) 336-5860', website: 'https://www.siouxfallschiro.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Sioux Falls SD chiropractor' },
      { name: 'Fargo Chiropractic Center', owner: 'Dr. Kevin Knutson', location: 'Fargo, ND', phone: '(701) 235-5777', website: 'https://www.fargochiro.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Fargo ND chiropractic' },
      { name: 'Billings Spine & Sport Chiropractic', owner: 'Dr. Paul Christoffersen', location: 'Billings, MT', phone: '(406) 256-8600', website: 'https://www.billingsspinechiro.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Billings MT chiropractor' },
    ],
  },
  {
    db: 'realEstate',
    prospects: [
      { name: 'Keller Williams Sioux Falls', owner: 'Paul Blaalid', location: 'Sioux Falls, SD', phone: '(605) 331-0404', website: 'https://www.kwsiouxfalls.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Sioux Falls SD real estate brokerage' },
      { name: 'Choice Real Estate Fargo', owner: 'Greg Walz', location: 'Fargo, ND', phone: '(701) 232-4800', website: 'https://www.choicerealestatefargo.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Fargo ND real estate' },
      { name: 'ERA Landmark Real Estate Billings', owner: 'Jeff Torgerson', location: 'Billings, MT', phone: '(406) 259-8700', website: 'https://www.eralandmark.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Billings MT large real estate firm' },
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
  console.log(`\n✅ Batch 42 complete — ${total} prospects added.`);
})();
