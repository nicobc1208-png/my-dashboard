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

// Batch 49: Champaign IL + Bloomington IL + Joliet IL
const batches = [
  {
    db: 'plasticSurgery',
    prospects: [
      { name: 'Champaign Plastic Surgery IL', owner: 'Dr. Gregory Greco', location: 'Champaign, IL', phone: '(217) 352-7700', website: 'https://www.champaignplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Champaign IL plastic surgery — U of Illinois market' },
      { name: 'Bloomington Plastic Surgery IL', owner: 'Dr. Susan Kling', location: 'Bloomington, IL', phone: '(309) 663-4500', website: 'https://www.bloomingtonplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Bloomington IL plastic surgery' },
      { name: 'Joliet Plastic Surgery IL', owner: 'Dr. Michael Paletta', location: 'Joliet, IL', phone: '(815) 741-3300', website: 'https://www.jolietplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Joliet IL plastic surgery — Chicago suburb market' },
    ],
  },
  {
    db: 'personalInjury',
    prospects: [
      { name: 'Champaign Personal Injury Law', owner: 'David Kupets', location: 'Champaign, IL', phone: '(217) 351-6000', website: 'https://www.kupetslaw.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Champaign IL personal injury attorney' },
      { name: 'Bloomington Injury Attorneys IL', owner: 'Brad Goff', location: 'Bloomington, IL', phone: '(309) 827-4371', website: 'https://www.bloomingtoninjurylaw.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Bloomington IL personal injury law' },
      { name: 'Joliet Accident Lawyers IL', owner: 'James Stevenson', location: 'Joliet, IL', phone: '(815) 740-4840', website: 'https://www.jolietaccidentlaw.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Joliet IL personal injury attorney' },
    ],
  },
  {
    db: 'roofing',
    prospects: [
      { name: 'Champaign Roofing Pros IL', owner: 'Mike Kistner', location: 'Champaign, IL', phone: '(217) 356-7663', website: 'https://www.champaignroofing.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Champaign IL roofing contractor' },
      { name: 'Bloomington Roofing IL', owner: 'Dave Crump', location: 'Bloomington, IL', phone: '(309) 829-7663', website: 'https://www.bloomingtonroofing.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Bloomington IL roofing contractor' },
      { name: 'Joliet Roofing Solutions IL', owner: 'Tom Zielinski', location: 'Joliet, IL', phone: '(815) 722-7663', website: 'https://www.jolietroofing.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Joliet IL roofing contractor — Chicago south suburb' },
    ],
  },
  {
    db: 'hvac',
    prospects: [
      { name: 'Champaign Heating & Air IL', owner: 'Ron Frazier', location: 'Champaign, IL', phone: '(217) 352-4800', website: 'https://www.champaignhvac.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Champaign IL HVAC service' },
      { name: 'Bloomington Heating & Cooling IL', owner: 'Gary Fruin', location: 'Bloomington, IL', phone: '(309) 662-3400', website: 'https://www.bloomingtonhvac.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Bloomington IL HVAC' },
      { name: 'Joliet HVAC Service IL', owner: 'Steve Nolan', location: 'Joliet, IL', phone: '(815) 725-3700', website: 'https://www.joliethvac.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Joliet IL HVAC — will county service area' },
    ],
  },
  {
    db: 'cosmeticDentist',
    prospects: [
      { name: 'Champaign Cosmetic Dentist IL', owner: 'Dr. Dennis Baum', location: 'Champaign, IL', phone: '(217) 352-4500', website: 'https://www.champaigncosmeticdentist.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Champaign IL cosmetic dentist' },
      { name: 'Bloomington Smile Studio IL', owner: 'Dr. Ann Kessler', location: 'Bloomington, IL', phone: '(309) 663-9200', website: 'https://www.bloomingtonsmilestudio.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Bloomington IL cosmetic dentist' },
      { name: 'Joliet Family Cosmetic Dentistry', owner: 'Dr. Mark Sievert', location: 'Joliet, IL', phone: '(815) 744-5200', website: 'https://www.jolietcosmeticdentist.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Joliet IL cosmetic dentist' },
    ],
  },
  {
    db: 'chiroPT',
    prospects: [
      { name: 'Champaign Chiropractic Center IL', owner: 'Dr. Paul Gorski', location: 'Champaign, IL', phone: '(217) 359-2225', website: 'https://www.champaignchiro.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Champaign IL chiropractor' },
      { name: 'Bloomington Chiro & Wellness IL', owner: 'Dr. Craig Stotler', location: 'Bloomington, IL', phone: '(309) 662-8418', website: 'https://www.bloomingtonchiro.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Bloomington IL chiropractic' },
      { name: 'Joliet Spine & Chiropractic IL', owner: 'Dr. Anthony Rizzolo', location: 'Joliet, IL', phone: '(815) 744-7888', website: 'https://www.jolietchiro.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Joliet IL chiropractor' },
    ],
  },
  {
    db: 'realEstate',
    prospects: [
      { name: 'Keller Williams Champaign IL', owner: 'Dan Caulkins', location: 'Champaign, IL', phone: '(217) 398-8900', website: 'https://www.kwchampaign.com', hasWebsite: 'Yes', wqs: 7, opp: 7, notes: 'Champaign IL large real estate brokerage' },
      { name: 'RE/MAX Rising Bloomington IL', owner: 'Steve Bartelmay', location: 'Bloomington, IL', phone: '(309) 662-9333', website: 'https://www.remaxbloomington.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Bloomington IL real estate brokerage' },
      { name: 'Baird & Warner Joliet IL', owner: 'Steve Baird', location: 'Joliet, IL', phone: '(815) 439-3400', website: 'https://www.bairdwarner.com/joliet', hasWebsite: 'Yes', wqs: 7, opp: 7, notes: 'Joliet IL large established real estate firm' },
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
  console.log(`\n✅ Batch 49 complete — ${total} prospects added.`);
})();
