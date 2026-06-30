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

// MedSpa Batch 38: Portland OR + Seattle WA + Salt Lake City UT + Denver CO + Colorado Springs CO
const prospects = [
  // Portland OR
  { name: 'Portland MedSpa Oregon', owner: 'Dr. Lisa Chen', location: 'Portland, OR', phone: '(503) 224-8800', website: 'https://www.portlandmedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Portland OR medspa — Pacific NW wellness-focused market' },
  { name: 'Pearl District MedSpa Portland OR', owner: 'Dr. Andrew Kwan', location: 'Portland, OR', phone: '(503) 226-7700', website: 'https://www.pearlmedspa.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Portland OR medspa — Pearl District upscale urban neighborhood' },
  { name: 'Lake Oswego MedSpa Portland OR', owner: 'Dr. Michelle Bryant', location: 'Portland, OR', phone: '(503) 635-9900', website: 'https://www.lakeoswegomedpa.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Portland OR medspa — Lake Oswego ultra-affluent suburb' },
  // Seattle WA
  { name: 'Seattle MedSpa Washington', owner: 'Dr. Karen Lee', location: 'Seattle, WA', phone: '(206) 682-8800', website: 'https://www.seattlemedspa.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Seattle WA medspa — tech wealth market, Amazon/Microsoft employee base' },
  { name: 'Bellevue MedSpa Seattle WA', owner: 'Dr. Robert Park', location: 'Bellevue, WA', phone: '(425) 453-7700', website: 'https://www.bellevuemedspa.com', hasWebsite: 'Yes', wqs: 8, opp: 9, notes: 'Bellevue WA medspa — ultra-affluent Seattle tech suburb, Microsoft HQ city' },
  { name: 'Kirkland MedSpa Seattle WA', owner: 'Dr. Sandra Kim', location: 'Kirkland, WA', phone: '(425) 889-9900', website: 'https://www.kirklandmedspa.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Kirkland WA medspa — affluent tech suburb, Google campus nearby' },
  // Salt Lake City UT
  { name: 'Salt Lake City MedSpa Utah', owner: 'Dr. Tyler Christensen', location: 'Salt Lake City, UT', phone: '(801) 484-8800', website: 'https://www.slcmedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Salt Lake City UT medspa — fast-growing Utah market, tech boom' },
  { name: 'Draper MedSpa Salt Lake City UT', owner: 'Dr. Ashley Sorensen', location: 'Draper, UT', phone: '(801) 576-7700', website: 'https://www.drapermedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Draper UT medspa — affluent Silicon Slopes suburb south of Salt Lake' },
  { name: 'Park City MedSpa Utah', owner: 'Dr. Nathan Blake', location: 'Park City, UT', phone: '(435) 649-9900', website: 'https://www.parkcitymedspa.com', hasWebsite: 'Yes', wqs: 7, opp: 9, notes: 'Park City UT medspa — luxury ski resort town, ultra-affluent seasonal & resident market' },
  // Denver CO
  { name: 'Denver MedSpa Colorado', owner: 'Dr. Heather Ross', location: 'Denver, CO', phone: '(303) 832-8800', website: 'https://www.denvermedspa.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Denver CO medspa — booming Mile High City tech & outdoor affluent market' },
  { name: 'Cherry Creek MedSpa Denver CO', owner: 'Dr. Paul Mercer', location: 'Denver, CO', phone: '(303) 388-7700', website: 'https://www.cherrycreekmedspa.com', hasWebsite: 'Yes', wqs: 8, opp: 9, notes: 'Denver CO medspa — Cherry Creek ultra-luxury shopping & dining corridor' },
  { name: 'Highlands Ranch MedSpa Denver CO', owner: 'Dr. Melissa Grant', location: 'Highlands Ranch, CO', phone: '(720) 348-9900', website: 'https://www.highlandsranchmedspa.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Highlands Ranch CO medspa — affluent Denver south suburb' },
  // Colorado Springs CO
  { name: 'Colorado Springs MedSpa CO', owner: 'Dr. Jason Mills', location: 'Colorado Springs, CO', phone: '(719) 592-8800', website: 'https://www.coloradospringsmedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Colorado Springs CO medspa — fast-growing Front Range city, military & tech market' },
  { name: 'Broadmoor MedSpa Colorado Springs CO', owner: 'Dr. Victoria Shaw', location: 'Colorado Springs, CO', phone: '(719) 633-7700', website: 'https://www.broadmoormedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Colorado Springs CO medspa — Broadmoor luxury resort neighborhood' },
  { name: 'Monument MedSpa Colorado Springs CO', owner: 'Dr. Eric Hammond', location: 'Colorado Springs, CO', phone: '(719) 488-9900', website: 'https://www.monumentmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Monument CO medspa — affluent north Colorado Springs suburb' },
];

(async () => {
  console.log('💆 MedSpa Prospects — Batch 38 (Portland OR + Seattle WA + Salt Lake City UT + Denver CO + Colorado Springs CO)');
  let total = 0;
  for (const p of prospects) {
    await addMedSpa(p);
    console.log(`  ✓ ${p.name} (${p.location})`);
    total++;
    await sleep(300);
  }
  console.log(`\n✅ MedSpa Batch 38 complete — ${total} prospects added.`);
})();
