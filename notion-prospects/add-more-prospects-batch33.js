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

// Batch 33: Lancaster PA + Reading PA + Allentown PA
const batches = [
  {
    db: 'plasticSurgery',
    prospects: [
      { name: 'Lancaster Plastic Surgery', owner: 'Dr. Scott Hollander', location: 'Lancaster, PA', phone: '(717) 291-1400', website: 'https://www.lancasterplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Lancaster PA plastic surgery' },
      { name: 'Reading Plastic Surgery', owner: 'Dr. Adam Goldberg', location: 'Reading, PA', phone: '(610) 777-2227', website: 'https://www.readingplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Reading PA plastic surgery' },
      { name: 'Lehigh Valley Plastic Surgery Allentown', owner: 'Dr. Jeffrey Mintz', location: 'Allentown, PA', phone: '(610) 439-9600', website: 'https://www.lehighvalleyplasticsurgery.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Allentown/Lehigh Valley PA plastic surgery' },
    ],
  },
  {
    db: 'personalInjury',
    prospects: [
      { name: 'Georgelis Injury Law Firm Lancaster', owner: 'Nick Georgelis', location: 'Lancaster, PA', phone: '(717) 393-7527', website: 'https://www.georgelislaw.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Lancaster PA personal injury' },
      { name: 'Czekanski Law Reading', owner: 'Joseph Czekanski', location: 'Reading, PA', phone: '(610) 372-2600', website: 'https://www.czekanskilaw.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Reading PA personal injury law' },
      { name: 'Gross McGinley Allentown', owner: 'Edward Gross', location: 'Allentown, PA', phone: '(610) 820-5450', website: 'https://www.grossmcginley.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Allentown PA personal injury law — established firm' },
    ],
  },
  {
    db: 'roofing',
    prospects: [
      { name: 'Lancaster Roofing Company', owner: 'Dan Hershey', location: 'Lancaster, PA', phone: '(717) 392-5822', website: 'https://www.lancasterroofingco.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Lancaster PA roofing contractor' },
      { name: 'Reading Roofing Experts', owner: 'Mike Peters', location: 'Reading, PA', phone: '(610) 378-7663', website: 'https://www.readingroofingexperts.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Reading PA roofing' },
      { name: 'Lehigh Valley Roofing Allentown', owner: 'Chris Becker', location: 'Allentown, PA', phone: '(610) 433-7663', website: 'https://www.lehighvalleyroofing.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Allentown PA roofing contractor' },
    ],
  },
  {
    db: 'hvac',
    prospects: [
      { name: 'HB Home Service Team Lancaster', owner: 'Henry Brown', location: 'Lancaster, PA', phone: '(717) 230-9821', website: 'https://www.hbserviceteam.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Lancaster PA HVAC — large regional company' },
      { name: 'Ogle Heating & Cooling Reading', owner: 'Dave Ogle', location: 'Reading, PA', phone: '(610) 779-6068', website: 'https://www.ogleheating.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Reading PA HVAC' },
      { name: 'Ierna\'s Heating & Cooling Allentown', owner: 'Bill Ierna', location: 'Allentown, PA', phone: '(610) 336-0447', website: 'https://www.iernashvac.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Allentown PA HVAC service' },
    ],
  },
  {
    db: 'cosmeticDentist',
    prospects: [
      { name: 'Lancaster Cosmetic Dentistry', owner: 'Dr. Ray Delucia', location: 'Lancaster, PA', phone: '(717) 392-5800', website: 'https://www.lancastercosmetic.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Lancaster PA cosmetic dentist' },
      { name: 'Gentle Dental Reading', owner: 'Dr. Michael Parisi', location: 'Reading, PA', phone: '(610) 375-2200', website: 'https://www.gentledentistsreading.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Reading PA cosmetic dentist' },
      { name: 'Smile Lehigh Valley Allentown', owner: 'Dr. Joseph Colella', location: 'Allentown, PA', phone: '(610) 820-9900', website: 'https://www.smileLV.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Allentown PA cosmetic dentist' },
    ],
  },
  {
    db: 'chiroPT',
    prospects: [
      { name: 'Lancaster Chiropractic & Rehab', owner: 'Dr. Dave Kowalski', location: 'Lancaster, PA', phone: '(717) 393-6699', website: 'https://www.lancasterchiropractic.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Lancaster PA chiropractor' },
      { name: 'Reading Spine & Chiropractic', owner: 'Dr. Steven Burns', location: 'Reading, PA', phone: '(610) 376-1330', website: 'https://www.readingspine.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Reading PA chiropractic' },
      { name: 'Lehigh Valley Chiropractic Allentown', owner: 'Dr. Mark Rossi', location: 'Allentown, PA', phone: '(610) 439-4444', website: 'https://www.lehighvalleychiro.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Allentown PA chiropractor' },
    ],
  },
  {
    db: 'realEstate',
    prospects: [
      { name: 'Berkshire Hathaway Homesale Lancaster', owner: 'Mark McAfee', location: 'Lancaster, PA', phone: '(717) 291-9101', website: 'https://www.homesal.com', hasWebsite: 'Yes', wqs: 7, opp: 7, notes: 'Lancaster PA established large real estate firm' },
      { name: 'RE/MAX of Reading', owner: 'Connie Bowers', location: 'Reading, PA', phone: '(610) 375-4500', website: 'https://www.remaxofreading.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Reading PA real estate brokerage' },
      { name: 'Keller Williams Real Estate Allentown', owner: 'Bob Hoopert', location: 'Allentown, PA', phone: '(610) 435-7499', website: 'https://www.kwlehighvalley.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Allentown PA real estate' },
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
  console.log(`\n✅ Batch 33 complete — ${total} prospects added.`);
})();
