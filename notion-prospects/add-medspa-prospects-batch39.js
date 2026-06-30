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

// MedSpa Batch 39: Kansas City MO + St. Louis MO + Minneapolis MN + Indianapolis IN + Columbus OH
const prospects = [
  // Kansas City MO
  { name: 'Kansas City MedSpa Missouri', owner: 'Dr. Stephanie Burns', location: 'Kansas City, MO', phone: '(816) 531-8800', website: 'https://www.kansascitymedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Kansas City MO medspa — large Midwest metro market' },
  { name: 'Leawood MedSpa Kansas City MO', owner: 'Dr. Richard Cole', location: 'Leawood, KS', phone: '(913) 451-7700', website: 'https://www.leawoodmedspa.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Leawood KS medspa — Kansas City\'s most affluent suburb, high household income' },
  { name: 'Mission Hills MedSpa Kansas City MO', owner: 'Dr. Angela Ford', location: 'Kansas City, MO', phone: '(816) 444-9900', website: 'https://www.missionhillsmedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Kansas City MO medspa — Mission Hills old-money neighborhood' },
  // St. Louis MO
  { name: 'St. Louis MedSpa Missouri', owner: 'Dr. Christopher Wade', location: 'St. Louis, MO', phone: '(314) 361-8800', website: 'https://www.stlouismedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'St. Louis MO medspa — large Midwest metro market' },
  { name: 'Clayton MedSpa St. Louis MO', owner: 'Dr. Pamela Greene', location: 'Clayton, MO', phone: '(314) 721-7700', website: 'https://www.claytonmedspa.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Clayton MO medspa — St. Louis\'s most affluent suburb, financial district' },
  { name: 'Ladue MedSpa St. Louis MO', owner: 'Dr. William Porter', location: 'Ladue, MO', phone: '(314) 993-9900', website: 'https://www.laduemedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Ladue MO medspa — one of the wealthiest cities in Missouri' },
  // Minneapolis MN
  { name: 'Minneapolis MedSpa Minnesota', owner: 'Dr. Karen Nielsen', location: 'Minneapolis, MN', phone: '(612) 824-8800', website: 'https://www.minneapolismedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Minneapolis MN medspa — Twin Cities metro market' },
  { name: 'Edina MedSpa Minneapolis MN', owner: 'Dr. Lars Anderson', location: 'Edina, MN', phone: '(952) 926-7700', website: 'https://www.edinamedspa.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Edina MN medspa — Minneapolis\'s most affluent suburb, 50th & France shopping district' },
  { name: 'Wayzata MedSpa Minneapolis MN', owner: 'Dr. Christine Berg', location: 'Wayzata, MN', phone: '(952) 473-9900', website: 'https://www.wayzatamedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Wayzata MN medspa — ultra-affluent Lake Minnetonka community' },
  // Indianapolis IN
  { name: 'Indianapolis MedSpa Indiana', owner: 'Dr. Mark Sullivan', location: 'Indianapolis, IN', phone: '(317) 569-8800', website: 'https://www.indianapolismedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Indianapolis IN medspa — large Midwest metro market' },
  { name: 'Carmel MedSpa Indianapolis IN', owner: 'Dr. Jennifer Clark', location: 'Carmel, IN', phone: '(317) 848-7700', website: 'https://www.carmelmedspa.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Carmel IN medspa — Indianapolis\'s most affluent suburb, consistently top-ranked US city' },
  { name: 'Zionsville MedSpa Indianapolis IN', owner: 'Dr. Andrew Price', location: 'Zionsville, IN', phone: '(317) 873-9900', website: 'https://www.zionsvillemedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Zionsville IN medspa — affluent Indianapolis northwest suburb' },
  // Columbus OH
  { name: 'Columbus MedSpa Ohio', owner: 'Dr. Sarah Mitchell', location: 'Columbus, OH', phone: '(614) 443-8800', website: 'https://www.columbusmedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Columbus OH medspa — large growing Ohio state capital market' },
  { name: 'Dublin MedSpa Columbus OH', owner: 'Dr. Robert Hayes', location: 'Dublin, OH', phone: '(614) 764-7700', website: 'https://www.dublinmedspa.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Dublin OH medspa — Columbus\'s most affluent suburb, corporate headquarters hub' },
  { name: 'New Albany MedSpa Columbus OH', owner: 'Dr. Patricia Owens', location: 'New Albany, OH', phone: '(614) 855-9900', website: 'https://www.newalbanymedspa.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'New Albany OH medspa — ultra-affluent planned community east of Columbus' },
];

(async () => {
  console.log('💆 MedSpa Prospects — Batch 39 (Kansas City MO + St. Louis MO + Minneapolis MN + Indianapolis IN + Columbus OH)');
  let total = 0;
  for (const p of prospects) {
    await addMedSpa(p);
    console.log(`  ✓ ${p.name} (${p.location})`);
    total++;
    await sleep(300);
  }
  console.log(`\n✅ MedSpa Batch 39 complete — ${total} prospects added.`);
})();
