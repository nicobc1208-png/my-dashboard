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

// Batch 30: Lubbock TX + Amarillo TX + Beaumont TX
const batches = [
  {
    db: 'plasticSurgery',
    prospects: [
      { name: 'Lubbock Plastic Surgery', owner: 'Dr. James Apesos', location: 'Lubbock, TX', phone: '(806) 785-0900', website: 'https://www.lubbockplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Lubbock TX plastic surgery' },
      { name: 'Amarillo Plastic Surgery', owner: 'Dr. John Fisher', location: 'Amarillo, TX', phone: '(806) 359-0212', website: 'https://www.amarilloplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Amarillo TX plastic surgery' },
      { name: 'Southeast Texas Plastic Surgery', owner: 'Dr. Charles Polsen', location: 'Beaumont, TX', phone: '(409) 892-5500', website: 'https://www.setxplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Beaumont TX plastic surgery' },
    ],
  },
  {
    db: 'personalInjury',
    prospects: [
      { name: 'Liggett Law Group Lubbock', owner: 'Greg Liggett', location: 'Lubbock, TX', phone: '(806) 744-4878', website: 'https://www.liggettlawgroup.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Lubbock TX personal injury law' },
      { name: 'Gibson Law Firm Amarillo', owner: 'Wayne Gibson', location: 'Amarillo, TX', phone: '(806) 373-0900', website: 'https://www.gibsonlawfirm.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Amarillo TX personal injury' },
      { name: 'Reaud Morgan & Quinn Beaumont', owner: 'Wayne Reaud', location: 'Beaumont, TX', phone: '(409) 838-1000', website: 'https://www.rmqlawfirm.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Beaumont TX personal injury — large Southeast TX firm' },
    ],
  },
  {
    db: 'roofing',
    prospects: [
      { name: 'West Texas Roofing Lubbock', owner: 'Chad Bridges', location: 'Lubbock, TX', phone: '(806) 788-2009', website: 'https://www.westtexasroofing.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Lubbock TX roofing — hail and wind market' },
      { name: 'Superior Roofing Amarillo', owner: 'James Tucker', location: 'Amarillo, TX', phone: '(806) 352-7663', website: 'https://www.superiorroofingamarillo.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Amarillo TX roofing — storm prone' },
      { name: 'Golden Triangle Roofing Beaumont', owner: 'Frank Guillory', location: 'Beaumont, TX', phone: '(409) 813-5555', website: 'https://www.goldentriangleroofing.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Beaumont TX roofing — hurricane prep market' },
    ],
  },
  {
    db: 'hvac',
    prospects: [
      { name: 'Sears Heating & Air Conditioning Lubbock', owner: 'Brian Miles', location: 'Lubbock, TX', phone: '(806) 748-0011', website: 'https://www.searsheatinglubbock.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Lubbock TX HVAC — very hot summers' },
      { name: 'Bob Greenawalt Heating & Cooling Amarillo', owner: 'Bob Greenawalt', location: 'Amarillo, TX', phone: '(806) 350-9898', website: 'https://www.greenawalt.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Amarillo TX HVAC' },
      { name: 'Beaumont Air Conditioning & Heating', owner: 'Paul Broussard', location: 'Beaumont, TX', phone: '(409) 892-3311', website: 'https://www.beaumonthvac.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Beaumont TX HVAC — humid subtropical climate' },
    ],
  },
  {
    db: 'cosmeticDentist',
    prospects: [
      { name: 'Lubbock Cosmetic & Family Dentistry', owner: 'Dr. Robin Merritt', location: 'Lubbock, TX', phone: '(806) 771-0777', website: 'https://www.lubbockcosmetic.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Lubbock TX cosmetic dentist' },
      { name: 'Amarillo Dental Arts', owner: 'Dr. Craig Linderman', location: 'Amarillo, TX', phone: '(806) 355-8488', website: 'https://www.amarillodentalarts.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Amarillo TX cosmetic dentist' },
      { name: 'Southeast Texas Dental Beaumont', owner: 'Dr. Cary Davidson', location: 'Beaumont, TX', phone: '(409) 861-9888', website: 'https://www.setxdental.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Beaumont TX cosmetic dentist' },
    ],
  },
  {
    db: 'chiroPT',
    prospects: [
      { name: 'Lubbock Family Chiropractic', owner: 'Dr. Kyle Brown', location: 'Lubbock, TX', phone: '(806) 799-0777', website: 'https://www.lubbockfamilychiro.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Lubbock TX chiropractor' },
      { name: 'Panhandle Chiropractic Amarillo', owner: 'Dr. Tim Barber', location: 'Amarillo, TX', phone: '(806) 353-0111', website: 'https://www.panhandlechiro.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Amarillo TX chiropractic' },
      { name: 'Southeast Texas Spine & Rehab Beaumont', owner: 'Dr. John Guidry', location: 'Beaumont, TX', phone: '(409) 842-0888', website: 'https://www.setxspine.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Beaumont TX chiro & spine' },
    ],
  },
  {
    db: 'realEstate',
    prospects: [
      { name: 'Keller Williams Lubbock', owner: 'Scott Stafford', location: 'Lubbock, TX', phone: '(806) 771-7710', website: 'https://www.kwlubbock.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Lubbock TX real estate brokerage' },
      { name: 'Cornerstone Realty Group Amarillo', owner: 'Mike Campbell', location: 'Amarillo, TX', phone: '(806) 374-8400', website: 'https://www.cornerstonerealtyamarillo.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Amarillo TX real estate' },
      { name: 'Coldwell Banker Beaumont Texas', owner: 'Jim Douglas', location: 'Beaumont, TX', phone: '(409) 866-8700', website: 'https://www.cbbeaumonttx.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Beaumont TX real estate brokerage' },
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
  console.log(`\n✅ Batch 30 complete — ${total} prospects added.`);
})();
