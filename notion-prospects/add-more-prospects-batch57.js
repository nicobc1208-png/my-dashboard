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

// Batch 57: Little Rock AR + Jonesboro AR + Fort Smith AR
const batches = [
  {
    db: 'plasticSurgery',
    prospects: [
      { name: 'Little Rock Plastic Surgery AR', owner: 'Dr. James Yuen', location: 'Little Rock, AR', phone: '(501) 224-1200', website: 'https://www.littlerockplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Little Rock AR plastic surgery — state capital market' },
      { name: 'Jonesboro Plastic Surgery AR', owner: 'Dr. Richard Moore', location: 'Jonesboro, AR', phone: '(870) 936-3333', website: 'https://www.jonesboroplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Jonesboro AR plastic surgery — NE Arkansas hub' },
      { name: 'Fort Smith Plastic Surgery AR', owner: 'Dr. Allen Poche', location: 'Fort Smith, AR', phone: '(479) 785-6000', website: 'https://www.fortsmithplasticsurgery.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Fort Smith AR plastic surgery — river valley market' },
    ],
  },
  {
    db: 'personalInjury',
    prospects: [
      { name: 'McMath Woods Little Rock AR', owner: 'Sidney McMath', location: 'Little Rock, AR', phone: '(501) 396-5400', website: 'https://www.mcmathlaw.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Little Rock AR personal injury — major Arkansas firm' },
      { name: 'Jonesboro Accident Lawyers AR', owner: 'Greg Hopkins', location: 'Jonesboro, AR', phone: '(870) 933-5567', website: 'https://www.jonesboroinjurylaw.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Jonesboro AR personal injury attorneys' },
      { name: 'Fort Smith Injury Law AR', owner: 'Tom Wheeler', location: 'Fort Smith, AR', phone: '(479) 783-1776', website: 'https://www.fortsmithinjurylaw.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Fort Smith AR personal injury law' },
    ],
  },
  {
    db: 'roofing',
    prospects: [
      { name: 'Little Rock Roofing Experts AR', owner: 'Danny Britt', location: 'Little Rock, AR', phone: '(501) 224-7663', website: 'https://www.littlerockroofing.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Little Rock AR roofing contractor' },
      { name: 'Jonesboro Roofing Company AR', owner: 'Kyle Franks', location: 'Jonesboro, AR', phone: '(870) 932-7663', website: 'https://www.jonesbororoofing.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Jonesboro AR roofing contractor' },
      { name: 'Fort Smith Roofing Pros AR', owner: 'Jeff Simmons', location: 'Fort Smith, AR', phone: '(479) 785-7663', website: 'https://www.fortsmithroofing.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Fort Smith AR roofing contractor' },
    ],
  },
  {
    db: 'hvac',
    prospects: [
      { name: 'Little Rock Heating & Air AR', owner: 'Steve Price', location: 'Little Rock, AR', phone: '(501) 228-1000', website: 'https://www.littlerockhvac.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Little Rock AR HVAC service' },
      { name: 'Jonesboro Heating & Cooling AR', owner: 'Bill Haney', location: 'Jonesboro, AR', phone: '(870) 935-4800', website: 'https://www.jonesborohvac.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Jonesboro AR HVAC' },
      { name: 'Fort Smith HVAC Service AR', owner: 'Randy Wallis', location: 'Fort Smith, AR', phone: '(479) 646-4400', website: 'https://www.fortsmithhvac.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Fort Smith AR HVAC service' },
    ],
  },
  {
    db: 'cosmeticDentist',
    prospects: [
      { name: 'Little Rock Cosmetic Dentist AR', owner: 'Dr. Jimmy Burnett', location: 'Little Rock, AR', phone: '(501) 227-4777', website: 'https://www.littlerockcosmeticdentist.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Little Rock AR cosmetic dentist' },
      { name: 'Jonesboro Smile Center AR', owner: 'Dr. Matt Washburn', location: 'Jonesboro, AR', phone: '(870) 931-6622', website: 'https://www.jonesborosmile.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Jonesboro AR cosmetic dentist' },
      { name: 'Fort Smith Dental Arts AR', owner: 'Dr. Scott Miller', location: 'Fort Smith, AR', phone: '(479) 648-8200', website: 'https://www.fortsmithdentalarts.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Fort Smith AR cosmetic dentist' },
    ],
  },
  {
    db: 'chiroPT',
    prospects: [
      { name: 'Little Rock Chiropractic AR', owner: 'Dr. Kenneth Hooks', location: 'Little Rock, AR', phone: '(501) 225-2626', website: 'https://www.littlerockchiro.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Little Rock AR chiropractor' },
      { name: 'Jonesboro Spine & Chiro AR', owner: 'Dr. Fred Vire', location: 'Jonesboro, AR', phone: '(870) 935-0111', website: 'https://www.jonesborochiro.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Jonesboro AR chiropractic' },
      { name: 'Fort Smith Chiropractic AR', owner: 'Dr. Bill Green', location: 'Fort Smith, AR', phone: '(479) 783-9000', website: 'https://www.fortsmithchiro.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Fort Smith AR chiropractor' },
    ],
  },
  {
    db: 'realEstate',
    prospects: [
      { name: 'Coldwell Banker Little Rock AR', owner: 'Gary Haymes', location: 'Little Rock, AR', phone: '(501) 225-5588', website: 'https://www.cblittlerock.com', hasWebsite: 'Yes', wqs: 7, opp: 7, notes: 'Little Rock AR large real estate brokerage' },
      { name: 'Jonesboro Realty Group AR', owner: 'Joe Bagby', location: 'Jonesboro, AR', phone: '(870) 932-2040', website: 'https://www.jonesbororealty.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Jonesboro AR real estate brokerage' },
      { name: 'Weichert Fort Smith AR', owner: 'Susan Cravens', location: 'Fort Smith, AR', phone: '(479) 646-1000', website: 'https://www.weichertfortsmith.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Fort Smith AR real estate — river valley market' },
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
  console.log(`\n✅ Batch 57 complete — ${total} prospects added.`);
})();
