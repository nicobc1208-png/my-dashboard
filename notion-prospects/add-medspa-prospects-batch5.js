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

// MedSpa Batch 5: Boston + Raleigh + Salt Lake City + Kansas City + Pittsburgh
const prospects = [
  // Boston
  { name: 'Newbury Street Laser & Skincare', owner: 'Dr. Jeffrey Dover', location: 'Boston, MA', phone: '(617) 536-0600', website: 'https://www.newburystreetlaser.com', hasWebsite: 'Yes', wqs: 8, opp: 8, notes: 'Boston MA prestigious medspa — high-end clientele' },
  { name: 'Coolsculpting Boston', owner: 'Dr. Ranella Hirsch', location: 'Boston, MA', phone: '(617) 536-3939', website: 'https://www.skinneeds.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Boston MA medspa — Coolsculpting & aesthetics' },
  { name: 'Beacon Hill Aesthetics', owner: 'Dr. Amy Wechsler', location: 'Boston, MA', phone: '(617) 742-4410', website: 'https://www.beaconhillaesthetics.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Boston MA medical spa' },
  // Raleigh
  { name: 'Cary Skin Center MedSpa', owner: 'Dr. Bruce Shack', location: 'Raleigh, NC', phone: '(919) 233-0232', website: 'https://www.caryskincenter.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Raleigh NC medspa — fast-growing research triangle market' },
  { name: 'Bravura Skin Studio', owner: 'Dr. Jessica Mowling', location: 'Raleigh, NC', phone: '(919) 781-1117', website: 'https://www.bravuraskin.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Raleigh NC boutique medspa' },
  { name: 'MedSpa of the Carolinas', owner: 'Dr. Paul Michaels', location: 'Raleigh, NC', phone: '(919) 870-8990', website: 'https://www.medspaofthecarolinas.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Raleigh NC medspa & aesthetics' },
  // Salt Lake City
  { name: 'Salt Lake Dermatology & Aesthetics', owner: 'Dr. Glen Bowen', location: 'Salt Lake City, UT', phone: '(801) 269-0208', website: 'https://www.saltlakedermatology.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Salt Lake City UT medspa — growing market' },
  { name: 'Reflect MedSpa SLC', owner: 'Dr. Alison Maguina', location: 'Salt Lake City, UT', phone: '(801) 738-9088', website: 'https://www.reflectmedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'SLC UT medspa — injectables & body treatments' },
  { name: 'Utah Laser & Aesthetics', owner: 'Dr. David Mabrie', location: 'Salt Lake City, UT', phone: '(801) 272-7777', website: 'https://www.utahlaser.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Salt Lake City UT laser & medspa' },
  // Kansas City
  { name: 'Skin Authority MedSpa KC', owner: 'Dr. Margaret Gould', location: 'Kansas City, MO', phone: '(816) 531-7546', website: 'https://www.skinauthoritykc.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Kansas City MO medspa' },
  { name: 'Fountain of Youth MedSpa KC', owner: 'Dr. Angie Grellner', location: 'Kansas City, MO', phone: '(816) 655-0550', website: 'https://www.fountainofyouthkc.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Kansas City MO medical spa & anti-aging' },
  { name: 'KC Laser & Aesthetics', owner: 'Dr. Lynn Anderson', location: 'Kansas City, MO', phone: '(816) 279-5500', website: 'https://www.kclaseraesthetics.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Kansas City MO laser medspa' },
  // Pittsburgh
  { name: 'MedSpa at UPMC', owner: 'Dr. Joseph Rosen', location: 'Pittsburgh, PA', phone: '(412) 647-3220', website: 'https://www.upmc.com/medspa', hasWebsite: 'Yes', wqs: 7, opp: 7, notes: 'Pittsburgh PA hospital-affiliated medspa' },
  { name: 'Pittsburgh Plastic Surgery MedSpa', owner: 'Dr. Mario Imola', location: 'Pittsburgh, PA', phone: '(412) 281-4000', website: 'https://www.pittsburghplasticsurgery.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Pittsburgh PA medspa & plastic surgery' },
  { name: 'Harmony MedSpa Pittsburgh', owner: 'Dr. Kim Aaronson', location: 'Pittsburgh, PA', phone: '(412) 432-8888', website: 'https://www.harmonymedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Pittsburgh PA medical spa — Botox, fillers, laser' },
];

(async () => {
  console.log('💆 MedSpa Prospects — Batch 5 (Boston + Raleigh + SLC + Kansas City + Pittsburgh)');
  let total = 0;
  for (let i = 0; i < prospects.length; i++) {
    const p = prospects[i];
    await addMedSpa(p, i + 1);
    console.log(`  ✓ ${p.name} (${p.location})`);
    total++;
    await sleep(300);
  }
  console.log(`\n✅ MedSpa Batch 5 complete — ${total} prospects added.`);
})();
