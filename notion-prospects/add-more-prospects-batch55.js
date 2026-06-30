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

// Batch 55: Cedar Rapids IA + Davenport IA + Topeka KS
const batches = [
  {
    db: 'plasticSurgery',
    prospects: [
      { name: 'Cedar Rapids Plastic Surgery IA', owner: 'Dr. Rollin Daniel', location: 'Cedar Rapids, IA', phone: '(319) 362-3303', website: 'https://www.cedarrapidsplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Cedar Rapids IA plastic surgery — second largest Iowa city' },
      { name: 'Davenport Plastic Surgery IA', owner: 'Dr. Karol Gutowski', location: 'Davenport, IA', phone: '(563) 324-2491', website: 'https://www.davenportplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Davenport IA plastic surgery — Quad Cities market' },
      { name: 'Topeka Plastic Surgery KS', owner: 'Dr. Randall Brown', location: 'Topeka, KS', phone: '(785) 273-1700', website: 'https://www.topekaplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Topeka KS plastic surgery — state capital market' },
    ],
  },
  {
    db: 'personalInjury',
    prospects: [
      { name: 'Jorgensen Law Cedar Rapids IA', owner: 'Tom Jorgensen', location: 'Cedar Rapids, IA', phone: '(319) 366-4343', website: 'https://www.jorgensenlawia.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Cedar Rapids IA personal injury attorneys' },
      { name: 'Davenport Injury Lawyers IA', owner: 'Rick Davidson', location: 'Davenport, IA', phone: '(563) 323-5678', website: 'https://www.davenportinjurylaw.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Davenport IA personal injury law — Quad Cities' },
      { name: 'Topeka Personal Injury KS', owner: 'David Dahl', location: 'Topeka, KS', phone: '(785) 235-9500', website: 'https://www.topekainjurylaw.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Topeka KS personal injury attorneys' },
    ],
  },
  {
    db: 'roofing',
    prospects: [
      { name: 'Cedar Rapids Roofing IA', owner: 'Gary Ketcham', location: 'Cedar Rapids, IA', phone: '(319) 366-7663', website: 'https://www.cedarrapidsroofing.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Cedar Rapids IA roofing contractor' },
      { name: 'Davenport Roofing Company IA', owner: 'Brian Rosenow', location: 'Davenport, IA', phone: '(563) 322-7663', website: 'https://www.davenportroofing.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Davenport IA roofing contractor — Quad Cities' },
      { name: 'Topeka Roofing Experts KS', owner: 'Dale Grubb', location: 'Topeka, KS', phone: '(785) 232-7663', website: 'https://www.topekaroofing.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Topeka KS roofing contractor' },
    ],
  },
  {
    db: 'hvac',
    prospects: [
      { name: 'Cedar Rapids Heating & Air IA', owner: 'Paul Faber', location: 'Cedar Rapids, IA', phone: '(319) 362-4400', website: 'https://www.cedarrapidshvac.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Cedar Rapids IA HVAC service' },
      { name: 'Davenport Heating & Cooling IA', owner: 'Steve Lorenz', location: 'Davenport, IA', phone: '(563) 323-5500', website: 'https://www.davenportheating.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Davenport IA HVAC — Quad Cities' },
      { name: 'Topeka HVAC Service KS', owner: 'Mike Lacy', location: 'Topeka, KS', phone: '(785) 233-3300', website: 'https://www.topekahvac.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Topeka KS HVAC service' },
    ],
  },
  {
    db: 'cosmeticDentist',
    prospects: [
      { name: 'Cedar Rapids Cosmetic Dentist IA', owner: 'Dr. Kevin Good', location: 'Cedar Rapids, IA', phone: '(319) 364-7645', website: 'https://www.cedarrapidsdentist.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Cedar Rapids IA cosmetic dentist' },
      { name: 'Davenport Smile Center IA', owner: 'Dr. David Pitcher', location: 'Davenport, IA', phone: '(563) 326-3337', website: 'https://www.davenportsmile.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Davenport IA cosmetic dentist — Quad Cities' },
      { name: 'Topeka Cosmetic Dentistry KS', owner: 'Dr. Mark Traster', location: 'Topeka, KS', phone: '(785) 266-5660', website: 'https://www.topekacosmeticdentist.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Topeka KS cosmetic dentist' },
    ],
  },
  {
    db: 'chiroPT',
    prospects: [
      { name: 'Cedar Rapids Chiropractic IA', owner: 'Dr. Tom Stewart', location: 'Cedar Rapids, IA', phone: '(319) 363-8401', website: 'https://www.cedarrapidschiro.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Cedar Rapids IA chiropractor' },
      { name: 'Davenport Chiro & Wellness IA', owner: 'Dr. Brad Biddick', location: 'Davenport, IA', phone: '(563) 324-5555', website: 'https://www.davenportchiro.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Davenport IA chiropractic — Quad Cities' },
      { name: 'Topeka Spine & Chiropractic KS', owner: 'Dr. Jim Charbonneau', location: 'Topeka, KS', phone: '(785) 272-9000', website: 'https://www.topekachiro.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Topeka KS chiropractor' },
    ],
  },
  {
    db: 'realEstate',
    prospects: [
      { name: 'Iowa Realty Cedar Rapids IA', owner: 'Gary Saladino', location: 'Cedar Rapids, IA', phone: '(319) 366-0101', website: 'https://www.iowarealty.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Cedar Rapids IA large real estate firm' },
      { name: 'NAI Ruhl Commercial Davenport', owner: 'Brad Buls', location: 'Davenport, IA', phone: '(563) 355-4000', website: 'https://www.ruhlcommercial.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Davenport IA real estate — Quad Cities market' },
      { name: 'Coldwell Banker Topeka KS', owner: 'Jim Davis', location: 'Topeka, KS', phone: '(785) 267-4000', website: 'https://www.cbtopeka.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Topeka KS large real estate brokerage' },
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
  console.log(`\n✅ Batch 55 complete — ${total} prospects added.`);
})();
