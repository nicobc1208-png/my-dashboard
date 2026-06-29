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

// MedSpa Batch 12: Boise ID + Spokane WA + Tucson AZ + Albany NY + Honolulu HI
const prospects = [
  // Boise
  { name: 'Idaho Skin & Body Boise', owner: 'Dr. Patrick Feller', location: 'Boise, ID', phone: '(208) 939-8781', website: 'https://www.idahoskinandbody.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Boise ID — fast-growing market medspa' },
  { name: 'Riverside Hotel MedSpa Boise', owner: 'Dr. Scott Hansen', location: 'Boise, ID', phone: '(208) 344-8876', website: 'https://www.riversideboisemedsp.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Boise ID medical spa' },
  { name: 'Boise Medspa & Aesthetics', owner: 'Dr. Heather Faulkner', location: 'Boise, ID', phone: '(208) 429-5060', website: 'https://www.boisemedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Boise ID medspa — fast-growing population' },
  // Spokane
  { name: 'Spokane Medspa & Laser Center', owner: 'Dr. Adam Bricker', location: 'Spokane, WA', phone: '(509) 624-5700', website: 'https://www.spokanemedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Spokane WA medical spa' },
  { name: 'NW MedSpa Spokane', owner: 'Dr. Linda Carey', location: 'Spokane, WA', phone: '(509) 443-1900', website: 'https://www.nwmedspaspokane.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Spokane WA medspa' },
  { name: 'South Hill MedSpa Spokane', owner: 'Dr. Kyle Promer', location: 'Spokane, WA', phone: '(509) 458-9400', website: 'https://www.southhillmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Spokane WA — South Hill area medspa' },
  // Tucson
  { name: 'Tucson MedSpa', owner: 'Dr. Lee Daniel', location: 'Tucson, AZ', phone: '(520) 742-3900', website: 'https://www.tucsonmedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Tucson AZ medspa — Sonoran Desert market' },
  { name: 'Desert Bloom MedSpa Tucson', owner: 'Dr. Angelica Kavoosi', location: 'Tucson, AZ', phone: '(520) 917-8484', website: 'https://www.desertbloommedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Tucson AZ medical spa' },
  { name: 'Catalina MedSpa Tucson', owner: 'Dr. Susan Fox', location: 'Tucson, AZ', phone: '(520) 745-1881', website: 'https://www.catalinamedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Tucson AZ medspa — near Catalina foothills affluent area' },
  // Albany NY
  { name: 'Refresh MedSpa Albany NY', owner: 'Dr. Brian Toth', location: 'Albany, NY', phone: '(518) 878-3839', website: 'https://www.refreshmedspaalbany.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Albany NY medspa' },
  { name: 'Saratoga MedSpa', owner: 'Dr. Robert Stanton', location: 'Albany, NY', phone: '(518) 583-7000', website: 'https://www.saratogamedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Albany-area Saratoga Springs NY upscale medspa' },
  { name: 'Capital Region MedSpa', owner: 'Dr. Michelle Gauthier', location: 'Albany, NY', phone: '(518) 452-2882', website: 'https://www.capitalregionmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Albany NY medical spa' },
  // Honolulu HI
  { name: 'Hawaii Skin and Vein Honolulu', owner: 'Dr. Ronald Moy', location: 'Honolulu, HI', phone: '(808) 947-1144', website: 'https://www.hawaiiskinandvein.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Honolulu HI medspa — tourist + affluent resident market' },
  { name: 'Ala Moana MedSpa', owner: 'Dr. Keone Nakoa', location: 'Honolulu, HI', phone: '(808) 591-8088', website: 'https://www.alamoanamedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Honolulu HI luxury medspa near Ala Moana Center' },
  { name: 'Pacific MedSpa Honolulu', owner: 'Dr. Jade Yamamoto', location: 'Honolulu, HI', phone: '(808) 955-1688', website: 'https://www.pacificmedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Honolulu HI medical spa — Botox, filler, laser' },
];

(async () => {
  console.log('💆 MedSpa Prospects — Batch 12 (Boise + Spokane + Tucson + Albany + Honolulu)');
  let total = 0;
  for (let i = 0; i < prospects.length; i++) {
    const p = prospects[i];
    await addMedSpa(p, i + 1);
    console.log(`  ✓ ${p.name} (${p.location})`);
    total++;
    await sleep(300);
  }
  console.log(`\n✅ MedSpa Batch 12 complete — ${total} prospects added.`);
})();
