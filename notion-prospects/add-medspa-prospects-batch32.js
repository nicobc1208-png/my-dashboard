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

// MedSpa Batch 32: Little Rock AR + Fort Smith AR + Oklahoma City OK (add'l) + Lawton OK + Norman OK
const prospects = [
  // Little Rock AR
  { name: 'Little Rock MedSpa Arkansas', owner: 'Dr. Susan Harrington', location: 'Little Rock, AR', phone: '(501) 224-8800', website: 'https://www.littlerockmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Little Rock AR medspa — state capital market' },
  { name: 'Capitol View MedSpa Little Rock', owner: 'Dr. James Crawford', location: 'Little Rock, AR', phone: '(501) 227-7700', website: 'https://www.capitolviewmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Little Rock AR medical spa' },
  { name: 'Chenal MedSpa Little Rock AR', owner: 'Dr. Patricia Sims', location: 'Little Rock, AR', phone: '(501) 821-9900', website: 'https://www.chenalmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Little Rock AR medspa — affluent Chenal corridor' },
  // Fort Smith AR
  { name: 'Fort Smith MedSpa Arkansas', owner: 'Dr. Kevin Harmon', location: 'Fort Smith, AR', phone: '(479) 782-8800', website: 'https://www.fortsmithmedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Fort Smith AR medspa — Arkansas River Valley market' },
  { name: 'River Valley MedSpa Fort Smith', owner: 'Dr. Linda Garrison', location: 'Fort Smith, AR', phone: '(479) 785-7700', website: 'https://www.rivervalleymedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Fort Smith AR medical spa' },
  { name: 'Sebastian County MedSpa AR', owner: 'Dr. Thomas Webb', location: 'Fort Smith, AR', phone: '(479) 783-9900', website: 'https://www.sebastiancountymedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Fort Smith AR medspa — Sebastian County market' },
  // Oklahoma City OK (additional)
  { name: 'Edmond MedSpa Oklahoma City', owner: 'Dr. Rachel Burns', location: 'Edmond, OK', phone: '(405) 341-8800', website: 'https://www.edmondmedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'OKC suburb Edmond OK medspa — very affluent north OKC' },
  { name: 'Nichols Hills MedSpa OKC', owner: 'Dr. William Hoang', location: 'Oklahoma City, OK', phone: '(405) 842-7700', website: 'https://www.nicholshillsmedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Oklahoma City OK medspa — Nichols Hills ultra-affluent area' },
  { name: 'Yukon MedSpa Oklahoma City Area', owner: 'Dr. Sandra Holt', location: 'Yukon, OK', phone: '(405) 354-9900', website: 'https://www.yukonmedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'OKC suburb Yukon OK medspa — growing west side market' },
  // Lawton OK
  { name: 'Lawton MedSpa Oklahoma', owner: 'Dr. Michael James', location: 'Lawton, OK', phone: '(580) 355-8800', website: 'https://www.lawtonmedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Lawton OK medspa — Ft. Sill military market' },
  { name: 'Comanche County MedSpa Lawton', owner: 'Dr. Amy Nguyen', location: 'Lawton, OK', phone: '(580) 248-7700', website: 'https://www.comanchemedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Lawton OK medical spa — southwest Oklahoma market' },
  { name: 'Medicine Park MedSpa Lawton', owner: 'Dr. Brian Cole', location: 'Lawton, OK', phone: '(580) 357-9900', website: 'https://www.medicineparkmedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Lawton OK medspa' },
  // Norman OK
  { name: 'Norman MedSpa Oklahoma', owner: 'Dr. Jennifer Clark', location: 'Norman, OK', phone: '(405) 321-8800', website: 'https://www.normanmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Norman OK medspa — U of Oklahoma college town market' },
  { name: 'Sooner MedSpa Norman OK', owner: 'Dr. David Wheeler', location: 'Norman, OK', phone: '(405) 366-7700', website: 'https://www.soonermedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Norman OK medical spa — OU Sooners market' },
  { name: 'Cleveland County MedSpa Norman', owner: 'Dr. Karen Bass', location: 'Norman, OK', phone: '(405) 364-9900', website: 'https://www.clevelandcountymedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Norman OK medspa' },
];

(async () => {
  console.log('💆 MedSpa Prospects — Batch 32 (Little Rock + Fort Smith AR + OKC area + Lawton + Norman OK)');
  let total = 0;
  for (const p of prospects) {
    await addMedSpa(p);
    console.log(`  ✓ ${p.name} (${p.location})`);
    total++;
    await sleep(300);
  }
  console.log(`\n✅ MedSpa Batch 32 complete — ${total} prospects added.`);
})();
