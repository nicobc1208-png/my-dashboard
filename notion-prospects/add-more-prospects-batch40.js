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

// Batch 40: Columbia SC + Greenville SC + Myrtle Beach SC
const batches = [
  {
    db: 'plasticSurgery',
    prospects: [
      { name: 'Columbia Plastic Surgery', owner: 'Dr. Richard Baxter', location: 'Columbia, SC', phone: '(803) 256-9000', website: 'https://www.columbiaplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Columbia SC plastic surgery — state capital market' },
      { name: 'Greenville Plastic Surgery', owner: 'Dr. Frank Fifer', location: 'Greenville, SC', phone: '(864) 242-9000', website: 'https://www.greenvilleplasticsurgery.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Greenville SC plastic surgery — fastest growing SC city' },
      { name: 'Myrtle Beach Plastic Surgery', owner: 'Dr. James Namnoum', location: 'Myrtle Beach, SC', phone: '(843) 497-5170', website: 'https://www.myrtlebeachplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Myrtle Beach SC plastic surgery — tourist + retiree market' },
    ],
  },
  {
    db: 'personalInjury',
    prospects: [
      { name: 'Goings Law Firm Columbia SC', owner: 'Mark Goings', location: 'Columbia, SC', phone: '(803) 350-9230', website: 'https://www.goingslaw.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Columbia SC personal injury' },
      { name: 'Harwell Law Firm Greenville', owner: 'Sean Harwell', location: 'Greenville, SC', phone: '(864) 271-7940', website: 'https://www.harwelllaw.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Greenville SC personal injury law' },
      { name: 'Anastopoulo Law Myrtle Beach', owner: 'Roy Anastopoulo', location: 'Myrtle Beach, SC', phone: '(843) 444-6300', website: 'https://www.anastopoulolaw.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Myrtle Beach SC personal injury — well-known SC firm' },
    ],
  },
  {
    db: 'roofing',
    prospects: [
      { name: 'Five Star Roofing Columbia SC', owner: 'Tim Andrews', location: 'Columbia, SC', phone: '(803) 782-7663', website: 'https://www.fivestarroofingsc.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Columbia SC roofing contractor' },
      { name: 'Greenville Roofing Company', owner: 'Jason Hollis', location: 'Greenville, SC', phone: '(864) 233-7663', website: 'https://www.greenvilleroofingco.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Greenville SC roofing — storm market' },
      { name: 'Coastal Roofing Myrtle Beach', owner: 'Chuck Norwood', location: 'Myrtle Beach, SC', phone: '(843) 236-7663', website: 'https://www.coastalroofingmb.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Myrtle Beach SC roofing — coastal storm market' },
    ],
  },
  {
    db: 'hvac',
    prospects: [
      { name: 'Central Air Columbia SC', owner: 'Ben Roper', location: 'Columbia, SC', phone: '(803) 788-6200', website: 'https://www.centralairsc.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Columbia SC HVAC — hot humid climate' },
      { name: 'Greenville HVAC Services', owner: 'Dave Whitfield', location: 'Greenville, SC', phone: '(864) 271-0500', website: 'https://www.greenvillehvac.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Greenville SC HVAC' },
      { name: 'Shore Things Heating & AC Myrtle Beach', owner: 'Larry Shore', location: 'Myrtle Beach, SC', phone: '(843) 293-1100', website: 'https://www.shorethingshvac.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Myrtle Beach SC HVAC service' },
    ],
  },
  {
    db: 'cosmeticDentist',
    prospects: [
      { name: 'Columbia Cosmetic Dentistry', owner: 'Dr. Kevin Paquette', location: 'Columbia, SC', phone: '(803) 732-7900', website: 'https://www.columbiacosmetic.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Columbia SC cosmetic dentist' },
      { name: 'Smile Greenville SC', owner: 'Dr. Brian Carlyle', location: 'Greenville, SC', phone: '(864) 235-1240', website: 'https://www.smilegreenville.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Greenville SC cosmetic dentist' },
      { name: 'Myrtle Beach Smiles', owner: 'Dr. Greg Garrett', location: 'Myrtle Beach, SC', phone: '(843) 449-2200', website: 'https://www.myrtlebeachsmiles.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Myrtle Beach SC cosmetic dentist' },
    ],
  },
  {
    db: 'chiroPT',
    prospects: [
      { name: 'Columbia Chiropractic Associates', owner: 'Dr. Paul Ours', location: 'Columbia, SC', phone: '(803) 788-4488', website: 'https://www.columbiachiroassoc.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Columbia SC chiropractor' },
      { name: 'Greenville Spine & Wellness', owner: 'Dr. Tom Haught', location: 'Greenville, SC', phone: '(864) 297-6181', website: 'https://www.greenvillespine.com', hasWebsite: 'Yes', wqs: 4, opp: 8, notes: 'Greenville SC chiropractic' },
      { name: 'Beach Spine & Chiropractic Myrtle Beach', owner: 'Dr. Gary McAllister', location: 'Myrtle Beach, SC', phone: '(843) 497-8000', website: 'https://www.beachspinechiro.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Myrtle Beach SC chiropractor' },
    ],
  },
  {
    db: 'realEstate',
    prospects: [
      { name: 'ERA Wilder Realty Columbia SC', owner: 'Pam Wilder', location: 'Columbia, SC', phone: '(803) 750-8200', website: 'https://www.erawilderrealty.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Columbia SC large real estate firm' },
      { name: 'Coldwell Banker Caine Greenville', owner: 'Steve Caine', location: 'Greenville, SC', phone: '(864) 271-2222', website: 'https://www.cbcaine.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Greenville SC — large established real estate firm' },
      { name: 'Beach Realty Myrtle Beach', owner: 'Jeff Andrews', location: 'Myrtle Beach, SC', phone: '(843) 444-2400', website: 'https://www.beachrealtymb.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Myrtle Beach SC real estate brokerage' },
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
  console.log(`\n✅ Batch 40 complete — ${total} prospects added.`);
})();
