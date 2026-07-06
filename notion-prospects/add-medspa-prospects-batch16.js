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

// MedSpa Batch 16: Fort Collins CO + Boulder CO + Columbia MO + Knoxville TN + Chattanooga TN
const prospects = [
  // Fort Collins CO
  { name: 'Fort Collins MedSpa & Laser', owner: 'Dr. Wendy Hauser', location: 'Fort Collins, CO', phone: '(970) 224-8800', website: 'https://www.fortcollinsmedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Fort Collins CO medspa — booming Northern Colorado market' },
  { name: 'Cache La Poudre MedSpa Fort Collins', owner: 'Dr. Alicia Stone', location: 'Fort Collins, CO', phone: '(970) 493-7000', website: 'https://www.clpmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Fort Collins CO medical spa' },
  { name: 'Skin Smart MedSpa Fort Collins', owner: 'Dr. Bryan Caldwell', location: 'Fort Collins, CO', phone: '(970) 377-0777', website: 'https://www.skinsmartfc.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Fort Collins CO medspa & skin care' },
  // Boulder CO
  { name: 'Boulder MedSpa & Aesthetics', owner: 'Dr. Shannon Koonin', location: 'Boulder, CO', phone: '(303) 440-3333', website: 'https://www.bouldermedspa.com', hasWebsite: 'Yes', wqs: 7, opp: 9, notes: 'Boulder CO luxury medspa — affluent health-conscious population' },
  { name: 'Pearl Street MedSpa Boulder', owner: 'Dr. Jennifer Graham', location: 'Boulder, CO', phone: '(303) 443-1900', website: 'https://www.pearlstreetmedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Boulder CO medspa — Pearl Street high foot traffic' },
  { name: 'Rocky Mountain MedSpa Boulder', owner: 'Dr. Chris Lewis', location: 'Boulder, CO', phone: '(303) 448-4000', website: 'https://www.rockymountainmedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Boulder CO medical spa' },
  // Columbia MO
  { name: 'Columbia MedSpa & Skin Care', owner: 'Dr. Nathan Collins', location: 'Columbia, MO', phone: '(573) 443-2600', website: 'https://www.columbiamedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Columbia MO medspa — Mizzou college town market' },
  { name: 'Boone County MedSpa Columbia', owner: 'Dr. Lisa Taylor', location: 'Columbia, MO', phone: '(573) 875-7700', website: 'https://www.boonecountymedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Columbia MO medical spa' },
  { name: 'Midwest MedSpa Columbia MO', owner: 'Dr. Mark Hennessy', location: 'Columbia, MO', phone: '(573) 441-0900', website: 'https://www.midwestmedspamo.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Columbia MO medspa' },
  // Knoxville TN
  { name: 'Knoxville MedSpa & Laser', owner: 'Dr. Brad Davis', location: 'Knoxville, TN', phone: '(865) 769-3008', website: 'https://www.knoxvillemedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Knoxville TN medical spa — East TN market' },
  { name: 'Tennessee Aesthetic & Medspa Knoxville', owner: 'Dr. Karen Hooper', location: 'Knoxville, TN', phone: '(865) 523-7611', website: 'https://www.tnaesthetic.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Knoxville TN medspa' },
  { name: 'Smoky Mountain MedSpa Knoxville', owner: 'Dr. Paul Wheeler', location: 'Knoxville, TN', phone: '(865) 544-8688', website: 'https://www.smokymotnainmedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Knoxville TN medspa — Smoky Mountain region' },
  // Chattanooga TN
  { name: 'Chattanooga MedSpa', owner: 'Dr. Jennifer Owen', location: 'Chattanooga, TN', phone: '(423) 648-9999', website: 'https://www.chattanoogamedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Chattanooga TN medical spa' },
  { name: 'Lookout Mountain MedSpa Chattanooga', owner: 'Dr. Henry Boyd', location: 'Chattanooga, TN', phone: '(423) 756-7546', website: 'https://www.lookoutmtnmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Chattanooga TN medspa — affluent Lookout Mountain market' },
  { name: 'Signal Mountain MedSpa Chattanooga', owner: 'Dr. Diane Patel', location: 'Chattanooga, TN', phone: '(423) 886-5500', website: 'https://www.signalmtnmedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Chattanooga TN medspa' },
];

(async () => {
  console.log('💆 MedSpa Prospects — Batch 16 (Fort Collins + Boulder + Columbia MO + Knoxville + Chattanooga)');
  let total = 0;
  for (const p of prospects) {
    await addMedSpa(p);
    console.log(`  ✓ ${p.name} (${p.location})`);
    total++;
    await sleep(300);
  }
  console.log(`\n✅ MedSpa Batch 16 complete — ${total} prospects added.`);
})();
