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

// MedSpa Batch 11: Detroit + Grand Rapids + St Louis + Omaha + Buffalo
const prospects = [
  // Detroit
  { name: 'Detroit MedSpa', owner: 'Dr. Anthony Youn', location: 'Detroit, MI', phone: '(248) 537-9681', website: 'https://www.younplasticssurgery.com', hasWebsite: 'Yes', wqs: 7, opp: 7, notes: 'Detroit MI — celebrity doctor medspa' },
  { name: 'Birminghan Beaumont MedSpa', owner: 'Dr. David Morrow', location: 'Detroit, MI', phone: '(248) 642-5200', website: 'https://www.birminghambeaumont.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Detroit Birmingham suburb medspa' },
  { name: 'Skin Renewal Systems Detroit', owner: 'Dr. Dana Meyers', location: 'Detroit, MI', phone: '(248) 594-0100', website: 'https://www.skinrenewal.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Detroit MI medspa & laser aesthetics' },
  // Grand Rapids
  { name: 'Ada MedSpa Grand Rapids', owner: 'Dr. Carolyn Piper', location: 'Grand Rapids, MI', phone: '(616) 676-0900', website: 'https://www.adamedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Grand Rapids MI medspa — affluent Ada suburb' },
  { name: 'Grand Rapids Medical Spa', owner: 'Dr. William Yates', location: 'Grand Rapids, MI', phone: '(616) 459-1900', website: 'https://www.grandrapidsmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Grand Rapids MI medical spa' },
  { name: 'Pure Medspa Grand Rapids', owner: 'Dr. Sarah Peterson', location: 'Grand Rapids, MI', phone: '(616) 957-9880', website: 'https://www.puremedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Grand Rapids MI medspa' },
  // St Louis
  { name: 'St. Louis MedSpa', owner: 'Dr. Lesley Rabach', location: 'St. Louis, MO', phone: '(314) 991-0782', website: 'https://www.stlouismedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'St. Louis MO medical spa' },
  { name: 'Chateau Med Spa St Louis', owner: 'Dr. Gary Branham', location: 'St. Louis, MO', phone: '(314) 863-4444', website: 'https://www.chateaumedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'St. Louis MO medspa' },
  { name: 'CosmeticaStl MedSpa', owner: 'Dr. Cristiana Ballantine', location: 'St. Louis, MO', phone: '(314) 569-3833', website: 'https://www.cosmeticastl.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'St. Louis MO medical spa & aesthetics' },
  // Omaha
  { name: 'Skintegrity MedSpa Omaha', owner: 'Dr. Broc Pratt', location: 'Omaha, NE', phone: '(402) 502-7546', website: 'https://www.skintegrity.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Omaha NE medspa' },
  { name: 'Omaha MedSpa & Cosmetics', owner: 'Dr. Chad Robbins', location: 'Omaha, NE', phone: '(402) 334-5070', website: 'https://www.omahamedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Omaha NE medical spa' },
  { name: 'Elite Laser MedSpa Omaha', owner: 'Dr. Rebecca Larson', location: 'Omaha, NE', phone: '(402) 391-7777', website: 'https://www.elitelaseromaha.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Omaha NE medspa — laser & injectables' },
  // Buffalo
  { name: 'Buffalo MedSpa & Laser', owner: 'Dr. Marcia Driscoll', location: 'Buffalo, NY', phone: '(716) 631-4500', website: 'https://www.buffalomedsp.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Buffalo NY medspa' },
  { name: 'Amherst MedSpa Buffalo', owner: 'Dr. Sheryl Clark', location: 'Buffalo, NY', phone: '(716) 639-1300', website: 'https://www.amherstmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Buffalo NY suburb — Amherst medspa' },
  { name: 'Synergy MedSpa Buffalo', owner: 'Dr. Gary Cassel', location: 'Buffalo, NY', phone: '(716) 633-3003', website: 'https://www.synergymedspa.net', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Buffalo NY medical spa & aesthetics' },
];

(async () => {
  console.log('💆 MedSpa Prospects — Batch 11 (Detroit + Grand Rapids + St Louis + Omaha + Buffalo)');
  let total = 0;
  for (let i = 0; i < prospects.length; i++) {
    const p = prospects[i];
    await addMedSpa(p, i + 1);
    console.log(`  ✓ ${p.name} (${p.location})`);
    total++;
    await sleep(300);
  }
  console.log(`\n✅ MedSpa Batch 11 complete — ${total} prospects added.`);
})();
