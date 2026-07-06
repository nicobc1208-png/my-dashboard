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

async function addMedSpa(p, index) {
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
  await withRetry(() => notion.pages.create({ parent: { database_id: MEDSPA_DB }, properties: props }), `add medspa: ${p.name}`);
}

// MedSpa Batch 6: Philadelphia + Orlando + San Antonio + Sacramento + Richmond VA
const prospects = [
  // Philadelphia
  { name: 'Main Line Center for Laser Surgery', owner: 'Dr. Paul Carniol', location: 'Philadelphia, PA', phone: '(610) 525-0477', website: 'https://www.mainlinelaser.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Philadelphia area medspa & laser center' },
  { name: 'Lori Stetler MD MedSpa', owner: 'Dr. Lori Stetler', location: 'Philadelphia, PA', phone: '(215) 735-8808', website: 'https://www.loristelermd.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Philadelphia PA medical spa' },
  { name: 'Cheeks MedSpa Philly', owner: 'Dr. Arianna Sholes-Douglas', location: 'Philadelphia, PA', phone: '(215) 665-9400', website: 'https://www.cheeksmedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Philadelphia PA luxury medspa' },
  // Orlando
  { name: 'Destination Aesthetics Orlando', owner: 'Dr. Kimberly Henry', location: 'Orlando, FL', phone: '(407) 900-3990', website: 'https://www.destinationaesthetics.com', hasWebsite: 'Yes', wqs: 7, opp: 9, notes: 'Orlando FL medspa — tourist + resident market' },
  { name: 'Advanced Aesthetics & MedSpa Orlando', owner: 'Dr. Gary Alter', location: 'Orlando, FL', phone: '(407) 999-2500', website: 'https://www.aamedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 9, notes: 'Orlando FL medical spa & aesthetics' },
  { name: 'Orlando MedSpa', owner: 'Dr. Veronica Voge', location: 'Orlando, FL', phone: '(407) 841-1777', website: 'https://www.orlandomedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 9, notes: 'Orlando FL medspa — injectables & body contouring' },
  // San Antonio
  { name: 'Skin Rejuvenation Clinic San Antonio', owner: 'Dr. Jose Barrera', location: 'San Antonio, TX', phone: '(210) 829-9999', website: 'https://www.skinrejuvenationsatx.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'San Antonio TX medspa' },
  { name: 'SpaMD San Antonio', owner: 'Dr. Rosa Balbo', location: 'San Antonio, TX', phone: '(210) 930-8000', website: 'https://www.spamdsa.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'San Antonio TX medical spa' },
  { name: 'Aderans MedSpa SA', owner: 'Dr. Jennifer Parker', location: 'San Antonio, TX', phone: '(210) 495-9500', website: 'https://www.aderansmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'San Antonio TX medspa — bilingual market' },
  // Sacramento
  { name: 'Wellness Center MedSpa Sacramento', owner: 'Dr. Ava Shamban', location: 'Sacramento, CA', phone: '(916) 929-1828', website: 'https://www.wellnesscentermedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Sacramento CA medspa' },
  { name: 'The Body Works MedSpa', owner: 'Dr. Pamela Gallagher', location: 'Sacramento, CA', phone: '(916) 484-5200', website: 'https://www.bodyworksmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Sacramento CA medical spa & aesthetics' },
  { name: 'Folsom Medical Spa', owner: 'Dr. Michael Huston', location: 'Sacramento, CA', phone: '(916) 985-2532', website: 'https://www.folsommedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Sacramento-area Folsom CA medspa' },
  // Richmond VA
  { name: 'Reflections Center MedSpa Richmond', owner: 'Dr. Mark Hamilton', location: 'Richmond, VA', phone: '(804) 364-6677', website: 'https://www.reflexionsmedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Richmond VA medspa & aesthetics' },
  { name: 'Glo Spa MD Richmond', owner: 'Dr. Diana Heather', location: 'Richmond, VA', phone: '(804) 288-4430', website: 'https://www.glospamdrva.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Richmond VA medical spa' },
  { name: 'Shortt MedSpa', owner: 'Dr. Brian Shortt', location: 'Richmond, VA', phone: '(804) 323-2040', website: 'https://www.shorttmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Richmond VA medspa — Botox, filler, laser' },
];

(async () => {
  console.log('💆 MedSpa Prospects — Batch 6 (Philadelphia + Orlando + San Antonio + Sacramento + Richmond VA)');
  let total = 0;
  for (let i = 0; i < prospects.length; i++) {
    const p = prospects[i];
    await addMedSpa(p, i + 1);
    console.log(`  ✓ ${p.name} (${p.location})`);
    total++;
    await sleep(300);
  }
  console.log(`\n✅ MedSpa Batch 6 complete — ${total} prospects added.`);
})();
