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

// Batch 53: Milwaukee WI + Green Bay WI + Appleton WI
const batches = [
  {
    db: 'plasticSurgery',
    prospects: [
      { name: 'Milwaukee Plastic Surgery WI', owner: 'Dr. Anu Bajaj', location: 'Milwaukee, WI', phone: '(414) 298-9898', website: 'https://www.milwaukeeplasticsurgery.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Milwaukee WI plastic surgery — largest WI city market' },
      { name: 'Green Bay Plastic Surgery WI', owner: 'Dr. Scott Newman', location: 'Green Bay, WI', phone: '(920) 432-4200', website: 'https://www.greenbayplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Green Bay WI plastic surgery — Packers market' },
      { name: 'Appleton Plastic Surgery WI', owner: 'Dr. John Taher', location: 'Appleton, WI', phone: '(920) 882-7878', website: 'https://www.appletonplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Appleton WI plastic surgery — Fox Valley market' },
    ],
  },
  {
    db: 'personalInjury',
    prospects: [
      { name: 'Hupy & Abraham Milwaukee WI', owner: 'Michael Hupy', location: 'Milwaukee, WI', phone: '(414) 223-4800', website: 'https://www.hupy.com', hasWebsite: 'Yes', wqs: 7, opp: 7, notes: 'Milwaukee WI personal injury — major WI firm' },
      { name: 'Green Bay Injury Law WI', owner: 'Paul Scoptur', location: 'Green Bay, WI', phone: '(920) 490-7600', website: 'https://www.greenabayinjurylaw.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Green Bay WI personal injury attorneys' },
      { name: 'Appleton Accident Lawyers WI', owner: 'James Gende', location: 'Appleton, WI', phone: '(920) 739-9900', website: 'https://www.appletoninjurylaw.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Appleton WI personal injury law — Fox Cities' },
    ],
  },
  {
    db: 'roofing',
    prospects: [
      { name: 'Milwaukee Roofing Company WI', owner: 'Ted Doornink', location: 'Milwaukee, WI', phone: '(414) 258-7663', website: 'https://www.milwaukeeroofing.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Milwaukee WI roofing contractor' },
      { name: 'Green Bay Roofing WI', owner: 'Chuck Jansen', location: 'Green Bay, WI', phone: '(920) 432-7663', website: 'https://www.greenbayroofing.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Green Bay WI roofing contractor' },
      { name: 'Appleton Roofing Pros WI', owner: 'Mark Brunette', location: 'Appleton, WI', phone: '(920) 730-7663', website: 'https://www.appletonroofing.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Appleton WI roofing contractor' },
    ],
  },
  {
    db: 'hvac',
    prospects: [
      { name: 'Milwaukee Heating & Air WI', owner: 'Dan Neumann', location: 'Milwaukee, WI', phone: '(414) 354-4400', website: 'https://www.milwaukeehvac.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Milwaukee WI HVAC service' },
      { name: 'Green Bay HVAC WI', owner: 'Jim Schumacher', location: 'Green Bay, WI', phone: '(920) 499-4400', website: 'https://www.greenbayhvac.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Green Bay WI HVAC' },
      { name: 'Appleton Heating & Cooling WI', owner: 'Steve Brauer', location: 'Appleton, WI', phone: '(920) 733-4400', website: 'https://www.appletonhvac.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Appleton WI HVAC service' },
    ],
  },
  {
    db: 'cosmeticDentist',
    prospects: [
      { name: 'Milwaukee Cosmetic Dentist WI', owner: 'Dr. Thomas Bubon', location: 'Milwaukee, WI', phone: '(414) 476-7100', website: 'https://www.milwaukeecosmeticdentist.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Milwaukee WI cosmetic dentist' },
      { name: 'Green Bay Smile Center WI', owner: 'Dr. Joel Sadek', location: 'Green Bay, WI', phone: '(920) 498-2060', website: 'https://www.greenbaysmile.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Green Bay WI cosmetic dentist' },
      { name: 'Appleton Dental Arts WI', owner: 'Dr. Patrick Brady', location: 'Appleton, WI', phone: '(920) 735-6655', website: 'https://www.appletondentalarts.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Appleton WI cosmetic dentist' },
    ],
  },
  {
    db: 'chiroPT',
    prospects: [
      { name: 'Milwaukee Chiropractic Center WI', owner: 'Dr. Steven Klawitsch', location: 'Milwaukee, WI', phone: '(414) 771-0700', website: 'https://www.milwaukeechiro.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Milwaukee WI chiropractor' },
      { name: 'Green Bay Chiropractic WI', owner: 'Dr. Tom Haberstroh', location: 'Green Bay, WI', phone: '(920) 336-4224', website: 'https://www.greenbaychiro.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Green Bay WI chiropractic' },
      { name: 'Appleton Spine & Chiro WI', owner: 'Dr. Brian Huber', location: 'Appleton, WI', phone: '(920) 997-0007', website: 'https://www.appletonchiropractor.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Appleton WI chiropractor — Fox Cities' },
    ],
  },
  {
    db: 'realEstate',
    prospects: [
      { name: 'Shorewest Realtors Milwaukee WI', owner: 'John Horning', location: 'Milwaukee, WI', phone: '(414) 847-4900', website: 'https://www.shorewest.com', hasWebsite: 'Yes', wqs: 7, opp: 7, notes: 'Milwaukee WI largest real estate firm in Wisconsin' },
      { name: 'Coldwell Banker Green Bay WI', owner: 'Mary Timmers', location: 'Green Bay, WI', phone: '(920) 432-8000', website: 'https://www.cbgreenbay.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Green Bay WI real estate brokerage' },
      { name: 'Coldwell Banker Appleton WI', owner: 'Scott Feldt', location: 'Appleton, WI', phone: '(920) 832-5000', website: 'https://www.cbappleton.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Appleton WI real estate — Fox Cities market' },
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
  console.log(`\n✅ Batch 53 complete — ${total} prospects added.`);
})();
