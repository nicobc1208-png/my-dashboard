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

// Batch 65: St. Louis MO + Cincinnati OH + Pittsburgh PA
const batches = [
  {
    db: 'plasticSurgery',
    prospects: [
      { name: 'St. Louis Cosmetic Surgery MO', owner: 'Dr. Thomas Wright', location: 'St. Louis, MO', phone: '(314) 567-5600', website: 'https://www.stlouiscosmeticsurgery.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'St. Louis MO plastic surgery — Gateway City affluent market' },
      { name: 'Cincinnati Plastic Surgery OH', owner: 'Dr. Richard Rand', location: 'Cincinnati, OH', phone: '(513) 793-7326', website: 'https://www.cincinnatiPlasticsurgery.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Cincinnati OH plastic surgery — Tri-State Ohio/Kentucky/Indiana market' },
      { name: 'Spear Education Pittsburgh PA', owner: 'Dr. William Stroud', location: 'Pittsburgh, PA', phone: '(412) 963-6770', website: 'https://www.pittsburghplasticsurgery.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Pittsburgh PA plastic surgery — Steel City growing aesthetic market' },
    ],
  },
  {
    db: 'personalInjury',
    prospects: [
      { name: 'Capes Sokol St. Louis MO', owner: 'Gary Capes', location: 'St. Louis, MO', phone: '(314) 721-7700', website: 'https://www.capessokol.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'St. Louis MO personal injury law — established Gateway City firm' },
      { name: 'Freking Myers & Reul Cincinnati OH', owner: 'Greg Freking', location: 'Cincinnati, OH', phone: '(513) 721-1975', website: 'https://www.fmr.law', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Cincinnati OH personal injury attorneys — Tri-State market' },
      { name: 'Edgar Snyder & Associates Pittsburgh PA', owner: 'Edgar Snyder', location: 'Pittsburgh, PA', phone: '(412) 394-1000', website: 'https://www.edgarsnyder.com', hasWebsite: 'Yes', wqs: 8, opp: 8, notes: 'Pittsburgh PA personal injury — legendary regional TV advertiser, huge brand' },
    ],
  },
  {
    db: 'roofing',
    prospects: [
      { name: 'All American Exteriors St. Louis MO', owner: 'Dave Raines', location: 'St. Louis, MO', phone: '(636) 458-8990', website: 'https://www.allamericanexteriors.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'St. Louis MO roofing & exteriors — hail & storm market' },
      { name: 'Cincinnati Roofing & Restoration OH', owner: 'Brian Wells', location: 'Cincinnati, OH', phone: '(513) 822-5000', website: 'https://www.cincinnatiRoofing.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Cincinnati OH roofing contractor — Tri-State storm market' },
      { name: 'Munn Roofing Pittsburgh PA', owner: 'Kevin Munn', location: 'Pittsburgh, PA', phone: '(412) 366-8050', website: 'https://www.munnroofing.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Pittsburgh PA roofing — Steel City residential market' },
    ],
  },
  {
    db: 'hvac',
    prospects: [
      { name: 'Hoffmann Brothers St. Louis HVAC MO', owner: 'Matt Hoffmann', location: 'St. Louis, MO', phone: '(314) 664-3011', website: 'https://www.hoffmannbrothers.com', hasWebsite: 'Yes', wqs: 7, opp: 7, notes: 'St. Louis MO HVAC — large well-known Gateway City company' },
      { name: 'Arlinghaus Plumbing Heating & Air Cincinnati OH', owner: 'Steve Arlinghaus', location: 'Cincinnati, OH', phone: '(513) 563-0303', website: 'https://www.arlinghausph.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Cincinnati OH HVAC — Tri-State market with strong seasonal demand' },
      { name: 'Boehmer Heating & Cooling Pittsburgh PA', owner: 'Ron Boehmer', location: 'Pittsburgh, PA', phone: '(412) 441-8888', website: 'https://www.boehmerhvac.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Pittsburgh PA HVAC — Steel City cold winters drive heavy heating demand' },
    ],
  },
  {
    db: 'cosmeticDentist',
    prospects: [
      { name: 'St. Louis Smile Center MO', owner: 'Dr. Michael Schukar', location: 'St. Louis, MO', phone: '(314) 821-2400', website: 'https://www.stlouissmilecenter.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'St. Louis MO cosmetic dentist — Gateway City market' },
      { name: 'Queen City Dental Cincinnati OH', owner: 'Dr. Gary Sigman', location: 'Cincinnati, OH', phone: '(513) 984-1900', website: 'https://www.queencitydental.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Cincinnati OH cosmetic dentist — Queen City Tri-State market' },
      { name: 'Pittsburgh Smile Center PA', owner: 'Dr. Frank Caliendo', location: 'Pittsburgh, PA', phone: '(412) 922-9292', website: 'https://www.pittsburghsmilecenter.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Pittsburgh PA cosmetic dentist — Steel City market' },
    ],
  },
  {
    db: 'chiroPT',
    prospects: [
      { name: 'St. Louis Chiropractic MO', owner: 'Dr. William Hecker', location: 'St. Louis, MO', phone: '(314) 842-0040', website: 'https://www.stlouischiropractic.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'St. Louis MO chiropractor — large Gateway City market' },
      { name: 'Cincinnati Sports Medicine & Orthopaedic OH', owner: 'Dr. Timothy Kremchek', location: 'Cincinnati, OH', phone: '(513) 354-3700', website: 'https://www.csmoc.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Cincinnati OH sports medicine & PT — Tri-State active population' },
      { name: 'UPMC Sports Medicine Pittsburgh PA', owner: 'Dr. James Bradley', location: 'Pittsburgh, PA', phone: '(412) 432-3600', website: 'https://www.upmc.com/services/sports-medicine', hasWebsite: 'Yes', wqs: 7, opp: 7, notes: 'Pittsburgh PA sports medicine & PT — large health system, Steel City market' },
    ],
  },
  {
    db: 'realEstate',
    prospects: [
      { name: 'Dielmann Sotheby\'s St. Louis MO', owner: 'Susan Dielmann', location: 'St. Louis, MO', phone: '(314) 725-0009', website: 'https://www.dielmannsothebys.com', hasWebsite: 'Yes', wqs: 7, opp: 7, notes: 'St. Louis MO luxury real estate — premier Gateway City brokerage' },
      { name: 'Sibcy Cline Realtors Cincinnati OH', owner: 'Mike Cline', location: 'Cincinnati, OH', phone: '(513) 985-4000', website: 'https://www.sibcycline.com', hasWebsite: 'Yes', wqs: 7, opp: 7, notes: 'Cincinnati OH real estate — largest Tri-State brokerage, dominant market share' },
      { name: 'Howard Hanna Real Estate Pittsburgh PA', owner: 'Howard Hanna', location: 'Pittsburgh, PA', phone: '(412) 856-9600', website: 'https://www.howardhanna.com', hasWebsite: 'Yes', wqs: 7, opp: 7, notes: 'Pittsburgh PA real estate — largest Steel City brokerage, regional powerhouse' },
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
  console.log(`\n✅ Batch 65 complete — ${total} prospects added.`);
})();
