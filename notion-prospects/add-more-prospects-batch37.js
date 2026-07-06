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

// Batch 37: Reno NV + Baton Rouge LA + Jackson MS
const batches = [
  {
    db: 'plasticSurgery',
    prospects: [
      { name: 'Plastic Surgery Associates Reno', owner: 'Dr. Mark Lee', location: 'Reno, NV', phone: '(775) 786-4300', website: 'https://www.plasticsureryreno.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Reno NV plastic surgery — growing Nevada market' },
      { name: 'Baton Rouge Plastic Surgery', owner: 'Dr. Thomas Reath', location: 'Baton Rouge, LA', phone: '(225) 763-7550', website: 'https://www.brplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Baton Rouge LA plastic surgery' },
      { name: 'Jackson Plastic Surgery', owner: 'Dr. Robert Harris', location: 'Jackson, MS', phone: '(601) 366-1600', website: 'https://www.jacksonplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Jackson MS plastic surgery' },
    ],
  },
  {
    db: 'personalInjury',
    prospects: [
      { name: 'Viloria Oliphant Oster Aman Reno', owner: 'Tom Viloria', location: 'Reno, NV', phone: '(775) 284-1500', website: 'https://www.renoinjurylaw.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Reno NV personal injury law' },
      { name: 'Clayton Frugé Law Baton Rouge', owner: 'Tanner Clayton', location: 'Baton Rouge, LA', phone: '(225) 293-4488', website: 'https://www.claytonfruge.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Baton Rouge LA personal injury' },
      { name: 'Coxwell & Associates Jackson', owner: 'Merrida Coxwell', location: 'Jackson, MS', phone: '(601) 948-1600', website: 'https://www.coxwelllaw.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Jackson MS personal injury — established firm' },
    ],
  },
  {
    db: 'roofing',
    prospects: [
      { name: 'Sierra Roofing Reno', owner: 'Chris Mackie', location: 'Reno, NV', phone: '(775) 358-7663', website: 'https://www.sierraroofing.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Reno NV roofing contractor' },
      { name: 'ACR Roofing Baton Rouge', owner: 'Alan Cheramie', location: 'Baton Rouge, LA', phone: '(225) 752-7663', website: 'https://www.acrroofing.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Baton Rouge LA roofing — hurricane market' },
      { name: 'Jackson Roofing Pros', owner: 'Steve Millard', location: 'Jackson, MS', phone: '(601) 355-7663', website: 'https://www.jacksonroofingpros.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Jackson MS roofing contractor' },
    ],
  },
  {
    db: 'hvac',
    prospects: [
      { name: 'Reno Air Conditioning & Heating', owner: 'Gary Sims', location: 'Reno, NV', phone: '(775) 825-2111', website: 'https://www.renoac.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Reno NV HVAC — desert climate' },
      { name: 'Sullivan & Son HVAC Baton Rouge', owner: 'Patrick Sullivan', location: 'Baton Rouge, LA', phone: '(225) 272-0965', website: 'https://www.sullivanandsons.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Baton Rouge LA HVAC — hot humid climate' },
      { name: 'Metro Air Services Jackson', owner: 'James Watkins', location: 'Jackson, MS', phone: '(601) 932-7700', website: 'https://www.metroairjackson.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Jackson MS HVAC' },
    ],
  },
  {
    db: 'cosmeticDentist',
    prospects: [
      { name: 'Reno Cosmetic Dentistry', owner: 'Dr. Mark Frey', location: 'Reno, NV', phone: '(775) 826-6666', website: 'https://www.renocosmetic.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Reno NV cosmetic dentist' },
      { name: 'Smile Baton Rouge', owner: 'Dr. Gregory Pitre', location: 'Baton Rouge, LA', phone: '(225) 926-4640', website: 'https://www.smilebr.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Baton Rouge LA cosmetic dentist' },
      { name: 'Jackson Smile Center', owner: 'Dr. Mark White', location: 'Jackson, MS', phone: '(601) 982-6444', website: 'https://www.jacksonsmilecenter.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Jackson MS cosmetic dentist' },
    ],
  },
  {
    db: 'chiroPT',
    prospects: [
      { name: 'Reno Family Chiropractic', owner: 'Dr. Jeff Sherman', location: 'Reno, NV', phone: '(775) 852-4000', website: 'https://www.renofamilychiro.com', hasWebsite: 'Yes', wqs: 4, opp: 8, notes: 'Reno NV chiropractor' },
      { name: 'Louisiana Chiropractic Baton Rouge', owner: 'Dr. Chris Trosclair', location: 'Baton Rouge, LA', phone: '(225) 383-0999', website: 'https://www.lachiro.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Baton Rouge LA chiropractic' },
      { name: 'Capital City Chiropractic Jackson', owner: 'Dr. George Adams', location: 'Jackson, MS', phone: '(601) 956-3700', website: 'https://www.capitalcitychiro.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Jackson MS chiropractor' },
    ],
  },
  {
    db: 'realEstate',
    prospects: [
      { name: 'Dickson Realty Reno', owner: 'Janet Walsh', location: 'Reno, NV', phone: '(775) 746-7000', website: 'https://www.dicksonrealty.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Reno NV — large established real estate brokerage' },
      { name: 'Latter & Blum Baton Rouge', owner: 'Robert Merrick', location: 'Baton Rouge, LA', phone: '(225) 769-1500', website: 'https://www.latter-blum.com', hasWebsite: 'Yes', wqs: 7, opp: 7, notes: 'Baton Rouge LA large real estate firm' },
      { name: 'ERA Katrina & Company Jackson', owner: 'Katrina Blount', location: 'Jackson, MS', phone: '(601) 355-3000', website: 'https://www.erakatrina.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Jackson MS real estate' },
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
  console.log(`\n✅ Batch 37 complete — ${total} prospects added.`);
})();
