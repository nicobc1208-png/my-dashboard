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

// Batch 26: Shreveport LA + Montgomery AL + Augusta GA
const batches = [
  {
    db: 'plasticSurgery',
    prospects: [
      { name: 'Willis Knighton Plastic Surgery', owner: 'Dr. Ravi Lachhman', location: 'Shreveport, LA', phone: '(318) 212-0600', website: 'https://www.wkplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Shreveport LA plastic surgery' },
      { name: 'Alabama Plastic Surgery', owner: 'Dr. Bruce Cunningham', location: 'Montgomery, AL', phone: '(334) 281-0405', website: 'https://www.alabamaplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Montgomery AL plastic surgery' },
      { name: 'Augusta Plastic Surgery', owner: 'Dr. Jeffrey Hollowell', location: 'Augusta, GA', phone: '(706) 755-4445', website: 'https://www.augustaplasticsurgery.net', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Augusta GA plastic surgery' },
    ],
  },
  {
    db: 'personalInjury',
    prospects: [
      { name: 'Shreveport Injury Lawyers', owner: 'Donnie Haskel', location: 'Shreveport, LA', phone: '(318) 629-9999', website: 'https://www.shreveportinjurylawyers.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Shreveport LA personal injury' },
      { name: 'Gracie Law Firm Montgomery', owner: 'James Gracie', location: 'Montgomery, AL', phone: '(334) 277-8700', website: 'https://www.gracielaw.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Montgomery AL personal injury law' },
      { name: 'Murphy Law Firm Augusta', owner: 'Tim Murphy', location: 'Augusta, GA', phone: '(706) 722-7799', website: 'https://www.murphylawfirmaugusta.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Augusta GA personal injury' },
    ],
  },
  {
    db: 'roofing',
    prospects: [
      { name: 'Shreveport Roofing Experts', owner: 'Dale Watts', location: 'Shreveport, LA', phone: '(318) 213-2000', website: 'https://www.shreveportroofingexperts.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Shreveport LA roofing' },
      { name: 'Montgomery Roofing Company', owner: 'Alex Dawson', location: 'Montgomery, AL', phone: '(334) 590-6060', website: 'https://www.montgomeryroofingco.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Montgomery AL roofing contractor' },
      { name: 'Augusta Roofing & Siding', owner: 'Tom Butler', location: 'Augusta, GA', phone: '(706) 860-1500', website: 'https://www.augustaroofing.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Augusta GA roofing' },
    ],
  },
  {
    db: 'hvac',
    prospects: [
      { name: 'Professional Cooling & Heating Shreveport', owner: 'Bill Garrett', location: 'Shreveport, LA', phone: '(318) 631-3722', website: 'https://www.procoolshreveport.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Shreveport LA HVAC' },
      { name: 'Blue Dot Services Montgomery', owner: 'Rick Hammond', location: 'Montgomery, AL', phone: '(334) 222-7300', website: 'https://www.bluedotmontgomery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Montgomery AL HVAC service' },
      { name: 'Augusta Heating & Air', owner: 'Gary Peeler', location: 'Augusta, GA', phone: '(706) 863-0220', website: 'https://www.augustaheatingair.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Augusta GA HVAC' },
    ],
  },
  {
    db: 'cosmeticDentist',
    prospects: [
      { name: 'Bright Smile Dental Shreveport', owner: 'Dr. Kim Nguyen', location: 'Shreveport, LA', phone: '(318) 797-7200', website: 'https://www.brightsmiledental.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Shreveport LA cosmetic dentist' },
      { name: 'Midtown Dental Montgomery', owner: 'Dr. James Askew', location: 'Montgomery, AL', phone: '(334) 263-6112', website: 'https://www.midtowndentalal.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Montgomery AL cosmetic dentist' },
      { name: 'Evans Dental Group Augusta', owner: 'Dr. Todd Irwin', location: 'Augusta, GA', phone: '(706) 860-5882', website: 'https://www.evansdentalgroup.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Augusta GA cosmetic dental' },
    ],
  },
  {
    db: 'chiroPT',
    prospects: [
      { name: 'Shreveport Chiropractic Center', owner: 'Dr. Lisa Webb', location: 'Shreveport, LA', phone: '(318) 798-8866', website: 'https://www.shreveportchiro.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Shreveport LA chiropractor' },
      { name: 'Family Chiropractic Montgomery', owner: 'Dr. Mark Hale', location: 'Montgomery, AL', phone: '(334) 277-4444', website: 'https://www.familychiromgm.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Montgomery AL chiropractic' },
      { name: 'Augusta Wellness & Chiropractic', owner: 'Dr. Scott Viera', location: 'Augusta, GA', phone: '(706) 738-7373', website: 'https://www.augustawellness.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Augusta GA chiropractic & wellness' },
    ],
  },
  {
    db: 'realEstate',
    prospects: [
      { name: 'Coldwell Banker Gosslee Shreveport', owner: 'Todd Gosslee', location: 'Shreveport, LA', phone: '(318) 861-5300', website: 'https://www.cbgosslee.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Shreveport LA real estate' },
      { name: 'ERA Landmark Real Estate Montgomery', owner: 'Susan Byrd', location: 'Montgomery, AL', phone: '(334) 272-1500', website: 'https://www.eralandmarkmgm.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Montgomery AL real estate brokerage' },
      { name: 'Meybohm Real Estate Augusta', owner: 'Henry Meybohm', location: 'Augusta, GA', phone: '(706) 863-8218', website: 'https://www.meybohm.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Augusta GA established real estate firm' },
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
  console.log(`\n✅ Batch 26 complete — ${total} prospects added.`);
})();
