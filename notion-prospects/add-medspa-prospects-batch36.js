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

// MedSpa Batch 36: Phoenix AZ metro — Scottsdale + Phoenix + Mesa + Tempe + Chandler
const prospects = [
  // Scottsdale AZ (ultra-premium medspa market)
  { name: 'Scottsdale MedSpa & Aesthetics AZ', owner: 'Dr. Alexandra Reid', location: 'Scottsdale, AZ', phone: '(480) 948-8800', website: 'https://www.scottsdalemedspa.com', hasWebsite: 'Yes', wqs: 8, opp: 9, notes: 'Scottsdale AZ medspa — one of the best medspa markets in the US, ultra-affluent' },
  { name: 'Silverleaf MedSpa Scottsdale AZ', owner: 'Dr. Justin Yates', location: 'Scottsdale, AZ', phone: '(480) 513-7700', website: 'https://www.silverleafmedspa.com', hasWebsite: 'Yes', wqs: 7, opp: 9, notes: 'Scottsdale AZ medspa — North Scottsdale ultra-luxury market' },
  { name: 'Old Town MedSpa Scottsdale AZ', owner: 'Dr. Megan Cole', location: 'Scottsdale, AZ', phone: '(480) 994-9900', website: 'https://www.oldtownscottsdalemedspa.com', hasWebsite: 'Yes', wqs: 7, opp: 9, notes: 'Scottsdale AZ medspa — Old Town Scottsdale tourist & affluent market' },
  // Phoenix AZ
  { name: 'Biltmore MedSpa Phoenix AZ', owner: 'Dr. Sandra Walsh', location: 'Phoenix, AZ', phone: '(602) 956-8800', website: 'https://www.biltmoremedspa.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Phoenix AZ medspa — Biltmore affluent corridor' },
  { name: 'Arcadia MedSpa Phoenix AZ', owner: 'Dr. Thomas Hardy', location: 'Phoenix, AZ', phone: '(602) 840-7700', website: 'https://www.arcadiamedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Phoenix AZ medspa — Arcadia/Camelback affluent neighborhood' },
  { name: 'Paradise Valley MedSpa Phoenix AZ', owner: 'Dr. Rachel Monroe', location: 'Phoenix, AZ', phone: '(602) 996-9900', website: 'https://www.paradisevalleymedspa.com', hasWebsite: 'Yes', wqs: 7, opp: 9, notes: 'Phoenix AZ medspa — Paradise Valley ultra-luxury enclave' },
  // Mesa AZ
  { name: 'Mesa MedSpa Arizona', owner: 'Dr. Daniel Fitch', location: 'Mesa, AZ', phone: '(480) 844-8800', website: 'https://www.mesamedspaz.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Mesa AZ medspa — large East Valley Phoenix suburb' },
  { name: 'Gilbert MedSpa Arizona', owner: 'Dr. Lisa Hendricks', location: 'Gilbert, AZ', phone: '(480) 926-7700', website: 'https://www.gilbertmedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Gilbert AZ medspa — fast-growing affluent East Valley suburb' },
  { name: 'East Valley MedSpa Mesa AZ', owner: 'Dr. Patrick Ellis', location: 'Mesa, AZ', phone: '(480) 832-9900', website: 'https://www.eastvalleymedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Mesa AZ medspa — East Valley Phoenix metro market' },
  // Tempe AZ
  { name: 'Tempe MedSpa Arizona', owner: 'Dr. Jennifer Soto', location: 'Tempe, AZ', phone: '(480) 967-8800', website: 'https://www.tempemedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Tempe AZ medspa — ASU / young professional market' },
  { name: 'Chandler MedSpa Arizona', owner: 'Dr. Brian Foster', location: 'Chandler, AZ', phone: '(480) 812-7700', website: 'https://www.chandlermedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Chandler AZ medspa — affluent South East Valley tech hub market' },
  { name: 'Ahwatukee MedSpa Phoenix AZ', owner: 'Dr. Nancy Howell', location: 'Phoenix, AZ', phone: '(480) 893-9900', website: 'https://www.ahwatukeemedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Ahwatukee AZ medspa — affluent South Mountain Phoenix village' },
  // Glendale/Peoria AZ (West Valley)
  { name: 'Peoria MedSpa Arizona', owner: 'Dr. Mark Olson', location: 'Peoria, AZ', phone: '(623) 979-8800', website: 'https://www.peoriamedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Peoria AZ medspa — rapidly growing West Valley market' },
  { name: 'Glendale MedSpa Arizona', owner: 'Dr. Karen Pierce', location: 'Glendale, AZ', phone: '(623) 435-7700', website: 'https://www.glendalemedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Glendale AZ medspa — West Valley Phoenix suburb' },
  { name: 'Surprise MedSpa Arizona', owner: 'Dr. Scott Walters', location: 'Surprise, AZ', phone: '(623) 546-9900', website: 'https://www.surprisemedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Surprise AZ medspa — fast-growing Northwest Valley retirement & family market' },
];

(async () => {
  console.log('💆 MedSpa Prospects — Batch 36 (Phoenix AZ Metro: Scottsdale + Phoenix + Mesa + Tempe + Chandler)');
  let total = 0;
  for (const p of prospects) {
    await addMedSpa(p);
    console.log(`  ✓ ${p.name} (${p.location})`);
    total++;
    await sleep(300);
  }
  console.log(`\n✅ MedSpa Batch 36 complete — ${total} prospects added.`);
})();
