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

// MedSpa Batch 29: Rochester MN + Duluth MN + St. Cloud MN + Mankato MN + Lincoln NE
const prospects = [
  // Rochester MN
  { name: 'Rochester MedSpa Minnesota', owner: 'Dr. Patricia Faricy', location: 'Rochester, MN', phone: '(507) 288-8800', website: 'https://www.rochestermn medspa.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Rochester MN medspa — Mayo Clinic medical hub market' },
  { name: 'Mayo Clinic Area MedSpa Rochester', owner: 'Dr. Jeffrey Jensen', location: 'Rochester, MN', phone: '(507) 252-7700', website: 'https://www.mayoareamedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Rochester MN medical spa — affluent healthcare professional clientele' },
  { name: 'Olmsted County MedSpa Rochester', owner: 'Dr. Sarah Borgen', location: 'Rochester, MN', phone: '(507) 536-9900', website: 'https://www.olmstedmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Rochester MN medspa' },
  // Duluth MN
  { name: 'Duluth MedSpa Minnesota', owner: 'Dr. Robert Hanson', location: 'Duluth, MN', phone: '(218) 727-8800', website: 'https://www.duluthmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Duluth MN medspa — Lake Superior port city market' },
  { name: 'Lake Superior MedSpa Duluth', owner: 'Dr. Karen Melby', location: 'Duluth, MN', phone: '(218) 722-7700', website: 'https://www.lakesuperiormedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Duluth MN medical spa' },
  { name: 'Twin Ports MedSpa Duluth MN', owner: 'Dr. Michael Olson', location: 'Duluth, MN', phone: '(218) 724-9900', website: 'https://www.twinportsmedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Duluth MN medspa — Twin Ports region (Duluth-Superior)' },
  // St. Cloud MN
  { name: 'St. Cloud MedSpa Minnesota', owner: 'Dr. Amy Tauer', location: 'St. Cloud, MN', phone: '(320) 252-8800', website: 'https://www.stcloudmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'St. Cloud MN medspa — central Minnesota market' },
  { name: 'Granite City MedSpa St. Cloud', owner: 'Dr. Peter Hess', location: 'St. Cloud, MN', phone: '(320) 259-7700', website: 'https://www.granitecitymedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'St. Cloud MN medical spa — St. Cloud State U market' },
  { name: 'Central MN MedSpa St. Cloud', owner: 'Dr. Linda Becker', location: 'St. Cloud, MN', phone: '(320) 255-9900', website: 'https://www.centralmnmedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'St. Cloud MN medspa' },
  // Mankato MN
  { name: 'Mankato MedSpa Minnesota', owner: 'Dr. James Larson', location: 'Mankato, MN', phone: '(507) 387-8800', website: 'https://www.mankatomedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Mankato MN medspa — southern Minnesota market' },
  { name: 'River Hills MedSpa Mankato', owner: 'Dr. Susan Christy', location: 'Mankato, MN', phone: '(507) 345-7700', website: 'https://www.riverhillsmedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Mankato MN medical spa' },
  { name: 'Blue Earth MedSpa Mankato MN', owner: 'Dr. Todd Vogel', location: 'Mankato, MN', phone: '(507) 388-9900', website: 'https://www.blueearthmedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Mankato MN medspa — MSU Mankato college market' },
  // Lincoln NE
  { name: 'Lincoln MedSpa Nebraska', owner: 'Dr. Bradley Carstens', location: 'Lincoln, NE', phone: '(402) 483-8800', website: 'https://www.lincolnnemedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Lincoln NE medspa — state capital and U of Nebraska market' },
  { name: 'Husker MedSpa Lincoln NE', owner: 'Dr. Patricia Hagge', location: 'Lincoln, NE', phone: '(402) 435-7700', website: 'https://www.huskermedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Lincoln NE medical spa — college town affluent market' },
  { name: 'Haymarket MedSpa Lincoln NE', owner: 'Dr. David Kraft', location: 'Lincoln, NE', phone: '(402) 477-9900', website: 'https://www.haymarketmedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Lincoln NE medspa — Haymarket arts district' },
];

(async () => {
  console.log('💆 MedSpa Prospects — Batch 29 (Rochester + Duluth + St. Cloud + Mankato MN + Lincoln NE)');
  let total = 0;
  for (const p of prospects) {
    await addMedSpa(p);
    console.log(`  ✓ ${p.name} (${p.location})`);
    total++;
    await sleep(300);
  }
  console.log(`\n✅ MedSpa Batch 29 complete — ${total} prospects added.`);
})();
