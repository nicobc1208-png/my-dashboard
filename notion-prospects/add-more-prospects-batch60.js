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

// Batch 60: El Paso TX + Albuquerque NM + Tucson AZ
const batches = [
  {
    db: 'plasticSurgery',
    prospects: [
      { name: 'El Paso Cosmetic Surgery TX', owner: 'Dr. Jesus Bustillo', location: 'El Paso, TX', phone: '(915) 533-7330', website: 'https://www.elpasocosmeticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'El Paso TX plastic surgery — large border city market' },
      { name: 'New Mexico Plastic Surgery Albuquerque', owner: 'Dr. Brent Garner', location: 'Albuquerque, NM', phone: '(505) 884-1900', website: 'https://www.nmplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Albuquerque NM plastic surgery — Southwest regional market' },
      { name: 'Tucson Plastic Surgery AZ', owner: 'Dr. Brian Evans', location: 'Tucson, AZ', phone: '(520) 323-5545', website: 'https://www.tucsonplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Tucson AZ plastic surgery — Southern AZ market' },
    ],
  },
  {
    db: 'personalInjury',
    prospects: [
      { name: 'Dominguez Law El Paso TX', owner: 'Frank Dominguez', location: 'El Paso, TX', phone: '(915) 532-0000', website: 'https://www.dominguezlawep.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'El Paso TX personal injury attorneys — border market' },
      { name: 'Albuquerque Personal Injury Law NM', owner: 'Tim Grover', location: 'Albuquerque, NM', phone: '(505) 766-9700', website: 'https://www.albuquerqueinjurylaw.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Albuquerque NM personal injury attorneys' },
      { name: 'Tucson Personal Injury Lawyers AZ', owner: 'Mark Leavitt', location: 'Tucson, AZ', phone: '(520) 622-7733', website: 'https://www.tucsoninjurylaw.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Tucson AZ personal injury law firm' },
    ],
  },
  {
    db: 'roofing',
    prospects: [
      { name: 'El Paso Roofing Company TX', owner: 'Joe Trevino', location: 'El Paso, TX', phone: '(915) 565-7663', website: 'https://www.elpasoproofing.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'El Paso TX roofing contractor' },
      { name: 'Albuquerque Roofing Pros NM', owner: 'Dan Chavez', location: 'Albuquerque, NM', phone: '(505) 883-7663', website: 'https://www.albuquerqueroofing.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Albuquerque NM roofing contractor' },
      { name: 'Tucson Roofing Experts AZ', owner: 'Bill Gonzalez', location: 'Tucson, AZ', phone: '(520) 795-7663', website: 'https://www.tucsonroofing.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Tucson AZ roofing contractor — desert climate market' },
    ],
  },
  {
    db: 'hvac',
    prospects: [
      { name: 'El Paso Heating & Air TX', owner: 'Carlos Vasquez', location: 'El Paso, TX', phone: '(915) 532-1100', website: 'https://www.elpasohvac.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'El Paso TX HVAC service — desert extreme heat market' },
      { name: 'Albuquerque Heating & Cooling NM', owner: 'Robert Sanchez', location: 'Albuquerque, NM', phone: '(505) 881-1000', website: 'https://www.albuquerquehvac.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Albuquerque NM HVAC service' },
      { name: 'Tucson AC & Heating AZ', owner: 'Mike Torres', location: 'Tucson, AZ', phone: '(520) 795-5200', website: 'https://www.tucsonachvac.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Tucson AZ HVAC — desert AC essential market' },
    ],
  },
  {
    db: 'cosmeticDentist',
    prospects: [
      { name: 'El Paso Cosmetic Dentistry TX', owner: 'Dr. Pedro Rivas', location: 'El Paso, TX', phone: '(915) 584-2222', website: 'https://www.elpasocosmeticdentist.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'El Paso TX cosmetic dentist — large border market' },
      { name: 'Albuquerque Smile Design NM', owner: 'Dr. James Gallagher', location: 'Albuquerque, NM', phone: '(505) 884-4300', website: 'https://www.albuquerquesmiledesign.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Albuquerque NM cosmetic dentist' },
      { name: 'Tucson Cosmetic Dentist AZ', owner: 'Dr. William Park', location: 'Tucson, AZ', phone: '(520) 795-2800', website: 'https://www.tucsoncosmeticdentist.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Tucson AZ cosmetic dentist — Southern AZ market' },
    ],
  },
  {
    db: 'chiroPT',
    prospects: [
      { name: 'El Paso Chiropractic TX', owner: 'Dr. Anthony Luna', location: 'El Paso, TX', phone: '(915) 533-2828', website: 'https://www.elpasochiropractic.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'El Paso TX chiropractor — border city market' },
      { name: 'Albuquerque Spine & Chiro NM', owner: 'Dr. Gary Maestas', location: 'Albuquerque, NM', phone: '(505) 881-9966', website: 'https://www.albuquerquechiro.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Albuquerque NM chiropractic & physical therapy' },
      { name: 'Tucson Chiropractic & Wellness AZ', owner: 'Dr. Kevin Kelly', location: 'Tucson, AZ', phone: '(520) 323-9090', website: 'https://www.tucsonchiropractic.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Tucson AZ chiropractor — UA / retiree market' },
    ],
  },
  {
    db: 'realEstate',
    prospects: [
      { name: 'Berkshire Hathaway El Paso TX', owner: 'Linda Rust', location: 'El Paso, TX', phone: '(915) 581-2121', website: 'https://www.bhhstexas.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'El Paso TX large real estate brokerage — major brand presence' },
      { name: 'Coldwell Banker Legacy Albuquerque NM', owner: 'Bob Toms', location: 'Albuquerque, NM', phone: '(505) 897-5200', website: 'https://www.cblegacy.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Albuquerque NM — largest real estate firm in New Mexico' },
      { name: 'Long Realty Tucson AZ', owner: 'Gary Hood', location: 'Tucson, AZ', phone: '(520) 296-2000', website: 'https://www.longrealty.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Tucson AZ large independent real estate brokerage' },
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
  console.log(`\n✅ Batch 60 complete — ${total} prospects added.`);
})();
