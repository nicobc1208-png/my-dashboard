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

// Batch 24: Albany NY + Huntsville AL + Corpus Christi TX
const batches = [
  {
    db: 'plasticSurgery',
    prospects: [
      { name: 'Northeast Plastic Surgery', owner: 'Dr. Daniel Mills', location: 'Albany, NY', phone: '(518) 438-0505', website: 'https://www.northeastplasticsurgery.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Albany NY plastic surgery' },
      { name: 'Lakeview Plastic Surgery', owner: 'Dr. Hayley Brown', location: 'Huntsville, AL', phone: '(256) 882-1000', website: 'https://www.lakeviewplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Huntsville AL plastic surgery' },
      { name: 'Corpus Christi Plastic Surgery', owner: 'Dr. Clyde Santangelo', location: 'Corpus Christi, TX', phone: '(361) 993-7600', website: 'https://www.corpuschristiplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Corpus Christi TX plastic surgery' },
    ],
  },
  {
    db: 'personalInjury',
    prospects: [
      { name: 'O\'Brien & Eggleston', owner: 'Craig Eggleston', location: 'Albany, NY', phone: '(518) 449-6500', website: 'https://www.obrienandeggleston.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Albany NY personal injury law' },
      { name: 'Martinson & Beason PC', owner: 'Eric Beason', location: 'Huntsville, AL', phone: '(256) 533-1667', website: 'https://www.martinsonbeason.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Huntsville AL personal injury' },
      { name: 'NuRock Law Group', owner: 'Carlos Alvarez', location: 'Corpus Christi, TX', phone: '(361) 452-1000', website: 'https://www.nrocklaw.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Corpus Christi TX personal injury' },
    ],
  },
  {
    db: 'roofing',
    prospects: [
      { name: 'Albany Roofing Solutions', owner: 'Patrick Walsh', location: 'Albany, NY', phone: '(518) 475-0011', website: 'https://www.albanyroofingsolutions.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Albany NY roofing contractor' },
      { name: 'Huntsville Roofing Company', owner: 'Mark Sellers', location: 'Huntsville, AL', phone: '(256) 701-7663', website: 'https://www.huntsvilleroofingco.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Huntsville AL roofing' },
      { name: 'Coastal Bend Roofing', owner: 'Jesse Garza', location: 'Corpus Christi, TX', phone: '(361) 887-7663', website: 'https://www.coastalbendroofing.com', hasWebsite: 'Yes', wqs: 4, opp: 8, notes: 'Corpus Christi TX — coastal roofing market' },
    ],
  },
  {
    db: 'hvac',
    prospects: [
      { name: 'Advanced Comfort Solutions Albany', owner: 'Jim Kennedy', location: 'Albany, NY', phone: '(518) 452-1066', website: 'https://www.advancedcomfortalbany.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Albany NY HVAC' },
      { name: 'Honest Air HVAC', owner: 'Tim Pryor', location: 'Huntsville, AL', phone: '(256) 539-9932', website: 'https://www.honestairhvac.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Huntsville AL HVAC service' },
      { name: 'First Choice Air Conditioning', owner: 'Ruben Santos', location: 'Corpus Christi, TX', phone: '(361) 852-3500', website: 'https://www.firstchoicecc.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Corpus Christi TX HVAC' },
    ],
  },
  {
    db: 'cosmeticDentist',
    prospects: [
      { name: 'Premier Dental Albany', owner: 'Dr. Michael Burak', location: 'Albany, NY', phone: '(518) 464-5800', website: 'https://www.premierdentalalbany.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Albany NY cosmetic dentist' },
      { name: 'Smile Design Center Huntsville', owner: 'Dr. Todd Briley', location: 'Huntsville, AL', phone: '(256) 882-8490', website: 'https://www.smiledesignhuntsville.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Huntsville AL cosmetic dentist' },
      { name: 'Bay Area Dental Center', owner: 'Dr. Paul Diaz', location: 'Corpus Christi, TX', phone: '(361) 993-7600', website: 'https://www.bayareadentalcc.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Corpus Christi TX cosmetic dentist' },
    ],
  },
  {
    db: 'chiroPT',
    prospects: [
      { name: 'Albany Chiropractic Group', owner: 'Dr. Robert Morea', location: 'Albany, NY', phone: '(518) 869-6888', website: 'https://www.albanychirogroup.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Albany NY chiropractor' },
      { name: 'Rocket City Spine & Rehab', owner: 'Dr. Josh Moon', location: 'Huntsville, AL', phone: '(256) 534-1777', website: 'https://www.rocketcityspine.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Huntsville AL chiro & rehab' },
      { name: 'South Texas Spine & Joint', owner: 'Dr. Michael Guyer', location: 'Corpus Christi, TX', phone: '(361) 993-4747', website: 'https://www.southtexasspine.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Corpus Christi TX chiropractic' },
    ],
  },
  {
    db: 'realEstate',
    prospects: [
      { name: 'Roohan Realty', owner: 'Thomas Roohan', location: 'Albany, NY', phone: '(518) 587-4500', website: 'https://www.roohanrealty.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Albany NY real estate' },
      { name: 'Crye-Leike Huntsville', owner: 'Jan Hansen', location: 'Huntsville, AL', phone: '(256) 519-0011', website: 'https://www.crye-leikehuntsville.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Huntsville AL real estate brokerage' },
      { name: 'Realty World — South Texas', owner: 'Mike Garza', location: 'Corpus Christi, TX', phone: '(361) 814-9500', website: 'https://www.rwsouthtexas.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Corpus Christi TX real estate' },
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
  console.log(`\n✅ Batch 24 complete — ${total} prospects added.`);
})();
