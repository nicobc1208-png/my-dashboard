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

// Batch 50: Toledo OH + Dayton OH + Akron OH
const batches = [
  {
    db: 'plasticSurgery',
    prospects: [
      { name: 'Toledo Plastic Surgery Ohio', owner: 'Dr. Ronald Schuster', location: 'Toledo, OH', phone: '(419) 531-3313', website: 'https://www.toledoplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Toledo OH plastic surgery — northwest Ohio market' },
      { name: 'Dayton Plastic Surgery', owner: 'Dr. Brent Birely', location: 'Dayton, OH', phone: '(937) 434-8888', website: 'https://www.daytonplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Dayton OH plastic surgery — Wright-Patt Air Force market' },
      { name: 'Akron Plastic Surgery', owner: 'Dr. Bahman Teimourian', location: 'Akron, OH', phone: '(330) 836-6060', website: 'https://www.akronplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Akron OH plastic surgery — northeastern Ohio market' },
    ],
  },
  {
    db: 'personalInjury',
    prospects: [
      { name: 'Sawan & Mastrosimone Toledo', owner: 'Mark Mastrosimone', location: 'Toledo, OH', phone: '(419) 255-7600', website: 'https://www.sawanatty.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Toledo OH personal injury law firm' },
      { name: 'Brannon & Associates Dayton', owner: 'Jeff Brannon', location: 'Dayton, OH', phone: '(937) 228-3731', website: 'https://www.brannonlaw.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Dayton OH personal injury attorneys' },
      { name: 'Slater & Zurz Akron', owner: 'Jim Slater', location: 'Akron, OH', phone: '(330) 762-0700', website: 'https://www.slaterzurz.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Akron OH personal injury law — well known NE Ohio firm' },
    ],
  },
  {
    db: 'roofing',
    prospects: [
      { name: 'Toledo Roofing Company Ohio', owner: 'Rick Steinke', location: 'Toledo, OH', phone: '(419) 476-7663', website: 'https://www.toledoroofing.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Toledo OH roofing contractor' },
      { name: 'Dayton Roofing Experts OH', owner: 'Jerry Neff', location: 'Dayton, OH', phone: '(937) 233-7663', website: 'https://www.daytonroofingexperts.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Dayton OH roofing contractor' },
      { name: 'Akron Roofing Pros OH', owner: 'Gary Coss', location: 'Akron, OH', phone: '(330) 928-7663', website: 'https://www.akronroofingpros.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Akron OH roofing contractor' },
    ],
  },
  {
    db: 'hvac',
    prospects: [
      { name: 'Toledo Heating & Cooling OH', owner: 'Dan Sparks', location: 'Toledo, OH', phone: '(419) 244-4100', website: 'https://www.toledoheatingcooling.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Toledo OH HVAC service' },
      { name: 'Dayton Air Experts OH', owner: 'Scott Fuller', location: 'Dayton, OH', phone: '(937) 667-7800', website: 'https://www.daytonairexperts.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Dayton OH HVAC' },
      { name: 'Akron Heating & Air OH', owner: 'Jim Mulhall', location: 'Akron, OH', phone: '(330) 836-9500', website: 'https://www.akronheatingair.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Akron OH HVAC service' },
    ],
  },
  {
    db: 'cosmeticDentist',
    prospects: [
      { name: 'Toledo Cosmetic Dentistry OH', owner: 'Dr. Gregory Hurt', location: 'Toledo, OH', phone: '(419) 882-0951', website: 'https://www.toledocosmeticdentist.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Toledo OH cosmetic dentist' },
      { name: 'Dayton Smile Center OH', owner: 'Dr. Gary Wisby', location: 'Dayton, OH', phone: '(937) 435-7400', website: 'https://www.daytonsmilecenter.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Dayton OH cosmetic dentist' },
      { name: 'Akron Dental Arts OH', owner: 'Dr. Robert Salama', location: 'Akron, OH', phone: '(330) 867-5652', website: 'https://www.akrondentalarts.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Akron OH cosmetic dentist' },
    ],
  },
  {
    db: 'chiroPT',
    prospects: [
      { name: 'Toledo Chiropractic Center OH', owner: 'Dr. Jim Goetz', location: 'Toledo, OH', phone: '(419) 472-2555', website: 'https://www.toledochiro.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Toledo OH chiropractor' },
      { name: 'Dayton Chiropractic & Wellness', owner: 'Dr. Brian Brokamp', location: 'Dayton, OH', phone: '(937) 228-9525', website: 'https://www.daytonchiro.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Dayton OH chiropractic' },
      { name: 'Akron Spine & Chiropractic OH', owner: 'Dr. Thomas Madigan', location: 'Akron, OH', phone: '(330) 867-0991', website: 'https://www.akronspinechiro.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Akron OH chiropractor' },
    ],
  },
  {
    db: 'realEstate',
    prospects: [
      { name: 'Key Realty Toledo OH', owner: 'Carol Juergensen', location: 'Toledo, OH', phone: '(419) 874-0040', website: 'https://www.keyrealtyoh.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Toledo OH large real estate firm' },
      { name: 'Irongate Inc Realtors Dayton', owner: 'Bette Price', location: 'Dayton, OH', phone: '(937) 433-3300', website: 'https://www.irongateinc.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Dayton OH established real estate brokerage' },
      { name: 'Howard Hanna Akron OH', owner: 'Helen Hanna Casey', location: 'Akron, OH', phone: '(330) 836-9300', website: 'https://www.howardhanna.com/akron', hasWebsite: 'Yes', wqs: 7, opp: 7, notes: 'Akron OH large regional real estate firm' },
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
  console.log(`\n✅ Batch 50 complete — ${total} prospects added.`);
})();
