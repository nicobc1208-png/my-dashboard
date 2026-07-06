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

// MedSpa Batch 19: Sioux Falls SD + Fargo ND + Billings MT + Missoula MT + Bozeman MT
const prospects = [
  // Sioux Falls SD
  { name: 'Sioux Falls MedSpa & Laser', owner: 'Dr. Craig Sherwood', location: 'Sioux Falls, SD', phone: '(605) 334-7770', website: 'https://www.siouxfallsmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Sioux Falls SD medspa — largest SD market' },
  { name: 'Prairie MedSpa Sioux Falls', owner: 'Dr. Kelli Jones', location: 'Sioux Falls, SD', phone: '(605) 271-6300', website: 'https://www.prairiemedspasd.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Sioux Falls SD medical spa' },
  { name: 'Dakota MedSpa Sioux Falls', owner: 'Dr. Scott Larsen', location: 'Sioux Falls, SD', phone: '(605) 339-0900', website: 'https://www.dakotamedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Sioux Falls SD medspa — Botox and filler' },
  // Fargo ND
  { name: 'Fargo MedSpa & Laser Center', owner: 'Dr. Jill Carlson', location: 'Fargo, ND', phone: '(701) 237-4800', website: 'https://www.fargomedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Fargo ND medical spa' },
  { name: 'Red River MedSpa Fargo', owner: 'Dr. Erik Nelson', location: 'Fargo, ND', phone: '(701) 298-8200', website: 'https://www.redrivermedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Fargo ND medspa — Red River Valley market' },
  { name: 'Northern Plains MedSpa Fargo', owner: 'Dr. Sarah Hanson', location: 'Fargo, ND', phone: '(701) 232-0099', website: 'https://www.northernplainsmedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Fargo ND medspa & aesthetics' },
  // Billings MT
  { name: 'Billings MedSpa & Aesthetics', owner: 'Dr. Tracy Gilmore', location: 'Billings, MT', phone: '(406) 651-3300', website: 'https://www.billingsmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Billings MT medspa — largest MT city market' },
  { name: 'Rimrock MedSpa Billings', owner: 'Dr. Amy Swanson', location: 'Billings, MT', phone: '(406) 248-4400', website: 'https://www.rimrockmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Billings MT medical spa — named for famous Rimrocks' },
  { name: 'Yellowstone MedSpa Billings', owner: 'Dr. Mark Dawson', location: 'Billings, MT', phone: '(406) 245-8800', website: 'https://www.yellowstonemedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Billings MT medspa' },
  // Missoula MT
  { name: 'Missoula MedSpa & Skin Care', owner: 'Dr. Jennifer Lee', location: 'Missoula, MT', phone: '(406) 542-0900', website: 'https://www.missoulamedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Missoula MT medspa — university & outdoor recreation market' },
  { name: 'Garden City MedSpa Missoula', owner: 'Dr. Paul Fraser', location: 'Missoula, MT', phone: '(406) 543-7200', website: 'https://www.gardencitymedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Missoula MT medical spa' },
  { name: 'Clark Fork MedSpa Missoula', owner: 'Dr. Donna Simmons', location: 'Missoula, MT', phone: '(406) 728-3388', website: 'https://www.clarkforkmedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Missoula MT medspa' },
  // Bozeman MT
  { name: 'Bozeman MedSpa & Laser', owner: 'Dr. Craig Nelson', location: 'Bozeman, MT', phone: '(406) 586-1900', website: 'https://www.bozemanmedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Bozeman MT medspa — fastest growing MT city, affluent tech/outdoor market' },
  { name: 'Gallatin Valley MedSpa Bozeman', owner: 'Dr. Sarah Anderson', location: 'Bozeman, MT', phone: '(406) 582-8200', website: 'https://www.gallatinvalleymedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Bozeman MT medical spa — ski resort & MSU market' },
  { name: 'Big Sky MedSpa Bozeman', owner: 'Dr. David Hoffman', location: 'Bozeman, MT', phone: '(406) 587-7100', website: 'https://www.bigskymedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Bozeman MT luxury medspa — Big Sky resort proximity' },
];

(async () => {
  console.log('💆 MedSpa Prospects — Batch 19 (Sioux Falls + Fargo + Billings + Missoula + Bozeman MT)');
  let total = 0;
  for (const p of prospects) {
    await addMedSpa(p);
    console.log(`  ✓ ${p.name} (${p.location})`);
    total++;
    await sleep(300);
  }
  console.log(`\n✅ MedSpa Batch 19 complete — ${total} prospects added.`);
})();
