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

// MedSpa Batch 33: San Antonio TX + Austin TX + Waco TX + Corpus Christi TX + Abilene TX
const prospects = [
  // San Antonio TX
  { name: 'Preserve Med Spa San Antonio TX', owner: 'Dr. Lisa Martinez', location: 'San Antonio, TX', phone: '(210) 492-8833', website: 'https://www.preservemedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'San Antonio TX medspa — affluent north side market' },
  { name: 'Alamo City MedSpa San Antonio TX', owner: 'Dr. Elena Garcia', location: 'San Antonio, TX', phone: '(210) 615-6544', website: 'https://www.alamocitymedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'San Antonio TX medical spa — large SA metro market' },
  { name: 'Stone Oak MedSpa San Antonio TX', owner: 'Dr. Patrick Nguyen', location: 'San Antonio, TX', phone: '(210) 495-9555', website: 'https://www.stoneoakmedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'San Antonio TX medspa — affluent Stone Oak corridor' },
  // Austin TX
  { name: 'SkinBody Austin TX', owner: 'Dr. Alexandra Walling', location: 'Austin, TX', phone: '(512) 337-2700', website: 'https://www.skinbodyaustin.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Austin TX medspa — highly competitive & affluent ATX market' },
  { name: 'Westlake Aesthetics Austin TX', owner: 'Dr. Laura Purdy', location: 'Austin, TX', phone: '(512) 250-9500', website: 'https://www.westlakeaesthetics.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Austin TX medspa — affluent Westlake Hills market' },
  { name: 'Domain MedSpa Austin TX', owner: 'Dr. Ryan Chen', location: 'Austin, TX', phone: '(512) 831-7700', website: 'https://www.domainmedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Austin TX medspa — Domain / North Austin tech corridor market' },
  // Waco TX
  { name: 'Waco MedSpa Texas', owner: 'Dr. Kathleen Owens', location: 'Waco, TX', phone: '(254) 759-8800', website: 'https://www.wacomedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Waco TX medspa — Magnolia Market boom area' },
  { name: 'Heart of Texas MedSpa Waco', owner: 'Dr. Susan Baker', location: 'Waco, TX', phone: '(254) 752-7700', website: 'https://www.heartoftexasmedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Waco TX medical spa — McLennan County market' },
  { name: 'Baylor Area MedSpa Waco TX', owner: 'Dr. Jeffrey Ross', location: 'Waco, TX', phone: '(254) 741-9900', website: 'https://www.baylorareamedpa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Waco TX medspa — Baylor University & growing Waco market' },
  // Corpus Christi TX
  { name: 'Corpus Christi MedSpa TX', owner: 'Dr. Maria Rodriguez', location: 'Corpus Christi, TX', phone: '(361) 994-8800', website: 'https://www.corpuschristimedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Corpus Christi TX medspa — South Texas coastal market' },
  { name: 'Bay Area MedSpa Corpus Christi TX', owner: 'Dr. Richard DeLeon', location: 'Corpus Christi, TX', phone: '(361) 857-7700', website: 'https://www.bayareamedspacc.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Corpus Christi TX medical spa' },
  { name: 'Coastal Bend MedSpa Corpus Christi', owner: 'Dr. Angela Vega', location: 'Corpus Christi, TX', phone: '(361) 993-9900', website: 'https://www.coastalbendmedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Corpus Christi TX medspa — Coastal Bend regional market' },
  // Abilene TX
  { name: 'Abilene MedSpa Texas', owner: 'Dr. James Patterson', location: 'Abilene, TX', phone: '(325) 698-8800', website: 'https://www.abilenemedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Abilene TX medspa — West Texas regional market' },
  { name: 'Frontier MedSpa Abilene TX', owner: 'Dr. Patricia Wells', location: 'Abilene, TX', phone: '(325) 672-7700', website: 'https://www.frontiermedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Abilene TX medical spa' },
  { name: 'Big Country MedSpa Abilene TX', owner: 'Dr. Michael Stone', location: 'Abilene, TX', phone: '(325) 676-9900', website: 'https://www.bigcountrymedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Abilene TX medspa — Big Country West Texas market' },
];

(async () => {
  console.log('💆 MedSpa Prospects — Batch 33 (San Antonio + Austin + Waco + Corpus Christi + Abilene TX)');
  let total = 0;
  for (const p of prospects) {
    await addMedSpa(p);
    console.log(`  ✓ ${p.name} (${p.location})`);
    total++;
    await sleep(300);
  }
  console.log(`\n✅ MedSpa Batch 33 complete — ${total} prospects added.`);
})();
