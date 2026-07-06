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

// Batch 28: Anchorage AK + Honolulu HI + Colorado Springs CO
const batches = [
  {
    db: 'plasticSurgery',
    prospects: [
      { name: 'Alaska Plastic Surgery', owner: 'Dr. James Kallenberger', location: 'Anchorage, AK', phone: '(907) 561-1003', website: 'https://www.alaskaplasticsurgery.net', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Anchorage AK plastic surgery — limited competition' },
      { name: 'Honolulu Plastic Surgery', owner: 'Dr. Larry Schlesinger', location: 'Honolulu, HI', phone: '(808) 596-0888', website: 'https://www.honoluluplasticsurgery.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Honolulu HI plastic surgery — affluent tourist market' },
      { name: 'Colorado Plastic Surgery Center', owner: 'Dr. Eric Malkemus', location: 'Colorado Springs, CO', phone: '(719) 630-7969', website: 'https://www.coloradoplasticsurgery.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Colorado Springs CO plastic surgery' },
    ],
  },
  {
    db: 'personalInjury',
    prospects: [
      { name: 'Barber & Associates Anchorage', owner: 'Rex Barber', location: 'Anchorage, AK', phone: '(907) 272-8282', website: 'https://www.barberandassociates.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Anchorage AK personal injury law' },
      { name: 'Davis Levin Livingston Grande', owner: 'Mark Davis', location: 'Honolulu, HI', phone: '(808) 524-7500', website: 'https://www.davislevin.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Honolulu HI personal injury law' },
      { name: 'Clawson & Clawson Colorado Springs', owner: 'Jeremy Clawson', location: 'Colorado Springs, CO', phone: '(719) 602-5888', website: 'https://www.clawsonlaw.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Colorado Springs CO personal injury' },
    ],
  },
  {
    db: 'roofing',
    prospects: [
      { name: 'Roofing Alaska', owner: 'Tim Larson', location: 'Anchorage, AK', phone: '(907) 345-5663', website: 'https://www.roofingalaska.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Anchorage AK roofing — extreme weather market' },
      { name: 'Hawaii Roofing Contractors', owner: 'Derek Kaneko', location: 'Honolulu, HI', phone: '(808) 373-4355', website: 'https://www.hawaiiroofing.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Honolulu HI roofing contractor' },
      { name: 'Pikes Peak Roofing', owner: 'Gary Osborn', location: 'Colorado Springs, CO', phone: '(719) 550-0700', website: 'https://www.pikespeakroofing.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Colorado Springs CO roofing — hail market' },
    ],
  },
  {
    db: 'hvac',
    prospects: [
      { name: 'Enstar Natural Gas Anchorage', owner: 'Brian Bauer', location: 'Anchorage, AK', phone: '(907) 334-7600', website: 'https://www.enstargas.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Anchorage AK HVAC & heating — essential service in cold climate' },
      { name: 'Servco Pacific HVAC Honolulu', owner: 'Mark Fukunaga', location: 'Honolulu, HI', phone: '(808) 564-1300', website: 'https://www.servcohvac.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Honolulu HI HVAC — AC-heavy tropical climate' },
      { name: 'Powers Heating & Air Colorado Springs', owner: 'Jeff Powers', location: 'Colorado Springs, CO', phone: '(719) 357-6807', website: 'https://www.powersheatingandair.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Colorado Springs CO HVAC' },
    ],
  },
  {
    db: 'cosmeticDentist',
    prospects: [
      { name: 'Aesthetic Dentistry of Anchorage', owner: 'Dr. Brian Gray', location: 'Anchorage, AK', phone: '(907) 562-0400', website: 'https://www.alaskadentist.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Anchorage AK cosmetic dentist' },
      { name: 'Hawaii Family Dental Honolulu', owner: 'Dr. Jonathan Tom', location: 'Honolulu, HI', phone: '(808) 596-8000', website: 'https://www.hawaiifamilydental.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Honolulu HI cosmetic dental — chain with multiple locations' },
      { name: 'Vivos Integrated Associates Colorado Springs', owner: 'Dr. Mark Cruz', location: 'Colorado Springs, CO', phone: '(719) 596-4100', website: 'https://www.cosmeticdentistcoloradosprings.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Colorado Springs CO cosmetic dentist' },
    ],
  },
  {
    db: 'chiroPT',
    prospects: [
      { name: 'Anchorage Chiropractic Center', owner: 'Dr. Matt Lyon', location: 'Anchorage, AK', phone: '(907) 272-5000', website: 'https://www.anchoragechiro.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Anchorage AK chiropractor' },
      { name: 'Honolulu Spine & Rehab', owner: 'Dr. Gael Sherwood', location: 'Honolulu, HI', phone: '(808) 597-0779', website: 'https://www.honoluluspine.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Honolulu HI chiro & rehab' },
      { name: 'Academy Chiropractic Colorado Springs', owner: 'Dr. Jay Carper', location: 'Colorado Springs, CO', phone: '(719) 550-6100', website: 'https://www.academychiro.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Colorado Springs CO chiropractic' },
    ],
  },
  {
    db: 'realEstate',
    prospects: [
      { name: 'Jack White Real Estate Anchorage', owner: 'Bob Bartholomew', location: 'Anchorage, AK', phone: '(907) 561-1000', website: 'https://www.jackwhite.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Anchorage AK largest real estate brokerage' },
      { name: 'Coldwell Banker Pacific Properties Honolulu', owner: 'Drew Stotesbery', location: 'Honolulu, HI', phone: '(808) 596-0456', website: 'https://www.cbpacificproperties.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Honolulu HI luxury real estate' },
      { name: 'The Platinum Group Colorado Springs', owner: 'Michael Turner', location: 'Colorado Springs, CO', phone: '(719) 536-4444', website: 'https://www.theplatinumgroup.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Colorado Springs CO real estate' },
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
  console.log(`\n✅ Batch 28 complete — ${total} prospects added.`);
})();
