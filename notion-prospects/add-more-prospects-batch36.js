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

// Batch 36: Boise ID + Spokane WA + Provo UT
const batches = [
  {
    db: 'plasticSurgery',
    prospects: [
      { name: 'Parkcenter Plastic Surgery Boise', owner: 'Dr. Lawrence Gray', location: 'Boise, ID', phone: '(208) 344-3900', website: 'https://www.parkcenterplasticsurgery.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Boise ID plastic surgery — fast-growing metro' },
      { name: 'Inland Plastic Surgery Spokane', owner: 'Dr. Robert Cohen', location: 'Spokane, WA', phone: '(509) 747-2000', website: 'https://www.inlandplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Spokane WA plastic surgery' },
      { name: 'Utah Valley Plastic Surgery Provo', owner: 'Dr. Steven Cohen', location: 'Provo, UT', phone: '(801) 373-8800', website: 'https://www.uvplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Provo UT plastic surgery — large family-oriented market' },
    ],
  },
  {
    db: 'personalInjury',
    prospects: [
      { name: 'Rossman Law Group Boise', owner: 'Kurt Rossman', location: 'Boise, ID', phone: '(208) 331-3945', website: 'https://www.rossmanlaw.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Boise ID personal injury law' },
      { name: 'CK Law Group Spokane', owner: 'Chad Kawamoto', location: 'Spokane, WA', phone: '(509) 455-4000', website: 'https://www.cklawgroup.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Spokane WA personal injury' },
      { name: 'Flickinger Sutterfield Provo', owner: 'Brad Flickinger', location: 'Provo, UT', phone: '(801) 370-0300', website: 'https://www.flickingerlaw.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Provo UT personal injury law' },
    ],
  },
  {
    db: 'roofing',
    prospects: [
      { name: 'Boise Roofing Company', owner: 'Mike Jensen', location: 'Boise, ID', phone: '(208) 342-7663', website: 'https://www.boiseroofingco.com', hasWebsite: 'Yes', wqs: 4, opp: 8, notes: 'Boise ID roofing — growing population' },
      { name: 'Empire Roofing Spokane', owner: 'Todd Larson', location: 'Spokane, WA', phone: '(509) 535-7663', website: 'https://www.empireroofingspokane.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Spokane WA roofing contractor' },
      { name: 'Utah Roofing Provo', owner: 'Dave Christensen', location: 'Provo, UT', phone: '(801) 373-7663', website: 'https://www.utahroofingprovo.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Provo UT roofing contractor' },
    ],
  },
  {
    db: 'hvac',
    prospects: [
      { name: 'Hobson Heating & AC Boise', owner: 'Dave Hobson', location: 'Boise, ID', phone: '(208) 424-9999', website: 'https://www.hobsonheating.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Boise ID HVAC service' },
      { name: 'Spokane Heating & Air', owner: 'Scott Williams', location: 'Spokane, WA', phone: '(509) 326-7740', website: 'https://www.spokaneheatingandair.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Spokane WA HVAC' },
      { name: 'Provo Heating & Cooling', owner: 'Rick Andersen', location: 'Provo, UT', phone: '(801) 374-9400', website: 'https://www.provoheating.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Provo UT HVAC — large residential market' },
    ],
  },
  {
    db: 'cosmeticDentist',
    prospects: [
      { name: 'Boise Smile Designers', owner: 'Dr. James Goff', location: 'Boise, ID', phone: '(208) 343-5700', website: 'https://www.boisesmiledesigners.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Boise ID cosmetic dentist' },
      { name: 'Spokane Cosmetic Dentistry', owner: 'Dr. Paul Tanner', location: 'Spokane, WA', phone: '(509) 922-5511', website: 'https://www.spokanecosmetic.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Spokane WA cosmetic dentist' },
      { name: 'Provo Smile Studio', owner: 'Dr. Jason Horsley', location: 'Provo, UT', phone: '(801) 373-2300', website: 'https://www.provosimilestudio.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Provo UT cosmetic dentist' },
    ],
  },
  {
    db: 'chiroPT',
    prospects: [
      { name: 'Boise Chiropractic Neurology', owner: 'Dr. Gary Stimpson', location: 'Boise, ID', phone: '(208) 323-1313', website: 'https://www.boisechiropractic.com', hasWebsite: 'Yes', wqs: 4, opp: 8, notes: 'Boise ID chiropractor' },
      { name: 'Spokane Chiropractic & Wellness', owner: 'Dr. Mark Peterson', location: 'Spokane, WA', phone: '(509) 922-3222', website: 'https://www.spokanechiropractic.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Spokane WA chiropractic' },
      { name: 'Utah Valley Chiropractic Provo', owner: 'Dr. Shane Hogge', location: 'Provo, UT', phone: '(801) 377-3435', website: 'https://www.utahvalleychiropractic.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Provo UT chiropractor' },
    ],
  },
  {
    db: 'realEstate',
    prospects: [
      { name: 'Amherst Madison Boise', owner: 'Brent Olmstead', location: 'Boise, ID', phone: '(208) 391-4466', website: 'https://www.amherstmadison.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Boise ID large real estate firm — fast-growing market' },
      { name: 'RE/MAX of Spokane', owner: 'Terry Ference', location: 'Spokane, WA', phone: '(509) 459-7000', website: 'https://www.remaxofspokane.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Spokane WA real estate brokerage' },
      { name: 'Equity Real Estate Provo', owner: 'John Prince', location: 'Provo, UT', phone: '(801) 810-4141', website: 'https://www.equityutah.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Provo UT real estate' },
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
  console.log(`\n✅ Batch 36 complete — ${total} prospects added.`);
})();
