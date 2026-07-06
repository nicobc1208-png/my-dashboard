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

// Batch 43: Missoula MT + Bozeman MT + Casper WY
const batches = [
  {
    db: 'plasticSurgery',
    prospects: [
      { name: 'Missoula Plastic Surgery', owner: 'Dr. Timothy Stahl', location: 'Missoula, MT', phone: '(406) 543-3100', website: 'https://www.missoulaplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Missoula MT plastic surgery — university market' },
      { name: 'Bozeman Plastic Surgery', owner: 'Dr. Diane Gibbs', location: 'Bozeman, MT', phone: '(406) 586-7700', website: 'https://www.bozemanplasticsurgery.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Bozeman MT plastic surgery — rapidly growing affluent market' },
      { name: 'Wyoming Plastic Surgery Casper', owner: 'Dr. Gary Lawson', location: 'Casper, WY', phone: '(307) 472-3399', website: 'https://www.wyomingplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Casper WY plastic surgery — largest WY metro' },
    ],
  },
  {
    db: 'personalInjury',
    prospects: [
      { name: 'Hoyt & Blewett Missoula', owner: 'Alex Blewett', location: 'Missoula, MT', phone: '(406) 543-7681', website: 'https://www.montanalawyersatlaw.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Missoula MT personal injury law' },
      { name: 'Bozeman Injury Law', owner: 'Chris Spear', location: 'Bozeman, MT', phone: '(406) 586-4878', website: 'https://www.bozemaninjurylaw.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Bozeman MT personal injury' },
      { name: 'Gage Law Casper', owner: 'Tom Gage', location: 'Casper, WY', phone: '(307) 234-3440', website: 'https://www.gagelaw.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Casper WY personal injury law' },
    ],
  },
  {
    db: 'roofing',
    prospects: [
      { name: 'Missoula Roofing Company', owner: 'Pete Larson', location: 'Missoula, MT', phone: '(406) 549-7663', website: 'https://www.missoulaRoofing.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Missoula MT roofing contractor' },
      { name: 'Bozeman Roofing Experts', owner: 'Ryan Walsh', location: 'Bozeman, MT', phone: '(406) 587-7663', website: 'https://www.bozemanroofing.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Bozeman MT roofing — growing demand' },
      { name: 'Casper Roofing Company', owner: 'Dave Nickerson', location: 'Casper, WY', phone: '(307) 234-7663', website: 'https://www.casperroofing.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Casper WY roofing contractor' },
    ],
  },
  {
    db: 'hvac',
    prospects: [
      { name: 'Missoula Heating & Cooling', owner: 'Bob Connell', location: 'Missoula, MT', phone: '(406) 549-4900', website: 'https://www.missoulaheating.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Missoula MT HVAC service' },
      { name: 'Bozeman Comfort Systems', owner: 'Steve Oropeza', location: 'Bozeman, MT', phone: '(406) 586-8888', website: 'https://www.bozemancomfort.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Bozeman MT HVAC — cold climate' },
      { name: 'Peak Mechanical Casper WY', owner: 'Mark Evans', location: 'Casper, WY', phone: '(307) 237-9500', website: 'https://www.peakmechanicalwy.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Casper WY HVAC — extreme climate' },
    ],
  },
  {
    db: 'cosmeticDentist',
    prospects: [
      { name: 'Missoula Smiles', owner: 'Dr. Alex Brock', location: 'Missoula, MT', phone: '(406) 721-5252', website: 'https://www.missoulasmiles.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Missoula MT cosmetic dentist' },
      { name: 'Bozeman Dental Studio', owner: 'Dr. Steve Olson', location: 'Bozeman, MT', phone: '(406) 587-1700', website: 'https://www.bozemandental.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Bozeman MT cosmetic dentist — affluent growing market' },
      { name: 'Wyoming Cosmetic Dentistry Casper', owner: 'Dr. Michael Slattery', location: 'Casper, WY', phone: '(307) 234-9069', website: 'https://www.wyomingcosmetic.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Casper WY cosmetic dentist' },
    ],
  },
  {
    db: 'chiroPT',
    prospects: [
      { name: 'Missoula Chiropractic Health Center', owner: 'Dr. Aaron Butler', location: 'Missoula, MT', phone: '(406) 542-9090', website: 'https://www.missoulachiro.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Missoula MT chiropractor' },
      { name: 'Bozeman Sports Chiropractic', owner: 'Dr. Jessica Swain', location: 'Bozeman, MT', phone: '(406) 585-1700', website: 'https://www.bozemansportschiro.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Bozeman MT chiropractic — active outdoor market' },
      { name: 'Casper Chiropractic Center', owner: 'Dr. Steve Crain', location: 'Casper, WY', phone: '(307) 234-5200', website: 'https://www.casperchiro.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Casper WY chiropractor' },
    ],
  },
  {
    db: 'realEstate',
    prospects: [
      { name: 'Berkshire Hathaway HomeServices Missoula', owner: 'Sandy Gallik', location: 'Missoula, MT', phone: '(406) 721-3800', website: 'https://www.bhhs-missoula.com', hasWebsite: 'Yes', wqs: 7, opp: 7, notes: 'Missoula MT large real estate firm' },
      { name: 'PureWest Real Estate Bozeman', owner: 'Randy Dix', location: 'Bozeman, MT', phone: '(406) 586-0555', website: 'https://www.purewestmt.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Bozeman MT large established real estate brokerage' },
      { name: 'Coldwell Banker The Property Exchange Casper', owner: 'Kim Altman', location: 'Casper, WY', phone: '(307) 237-3300', website: 'https://www.cbcasper.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Casper WY real estate brokerage' },
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
  console.log(`\n✅ Batch 43 complete — ${total} prospects added.`);
})();
