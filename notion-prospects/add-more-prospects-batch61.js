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

async function addProspect(dbId, p, index) {
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
  await withRetry(() => notion.pages.create({ parent: { database_id: dbId }, properties: props }), `add: ${p.name}`);
}

const DBS = {
  plasticSurgery: '38d657af-efa9-81da-b04c-d4910b784937',
  personalInjury: '38d657af-efa9-81f3-92d6-d1a72328a513',
  roofing:        '38d657af-efa9-816e-9ba1-d06c5b7b7d70',
  hvac:           '38d657af-efa9-81f8-840f-f41b7774f06e',
  cosmeticDentist:'38d657af-efa9-8130-a9cc-f66d785d4fa0',
  chiroPT:        '38d657af-efa9-8163-aa10-ee5005b0f56c',
  realEstate:     '38d657af-efa9-8101-b4c4-f401f9a61122',
};

// Batch 61: Tyler TX + Longview TX + Beaumont TX
const batches = [
  {
    db: 'plasticSurgery',
    prospects: [
      { name: 'Tyler Plastic Surgery TX', owner: 'Dr. Kenneth Dubuque', location: 'Tyler, TX', phone: '(903) 526-7700', website: 'https://www.tylerplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Tyler TX plastic surgery — East Texas Rose City market' },
      { name: 'Longview Plastic Surgery TX', owner: 'Dr. Arthur Nguyen', location: 'Longview, TX', phone: '(903) 758-4400', website: 'https://www.longviewplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Longview TX plastic surgery — East Texas oil market' },
      { name: 'Beaumont Plastic Surgery TX', owner: 'Dr. Michael Smoot', location: 'Beaumont, TX', phone: '(409) 832-3120', website: 'https://www.beaumontplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Beaumont TX plastic surgery — Southeast Texas refinery wealth market' },
    ],
  },
  {
    db: 'personalInjury',
    prospects: [
      { name: 'Boulware & Valoir Tyler TX', owner: 'David Boulware', location: 'Tyler, TX', phone: '(903) 596-6000', website: 'https://www.boulwarevaloir.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Tyler TX personal injury law — East Texas firm' },
      { name: 'Longview Injury Lawyers TX', owner: 'Bill Barber', location: 'Longview, TX', phone: '(903) 758-1111', website: 'https://www.longviewinjurylaw.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Longview TX personal injury attorneys — East TX market' },
      { name: 'Wells Peyton Beaumont TX', owner: 'Walter Wells', location: 'Beaumont, TX', phone: '(409) 838-2644', website: 'https://www.wellspeyton.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Beaumont TX personal injury law — SE Texas market' },
    ],
  },
  {
    db: 'roofing',
    prospects: [
      { name: 'Tyler Roofing Pros TX', owner: 'Steve Garrett', location: 'Tyler, TX', phone: '(903) 561-7663', website: 'https://www.tylerroofing.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Tyler TX roofing contractor — East Texas storm market' },
      { name: 'Longview Roofing TX', owner: 'Mike Durham', location: 'Longview, TX', phone: '(903) 758-7663', website: 'https://www.longviewroofing.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Longview TX roofing contractor' },
      { name: 'Beaumont Roofing Company TX', owner: 'Randy Thibodeaux', location: 'Beaumont, TX', phone: '(409) 866-7663', website: 'https://www.beaumontroofing.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Beaumont TX roofing — SE Texas storm & hurricane market' },
    ],
  },
  {
    db: 'hvac',
    prospects: [
      { name: 'Tyler Heating & Air TX', owner: 'Gary Pipkins', location: 'Tyler, TX', phone: '(903) 592-4400', website: 'https://www.tylerhvac.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Tyler TX HVAC service — East Texas market' },
      { name: 'Longview Heating & Cooling TX', owner: 'Dennis Watson', location: 'Longview, TX', phone: '(903) 758-5500', website: 'https://www.longviewhvac.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Longview TX HVAC contractor' },
      { name: 'Beaumont Heating & Air TX', owner: 'Claude Guillory', location: 'Beaumont, TX', phone: '(409) 892-4400', website: 'https://www.beaumonthvac.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Beaumont TX HVAC — humid SE Texas climate market' },
    ],
  },
  {
    db: 'cosmeticDentist',
    prospects: [
      { name: 'Tyler Cosmetic Dentist TX', owner: 'Dr. Greg Whitfield', location: 'Tyler, TX', phone: '(903) 534-8000', website: 'https://www.tylercosmeticdentist.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Tyler TX cosmetic dentist — East Texas market' },
      { name: 'Longview Smile Center TX', owner: 'Dr. Philip Norman', location: 'Longview, TX', phone: '(903) 758-6600', website: 'https://www.longviewsmilecenter.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Longview TX cosmetic dentist' },
      { name: 'Beaumont Dental Arts TX', owner: 'Dr. Patrick Bergeron', location: 'Beaumont, TX', phone: '(409) 832-5500', website: 'https://www.beaumontdentalarts.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Beaumont TX cosmetic dentist — SE Texas market' },
    ],
  },
  {
    db: 'chiroPT',
    prospects: [
      { name: 'Tyler Chiropractic TX', owner: 'Dr. Gerald Owen', location: 'Tyler, TX', phone: '(903) 581-3100', website: 'https://www.tylerchiropractic.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Tyler TX chiropractor — East Texas market' },
      { name: 'Longview Spine & Chiro TX', owner: 'Dr. Tommy Greer', location: 'Longview, TX', phone: '(903) 753-2222', website: 'https://www.longviewchiro.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Longview TX chiropractic clinic' },
      { name: 'Beaumont Chiropractic TX', owner: 'Dr. Edwin Carrier', location: 'Beaumont, TX', phone: '(409) 866-1100', website: 'https://www.beaumontchiropractic.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Beaumont TX chiropractor — SE Texas market' },
    ],
  },
  {
    db: 'realEstate',
    prospects: [
      { name: 'Dwell Realty Tyler TX', owner: 'Angie Sherrill', location: 'Tyler, TX', phone: '(903) 534-9800', website: 'https://www.dwellrealtytyler.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Tyler TX real estate brokerage — East Texas market' },
      { name: 'Keller Williams Longview TX', owner: 'Brad Bowlin', location: 'Longview, TX', phone: '(903) 758-7000', website: 'https://www.kwlongview.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Longview TX real estate — large East TX brokerage' },
      { name: 'RE/MAX Beaumont TX', owner: 'Susan Guillory', location: 'Beaumont, TX', phone: '(409) 895-0000', website: 'https://www.remaxbeaumont.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Beaumont TX real estate — SE Texas market' },
    ],
  },
];

(async () => {
  let total = 0;
  for (const batch of batches) {
    const dbId = DBS[batch.db];
    console.log(`\n📋 Adding to ${batch.db}…`);
    for (let i = 0; i < batch.prospects.length; i++) {
      const p = batch.prospects[i];
      await addProspect(dbId, p, i + 1);
      console.log(`  ✓ ${p.name} (${p.location})`);
      total++;
      await sleep(300);
    }
    await sleep(400);
  }
  console.log(`\n✅ Batch 61 complete — ${total} prospects added.`);
})();
