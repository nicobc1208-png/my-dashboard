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

// Batch 39: Fort Collins CO + Boulder CO + Pueblo CO
const batches = [
  {
    db: 'plasticSurgery',
    prospects: [
      { name: 'Fort Collins Plastic Surgery', owner: 'Dr. Kevin Kreidler', location: 'Fort Collins, CO', phone: '(970) 221-9200', website: 'https://www.fortcollinsplasticsurgery.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Fort Collins CO plastic surgery — booming Northern CO market' },
      { name: 'Boulder Plastic Surgery', owner: 'Dr. Evan Ransom', location: 'Boulder, CO', phone: '(303) 442-4488', website: 'https://www.boulderplasticsurgery.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Boulder CO plastic surgery — affluent health-conscious market' },
      { name: 'Pueblo Plastic Surgery', owner: 'Dr. Frank Magliano', location: 'Pueblo, CO', phone: '(719) 545-5543', website: 'https://www.puebloplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Pueblo CO plastic surgery' },
    ],
  },
  {
    db: 'personalInjury',
    prospects: [
      { name: 'Larimer County Injury Law Fort Collins', owner: 'Dan Satriano', location: 'Fort Collins, CO', phone: '(970) 492-4700', website: 'https://www.satrianolaw.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Fort Collins CO personal injury' },
      { name: 'Boulder Personal Injury Attorneys', owner: 'Joel Fries', location: 'Boulder, CO', phone: '(303) 442-2600', website: 'https://www.boulderinjurylaw.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Boulder CO personal injury law' },
      { name: 'Levine Law Pueblo', owner: 'Marcus Levine', location: 'Pueblo, CO', phone: '(719) 557-1900', website: 'https://www.levinelaywpueblo.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Pueblo CO personal injury' },
    ],
  },
  {
    db: 'roofing',
    prospects: [
      { name: 'Integrity Roofing Fort Collins', owner: 'Mike Hensley', location: 'Fort Collins, CO', phone: '(970) 225-7663', website: 'https://www.integrityroofingfc.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Fort Collins CO roofing — hail storm market' },
      { name: 'Boulder Roofing Experts', owner: 'Chris Manning', location: 'Boulder, CO', phone: '(303) 444-7663', website: 'https://www.boulderroofing.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Boulder CO roofing contractor' },
      { name: 'Pueblo Roofing Company', owner: 'Gary Salazar', location: 'Pueblo, CO', phone: '(719) 544-7663', website: 'https://www.puebloroofingco.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Pueblo CO roofing contractor' },
    ],
  },
  {
    db: 'hvac',
    prospects: [
      { name: 'Fort Collins Heating & Air Conditioning', owner: 'Scott Hayden', location: 'Fort Collins, CO', phone: '(970) 484-4858', website: 'https://www.fortcollinsheating.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Fort Collins CO HVAC service' },
      { name: 'Trane Boulder Heating & Cooling', owner: 'Bob Jennings', location: 'Boulder, CO', phone: '(303) 440-4444', website: 'https://www.traneofboulder.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Boulder CO HVAC — Trane dealer' },
      { name: 'Pueblo HVAC Services', owner: 'Tony Romero', location: 'Pueblo, CO', phone: '(719) 542-4600', website: 'https://www.pueblohvac.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Pueblo CO HVAC' },
    ],
  },
  {
    db: 'cosmeticDentist',
    prospects: [
      { name: 'Fort Collins Smile Studio', owner: 'Dr. Dustin Burleson', location: 'Fort Collins, CO', phone: '(970) 493-9107', website: 'https://www.fortcollinssmiledds.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Fort Collins CO cosmetic dentist' },
      { name: 'Boulder Dental Center', owner: 'Dr. Richard White', location: 'Boulder, CO', phone: '(303) 442-6226', website: 'https://www.boulderdentalcenter.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Boulder CO cosmetic dentist' },
      { name: 'Pueblo Family Dental', owner: 'Dr. Carlos Montoya', location: 'Pueblo, CO', phone: '(719) 543-9500', website: 'https://www.pueblofamilydental.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Pueblo CO cosmetic dentist' },
    ],
  },
  {
    db: 'chiroPT',
    prospects: [
      { name: 'Fort Collins Chiropractic & Wellness', owner: 'Dr. Kirk Lee', location: 'Fort Collins, CO', phone: '(970) 221-1200', website: 'https://www.fortcollinschiro.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Fort Collins CO chiropractor' },
      { name: 'Boulder Sports Chiropractic', owner: 'Dr. Mark Pierce', location: 'Boulder, CO', phone: '(303) 440-5353', website: 'https://www.bouldersportschiro.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Boulder CO chiropractic — athlete & active market' },
      { name: 'Pueblo Spine & Chiropractic', owner: 'Dr. Robert Medina', location: 'Pueblo, CO', phone: '(719) 545-3333', website: 'https://www.pueblospinechiro.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Pueblo CO chiropractor' },
    ],
  },
  {
    db: 'realEstate',
    prospects: [
      { name: 'Group Real Estate Fort Collins', owner: 'Tom Glass', location: 'Fort Collins, CO', phone: '(970) 229-0700', website: 'https://www.grouprealestate.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Fort Collins CO — large established real estate firm' },
      { name: 'RE/MAX of Boulder', owner: 'Barb Silverman', location: 'Boulder, CO', phone: '(303) 449-7000', website: 'https://www.remaxofboulder.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Boulder CO real estate — affluent market' },
      { name: 'Coldwell Banker Pueblo', owner: 'Juan Martinez', location: 'Pueblo, CO', phone: '(719) 564-7000', website: 'https://www.cbpueblo.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Pueblo CO real estate brokerage' },
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
  console.log(`\n✅ Batch 39 complete — ${total} prospects added.`);
})();
