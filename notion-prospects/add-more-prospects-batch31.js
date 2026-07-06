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

// Batch 31: Trenton NJ + Springfield MA + Worcester MA
const batches = [
  {
    db: 'plasticSurgery',
    prospects: [
      { name: 'Princeton Plastic Surgery', owner: 'Dr. Reza Momeni', location: 'Trenton, NJ', phone: '(609) 921-6010', website: 'https://www.princetonplasticsurgery.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Trenton/Princeton NJ area plastic surgery' },
      { name: 'Springfield Plastic Surgery', owner: 'Dr. William Sullivan', location: 'Springfield, MA', phone: '(413) 782-9500', website: 'https://www.springfieldplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Springfield MA plastic surgery' },
      { name: 'Central Mass Plastic Surgery', owner: 'Dr. Dennis Hurwitz', location: 'Worcester, MA', phone: '(508) 798-9500', website: 'https://www.centralmaPS.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Worcester MA plastic surgery' },
    ],
  },
  {
    db: 'personalInjury',
    prospects: [
      { name: 'Stark & Stark Trenton NJ', owner: 'John Stark', location: 'Trenton, NJ', phone: '(609) 219-7100', website: 'https://www.stark-stark.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Trenton NJ personal injury law — large regional firm' },
      { name: 'Raipher PC Springfield MA', owner: 'Raipher Pellegrino', location: 'Springfield, MA', phone: '(413) 746-4400', website: 'https://www.raipher.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Springfield MA personal injury' },
      { name: 'Powers Law Firm Worcester', owner: 'Brad Davis', location: 'Worcester, MA', phone: '(508) 799-0330', website: 'https://www.powerslawfirmma.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Worcester MA personal injury law' },
    ],
  },
  {
    db: 'roofing',
    prospects: [
      { name: 'New Jersey Roofing Trenton', owner: 'Paul Zito', location: 'Trenton, NJ', phone: '(609) 888-4663', website: 'https://www.njroofingnj.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Trenton NJ roofing contractor' },
      { name: 'Appleseed Roofing Springfield', owner: 'Eric Johnson', location: 'Springfield, MA', phone: '(413) 736-7663', website: 'https://www.appleseedroofing.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Springfield MA roofing' },
      { name: 'Central Mass Roofing Worcester', owner: 'Brian Murray', location: 'Worcester, MA', phone: '(508) 459-7663', website: 'https://www.centralmassoofing.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Worcester MA roofing contractor' },
    ],
  },
  {
    db: 'hvac',
    prospects: [
      { name: 'Service Champions NJ Trenton', owner: 'Kevin Comerford', location: 'Trenton, NJ', phone: '(609) 948-8600', website: 'https://www.servicechampionsnj.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Trenton NJ HVAC' },
      { name: 'Falvey Heating & Cooling Springfield', owner: 'Steve Falvey', location: 'Springfield, MA', phone: '(413) 782-2900', website: 'https://www.falveyheating.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Springfield MA HVAC' },
      { name: 'George T. Plimpton Heating Worcester', owner: 'Tom Plimpton', location: 'Worcester, MA', phone: '(508) 752-2700', website: 'https://www.plipmtonheating.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Worcester MA HVAC' },
    ],
  },
  {
    db: 'cosmeticDentist',
    prospects: [
      { name: 'Dental Arts of Trenton', owner: 'Dr. Paul Yoon', location: 'Trenton, NJ', phone: '(609) 599-1100', website: 'https://www.dentalartstrenton.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Trenton NJ cosmetic dentist' },
      { name: 'Innovative Dental Care Springfield', owner: 'Dr. Michael Garone', location: 'Springfield, MA', phone: '(413) 781-7645', website: 'https://www.innovativedentalcare.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Springfield MA cosmetic dentist' },
      { name: 'Center for Dental Excellence Worcester', owner: 'Dr. Steven Ronis', location: 'Worcester, MA', phone: '(508) 852-5353', website: 'https://www.worcesterdental.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Worcester MA cosmetic dentist' },
    ],
  },
  {
    db: 'chiroPT',
    prospects: [
      { name: 'Integrative Chiropractic Trenton', owner: 'Dr. James Penna', location: 'Trenton, NJ', phone: '(609) 396-4222', website: 'https://www.integrativechironj.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Trenton NJ chiropractor' },
      { name: 'Valley Chiropractic Springfield', owner: 'Dr. William Kester', location: 'Springfield, MA', phone: '(413) 733-4900', website: 'https://www.valleychirospring.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Springfield MA chiropractor' },
      { name: 'Worcester Chiropractic', owner: 'Dr. Steven Schornstein', location: 'Worcester, MA', phone: '(508) 795-9912', website: 'https://www.worcesterchiro.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Worcester MA chiropractor' },
    ],
  },
  {
    db: 'realEstate',
    prospects: [
      { name: 'ERA Central Realty Trenton', owner: 'Michael Mathis', location: 'Trenton, NJ', phone: '(609) 261-1000', website: 'https://www.eracentralnj.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Trenton NJ real estate brokerage' },
      { name: 'Gallagher Real Estate Springfield', owner: 'John Gallagher', location: 'Springfield, MA', phone: '(413) 781-0060', website: 'https://www.gallagherrealestatema.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Springfield MA real estate' },
      { name: 'RE/MAX Advantage Worcester', owner: 'Dana Owens', location: 'Worcester, MA', phone: '(508) 791-9500', website: 'https://www.remaxadvantage.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Worcester MA real estate brokerage' },
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
  console.log(`\n✅ Batch 31 complete — ${total} prospects added.`);
})();
