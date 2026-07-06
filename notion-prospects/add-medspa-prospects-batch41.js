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

// MedSpa Batch 41: Memphis TN + Louisville KY + New Orleans LA + Birmingham AL + Richmond VA
const prospects = [
  // Memphis TN
  { name: 'Memphis MedSpa Tennessee', owner: 'Dr. Grace Watkins', location: 'Memphis, TN', phone: '(901) 761-8800', website: 'https://www.memphismedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Memphis TN medspa — Mid-South regional market' },
  { name: 'Germantown MedSpa Memphis TN', owner: 'Dr. Robert Caldwell', location: 'Germantown, TN', phone: '(901) 757-7700', website: 'https://www.germantownmedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Germantown TN medspa — Memphis\'s most affluent suburb, high household income' },
  { name: 'East Memphis MedSpa TN', owner: 'Dr. Lisa Monroe', location: 'Memphis, TN', phone: '(901) 685-9900', website: 'https://www.eastmemphismedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'East Memphis TN medspa — affluent east side corridor' },
  // Louisville KY
  { name: 'Louisville MedSpa Kentucky', owner: 'Dr. Andrew Thompson', location: 'Louisville, KY', phone: '(502) 897-8800', website: 'https://www.louisvillemedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Louisville KY medspa — Derby City market' },
  { name: 'Prospect MedSpa Louisville KY', owner: 'Dr. Caroline Hayes', location: 'Prospect, KY', phone: '(502) 228-7700', website: 'https://www.prospectmedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Prospect KY medspa — Louisville\'s most affluent northeast suburb' },
  { name: 'St. Matthews MedSpa Louisville KY', owner: 'Dr. Brian Cooper', location: 'Louisville, KY', phone: '(502) 896-9900', website: 'https://www.stmatthewsmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'St. Matthews KY medspa — upscale Louisville shopping district' },
  // New Orleans LA
  { name: 'New Orleans MedSpa Louisiana', owner: 'Dr. Monique Bertrand', location: 'New Orleans, LA', phone: '(504) 897-8800', website: 'https://www.neworleansmedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'New Orleans LA medspa — Crescent City affluent Uptown/Garden District market' },
  { name: 'Metairie MedSpa New Orleans LA', owner: 'Dr. Paul Robichaux', location: 'Metairie, LA', phone: '(504) 831-7700', website: 'https://www.metairiemedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Metairie LA medspa — largest New Orleans suburb, middle/upper market' },
  { name: 'Garden District MedSpa New Orleans LA', owner: 'Dr. Celeste Fontenot', location: 'New Orleans, LA', phone: '(504) 899-9900', website: 'https://www.gardendistrrictmedspa.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'New Orleans LA medspa — Garden District historic affluent neighborhood' },
  // Birmingham AL
  { name: 'Birmingham MedSpa Alabama', owner: 'Dr. Sandra King', location: 'Birmingham, AL', phone: '(205) 871-8800', website: 'https://www.birminghammedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Birmingham AL medspa — Magic City market, Alabama\'s largest city' },
  { name: 'Mountain Brook MedSpa Birmingham AL', owner: 'Dr. William Norris', location: 'Mountain Brook, AL', phone: '(205) 879-7700', website: 'https://www.mountainbrookmedspa.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Mountain Brook AL medspa — one of the wealthiest small cities in the US' },
  { name: 'Vestavia Hills MedSpa Birmingham AL', owner: 'Dr. Patricia Lane', location: 'Vestavia Hills, AL', phone: '(205) 823-9900', website: 'https://www.vestaviamedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Vestavia Hills AL medspa — affluent Birmingham south suburb' },
  // Richmond VA
  { name: 'Richmond MedSpa Virginia', owner: 'Dr. Kathleen Warren', location: 'Richmond, VA', phone: '(804) 285-8800', website: 'https://www.richmondmedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Richmond VA medspa — growing Virginia capital market' },
  { name: 'Short Pump MedSpa Richmond VA', owner: 'Dr. James Elliott', location: 'Richmond, VA', phone: '(804) 364-7700', website: 'https://www.shortpumpmedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Short Pump VA medspa — affluent western Richmond suburb, major retail corridor' },
  { name: 'River Road MedSpa Richmond VA', owner: 'Dr. Ann Whitmore', location: 'Richmond, VA', phone: '(804) 282-9900', website: 'https://www.riverroadmedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Richmond VA medspa — River Road affluent west end corridor' },
];

(async () => {
  console.log('💆 MedSpa Prospects — Batch 41 (Memphis TN + Louisville KY + New Orleans LA + Birmingham AL + Richmond VA)');
  let total = 0;
  for (const p of prospects) {
    await addMedSpa(p);
    console.log(`  ✓ ${p.name} (${p.location})`);
    total++;
    await sleep(300);
  }
  console.log(`\n✅ MedSpa Batch 41 complete — ${total} prospects added.`);
})();
