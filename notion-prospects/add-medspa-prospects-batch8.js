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

// MedSpa Batch 8: Scottsdale AZ + Boca Raton FL + Naples FL + Sarasota FL + Palm Beach FL
const prospects = [
  // Scottsdale (affluent market)
  { name: 'Scottsdale Center for Plastic Surgery', owner: 'Dr. Robert Cohen', location: 'Scottsdale, AZ', phone: '(480) 423-1515', website: 'https://www.scottsdalecenterforca.com', hasWebsite: 'Yes', wqs: 8, opp: 10, notes: 'Scottsdale AZ high-end medspa — luxury Desert market' },
  { name: 'Trillium Aesthetics Scottsdale', owner: 'Dr. Tim Jochen', location: 'Scottsdale, AZ', phone: '(480) 418-8777', website: 'https://www.trilliumaesthetics.com', hasWebsite: 'Yes', wqs: 7, opp: 9, notes: 'Scottsdale AZ luxury medspa' },
  { name: 'The Gallery of Cosmetic Surgery Scottsdale', owner: 'Dr. Steven Rueckl', location: 'Scottsdale, AZ', phone: '(480) 563-5990', website: 'https://www.galleryofcosmeticsurgery.com', hasWebsite: 'Yes', wqs: 7, opp: 9, notes: 'Scottsdale AZ medspa & cosmetic surgery' },
  // Boca Raton FL (wealthy retirement + resident market)
  { name: 'Boca Raton Plastic Surgery & MedSpa', owner: 'Dr. Steven Hochwald', location: 'Boca Raton, FL', phone: '(561) 367-9101', website: 'https://www.bocaratonplasticsurgery.com', hasWebsite: 'Yes', wqs: 7, opp: 9, notes: 'Boca Raton FL luxury medspa — affluent market' },
  { name: 'Lumenis MedSpa Boca Raton', owner: 'Dr. Mary Ann Copson', location: 'Boca Raton, FL', phone: '(561) 416-4960', website: 'https://www.lumenismedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 9, notes: 'Boca Raton FL medspa — body contouring & laser' },
  { name: 'Allure MedSpa Boca Raton', owner: 'Dr. Landon Pryor', location: 'Boca Raton, FL', phone: '(561) 395-1220', website: 'https://www.alluremedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 9, notes: 'Boca Raton FL medical spa' },
  // Naples FL (wealthy retiree market)
  { name: 'Naples Plastic Surgery MedSpa', owner: 'Dr. Adam Schulman', location: 'Naples, FL', phone: '(239) 261-5950', website: 'https://www.naplesplasticsurgery.com', hasWebsite: 'Yes', wqs: 7, opp: 9, notes: 'Naples FL luxury medspa — ultra-affluent market' },
  { name: 'Fifth Avenue Aesthetics Naples', owner: 'Dr. Jennifer Parker', location: 'Naples, FL', phone: '(239) 261-4200', website: 'https://www.fifthavenuenaples.com', hasWebsite: 'Yes', wqs: 7, opp: 9, notes: 'Naples FL high-end medspa — 5th Ave area' },
  { name: 'Sophistique MedSpa Naples', owner: 'Dr. Harvey Zarem', location: 'Naples, FL', phone: '(239) 596-5550', website: 'https://www.sophistiquemedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 9, notes: 'Naples FL medspa — wealthy retiree clientele' },
  // Sarasota FL
  { name: 'Sarasota MedSpa', owner: 'Dr. Robert Gourley', location: 'Sarasota, FL', phone: '(941) 954-5977', website: 'https://www.sarasotamedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Sarasota FL medspa & aesthetics' },
  { name: 'Gulf Coast MedSpa Sarasota', owner: 'Dr. Sheryl Pilcher', location: 'Sarasota, FL', phone: '(941) 365-3311', website: 'https://www.gulfcoastmedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Sarasota FL medical spa' },
  { name: 'La Belle Vie MedSpa Sarasota', owner: 'Dr. Evelyn Shumaker', location: 'Sarasota, FL', phone: '(941) 552-4900', website: 'https://www.labelleviemedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Sarasota FL boutique medspa' },
  // Palm Beach FL
  { name: 'Palm Beach Medspa', owner: 'Dr. Jack Abrams', location: 'Palm Beach, FL', phone: '(561) 659-4045', website: 'https://www.palmbeachmedspa.com', hasWebsite: 'Yes', wqs: 7, opp: 9, notes: 'Palm Beach FL — ultra-luxury medspa market' },
  { name: 'Aesthetic Center of the Palm Beaches', owner: 'Dr. Joshua Greenwald', location: 'Palm Beach, FL', phone: '(561) 655-8200', website: 'https://www.aestheticcenterpalm.com', hasWebsite: 'Yes', wqs: 7, opp: 9, notes: 'Palm Beach FL luxury aesthetics medspa' },
  { name: 'The Medspa at Palm Beach', owner: 'Dr. Lana Fagien', location: 'Palm Beach, FL', phone: '(561) 997-5700', website: 'https://www.palmbeachmedspa2.com', hasWebsite: 'Yes', wqs: 6, opp: 9, notes: 'Palm Beach FL medical spa — affluent clientele' },
];

(async () => {
  console.log('💆 MedSpa Prospects — Batch 8 (Scottsdale + Boca Raton + Naples + Sarasota + Palm Beach)');
  let total = 0;
  for (let i = 0; i < prospects.length; i++) {
    const p = prospects[i];
    await addMedSpa(p, i + 1);
    console.log(`  ✓ ${p.name} (${p.location})`);
    total++;
    await sleep(300);
  }
  console.log(`\n✅ MedSpa Batch 8 complete — ${total} prospects added.`);
})();
