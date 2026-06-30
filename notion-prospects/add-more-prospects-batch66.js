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

// Batch 66: Memphis TN + Louisville KY + New Orleans LA
const batches = [
  {
    db: 'plasticSurgery',
    prospects: [
      { name: 'Memphis Plastic Surgery TN', owner: 'Dr. William Rosenblatt', location: 'Memphis, TN', phone: '(901) 761-9999', website: 'https://www.memphisplasticsurgery.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Memphis TN plastic surgery — Mid-South regional market' },
      { name: 'Louisville Plastic Surgery KY', owner: 'Dr. Michael Bogdan', location: 'Louisville, KY', phone: '(502) 897-2787', website: 'https://www.louisvilleplasticsurgery.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Louisville KY plastic surgery — Derby City market' },
      { name: 'New Orleans Plastic Surgery LA', owner: 'Dr. Charles Warden', location: 'New Orleans, LA', phone: '(504) 895-7200', website: 'https://www.neworleansplasticsurgery.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'New Orleans LA plastic surgery — Mardi Gras & tourism market, Uptown affluent' },
    ],
  },
  {
    db: 'personalInjury',
    prospects: [
      { name: 'Bailey & Greer Memphis TN', owner: 'Thomas Greer', location: 'Memphis, TN', phone: '(901) 680-9777', website: 'https://www.baileygreer.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Memphis TN personal injury law — prominent Mid-South plaintiff firm' },
      { name: 'Dolt Thompson Shepherd Louisville KY', owner: 'Tom Dolt', location: 'Louisville, KY', phone: '(502) 244-7772', website: 'https://www.kytrial.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Louisville KY personal injury attorneys — Derby City market' },
      { name: 'Martzell Bickford & Centola New Orleans LA', owner: 'Scott Bickford', location: 'New Orleans, LA', phone: '(504) 581-9065', website: 'https://www.mbfirm.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'New Orleans LA personal injury law — maritime & industrial injury specialist' },
    ],
  },
  {
    db: 'roofing',
    prospects: [
      { name: 'Memphis Roofing Pros TN', owner: 'Gary Petty', location: 'Memphis, TN', phone: '(901) 377-7663', website: 'https://www.memphisroofing.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Memphis TN roofing — Mid-South storm & tornado market' },
      { name: 'Louisville Roofing KY', owner: 'Jeff Huber', location: 'Louisville, KY', phone: '(502) 459-7663', website: 'https://www.louisvilleroofing.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Louisville KY roofing contractor — Derby City market' },
      { name: 'New Orleans Roofing Company LA', owner: 'Craig Thibodaux', location: 'New Orleans, LA', phone: '(504) 733-7663', website: 'https://www.neworleansroofing.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'New Orleans LA roofing — hurricane corridor, massive post-storm demand' },
    ],
  },
  {
    db: 'hvac',
    prospects: [
      { name: 'Service Experts Memphis TN', owner: 'Dave Phelps', location: 'Memphis, TN', phone: '(901) 372-2244', website: 'https://www.serviceexperts.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Memphis TN HVAC — hot humid Mid-South summers, heavy AC demand' },
      { name: 'Lee\'s Air Conditioning Louisville KY', owner: 'Tim Lee', location: 'Louisville, KY', phone: '(502) 458-5423', website: 'https://www.leesac.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Louisville KY HVAC — Derby City four-season market' },
      { name: 'AccuTemp Services New Orleans LA', owner: 'Steve Morales', location: 'New Orleans, LA', phone: '(504) 833-5050', website: 'https://www.accutemp.net', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'New Orleans LA HVAC — subtropical heat & humidity, year-round AC critical' },
    ],
  },
  {
    db: 'cosmeticDentist',
    prospects: [
      { name: 'Memphis Center for Family & Cosmetic Dentistry TN', owner: 'Dr. Eric Farmer', location: 'Memphis, TN', phone: '(901) 683-8077', website: 'https://www.memphissmiles.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Memphis TN cosmetic dentist — Mid-South market' },
      { name: 'Louisville Family Dental KY', owner: 'Dr. David Snyder', location: 'Louisville, KY', phone: '(502) 896-7670', website: 'https://www.louisvillefamilydental.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Louisville KY cosmetic dentist — Derby City market' },
      { name: 'New Orleans Dental Center LA', owner: 'Dr. Paul Guidry', location: 'New Orleans, LA', phone: '(504) 525-3700', website: 'https://www.neworleansdentalcenter.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'New Orleans LA cosmetic dentist — French Quarter area market' },
    ],
  },
  {
    db: 'chiroPT',
    prospects: [
      { name: 'Memphis Chiropractic TN', owner: 'Dr. Larry Rogers', location: 'Memphis, TN', phone: '(901) 309-0381', website: 'https://www.memphischiropractic.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Memphis TN chiropractor — Mid-South market' },
      { name: 'Louisville Chiropractic KY', owner: 'Dr. Roger Wilburn', location: 'Louisville, KY', phone: '(502) 499-6440', website: 'https://www.louisvillechiropractic.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Louisville KY chiropractic clinic — Derby City market' },
      { name: 'New Orleans Chiropractic LA', owner: 'Dr. Henry Tran', location: 'New Orleans, LA', phone: '(504) 456-9999', website: 'https://www.neworleanschiropractic.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'New Orleans LA chiropractor — Crescent City market' },
    ],
  },
  {
    db: 'realEstate',
    prospects: [
      { name: 'Marx-Bensdorf Realtors Memphis TN', owner: 'Ellen Marx', location: 'Memphis, TN', phone: '(901) 682-1868', website: 'https://www.marx-bensdorf.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Memphis TN real estate — oldest & largest independent Memphis brokerage' },
      { name: 'Lenihan Sotheby\'s Louisville KY', owner: 'Terri Lenihan', location: 'Louisville, KY', phone: '(502) 899-2100', website: 'https://www.lenihansothebys.com', hasWebsite: 'Yes', wqs: 7, opp: 7, notes: 'Louisville KY luxury real estate — Derby City premier brokerage' },
      { name: 'LATTER & BLUM New Orleans LA', owner: 'Robert Merrick', location: 'New Orleans, LA', phone: '(504) 888-8500', website: 'https://www.latterblum.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'New Orleans LA real estate — largest independent Louisiana brokerage' },
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
  console.log(`\n✅ Batch 66 complete — ${total} prospects added.`);
})();
