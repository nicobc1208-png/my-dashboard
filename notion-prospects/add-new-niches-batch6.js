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

// New Niches Batch 6: Portland OR + Seattle WA + Salt Lake City UT
const batches = [
  {
    db: 'plumbing',
    prospects: [
      { name: 'Roto-Rooter Plumbing Portland OR', owner: 'Greg Sullivan', location: 'Portland, OR', phone: '(503) 239-7658', website: 'https://www.roto-rooter.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Portland OR large franchise plumbing & drain service — Pacific NW market' },
      { name: 'Beacon Plumbing Seattle WA', owner: 'Dave Doyle', location: 'Seattle, WA', phone: '(206) 452-1414', website: 'https://www.beaconplumbing.net', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Seattle WA plumbing company — strong Pacific NW market, well-known brand' },
      { name: 'Plumbing Utah Salt Lake City UT', owner: 'Chris Sorensen', location: 'Salt Lake City, UT', phone: '(801) 274-1553', website: 'https://www.plumbingutah.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Salt Lake City UT plumbing service — large growing Utah market' },
    ],
  },
  {
    db: 'landscaping',
    prospects: [
      { name: 'Oregon Landscaping Portland OR', owner: 'Mike Carlson', location: 'Portland, OR', phone: '(503) 644-7301', website: 'https://www.oregonlandscaping.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Portland OR landscaping & design — Pacific NW lush garden market' },
      { name: 'Apex Landscapes Seattle WA', owner: 'Jason Park', location: 'Seattle, WA', phone: '(206) 767-4900', website: 'https://www.apexlandscapes.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Seattle WA landscaping & maintenance — affluent Pacific NW market' },
      { name: 'Utah Green Landscaping Salt Lake City UT', owner: 'Ryan Christensen', location: 'Salt Lake City, UT', phone: '(801) 467-1234', website: 'https://www.utahgreenlandscaping.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Salt Lake City UT landscaping & irrigation — fast-growing Utah market' },
    ],
  },
  {
    db: 'veterinary',
    prospects: [
      { name: 'VCA Cascade Park Animal Hospital Portland OR', owner: 'Dr. Michelle Reid', location: 'Portland, OR', phone: '(503) 669-1671', website: 'https://www.vcahospitals.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Portland OR veterinary clinic — national brand, strong Pacific NW presence' },
      { name: 'Emerald City Emergency Clinic Seattle WA', owner: 'Dr. Steven Torres', location: 'Seattle, WA', phone: '(206) 634-9000', website: 'https://www.emeraldcityemergency.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Seattle WA emergency veterinary clinic — affluent Pacific NW market' },
      { name: 'Cottonwood Animal Hospital Salt Lake City UT', owner: 'Dr. Amy Nelson', location: 'Salt Lake City, UT', phone: '(801) 278-5000', website: 'https://www.cottonwoodanimalhospital.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Salt Lake City UT veterinary clinic — fast-growing Utah market' },
    ],
  },
  {
    db: 'kitchenBath',
    prospects: [
      { name: 'Portland Kitchen & Bath Design OR', owner: 'Sarah Whitfield', location: 'Portland, OR', phone: '(503) 233-5800', website: 'https://www.portlandkitchenandbath.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Portland OR kitchen & bath remodeling — Pacific NW renovation market' },
      { name: 'Seattle Kitchen & Bath Design WA', owner: 'Tom Richards', location: 'Seattle, WA', phone: '(206) 789-3300', website: 'https://www.seattlekitchenandbath.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Seattle WA kitchen & bath remodeling — affluent Pacific NW market' },
      { name: 'Utah Kitchen & Bath Salt Lake City UT', owner: 'Mark Jensen', location: 'Salt Lake City, UT', phone: '(801) 484-7200', website: 'https://www.utahkitchenandbath.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Salt Lake City UT kitchen & bath — fast-growing Utah home improvement market' },
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
  console.log(`\n✅ New Niches Batch 6 complete — ${total} prospects added.`);
})();
