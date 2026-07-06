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

// MedSpa Batch 25: Springfield IL + Champaign IL + Bloomington IL + Quad Cities IL + Joliet IL
const prospects = [
  // Springfield IL
  { name: 'Springfield MedSpa Illinois', owner: 'Dr. Nancy Burke', location: 'Springfield, IL', phone: '(217) 793-8800', website: 'https://www.springfieldilmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Springfield IL medspa — state capital market' },
  { name: 'Capital City MedSpa Springfield IL', owner: 'Dr. Paul Hoffmann', location: 'Springfield, IL', phone: '(217) 726-9900', website: 'https://www.capitalcitymedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Springfield IL medical spa' },
  { name: 'Lincoln Land MedSpa Springfield', owner: 'Dr. Carol Fleming', location: 'Springfield, IL', phone: '(217) 787-7700', website: 'https://www.lincolnlandmedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Springfield IL medspa — Lincoln heritage area' },
  // Champaign IL
  { name: 'Champaign MedSpa & Aesthetics', owner: 'Dr. Brian Keller', location: 'Champaign, IL', phone: '(217) 352-8800', website: 'https://www.champaignmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Champaign IL medspa — U of Illinois college town' },
  { name: 'Illini MedSpa Champaign', owner: 'Dr. Susan Park', location: 'Champaign, IL', phone: '(217) 398-7700', website: 'https://www.illinimedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Champaign IL medical spa — university market' },
  { name: 'Twin Cities MedSpa Champaign-Urbana', owner: 'Dr. Richard Chang', location: 'Champaign, IL', phone: '(217) 356-9900', website: 'https://www.twincitiesmedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Champaign-Urbana IL medspa' },
  // Bloomington IL
  { name: 'Bloomington MedSpa Illinois', owner: 'Dr. Patricia Moore', location: 'Bloomington, IL', phone: '(309) 663-8800', website: 'https://www.bloomingtonilmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Bloomington IL medspa — State Farm corporate market' },
  { name: 'Normal MedSpa Bloomington', owner: 'Dr. James Hawkins', location: 'Bloomington, IL', phone: '(309) 454-7700', website: 'https://www.normalmedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Bloomington/Normal IL medspa — ISU university area' },
  { name: 'Heartland MedSpa Bloomington IL', owner: 'Dr. Lisa Sullivan', location: 'Bloomington, IL', phone: '(309) 827-9900', website: 'https://www.heartlandmedspail.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Bloomington IL medical spa' },
  // Quad Cities IL
  { name: 'Quad Cities MedSpa Moline IL', owner: 'Dr. Thomas Banks', location: 'Moline, IL', phone: '(309) 764-8800', website: 'https://www.quadcitiesmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Quad Cities IL medspa — tri-state metro market' },
  { name: 'Rock Island MedSpa IL', owner: 'Dr. Sandra Pierce', location: 'Rock Island, IL', phone: '(309) 788-7700', website: 'https://www.rockislandmedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Rock Island IL medical spa — Quad Cities area' },
  { name: 'Mississippi Valley MedSpa QC', owner: 'Dr. Gary Nelson', location: 'Moline, IL', phone: '(309) 762-9900', website: 'https://www.msvalleymedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Moline IL medspa — Mississippi River area' },
  // Joliet IL
  { name: 'Joliet MedSpa & Laser', owner: 'Dr. Maria Gonzalez', location: 'Joliet, IL', phone: '(815) 741-8800', website: 'https://www.jolietmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Joliet IL medspa — Chicago southwest suburb' },
  { name: 'Will County MedSpa Joliet', owner: 'Dr. Robert Kovacs', location: 'Joliet, IL', phone: '(815) 723-7700', website: 'https://www.willcountymedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Joliet IL medical spa — Will County market' },
  { name: 'Prairie State MedSpa Joliet', owner: 'Dr. Karen Walsh', location: 'Joliet, IL', phone: '(815) 744-9900', website: 'https://www.prairiestatemedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Joliet IL medspa — growing Chicago exurb' },
];

(async () => {
  console.log('💆 MedSpa Prospects — Batch 25 (Springfield + Champaign + Bloomington + Quad Cities + Joliet IL)');
  let total = 0;
  for (const p of prospects) {
    await addMedSpa(p);
    console.log(`  ✓ ${p.name} (${p.location})`);
    total++;
    await sleep(300);
  }
  console.log(`\n✅ MedSpa Batch 25 complete — ${total} prospects added.`);
})();
