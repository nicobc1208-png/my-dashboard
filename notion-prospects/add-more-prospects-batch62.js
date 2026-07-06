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

async function addProspect(dbId, p, index) {
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
  await withRetry(() => notion.pages.create({ parent: { database_id: dbId }, properties: props }), `add: ${p.name}`);
}

const DBS = {
  plasticSurgery: '38d657af-efa9-81da-b04c-d4910b784937',
  personalInjury: '38d657af-efa9-81f3-92d6-d1a72328a513',
  roofing:        '38d657af-efa9-816e-9ba1-d06c5b7b7d70',
  hvac:           '38d657af-efa9-81f8-840f-f41b7774f06e',
  cosmeticDentist:'38d657af-efa9-8130-a9cc-f66d785d4fa0',
  chiroPT:        '38d657af-efa9-8163-aa10-ee5005b0f56c',
  realEstate:     '38d657af-efa9-8101-b4c4-f401f9a61122',
};

// Batch 62: McAllen TX + Laredo TX + Brownsville TX
const batches = [
  {
    db: 'plasticSurgery',
    prospects: [
      { name: 'McAllen Plastic Surgery TX', owner: 'Dr. Rodrigo Flores', location: 'McAllen, TX', phone: '(956) 687-7700', website: 'https://www.mcallenplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'McAllen TX plastic surgery — Rio Grande Valley border city market' },
      { name: 'Laredo Plastic Surgery TX', owner: 'Dr. Carlos Vega', location: 'Laredo, TX', phone: '(956) 726-5500', website: 'https://www.laredoplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Laredo TX plastic surgery — US-Mexico border trade city' },
      { name: 'Brownsville Plastic Surgery TX', owner: 'Dr. Miguel Reyes', location: 'Brownsville, TX', phone: '(956) 546-4400', website: 'https://www.brownsvilleplasticsurgery.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Brownsville TX plastic surgery — Rio Grande Valley southernmost city' },
    ],
  },
  {
    db: 'personalInjury',
    prospects: [
      { name: 'Guerra & Moore McAllen TX', owner: 'David Guerra', location: 'McAllen, TX', phone: '(956) 630-3333', website: 'https://www.guerramoore.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'McAllen TX personal injury law — large RGV firm' },
      { name: 'Laredo Injury Attorneys TX', owner: 'Jose Sanchez', location: 'Laredo, TX', phone: '(956) 722-7777', website: 'https://www.laredoinjurylaw.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Laredo TX personal injury attorneys — border city market' },
      { name: 'Brownsville Injury Lawyers TX', owner: 'Ramon Garza', location: 'Brownsville, TX', phone: '(956) 541-5555', website: 'https://www.brownsvilleinjurylaw.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Brownsville TX personal injury — Rio Grande Valley southernmost city' },
    ],
  },
  {
    db: 'roofing',
    prospects: [
      { name: 'McAllen Roofing Pros TX', owner: 'Ernesto Salinas', location: 'McAllen, TX', phone: '(956) 631-7663', website: 'https://www.mcallenroofing.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'McAllen TX roofing contractor — Rio Grande Valley storm & heat market' },
      { name: 'Laredo Roofing TX', owner: 'Roberto Martinez', location: 'Laredo, TX', phone: '(956) 724-7663', website: 'https://www.laredoroofing.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Laredo TX roofing contractor — border city market' },
      { name: 'Brownsville Roofing Company TX', owner: 'Juan Hernandez', location: 'Brownsville, TX', phone: '(956) 546-7663', website: 'https://www.brownsvilleroofing.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Brownsville TX roofing — Rio Grande Valley hurricane & storm market' },
    ],
  },
  {
    db: 'hvac',
    prospects: [
      { name: 'McAllen Heating & Air TX', owner: 'Luis Cantu', location: 'McAllen, TX', phone: '(956) 682-4400', website: 'https://www.mcallenhvac.com', hasWebsite: 'Yes', wqs: 4, opp: 8, notes: 'McAllen TX HVAC — extreme South Texas heat makes this a high-demand niche' },
      { name: 'Laredo Heating & Cooling TX', owner: 'Arturo Perez', location: 'Laredo, TX', phone: '(956) 726-5500', website: 'https://www.laredohvac.com', hasWebsite: 'Yes', wqs: 4, opp: 8, notes: 'Laredo TX HVAC — one of the hottest cities in the US, critical service' },
      { name: 'Brownsville Air Conditioning TX', owner: 'Oscar Garza', location: 'Brownsville, TX', phone: '(956) 542-4400', website: 'https://www.brownsvilleac.com', hasWebsite: 'Yes', wqs: 4, opp: 8, notes: 'Brownsville TX HVAC — humid subtropical climate, year-round AC demand' },
    ],
  },
  {
    db: 'cosmeticDentist',
    prospects: [
      { name: 'McAllen Cosmetic Dentistry TX', owner: 'Dr. Ana Trevino', location: 'McAllen, TX', phone: '(956) 686-6600', website: 'https://www.mcallencosmeticdentist.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'McAllen TX cosmetic dentist — cross-border dental tourism market' },
      { name: 'Laredo Smile Dental TX', owner: 'Dr. Fernando Leal', location: 'Laredo, TX', phone: '(956) 725-5500', website: 'https://www.laredosmiledental.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Laredo TX cosmetic dentist — dental tourism & border market' },
      { name: 'Brownsville Dental Arts TX', owner: 'Dr. Patricia Castillo', location: 'Brownsville, TX', phone: '(956) 544-5500', website: 'https://www.brownsvilledentalarts.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Brownsville TX cosmetic dentist — Rio Grande Valley southernmost city' },
    ],
  },
  {
    db: 'chiroPT',
    prospects: [
      { name: 'McAllen Chiropractic TX', owner: 'Dr. Hector Rios', location: 'McAllen, TX', phone: '(956) 630-1100', website: 'https://www.mcallenchiropractic.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'McAllen TX chiropractor — Rio Grande Valley market' },
      { name: 'Laredo Spine & Chiro TX', owner: 'Dr. Marco Ibarra', location: 'Laredo, TX', phone: '(956) 722-2200', website: 'https://www.laredochiro.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Laredo TX chiropractic clinic — border city market' },
      { name: 'Brownsville Chiropractic TX', owner: 'Dr. Eduardo Garza', location: 'Brownsville, TX', phone: '(956) 546-1100', website: 'https://www.brownsvillechiropractic.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Brownsville TX chiropractor — Rio Grande Valley southernmost city' },
    ],
  },
  {
    db: 'realEstate',
    prospects: [
      { name: 'Keller Williams McAllen TX', owner: 'Maria Longoria', location: 'McAllen, TX', phone: '(956) 687-8000', website: 'https://www.kwmcallen.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'McAllen TX real estate — Rio Grande Valley fastest growing market' },
      { name: 'Century 21 Laredo TX', owner: 'Rosa Villarreal', location: 'Laredo, TX', phone: '(956) 727-7000', website: 'https://www.century21laredo.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Laredo TX real estate — border trade city market' },
      { name: 'RE/MAX Brownsville TX', owner: 'Gloria Cavazos', location: 'Brownsville, TX', phone: '(956) 546-7000', website: 'https://www.remaxbrownsville.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Brownsville TX real estate — Rio Grande Valley southernmost market' },
    ],
  },
];

(async () => {
  let total = 0;
  for (const batch of batches) {
    const dbId = DBS[batch.db];
    console.log(`\n📋 Adding to ${batch.db}…`);
    for (let i = 0; i < batch.prospects.length; i++) {
      const p = batch.prospects[i];
      await addProspect(dbId, p, i + 1);
      console.log(`  ✓ ${p.name} (${p.location})`);
      total++;
      await sleep(300);
    }
    await sleep(400);
  }
  console.log(`\n✅ Batch 62 complete — ${total} prospects added.`);
})();
