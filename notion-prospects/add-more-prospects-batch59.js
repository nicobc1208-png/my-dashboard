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

// Batch 59: Lubbock TX + Amarillo TX + Wichita Falls TX
const batches = [
  {
    db: 'plasticSurgery',
    prospects: [
      { name: 'Lubbock Plastic Surgery TX', owner: 'Dr. Brandon Hall', location: 'Lubbock, TX', phone: '(806) 793-4411', website: 'https://www.lubbockplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Lubbock TX plastic surgery — West Texas regional hub' },
      { name: 'Amarillo Plastic Surgery TX', owner: 'Dr. Todd Whatley', location: 'Amarillo, TX', phone: '(806) 355-7555', website: 'https://www.amarilloplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Amarillo TX plastic surgery — Texas Panhandle market' },
      { name: 'Wichita Falls Plastic Surgery TX', owner: 'Dr. Lee Weeks', location: 'Wichita Falls, TX', phone: '(940) 767-7400', website: 'https://www.wichitafallsplasticsurgery.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Wichita Falls TX plastic surgery — North Texas market' },
    ],
  },
  {
    db: 'personalInjury',
    prospects: [
      { name: 'Liggett Law Group Lubbock TX', owner: 'Chip Liggett', location: 'Lubbock, TX', phone: '(806) 744-4878', website: 'https://www.liggettlawgroup.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Lubbock TX personal injury attorneys — West Texas firm' },
      { name: 'Amarillo Personal Injury Lawyers TX', owner: 'David Mullin', location: 'Amarillo, TX', phone: '(806) 372-5050', website: 'https://www.amarilloinjurylaw.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Amarillo TX personal injury law — Texas Panhandle market' },
      { name: 'Wichita Falls Injury Law TX', owner: 'Tom Malone', location: 'Wichita Falls, TX', phone: '(940) 723-0001', website: 'https://www.wichitafallsinjurylaw.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Wichita Falls TX personal injury attorneys — North Texas market' },
    ],
  },
  {
    db: 'roofing',
    prospects: [
      { name: 'Lubbock Roofing Pros TX', owner: 'Gary Stiles', location: 'Lubbock, TX', phone: '(806) 744-7663', website: 'https://www.lubbockroofing.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Lubbock TX roofing contractor — hail storm market' },
      { name: 'Amarillo Roofing Experts TX', owner: 'Keith Arnold', location: 'Amarillo, TX', phone: '(806) 376-7663', website: 'https://www.amarilloroofing.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Amarillo TX roofing contractor — Panhandle wind & hail market' },
      { name: 'Wichita Falls Roofing TX', owner: 'Jeff Crawford', location: 'Wichita Falls, TX', phone: '(940) 767-7663', website: 'https://www.wichitafallsroofing.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Wichita Falls TX roofing contractor' },
    ],
  },
  {
    db: 'hvac',
    prospects: [
      { name: 'Lubbock Heating & Air TX', owner: 'Steve Lamb', location: 'Lubbock, TX', phone: '(806) 762-4400', website: 'https://www.lubbockhvac.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Lubbock TX HVAC service — West Texas extreme climate market' },
      { name: 'Amarillo Heating & Cooling TX', owner: 'Danny Holt', location: 'Amarillo, TX', phone: '(806) 352-4400', website: 'https://www.amarillohvac.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Amarillo TX HVAC service — Panhandle extreme temps market' },
      { name: 'Wichita Falls HVAC Service TX', owner: 'Greg Mason', location: 'Wichita Falls, TX', phone: '(940) 767-1100', website: 'https://www.wichitafallshvac.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Wichita Falls TX HVAC contractor' },
    ],
  },
  {
    db: 'cosmeticDentist',
    prospects: [
      { name: 'Lubbock Cosmetic Dentist TX', owner: 'Dr. Wayne Cotton', location: 'Lubbock, TX', phone: '(806) 795-7500', website: 'https://www.lubbockcosmeticdentist.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Lubbock TX cosmetic dentist — Tech/medical hub market' },
      { name: 'Amarillo Smile Center TX', owner: 'Dr. Richard Gentry', location: 'Amarillo, TX', phone: '(806) 355-8200', website: 'https://www.amarillosmilecenter.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Amarillo TX cosmetic dentist — Texas Panhandle market' },
      { name: 'Wichita Falls Dental Arts TX', owner: 'Dr. James Archer', location: 'Wichita Falls, TX', phone: '(940) 766-9100', website: 'https://www.wichitafallsdentalarts.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Wichita Falls TX cosmetic dentist' },
    ],
  },
  {
    db: 'chiroPT',
    prospects: [
      { name: 'Lubbock Chiropractic TX', owner: 'Dr. Paul Dobbins', location: 'Lubbock, TX', phone: '(806) 793-4331', website: 'https://www.lubbockchiropractic.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Lubbock TX chiropractor' },
      { name: 'Amarillo Spine & Chiro TX', owner: 'Dr. Mark Shamblin', location: 'Amarillo, TX', phone: '(806) 358-5555', website: 'https://www.amarillochiro.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Amarillo TX chiropractic — Panhandle market' },
      { name: 'Wichita Falls Chiropractic TX', owner: 'Dr. Alan Cox', location: 'Wichita Falls, TX', phone: '(940) 723-5000', website: 'https://www.wichitafallschiro.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Wichita Falls TX chiropractor' },
    ],
  },
  {
    db: 'realEstate',
    prospects: [
      { name: 'Keller Williams Lubbock TX', owner: 'Randy Potter', location: 'Lubbock, TX', phone: '(806) 771-7710', website: 'https://www.kwlubbock.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Lubbock TX real estate brokerage — large West Texas firm' },
      { name: 'Maxey & Thomas Real Estate Amarillo TX', owner: 'Don Maxey', location: 'Amarillo, TX', phone: '(806) 355-9600', website: 'https://www.maxeythomas.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Amarillo TX real estate brokerage — Panhandle market' },
      { name: 'Mayes Realty Wichita Falls TX', owner: 'Mike Mayes', location: 'Wichita Falls, TX', phone: '(940) 691-1000', website: 'https://www.mayesrealty.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Wichita Falls TX real estate — North Texas market' },
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
  console.log(`\n✅ Batch 59 complete — ${total} prospects added.`);
})();
