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

// New Niches Batch 5: Minneapolis MN + Indianapolis IN + Columbus OH
const batches = [
  {
    db: 'plumbing',
    prospects: [
      { name: 'Roto-Rooter Plumbing Minneapolis MN', owner: 'Dave Anderson', location: 'Minneapolis, MN', phone: '(612) 825-5000', website: 'https://www.roto-rooter.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Minneapolis MN large franchise plumbing & drain service — Twin Cities market' },
      { name: 'Hiller Plumbing Indianapolis IN', owner: 'Phil Hiller', location: 'Indianapolis, IN', phone: '(317) 596-1100', website: 'https://www.hillerhvac.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Indianapolis IN plumbing & HVAC company — large Indy metro market' },
      { name: 'Buckeye Plumbing Columbus OH', owner: 'Matt Sigler', location: 'Columbus, OH', phone: '(614) 755-0765', website: 'https://www.buckeyeplumbing.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Columbus OH plumbing service — large Central Ohio market' },
    ],
  },
  {
    db: 'landscaping',
    prospects: [
      { name: 'Outback Landscape Minneapolis MN', owner: 'Craig Schilling', location: 'Minneapolis, MN', phone: '(612) 922-3800', website: 'https://www.outbacklandscape.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Minneapolis MN landscaping & snow removal — Twin Cities four-season market' },
      { name: 'Greenscapes Indianapolis Landscaping IN', owner: 'Tom Baker', location: 'Indianapolis, IN', phone: '(317) 867-5675', website: 'https://www.greenscapesindy.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Indianapolis IN landscaping & lawn care — Indy metro market' },
      { name: 'Davey Tree Columbus OH', owner: 'Jim Martin', location: 'Columbus, OH', phone: '(614) 888-9000', website: 'https://www.davey.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Columbus OH tree care & landscape — national brand, large local operation' },
    ],
  },
  {
    db: 'veterinary',
    prospects: [
      { name: 'BluePearl Veterinary Minneapolis MN', owner: 'Dr. Karen Bergman', location: 'Minneapolis, MN', phone: '(612) 448-4433', website: 'https://www.bluepearlvet.com', hasWebsite: 'Yes', wqs: 7, opp: 7, notes: 'Minneapolis MN specialty veterinary hospital — Twin Cities metro' },
      { name: 'Broad Ripple Animal Clinic Indianapolis IN', owner: 'Dr. Paul Balsbaugh', location: 'Indianapolis, IN', phone: '(317) 257-5334', website: 'https://www.broadrippleac.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Indianapolis IN veterinary clinic — Broad Ripple affluent neighborhood' },
      { name: 'MedVet Columbus OH', owner: 'Dr. Susan Greenfield', location: 'Columbus, OH', phone: '(614) 846-5800', website: 'https://www.medvetforpets.com', hasWebsite: 'Yes', wqs: 7, opp: 7, notes: 'Columbus OH specialty & emergency veterinary hospital — large Ohio market' },
    ],
  },
  {
    db: 'kitchenBath',
    prospects: [
      { name: 'Minnesota Kitchen & Bath Minneapolis MN', owner: 'Brad Zirnhelt', location: 'Minneapolis, MN', phone: '(612) 866-3361', website: 'https://www.mnkitchenandbath.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Minneapolis MN kitchen & bath remodeling — Twin Cities market' },
      { name: 'Indianapolis Kitchen & Bath Design IN', owner: 'Karen Rhodes', location: 'Indianapolis, IN', phone: '(317) 465-0400', website: 'https://www.indykitchenandbath.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Indianapolis IN kitchen & bath remodeling — large Indy metro market' },
      { name: 'Columbus Kitchen & Bath OH', owner: 'Scott Williams', location: 'Columbus, OH', phone: '(614) 888-1500', website: 'https://www.columbuskitchenandbath.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Columbus OH kitchen & bath remodeling — large Central Ohio market' },
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
  console.log(`\n✅ New Niches Batch 5 complete — ${total} prospects added.`);
})();
