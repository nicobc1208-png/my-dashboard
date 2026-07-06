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

// Batch 67: Birmingham AL + Richmond VA + Raleigh NC
const batches = [
  {
    db: 'plasticSurgery',
    prospects: [
      { name: 'Aesthetic Surgery Center Birmingham AL', owner: 'Dr. Steven Sigal', location: 'Birmingham, AL', phone: '(205) 939-9999', website: 'https://www.aestheticsurgerycenter.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Birmingham AL plastic surgery — Magic City affluent market' },
      { name: 'Richmond Plastic Surgery VA', owner: 'Dr. Neal Handel', location: 'Richmond, VA', phone: '(804) 330-5200', website: 'https://www.richmondplasticsurgery.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Richmond VA plastic surgery — Virginia capital growing market' },
      { name: 'Raleigh Plastic Surgery NC', owner: 'Dr. Michael Law', location: 'Raleigh, NC', phone: '(919) 676-5052', website: 'https://www.raleighplasticsurgery.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Raleigh NC plastic surgery — booming Research Triangle affluent tech market' },
    ],
  },
  {
    db: 'personalInjury',
    prospects: [
      { name: 'Farris Riley & Pitt Birmingham AL', owner: 'Bruce Farris', location: 'Birmingham, AL', phone: '(205) 324-1212', website: 'https://www.frplegal.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Birmingham AL personal injury law — Magic City plaintiff firm' },
      { name: 'Allen & Allen Richmond VA', owner: 'Stuart Allen', location: 'Richmond, VA', phone: '(804) 353-1200', website: 'https://www.allenandallen.com', hasWebsite: 'Yes', wqs: 8, opp: 8, notes: 'Richmond VA personal injury — well-known VA plaintiff firm, heavy TV advertiser' },
      { name: 'Hardison & Cochran Raleigh NC', owner: 'Ben Cochran', location: 'Raleigh, NC', phone: '(919) 985-3206', website: 'https://www.lawyernc.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Raleigh NC personal injury attorneys — Research Triangle large market' },
    ],
  },
  {
    db: 'roofing',
    prospects: [
      { name: 'Thompson Roofing Birmingham AL', owner: 'James Thompson', location: 'Birmingham, AL', phone: '(205) 655-7663', website: 'https://www.thompsonroofing.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Birmingham AL roofing — Southern storm & hail market' },
      { name: 'Paramount Roofing Richmond VA', owner: 'Scott Willard', location: 'Richmond, VA', phone: '(804) 748-7663', website: 'https://www.paramountroofingva.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Richmond VA roofing contractor — growing Virginia market' },
      { name: 'Raleigh Roofing Company NC', owner: 'Tyler Hensley', location: 'Raleigh, NC', phone: '(919) 263-7663', website: 'https://www.raleighroofing.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Raleigh NC roofing — fast-growing Triangle market, major new construction' },
    ],
  },
  {
    db: 'hvac',
    prospects: [
      { name: 'AirNow Cooling & Heating Birmingham AL', owner: 'Greg Stacy', location: 'Birmingham, AL', phone: '(205) 655-3704', website: 'https://www.airnowcooling.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Birmingham AL HVAC — hot humid Alabama summers drive heavy AC demand' },
      { name: 'Woody Hogg & Sons Richmond VA', owner: 'Bill Hogg', location: 'Richmond, VA', phone: '(804) 353-5661', website: 'https://www.woodyhogg.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Richmond VA HVAC — long-established Virginia company' },
      { name: 'AirMasters Raleigh NC', owner: 'Mark Davis', location: 'Raleigh, NC', phone: '(919) 876-8066', website: 'https://www.airmasters.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Raleigh NC HVAC — booming Research Triangle, fast-growing residential market' },
    ],
  },
  {
    db: 'cosmeticDentist',
    prospects: [
      { name: 'Birmingham Cosmetic Dentist AL', owner: 'Dr. David Garlington', location: 'Birmingham, AL', phone: '(205) 969-7929', website: 'https://www.birminghamcosmeticdentist.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Birmingham AL cosmetic dentist — Magic City market' },
      { name: 'Richmond Smile Center VA', owner: 'Dr. Andrew Edney', location: 'Richmond, VA', phone: '(804) 285-7800', website: 'https://www.richmondsmilecenter.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Richmond VA cosmetic dentist — Virginia capital market' },
      { name: 'Raleigh Dental Arts NC', owner: 'Dr. James Schreiner', location: 'Raleigh, NC', phone: '(919) 874-7592', website: 'https://www.raleighdentalarts.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Raleigh NC cosmetic dentist — affluent Research Triangle professional market' },
    ],
  },
  {
    db: 'chiroPT',
    prospects: [
      { name: 'Birmingham Chiropractic AL', owner: 'Dr. Wayne Cagle', location: 'Birmingham, AL', phone: '(205) 871-0871', website: 'https://www.birminghamchiropractor.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Birmingham AL chiropractor — Magic City market' },
      { name: 'Richmond Chiropractic VA', owner: 'Dr. Mark Gallagher', location: 'Richmond, VA', phone: '(804) 379-5800', website: 'https://www.richmondchiropractic.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Richmond VA chiropractic clinic — Virginia capital market' },
      { name: 'Triangle Chiropractic Raleigh NC', owner: 'Dr. Brian Kelley', location: 'Raleigh, NC', phone: '(919) 981-0056', website: 'https://www.trianglechiropractic.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Raleigh NC chiropractor — booming Research Triangle active population' },
    ],
  },
  {
    db: 'realEstate',
    prospects: [
      { name: 'RealtySouth Birmingham AL', owner: 'Dave Wilson', location: 'Birmingham, AL', phone: '(205) 979-0003', website: 'https://www.realtysouth.com', hasWebsite: 'Yes', wqs: 7, opp: 7, notes: 'Birmingham AL real estate — largest Alabama brokerage, dominant Magic City presence' },
      { name: 'Long & Foster Richmond VA', owner: 'Jeff Detwiler', location: 'Richmond, VA', phone: '(804) 288-8888', website: 'https://www.longandfoster.com', hasWebsite: 'Yes', wqs: 7, opp: 7, notes: 'Richmond VA real estate — largest mid-Atlantic brokerage, strong VA market' },
      { name: 'Coldwell Banker Howard Perry Raleigh NC', owner: 'Jack Palmatier', location: 'Raleigh, NC', phone: '(919) 845-6666', website: 'https://www.cbhpt.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Raleigh NC real estate — largest NC Triangle brokerage, booming market' },
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
  console.log(`\n✅ Batch 67 complete — ${total} prospects added.`);
})();
