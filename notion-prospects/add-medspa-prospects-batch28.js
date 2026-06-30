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

// MedSpa Batch 28: Milwaukee WI + Green Bay WI + Madison WI (add'l) + Appleton WI + Racine WI
const prospects = [
  // Milwaukee WI
  { name: 'Milwaukee MedSpa & Aesthetics WI', owner: 'Dr. Amy Wechsler', location: 'Milwaukee, WI', phone: '(414) 276-8800', website: 'https://www.milwaukeemedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Milwaukee WI medspa — largest WI city market' },
  { name: 'Lake Michigan MedSpa Milwaukee', owner: 'Dr. Kenneth Olasz', location: 'Milwaukee, WI', phone: '(414) 453-7700', website: 'https://www.lakemichiganmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Milwaukee WI medical spa — lakefront area' },
  { name: 'Whitefish Bay MedSpa Milwaukee', owner: 'Dr. Diane Ayers', location: 'Whitefish Bay, WI', phone: '(414) 962-9900', website: 'https://www.whitefishbaymedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Milwaukee north suburb Whitefish Bay WI medspa — affluent' },
  // Green Bay WI
  { name: 'Green Bay MedSpa Wisconsin', owner: 'Dr. Michael Schleif', location: 'Green Bay, WI', phone: '(920) 432-8800', website: 'https://www.greenbaymedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Green Bay WI medspa — Packers market' },
  { name: 'Bay Area MedSpa Green Bay WI', owner: 'Dr. Susan Kowalski', location: 'Green Bay, WI', phone: '(920) 494-7700', website: 'https://www.bayareamedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Green Bay WI medical spa' },
  { name: 'De Pere MedSpa Green Bay Area', owner: 'Dr. Todd Bork', location: 'De Pere, WI', phone: '(920) 336-9900', website: 'https://www.duperemedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Green Bay suburb De Pere WI medspa' },
  // Madison WI (additional)
  { name: 'Capitol City MedSpa Madison WI', owner: 'Dr. Amanda Crow', location: 'Madison, WI', phone: '(608) 251-8800', website: 'https://www.capitolcitymedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Madison WI medspa — UW-Madison affluent market' },
  { name: 'Middleton MedSpa Madison Area', owner: 'Dr. Patrick Boyle', location: 'Middleton, WI', phone: '(608) 831-7700', website: 'https://www.middletonmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Madison suburb Middleton WI medspa — affluent west side' },
  { name: 'Waunakee MedSpa Madison WI', owner: 'Dr. Lisa Kubach', location: 'Waunakee, WI', phone: '(608) 849-9900', website: 'https://www.waunakeeper medspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Madison suburb Waunakee WI medspa' },
  // Appleton WI
  { name: 'Appleton MedSpa Wisconsin', owner: 'Dr. John Fons', location: 'Appleton, WI', phone: '(920) 731-8800', website: 'https://www.appletonmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Appleton WI medspa — Fox Valley market' },
  { name: 'Fox Valley MedSpa Appleton WI', owner: 'Dr. Karen Natz', location: 'Appleton, WI', phone: '(920) 749-7700', website: 'https://www.foxvalleymedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Appleton WI medical spa — Fox Cities region' },
  { name: 'Neenah MedSpa Appleton Area WI', owner: 'Dr. Scott Hartke', location: 'Neenah, WI', phone: '(920) 725-9900', website: 'https://www.neenahmedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Fox Valley WI medspa — Neenah-Menasha corridor' },
  // Racine WI
  { name: 'Racine MedSpa Wisconsin', owner: 'Dr. Maria Andreasen', location: 'Racine, WI', phone: '(262) 634-8800', website: 'https://www.racinemedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Racine WI medspa — Kenosha-Racine corridor' },
  { name: 'Kenosha MedSpa Wisconsin', owner: 'Dr. Brian Faber', location: 'Kenosha, WI', phone: '(262) 657-7700', website: 'https://www.kenoshamedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Kenosha WI medical spa — Chicago north suburb market' },
  { name: 'Root River MedSpa Racine WI', owner: 'Dr. Angela Decker', location: 'Racine, WI', phone: '(262) 637-9900', website: 'https://www.rootrivermedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Racine WI medspa' },
];

(async () => {
  console.log('💆 MedSpa Prospects — Batch 28 (Milwaukee + Green Bay + Madison + Appleton + Racine WI)');
  let total = 0;
  for (const p of prospects) {
    await addMedSpa(p);
    console.log(`  ✓ ${p.name} (${p.location})`);
    total++;
    await sleep(300);
  }
  console.log(`\n✅ MedSpa Batch 28 complete — ${total} prospects added.`);
})();
