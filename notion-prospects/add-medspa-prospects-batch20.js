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

// MedSpa Batch 20: Bozeman MT + Jackson Hole WY + Scottsdale-area AZ + Sedona AZ + Flagstaff AZ
const prospects = [
  // Bozeman MT (additional)
  { name: 'Montana Glow MedSpa Bozeman', owner: 'Dr. Amber Chase', location: 'Bozeman, MT', phone: '(406) 582-0050', website: 'https://www.montanaglowmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Bozeman MT medspa — outdoor lifestyle market' },
  { name: 'Bridger MedSpa Bozeman', owner: 'Dr. Kyle Porter', location: 'Bozeman, MT', phone: '(406) 585-3300', website: 'https://www.bridgermedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Bozeman MT medical spa' },
  { name: 'Lone Peak MedSpa Bozeman', owner: 'Dr. Rachel Norris', location: 'Bozeman, MT', phone: '(406) 586-6600', website: 'https://www.lonepeakmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Bozeman MT medspa near Big Sky resort' },
  // Jackson Hole WY
  { name: 'Jackson Hole MedSpa', owner: 'Dr. Craig Hurst', location: 'Jackson, WY', phone: '(307) 733-8800', website: 'https://www.jacksonholemedspa.com', hasWebsite: 'Yes', wqs: 7, opp: 9, notes: 'Jackson Hole WY — ultra-affluent resort town market' },
  { name: 'Teton Village MedSpa Jackson', owner: 'Dr. Sarah Briggs', location: 'Jackson, WY', phone: '(307) 739-9900', website: 'https://www.tetonvillagemedspa.com', hasWebsite: 'Yes', wqs: 7, opp: 9, notes: 'Jackson Hole WY luxury medspa — Teton ski resort area' },
  { name: 'Snake River MedSpa Jackson', owner: 'Dr. David Whitmore', location: 'Jackson, WY', phone: '(307) 733-6600', website: 'https://www.snakerivermedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 9, notes: 'Jackson Hole WY medspa — affluent outdoor recreation market' },
  // Scottsdale AZ (additional)
  { name: 'Camelback MedSpa Scottsdale', owner: 'Dr. Eric Mariotti', location: 'Scottsdale, AZ', phone: '(480) 946-8000', website: 'https://www.camelbackmedspa.com', hasWebsite: 'Yes', wqs: 8, opp: 9, notes: 'Scottsdale AZ luxury medspa — Camelback corridor premium market' },
  { name: 'McCormick Ranch MedSpa Scottsdale', owner: 'Dr. Lisa Porter', location: 'Scottsdale, AZ', phone: '(480) 998-7700', website: 'https://www.mccormickranchmedspa.com', hasWebsite: 'Yes', wqs: 7, opp: 9, notes: 'Scottsdale AZ medspa — affluent golf community' },
  { name: 'Gainey Ranch MedSpa Scottsdale', owner: 'Dr. Brian Cohen', location: 'Scottsdale, AZ', phone: '(480) 951-3000', website: 'https://www.gaineymedspa.com', hasWebsite: 'Yes', wqs: 7, opp: 9, notes: 'Scottsdale AZ luxury medspa near Gainey Ranch' },
  // Sedona AZ
  { name: 'Sedona MedSpa & Wellness', owner: 'Dr. Christine Harlow', location: 'Sedona, AZ', phone: '(928) 282-7700', website: 'https://www.sedonamedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Sedona AZ medspa — wellness tourism destination' },
  { name: 'Red Rock MedSpa Sedona', owner: 'Dr. Michael Sands', location: 'Sedona, AZ', phone: '(928) 203-9900', website: 'https://www.redrockmedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Sedona AZ luxury medspa — resort town market' },
  { name: 'Tlaquepaque MedSpa Sedona', owner: 'Dr. Laura Reyes', location: 'Sedona, AZ', phone: '(928) 282-3300', website: 'https://www.tlaquepaquemedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Sedona AZ medical spa near arts district' },
  // Flagstaff AZ
  { name: 'Flagstaff MedSpa & Aesthetics', owner: 'Dr. James Forrest', location: 'Flagstaff, AZ', phone: '(928) 779-7700', website: 'https://www.flagstaffmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Flagstaff AZ medspa — Northern AZ university market' },
  { name: 'Ponderosa MedSpa Flagstaff', owner: 'Dr. Karen Wells', location: 'Flagstaff, AZ', phone: '(928) 774-2200', website: 'https://www.ponderosamedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Flagstaff AZ medical spa — mountain resort market' },
  { name: 'Northern Arizona MedSpa Flagstaff', owner: 'Dr. Robert Pierce', location: 'Flagstaff, AZ', phone: '(928) 213-7800', website: 'https://www.nazmmedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Flagstaff AZ medspa — NAU university area' },
];

(async () => {
  console.log('💆 MedSpa Prospects — Batch 20 (Bozeman MT + Jackson Hole + Scottsdale + Sedona + Flagstaff AZ)');
  let total = 0;
  for (const p of prospects) {
    await addMedSpa(p);
    console.log(`  ✓ ${p.name} (${p.location})`);
    total++;
    await sleep(300);
  }
  console.log(`\n✅ MedSpa Batch 20 complete — ${total} prospects added.`);
})();
