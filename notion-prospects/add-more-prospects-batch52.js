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

// Batch 52: Ann Arbor MI + Lansing MI + Kalamazoo MI
const batches = [
  {
    db: 'plasticSurgery',
    prospects: [
      { name: 'Ann Arbor Plastic Surgery MI', owner: 'Dr. Edwin Wilkins', location: 'Ann Arbor, MI', phone: '(734) 712-2323', website: 'https://www.annaborplasticsurgery.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Ann Arbor MI plastic surgery — U of Michigan affluent market' },
      { name: 'Lansing Plastic Surgery MI', owner: 'Dr. Brian Grudovich', location: 'Lansing, MI', phone: '(517) 323-9300', website: 'https://www.lansingplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Lansing MI plastic surgery — state capital market' },
      { name: 'Kalamazoo Plastic Surgery MI', owner: 'Dr. Jeffrey Brackett', location: 'Kalamazoo, MI', phone: '(269) 342-8900', website: 'https://www.kalamazooplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Kalamazoo MI plastic surgery' },
    ],
  },
  {
    db: 'personalInjury',
    prospects: [
      { name: 'Michigan Auto Law Ann Arbor', owner: 'Steven Gursten', location: 'Ann Arbor, MI', phone: '(734) 222-6600', website: 'https://www.michiganautolaw.com', hasWebsite: 'Yes', wqs: 7, opp: 7, notes: 'Ann Arbor MI personal injury — major auto accident firm' },
      { name: 'Lansing Injury Lawyers MI', owner: 'Joel Finnell', location: 'Lansing, MI', phone: '(517) 485-4900', website: 'https://www.lansinginjurylaw.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Lansing MI personal injury law' },
      { name: 'Kalamazoo Accident Attorneys MI', owner: 'Brian Lennon', location: 'Kalamazoo, MI', phone: '(269) 381-4400', website: 'https://www.kalamazooinjurylaw.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Kalamazoo MI personal injury' },
    ],
  },
  {
    db: 'roofing',
    prospects: [
      { name: 'Ann Arbor Roofing Experts MI', owner: 'Jeff Hazel', location: 'Ann Arbor, MI', phone: '(734) 668-7663', website: 'https://www.annarbourroofing.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Ann Arbor MI roofing contractor' },
      { name: 'Lansing Roofing Company MI', owner: 'Dale Wilkins', location: 'Lansing, MI', phone: '(517) 394-7663', website: 'https://www.lansingroofing.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Lansing MI roofing contractor' },
      { name: 'Kalamazoo Roofing Pros MI', owner: 'Scott Hartrick', location: 'Kalamazoo, MI', phone: '(269) 349-7663', website: 'https://www.kalamazooroofing.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Kalamazoo MI roofing contractor' },
    ],
  },
  {
    db: 'hvac',
    prospects: [
      { name: 'Ann Arbor Heating & Cooling MI', owner: 'Kevin Graham', location: 'Ann Arbor, MI', phone: '(734) 662-3200', website: 'https://www.annarborhvac.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Ann Arbor MI HVAC service' },
      { name: 'Lansing Heating & Air MI', owner: 'Bob Schueneman', location: 'Lansing, MI', phone: '(517) 882-3400', website: 'https://www.lansinghvac.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Lansing MI HVAC' },
      { name: 'Kalamazoo Heating & Cooling MI', owner: 'Tim Schuitema', location: 'Kalamazoo, MI', phone: '(269) 349-3300', website: 'https://www.kalamazooheating.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Kalamazoo MI HVAC service' },
    ],
  },
  {
    db: 'cosmeticDentist',
    prospects: [
      { name: 'Ann Arbor Cosmetic Dentist MI', owner: 'Dr. Robert Antolak', location: 'Ann Arbor, MI', phone: '(734) 971-7171', website: 'https://www.annarbordentist.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Ann Arbor MI cosmetic dentist' },
      { name: 'Lansing Smile Center MI', owner: 'Dr. Laura Witek', location: 'Lansing, MI', phone: '(517) 321-2900', website: 'https://www.lansingsmilecenter.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Lansing MI cosmetic dentist' },
      { name: 'Kalamazoo Dental Arts MI', owner: 'Dr. Eric Speetzen', location: 'Kalamazoo, MI', phone: '(269) 385-5400', website: 'https://www.kalamazoodentalarts.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Kalamazoo MI cosmetic dentist' },
    ],
  },
  {
    db: 'chiroPT',
    prospects: [
      { name: 'Ann Arbor Chiropractic MI', owner: 'Dr. Paul Svoke', location: 'Ann Arbor, MI', phone: '(734) 973-1600', website: 'https://www.annarborchiro.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Ann Arbor MI chiropractor' },
      { name: 'Lansing Chiropractic Center MI', owner: 'Dr. Scott Swanson', location: 'Lansing, MI', phone: '(517) 882-7800', website: 'https://www.lansingchiro.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Lansing MI chiropractic' },
      { name: 'Kalamazoo Spine & Chiro MI', owner: 'Dr. Brian Fett', location: 'Kalamazoo, MI', phone: '(269) 344-7100', website: 'https://www.kalamazoochiropractor.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Kalamazoo MI chiropractor' },
    ],
  },
  {
    db: 'realEstate',
    prospects: [
      { name: 'Charles Reinhart Co Ann Arbor', owner: 'Scott Niemann', location: 'Ann Arbor, MI', phone: '(734) 747-7777', website: 'https://www.charlesreinhart.com', hasWebsite: 'Yes', wqs: 7, opp: 7, notes: 'Ann Arbor MI dominant regional real estate firm' },
      { name: 'Berkshire Hathaway Lansing MI', owner: 'Ron Jagielo', location: 'Lansing, MI', phone: '(517) 393-4000', website: 'https://www.bhhsmichiganrealestate.com', hasWebsite: 'Yes', wqs: 7, opp: 7, notes: 'Lansing MI large real estate brokerage' },
      { name: 'Jaqua Realtors Kalamazoo MI', owner: 'Bill Jaqua', location: 'Kalamazoo, MI', phone: '(269) 381-4800', website: 'https://www.jaquarealtors.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Kalamazoo MI established real estate firm' },
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
  console.log(`\n✅ Batch 52 complete — ${total} prospects added.`);
})();
