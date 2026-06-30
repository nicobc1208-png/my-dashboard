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

// Batch 64: Denver CO + Colorado Springs CO + Kansas City MO
const batches = [
  {
    db: 'plasticSurgery',
    prospects: [
      { name: 'Hochstein Plastic Surgery Denver CO', owner: 'Dr. Leonard Hochstein', location: 'Denver, CO', phone: '(303) 393-3900', website: 'https://www.hochsteinplasticsurgery.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Denver CO plastic surgery — well-known Mile High City aesthetic practice' },
      { name: 'Plastic Surgery of Colorado Springs CO', owner: 'Dr. Jeffrey Roth', location: 'Colorado Springs, CO', phone: '(719) 634-2100', website: 'https://www.plasticsurgeryofcolorado.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Colorado Springs CO plastic surgery — Front Range market' },
      { name: 'KC Plastic Surgery Kansas City MO', owner: 'Dr. James Pearson', location: 'Kansas City, MO', phone: '(913) 451-3722', website: 'https://www.kcplasticsurgery.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Kansas City MO plastic surgery — large Midwest market' },
    ],
  },
  {
    db: 'personalInjury',
    prospects: [
      { name: 'Bachus & Schanker Denver CO', owner: 'Darold Schanker', location: 'Denver, CO', phone: '(303) 893-9800', website: 'https://www.coloradolaw.net', hasWebsite: 'Yes', wqs: 8, opp: 9, notes: 'Denver CO personal injury — one of the largest CO plaintiff firms, heavy marketing' },
      { name: 'Bussey Law Firm Colorado Springs CO', owner: 'Timothy Bussey', location: 'Colorado Springs, CO', phone: '(719) 475-2555', website: 'https://www.busseylawfirm.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Colorado Springs CO personal injury attorneys — Front Range market' },
      { name: 'Wendt Law Kansas City MO', owner: 'Cory Wendt', location: 'Kansas City, MO', phone: '(816) 542-6734', website: 'https://www.wendtlaw.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Kansas City MO personal injury law — large Midwest metro market' },
    ],
  },
  {
    db: 'roofing',
    prospects: [
      { name: 'A-Best Roofing Denver CO', owner: 'Steve Madden', location: 'Denver, CO', phone: '(303) 424-8100', website: 'https://www.abestroofing.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Denver CO roofing — hail storm capital of the US, massive roofing demand' },
      { name: 'Above All Colorado Springs Roofing CO', owner: 'Gary Weiss', location: 'Colorado Springs, CO', phone: '(719) 217-4400', website: 'https://www.aboveallroofing.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Colorado Springs CO roofing — Front Range hail market' },
      { name: 'Academy Roofing Kansas City MO', owner: 'Pat Connors', location: 'Kansas City, MO', phone: '(816) 353-2100', website: 'https://www.academyroofingkc.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Kansas City MO roofing — tornado alley storm market' },
    ],
  },
  {
    db: 'hvac',
    prospects: [
      { name: 'Applewood Plumbing Heating & Electric Denver CO', owner: 'Jim Abrams', location: 'Denver, CO', phone: '(303) 328-3060', website: 'https://www.applewoodfixit.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Denver CO HVAC & plumbing — large well-known Mile High City company' },
      { name: 'Pikes Peak Mechanical Colorado Springs CO', owner: 'Larry Colvin', location: 'Colorado Springs, CO', phone: '(719) 548-8500', website: 'https://www.pikespeakmechanical.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Colorado Springs CO HVAC — Front Range high-altitude climate market' },
      { name: 'Comfort Systems Kansas City MO', owner: 'Bill Dawson', location: 'Kansas City, MO', phone: '(913) 441-2222', website: 'https://www.comfortsystemskc.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Kansas City MO HVAC — extreme Midwest temperature swings drive demand' },
    ],
  },
  {
    db: 'cosmeticDentist',
    prospects: [
      { name: 'Denver Smile Makeover CO', owner: 'Dr. Gregg Lituchy', location: 'Denver, CO', phone: '(303) 388-7900', website: 'https://www.denversmile.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Denver CO cosmetic dentist — affluent tech & professional market' },
      { name: 'Springs Cosmetic Dentistry Colorado Springs CO', owner: 'Dr. Brian Burt', location: 'Colorado Springs, CO', phone: '(719) 598-0230', website: 'https://www.springscosmetic.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Colorado Springs CO cosmetic dentist — Front Range market' },
      { name: 'Crown Center Dental Kansas City MO', owner: 'Dr. Kenneth Spitzer', location: 'Kansas City, MO', phone: '(816) 531-7272', website: 'https://www.crowncenterdental.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Kansas City MO cosmetic dentist — large Midwest metro market' },
    ],
  },
  {
    db: 'chiroPT',
    prospects: [
      { name: 'Denver Integrated Spine CO', owner: 'Dr. Paul Hollern', location: 'Denver, CO', phone: '(303) 355-7000', website: 'https://www.denverintegrated.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Denver CO chiropractic — active outdoor lifestyle drives high PT/chiro demand' },
      { name: 'Colorado Springs Chiropractic CO', owner: 'Dr. Matt Thacker', location: 'Colorado Springs, CO', phone: '(719) 522-1102', website: 'https://www.cospringschiropractor.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Colorado Springs CO chiropractor — military & active population' },
      { name: 'Johnson County Chiropractic Kansas City MO', owner: 'Dr. David Turner', location: 'Kansas City, MO', phone: '(913) 782-8888', website: 'https://www.jcclinic.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Kansas City MO chiropractic — large Midwest metro market' },
    ],
  },
  {
    db: 'realEstate',
    prospects: [
      { name: 'LIV Sotheby\'s International Realty Denver CO', owner: 'Scott Webber', location: 'Denver, CO', phone: '(303) 893-3200', website: 'https://www.livsothebysrealty.com', hasWebsite: 'Yes', wqs: 8, opp: 9, notes: 'Denver CO luxury real estate — premier Mile High luxury brokerage' },
      { name: 'The Platinum Group Colorado Springs CO', owner: 'Alysia Shivers', location: 'Colorado Springs, CO', phone: '(719) 536-4444', website: 'https://www.platinumgrouprealtors.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Colorado Springs CO real estate — Front Range growing market' },
      { name: 'ReeceNichols Kansas City MO', owner: 'Jeff Glover', location: 'Kansas City, MO', phone: '(816) 781-6800', website: 'https://www.reeceandnichols.com', hasWebsite: 'Yes', wqs: 7, opp: 7, notes: 'Kansas City MO real estate — largest KC metro brokerage' },
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
  console.log(`\n✅ Batch 64 complete — ${total} prospects added.`);
})();
