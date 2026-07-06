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

// New Niches Batch 2: Phoenix AZ + Denver CO + Las Vegas NV
const batches = [
  {
    db: 'plumbing',
    prospects: [
      { name: 'George Brazil Plumbing Phoenix AZ', owner: 'Tom Brazil', location: 'Phoenix, AZ', phone: '(602) 842-0002', website: 'https://www.georgebrazil.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Phoenix AZ well-established plumbing & air company — major local brand' },
      { name: 'Bell Plumbing & Heating Denver CO', owner: 'Tom Bell', location: 'Denver, CO', phone: '(303) 757-5500', website: 'https://www.bellplumbing.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Denver CO established residential plumbing company' },
      { name: 'Rooter Hero Plumbing Las Vegas NV', owner: 'Stan White', location: 'Las Vegas, NV', phone: '(702) 500-0000', website: 'https://www.rooterhero.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Las Vegas NV plumbing & drain service — large LV market' },
    ],
  },
  {
    db: 'landscaping',
    prospects: [
      { name: 'Desert Foothills Landscape Phoenix AZ', owner: 'Chris Lowery', location: 'Phoenix, AZ', phone: '(480) 488-0512', website: 'https://www.desertfoothillslandscape.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Phoenix AZ desert landscaping specialist — Scottsdale/North Phoenix market' },
      { name: 'Swingle Lawn Tree & Landscape Denver CO', owner: 'Jim Swingle', location: 'Denver, CO', phone: '(303) 466-2700', website: 'https://www.swingleco.com', hasWebsite: 'Yes', wqs: 7, opp: 7, notes: 'Denver CO large landscape company — major Colorado brand' },
      { name: 'Vegas Valley Turf Las Vegas NV', owner: 'Gary Harmon', location: 'Las Vegas, NV', phone: '(702) 451-0303', website: 'https://www.vegasvalleyturf.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Las Vegas NV artificial turf & landscaping — drought-resistant market' },
    ],
  },
  {
    db: 'veterinary',
    prospects: [
      { name: 'VCA Arcadia Animal Hospital Phoenix AZ', owner: 'Dr. Pamela Franks', location: 'Phoenix, AZ', phone: '(602) 840-5422', website: 'https://www.vcaarcadiaanimalhospital.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Phoenix AZ veterinary clinic — affluent Arcadia neighborhood' },
      { name: 'Denver Animal Hospital CO', owner: 'Dr. Steven Kramer', location: 'Denver, CO', phone: '(303) 744-7387', website: 'https://www.denveranimalhospital.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Denver CO full-service veterinary hospital — established practice' },
      { name: 'Eastern Animal Hospital Las Vegas NV', owner: 'Dr. Rachel Kim', location: 'Las Vegas, NV', phone: '(702) 457-8050', website: 'https://www.easternanimalhospital.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Las Vegas NV veterinary clinic — large LV residential market' },
    ],
  },
  {
    db: 'kitchenBath',
    prospects: [
      { name: 'Arizona Kitchen & Bath Design Phoenix AZ', owner: 'Sandra Wells', location: 'Phoenix, AZ', phone: '(480) 831-2227', website: 'https://www.arizonakitchenandbath.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Phoenix AZ kitchen & bath remodeling — large AZ remodel market' },
      { name: 'Mile High Kitchen & Bath Denver CO', owner: 'Paul Erikson', location: 'Denver, CO', phone: '(303) 333-3030', website: 'https://www.milehighkitchenbath.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Denver CO kitchen & bath remodeling — Colorado boom market' },
      { name: 'Tuscany Kitchen & Bath Las Vegas NV', owner: 'Tony Martelli', location: 'Las Vegas, NV', phone: '(702) 646-9292', website: 'https://www.tuscanykitchenbath.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Las Vegas NV kitchen & bath remodeling — large LV home improvement market' },
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
  console.log(`\n✅ New Niches Batch 2 complete — ${total} prospects added.`);
})();
