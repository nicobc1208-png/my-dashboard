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

// MedSpa Batch 1: New York + Los Angeles + Miami + Dallas + Houston
const prospects = [
  // New York
  { name: 'Sadick Dermatology', owner: 'Dr. Neil Sadick', location: 'New York, NY', phone: '(212) 772-7242', website: 'https://www.sadickdermatology.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Manhattan medspa/dermatology — botox, fillers, laser' },
  { name: 'MedEsthetics NYC', owner: 'Dr. Lisa Zdinak', location: 'New York, NY', phone: '(212) 751-0355', website: 'https://www.medestheticsnyc.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'NYC medical aesthetics & medspa' },
  { name: 'Elure MedSpa', owner: 'Dr. Jeanine Downie', location: 'New York, NY', phone: '(973) 509-6900', website: 'https://www.imageofbeautyspa.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'NY area medspa — laser treatments' },
  // Los Angeles
  { name: 'Epione Beverly Hills', owner: 'Dr. Simon Ourian', location: 'Beverly Hills, CA', phone: '(310) 271-8927', website: 'https://www.epione.com', hasWebsite: 'Yes', wqs: 9, opp: 9, notes: 'Celebrity medspa — excellent social media presence but could upgrade automations' },
  { name: 'LoveSkin Medspa', owner: 'Dr. Sheila Nazarian', location: 'Los Angeles, CA', phone: '(310) 777-5060', website: 'https://www.sheila-md.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'LA luxury medspa — Botox, filler, laser' },
  { name: 'Skin Pharm', owner: 'Dr. Amy Brodsky', location: 'Los Angeles, CA', phone: '(310) 943-9440', website: 'https://www.skinpharm.com', hasWebsite: 'Yes', wqs: 8, opp: 7, notes: 'LA medspa chain expanding fast' },
  // Miami
  { name: 'Sunset Cosmetic MedSpa', owner: 'Dr. Deborah Longwill', location: 'Miami, FL', phone: '(305) 279-8100', website: 'https://www.sunsetcosmetic.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Miami FL medspa & cosmetic dermatology' },
  { name: 'Infinite Med Spa', owner: 'Dr. Maria Garriga', location: 'Miami, FL', phone: '(305) 456-9999', website: 'https://www.infinitemedspamiami.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Miami FL med spa — injectables & body contouring' },
  { name: 'Brickell Medical Center MedSpa', owner: 'Dr. Carlos Wolf', location: 'Miami, FL', phone: '(305) 595-2969', website: 'https://www.wolffacial.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Miami Brickell medspa — facial rejuvenation' },
  // Dallas
  { name: 'Beautologie MedSpa Dallas', owner: 'Dr. Jennifer Walden', location: 'Dallas, TX', phone: '(512) 328-8855', website: 'https://www.beautologie.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Dallas area medspa & aesthetic medicine' },
  { name: 'Sonterra Dermatology', owner: 'Dr. Sherry Ingraham', location: 'Dallas, TX', phone: '(210) 860-0585', website: 'https://www.sonderradermatology.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Dallas TX medspa & dermatology' },
  { name: 'Corsair Med Spa', owner: 'Kimberly Farr', location: 'Dallas, TX', phone: '(214) 396-7050', website: 'https://www.corsairmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Dallas TX med spa — upscale clientele' },
  // Houston
  { name: 'Azure MD Med Spa', owner: 'Dr. Daniel Ezekwesili', location: 'Houston, TX', phone: '(281) 565-5655', website: 'https://www.azuremd.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Houston TX medspa — aesthetics & wellness' },
  { name: 'Skin by Lovely', owner: 'Lovely Jackson', location: 'Houston, TX', phone: '(713) 554-1949', website: 'https://www.skinbylovely.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Houston TX medical aesthetics spa' },
  { name: 'The Beauty Bar Medspa', owner: 'Dr. Amanda Quezada', location: 'Houston, TX', phone: '(713) 487-4131', website: 'https://www.thebeautybarmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Houston TX medspa — Botox, Dysport, fillers' },
];

(async () => {
  console.log('💆 MedSpa Prospects — Batch 1 (NY + LA + Miami + Dallas + Houston)');
  let total = 0;
  for (let i = 0; i < prospects.length; i++) {
    const p = prospects[i];
    await addMedSpa(p, i + 1);
    console.log(`  ✓ ${p.name} (${p.location})`);
    total++;
    await sleep(300);
  }
  console.log(`\n✅ MedSpa Batch 1 complete — ${total} prospects added.`);
})();
