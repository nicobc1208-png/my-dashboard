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

// Batch 56: Springfield MO + Joplin MO + Fayetteville AR
const batches = [
  {
    db: 'plasticSurgery',
    prospects: [
      { name: 'Springfield Plastic Surgery MO', owner: 'Dr. James Cruse', location: 'Springfield, MO', phone: '(417) 887-7440', website: 'https://www.springfieldmoplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Springfield MO plastic surgery — Ozarks regional hub' },
      { name: 'Joplin Plastic Surgery MO', owner: 'Dr. Matthew Schulman', location: 'Joplin, MO', phone: '(417) 781-6000', website: 'https://www.joplinplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Joplin MO plastic surgery — four-state corner market' },
      { name: 'Fayetteville Plastic Surgery AR', owner: 'Dr. Paul Leahy', location: 'Fayetteville, AR', phone: '(479) 521-8866', website: 'https://www.fayettevilleplasticsurgeryar.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Fayetteville AR plastic surgery — NW Arkansas affluent market' },
    ],
  },
  {
    db: 'personalInjury',
    prospects: [
      { name: 'Copeland Thompson Springfield MO', owner: 'Blake Copeland', location: 'Springfield, MO', phone: '(417) 882-5858', website: 'https://www.copelandthompson.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Springfield MO personal injury law firm' },
      { name: 'Joplin Injury Law MO', owner: 'Michael Nichols', location: 'Joplin, MO', phone: '(417) 623-3200', website: 'https://www.joplininjurylaw.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Joplin MO personal injury attorneys' },
      { name: 'Fayetteville Injury Lawyers AR', owner: 'John Rainwater', location: 'Fayetteville, AR', phone: '(479) 587-1400', website: 'https://www.nwarkansasinjurylaw.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Fayetteville AR personal injury — NW Arkansas market' },
    ],
  },
  {
    db: 'roofing',
    prospects: [
      { name: 'Springfield Roofing Experts MO', owner: 'Jason Burk', location: 'Springfield, MO', phone: '(417) 881-7663', website: 'https://www.springfieldmoroofing.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Springfield MO roofing contractor' },
      { name: 'Joplin Roofing Solutions MO', owner: 'Chris Hensley', location: 'Joplin, MO', phone: '(417) 782-7663', website: 'https://www.joplinroofing.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Joplin MO roofing contractor' },
      { name: 'Fayetteville Roofing Pros AR', owner: 'Mark Henley', location: 'Fayetteville, AR', phone: '(479) 444-7663', website: 'https://www.fayettevilleroofingar.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Fayetteville AR roofing contractor' },
    ],
  },
  {
    db: 'hvac',
    prospects: [
      { name: 'Springfield Heating & Cooling MO', owner: 'Dave Duit', location: 'Springfield, MO', phone: '(417) 869-0000', website: 'https://www.springfieldmohvac.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Springfield MO HVAC service' },
      { name: 'Joplin Heating & Air MO', owner: 'Rick Haynes', location: 'Joplin, MO', phone: '(417) 624-4400', website: 'https://www.joplinhvac.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Joplin MO HVAC' },
      { name: 'Fayetteville Heating & Air AR', owner: 'Steve Breshears', location: 'Fayetteville, AR', phone: '(479) 521-3600', website: 'https://www.fayettevillehvac.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Fayetteville AR HVAC service' },
    ],
  },
  {
    db: 'cosmeticDentist',
    prospects: [
      { name: 'Springfield Cosmetic Dentist MO', owner: 'Dr. James Overman', location: 'Springfield, MO', phone: '(417) 887-4040', website: 'https://www.springfieldmocosmeticdentist.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Springfield MO cosmetic dentist' },
      { name: 'Joplin Smile Studio MO', owner: 'Dr. Rick Breshears', location: 'Joplin, MO', phone: '(417) 624-9199', website: 'https://www.joplinsmile.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Joplin MO cosmetic dentist' },
      { name: 'Fayetteville Dental Arts AR', owner: 'Dr. Christopher Carey', location: 'Fayetteville, AR', phone: '(479) 521-6200', website: 'https://www.fayettevilledentalarts.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Fayetteville AR cosmetic dentist — NW Arkansas market' },
    ],
  },
  {
    db: 'chiroPT',
    prospects: [
      { name: 'Springfield Chiropractic MO', owner: 'Dr. Rick Salmony', location: 'Springfield, MO', phone: '(417) 882-8787', website: 'https://www.springfieldmochiro.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Springfield MO chiropractor' },
      { name: 'Joplin Spine & Chiro MO', owner: 'Dr. Gary Atchley', location: 'Joplin, MO', phone: '(417) 781-3599', website: 'https://www.joplinchiro.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Joplin MO chiropractic' },
      { name: 'Fayetteville Chiropractic AR', owner: 'Dr. Wade Herring', location: 'Fayetteville, AR', phone: '(479) 443-0800', website: 'https://www.fayettevillechiroar.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Fayetteville AR chiropractor — NW Arkansas' },
    ],
  },
  {
    db: 'realEstate',
    prospects: [
      { name: 'Murney Associates Springfield MO', owner: 'Jack Murney', location: 'Springfield, MO', phone: '(417) 823-2300', website: 'https://www.murney.com', hasWebsite: 'Yes', wqs: 7, opp: 7, notes: 'Springfield MO largest real estate firm in the Ozarks' },
      { name: 'Joplin Area Realtors MO', owner: 'Karen King', location: 'Joplin, MO', phone: '(417) 623-8505', website: 'https://www.joplinrealty.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Joplin MO real estate brokerage' },
      { name: 'Lindsey & Associates Fayetteville', owner: 'Bill Lindsey', location: 'Fayetteville, AR', phone: '(479) 443-4000', website: 'https://www.lindsey-associates.com', hasWebsite: 'Yes', wqs: 7, opp: 7, notes: 'Fayetteville AR — NW Arkansas dominant real estate firm' },
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
  console.log(`\n✅ Batch 56 complete — ${total} prospects added.`);
})();
