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

// MedSpa Batch 4: Austin + Nashville + Portland + Columbus + Indianapolis
const prospects = [
  // Austin
  { name: 'Austin Medspa', owner: 'Dr. Elise Contant', location: 'Austin, TX', phone: '(512) 201-4090', website: 'https://www.austinmedspa.com', hasWebsite: 'Yes', wqs: 7, opp: 9, notes: 'Austin TX — fast-growing tech city medspa' },
  { name: 'Westlake Dermatology & Cosmetic Surgery', owner: 'Dr. Ted Lain', location: 'Austin, TX', phone: '(512) 328-3376', website: 'https://www.westlakedermatology.com', hasWebsite: 'Yes', wqs: 8, opp: 9, notes: 'Austin TX luxury medspa chain' },
  { name: 'Sonterra Aesthetics Austin', owner: 'Dr. Michael Eisemann', location: 'Austin, TX', phone: '(512) 346-4111', website: 'https://www.sonterraaesthetics.com', hasWebsite: 'Yes', wqs: 6, opp: 9, notes: 'Austin TX medical spa & aesthetics' },
  // Nashville
  { name: 'SkinBody Nashville', owner: 'Dr. Brent Moelleken', location: 'Nashville, TN', phone: '(615) 942-8881', website: 'https://www.skinbodynashville.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Nashville TN medspa — fast growing market' },
  { name: 'Cane Creek Aesthetics', owner: 'Dr. Amy Robbins', location: 'Nashville, TN', phone: '(615) 567-6242', website: 'https://www.canecreekaesthetics.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Nashville TN medical spa' },
  { name: 'The Skin Clique Nashville', owner: 'Dr. Brittany McCormack', location: 'Nashville, TN', phone: '(615) 891-8822', website: 'https://www.theskinclique.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Nashville TN trendy medspa — strong Instagram presence' },
  // Portland
  { name: 'Rejuvenation Clinic Portland', owner: 'Dr. Steven Jepson', location: 'Portland, OR', phone: '(503) 227-2770', website: 'https://www.rejuvenationclinicpdx.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Portland OR medspa' },
  { name: 'The Aesthetics Lounge', owner: 'Dr. Donna Bilu Martin', location: 'Portland, OR', phone: '(503) 387-6060', website: 'https://www.aestheticslounge.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Portland OR medical aesthetics spa' },
  { name: 'Influence Medspa Portland', owner: 'Sarah Barnard', location: 'Portland, OR', phone: '(503) 227-8070', website: 'https://www.influencemedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Portland OR medspa — Botox & filler' },
  // Columbus
  { name: 'Columbus Medspa', owner: 'Dr. Hema Sundaram', location: 'Columbus, OH', phone: '(614) 388-8808', website: 'https://www.columbusmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Columbus OH medical spa' },
  { name: 'Evolved Medical Columbus', owner: 'Dr. Rosie Bixby', location: 'Columbus, OH', phone: '(614) 459-6066', website: 'https://www.evolvedmedical.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Columbus OH anti-aging medspa' },
  { name: 'Easton Medspa', owner: 'Dr. David Zins', location: 'Columbus, OH', phone: '(614) 414-3600', website: 'https://www.eastonmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Columbus OH — Easton Town Center area medspa' },
  // Indianapolis
  { name: 'Skin MD Indianapolis', owner: 'Dr. Nadia Levy', location: 'Indianapolis, IN', phone: '(317) 844-1401', website: 'https://www.skinmdindy.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Indianapolis IN medical spa & dermatology' },
  { name: 'Glo MedSpa Indianapolis', owner: 'Dr. Carolyn Jacob', location: 'Indianapolis, IN', phone: '(317) 571-4456', website: 'https://www.glomedspaindy.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Indianapolis IN medspa' },
  { name: 'DermOne Medical Spa Indy', owner: 'Dr. Kevin Martin', location: 'Indianapolis, IN', phone: '(317) 663-6320', website: 'https://www.dermoneindianapolis.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Indianapolis IN medical spa' },
];

(async () => {
  console.log('💆 MedSpa Prospects — Batch 4 (Austin + Nashville + Portland + Columbus + Indianapolis)');
  let total = 0;
  for (let i = 0; i < prospects.length; i++) {
    const p = prospects[i];
    await addMedSpa(p, i + 1);
    console.log(`  ✓ ${p.name} (${p.location})`);
    total++;
    await sleep(300);
  }
  console.log(`\n✅ MedSpa Batch 4 complete — ${total} prospects added.`);
})();
