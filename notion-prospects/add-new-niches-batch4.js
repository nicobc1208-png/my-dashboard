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

// New Niches Batch 4: Miami FL + Tampa FL + Orlando FL
const batches = [
  {
    db: 'plumbing',
    prospects: [
      { name: 'Roto-Rooter Plumbing Miami FL', owner: 'Al Gutierrez', location: 'Miami, FL', phone: '(305) 261-7171', website: 'https://www.roto-rooter.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Miami FL large franchise plumbing & drain service — South FL market' },
      { name: 'Clog Kings Plumbing Tampa FL', owner: 'Kevin Sosnowski', location: 'Tampa, FL', phone: '(813) 567-3681', website: 'https://www.clogkings.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Tampa FL residential plumbing company — strong Tampa Bay market' },
      { name: 'Fenix Plumbing Orlando FL', owner: 'Jorge Reyes', location: 'Orlando, FL', phone: '(407) 857-3433', website: 'https://www.fenixplumbing.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Orlando FL plumbing service — large Central FL residential market' },
    ],
  },
  {
    db: 'landscaping',
    prospects: [
      { name: 'Prestige Landscaping Miami FL', owner: 'Ricardo Vasquez', location: 'Miami, FL', phone: '(305) 477-4400', website: 'https://www.prestigelandscapingmiami.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Miami FL commercial & residential landscaping — South FL luxury market' },
      { name: 'Yellowstone Landscaping Tampa FL', owner: 'Chris Hatcher', location: 'Tampa, FL', phone: '(813) 884-3500', website: 'https://www.yellowstonelandscaping.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Tampa FL landscaping & irrigation — Tampa Bay metro market' },
      { name: 'Green Up Landscaping Orlando FL', owner: 'Tony Marquez', location: 'Orlando, FL', phone: '(407) 295-3444', website: 'https://www.greenuplandscaping.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Orlando FL lawn & landscape service — large Central FL market' },
    ],
  },
  {
    db: 'veterinary',
    prospects: [
      { name: 'Coral Gables Animal Hospital Miami FL', owner: 'Dr. Marie Gonzalez', location: 'Miami, FL', phone: '(305) 444-6171', website: 'https://www.coralgablesanimalhospital.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Miami FL veterinary clinic — affluent Coral Gables market' },
      { name: 'Westchase Animal Hospital Tampa FL', owner: 'Dr. Brian Turner', location: 'Tampa, FL', phone: '(813) 920-5550', website: 'https://www.westchaseanimalhospital.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Tampa FL veterinary clinic — Westchase affluent suburb' },
      { name: 'Dr. Phillips Animal Hospital Orlando FL', owner: 'Dr. Susan Park', location: 'Orlando, FL', phone: '(407) 352-2579', website: 'https://www.drphillipsanimalhospital.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Orlando FL veterinary clinic — affluent Dr. Phillips area' },
    ],
  },
  {
    db: 'kitchenBath',
    prospects: [
      { name: 'Miami Kitchen & Bath Design FL', owner: 'Carlos Estrada', location: 'Miami, FL', phone: '(305) 267-8585', website: 'https://www.miamikitchenandbath.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Miami FL kitchen & bath remodeling — luxury South FL renovation market' },
      { name: 'Tampa Bay Kitchen & Bath FL', owner: 'Lisa Crawford', location: 'Tampa, FL', phone: '(813) 879-6900', website: 'https://www.tampabaykitchenandbath.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Tampa FL kitchen & bath remodeling — large Tampa Bay metro market' },
      { name: 'Orlando Kitchen & Bath Remodeling FL', owner: 'Paul Morgan', location: 'Orlando, FL', phone: '(407) 855-1800', website: 'https://www.orlandokitchenandbath.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Orlando FL kitchen & bath — large Central FL home improvement market' },
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
  console.log(`\n✅ New Niches Batch 4 complete — ${total} prospects added.`);
})();
