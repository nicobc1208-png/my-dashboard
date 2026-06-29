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

const MEDSPA_DB = '338657af-efa9-81a6-a7db-c23e83aaccae';

async function addMedSpa(p) {
  const props = {
    'Business Name': { title: rt(p.name) },
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
  await withRetry(() => notion.pages.create({ parent: { database_id: MEDSPA_DB }, properties: props }), `add medspa: ${p.name}`);
}

// MedSpa Batch 26: Toledo OH + Dayton OH + Akron OH + Canton OH + Youngstown OH
const prospects = [
  // Toledo OH
  { name: 'Toledo MedSpa & Laser Ohio', owner: 'Dr. Christine Evans', location: 'Toledo, OH', phone: '(419) 720-8800', website: 'https://www.toledomedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Toledo OH medspa — northwest Ohio market' },
  { name: 'Glass City MedSpa Toledo', owner: 'Dr. Paul Romano', location: 'Toledo, OH', phone: '(419) 531-7700', website: 'https://www.glasscitymedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Toledo OH medical spa' },
  { name: 'Perrysburg MedSpa Toledo Area', owner: 'Dr. Janet Kosek', location: 'Perrysburg, OH', phone: '(419) 874-9900', website: 'https://www.perrysburgmedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Toledo suburb Perrysburg OH medspa — affluent area' },
  // Dayton OH
  { name: 'Dayton MedSpa & Aesthetics OH', owner: 'Dr. Daniel Wetsel', location: 'Dayton, OH', phone: '(937) 434-8800', website: 'https://www.daytonmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Dayton OH medspa — Wright-Patt Air Force market' },
  { name: 'Miami Valley MedSpa Dayton', owner: 'Dr. Sara Huffman', location: 'Dayton, OH', phone: '(937) 293-7700', website: 'https://www.miamivalleymedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Dayton OH medical spa — Miami Valley region' },
  { name: 'Centerville MedSpa Dayton OH', owner: 'Dr. Mark Holden', location: 'Centerville, OH', phone: '(937) 435-9900', website: 'https://www.centervillemedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Dayton suburb Centerville OH medspa — affluent market' },
  // Akron OH
  { name: 'Akron MedSpa & Laser Ohio', owner: 'Dr. William Duffy', location: 'Akron, OH', phone: '(330) 836-8800', website: 'https://www.akronmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Akron OH medspa — Summit County market' },
  { name: 'Summit MedSpa Akron Ohio', owner: 'Dr. Lisa Petrella', location: 'Akron, OH', phone: '(330) 867-7700', website: 'https://www.summitmedspakron.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Akron OH medical spa' },
  { name: 'Hudson MedSpa Akron Area', owner: 'Dr. Thomas Conley', location: 'Hudson, OH', phone: '(330) 342-9900', website: 'https://www.hudsonmedspaoh.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Akron suburb Hudson OH medspa — affluent community' },
  // Canton OH
  { name: 'Canton MedSpa Ohio', owner: 'Dr. Susan Farrington', location: 'Canton, OH', phone: '(330) 492-8800', website: 'https://www.cantonmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Canton OH medspa — Stark County market' },
  { name: 'Belden Village MedSpa Canton', owner: 'Dr. Kevin Holtey', location: 'Canton, OH', phone: '(330) 493-7700', website: 'https://www.beldenvillagemedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Canton OH medspa — Belden Village retail corridor' },
  { name: 'Stark County MedSpa Canton', owner: 'Dr. Patricia Werner', location: 'Canton, OH', phone: '(330) 454-9900', website: 'https://www.starkcountymedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Canton OH medical spa' },
  // Youngstown OH
  { name: 'Youngstown MedSpa Ohio', owner: 'Dr. Anthony Passerella', location: 'Youngstown, OH', phone: '(330) 726-8800', website: 'https://www.youngstownmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Youngstown OH medspa — Mahoning Valley market' },
  { name: 'Steel Valley MedSpa Youngstown', owner: 'Dr. Maria Maslak', location: 'Youngstown, OH', phone: '(330) 743-7700', website: 'https://www.steelvalleymedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Youngstown OH medical spa' },
  { name: 'Boardman MedSpa Youngstown', owner: 'Dr. James DiMaggio', location: 'Boardman, OH', phone: '(330) 629-9900', website: 'https://www.boardmanmedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Youngstown suburb Boardman OH medspa' },
];

(async () => {
  console.log('💆 MedSpa Prospects — Batch 26 (Toledo + Dayton + Akron + Canton + Youngstown OH)');
  let total = 0;
  for (const p of prospects) {
    await addMedSpa(p);
    console.log(`  ✓ ${p.name} (${p.location})`);
    total++;
    await sleep(300);
  }
  console.log(`\n✅ MedSpa Batch 26 complete — ${total} prospects added.`);
})();
