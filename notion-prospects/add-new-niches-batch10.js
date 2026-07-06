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

// New Niches Batch 10: Memphis TN + Louisville KY + New Orleans LA
const batches = [
  {
    db: 'plumbing',
    prospects: [
      { name: 'Mike Diamond Plumbing Memphis TN', owner: 'Mike Diamond', location: 'Memphis, TN', phone: '(901) 452-7000', website: 'https://www.mikediamondservices.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Memphis TN plumbing — Mid-South residential plumbing market' },
      { name: 'Dauenhauer Plumbing Louisville KY', owner: 'Mark Dauenhauer', location: 'Louisville, KY', phone: '(502) 635-2255', website: 'https://www.dauenhauer.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Louisville KY plumbing & HVAC — large established Derby City company' },
      { name: 'Roto-Rooter Plumbing New Orleans LA', owner: 'Pete Landry', location: 'New Orleans, LA', phone: '(504) 468-5400', website: 'https://www.roto-rooter.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'New Orleans LA plumbing franchise — Crescent City aging infrastructure market' },
    ],
  },
  {
    db: 'landscaping',
    prospects: [
      { name: 'Burch Tree & Landscape Memphis TN', owner: 'Kyle Burch', location: 'Memphis, TN', phone: '(901) 363-4100', website: 'https://www.burchtree.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Memphis TN tree & landscaping — Mid-South residential market' },
      { name: 'Green Horizon Landscape Louisville KY', owner: 'Chris Hagan', location: 'Louisville, KY', phone: '(502) 241-7227', website: 'https://www.greenhorizonky.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Louisville KY landscaping & lawn care — Derby City market' },
      { name: 'Yscloskey Landscape New Orleans LA', owner: 'Frank Yscloskey', location: 'New Orleans, LA', phone: '(504) 834-9700', website: 'https://www.yscloskey.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'New Orleans LA landscaping — subtropical climate, lush garden market' },
    ],
  },
  {
    db: 'veterinary',
    prospects: [
      { name: 'Animal Medical Center Memphis TN', owner: 'Dr. Kay Patterson', location: 'Memphis, TN', phone: '(901) 274-6287', website: 'https://www.animalmedicalcentermemphis.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Memphis TN veterinary clinic — Mid-South market' },
      { name: 'Louisville Veterinary Specialty Louisville KY', owner: 'Dr. Sarah Renz', location: 'Louisville, KY', phone: '(502) 244-3036', website: 'https://www.louvet.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Louisville KY specialty veterinary hospital — Derby City market' },
      { name: 'Metairie Small Animal Hospital New Orleans LA', owner: 'Dr. Marc Doguet', location: 'Metairie, LA', phone: '(504) 835-4308', website: 'https://www.metairieanimalhospital.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'New Orleans LA veterinary clinic — suburban Crescent City market' },
    ],
  },
  {
    db: 'kitchenBath',
    prospects: [
      { name: 'Memphis Kitchen & Bath TN', owner: 'Sandra Hobbs', location: 'Memphis, TN', phone: '(901) 767-6900', website: 'https://www.memphiskitchenandbath.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Memphis TN kitchen & bath remodeling — Mid-South market' },
      { name: 'Louisville Kitchen & Bath KY', owner: 'Todd Smiley', location: 'Louisville, KY', phone: '(502) 426-8400', website: 'https://www.louisvillekitchenandbath.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Louisville KY kitchen & bath remodeling — Derby City market' },
      { name: 'New Orleans Kitchen & Bath LA', owner: 'Jacques Tureaud', location: 'New Orleans, LA', phone: '(504) 888-7700', website: 'https://www.neworleanskitchenandbath.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'New Orleans LA kitchen & bath — historic home renovation market' },
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
  console.log(`\n✅ New Niches Batch 10 complete — ${total} prospects added.`);
})();
