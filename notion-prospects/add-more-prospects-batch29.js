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

// Batch 29: Lexington KY + Columbia SC + Jackson MS
const batches = [
  {
    db: 'plasticSurgery',
    prospects: [
      { name: 'Lexington Plastic Surgeons', owner: 'Dr. Brian Rinker', location: 'Lexington, KY', phone: '(859) 263-4558', website: 'https://www.lexingtonplasticsurgeons.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Lexington KY plastic surgery' },
      { name: 'Southeastern Plastic Surgery Columbia', owner: 'Dr. Mark Lowe', location: 'Columbia, SC', phone: '(803) 256-4171', website: 'https://www.southeasternplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Columbia SC plastic surgery' },
      { name: 'Mississippi Plastic Surgeons', owner: 'Dr. James Stallworth', location: 'Jackson, MS', phone: '(601) 362-3636', website: 'https://www.msplasticsurgeons.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Jackson MS plastic surgery' },
    ],
  },
  {
    db: 'personalInjury',
    prospects: [
      { name: 'Minner Vines Moncus Law Lexington', owner: 'Gary Minner', location: 'Lexington, KY', phone: '(859) 550-2900', website: 'https://www.minnervineslaw.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Lexington KY personal injury' },
      { name: 'Strom Law Firm Columbia', owner: 'Pete Strom', location: 'Columbia, SC', phone: '(803) 252-4800', website: 'https://www.stromlaw.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Columbia SC personal injury law' },
      { name: 'McHard Law Firm Jackson', owner: 'John McHard', location: 'Jackson, MS', phone: '(601) 355-3200', website: 'https://www.mchardlaw.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Jackson MS personal injury law' },
    ],
  },
  {
    db: 'roofing',
    prospects: [
      { name: 'Elite Roofing Lexington KY', owner: 'Danny Conley', location: 'Lexington, KY', phone: '(859) 255-1111', website: 'https://www.eliteroofinglexington.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Lexington KY roofing' },
      { name: 'Columbia Roofing Company', owner: 'Joe Herndon', location: 'Columbia, SC', phone: '(803) 765-2500', website: 'https://www.columbiaroofingco.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Columbia SC roofing contractor' },
      { name: 'Jackson Roofing Pros', owner: 'Michael Wayne', location: 'Jackson, MS', phone: '(601) 398-7663', website: 'https://www.jacksonroofingpros.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Jackson MS roofing' },
    ],
  },
  {
    db: 'hvac',
    prospects: [
      { name: 'Gentry Service Group Lexington', owner: 'Jeff Gentry', location: 'Lexington, KY', phone: '(859) 252-2121', website: 'https://www.gentryservicegroup.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Lexington KY HVAC' },
      { name: 'Fulmer Heating & Air Columbia', owner: 'Brad Fulmer', location: 'Columbia, SC', phone: '(803) 783-4010', website: 'https://www.fulmerheatingandair.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Columbia SC HVAC service' },
      { name: 'Southern Air HVAC Jackson', owner: 'Wayne Simmons', location: 'Jackson, MS', phone: '(601) 922-7800', website: 'https://www.southernairhvac.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Jackson MS HVAC' },
    ],
  },
  {
    db: 'cosmeticDentist',
    prospects: [
      { name: 'Beaumont Dental Lexington', owner: 'Dr. Michael Harding', location: 'Lexington, KY', phone: '(859) 276-1110', website: 'https://www.beaumontdental.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Lexington KY cosmetic dentist' },
      { name: 'Smile Columbia SC', owner: 'Dr. James Bonk', location: 'Columbia, SC', phone: '(803) 798-1456', website: 'https://www.smilecolumbiasc.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Columbia SC cosmetic dentistry' },
      { name: 'Jackson Dental Aesthetics', owner: 'Dr. Susan Neely', location: 'Jackson, MS', phone: '(601) 956-9292', website: 'https://www.jacksondentalaesthetics.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Jackson MS cosmetic dentist' },
    ],
  },
  {
    db: 'chiroPT',
    prospects: [
      { name: 'Advanced Chiropractic Lexington', owner: 'Dr. David Moore', location: 'Lexington, KY', phone: '(859) 233-0066', website: 'https://www.advancedchirolexy.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Lexington KY chiropractor' },
      { name: 'Chiropractic Health Center Columbia', owner: 'Dr. Greg Horne', location: 'Columbia, SC', phone: '(803) 799-2273', website: 'https://www.chccolumbia.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Columbia SC chiropractic' },
      { name: 'Lakeland Chiropractic Jackson', owner: 'Dr. Marc Gatlin', location: 'Jackson, MS', phone: '(601) 856-7500', website: 'https://www.lakelandchiro.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Jackson MS chiropractic' },
    ],
  },
  {
    db: 'realEstate',
    prospects: [
      { name: 'Bluegrass Sotheby\'s International Realty', owner: 'Robert Elliott', location: 'Lexington, KY', phone: '(859) 226-6690', website: 'https://www.bluegrasssothebys.com', hasWebsite: 'Yes', wqs: 7, opp: 7, notes: 'Lexington KY luxury real estate' },
      { name: 'ERA Wilder Realty Columbia', owner: 'Robert Wilder', location: 'Columbia, SC', phone: '(803) 750-9355', website: 'https://www.erawilderrealty.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Columbia SC real estate brokerage' },
      { name: 'Nix-Tann & Associates Jackson', owner: 'Will Nix', location: 'Jackson, MS', phone: '(601) 982-8888', website: 'https://www.nixtannrealty.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Jackson MS real estate' },
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
  console.log(`\n✅ Batch 29 complete — ${total} prospects added.`);
})();
