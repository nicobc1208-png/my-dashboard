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

// Batch 22: Knoxville TN + Chattanooga TN + El Paso TX
const batches = [
  {
    db: 'plasticSurgery',
    prospects: [
      { name: 'Tennessee Plastic Surgery', owner: 'Dr. Brian Lavy', location: 'Knoxville, TN', phone: '(865) 769-2177', website: 'https://www.tennesseeplasticsurgery.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Knoxville TN plastic surgery' },
      { name: 'Plastic Surgery Associates of Chattanooga', owner: 'Dr. James Romanelli', location: 'Chattanooga, TN', phone: '(423) 648-4011', website: 'https://www.plasticsurgerychattanooga.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Chattanooga TN plastic surgery' },
      { name: 'El Paso Cosmetic Surgery', owner: 'Dr. William Andrade', location: 'El Paso, TX', phone: '(915) 351-1116', website: 'https://www.elpasocosmeticsurgery.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'El Paso TX plastic surgery' },
    ],
  },
  {
    db: 'personalInjury',
    prospects: [
      { name: 'Banks & Jones Law Firm', owner: 'Ron Sharpe', location: 'Knoxville, TN', phone: '(865) 546-2141', website: 'https://www.banksandjones.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Knoxville TN personal injury' },
      { name: 'McMahan Law Firm', owner: 'Chris McMahan', location: 'Chattanooga, TN', phone: '(423) 265-1000', website: 'https://www.mcmahanlaw.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Chattanooga TN personal injury law' },
      { name: 'Rosales Law Partners', owner: 'Jaime Rosales', location: 'El Paso, TX', phone: '(915) 219-5516', website: 'https://www.rosaleslawpartners.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'El Paso personal injury — Spanish-speaking market' },
    ],
  },
  {
    db: 'roofing',
    prospects: [
      { name: 'Patriot Roofing Knoxville', owner: 'Tyler Black', location: 'Knoxville, TN', phone: '(865) 973-0197', website: 'https://www.patriotroofingknoxville.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Knoxville TN roofing' },
      { name: 'Chattanooga Roofing Pro', owner: 'Greg Wallis', location: 'Chattanooga, TN', phone: '(423) 702-7700', website: 'https://www.chattroofingpro.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Chattanooga TN roofing contractor' },
      { name: 'Supreme Roofing El Paso', owner: 'Carlos Mendez', location: 'El Paso, TX', phone: '(915) 533-3302', website: 'https://www.supremeroofingep.com', hasWebsite: 'Yes', wqs: 4, opp: 8, notes: 'El Paso TX roofing — bilingual market' },
    ],
  },
  {
    db: 'hvac',
    prospects: [
      { name: 'Airmatic Heating & Cooling', owner: 'David Byrd', location: 'Knoxville, TN', phone: '(865) 212-7331', website: 'https://www.airmaticknoxville.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Knoxville TN HVAC' },
      { name: 'Chattanooga Heating & Air', owner: 'Steve Morton', location: 'Chattanooga, TN', phone: '(423) 894-0007', website: 'https://www.chattanoogaheatingandair.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Chattanooga TN HVAC company' },
      { name: 'El Paso Air Conditioning', owner: 'Miguel Torres', location: 'El Paso, TX', phone: '(915) 772-4400', website: 'https://www.elpasoac.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'El Paso TX HVAC — hot desert climate = high demand' },
    ],
  },
  {
    db: 'cosmeticDentist',
    prospects: [
      { name: 'Knoxville Smiles', owner: 'Dr. Christopher Huff', location: 'Knoxville, TN', phone: '(865) 584-6163', website: 'https://www.knoxvillesmiles.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Knoxville TN cosmetic dentistry' },
      { name: 'Image Dental Studio', owner: 'Dr. James Branton', location: 'Chattanooga, TN', phone: '(423) 296-0050', website: 'https://www.imagedental.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Chattanooga TN cosmetic dentist' },
      { name: 'Smiles of El Paso', owner: 'Dr. Diana Gonzalez', location: 'El Paso, TX', phone: '(915) 590-0022', website: 'https://www.smilesofelpaso.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'El Paso TX cosmetic dentist — bilingual practice' },
    ],
  },
  {
    db: 'chiroPT',
    prospects: [
      { name: 'Powell Chiropractic', owner: 'Dr. Casey Powell', location: 'Knoxville, TN', phone: '(865) 687-9339', website: 'https://www.powellchiropractic.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Knoxville TN chiropractor' },
      { name: 'Scenic City Chiropractic', owner: 'Dr. Mike Barnes', location: 'Chattanooga, TN', phone: '(423) 267-4477', website: 'https://www.sceniccitychiro.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Chattanooga TN chiropractic' },
      { name: 'Border Land Chiropractic', owner: 'Dr. Robert Faz', location: 'El Paso, TX', phone: '(915) 599-1111', website: 'https://www.borderlandchiro.com', hasWebsite: 'Yes', wqs: 4, opp: 8, notes: 'El Paso TX chiropractor' },
    ],
  },
  {
    db: 'realEstate',
    prospects: [
      { name: 'Alliance Sothebys Realty Knoxville', owner: 'David Campbell', location: 'Knoxville, TN', phone: '(865) 584-8280', website: 'https://www.alliancesothebysrealty.com', hasWebsite: 'Yes', wqs: 7, opp: 7, notes: 'Knoxville TN luxury real estate' },
      { name: 'Keller Williams Greater Chattanooga', owner: 'Chad Hendrix', location: 'Chattanooga, TN', phone: '(423) 664-1600', website: 'https://www.kwchattanooga.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Chattanooga TN real estate' },
      { name: 'Desert Hills Real Estate', owner: 'Luis Valenzuela', location: 'El Paso, TX', phone: '(915) 613-0550', website: 'https://www.deserthillsrealestate.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'El Paso TX real estate' },
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
  console.log(`\n✅ Batch 22 complete — ${total} prospects added.`);
})();
