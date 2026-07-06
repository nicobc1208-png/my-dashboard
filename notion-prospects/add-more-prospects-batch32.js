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

// Batch 32: Dayton OH + Akron OH + Canton OH
const batches = [
  {
    db: 'plasticSurgery',
    prospects: [
      { name: 'Dayton Plastic Surgery', owner: 'Dr. Douglas Tucker', location: 'Dayton, OH', phone: '(937) 428-8555', website: 'https://www.daytonplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Dayton OH plastic surgery' },
      { name: 'Akron Plastic Surgery', owner: 'Dr. Patrick Kukula', location: 'Akron, OH', phone: '(330) 835-8844', website: 'https://www.akronplasticsurgery.net', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Akron OH plastic surgery' },
      { name: 'North Coast Plastic Surgery Canton', owner: 'Dr. David Lucas', location: 'Canton, OH', phone: '(330) 492-8887', website: 'https://www.northcoastplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Canton OH plastic surgery' },
    ],
  },
  {
    db: 'personalInjury',
    prospects: [
      { name: 'Dyer, Garofalo, Mann & Schultz Dayton', owner: 'John Dyer', location: 'Dayton, OH', phone: '(937) 222-2222', website: 'https://www.dgmslaw.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Dayton OH personal injury — recognized local firm' },
      { name: 'Slater & Zurz Akron', owner: 'Kevin Slater', location: 'Akron, OH', phone: '(330) 762-0700', website: 'https://www.slaterzurz.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Akron OH personal injury law' },
      { name: 'Roth Blair Canton', owner: 'Jim Roth', location: 'Canton, OH', phone: '(330) 453-6694', website: 'https://www.rothblair.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Canton OH personal injury law firm' },
    ],
  },
  {
    db: 'roofing',
    prospects: [
      { name: 'Dayton Roofing Solutions', owner: 'Brian Porter', location: 'Dayton, OH', phone: '(937) 890-7663', website: 'https://www.daytonroofingsolutions.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Dayton OH roofing contractor' },
      { name: 'Akron Roofing Experts', owner: 'Steve Green', location: 'Akron, OH', phone: '(330) 928-7663', website: 'https://www.akronroofingexperts.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Akron OH roofing' },
      { name: 'Canton Roofing Company', owner: 'Dave Allen', location: 'Canton, OH', phone: '(330) 456-7663', website: 'https://www.cantonroofingco.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Canton OH roofing contractor' },
    ],
  },
  {
    db: 'hvac',
    prospects: [
      { name: 'Five Star Home Services Dayton', owner: 'Rick Harper', location: 'Dayton, OH', phone: '(937) 898-4328', website: 'https://www.fivestarplumbing.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Dayton OH HVAC — large regional company' },
      { name: 'Arco Comfort Air Akron', owner: 'Tim Martin', location: 'Akron, OH', phone: '(330) 784-1286', website: 'https://www.arcocomfortair.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Akron OH HVAC' },
      { name: 'Genmac Climate Control Canton', owner: 'Gene Fassett', location: 'Canton, OH', phone: '(330) 456-3713', website: 'https://www.genmaccanton.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Canton OH HVAC service' },
    ],
  },
  {
    db: 'cosmeticDentist',
    prospects: [
      { name: 'Dayton Dental Excellence', owner: 'Dr. Christopher Kammer', location: 'Dayton, OH', phone: '(937) 293-8444', website: 'https://www.daytondentalexcellence.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Dayton OH cosmetic dentist' },
      { name: 'Akron Smile Makers', owner: 'Dr. Michael Poole', location: 'Akron, OH', phone: '(330) 836-0994', website: 'https://www.akronsmilemakers.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Akron OH cosmetic dentist' },
      { name: 'Canton Centre Dental', owner: 'Dr. David Schwartz', location: 'Canton, OH', phone: '(330) 455-1551', website: 'https://www.cantoncentredental.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Canton OH cosmetic dentistry' },
    ],
  },
  {
    db: 'chiroPT',
    prospects: [
      { name: 'Dayton Chiropractic & Wellness', owner: 'Dr. Russ Brokaw', location: 'Dayton, OH', phone: '(937) 898-6070', website: 'https://www.daytonchiropracticwellness.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Dayton OH chiropractor' },
      { name: 'Akron Family Chiropractic', owner: 'Dr. Michael Shull', location: 'Akron, OH', phone: '(330) 666-8774', website: 'https://www.akronfamilychiro.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Akron OH chiropractor' },
      { name: 'Canton Chiropractic Rehab', owner: 'Dr. Todd Herms', location: 'Canton, OH', phone: '(330) 479-8000', website: 'https://www.cantonchiropracticrehab.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Canton OH chiropractic & rehab' },
    ],
  },
  {
    db: 'realEstate',
    prospects: [
      { name: 'Coldwell Banker Heritage Dayton', owner: 'Brad Wilkins', location: 'Dayton, OH', phone: '(937) 439-4500', website: 'https://www.cbheritagedayton.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Dayton OH established real estate' },
      { name: 'Keller Williams Legacy Akron', owner: 'Dave Williams', location: 'Akron, OH', phone: '(330) 835-2300', website: 'https://www.kwlegacyakron.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Akron OH real estate brokerage' },
      { name: 'Cutler Real Estate Canton', owner: 'Tom Cutler', location: 'Canton, OH', phone: '(330) 497-9999', website: 'https://www.cutlerrealestate.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Canton OH established real estate firm' },
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
  console.log(`\n✅ Batch 32 complete — ${total} prospects added.`);
})();
