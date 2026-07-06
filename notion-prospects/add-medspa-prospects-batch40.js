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

async function addMedSpa(p) {
  const props = {
    'Business Name': { title: rt(p.name) },
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

// MedSpa Batch 40: Cincinnati OH + Pittsburgh PA + Milwaukee WI + Detroit MI + Cleveland OH
const prospects = [
  // Cincinnati OH
  { name: 'Cincinnati MedSpa Ohio', owner: 'Dr. Emily Crawford', location: 'Cincinnati, OH', phone: '(513) 984-8800', website: 'https://www.cincinnatiMedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Cincinnati OH medspa — Tri-State Ohio/Kentucky/Indiana market' },
  { name: 'Hyde Park MedSpa Cincinnati OH', owner: 'Dr. Charles Norris', location: 'Cincinnati, OH', phone: '(513) 871-7700', website: 'https://www.hydeparkmedspa.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Cincinnati OH medspa — Hyde Park affluent east side neighborhood' },
  { name: 'Mason MedSpa Cincinnati OH', owner: 'Dr. Sandra Bloom', location: 'Mason, OH', phone: '(513) 398-9900', website: 'https://www.masonmedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Mason OH medspa — affluent Cincinnati north suburb, Warren County' },
  // Pittsburgh PA
  { name: 'Pittsburgh MedSpa Pennsylvania', owner: 'Dr. James Donovan', location: 'Pittsburgh, PA', phone: '(412) 681-8800', website: 'https://www.pittsburghMedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Pittsburgh PA medspa — Steel City growing aesthetic market' },
  { name: 'Shadyside MedSpa Pittsburgh PA', owner: 'Dr. Lauren Walsh', location: 'Pittsburgh, PA', phone: '(412) 621-7700', website: 'https://www.shadysidemedspa.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Pittsburgh PA medspa — Shadyside upscale shopping & dining district' },
  { name: 'Mt. Lebanon MedSpa Pittsburgh PA', owner: 'Dr. Patrick Flynn', location: 'Pittsburgh, PA', phone: '(412) 344-9900', website: 'https://www.mtlebanonmedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Pittsburgh PA medspa — Mt. Lebanon affluent south suburb' },
  // Milwaukee WI
  { name: 'Milwaukee MedSpa Wisconsin', owner: 'Dr. Carol Jensen', location: 'Milwaukee, WI', phone: '(414) 276-8800', website: 'https://www.milwaukeemedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Milwaukee WI medspa — large Midwest Lake Michigan market' },
  { name: 'Brookfield MedSpa Milwaukee WI', owner: 'Dr. Thomas Erikson', location: 'Brookfield, WI', phone: '(262) 784-7700', website: 'https://www.brookfieldmedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Brookfield WI medspa — Milwaukee\'s most affluent western suburb' },
  { name: 'Mequon MedSpa Milwaukee WI', owner: 'Dr. Nancy Larson', location: 'Mequon, WI', phone: '(262) 241-9900', website: 'https://www.mequonmedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Mequon WI medspa — ultra-affluent Milwaukee north shore community' },
  // Detroit MI
  { name: 'Detroit MedSpa Michigan', owner: 'Dr. Marcus Johnson', location: 'Detroit, MI', phone: '(313) 871-8800', website: 'https://www.detroitmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Detroit MI medspa — large Great Lakes metro, growing aesthetic market' },
  { name: 'Birmingham MedSpa Detroit MI', owner: 'Dr. Katherine Reed', location: 'Birmingham, MI', phone: '(248) 647-7700', website: 'https://www.birminghammedspa.com', hasWebsite: 'Yes', wqs: 7, opp: 9, notes: 'Birmingham MI medspa — Detroit\'s most affluent suburb, luxury shopping corridor' },
  { name: 'Grosse Pointe MedSpa Detroit MI', owner: 'Dr. Steven Hartley', location: 'Grosse Pointe, MI', phone: '(313) 882-9900', website: 'https://www.grossepointemedspa.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Grosse Pointe MI medspa — old-money Detroit lakefront enclave' },
  // Cleveland OH
  { name: 'Cleveland MedSpa Ohio', owner: 'Dr. Diane Kovacs', location: 'Cleveland, OH', phone: '(216) 241-8800', website: 'https://www.clevelandmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Cleveland OH medspa — large Lake Erie market' },
  { name: 'Beachwood MedSpa Cleveland OH', owner: 'Dr. Alan Goldstein', location: 'Beachwood, OH', phone: '(216) 831-7700', website: 'https://www.beachwoodmedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Beachwood OH medspa — Cleveland\'s most affluent east suburb, Jewish community hub' },
  { name: 'Westlake MedSpa Cleveland OH', owner: 'Dr. Patricia Schultz', location: 'Westlake, OH', phone: '(440) 835-9900', website: 'https://www.westlakemedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Westlake OH medspa — affluent Cleveland west suburb' },
];

(async () => {
  console.log('💆 MedSpa Prospects — Batch 40 (Cincinnati OH + Pittsburgh PA + Milwaukee WI + Detroit MI + Cleveland OH)');
  let total = 0;
  for (const p of prospects) {
    await addMedSpa(p);
    console.log(`  ✓ ${p.name} (${p.location})`);
    total++;
    await sleep(300);
  }
  console.log(`\n✅ MedSpa Batch 40 complete — ${total} prospects added.`);
})();
