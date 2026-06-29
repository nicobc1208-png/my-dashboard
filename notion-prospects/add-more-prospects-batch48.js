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

// Batch 48: Springfield IL + Peoria IL + Rockford IL
const batches = [
  {
    db: 'plasticSurgery',
    prospects: [
      { name: 'Springfield Plastic Surgery Illinois', owner: 'Dr. Edward Brissett', location: 'Springfield, IL', phone: '(217) 793-1000', website: 'https://www.springfieldplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Springfield IL plastic surgery — state capital market' },
      { name: 'Peoria Plastic Surgery', owner: 'Dr. Ronald Caniglia', location: 'Peoria, IL', phone: '(309) 690-3000', website: 'https://www.peoriaplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Peoria IL plastic surgery — central Illinois market' },
      { name: 'Rockford Plastic Surgery', owner: 'Dr. Lawrence LaRossa', location: 'Rockford, IL', phone: '(815) 969-7799', website: 'https://www.rockfordplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Rockford IL plastic surgery' },
    ],
  },
  {
    db: 'personalInjury',
    prospects: [
      { name: 'Phebus Law Firm Springfield IL', owner: 'Kent Phebus', location: 'Springfield, IL', phone: '(217) 523-3003', website: 'https://www.phebuslaw.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Springfield IL personal injury' },
      { name: 'Rousey Law Group Peoria', owner: 'Mike Rousey', location: 'Peoria, IL', phone: '(309) 637-8000', website: 'https://www.rouseylaw.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Peoria IL personal injury law' },
      { name: 'Fisk & Monteleone Rockford', owner: 'Scott Fisk', location: 'Rockford, IL', phone: '(815) 962-0044', website: 'https://www.fiskandmonteleone.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Rockford IL personal injury law' },
    ],
  },
  {
    db: 'roofing',
    prospects: [
      { name: 'Springfield Roofing Company Illinois', owner: 'Dave Hanlon', location: 'Springfield, IL', phone: '(217) 787-7663', website: 'https://www.springfieldilroofing.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Springfield IL roofing contractor' },
      { name: 'Peoria Roofing Experts', owner: 'Joe Masini', location: 'Peoria, IL', phone: '(309) 692-7663', website: 'https://www.peoriaroofing.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Peoria IL roofing contractor' },
      { name: 'Rockford Roofing Solutions', owner: 'Ken Harrison', location: 'Rockford, IL', phone: '(815) 399-7663', website: 'https://www.rockfordroofing.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Rockford IL roofing contractor' },
    ],
  },
  {
    db: 'hvac',
    prospects: [
      { name: 'Heartland Heating & Air Springfield IL', owner: 'Gary Fries', location: 'Springfield, IL', phone: '(217) 679-7700', website: 'https://www.heartlandheatingil.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Springfield IL HVAC service' },
      { name: 'Peoria Heating & Cooling', owner: 'Ron Switzer', location: 'Peoria, IL', phone: '(309) 685-4600', website: 'https://www.peoriaheating.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Peoria IL HVAC' },
      { name: 'Rockford Heating & AC', owner: 'Tim Gustafson', location: 'Rockford, IL', phone: '(815) 877-3700', website: 'https://www.rockfordheating.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Rockford IL HVAC service' },
    ],
  },
  {
    db: 'cosmeticDentist',
    prospects: [
      { name: 'Springfield Cosmetic Dentistry IL', owner: 'Dr. Richard Wille', location: 'Springfield, IL', phone: '(217) 787-7877', website: 'https://www.springfieldilcosmetic.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Springfield IL cosmetic dentist' },
      { name: 'Peoria Smiles Dental', owner: 'Dr. Doug Yoder', location: 'Peoria, IL', phone: '(309) 693-0600', website: 'https://www.peoriasmiles.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Peoria IL cosmetic dentist' },
      { name: 'Rockford Dental Arts', owner: 'Dr. Gregory Maron', location: 'Rockford, IL', phone: '(815) 987-2700', website: 'https://www.rockforddentalarts.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Rockford IL cosmetic dentist' },
    ],
  },
  {
    db: 'chiroPT',
    prospects: [
      { name: 'Springfield Chiropractic IL', owner: 'Dr. Thomas McAuliffe', location: 'Springfield, IL', phone: '(217) 726-1700', website: 'https://www.springfieldilchiro.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Springfield IL chiropractor' },
      { name: 'Peoria Chiropractic Center', owner: 'Dr. Jeff Hughes', location: 'Peoria, IL', phone: '(309) 589-9700', website: 'https://www.peoriachiro.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Peoria IL chiropractic' },
      { name: 'Rockford Chiropractic Wellness', owner: 'Dr. Mark Goolsby', location: 'Rockford, IL', phone: '(815) 229-9090', website: 'https://www.rockfordchiro.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Rockford IL chiropractor' },
    ],
  },
  {
    db: 'realEstate',
    prospects: [
      { name: 'Heartland Realty Springfield IL', owner: 'Jane Garvey', location: 'Springfield, IL', phone: '(217) 787-0000', website: 'https://www.heartlandrealty.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Springfield IL large real estate firm' },
      { name: 'RE/MAX Preferred Peoria', owner: 'Gary Bown', location: 'Peoria, IL', phone: '(309) 692-1700', website: 'https://www.remaxpeoria.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Peoria IL real estate brokerage' },
      { name: 'Dickerson & Nieman Realtors Rockford', owner: 'John Dickerson', location: 'Rockford, IL', phone: '(815) 226-8100', website: 'https://www.dickersonnieman.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Rockford IL large established real estate firm' },
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
  console.log(`\n✅ Batch 48 complete — ${total} prospects added.`);
})();
