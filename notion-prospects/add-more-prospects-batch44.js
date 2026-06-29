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

// Batch 44: Santa Fe NM + Albuquerque NM (additional) + Las Cruces NM
const batches = [
  {
    db: 'plasticSurgery',
    prospects: [
      { name: 'Santa Fe Plastic Surgery', owner: 'Dr. Robert Peterson', location: 'Santa Fe, NM', phone: '(505) 982-4450', website: 'https://www.santafeplasticsurgery.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Santa Fe NM plastic surgery — affluent arts market' },
      { name: 'New Mexico Plastic Surgery Albuquerque', owner: 'Dr. David Stroup', location: 'Albuquerque, NM', phone: '(505) 883-8411', website: 'https://www.nmplasticsurgery.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Albuquerque NM plastic surgery' },
      { name: 'Las Cruces Plastic Surgery', owner: 'Dr. Jerry Dorf', location: 'Las Cruces, NM', phone: '(575) 522-5665', website: 'https://www.lascrucessplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Las Cruces NM plastic surgery — border market' },
    ],
  },
  {
    db: 'personalInjury',
    prospects: [
      { name: 'Dixon Scholl Carrillo Santa Fe', owner: 'Matt Sholl', location: 'Santa Fe, NM', phone: '(505) 244-3890', website: 'https://www.dixonschollcarrillo.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Santa Fe NM personal injury law' },
      { name: 'Keller & Keller Albuquerque', owner: 'Steve Keller', location: 'Albuquerque, NM', phone: '(505) 243-3031', website: 'https://www.2kellerlawfirm.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Albuquerque NM personal injury — well-known regional firm' },
      { name: 'Madison Law Firm Las Cruces', owner: 'Tom Madison', location: 'Las Cruces, NM', phone: '(575) 523-0101', website: 'https://www.madisonlawnm.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Las Cruces NM personal injury' },
    ],
  },
  {
    db: 'roofing',
    prospects: [
      { name: 'Santa Fe Roofing Company', owner: 'Mike Torres', location: 'Santa Fe, NM', phone: '(505) 986-0300', website: 'https://www.santaferoofing.com', hasWebsite: 'Yes', wqs: 4, opp: 8, notes: 'Santa Fe NM roofing — adobe & flat roof specialty market' },
      { name: 'Rio Grande Roofing Albuquerque', owner: 'Carlos Lujan', location: 'Albuquerque, NM', phone: '(505) 897-7663', website: 'https://www.riogranderoofing.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Albuquerque NM roofing contractor' },
      { name: 'Desert Southwest Roofing Las Cruces', owner: 'Tony Chavez', location: 'Las Cruces, NM', phone: '(575) 524-7663', website: 'https://www.desertsouthwestroofing.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Las Cruces NM roofing — desert market' },
    ],
  },
  {
    db: 'hvac',
    prospects: [
      { name: 'Santa Fe Mechanical', owner: 'Dan Harrington', location: 'Santa Fe, NM', phone: '(505) 471-1888', website: 'https://www.santafemechanical.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Santa Fe NM HVAC — high elevation desert climate' },
      { name: 'Barnett Mechanical Albuquerque', owner: 'Steve Barnett', location: 'Albuquerque, NM', phone: '(505) 884-1000', website: 'https://www.barnettmechanical.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Albuquerque NM HVAC service' },
      { name: 'Las Cruces Heating & Cooling', owner: 'Frank Morales', location: 'Las Cruces, NM', phone: '(575) 521-1830', website: 'https://www.lacruceshvac.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Las Cruces NM HVAC — hot desert climate' },
    ],
  },
  {
    db: 'cosmeticDentist',
    prospects: [
      { name: 'Santa Fe Dentistry', owner: 'Dr. Claudia Meriwether', location: 'Santa Fe, NM', phone: '(505) 983-3500', website: 'https://www.santafedentistry.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Santa Fe NM cosmetic dentist — affluent arts community' },
      { name: 'Albuquerque Cosmetic Dentistry', owner: 'Dr. John Montoya', location: 'Albuquerque, NM', phone: '(505) 883-7644', website: 'https://www.abqcosmetic.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Albuquerque NM cosmetic dentist' },
      { name: 'Desert Sun Dental Las Cruces', owner: 'Dr. Maria Garcia', location: 'Las Cruces, NM', phone: '(575) 525-2727', website: 'https://www.desertsundental.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Las Cruces NM cosmetic dentist' },
    ],
  },
  {
    db: 'chiroPT',
    prospects: [
      { name: 'Santa Fe Chiropractic', owner: 'Dr. Brian Sanchez', location: 'Santa Fe, NM', phone: '(505) 988-3338', website: 'https://www.santafechiropractic.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Santa Fe NM chiropractor' },
      { name: 'Albuquerque Spine & Chiropractic', owner: 'Dr. Tom Walsh', location: 'Albuquerque, NM', phone: '(505) 821-9300', website: 'https://www.abqspinechiro.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Albuquerque NM chiropractic' },
      { name: 'Las Cruces Chiropractic Center', owner: 'Dr. Jesus Saenz', location: 'Las Cruces, NM', phone: '(575) 523-5858', website: 'https://www.lacruceschiro.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Las Cruces NM chiropractor' },
    ],
  },
  {
    db: 'realEstate',
    prospects: [
      { name: 'Sothebys International Santa Fe', owner: 'Kevin Bobolsky', location: 'Santa Fe, NM', phone: '(505) 988-2533', website: 'https://www.santaferealestate.com', hasWebsite: 'Yes', wqs: 8, opp: 9, notes: 'Santa Fe NM — luxury Sothebys real estate brokerage' },
      { name: 'RE/MAX Select Albuquerque', owner: 'Dave Griggs', location: 'Albuquerque, NM', phone: '(505) 291-0001', website: 'https://www.remaxabq.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Albuquerque NM real estate brokerage' },
      { name: 'Steinborn Real Estate Las Cruces', owner: 'Gene Steinborn', location: 'Las Cruces, NM', phone: '(575) 526-2893', website: 'https://www.steinborn.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Las Cruces NM — large established real estate firm' },
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
  console.log(`\n✅ Batch 44 complete — ${total} prospects added.`);
})();
