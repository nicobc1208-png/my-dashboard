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

// MedSpa Batch 17: Greenville SC + Myrtle Beach SC + Columbia SC + Augusta GA + Savannah GA
const prospects = [
  // Greenville SC
  { name: 'Greenville MedSpa & Aesthetics', owner: 'Dr. Tamara Blaylock', location: 'Greenville, SC', phone: '(864) 232-3080', website: 'https://www.greenvillemedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Greenville SC medspa — rapidly growing Upstate SC market' },
  { name: 'Upstate Skin & MedSpa Greenville', owner: 'Dr. Wes Hess', location: 'Greenville, SC', phone: '(864) 288-5400', website: 'https://www.upstatemedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Greenville SC medical spa' },
  { name: 'Downtown Greenville MedSpa', owner: 'Dr. Lindsey Barrett', location: 'Greenville, SC', phone: '(864) 271-9900', website: 'https://www.downtowngvlmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Greenville SC medspa — downtown Falls Park area' },
  // Myrtle Beach SC
  { name: 'Grand Strand MedSpa Myrtle Beach', owner: 'Dr. Michael Burke', location: 'Myrtle Beach, SC', phone: '(843) 213-8000', website: 'https://www.grandstrandmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Myrtle Beach SC medspa — Grand Strand tourist market' },
  { name: 'Beach Body MedSpa Myrtle Beach', owner: 'Dr. Sandra Walsh', location: 'Myrtle Beach, SC', phone: '(843) 444-5100', website: 'https://www.beachbodymedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Myrtle Beach SC medical spa' },
  { name: 'Coastal Glow MedSpa Myrtle Beach', owner: 'Dr. Karen Elliott', location: 'Myrtle Beach, SC', phone: '(843) 839-9080', website: 'https://www.coastalglowmedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Myrtle Beach SC medspa — beach resort area' },
  // Columbia SC
  { name: 'Palmetto MedSpa Columbia', owner: 'Dr. William Sauls', location: 'Columbia, SC', phone: '(803) 779-9490', website: 'https://www.palmettomedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Columbia SC medical spa' },
  { name: 'Midlands MedSpa Columbia SC', owner: 'Dr. Pam Lucas', location: 'Columbia, SC', phone: '(803) 788-1400', website: 'https://www.midlandsmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Columbia SC medspa — Midlands region' },
  { name: 'Five Points MedSpa Columbia', owner: 'Dr. John Roper', location: 'Columbia, SC', phone: '(803) 799-5500', website: 'https://www.fivepointsmedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Columbia SC medspa near Five Points district' },
  // Augusta GA
  { name: 'Augusta MedSpa & Aesthetics', owner: 'Dr. Dean McCord', location: 'Augusta, GA', phone: '(706) 738-9977', website: 'https://www.augustamedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Augusta GA medspa — Masters golf tournament market' },
  { name: 'Masters MedSpa Augusta', owner: 'Dr. Linda Peeler', location: 'Augusta, GA', phone: '(706) 650-1100', website: 'https://www.mastersmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Augusta GA medical spa' },
  { name: 'Aiken MedSpa Augusta Area', owner: 'Dr. Bruce Hamilton', location: 'Augusta, GA', phone: '(803) 641-8000', website: 'https://www.aikenmedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Augusta/Aiken area GA/SC medspa' },
  // Savannah GA
  { name: 'Savannah MedSpa & Laser', owner: 'Dr. Peter Schmitt', location: 'Savannah, GA', phone: '(912) 354-6000', website: 'https://www.savannahmedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Savannah GA medspa — historic district tourist market' },
  { name: 'River Street MedSpa Savannah', owner: 'Dr. Allison Cross', location: 'Savannah, GA', phone: '(912) 232-3030', website: 'https://www.riverstreetmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Savannah GA medical spa — River Street district' },
  { name: 'Tybee Island MedSpa Savannah', owner: 'Dr. Jason Holt', location: 'Savannah, GA', phone: '(912) 786-9700', website: 'https://www.tybeeislandmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Savannah/Tybee Island GA medspa — coastal market' },
];

(async () => {
  console.log('💆 MedSpa Prospects — Batch 17 (Greenville SC + Myrtle Beach SC + Columbia SC + Augusta + Savannah)');
  let total = 0;
  for (const p of prospects) {
    await addMedSpa(p);
    console.log(`  ✓ ${p.name} (${p.location})`);
    total++;
    await sleep(300);
  }
  console.log(`\n✅ MedSpa Batch 17 complete — ${total} prospects added.`);
})();
