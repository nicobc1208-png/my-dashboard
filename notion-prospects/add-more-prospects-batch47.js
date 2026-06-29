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

// Batch 47: Fort Wayne IN + South Bend IN + Evansville IN
const batches = [
  {
    db: 'plasticSurgery',
    prospects: [
      { name: 'Fort Wayne Plastic Surgery', owner: 'Dr. John Persing', location: 'Fort Wayne, IN', phone: '(260) 422-4000', website: 'https://www.fortwayneplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Fort Wayne IN plastic surgery' },
      { name: 'South Bend Plastic Surgery', owner: 'Dr. Charles Thorne', location: 'South Bend, IN', phone: '(574) 234-7575', website: 'https://www.southbendplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'South Bend IN plastic surgery — Notre Dame market' },
      { name: 'Evansville Plastic Surgery', owner: 'Dr. Dennis Hurwitz', location: 'Evansville, IN', phone: '(812) 421-0123', website: 'https://www.evansvilleplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Evansville IN plastic surgery — Tri-State market' },
    ],
  },
  {
    db: 'personalInjury',
    prospects: [
      { name: 'Haller & Colvin Fort Wayne', owner: 'Brian Colvin', location: 'Fort Wayne, IN', phone: '(260) 426-0444', website: 'https://www.hallercolvin.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Fort Wayne IN personal injury law' },
      { name: 'Rowe & Hamilton South Bend', owner: 'Dave Rowe', location: 'South Bend, IN', phone: '(574) 234-7900', website: 'https://www.rowehamilton.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'South Bend IN personal injury' },
      { name: 'Barsumian Law Evansville', owner: 'Matthew Barsumian', location: 'Evansville, IN', phone: '(812) 401-4300', website: 'https://www.barsumianlaw.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Evansville IN personal injury law' },
    ],
  },
  {
    db: 'roofing',
    prospects: [
      { name: 'Fort Wayne Roofing Experts', owner: 'Gary Stahl', location: 'Fort Wayne, IN', phone: '(260) 482-7663', website: 'https://www.fortwayneroofinexperts.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Fort Wayne IN roofing contractor' },
      { name: 'South Bend Roofing Company', owner: 'Tom Parell', location: 'South Bend, IN', phone: '(574) 232-7663', website: 'https://www.southbendroofingco.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'South Bend IN roofing contractor' },
      { name: 'Evansville Roofing Solutions', owner: 'Rick Holt', location: 'Evansville, IN', phone: '(812) 479-7663', website: 'https://www.evansvilleroofing.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Evansville IN roofing contractor' },
    ],
  },
  {
    db: 'hvac',
    prospects: [
      { name: 'Superior Air Fort Wayne', owner: 'Jeff Ward', location: 'Fort Wayne, IN', phone: '(260) 482-1700', website: 'https://www.superiorairfw.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Fort Wayne IN HVAC service' },
      { name: 'South Bend HVAC', owner: 'Dan Farris', location: 'South Bend, IN', phone: '(574) 271-6800', website: 'https://www.southbendhvac.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'South Bend IN HVAC — cold climate' },
      { name: 'Evansville Heating & Air', owner: 'Mark Stovall', location: 'Evansville, IN', phone: '(812) 471-3535', website: 'https://www.evansvillehvac.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Evansville IN HVAC service' },
    ],
  },
  {
    db: 'cosmeticDentist',
    prospects: [
      { name: 'Fort Wayne Aesthetic Dentistry', owner: 'Dr. David Renne', location: 'Fort Wayne, IN', phone: '(260) 432-5050', website: 'https://www.fortwaynedentist.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Fort Wayne IN cosmetic dentist' },
      { name: 'South Bend Smiles', owner: 'Dr. Patrick Herber', location: 'South Bend, IN', phone: '(574) 277-5000', website: 'https://www.southbendsmiles.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'South Bend IN cosmetic dentist' },
      { name: 'Evansville Cosmetic Dentistry', owner: 'Dr. Dale Kliethermes', location: 'Evansville, IN', phone: '(812) 479-6000', website: 'https://www.evansvilledentist.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Evansville IN cosmetic dentist' },
    ],
  },
  {
    db: 'chiroPT',
    prospects: [
      { name: 'Fort Wayne Chiropractic Wellness', owner: 'Dr. Andrew Munn', location: 'Fort Wayne, IN', phone: '(260) 436-8911', website: 'https://www.fortwaynechiro.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Fort Wayne IN chiropractor' },
      { name: 'South Bend Chiropractic Center', owner: 'Dr. Scott Mauger', location: 'South Bend, IN', phone: '(574) 272-2222', website: 'https://www.southbendchiro.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'South Bend IN chiropractic' },
      { name: 'Evansville Spine & Chiropractic', owner: 'Dr. Chad Barber', location: 'Evansville, IN', phone: '(812) 473-7000', website: 'https://www.evansvillespinechiro.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Evansville IN chiropractor' },
    ],
  },
  {
    db: 'realEstate',
    prospects: [
      { name: 'Mike Thomas Assoc Fort Wayne', owner: 'Mike Thomas', location: 'Fort Wayne, IN', phone: '(260) 489-9007', website: 'https://www.mikethomas.com', hasWebsite: 'Yes', wqs: 7, opp: 7, notes: 'Fort Wayne IN large established real estate firm' },
      { name: 'RE/MAX 100 South Bend', owner: 'Terry Chupp', location: 'South Bend, IN', phone: '(574) 287-7777', website: 'https://www.remax100southbend.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'South Bend IN real estate brokerage' },
      { name: 'F.C. Tucker Emge Realtors Evansville', owner: 'Bob Emge', location: 'Evansville, IN', phone: '(812) 479-0801', website: 'https://www.tuckermge.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Evansville IN established large real estate firm' },
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
  console.log(`\n✅ Batch 47 complete — ${total} prospects added.`);
})();
