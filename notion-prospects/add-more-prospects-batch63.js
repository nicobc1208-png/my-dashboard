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

// Batch 63: Portland OR + Seattle WA + Salt Lake City UT
const batches = [
  {
    db: 'plasticSurgery',
    prospects: [
      { name: 'Waldorf MD Portland OR', owner: 'Dr. Mark Jewell', location: 'Portland, OR', phone: '(503) 245-2252', website: 'https://www.waldorfmd.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Portland OR plastic surgery — well-established Pacific NW aesthetic practice' },
      { name: 'Seattle Plastic Surgery WA', owner: 'Dr. Lisa Sowder', location: 'Seattle, WA', phone: '(206) 448-7500', website: 'https://www.seattleplasticsurgery.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Seattle WA plastic surgery — affluent Pacific NW tech wealth market' },
      { name: 'Utah Cosmetic Surgery Salt Lake City UT', owner: 'Dr. Steven Guthrie', location: 'Salt Lake City, UT', phone: '(801) 582-5534', website: 'https://www.utahcosmeticsurgery.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Salt Lake City UT plastic surgery — growing Utah affluent market' },
    ],
  },
  {
    db: 'personalInjury',
    prospects: [
      { name: 'Paulson Coletti Portland OR', owner: 'Eric Paulson', location: 'Portland, OR', phone: '(503) 226-7723', website: 'https://www.paulsoncoletti.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Portland OR personal injury law — established Pacific NW plaintiff firm' },
      { name: 'Elk & Elk Seattle WA', owner: 'Scott Elk', location: 'Seattle, WA', phone: '(206) 624-5666', website: 'https://www.elkandelk.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Seattle WA personal injury attorneys — large Pacific NW market' },
      { name: 'Siegfried & Jensen Salt Lake City UT', owner: 'Reed Jensen', location: 'Salt Lake City, UT', phone: '(801) 845-9000', website: 'https://www.siegfriedandjensen.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Salt Lake City UT personal injury — well-known Utah firm' },
    ],
  },
  {
    db: 'roofing',
    prospects: [
      { name: 'Bone Dry Roofing Portland OR', owner: 'Tim Walters', location: 'Portland, OR', phone: '(503) 684-5988', website: 'https://www.bonedryroofing.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Portland OR roofing — Pacific NW rainy climate makes roofing high-demand' },
      { name: 'Fischer Roofing Seattle WA', owner: 'Dan Fischer', location: 'Seattle, WA', phone: '(206) 542-3000', website: 'https://www.fischerroofing.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Seattle WA roofing contractor — Pacific NW wet climate market' },
      { name: 'Cox Roofing Salt Lake City UT', owner: 'Aaron Cox', location: 'Salt Lake City, UT', phone: '(801) 266-7663', website: 'https://www.coxroofing.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Salt Lake City UT roofing — snow & storm market' },
    ],
  },
  {
    db: 'hvac',
    prospects: [
      { name: 'Sky Heating & Air Conditioning Portland OR', owner: 'Mark Falber', location: 'Portland, OR', phone: '(503) 363-9162', website: 'https://www.skyheating.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Portland OR HVAC — Pacific NW market with seasonal heating demand' },
      { name: 'Black Hills Seattle WA', owner: 'Jeff Bishop', location: 'Seattle, WA', phone: '(253) 533-8558', website: 'https://www.blackhillsinc.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Seattle WA HVAC contractor — large Pacific NW market' },
      { name: 'Jerry\'s Enterprises Salt Lake City UT', owner: 'Jerry Schmidt', location: 'Salt Lake City, UT', phone: '(801) 597-1270', website: 'https://www.jerrysenterprises.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Salt Lake City UT HVAC — hot summers & cold winters drive year-round demand' },
    ],
  },
  {
    db: 'cosmeticDentist',
    prospects: [
      { name: 'Portland Smile Design OR', owner: 'Dr. Kevin Postol', location: 'Portland, OR', phone: '(503) 223-1322', website: 'https://www.portlandsmiledesign.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Portland OR cosmetic dentist — Pacific NW market' },
      { name: 'Seattle Aesthetic Dentistry WA', owner: 'Dr. Sarah Thompson', location: 'Seattle, WA', phone: '(206) 682-9269', website: 'https://www.seattleaestheticdentistry.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Seattle WA cosmetic dentist — affluent tech worker & professional market' },
      { name: 'Utah Cosmetic Dentist Salt Lake City UT', owner: 'Dr. David Richardson', location: 'Salt Lake City, UT', phone: '(801) 278-1010', website: 'https://www.utahcosmeticdentist.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Salt Lake City UT cosmetic dentist — growing Utah market' },
    ],
  },
  {
    db: 'chiroPT',
    prospects: [
      { name: 'Portland Chiropractic Neurology OR', owner: 'Dr. Bill Gallagher', location: 'Portland, OR', phone: '(503) 246-1555', website: 'https://www.portlandchiropracticneurology.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Portland OR chiropractor — Pacific NW wellness-focused market' },
      { name: 'Rainier Physical Therapy Seattle WA', owner: 'Dr. James Park', location: 'Seattle, WA', phone: '(206) 782-8620', website: 'https://www.rainierpt.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Seattle WA physical therapy — outdoor-active population drives PT demand' },
      { name: 'Utah Spine & Sport Salt Lake City UT', owner: 'Dr. Greg Barker', location: 'Salt Lake City, UT', phone: '(801) 484-0444', website: 'https://www.utahspineandsport.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Salt Lake City UT chiro/PT — active outdoor lifestyle market' },
    ],
  },
  {
    db: 'realEstate',
    prospects: [
      { name: 'Windermere Real Estate Portland OR', owner: 'Cathy Balsiger', location: 'Portland, OR', phone: '(503) 292-6200', website: 'https://www.windermereportland.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Portland OR real estate — Pacific NW market flagship brokerage' },
      { name: 'Coldwell Banker Bain Seattle WA', owner: 'Dennis Walsh', location: 'Seattle, WA', phone: '(206) 937-5500', website: 'https://www.cbbain.com', hasWebsite: 'Yes', wqs: 7, opp: 9, notes: 'Seattle WA real estate — one of the hottest US housing markets, tech wealth' },
      { name: 'Summit Sotheby\'s Salt Lake City UT', owner: 'Thomas Wright', location: 'Salt Lake City, UT', phone: '(801) 467-2100', website: 'https://www.summitsothebysrealty.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Salt Lake City UT luxury real estate — booming Utah tech & ski market' },
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
  console.log(`\n✅ Batch 63 complete — ${total} prospects added.`);
})();
