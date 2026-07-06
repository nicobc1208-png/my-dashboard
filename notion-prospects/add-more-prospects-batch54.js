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

// Batch 54: Rochester MN + Duluth MN + Lincoln NE
const batches = [
  {
    db: 'plasticSurgery',
    prospects: [
      { name: 'Rochester Plastic Surgery MN', owner: 'Dr. Michael Motley', location: 'Rochester, MN', phone: '(507) 281-8080', website: 'https://www.rochesterplasticsurgery.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Rochester MN plastic surgery — Mayo Clinic market' },
      { name: 'Duluth Plastic Surgery MN', owner: 'Dr. Craig Shons', location: 'Duluth, MN', phone: '(218) 723-8900', website: 'https://www.duluthplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Duluth MN plastic surgery — Lake Superior market' },
      { name: 'Lincoln Plastic Surgery NE', owner: 'Dr. Christopher Goergen', location: 'Lincoln, NE', phone: '(402) 484-6600', website: 'https://www.lincolnplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Lincoln NE plastic surgery — state capital market' },
    ],
  },
  {
    db: 'personalInjury',
    prospects: [
      { name: 'Rochester Injury Law MN', owner: 'Tom Atkinson', location: 'Rochester, MN', phone: '(507) 289-3010', website: 'https://www.rochesterinjurylaw.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Rochester MN personal injury attorneys' },
      { name: 'Duluth Personal Injury MN', owner: 'Daniel Lew', location: 'Duluth, MN', phone: '(218) 722-5153', website: 'https://www.duluthinjurylaw.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Duluth MN personal injury law' },
      { name: 'Lincoln Injury Attorneys NE', owner: 'David Domina', location: 'Lincoln, NE', phone: '(402) 493-4100', website: 'https://www.dominalaw.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Lincoln NE personal injury — well-known NE firm' },
    ],
  },
  {
    db: 'roofing',
    prospects: [
      { name: 'Rochester Roofing Experts MN', owner: 'Greg Nelson', location: 'Rochester, MN', phone: '(507) 285-7663', website: 'https://www.rochesterroofing.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Rochester MN roofing contractor' },
      { name: 'Duluth Roofing Company MN', owner: 'Mike Hagen', location: 'Duluth, MN', phone: '(218) 722-7663', website: 'https://www.duluthroofing.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Duluth MN roofing contractor' },
      { name: 'Lincoln Roofing Solutions NE', owner: 'Keith Bauer', location: 'Lincoln, NE', phone: '(402) 476-7663', website: 'https://www.lincolnroofing.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Lincoln NE roofing contractor' },
    ],
  },
  {
    db: 'hvac',
    prospects: [
      { name: 'Rochester Heating & Air MN', owner: 'Bill Zehr', location: 'Rochester, MN', phone: '(507) 288-3800', website: 'https://www.rochesterhvac.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Rochester MN HVAC service' },
      { name: 'Duluth Heating & Cooling MN', owner: 'Brian Larson', location: 'Duluth, MN', phone: '(218) 724-8000', website: 'https://www.duluthhvac.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Duluth MN HVAC — cold climate specialists' },
      { name: 'Lincoln Heating & Air NE', owner: 'Steve Hilgert', location: 'Lincoln, NE', phone: '(402) 435-5000', website: 'https://www.lincolnhvac.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Lincoln NE HVAC service' },
    ],
  },
  {
    db: 'cosmeticDentist',
    prospects: [
      { name: 'Rochester Cosmetic Dentist MN', owner: 'Dr. David Sherwood', location: 'Rochester, MN', phone: '(507) 282-2600', website: 'https://www.rochestersmiles.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Rochester MN cosmetic dentist — Mayo Clinic market' },
      { name: 'Duluth Dental Arts MN', owner: 'Dr. Paul Reitan', location: 'Duluth, MN', phone: '(218) 728-4900', website: 'https://www.duluthdentalarts.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Duluth MN cosmetic dentist' },
      { name: 'Lincoln Smile Studio NE', owner: 'Dr. Mark Tiffany', location: 'Lincoln, NE', phone: '(402) 488-2288', website: 'https://www.lincolnsmilestudio.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Lincoln NE cosmetic dentist' },
    ],
  },
  {
    db: 'chiroPT',
    prospects: [
      { name: 'Rochester Chiropractic Center MN', owner: 'Dr. Paul Jaskoviak', location: 'Rochester, MN', phone: '(507) 285-1677', website: 'https://www.rochesterchiro.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Rochester MN chiropractor — Mayo Clinic market' },
      { name: 'Duluth Spine & Chiropractic MN', owner: 'Dr. Brian Olson', location: 'Duluth, MN', phone: '(218) 722-6888', website: 'https://www.duluthchiro.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Duluth MN chiropractic' },
      { name: 'Lincoln Chiro & Wellness NE', owner: 'Dr. John Witzel', location: 'Lincoln, NE', phone: '(402) 483-4800', website: 'https://www.lincolnchiropractor.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Lincoln NE chiropractor' },
    ],
  },
  {
    db: 'realEstate',
    prospects: [
      { name: 'Edina Realty Rochester MN', owner: 'Bob Peltier', location: 'Rochester, MN', phone: '(507) 285-4000', website: 'https://www.edinarealty.com/rochester', hasWebsite: 'Yes', wqs: 7, opp: 7, notes: 'Rochester MN large regional real estate firm' },
      { name: 'Duluth Realty Group MN', owner: 'Paul Shea', location: 'Duluth, MN', phone: '(218) 728-5000', website: 'https://www.duluthrealty.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Duluth MN real estate brokerage' },
      { name: 'Woods Bros Realty Lincoln NE', owner: 'Jeff Reeves', location: 'Lincoln, NE', phone: '(402) 434-3500', website: 'https://www.woodsbros.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Lincoln NE established large real estate firm' },
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
  console.log(`\n✅ Batch 54 complete — ${total} prospects added.`);
})();
