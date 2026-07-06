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

// MedSpa Batch 14: Reno NV + Tucson AZ + Shreveport LA + Des Moines IA + Huntsville AL
const prospects = [
  // Reno NV
  { name: 'Aesthetics by Design Reno', owner: 'Dr. Barbara Persons', location: 'Reno, NV', phone: '(775) 329-8000', website: 'https://www.aestheticsbydesignreno.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Reno NV medspa — injectables and laser' },
  { name: 'Renew MedSpa Reno', owner: 'Dr. James Larson', location: 'Reno, NV', phone: '(775) 786-9100', website: 'https://www.renewmedsparen.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Reno NV medical spa' },
  { name: 'LUX MedSpa Reno', owner: 'Dr. Samantha Hoppe', location: 'Reno, NV', phone: '(775) 333-7589', website: 'https://www.luxmedsparen.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Reno NV luxury medspa' },
  // Tucson AZ (additional)
  { name: 'Saguaro MedSpa Tucson', owner: 'Dr. Robert Sherris', location: 'Tucson, AZ', phone: '(520) 322-7600', website: 'https://www.saguaromedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Tucson AZ medspa — desert market' },
  { name: 'Rincon MedSpa Tucson', owner: 'Dr. Alexandra Avila', location: 'Tucson, AZ', phone: '(520) 290-1444', website: 'https://www.rinconmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Tucson AZ East side medspa' },
  { name: 'Sonoran Skin Care Tucson', owner: 'Dr. Patricia Wier', location: 'Tucson, AZ', phone: '(520) 696-9000', website: 'https://www.sonoranskincare.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Tucson AZ medspa & skin care' },
  // Shreveport LA
  { name: 'Shreveport MedSpa', owner: 'Dr. Gary Ledford', location: 'Shreveport, LA', phone: '(318) 631-8000', website: 'https://www.shreveportmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Shreveport LA medical spa' },
  { name: 'Red River MedSpa Shreveport', owner: 'Dr. Lisa Fontenot', location: 'Shreveport, LA', phone: '(318) 797-1100', website: 'https://www.redrivermedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Shreveport LA medspa' },
  { name: 'Bossier MedSpa Shreveport', owner: 'Dr. Mark Stacy', location: 'Shreveport, LA', phone: '(318) 747-3000', website: 'https://www.bossiermedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Shreveport/Bossier City LA medical spa' },
  // Des Moines IA
  { name: 'Des Moines MedSpa & Laser', owner: 'Dr. Diana Rush', location: 'Des Moines, IA', phone: '(515) 277-8900', website: 'https://www.desmoinesmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Des Moines IA medical spa' },
  { name: 'Iowa Laser MedSpa Des Moines', owner: 'Dr. Brian Lawler', location: 'Des Moines, IA', phone: '(515) 255-8100', website: 'https://www.iowalaser.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Des Moines IA medspa — laser aesthetics' },
  { name: 'Prairie MedSpa Des Moines', owner: 'Dr. Susan Hicks', location: 'Des Moines, IA', phone: '(515) 327-8989', website: 'https://www.prairiemedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Des Moines IA medspa' },
  // Huntsville AL
  { name: 'Huntsville MedSpa & Aesthetics', owner: 'Dr. Gregory Goodreau', location: 'Huntsville, AL', phone: '(256) 533-1600', website: 'https://www.huntsvillemedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Huntsville AL medspa — NASA tech corridor market' },
  { name: 'Rocket City MedSpa Huntsville', owner: 'Dr. Amanda Walters', location: 'Huntsville, AL', phone: '(256) 881-3200', website: 'https://www.rocketcitymedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Huntsville AL medical spa' },
  { name: 'Lux Aesthetics Huntsville', owner: 'Dr. Jennifer Schwalb', location: 'Huntsville, AL', phone: '(256) 270-4500', website: 'https://www.luxaestheticshuntsville.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Huntsville AL luxury medspa' },
];

(async () => {
  console.log('💆 MedSpa Prospects — Batch 14 (Reno + Tucson + Shreveport + Des Moines + Huntsville)');
  let total = 0;
  for (const p of prospects) {
    await addMedSpa(p);
    console.log(`  ✓ ${p.name} (${p.location})`);
    total++;
    await sleep(300);
  }
  console.log(`\n✅ MedSpa Batch 14 complete — ${total} prospects added.`);
})();
