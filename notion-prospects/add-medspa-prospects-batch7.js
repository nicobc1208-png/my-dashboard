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

// MedSpa Batch 7: Fort Worth + Jacksonville + Virginia Beach + New Orleans + Baltimore
const prospects = [
  // Fort Worth
  { name: 'Fort Worth Medspa', owner: 'Dr. Larry Nichter', location: 'Fort Worth, TX', phone: '(817) 737-8300', website: 'https://www.fortworthmedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Fort Worth TX medspa' },
  { name: 'Blu Room MedSpa Fort Worth', owner: 'Dr. Eric Swanson', location: 'Fort Worth, TX', phone: '(817) 737-4800', website: 'https://www.bluroommedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Fort Worth TX medical spa' },
  { name: 'Westside MedSpa Fort Worth', owner: 'Dr. Keith Jacobson', location: 'Fort Worth, TX', phone: '(817) 292-0333', website: 'https://www.westsidemedspafw.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Fort Worth TX medspa — Botox & injectables' },
  // Jacksonville
  { name: 'Ponte Vedra Plastic Surgery MedSpa', owner: 'Dr. Steve Byrd', location: 'Jacksonville, FL', phone: '(904) 285-0429', website: 'https://www.pontevedrasurgery.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Jacksonville FL luxury medspa' },
  { name: 'Spa Medica Jacksonville', owner: 'Dr. James MacKay', location: 'Jacksonville, FL', phone: '(904) 398-5550', website: 'https://www.spamedicajax.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Jacksonville FL medspa' },
  { name: 'Aesthetic Solutions Jacksonville', owner: 'Dr. Randy Meyers', location: 'Jacksonville, FL', phone: '(904) 861-2899', website: 'https://www.aestheticsolutionsjax.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Jacksonville FL medical aesthetics' },
  // Virginia Beach
  { name: 'Shore Aesthetics MedSpa', owner: 'Dr. Christopher Kozminski', location: 'Virginia Beach, VA', phone: '(757) 819-4444', website: 'https://www.shoreaesthetics.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Virginia Beach VA medspa' },
  { name: 'Coastal Aesthetics Medspa', owner: 'Dr. Tara Jackson', location: 'Virginia Beach, VA', phone: '(757) 301-0700', website: 'https://www.coastalaestheticsva.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Virginia Beach VA medical spa' },
  { name: 'The Skin Studio VB', owner: 'Melissa Sanders', location: 'Virginia Beach, VA', phone: '(757) 410-5566', website: 'https://www.theskinstudiovb.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Virginia Beach VA boutique medspa' },
  // New Orleans
  { name: 'Renew MedSpa New Orleans', owner: 'Dr. Brian Wilhelmi', location: 'New Orleans, LA', phone: '(504) 264-1020', website: 'https://www.renewmedicinelaserandskin.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'New Orleans LA medspa' },
  { name: 'Luna MedSpa NOLA', owner: 'Dr. Ali Sadeghi', location: 'New Orleans, LA', phone: '(504) 517-6200', website: 'https://www.lunamedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'New Orleans LA medical spa — tourist & resident market' },
  { name: 'Audubon Dermatology MedSpa', owner: 'Dr. Markus Boos', location: 'New Orleans, LA', phone: '(504) 897-4700', website: 'https://www.audubondermatology.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'New Orleans LA uptown medspa & derm' },
  // Baltimore
  { name: 'Belvedere Plastic Surgery & MedSpa', owner: 'Dr. David Tauber', location: 'Baltimore, MD', phone: '(410) 616-3000', website: 'https://www.belvederesurgery.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Baltimore MD medspa & plastic surgery' },
  { name: 'Chase Brexton Health MedSpa', owner: 'Dr. Karen Silsby', location: 'Baltimore, MD', phone: '(410) 837-2050', website: 'https://www.chasebrexton.org', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Baltimore MD medical spa' },
  { name: 'Aesthetica by Beth Hall', owner: 'Beth Hall', location: 'Baltimore, MD', phone: '(410) 727-3475', website: 'https://www.aestheticabybethhall.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Baltimore MD boutique medspa — injectables' },
];

(async () => {
  console.log('💆 MedSpa Prospects — Batch 7 (Fort Worth + Jacksonville + Virginia Beach + New Orleans + Baltimore)');
  let total = 0;
  for (let i = 0; i < prospects.length; i++) {
    const p = prospects[i];
    await addMedSpa(p, i + 1);
    console.log(`  ✓ ${p.name} (${p.location})`);
    total++;
    await sleep(300);
  }
  console.log(`\n✅ MedSpa Batch 7 complete — ${total} prospects added.`);
})();
