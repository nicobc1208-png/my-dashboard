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

// MedSpa Batch 23: Winston-Salem NC + Greensboro NC + Columbia MO + Springfield MO + Ft. Wayne IN
const prospects = [
  // Winston-Salem NC
  { name: 'Triad MedSpa Winston-Salem', owner: 'Dr. Elizabeth Ford', location: 'Winston-Salem, NC', phone: '(336) 659-0070', website: 'https://www.triadmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Winston-Salem NC medspa — Triad region market' },
  { name: 'Salem MedSpa Winston-Salem', owner: 'Dr. Steven Coble', location: 'Winston-Salem, NC', phone: '(336) 714-8800', website: 'https://www.salemmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Winston-Salem NC medical spa' },
  { name: 'Old Salem MedSpa Winston-Salem', owner: 'Dr. Patricia Stokes', location: 'Winston-Salem, NC', phone: '(336) 777-3000', website: 'https://www.oldsalemmedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Winston-Salem NC medspa — Old Salem historic area' },
  // Greensboro NC
  { name: 'Greensboro MedSpa & Aesthetics', owner: 'Dr. Charles Tucker', location: 'Greensboro, NC', phone: '(336) 545-9800', website: 'https://www.greensboromedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Greensboro NC medspa — Triad market' },
  { name: 'Gate City MedSpa Greensboro', owner: 'Dr. Robin Harris', location: 'Greensboro, NC', phone: '(336) 286-9100', website: 'https://www.gatecitymedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Greensboro NC medical spa' },
  { name: 'Guilford MedSpa Greensboro', owner: 'Dr. Margaret Powell', location: 'Greensboro, NC', phone: '(336) 323-0033', website: 'https://www.guilfordmedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Greensboro NC medspa' },
  // Columbia MO (additional)
  { name: 'Columbia MedSpa & Laser', owner: 'Dr. William Park', location: 'Columbia, MO', phone: '(573) 886-8800', website: 'https://www.columbiamolaser.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Columbia MO medspa — laser and injectables' },
  { name: 'Tiger MedSpa Columbia MO', owner: 'Dr. Sarah Allen', location: 'Columbia, MO', phone: '(573) 256-7700', website: 'https://www.tigermedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Columbia MO medspa — Mizzou Tigers college town' },
  { name: 'Broadway MedSpa Columbia MO', owner: 'Dr. Kevin Dunn', location: 'Columbia, MO', phone: '(573) 442-4400', website: 'https://www.broadwaymedspamo.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Columbia MO medspa near Broadway arts district' },
  // Springfield MO
  { name: 'Springfield MedSpa & Aesthetics', owner: 'Dr. James Sisk', location: 'Springfield, MO', phone: '(417) 881-7700', website: 'https://www.springfieldmomedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Springfield MO medspa — Ozarks regional hub' },
  { name: 'Ozarks MedSpa Springfield MO', owner: 'Dr. Karen Miller', location: 'Springfield, MO', phone: '(417) 887-8800', website: 'https://www.ozarksmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Springfield MO medical spa' },
  { name: 'Queen City MedSpa Springfield MO', owner: 'Dr. Robert Fields', location: 'Springfield, MO', phone: '(417) 893-7000', website: 'https://www.queencitymedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Springfield MO medspa' },
  // Fort Wayne IN
  { name: 'Fort Wayne MedSpa & Laser', owner: 'Dr. Timothy Crawford', location: 'Fort Wayne, IN', phone: '(260) 459-0099', website: 'https://www.fortwaynemespa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Fort Wayne IN medspa — second largest IN city' },
  { name: 'Summit City MedSpa Fort Wayne', owner: 'Dr. Linda Haas', location: 'Fort Wayne, IN', phone: '(260) 373-8800', website: 'https://www.summitcitymedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Fort Wayne IN medical spa' },
  { name: 'Parkview MedSpa Fort Wayne', owner: 'Dr. Steven Naber', location: 'Fort Wayne, IN', phone: '(260) 266-1200', website: 'https://www.parkviewmedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Fort Wayne IN medspa — near Parkview health corridor' },
];

(async () => {
  console.log('💆 MedSpa Prospects — Batch 23 (Winston-Salem + Greensboro NC + Columbia MO + Springfield MO + Fort Wayne IN)');
  let total = 0;
  for (const p of prospects) {
    await addMedSpa(p);
    console.log(`  ✓ ${p.name} (${p.location})`);
    total++;
    await sleep(300);
  }
  console.log(`\n✅ MedSpa Batch 23 complete — ${total} prospects added.`);
})();
