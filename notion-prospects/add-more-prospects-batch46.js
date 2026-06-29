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

// Batch 46: Winston-Salem NC + Greensboro NC + Fayetteville NC
const batches = [
  {
    db: 'plasticSurgery',
    prospects: [
      { name: 'Winston-Salem Plastic Surgery', owner: 'Dr. Brian Forley', location: 'Winston-Salem, NC', phone: '(336) 765-8346', website: 'https://www.wsplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Winston-Salem NC plastic surgery — Piedmont Triad' },
      { name: 'Greensboro Plastic Surgery', owner: 'Dr. Tom Hubbard', location: 'Greensboro, NC', phone: '(336) 373-0090', website: 'https://www.greensboroplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Greensboro NC plastic surgery' },
      { name: 'Fayetteville Plastic Surgery', owner: 'Dr. Gregory Schmitt', location: 'Fayetteville, NC', phone: '(910) 323-1234', website: 'https://www.fayettevilleplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Fayetteville NC plastic surgery — military market near Ft. Bragg' },
    ],
  },
  {
    db: 'personalInjury',
    prospects: [
      { name: 'Ward Black Law Winston-Salem', owner: 'Amos Tyndall', location: 'Winston-Salem, NC', phone: '(336) 333-2244', website: 'https://www.wardblacklaw.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Winston-Salem NC personal injury — well-known NC firm' },
      { name: 'Greensboro Injury Law', owner: 'Brad Wehrle', location: 'Greensboro, NC', phone: '(336) 691-2525', website: 'https://www.greensboroinjurylaw.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Greensboro NC personal injury' },
      { name: 'Brent Adams Law Fayetteville', owner: 'Brent Adams', location: 'Fayetteville, NC', phone: '(910) 897-4900', website: 'https://www.brentadamslaw.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Fayetteville NC personal injury' },
    ],
  },
  {
    db: 'roofing',
    prospects: [
      { name: 'Winston-Salem Roofing', owner: 'Chris Snead', location: 'Winston-Salem, NC', phone: '(336) 765-7663', website: 'https://www.winstonroofing.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Winston-Salem NC roofing contractor' },
      { name: 'Greensboro Roofing Company', owner: 'Tommy Cooper', location: 'Greensboro, NC', phone: '(336) 292-7663', website: 'https://www.greensbororoofing.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Greensboro NC roofing contractor' },
      { name: 'Fayetteville Roofing Pros', owner: 'Gary Ward', location: 'Fayetteville, NC', phone: '(910) 484-7663', website: 'https://www.fayettevilleroofing.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Fayetteville NC roofing — large military market' },
    ],
  },
  {
    db: 'hvac',
    prospects: [
      { name: 'Air Treatment Corp Winston-Salem', owner: 'Randy Idol', location: 'Winston-Salem, NC', phone: '(336) 768-2711', website: 'https://www.airtreatmentcorp.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Winston-Salem NC HVAC' },
      { name: 'R-Mech Greensboro', owner: 'Andy Raper', location: 'Greensboro, NC', phone: '(336) 621-7100', website: 'https://www.rmechgreensboro.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Greensboro NC HVAC service' },
      { name: 'Fayetteville Air & Heat', owner: 'Steve Bain', location: 'Fayetteville, NC', phone: '(910) 864-0000', website: 'https://www.fayettevilleairandheat.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Fayetteville NC HVAC' },
    ],
  },
  {
    db: 'cosmeticDentist',
    prospects: [
      { name: 'Winston-Salem Cosmetic Dentistry', owner: 'Dr. Barry Hatcher', location: 'Winston-Salem, NC', phone: '(336) 765-9191', website: 'https://www.wscosmetic.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Winston-Salem NC cosmetic dentist' },
      { name: 'Greensboro Smile Center', owner: 'Dr. Christopher Huff', location: 'Greensboro, NC', phone: '(336) 294-0101', website: 'https://www.greensborosmile.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Greensboro NC cosmetic dentist' },
      { name: 'Fayetteville Family Dentistry', owner: 'Dr. Michael Boudreaux', location: 'Fayetteville, NC', phone: '(910) 485-7781', website: 'https://www.fayettevillefamilydentist.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Fayetteville NC cosmetic dentist' },
    ],
  },
  {
    db: 'chiroPT',
    prospects: [
      { name: 'Winston-Salem Chiropractic', owner: 'Dr. Kevin Kaster', location: 'Winston-Salem, NC', phone: '(336) 768-5000', website: 'https://www.wschiro.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Winston-Salem NC chiropractor' },
      { name: 'Greensboro Spine & Chiropractic', owner: 'Dr. Todd Steelman', location: 'Greensboro, NC', phone: '(336) 299-6100', website: 'https://www.greensborospine.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Greensboro NC chiropractic' },
      { name: 'Fayetteville Chiropractic Center', owner: 'Dr. Angela Cooper', location: 'Fayetteville, NC', phone: '(910) 868-6644', website: 'https://www.fayettevillechiro.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Fayetteville NC chiropractor — large military population' },
    ],
  },
  {
    db: 'realEstate',
    prospects: [
      { name: 'Berkshire Hathaway HomeServices Winston-Salem', owner: 'Pat Riley', location: 'Winston-Salem, NC', phone: '(336) 760-4848', website: 'https://www.bhhsws.com', hasWebsite: 'Yes', wqs: 7, opp: 7, notes: 'Winston-Salem NC large real estate firm' },
      { name: 'Allen Tate Realtors Greensboro', owner: 'Gary Scott', location: 'Greensboro, NC', phone: '(336) 294-2960', website: 'https://www.allentate.com/greensboro', hasWebsite: 'Yes', wqs: 7, opp: 7, notes: 'Greensboro NC — large regional real estate firm' },
      { name: 'Keller Williams Fayetteville', owner: 'Don Faison', location: 'Fayetteville, NC', phone: '(910) 378-6555', website: 'https://www.kwfayetteville.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Fayetteville NC real estate — military relocation market' },
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
  console.log(`\n✅ Batch 46 complete — ${total} prospects added.`);
})();
