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
  plumbing:    '7dd02ff6-77a3-4d37-967d-9aa0a771855b',
  landscaping: '81ff2def-931d-4c08-b66e-78ec3942d9ee',
  veterinary:  '8e7703e8-dcc3-43c9-939d-3a8668cd83a9',
  kitchenBath: '2db18c57-b3e5-4099-8c44-8a8d33fdeb10',
};

// New Niches Batch 1: Houston TX + Dallas TX + San Antonio TX
const batches = [
  {
    db: 'plumbing',
    prospects: [
      { name: 'John Moore Services Houston TX', owner: 'John Moore', location: 'Houston, TX', phone: '(713) 730-2525', website: 'https://www.johnmooreservices.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Houston TX established plumbing & home services company — large local brand' },
      { name: 'Bachman Plumbing Dallas TX', owner: 'Larry Bachman', location: 'Dallas, TX', phone: '(214) 388-4849', website: 'https://www.bachmanplumbing.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Dallas TX residential & commercial plumbing service' },
      { name: 'Bill Metzger Plumbing San Antonio TX', owner: 'Bill Metzger', location: 'San Antonio, TX', phone: '(210) 648-1130', website: 'https://www.billmetzger.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'San Antonio TX well-known local plumber — decades in business' },
    ],
  },
  {
    db: 'landscaping',
    prospects: [
      { name: 'Southwest Landscapes Houston TX', owner: 'Carlos Rivera', location: 'Houston, TX', phone: '(713) 461-8090', website: 'https://www.southwestlandscapestx.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Houston TX residential & commercial landscaping — large Houston metro market' },
      { name: 'Greenscapes Dallas TX', owner: 'Brian Wheeler', location: 'Dallas, TX', phone: '(214) 340-1600', website: 'https://www.greenscapesdfw.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Dallas TX landscaping & lawn care — DFW market' },
      { name: 'Hill Country Landscapes San Antonio TX', owner: 'David Reyes', location: 'San Antonio, TX', phone: '(210) 698-3332', website: 'https://www.hillcountrylandscapes.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'San Antonio TX landscaping — Hill Country aesthetic market' },
    ],
  },
  {
    db: 'veterinary',
    prospects: [
      { name: 'Westbury Animal Hospital Houston TX', owner: 'Dr. Linda Cross', location: 'Houston, TX', phone: '(713) 723-3666', website: 'https://www.westburyanimalhospital.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Houston TX established full-service veterinary clinic' },
      { name: 'Park Cities Animal Hospital Dallas TX', owner: 'Dr. Michael Ritter', location: 'Dallas, TX', phone: '(214) 521-3491', website: 'https://www.parkcitiesanimalhospital.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Dallas TX veterinary clinic — affluent Park Cities market' },
      { name: 'Alamo Heights Vet Hospital San Antonio TX', owner: 'Dr. Sandra Garza', location: 'San Antonio, TX', phone: '(210) 824-1177', website: 'https://www.alamoheightsvethospital.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'San Antonio TX veterinary hospital — affluent north side market' },
    ],
  },
  {
    db: 'kitchenBath',
    prospects: [
      { name: 'Houston Kitchen & Bath Design TX', owner: 'Angela Simmons', location: 'Houston, TX', phone: '(713) 629-9400', website: 'https://www.houstonkitchenandbath.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Houston TX kitchen & bath remodeling — large Houston home improvement market' },
      { name: 'Kitchen & Bath Gallery Dallas TX', owner: 'Robert Crane', location: 'Dallas, TX', phone: '(972) 386-8686', website: 'https://www.kitchenbathgallerydfw.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Dallas TX kitchen & bath remodeling showroom — DFW market' },
      { name: 'Classic Designs Kitchen & Bath SA TX', owner: 'Maria Flores', location: 'San Antonio, TX', phone: '(210) 520-5555', website: 'https://www.classicdesignskb.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'San Antonio TX kitchen & bath remodeling — established SA market' },
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
  console.log(`\n✅ New Niches Batch 1 complete — ${total} prospects added.`);
})();
