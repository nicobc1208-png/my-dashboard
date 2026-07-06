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

// Batch 51: Canton OH + Youngstown OH + Cleveland OH
const batches = [
  {
    db: 'plasticSurgery',
    prospects: [
      { name: 'Canton Plastic Surgery Ohio', owner: 'Dr. James Craigie', location: 'Canton, OH', phone: '(330) 492-8811', website: 'https://www.cantonplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Canton OH plastic surgery — Stark County market' },
      { name: 'Youngstown Plastic Surgery OH', owner: 'Dr. Eric Mariotti', location: 'Youngstown, OH', phone: '(330) 726-8900', website: 'https://www.youngstownplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Youngstown OH plastic surgery — Mahoning Valley' },
      { name: 'Cleveland Plastic Surgery', owner: 'Dr. Steven Sigalove', location: 'Cleveland, OH', phone: '(216) 464-9500', website: 'https://www.clevelandplasticsurgery.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Cleveland OH plastic surgery — large metro market' },
    ],
  },
  {
    db: 'personalInjury',
    prospects: [
      { name: 'Krugliak Wilkins Canton OH', owner: 'David Krugliak', location: 'Canton, OH', phone: '(330) 497-0700', website: 'https://www.kwgd.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Canton OH personal injury law firm' },
      { name: 'Youngstown Injury Law OH', owner: 'Paul Gains', location: 'Youngstown, OH', phone: '(330) 747-4477', website: 'https://www.youngstowninjurylaw.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Youngstown OH personal injury attorneys' },
      { name: 'Elk & Elk Cleveland OH', owner: 'Daniel Elk', location: 'Cleveland, OH', phone: '(216) 313-5555', website: 'https://www.elkandelk.com', hasWebsite: 'Yes', wqs: 7, opp: 7, notes: 'Cleveland OH personal injury — major regional firm' },
    ],
  },
  {
    db: 'roofing',
    prospects: [
      { name: 'Canton Roofing Company OH', owner: 'Mike Gant', location: 'Canton, OH', phone: '(330) 455-7663', website: 'https://www.cantonroofing.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Canton OH roofing contractor' },
      { name: 'Youngstown Roofing Pros OH', owner: 'Dan Catanzaro', location: 'Youngstown, OH', phone: '(330) 729-7663', website: 'https://www.youngstownroofing.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Youngstown OH roofing contractor' },
      { name: 'Cleveland Roofing Experts OH', owner: 'Joe Riedel', location: 'Cleveland, OH', phone: '(216) 901-7663', website: 'https://www.clevelandroofingexperts.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Cleveland OH roofing contractor — large metro market' },
    ],
  },
  {
    db: 'hvac',
    prospects: [
      { name: 'Canton Heating & Air Ohio', owner: 'Larry Troup', location: 'Canton, OH', phone: '(330) 478-6800', website: 'https://www.cantonhvac.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Canton OH HVAC service' },
      { name: 'Youngstown Heating & Cooling OH', owner: 'Steve DiMauro', location: 'Youngstown, OH', phone: '(330) 788-2200', website: 'https://www.youngstownhvac.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Youngstown OH HVAC' },
      { name: 'Cleveland Heating & Air OH', owner: 'Bob Holtzman', location: 'Cleveland, OH', phone: '(216) 220-5000', website: 'https://www.clevelandhvac.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Cleveland OH HVAC — large metro service area' },
    ],
  },
  {
    db: 'cosmeticDentist',
    prospects: [
      { name: 'Canton Cosmetic Dentist OH', owner: 'Dr. Jeffrey Clark', location: 'Canton, OH', phone: '(330) 494-6161', website: 'https://www.cantondentist.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Canton OH cosmetic dentist' },
      { name: 'Youngstown Smile Studio OH', owner: 'Dr. Joseph Masirovitz', location: 'Youngstown, OH', phone: '(330) 744-4900', website: 'https://www.youngstownsmile.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Youngstown OH cosmetic dentist' },
      { name: 'Cleveland Cosmetic Dentistry OH', owner: 'Dr. Brad Hylan', location: 'Cleveland, OH', phone: '(216) 251-8831', website: 'https://www.clevelandcosmeticdentist.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Cleveland OH cosmetic dentist — large metro market' },
    ],
  },
  {
    db: 'chiroPT',
    prospects: [
      { name: 'Canton Chiropractic Center OH', owner: 'Dr. Eric Barker', location: 'Canton, OH', phone: '(330) 492-1100', website: 'https://www.cantonchiro.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Canton OH chiropractor' },
      { name: 'Youngstown Chiropractic OH', owner: 'Dr. Michael Lutz', location: 'Youngstown, OH', phone: '(330) 726-7000', website: 'https://www.youngstownchiro.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Youngstown OH chiropractic' },
      { name: 'Cleveland Spine & Chiropractic', owner: 'Dr. John Ventresca', location: 'Cleveland, OH', phone: '(216) 522-1350', website: 'https://www.clevelandspinechiro.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Cleveland OH chiropractor — large metro' },
    ],
  },
  {
    db: 'realEstate',
    prospects: [
      { name: 'Cutler Real Estate Canton OH', owner: 'Jim Cutler', location: 'Canton, OH', phone: '(330) 497-1100', website: 'https://www.cutler.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Canton OH established large real estate firm' },
      { name: 'Youngstown Real Estate Group', owner: 'Tony Rossi', location: 'Youngstown, OH', phone: '(330) 742-5000', website: 'https://www.youngstownrealty.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Youngstown OH real estate brokerage' },
      { name: 'Howard Hanna Cleveland OH', owner: 'Kristine Burdick', location: 'Cleveland, OH', phone: '(216) 702-4000', website: 'https://www.howardhanna.com/cleveland', hasWebsite: 'Yes', wqs: 7, opp: 7, notes: 'Cleveland OH largest real estate firm in region' },
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
  console.log(`\n✅ Batch 51 complete — ${total} prospects added.`);
})();
