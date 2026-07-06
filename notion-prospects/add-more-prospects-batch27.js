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

// Batch 27: Bakersfield CA + Stockton CA + Fresno CA
const batches = [
  {
    db: 'plasticSurgery',
    prospects: [
      { name: 'Bakersfield Plastic Surgery', owner: 'Dr. Collis Lee', location: 'Bakersfield, CA', phone: '(661) 325-4118', website: 'https://www.bakersfieldplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Bakersfield CA plastic surgery' },
      { name: 'Central Valley Plastic Surgery', owner: 'Dr. Mark Chin', location: 'Stockton, CA', phone: '(209) 474-7064', website: 'https://www.centralvalleyps.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Stockton CA plastic surgery' },
      { name: 'Fresno Plastic Surgery', owner: 'Dr. Matthew Rowe', location: 'Fresno, CA', phone: '(559) 432-4400', website: 'https://www.fresnoplasticsurgery.net', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Fresno CA plastic surgery' },
    ],
  },
  {
    db: 'personalInjury',
    prospects: [
      { name: 'Chain|Cohn|Clark Law', owner: 'Gene Cohn', location: 'Bakersfield, CA', phone: '(661) 323-4000', website: 'https://www.chainlaw.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Bakersfield CA — prominent personal injury firm' },
      { name: 'Stockton Personal Injury Lawyers', owner: 'Mike Lasser', location: 'Stockton, CA', phone: '(209) 546-6870', website: 'https://www.stocktoninjurylaw.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Stockton CA personal injury law' },
      { name: 'Reza Torkzadeh Law Firm', owner: 'Reza Torkzadeh', location: 'Fresno, CA', phone: '(559) 221-2800', website: 'https://www.torklaw.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Fresno CA — bilingual personal injury law firm' },
    ],
  },
  {
    db: 'roofing',
    prospects: [
      { name: 'Weathermaster Roofing Bakersfield', owner: 'Chris Duncan', location: 'Bakersfield, CA', phone: '(661) 636-8500', website: 'https://www.weathermasterroofing.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Bakersfield CA roofing' },
      { name: 'Stockton Roofing Experts', owner: 'Dave Romero', location: 'Stockton, CA', phone: '(209) 474-9663', website: 'https://www.stocktonroofingexperts.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Stockton CA roofing contractor' },
      { name: 'Alpha Roofing Fresno', owner: 'Jose Gutierrez', location: 'Fresno, CA', phone: '(559) 222-7663', website: 'https://www.alpharoofingfresno.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Fresno CA roofing contractor' },
    ],
  },
  {
    db: 'hvac',
    prospects: [
      { name: 'Comfort Air Conditioning Bakersfield', owner: 'Steve Hernandez', location: 'Bakersfield, CA', phone: '(661) 397-1222', website: 'https://www.comfortacbakersfield.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Bakersfield CA HVAC — very hot desert climate' },
      { name: 'Patterson Heating & Air Stockton', owner: 'Alan Patterson', location: 'Stockton, CA', phone: '(209) 466-3315', website: 'https://www.pattersonheatingstockton.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Stockton CA HVAC' },
      { name: 'Airport Heating & Air Fresno', owner: 'Mike Graves', location: 'Fresno, CA', phone: '(559) 268-7595', website: 'https://www.airporthvac.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Fresno CA HVAC — hot valley climate' },
    ],
  },
  {
    db: 'cosmeticDentist',
    prospects: [
      { name: 'Stockdale Dental Group Bakersfield', owner: 'Dr. Robert Dority', location: 'Bakersfield, CA', phone: '(661) 832-2200', website: 'https://www.stockdaledentalgroup.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Bakersfield CA cosmetic dentist' },
      { name: 'Pacific Dental Services Stockton', owner: 'Dr. Sandra Kim', location: 'Stockton, CA', phone: '(209) 476-2500', website: 'https://www.pacificdentalstockton.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Stockton CA cosmetic dentistry' },
      { name: 'Fresno Cosmetic Dentistry', owner: 'Dr. Matthew Newman', location: 'Fresno, CA', phone: '(559) 435-8888', website: 'https://www.fresnofamilydental.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Fresno CA cosmetic dentist' },
    ],
  },
  {
    db: 'chiroPT',
    prospects: [
      { name: 'Bakersfield Chiropractic Clinic', owner: 'Dr. Paul Doucette', location: 'Bakersfield, CA', phone: '(661) 832-5111', website: 'https://www.bakersfieldchiro.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Bakersfield CA chiropractor' },
      { name: 'Stockton Spine & Chiropractic', owner: 'Dr. Romi Kamboj', location: 'Stockton, CA', phone: '(209) 955-2210', website: 'https://www.stocktonspine.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Stockton CA chiropractic & spine' },
      { name: 'Fresno Chiropractic & Wellness', owner: 'Dr. William Winslow', location: 'Fresno, CA', phone: '(559) 447-0777', website: 'https://www.fresnochiro.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Fresno CA chiropractor' },
    ],
  },
  {
    db: 'realEstate',
    prospects: [
      { name: 'Watson Realty Bakersfield', owner: 'John Watson', location: 'Bakersfield, CA', phone: '(661) 834-5050', website: 'https://www.watsonrealtyinc.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Bakersfield CA real estate' },
      { name: 'PMZ Real Estate Stockton', owner: 'Paul Murphey', location: 'Stockton, CA', phone: '(209) 477-4900', website: 'https://www.pmz.com', hasWebsite: 'Yes', wqs: 7, opp: 7, notes: 'Stockton CA large regional real estate' },
      { name: 'London Properties Fresno', owner: 'Mike Butcher', location: 'Fresno, CA', phone: '(559) 436-5664', website: 'https://www.londonproperties.com', hasWebsite: 'Yes', wqs: 7, opp: 7, notes: 'Fresno CA established real estate brokerage' },
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
  console.log(`\n✅ Batch 27 complete — ${total} prospects added.`);
})();
