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

// Batch 45: Wilmington NC + Durham NC + Asheville NC
const batches = [
  {
    db: 'plasticSurgery',
    prospects: [
      { name: 'Wilmington Plastic Surgery', owner: 'Dr. Craig Davenport', location: 'Wilmington, NC', phone: '(910) 509-0800', website: 'https://www.wilmingtonplasticsurgery.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Wilmington NC plastic surgery — coastal market' },
      { name: 'Triangle Plastic Surgery Durham', owner: 'Dr. Michael Pratt', location: 'Durham, NC', phone: '(919) 419-8288', website: 'https://www.triangleplasticsurgery.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Durham NC plastic surgery — Research Triangle affluent market' },
      { name: 'Asheville Plastic Surgery', owner: 'Dr. Mark Deutsch', location: 'Asheville, NC', phone: '(828) 258-4141', website: 'https://www.ashevilleplasticsurgery.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Asheville NC plastic surgery — arts & wellness community' },
    ],
  },
  {
    db: 'personalInjury',
    prospects: [
      { name: 'Beales Law Wilmington NC', owner: 'Paul Beales', location: 'Wilmington, NC', phone: '(910) 769-8080', website: 'https://www.bealeslaw.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Wilmington NC personal injury' },
      { name: 'The Layton Law Firm Durham', owner: 'Jim Layton', location: 'Durham, NC', phone: '(919) 923-2221', website: 'https://www.laytonlawfirm.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Durham NC personal injury law' },
      { name: 'Killian Law Asheville', owner: 'Mike Killian', location: 'Asheville, NC', phone: '(828) 505-4300', website: 'https://www.killianlaw.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Asheville NC personal injury' },
    ],
  },
  {
    db: 'roofing',
    prospects: [
      { name: 'Cape Fear Roofing Wilmington', owner: 'Dave Hankins', location: 'Wilmington, NC', phone: '(910) 343-7663', website: 'https://www.capefearroofing.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Wilmington NC roofing — hurricane coastal market' },
      { name: 'Triangle Roofing Durham', owner: 'Brian Foster', location: 'Durham, NC', phone: '(919) 682-7663', website: 'https://www.triangleroofing.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Durham NC roofing contractor — growing market' },
      { name: 'Asheville Roofing Company', owner: 'Josh Ramsey', location: 'Asheville, NC', phone: '(828) 254-7663', website: 'https://www.ashevilleroofingco.com', hasWebsite: 'Yes', wqs: 4, opp: 8, notes: 'Asheville NC roofing contractor' },
    ],
  },
  {
    db: 'hvac',
    prospects: [
      { name: 'Cape Fear Air Conditioning Wilmington', owner: 'Scott Blevins', location: 'Wilmington, NC', phone: '(910) 791-7565', website: 'https://www.capefearair.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Wilmington NC HVAC — coastal humid climate' },
      { name: 'Morris-Jenkins Durham', owner: 'Gary Jenkins', location: 'Durham, NC', phone: '(919) 663-3311', website: 'https://www.morris-jenkins.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Durham NC HVAC — well-known regional company' },
      { name: 'Asheville Heating & Air', owner: 'Tom Burton', location: 'Asheville, NC', phone: '(828) 252-5559', website: 'https://www.ashevilleheatingandair.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Asheville NC HVAC service' },
    ],
  },
  {
    db: 'cosmeticDentist',
    prospects: [
      { name: 'Wilmington Cosmetic Dentistry', owner: 'Dr. Gregory Olexa', location: 'Wilmington, NC', phone: '(910) 392-6060', website: 'https://www.wilmingtoncosmetic.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Wilmington NC cosmetic dentist' },
      { name: 'Durham Smile Studio', owner: 'Dr. Pamela Gilbert', location: 'Durham, NC', phone: '(919) 489-2284', website: 'https://www.durhamsmiledds.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Durham NC cosmetic dentist — Triangle market' },
      { name: 'Asheville Family & Cosmetic Dentistry', owner: 'Dr. Mark Blalock', location: 'Asheville, NC', phone: '(828) 277-6060', website: 'https://www.ashevilledentist.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Asheville NC cosmetic dentist' },
    ],
  },
  {
    db: 'chiroPT',
    prospects: [
      { name: 'Wilmington Chiropractic Center', owner: 'Dr. John Neilson', location: 'Wilmington, NC', phone: '(910) 796-2242', website: 'https://www.wilmingtonchiro.com', hasWebsite: 'Yes', wqs: 4, opp: 8, notes: 'Wilmington NC chiropractor' },
      { name: 'Bull City Chiropractic Durham', owner: 'Dr. Craig Solomon', location: 'Durham, NC', phone: '(919) 286-9080', website: 'https://www.bullcitychiro.com', hasWebsite: 'Yes', wqs: 4, opp: 8, notes: 'Durham NC chiropractic' },
      { name: 'Asheville Chiropractic & Wellness', owner: 'Dr. Steve Combs', location: 'Asheville, NC', phone: '(828) 277-6006', website: 'https://www.ashevillechiro.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Asheville NC chiropractor — wellness-focused market' },
    ],
  },
  {
    db: 'realEstate',
    prospects: [
      { name: 'Intracoastal Realty Wilmington', owner: 'Jerry Helms', location: 'Wilmington, NC', phone: '(910) 256-4503', website: 'https://www.intracoastalrealty.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Wilmington NC — large established coastal real estate firm' },
      { name: 'Howard Perry Walston Durham', owner: 'Steve Crisp', location: 'Durham, NC', phone: '(919) 489-7788', website: 'https://www.hpw.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Durham NC large real estate firm — Triangle market' },
      { name: 'Town & Mountain Realty Asheville', owner: 'Molly Galler', location: 'Asheville, NC', phone: '(828) 232-2879', website: 'https://www.townandmountain.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Asheville NC real estate — popular relocation market' },
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
  console.log(`\n✅ Batch 45 complete — ${total} prospects added.`);
})();
