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

// New Niches Batch 11: Birmingham AL + Richmond VA + Raleigh NC
const batches = [
  {
    db: 'plumbing',
    prospects: [
      { name: 'Plumbing & Gas Inc Birmingham AL', owner: 'Randy Poole', location: 'Birmingham, AL', phone: '(205) 631-6863', website: 'https://www.plumbingandgas.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Birmingham AL plumbing — Magic City residential & commercial market' },
      { name: 'John C. Flood Richmond VA', owner: 'John Flood', location: 'Richmond, VA', phone: '(804) 224-2206', website: 'https://www.johnflood.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Richmond VA plumbing & HVAC — established Virginia company' },
      { name: 'Poole\'s Plumbing Raleigh NC', owner: 'David Poole', location: 'Raleigh, NC', phone: '(919) 661-6255', website: 'https://www.poolesplumbing.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Raleigh NC plumbing — large booming Triangle market' },
    ],
  },
  {
    db: 'landscaping',
    prospects: [
      { name: 'Lewis Landscaping Birmingham AL', owner: 'Brad Lewis', location: 'Birmingham, AL', phone: '(205) 979-0100', website: 'https://www.lewislandscaping.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Birmingham AL landscaping — Magic City residential market' },
      { name: 'Turf\'s Up Lawn Care Richmond VA', owner: 'Mark Jennings', location: 'Richmond, VA', phone: '(804) 897-0200', website: 'https://www.turfsup.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Richmond VA lawn care — Virginia capital suburban market' },
      { name: 'NC State Landscape Raleigh NC', owner: 'Tom Wicker', location: 'Raleigh, NC', phone: '(919) 556-1022', website: 'https://www.ncstatelandscape.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Raleigh NC landscaping — booming Triangle new construction & residential market' },
    ],
  },
  {
    db: 'veterinary',
    prospects: [
      { name: 'Birmingham Veterinary Clinic AL', owner: 'Dr. James Donahue', location: 'Birmingham, AL', phone: '(205) 823-7100', website: 'https://www.birminghamveterinary.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Birmingham AL veterinary clinic — Magic City market' },
      { name: 'Banfield Pet Hospital Richmond VA', owner: 'Dr. Gail Mason', location: 'Richmond, VA', phone: '(804) 965-9000', website: 'https://www.banfield.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Richmond VA veterinary clinic — national brand, large Virginia market' },
      { name: 'Triangle Veterinary Referral Hospital Raleigh NC', owner: 'Dr. Mark Ricard', location: 'Durham, NC', phone: '(919) 489-0615', website: 'https://www.trianglevetreferal.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Raleigh/Durham NC specialty veterinary — Research Triangle large market' },
    ],
  },
  {
    db: 'kitchenBath',
    prospects: [
      { name: 'Birmingham Kitchen & Bath AL', owner: 'Carol Whitfield', location: 'Birmingham, AL', phone: '(205) 870-5550', website: 'https://www.birminghamkitchenandbath.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Birmingham AL kitchen & bath — Magic City renovation market' },
      { name: 'Richmond Kitchen & Bath Design VA', owner: 'Peter Sinclair', location: 'Richmond, VA', phone: '(804) 272-4700', website: 'https://www.richmondkitchenandbath.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Richmond VA kitchen & bath remodeling — Virginia capital market' },
      { name: 'Raleigh Kitchen & Bath NC', owner: 'Nancy Bridges', location: 'Raleigh, NC', phone: '(919) 872-6900', website: 'https://www.raleighkitchenandbath.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Raleigh NC kitchen & bath — booming Triangle new homeowner market' },
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
  console.log(`\n✅ New Niches Batch 11 complete — ${total} prospects added.`);
})();
