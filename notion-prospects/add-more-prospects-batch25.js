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

// Batch 25: Wichita KS + Madison WI + Fayetteville AR
const batches = [
  {
    db: 'plasticSurgery',
    prospects: [
      { name: 'Mid-America Plastic Surgery', owner: 'Dr. Grant Stevens', location: 'Wichita, KS', phone: '(316) 683-3420', website: 'https://www.midamericaplasticsurgery.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Wichita KS plastic surgery' },
      { name: 'American Family Children\'s Hospital Plastics', owner: 'Dr. Rene Soto', location: 'Madison, WI', phone: '(608) 263-9700', website: 'https://www.uwhealth.org/plasticsurgery', hasWebsite: 'Yes', wqs: 7, opp: 6, notes: 'Madison WI plastic surgery — academic center' },
      { name: 'Ozark Plastic Surgery', owner: 'Dr. Craig Rosen', location: 'Fayetteville, AR', phone: '(479) 521-8900', website: 'https://www.ozarkplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Fayetteville AR plastic surgery' },
    ],
  },
  {
    db: 'personalInjury',
    prospects: [
      { name: 'Hutton & Hutton Law Firm', owner: 'Boyd Hutton', location: 'Wichita, KS', phone: '(316) 688-1166', website: 'https://www.huttonlaw.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Wichita KS personal injury law' },
      { name: 'Gruber Law Offices', owner: 'Craig Gruber', location: 'Madison, WI', phone: '(608) 257-5444', website: 'https://www.gruberlaw.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Madison WI personal injury law' },
      { name: 'Slocum Law Firm', owner: 'John Slocum', location: 'Fayetteville, AR', phone: '(479) 783-2690', website: 'https://www.slocumlawfirm.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Fayetteville AR personal injury' },
    ],
  },
  {
    db: 'roofing',
    prospects: [
      { name: 'Wichita Roofing & Exteriors', owner: 'Todd Sawyer', location: 'Wichita, KS', phone: '(316) 945-8555', website: 'https://www.wichitaroofingandexteriors.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Wichita KS roofing contractor — hail market' },
      { name: 'Madison Roofing Co.', owner: 'Steve Gruber', location: 'Madison, WI', phone: '(608) 249-8484', website: 'https://www.madisonroofingco.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Madison WI roofing contractor' },
      { name: 'Ozark Roofing & Construction', owner: 'Brad Holt', location: 'Fayetteville, AR', phone: '(479) 442-7663', website: 'https://www.ozarkroofing.net', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Fayetteville AR roofing' },
    ],
  },
  {
    db: 'hvac',
    prospects: [
      { name: 'Wichita Heating & Air', owner: 'Ron Massey', location: 'Wichita, KS', phone: '(316) 265-1781', website: 'https://www.wichitaheatingandair.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Wichita KS HVAC company' },
      { name: 'Temperature Pro Madison', owner: 'Dave Haas', location: 'Madison, WI', phone: '(608) 630-0400', website: 'https://www.temperaturepromadison.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Madison WI HVAC' },
      { name: 'Aire Serv of NW Arkansas', owner: 'Chris West', location: 'Fayetteville, AR', phone: '(479) 443-1700', website: 'https://www.aireservnwa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Fayetteville NW Arkansas HVAC' },
    ],
  },
  {
    db: 'cosmeticDentist',
    prospects: [
      { name: 'East Kellogg Dental', owner: 'Dr. Ronald Eck', location: 'Wichita, KS', phone: '(316) 684-5781', website: 'https://www.eastkelloggdental.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Wichita KS cosmetic dentist' },
      { name: 'Monroe Street Family Dental', owner: 'Dr. James Raleigh', location: 'Madison, WI', phone: '(608) 238-8200', website: 'https://www.monroestreetdental.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Madison WI cosmetic dentist' },
      { name: 'Aspen Dental Fayetteville', owner: 'Dr. Cara Rogers', location: 'Fayetteville, AR', phone: '(479) 251-0033', website: 'https://www.aspendental.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Fayetteville AR cosmetic dental — chain location' },
    ],
  },
  {
    db: 'chiroPT',
    prospects: [
      { name: 'Back to Health Chiropractic Wichita', owner: 'Dr. Shawn Davern', location: 'Wichita, KS', phone: '(316) 687-5050', website: 'https://www.backtohealth.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Wichita KS chiropractic' },
      { name: 'Active Care Chiropractic Madison', owner: 'Dr. Joel Carlson', location: 'Madison, WI', phone: '(608) 838-9800', website: 'https://www.activecarechiro.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Madison WI chiropractor' },
      { name: 'Abundant Life Chiropractic', owner: 'Dr. Greg Welch', location: 'Fayetteville, AR', phone: '(479) 443-7070', website: 'https://www.abundantlifechiro.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Fayetteville AR chiropractor' },
    ],
  },
  {
    db: 'realEstate',
    prospects: [
      { name: 'Berkshire Hathaway HomeServices PenFed Wichita', owner: 'Paul Welch', location: 'Wichita, KS', phone: '(316) 942-4200', website: 'https://www.bhhspenfed.com', hasWebsite: 'Yes', wqs: 7, opp: 7, notes: 'Wichita KS real estate' },
      { name: 'Stark Company Realtors', owner: 'James Stark', location: 'Madison, WI', phone: '(608) 441-6100', website: 'https://www.thestarkcompany.com', hasWebsite: 'Yes', wqs: 7, opp: 7, notes: 'Madison WI established real estate firm' },
      { name: 'Lindsey & Associates Realty', owner: 'Waco Lindsey', location: 'Fayetteville, AR', phone: '(479) 443-8485', website: 'https://www.lindsey-associates.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Fayetteville AR real estate' },
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
  console.log(`\n✅ Batch 25 complete — ${total} prospects added.`);
})();
