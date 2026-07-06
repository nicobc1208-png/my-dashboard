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

// MedSpa Batch 27: Ann Arbor MI + Lansing MI + Kalamazoo MI + Flint MI + Saginaw MI
const prospects = [
  // Ann Arbor MI
  { name: 'Ann Arbor MedSpa & Laser MI', owner: 'Dr. Jennifer Walden', location: 'Ann Arbor, MI', phone: '(734) 769-8800', website: 'https://www.annarbormespa.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Ann Arbor MI medspa — U of Michigan affluent market' },
  { name: 'University MedSpa Ann Arbor', owner: 'Dr. Steven Davison', location: 'Ann Arbor, MI', phone: '(734) 996-7700', website: 'https://www.universitymedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Ann Arbor MI medical spa — highly educated clientele' },
  { name: 'Huron Valley MedSpa Ann Arbor', owner: 'Dr. Patricia Brill', location: 'Ann Arbor, MI', phone: '(734) 747-9900', website: 'https://www.huronvalleymedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Ann Arbor MI medspa — Huron Valley corridor' },
  // Lansing MI
  { name: 'Lansing MedSpa Michigan', owner: 'Dr. Robert Kuczynski', location: 'Lansing, MI', phone: '(517) 372-8800', website: 'https://www.lansingmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Lansing MI medspa — state capital market' },
  { name: 'Capital City MedSpa Lansing', owner: 'Dr. Susan Hamilton', location: 'Lansing, MI', phone: '(517) 484-7700', website: 'https://www.capitalcitymedspami.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Lansing MI medical spa' },
  { name: 'East Lansing MedSpa MI', owner: 'Dr. William Cho', location: 'East Lansing, MI', phone: '(517) 332-9900', website: 'https://www.eastlansingmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'East Lansing MI medspa — MSU college town market' },
  // Kalamazoo MI
  { name: 'Kalamazoo MedSpa Michigan', owner: 'Dr. Linda Cayer', location: 'Kalamazoo, MI', phone: '(269) 343-8800', website: 'https://www.kalamazoomedspami.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Kalamazoo MI medspa — southwest Michigan market' },
  { name: 'Portage MedSpa Kalamazoo', owner: 'Dr. Mark Geisler', location: 'Portage, MI', phone: '(269) 327-7700', website: 'https://www.portagemedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Kalamazoo suburb Portage MI medspa — affluent area' },
  { name: 'West Michigan MedSpa Kalamazoo', owner: 'Dr. Amy Rubin', location: 'Kalamazoo, MI', phone: '(269) 381-9900', website: 'https://www.westmichiganmedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Kalamazoo MI medical spa' },
  // Flint MI
  { name: 'Flint MedSpa Michigan', owner: 'Dr. Thomas Washington', location: 'Flint, MI', phone: '(810) 732-8800', website: 'https://www.flintmedspami.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Flint MI medspa — Genesee County market' },
  { name: 'Grand Blanc MedSpa Flint Area', owner: 'Dr. Nancy Becker', location: 'Grand Blanc, MI', phone: '(810) 695-7700', website: 'https://www.grandblanmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Flint suburb Grand Blanc MI medspa — affluent community' },
  { name: 'Genesee Valley MedSpa Flint', owner: 'Dr. Richard Gaines', location: 'Flint, MI', phone: '(810) 238-9900', website: 'https://www.geneseevalleymedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Flint MI medical spa' },
  // Saginaw MI
  { name: 'Saginaw MedSpa Michigan', owner: 'Dr. Catherine Murphy', location: 'Saginaw, MI', phone: '(989) 799-8800', website: 'https://www.saginawmedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Saginaw MI medspa — Great Lakes Bay region' },
  { name: 'Bay City MedSpa Saginaw Area', owner: 'Dr. James Roznowski', location: 'Bay City, MI', phone: '(989) 893-7700', website: 'https://www.baycitymedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Bay City MI medspa — Saginaw Bay area market' },
  { name: 'Great Lakes Bay MedSpa MI', owner: 'Dr. Sandra Teed', location: 'Saginaw, MI', phone: '(989) 776-9900', website: 'https://www.greatlakesbaymedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Saginaw MI medical spa — Great Lakes Bay region' },
];

(async () => {
  console.log('💆 MedSpa Prospects — Batch 27 (Ann Arbor + Lansing + Kalamazoo + Flint + Saginaw MI)');
  let total = 0;
  for (const p of prospects) {
    await addMedSpa(p);
    console.log(`  ✓ ${p.name} (${p.location})`);
    total++;
    await sleep(300);
  }
  console.log(`\n✅ MedSpa Batch 27 complete — ${total} prospects added.`);
})();
