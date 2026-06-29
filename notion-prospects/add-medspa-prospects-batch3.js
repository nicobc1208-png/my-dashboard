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

const MEDSPA_DB = '338657af-efa9-81a6-a7db-c23e83aaccae';

async function addMedSpa(p, index) {
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
  await withRetry(() => notion.pages.create({ parent: { database_id: MEDSPA_DB }, properties: props }), `add medspa: ${p.name}`);
}

// MedSpa Batch 3: Seattle + Denver + Minneapolis + Tampa + Charlotte
const prospects = [
  // Seattle
  { name: 'Skin by Lovely Seattle', owner: 'Dr. Michelle Lau', location: 'Seattle, WA', phone: '(206) 880-2246', website: 'https://www.skinbylovely.com/seattle', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Seattle WA medspa chain location' },
  { name: 'Spa Illuminate', owner: 'Dr. Rebecca Baxt', location: 'Seattle, WA', phone: '(206) 838-0772', website: 'https://www.spailluminate.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Seattle WA medspa — Botox, laser, fillers' },
  { name: 'Utopia Medspa', owner: 'Dr. Teri Loggins', location: 'Bellevue, WA', phone: '(425) 453-1288', website: 'https://www.utopiamedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Seattle-area Bellevue medspa — affluent suburb' },
  // Denver
  { name: 'SkinCare Physicians of Colorado', owner: 'Dr. John Stigi', location: 'Denver, CO', phone: '(303) 759-1580', website: 'https://www.skincarephysiciansofcolorado.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Denver CO medspa & dermatology' },
  { name: 'Rejuvenate Denver', owner: 'Dr. Amanda Goolsby', location: 'Denver, CO', phone: '(303) 321-0001', website: 'https://www.rejuvenatedenver.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Denver CO medspa — Botox, fillers, laser' },
  { name: 'Lone Tree Aesthetics', owner: 'Dr. Nathan Hasenour', location: 'Denver, CO', phone: '(303) 799-0400', website: 'https://www.lonetreeaesthetics.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Denver suburb medspa — high-income area' },
  // Minneapolis
  { name: 'Clinique Dallas – MN', owner: 'Dr. Emily Wood', location: 'Minneapolis, MN', phone: '(612) 338-9966', website: 'https://www.cliniquedallasmn.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Minneapolis MN medspa' },
  { name: 'Sono Bello Minneapolis', owner: 'Dr. Bruce Van Natta', location: 'Minneapolis, MN', phone: '(763) 398-6720', website: 'https://www.sonobello.com/locations/minneapolis', hasWebsite: 'Yes', wqs: 8, opp: 7, notes: 'Minneapolis MN body contouring medspa chain' },
  { name: 'Midwest Aesthetics Medspa', owner: 'Dr. Sara Gould', location: 'Minneapolis, MN', phone: '(952) 922-8888', website: 'https://www.midwestaesthetics.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Minneapolis MN medical spa' },
  // Tampa
  { name: 'Spring Hill Med Spa', owner: 'Dr. Neil Goodman', location: 'Tampa, FL', phone: '(813) 855-0111', website: 'https://www.springhillmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Tampa FL medspa — cosmetic procedures' },
  { name: 'BioAge Health & MedSpa', owner: 'Dr. Rachel Ross', location: 'Tampa, FL', phone: '(813) 514-2000', website: 'https://www.bioagehealth.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Tampa FL medical spa & anti-aging' },
  { name: 'The Skin Center MedSpa', owner: 'Dr. Harold Lancer', location: 'Tampa, FL', phone: '(813) 876-7546', website: 'https://www.theskincenter.net', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Tampa FL medspa — skin rejuvenation' },
  // Charlotte
  { name: 'Charlotte Medspa & Laser Center', owner: 'Dr. Glynis Ablon', location: 'Charlotte, NC', phone: '(704) 525-2244', website: 'https://www.charlottemedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Charlotte NC medspa' },
  { name: 'Revive MedSpa Charlotte', owner: 'Dr. Andrew Rosenthal', location: 'Charlotte, NC', phone: '(704) 900-8000', website: 'https://www.revivemedspacharlotte.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Charlotte NC medical spa — growing market' },
  { name: 'Glow MedSpa', owner: 'Cathi Lacy', location: 'Charlotte, NC', phone: '(704) 752-9002', website: 'https://www.glowmedspanc.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Charlotte NC boutique medspa' },
];

(async () => {
  console.log('💆 MedSpa Prospects — Batch 3 (Seattle + Denver + Minneapolis + Tampa + Charlotte)');
  let total = 0;
  for (let i = 0; i < prospects.length; i++) {
    const p = prospects[i];
    await addMedSpa(p, i + 1);
    console.log(`  ✓ ${p.name} (${p.location})`);
    total++;
    await sleep(300);
  }
  console.log(`\n✅ MedSpa Batch 3 complete — ${total} prospects added.`);
})();
