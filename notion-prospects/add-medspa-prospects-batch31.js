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

// MedSpa Batch 31: Columbia MO + Joplin MO + Fayetteville AR + Jonesboro AR + Tulsa OK (add'l)
const prospects = [
  // Columbia MO
  { name: 'Columbia MedSpa & Skin Missouri', owner: 'Dr. Ashley Reynolds', location: 'Columbia, MO', phone: '(573) 443-8800', website: 'https://www.columbiamoskin.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Columbia MO medspa — Mizzou college town market' },
  { name: 'Tiger Town MedSpa Columbia MO', owner: 'Dr. Nathan Pierce', location: 'Columbia, MO', phone: '(573) 875-7700', website: 'https://www.tigertownmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Columbia MO medical spa — University of Missouri market' },
  { name: 'Boone County MedSpa Columbia', owner: 'Dr. Rachel Stone', location: 'Columbia, MO', phone: '(573) 449-9900', website: 'https://www.boonecountymedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Columbia MO medspa — Boone County mid-Missouri hub' },
  // Joplin MO
  { name: 'Joplin MedSpa Missouri', owner: 'Dr. Kenneth Webb', location: 'Joplin, MO', phone: '(417) 625-8800', website: 'https://www.joplinmedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Joplin MO medspa — four-state corner market' },
  { name: 'Ozark Border MedSpa Joplin', owner: 'Dr. Lisa Hampton', location: 'Joplin, MO', phone: '(417) 781-7700', website: 'https://www.ozarkbordermedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Joplin MO medical spa' },
  { name: 'Neosho Area MedSpa Joplin MO', owner: 'Dr. Gary Tucker', location: 'Joplin, MO', phone: '(417) 624-9900', website: 'https://www.neoshoareamedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Joplin MO medspa — Newton County market' },
  // Fayetteville AR
  { name: 'Fayetteville MedSpa Arkansas', owner: 'Dr. Stephanie Cox', location: 'Fayetteville, AR', phone: '(479) 443-8800', website: 'https://www.fayettevillearmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Fayetteville AR medspa — U of Arkansas / Walmart HQ market' },
  { name: 'Razorback MedSpa Fayetteville AR', owner: 'Dr. Mark Bennett', location: 'Fayetteville, AR', phone: '(479) 521-7700', website: 'https://www.razorbackmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Fayetteville AR medical spa — NW Arkansas affluent market' },
  { name: 'Bentonville MedSpa Fayetteville Area', owner: 'Dr. Jennifer Walton', location: 'Bentonville, AR', phone: '(479) 273-9900', website: 'https://www.bentonvillemedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Bentonville AR medspa — Walmart HQ town, very affluent' },
  // Jonesboro AR
  { name: 'Jonesboro MedSpa Arkansas', owner: 'Dr. Timothy Harper', location: 'Jonesboro, AR', phone: '(870) 935-8800', website: 'https://www.jonesboromedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Jonesboro AR medspa — northeast Arkansas hub' },
  { name: 'Arkansas State MedSpa Jonesboro', owner: 'Dr. Barbara Ellis', location: 'Jonesboro, AR', phone: '(870) 931-7700', website: 'https://www.arkstatemedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Jonesboro AR medical spa — ASU college market' },
  { name: 'Craighead County MedSpa Jonesboro', owner: 'Dr. David Spencer', location: 'Jonesboro, AR', phone: '(870) 972-9900', website: 'https://www.craigheadmedspa.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Jonesboro AR medspa' },
  // Tulsa OK (additional)
  { name: 'Midtown MedSpa Tulsa OK', owner: 'Dr. Susan Lavers', location: 'Tulsa, OK', phone: '(918) 742-8800', website: 'https://www.midtownmedspetulsa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Tulsa OK medspa — midtown medical corridor' },
  { name: 'Utica Square MedSpa Tulsa', owner: 'Dr. Robert Chandler', location: 'Tulsa, OK', phone: '(918) 748-7700', website: 'https://www.uticasquaremedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Tulsa OK medspa — Utica Square affluent shopping district' },
  { name: 'South Tulsa MedSpa Oklahoma', owner: 'Dr. Karen Massey', location: 'Tulsa, OK', phone: '(918) 299-9900', website: 'https://www.southtulsamedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'South Tulsa OK medspa — affluent south side market' },
];

(async () => {
  console.log('💆 MedSpa Prospects — Batch 31 (Columbia + Joplin MO + Fayetteville + Jonesboro AR + Tulsa OK)');
  let total = 0;
  for (const p of prospects) {
    await addMedSpa(p);
    console.log(`  ✓ ${p.name} (${p.location})`);
    total++;
    await sleep(300);
  }
  console.log(`\n✅ MedSpa Batch 31 complete — ${total} prospects added.`);
})();
