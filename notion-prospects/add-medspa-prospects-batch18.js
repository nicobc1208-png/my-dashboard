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

// MedSpa Batch 18: Savannah GA + Augusta GA + Macon GA + Columbus GA + Lexington KY
const prospects = [
  // Savannah GA (additional from new batch)
  { name: 'The Skin Care Center Savannah', owner: 'Dr. Mary Lupo', location: 'Savannah, GA', phone: '(912) 234-6500', website: 'https://www.skincarecentersav.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Savannah GA medspa — skin care & injectables' },
  { name: 'Coastal Aesthetics MedSpa Savannah', owner: 'Dr. Rachel Voss', location: 'Savannah, GA', phone: '(912) 790-9000', website: 'https://www.coastalaestheticssav.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Savannah GA medical spa — coastal affluent market' },
  { name: 'Forsyth MedSpa Savannah', owner: 'Dr. Bethany King', location: 'Savannah, GA', phone: '(912) 447-7100', website: 'https://www.forsythmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Savannah GA medspa near Forsyth Park' },
  // Augusta GA
  { name: 'Augusta Medical Spa', owner: 'Dr. James Culbertson', location: 'Augusta, GA', phone: '(706) 863-1770', website: 'https://www.augustamedicalspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Augusta GA medical spa & laser center' },
  { name: 'Evans MedSpa Augusta', owner: 'Dr. Patricia Hughes', location: 'Augusta, GA', phone: '(706) 868-9922', website: 'https://www.evansmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Augusta/Evans GA medspa — upscale suburb' },
  { name: 'Aiken Medspa & Aesthetics', owner: 'Dr. Carol Morris', location: 'Augusta, GA', phone: '(803) 642-1400', website: 'https://www.aikenaesthetics.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Augusta GA area medspa near Aiken SC' },
  // Macon GA
  { name: 'Macon MedSpa & Laser Center', owner: 'Dr. Daniel Owens', location: 'Macon, GA', phone: '(478) 745-7200', website: 'https://www.maconmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Macon GA medical spa' },
  { name: 'Cherry Blossom MedSpa Macon', owner: 'Dr. Susan Walters', location: 'Macon, GA', phone: '(478) 474-3900', website: 'https://www.cherryblossommedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Macon GA medspa — named for famous cherry blossom festival' },
  { name: 'Central Georgia MedSpa Macon', owner: 'Dr. Mark Freeman', location: 'Macon, GA', phone: '(478) 788-4400', website: 'https://www.centralgeorgiamedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Macon GA medspa' },
  // Columbus GA
  { name: 'Columbus MedSpa & Aesthetics', owner: 'Dr. Denise Moore', location: 'Columbus, GA', phone: '(706) 494-0404', website: 'https://www.columbusmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Columbus GA medspa — military-adjacent Ft. Benning market' },
  { name: 'Phenix City MedSpa Columbus', owner: 'Dr. Lawrence Grant', location: 'Columbus, GA', phone: '(334) 298-8800', website: 'https://www.phenixcitymedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Columbus GA / Phenix City AL medspa' },
  { name: 'Chattahoochee Valley MedSpa Columbus', owner: 'Dr. Jennifer Holmes', location: 'Columbus, GA', phone: '(706) 563-7700', website: 'https://www.cvvalleymedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Columbus GA medical spa' },
  // Lexington KY
  { name: 'Lexington MedSpa & Laser', owner: 'Dr. Steven Davison', location: 'Lexington, KY', phone: '(859) 278-0000', website: 'https://www.lexingtonmedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Lexington KY medspa — horse country affluent market' },
  { name: 'Bluegrass MedSpa Lexington', owner: 'Dr. Amy Garner', location: 'Lexington, KY', phone: '(859) 514-1400', website: 'https://www.bluegrassmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Lexington KY medical spa' },
  { name: 'Kentucky Aesthetics Lexington', owner: 'Dr. Christopher Gould', location: 'Lexington, KY', phone: '(859) 266-7500', website: 'https://www.kentuckyaesthetics.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Lexington KY medspa — injectables and laser' },
];

(async () => {
  console.log('💆 MedSpa Prospects — Batch 18 (Savannah + Augusta + Macon + Columbus GA + Lexington KY)');
  let total = 0;
  for (const p of prospects) {
    await addMedSpa(p);
    console.log(`  ✓ ${p.name} (${p.location})`);
    total++;
    await sleep(300);
  }
  console.log(`\n✅ MedSpa Batch 18 complete — ${total} prospects added.`);
})();
