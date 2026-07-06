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

// MedSpa Batch 9: Oklahoma City + Tulsa + Albuquerque + El Paso + Louisville
const prospects = [
  // Oklahoma City
  { name: 'Makeover MedSpa OKC', owner: 'Dr. Alan Durkin', location: 'Oklahoma City, OK', phone: '(405) 418-6887', website: 'https://www.makeovermedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Oklahoma City OK medspa' },
  { name: 'Skin Elite OKC', owner: 'Dr. Lain Javier', location: 'Oklahoma City, OK', phone: '(405) 840-3333', website: 'https://www.skineliteokc.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Oklahoma City OK medical spa & aesthetics' },
  { name: 'The Studio MedSpa OKC', owner: 'Dr. Sarah Nading', location: 'Oklahoma City, OK', phone: '(405) 755-6000', website: 'https://www.studiomedspaokc.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Oklahoma City OK boutique medspa' },
  // Tulsa
  { name: 'Aqua MedSpa Tulsa', owner: 'Dr. Bradley Jabour', location: 'Tulsa, OK', phone: '(918) 481-3400', website: 'https://www.aquameds Paqtulsa.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Tulsa OK medspa' },
  { name: 'Skin Oasis MedSpa Tulsa', owner: 'Dr. Grant Stevens', location: 'Tulsa, OK', phone: '(918) 770-6611', website: 'https://www.skinoasistulsa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Tulsa OK medical spa' },
  { name: 'Renew MedSpa Tulsa', owner: 'Dr. Jason Tarr', location: 'Tulsa, OK', phone: '(918) 742-1200', website: 'https://www.renewmedspatulsa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Tulsa OK medspa — Botox & fillers' },
  // Albuquerque
  { name: 'New Mexico MedSpa', owner: 'Dr. Frank Lowe', location: 'Albuquerque, NM', phone: '(505) 247-2020', website: 'https://www.nmmedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Albuquerque NM medical spa' },
  { name: 'ABQ MedSpa & Aesthetics', owner: 'Dr. Angela Havens', location: 'Albuquerque, NM', phone: '(505) 883-5200', website: 'https://www.abqmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Albuquerque NM medspa' },
  { name: 'Southwest Medspa Albuquerque', owner: 'Dr. Mark Schwartz', location: 'Albuquerque, NM', phone: '(505) 293-3737', website: 'https://www.southwestmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Albuquerque NM medical spa & laser' },
  // El Paso
  { name: 'El Paso MedSpa', owner: 'Dr. Edgar Contreras', location: 'El Paso, TX', phone: '(915) 757-7500', website: 'https://www.elpasomedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'El Paso TX medspa — bilingual border market' },
  { name: 'Bello MedSpa El Paso', owner: 'Dr. Maria Solis', location: 'El Paso, TX', phone: '(915) 598-4400', website: 'https://www.bellomedspaep.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'El Paso TX medical spa — Spanish-speaking clientele' },
  { name: 'Flawless MedSpa El Paso', owner: 'Dr. Carlos Rivera', location: 'El Paso, TX', phone: '(915) 599-8800', website: 'https://www.flawlessmedsp.com', hasWebsite: 'Yes', wqs: 4, opp: 8, notes: 'El Paso TX medspa' },
  // Louisville
  { name: 'Louisville Laser & Aesthetics', owner: 'Dr. Michael Olding', location: 'Louisville, KY', phone: '(502) 897-4700', website: 'https://www.louisvillelaser.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Louisville KY medspa & laser' },
  { name: 'Harmony MedSpa Louisville', owner: 'Dr. Greg Buford', location: 'Louisville, KY', phone: '(502) 897-4400', website: 'https://www.harmonymepaslouisville.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Louisville KY medical spa' },
  { name: 'Derby City MedSpa', owner: 'Dr. Susan Ryan', location: 'Louisville, KY', phone: '(502) 561-2234', website: 'https://www.derbycitymedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Louisville KY medspa — Botox, filler, laser' },
];

(async () => {
  console.log('💆 MedSpa Prospects — Batch 9 (Oklahoma City + Tulsa + Albuquerque + El Paso + Louisville)');
  let total = 0;
  for (let i = 0; i < prospects.length; i++) {
    const p = prospects[i];
    await addMedSpa(p, i + 1);
    console.log(`  ✓ ${p.name} (${p.location})`);
    total++;
    await sleep(300);
  }
  console.log(`\n✅ MedSpa Batch 9 complete — ${total} prospects added.`);
})();
