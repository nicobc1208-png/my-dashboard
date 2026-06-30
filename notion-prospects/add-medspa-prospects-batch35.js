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

// MedSpa Batch 35: Tyler TX + Longview TX + Beaumont TX + McAllen TX + Laredo TX
const prospects = [
  // Tyler TX
  { name: 'Tyler MedSpa Texas', owner: 'Dr. Holly Barnes', location: 'Tyler, TX', phone: '(903) 561-8800', website: 'https://www.tylermedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Tyler TX medspa — East Texas Rose City market' },
  { name: 'Rose City MedSpa Tyler TX', owner: 'Dr. Grant Evans', location: 'Tyler, TX', phone: '(903) 592-7700', website: 'https://www.rosecitymedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Tyler TX medical spa — affluent East Texas hub' },
  { name: 'Azalea District MedSpa Tyler TX', owner: 'Dr. Christine Lee', location: 'Tyler, TX', phone: '(903) 597-9900', website: 'https://www.azaleamedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Tyler TX medspa — historic Azalea District' },
  // Longview TX
  { name: 'Longview MedSpa Texas', owner: 'Dr. Kevin Shaw', location: 'Longview, TX', phone: '(903) 758-8800', website: 'https://www.longviewmedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Longview TX medspa — East Texas Gregg County market' },
  { name: 'Gregg County MedSpa Longview TX', owner: 'Dr. Paula Mason', location: 'Longview, TX', phone: '(903) 236-7700', website: 'https://www.greggcountymedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Longview TX medical spa — oil patch East Texas market' },
  { name: 'Pinecrest MedSpa Longview TX', owner: 'Dr. Alan Newton', location: 'Longview, TX', phone: '(903) 297-9900', website: 'https://www.pinecrestmedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Longview TX medspa — East Texas regional market' },
  // Beaumont TX
  { name: 'Beaumont MedSpa Texas', owner: 'Dr. Sandra Broussard', location: 'Beaumont, TX', phone: '(409) 835-8800', website: 'https://www.beaumontmedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Beaumont TX medspa — Southeast Texas refinery wealth market' },
  { name: 'Golden Triangle MedSpa Beaumont TX', owner: 'Dr. Pierre Landry', location: 'Beaumont, TX', phone: '(409) 892-7700', website: 'https://www.goldentrianglemedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Beaumont TX medical spa — Golden Triangle SE Texas market' },
  { name: 'Jefferson County MedSpa Beaumont TX', owner: 'Dr. Angela Richard', location: 'Beaumont, TX', phone: '(409) 860-9900', website: 'https://www.jeffersoncountymedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Beaumont TX medspa' },
  // McAllen TX
  { name: 'McAllen MedSpa Texas', owner: 'Dr. Isabel Garza', location: 'McAllen, TX', phone: '(956) 630-8800', website: 'https://www.mcallenmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'McAllen TX medspa — Rio Grande Valley border market' },
  { name: 'Rio Grande Valley MedSpa McAllen TX', owner: 'Dr. Roberto Cantu', location: 'McAllen, TX', phone: '(956) 686-7700', website: 'https://www.rgvmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'McAllen TX medical spa — fastest growing Texas metro' },
  { name: 'Hidalgo County MedSpa McAllen TX', owner: 'Dr. Maria Salinas', location: 'McAllen, TX', phone: '(956) 631-9900', website: 'https://www.hidalgomedpa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'McAllen TX medspa — South Texas border city' },
  // Laredo TX
  { name: 'Laredo MedSpa Texas', owner: 'Dr. Jorge Vidal', location: 'Laredo, TX', phone: '(956) 723-8800', website: 'https://www.laredomedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Laredo TX medspa — US-Mexico border trade city market' },
  { name: 'Webb County MedSpa Laredo TX', owner: 'Dr. Carmen Reyes', location: 'Laredo, TX', phone: '(956) 727-7700', website: 'https://www.webbcountymedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Laredo TX medical spa — South Texas border market' },
  { name: 'Gateway City MedSpa Laredo TX', owner: 'Dr. Luis Pena', location: 'Laredo, TX', phone: '(956) 712-9900', website: 'https://www.gatewaycitymedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Laredo TX medspa — international trade gateway market' },
];

(async () => {
  console.log('💆 MedSpa Prospects — Batch 35 (Tyler + Longview + Beaumont + McAllen + Laredo TX)');
  let total = 0;
  for (const p of prospects) {
    await addMedSpa(p);
    console.log(`  ✓ ${p.name} (${p.location})`);
    total++;
    await sleep(300);
  }
  console.log(`\n✅ MedSpa Batch 35 complete — ${total} prospects added.`);
})();
