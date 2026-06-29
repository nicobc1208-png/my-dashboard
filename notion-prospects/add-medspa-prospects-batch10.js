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

async function addMedSpa(p, index) {
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
  await withRetry(() => notion.pages.create({ parent: { database_id: MEDSPA_DB }, properties: props }), `add medspa: ${p.name}`);
}

// MedSpa Batch 10: Cincinnati + Memphis + Hartford + Providence + Greenville SC
const prospects = [
  // Cincinnati
  { name: 'Cincinnati MedSpa', owner: 'Dr. Andrew Campbell', location: 'Cincinnati, OH', phone: '(513) 793-8737', website: 'https://www.cincinnatimedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Cincinnati OH medical spa' },
  { name: 'Skin Care Specialists Cincinnati', owner: 'Dr. Bruce Thiers', location: 'Cincinnati, OH', phone: '(513) 533-2222', website: 'https://www.skinspecialists.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Cincinnati OH dermatology & medspa' },
  { name: 'Body by Design MedSpa Cincinnati', owner: 'Dr. Linda Hensley', location: 'Cincinnati, OH', phone: '(513) 851-8888', website: 'https://www.bodybydesignmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Cincinnati OH medspa & body contouring' },
  // Memphis
  { name: 'Memphis MedSpa', owner: 'Dr. Jorge Jimenez', location: 'Memphis, TN', phone: '(901) 767-8463', website: 'https://www.memphismedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Memphis TN medical spa' },
  { name: 'Germantown Aesthetics MedSpa', owner: 'Dr. Martha Collins', location: 'Memphis, TN', phone: '(901) 744-9900', website: 'https://www.germantownaesthetics.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Memphis TN medspa — affluent Germantown suburb' },
  { name: 'Peabody MedSpa Memphis', owner: 'Dr. Roberta Ferris', location: 'Memphis, TN', phone: '(901) 525-4800', website: 'https://www.peabodymedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Memphis TN downtown medspa' },
  // Hartford
  { name: 'Connecticut MedSpa Hartford', owner: 'Dr. Rebecca Leibowitz', location: 'Hartford, CT', phone: '(860) 676-2220', website: 'https://www.ctmedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Hartford CT medical spa' },
  { name: 'Aesthetic MedSpa Hartford', owner: 'Dr. William Passaretti', location: 'Hartford, CT', phone: '(860) 524-4900', website: 'https://www.aestheticmedspa-ct.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Hartford CT medspa — high-income CT market' },
  { name: 'Simsbury Skin Care MedSpa', owner: 'Dr. Stacy Hawkins', location: 'Hartford, CT', phone: '(860) 658-0066', website: 'https://www.simsburyskincare.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Hartford-area CT medspa' },
  // Providence
  { name: 'Ocean State MedSpa Providence', owner: 'Dr. John Maguire', location: 'Providence, RI', phone: '(401) 228-3399', website: 'https://www.oceanstatemedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Providence RI medical spa' },
  { name: 'East Side MedSpa Providence', owner: 'Dr. Mary Gannon', location: 'Providence, RI', phone: '(401) 272-7779', website: 'https://www.eastsidemedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Providence RI medspa — college hill neighborhood' },
  { name: 'Skin Works MedSpa RI', owner: 'Dr. Nancy Ehmann', location: 'Providence, RI', phone: '(401) 421-5777', website: 'https://www.skinworksri.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Providence RI medspa & aesthetics' },
  // Greenville SC
  { name: 'Upstate MedSpa Greenville', owner: 'Dr. Steven Gitt', location: 'Greenville, SC', phone: '(864) 233-0099', website: 'https://www.upstatemedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Greenville SC — fast growing market medspa' },
  { name: 'Vogue MedSpa Greenville', owner: 'Dr. Tara Vance', location: 'Greenville, SC', phone: '(864) 757-2000', website: 'https://www.voguemedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Greenville SC medspa' },
  { name: 'Carolina MedSpa Greenville SC', owner: 'Dr. Amy Forsberg', location: 'Greenville, SC', phone: '(864) 608-3888', website: 'https://www.carolinamedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Greenville SC medical spa — growing Upstate market' },
];

(async () => {
  console.log('💆 MedSpa Prospects — Batch 10 (Cincinnati + Memphis + Hartford + Providence + Greenville SC)');
  let total = 0;
  for (let i = 0; i < prospects.length; i++) {
    const p = prospects[i];
    await addMedSpa(p, i + 1);
    console.log(`  ✓ ${p.name} (${p.location})`);
    total++;
    await sleep(300);
  }
  console.log(`\n✅ MedSpa Batch 10 complete — ${total} prospects added.`);
})();
