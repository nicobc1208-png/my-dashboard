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

// Batch 35: Tacoma WA + Olympia WA + Eugene OR
const batches = [
  {
    db: 'plasticSurgery',
    prospects: [
      { name: 'Tacoma Plastic Surgery', owner: 'Dr. Craig Jonov', location: 'Tacoma, WA', phone: '(253) 238-0165', website: 'https://www.tacomaplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Tacoma WA plastic surgery' },
      { name: 'Olympia Plastic Surgery', owner: 'Dr. John Hultman', location: 'Olympia, WA', phone: '(360) 357-6700', website: 'https://www.olympiaplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Olympia WA plastic surgery' },
      { name: 'Oregon Plastic Surgeons Eugene', owner: 'Dr. Greg Ratliff', location: 'Eugene, OR', phone: '(541) 868-9800', website: 'https://www.oregonplasticsurgeons.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Eugene OR plastic surgery' },
    ],
  },
  {
    db: 'personalInjury',
    prospects: [
      { name: 'Ladenburg Law PLLC Tacoma', owner: 'Matthew Ladenburg', location: 'Tacoma, WA', phone: '(253) 327-1800', website: 'https://www.ladenburglaw.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Tacoma WA personal injury law' },
      { name: 'Hester Law Group Olympia', owner: 'David Hester', location: 'Olympia, WA', phone: '(360) 534-3305', website: 'https://www.hesterlawgroup.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Olympia WA personal injury' },
      { name: 'Johnston Law Firm Eugene', owner: 'Chad Johnston', location: 'Eugene, OR', phone: '(541) 246-0126', website: 'https://www.johnstonpersonalinjury.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Eugene OR personal injury law' },
    ],
  },
  {
    db: 'roofing',
    prospects: [
      { name: 'Northwest Roof & Construction Tacoma', owner: 'Aaron Butler', location: 'Tacoma, WA', phone: '(253) 539-8000', website: 'https://www.northwestrooftacoma.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Tacoma WA roofing — rain market' },
      { name: 'Capitol Roofing Olympia', owner: 'Greg Fowler', location: 'Olympia, WA', phone: '(360) 491-5000', website: 'https://www.capitolroofingow.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Olympia WA roofing contractor' },
      { name: 'Pacific Crest Roofing Eugene', owner: 'Dave Morrison', location: 'Eugene, OR', phone: '(541) 683-4777', website: 'https://www.pacificcroofing.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Eugene OR roofing' },
    ],
  },
  {
    db: 'hvac',
    prospects: [
      { name: 'Brennan Heating & Air Conditioning Tacoma', owner: 'Jeff Brennan', location: 'Tacoma, WA', phone: '(253) 661-7276', website: 'https://www.brennanheating.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Tacoma WA HVAC — large PNW company' },
      { name: 'Olympic Heating & Cooling Olympia', owner: 'Randy Berg', location: 'Olympia, WA', phone: '(360) 943-0500', website: 'https://www.olympicheatingcooling.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Olympia WA HVAC' },
      { name: 'Comfort Flow Heating Eugene', owner: 'Mike Nells', location: 'Eugene, OR', phone: '(541) 345-5474', website: 'https://www.comfortflow.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Eugene OR HVAC — large regional company' },
    ],
  },
  {
    db: 'cosmeticDentist',
    prospects: [
      { name: 'Cosmetic Dental Tacoma', owner: 'Dr. Mike Glauser', location: 'Tacoma, WA', phone: '(253) 564-0800', website: 'https://www.cosmeticdentaltacoma.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Tacoma WA cosmetic dentist' },
      { name: 'Smile Olympia', owner: 'Dr. Paul Dorrenbos', location: 'Olympia, WA', phone: '(360) 357-1000', website: 'https://www.smileolympia.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Olympia WA cosmetic dentist' },
      { name: 'Eugene Family Dentistry', owner: 'Dr. Keith Doering', location: 'Eugene, OR', phone: '(541) 687-2280', website: 'https://www.eugenefamilydentistry.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Eugene OR cosmetic dentist' },
    ],
  },
  {
    db: 'chiroPT',
    prospects: [
      { name: 'Tacoma Spine & Chiropractic', owner: 'Dr. Nathan Anderson', location: 'Tacoma, WA', phone: '(253) 627-0700', website: 'https://www.tacomaspinechiro.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Tacoma WA chiropractor' },
      { name: 'Olympia Chiropractic Center', owner: 'Dr. James Scibek', location: 'Olympia, WA', phone: '(360) 943-7246', website: 'https://www.olympiachirocenter.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Olympia WA chiropractor' },
      { name: 'South Eugene Chiropractic', owner: 'Dr. Kelly Jones', location: 'Eugene, OR', phone: '(541) 484-0360', website: 'https://www.southeugenechiro.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Eugene OR chiropractor' },
    ],
  },
  {
    db: 'realEstate',
    prospects: [
      { name: 'John L. Scott Real Estate Tacoma', owner: 'Lennox Scott', location: 'Tacoma, WA', phone: '(253) 572-6000', website: 'https://www.johnlscott.com/tacoma', hasWebsite: 'Yes', wqs: 7, opp: 7, notes: 'Tacoma WA established large real estate firm' },
      { name: 'RE/MAX Advantage Olympia', owner: 'Kevin Frid', location: 'Olympia, WA', phone: '(360) 456-9000', website: 'https://www.remax-olympia.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Olympia WA real estate' },
      { name: 'Windermere Real Estate Eugene', owner: 'Terry Sprague', location: 'Eugene, OR', phone: '(541) 484-0000', website: 'https://www.windermere.com/eugene', hasWebsite: 'Yes', wqs: 7, opp: 7, notes: 'Eugene OR Windermere real estate' },
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
  console.log(`\n✅ Batch 35 complete — ${total} prospects added.`);
})();
