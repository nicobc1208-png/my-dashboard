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

// MedSpa Batch 15: Tallahassee FL + Gainesville FL + Pensacola FL + Corpus Christi TX + Wichita KS
const prospects = [
  // Tallahassee FL
  { name: 'Tallahassee MedSpa', owner: 'Dr. Amy Meyers', location: 'Tallahassee, FL', phone: '(850) 297-9988', website: 'https://www.tallahasseemedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Tallahassee FL medical spa — state capital market' },
  { name: 'Capital City Aesthetics Tallahassee', owner: 'Dr. Helen Richardson', location: 'Tallahassee, FL', phone: '(850) 891-8808', website: 'https://www.capitalcityaesthetics.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Tallahassee FL medspa' },
  { name: 'Rejuvenation MedSpa Tallahassee', owner: 'Dr. Patrick McCue', location: 'Tallahassee, FL', phone: '(850) 562-6900', website: 'https://www.rejuvenationmedspatal.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Tallahassee FL medspa — Botox and fillers' },
  // Gainesville FL
  { name: 'Gainesville MedSpa & Laser', owner: 'Dr. Joseph Calandro', location: 'Gainesville, FL', phone: '(352) 377-5000', website: 'https://www.gainesvillemedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Gainesville FL medical spa' },
  { name: 'UF Health Aesthetics Gainesville', owner: 'Dr. Maria Villa', location: 'Gainesville, FL', phone: '(352) 392-8000', website: 'https://www.ufhealthaesthetics.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Gainesville FL medspa — university market' },
  { name: 'Gator MedSpa Gainesville', owner: 'Dr. Sandra Stone', location: 'Gainesville, FL', phone: '(352) 338-9110', website: 'https://www.gatormedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Gainesville FL medical spa & aesthetics' },
  // Pensacola FL
  { name: 'Emerald Coast MedSpa Pensacola', owner: 'Dr. Ryan Whitworth', location: 'Pensacola, FL', phone: '(850) 432-5800', website: 'https://www.emeraldcoastmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Pensacola FL medspa — Gulf Coast market' },
  { name: 'Pensacola MedSpa & Skin Care', owner: 'Dr. Jennifer Cole', location: 'Pensacola, FL', phone: '(850) 479-2100', website: 'https://www.pensacolamedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Pensacola FL medical spa' },
  { name: 'Gulf Breeze MedSpa Pensacola', owner: 'Dr. Thomas Barker', location: 'Pensacola, FL', phone: '(850) 934-3300', website: 'https://www.gulfbreezemedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Pensacola/Gulf Breeze FL medspa' },
  // Corpus Christi TX
  { name: 'Coastal Bend MedSpa Corpus Christi', owner: 'Dr. Maria Leal', location: 'Corpus Christi, TX', phone: '(361) 991-5700', website: 'https://www.coastalbendmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Corpus Christi TX medical spa' },
  { name: 'Bay Area MedSpa Corpus Christi', owner: 'Dr. James Rodriguez', location: 'Corpus Christi, TX', phone: '(361) 854-2200', website: 'https://www.bayareamedspacc.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Corpus Christi TX medspa' },
  { name: 'Harbor Aesthetics Corpus Christi', owner: 'Dr. Sandra Garza', location: 'Corpus Christi, TX', phone: '(361) 883-8800', website: 'https://www.harboraesthetics.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Corpus Christi TX medspa & aesthetics' },
  // Wichita KS
  { name: 'Wichita MedSpa & Laser Center', owner: 'Dr. Dale Grothe', location: 'Wichita, KS', phone: '(316) 683-0303', website: 'https://www.wichitamedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Wichita KS medical spa' },
  { name: 'Midwest Aesthetics Wichita', owner: 'Dr. Kim Lindsey', location: 'Wichita, KS', phone: '(316) 265-7546', website: 'https://www.midwestaestheticsks.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Wichita KS medspa' },
  { name: 'Prairie Heart MedSpa Wichita', owner: 'Dr. Jennifer Haug', location: 'Wichita, KS', phone: '(316) 448-2900', website: 'https://www.prairieheartmedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Wichita KS medical spa — Botox and filler' },
];

(async () => {
  console.log('💆 MedSpa Prospects — Batch 15 (Tallahassee + Gainesville + Pensacola + Corpus Christi + Wichita)');
  let total = 0;
  for (const p of prospects) {
    await addMedSpa(p);
    console.log(`  ✓ ${p.name} (${p.location})`);
    total++;
    await sleep(300);
  }
  console.log(`\n✅ MedSpa Batch 15 complete — ${total} prospects added.`);
})();
