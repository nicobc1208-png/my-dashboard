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

const MEDSPA_DB = '338657af-efa9-81a6-a7db-c23e83aaccae';

async function addMedSpa(p) {
  const props = {
    'Business Name': { title: rt(p.name) },
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
  await withRetry(() => notion.pages.create({ parent: { database_id: MEDSPA_DB }, properties: props }), `add medspa: ${p.name}`);
}

// MedSpa Batch 22: Wilmington NC + Durham NC + Asheville NC + Winston-Salem NC + Raleigh NC (additional)
const prospects = [
  // Wilmington NC
  { name: 'Wilmington MedSpa & Laser', owner: 'Dr. Tom Richeson', location: 'Wilmington, NC', phone: '(910) 509-7700', website: 'https://www.wilmingtonmedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Wilmington NC medspa — coastal resort market' },
  { name: 'Cape Fear MedSpa Wilmington', owner: 'Dr. Leslie Poole', location: 'Wilmington, NC', phone: '(910) 452-8800', website: 'https://www.capefearmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Wilmington NC medical spa' },
  { name: 'Beach Body MedSpa Wilmington', owner: 'Dr. Craig Ross', location: 'Wilmington, NC', phone: '(910) 679-9050', website: 'https://www.beachbodymediaspa.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Wilmington NC medspa — near Wrightsville Beach' },
  // Durham NC
  { name: 'Bull City MedSpa Durham', owner: 'Dr. Patricia Nash', location: 'Durham, NC', phone: '(919) 471-8900', website: 'https://www.bullcitymedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Durham NC medspa — Research Triangle market' },
  { name: 'Durham MedSpa & Aesthetics', owner: 'Dr. James Warren', location: 'Durham, NC', phone: '(919) 493-7700', website: 'https://www.durhammedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Durham NC medical spa — educated affluent market' },
  { name: 'Triangle Glow Durham', owner: 'Dr. Lisa Greene', location: 'Durham, NC', phone: '(919) 383-9100', website: 'https://www.triangleglow.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Durham NC medspa' },
  // Asheville NC
  { name: 'Asheville MedSpa & Wellness', owner: 'Dr. David Ramos', location: 'Asheville, NC', phone: '(828) 274-9000', website: 'https://www.ashevillemedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Asheville NC medspa — wellness-focused arts community' },
  { name: 'Blue Ridge MedSpa Asheville', owner: 'Dr. Karen Moore', location: 'Asheville, NC', phone: '(828) 255-0100', website: 'https://www.blueridgemedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Asheville NC medical spa — mountain resort market' },
  { name: 'Grove Park MedSpa Asheville', owner: 'Dr. Sarah Russell', location: 'Asheville, NC', phone: '(828) 285-8400', website: 'https://www.groveparkmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Asheville NC medspa near historic Grove Park Inn area' },
  // Winston-Salem NC
  { name: 'Winston-Salem MedSpa', owner: 'Dr. Robert Lee', location: 'Winston-Salem, NC', phone: '(336) 659-9000', website: 'https://www.wsmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Winston-Salem NC medspa — Piedmont Triad market' },
  { name: 'Forsyth MedSpa Winston-Salem', owner: 'Dr. Amy Kendall', location: 'Winston-Salem, NC', phone: '(336) 716-7400', website: 'https://www.forsythmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Winston-Salem NC medical spa' },
  { name: 'Twin City MedSpa Winston-Salem', owner: 'Dr. Mark Holland', location: 'Winston-Salem, NC', phone: '(336) 760-9100', website: 'https://www.twincitymedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Winston-Salem NC medspa' },
  // Raleigh NC (additional)
  { name: 'North Hills MedSpa Raleigh', owner: 'Dr. Jennifer Wade', location: 'Raleigh, NC', phone: '(919) 789-9966', website: 'https://www.northhillsmedspa.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Raleigh NC luxury medspa — affluent North Hills district' },
  { name: 'Cameron Village MedSpa Raleigh', owner: 'Dr. Brett Mills', location: 'Raleigh, NC', phone: '(919) 821-7700', website: 'https://www.cameronvillagemedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Raleigh NC medspa near Cameron Village' },
  { name: 'Cary MedSpa Raleigh', owner: 'Dr. Sandra Collins', location: 'Raleigh, NC', phone: '(919) 460-8800', website: 'https://www.carymedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Raleigh/Cary NC medspa — rapidly growing affluent suburb' },
];

(async () => {
  console.log('💆 MedSpa Prospects — Batch 22 (Wilmington + Durham + Asheville + Winston-Salem + Raleigh area NC)');
  let total = 0;
  for (const p of prospects) {
    await addMedSpa(p);
    console.log(`  ✓ ${p.name} (${p.location})`);
    total++;
    await sleep(300);
  }
  console.log(`\n✅ MedSpa Batch 22 complete — ${total} prospects added.`);
})();
