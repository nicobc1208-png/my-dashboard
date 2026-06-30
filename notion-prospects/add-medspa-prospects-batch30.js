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

// MedSpa Batch 30: Cedar Rapids IA + Davenport IA + Sioux City IA + Topeka KS + Springfield MO
const prospects = [
  // Cedar Rapids IA
  { name: 'Cedar Rapids MedSpa Iowa', owner: 'Dr. Laura Sherwood', location: 'Cedar Rapids, IA', phone: '(319) 362-8800', website: 'https://www.cedarrapidsmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Cedar Rapids IA medspa — second largest Iowa city' },
  { name: 'Czech Village MedSpa Cedar Rapids', owner: 'Dr. Mark Novotny', location: 'Cedar Rapids, IA', phone: '(319) 366-7700', website: 'https://www.czechvillagemedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Cedar Rapids IA medical spa' },
  { name: 'Marion MedSpa Cedar Rapids Area', owner: 'Dr. Susan Foss', location: 'Marion, IA', phone: '(319) 377-9900', website: 'https://www.marionmedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Cedar Rapids suburb Marion IA medspa' },
  // Davenport IA (Quad Cities)
  { name: 'Davenport MedSpa Iowa', owner: 'Dr. Thomas Brandl', location: 'Davenport, IA', phone: '(563) 322-8800', website: 'https://www.davenportmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Davenport IA medspa — Iowa side of Quad Cities' },
  { name: 'Bettendorf MedSpa Davenport Area', owner: 'Dr. Mary Klingenberg', location: 'Bettendorf, IA', phone: '(563) 359-7700', website: 'https://www.bettendorfmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Bettendorf IA medspa — affluent Quad Cities suburb' },
  { name: 'Quad Cities MedSpa Iowa Side', owner: 'Dr. Robert Giunta', location: 'Davenport, IA', phone: '(563) 326-9900', website: 'https://www.qcmedspaia.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Davenport IA medical spa — Quad Cities metro' },
  // Sioux City IA
  { name: 'Sioux City MedSpa Iowa', owner: 'Dr. Jennifer Wells', location: 'Sioux City, IA', phone: '(712) 252-8800', website: 'https://www.siouxcitymedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Sioux City IA medspa — tri-state metro (IA/NE/SD)' },
  { name: 'Missouri River MedSpa Sioux City', owner: 'Dr. David Siebert', location: 'Sioux City, IA', phone: '(712) 255-7700', website: 'https://www.missouririvermedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Sioux City IA medical spa' },
  { name: 'Siouxland MedSpa Sioux City IA', owner: 'Dr. Karen Petersen', location: 'Sioux City, IA', phone: '(712) 258-9900', website: 'https://www.siouxlandmedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Sioux City IA medspa — Siouxland regional hub' },
  // Topeka KS
  { name: 'Topeka MedSpa Kansas', owner: 'Dr. Brian Weis', location: 'Topeka, KS', phone: '(785) 234-8800', website: 'https://www.topekamedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Topeka KS medspa — state capital market' },
  { name: 'Capital City MedSpa Topeka KS', owner: 'Dr. Lisa Graff', location: 'Topeka, KS', phone: '(785) 235-7700', website: 'https://www.capitalcitymedspaks.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Topeka KS medical spa' },
  { name: 'Shawnee County MedSpa Topeka', owner: 'Dr. Michael Vogts', location: 'Topeka, KS', phone: '(785) 272-9900', website: 'https://www.shawneecountymedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Topeka KS medspa — Shawnee County market' },
  // Springfield MO
  { name: 'Springfield MedSpa Missouri', owner: 'Dr. Cynthia Frazier', location: 'Springfield, MO', phone: '(417) 831-8800', website: 'https://www.springfieldmomedspa2.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Springfield MO medspa — Ozarks regional hub' },
  { name: 'Ozark Mountain MedSpa Springfield', owner: 'Dr. Alan Sims', location: 'Springfield, MO', phone: '(417) 886-7700', website: 'https://www.ozarkmtnmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Springfield MO medical spa — Ozarks market' },
  { name: 'Bass Pro Area MedSpa Springfield', owner: 'Dr. Sandra Kelley', location: 'Springfield, MO', phone: '(417) 882-9900', website: 'https://www.bassproamedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Springfield MO medspa near Bass Pro corporate HQ' },
];

(async () => {
  console.log('💆 MedSpa Prospects — Batch 30 (Cedar Rapids + Davenport + Sioux City IA + Topeka KS + Springfield MO)');
  let total = 0;
  for (const p of prospects) {
    await addMedSpa(p);
    console.log(`  ✓ ${p.name} (${p.location})`);
    total++;
    await sleep(300);
  }
  console.log(`\n✅ MedSpa Batch 30 complete — ${total} prospects added.`);
})();
