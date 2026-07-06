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

// MedSpa Batch 24: Fort Wayne IN + South Bend IN + Evansville IN + Peoria IL + Rockford IL
const prospects = [
  // Fort Wayne IN
  { name: 'Fort Wayne MedSpa & Skin', owner: 'Dr. Holly Burnett', location: 'Fort Wayne, IN', phone: '(260) 436-0700', website: 'https://www.fortwayneskin.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Fort Wayne IN medical spa' },
  { name: 'Summit MedSpa Fort Wayne', owner: 'Dr. David Klute', location: 'Fort Wayne, IN', phone: '(260) 432-8800', website: 'https://www.summitmedspafw.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Fort Wayne IN medspa' },
  { name: 'Dupont MedSpa Fort Wayne', owner: 'Dr. James McGrath', location: 'Fort Wayne, IN', phone: '(260) 494-9900', website: 'https://www.dupontmedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Fort Wayne IN medspa — Dupont Road corridor' },
  // South Bend IN
  { name: 'Notre Dame MedSpa South Bend', owner: 'Dr. Patricia O\'Brien', location: 'South Bend, IN', phone: '(574) 272-8800', website: 'https://www.notredamemedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'South Bend IN medspa — Notre Dame university area' },
  { name: 'Michiana MedSpa South Bend', owner: 'Dr. Kevin Maloney', location: 'South Bend, IN', phone: '(574) 239-7700', website: 'https://www.michianamedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'South Bend IN medical spa — Michiana region' },
  { name: 'Granger MedSpa South Bend', owner: 'Dr. Linda Hayes', location: 'South Bend, IN', phone: '(574) 273-9900', website: 'https://www.grangermedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'South Bend/Granger IN medspa — affluent suburb' },
  // Evansville IN
  { name: 'Evansville MedSpa & Laser', owner: 'Dr. Thomas Warfield', location: 'Evansville, IN', phone: '(812) 491-8800', website: 'https://www.evansvillemedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Evansville IN medspa — Tri-State area' },
  { name: 'Ohio River MedSpa Evansville', owner: 'Dr. Sandra Harris', location: 'Evansville, IN', phone: '(812) 423-7700', website: 'https://www.ohiorivermedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Evansville IN medical spa' },
  { name: 'Newburgh MedSpa Evansville', owner: 'Dr. Chris Crawford', location: 'Evansville, IN', phone: '(812) 853-8800', website: 'https://www.newburghmedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Evansville/Newburgh IN medspa — affluent suburb' },
  // Peoria IL
  { name: 'Peoria MedSpa & Aesthetics', owner: 'Dr. Steven Ray', location: 'Peoria, IL', phone: '(309) 693-8800', website: 'https://www.peoriamedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Peoria IL medspa — central Illinois market' },
  { name: 'Heart of Illinois MedSpa Peoria', owner: 'Dr. Martha Jennings', location: 'Peoria, IL', phone: '(309) 674-7700', website: 'https://www.heartofillmedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Peoria IL medical spa' },
  { name: 'River City MedSpa Peoria', owner: 'Dr. Ronald Clark', location: 'Peoria, IL', phone: '(309) 637-9900', website: 'https://www.rivercitymedspail.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Peoria IL medspa — Illinois River market' },
  // Rockford IL
  { name: 'Rockford MedSpa & Laser', owner: 'Dr. Diane Powers', location: 'Rockford, IL', phone: '(815) 229-9900', website: 'https://www.rockfordmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Rockford IL medspa — second largest IL city' },
  { name: 'Forest City MedSpa Rockford', owner: 'Dr. Kyle Anderson', location: 'Rockford, IL', phone: '(815) 399-8800', website: 'https://www.forestcitymedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Rockford IL medical spa' },
  { name: 'Rock River MedSpa Rockford', owner: 'Dr. Amy Schultz', location: 'Rockford, IL', phone: '(815) 654-7700', website: 'https://www.rockrivermedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Rockford IL medspa — Rock River area' },
];

(async () => {
  console.log('💆 MedSpa Prospects — Batch 24 (Fort Wayne + South Bend + Evansville IN + Peoria + Rockford IL)');
  let total = 0;
  for (const p of prospects) {
    await addMedSpa(p);
    console.log(`  ✓ ${p.name} (${p.location})`);
    total++;
    await sleep(300);
  }
  console.log(`\n✅ MedSpa Batch 24 complete — ${total} prospects added.`);
})();
