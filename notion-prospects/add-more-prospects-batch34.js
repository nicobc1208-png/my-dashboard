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

// Batch 34: Syracuse NY + Rochester NY + New Haven CT
const batches = [
  {
    db: 'plasticSurgery',
    prospects: [
      { name: 'Syracuse Plastic Surgery', owner: 'Dr. Michael Carlin', location: 'Syracuse, NY', phone: '(315) 671-9000', website: 'https://www.syracuseplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Syracuse NY plastic surgery' },
      { name: 'Rochester Plastic Surgery', owner: 'Dr. J. Peter Rubin', location: 'Rochester, NY', phone: '(585) 271-0761', website: 'https://www.rochesterplasticsurgery.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Rochester NY plastic surgery' },
      { name: 'New Haven Plastic Surgery', owner: 'Dr. Anand Kumar', location: 'New Haven, CT', phone: '(203) 624-5500', website: 'https://www.newhaveplasticsurgery.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'New Haven CT — near Yale medical center' },
    ],
  },
  {
    db: 'personalInjury',
    prospects: [
      { name: 'Law Offices of Frank Cassisi Syracuse', owner: 'Frank Cassisi', location: 'Syracuse, NY', phone: '(315) 471-1800', website: 'https://www.frankncassisi.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Syracuse NY personal injury' },
      { name: 'Cellino & Barnes Rochester', owner: 'Steve Barnes', location: 'Rochester, NY', phone: '(585) 434-2000', website: 'https://www.cellinoandbarnes.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Rochester NY — well-known personal injury firm' },
      { name: 'Jacobs & Dow New Haven', owner: 'Peter Dow', location: 'New Haven, CT', phone: '(203) 772-3100', website: 'https://www.jacobslaw.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'New Haven CT personal injury law' },
    ],
  },
  {
    db: 'roofing',
    prospects: [
      { name: 'Empire Roofing Syracuse', owner: 'Joe Gallo', location: 'Syracuse, NY', phone: '(315) 471-7663', website: 'https://www.empireroofingny.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Syracuse NY roofing — snow load market' },
      { name: 'Five Star Roofing Rochester', owner: 'Dave Barber', location: 'Rochester, NY', phone: '(585) 461-7663', website: 'https://www.fivestarroofingny.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Rochester NY roofing contractor' },
      { name: 'New Haven Roofing Pros', owner: 'Tom Walsh', location: 'New Haven, CT', phone: '(203) 469-7663', website: 'https://www.newhaveroofingpros.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'New Haven CT roofing contractor' },
    ],
  },
  {
    db: 'hvac',
    prospects: [
      { name: 'Teakwood Builders HVAC Syracuse', owner: 'Bill Laing', location: 'Syracuse, NY', phone: '(315) 487-1000', website: 'https://www.teakwoodbuilders.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Syracuse NY HVAC & remodeling' },
      { name: 'Brad Smith Comfort Systems Rochester', owner: 'Brad Smith', location: 'Rochester, NY', phone: '(585) 225-4200', website: 'https://www.bradsmithcomfort.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Rochester NY HVAC' },
      { name: 'Robert Darrow Heating New Haven', owner: 'Robert Darrow', location: 'New Haven, CT', phone: '(203) 466-8880', website: 'https://www.darrowheating.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'New Haven CT HVAC' },
    ],
  },
  {
    db: 'cosmeticDentist',
    prospects: [
      { name: 'Aesthetic Smiles Syracuse', owner: 'Dr. Brian Kelley', location: 'Syracuse, NY', phone: '(315) 455-5000', website: 'https://www.aestheticsmilesny.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Syracuse NY cosmetic dentist' },
      { name: 'Pittsford Dental Rochester', owner: 'Dr. Robert Glover', location: 'Rochester, NY', phone: '(585) 381-4920', website: 'https://www.pittsforddental.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Rochester NY cosmetic dentist — affluent suburb' },
      { name: 'Wooster Square Dental New Haven', owner: 'Dr. Gary Glassman', location: 'New Haven, CT', phone: '(203) 777-5544', website: 'https://www.woostersquaredental.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'New Haven CT cosmetic dentist' },
    ],
  },
  {
    db: 'chiroPT',
    prospects: [
      { name: 'Syracuse Chiropractic Center', owner: 'Dr. Mark Welch', location: 'Syracuse, NY', phone: '(315) 433-9090', website: 'https://www.syracusechiro.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Syracuse NY chiropractor' },
      { name: 'Rochester Chiropractic Group', owner: 'Dr. James Leach', location: 'Rochester, NY', phone: '(585) 325-4940', website: 'https://www.rochestenchirogroup.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Rochester NY chiropractic' },
      { name: 'New Haven Chiropractic & Sports Injury', owner: 'Dr. Scott Gillman', location: 'New Haven, CT', phone: '(203) 562-5595', website: 'https://www.newhavenchirosports.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'New Haven CT chiropractor' },
    ],
  },
  {
    db: 'realEstate',
    prospects: [
      { name: 'Howard Hanna Real Estate Syracuse', owner: 'Helen Hanna Casey', location: 'Syracuse, NY', phone: '(315) 475-7000', website: 'https://www.howardhanna.com/syracuse', hasWebsite: 'Yes', wqs: 7, opp: 7, notes: 'Syracuse NY — large regional real estate firm' },
      { name: 'Hunt Real Estate ERA Rochester', owner: 'Peter Hunt', location: 'Rochester, NY', phone: '(585) 248-1111', website: 'https://www.huntrealestate.com', hasWebsite: 'Yes', wqs: 7, opp: 7, notes: 'Rochester NY established large real estate firm' },
      { name: 'Pearce Real Estate New Haven', owner: 'John Pearce', location: 'New Haven, CT', phone: '(203) 234-1200', website: 'https://www.pearce.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'New Haven CT real estate brokerage' },
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
  console.log(`\n✅ Batch 34 complete — ${total} prospects added.`);
})();
