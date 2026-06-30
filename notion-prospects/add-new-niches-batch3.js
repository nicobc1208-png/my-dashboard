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

// New Niches Batch 3: Charlotte NC + Nashville TN + Atlanta GA
const batches = [
  {
    db: 'plumbing',
    prospects: [
      { name: 'Morris-Jenkins Plumbing Charlotte NC', owner: 'Jerry Jenkins', location: 'Charlotte, NC', phone: '(704) 269-1110', website: 'https://www.morrisjenkins.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Charlotte NC largest HVAC & plumbing company — major local brand' },
      { name: 'Lee Company Nashville TN', owner: 'Rick Lee', location: 'Nashville, TN', phone: '(615) 567-1000', website: 'https://www.leecompany.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Nashville TN large home services company — plumbing, HVAC, electrical' },
      { name: 'Atlantis Plumbing Atlanta GA', owner: 'Mark Sodja', location: 'Atlanta, GA', phone: '(770) 443-8229', website: 'https://www.atlantisplumbing.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Atlanta GA residential & commercial plumbing — established local brand' },
    ],
  },
  {
    db: 'landscaping',
    prospects: [
      { name: 'Gibbs Landscape Charlotte NC', owner: 'Mike Gibbs', location: 'Charlotte, NC', phone: '(704) 875-5000', website: 'https://www.gibbslandscape.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Charlotte NC landscaping & lawn care — large CLT metro market' },
      { name: 'Ground Guys Nashville TN', owner: 'Tom Barton', location: 'Nashville, TN', phone: '(615) 332-4800', website: 'https://www.thegroundguys.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Nashville TN landscaping — rapidly growing market' },
      { name: 'Arbor-Nomics Turf Atlanta GA', owner: 'Jeffrey Bormaster', location: 'Atlanta, GA', phone: '(770) 922-8823', website: 'https://www.arbornomics.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Atlanta GA lawn care & pest control — established local brand' },
    ],
  },
  {
    db: 'veterinary',
    prospects: [
      { name: 'Ballantyne Animal Hospital Charlotte NC', owner: 'Dr. Amy Snyder', location: 'Charlotte, NC', phone: '(704) 544-7040', website: 'https://www.ballantyneanimalhospital.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Charlotte NC veterinary clinic — affluent Ballantyne/South Charlotte market' },
      { name: 'Green Hills Veterinary Nashville TN', owner: 'Dr. James Moyer', location: 'Nashville, TN', phone: '(615) 383-1000', website: 'https://www.greenhillsvet.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Nashville TN veterinary clinic — affluent Green Hills neighborhood' },
      { name: 'Buckhead Animal Medical Atlanta GA', owner: 'Dr. Brian Dulaney', location: 'Atlanta, GA', phone: '(404) 261-6166', website: 'https://www.buckheadanimalmedical.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Atlanta GA veterinary clinic — Buckhead ultra-affluent market' },
    ],
  },
  {
    db: 'kitchenBath',
    prospects: [
      { name: 'Charlotte Kitchen & Bath Design NC', owner: 'Debra Simmons', location: 'Charlotte, NC', phone: '(704) 841-0818', website: 'https://www.charlottekitchenandbath.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Charlotte NC kitchen & bath remodeling — large booming CLT market' },
      { name: 'Nashville Kitchen & Bath TN', owner: 'Brett Hoffman', location: 'Nashville, TN', phone: '(615) 333-6400', website: 'https://www.nashvillekitchenandbath.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Nashville TN kitchen & bath remodeling — exploding growth market' },
      { name: 'Atlanta Kitchen & Bath Design GA', owner: 'Lynn Farris', location: 'Atlanta, GA', phone: '(404) 352-2929', website: 'https://www.atlantakitchenandbath.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Atlanta GA kitchen & bath remodeling — large affluent ATL metro' },
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
  console.log(`\n✅ New Niches Batch 3 complete — ${total} prospects added.`);
})();
