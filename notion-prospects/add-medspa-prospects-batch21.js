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

// MedSpa Batch 21: Santa Fe NM + Albuquerque NM + El Paso TX + Jackson MS + Montgomery AL
const prospects = [
  // Santa Fe NM
  { name: 'Santa Fe MedSpa & Laser', owner: 'Dr. Deborah Hartman', location: 'Santa Fe, NM', phone: '(505) 989-8800', website: 'https://www.santafemedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Santa Fe NM medspa — affluent arts colony market' },
  { name: 'Canyon Road MedSpa Santa Fe', owner: 'Dr. Ann Farr', location: 'Santa Fe, NM', phone: '(505) 820-0033', website: 'https://www.canyonroadmedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Santa Fe NM luxury medspa — Canyon Road arts district' },
  { name: 'High Desert MedSpa Santa Fe', owner: 'Dr. Lawrence Banks', location: 'Santa Fe, NM', phone: '(505) 471-7700', website: 'https://www.highdesertmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Santa Fe NM medical spa' },
  // Albuquerque NM (additional)
  { name: 'Duke City MedSpa Albuquerque', owner: 'Dr. Maria Romero', location: 'Albuquerque, NM', phone: '(505) 299-8800', website: 'https://www.dukecitymedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Albuquerque NM medspa' },
  { name: 'Rio Grande MedSpa Albuquerque', owner: 'Dr. Frank Torres', location: 'Albuquerque, NM', phone: '(505) 838-3800', website: 'https://www.riograndemedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Albuquerque NM medical spa' },
  { name: 'Sandia MedSpa Albuquerque', owner: 'Dr. Jennifer Chavez', location: 'Albuquerque, NM', phone: '(505) 294-9700', website: 'https://www.sandiamedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Albuquerque NM medspa — Sandia Mountains area' },
  // El Paso TX (additional)
  { name: 'El Paso MedSpa & Aesthetics', owner: 'Dr. Carlos Murillo', location: 'El Paso, TX', phone: '(915) 533-5800', website: 'https://www.elpasomedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'El Paso TX medspa — border city market' },
  { name: 'Franklin Mountains MedSpa El Paso', owner: 'Dr. Rosario Delgado', location: 'El Paso, TX', phone: '(915) 584-7700', website: 'https://www.franklinmtnsmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'El Paso TX medical spa' },
  { name: 'Sun City MedSpa El Paso', owner: 'Dr. Luis Hernandez', location: 'El Paso, TX', phone: '(915) 491-8800', website: 'https://www.suncitymedspaep.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'El Paso TX medspa — Sun City area' },
  // Jackson MS (additional)
  { name: 'Jackson Medical Spa', owner: 'Dr. Thomas Hayes', location: 'Jackson, MS', phone: '(601) 899-7700', website: 'https://www.jacksonmedicalspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Jackson MS medspa' },
  { name: 'Ridgeland MedSpa Jackson', owner: 'Dr. Susan Brooks', location: 'Jackson, MS', phone: '(601) 853-4400', website: 'https://www.ridgelandmedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Jackson MS suburban area medspa' },
  { name: 'Capital City MedSpa Jackson MS', owner: 'Dr. Ronald Craig', location: 'Jackson, MS', phone: '(601) 987-0700', website: 'https://www.capitalcitymedspams.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Jackson MS medical spa' },
  // Montgomery AL
  { name: 'Montgomery MedSpa & Laser', owner: 'Dr. Phillip Evans', location: 'Montgomery, AL', phone: '(334) 277-0900', website: 'https://www.montgomerymedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Montgomery AL medspa — state capital market' },
  { name: 'Magnolia MedSpa Montgomery', owner: 'Dr. Sharon Wood', location: 'Montgomery, AL', phone: '(334) 260-4800', website: 'https://www.magnoliamedspaal.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Montgomery AL medical spa' },
  { name: 'River Region MedSpa Montgomery', owner: 'Dr. James Peterson', location: 'Montgomery, AL', phone: '(334) 213-8800', website: 'https://www.riverregionmedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Montgomery AL medspa — River Region area' },
];

(async () => {
  console.log('💆 MedSpa Prospects — Batch 21 (Santa Fe + Albuquerque + El Paso + Jackson MS + Montgomery AL)');
  let total = 0;
  for (const p of prospects) {
    await addMedSpa(p);
    console.log(`  ✓ ${p.name} (${p.location})`);
    total++;
    await sleep(300);
  }
  console.log(`\n✅ MedSpa Batch 21 complete — ${total} prospects added.`);
})();
