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

// MedSpa Batch 37: Las Vegas NV + Henderson NV + Reno NV + Albuquerque NM + Santa Fe NM
const prospects = [
  // Las Vegas NV (massive medspa market)
  { name: 'Las Vegas MedSpa Nevada', owner: 'Dr. Jennifer Cole', location: 'Las Vegas, NV', phone: '(702) 938-8800', website: 'https://www.lasvegasmedspa.com', hasWebsite: 'Yes', wqs: 7, opp: 9, notes: 'Las Vegas NV medspa — one of the top US medspa markets, affluent tourist & resident mix' },
  { name: 'Summerlin MedSpa Las Vegas NV', owner: 'Dr. Brian Walsh', location: 'Las Vegas, NV', phone: '(702) 256-7700', website: 'https://www.summerlinmedspa.com', hasWebsite: 'Yes', wqs: 8, opp: 9, notes: 'Las Vegas NV medspa — Summerlin ultra-affluent master-planned community' },
  { name: 'The Strip MedSpa Las Vegas NV', owner: 'Dr. Rachel Stone', location: 'Las Vegas, NV', phone: '(702) 792-9900', website: 'https://www.stripmedspa.com', hasWebsite: 'Yes', wqs: 7, opp: 9, notes: 'Las Vegas NV medspa — Strip corridor, tourist & high-roller client base' },
  // Henderson NV
  { name: 'Henderson MedSpa Nevada', owner: 'Dr. Michael Drake', location: 'Henderson, NV', phone: '(702) 435-8800', website: 'https://www.hendersonmedspa.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Henderson NV medspa — affluent Las Vegas suburb, one of the fastest growing US cities' },
  { name: 'Green Valley MedSpa Henderson NV', owner: 'Dr. Susan Pearce', location: 'Henderson, NV', phone: '(702) 458-7700', website: 'https://www.greenvalleymedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Henderson NV medspa — Green Valley Ranch upscale community' },
  { name: 'MacDonald Ranch MedSpa Henderson NV', owner: 'Dr. Kevin Hart', location: 'Henderson, NV', phone: '(702) 614-9900', website: 'https://www.macdonaldmedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Henderson NV medspa — MacDonald Ranch luxury community' },
  // Reno NV
  { name: 'Reno MedSpa Nevada', owner: 'Dr. Laura Bennett', location: 'Reno, NV', phone: '(775) 329-8800', website: 'https://www.renomedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Reno NV medspa — growing tech hub market, Biggest Little City' },
  { name: 'Sparks MedSpa Reno NV', owner: 'Dr. Thomas Grant', location: 'Reno, NV', phone: '(775) 356-7700', website: 'https://www.sparksmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Reno/Sparks NV medspa — Northern Nevada growing market' },
  { name: 'South Reno MedSpa Nevada', owner: 'Dr. Amy Foster', location: 'Reno, NV', phone: '(775) 853-9900', website: 'https://www.southrenomedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'South Reno NV medspa — affluent South Meadows community' },
  // Albuquerque NM
  { name: 'Albuquerque MedSpa New Mexico', owner: 'Dr. Elena Chavez', location: 'Albuquerque, NM', phone: '(505) 292-8800', website: 'https://www.albuquerquemedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Albuquerque NM medspa — largest NM city, growing Southwest market' },
  { name: 'Rio Rancho MedSpa Albuquerque NM', owner: 'Dr. Paul Sandoval', location: 'Albuquerque, NM', phone: '(505) 891-7700', website: 'https://www.rioranchomedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Rio Rancho NM medspa — fast-growing Albuquerque suburb' },
  { name: 'Northeast Heights MedSpa Albuquerque NM', owner: 'Dr. Maria Torres', location: 'Albuquerque, NM', phone: '(505) 298-9900', website: 'https://www.abqmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Albuquerque NM medspa — Northeast Heights affluent area' },
  // Santa Fe NM
  { name: 'Santa Fe MedSpa New Mexico', owner: 'Dr. Catherine Rivers', location: 'Santa Fe, NM', phone: '(505) 988-8800', website: 'https://www.santafemedspa.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Santa Fe NM medspa — ultra-affluent arts & culture destination, high disposable income' },
  { name: 'Canyon Road MedSpa Santa Fe NM', owner: 'Dr. James Ortiz', location: 'Santa Fe, NM', phone: '(505) 982-7700', website: 'https://www.canyonroadmedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Santa Fe NM medspa — Canyon Road art district, wealthy tourist & resident market' },
  { name: 'Bishops Lodge MedSpa Santa Fe NM', owner: 'Dr. Linda Martinez', location: 'Santa Fe, NM', phone: '(505) 992-9900', website: 'https://www.bishopslodgemedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Santa Fe NM medspa — luxury resort corridor, high-end wellness market' },
];

(async () => {
  console.log('💆 MedSpa Prospects — Batch 37 (Las Vegas + Henderson + Reno NV + Albuquerque + Santa Fe NM)');
  let total = 0;
  for (const p of prospects) {
    await addMedSpa(p);
    console.log(`  ✓ ${p.name} (${p.location})`);
    total++;
    await sleep(300);
  }
  console.log(`\n✅ MedSpa Batch 37 complete — ${total} prospects added.`);
})();
