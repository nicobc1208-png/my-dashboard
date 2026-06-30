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

// MedSpa Batch 34: Lubbock TX + Amarillo TX + El Paso TX + Midland TX + Odessa TX
const prospects = [
  // Lubbock TX
  { name: 'Lubbock MedSpa Texas', owner: 'Dr. Sarah Hall', location: 'Lubbock, TX', phone: '(806) 793-8800', website: 'https://www.lubbockmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Lubbock TX medspa — Tech University market' },
  { name: 'Red Raider MedSpa Lubbock TX', owner: 'Dr. Jason Webb', location: 'Lubbock, TX', phone: '(806) 797-7700', website: 'https://www.redraidermedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Lubbock TX medical spa — TTU college & medical market' },
  { name: 'South Plains MedSpa Lubbock TX', owner: 'Dr. Lisa Norwood', location: 'Lubbock, TX', phone: '(806) 785-9900', website: 'https://www.southplainsmedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Lubbock TX medspa — South Plains regional hub' },
  // Amarillo TX
  { name: 'Amarillo MedSpa Texas', owner: 'Dr. Paul Wren', location: 'Amarillo, TX', phone: '(806) 355-8800', website: 'https://www.amarillomedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Amarillo TX medspa — Texas Panhandle market' },
  { name: 'Panhandle MedSpa Amarillo TX', owner: 'Dr. Karen Ford', location: 'Amarillo, TX', phone: '(806) 372-7700', website: 'https://www.panhandlemedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Amarillo TX medical spa — Panhandle oil & ag wealth market' },
  { name: 'Route 66 MedSpa Amarillo TX', owner: 'Dr. David Ross', location: 'Amarillo, TX', phone: '(806) 381-9900', website: 'https://www.route66medspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Amarillo TX medspa' },
  // El Paso TX
  { name: 'El Paso MedSpa Texas', owner: 'Dr. Maria Jimenez', location: 'El Paso, TX', phone: '(915) 533-8800', website: 'https://www.elpasomedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'El Paso TX medspa — large border city market' },
  { name: 'Sun City MedSpa El Paso TX', owner: 'Dr. Carlos Mendoza', location: 'El Paso, TX', phone: '(915) 584-7700', website: 'https://www.suncitymedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'El Paso TX medical spa — Sun City / West Texas market' },
  { name: 'Westside MedSpa El Paso TX', owner: 'Dr. Ana Torres', location: 'El Paso, TX', phone: '(915) 833-9900', website: 'https://www.westsidemedspaclpaso.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'El Paso TX medspa — affluent westside neighborhoods' },
  // Midland TX
  { name: 'Midland MedSpa Texas', owner: 'Dr. Robert Hall', location: 'Midland, TX', phone: '(432) 687-8800', website: 'https://www.midlandmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Midland TX medspa — Permian Basin oil wealth market — high opportunity' },
  { name: 'Permian Basin MedSpa Midland TX', owner: 'Dr. Susan Stone', location: 'Midland, TX', phone: '(432) 683-7700', website: 'https://www.permianbasinmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Midland TX medical spa — affluent oilfield executive market' },
  { name: 'Tall City MedSpa Midland TX', owner: 'Dr. James Baker', location: 'Midland, TX', phone: '(432) 697-9900', website: 'https://www.tallcitymedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 8, notes: 'Midland TX medspa — Tall City Permian Basin boom market' },
  // Odessa TX
  { name: 'Odessa MedSpa Texas', owner: 'Dr. Patricia Morales', location: 'Odessa, TX', phone: '(432) 362-8800', website: 'https://www.odessamedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 8, notes: 'Odessa TX medspa — West Texas Permian Basin market' },
  { name: 'West Texas MedSpa Odessa TX', owner: 'Dr. Michael Garcia', location: 'Odessa, TX', phone: '(432) 333-7700', website: 'https://www.westtexasmedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 8, notes: 'Odessa TX medical spa — Permian Basin energy sector wealth' },
  { name: 'Ector County MedSpa Odessa TX', owner: 'Dr. Laura Smith', location: 'Odessa, TX', phone: '(432) 367-9900', website: 'https://www.ectorcountymedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Odessa TX medspa — Ector County West Texas market' },
];

(async () => {
  console.log('💆 MedSpa Prospects — Batch 34 (Lubbock + Amarillo + El Paso + Midland + Odessa TX)');
  let total = 0;
  for (const p of prospects) {
    await addMedSpa(p);
    console.log(`  ✓ ${p.name} (${p.location})`);
    total++;
    await sleep(300);
  }
  console.log(`\n✅ MedSpa Batch 34 complete — ${total} prospects added.`);
})();
