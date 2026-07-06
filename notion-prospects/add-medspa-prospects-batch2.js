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

// MedSpa Batch 2: Chicago + Phoenix + Atlanta + Las Vegas + San Diego
const prospects = [
  // Chicago
  { name: 'Dermacare MedSpa Chicago', owner: 'Dr. Diane Berson', location: 'Chicago, IL', phone: '(312) 981-1800', website: 'https://www.dermacarechi.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Chicago medspa — injectables & laser' },
  { name: 'Spa Space Chicago', owner: 'Jennifer Roe', location: 'Chicago, IL', phone: '(312) 939-7510', website: 'https://www.spaspacechicago.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Chicago luxury medspa' },
  { name: 'Lakeshore Aesthetics', owner: 'Dr. Jordan Frey', location: 'Chicago, IL', phone: '(312) 878-3839', website: 'https://www.lakeshoreaesthetics.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Chicago medspa — Botox, filler, body contouring' },
  // Phoenix
  { name: 'Arizona Wellness MedSpa', owner: 'Dr. Julie Albright', location: 'Phoenix, AZ', phone: '(480) 889-8880', website: 'https://www.azwellnessmedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Phoenix AZ medspa — fast-growing market' },
  { name: 'Innovative MedSpa', owner: 'Dr. Vincent Hung', location: 'Scottsdale, AZ', phone: '(480) 990-7800', website: 'https://www.innovativemedspa.com', hasWebsite: 'Yes', wqs: 7, opp: 9, notes: 'Scottsdale AZ luxury medspa — affluent clientele' },
  { name: 'AZ Aesthetics Med Spa', owner: 'Dr. Robert Cohen', location: 'Phoenix, AZ', phone: '(602) 808-9888', website: 'https://www.azaestheticsmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Phoenix AZ medical aesthetics spa' },
  // Atlanta
  { name: 'Peachtree Plastic Surgery & MedSpa', owner: 'Dr. Brandon Richland', location: 'Atlanta, GA', phone: '(404) 355-3566', website: 'https://www.peachtreeplasticsurgery.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Atlanta GA medspa with PS' },
  { name: 'Buckhead Med Spa', owner: 'Dr. Fara Movagharnia', location: 'Atlanta, GA', phone: '(404) 350-8996', website: 'https://www.buckheadmedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Atlanta Buckhead luxury medspa — high-end market' },
  { name: 'Spa 12 Atlanta', owner: 'Candace Turner', location: 'Atlanta, GA', phone: '(404) 848-9003', website: 'https://www.spa12atlanta.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Atlanta GA medical spa & wellness' },
  // Las Vegas
  { name: 'Las Vegas MedSpa', owner: 'Dr. Julio Garcia', location: 'Las Vegas, NV', phone: '(702) 368-4000', website: 'https://www.lasvegasmedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 9, notes: 'Las Vegas NV medspa — high traffic tourist + resident market' },
  { name: 'Viva Skin MedSpa', owner: 'Dr. Rachael Jarman', location: 'Las Vegas, NV', phone: '(702) 763-6565', website: 'https://www.vivaskinmedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 9, notes: 'Las Vegas medspa — high volume clientele' },
  { name: 'Summerlin MedSpa', owner: 'Dr. Bruce Grinnell', location: 'Las Vegas, NV', phone: '(702) 877-8218', website: 'https://www.summerlinmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Las Vegas Summerlin suburb medspa' },
  // San Diego
  { name: 'Rejuvenation MedSpa San Diego', owner: 'Dr. Tahl Humes', location: 'San Diego, CA', phone: '(858) 459-3555', website: 'https://www.vitalistamedspa.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'San Diego La Jolla medspa' },
  { name: 'Illuminations Medspa', owner: 'Dr. Grace Liu', location: 'San Diego, CA', phone: '(619) 280-1609', website: 'https://www.illuminationsmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'San Diego CA medspa — laser, injectables' },
  { name: 'Pacific Beach MedSpa', owner: 'Dr. Erin Elliott', location: 'San Diego, CA', phone: '(858) 273-8600', website: 'https://www.pbmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'San Diego Pacific Beach medspa' },
];

(async () => {
  console.log('💆 MedSpa Prospects — Batch 2 (Chicago + Phoenix + Atlanta + Las Vegas + San Diego)');
  let total = 0;
  for (let i = 0; i < prospects.length; i++) {
    const p = prospects[i];
    await addMedSpa(p, i + 1);
    console.log(`  ✓ ${p.name} (${p.location})`);
    total++;
    await sleep(300);
  }
  console.log(`\n✅ MedSpa Batch 2 complete — ${total} prospects added.`);
})();
