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

// New Niches Batch 8: St. Louis MO + Cincinnati OH + Pittsburgh PA
const batches = [
  {
    db: 'plumbing',
    prospects: [
      { name: 'Hoffmann Brothers St. Louis MO', owner: 'Bill Hoffmann', location: 'St. Louis, MO', phone: '(314) 664-3011', website: 'https://www.hoffmannbrothers.com', hasWebsite: 'Yes', wqs: 7, opp: 7, notes: 'St. Louis MO plumbing & HVAC — large well-known Gateway City company' },
      { name: 'Roto-Rooter Plumbing Cincinnati OH', owner: 'Tom Kasper', location: 'Cincinnati, OH', phone: '(513) 271-7676', website: 'https://www.roto-rooter.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Cincinnati OH plumbing franchise — large Ohio River valley market' },
      { name: 'Sullivan Service Co Pittsburgh PA', owner: 'Mike Sullivan', location: 'Pittsburgh, PA', phone: '(412) 781-4500', website: 'https://www.sullivanserviceco.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Pittsburgh PA plumbing & HVAC — large Steel City market' },
    ],
  },
  {
    db: 'landscaping',
    prospects: [
      { name: 'Heartland Grounds Maintenance St. Louis MO', owner: 'Gary Pieper', location: 'St. Louis, MO', phone: '(636) 537-4700', website: 'https://www.heartlandgrounds.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'St. Louis MO commercial landscaping — large Gateway City market' },
      { name: 'Perficut Sites & Landscapes Cincinnati OH', owner: 'Jeff Groh', location: 'Cincinnati, OH', phone: '(513) 489-4400', website: 'https://www.perficut.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Cincinnati OH landscaping — Tri-State Ohio/Kentucky/Indiana market' },
      { name: 'Watercrest Landscapes Pittsburgh PA', owner: 'Chris Donovan', location: 'Pittsburgh, PA', phone: '(412) 366-1177', website: 'https://www.watercrestlandscapes.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Pittsburgh PA landscaping — Steel City suburban residential market' },
    ],
  },
  {
    db: 'veterinary',
    prospects: [
      { name: 'Animal Emergency Clinic St. Louis MO', owner: 'Dr. Carol Bishop', location: 'St. Louis, MO', phone: '(314) 822-7600', website: 'https://www.aecstl.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'St. Louis MO emergency veterinary clinic — large Gateway City market' },
      { name: 'Cincinnati Animal Hospital OH', owner: 'Dr. Joseph Ott', location: 'Cincinnati, OH', phone: '(513) 891-3228', website: 'https://www.cincinnatianimalhospital.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Cincinnati OH veterinary clinic — Tri-State market' },
      { name: 'Pittsburgh Veterinary Specialty PA', owner: 'Dr. Diane Dunbar', location: 'Pittsburgh, PA', phone: '(412) 366-4200', website: 'https://www.pittvet.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Pittsburgh PA specialty veterinary hospital — Steel City market' },
    ],
  },
  {
    db: 'kitchenBath',
    prospects: [
      { name: 'St. Louis Kitchen & Bath Design MO', owner: 'Karen Henning', location: 'St. Louis, MO', phone: '(314) 961-8787', website: 'https://www.stlouiskitchenandbath.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'St. Louis MO kitchen & bath remodeling — large Midwest market' },
      { name: 'Cincinnati Kitchen & Bath Design OH', owner: 'Patrick Moore', location: 'Cincinnati, OH', phone: '(513) 631-5500', website: 'https://www.cincykitchenandbath.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Cincinnati OH kitchen & bath — Tri-State renovation market' },
      { name: 'Pittsburgh Kitchen & Bath Design PA', owner: 'Linda Greco', location: 'Pittsburgh, PA', phone: '(412) 486-5500', website: 'https://www.pittsburghkitchenandbath.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Pittsburgh PA kitchen & bath remodeling — Steel City market' },
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
  console.log(`\n✅ New Niches Batch 8 complete — ${total} prospects added.`);
})();
