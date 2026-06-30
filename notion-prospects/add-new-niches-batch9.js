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

// New Niches Batch 9: Milwaukee WI + Detroit MI + Cleveland OH
const batches = [
  {
    db: 'plumbing',
    prospects: [
      { name: 'Heiden Plumbing Milwaukee WI', owner: 'Dan Heiden', location: 'Milwaukee, WI', phone: '(414) 259-9001', website: 'https://www.heidenplumbing.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Milwaukee WI plumbing — large Midwest Lake Michigan market' },
      { name: 'Thornton & Grooms Detroit MI', owner: 'Kirk Grooms', location: 'Farmington Hills, MI', phone: '(248) 509-8922', website: 'https://www.thorntonandgrooms.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Detroit MI plumbing & HVAC — large well-known suburban Detroit company' },
      { name: 'Barker & Sons Plumbing Cleveland OH', owner: 'Steve Barker', location: 'Cleveland, OH', phone: '(440) 835-8008', website: 'https://www.barkerandsons.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Cleveland OH plumbing — large Lake Erie metro market' },
    ],
  },
  {
    db: 'landscaping',
    prospects: [
      { name: 'Johnson\'s Nursery Milwaukee WI', owner: 'Craig Johnson', location: 'Menomonee Falls, WI', phone: '(262) 252-4980', website: 'https://www.johnsonsnursery.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Milwaukee WI landscaping & nursery — large established Wisconsin company' },
      { name: 'Landscape Design Associates Detroit MI', owner: 'Robert Hursthouse', location: 'Troy, MI', phone: '(248) 528-0990', website: 'https://www.ldadesign.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Detroit MI landscaping — affluent Oakland County suburban market' },
      { name: 'Willoway Nurseries Cleveland OH', owner: 'Tom Soulsby', location: 'Avon, OH', phone: '(440) 934-7552', website: 'https://www.willoway.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Cleveland OH landscaping & nursery — large NE Ohio market' },
    ],
  },
  {
    db: 'veterinary',
    prospects: [
      { name: 'Wisconsin Veterinary Referral Center Milwaukee WI', owner: 'Dr. Sarah Nett', location: 'Waukesha, WI', phone: '(262) 542-3241', website: 'https://www.wvrc.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Milwaukee WI specialty veterinary — large regional referral center' },
      { name: 'Oakland Veterinary Referral Services Detroit MI', owner: 'Dr. Nicole Buote', location: 'Bloomfield Hills, MI', phone: '(248) 334-6877', website: 'https://www.ovrs.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Detroit MI specialty veterinary — affluent Oakland County market' },
      { name: 'MedVet Cleveland OH', owner: 'Dr. Chris Adin', location: 'Akron, OH', phone: '(330) 665-4996', website: 'https://www.medvetforpets.com', hasWebsite: 'Yes', wqs: 7, opp: 7, notes: 'Cleveland/Akron OH specialty veterinary hospital — large NE Ohio market' },
    ],
  },
  {
    db: 'kitchenBath',
    prospects: [
      { name: 'Milwaukee Kitchen & Bath Design WI', owner: 'Ellen Kurth', location: 'Milwaukee, WI', phone: '(414) 358-8000', website: 'https://www.milwaukeekitchenandbath.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Milwaukee WI kitchen & bath remodeling — large Midwest market' },
      { name: 'Detroit Kitchen & Bath Design MI', owner: 'Paul Sheridan', location: 'Birmingham, MI', phone: '(248) 647-2100', website: 'https://www.detroitkitchenandbath.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Detroit MI kitchen & bath — affluent Oakland County renovation market' },
      { name: 'Cleveland Kitchen & Bath Design OH', owner: 'Margaret Fisk', location: 'Cleveland, OH', phone: '(216) 464-8000', website: 'https://www.clevelandkitchenandbath.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Cleveland OH kitchen & bath remodeling — Lake Erie metro market' },
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
  console.log(`\n✅ New Niches Batch 9 complete — ${total} prospects added.`);
})();
