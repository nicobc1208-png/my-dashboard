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

// Batch 21: Tulsa OK + Fort Lauderdale FL + Sarasota FL
const batches = [
  {
    db: 'plasticSurgery',
    prospects: [
      { name: 'Utica Park Plastic Surgery', owner: 'Dr. Jeffrey Hartog', location: 'Tulsa, OK', phone: '(918) 481-7200', website: 'https://www.uticaparkplasticsurgery.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Tulsa OK plastic surgery group' },
      { name: 'Aqua Plastic Surgery', owner: 'Dr. Moises Salama', location: 'Fort Lauderdale, FL', phone: '(954) 589-0722', website: 'https://www.aquaplasticsurgery.net', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Fort Lauderdale FL plastic surgery' },
      { name: 'Sarasota Plastic Surgery Center', owner: 'Dr. David Rankin', location: 'Sarasota, FL', phone: '(941) 366-1198', website: 'https://www.sarasotaplasticsurgery.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Sarasota FL plastic surgery' },
    ],
  },
  {
    db: 'personalInjury',
    prospects: [
      { name: 'Edwards & Associates Law Firm', owner: 'John Edwards', location: 'Tulsa, OK', phone: '(918) 492-5000', website: 'https://www.edwardsinjurylaw.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Tulsa OK personal injury' },
      { name: 'Rosen & Ohr P.A.', owner: 'Robert Rosen', location: 'Fort Lauderdale, FL', phone: '(954) 787-9700', website: 'https://www.rosenohr.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Fort Lauderdale personal injury law' },
      { name: 'Shapiro Goldman Babboni Fernandez', owner: 'Michael Babboni', location: 'Sarasota, FL', phone: '(941) 954-7077', website: 'https://www.sgbf.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Sarasota FL personal injury attorneys' },
    ],
  },
  {
    db: 'roofing',
    prospects: [
      { name: 'Tulsa Roofing Company', owner: 'Mike Patterson', location: 'Tulsa, OK', phone: '(918) 641-6797', website: 'https://www.tulsaroofingco.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Tulsa OK roofing contractor' },
      { name: 'Advanced Roofing Inc', owner: 'Paul Genova', location: 'Fort Lauderdale, FL', phone: '(954) 786-6333', website: 'https://www.advancedroofing.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Fort Lauderdale commercial & residential roofing' },
      { name: 'Kingdom Roofing Systems', owner: 'Chris Lingle', location: 'Sarasota, FL', phone: '(941) 417-2200', website: 'https://www.kingdomrooflng.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Sarasota FL roofing' },
    ],
  },
  {
    db: 'hvac',
    prospects: [
      { name: 'Air Comfort Solutions', owner: 'Terry Hall', location: 'Tulsa, OK', phone: '(918) 258-6733', website: 'https://www.aircomfortsolutions.net', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Tulsa OK HVAC company' },
      { name: 'Air Experts Heating & Cooling', owner: 'Rick Thomas', location: 'Fort Lauderdale, FL', phone: '(954) 800-2858', website: 'https://www.airexpertsfl.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Fort Lauderdale FL HVAC' },
      { name: 'Conditioned Air', owner: 'Bill Sutton', location: 'Sarasota, FL', phone: '(239) 514-9500', website: 'https://www.conditionedair.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Sarasota/Naples FL HVAC — large regional company' },
    ],
  },
  {
    db: 'cosmeticDentist',
    prospects: [
      { name: 'Tulsa Center for Cosmetic Dentistry', owner: 'Dr. Ryan Swink', location: 'Tulsa, OK', phone: '(918) 392-1940', website: 'https://www.tulsacosmeticdentist.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Tulsa OK cosmetic dentist' },
      { name: 'Smiles of Distinction', owner: 'Dr. Mitchell Josephs', location: 'Fort Lauderdale, FL', phone: '(954) 493-9191', website: 'https://www.smilesofdistinction.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Fort Lauderdale cosmetic dentistry' },
      { name: 'Sarasota Bay Dental', owner: 'Dr. David McGinnis', location: 'Sarasota, FL', phone: '(941) 922-7527', website: 'https://www.sarasotabaydental.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Sarasota FL cosmetic dental' },
    ],
  },
  {
    db: 'chiroPT',
    prospects: [
      { name: 'Tulsa Spine & Rehab', owner: 'Dr. Brad Randolph', location: 'Tulsa, OK', phone: '(918) 743-3737', website: 'https://www.tulsaspine.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Tulsa OK chiropractic & rehab' },
      { name: 'Fort Lauderdale Spine & Wellness', owner: 'Dr. Robert Fleisher', location: 'Fort Lauderdale, FL', phone: '(954) 563-8884', website: 'https://www.ftlchiro.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Fort Lauderdale FL chiro/PT' },
      { name: 'Sarasota Chiropractic', owner: 'Dr. Michael Horowitz', location: 'Sarasota, FL', phone: '(941) 378-5100', website: 'https://www.sarasotachiropractic.net', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Sarasota FL chiropractic' },
    ],
  },
  {
    db: 'realEstate',
    prospects: [
      { name: 'McGraw Realtors', owner: 'Karl Nilsen', location: 'Tulsa, OK', phone: '(918) 258-7373', website: 'https://www.mcgrawrealtors.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Tulsa OK real estate brokerage' },
      { name: 'Illustrated Properties', owner: 'Michael Hicks', location: 'Fort Lauderdale, FL', phone: '(561) 655-8600', website: 'https://www.ipre.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'South FL luxury real estate' },
      { name: 'Michael Saunders & Company', owner: 'Michael Saunders', location: 'Sarasota, FL', phone: '(941) 951-6660', website: 'https://www.michaelsaunders.com', hasWebsite: 'Yes', wqs: 8, opp: 7, notes: 'Sarasota luxury real estate — established brand' },
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
  console.log(`\n✅ Batch 21 complete — ${total} prospects added.`);
})();
