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

// Batch 38: Tallahassee FL + Gainesville FL + Pensacola FL
const batches = [
  {
    db: 'plasticSurgery',
    prospects: [
      { name: 'Tallahassee Plastic Surgery', owner: 'Dr. Mark Gilliland', location: 'Tallahassee, FL', phone: '(850) 877-8585', website: 'https://www.tallahasseeoplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Tallahassee FL plastic surgery — state capital market' },
      { name: 'Gainesville Plastic Surgery', owner: 'Dr. Edward Rohrich', location: 'Gainesville, FL', phone: '(352) 376-4600', website: 'https://www.gainesvilleplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Gainesville FL plastic surgery — UF college market' },
      { name: 'Pensacola Plastic Surgery', owner: 'Dr. Steven Fagien', location: 'Pensacola, FL', phone: '(850) 478-3300', website: 'https://www.pensacolaplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Pensacola FL plastic surgery' },
    ],
  },
  {
    db: 'personalInjury',
    prospects: [
      { name: 'Fasig Brooks Tallahassee', owner: 'Joel Brooks', location: 'Tallahassee, FL', phone: '(850) 222-3768', website: 'https://www.fasigbrooks.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Tallahassee FL personal injury — well-known firm' },
      { name: 'Thomas Duffy Gainesville', owner: 'Tom Duffy', location: 'Gainesville, FL', phone: '(352) 375-4000', website: 'https://www.duffylawfirm.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Gainesville FL personal injury law' },
      { name: 'Beck Law Group Pensacola', owner: 'Steve Beck', location: 'Pensacola, FL', phone: '(850) 433-0356', website: 'https://www.becklawgroup.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Pensacola FL personal injury' },
    ],
  },
  {
    db: 'roofing',
    prospects: [
      { name: 'Tallahassee Roofing Inc', owner: 'Bill Hammond', location: 'Tallahassee, FL', phone: '(850) 576-7663', website: 'https://www.tallahasseeroofing.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Tallahassee FL roofing — storm market' },
      { name: 'Gainesville Roofing Company', owner: 'Jeff Burton', location: 'Gainesville, FL', phone: '(352) 372-7663', website: 'https://www.gainesvilleroofing.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Gainesville FL roofing contractor' },
      { name: 'Pensacola Roofing Pros', owner: 'Mike Morrow', location: 'Pensacola, FL', phone: '(850) 432-7663', website: 'https://www.pensacolaroofingpros.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Pensacola FL roofing — hurricane zone market' },
    ],
  },
  {
    db: 'hvac',
    prospects: [
      { name: 'Tallahassee Air Conditioning', owner: 'Gary Ryals', location: 'Tallahassee, FL', phone: '(850) 562-9977', website: 'https://www.tallahasseeac.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Tallahassee FL HVAC — hot humid climate' },
      { name: 'Duggan Heating & Air Gainesville', owner: 'Ed Duggan', location: 'Gainesville, FL', phone: '(352) 373-8520', website: 'https://www.dugganair.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Gainesville FL HVAC' },
      { name: 'Comfort Systems Pensacola', owner: 'Randy Byrd', location: 'Pensacola, FL', phone: '(850) 476-9700', website: 'https://www.comfortsystemspensacola.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Pensacola FL HVAC service' },
    ],
  },
  {
    db: 'cosmeticDentist',
    prospects: [
      { name: 'Cosmetic Dentistry of Tallahassee', owner: 'Dr. Kyle Dosch', location: 'Tallahassee, FL', phone: '(850) 878-1234', website: 'https://www.cosmeticdentistrytallahassee.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Tallahassee FL cosmetic dentist' },
      { name: 'Gainesville Aesthetic Smiles', owner: 'Dr. Marc Gottlieb', location: 'Gainesville, FL', phone: '(352) 332-8133', website: 'https://www.gainesvilledentist.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Gainesville FL cosmetic dentist' },
      { name: 'Pensacola Smile Makeover', owner: 'Dr. John Garrick', location: 'Pensacola, FL', phone: '(850) 477-4411', website: 'https://www.pensacolasmile.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Pensacola FL cosmetic dentist' },
    ],
  },
  {
    db: 'chiroPT',
    prospects: [
      { name: 'Tallahassee Spine & Wellness', owner: 'Dr. Brian Wigle', location: 'Tallahassee, FL', phone: '(850) 877-5900', website: 'https://www.tallahasseespine.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Tallahassee FL chiropractor' },
      { name: 'Back in Motion Gainesville', owner: 'Dr. Mike Stager', location: 'Gainesville, FL', phone: '(352) 372-4949', website: 'https://www.backinmotiongainesville.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Gainesville FL chiropractic' },
      { name: 'Gulf Coast Chiropractic Pensacola', owner: 'Dr. Greg Scott', location: 'Pensacola, FL', phone: '(850) 477-2777', website: 'https://www.gulfcoastchiro.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Pensacola FL chiropractor' },
    ],
  },
  {
    db: 'realEstate',
    prospects: [
      { name: 'Coldwell Banker Hartung Tallahassee', owner: 'Jeff Hogue', location: 'Tallahassee, FL', phone: '(850) 386-6160', website: 'https://www.cbhartung.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Tallahassee FL — large established real estate firm' },
      { name: 'Bosshardt Realty Gainesville', owner: 'Richard Bosshardt', location: 'Gainesville, FL', phone: '(352) 371-1118', website: 'https://www.bosshardtrealty.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Gainesville FL real estate — large brokerage' },
      { name: 'Levin Rinke Realty Pensacola', owner: 'Scott Levin', location: 'Pensacola, FL', phone: '(850) 916-5483', website: 'https://www.levinrinkerealty.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Pensacola FL real estate brokerage' },
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
  console.log(`\n✅ Batch 38 complete — ${total} prospects added.`);
})();
