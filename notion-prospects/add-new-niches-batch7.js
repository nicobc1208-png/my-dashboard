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

// New Niches Batch 7: Denver CO + Colorado Springs CO + Kansas City MO
const batches = [
  {
    db: 'plumbing',
    prospects: [
      { name: 'Bell Plumbing Denver CO', owner: 'Ken Bell', location: 'Denver, CO', phone: '(303) 757-5555', website: 'https://www.bellplumbing.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Denver CO plumbing — well-known Mile High City residential & commercial plumber' },
      { name: 'Gold Medal Service Colorado Springs CO', owner: 'Tom Hearn', location: 'Colorado Springs, CO', phone: '(719) 368-8955', website: 'https://www.goldmedalservice.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Colorado Springs CO plumbing & HVAC — Front Range market' },
      { name: 'Anthony Plumbing Kansas City MO', owner: 'Dave Anthony', location: 'Kansas City, MO', phone: '(913) 268-4669', website: 'https://www.anthonyph.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Kansas City MO plumbing, heating & air — large Midwest metro market' },
    ],
  },
  {
    db: 'landscaping',
    prospects: [
      { name: 'Swingle Lawn Tree & Landscape Denver CO', owner: 'Scott Swingle', location: 'Denver, CO', phone: '(303) 466-2222', website: 'https://www.swingleco.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Denver CO landscaping & tree care — large established Front Range company' },
      { name: 'Colorado Yard Care Colorado Springs CO', owner: 'Jeff Larson', location: 'Colorado Springs, CO', phone: '(719) 481-0202', website: 'https://www.coloradoyardcare.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Colorado Springs CO lawn & landscape — Front Range residential market' },
      { name: 'Heartland Turf & Landscape Kansas City MO', owner: 'Mike Weaver', location: 'Kansas City, MO', phone: '(816) 525-6100', website: 'https://www.heartlandturf.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Kansas City MO landscaping & lawn care — large Midwest metro market' },
    ],
  },
  {
    db: 'veterinary',
    prospects: [
      { name: 'Alameda East Veterinary Hospital Denver CO', owner: 'Dr. Charles Sanders', location: 'Denver, CO', phone: '(303) 366-2639', website: 'https://www.alamedaeast.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Denver CO veterinary hospital — well-known emergency & specialty practice' },
      { name: 'Cheyenne Mountain Animal Hospital Colorado Springs CO', owner: 'Dr. Beth Williams', location: 'Colorado Springs, CO', phone: '(719) 475-2297', website: 'https://www.cheyennemountainah.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Colorado Springs CO veterinary clinic — Front Range market' },
      { name: 'Mission MedVet Kansas City MO', owner: 'Dr. Laura Fischer', location: 'Kansas City, MO', phone: '(913) 722-5566', website: 'https://www.missionmedvet.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Kansas City MO specialty veterinary hospital — large Midwest market' },
    ],
  },
  {
    db: 'kitchenBath',
    prospects: [
      { name: 'Denver Kitchen & Bath Design CO', owner: 'Rachel Sterling', location: 'Denver, CO', phone: '(303) 777-2800', website: 'https://www.denverkitchenandbath.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Denver CO kitchen & bath — booming Mile High City renovation market' },
      { name: 'Colorado Springs Kitchen & Bath CO', owner: 'Susan Bradley', location: 'Colorado Springs, CO', phone: '(719) 528-8700', website: 'https://www.cskitchenandbath.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Colorado Springs CO kitchen & bath remodeling — Front Range market' },
      { name: 'Kansas City Kitchen & Bath MO', owner: 'David Hill', location: 'Kansas City, MO', phone: '(816) 333-3300', website: 'https://www.kckitchenandbath.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Kansas City MO kitchen & bath — large Midwest home improvement market' },
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
  console.log(`\n✅ New Niches Batch 7 complete — ${total} prospects added.`);
})();
