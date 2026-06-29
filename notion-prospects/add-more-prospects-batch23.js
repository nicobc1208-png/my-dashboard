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

// Batch 23: Des Moines IA + Little Rock AR + Baton Rouge LA
const batches = [
  {
    db: 'plasticSurgery',
    prospects: [
      { name: 'Plastic Surgery Specialists of Iowa', owner: 'Dr. Mark Carlson', location: 'Des Moines, IA', phone: '(515) 277-7460', website: 'https://www.plsurgery.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Des Moines IA plastic surgery' },
      { name: 'Arkansas Aesthetic Surgery', owner: 'Dr. Bruce Halliday', location: 'Little Rock, AR', phone: '(501) 219-0000', website: 'https://www.arkansasaesthetic.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Little Rock AR plastic surgery' },
      { name: 'Cosmetic Surgery of Baton Rouge', owner: 'Dr. Frank Agullo', location: 'Baton Rouge, LA', phone: '(225) 757-0620', website: 'https://www.cosmeticsurgerybatonrouge.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Baton Rouge LA plastic surgery' },
    ],
  },
  {
    db: 'personalInjury',
    prospects: [
      { name: 'Tom Riley Law Firm', owner: 'Tom Riley', location: 'Des Moines, IA', phone: '(515) 278-1212', website: 'https://www.tomrileylaw.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Des Moines IA personal injury law' },
      { name: 'Taylor King Law', owner: 'Taylor King', location: 'Little Rock, AR', phone: '(800) 227-9732', website: 'https://www.taylorkinglaw.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Little Rock AR — large regional personal injury firm' },
      { name: 'Gordon McKernan Injury Attorneys', owner: 'Gordon McKernan', location: 'Baton Rouge, LA', phone: '(225) 888-8888', website: 'https://www.getgordon.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Baton Rouge LA well-known injury firm' },
    ],
  },
  {
    db: 'roofing',
    prospects: [
      { name: 'Absolute Roofing & Construction', owner: 'Dan Sorenson', location: 'Des Moines, IA', phone: '(515) 727-0099', website: 'https://www.absoluteroofingdesmoines.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Des Moines IA roofing' },
      { name: 'All American Roofing', owner: 'James Walters', location: 'Little Rock, AR', phone: '(501) 664-7663', website: 'https://www.allamericanroofingllc.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Little Rock AR roofing contractor' },
      { name: 'Acadiana Roofing', owner: 'Paul Thibodaux', location: 'Baton Rouge, LA', phone: '(225) 928-7663', website: 'https://www.acadianaroofing.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Baton Rouge LA roofing — hurricane market' },
    ],
  },
  {
    db: 'hvac',
    prospects: [
      { name: 'Dalton Plumbing Heating Cooling', owner: 'Scott Dalton', location: 'Des Moines, IA', phone: '(319) 266-3513', website: 'https://www.daltonphc.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Des Moines Iowa HVAC' },
      { name: 'Superior Air Solutions', owner: 'Keith Blankenship', location: 'Little Rock, AR', phone: '(501) 778-5791', website: 'https://www.superiorairsolutions.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Little Rock AR HVAC' },
      { name: 'Acadian Air Conditioning', owner: 'Mike Broussard', location: 'Baton Rouge, LA', phone: '(225) 272-0000', website: 'https://www.acadianac.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Baton Rouge LA HVAC — hot/humid climate' },
    ],
  },
  {
    db: 'cosmeticDentist',
    prospects: [
      { name: 'Iowa Dental Arts', owner: 'Dr. Jason Hancock', location: 'Des Moines, IA', phone: '(515) 277-6600', website: 'https://www.iowadental.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Des Moines IA cosmetic dentist' },
      { name: 'Riverview Dental Designs', owner: 'Dr. Shalene Hardin', location: 'Little Rock, AR', phone: '(501) 664-6888', website: 'https://www.riverviewdentaldesigns.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Little Rock AR cosmetic dentistry' },
      { name: 'Distinctive Dentistry', owner: 'Dr. Mary Kay Bourg', location: 'Baton Rouge, LA', phone: '(225) 756-0600', website: 'https://www.distinctivedentistry.net', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Baton Rouge LA cosmetic dental' },
    ],
  },
  {
    db: 'chiroPT',
    prospects: [
      { name: 'Des Moines Chiropractic Center', owner: 'Dr. Greg Custer', location: 'Des Moines, IA', phone: '(515) 223-3000', website: 'https://www.dsmchiro.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Des Moines IA chiropractor' },
      { name: 'Dickson Chiropractic', owner: 'Dr. Brian Dickson', location: 'Little Rock, AR', phone: '(501) 847-8272', website: 'https://www.dicksonchiropractic.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Little Rock AR chiropractor' },
      { name: 'Bremer Chiropractic Center', owner: 'Dr. Timothy Bremer', location: 'Baton Rouge, LA', phone: '(225) 766-3000', website: 'https://www.bremerchiro.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Baton Rouge LA chiropractic' },
    ],
  },
  {
    db: 'realEstate',
    prospects: [
      { name: 'Iowa Realty', owner: 'Scott Hansen', location: 'Des Moines, IA', phone: '(515) 223-6600', website: 'https://www.iowarealty.com', hasWebsite: 'Yes', wqs: 7, opp: 7, notes: 'Des Moines IA — largest RE brokerage in Iowa' },
      { name: 'Rector Phillips Morse', owner: 'Kyle Rector', location: 'Little Rock, AR', phone: '(501) 375-4663', website: 'https://www.rpm-realtors.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Little Rock AR real estate' },
      { name: 'Latter & Blum Inc.', owner: 'Robert Merrick', location: 'Baton Rouge, LA', phone: '(225) 769-1500', website: 'https://www.latter-blum.com', hasWebsite: 'Yes', wqs: 7, opp: 7, notes: 'Baton Rouge LA established real estate firm' },
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
  console.log(`\n✅ Batch 23 complete — ${total} prospects added.`);
})();
