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

// Batch 41: Savannah GA + Augusta GA + Macon GA
const batches = [
  {
    db: 'plasticSurgery',
    prospects: [
      { name: 'Savannah Plastic Surgery', owner: 'Dr. Craig Mezrow', location: 'Savannah, GA', phone: '(912) 354-7200', website: 'https://www.savannahplasticsurgery.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Savannah GA plastic surgery — historic coastal market' },
      { name: 'Augusta Plastic Surgery', owner: 'Dr. James Namnoum', location: 'Augusta, GA', phone: '(706) 922-5011', website: 'https://www.augustaplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Augusta GA plastic surgery' },
      { name: 'Macon Plastic Surgery & Aesthetics', owner: 'Dr. Patricia Watkins', location: 'Macon, GA', phone: '(478) 477-5210', website: 'https://www.maconplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Macon GA plastic surgery — Middle Georgia market' },
    ],
  },
  {
    db: 'personalInjury',
    prospects: [
      { name: 'Harris Lowry Manton Savannah', owner: 'Jeff Harris', location: 'Savannah, GA', phone: '(912) 651-9967', website: 'https://www.hlmlawfirm.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Savannah GA personal injury — well-known GA firm' },
      { name: 'Nicholson Revell Augusta', owner: 'Greg Nicholson', location: 'Augusta, GA', phone: '(706) 722-8784', website: 'https://www.nicholsonrevell.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Augusta GA personal injury' },
      { name: 'Ward Law Group Macon', owner: 'Ben Ward', location: 'Macon, GA', phone: '(478) 742-6481', website: 'https://www.wardlawgroupga.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Macon GA personal injury law' },
    ],
  },
  {
    db: 'roofing',
    prospects: [
      { name: 'Savannah Roofing Experts', owner: 'Dave Logan', location: 'Savannah, GA', phone: '(912) 233-7663', website: 'https://www.savannahroofing.com', hasWebsite: 'Yes', wqs: 4, opp: 8, notes: 'Savannah GA roofing — coastal storm market' },
      { name: 'Augusta Roofing Company', owner: 'Phil Garrett', location: 'Augusta, GA', phone: '(706) 733-7663', website: 'https://www.augustaroofingco.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Augusta GA roofing contractor' },
      { name: 'Macon Roofing Solutions', owner: 'Kent Fuller', location: 'Macon, GA', phone: '(478) 477-7663', website: 'https://www.maconroofingsolutions.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Macon GA roofing contractor' },
    ],
  },
  {
    db: 'hvac',
    prospects: [
      { name: 'Savannah Heating & Air', owner: 'Randy Ellis', location: 'Savannah, GA', phone: '(912) 355-0100', website: 'https://www.savannahheatingandair.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Savannah GA HVAC — hot humid coastal climate' },
      { name: 'Augusta HVAC Services', owner: 'Greg Owens', location: 'Augusta, GA', phone: '(706) 860-0004', website: 'https://www.augustahvac.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Augusta GA HVAC' },
      { name: 'Middle Georgia AC & Heating Macon', owner: 'Tom Aldridge', location: 'Macon, GA', phone: '(478) 788-5100', website: 'https://www.middlegeorgiaac.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Macon GA HVAC — hot climate' },
    ],
  },
  {
    db: 'cosmeticDentist',
    prospects: [
      { name: 'Savannah Dental Solutions', owner: 'Dr. John Lanzetta', location: 'Savannah, GA', phone: '(912) 354-4432', website: 'https://www.savannahdental.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Savannah GA cosmetic dentist' },
      { name: 'Augusta Dental Arts', owner: 'Dr. Steve Goolsby', location: 'Augusta, GA', phone: '(706) 738-5900', website: 'https://www.augustadentalarts.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Augusta GA cosmetic dentist' },
      { name: 'Macon Family & Cosmetic Dentistry', owner: 'Dr. Brad Caudill', location: 'Macon, GA', phone: '(478) 477-7901', website: 'https://www.maconcosmetic.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Macon GA cosmetic dentist' },
    ],
  },
  {
    db: 'chiroPT',
    prospects: [
      { name: 'Savannah Chiropractic & Wellness', owner: 'Dr. Robert Roetger', location: 'Savannah, GA', phone: '(912) 351-0400', website: 'https://www.savannahchiro.com', hasWebsite: 'Yes', wqs: 4, opp: 8, notes: 'Savannah GA chiropractor' },
      { name: 'Augusta Spine & Chiropractic', owner: 'Dr. Kevin Sparrow', location: 'Augusta, GA', phone: '(706) 733-7224', website: 'https://www.augustaspinechiro.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Augusta GA chiropractic' },
      { name: 'Macon Chiropractic Center', owner: 'Dr. Travis Gilbert', location: 'Macon, GA', phone: '(478) 745-4888', website: 'https://www.maconchirocenter.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Macon GA chiropractor' },
    ],
  },
  {
    db: 'realEstate',
    prospects: [
      { name: 'Seabolt Real Estate Savannah', owner: 'Tom Seabolt', location: 'Savannah, GA', phone: '(912) 233-6000', website: 'https://www.seaboltre.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Savannah GA large real estate brokerage' },
      { name: 'Blanchard & Calhoun Augusta', owner: 'Jim Blanchard', location: 'Augusta, GA', phone: '(706) 722-3000', website: 'https://www.blanchard-calhoun.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Augusta GA large established real estate firm' },
      { name: 'Century 21 Macon', owner: 'Randy Pruett', location: 'Macon, GA', phone: '(478) 788-8888', website: 'https://www.c21macon.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Macon GA real estate brokerage' },
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
  console.log(`\n✅ Batch 41 complete — ${total} prospects added.`);
})();
